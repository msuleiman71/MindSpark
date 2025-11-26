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

          {/* Featured Modes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
            <Button
              onClick={() => navigate('/daily-challenge')}
              className="h-32 text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-2 right-2 bg-yellow-400 text-red-600 text-xs font-black px-3 py-1 rounded-full">
                DAILY
              </div>
              <div className="flex flex-col items-center">
                <Star className="w-12 h-12 mb-2 fill-white" />
                <span>Daily Challenge</span>
              </div>
            </Button>

            <Button
              onClick={() => navigate('/time-attack')}
              className="h-32 text-2xl font-bold bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 text-white rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-2 right-2 bg-yellow-400 text-purple-600 text-xs font-black px-3 py-1 rounded-full">
                HOT
              </div>
              <div className="flex flex-col items-center">
                <Zap className="w-12 h-12 mb-2" />
                <span>Time Attack</span>
              </div>
            </Button>
          </div>

          {/* Main Menu Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            <Button
              onClick={() => navigate('/categories')}
              className="h-24 text-lg font-bold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <div className="flex flex-col items-center gap-2">
                <TrendingUp className="w-8 h-8" />
                <span>Categories</span>
              </div>
            </Button>

            <Button
              onClick={() => navigate('/levels')}
              className="h-24 text-lg font-bold bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <div className="flex flex-col items-center gap-2">
                <Play className="w-8 h-8" />
                <span>All Levels</span>
              </div>
            </Button>

            <Button
              onClick={() => navigate('/tournament')}
              className="h-24 text-lg font-bold bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <div className="flex flex-col items-center gap-2">
                <Trophy className="w-8 h-8" />
                <span>Tournament</span>
              </div>
            </Button>

            <Button
              onClick={() => navigate('/leaderboard')}
              className="h-24 text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-500 hover:from-blue-500 hover:to-cyan-600 text-white rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <div className="flex flex-col items-center gap-2">
                <Trophy className="w-8 h-8" />
                <span>Leaderboard</span>
              </div>
            </Button>

            <Button
              onClick={() => navigate('/shop')}
              className="h-24 text-lg font-bold bg-gradient-to-r from-pink-400 to-rose-500 hover:from-pink-500 hover:to-rose-600 text-white rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <div className="flex flex-col items-center gap-2">
                <ShoppingCart className="w-8 h-8" />
                <span>Shop</span>
              </div>
            </Button>

            <Button
              onClick={() => navigate('/profile')}
              className="h-24 text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <div className="flex flex-col items-center gap-2">
                <User className="w-8 h-8" />
                <span>Profile</span>
              </div>
            </Button>

            <Button
              onClick={() => navigate('/progress')}
              className="h-24 text-lg font-bold bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <div className="flex flex-col items-center gap-2">
                <TrendingUp className="w-8 h-8" />
                <span>Analytics</span>
              </div>
            </Button>

            <Button
              onClick={() => navigate('/settings')}
              className="h-24 text-lg font-bold bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <div className="flex flex-col items-center gap-2">
                <Settings className="w-8 h-8" />
                <span>Settings</span>
              </div>
            </Button>
          </div>

          {/* Quick Stats Banner */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 max-w-4xl mx-auto border-2 border-white/20">
            <div className="grid grid-cols-3 gap-6 text-center text-white">
              <div>
                <p className="text-4xl font-black">{totalStars}</p>
                <p className="text-sm font-semibold opacity-80">Total Stars</p>
              </div>
              <div>
                <p className="text-4xl font-black">{Object.keys(levelProgress).length}</p>
                <p className="text-sm font-semibold opacity-80">Levels Played</p>
              </div>
              <div>
                <p className="text-4xl font-black">{coins}</p>
                <p className="text-sm font-semibold opacity-80">Coins Earned</p>
              </div>
            </div>
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
            <p className="text-lg font-semibold">Ready to challenge your brain? 🧠</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
