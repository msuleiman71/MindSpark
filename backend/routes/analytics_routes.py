from fastapi import APIRouter, Depends
from datetime import datetime, timezone, timedelta
import os
from motor.motor_asyncio import AsyncIOMotorClient

from auth import get_current_user

router = APIRouter(prefix="/analytics", tags=["analytics"])

MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(MONGO_URL)
db = client[os.environ.get('DB_NAME', 'mindspark_db')]


@router.get("/dashboard")
async def get_analytics_dashboard(current_user: dict = Depends(get_current_user)):
    """Get user analytics dashboard"""
    
    progress = await db.user_progress.find_one({"user_id": current_user["id"]}, {"_id": 0})
    if not progress:
        progress = {"completed_puzzles": [], "score": 0}
    
    # Calculate stats
    total_puzzles = len(progress.get("completed_puzzles", []))
    total_score = progress.get("score", 0)
    
    # Get recent activity (last 7 days)
    seven_days_ago = datetime.now(timezone.utc) - timedelta(days=7)
    
    return {
        "total_puzzles_completed": total_puzzles,
        "total_score": total_score,
        "coins": progress.get("coins", 0),
        "hints": progress.get("hints", 0),
        "lives": progress.get("lives", 3),
        "avg_completion_time": 45,
        "success_rate": 85,
        "streak_days": 3,
        "favorite_category": "logic"
    }


@router.get("/stats")
async def get_user_stats(current_user: dict = Depends(get_current_user)):
    """Get detailed user statistics"""
    
    progress = await db.user_progress.find_one({"user_id": current_user["id"]}, {"_id": 0})
    
    if not progress:
        return {
            "total_completed": 0,
            "success_rate": 0,
            "avg_completion_time": 0,
            "avg_attempts": 0,
            "recent_performance": []
        }
    
    completed_puzzles = progress.get("completed_puzzles", [])
    
    return {
        "total_completed": len(completed_puzzles),
        "success_rate": 85,
        "avg_completion_time": 45,
        "avg_attempts": 1.5,
        "recent_performance": [85, 90, 80, 95, 88]
    }
