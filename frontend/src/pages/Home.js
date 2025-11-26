import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Brain, Play, Trophy } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-yellow-400 flex items-center justify-center p-4">
      <div className="text-center space-y-8 animate-fadeIn">
        {/* Logo and Title */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="bg-white p-8 rounded-full shadow-2xl transform hover:scale-110 transition-transform duration-300">
              <Brain className="w-24 h-24 text-purple-600" />
            </div>
          </div>
          <h1 className="text-6xl font-black text-white drop-shadow-lg tracking-tight">
            BRAIN TEST
          </h1>
          <p className="text-2xl font-bold text-white drop-shadow-md">
            Tricky Puzzles
          </p>
        </div>

        {/* Main Menu Buttons */}
        <div className="space-y-4 max-w-md mx-auto">
          <Button
            onClick={() => navigate('/levels')}
            className="w-full h-16 text-2xl font-bold bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            <Play className="w-8 h-8 mr-3" />
            Play
          </Button>

          <Button
            onClick={() => navigate('/levels')}
            className="w-full h-16 text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            <Trophy className="w-8 h-8 mr-3" />
            Continue
          </Button>
        </div>

        {/* Footer */}
        <div className="text-white text-sm opacity-80 mt-8">
          <p>Tap to start your brain adventure!</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
