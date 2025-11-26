from fastapi import APIRouter, HTTPException, Depends
from typing import List
from datetime import datetime, timezone
import os
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel

from auth import get_current_user

router = APIRouter(prefix="/shop", tags=["shop"])

# MongoDB connection
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(MONGO_URL)
db = client[os.environ.get('DB_NAME', 'mindspark_db')]


class PurchaseRequest(BaseModel):
    item_id: str


@router.get("/items")
async def get_shop_items():
    """Get all available shop items"""
    
    items = [
        {"id": "coins_100", "name": "100 Coins", "price": 99, "type": "coins", "amount": 100, "icon": "💰"},
        {"id": "coins_500", "name": "500 Coins", "price": 399, "type": "coins", "amount": 500, "icon": "💰", "badge": "Popular"},
        {"id": "hints_10", "name": "10 Hints", "price": 199, "type": "hints", "amount": 10, "icon": "💡"},
        {"id": "lives_10", "name": "10 Lives", "price": 149, "type": "lives", "amount": 10, "icon": "❤️"}
    ]
    
    return {"items": items}


@router.post("/purchase")
async def purchase_item(request: PurchaseRequest, current_user: dict = Depends(get_current_user)):
    """Purchase an item"""
    items_response = await get_shop_items()
    item = next((i for i in items_response["items"] if i["id"] == request.item_id), None)
    
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    progress = await db.user_progress.find_one({"user_id": current_user["id"]}, {"_id": 0})
    if not progress:
        progress = {"coins": 0, "hints": 0, "lives": 3}
    
    update_data = {}
    if item["type"] == "coins":
        update_data["coins"] = progress.get("coins", 0) + item["amount"]
    elif item["type"] == "hints":
        update_data["hints"] = progress.get("hints", 0) + item["amount"]
    elif item["type"] == "lives":
        update_data["lives"] = progress.get("lives", 3) + item["amount"]
    
    await db.user_progress.update_one({"user_id": current_user["id"]}, {"$set": update_data}, upsert=True)
    
    return {"message": "Purchase successful!", "item": item}


@router.get("/subscriptions")
async def get_subscriptions():
    """Get available subscription plans"""
    
    subscriptions = [
        {
            "id": "premium_monthly",
            "name": "Premium Monthly",
            "price": 999,
            "duration": "1 month",
            "features": ["Unlimited hints", "No ads", "Premium puzzles", "Priority support"],
            "icon": "👑",
            "badge": "Popular"
        },
        {
            "id": "premium_yearly",
            "name": "Premium Yearly",
            "price": 9999,
            "duration": "1 year",
            "features": ["Unlimited hints", "No ads", "Premium puzzles", "Priority support", "2 months free"],
            "icon": "💎",
            "badge": "Best Value"
        }
    ]
    
    return {"subscriptions": subscriptions}
