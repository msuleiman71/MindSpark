import React from 'react';
import { Button } from '../ui/button';

const TapPuzzle = ({ puzzle, onSuccess }) => {
  const handleTap = (index) => {
    if (puzzle.correctAnswer === -1 || index === puzzle.correctAnswer) {
      setTimeout(() => onSuccess(), 500);
    }
  };

  return (
    <div className="h-full flex items-center justify-center">
      <div className="grid grid-cols-2 gap-6 max-w-2xl w-full">
        {puzzle.options.map((option, index) => (
          <Button
            key={index}
            onClick={() => handleTap(index)}
            className="h-32 text-4xl font-bold bg-white hover:bg-gray-100 text-gray-800 rounded-3xl shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default TapPuzzle;
