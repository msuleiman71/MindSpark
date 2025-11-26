import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMultiplayer } from '../context/MultiplayerContext';
import { useGame } from '../context/GameContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Trophy, Star, Clock, Zap, Crown, Users } from 'lucide-react';
import { getPuzzle } from '../data/puzzles';
import Confetti from '../components/Confetti';
import TapPuzzle from '../components/puzzles/TapPuzzle';
import InputPuzzle from '../components/puzzles/InputPuzzle';
import SequencePuzzle from '../components/puzzles/SequencePuzzle';
import FindPuzzle from '../components/puzzles/FindPuzzle';
import TrickPuzzle from '../components/puzzles/TrickPuzzle';

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
  const [myCompleted, setMyCompleted] = useState(false);
  const [opponentCompleted, setOpponentCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [myTime, setMyTime] = useState(0);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    if (currentGame?.puzzleId) {
      const puzzleData = getPuzzle(currentGame.puzzleId);
      setPuzzle(puzzleData);
    }
  }, [currentGame]);

  useEffect(() => {
    // Listen for game start
    if (currentGame?.started && !gameStarted) {
      setGameStarted(true);
      setStartTime(Date.now());
    }

    // Listen for game results
    if (currentGame?.results) {
      setShowResults(true);
      setWinner(currentGame.results.winner_id);
      if (currentGame.results.winner_id === user.id) {
        setShowConfetti(true);
        addCoins(50);
      }
      
      // Update scores from results
      const myResult = currentGame.results.players.find(p => p.user_id === user.id);
      const opponentResult = currentGame.results.players.find(p => p.user_id !== user.id);
      if (myResult) setMyScore(myResult.score);
      if (opponentResult) setOpponentScore(opponentResult.score);
    }
  }, [currentGame, user, addCoins, gameStarted]);

  useEffect(() => {
    // Countdown timer
    if (gameStarted && timeLeft > 0 && !showResults) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            if (!myCompleted) {
              handleTimeUp();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameStarted, timeLeft, showResults, myCompleted]);

  const handleReady = () => {
    playerReady();
  };

  const handlePuzzleComplete = () => {
    if (myCompleted) return;
    
    const timeTaken = (Date.now() - startTime) / 1000;
    setMyTime(timeTaken);
    setMyCompleted(true);
    
    // Calculate score based on time (faster = more points)
    const timeScore = Math.max(0, 1000 - (timeTaken * 10));
    const finalScore = Math.round(timeScore);
    setMyScore(finalScore);
    
    // Send completion to server
    completeGame(finalScore, timeTaken);
  };

  const handleTimeUp = () => {
    if (!myCompleted) {
      completeGame(0, 60);
      setMyCompleted(true);
    }
  };

  const handleLeaveGame = () => {
    leaveGame();
    navigate('/multiplayer');
  };

  const renderPuzzle = () => {
    if (!puzzle) return null;
    
    const props = {
      puzzle,
      onSuccess: handlePuzzleComplete,
      puzzleKey: 0
    };
    
    switch (puzzle.type) {
      case 'tap':
        return <TapPuzzle {...props} />;
      case 'input':
        return <InputPuzzle {...props} />;
      case 'sequence':
        return <SequencePuzzle {...props} />;
      case 'find':
        return <FindPuzzle {...props} />;
      case 'trick':
        return <TrickPuzzle {...props} />;
      default:
        return <TapPuzzle {...props} />;
    }
  };

  if (!currentGame || !puzzle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center">
        <Card className="bg-white p-8 rounded-3xl shadow-2xl text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Loading Game...</h2>
          <Button onClick={() => navigate('/multiplayer')}>Back to Lobby</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-2 sm:p-4">
      {showConfetti && <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />}
      
      <div className="max-w-6xl mx-auto space-y-3 sm:space-y-4">
        {/* Header with Players and Timer */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-3 sm:p-6 shadow-2xl">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Player 1 (You) */}
            <div className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl sm:rounded-2xl p-2 sm:p-4">
              <div className="flex items-center gap-2">
                <div className="text-2xl sm:text-4xl">{user?.avatar || '🧠'}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-white/80">You</p>
                  <p className="text-sm sm:text-xl font-bold text-white truncate">{user?.name}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-300 fill-yellow-300" />
                    <span className="text-xs sm:text-lg font-bold text-white">{myScore}</span>
                  </div>
                </div>
                {myCompleted && (
                  <Crown className="w-5 h-5 sm:w-8 sm:h-8 text-yellow-300" />
                )}
              </div>
            </div>

            {/* Timer */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-2 sm:p-4 text-center min-w-[60px] sm:min-w-[100px]">
              <Clock className="w-5 h-5 sm:w-8 sm:h-8 text-purple-600 mx-auto mb-1" />
              <p className={`text-xl sm:text-4xl font-black ${
                timeLeft <= 10 ? 'text-red-600 animate-pulse' : 'text-gray-800'
              }`}>
                {timeLeft}s
              </p>
            </div>

            {/* Player 2 (Opponent) */}
            <div className="flex-1 bg-gradient-to-r from-pink-500 to-red-500 rounded-xl sm:rounded-2xl p-2 sm:p-4">
              <div className="flex items-center gap-2">
                {opponentCompleted && (
                  <Crown className="w-5 h-5 sm:w-8 sm:h-8 text-yellow-300" />
                )}
                <div className="flex-1 min-w-0 text-right">
                  <p className="text-xs sm:text-sm text-white/80">Opponent</p>
                  <p className="text-sm sm:text-xl font-bold text-white truncate">{opponent?.name || 'Player 2'}</p>
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <span className="text-xs sm:text-lg font-bold text-white">{opponentScore}</span>
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-300 fill-yellow-300" />
                  </div>
                </div>
                <div className="text-2xl sm:text-4xl">{opponent?.avatar || '🤖'}</div>
              </div>
            </div>
          </div>

          {/* Room Code */}
          <div className="mt-3 sm:mt-4 text-center">
            <p className="text-xs sm:text-sm text-gray-600">
              Room Code: <span className="font-mono font-bold text-purple-600">{currentGame.roomCode}</span>
            </p>
          </div>
        </div>

        {/* Waiting for Players */}
        {!gameStarted && (
          <Card className="bg-white/95 backdrop-blur-sm p-6 sm:p-12 rounded-2xl sm:rounded-3xl shadow-2xl text-center">
            <Users className="w-16 h-16 sm:w-24 sm:h-24 text-purple-600 mx-auto mb-4 animate-pulse" />
            <h2 className="text-2xl sm:text-4xl font-black text-gray-800 mb-4">Get Ready!</h2>
            <p className="text-base sm:text-lg text-gray-600 mb-6">
              Waiting for both players to be ready...
            </p>
            <Button
              onClick={handleReady}
              className="h-12 sm:h-16 px-6 sm:px-12 text-lg sm:text-xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl sm:rounded-2xl"
            >
              I'm Ready!
            </Button>
          </Card>
        )}

        {/* Puzzle Area */}
        {gameStarted && !showResults && (
          <div className="bg-gradient-to-br from-blue-400 via-cyan-400 to-teal-400 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
            {/* Question */}
            <div className="bg-white/95 backdrop-blur-sm p-3 sm:p-6 m-2 sm:m-4 rounded-xl sm:rounded-2xl text-center">
              <h3 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-800">
                {puzzle.question}
              </h3>
            </div>

            {/* Puzzle Component */}
            <div className="p-2 sm:p-4 min-h-[300px] sm:min-h-[400px]">
              {myCompleted ? (
                <div className="h-full flex items-center justify-center">
                  <Card className="bg-white/95 p-6 sm:p-12 rounded-2xl sm:rounded-3xl text-center">
                    <Trophy className="w-16 h-16 sm:w-24 sm:h-24 text-green-600 mx-auto mb-4" />
                    <h3 className="text-2xl sm:text-4xl font-black text-gray-800 mb-2">Completed!</h3>
                    <p className="text-base sm:text-lg text-gray-600">Waiting for opponent...</p>
                    <p className="text-sm sm:text-base text-gray-500 mt-4">Your time: {myTime.toFixed(2)}s</p>
                  </Card>
                </div>
              ) : (
                renderPuzzle()
              )}
            </div>
          </div>
        )}

        {/* Results */}
        {showResults && (
          <Card className="bg-white/95 backdrop-blur-sm p-6 sm:p-12 rounded-2xl sm:rounded-3xl shadow-2xl text-center">
            {winner === user.id ? (
              <>
                <Trophy className="w-16 h-16 sm:w-24 sm:h-24 text-yellow-500 mx-auto mb-4 animate-bounce" />
                <h2 className="text-3xl sm:text-5xl font-black text-gray-800 mb-4">🎉 You Won! 🎉</h2>
                <p className="text-lg sm:text-2xl text-green-600 font-bold mb-6">+50 Coins!</p>
              </>
            ) : (
              <>
                <Trophy className="w-16 h-16 sm:w-24 sm:h-24 text-gray-400 mx-auto mb-4" />
                <h2 className="text-3xl sm:text-5xl font-black text-gray-800 mb-4">You Lost</h2>
                <p className="text-lg sm:text-xl text-gray-600 mb-6">Better luck next time!</p>
              </>
            )}
            
            {/* Score Comparison */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl ${
                winner === user.id ? 'bg-green-50 border-2 border-green-500' : 'bg-gray-50'
              }`}>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Your Score</p>
                <p className="text-2xl sm:text-4xl font-black text-gray-800">{myScore}</p>
              </div>
              <div className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl ${
                winner !== user.id ? 'bg-green-50 border-2 border-green-500' : 'bg-gray-50'
              }`}>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Opponent</p>
                <p className="text-2xl sm:text-4xl font-black text-gray-800">{opponentScore}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                onClick={() => navigate('/multiplayer')}
                className="flex-1 h-12 sm:h-14 text-base sm:text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl sm:rounded-2xl"
              >
                Play Again
              </Button>
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="flex-1 h-12 sm:h-14 text-base sm:text-lg font-bold border-2 rounded-xl sm:rounded-2xl"
              >
                Home
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MultiplayerGame;
