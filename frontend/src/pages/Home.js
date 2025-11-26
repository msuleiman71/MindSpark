import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { Button } from '../components/ui/button';
import { Brain, Play, Trophy, User, ShoppingCart, Settings, TrendingUp, Star, Coins, Zap } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { userProfile, coins, hints, lives, levelProgress } = useGame();
  
  const totalStars = Object.values(levelProgress).reduce((sum, progress) => sum + (progress.stars || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-yellow-400 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-8">
          <div 
            onClick={() => navigate('/profile')}
            className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 flex items-center gap-3 cursor-pointer hover:bg-white/30 transition-all"
          >
            <span className="text-3xl">{userProfile.avatar}</span>
            <div>
              <p className="text-sm text-white/80 font-semibold">Welcome back</p>
              <p className="text-lg font-black text-white">{userProfile.name}</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
              <Coins className="w-5 h-5 text-yellow-300" />
              <span className="text-xl font-black text-white">{coins}</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
              <span className="text-xl font-black text-white">{totalStars}</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-300" />
              <span className="text-xl font-black text-white">{hints}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="text-center space-y-8 animate-fadeIn">
          {/* Logo and Title */}
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="bg-white p-8 rounded-full shadow-2xl transform hover:scale-110 transition-transform duration-300">
                <Brain className="w-24 h-24 text-purple-600" />
              </div>
            </div>
            <h1 className="text-7xl font-black text-white drop-shadow-lg tracking-tight">
              MINDSPARK
            </h1>
            <p className="text-3xl font-bold text-white drop-shadow-md">
              Ultimate Brain Puzzles
            </p>
          </div>

          {/* Main Menu Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Button
              onClick={() => navigate('/levels')}
              className="h-24 text-2xl font-bold bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <Play className="w-10 h-10 mr-4" />
              Play Levels
            </Button>

            <Button
              onClick={() => navigate('/leaderboard')}
              className="h-24 text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <Trophy className="w-10 h-10 mr-4" />
              Leaderboard
            </Button>

            <Button
              onClick={() => navigate('/shop')}
              className="h-24 text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-500 hover:from-blue-500 hover:to-cyan-600 text-white rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <ShoppingCart className="w-10 h-10 mr-4" />
              Shop
            </Button>

            <Button
              onClick={() => navigate('/profile')}
              className="h-24 text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <User className="w-10 h-10 mr-4" />
              Profile
            </Button>
          </div>

          {/* Settings Button */}
          <div className="flex justify-center">
            <Button
              onClick={() => navigate('/settings')}
              variant="outline"
              className="h-14 px-8 text-lg font-bold bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 rounded-2xl backdrop-blur-sm"
            >
              <Settings className="w-6 h-6 mr-3" />
              Settings
            </Button>
          </div>

          {/* Footer Stats */}
          <div className="text-white text-sm opacity-90 mt-12">
            <p className="text-lg font-semibold">Ready to challenge your brain? \ud83e\udde0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
