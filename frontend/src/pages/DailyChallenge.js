import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ArrowLeft, Trophy, Star, Coins, Flame, CheckCircle2, Lock } from 'lucide-react';
import { generateDailyChallenge } from '../data/dailyChallenges';
import { useToast } from '../components/ui/use-toast';

const DailyChallenge = () => {
  const navigate = useNavigate();
  const { completedLevels, coins, levelProgress, addCoins } = useGame();
  const [dailyChallenge, setDailyChallenge] = useState(null);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const challenge = generateDailyChallenge();
    setDailyChallenge(challenge);

    // Load streak from localStorage
    const savedStreak = localStorage.getItem('dailyStreak');
    const lastCompleted = localStorage.getItem('lastDailyCompleted');
    const today = new Date().toDateString();

    if (lastCompleted === today) {
      setStreak(parseInt(savedStreak) || 1);
    } else {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      if (lastCompleted === yesterday) {
        setStreak(parseInt(savedStreak) || 0);
      } else {
        setStreak(0);
      }
    }
  }, []);

  const isPuzzleCompleted = (puzzleId) => {
    return completedLevels.includes(puzzleId);
  };

  const getCompletedCount = () => {
    if (!dailyChallenge) return 0;
    return dailyChallenge.puzzles.filter(p => isPuzzleCompleted(p.id)).length;
  };

  const isAllCompleted = () => {
    return getCompletedCount() === 3;
  };

  const claimReward = () => {
    if (!isAllCompleted()) return;
    
    const today = new Date().toDateString();
    const lastClaimed = localStorage.getItem('lastDailyChallengeReward');
    
    // Check if already claimed today
    if (lastClaimed === today) {
      alert('✅ You have already claimed today\'s reward!');
      return;
    }
    
    const newStreak = streak + 1;
    setStreak(newStreak);
    localStorage.setItem('dailyStreak', newStreak.toString());
    localStorage.setItem('lastDailyCompleted', today);
    localStorage.setItem('lastDailyChallengeReward', today);
    
    // Add rewards through game context
    addCoins(dailyChallenge.reward);
    
    alert(`🎉 Rewards Claimed!\n\n+${dailyChallenge.reward} Coins\n+${dailyChallenge.bonusStars} Bonus Stars`);
  };

  if (!dailyChallenge) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-400 to-pink-400 p-4">
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
          <h1 className="text-4xl font-black text-white drop-shadow-lg">Daily Challenge</h1>
          <div className="w-24"></div>
        </div>

        {/* Streak Card */}
        <Card className="bg-gradient-to-r from-orange-500 to-red-600 p-6 rounded-3xl shadow-2xl">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                <Flame className="w-12 h-12 text-yellow-300" />
              </div>
              <div>
                <p className="text-sm opacity-80">Current Streak</p>
                <p className="text-5xl font-black">{streak} Days</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-80">Completed</p>
              <p className="text-4xl font-black">{getCompletedCount()}/3</p>
            </div>
          </div>
        </Card>

        {/* Today's Challenges */}
        <Card className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl">
          <h3 className="text-3xl font-black text-gray-800 mb-6">Today's Puzzles</h3>
          <div className="space-y-4">
            {dailyChallenge.puzzles.map((puzzle, index) => {
              const completed = isPuzzleCompleted(puzzle.id);
              const stars = levelProgress[puzzle.id]?.stars || 0;

              return (
                <div
                  key={puzzle.id}
                  className={`p-6 rounded-2xl border-2 transition-all ${
                    completed
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300'
                      : 'bg-gray-50 border-gray-200 hover:border-orange-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-2xl ${
                        completed ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-xl font-bold text-gray-800">{puzzle.question}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-semibold text-gray-600">
                            {puzzle.category.name}
                          </span>
                          <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                            puzzle.difficulty.color
                          } bg-gray-100`}>
                            {puzzle.difficulty.name}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {completed ? (
                        <>
                          <div className="flex gap-1">
                            {Array.from({ length: 3 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-6 h-6 ${
                                  i < stars
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <CheckCircle2 className="w-8 h-8 text-green-600" />
                        </>
                      ) : (
                        <Button
                          onClick={() => navigate(`/puzzle/${puzzle.id}`)}
                          className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold rounded-2xl"
                        >
                          Start
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Rewards */}
        <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 p-8 rounded-3xl shadow-2xl">
          <div className="text-center text-white space-y-4">
            <Trophy className="w-16 h-16 mx-auto" />
            <h3 className="text-3xl font-black">Daily Rewards</h3>
            <div className="flex justify-center gap-8">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                <Coins className="w-8 h-8 mx-auto mb-2" />
                <p className="text-2xl font-black">+{dailyChallenge.reward}</p>
                <p className="text-sm opacity-80">Coins</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                <Star className="w-8 h-8 mx-auto mb-2 fill-white" />
                <p className="text-2xl font-black">+{dailyChallenge.bonusStars}</p>
                <p className="text-sm opacity-80">Bonus Stars</p>
              </div>
            </div>
            {isAllCompleted() ? (
              <Button
                onClick={claimReward}
                className="bg-white text-orange-600 hover:bg-gray-100 font-black text-xl h-14 px-8 rounded-2xl transform hover:scale-105 transition-all"
              >
                Claim Rewards!
              </Button>
            ) : (
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                <Lock className="w-8 h-8 mx-auto mb-2" />
                <p className="text-lg font-semibold">Complete all 3 puzzles to claim!</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DailyChallenge;
