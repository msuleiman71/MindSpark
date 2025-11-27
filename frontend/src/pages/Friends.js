import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { ArrowLeft, Users, Search, UserPlus, UserMinus, Check, X, Zap } from 'lucide-react';
import api from '../services/api';

const Friends = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [activeTab, setActiveTab] = useState('friends');
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadFriends();
      loadRequests();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      searchUsers();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const loadFriends = async () => {
    try {
      const response = await api.get('/api/friends/list');
      setFriends(response.friends || []);
    } catch (error) {
      console.error('Failed to load friends:', error);
    }
  };

  const loadRequests = async () => {
    try {
      const response = await api.get('/api/friends/requests');
      setRequests(response.requests || []);
    } catch (error) {
      console.error('Failed to load requests:', error);
    }
  };

  const searchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/friends/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchResults(response.users || []);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendFriendRequest = async (email) => {
    try {
      await api.post('/api/friends/request', { friend_email: email });
      alert('✅ Friend request sent!');
      setSearchQuery('');
      setSearchResults([]);
    } catch (error) {
      alert('❌ ' + (error.response?.data?.detail || 'Failed to send request'));
    }
  };

  const acceptRequest = async (userId) => {
    try {
      await api.post(`/api/friends/accept/${userId}`);
      loadFriends();
      loadRequests();
    } catch (error) {
      alert('❌ Failed to accept request');
    }
  };

  const rejectRequest = async (userId) => {
    try {
      await api.post(`/api/friends/reject/${userId}`);
      loadRequests();
    } catch (error) {
      alert('❌ Failed to reject request');
    }
  };

  const removeFriend = async (friendId) => {
    if (window.confirm('Remove this friend?')) {
      try {
        await api.delete(`/api/friends/${friendId}`);
        loadFriends();
      } catch (error) {
        alert('❌ Failed to remove friend');
      }
    }
  };

  const challengeFriend = async (friendId) => {
    const puzzleId = prompt('Enter puzzle ID to challenge (1-15):');
    if (puzzleId) {
      try {
        await api.post('/api/friends/challenge', { friend_id: friendId, puzzle_id: parseInt(puzzleId) });
        alert('✅ Challenge sent!');
      } catch (error) {
        alert('❌ Failed to send challenge');
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
        <Card className="bg-white p-8 rounded-3xl text-center max-w-md">
          <Users className="w-20 h-20 text-purple-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">Please login to manage friends</p>
          <Button onClick={() => navigate('/login')} className="w-full">Go to Login</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-2 sm:p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            onClick={() => navigate('/')}
            className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm rounded-full h-10 sm:h-12 px-4 sm:px-6"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            <span className="text-sm sm:text-base">Home</span>
          </Button>
          
          <div className="text-center flex-1">
            <h1 className="text-2xl sm:text-4xl font-black text-white drop-shadow-lg flex items-center gap-2 justify-center">
              <Users className="w-6 h-6 sm:w-10 sm:h-10" />
              Friends
            </h1>
          </div>
          <div className="w-20 sm:w-28"></div>
        </div>

        {/* Search */}
        <Card className="bg-white/95 backdrop-blur-sm p-4 rounded-3xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
          
          {searchResults.length > 0 && (
            <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
              {searchResults.map(user => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{user.avatar || '👤'}</div>
                    <div>
                      <p className="font-bold text-gray-800">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => sendFriendRequest(user.email)}
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <UserPlus className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Tabs */}
        <div className="flex gap-2">
          <Button
            onClick={() => setActiveTab('friends')}
            className={`flex-1 h-12 rounded-xl font-bold ${
              activeTab === 'friends' ? 'bg-white text-purple-600' : 'bg-white/20 text-white'
            }`}
          >
            Friends ({friends.length})
          </Button>
          <Button
            onClick={() => setActiveTab('requests')}
            className={`flex-1 h-12 rounded-xl font-bold ${
              activeTab === 'requests' ? 'bg-white text-purple-600' : 'bg-white/20 text-white'
            }`}
          >
            Requests ({requests.length})
          </Button>
        </div>

        {/* Friends List */}
        {activeTab === 'friends' && (
          <div className="space-y-3">
            {friends.length === 0 ? (
              <Card className="bg-white/95 p-12 rounded-3xl text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No friends yet. Search and add friends above!</p>
              </Card>
            ) : (
              friends.map(friend => (
                <Card key={friend.id} className="bg-white/95 p-4 rounded-3xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{friend.avatar || '👤'}</div>
                      <div>
                        <p className="font-bold text-gray-800 text-lg">{friend.name}</p>
                        <p className="text-sm text-gray-600">{friend.email}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => challengeFriend(friend.id)}
                        size="sm"
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      >
                        <Zap className="w-4 h-4 mr-1" />
                        Challenge
                      </Button>
                      <Button
                        onClick={() => removeFriend(friend.id)}
                        size="sm"
                        variant="outline"
                        className="border-red-500 text-red-500 hover:bg-red-50"
                      >
                        <UserMinus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Requests List */}
        {activeTab === 'requests' && (
          <div className="space-y-3">
            {requests.length === 0 ? (
              <Card className="bg-white/95 p-12 rounded-3xl text-center">
                <p className="text-gray-600">No pending friend requests</p>
              </Card>
            ) : (
              requests.map(request => (
                <Card key={request.user_id} className="bg-white/95 p-4 rounded-3xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{request.user?.avatar || '👤'}</div>
                      <div>
                        <p className="font-bold text-gray-800 text-lg">{request.user?.name}</p>
                        <p className="text-sm text-gray-600">{request.user?.email}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => acceptRequest(request.user_id)}
                        size="sm"
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => rejectRequest(request.user_id)}
                        size="sm"
                        className="bg-red-500 hover:bg-red-600 text-white"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Friends;
