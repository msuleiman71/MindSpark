import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMultiplayer } from '../context/MultiplayerContext';
import { useGame } from '../context/GameContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ArrowLeft, Users, Swords, Trophy, Clock, Star, Zap } from 'lucide-react';

const Multiplayer = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { 
    isConnected, 
    inMatchmaking, 
    currentGame, 
    opponent, 
    activePlayers,
    joinMatchmaking,
    leaveMatchmaking 
  } = useMultiplayer();
  const { settings } = useGame();

  const themeGradient = 'from-purple-500 via-pink-500 to-red-500';
  const isDark = settings.theme === 'dark';

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // If match found, navigate to game
    if (currentGame && !currentGame.started) {
      navigate(`/multiplayer-game/${currentGame.roomId}`);
    }
  }, [currentGame, navigate]);

  const handleJoinMatchmaking = () => {
    joinMatchmaking();
  };

  const handleLeaveMatchmaking = () => {
    leaveMatchmaking();
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${themeGradient} p-4 ${isDark ? 'dark' : ''}`}>
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
          <div className="text-center">
            <h1 className="text-4xl font-black text-white drop-shadow-lg flex items-center gap-3 justify-center">
              <Swords className="w-10 h-10" />
              Multiplayer
            </h1>
            <p className="text-white/80 text-sm mt-1">
              {isConnected ? `🟢 ${activePlayers} players online` : '🔴 Connecting...'}
            </p>
          </div>
          <div className="w-24"></div>
        </div>

        {/* Matchmaking Status */}
        {!inMatchmaking && !currentGame && (
          <>
            {/* Info Card */}
            <Card className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl text-center">
              <Swords className="w-20 h-20 mx-auto mb-4 text-purple-600" />
              <h2 className="text-4xl font-black text-gray-800 mb-4">1v1 Puzzle Battle</h2>
              <p className="text-lg text-gray-600 mb-6">
                Challenge other players in real-time puzzle battles!
              </p>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-purple-50 p-4 rounded-xl">
                  <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <p className="text-sm font-bold text-gray-800">Earn Stars</p>
                </div>
                <div className="bg-pink-50 p-4 rounded-xl">
                  <Trophy className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm font-bold text-gray-800">Win Rewards</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-xl">
                  <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-sm font-bold text-gray-800">Race Time</p>
                </div>
              </div>
              <Button
                onClick={handleJoinMatchmaking}
                disabled={!isConnected}
                className="w-full h-16 text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl shadow-lg transform hover:scale-105 transition-all"
              >
                <Users className="w-6 h-6 mr-3" />
                Find Match
              </Button>
            </Card>

            {/* Game Modes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 text-center">
                  <Users className="w-12 h-12 text-white mx-auto mb-2" />
                  <h3 className="text-2xl font-black text-white">Quick Match</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4">Find a random opponent and battle!</p>
                  <ul className="space-y-2 text-sm text-gray-600 mb-4">
                    <li>✅ Matchmaking based on skill level</li>
                    <li>✅ 1v1 real-time battles</li>
                    <li>✅ Win coins and stars</li>
                  </ul>
                </div>
              </Card>

              <Card className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden opacity-60">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-center">
                  <Trophy className="w-12 h-12 text-white mx-auto mb-2" />
                  <h3 className="text-2xl font-black text-white">Tournaments</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4">Compete in weekly tournaments!</p>
                  <p className="text-sm text-gray-500 italic">Coming Soon...</p>
                </div>
              </Card>
            </div>
          </>
        )}

        {/* Matchmaking In Progress */}
        {inMatchmaking && (
          <Card className="bg-white/95 backdrop-blur-sm p-12 rounded-3xl shadow-2xl text-center">
            <div className="animate-pulse mb-6">
              <Users className="w-24 h-24 text-purple-600 mx-auto" />
            </div>
            <h2 className="text-4xl font-black text-gray-800 mb-4">Finding Opponent...</h2>
            <p className="text-lg text-gray-600 mb-8">
              Searching for a player at your skill level
            </p>
            <div className="flex justify-center gap-2 mb-8">
              <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-pink-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-3 h-3 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <Button
              onClick={handleLeaveMatchmaking}
              variant="outline"
              className="px-8 py-3 text-lg font-bold border-2 border-gray-300 hover:bg-gray-100"
            >
              Cancel Search
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Multiplayer;
