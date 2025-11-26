import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { Button } from '../components/ui/button';
import { ArrowLeft, Lightbulb, RotateCcw, Heart, Coins, SkipForward, Eye, AlertCircle } from 'lucide-react';
import { getPuzzle } from '../data/puzzles';
import TapPuzzle from '../components/puzzles/TapPuzzle';
import DragPuzzle from '../components/puzzles/DragPuzzle';
import InputPuzzle from '../components/puzzles/InputPuzzle';
import SequencePuzzle from '../components/puzzles/SequencePuzzle';
import FindPuzzle from '../components/puzzles/FindPuzzle';
import TrickPuzzle from '../components/puzzles/TrickPuzzle';
import ShakePuzzle from '../components/puzzles/ShakePuzzle';
import InteractivePuzzle from '../components/puzzles/InteractivePuzzle';
import MatchPuzzle from '../components/puzzles/MatchPuzzle';
import SuccessModal from '../components/SuccessModal';

const Puzzle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hints, setHints, lives, setLives, coins, setCoins, completeLevel } = useGame();
  const [puzzle, setPuzzle] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [key, setKey] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [hintLevel, setHintLevel] = useState(0);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const puzzleData = getPuzzle(parseInt(id));
    setPuzzle(puzzleData);
    setShowHint(false);
    setAttempts(0);
    setFailedAttempts(0);
    setHintLevel(0);
  }, [id]);

  const calculateStars = (time, attemptCount) => {
    // 3 stars: < 30 seconds and <= 1 attempt
    // 2 stars: < 60 seconds or <= 2 attempts  
    // 1 star: completed
    const timeInSeconds = Math.floor((Date.now() - startTime) / 1000);
    
    if (timeInSeconds < 30 && attemptCount <= 1) return 3;
    if (timeInSeconds < 60 || attemptCount <= 2) return 2;
    return 1;
  };

  const handleSuccess = () => {
    const timeInSeconds = Math.floor((Date.now() - startTime) / 1000);
    const stars = calculateStars(timeInSeconds, attempts);
    
    // Complete level with stars
    completeLevel(parseInt(id), stars, timeInSeconds, attempts + 1);
    setShowSuccess(true);
  };

  const handleHint = () => {
    if (hints > 0) {
      setShowHint(true);
      setHints(hints - 1);
      setAttempts(prev => prev + 1);
      setHintLevel(prev => prev + 1);
    }
  };

  const handleReset = () => {
    setKey(prev => prev + 1);
    setShowHint(false);
    setFailedAttempts(prev => prev + 1);
  };

  const handleSkipLevel = () => {
    if (coins >= 50) {
      // Skip with coins
      setCoins(coins - 50);
      completeLevel(parseInt(id), 0, 0, 0);
      const nextLevel = parseInt(id) + 1;
      navigate(`/puzzle/${nextLevel}`);
    } else if (lives >= 1) {
      // Skip with life
      setLives(lives - 1);
      completeLevel(parseInt(id), 0, 0, 0);
      const nextLevel = parseInt(id) + 1;
      navigate(`/puzzle/${nextLevel}`);
    }
  };

  const handleShowSolution = () => {
    // Complete level with 0 stars and no rewards
    completeLevel(parseInt(id), 0, 0, failedAttempts);
    setShowSuccess(true);
  };

  const handleNext = () => {
    const nextLevel = parseInt(id) + 1;
    setShowSuccess(false);
    setShowHint(false);
    setKey(0);
    navigate(`/puzzle/${nextLevel}`);
  };

  const handleFailure = () => {
    setFailedAttempts(prev => prev + 1);
    setAttempts(prev => prev + 1);
  };

  if (!puzzle) return null;

  const renderPuzzle = () => {
    const props = { puzzle, onSuccess: handleSuccess, onFailure: handleFailure, puzzleKey: key };
    
    switch (puzzle.type) {
      case 'tap':
        return <TapPuzzle {...props} />;
      case 'drag':
        return <DragPuzzle {...props} />;
      case 'input':
        return <InputPuzzle {...props} />;
      case 'sequence':
        return <SequencePuzzle {...props} />;
      case 'find':
        return <FindPuzzle {...props} />;
      case 'trick':
        return <TrickPuzzle {...props} />;
      case 'shake':
        return <ShakePuzzle {...props} />;
      case 'interactive':
        return <InteractivePuzzle {...props} />;
      case 'match':
        return <MatchPuzzle {...props} />;
      default:
        return <TapPuzzle {...props} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-cyan-400 to-teal-400 flex flex-col">
      {/* Header */}
      <div className="p-2 sm:p-3 md:p-4">
        <div className="max-w-4xl mx-auto">
          {/* Top Row - Back button and Stats */}
          <div className="flex items-center justify-between gap-1 sm:gap-2 mb-2 sm:mb-3">
            <Button
              onClick={() => navigate('/levels')}
              className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm rounded-full h-9 sm:h-10 md:h-12 px-2 sm:px-4 md:px-6 flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-0 sm:mr-1 md:mr-2" />
              <span className="hidden sm:inline text-sm md:text-base">Levels</span>
            </Button>
            
            <div className="flex items-center gap-1 sm:gap-2 md:gap-3 flex-shrink min-w-0">
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-1.5 sm:px-2 md:px-4 py-1 sm:py-1.5 md:py-2 flex items-center gap-0.5 sm:gap-1 md:gap-2">
                <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-red-400 fill-red-400 flex-shrink-0" />
                <span className="text-sm sm:text-base md:text-xl font-black text-white">{lives}</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-2 sm:px-3 md:px-6 py-1 sm:py-1.5 md:py-3">
                <span className="text-sm sm:text-base md:text-2xl font-black text-white drop-shadow-md whitespace-nowrap">
                  Level {id}
                </span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-1.5 sm:px-2 md:px-4 py-1 sm:py-1.5 md:py-2 flex items-center gap-0.5 sm:gap-1 md:gap-2">
                <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-yellow-300 flex-shrink-0" />
                <span className="text-sm sm:text-base md:text-xl font-black text-white">{coins}</span>
              </div>
            </div>

            <div className="flex gap-1 sm:gap-2 flex-shrink-0">
              <Button
                onClick={handleReset}
                className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm rounded-full h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12 p-0"
              >
                <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
              </Button>
              <Button
                onClick={handleHint}
                disabled={hints === 0}
                className="bg-yellow-400 hover:bg-yellow-500 text-white rounded-full h-9 sm:h-10 md:h-12 px-2 sm:px-3 md:px-6 font-bold flex items-center"
              >
                <Lightbulb className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-0.5 sm:mr-1 md:mr-2" />
                <span className="text-xs sm:text-sm md:text-base">{hints}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="px-2 sm:px-3 md:px-4 pb-3 sm:pb-4 md:pb-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl sm:rounded-2xl md:rounded-3xl shadow-xl p-3 sm:p-4 md:p-6 text-center">
            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-800 leading-tight">
              {puzzle.question}
            </h2>
          </div>
        </div>
      </div>

      {/* Hint Display */}
      {showHint && (
        <div className="px-2 sm:px-3 md:px-4 pb-2 sm:pb-3 md:pb-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg sm:rounded-xl md:rounded-2xl p-2 sm:p-3 md:p-4 text-center animate-bounce">
              <p className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-yellow-800">
                💡 {hintLevel >= 2 ? `Advanced Hint: ${puzzle.hint}` : puzzle.hint}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Progressive Help System */}
      {failedAttempts >= 3 && (
        <div className="px-2 sm:px-3 md:px-4 pb-2 sm:pb-3 md:pb-4">
          <div className="max-w-4xl mx-auto space-y-2">
            {/* Stuck Message */}
            {failedAttempts >= 3 && failedAttempts < 5 && (
              <div className="bg-orange-100 border-2 border-orange-400 rounded-lg sm:rounded-xl p-2 sm:p-3 text-center">
                <div className="flex items-center justify-center gap-2">
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                  <p className="text-xs sm:text-sm font-semibold text-orange-800">
                    Having trouble? Try using a hint or reset to try again!
                  </p>
                </div>
              </div>
            )}

            {/* Skip Level Option (after 5 failures) */}
            {failedAttempts >= 5 && (
              <div className="bg-blue-100 border-2 border-blue-400 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <div className="text-center space-y-2">
                  <p className="text-xs sm:text-sm font-semibold text-blue-800">
                    Still stuck? You can skip this level!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    {coins >= 50 && (
                      <Button
                        onClick={handleSkipLevel}
                        className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-bold flex items-center justify-center gap-2"
                      >
                        <SkipForward className="w-4 h-4" />
                        Skip for 50 <Coins className="w-4 h-4" />
                      </Button>
                    )}
                    {lives >= 1 && (
                      <Button
                        onClick={handleSkipLevel}
                        className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-4 py-2 text-sm font-bold flex items-center justify-center gap-2"
                      >
                        <SkipForward className="w-4 h-4" />
                        Skip for 1 <Heart className="w-4 h-4 fill-white" />
                      </Button>
                    )}
                  </div>
                  {coins < 50 && lives < 1 && (
                    <p className="text-xs text-gray-600">
                      You need 50 coins or 1 life to skip this level
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Show Solution Option (after 7 failures) */}
            {failedAttempts >= 7 && (
              <div className="bg-purple-100 border-2 border-purple-400 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <div className="text-center space-y-2">
                  <p className="text-xs sm:text-sm font-semibold text-purple-800">
                    Really stuck? View the solution to continue
                  </p>
                  <p className="text-xs text-purple-600">
                    (You'll complete the level with 0 stars and no rewards)
                  </p>
                  <Button
                    onClick={handleShowSolution}
                    className="bg-purple-500 hover:bg-purple-600 text-white rounded-lg px-4 py-2 text-sm font-bold flex items-center justify-center gap-2 mx-auto"
                  >
                    <Eye className="w-4 h-4" />
                    Show Solution
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Puzzle Area */}
      <div className="flex-1 px-3 sm:px-4 pb-6 sm:pb-8 overflow-auto">
        <div className="max-w-4xl mx-auto h-full">
          {renderPuzzle()}
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <SuccessModal
          level={parseInt(id)}
          explanation={puzzle.explanation}
          onNext={handleNext}
          onLevels={() => navigate('/levels')}
          stars={calculateStars(Math.floor((Date.now() - startTime) / 1000), attempts)}
          coinsEarned={calculateStars(Math.floor((Date.now() - startTime) / 1000), attempts) * 10}
        />
      )}
    </div>
  );
};

export default Puzzle;
