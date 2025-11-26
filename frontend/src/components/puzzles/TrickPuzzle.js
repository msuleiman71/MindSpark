import React, { useState } from 'react';
import { Button } from '../ui/button';

const TrickPuzzle = ({ puzzle, onSuccess }) => {
  const [equation, setEquation] = useState('5+5+5=550');
  const [solved, setSolved] = useState(false);

  const handleClick = () => {
    if (!solved) {
      setEquation('545+5=550');
      setSolved(true);
      setTimeout(() => onSuccess(), 1500);
    }
  };

  return (
    <div className="h-full flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-12 shadow-2xl max-w-2xl w-full">
        <div className="text-center space-y-4 sm:space-y-8">
          <div className="text-4xl sm:text-7xl font-bold text-gray-800 break-all">{equation}</div>
          
          <Button
            onClick={handleClick}
            className="w-full h-12 sm:h-16 text-base sm:text-xl font-bold bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white rounded-xl sm:rounded-2xl transform hover:scale-105 transition-all"
          >
            {solved ? 'Correct! ✓' : 'Fix the equation'}
          </Button>

          {solved && (
            <p className="text-green-600 text-sm sm:text-base font-semibold animate-bounce">
              You added a line to make it work!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrickPuzzle;
