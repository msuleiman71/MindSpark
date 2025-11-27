import React, { useState } from 'react';
import { Button } from '../ui/button';

const SequencePuzzle = ({ puzzle, onSuccess, onFailure, puzzleKey }) => {
  const [selected, setSelected] = useState([]);
  const [error, setError] = useState(false);

  // Safety check for sequence data
  const sequence = puzzle?.sequence || [];
  
  const handleTap = (item, index) => {
    if (selected.includes(index)) return;

    const newSelected = [...selected, index];
    setSelected(newSelected);

    // Check if correct
    const isCorrect = newSelected.every((idx, i) => idx === i);
    
    if (newSelected.length === sequence.length) {
      if (isCorrect) {
        setTimeout(() => onSuccess(), 500);
      } else {
        setError(true);
        if (onFailure) onFailure();
        setTimeout(() => {
          setSelected([]);
          setError(false);
        }, 1000);
      }
    }
  };

  return (
    <div className="h-full flex items-center justify-center p-2 sm:p-4">
      <div className="space-y-4 sm:space-y-6 max-w-3xl w-full">
        <div className="bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center">
          <p className="text-white text-base sm:text-xl font-bold">
            Tap in order: {selected.length} / {sequence.length}
          </p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-4">
          {sequence.map((item, index) => {
            const isSelected = selected.includes(index);
            const order = selected.indexOf(index) + 1;

            return (
              <Button
                key={index}
                onClick={() => handleTap(item, index)}
                disabled={isSelected}
                className={`
                  relative aspect-square text-3xl sm:text-6xl rounded-2xl sm:rounded-3xl shadow-xl transform transition-all duration-300
                  ${
                    error && isSelected
                      ? 'bg-red-500 animate-shake'
                      : isSelected
                      ? 'bg-green-500 scale-90'
                      : 'bg-white hover:bg-gray-100 hover:scale-110'
                  }
                `}
              >
                {item}
                {isSelected && (
                  <span className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-blue-600 text-white rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-bold">
                    {order}
                  </span>
                )}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SequencePuzzle;
