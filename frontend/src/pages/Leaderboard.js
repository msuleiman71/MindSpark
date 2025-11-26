import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';
import { leaderboardAPI } from '../services/api';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ArrowLeft, Trophy, Medal, Crown, Star, Loader } from 'lucide-react';

const Leaderboard = () => {
  const navigate = useNavigate();
  const { leaderboard: mockLeaderboard, userProfile } = useGame();
  const { isAuthenticated } = useAuth();
  const [leaderboard, setLeaderboard] = useState(mockLeaderboard);
  const [timeframe, setTimeframe] = useState('all');
  const [loading, setLoading] = useState(false);

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown className="w-8 h-8 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-8 h-8 text-gray-400" />;
    if (rank === 3) return <Medal className="w-8 h-8 text-amber-600" />;
    return <span className="text-2xl font-black text-gray-600">#{rank}</span>;
  };

  const getRankBg = (rank) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-500';
    if (rank === 3) return 'bg-gradient-to-r from-amber-400 to-amber-600';
    return 'bg-gradient-to-r from-blue-400 to-purple-500';
  };

  // Load leaderboard from backend
  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (isAuthenticated) {
        setLoading(true);
        try {
          const data = await leaderboardAPI.getLeaderboard(100);
          if (data && data.length > 0) {
            // Transform backend data to match component format
            const transformedData = data.map(entry => ({
              rank: entry.rank,
              name: entry.name,
              avatar: entry.avatar,
              score: entry.total_stars,
              puzzlesCompleted: entry.puzzles_completed
            }));
            setLeaderboard(transformedData);
          }
        } catch (err) {
          console.error('Failed to load leaderboard:', err);
          // Keep using mock data on error
        } finally {
          setLoading(false);
        }
      }
    };

    fetchLeaderboard();
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-4">
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
            <Trophy className="w-10 h-10 text-yellow-300" />
            Leaderboard
          </h1>
          <div className="w-24"></div>
        </div>

        {/* Auth Notice */}
        {!isAuthenticated && (
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center">
            <p className="text-white font-semibold">
              📊 Showing mock data. <button onClick={() => navigate('/login')} className="underline">Login</button> to see real leaderboard!
            </p>
          </div>
        )}

        {/* Time Filter */}
        <div className="flex justify-center gap-2">
          {['all', 'weekly', 'monthly'].map((tf) => (
            <Button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`${
                timeframe === tf
                  ? 'bg-white text-purple-600'
                  : 'bg-white/20 text-white'
              } hover:bg-white/30 backdrop-blur-sm rounded-full h-10 px-6 font-bold capitalize`}
            >
              {tf === 'all' ? 'All Time' : tf}
            </Button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader className="w-12 h-12 text-white animate-spin" />
          </div>
        )}

        {/* Top 3 Podium */}
        {!loading && (
        <div className="grid grid-cols-3 gap-4 items-end">
          {/* Second Place */}
          {leaderboard[1] && (
            <Card className="bg-white/95 backdrop-blur-sm p-6 rounded-3xl shadow-2xl text-center transform hover:scale-105 transition-transform">
              <div className="bg-gradient-to-br from-gray-300 to-gray-500 w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4">
                <span className="text-4xl">{leaderboard[1].avatar}</span>
              </div>
              <Medal className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <h3 className="text-xl font-black text-gray-800">{leaderboard[1].name}</h3>
              <p className="text-2xl font-bold text-gray-600 mt-2">{leaderboard[1].score}</p>
              <div className="bg-gray-100 px-4 py-2 rounded-full mt-3 inline-block">
                <span className="text-lg font-bold text-gray-600">#2</span>
              </div>
            </Card>
          )}

          {/* First Place */}
          {leaderboard[0] && (
            <Card className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl text-center transform scale-110 hover:scale-115 transition-transform">
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-4 ring-4 ring-yellow-300">
                <span className="text-5xl">{leaderboard[0].avatar}</span>
              </div>
              <Crown className="w-16 h-16 text-yellow-500 mx-auto mb-2" />
              <h3 className="text-2xl font-black text-gray-800">{leaderboard[0].name}</h3>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{leaderboard[0].score}</p>
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 px-6 py-2 rounded-full mt-3 inline-block">
                <span className="text-xl font-bold text-white">#1</span>
              </div>
            </Card>
          )}

          {/* Third Place */}
          {leaderboard[2] && (
            <Card className="bg-white/95 backdrop-blur-sm p-6 rounded-3xl shadow-2xl text-center transform hover:scale-105 transition-transform">
              <div className="bg-gradient-to-br from-amber-400 to-amber-600 w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4">
                <span className="text-4xl">{leaderboard[2].avatar}</span>
              </div>
              <Medal className="w-12 h-12 text-amber-600 mx-auto mb-2" />
              <h3 className="text-xl font-black text-gray-800">{leaderboard[2].name}</h3>
              <p className="text-2xl font-bold text-gray-600 mt-2">{leaderboard[2].score}</p>
              <div className="bg-amber-100 px-4 py-2 rounded-full mt-3 inline-block">
                <span className="text-lg font-bold text-amber-600">#3</span>
              </div>
            </Card>
          )}
        </div>

        {/* Rest of Leaderboard */}
        <Card className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
          <div className="divide-y divide-gray-200">
            {leaderboard.slice(3).map((player) => (
              <div key={player.rank} className="p-6 hover:bg-gray-50 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 flex items-center justify-center">
                    {getRankIcon(player.rank)}
                  </div>
                  <div className="bg-gradient-to-br from-purple-400 to-pink-500 w-14 h-14 rounded-full flex items-center justify-center">
                    <span className="text-3xl">{player.avatar}</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-800">{player.name}</h4>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm text-gray-600">Level {Math.floor(player.score / 1000)}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-gray-800">{player.score}</p>
                  <p className="text-sm text-gray-500">points</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Your Rank */}
        <Card className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-3xl shadow-2xl">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-full flex items-center justify-center">
                <span className="text-4xl">{userProfile.avatar}</span>
              </div>
              <div>
                <p className="text-sm opacity-80">Your Rank</p>
                <h4 className="text-2xl font-black">{userProfile.name}</h4>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-80">Score</p>
              <p className="text-3xl font-black">{userProfile.totalScore}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Leaderboard;
