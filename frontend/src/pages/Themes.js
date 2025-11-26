import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ArrowLeft, CheckCircle2, Palette } from 'lucide-react';

const themes = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Original MindSpark theme',
    gradient: 'from-purple-400 via-pink-400 to-yellow-400',
    preview: ['bg-purple-500', 'bg-pink-500', 'bg-yellow-500']
  },
  {
    id: 'ocean',
    name: 'Ocean Blue',
    description: 'Calm and refreshing',
    gradient: 'from-blue-400 via-cyan-400 to-teal-400',
    preview: ['bg-blue-500', 'bg-cyan-500', 'bg-teal-500']
  },
  {
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm and energetic',
    gradient: 'from-orange-400 via-red-400 to-pink-500',
    preview: ['bg-orange-500', 'bg-red-500', 'bg-pink-500']
  },
  {
    id: 'forest',
    name: 'Forest',
    description: 'Natural and peaceful',
    gradient: 'from-green-400 via-emerald-400 to-teal-500',
    preview: ['bg-green-500', 'bg-emerald-500', 'bg-teal-500']
  },
  {
    id: 'midnight',
    name: 'Midnight',
    description: 'Dark and mysterious',
    gradient: 'from-indigo-600 via-purple-700 to-pink-600',
    preview: ['bg-indigo-600', 'bg-purple-700', 'bg-pink-600']
  },
  {
    id: 'neon',
    name: 'Neon',
    description: 'Vibrant and electric',
    gradient: 'from-fuchsia-500 via-purple-500 to-indigo-500',
    preview: ['bg-fuchsia-500', 'bg-purple-500', 'bg-indigo-500']
  },
  {
    id: 'autumn',
    name: 'Autumn',
    description: 'Cozy and warm',
    gradient: 'from-amber-400 via-orange-500 to-red-500',
    preview: ['bg-amber-500', 'bg-orange-500', 'bg-red-500']
  },
  {
    id: 'galaxy',
    name: 'Galaxy',
    description: 'Space explorer',
    gradient: 'from-violet-600 via-purple-600 to-indigo-800',
    preview: ['bg-violet-600', 'bg-purple-600', 'bg-indigo-800']
  }
];

const Themes = () => {
  const navigate = useNavigate();
  const { settings, setSettings } = useGame();
  const [selectedTheme, setSelectedTheme] = useState(settings.selectedTheme || 'classic');

  const handleSelectTheme = (themeId) => {
    setSelectedTheme(themeId);
  };

  const applyTheme = () => {
    setSettings(prev => ({ ...prev, selectedTheme }));
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-500 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            onClick={() => navigate('/settings')}
            className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm rounded-full h-12 px-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <h1 className="text-4xl font-black text-white drop-shadow-lg flex items-center gap-3">
            <Palette className="w-10 h-10" />
            Themes
          </h1>
          <div className="w-24"></div>
        </div>

        {/* Themes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {themes.map((theme) => (
            <Card
              key={theme.id}
              onClick={() => handleSelectTheme(theme.id)}
              className={`bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden cursor-pointer transform transition-all hover:scale-105 ${
                selectedTheme === theme.id ? 'ring-4 ring-white' : ''
              }`}
            >
              {/* Theme Preview */}
              <div className={`h-32 bg-gradient-to-r ${theme.gradient} relative`}>
                {selectedTheme === theme.id && (
                  <div className="absolute top-4 right-4 bg-white rounded-full p-2">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                )}
              </div>

              {/* Theme Info */}
              <div className="p-6">
                <h3 className="text-2xl font-black text-gray-800 mb-2">{theme.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{theme.description}</p>

                {/* Color Preview */}
                <div className="flex gap-2">
                  {theme.preview.map((color, index) => (
                    <div key={index} className={`w-8 h-8 rounded-full ${color}`}></div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Apply Button */}
        <Card className="bg-white/95 backdrop-blur-sm p-6 rounded-3xl shadow-2xl text-center">
          <p className="text-lg text-gray-600 mb-4">
            Selected theme: <span className="font-black text-gray-800">{themes.find(t => t.id === selectedTheme)?.name}</span>
          </p>
          <Button
            onClick={() => navigate('/')}
            className="h-14 px-8 text-xl font-bold bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-2xl"
          >
            Apply & Continue
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Themes;
