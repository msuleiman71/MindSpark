import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Switch } from '../components/ui/switch';
import { ArrowLeft, Volume2, VolumeX, Sun, Moon, RotateCcw, Trash2 } from 'lucide-react';

const Settings = () => {
  const navigate = useNavigate();
  const { settings, toggleTheme, toggleSound, setHints, setLives, setCoins } = useGame();

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all progress? This cannot be undone!')) {
      localStorage.clear();
      setHints(5);
      setLives(3);
      setCoins(100);
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-400 to-indigo-400 p-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            onClick={() => navigate('/')}
            className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm rounded-full h-12 px-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <h1 className="text-4xl font-black text-white drop-shadow-lg">Settings</h1>
          <div className="w-24"></div>
        </div>

        {/* Sound Settings */}
        <Card className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl">
          <h3 className="text-2xl font-black text-gray-800 mb-6">Audio</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {settings.soundEnabled ? (
                  <Volume2 className="w-8 h-8 text-green-600" />
                ) : (
                  <VolumeX className="w-8 h-8 text-gray-400" />
                )}
                <div>
                  <h4 className="text-lg font-bold text-gray-800">Sound Effects</h4>
                  <p className="text-sm text-gray-600">Play sounds during gameplay</p>
                </div>
              </div>
              <Switch
                checked={settings.soundEnabled}
                onCheckedChange={toggleSound}
                className="data-[state=checked]:bg-green-600"
              />
            </div>
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-4">
                <span className="text-3xl">🎵</span>
                <div>
                  <h4 className="text-lg font-bold text-gray-800">Background Music</h4>
                  <p className="text-sm text-gray-600">Ambient music while playing</p>
                </div>
              </div>
              <Switch
                checked={settings.musicEnabled || false}
                onCheckedChange={(enabled) => {
                  setSettings(prev => ({ ...prev, musicEnabled: enabled }));
                }}
                className="data-[state=checked]:bg-purple-600"
              />
            </div>
          </div>
        </Card>

        {/* Theme Settings */}
        <Card className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl">
          <h3 className="text-2xl font-black text-gray-800 mb-6">Appearance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {settings.theme === 'light' ? (
                  <Sun className="w-8 h-8 text-yellow-600" />
                ) : (
                  <Moon className="w-8 h-8 text-indigo-600" />
                )}
                <div>
                  <h4 className="text-lg font-bold text-gray-800">Dark Mode</h4>
                  <p className="text-sm text-gray-600">Switch between light and dark theme</p>
                </div>
              </div>
              <Switch
                checked={settings.theme === 'dark'}
                onCheckedChange={toggleTheme}
                className="data-[state=checked]:bg-indigo-600"
              />
            </div>

            <Button
              onClick={() => navigate('/themes')}
              className="w-full h-14 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold rounded-2xl"
            >
              🎨 Customize Themes
            </Button>
          </div>
        </Card>

        {/* Game Settings */}
        <Card className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl">
          <h3 className="text-2xl font-black text-gray-800 mb-6">Game Options</h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-2xl border-2 border-blue-200">
              <h4 className="text-lg font-bold text-gray-800 mb-2">Timer Mode</h4>
              <p className="text-sm text-gray-600">Challenge yourself with time limits on each puzzle</p>
              <p className="text-xs text-blue-600 mt-2 font-semibold">Coming in next update!</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-2xl border-2 border-purple-200">
              <h4 className="text-lg font-bold text-gray-800 mb-2">Multiplayer</h4>
              <p className="text-sm text-gray-600">Compete with friends in real-time</p>
              <p className="text-xs text-purple-600 mt-2 font-semibold">Coming in next update!</p>
            </div>
          </div>
        </Card>

        {/* Reset Progress */}
        <Card className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border-2 border-red-200">
          <h3 className="text-2xl font-black text-red-600 mb-6 flex items-center gap-3">
            <Trash2 className="w-7 h-7" />
            Danger Zone
          </h3>
          <div className="space-y-4">
            <p className="text-gray-600">Reset all your progress, coins, and achievements. This action cannot be undone.</p>
            <Button
              onClick={handleReset}
              className="w-full h-14 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-bold rounded-2xl text-lg"
            >
              <RotateCcw className="w-6 h-6 mr-2" />
              Reset All Progress
            </Button>
          </div>
        </Card>

        {/* About */}
        <Card className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl text-center">
          <h3 className="text-2xl font-black text-gray-800 mb-4">MindSpark</h3>
          <p className="text-gray-600 mb-2">Version 1.0 - Ultimate Brain Puzzles</p>
          <p className="text-sm text-gray-500">Built with React & FastAPI</p>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
