from fastapi import APIRouter, HTTPException, status, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List

from models import LeaderboardEntry
from auth import get_current_user_email

router = APIRouter(prefix="/leaderboard", tags=["leaderboard"])


async def get_db():
    from server import db_instance
    return db_instance


@router.get("", response_model=List[LeaderboardEntry])
async def get_leaderboard(
    limit: int = 100,
    current_user_email: str = Depends(get_current_user_email),
    db: AsyncIOMotorDatabase = Depends()
):
    """
    Get global leaderboard
    """
    # Aggregate leaderboard data
    pipeline = [
        {
            "$lookup": {
                "from": "user_profiles",
                "localField": "id",
                "foreignField": "user_id",
                "as": "profile"
            }
        },
        {
            "$unwind": {
                "path": "$profile",
                "preserveNullAndEmptyArrays": True
            }
        },
        {
            "$project": {
                "_id": 0,
                "user_id": "$id",
                "name": 1,
                "avatar": 1,
                "level_progress": "$profile.level_progress"
            }
        }
    ]
    
    users = await db.users.aggregate(pipeline).to_list(None)
    
    # Calculate stats for each user
    leaderboard = []
    for user in users:
        level_progress = user.get('level_progress', {})
        
        total_stars = 0
        puzzles_completed = 0
        total_time = 0.0
        
        for puzzle_id, progress in level_progress.items():
            if progress.get('completed'):
                puzzles_completed += 1
            total_stars += progress.get('stars', 0)
            if progress.get('bestTime'):
                total_time += progress.get('bestTime', 0)
        
        leaderboard.append(
            LeaderboardEntry(
                user_id=user['user_id'],
                name=user['name'],
                avatar=user['avatar'],
                total_stars=total_stars,
                puzzles_completed=puzzles_completed,
                total_time=total_time
            )
        )
    
    # Sort by total stars (descending), then by puzzles completed
    leaderboard.sort(key=lambda x: (x.total_stars, x.puzzles_completed), reverse=True)
    
    # Add ranks
    for idx, entry in enumerate(leaderboard[:limit]):
        entry.rank = idx + 1
    
    return leaderboard[:limit]
