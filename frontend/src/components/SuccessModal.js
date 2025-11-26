import React from 'react';
import { Button } from './ui/button';
import { Trophy, ArrowRight, Grid3x3 } from 'lucide-react';

const SuccessModal = ({ level, explanation, onNext, onLevels }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 space-y-6 animate-scaleIn">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-6 rounded-full animate-bounce">
            <Trophy className="w-16 h-16 text-white" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-black text-gray-800">
            Level {level} Complete!
          </h2>
          <p className="text-lg text-gray-600">
            {explanation}
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <Button
            onClick={onNext}
            className="w-full h-14 text-xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl transform hover:scale-105 transition-all"
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
  );
};

export default SuccessModal;
