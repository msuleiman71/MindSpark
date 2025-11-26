import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ArrowLeft, TrendingUp, Brain, Target, Clock, Award, Star } from 'lucide-react';
import { categories } from '../data/puzzleCategories';

const ProgressAnalytics = () => {
  const navigate = useNavigate();
  const { levelProgress, completedLevels, userProfile } = useGame();

  // Calculate stats
  const totalStars = Object.values(levelProgress).reduce((sum, p) => sum + (p.stars || 0), 0);
  const totalLevels = completedLevels.length;
  const averageStars = totalLevels > 0 ? (totalStars / totalLevels).toFixed(2) : 0;
  const perfectLevels = Object.values(levelProgress).filter(p => p.stars === 3).length;
  
  // Category performance
  const categoryStats = Object.values(categories).map(cat => {
    const categoryLevels = Object.entries(levelProgress).filter(([id, _]) => {
      // This is simplified - you'd need to match puzzle IDs to categories
      return true;
    });
    return {
      category: cat,
      completed: Math.floor(Math.random() * 10), // Placeholder
      averageStars: (Math.random() * 3).toFixed(1)
    };
  });

  // Performance trends
  const improvementRate = totalLevels > 5 ? '+15%' : '+0%';
  const averageTime = '45s';
  const accuracy = totalLevels > 0 ? Math.min(100, (perfectLevels / totalLevels) * 100).toFixed(0) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-400 to-indigo-500 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            onClick={() => navigate('/profile')}
            className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm rounded-full h-12 px-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <h1 className="text-4xl font-black text-white drop-shadow-lg">Progress Analytics</h1>
          <div className="w-24"></div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-xl text-center">
            <Brain className="w-12 h-12 mx-auto mb-3 text-purple-600" />
            <p className="text-4xl font-black text-gray-800">{totalLevels}</p>
            <p className="text-sm font-semibold text-gray-600">Puzzles Solved</p>
          </Card>
          <Card className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-xl text-center">
            <Star className="w-12 h-12 mx-auto mb-3 text-yellow-600 fill-yellow-600" />
            <p className="text-4xl font-black text-gray-800">{averageStars}</p>
            <p className="text-sm font-semibold text-gray-600">Avg Stars</p>
          </Card>
          <Card className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-xl text-center">
            <Target className="w-12 h-12 mx-auto mb-3 text-green-600" />
            <p className="text-4xl font-black text-gray-800">{accuracy}%</p>
            <p className="text-sm font-semibold text-gray-600">Accuracy</p>
          </Card>
          <Card className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-xl text-center">
            <TrendingUp className="w-12 h-12 mx-auto mb-3 text-blue-600" />
            <p className="text-4xl font-black text-gray-800">{improvementRate}</p>
            <p className="text-sm font-semibold text-gray-600">Improvement</p>
          </Card>
        </div>

        {/* Performance Chart */}
        <Card className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl">
          <h3 className="text-3xl font-black text-gray-800 mb-6">Performance Overview</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-gray-700">Perfect Scores (3 stars)</span>
                <span className="font-black text-green-600">{perfectLevels}/{totalLevels}</span>
              </div>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-emerald-600"
                  style={{ width: `${totalLevels > 0 ? (perfectLevels / totalLevels) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-gray-700">Good Scores (2 stars)</span>
                <span className="font-black text-blue-600">
                  {Object.values(levelProgress).filter(p => p.stars === 2).length}/{totalLevels}
                </span>
              </div>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-400 to-cyan-600"
                  style={{
                    width: `${totalLevels > 0 ? (Object.values(levelProgress).filter(p => p.stars === 2).length / totalLevels) * 100 : 0}%`
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-gray-700">Completed (1 star)</span>
                <span className="font-black text-yellow-600">
                  {Object.values(levelProgress).filter(p => p.stars === 1).length}/{totalLevels}
                </span>
              </div>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
                  style={{
                    width: `${totalLevels > 0 ? (Object.values(levelProgress).filter(p => p.stars === 1).length / totalLevels) * 100 : 0}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
        </Card>

        {/* Category Performance */}
        <Card className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl">
          <h3 className="text-3xl font-black text-gray-800 mb-6">Category Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categoryStats.map(stat => (
              <div key={stat.category.id} className="p-6 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-5xl">{stat.category.icon}</span>
                  <div>
                    <h4 className="text-2xl font-black text-gray-800">{stat.category.name}</h4>
                    <p className="text-sm text-gray-600">{stat.completed} puzzles completed</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-600">Avg Stars:</span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(stat.averageStars)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-lg font-black text-gray-800">{stat.averageStars}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Achievements Progress */}
        <Card className="bg-gradient-to-r from-purple-500 to-pink-600 p-8 rounded-3xl shadow-2xl text-white">
          <div className="text-center">
            <Award className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-3xl font-black mb-2">Keep Going!</h3>
            <p className="text-lg opacity-90">You're {100 - accuracy}% away from perfect accuracy!</p>
            <Button
              onClick={() => navigate('/levels')}
              className="mt-6 h-14 px-8 text-xl font-bold bg-white text-purple-600 hover:bg-gray-100 rounded-2xl"
            >
              Continue Training
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProgressAnalytics;
