import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ArrowLeft, TrendingUp, Trophy, Clock, Target, Star, Flame, Award } from 'lucide-react';
import api from '../services/api';

const Analytics = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboard();
    }
  }, [isAuthenticated]);

  const loadDashboard = async () => {
    try {
      const response = await api.get('/api/analytics/dashboard');
      setDashboard(response);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
        <Card className="bg-white p-8 rounded-3xl text-center max-w-md">
          <TrendingUp className="w-20 h-20 text-purple-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">Please login to view your analytics</p>
          <Button onClick={() => navigate('/login')} className="w-full">Go to Login</Button>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-2 sm:p-4">
      <div className="max-w-6xl mx-auto space-y-4">
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
              <TrendingUp className="w-6 h-6 sm:w-10 sm:h-10" />
              Analytics Dashboard
            </h1>
          </div>
          <div className="w-20 sm:w-28"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white/95 backdrop-blur-sm p-6 rounded-3xl shadow-xl text-center">
            <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-1">Total Puzzles</p>
            <p className="text-3xl font-black text-gray-800">{dashboard?.total_puzzles_completed || 0}</p>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm p-6 rounded-3xl shadow-xl text-center">
            <Star className="w-12 h-12 text-blue-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-1">Total Score</p>
            <p className="text-3xl font-black text-gray-800">{dashboard?.total_score || 0}</p>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm p-6 rounded-3xl shadow-xl text-center">
            <Target className="w-12 h-12 text-green-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-1">Success Rate</p>
            <p className="text-3xl font-black text-gray-800">{dashboard?.success_rate || 0}%</p>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm p-6 rounded-3xl shadow-xl text-center">
            <Flame className="w-12 h-12 text-red-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-1">Streak Days</p>
            <p className="text-3xl font-black text-gray-800">{dashboard?.streak_days || 0}</p>
          </Card>
        </div>

        {/* Resources */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-yellow-400 to-orange-500 p-6 rounded-3xl shadow-xl text-center text-white">
            <p className="text-4xl mb-2">💰</p>
            <p className="text-sm mb-1">Coins</p>
            <p className="text-3xl font-black">{dashboard?.coins || 0}</p>
          </Card>

          <Card className="bg-gradient-to-br from-blue-400 to-cyan-500 p-6 rounded-3xl shadow-xl text-center text-white">
            <p className="text-4xl mb-2">💡</p>
            <p className="text-sm mb-1">Hints</p>
            <p className="text-3xl font-black">{dashboard?.hints || 0}</p>
          </Card>

          <Card className="bg-gradient-to-br from-red-400 to-pink-500 p-6 rounded-3xl shadow-xl text-center text-white">
            <p className="text-4xl mb-2">❤️</p>
            <p className="text-sm mb-1">Lives</p>
            <p className="text-3xl font-black">{dashboard?.lives || 0}</p>
          </Card>
        </div>

        {/* Performance Details */}
        <Card className="bg-white/95 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Award className="w-7 h-7 text-purple-600" />
            Performance Stats
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-purple-600" />
                  <span className="font-semibold text-gray-700">Avg Completion Time</span>
                </div>
                <span className="text-2xl font-bold text-purple-600">{dashboard?.avg_completion_time || 0}s</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Target className="w-6 h-6 text-green-600" />
                  <span className="font-semibold text-gray-700">Success Rate</span>
                </div>
                <span className="text-2xl font-bold text-green-600">{dashboard?.success_rate || 0}%</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Star className="w-6 h-6 text-blue-600" />
                  <span className="font-semibold text-gray-700">Favorite Category</span>
                </div>
                <span className="text-xl font-bold text-blue-600 capitalize">{dashboard?.favorite_category || 'N/A'}</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Flame className="w-6 h-6 text-orange-600" />
                  <span className="font-semibold text-gray-700">Current Streak</span>
                </div>
                <span className="text-2xl font-bold text-orange-600">{dashboard?.streak_days || 0} days</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => navigate('/levels')}
            className="h-16 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-lg font-bold rounded-2xl"
          >
            Continue Playing
          </Button>
          <Button
            onClick={() => navigate('/leaderboard')}
            className="h-16 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-lg font-bold rounded-2xl"
          >
            View Leaderboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
