from fastapi import APIRouter, HTTPException, status, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from pydantic import BaseModel
from typing import List, Optional
import os
from openai import OpenAI

from auth import get_current_user_email

router = APIRouter(prefix="/ai", tags=["ai"])

def get_openai_client():
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="OpenAI API key not configured"
        )
    return OpenAI(api_key=api_key)


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
    Generate puzzles using AI
    """
    try:
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

        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a creative puzzle designer who creates engaging brain teasers and puzzles. Always respond with valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.8,
            max_tokens=1000
        )
        
        # Parse response
        import json
        response_text = response.choices[0].message.content
        
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
        prompt = f"""Suggest 5 creative puzzle ideas for {category} puzzles. 
        
Just list the puzzle concepts briefly (1 sentence each), no full puzzles."""

        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a creative puzzle designer."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.9,
            max_tokens=300
        )
        
        ideas = response.choices[0].message.content.strip().split('\n')
        ideas = [idea.strip() for idea in ideas if idea.strip()]
        
        return {"ideas": ideas}
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate ideas: {str(e)}"
        )
