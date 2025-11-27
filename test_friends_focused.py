#!/usr/bin/env python3
"""
Focused Friends System Test
"""

import requests
import json
import time

BASE_URL = "https://puzzle-genius-8.preview.emergentagent.com/api"
TEST_USER_EMAIL = f"testfriends{int(time.time())}@example.com"
TEST_USER_PASSWORD = "test123"

def setup_auth():
    """Setup authentication"""
    signup_data = {
        "email": TEST_USER_EMAIL,
        "password": TEST_USER_PASSWORD,
        "name": "Friends Test User",
        "avatar": "👥"
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

def test_friends_endpoints():
    """Test friends endpoints specifically"""
    token = setup_auth()
    if not token:
        print("❌ Authentication failed")
        return
    
    headers = {"Authorization": f"Bearer {token}"}
    
    print("👥 Testing Friends System")
    
    # Test friend request with timeout handling
    print("\n1. Testing friend request...")
    friend_request_data = {"friend_email": "nonexistent@example.com"}
    
    try:
        response = requests.post(f"{BASE_URL}/friends/request", 
                               json=friend_request_data, headers=headers, timeout=15)
        print(f"Friend request status: {response.status_code}")
        if response.status_code == 404:
            print("✅ Correctly returned 404 for non-existent user")
        else:
            print(f"Response: {response.text}")
    except requests.exceptions.Timeout:
        print("❌ Request timed out")
    except Exception as e:
        print(f"❌ Exception: {e}")
    
    # Test challenge friend
    print("\n2. Testing challenge friend...")
    challenge_data = {"friend_id": "invalid_id", "puzzle_id": 5}
    
    try:
        response = requests.post(f"{BASE_URL}/friends/challenge", 
                               json=challenge_data, headers=headers, timeout=15)
        print(f"Challenge friend status: {response.status_code}")
        if response.status_code in [404, 400]:
            print(f"✅ Correctly returned {response.status_code} for invalid friend")
        else:
            print(f"Response: {response.text}")
    except requests.exceptions.Timeout:
        print("❌ Request timed out")
    except Exception as e:
        print(f"❌ Exception: {e}")
    
    # Test shop purchase with invalid item
    print("\n3. Testing shop purchase with invalid item...")
    invalid_purchase_data = {"item_id": "invalid_item"}
    
    try:
        response = requests.post(f"{BASE_URL}/shop/purchase", 
                               json=invalid_purchase_data, headers=headers, timeout=15)
        print(f"Invalid purchase status: {response.status_code}")
        if response.status_code in [404, 400]:
            print(f"✅ Correctly returned {response.status_code} for invalid item")
        else:
            print(f"Response: {response.text}")
    except requests.exceptions.Timeout:
        print("❌ Request timed out")
    except Exception as e:
        print(f"❌ Exception: {e}")

if __name__ == "__main__":
    test_friends_endpoints()