#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for MindSpark
Tests all backend endpoints systematically
"""

import requests
import json
import time
import uuid
from datetime import datetime

# Configuration
BASE_URL = "https://logicgame-1.preview.emergentagent.com/api"
TEST_USER_EMAIL = f"testuser{int(time.time())}@mindspark.com"
TEST_USER_PASSWORD = "TestPassword123!"
TEST_USER_NAME = "Test User"
TEST_USER_AVATAR = "🧠"

class BackendTester:
    def __init__(self):
        self.base_url = BASE_URL
        self.token = None
        self.user_data = None
        self.test_results = []
        
    def log_result(self, test_name, success, details="", response_data=None):
        """Log test result"""
        result = {
            "test": test_name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        if response_data:
            result["response"] = response_data
        self.test_results.append(result)
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {details}")
        
    def make_request(self, method, endpoint, data=None, headers=None):
        """Make HTTP request with error handling"""
        url = f"{self.base_url}{endpoint}"
        
        # Add auth header if token exists
        if self.token and headers is None:
            headers = {"Authorization": f"Bearer {self.token}"}
        elif self.token and headers:
            headers["Authorization"] = f"Bearer {self.token}"
            
        try:
            if method.upper() == "GET":
                response = requests.get(url, headers=headers, timeout=30)
            elif method.upper() == "POST":
                response = requests.post(url, json=data, headers=headers, timeout=30)
            elif method.upper() == "PUT":
                response = requests.put(url, json=data, headers=headers, timeout=30)
            elif method.upper() == "DELETE":
                response = requests.delete(url, headers=headers, timeout=30)
            else:
                raise ValueError(f"Unsupported method: {method}")
                
            return response
        except requests.exceptions.RequestException as e:
            print(f"Request failed: {e}")
            return None
    
    def test_health_check(self):
        """Test basic health endpoints"""
        print("\n=== HEALTH CHECK ===")
        
        # Test root endpoint
        response = self.make_request("GET", "/")
        if response and response.status_code == 200:
            self.log_result("Root Endpoint", True, f"Status: {response.status_code}")
        else:
            self.log_result("Root Endpoint", False, f"Status: {response.status_code if response else 'No response'}")
        
        # Test health endpoint
        response = self.make_request("GET", "/health")
        if response and response.status_code == 200:
            self.log_result("Health Check", True, f"Status: {response.status_code}")
        else:
            self.log_result("Health Check", False, f"Status: {response.status_code if response else 'No response'}")
    
    def test_authentication_flow(self):
        """Test complete authentication flow"""
        print("\n=== AUTHENTICATION FLOW ===")
        
        # 1. Test Signup
        signup_data = {
            "email": TEST_USER_EMAIL,
            "password": TEST_USER_PASSWORD,
            "name": TEST_USER_NAME,
            "avatar": TEST_USER_AVATAR
        }
        
        response = self.make_request("POST", "/auth/signup", signup_data)
        if response and response.status_code == 201:
            data = response.json()
            self.token = data.get("access_token")
            self.user_data = data.get("user")
            self.log_result("User Signup", True, f"User created: {data.get('user', {}).get('name')}")
        else:
            self.log_result("User Signup", False, f"Status: {response.status_code if response else 'No response'}")
            return False
        
        # 2. Test Login
        login_data = {
            "email": TEST_USER_EMAIL,
            "password": TEST_USER_PASSWORD
        }
        
        response = self.make_request("POST", "/auth/login", login_data)
        if response and response.status_code == 200:
            data = response.json()
            self.token = data.get("access_token")  # Update token
            self.log_result("User Login", True, f"Login successful, token received")
        else:
            self.log_result("User Login", False, f"Status: {response.status_code if response else 'No response'}")
        
        # 3. Test Get Current User
        response = self.make_request("GET", "/auth/me")
        if response and response.status_code == 200:
            data = response.json()
            self.log_result("Get Current User", True, f"User: {data.get('name')}")
        else:
            self.log_result("Get Current User", False, f"Status: {response.status_code if response else 'No response'}")
        
        return True
    
    def test_user_profile(self):
        """Test user profile endpoints"""
        print("\n=== USER PROFILE ===")
        
        # Test get profile
        response = self.make_request("GET", "/user/profile")
        if response and response.status_code == 200:
            data = response.json()
            self.log_result("Get User Profile", True, f"Profile retrieved: {data.get('name')}")
        else:
            self.log_result("Get User Profile", False, f"Status: {response.status_code if response else 'No response'}")
    
    def test_progress_system(self):
        """Test progress sync and load"""
        print("\n=== PROGRESS SYSTEM ===")
        
        # Test load progress (should be empty initially)
        response = self.make_request("GET", "/progress/load")
        if response and response.status_code == 200:
            data = response.json()
            self.log_result("Load Progress", True, f"Progress loaded, coins: {data.get('user', {}).get('coins', 0)}")
        else:
            self.log_result("Load Progress", False, f"Status: {response.status_code if response else 'No response'}")
        
        # Test sync progress
        sync_data = {
            "level_progress": {
                "1": {"completed": True, "stars": 3, "bestTime": 45.5, "attempts": 1, "hintsUsed": 0},
                "2": {"completed": True, "stars": 2, "bestTime": 67.2, "attempts": 2, "hintsUsed": 1}
            },
            "settings": {
                "sound": True,
                "music": True,
                "notifications": False
            },
            "achievements": ["first_puzzle", "speed_demon"],
            "stats": {
                "total_time": 112.7,
                "total_puzzles": 2
            }
        }
        
        response = self.make_request("POST", "/progress/sync", sync_data)
        if response and response.status_code == 200:
            self.log_result("Sync Progress", True, "Progress synced successfully")
        else:
            self.log_result("Sync Progress", False, f"Status: {response.status_code if response else 'No response'}")
    
    def test_leaderboard(self):
        """Test leaderboard endpoint"""
        print("\n=== LEADERBOARD ===")
        
        response = self.make_request("GET", "/leaderboard")
        if response and response.status_code == 200:
            data = response.json()
            self.log_result("Get Leaderboard", True, f"Leaderboard retrieved with {len(data)} entries")
        else:
            self.log_result("Get Leaderboard", False, f"Status: {response.status_code if response else 'No response'}")
    
    def test_shop_system(self):
        """Test shop endpoints"""
        print("\n=== SHOP SYSTEM ===")
        
        # Test get shop items
        response = self.make_request("GET", "/shop/items")
        if response and response.status_code == 200:
            data = response.json()
            items = data.get("items", [])
            self.log_result("Get Shop Items", True, f"Retrieved {len(items)} items")
            
            # Verify we have 4 items as expected
            if len(items) == 4:
                self.log_result("Shop Items Count", True, "4 items returned as expected")
            else:
                self.log_result("Shop Items Count", False, f"Expected 4 items, got {len(items)}")
        else:
            self.log_result("Get Shop Items", False, f"Status: {response.status_code if response else 'No response'}")
        
        # Test purchase item
        purchase_data = {"item_id": "coins_100"}
        response = self.make_request("POST", "/shop/purchase", purchase_data)
        if response and response.status_code == 200:
            data = response.json()
            self.log_result("Purchase Item", True, f"Purchase successful: {data.get('message')}")
        else:
            self.log_result("Purchase Item", False, f"Status: {response.status_code if response else 'No response'}")
        
        # Test get subscriptions (this endpoint doesn't exist, should return 404)
        response = self.make_request("GET", "/shop/subscriptions")
        if response and response.status_code == 404:
            self.log_result("Get Subscriptions", False, "Endpoint not implemented (404)")
        else:
            self.log_result("Get Subscriptions", False, f"Unexpected status: {response.status_code if response else 'No response'}")
    
    def test_friends_system(self):
        """Test friends system"""
        print("\n=== FRIENDS SYSTEM ===")
        
        # Test search users
        response = self.make_request("GET", "/friends/search?query=test")
        if response and response.status_code == 200:
            data = response.json()
            users = data.get("users", [])
            self.log_result("Search Users", True, f"Found {len(users)} users")
        else:
            self.log_result("Search Users", False, f"Status: {response.status_code if response else 'No response'}")
        
        # Test get friend requests
        response = self.make_request("GET", "/friends/requests")
        if response and response.status_code == 200:
            data = response.json()
            requests_list = data.get("requests", [])
            self.log_result("Get Friend Requests", True, f"Retrieved {len(requests_list)} requests")
        else:
            self.log_result("Get Friend Requests", False, f"Status: {response.status_code if response else 'No response'}")
        
        # Test get friends list
        response = self.make_request("GET", "/friends/list")
        if response and response.status_code == 200:
            data = response.json()
            friends = data.get("friends", [])
            self.log_result("Get Friends List", True, f"Retrieved {len(friends)} friends")
        else:
            self.log_result("Get Friends List", False, f"Status: {response.status_code if response else 'No response'}")
        
        # Test send friend request (will fail without valid friend email)
        friend_request_data = {"friend_email": "nonexistent@example.com"}
        response = self.make_request("POST", "/friends/request", friend_request_data)
        if response and response.status_code == 404:
            self.log_result("Send Friend Request", False, "Friend not found (expected for test)")
        else:
            self.log_result("Send Friend Request", False, f"Status: {response.status_code if response else 'No response'}")
    
    def test_community_puzzles(self):
        """Test community puzzle system"""
        print("\n=== COMMUNITY PUZZLES ===")
        
        # Test get community puzzles
        response = self.make_request("GET", "/community/puzzles")
        if response and response.status_code == 200:
            data = response.json()
            puzzles = data.get("puzzles", [])
            self.log_result("Get Community Puzzles", True, f"Retrieved {len(puzzles)} puzzles")
        else:
            self.log_result("Get Community Puzzles", False, f"Status: {response.status_code if response else 'No response'}")
        
        # Test create puzzle
        puzzle_data = {
            "title": "Test Logic Puzzle",
            "description": "A test puzzle for API testing",
            "question": "What comes next in the sequence: 2, 4, 8, 16, ?",
            "type": "sequence",
            "correctAnswer": "32",
            "category": "logic",
            "difficulty": "easy"
        }
        
        response = self.make_request("POST", "/community/puzzles", puzzle_data)
        if response and response.status_code == 201:
            data = response.json()
            puzzle_id = data.get("puzzle_id")
            self.log_result("Create Community Puzzle", True, f"Puzzle created with ID: {puzzle_id}")
            
            # Test get specific puzzle
            if puzzle_id:
                response = self.make_request("GET", f"/community/puzzles/{puzzle_id}")
                if response and response.status_code == 200:
                    self.log_result("Get Specific Puzzle", True, "Puzzle retrieved successfully")
                    
                    # Test rate puzzle
                    rating_data = {"rating": 5, "review": "Great test puzzle!"}
                    response = self.make_request("POST", f"/community/puzzles/{puzzle_id}/rate", rating_data)
                    if response and response.status_code == 200:
                        self.log_result("Rate Puzzle", True, "Puzzle rated successfully")
                    else:
                        self.log_result("Rate Puzzle", False, f"Status: {response.status_code if response else 'No response'}")
                else:
                    self.log_result("Get Specific Puzzle", False, f"Status: {response.status_code if response else 'No response'}")
        else:
            self.log_result("Create Community Puzzle", False, f"Status: {response.status_code if response else 'No response'}")
    
    def test_analytics(self):
        """Test analytics endpoints"""
        print("\n=== ANALYTICS ===")
        
        # Test analytics dashboard
        response = self.make_request("GET", "/analytics/dashboard")
        if response and response.status_code == 200:
            data = response.json()
            self.log_result("Analytics Dashboard", True, f"Dashboard data retrieved, score: {data.get('total_score', 0)}")
        else:
            self.log_result("Analytics Dashboard", False, f"Status: {response.status_code if response else 'No response'}")
        
        # Test user stats
        response = self.make_request("GET", "/analytics/stats")
        if response and response.status_code == 200:
            data = response.json()
            self.log_result("User Stats", True, f"Stats retrieved, completed: {data.get('total_completed', 0)}")
        else:
            self.log_result("User Stats", False, f"Status: {response.status_code if response else 'No response'}")
    
    def test_ai_features(self):
        """Test AI-powered features"""
        print("\n=== AI FEATURES ===")
        
        # Test generate puzzles
        puzzle_gen_data = {
            "category": "logic",
            "difficulty": "easy",
            "count": 1
        }
        
        response = self.make_request("POST", "/ai/generate-puzzles", puzzle_gen_data)
        if response and response.status_code == 200:
            data = response.json()
            self.log_result("Generate AI Puzzles", True, f"Generated {len(data)} puzzle(s)")
        else:
            self.log_result("Generate AI Puzzles", False, f"Status: {response.status_code if response else 'No response'}")
        
        # Test puzzle ideas
        response = self.make_request("GET", "/ai/puzzle-ideas?category=math")
        if response and response.status_code == 200:
            data = response.json()
            ideas = data.get("ideas", [])
            self.log_result("Get Puzzle Ideas", True, f"Retrieved {len(ideas)} ideas")
        else:
            self.log_result("Get Puzzle Ideas", False, f"Status: {response.status_code if response else 'No response'}")
        
        # Test adaptive difficulty
        user_stats = {
            "total_completed": 10,
            "success_rate": 75,
            "avg_completion_time": 45,
            "avg_attempts": 1.5,
            "recent_performance": [80, 85, 70, 90, 75]
        }
        
        adaptive_data = {"user_stats": user_stats}
        response = self.make_request("POST", "/ai/adaptive-difficulty", adaptive_data)
        if response and response.status_code == 200:
            data = response.json()
            self.log_result("Adaptive Difficulty", True, f"Recommended: {data.get('recommended_difficulty')}")
        else:
            self.log_result("Adaptive Difficulty", False, f"Status: {response.status_code if response else 'No response'}")
    
    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting Comprehensive Backend API Testing")
        print(f"Base URL: {self.base_url}")
        print(f"Test User: {TEST_USER_EMAIL}")
        
        # Run tests in order
        self.test_health_check()
        
        if self.test_authentication_flow():
            self.test_user_profile()
            self.test_progress_system()
            self.test_leaderboard()
            self.test_shop_system()
            self.test_friends_system()
            self.test_community_puzzles()
            self.test_analytics()
            self.test_ai_features()
        else:
            print("❌ Authentication failed - skipping authenticated tests")
        
        # Print summary
        self.print_summary()
    
    def print_summary(self):
        """Print test summary"""
        print("\n" + "="*60)
        print("📊 TEST SUMMARY")
        print("="*60)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result["success"])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\n🔍 FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"  ❌ {result['test']}: {result['details']}")
        
        print("\n" + "="*60)

if __name__ == "__main__":
    tester = BackendTester()
    tester.run_all_tests()