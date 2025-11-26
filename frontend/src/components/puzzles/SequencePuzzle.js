import React, { useState } from 'react';
import { Button } from '../ui/button';

const SequencePuzzle = ({ puzzle, onSuccess, puzzleKey }) => {
  const [selected, setSelected] = useState([]);
  const [error, setError] = useState(false);

  const handleTap = (item, index) => {
    if (selected.includes(index)) return;

    const newSelected = [...selected, index];
    setSelected(newSelected);

    // Check if correct
    const isCorrect = newSelected.every((idx, i) => idx === i);
    
    if (newSelected.length === puzzle.sequence.length) {
      if (isCorrect) {
        setTimeout(() => onSuccess(), 500);
      } else {
        setError(true);
        setTimeout(() => {
          setSelected([]);
          setError(false);
        }, 1000);
      }
    }
  };

  return (
    <div className="h-full flex items-center justify-center">
      <div className="space-y-6 max-w-3xl w-full">
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center">
          <p className="text-white text-xl font-bold">
            Tap in order: {selected.length} / {puzzle.sequence.length}
          </p>
        </div>

        <div className="grid grid-cols-5 gap-4">
          {puzzle.sequence.map((item, index) => {
            const isSelected = selected.includes(index);
            const order = selected.indexOf(index) + 1;

            return (
              <Button
                key={index}
                onClick={() => handleTap(item, index)}
                disabled={isSelected}
                className={`
                  relative aspect-square text-6xl rounded-3xl shadow-xl transform transition-all duration-300
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
                  <span className="absolute top-2 right-2 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
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
