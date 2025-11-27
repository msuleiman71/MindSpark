#!/usr/bin/env python3
"""
Focused AI Features Test
"""

import requests
import json
import time

BASE_URL = "https://puzzle-genius-8.preview.emergentagent.com/api"
TEST_USER_EMAIL = f"testai{int(time.time())}@example.com"
TEST_USER_PASSWORD = "test123"

def setup_auth():
    """Setup authentication"""
    signup_data = {
        "email": TEST_USER_EMAIL,
        "password": TEST_USER_PASSWORD,
        "name": "AI Test User",
        "avatar": "🤖"
    }
    
    response = requests.post(f"{BASE_URL}/auth/signup", json=signup_data, timeout=30)
    if response.status_code == 201:
        return response.json().get("access_token")
    
    # Try login if signup fails
    login_data = {"email": TEST_USER_EMAIL, "password": TEST_USER_PASSWORD}
    response = requests.post(f"{BASE_URL}/auth/login", json=login_data, timeout=30)
    if response.status_code == 200:
        return response.json().get("access_token")
    
    return None

def test_ai_endpoints():
    """Test AI endpoints specifically"""
    token = setup_auth()
    if not token:
        print("❌ Authentication failed")
        return
    
    headers = {"Authorization": f"Bearer {token}"}
    
    print("🤖 Testing AI Features")
    
    # 1. Test puzzle generation
    print("\n1. Testing puzzle generation...")
    puzzle_data = {
        "category": "logic",
        "difficulty": "easy",
        "count": 1
    }
    
    try:
        response = requests.post(f"{BASE_URL}/ai/generate-puzzles", 
                               json=puzzle_data, headers=headers, timeout=90)
        print(f"Generate puzzles status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Generated {len(data)} puzzle(s)")
            if data:
                print(f"Sample: {data[0].get('question', '')[:50]}...")
        else:
            print(f"❌ Error: {response.text}")
    except Exception as e:
        print(f"❌ Exception: {e}")
    
    # 2. Test puzzle ideas
    print("\n2. Testing puzzle ideas...")
    try:
        response = requests.get(f"{BASE_URL}/ai/puzzle-ideas?category=math", 
                              headers=headers, timeout=60)
        print(f"Puzzle ideas status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            ideas = data.get("ideas", [])
            print(f"✅ Retrieved {len(ideas)} ideas")
        else:
            print(f"❌ Error: {response.text}")
    except Exception as e:
        print(f"❌ Exception: {e}")
    
    # 3. Test adaptive difficulty
    print("\n3. Testing adaptive difficulty...")
    user_stats = {
        "total_completed": 10,
        "success_rate": 75,
        "avg_completion_time": 45,
        "avg_attempts": 1.5,
        "recent_performance": [80, 85, 70, 90, 75]
    }
    
    try:
        response = requests.post(f"{BASE_URL}/ai/adaptive-difficulty", 
                               json={"user_stats": user_stats}, headers=headers, timeout=60)
        print(f"Adaptive difficulty status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Recommended: {data.get('recommended_difficulty')}")
        else:
            print(f"❌ Error: {response.text}")
    except Exception as e:
        print(f"❌ Exception: {e}")

if __name__ == "__main__":
    test_ai_endpoints()