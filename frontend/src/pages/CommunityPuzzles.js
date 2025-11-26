import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { ArrowLeft, Star, Play, ThumbsUp, Eye, Plus, TrendingUp, Clock, Search, Filter } from 'lucide-react';
import { communityAPI } from '../services/api';

const CommunityPuzzles = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [puzzles, setPuzzles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'general', label: 'General' },
    { value: 'math', label: 'Math' },
    { value: 'logic', label: 'Logic' },
    { value: 'word', label: 'Word' },
    { value: 'visual', label: 'Visual' }
  ];

  const difficulties = [
    { value: '', label: 'All Difficulties' },
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest', icon: Clock },
    { value: 'popular', label: 'Most Popular', icon: TrendingUp },
    { value: 'rating', label: 'Highest Rated', icon: Star }
  ];

  useEffect(() => {
    loadPuzzles();
  }, [sortBy, selectedCategory, selectedDifficulty, searchQuery]);

  const loadPuzzles = async () => {
    setLoading(true);
    try {
      const params = {
        sort_by: sortBy,
        limit: 50
      };
      
      if (selectedCategory) params.category = selectedCategory;
      if (selectedDifficulty) params.difficulty = selectedDifficulty;
      if (searchQuery) params.search = searchQuery;

      const response = await communityAPI.getPuzzles(params);
      setPuzzles(response.puzzles || []);
    } catch (error) {
      console.error('Failed to load puzzles:', error);
      setPuzzles([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPuzzle = (puzzle) => {
    navigate(`/community-puzzle/${puzzle.id}`, { state: { puzzle } });
  };

  const handleLikePuzzle = async (puzzleId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await communityAPI.likePuzzle(puzzleId);
      // Refresh puzzles
      loadPuzzles();
    } catch (error) {
      console.error('Failed to like puzzle:', error);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryEmoji = (category) => {
    switch (category) {
      case 'math': return '🔢';
      case 'logic': return '🧠';
      case 'word': return '📝';
      case 'visual': return '👁️';
      default: return '🎯';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 p-2 sm:p-4">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <Button
            onClick={() => navigate('/')}
            className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm rounded-full h-10 sm:h-12 px-4 sm:px-6"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            <span className="text-sm sm:text-base">Home</span>
          </Button>
          
          <div className="text-center flex-1">
            <h1 className="text-2xl sm:text-4xl font-black text-white drop-shadow-lg">
              🌍 Community Puzzles
            </h1>
            <p className="text-xs sm:text-sm text-white/80">{puzzles.length} puzzles available</p>
          </div>

          <Button
            onClick={() => navigate('/puzzle-creator')}
            className="bg-green-500 hover:bg-green-600 text-white rounded-full h-10 sm:h-12 px-4 sm:px-6 font-bold shadow-lg"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            <span className="text-sm sm:text-base">Create</span>
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="bg-white/95 backdrop-blur-sm p-3 sm:p-4 rounded-2xl sm:rounded-3xl shadow-xl">
          <div className="space-y-3">
            {/* Search Bar */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search puzzles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 sm:pl-10 h-10 sm:h-12 text-sm sm:text-base"
                />
              </div>
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="h-10 sm:h-12 px-3 sm:px-4"
              >
                <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>

            {/* Sort Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {sortOptions.map(option => {
                const Icon = option.icon;
                return (
                  <Button
                    key={option.value}
                    onClick={() => setSortBy(option.value)}
                    className={`flex-shrink-0 h-9 sm:h-10 px-3 sm:px-4 rounded-full text-sm sm:text-base ${
                      sortBy === option.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-1 sm:mr-2" />
                    {option.label}
                  </Button>
                );
              })}
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full h-10 px-3 border rounded-xl text-sm"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Difficulty</label>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="w-full h-10 px-3 border rounded-xl text-sm"
                  >
                    {difficulties.map(diff => (
                      <option key={diff.value} value={diff.value}>{diff.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Puzzles Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full mx-auto"></div>
            <p className="text-white mt-4">Loading puzzles...</p>
          </div>
        ) : puzzles.length === 0 ? (
          <Card className="bg-white/95 p-12 rounded-3xl text-center">
            <p className="text-xl text-gray-600 mb-4">No puzzles found</p>
            <Button onClick={() => navigate('/puzzle-creator')} className="bg-green-500 hover:bg-green-600">
              <Plus className="w-5 h-5 mr-2" />
              Create First Puzzle
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {puzzles.map(puzzle => (
              <Card key={puzzle.id} className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all hover:scale-105">
                {/* Puzzle Header */}
                <div className={`p-4 sm:p-6 bg-gradient-to-r ${
                  puzzle.difficulty === 'easy' ? 'from-green-400 to-emerald-500' :
                  puzzle.difficulty === 'medium' ? 'from-yellow-400 to-orange-500' :
                  'from-red-400 to-pink-500'
                }`}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-lg sm:text-xl font-bold text-white flex-1 line-clamp-2">
                      {puzzle.title}
                    </h3>
                    <span className="text-2xl">{getCategoryEmoji(puzzle.category)}</span>
                  </div>
                  <p className="text-white/90 text-xs sm:text-sm line-clamp-2 mb-2">{puzzle.description}</p>
                  <div className="flex items-center gap-2 text-white/90 text-xs">
                    <span>By {puzzle.creator_name}</span>
                  </div>
                </div>

                {/* Puzzle Stats */}
                <div className="p-4 sm:p-6 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-bold">{puzzle.rating.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Eye className="w-4 h-4" />
                        <span>{puzzle.plays}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{puzzle.likes}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getDifficultyColor(puzzle.difficulty)}`}>
                      {puzzle.difficulty}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handlePlayPuzzle(puzzle)}
                      className="flex-1 h-10 sm:h-12 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-bold"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Play
                    </Button>
                    <Button
                      onClick={() => handleLikePuzzle(puzzle.id)}
                      variant="outline"
                      className="h-10 sm:h-12 px-3 sm:px-4 rounded-xl"
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
