from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
from datetime import datetime, timezone
import os
from motor.motor_asyncio import AsyncIOMotorClient

from models_multiplayer import CommunityPuzzle, PuzzleRating
from auth import get_current_user

router = APIRouter(prefix="/community", tags=["community"])

# MongoDB connection
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(MONGO_URL)
db = client.mindspark


@router.post("/puzzles", status_code=201)
async def create_puzzle(puzzle_data: dict, current_user: dict = Depends(get_current_user)):
    """Create a new community puzzle"""
    
    # Validate required fields
    required_fields = ["title", "question", "type", "correctAnswer"]
    for field in required_fields:
        if field not in puzzle_data:
            raise HTTPException(status_code=400, detail=f"Missing required field: {field}")
    
    # Create community puzzle
    community_puzzle = CommunityPuzzle(
        creator_id=current_user["id"],
        creator_name=current_user.get("name", "Anonymous"),
        title=puzzle_data["title"],
        description=puzzle_data.get("description", ""),
        puzzle_data=puzzle_data,
        category=puzzle_data.get("category", "general"),
        difficulty=puzzle_data.get("difficulty", "medium"),
        status="approved"  # Auto-approve for now
    )
    
    # Save to database
    puzzle_dict = community_puzzle.model_dump()
    result = await db.community_puzzles.insert_one(puzzle_dict)
    puzzle_dict["_id"] = str(result.inserted_id)
    
    return {"message": "Puzzle created successfully", "puzzle_id": community_puzzle.id, "puzzle": puzzle_dict}


@router.get("/puzzles")
async def get_community_puzzles(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    category: Optional[str] = None,
    difficulty: Optional[str] = None,
    sort_by: str = Query("newest", regex="^(newest|popular|rating|plays)$"),
    search: Optional[str] = None
):
    """Get community puzzles with filters"""
    
    # Build query
    query = {"status": "approved"}
    
    if category:
        query["category"] = category
    
    if difficulty:
        query["difficulty"] = difficulty
    
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}}
        ]
    
    # Build sort
    sort_mapping = {
        "newest": ("created_at", -1),
        "popular": ("plays", -1),
        "rating": ("rating", -1),
        "plays": ("plays", -1)
    }
    sort_field, sort_order = sort_mapping.get(sort_by, ("created_at", -1))
    
    # Get puzzles
    cursor = db.community_puzzles.find(query, {"_id": 0}).sort(sort_field, sort_order).skip(skip).limit(limit)
    puzzles = await cursor.to_list(length=limit)
    
    # Get total count
    total = await db.community_puzzles.count_documents(query)
    
    return {
        "puzzles": puzzles,
        "total": total,
        "skip": skip,
        "limit": limit
    }


@router.get("/puzzles/{puzzle_id}")
async def get_puzzle(puzzle_id: str):
    """Get a specific community puzzle"""
    
    puzzle = await db.community_puzzles.find_one({"id": puzzle_id}, {"_id": 0})
    
    if not puzzle:
        raise HTTPException(status_code=404, detail="Puzzle not found")
    
    # Increment play count
    await db.community_puzzles.update_one(
        {"id": puzzle_id},
        {"$inc": {"plays": 1}}
    )
    
    return puzzle


@router.post("/puzzles/{puzzle_id}/rate")
async def rate_puzzle(
    puzzle_id: str,
    rating_data: dict,
    current_user: dict = Depends(get_current_user)
):
    """Rate a community puzzle"""
    
    rating_value = rating_data.get("rating")
    review = rating_data.get("review")
    
    if not rating_value or rating_value < 1 or rating_value > 5:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")
    
    # Check if puzzle exists
    puzzle = await db.community_puzzles.find_one({"id": puzzle_id})
    if not puzzle:
        raise HTTPException(status_code=404, detail="Puzzle not found")
    
    # Check if user already rated
    existing_rating = await db.puzzle_ratings.find_one({
        "puzzle_id": puzzle_id,
        "user_id": current_user["id"]
    })
    
    if existing_rating:
        # Update existing rating
        await db.puzzle_ratings.update_one(
            {"puzzle_id": puzzle_id, "user_id": current_user["id"]},
            {"$set": {"rating": rating_value, "review": review}}
        )
    else:
        # Create new rating
        puzzle_rating = PuzzleRating(
            puzzle_id=puzzle_id,
            user_id=current_user["id"],
            rating=rating_value,
            review=review
        )
        await db.puzzle_ratings.insert_one(puzzle_rating.model_dump())
    
    # Calculate average rating
    ratings_cursor = db.puzzle_ratings.find({"puzzle_id": puzzle_id})
    ratings = await ratings_cursor.to_list(length=1000)
    
    if ratings:
        avg_rating = sum(r["rating"] for r in ratings) / len(ratings)
        await db.community_puzzles.update_one(
            {"id": puzzle_id},
            {"$set": {"rating": round(avg_rating, 2)}}
        )
    
    return {"message": "Rating submitted successfully"}


@router.post("/puzzles/{puzzle_id}/like")
async def like_puzzle(puzzle_id: str, current_user: dict = Depends(get_current_user)):
    """Like a community puzzle"""
    
    # Check if already liked
    existing_like = await db.puzzle_likes.find_one({
        "puzzle_id": puzzle_id,
        "user_id": current_user["id"]
    })
    
    if existing_like:
        # Unlike
        await db.puzzle_likes.delete_one({
            "puzzle_id": puzzle_id,
            "user_id": current_user["id"]
        })
        await db.community_puzzles.update_one(
            {"id": puzzle_id},
            {"$inc": {"likes": -1}}
        )
        return {"message": "Puzzle unliked", "liked": False}
    else:
        # Like
        await db.puzzle_likes.insert_one({
            "puzzle_id": puzzle_id,
            "user_id": current_user["id"],
            "created_at": datetime.now(timezone.utc)
        })
        await db.community_puzzles.update_one(
            {"id": puzzle_id},
            {"$inc": {"likes": 1}}
        )
        return {"message": "Puzzle liked", "liked": True}


@router.get("/puzzles/{puzzle_id}/user-rating")
async def get_user_rating(puzzle_id: str, current_user: dict = Depends(get_current_user)):
    """Get user's rating for a puzzle"""
    
    rating = await db.puzzle_ratings.find_one({
        "puzzle_id": puzzle_id,
        "user_id": current_user["id"]
    }, {"_id": 0})
    
    return rating if rating else None


@router.get("/my-puzzles")
async def get_my_puzzles(current_user: dict = Depends(get_current_user)):
    """Get puzzles created by current user"""
    
    cursor = db.community_puzzles.find({"creator_id": current_user["id"]}, {"_id": 0}).sort("created_at", -1)
    puzzles = await cursor.to_list(length=100)
    
    return {"puzzles": puzzles}


@router.delete("/puzzles/{puzzle_id}")
async def delete_puzzle(puzzle_id: str, current_user: dict = Depends(get_current_user)):
    """Delete a community puzzle (creator only)"""
    
    puzzle = await db.community_puzzles.find_one({"id": puzzle_id})
    
    if not puzzle:
        raise HTTPException(status_code=404, detail="Puzzle not found")
    
    if puzzle["creator_id"] != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized to delete this puzzle")
    
    await db.community_puzzles.delete_one({"id": puzzle_id})
    await db.puzzle_ratings.delete_many({"puzzle_id": puzzle_id})
    await db.puzzle_likes.delete_many({"puzzle_id": puzzle_id})
    
    return {"message": "Puzzle deleted successfully"}
