import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ArrowLeft, Trophy, Star, Coins, Zap, Target, Clock, Award } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const { userProfile, levelProgress, completedLevels, coins, hints, lives, powerUps } = useGame();

  const totalStars = Object.values(levelProgress).reduce((sum, progress) => sum + (progress.stars || 0), 0);
  const totalLevels = completedLevels.length;
  const averageStars = totalLevels > 0 ? (totalStars / totalLevels).toFixed(1) : 0;

  const stats = [
    { icon: Trophy, label: 'Levels Completed', value: totalLevels, color: 'text-yellow-600' },
    { icon: Star, label: 'Total Stars', value: totalStars, color: 'text-blue-600' },
    { icon: Coins, label: 'Coins', value: coins, color: 'text-amber-600' },
    { icon: Zap, label: 'Hints Left', value: hints, color: 'text-purple-600' },
    { icon: Target, label: 'Lives', value: lives, color: 'text-red-600' },
    { icon: Award, label: 'Avg Stars', value: averageStars, color: 'text-green-600' }
  ];

  const achievements = [
    { id: 1, name: 'First Steps', desc: 'Complete 1 level', unlocked: totalLevels >= 1, icon: '🎯' },
    { id: 2, name: 'Getting Started', desc: 'Complete 5 levels', unlocked: totalLevels >= 5, icon: '🚀' },
    { id: 3, name: 'Half Way', desc: 'Complete 10 levels', unlocked: totalLevels >= 10, icon: '⭐' },
    { id: 4, name: 'Perfect Player', desc: 'Get 3 stars on 5 levels', unlocked: Object.values(levelProgress).filter(p => p.stars === 3).length >= 5, icon: '💎' },
    { id: 5, name: 'Coin Collector', desc: 'Earn 500 coins', unlocked: coins >= 500, icon: '💰' },
    { id: 6, name: 'Brain Master', desc: 'Complete all levels', unlocked: totalLevels >= 15, icon: '🧠' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            onClick={() => navigate('/')}
            className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm rounded-full h-12 px-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <h1 className="text-4xl font-black text-white drop-shadow-lg">Profile</h1>
          <div className="w-24"></div>
        </div>

        {/* User Card */}
        <Card className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-2xl">
          <div className="flex items-center gap-6">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-8 rounded-full">
              <span className="text-6xl">{userProfile.avatar}</span>
            </div>
            <div className="flex-1">
              <h2 className="text-4xl font-black text-gray-800">{userProfile.name}</h2>
              <p className="text-xl text-gray-600 mt-2">Level {userProfile.level} Player</p>
              <div className="flex gap-4 mt-4">
                <Button
                  onClick={() => navigate('/shop')}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold rounded-full"
                >
                  <Coins className="w-5 h-5 mr-2" />
                  {coins} Coins
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl hover:scale-105 transition-transform">
                <div className="flex items-center gap-4">
                  <div className={`${stat.color} bg-opacity-10 p-4 rounded-full`}>
                    <Icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-3xl font-black text-gray-800">{stat.value}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Achievements */}
        <Card className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-2xl">
          <h3 className="text-3xl font-black text-gray-800 mb-6 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-600" />
            Achievements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-6 rounded-2xl border-2 transition-all ${
                  achievement.unlocked
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300'
                    : 'bg-gray-50 border-gray-300 opacity-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-5xl">{achievement.icon}</span>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-800">{achievement.name}</h4>
                    <p className="text-sm text-gray-600">{achievement.desc}</p>
                  </div>
                  {achievement.unlocked && (
                    <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      ✓ Unlocked
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Power-ups Inventory */}
        <Card className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-2xl">
          <h3 className="text-3xl font-black text-gray-800 mb-6 flex items-center gap-3">
            <Zap className="w-8 h-8 text-purple-600" />
            Power-ups Inventory
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border-2 border-blue-200">
              <div className="text-center">
                <span className="text-5xl">⏭️</span>
                <h4 className="text-lg font-bold text-gray-800 mt-2">Skip Level</h4>
                <p className="text-3xl font-black text-blue-600 mt-2">{powerUps.skipLevel}</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border-2 border-purple-200">
              <div className="text-center">
                <span className="text-5xl">❄️</span>
                <h4 className="text-lg font-bold text-gray-800 mt-2">Freeze Timer</h4>
                <p className="text-3xl font-black text-purple-600 mt-2">{powerUps.freezeTimer}</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-2xl border-2 border-yellow-200">
              <div className="text-center">
                <span className="text-5xl">💡</span>
                <h4 className="text-lg font-bold text-gray-800 mt-2">Extra Hints</h4>
                <p className="text-3xl font-black text-yellow-600 mt-2">{powerUps.extraHints}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
