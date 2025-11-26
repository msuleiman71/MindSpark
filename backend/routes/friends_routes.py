from fastapi import APIRouter, HTTPException, Depends
from typing import List
from datetime import datetime, timezone
import os
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel

from auth import get_current_user

router = APIRouter(prefix="/friends", tags=["friends"])

# MongoDB connection
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(MONGO_URL)
db = client[os.environ.get('DB_NAME', 'mindspark_db')]


class FriendRequest(BaseModel):
    friend_email: str


class Challenge(BaseModel):
    friend_id: str
    puzzle_id: int


@router.get("/search")
async def search_users(
    query: str,
    current_user: dict = Depends(get_current_user)
):
    """Search for users by name or email"""
    
    if len(query) < 2:
        return {"users": []}
    
    # Search by name or email
    cursor = db.users.find({
        "$or": [
            {"name": {"$regex": query, "$options": "i"}},
            {"email": {"$regex": query, "$options": "i"}}
        ],
        "id": {"$ne": current_user["id"]}
    }, {"_id": 0, "id": 1, "name": 1, "email": 1, "avatar": 1}).limit(20)
    
    users = await cursor.to_list(length=20)
    
    return {"users": users}


@router.post("/request")
async def send_friend_request(
    request: FriendRequest,
    current_user: dict = Depends(get_current_user)
):
    """Send a friend request"""
    
    # Check if friend exists
    friend = await db.users.find_one({"email": request.friend_email}, {"_id": 0})
    
    if not friend:
        raise HTTPException(status_code=404, detail="User not found")
    
    if friend["id"] == current_user["id"]:
        raise HTTPException(status_code=400, detail="Cannot add yourself as friend")
    
    # Check if already friends or request exists
    existing = await db.friends.find_one({
        "$or": [
            {"user_id": current_user["id"], "friend_id": friend["id"]},
            {"user_id": friend["id"], "friend_id": current_user["id"]}
        ]
    })
    
    if existing:
        if existing.get("status") == "accepted":
            raise HTTPException(status_code=400, detail="Already friends")
        else:
            raise HTTPException(status_code=400, detail="Friend request already sent")
    
    # Create friend request
    friend_request = {
        "user_id": current_user["id"],
        "friend_id": friend["id"],
        "status": "pending",
        "created_at": datetime.now(timezone.utc)
    }
    
    await db.friends.insert_one(friend_request)
    
    return {"message": "Friend request sent", "friend": friend}


@router.get("/requests")
async def get_friend_requests(current_user: dict = Depends(get_current_user)):
    """Get pending friend requests"""
    
    cursor = db.friends.find({
        "friend_id": current_user["id"],
        "status": "pending"
    }, {"_id": 0})
    
    requests = await cursor.to_list(length=100)
    
    # Get user details for each request
    for req in requests:
        user = await db.users.find_one({"id": req["user_id"]}, {"_id": 0, "id": 1, "name": 1, "email": 1, "avatar": 1})
        req["user"] = user
    
    return {"requests": requests}


@router.post("/accept/{user_id}")
async def accept_friend_request(
    user_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Accept a friend request"""
    
    # Find the request
    friend_request = await db.friends.find_one({
        "user_id": user_id,
        "friend_id": current_user["id"],
        "status": "pending"
    })
    
    if not friend_request:
        raise HTTPException(status_code=404, detail="Friend request not found")
    
    # Update status
    await db.friends.update_one(
        {"user_id": user_id, "friend_id": current_user["id"]},
        {"$set": {"status": "accepted", "accepted_at": datetime.now(timezone.utc)}}
    )
    
    return {"message": "Friend request accepted"}


@router.post("/reject/{user_id}")
async def reject_friend_request(
    user_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Reject a friend request"""
    
    result = await db.friends.delete_one({
        "user_id": user_id,
        "friend_id": current_user["id"],
        "status": "pending"
    })
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Friend request not found")
    
    return {"message": "Friend request rejected"}


@router.get("/list")
async def get_friends(current_user: dict = Depends(get_current_user)):
    """Get list of friends"""
    
    cursor = db.friends.find({
        "$or": [
            {"user_id": current_user["id"], "status": "accepted"},
            {"friend_id": current_user["id"], "status": "accepted"}
        ]
    }, {"_id": 0})
    
    friendships = await cursor.to_list(length=1000)
    
    # Get friend details
    friends = []
    for friendship in friendships:
        friend_id = friendship["friend_id"] if friendship["user_id"] == current_user["id"] else friendship["user_id"]
        friend = await db.users.find_one({"id": friend_id}, {"_id": 0, "id": 1, "name": 1, "email": 1, "avatar": 1})
        if friend:
            friends.append(friend)
    
    return {"friends": friends}


@router.delete("/{friend_id}")
async def remove_friend(
    friend_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Remove a friend"""
    
    result = await db.friends.delete_one({
        "$or": [
            {"user_id": current_user["id"], "friend_id": friend_id},
            {"user_id": friend_id, "friend_id": current_user["id"]}
        ],
        "status": "accepted"
    })
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Friend not found")
    
    return {"message": "Friend removed"}


@router.post("/challenge")
async def challenge_friend(
    challenge: Challenge,
    current_user: dict = Depends(get_current_user)
):
    """Challenge a friend to solve a specific puzzle"""
    
    # Check if friend exists
    friend = await db.users.find_one({"id": challenge.friend_id}, {"_id": 0})
    
    if not friend:
        raise HTTPException(status_code=404, detail="Friend not found")
    
    # Check if they are friends
    friendship = await db.friends.find_one({
        "$or": [
            {"user_id": current_user["id"], "friend_id": challenge.friend_id},
            {"user_id": challenge.friend_id, "friend_id": current_user["id"]}
        ],
        "status": "accepted"
    })
    
    if not friendship:
        raise HTTPException(status_code=403, detail="Not friends with this user")
    
    # Create challenge
    challenge_data = {
        "challenger_id": current_user["id"],
        "challenged_id": challenge.friend_id,
        "puzzle_id": challenge.puzzle_id,
        "status": "pending",
        "created_at": datetime.now(timezone.utc)
    }
    
    await db.challenges.insert_one(challenge_data)
    
    return {"message": f"Challenge sent to {friend['name']}"}


@router.get("/challenges")
async def get_challenges(current_user: dict = Depends(get_current_user)):
    """Get challenges sent to current user"""
    
    cursor = db.challenges.find({
        "challenged_id": current_user["id"],
        "status": "pending"
    }, {"_id": 0})
    
    challenges = await cursor.to_list(length=100)
    
    # Get challenger details
    for challenge in challenges:
        challenger = await db.users.find_one({"id": challenge["challenger_id"]}, {"_id": 0, "id": 1, "name": 1, "avatar": 1})
        challenge["challenger"] = challenger
    
    return {"challenges": challenges}
