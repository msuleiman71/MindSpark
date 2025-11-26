from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
from enum import Enum
import uuid


class GameStatus(str, Enum):
    WAITING = "waiting"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    ABANDONED = "abandoned"


class PlayerStatus(str, Enum):
    READY = "ready"
    PLAYING = "playing"
    FINISHED = "finished"
    DISCONNECTED = "disconnected"


class GamePlayer(BaseModel):
    user_id: str
    name: str
    avatar: str
    status: PlayerStatus = PlayerStatus.READY
    score: int = 0
    time_taken: float = 0.0
    answers: List[Dict[str, Any]] = Field(default_factory=list)


class GameRoom(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    room_code: str
    puzzle_id: int
    status: GameStatus = GameStatus.WAITING
    players: List[GamePlayer] = Field(default_factory=list)
    max_players: int = 2
    winner_id: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None


class MatchmakingQueue(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    name: str
    avatar: str
    skill_rating: int = 1000
    joined_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class GameMove(BaseModel):
    game_room_id: str
    user_id: str
    move_data: Dict[str, Any]
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class MatchResult(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    game_room_id: str
    winner_id: str
    loser_id: str
    winner_score: int
    loser_score: int
    duration: float
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class CommunityPuzzle(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    creator_id: str
    creator_name: str
    title: str
    description: str
    puzzle_data: Dict[str, Any]
    category: str
    difficulty: str
    rating: float = 0.0
    plays: int = 0
    likes: int = 0
    status: str = "pending"  # pending, approved, rejected
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class PuzzleRating(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    puzzle_id: str
    user_id: str
    rating: int  # 1-5 stars
    review: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
