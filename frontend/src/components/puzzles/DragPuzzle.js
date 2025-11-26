import React, { useState, useEffect, useRef } from 'react';
import { Cat, Fish } from 'lucide-react';

const DragPuzzle = ({ onSuccess, puzzleKey }) => {
  const containerRef = useRef(null);
  const [catPosition, setCatPosition] = useState({ x: 0, y: 0 });
  const [fishPosition, setFishPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Initialize positions based on container size
  useEffect(() => {
    const initializePositions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        
        // Position cat on left side (20% from left, 40% from top)
        setCatPosition({ 
          x: width * 0.2 - 40, 
          y: height * 0.4 - 40 
        });
        
        // Position fish on right side (75% from left, 40% from top)
        setFishPosition({ 
          x: width * 0.75 - 40, 
          y: height * 0.4 - 40 
        });
        
        setInitialized(true);
      }
    };

    initializePositions();
    window.addEventListener('resize', initializePositions);
    
    return () => window.removeEventListener('resize', initializePositions);
  }, [puzzleKey]);

  useEffect(() => {
    // Reset when puzzle key changes
    setIsDragging(false);
    setInitialized(false);
  }, [puzzleKey]);

  const handleMouseDown = () => setIsDragging(true);
  
  const handleMouseMove = (e) => {
    if (isDragging && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
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

  const handleTouchMove = (e) => {
    if (isDragging && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
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
  };

  if (!initialized) return <div className="h-full bg-gradient-to-b from-blue-200 to-green-200 rounded-2xl sm:rounded-3xl min-h-[300px] sm:min-h-[400px]" />;

  return (
    <div
      ref={containerRef}
      className="h-full bg-gradient-to-b from-blue-200 to-green-200 rounded-2xl sm:rounded-3xl relative min-h-[300px] sm:min-h-[400px]"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
    >
      {/* Instruction text */}
      <div className="absolute top-4 sm:top-8 left-1/2 transform -translate-x-1/2 bg-white/80 backdrop-blur-sm px-3 sm:px-6 py-2 sm:py-3 rounded-full max-w-[90%]">
        <p className="text-sm sm:text-lg font-bold text-gray-800">Drag the cat to the fish! 🐱➡️🐟</p>
      </div>

      {/* Cat */}
      <div
        className="absolute bg-gradient-to-br from-orange-400 to-orange-600 p-3 sm:p-6 rounded-full cursor-grab active:cursor-grabbing transform hover:scale-110 transition-transform shadow-2xl z-10"
        style={{ left: `${catPosition.x}px`, top: `${catPosition.y}px` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        <Cat className="w-10 h-10 sm:w-16 sm:h-16 text-white" strokeWidth={2.5} />
      </div>

      {/* Fish */}
      <div
        className="absolute bg-gradient-to-br from-blue-500 to-blue-700 p-3 sm:p-6 rounded-full shadow-2xl z-10 animate-pulse"
        style={{ left: `${fishPosition.x}px`, top: `${fishPosition.y}px` }}
      >
        <Fish className="w-10 h-10 sm:w-16 sm:h-16 text-white" strokeWidth={2.5} />
      </div>
    </div>
  );
};

export default DragPuzzle;
