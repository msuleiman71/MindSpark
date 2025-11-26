import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { getThemeGradient } from '../hooks/useTheme';
import { Button } from '../components/ui/button';
import { Brain, Play, Trophy, User, ShoppingCart, Settings, TrendingUp, Star, Coins, Zap } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { userProfile, coins, hints, lives, levelProgress, settings } = useGame();
  
  const totalStars = Object.values(levelProgress).reduce((sum, progress) => sum + (progress.stars || 0), 0);
  const themeGradient = getThemeGradient(settings.selectedTheme);
  const isDark = settings.theme === 'dark';

  return (
    <div className={`min-h-screen bg-gradient-to-br ${themeGradient} p-3 sm:p-4 md:p-6 ${isDark ? 'dark' : ''}`}>
      <div className="max-w-6xl mx-auto">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 sm:mb-8">
          <div 
            onClick={() => navigate('/profile')}
            className="bg-white/20 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 sm:py-3 flex items-center gap-2 sm:gap-3 cursor-pointer hover:bg-white/30 transition-all"
          >
            <span className="text-2xl sm:text-3xl">{userProfile.avatar}</span>
            <div>
              <p className="text-xs sm:text-sm text-white/80 font-semibold">Welcome back</p>
              <p className="text-sm sm:text-lg font-black text-white truncate max-w-[120px] sm:max-w-none">{userProfile.name}</p>
            </div>
          </div>
          
          <div className="flex gap-2 sm:gap-3 w-full sm:w-auto justify-end">
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 flex items-center gap-1.5 sm:gap-2">
              <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300" />
              <span className="text-base sm:text-xl font-black text-white">{coins}</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 flex items-center gap-1.5 sm:gap-2">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 fill-yellow-300" />
              <span className="text-base sm:text-xl font-black text-white">{totalStars}</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 flex items-center gap-1.5 sm:gap-2">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-purple-300" />
              <span className="text-base sm:text-xl font-black text-white">{hints}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="text-center space-y-6 sm:space-y-8 animate-fadeIn">
          {/* Logo and Title */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex justify-center">
              <div className="bg-white p-4 sm:p-6 md:p-8 rounded-full shadow-2xl transform hover:scale-110 transition-transform duration-300">
                <Brain className="w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 text-purple-600" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white drop-shadow-lg tracking-tight px-2">
              MINDSPARK
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white drop-shadow-md px-2">
              Ultimate Brain Puzzles
            </p>
          </div>

          {/* Featured Modes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto mb-6 sm:mb-8">
            <Button
              onClick={() => navigate('/daily-challenge')}
              className="h-24 sm:h-28 md:h-32 text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-2xl sm:rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-2 right-2 bg-yellow-400 text-red-600 text-xs font-black px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                DAILY
              </div>
              <div className="flex flex-col items-center">
                <Star className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mb-1 sm:mb-2 fill-white" />
                <span>Daily Challenge</span>
              </div>
            </Button>

            <Button
              onClick={() => navigate('/time-attack')}
              className="h-24 sm:h-28 md:h-32 text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 text-white rounded-2xl sm:rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-2 right-2 bg-yellow-400 text-purple-600 text-xs font-black px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                HOT
              </div>
              <div className="flex flex-col items-center">
                <Zap className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mb-1 sm:mb-2" />
                <span>Time Attack</span>
              </div>
            </Button>
          </div>

          {/* Main Menu Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 max-w-6xl mx-auto">
            <Button
              onClick={() => navigate('/categories')}
              className="h-20 sm:h-24 text-sm sm:text-base md:text-lg font-bold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-2xl sm:rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <div className="flex flex-col items-center gap-1 sm:gap-2">
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8" />
                <span>Categories</span>
              </div>
            </Button>

            <Button
              onClick={() => navigate('/levels')}
              className="h-20 sm:h-24 text-sm sm:text-base md:text-lg font-bold bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white rounded-2xl sm:rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <div className="flex flex-col items-center gap-1 sm:gap-2">
                <Play className="w-6 h-6 sm:w-8 sm:h-8" />
                <span>All Levels</span>
              </div>
            </Button>

            <Button
              onClick={() => navigate('/tournament')}
              className="h-20 sm:h-24 text-sm sm:text-base md:text-lg font-bold bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white rounded-2xl sm:rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <div className="flex flex-col items-center gap-1 sm:gap-2">
                <Trophy className="w-6 h-6 sm:w-8 sm:h-8" />
                <span>Tournament</span>
              </div>
            </Button>

            <Button
              onClick={() => navigate('/leaderboard')}
              className="h-20 sm:h-24 text-sm sm:text-base md:text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-500 hover:from-blue-500 hover:to-cyan-600 text-white rounded-2xl sm:rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <div className="flex flex-col items-center gap-1 sm:gap-2">
                <Trophy className="w-6 h-6 sm:w-8 sm:h-8" />
                <span>Leaderboard</span>
              </div>
            </Button>

            <Button
              onClick={() => navigate('/shop')}
              className="h-20 sm:h-24 text-sm sm:text-base md:text-lg font-bold bg-gradient-to-r from-pink-400 to-rose-500 hover:from-pink-500 hover:to-rose-600 text-white rounded-2xl sm:rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <div className="flex flex-col items-center gap-1 sm:gap-2">
                <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8" />
                <span>Shop</span>
              </div>
            </Button>

            <Button
              onClick={() => navigate('/profile')}
              className="h-20 sm:h-24 text-sm sm:text-base md:text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white rounded-2xl sm:rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <div className="flex flex-col items-center gap-1 sm:gap-2">
                <User className="w-6 h-6 sm:w-8 sm:h-8" />
                <span>Profile</span>
              </div>
            </Button>

            <Button
              onClick={() => navigate('/progress')}
              className="h-20 sm:h-24 text-sm sm:text-base md:text-lg font-bold bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white rounded-2xl sm:rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <div className="flex flex-col items-center gap-1 sm:gap-2">
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8" />
                <span>Analytics</span>
              </div>
            </Button>

            <Button
              onClick={() => navigate('/settings')}
              className="h-20 sm:h-24 text-sm sm:text-base md:text-lg font-bold bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white rounded-2xl sm:rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <div className="flex flex-col items-center gap-1 sm:gap-2">
                <Settings className="w-6 h-6 sm:w-8 sm:h-8" />
                <span>Settings</span>
              </div>
            </Button>
          </div>

          {/* Quick Rewards */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-2xl mx-auto mb-6">
            <Button
              onClick={() => navigate('/daily-rewards')}
              className="h-18 sm:h-20 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold rounded-xl sm:rounded-2xl shadow-xl transform hover:scale-105 transition-all"
            >
              <div className="flex flex-col items-center">
                <span className="text-2xl sm:text-3xl mb-1">🎁</span>
                <span className="text-xs sm:text-sm">Daily Login</span>
              </div>
            </Button>
            <Button
              onClick={() => navigate('/ad-rewards')}
              className="h-18 sm:h-20 bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white font-bold rounded-xl sm:rounded-2xl shadow-xl transform hover:scale-105 transition-all"
            >
              <div className="flex flex-col items-center">
                <span className="text-2xl sm:text-3xl mb-1">📺</span>
                <span className="text-xs sm:text-sm">Watch & Earn</span>
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
