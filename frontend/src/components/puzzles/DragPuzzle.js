import React, { useState, useEffect } from 'react';
import { Cat, Fish } from 'lucide-react';

const DragPuzzle = ({ onSuccess, puzzleKey }) => {
  const [catPosition, setCatPosition] = useState({ x: 100, y: 150 });
  const [isDragging, setIsDragging] = useState(false);
  const fishPosition = { x: 600, y: 200 };

  useEffect(() => {
    // Reset position when puzzle key changes
    setCatPosition({ x: 100, y: 150 });
    setIsDragging(false);
  }, [puzzleKey]);

  const handleMouseDown = () => setIsDragging(true);
  
  const handleMouseMove = (e) => {
    if (isDragging) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left - 40;
      const y = e.clientY - rect.top - 40;
      setCatPosition({ x, y });

      // Check if cat reached fish
      const distance = Math.sqrt(
        Math.pow(x - fishPosition.x, 2) + Math.pow(y - fishPosition.y, 2)
      );
      if (distance < 100) {
        setIsDragging(false);
        setTimeout(() => onSuccess(), 300);
      }
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div
      className="h-full bg-gradient-to-b from-blue-200 to-green-200 rounded-3xl relative min-h-[400px]"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={(e) => {
        if (isDragging) {
          const rect = e.currentTarget.getBoundingClientRect();
          const touch = e.touches[0];
          const x = touch.clientX - rect.left - 40;
          const y = touch.clientY - rect.top - 40;
          setCatPosition({ x, y });

          const distance = Math.sqrt(
            Math.pow(x - fishPosition.x, 2) + Math.pow(y - fishPosition.y, 2)
          );
          if (distance < 100) {
            setIsDragging(false);
            setTimeout(() => onSuccess(), 300);
          }
        }
      }}
      onTouchEnd={handleMouseUp}
    >
      {/* Instruction text */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full">
        <p className="text-lg font-bold text-gray-800">Drag the cat to the fish! 🐱➡️🐟</p>
      </div>

      {/* Cat */}
      <div
        className="absolute bg-gradient-to-br from-orange-400 to-orange-600 p-6 rounded-full cursor-grab active:cursor-grabbing transform hover:scale-110 transition-transform shadow-2xl z-10"
        style={{ left: `${catPosition.x}px`, top: `${catPosition.y}px` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        <Cat className="w-16 h-16 text-white" strokeWidth={2.5} />
      </div>

      {/* Fish */}
      <div
        className="absolute bg-gradient-to-br from-blue-500 to-blue-700 p-6 rounded-full shadow-2xl z-10 animate-pulse"
        style={{ left: `${fishPosition.x}px`, top: `${fishPosition.y}px` }}
      >
        <Fish className="w-16 h-16 text-white" strokeWidth={2.5} />
      </div>
    </div>
  );
};

export default DragPuzzle;
