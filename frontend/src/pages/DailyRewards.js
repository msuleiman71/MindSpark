import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ArrowLeft, Gift, Coins, Star, Zap, CheckCircle2, Lock } from 'lucide-react';
import { soundManager } from '../data/soundEffects';

const DailyRewards = () => {
  const navigate = useNavigate();
  const { addCoins, setHints, hints } = useGame();
  const [currentDay, setCurrentDay] = useState(0);
  const [lastClaim, setLastClaim] = useState(null);

  const rewards = [
    { day: 1, coins: 50, hints: 0, icon: Coins, color: 'from-yellow-400 to-orange-500' },
    { day: 2, coins: 75, hints: 1, icon: Zap, color: 'from-blue-400 to-cyan-500' },
    { day: 3, coins: 100, hints: 0, icon: Coins, color: 'from-green-400 to-emerald-500' },
    { day: 4, coins: 125, hints: 1, icon: Zap, color: 'from-purple-400 to-pink-500' },
    { day: 5, coins: 150, hints: 2, icon: Star, color: 'from-orange-400 to-red-500' },
    { day: 6, coins: 200, hints: 0, icon: Coins, color: 'from-indigo-400 to-purple-500' },
    { day: 7, coins: 500, hints: 5, icon: Gift, color: 'from-pink-500 to-rose-600' },
  ];

  useEffect(() => {
    const saved = localStorage.getItem('dailyRewardsDay');
    const savedDate = localStorage.getItem('lastRewardClaim');
    const today = new Date().toDateString();

    if (savedDate === today) {
      setCurrentDay(parseInt(saved) || 1);
      setLastClaim(savedDate);
    } else {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      if (savedDate === yesterday) {
        const nextDay = Math.min((parseInt(saved) || 0) + 1, 7);
        setCurrentDay(nextDay);
      } else {
        setCurrentDay(1);
      }
    }
  }, []);

  const canClaim = () => {
    const today = new Date().toDateString();
    return lastClaim !== today;
  };

  const claimReward = () => {
    if (!canClaim()) return;

    const reward = rewards[currentDay - 1];
    addCoins(reward.coins);
    if (reward.hints > 0) {
      setHints(hints + reward.hints);
    }

    soundManager.play('coin');
    const today = new Date().toDateString();
    localStorage.setItem('lastRewardClaim', today);
    localStorage.setItem('dailyRewardsDay', currentDay.toString());
    setLastClaim(today);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            onClick={() => navigate('/')}
            className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm rounded-full h-12 px-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <h1 className="text-4xl font-black text-white drop-shadow-lg flex items-center gap-3">
            <Gift className="w-10 h-10" />
            Daily Rewards
          </h1>
          <div className="w-24"></div>
        </div>

        {/* Streak Info */}
        <Card className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl text-center">
          <h2 className="text-4xl font-black text-gray-800 mb-4">
            Day {currentDay} Streak! 🔥
          </h2>
          <p className="text-lg text-gray-600">
            {canClaim() ? 'Claim your reward below!' : 'Come back tomorrow for your next reward!'}
          </p>
        </Card>

        {/* Rewards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {rewards.map((reward, index) => {
            const Icon = reward.icon;
            const isPast = reward.day < currentDay;
            const isCurrent = reward.day === currentDay;
            const isFuture = reward.day > currentDay;

            return (
              <Card
                key={reward.day}
                className={`p-6 rounded-3xl shadow-2xl text-center transform transition-all ${
                  isCurrent ? 'scale-110 ring-4 ring-yellow-400' : ''
                } ${
                  isPast ? 'opacity-50' : 'hover:scale-105'
                }`}
              >
                <div className={`bg-gradient-to-r ${reward.color} p-6 rounded-2xl mb-4 relative`}>
                  {isPast && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-2xl">
                      <CheckCircle2 className="w-12 h-12 text-white" />
                    </div>
                  )}
                  {isFuture && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl">
                      <Lock className="w-12 h-12 text-white" />
                    </div>
                  )}
                  <Icon className="w-12 h-12 text-white mx-auto" />
                </div>
                <p className="text-2xl font-black text-gray-800 mb-2">Day {reward.day}</p>
                <div className="space-y-1">
                  <p className="text-lg font-bold text-yellow-600">{reward.coins} Coins</p>
                  {reward.hints > 0 && (
                    <p className="text-sm font-semibold text-purple-600">+{reward.hints} Hints</p>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Claim Button */}
        {canClaim() && (
          <Card className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 rounded-3xl shadow-2xl text-center">
            <Button
              onClick={claimReward}
              className="h-20 px-12 text-3xl font-black bg-white text-green-600 hover:bg-gray-100 rounded-2xl transform hover:scale-105 transition-all"
            >
              Claim Day {currentDay} Reward!
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DailyRewards;
