from fastapi import FastAPI, APIRouter, Depends
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List
import uuid
from datetime import datetime, timezone

# Import routes
from routes import auth_routes, user_routes, progress_routes, leaderboard_routes

# Import WebSocket
from websocket_server import socket_app, sio


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db_instance = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="MindSpark API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Database dependency
async def get_db() -> AsyncIOMotorDatabase:
    return db_instance


# Define Models (keeping old status check for backward compatibility)
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {
        "message": "MindSpark API v1.0.0",
        "status": "running",
        "endpoints": {
            "auth": "/api/auth/*",
            "user": "/api/user/*",
            "progress": "/api/progress/*",
            "leaderboard": "/api/leaderboard"
        }
    }

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "database": "connected"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate, db: AsyncIOMotorDatabase = Depends(get_db)):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks(db: AsyncIOMotorDatabase = Depends(get_db)):
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks


# Override dependencies in route files
def override_get_db():
    return get_db


# Include all routers with database dependency
auth_router_with_db = APIRouter()
auth_router_with_db.include_router(auth_routes.router)
api_router.include_router(auth_router_with_db, dependencies=[Depends(get_db)])

user_router_with_db = APIRouter()
user_router_with_db.include_router(user_routes.router)
api_router.include_router(user_router_with_db, dependencies=[Depends(get_db)])

progress_router_with_db = APIRouter()
progress_router_with_db.include_router(progress_routes.router)
api_router.include_router(progress_router_with_db, dependencies=[Depends(get_db)])

leaderboard_router_with_db = APIRouter()
leaderboard_router_with_db.include_router(leaderboard_routes.router)
api_router.include_router(leaderboard_router_with_db, dependencies=[Depends(get_db)])

# Add CORS middleware BEFORE including routers
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"] if os.environ.get('CORS_ORIGINS', '*') == '*' else os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the main router in the app
app.include_router(api_router)

# Mount WebSocket app
app.mount("/ws", socket_app)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()