import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { Button } from '../components/ui/button';
import { ArrowLeft, Lock, CheckCircle2, Star } from 'lucide-react';
import { getTotalLevels } from '../data/puzzles';

const Levels = () => {
  const navigate = useNavigate();
  const { completedLevels, levelProgress } = useGame();
  const totalLevels = getTotalLevels();

  const isLevelUnlocked = (level) => {
    return level === 1 || completedLevels.includes(level - 1);
  };

  const isLevelCompleted = (level) => {
    return completedLevels.includes(level);
  };

  const getLevelStars = (level) => {
    return levelProgress[level]?.stars || 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 p-3 sm:p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-4 sm:mb-6">
        <div className="flex items-center justify-between gap-2">
          <Button
            onClick={() => navigate('/')}
            className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm rounded-full h-10 sm:h-12 px-4 sm:px-6"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white drop-shadow-lg">
            SELECT LEVEL
          </h2>
          <div className="w-12 sm:w-16 md:w-24"></div>
        </div>
      </div>

      {/* Level Grid */}
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3 md:gap-4">
          {Array.from({ length: totalLevels }, (_, i) => i + 1).map((level) => {
            const unlocked = isLevelUnlocked(level);
            const completed = isLevelCompleted(level);
            const stars = getLevelStars(level);

            return (
              <button
                key={level}
                onClick={() => unlocked && navigate(`/puzzle/${level}`)}
                disabled={!unlocked}
                className={`
                  relative aspect-square rounded-2xl shadow-lg transform transition-all duration-300
                  ${unlocked ? 'hover:scale-110 cursor-pointer' : 'cursor-not-allowed opacity-60'}
                  ${completed 
                    ? 'bg-gradient-to-br from-green-400 to-green-600' 
                    : unlocked 
                    ? 'bg-gradient-to-br from-yellow-400 to-orange-500' 
                    : 'bg-gradient-to-br from-gray-400 to-gray-600'
                  }
                `}
              >
                {completed && (
                  <div className="absolute -top-2 -right-2">
                    <CheckCircle2 className="w-8 h-8 text-white drop-shadow-lg" />
                  </div>
                )}
                
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  {unlocked ? (
                    <>
                      <span className="text-3xl font-black text-white drop-shadow-md">
                        {level}
                      </span>
                      {stars > 0 && (
                        <div className="flex gap-1 mt-1">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < stars ? 'text-yellow-300 fill-yellow-300' : 'text-white/30'}`}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Lock className="w-8 h-8 text-white/70" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Levels;
