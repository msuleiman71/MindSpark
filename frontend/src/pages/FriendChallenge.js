import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { ArrowLeft, Users, Share2, Trophy, Swords, Clock } from 'lucide-react';

const FriendChallenge = () => {
  const navigate = useNavigate();
  const { userProfile } = useGame();
  const [friendCode, setFriendCode] = useState('');
  const [myCode] = useState(Math.random().toString(36).substring(2, 8).toUpperCase());

  // Mock challenges
  const activeChallenges = [
    {
      id: 1,
      friend: 'Sarah M.',
      avatar: '👩',
      puzzle: 'Logic Challenge #5',
      yourScore: 850,
      theirScore: 920,
      status: 'losing',
      timeLeft: '2h 15m'
    },
    {
      id: 2,
      friend: 'Mike T.',
      avatar: '👨',
      puzzle: 'Math Puzzle #12',
      yourScore: 1200,
      theirScore: 1150,
      status: 'winning',
      timeLeft: '5h 30m'
    }
  ];

  const completedChallenges = [
    {
      id: 3,
      friend: 'Emma L.',
      avatar: '👧',
      puzzle: 'Visual Test #8',
      yourScore: 950,
      theirScore: 900,
      result: 'won'
    },
    {
      id: 4,
      friend: 'John D.',
      avatar: '👦',
      puzzle: 'Word Challenge #3',
      yourScore: 800,
      theirScore: 850,
      result: 'lost'
    }
  ];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(myCode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-4">
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
            <Swords className="w-10 h-10" />
            Friend Challenges
          </h1>
          <div className="w-24"></div>
        </div>

        {/* Challenge Code */}
        <Card className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl">
          <div className="text-center space-y-6">
            <Users className="w-16 h-16 mx-auto text-purple-600" />
            <div>
              <h3 className="text-3xl font-black text-gray-800 mb-2">Challenge a Friend</h3>
              <p className="text-lg text-gray-600">Share your code or enter theirs</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {/* Your Code */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border-2 border-purple-200">
                <p className="text-sm font-semibold text-gray-600 mb-3">Your Challenge Code</p>
                <div className="bg-white p-4 rounded-xl mb-4">
                  <p className="text-4xl font-black text-purple-600 tracking-wider">{myCode}</p>
                </div>
                <Button
                  onClick={handleCopyCode}
                  className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold rounded-xl"
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Copy & Share
                </Button>
              </div>

              {/* Enter Friend Code */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-2xl border-2 border-blue-200">
                <p className="text-sm font-semibold text-gray-600 mb-3">Enter Friend's Code</p>
                <Input
                  type="text"
                  value={friendCode}
                  onChange={(e) => setFriendCode(e.target.value.toUpperCase())}
                  placeholder="ABC123"
                  className="h-16 text-2xl text-center font-black mb-4 tracking-wider"
                  maxLength={6}
                />
                <Button
                  disabled={friendCode.length !== 6}
                  className="w-full h-12 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-bold rounded-xl"
                >
                  Start Challenge
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Active Challenges */}
        <Card className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl">
          <h3 className="text-3xl font-black text-gray-800 mb-6 flex items-center gap-3">
            <Swords className="w-8 h-8 text-orange-600" />
            Active Challenges
          </h3>
          <div className="space-y-4">
            {activeChallenges.map((challenge) => (
              <div
                key={challenge.id}
                className={`p-6 rounded-2xl border-2 ${
                  challenge.status === 'winning'
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300'
                    : 'bg-gradient-to-r from-red-50 to-orange-50 border-red-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-5xl">{challenge.avatar}</div>
                    <div>
                      <p className="text-xl font-bold text-gray-800">{challenge.friend}</p>
                      <p className="text-sm text-gray-600">{challenge.puzzle}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-xs font-semibold text-gray-500">{challenge.timeLeft} left</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-4 mb-2">
                      <div>
                        <p className="text-sm text-gray-600">You</p>
                        <p className="text-3xl font-black text-blue-600">{challenge.yourScore}</p>
                      </div>
                      <span className="text-2xl font-black text-gray-400">vs</span>
                      <div>
                        <p className="text-sm text-gray-600">Them</p>
                        <p className="text-3xl font-black text-orange-600">{challenge.theirScore}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => navigate('/puzzle/5')}
                      className={`h-10 px-6 font-bold rounded-xl ${
                        challenge.status === 'winning'
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                          : 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                      }`}
                    >
                      {challenge.status === 'winning' ? 'Keep Lead!' : 'Catch Up!'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Completed Challenges */}
        <Card className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl">
          <h3 className="text-3xl font-black text-gray-800 mb-6 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-600" />
            Recent Results
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedChallenges.map((challenge) => (
              <div
                key={challenge.id}
                className={`p-6 rounded-2xl ${
                  challenge.result === 'won'
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50'
                    : 'bg-gradient-to-r from-gray-50 to-gray-100'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{challenge.avatar}</span>
                    <div>
                      <p className="text-lg font-bold text-gray-800">{challenge.friend}</p>
                      <p className="text-sm text-gray-600">{challenge.puzzle}</p>
                    </div>
                  </div>
                  {challenge.result === 'won' ? (
                    <Trophy className="w-8 h-8 text-yellow-600" />
                  ) : (
                    <span className="text-3xl">😔</span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-black text-blue-600">{challenge.yourScore}</span>
                  <span className="text-xl font-black text-gray-400">vs</span>
                  <span className="text-2xl font-black text-orange-600">{challenge.theirScore}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FriendChallenge;
