import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Trophy, ArrowRight, Grid3x3, Star, Coins } from 'lucide-react';
import Confetti from './Confetti';

const SuccessModal = ({ level, explanation, onNext, onLevels, stars = 3, coinsEarned = 30, isLastLevel = false }) => {
  const [showConfetti, setShowConfetti] = useState(true);

  return (
    <>
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />
      
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 space-y-6 animate-scaleIn">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-6 rounded-full animate-bounce shadow-2xl">
              <Trophy className="w-16 h-16 text-white" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center space-y-4">
            <h2 className="text-5xl font-black text-gray-800 animate-pulse">
              {isLastLevel ? 'Amazing! 🎊' : 'Perfect! 🎉'}
            </h2>
            <p className="text-2xl font-bold text-gray-700">
              {isLastLevel ? '🏆 All Levels Complete! 🏆' : `Level ${level} Complete!`}
            </p>
            
            {/* Stars Display */}
            <div className="flex justify-center gap-2 my-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-12 h-12 transition-all duration-300 ${
                    i < stars
                      ? 'text-yellow-400 fill-yellow-400 scale-110 animate-bounce'
                      : 'text-gray-300'
                  }`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>

            {/* Rewards */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-2xl border-2 border-yellow-200">
              <div className="flex items-center justify-center gap-3">
                <Coins className="w-8 h-8 text-yellow-600" />
                <span className="text-3xl font-black text-yellow-600">+{coinsEarned}</span>
                <span className="text-lg font-semibold text-gray-600">Coins Earned!</span>
              </div>
            </div>

            <p className="text-md text-gray-600 italic">
              {explanation}
            </p>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <Button
              onClick={onNext}
              className="w-full h-14 text-xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl transform hover:scale-105 transition-all shadow-lg"
            >
              Next Level
              <ArrowRight className="w-6 h-6 ml-2" />
            </Button>
            
            <Button
              onClick={onLevels}
              variant="outline"
              className="w-full h-14 text-xl font-bold border-2 border-gray-300 hover:bg-gray-100 rounded-2xl"
            >
              <Grid3x3 className="w-6 h-6 mr-2" />
              Level Select
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SuccessModal;
