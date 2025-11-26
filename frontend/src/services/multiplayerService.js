import io from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_BACKEND_URL.replace('/api', '/ws');

class MultiplayerService {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  connect(userId, name, avatar) {
    if (this.socket && this.connected) {
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('Connected to multiplayer server');
      this.connected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from multiplayer server');
      this.connected = false;
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  joinMatchmaking(userId, name, avatar) {
    if (!this.socket) return;
    this.socket.emit('join_matchmaking', { user_id: userId, name, avatar });
  }

  leaveMatchmaking(userId) {
    if (!this.socket) return;
    this.socket.emit('leave_matchmaking', { user_id: userId });
  }

  playerReady(roomId, userId) {
    if (!this.socket) return;
    this.socket.emit('player_ready', { room_id: roomId, user_id: userId });
  }

  sendMove(roomId, userId, moveData) {
    if (!this.socket) return;
    this.socket.emit('game_move', { room_id: roomId, user_id: userId, move_data: moveData });
  }

  gameComplete(roomId, userId, score, timeTaken) {
    if (!this.socket) return;
    this.socket.emit('game_complete', {
      room_id: roomId,
      user_id: userId,
      score,
      time_taken: timeTaken
    });
  }

  getActivePlayers() {
    if (!this.socket) return;
    this.socket.emit('get_active_players', {});
  }

  on(event, callback) {
    if (!this.socket) return;
    this.socket.on(event, callback);
  }

  off(event, callback) {
    if (!this.socket) return;
    this.socket.off(event, callback);
  }
}

export default new MultiplayerService();
