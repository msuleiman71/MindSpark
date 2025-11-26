import socketio
from fastapi import FastAPI
from typing import Dict, List, Optional
import asyncio
from datetime import datetime, timezone
import random
import string

from models_multiplayer import GameRoom, GamePlayer, PlayerStatus, GameStatus, MatchmakingQueue


# Create Socket.IO server
sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins='*',
    logger=True,
    engineio_logger=True
)

# In-memory storage for active games and matchmaking
active_rooms: Dict[str, GameRoom] = {}
matchmaking_queue: List[MatchmakingQueue] = []
user_sessions: Dict[str, str] = {}  # user_id -> session_id


def generate_room_code() -> str:
    """Generate a unique 6-character room code"""
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))


async def find_match(user_entry: MatchmakingQueue) -> Optional[GameRoom]:
    """Find a suitable opponent for the user"""
    for opponent in matchmaking_queue:
        if opponent.user_id != user_entry.user_id:
            # Found a match! Create game room
            matchmaking_queue.remove(opponent)
            
            room_code = generate_room_code()
            puzzle_id = random.randint(1, 50)  # Random puzzle
            
            game_room = GameRoom(
                room_code=room_code,
                puzzle_id=puzzle_id,
                players=[
                    GamePlayer(
                        user_id=user_entry.user_id,
                        name=user_entry.name,
                        avatar=user_entry.avatar
                    ),
                    GamePlayer(
                        user_id=opponent.user_id,
                        name=opponent.name,
                        avatar=opponent.avatar
                    )
                ]
            )
            
            active_rooms[game_room.id] = game_room
            return game_room
    
    return None


@sio.event
async def connect(sid, environ):
    """Handle client connection"""
    print(f"Client connected: {sid}")
    await sio.emit('connected', {'message': 'Connected to multiplayer server'}, room=sid)


@sio.event
async def disconnect(sid):
    """Handle client disconnection"""
    print(f"Client disconnected: {sid}")
    
    # Remove from matchmaking queue
    user_id = None
    for user, session in user_sessions.items():
        if session == sid:
            user_id = user
            break
    
    if user_id:
        matchmaking_queue[:] = [q for q in matchmaking_queue if q.user_id != user_id]
        user_sessions.pop(user_id, None)
        
        # Update game rooms
        for room in active_rooms.values():
            for player in room.players:
                if player.user_id == user_id:
                    player.status = PlayerStatus.DISCONNECTED
                    await sio.emit('player_disconnected', {
                        'room_id': room.id,
                        'user_id': user_id
                    }, room=f"room_{room.id}")


@sio.event
async def join_matchmaking(sid, data):
    """Join the matchmaking queue"""
    user_id = data.get('user_id')
    name = data.get('name')
    avatar = data.get('avatar', '🧠')
    
    user_sessions[user_id] = sid
    
    # Check if already in queue
    existing = next((q for q in matchmaking_queue if q.user_id == user_id), None)
    if existing:
        await sio.emit('matchmaking_joined', {'message': 'Already in queue'}, room=sid)
        return
    
    # Add to queue
    queue_entry = MatchmakingQueue(
        user_id=user_id,
        name=name,
        avatar=avatar
    )
    matchmaking_queue.append(queue_entry)
    
    await sio.emit('matchmaking_joined', {
        'message': 'Joined matchmaking queue',
        'queue_position': len(matchmaking_queue)
    }, room=sid)
    
    # Try to find a match
    match = await find_match(queue_entry)
    if match:
        # Remove from queue
        matchmaking_queue[:] = [q for q in matchmaking_queue if q.user_id != user_id]
        
        # Notify both players
        for player in match.players:
            player_sid = user_sessions.get(player.user_id)
            if player_sid:
                await sio.enter_room(player_sid, f"room_{match.id}")
                await sio.emit('match_found', {
                    'room_id': match.id,
                    'room_code': match.room_code,
                    'puzzle_id': match.puzzle_id,
                    'opponent': {
                        'name': next(p.name for p in match.players if p.user_id != player.user_id),
                        'avatar': next(p.avatar for p in match.players if p.user_id != player.user_id)
                    }
                }, room=player_sid)


@sio.event
async def leave_matchmaking(sid, data):
    """Leave the matchmaking queue"""
    user_id = data.get('user_id')
    matchmaking_queue[:] = [q for q in matchmaking_queue if q.user_id != user_id]
    
    await sio.emit('matchmaking_left', {'message': 'Left matchmaking queue'}, room=sid)


@sio.event
async def player_ready(sid, data):
    """Mark player as ready in a game room"""
    room_id = data.get('room_id')
    user_id = data.get('user_id')
    
    room = active_rooms.get(room_id)
    if not room:
        await sio.emit('error', {'message': 'Room not found'}, room=sid)
        return
    
    # Update player status
    for player in room.players:
        if player.user_id == user_id:
            player.status = PlayerStatus.READY
    
    # Check if all players ready
    all_ready = all(p.status == PlayerStatus.READY for p in room.players)
    
    if all_ready:
        room.status = GameStatus.IN_PROGRESS
        room.started_at = datetime.now(timezone.utc)
        
        # Start game
        await sio.emit('game_start', {
            'room_id': room.id,
            'puzzle_id': room.puzzle_id,
            'players': [
                {'user_id': p.user_id, 'name': p.name, 'avatar': p.avatar}
                for p in room.players
            ]
        }, room=f"room_{room.id}")


@sio.event
async def game_move(sid, data):
    """Handle player move in game"""
    room_id = data.get('room_id')
    user_id = data.get('user_id')
    move_data = data.get('move_data')
    
    room = active_rooms.get(room_id)
    if not room:
        return
    
    # Broadcast move to other players
    await sio.emit('opponent_move', {
        'user_id': user_id,
        'move_data': move_data
    }, room=f"room_{room.id}", skip_sid=sid)


@sio.event
async def game_complete(sid, data):
    """Handle game completion"""
    room_id = data.get('room_id')
    user_id = data.get('user_id')
    score = data.get('score', 0)
    time_taken = data.get('time_taken', 0.0)
    
    room = active_rooms.get(room_id)
    if not room:
        return
    
    # Update player status
    for player in room.players:
        if player.user_id == user_id:
            player.status = PlayerStatus.FINISHED
            player.score = score
            player.time_taken = time_taken
    
    # Check if all players finished
    all_finished = all(p.status == PlayerStatus.FINISHED for p in room.players)
    
    if all_finished:
        room.status = GameStatus.COMPLETED
        room.completed_at = datetime.now(timezone.utc)
        
        # Determine winner
        winner = max(room.players, key=lambda p: (p.score, -p.time_taken))
        room.winner_id = winner.user_id
        
        # Broadcast results
        await sio.emit('game_results', {
            'room_id': room.id,
            'winner_id': winner.user_id,
            'winner_name': winner.name,
            'players': [
                {
                    'user_id': p.user_id,
                    'name': p.name,
                    'score': p.score,
                    'time_taken': p.time_taken
                }
                for p in room.players
            ]
        }, room=f"room_{room.id}")
        
        # Clean up room after 30 seconds
        await asyncio.sleep(30)
        active_rooms.pop(room_id, None)


@sio.event
async def get_active_players(sid, data):
    """Get count of active players"""
    active_count = len(user_sessions) + len(matchmaking_queue)
    await sio.emit('active_players_count', {'count': active_count}, room=sid)


# Create ASGI app
socket_app = socketio.ASGIApp(
    sio,
    socketio_path='socket.io'
)
