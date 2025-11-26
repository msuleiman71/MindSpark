import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMultiplayer } from '../context/MultiplayerContext';
import { useGame } from '../context/GameContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Trophy, Star, Clock, Zap, Crown } from 'lucide-react';
import { getPuzzle } from '../data/puzzles';
import Confetti from '../components/Confetti';

const MultiplayerGame = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentGame, opponent, playerReady, sendMove, completeGame, leaveGame } = useMultiplayer();
  const { addCoins } = useGame();
  
  const [gameStarted, setGameStarted] = useState(false);
  const [puzzle, setPuzzle] = useState(null);
  const [myScore, setMyScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [showResults, setShowResults] = useState(false);
  const [winner, setWinner] = useState(null);
  const [myAnswer, setMyAnswer] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (currentGame?.puzzleId) {
      const puzzleData = getPuzzle(currentGame.puzzleId);
      setPuzzle(puzzleData);
    }
  }, [currentGame]);

  useEffect(() => {
    // Listen for opponent moves
    if (currentGame?.started) {
      setGameStarted(true);
    }

    // Listen for game results
    if (currentGame?.results) {
      setShowResults(true);
      setWinner(currentGame.results.winner_id);
      if (currentGame.results.winner_id === user.id) {
        setShowConfetti(true);
        addCoins(50);
      }
    }
  }, [currentGame, user, addCoins]);

  useEffect(() => {
    // Countdown timer
    if (gameStarted && timeLeft > 0 && !showResults) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameStarted, timeLeft, showResults]);

  const handleReady = () => {
    playerReady();
  };

  const handleAnswer = () => {
    if (!myAnswer.trim()) return;
    
    const correct = myAnswer.toLowerCase().trim() === puzzle.answer.toLowerCase().trim();
    if (correct) {
      const newScore = myScore + 100;
      setMyScore(newScore);
      setMyAnswer('');
      
      // Send move to opponent
      sendMove({ score: newScore, answered: true });
      
      // If we reach winning score, complete game
      if (newScore >= 300) {
        completeGame(newScore, 60 - timeLeft);
      }
    }
  };

  const handleTimeUp = () => {
    if (!showResults) {
      completeGame(myScore, 60);
    }
  };

  const handleLeave = () => {
    leaveGame();
    navigate('/multiplayer');
  };

  if (!puzzle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
        <Card className="bg-white p-8 rounded-3xl">
          <p className="text-2xl font-bold">Loading battle...</p>
        </Card>
      </div>
    );
  }

  if (showResults) {
    const isWinner = winner === user.id;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center p-4">
        {showConfetti && <Confetti />}
        <Card className="bg-white/95 backdrop-blur-sm p-8 sm:p-12 rounded-3xl shadow-2xl max-w-2xl w-full">
          <div className="text-center">
            {isWinner ? (
              <>
                <Crown className="w-24 h-24 text-yellow-500 mx-auto mb-4 animate-bounce" />
                <h2 className="text-5xl font-black text-gray-800 mb-4">VICTORY!</h2>
                <p className="text-2xl text-gray-600 mb-6">You defeated {opponent?.name}!</p>
                <div className="bg-yellow-50 rounded-2xl p-6 mb-6">
                  <p className="text-lg font-bold text-gray-800">Rewards Earned:</p>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
                    <span className="text-3xl font-black text-gray-800">+50 Coins</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Trophy className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                <h2 className="text-5xl font-black text-gray-800 mb-4">DEFEAT</h2>
                <p className="text-2xl text-gray-600 mb-6">{opponent?.name} won this round!</p>
                <div className="bg-blue-50 rounded-2xl p-6 mb-6">
                  <p className="text-lg font-bold text-gray-800">Keep practicing!</p>
                  <p className="text-sm text-gray-600 mt-2">You'll get them next time!</p>
                </div>
              </>
            )}
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-purple-50 rounded-xl p-4">
                <p className="text-sm text-gray-600">Your Score</p>
                <p className="text-3xl font-black text-purple-600">{myScore}</p>
              </div>
              <div className="bg-pink-50 rounded-xl p-4">
                <p className="text-sm text-gray-600">{opponent?.name}'s Score</p>
                <p className="text-3xl font-black text-pink-600">{opponentScore}</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button
                onClick={handleLeave}
                className="flex-1 h-14 text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl"
              >
                Back to Lobby
              </Button>
              <Button
                onClick={() => navigate('/multiplayer')}
                className="flex-1 h-14 text-lg font-bold bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl"
              >
                Play Again
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center p-4">
        <Card className="bg-white/95 backdrop-blur-sm p-8 sm:p-12 rounded-3xl shadow-2xl max-w-2xl w-full">
          <div className="text-center">
            <h2 className="text-4xl font-black text-gray-800 mb-6">Match Found!</h2>
            
            {/* Players */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div className="text-center">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-3">
                  <span className="text-5xl">{user?.avatar}</span>
                </div>
                <p className="text-xl font-bold text-gray-800">{user?.name}</p>
                <p className="text-sm text-gray-600">YOU</p>
              </div>
              
              <div className="text-center">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-500 w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-3">
                  <span className="text-5xl">{opponent?.avatar}</span>
                </div>
                <p className="text-xl font-bold text-gray-800">{opponent?.name}</p>
                <p className="text-sm text-gray-600">OPPONENT</p>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-2xl p-6 mb-6">
              <p className="text-lg font-bold text-gray-800 mb-2">Game Rules:</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✅ First to 300 points wins</li>
                <li>⏱️ 60 seconds time limit</li>
                <li>🎯 Each correct answer = 100 points</li>
              </ul>
            </div>
            
            <Button
              onClick={handleReady}
              className="w-full h-16 text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl shadow-lg transform hover:scale-105 transition-all"
            >
              I'm Ready! 🔥
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 p-3 sm:p-4">
      <div className="max-w-6xl mx-auto">
        {/* Score Bar */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4">
          {/* Your Score */}
          <Card className="bg-white/95 backdrop-blur-sm p-3 sm:p-4 rounded-2xl">
            <div className="text-center">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-12 h-12 sm:w-16 sm:h-16 rounded-full mx-auto flex items-center justify-center mb-2">
                <span className="text-2xl sm:text-4xl">{user?.avatar}</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 truncate">{user?.name}</p>
              <p className="text-2xl sm:text-4xl font-black text-purple-600">{myScore}</p>
            </div>
          </Card>
          
          {/* Timer */}
          <Card className="bg-white/95 backdrop-blur-sm p-3 sm:p-4 rounded-2xl">
            <div className="text-center">
              <Clock className="w-8 h-8 sm:w-12 sm:h-12 text-orange-500 mx-auto mb-2" />
              <p className="text-xs sm:text-sm text-gray-600">Time Left</p>
              <p className="text-2xl sm:text-4xl font-black text-orange-600">{timeLeft}s</p>
            </div>
          </Card>
          
          {/* Opponent Score */}
          <Card className="bg-white/95 backdrop-blur-sm p-3 sm:p-4 rounded-2xl">
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 w-12 h-12 sm:w-16 sm:h-16 rounded-full mx-auto flex items-center justify-center mb-2">
                <span className="text-2xl sm:text-4xl">{opponent?.avatar}</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 truncate">{opponent?.name}</p>
              <p className="text-2xl sm:text-4xl font-black text-blue-600">{opponentScore}</p>
            </div>
          </Card>
        </div>
        
        {/* Question Card */}
        <Card className="bg-white/95 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-2xl mb-4">
          <div className="text-center mb-6">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
              {puzzle.question}
            </h3>
          </div>
          
          {/* Answer Input */}
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-3">
              <input
                type="text"
                value={myAnswer}
                onChange={(e) => setMyAnswer(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAnswer()}
                placeholder="Type your answer..."
                className="flex-1 px-6 py-4 text-xl border-2 border-purple-300 rounded-xl focus:border-purple-500 focus:outline-none"
                autoFocus
              />
              <Button
                onClick={handleAnswer}
                className="h-auto px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xl font-bold rounded-xl"
              >
                Submit
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-2 text-center">
              Press Enter to submit your answer
            </p>
          </div>
        </Card>
        
        {/* Live Activity */}
        <Card className="bg-white/95 backdrop-blur-sm p-4 rounded-2xl">
          <div className="flex items-center justify-center gap-4">
            <Zap className="w-6 h-6 text-yellow-500" />
            <p className="text-sm text-gray-600">
              Race to 300 points to win! 🏆
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MultiplayerGame;
