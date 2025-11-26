import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ArrowLeft, Trophy, Clock, Star, Zap, Medal } from 'lucide-react';

const WeeklyTournament = () => {
  const navigate = useNavigate();
  const { userProfile } = useGame();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    // Calculate time until next Sunday midnight
    const calculateTimeLeft = () => {
      const now = new Date();
      const nextSunday = new Date();
      nextSunday.setDate(now.getDate() + (7 - now.getDay()));
      nextSunday.setHours(23, 59, 59, 999);

      const diff = nextSunday.getTime() - now.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setTimeLeft({ days, hours, minutes });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000);
    return () => clearInterval(timer);
  }, []);

  // Mock tournament data
  const topPlayers = [
    { rank: 1, name: 'SpeedMaster', score: 5840, avatar: '🏆' },
    { rank: 2, name: 'BrainKing', score: 5620, avatar: '👑' },
    { rank: 3, name: 'PuzzlePro', score: 5390, avatar: '⭐' },
    { rank: 4, name: 'QuickThinker', score: 5180, avatar: '⚡' },
    { rank: 5, name: 'MindMaster', score: 4950, avatar: '🧠' },
  ];

  const rewards = [
    { place: '1st', reward: '1000 Coins + Premium Badge', color: 'from-yellow-400 to-orange-500' },
    { place: '2nd', reward: '500 Coins + Silver Badge', color: 'from-gray-300 to-gray-500' },
    { place: '3rd', reward: '250 Coins + Bronze Badge', color: 'from-amber-400 to-amber-600' },
    { place: '4-10th', reward: '100 Coins', color: 'from-blue-400 to-purple-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 p-4">
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
          <h1 className="text-4xl font-black text-white drop-shadow-lg flex items-center gap-3">
            <Trophy className="w-10 h-10 text-yellow-300" />
            Weekly Tournament
          </h1>
          <div className="w-24"></div>
        </div>

        {/* Timer */}
        <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 p-8 rounded-3xl shadow-2xl">
          <div className="text-center text-white space-y-4">
            <Clock className="w-16 h-16 mx-auto" />
            <h2 className="text-3xl font-black">Tournament Ends In</h2>
            <div className="flex justify-center gap-6">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl min-w-[100px]">
                <p className="text-5xl font-black">{timeLeft.days}</p>
                <p className="text-sm">Days</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl min-w-[100px]">
                <p className="text-5xl font-black">{timeLeft.hours}</p>
                <p className="text-sm">Hours</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl min-w-[100px]">
                <p className="text-5xl font-black">{timeLeft.minutes}</p>
                <p className="text-sm">Minutes</p>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Leaderboard */}
          <Card className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl">
            <h3 className="text-3xl font-black text-gray-800 mb-6">Top Players</h3>
            <div className="space-y-4">
              {topPlayers.map((player) => (
                <div
                  key={player.rank}
                  className={`p-4 rounded-2xl flex items-center justify-between ${
                    player.rank <= 3
                      ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200'
                      : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-xl ${
                      player.rank === 1 ? 'bg-yellow-500 text-white' :
                      player.rank === 2 ? 'bg-gray-400 text-white' :
                      player.rank === 3 ? 'bg-amber-600 text-white' :
                      'bg-blue-500 text-white'
                    }`}>
                      {player.rank}
                    </div>
                    <span className="text-4xl">{player.avatar}</span>
                    <span className="text-xl font-bold text-gray-800">{player.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-gray-800">{player.score}</p>
                    <p className="text-sm text-gray-600">points</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Rewards */}
          <div className="space-y-6">
            <Card className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl">
              <h3 className="text-3xl font-black text-gray-800 mb-6">Rewards</h3>
              <div className="space-y-4">
                {rewards.map((reward, index) => (
                  <div
                    key={index}
                    className={`p-6 rounded-2xl bg-gradient-to-r ${reward.color} text-white`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-black">{reward.place} Place</p>
                        <p className="text-sm opacity-90">{reward.reward}</p>
                      </div>
                      {index < 3 && <Medal className="w-12 h-12" />}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 rounded-3xl shadow-2xl text-white text-center">
              <Zap className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-2xl font-black mb-4">Your Current Rank</h3>
              <p className="text-5xl font-black mb-2">#42</p>
              <p className="text-lg opacity-90 mb-6">Score: 1,850 points</p>
              <Button
                onClick={() => navigate('/time-attack')}
                className="h-14 px-8 text-xl font-bold bg-white text-purple-600 hover:bg-gray-100 rounded-2xl"
              >
                Play More to Climb!
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyTournament;
