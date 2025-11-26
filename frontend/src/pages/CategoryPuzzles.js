import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ArrowLeft, Star, Lock, CheckCircle2 } from 'lucide-react';
import { categories } from '../data/puzzleCategories';
import { getPuzzlesByCategory } from '../data/advancedPuzzles';

const CategoryPuzzles = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { completedLevels, levelProgress } = useGame();
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const category = Object.values(categories).find(c => c.id === categoryId);
  const puzzles = getPuzzlesByCategory(categoryId);

  const filteredPuzzles = selectedDifficulty === 'all' 
    ? puzzles 
    : puzzles.filter(p => p.difficulty.id === selectedDifficulty);

  const isLevelUnlocked = (puzzleId) => {
    return puzzleId === 1 || completedLevels.includes(puzzleId - 1);
  };

  const isLevelCompleted = (puzzleId) => {
    return completedLevels.includes(puzzleId);
  };

  const getLevelStars = (puzzleId) => {
    return levelProgress[puzzleId]?.stars || 0;
  };

  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 p-4">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <Button
            onClick={() => navigate('/categories')}
            className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm rounded-full h-10 sm:h-12 px-4 sm:px-6"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          <div className="text-center flex-1">
            <span className="text-4xl sm:text-5xl md:text-6xl">{category.icon}</span>
            <h1 className="text-xl sm:text-2xl md:text-4xl font-black text-white drop-shadow-lg">{category.name}</h1>
          </div>
          <div className="w-12 sm:w-16 md:w-24"></div>
        </div>

        {/* Difficulty Filter */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          {['all', 'easy', 'medium', 'hard', 'expert'].map((diff) => (
            <Button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`${
                selectedDifficulty === diff
                  ? 'bg-white text-purple-600'
                  : 'bg-white/20 text-white'
              } hover:bg-white/30 backdrop-blur-sm rounded-full h-8 sm:h-10 px-3 sm:px-6 text-sm sm:text-base font-bold capitalize`}
            >
              {diff}
            </Button>
          ))}
        </div>

        {/* Puzzles Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3 md:gap-4">
          {filteredPuzzles.map((puzzle) => {
            const unlocked = isLevelUnlocked(puzzle.id);
            const completed = isLevelCompleted(puzzle.id);
            const stars = getLevelStars(puzzle.id);

            return (
              <button
                key={puzzle.id}
                onClick={() => unlocked && navigate(`/puzzle/${puzzle.id}`)}
                disabled={!unlocked}
                className={`
                  relative aspect-square rounded-2xl shadow-lg transform transition-all duration-300
                  ${unlocked ? 'hover:scale-110 cursor-pointer' : 'cursor-not-allowed opacity-60'}
                  ${
                    completed
                      ? 'bg-gradient-to-br from-green-400 to-green-600'
                      : unlocked
                      ? `bg-gradient-to-br ${category.color}`
                      : 'bg-gradient-to-br from-gray-400 to-gray-600'
                  }
                `}
              >
                {completed && (
                  <div className="absolute -top-2 -right-2 z-10">
                    <CheckCircle2 className="w-6 h-6 text-white drop-shadow-lg" />
                  </div>
                )}

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  {unlocked ? (
                    <>
                      <span className="text-2xl font-black text-white drop-shadow-md">
                        {puzzle.id}
                      </span>
                      {stars > 0 && (
                        <div className="flex gap-1 mt-1">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < stars ? 'text-yellow-300 fill-yellow-300' : 'text-white/30'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Lock className="w-6 h-6 text-white/70" />
                  )}
                </div>

                {/* Difficulty Badge */}
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                  <span className={`text-xs font-bold ${puzzle.difficulty.color} bg-white/90 px-2 py-0.5 rounded-full`}>
                    {puzzle.difficulty.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryPuzzles;
