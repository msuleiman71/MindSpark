import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ArrowLeft, Star, Play, ThumbsUp, Eye, Plus, TrendingUp, Clock } from 'lucide-react';

const CommunityPuzzles = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { settings } = useGame();
  const [puzzles, setPuzzles] = useState([]);
  const [filter, setFilter] = useState('trending');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const themeGradient = 'from-teal-500 via-cyan-500 to-blue-500';
  const isDark = settings.theme === 'dark';

  const categories = [
    { id: 'all', name: 'All', icon: '🎯' },
    { id: 'logic', name: 'Logic', icon: '🧠' },
    { id: 'math', name: 'Math', icon: '🔢' },
    { id: 'word', name: 'Word', icon: '📝' },
    { id: 'visual', name: 'Visual', icon: '👁️' },
    { id: 'trick', name: 'Trick', icon: '🎭' },
  ];

  useEffect(() => {
    // Load community puzzles from localStorage
    const communityPuzzles = JSON.parse(localStorage.getItem('communityPuzzles') || '[]');
    setPuzzles(communityPuzzles);
  }, []);

  const filteredPuzzles = puzzles
    .filter(p => selectedCategory === 'all' || p.category === selectedCategory)
    .sort((a, b) => {
      if (filter === 'trending') return (b.plays + b.likes * 2) - (a.plays + a.likes * 2);
      if (filter === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (filter === 'popular') return b.plays - a.plays;
      return 0;
    });

  const handlePlayPuzzle = (puzzle) => {
    // Navigate to a custom puzzle play page
    navigate(`/community-puzzle/${puzzle.id}`);
  };

  const handleLikePuzzle = (puzzleId) => {
    const updated = puzzles.map(p => 
      p.id === puzzleId ? { ...p, likes: p.likes + 1 } : p
    );
    setPuzzles(updated);
    localStorage.setItem('communityPuzzles', JSON.stringify(updated));
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${themeGradient} p-3 sm:p-4 ${isDark ? 'dark' : ''}`}>
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <Button
            onClick={() => navigate('/')}
            className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm rounded-full h-10 sm:h-12 px-4 sm:px-6"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white drop-shadow-lg">
            Community Puzzles
          </h1>
          <Button
            onClick={() => navigate('/puzzle-creator')}
            className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm rounded-full h-10 sm:h-12 px-4 sm:px-6"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Create</span>
          </Button>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <Card className="bg-white/95 backdrop-blur-sm p-3 sm:p-4 rounded-xl sm:rounded-2xl text-center">
            <p className="text-2xl sm:text-3xl font-black text-purple-600">{puzzles.length}</p>
            <p className="text-xs sm:text-sm text-gray-600">Total Puzzles</p>
          </Card>
          <Card className="bg-white/95 backdrop-blur-sm p-3 sm:p-4 rounded-xl sm:rounded-2xl text-center">
            <p className="text-2xl sm:text-3xl font-black text-blue-600">{puzzles.reduce((sum, p) => sum + p.plays, 0)}</p>
            <p className="text-xs sm:text-sm text-gray-600">Total Plays</p>
          </Card>
          <Card className="bg-white/95 backdrop-blur-sm p-3 sm:p-4 rounded-xl sm:rounded-2xl text-center">
            <p className="text-2xl sm:text-3xl font-black text-pink-600">{puzzles.reduce((sum, p) => sum + p.likes, 0)}</p>
            <p className="text-xs sm:text-sm text-gray-600">Total Likes</p>
          </Card>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-white text-purple-600 scale-105'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <span>{cat.icon}</span>
              <span className="text-sm">{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Sort Filter */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('trending')}
            className={`flex-1 py-2 px-4 rounded-xl font-bold transition-all ${
              filter === 'trending'
                ? 'bg-white text-purple-600'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <TrendingUp className="w-4 h-4 inline mr-2" />
            Trending
          </button>
          <button
            onClick={() => setFilter('newest')}
            className={`flex-1 py-2 px-4 rounded-xl font-bold transition-all ${
              filter === 'newest'
                ? 'bg-white text-purple-600'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <Clock className="w-4 h-4 inline mr-2" />
            Newest
          </button>
          <button
            onClick={() => setFilter('popular')}
            className={`flex-1 py-2 px-4 rounded-xl font-bold transition-all ${
              filter === 'popular'
                ? 'bg-white text-purple-600'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <Star className="w-4 h-4 inline mr-2" />
            Popular
          </button>
        </div>

        {/* Puzzles Grid */}
        {filteredPuzzles.length === 0 ? (
          <Card className="bg-white/95 backdrop-blur-sm p-12 rounded-3xl text-center">
            <div className="text-gray-400 mb-4">
              <Plus className="w-20 h-20 mx-auto mb-4" />
              <h3 className="text-2xl font-black text-gray-600 mb-2">No Puzzles Yet</h3>
              <p className="text-gray-500">Be the first to create a puzzle!</p>
            </div>
            <Button
              onClick={() => navigate('/puzzle-creator')}
              className="h-12 px-8 text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl"
            >
              Create First Puzzle
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPuzzles.map((puzzle) => (
              <Card key={puzzle.id} className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden hover:scale-105 transition-transform">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 text-white">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-black leading-tight">{puzzle.title}</h3>
                      <p className="text-xs opacity-80 mt-1">by {puzzle.creatorName} {puzzle.creatorAvatar}</p>
                    </div>
                    <span className="text-3xl">{categories.find(c => c.id === puzzle.category)?.icon}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-xs bg-white/20 px-2 py-1 rounded-full">{puzzle.difficulty}</span>
                    <span className="text-xs bg-white/20 px-2 py-1 rounded-full">{puzzle.category}</span>
                  </div>
                </div>
                
                <div className="p-4">
                  <p className="text-sm text-gray-700 mb-4 line-clamp-2">{puzzle.question}</p>
                  
                  <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Play className="w-4 h-4" />
                      <span>{puzzle.plays}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{puzzle.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span>{puzzle.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handlePlayPuzzle(puzzle)}
                      className="flex-1 h-10 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Play
                    </Button>
                    <Button
                      onClick={() => handleLikePuzzle(puzzle.id)}
                      className="h-10 px-4 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-xl"
                    >
                      <ThumbsUp className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityPuzzles;
