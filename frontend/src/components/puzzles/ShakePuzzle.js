import React, { useState } from 'react';

const ShakePuzzle = ({ onSuccess, puzzleKey }) => {
  const [sunPosition, setSunPosition] = useState({ x: 300, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [isNight, setIsNight] = useState(false);

  const handleMouseMove = (e) => {
    if (isDragging) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left - 40;
      const y = e.clientY - rect.top - 40;
      setSunPosition({ x, y });

      // Check if sun is dragged off screen (make it night)
      if (y < -80 || y > rect.height || x < -80 || x > rect.width) {
        setIsNight(true);
        setIsDragging(false);
        setTimeout(() => onSuccess(), 1000);
      }
    }
  };

  return (
    <div
      className={`h-full rounded-3xl relative overflow-hidden transition-all duration-1000 ${
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
          const x = touch.clientX - rect.left - 40;
          const y = touch.clientY - rect.top - 40;
          setSunPosition({ x, y });

          if (y < -80 || y > rect.height || x < -80 || x > rect.width) {
            setIsNight(true);
            setIsDragging(false);
            setTimeout(() => onSuccess(), 1000);
          }
        }
      }}
      onTouchEnd={() => setIsDragging(false)}
    >
      {/* Sun/Moon */}
      {!isNight && (
        <div
          className="absolute text-8xl cursor-grab active:cursor-grabbing transform hover:scale-110 transition-transform"
          style={{ left: `${sunPosition.x}px`, top: `${sunPosition.y}px` }}
          onMouseDown={() => setIsDragging(true)}
          onTouchStart={() => setIsDragging(true)}
        >
          ☀️
        </div>
      )}

      {/* Owl */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
        <div className={`text-9xl transition-all duration-1000 ${
          isNight ? 'animate-bounce' : 'grayscale opacity-50'
        }`}>
          🦉
        </div>
        {isNight && (
          <div className="text-center mt-4">
            <p className="text-white text-2xl font-bold animate-pulse">
              Hoot! Hoot! 🌙
            </p>
          </div>
        )}
      </div>

      {/* Stars (only at night) */}
      {isNight && (
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 text-4xl animate-pulse">⭐</div>
          <div className="absolute top-20 right-20 text-3xl animate-pulse" style={{ animationDelay: '0.5s' }}>⭐</div>
          <div className="absolute top-40 left-1/3 text-4xl animate-pulse" style={{ animationDelay: '1s' }}>⭐</div>
          <div className="absolute bottom-40 right-1/4 text-3xl animate-pulse" style={{ animationDelay: '1.5s' }}>⭐</div>
        </div>
      )}
    </div>
  );
};

export default ShakePuzzle;
