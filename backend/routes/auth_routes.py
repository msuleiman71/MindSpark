from fastapi import APIRouter, HTTPException, status, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime, timezone, timedelta

from models import User, UserCreate, UserLogin, Token, UserProfile, Settings
from auth import get_password_hash, verify_password, create_access_token, get_current_user_email

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post("/signup", response_model=Token, status_code=status.HTTP_201_CREATED)
async def signup(user_data: UserCreate, db: AsyncIOMotorDatabase = Depends()):
    """
    Register a new user
    """
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user_data.email}, {"_id": 0})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    user = User(
        email=user_data.email,
        name=user_data.name,
        avatar=user_data.avatar
    )
    
    # Hash password
    hashed_password = get_password_hash(user_data.password)
    
    # Store user in database
    user_dict = user.model_dump()
    user_dict['password_hash'] = hashed_password
    user_dict['created_at'] = user_dict['created_at'].isoformat()
    user_dict['last_login'] = user_dict['last_login'].isoformat()
    
    await db.users.insert_one(user_dict)
    
    # Create default user profile
    profile = UserProfile(user_id=user.id)
    profile_dict = profile.model_dump()
    profile_dict['updated_at'] = profile_dict['updated_at'].isoformat()
    await db.user_profiles.insert_one(profile_dict)
    
    # Create access token
    access_token = create_access_token(data={"sub": user.email})
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=user
    )


@router.post("/login", response_model=Token)
async def login(credentials: UserLogin, db: AsyncIOMotorDatabase = Depends()):
    """
    Login with email and password
    """
    # Find user by email
    user_dict = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    
    if not user_dict:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Verify password
    if not verify_password(credentials.password, user_dict['password_hash']):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Update last login
    await db.users.update_one(
        {"email": credentials.email},
        {"$set": {"last_login": datetime.now(timezone.utc).isoformat()}}
    )
    
    # Remove password hash from response
    user_dict.pop('password_hash', None)
    
    # Convert ISO strings back to datetime
    if isinstance(user_dict['created_at'], str):
        user_dict['created_at'] = datetime.fromisoformat(user_dict['created_at'])
    if isinstance(user_dict['last_login'], str):
        user_dict['last_login'] = datetime.fromisoformat(user_dict['last_login'])
    
    user = User(**user_dict)
    
    # Create access token
    access_token = create_access_token(data={"sub": user.email})
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=user
    )


@router.post("/logout")
async def logout(current_user_email: str = Depends(get_current_user_email)):
    """
    Logout (client-side token removal)
    """
    return {"message": "Successfully logged out"}


@router.get("/me", response_model=User)
async def get_current_user(
    current_user_email: str = Depends(get_current_user_email),
    db: AsyncIOMotorDatabase = Depends()
):
    """
    Get current authenticated user
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
