#!/usr/bin/env python3
"""
Comprehensive Backend Testing for MindSpark Phase 2/3/4 Features
Focus on Friends System, Shop System, Analytics, Community Puzzles, and AI Features
"""

import requests
import json
import time
import uuid
from datetime import datetime

# Configuration
BASE_URL = "https://puzzle-genius-8.preview.emergentagent.com/api"
TEST_USER_EMAIL = f"testbackend{int(time.time())}@example.com"
TEST_USER_PASSWORD = "test123"
TEST_USER_NAME = "Backend Test User"
TEST_USER_AVATAR = "🧠"

class Phase234Tester:
    def __init__(self):
        self.base_url = BASE_URL
        self.token = None
        self.user_data = None
        self.test_results = []
        self.created_puzzle_id = None
        
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
        
    def make_request(self, method, endpoint, data=None, headers=None, timeout=30):
        """Make HTTP request with error handling"""
        url = f"{self.base_url}{endpoint}"
        
        # Add auth header if token exists
        if self.token and headers is None:
            headers = {"Authorization": f"Bearer {self.token}"}
        elif self.token and headers:
            headers["Authorization"] = f"Bearer {self.token}"
            
        try:
            if method.upper() == "GET":
                response = requests.get(url, headers=headers, timeout=timeout)
            elif method.upper() == "POST":
                response = requests.post(url, json=data, headers=headers, timeout=timeout)
            elif method.upper() == "PUT":
                response = requests.put(url, json=data, headers=headers, timeout=timeout)
            elif method.upper() == "DELETE":
                response = requests.delete(url, headers=headers, timeout=timeout)
            else:
                raise ValueError(f"Unsupported method: {method}")
                
            return response
        except requests.exceptions.RequestException as e:
            print(f"Request failed: {e}")
            return None
    
    def setup_authentication(self):
        """Setup authentication for testing"""
        print("\n=== AUTHENTICATION SETUP ===")
        
        # Create test user
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
            self.log_result("Authentication Setup", True, f"User created: {TEST_USER_EMAIL}")
            return True
        else:
            # Try login if user already exists
            login_data = {
                "email": TEST_USER_EMAIL,
                "password": TEST_USER_PASSWORD
            }
            
            response = self.make_request("POST", "/auth/login", login_data)
            if response and response.status_code == 200:
                data = response.json()
                self.token = data.get("access_token")
                self.log_result("Authentication Setup", True, f"User logged in: {TEST_USER_EMAIL}")
                return True
            else:
                self.log_result("Authentication Setup", False, f"Failed to authenticate")
                return False
    
    def test_friends_system(self):
        """Test Friends System - Phase 2 Feature"""
        print("\n=== FRIENDS SYSTEM TESTING ===")
        
        # 1. Test GET /api/friends/list
        response = self.make_request("GET", "/friends/list")
        if response and response.status_code == 200:
            data = response.json()
            friends = data.get("friends", [])
            self.log_result("GET Friends List", True, f"Retrieved {len(friends)} friends")
        else:
            self.log_result("GET Friends List", False, f"Status: {response.status_code if response else 'No response'}")
        
        # 2. Test GET /api/friends/requests
        response = self.make_request("GET", "/friends/requests")
        if response and response.status_code == 200:
            data = response.json()
            requests_list = data.get("requests", [])
            self.log_result("GET Friend Requests", True, f"Retrieved {len(requests_list)} requests")
        else:
            self.log_result("GET Friend Requests", False, f"Status: {response.status_code if response else 'No response'}")
        
        # 3. Test GET /api/friends/search?query=test
        response = self.make_request("GET", "/friends/search?query=test")
        if response and response.status_code == 200:
            data = response.json()
            users = data.get("users", [])
            self.log_result("GET Search Users", True, f"Found {len(users)} users matching 'test'")
        else:
            self.log_result("GET Search Users", False, f"Status: {response.status_code if response else 'No response'}")
        
        # 4. Test POST /api/friends/request (with invalid email - expected to fail)
        friend_request_data = {"friend_email": "nonexistent@example.com"}
        response = self.make_request("POST", "/friends/request", friend_request_data, timeout=10)
        if response and response.status_code == 404:
            self.log_result("POST Send Friend Request (Invalid)", True, "Correctly returned 404 for non-existent user")
        elif response and response.status_code == 400:
            self.log_result("POST Send Friend Request (Invalid)", True, "Correctly returned 400 for invalid request")
        else:
            self.log_result("POST Send Friend Request (Invalid)", False, f"Status: {response.status_code if response else 'No response'}")
        
        # 5. Test GET /api/friends/challenges
        response = self.make_request("GET", "/friends/challenges")
        if response and response.status_code == 200:
            data = response.json()
            challenges = data.get("challenges", [])
            self.log_result("GET Friend Challenges", True, f"Retrieved {len(challenges)} challenges")
        else:
            self.log_result("GET Friend Challenges", False, f"Status: {response.status_code if response else 'No response'}")
        
        # 6. Test POST /api/friends/challenge (with invalid friend_id - expected to fail)
        challenge_data = {"friend_id": "invalid_id", "puzzle_id": 5}
        response = self.make_request("POST", "/friends/challenge", challenge_data)
        if response and (response.status_code == 404 or response.status_code == 400):
            self.log_result("POST Challenge Friend (Invalid)", True, f"Correctly returned {response.status_code} for invalid friend")
        else:
            self.log_result("POST Challenge Friend (Invalid)", False, f"Status: {response.status_code if response else 'No response'}")
    
    def test_shop_system(self):
        """Test Shop System - Phase 3 Feature"""
        print("\n=== SHOP SYSTEM TESTING ===")
        
        # 1. Test GET /api/shop/items (should be public)
        response = self.make_request("GET", "/shop/items", headers={})  # No auth header
        if response and response.status_code == 200:
            data = response.json()
            items = data.get("items", [])
            self.log_result("GET Shop Items (Public)", True, f"Retrieved {len(items)} items")
            
            # Verify we have exactly 4 items as specified
            expected_items = ["coins_100", "coins_500", "hints_10", "lives_10"]
            item_ids = [item.get("id") for item in items]
            if all(item_id in item_ids for item_id in expected_items):
                self.log_result("Shop Items Validation", True, "All 4 expected items present")
            else:
                self.log_result("Shop Items Validation", False, f"Missing items. Expected: {expected_items}, Got: {item_ids}")
        else:
            self.log_result("GET Shop Items (Public)", False, f"Status: {response.status_code if response else 'No response'}")
        
        # 2. Test GET /api/shop/subscriptions (should be public)
        response = self.make_request("GET", "/shop/subscriptions", headers={})  # No auth header
        if response and response.status_code == 200:
            data = response.json()
            subscriptions = data.get("subscriptions", [])
            self.log_result("GET Subscriptions (Public)", True, f"Retrieved {len(subscriptions)} subscription plans")
            
            # Verify we have exactly 2 plans as specified
            if len(subscriptions) == 2:
                self.log_result("Subscription Plans Validation", True, "2 subscription plans present as expected")
            else:
                self.log_result("Subscription Plans Validation", False, f"Expected 2 plans, got {len(subscriptions)}")
        else:
            self.log_result("GET Subscriptions (Public)", False, f"Status: {response.status_code if response else 'No response'}")
        
        # 3. Test POST /api/shop/purchase (requires auth)
        purchase_data = {"item_id": "coins_100"}
        response = self.make_request("POST", "/shop/purchase", purchase_data)
        if response and response.status_code == 200:
            data = response.json()
            self.log_result("POST Purchase Item", True, f"Purchase successful: {data.get('message', 'No message')}")
        else:
            self.log_result("POST Purchase Item", False, f"Status: {response.status_code if response else 'No response'}")
        
        # 4. Test POST /api/shop/purchase with invalid item
        invalid_purchase_data = {"item_id": "invalid_item"}
        response = self.make_request("POST", "/shop/purchase", invalid_purchase_data)
        if response and (response.status_code == 404 or response.status_code == 400):
            self.log_result("POST Purchase Invalid Item", True, f"Correctly returned {response.status_code} for invalid item")
        else:
            self.log_result("POST Purchase Invalid Item", False, f"Status: {response.status_code if response else 'No response'}")
    
    def test_analytics_system(self):
        """Test Analytics System - Phase 3 Feature"""
        print("\n=== ANALYTICS SYSTEM TESTING ===")
        
        # 1. Test GET /api/analytics/dashboard
        response = self.make_request("GET", "/analytics/dashboard")
        if response and response.status_code == 200:
            data = response.json()
            required_fields = ["total_puzzles_completed", "total_score", "coins", "hints", "lives", "success_rate", "streak_days"]
            missing_fields = [field for field in required_fields if field not in data]
            
            if not missing_fields:
                self.log_result("GET Analytics Dashboard", True, f"Dashboard data complete with all required fields")
            else:
                self.log_result("GET Analytics Dashboard", False, f"Missing fields: {missing_fields}")
        else:
            self.log_result("GET Analytics Dashboard", False, f"Status: {response.status_code if response else 'No response'}")
        
        # 2. Test GET /api/analytics/stats
        response = self.make_request("GET", "/analytics/stats")
        if response and response.status_code == 200:
            data = response.json()
            required_fields = ["total_completed", "success_rate", "avg_completion_time", "recent_performance"]
            missing_fields = [field for field in required_fields if field not in data]
            
            if not missing_fields:
                self.log_result("GET Analytics Stats", True, f"Stats data complete with all required fields")
            else:
                self.log_result("GET Analytics Stats", False, f"Missing fields: {missing_fields}")
        else:
            self.log_result("GET Analytics Stats", False, f"Status: {response.status_code if response else 'No response'}")
    
    def test_community_puzzles(self):
        """Test Community Puzzles System - Phase 4 Feature"""
        print("\n=== COMMUNITY PUZZLES TESTING ===")
        
        # 1. Test GET /api/community/puzzles
        response = self.make_request("GET", "/community/puzzles")
        if response and response.status_code == 200:
            data = response.json()
            puzzles = data.get("puzzles", [])
            self.log_result("GET Community Puzzles", True, f"Retrieved {len(puzzles)} community puzzles")
        else:
            self.log_result("GET Community Puzzles", False, f"Status: {response.status_code if response else 'No response'}")
        
        # 2. Test POST /api/community/puzzles (Create puzzle)
        puzzle_data = {
            "title": "Backend Test Logic Puzzle",
            "description": "A comprehensive test puzzle for backend API validation",
            "question": "What comes next in the sequence: 1, 4, 9, 16, ?",
            "type": "sequence",
            "correctAnswer": "25",
            "category": "logic",
            "difficulty": "medium"
        }
        
        response = self.make_request("POST", "/community/puzzles", puzzle_data)
        if response and response.status_code == 201:
            data = response.json()
            self.created_puzzle_id = data.get("puzzle_id")
            self.log_result("POST Create Community Puzzle", True, f"Puzzle created with ID: {self.created_puzzle_id}")
        else:
            self.log_result("POST Create Community Puzzle", False, f"Status: {response.status_code if response else 'No response'}")
        
        # 3. Test GET /api/community/puzzles/{puzzle_id}
        if self.created_puzzle_id:
            response = self.make_request("GET", f"/community/puzzles/{self.created_puzzle_id}")
            if response and response.status_code == 200:
                data = response.json()
                self.log_result("GET Specific Community Puzzle", True, f"Retrieved puzzle: {data.get('title', 'No title')}")
            else:
                self.log_result("GET Specific Community Puzzle", False, f"Status: {response.status_code if response else 'No response'}")
        
        # 4. Test POST /api/community/puzzles/{puzzle_id}/rate
        if self.created_puzzle_id:
            rating_data = {"rating": 4, "review": "Great test puzzle for backend validation!"}
            response = self.make_request("POST", f"/community/puzzles/{self.created_puzzle_id}/rate", rating_data)
            if response and response.status_code == 200:
                self.log_result("POST Rate Community Puzzle", True, "Puzzle rated successfully")
            else:
                self.log_result("POST Rate Community Puzzle", False, f"Status: {response.status_code if response else 'No response'}")
        
        # 5. Test POST /api/community/puzzles/{puzzle_id}/like
        if self.created_puzzle_id:
            response = self.make_request("POST", f"/community/puzzles/{self.created_puzzle_id}/like", {})
            if response and response.status_code == 200:
                self.log_result("POST Like Community Puzzle", True, "Puzzle liked successfully")
            else:
                self.log_result("POST Like Community Puzzle", False, f"Status: {response.status_code if response else 'No response'}")
        
        # 6. Test GET /api/community/my-puzzles
        response = self.make_request("GET", "/community/my-puzzles")
        if response and response.status_code == 200:
            data = response.json()
            puzzles = data.get("puzzles", [])
            self.log_result("GET My Community Puzzles", True, f"Retrieved {len(puzzles)} user puzzles")
        else:
            self.log_result("GET My Community Puzzles", False, f"Status: {response.status_code if response else 'No response'}")
        
        # 7. Test DELETE /api/community/puzzles/{puzzle_id}
        if self.created_puzzle_id:
            response = self.make_request("DELETE", f"/community/puzzles/{self.created_puzzle_id}")
            if response and response.status_code == 200:
                self.log_result("DELETE Community Puzzle", True, "Puzzle deleted successfully")
            else:
                self.log_result("DELETE Community Puzzle", False, f"Status: {response.status_code if response else 'No response'}")
    
    def test_ai_features(self):
        """Test AI Features - Phase 4 Feature"""
        print("\n=== AI FEATURES TESTING ===")
        
        # 1. Test POST /api/ai/generate-puzzles
        puzzle_gen_data = {
            "category": "logic",
            "difficulty": "medium",
            "count": 1
        }
        
        response = self.make_request("POST", "/ai/generate-puzzles", puzzle_gen_data, timeout=60)
        if response and response.status_code == 200:
            data = response.json()
            if isinstance(data, list) and len(data) > 0:
                puzzle = data[0]
                required_fields = ["question", "answer", "hint", "explanation"]
                missing_fields = [field for field in required_fields if field not in puzzle]
                
                if not missing_fields:
                    self.log_result("POST Generate AI Puzzles", True, f"Generated puzzle with GPT-5: {puzzle.get('question', '')[:50]}...")
                else:
                    self.log_result("POST Generate AI Puzzles", False, f"Generated puzzle missing fields: {missing_fields}")
            else:
                self.log_result("POST Generate AI Puzzles", False, "No puzzles generated or invalid format")
        else:
            self.log_result("POST Generate AI Puzzles", False, f"Status: {response.status_code if response else 'No response'}")
        
        # 2. Test GET /api/ai/puzzle-ideas?category=logic
        response = self.make_request("GET", "/ai/puzzle-ideas?category=logic")
        if response and response.status_code == 200:
            data = response.json()
            ideas = data.get("ideas", [])
            self.log_result("GET AI Puzzle Ideas", True, f"Retrieved {len(ideas)} puzzle ideas for logic category")
        else:
            self.log_result("GET AI Puzzle Ideas", False, f"Status: {response.status_code if response else 'No response'}")
        
        # 3. Test POST /api/ai/adaptive-difficulty
        user_stats = {
            "total_completed": 10,
            "success_rate": 75,
            "avg_completion_time": 45,
            "avg_attempts": 1.5,
            "recent_performance": [80, 85, 70, 90, 75]
        }
        
        adaptive_data = {"user_stats": user_stats}
        response = self.make_request("POST", "/ai/adaptive-difficulty", adaptive_data, timeout=60)
        if response and response.status_code == 200:
            data = response.json()
            if "recommended_difficulty" in data:
                self.log_result("POST AI Adaptive Difficulty", True, f"Recommended difficulty: {data.get('recommended_difficulty')}")
            else:
                self.log_result("POST AI Adaptive Difficulty", False, "Missing recommended_difficulty field")
        else:
            self.log_result("POST AI Adaptive Difficulty", False, f"Status: {response.status_code if response else 'No response'}")
        
        # 4. Test edge cases - invalid category
        invalid_gen_data = {
            "category": "invalid_category",
            "difficulty": "medium",
            "count": 1
        }
        
        response = self.make_request("POST", "/ai/generate-puzzles", invalid_gen_data)
        if response and (response.status_code == 400 or response.status_code == 422):
            self.log_result("POST Generate AI Puzzles (Invalid Category)", True, f"Correctly returned {response.status_code} for invalid category")
        else:
            self.log_result("POST Generate AI Puzzles (Invalid Category)", False, f"Status: {response.status_code if response else 'No response'}")
    
    def run_comprehensive_tests(self):
        """Run all Phase 2/3/4 tests"""
        print("🚀 Starting Comprehensive Phase 2/3/4 Backend Testing")
        print(f"Base URL: {self.base_url}")
        print(f"Test User: {TEST_USER_EMAIL}")
        
        # Setup authentication
        if not self.setup_authentication():
            print("❌ Authentication failed - cannot proceed with tests")
            return
        
        # Run all test suites
        self.test_friends_system()
        self.test_shop_system()
        self.test_analytics_system()
        self.test_community_puzzles()
        self.test_ai_features()
        
        # Print summary
        self.print_summary()
    
    def print_summary(self):
        """Print comprehensive test summary"""
        print("\n" + "="*80)
        print("📊 PHASE 2/3/4 COMPREHENSIVE TEST SUMMARY")
        print("="*80)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result["success"])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        # Group results by feature
        features = {
            "Friends System": [r for r in self.test_results if "Friend" in r["test"] or "Search" in r["test"] or "Challenge" in r["test"]],
            "Shop System": [r for r in self.test_results if "Shop" in r["test"] or "Purchase" in r["test"] or "Subscription" in r["test"]],
            "Analytics": [r for r in self.test_results if "Analytics" in r["test"] or "Stats" in r["test"]],
            "Community Puzzles": [r for r in self.test_results if "Community" in r["test"]],
            "AI Features": [r for r in self.test_results if "AI" in r["test"] or "Generate" in r["test"] or "Difficulty" in r["test"]]
        }
        
        print("\n📋 FEATURE BREAKDOWN:")
        for feature, results in features.items():
            if results:
                feature_passed = sum(1 for r in results if r["success"])
                feature_total = len(results)
                print(f"  {feature}: {feature_passed}/{feature_total} ({(feature_passed/feature_total)*100:.1f}%)")
        
        if failed_tests > 0:
            print("\n🔍 FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"  ❌ {result['test']}: {result['details']}")
        
        print("\n" + "="*80)

if __name__ == "__main__":
    tester = Phase234Tester()
    tester.run_comprehensive_tests()