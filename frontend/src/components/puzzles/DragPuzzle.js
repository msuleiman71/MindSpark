import React, { useState, useEffect } from 'react';
import { Cat, Fish } from 'lucide-react';

const DragPuzzle = ({ onSuccess, puzzleKey }) => {
  const [catPosition, setCatPosition] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const fishPosition = { x: 400, y: 250 };

  useEffect(() => {
    // Reset position when puzzle key changes
    setCatPosition({ x: 50, y: 50 });
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
      if (distance < 80) {
        setIsDragging(false);
        setTimeout(() => onSuccess(), 300);
      }
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div
      className="h-full bg-gradient-to-b from-blue-200 to-green-200 rounded-3xl relative overflow-hidden cursor-move"
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
          if (distance < 80) {
            setIsDragging(false);
            setTimeout(() => onSuccess(), 300);
          }
        }
      }}
      onTouchEnd={handleMouseUp}
    >
      {/* Cat */}
      <div
        className="absolute bg-orange-400 p-4 rounded-full cursor-grab active:cursor-grabbing transform hover:scale-110 transition-transform shadow-xl"
        style={{ left: `${catPosition.x}px`, top: `${catPosition.y}px` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        <Cat className="w-12 h-12 text-white" />
      </div>

      {/* Fish */}
      <div
        className="absolute bg-blue-500 p-4 rounded-full shadow-xl"
        style={{ left: `${fishPosition.x}px`, top: `${fishPosition.y}px` }}
      >
        <Fish className="w-12 h-12 text-white" />
      </div>
    </div>
  );
};

export default DragPuzzle;
