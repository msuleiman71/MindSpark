from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import Optional, Dict, List, Any
from datetime import datetime, timezone
import uuid


class UserBase(BaseModel):
    email: EmailStr
    name: str
    avatar: str = "🧠"


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class User(UserBase):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    coins: int = 100
    hints: int = 5
    lives: int = 3
    premium: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    last_login: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class UserUpdate(BaseModel):
    name: Optional[str] = None
    avatar: Optional[str] = None
    coins: Optional[int] = None
    hints: Optional[int] = None
    lives: Optional[int] = None


class Token(BaseModel):
    access_token: str
    token_type: str
    user: User


class TokenData(BaseModel):
    email: Optional[str] = None


class PuzzleProgress(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    puzzle_id: int
    completed: bool = False
    stars: int = 0
    best_time: Optional[float] = None
    attempts: int = 0
    hints_used: int = 0
    last_attempted: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Settings(BaseModel):
    theme: str = "light"
    selected_theme: str = "classic"
    sound: bool = True
    music: bool = True
    notifications: bool = True


class UserProfile(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    settings: Settings = Field(default_factory=Settings)
    level_progress: Dict[str, Any] = Field(default_factory=dict)
    achievements: List[str] = Field(default_factory=list)
    stats: Dict[str, Any] = Field(default_factory=dict)
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class LeaderboardEntry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    user_id: str
    name: str
    avatar: str
    total_stars: int = 0
    puzzles_completed: int = 0
    total_time: float = 0.0
    rank: int = 0


class ProgressSync(BaseModel):
    level_progress: Dict[str, Any]
    settings: Optional[Settings] = None
    achievements: Optional[List[str]] = None
    stats: Optional[Dict[str, Any]] = None
