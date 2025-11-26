import React, { useState, useEffect } from 'react';
import { Sun, Moon, Bird, Star } from 'lucide-react';

const ShakePuzzle = ({ onSuccess, puzzleKey }) => {
  const [sunPosition, setSunPosition] = useState({ x: 400, y: 80 });
  const [isDragging, setIsDragging] = useState(false);
  const [isNight, setIsNight] = useState(false);

  useEffect(() => {
    // Reset when puzzle key changes
    setSunPosition({ x: 400, y: 80 });
    setIsDragging(false);
    setIsNight(false);
  }, [puzzleKey]);

  const handleMouseMove = (e) => {
    if (isDragging) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left - 50;
      const y = e.clientY - rect.top - 50;
      setSunPosition({ x, y });

      // Check if sun is dragged off screen (make it night)
      if (y < -100 || y > rect.height || x < -100 || x > rect.width) {
        setIsNight(true);
        setIsDragging(false);
        setTimeout(() => onSuccess(), 1000);
      }
    }
  };

  return (
    <div
      className={`h-full rounded-3xl relative min-h-[400px] transition-all duration-1000 ${
        isNight
          ? 'bg-gradient-to-b from-indigo-900 to-purple-900'
          : 'bg-gradient-to-b from-blue-300 to-blue-100'
      }`}
      onMouseMove={handleMouseMove}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onTouchMove={(e) => {
        if (isDragging) {
          const rect = e.currentTarget.getBoundingClientRect();
          const touch = e.touches[0];
          const x = touch.clientX - rect.left - 50;
          const y = touch.clientY - rect.top - 50;
          setSunPosition({ x, y });

          if (y < -100 || y > rect.height || x < -100 || x > rect.width) {
            setIsNight(true);
            setIsDragging(false);
            setTimeout(() => onSuccess(), 1000);
          }
        }
      }}
      onTouchEnd={() => setIsDragging(false)}
    >
      {/* Instruction text */}
      {!isNight && (
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full z-20">
          <p className="text-lg font-bold text-gray-800">Drag the sun away! ☀️</p>
        </div>
      )}

      {/* Sun */}
      {!isNight && (
        <div
          className="absolute bg-gradient-to-br from-yellow-300 to-yellow-500 p-6 rounded-full cursor-grab active:cursor-grabbing transform hover:scale-110 transition-transform shadow-2xl z-10"
          style={{ left: `${sunPosition.x}px`, top: `${sunPosition.y}px` }}
          onMouseDown={() => setIsDragging(true)}
          onTouchStart={() => setIsDragging(true)}
        >
          <Sun className="w-20 h-20 text-white" strokeWidth={2.5} />
        </div>
      )}

      {/* Owl */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10">
        <div className={`bg-gradient-to-br from-amber-600 to-amber-800 p-8 rounded-full shadow-2xl transition-all duration-1000 ${
          isNight ? 'animate-bounce scale-110' : 'grayscale opacity-50'
        }`}>
          <Bird className="w-28 h-28 text-white" strokeWidth={2} />
        </div>
        {isNight && (
          <div className="text-center mt-4">
            <p className="text-white text-2xl font-bold animate-pulse flex items-center justify-center gap-2">
              Hoot! Hoot! <Moon className="w-8 h-8" />
            </p>
          </div>
        )}
      </div>

      {/* Stars (only at night) */}
      {isNight && (
        <div className="absolute inset-0 z-5">
          <div className="absolute top-10 left-10 animate-pulse">
            <Star className="w-12 h-12 text-yellow-300 fill-yellow-300" />
          </div>
          <div className="absolute top-20 right-20 animate-pulse" style={{ animationDelay: '0.5s' }}>
            <Star className="w-10 h-10 text-yellow-300 fill-yellow-300" />
          </div>
          <div className="absolute top-40 left-1/3 animate-pulse" style={{ animationDelay: '1s' }}>
            <Star className="w-12 h-12 text-yellow-300 fill-yellow-300" />
          </div>
          <div className="absolute bottom-40 right-1/4 animate-pulse" style={{ animationDelay: '1.5s' }}>
            <Star className="w-10 h-10 text-yellow-300 fill-yellow-300" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ShakePuzzle;
