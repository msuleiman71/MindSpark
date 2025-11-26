from fastapi import APIRouter, HTTPException, status, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from pydantic import BaseModel
from typing import List, Optional
import os
import json
from emergentintegrations.llm.chat import LlmChat, UserMessage

from auth import get_current_user_email, get_current_user

router = APIRouter(prefix="/ai", tags=["ai"])

def get_llm_key():
    api_key = os.environ.get("EMERGENT_LLM_KEY")
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="LLM API key not configured"
        )
    return api_key


class PuzzleGenerationRequest(BaseModel):
    category: str
    difficulty: str
    count: int = 1


class GeneratedPuzzle(BaseModel):
    question: str
    answer: str
    hint: str
    explanation: str
    category: str
    difficulty: str


class AdaptiveDifficultyRequest(BaseModel):
    user_stats: dict


class AdaptiveDifficultyResponse(BaseModel):
    recommended_difficulty: str
    explanation: str
    confidence: float


async def get_db():
    from server import db_instance
    return db_instance


@router.post("/generate-puzzles", response_model=List[GeneratedPuzzle])
async def generate_puzzles(
    request: PuzzleGenerationRequest,
    current_user_email: str = Depends(get_current_user_email),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Generate puzzles using AI (GPT-5)
    """
    try:
        api_key = get_llm_key()
        
        # Create prompt based on category and difficulty
        prompt = f"""Generate {request.count} unique {request.difficulty} {request.category} puzzle(s).

Category: {request.category}
Difficulty: {request.difficulty}

For each puzzle, provide:
1. An engaging question
2. The correct answer
3. A helpful hint
4. A clear explanation of the solution

Format your response as a JSON array with this structure:
[
  {{
    "question": "the puzzle question",
    "answer": "the correct answer",
    "hint": "a helpful hint",
    "explanation": "explanation of the solution"
  }}
]

Make the puzzles creative, engaging, and appropriate for the difficulty level.
For {request.category} puzzles, ensure they match the category theme.
Keep questions concise and answers short (1-3 words)."""

        # Initialize LLM chat
        chat = LlmChat(
            api_key=api_key,
            session_id=f"puzzle_gen_{current_user_email}",
            system_message="You are a creative puzzle designer who creates engaging brain teasers and puzzles. Always respond with valid JSON."
        ).with_model("openai", "gpt-5")

        # Send message
        user_message = UserMessage(text=prompt)
        response = await chat.send_message(user_message)
        
        # Parse response
        response_text = response.strip()
        
        # Extract JSON from response
        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0].strip()
        
        puzzles_data = json.loads(response_text)
        
        # Create GeneratedPuzzle objects
        generated_puzzles = []
        for puzzle_data in puzzles_data:
            puzzle = GeneratedPuzzle(
                question=puzzle_data["question"],
                answer=puzzle_data["answer"],
                hint=puzzle_data.get("hint", "Think carefully about the clues given."),
                explanation=puzzle_data.get("explanation", ""),
                category=request.category,
                difficulty=request.difficulty
            )
            generated_puzzles.append(puzzle)
        
        return generated_puzzles
    
    except Exception as e:
        print(f"Error generating puzzles: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate puzzles: {str(e)}"
        )


@router.get("/puzzle-ideas")
async def get_puzzle_ideas(
    category: str,
    current_user_email: str = Depends(get_current_user_email)
):
    """
    Get AI-generated puzzle ideas for inspiration
    """
    try:
        api_key = get_llm_key()
        
        prompt = f"""Suggest 5 creative puzzle ideas for {category} puzzles. 
        
Just list the puzzle concepts briefly (1 sentence each), no full puzzles."""

        chat = LlmChat(
            api_key=api_key,
            session_id=f"ideas_{current_user_email}_{category}",
            system_message="You are a creative puzzle designer."
        ).with_model("openai", "gpt-5")

        user_message = UserMessage(text=prompt)
        response = await chat.send_message(user_message)
        
        ideas = response.strip().split('\n')
        ideas = [idea.strip() for idea in ideas if idea.strip()]
        
        return {"ideas": ideas}
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate ideas: {str(e)}"
        )


@router.post("/adaptive-difficulty", response_model=AdaptiveDifficultyResponse)
async def get_adaptive_difficulty(
    request: AdaptiveDifficultyRequest,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Analyze user performance and recommend optimal difficulty
    """
    try:
        api_key = get_llm_key()
        
        # Extract user stats
        stats = request.user_stats
        total_puzzles = stats.get('total_completed', 0)
        success_rate = stats.get('success_rate', 0)
        avg_time = stats.get('avg_completion_time', 0)
        avg_attempts = stats.get('avg_attempts', 0)
        recent_performance = stats.get('recent_performance', [])
        
        prompt = f"""Analyze this user's puzzle performance and recommend the optimal difficulty level (easy, medium, or hard).

User Statistics:
- Total puzzles completed: {total_puzzles}
- Success rate: {success_rate}%
- Average completion time: {avg_time} seconds
- Average attempts per puzzle: {avg_attempts}
- Recent performance (last 5 puzzles): {recent_performance}

Provide a JSON response with:
{{
    "recommended_difficulty": "easy/medium/hard",
    "explanation": "brief explanation of why",
    "confidence": 0.0-1.0
}}

Consider:
- Success rate above 80% → increase difficulty
- Success rate below 50% → decrease difficulty  
- Fast completion times → increase difficulty
- Many attempts → decrease difficulty"""

        chat = LlmChat(
            api_key=api_key,
            session_id=f"adaptive_{current_user['id']}",
            system_message="You are an AI that analyzes puzzle game performance to optimize player experience. Always respond with valid JSON."
        ).with_model("openai", "gpt-5")

        user_message = UserMessage(text=prompt)
        response = await chat.send_message(user_message)
        
        # Parse response
        response_text = response.strip()
        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0].strip()
        
        result = json.loads(response_text)
        
        return AdaptiveDifficultyResponse(
            recommended_difficulty=result['recommended_difficulty'],
            explanation=result['explanation'],
            confidence=result.get('confidence', 0.8)
        )
    
    except Exception as e:
        print(f"Error in adaptive difficulty: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to analyze performance: {str(e)}"
        )
