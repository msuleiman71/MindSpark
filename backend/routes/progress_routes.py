from fastapi import APIRouter, HTTPException, status, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime, timezone
from typing import Dict, Any

from models import UserProfile, ProgressSync, PuzzleProgress
from auth import get_current_user_email

router = APIRouter(prefix="/progress", tags=["progress"])


async def get_db():
    from server import db_instance
    return db_instance


@router.post("/sync")
async def sync_progress(
    sync_data: ProgressSync,
    current_user_email: str = Depends(get_current_user_email),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Sync user progress to cloud
    """
    # Get user
    user = await db.users.find_one({"email": current_user_email}, {"_id": 0})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user_id = user['id']
    
    # Get or create user profile
    profile = await db.user_profiles.find_one({"user_id": user_id}, {"_id": 0})
    
    update_data = {
        "level_progress": sync_data.level_progress,
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    if sync_data.settings:
        update_data["settings"] = sync_data.settings.model_dump()
    
    if sync_data.achievements:
        update_data["achievements"] = sync_data.achievements
    
    if sync_data.stats:
        update_data["stats"] = sync_data.stats
    
    if profile:
        # Update existing profile
        await db.user_profiles.update_one(
            {"user_id": user_id},
            {"$set": update_data}
        )
    else:
        # Create new profile
        profile_data = UserProfile(user_id=user_id, **update_data)
        profile_dict = profile_data.model_dump()
        profile_dict['updated_at'] = profile_dict['updated_at'].isoformat()
        await db.user_profiles.insert_one(profile_dict)
    
    # Store individual puzzle progress
    for puzzle_id, progress in sync_data.level_progress.items():
        puzzle_progress = PuzzleProgress(
            user_id=user_id,
            puzzle_id=int(puzzle_id),
            completed=progress.get('completed', False),
            stars=progress.get('stars', 0),
            best_time=progress.get('bestTime'),
            attempts=progress.get('attempts', 0),
            hints_used=progress.get('hintsUsed', 0)
        )
        
        # Upsert puzzle progress
        await db.puzzle_progress.update_one(
            {"user_id": user_id, "puzzle_id": int(puzzle_id)},
            {"$set": puzzle_progress.model_dump()},
            upsert=True
        )
    
    return {"message": "Progress synced successfully", "synced_at": datetime.now(timezone.utc).isoformat()}


@router.get("/load")
async def load_progress(
    current_user_email: str = Depends(get_current_user_email),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> Dict[str, Any]:
    """
    Load user progress from cloud
    """
    # Get user
    user = await db.users.find_one({"email": current_user_email}, {"_id": 0})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user_id = user['id']
    
    # Get user profile
    profile = await db.user_profiles.find_one({"user_id": user_id}, {"_id": 0})
    
    if not profile:
        # Return empty progress
        return {
            "level_progress": {},
            "settings": {},
            "achievements": [],
            "stats": {},
            "user": {
                "coins": user.get('coins', 100),
                "hints": user.get('hints', 5),
                "lives": user.get('lives', 3)
            }
        }
    
    return {
        "level_progress": profile.get('level_progress', {}),
        "settings": profile.get('settings', {}),
        "achievements": profile.get('achievements', []),
        "stats": profile.get('stats', {}),
        "user": {
            "coins": user.get('coins', 100),
            "hints": user.get('hints', 5),
            "lives": user.get('lives', 3)
        }
    }


@router.post("/complete")
async def complete_level(
    level_data: dict,
    current_user_email: str = Depends(get_current_user_email),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Mark a level as completed
    """
    # Get user
    user = await db.users.find_one({"email": current_user_email}, {"_id": 0})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user_id = user['id']
    level_id = level_data.get('level_id')
    stars = level_data.get('stars', 1)
    time_taken = level_data.get('time_taken', 0)
    
    if not level_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="level_id is required"
        )
    
    # Update user profile with level completion
    profile = await db.user_profiles.find_one({"user_id": user_id}, {"_id": 0})
    
    if not profile:
        # Create new profile
        profile_data = UserProfile(user_id=user_id)
        profile_dict = profile_data.model_dump()
        profile_dict['updated_at'] = profile_dict['updated_at'].isoformat()
        await db.user_profiles.insert_one(profile_dict)
        profile = profile_dict
    
    # Update level progress
    level_progress = profile.get('level_progress', {})
    level_progress[str(level_id)] = {
        'completed': True,
        'stars': stars,
        'bestTime': time_taken,
        'attempts': level_progress.get(str(level_id), {}).get('attempts', 0) + 1,
        'hintsUsed': level_data.get('hints_used', 0)
    }
    
    # Update profile
    await db.user_profiles.update_one(
        {"user_id": user_id},
        {"$set": {
            "level_progress": level_progress,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }}
    )
    
    # Store individual puzzle progress
    puzzle_progress = PuzzleProgress(
        user_id=user_id,
        puzzle_id=int(level_id),
        completed=True,
        stars=stars,
        best_time=time_taken,
        attempts=level_progress[str(level_id)]['attempts'],
        hints_used=level_data.get('hints_used', 0)
    )
    
    # Upsert puzzle progress
    await db.puzzle_progress.update_one(
        {"user_id": user_id, "puzzle_id": int(level_id)},
        {"$set": puzzle_progress.model_dump()},
        upsert=True
    )
    
    return {
        "message": "Level completed successfully",
        "level_id": level_id,
        "stars": stars,
        "completed_at": datetime.now(timezone.utc).isoformat()
    }
