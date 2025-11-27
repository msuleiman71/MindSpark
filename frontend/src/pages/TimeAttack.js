import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ArrowLeft, Clock, Trophy, Zap } from 'lucide-react';
import { getPuzzlesForMode } from '../data/gameModeAssignments';
import { soundManager } from '../data/soundEffects';

const TimeAttack = () => {
  const navigate = useNavigate();
  const { addCoins } = useGame();
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [currentPuzzle, setCurrentPuzzle] = useState(null);
  const [puzzleQueue, setPuzzleQueue] = useState([]);

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameActive) {
      endGame();
    }
  }, [timeLeft, gameActive]);

  const startGame = () => {
    const shuffled = [...advancedPuzzles].sort(() => Math.random() - 0.5);
    setPuzzleQueue(shuffled.slice(0, 20));
    setCurrentPuzzle(shuffled[0]);
    setGameActive(true);
    setTimeLeft(60);
    setScore(0);
    setStreak(0);
  };

  const handleCorrectAnswer = () => {
    soundManager.play('success');
    const newStreak = streak + 1;
    const points = 100 + (newStreak * 10); // Streak bonus
    setScore(score + points);
    setStreak(newStreak);
    setTimeLeft(timeLeft + 5); // Bonus time
    
    // Next puzzle
    const nextIndex = puzzleQueue.indexOf(currentPuzzle) + 1;
    if (nextIndex < puzzleQueue.length) {
      setCurrentPuzzle(puzzleQueue[nextIndex]);
    } else {
      endGame();
    }
  };

  const handleWrongAnswer = () => {
    soundManager.play('error');
    setStreak(0);
    setTimeLeft(Math.max(0, timeLeft - 3)); // Time penalty
  };

  const endGame = () => {
    setGameActive(false);
    soundManager.play('level_up');
    
    // Save high score
    const highScore = parseInt(localStorage.getItem('timeAttackHighScore') || '0');
    if (score > highScore) {
      localStorage.setItem('timeAttackHighScore', score.toString());
    }
    
    // Award coins
    const coinsEarned = Math.floor(score / 10);
    addCoins(coinsEarned);
  };

  const highScore = parseInt(localStorage.getItem('timeAttackHighScore') || '0');

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-400 via-purple-500 to-indigo-600 p-4">
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
            <Zap className="w-10 h-10" />
            Time Attack
          </h1>
          <div className="w-24"></div>
        </div>

        {!gameActive ? (
          /* Start Screen */
          <div className="space-y-6">
            <Card className="bg-white/95 backdrop-blur-sm p-12 rounded-3xl shadow-2xl text-center">
              <Clock className="w-24 h-24 mx-auto mb-6 text-red-600" />
              <h2 className="text-5xl font-black text-gray-800 mb-4">Time Attack Mode</h2>
              <p className="text-xl text-gray-600 mb-8">
                Solve as many puzzles as you can in 60 seconds!
              </p>
              
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl">
                  <p className="text-4xl font-black text-blue-600">+100</p>
                  <p className="text-sm font-semibold text-gray-600">Points per puzzle</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl">
                  <p className="text-4xl font-black text-green-600">+5s</p>
                  <p className="text-sm font-semibold text-gray-600">Bonus time</p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-2xl">
                  <p className="text-4xl font-black text-orange-600">x2</p>
                  <p className="text-sm font-semibold text-gray-600">Streak multiplier</p>
                </div>
              </div>

              <Button
                onClick={startGame}
                className="h-16 px-12 text-2xl font-black bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 text-white rounded-2xl transform hover:scale-105 transition-all"
              >
                Start Game!
              </Button>
            </Card>

            {/* High Score */}
            {highScore > 0 && (
              <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 rounded-3xl shadow-2xl">
                <div className="flex items-center justify-center gap-4 text-white">
                  <Trophy className="w-12 h-12" />
                  <div>
                    <p className="text-sm opacity-80">Your High Score</p>
                    <p className="text-4xl font-black">{highScore}</p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        ) : (
          /* Game Screen */
          <div className="space-y-6">
            {/* Timer & Score */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-red-500 to-pink-600 p-6 rounded-3xl shadow-2xl text-center">
                <Clock className="w-12 h-12 mx-auto mb-2 text-white" />
                <p className="text-5xl font-black text-white">{timeLeft}s</p>
              </Card>
              <Card className="bg-gradient-to-br from-blue-500 to-cyan-600 p-6 rounded-3xl shadow-2xl text-center">
                <Trophy className="w-12 h-12 mx-auto mb-2 text-white" />
                <p className="text-5xl font-black text-white">{score}</p>
              </Card>
              <Card className="bg-gradient-to-br from-orange-500 to-yellow-500 p-6 rounded-3xl shadow-2xl text-center">
                <Zap className="w-12 h-12 mx-auto mb-2 text-white" />
                <p className="text-5xl font-black text-white">{streak}x</p>
              </Card>
            </div>

            {/* Current Puzzle */}
            {currentPuzzle && (
              <Card className="bg-white/95 backdrop-blur-sm p-12 rounded-3xl shadow-2xl">
                <div className="space-y-6">
                  <div className="text-center">
                    <span className="text-3xl">{currentPuzzle.category.icon}</span>
                    <h3 className="text-3xl font-black text-gray-800 mt-4">
                      {currentPuzzle.question}
                    </h3>
                  </div>

                  {currentPuzzle.type === 'tap' && currentPuzzle.options && (
                    <div className="grid grid-cols-2 gap-4">
                      {currentPuzzle.options.map((option, index) => (
                        <Button
                          key={index}
                          onClick={() => {
                            if (index === currentPuzzle.correctAnswer) {
                              handleCorrectAnswer();
                            } else {
                              handleWrongAnswer();
                            }
                          }}
                          className="h-20 text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-2xl"
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  )}

                  {currentPuzzle.type === 'input' && (
                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="Your answer..."
                        className="w-full h-16 text-2xl text-center rounded-2xl border-4 border-gray-300 px-4"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            if (e.target.value.toUpperCase() === currentPuzzle.correctAnswer.toUpperCase()) {
                              handleCorrectAnswer();
                              e.target.value = '';
                            } else {
                              handleWrongAnswer();
                            }
                          }
                        }}
                      />
                      <p className="text-center text-gray-600">Press Enter to submit</p>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeAttack;
