import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { Button } from '../components/ui/button';
import { ArrowLeft, Lightbulb, RotateCcw, Heart, Coins } from 'lucide-react';
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
  const { hints, setHints, lives, coins, completeLevel } = useGame();
  const [puzzle, setPuzzle] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [key, setKey] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const puzzleData = getPuzzle(parseInt(id));
    setPuzzle(puzzleData);
    setShowHint(false);
    setAttempts(0);
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
    }
  };

  const handleReset = () => {
    setKey(prev => prev + 1);
    setShowHint(false);
  };

  const handleNext = () => {
    const nextLevel = parseInt(id) + 1;
    setShowSuccess(false);
    setShowHint(false);
    setKey(0);
    navigate(`/puzzle/${nextLevel}`);
  };

  if (!puzzle) return null;

  const renderPuzzle = () => {
    const props = { puzzle, onSuccess: handleSuccess, puzzleKey: key };
    
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
      <div className="p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button
            onClick={() => navigate('/levels')}
            className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm rounded-full h-12 px-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Levels
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-400 fill-red-400" />
              <span className="text-xl font-black text-white">{lives}</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
              <span className="text-2xl font-black text-white drop-shadow-md">
                Level {id}
              </span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
              <Coins className="w-5 h-5 text-yellow-300" />
              <span className="text-xl font-black text-white">{coins}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleReset}
              className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm rounded-full h-12 w-12 p-0"
            >
              <RotateCcw className="w-5 h-5" />
            </Button>
            <Button
              onClick={handleHint}
              disabled={hints === 0}
              className="bg-yellow-400 hover:bg-yellow-500 text-white rounded-full h-12 px-6 font-bold"
            >
              <Lightbulb className="w-5 h-5 mr-2" />
              {hints}
            </Button>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="px-4 pb-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              {puzzle.question}
            </h2>
          </div>
        </div>
      </div>

      {/* Hint Display */}
      {showHint && (
        <div className="px-4 pb-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-yellow-100 border-2 border-yellow-400 rounded-2xl p-4 text-center animate-bounce">
              <p className="text-lg font-semibold text-yellow-800">
                💡 {puzzle.hint}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Puzzle Area */}
      <div className="flex-1 px-4 pb-8">
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
