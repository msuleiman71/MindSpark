from fastapi import APIRouter, HTTPException, status, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime, timezone

from models import User, UserUpdate
from auth import get_current_user_email

router = APIRouter(prefix="/user", tags=["user"])


async def get_db():
    from server import db_instance
    return db_instance


@router.get("/profile", response_model=User)
async def get_user_profile(
    current_user_email: str = Depends(get_current_user_email),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Get user profile
    """
    user_dict = await db.users.find_one({"email": current_user_email}, {"_id": 0, "password_hash": 0})
    
    if not user_dict:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Convert ISO strings back to datetime
    if isinstance(user_dict['created_at'], str):
        user_dict['created_at'] = datetime.fromisoformat(user_dict['created_at'])
    if isinstance(user_dict['last_login'], str):
        user_dict['last_login'] = datetime.fromisoformat(user_dict['last_login'])
    
    return User(**user_dict)


@router.put("/profile", response_model=User)
async def update_user_profile(
    updates: UserUpdate,
    current_user_email: str = Depends(get_current_user_email),
    db: AsyncIOMotorDatabase = Depends()
):
    """
    Update user profile
    """
    # Get current user
    user_dict = await db.users.find_one({"email": current_user_email}, {"_id": 0, "password_hash": 0})
    
    if not user_dict:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Prepare update data
    update_data = {k: v for k, v in updates.model_dump().items() if v is not None}
    
    if update_data:
        # Update user in database
        await db.users.update_one(
            {"email": current_user_email},
            {"$set": update_data}
        )
        
        # Get updated user
        user_dict = await db.users.find_one({"email": current_user_email}, {"_id": 0, "password_hash": 0})
    
    # Convert ISO strings back to datetime
    if isinstance(user_dict['created_at'], str):
        user_dict['created_at'] = datetime.fromisoformat(user_dict['created_at'])
    if isinstance(user_dict['last_login'], str):
        user_dict['last_login'] = datetime.fromisoformat(user_dict['last_login'])
    
    return User(**user_dict)
