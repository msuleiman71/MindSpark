import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ArrowLeft, Video, Coins, Zap, Gift } from 'lucide-react';
import { soundManager } from '../data/soundEffects';

const AdReward = () => {
  const navigate = useNavigate();
  const { addCoins, setHints, hints } = useGame();
  const [isWatching, setIsWatching] = useState(false);
  const [adsWatched, setAdsWatched] = useState(
    parseInt(localStorage.getItem('adsWatchedToday') || '0')
  );

  const rewards = [
    { id: 1, name: '50 Coins', reward: 50, type: 'coins', icon: Coins, color: 'from-yellow-400 to-orange-500' },
    { id: 2, name: '3 Hints', reward: 3, type: 'hints', icon: Zap, color: 'from-purple-400 to-pink-500' },
    { id: 3, name: '100 Coins', reward: 100, type: 'coins', icon: Coins, color: 'from-green-400 to-emerald-500' },
    { id: 4, name: 'Mystery Box', reward: 'mystery', type: 'mystery', icon: Gift, color: 'from-blue-400 to-cyan-500' },
  ];

  const watchAd = (reward) => {
    setIsWatching(true);

    // Simulate 5 second ad
    setTimeout(() => {
      if (reward.type === 'coins') {
        addCoins(reward.reward);
      } else if (reward.type === 'hints') {
        setHints(hints + reward.reward);
      } else if (reward.type === 'mystery') {
        const randomCoins = Math.floor(Math.random() * 200) + 50;
        addCoins(randomCoins);
      }

      soundManager.play('coin');
      const newCount = adsWatched + 1;
      setAdsWatched(newCount);
      localStorage.setItem('adsWatchedToday', newCount.toString());
      setIsWatching(false);
    }, 5000);
  };

  const maxAds = 10;
  const remaining = maxAds - adsWatched;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            onClick={() => navigate('/shop')}
            className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm rounded-full h-12 px-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <h1 className="text-4xl font-black text-white drop-shadow-lg flex items-center gap-3">
            <Video className="w-10 h-10" />
            Earn Rewards
          </h1>
          <div className="w-24"></div>
        </div>

        {/* Info Card */}
        <Card className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl text-center">
          <Video className="w-16 h-16 mx-auto mb-4 text-purple-600" />
          <h2 className="text-4xl font-black text-gray-800 mb-4">Watch & Earn</h2>
          <p className="text-lg text-gray-600 mb-4">
            Watch short video ads to earn coins and hints!
          </p>
          <div className="inline-block bg-gradient-to-r from-purple-100 to-pink-100 px-6 py-3 rounded-full">
            <p className="text-2xl font-black text-purple-600">
              {remaining}/{maxAds} ads remaining today
            </p>
          </div>
        </Card>

        {/* Reward Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rewards.map((reward) => {
            const Icon = reward.icon;
            return (
              <Card
                key={reward.id}
                className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden"
              >
                <div className={`bg-gradient-to-r ${reward.color} p-8 text-center`}>
                  <Icon className="w-16 h-16 text-white mx-auto mb-4" />
                  <h3 className="text-3xl font-black text-white">{reward.name}</h3>
                </div>
                <div className="p-6 text-center">
                  <p className="text-lg text-gray-600 mb-4">
                    Watch a 15-second video
                  </p>
                  <Button
                    onClick={() => watchAd(reward)}
                    disabled={remaining <= 0 || isWatching}
                    className={`w-full h-14 text-xl font-bold bg-gradient-to-r ${reward.color} hover:opacity-90 text-white rounded-2xl`}
                  >
                    {isWatching ? 'Watching Ad...' : 'Watch & Earn'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Watching Ad Overlay */}
        {isWatching && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
            <Card className="bg-white p-12 rounded-3xl shadow-2xl text-center max-w-md">
              <div className="animate-spin w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-6"></div>
              <h3 className="text-3xl font-black text-gray-800 mb-2">Watching Ad...</h3>
              <p className="text-lg text-gray-600">Please wait 5 seconds</p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdReward;
