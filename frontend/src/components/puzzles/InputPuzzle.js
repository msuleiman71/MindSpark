import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const InputPuzzle = ({ puzzle, onSuccess }) => {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    if (answer.trim() === puzzle.correctAnswer) {
      setTimeout(() => onSuccess(), 500);
    } else {
      setError(true);
      setTimeout(() => setError(false), 1000);
    }
  };

  return (
    <div className="h-full flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-12 shadow-2xl max-w-md w-full space-y-4 sm:space-y-6">
        {/* Visual representation */}
        <div className="flex justify-center">
          <div className="text-5xl sm:text-6xl md:text-8xl">👕</div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <Input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Enter your answer"
            className={`h-12 sm:h-16 text-lg sm:text-2xl text-center rounded-xl sm:rounded-2xl border-4 ${
              error ? 'border-red-500 animate-shake' : 'border-gray-300'
            }`}
          />
          <Button
            onClick={handleSubmit}
            className="w-full h-12 sm:h-14 text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl sm:rounded-2xl"
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InputPuzzle;
