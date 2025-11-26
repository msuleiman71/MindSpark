import React from 'react';
import { Zap } from 'lucide-react';

const ComboDisplay = ({ combo, streak }) => {
  if (combo <= 1) return null;

  return (
    <div className="fixed top-20 right-8 z-40 animate-bounce">
      <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white px-8 py-4 rounded-full shadow-2xl transform scale-110">
        <div className="flex items-center gap-3">
          <Zap className="w-8 h-8 animate-pulse" />
          <div>
            <p className="text-3xl font-black">{combo}x COMBO!</p>
            <p className="text-sm font-semibold">Streak: {streak}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComboDisplay;
