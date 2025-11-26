import React, { useState } from 'react';
import { Button } from '../ui/button';

const FindPuzzle = ({ puzzle, onSuccess }) => {
  const [found, setFound] = useState(false);

  const handleTap = (index) => {
    if (index === puzzle.correctAnswer) {
      setFound(true);
      setTimeout(() => onSuccess(), 800);
    }
  };

  // Shuffle items for display
  const shuffledItems = [...puzzle.items].sort(() => Math.random() - 0.5);

  return (
    <div className="h-full flex items-center justify-center p-2 sm:p-4">
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-4 max-w-3xl w-full">
        {shuffledItems.map((item, displayIndex) => {
          const actualIndex = puzzle.items.indexOf(item);
          const isCorrect = actualIndex === puzzle.correctAnswer;

          return (
            <Button
              key={displayIndex}
              onClick={() => handleTap(actualIndex)}
              className={`
                aspect-square text-3xl sm:text-6xl rounded-2xl sm:rounded-3xl shadow-xl transform transition-all duration-300
                ${
                  found && isCorrect
                    ? 'bg-green-500 scale-125 animate-bounce'
                    : 'bg-white hover:bg-gray-100 hover:scale-110'
                }
              `}
            >
              {item}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default FindPuzzle;
