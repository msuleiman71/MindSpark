import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowLeft, Lock, CheckCircle2 } from 'lucide-react';
import { getTotalLevels } from '../data/puzzles';

const Levels = () => {
  const navigate = useNavigate();
  const totalLevels = getTotalLevels();
  const [completedLevels, setCompletedLevels] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('completedLevels');
    if (saved) {
      setCompletedLevels(JSON.parse(saved));
    }
  }, []);

  const isLevelUnlocked = (level) => {
    return level === 1 || completedLevels.includes(level - 1);
  };

  const isLevelCompleted = (level) => {
    return completedLevels.includes(level);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <Button
            onClick={() => navigate('/')}
            className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm rounded-full h-12 px-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <h2 className="text-3xl font-black text-white drop-shadow-lg">
            SELECT LEVEL
          </h2>
          <div className="w-24"></div>
        </div>
      </div>

      {/* Level Grid */}
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
          {Array.from({ length: totalLevels }, (_, i) => i + 1).map((level) => {
            const unlocked = isLevelUnlocked(level);
            const completed = isLevelCompleted(level);

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
                
                <div className="absolute inset-0 flex items-center justify-center">
                  {unlocked ? (
                    <span className="text-3xl font-black text-white drop-shadow-md">
                      {level}
                    </span>
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
