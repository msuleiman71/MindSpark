import React, { useState } from 'react';
import { Button } from '../ui/button';

const InteractivePuzzle = ({ onSuccess, puzzleKey }) => {
  const [isShaking, setIsShaking] = useState(false);
  const [appleCount, setAppleCount] = useState(0);
  const [applesShown, setApplesShown] = useState(false);
  const [answer, setAnswer] = useState('');

  const handleShake = () => {
    setIsShaking(true);
    setApplesShown(true);
    setAppleCount(7);
    setTimeout(() => setIsShaking(false), 500);
  };

  const handleSubmit = () => {
    if (answer === '7') {
      setTimeout(() => onSuccess(), 500);
    }
  };

  return (
    <div className="h-full flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-12 shadow-2xl max-w-2xl w-full space-y-4 sm:space-y-6">
        {/* Tree */}
        <div className="text-center">
          <div
            className={`text-6xl sm:text-7xl md:text-9xl inline-block transition-transform ${
              isShaking ? 'animate-shake' : ''
            }`}
          >
            🌳
          </div>
          
          {/* Apples on tree */}
          {applesShown && (
            <div className="mt-4 flex justify-center flex-wrap gap-2">
              {Array.from({ length: appleCount }).map((_, i) => (
                <span key={i} className="text-2xl sm:text-3xl md:text-4xl animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>
                  🍎
                </span>
              ))}
            </div>
          )}
        </div>

        {!applesShown ? (
          <Button
            onClick={handleShake}
            className="w-full h-12 sm:h-16 text-lg sm:text-xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl sm:rounded-2xl"
          >
            Shake the Tree!
          </Button>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            <input
              type="number"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="How many apples?"
              className="w-full h-16 text-2xl text-center rounded-2xl border-4 border-gray-300 px-4"
            />
            <Button
              onClick={handleSubmit}
              className="w-full h-14 text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-2xl"
            >
              Submit Answer
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractivePuzzle;
