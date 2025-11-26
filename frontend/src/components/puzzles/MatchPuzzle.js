import React, { useState } from 'react';

const MatchPuzzle = ({ puzzle, onSuccess, puzzleKey }) => {
  const [draggedShape, setDraggedShape] = useState(null);
  const [matched, setMatched] = useState([]);

  const handleDragStart = (shape, index) => {
    setDraggedShape({ shape, index });
  };

  const handleDrop = (targetIndex) => {
    if (draggedShape && draggedShape.index === targetIndex && !matched.includes(targetIndex)) {
      const newMatched = [...matched, targetIndex];
      setMatched(newMatched);
      
      if (newMatched.length === puzzle.shapes.length) {
        setTimeout(() => onSuccess(), 800);
      }
    }
    setDraggedShape(null);
  };

  return (
    <div className="h-full flex items-center justify-center">
      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-2 gap-12">
          {/* Shapes to drag */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white text-center mb-6">Shapes</h3>
            {puzzle.shapes.map((shape, index) => (
              <div
                key={index}
                draggable={!matched.includes(index)}
                onDragStart={() => handleDragStart(shape, index)}
                className={`
                  h-24 bg-white rounded-2xl flex items-center justify-center text-6xl
                  cursor-grab active:cursor-grabbing shadow-xl transform transition-all
                  ${
                    matched.includes(index)
                      ? 'opacity-30 cursor-not-allowed'
                      : 'hover:scale-105'
                  }
                `}
              >
                {shape}
              </div>
            ))}
          </div>

          {/* Holes to drop */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white text-center mb-6">Holes</h3>
            {puzzle.shapes.map((shape, index) => (
              <div
                key={index}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(index)}
                className={`
                  h-24 rounded-2xl flex items-center justify-center text-6xl
                  border-4 border-dashed transition-all
                  ${
                    matched.includes(index)
                      ? 'bg-green-500 border-green-700'
                      : 'bg-white/20 border-white/50 backdrop-blur-sm'
                  }
                `}
              >
                {matched.includes(index) ? shape : '?'}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchPuzzle;
