import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ArrowLeft, Sparkles, Wand2, Loader, Save, Eye } from 'lucide-react';

const AIPuzzleGenerator = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { settings } = useGame();
  
  const [category, setCategory] = useState('logic');
  const [difficulty, setDifficulty] = useState('medium');
  const [count, setCount] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [generatedPuzzles, setGeneratedPuzzles] = useState([]);
  const [error, setError] = useState('');

  const themeGradient = 'from-violet-500 via-purple-500 to-fuchsia-500';
  const isDark = settings.theme === 'dark';

  const categories = [
    { id: 'logic', name: 'Logic', icon: '🧠', color: 'from-blue-500 to-cyan-500' },
    { id: 'math', name: 'Math', icon: '🔢', color: 'from-purple-500 to-pink-500' },
    { id: 'word', name: 'Word', icon: '📝', color: 'from-green-500 to-emerald-500' },
    { id: 'riddle', name: 'Riddle', icon: '🤔', color: 'from-orange-500 to-red-500' },
    { id: 'trick', name: 'Trick', icon: '🎭', color: 'from-yellow-500 to-orange-500' },
  ];

  const difficulties = [
    { id: 'easy', name: 'Easy', color: 'text-green-600', bg: 'bg-green-100' },
    { id: 'medium', name: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { id: 'hard', name: 'Hard', color: 'text-red-600', bg: 'bg-red-100' },
  ];

  const handleGenerate = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setGenerating(true);
    setError('');

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/ai/generate-puzzles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          category,
          difficulty,
          count
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate puzzles');
      }

      const puzzles = await response.json();
      setGeneratedPuzzles(puzzles);
    } catch (err) {
      setError(err.message || 'Failed to generate puzzles. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleSavePuzzle = (puzzle) => {
    const communityPuzzles = JSON.parse(localStorage.getItem('communityPuzzles') || '[]');
    const newPuzzle = {
      ...puzzle,
      id: Date.now() + Math.random(),
      title: puzzle.question.substring(0, 50),
      creatorId: user?.id,
      creatorName: user?.name || 'AI Assistant',
      creatorAvatar: '🤖',
      rating: 0,
      plays: 0,
      likes: 0,
      createdAt: new Date().toISOString()
    };
    
    communityPuzzles.push(newPuzzle);
    localStorage.setItem('communityPuzzles', JSON.stringify(communityPuzzles));
    
    alert('Puzzle saved to community! 🎉');
  };

  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${themeGradient} flex items-center justify-center p-4`}>
        <Card className="bg-white p-8 rounded-3xl text-center max-w-md">
          <Sparkles className="w-20 h-20 text-purple-600 mx-auto mb-4" />
          <h2 className="text-3xl font-black text-gray-800 mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">Please login to use AI puzzle generation</p>
          <Button onClick={() => navigate('/login')} className="w-full h-12 text-lg font-bold">
            Login
          </Button>
        </Card>
      </div>
    );
  }

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
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white drop-shadow-lg flex items-center gap-2">
            <Wand2 className="w-6 h-6 sm:w-8 sm:h-8" />
            AI Puzzle Generator
          </h1>
          <div className="w-16 sm:w-24"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Generator Panel */}
          <Card className="bg-white/95 backdrop-blur-sm p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-2xl">
            <h2 className="text-xl sm:text-2xl font-black text-gray-800 mb-4 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-600" />
              Generate Puzzles
            </h2>
            
            <div className="space-y-4">
              {/* Category */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                <div className="grid grid-cols-5 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        category === cat.id
                          ? 'border-purple-500 bg-purple-50 scale-105'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-2xl">{cat.icon}</span>
                      <p className="text-xs font-bold mt-1">{cat.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Difficulty</label>
                <div className="flex gap-2">
                  {difficulties.map((diff) => (
                    <button
                      key={diff.id}
                      onClick={() => setDifficulty(diff.id)}
                      className={`flex-1 py-2 px-4 rounded-xl border-2 font-bold transition-all ${
                        difficulty === diff.id
                          ? 'border-purple-500 ' + diff.bg + ' scale-105'
                          : 'border-gray-200 hover:border-gray-300'
                      } ${diff.color}`}
                    >
                      {diff.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Count */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Number of Puzzles</label>
                <div className="flex gap-2">
                  {[1, 2, 3].map((num) => (
                    <button
                      key={num}
                      onClick={() => setCount(num)}
                      className={`flex-1 py-2 px-4 rounded-xl border-2 font-bold transition-all ${
                        count === num
                          ? 'border-purple-500 bg-purple-50 scale-105'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-center">
                  <p className="text-sm font-bold text-red-600">{error}</p>
                </div>
              )}

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={generating}
                className="w-full h-14 text-xl font-bold bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600 hover:from-purple-700 hover:via-violet-700 hover:to-fuchsia-700 text-white rounded-xl shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
              >
                {generating ? (
                  <span className="flex items-center justify-center gap-3">
                    <Loader className="w-6 h-6 animate-spin" />
                    Generating Magic...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-3">
                    <Wand2 className="w-6 h-6" />
                    Generate with AI
                  </span>
                )}
              </Button>

              {/* Info */}
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-600">
                  ✨ Powered by GPT-4 AI • Creates unique puzzles instantly
                </p>
              </div>
            </div>
          </Card>

          {/* Results Panel */}
          <Card className="bg-white/95 backdrop-blur-sm p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-2xl max-h-[600px] overflow-y-auto">
            <h2 className="text-xl sm:text-2xl font-black text-gray-800 mb-4 flex items-center gap-2">
              <Eye className="w-6 h-6 text-purple-600" />
              Generated Puzzles
            </h2>
            
            {generatedPuzzles.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Wand2 className="w-20 h-20 mx-auto mb-4" />
                <p className="text-lg">Your AI-generated puzzles will appear here</p>
                <p className="text-sm mt-2">Configure settings and click generate!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {generatedPuzzles.map((puzzle, index) => (
                  <Card key={index} className="border-2 border-purple-200 p-4 rounded-xl">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{categories.find(c => c.id === puzzle.category)?.icon}</span>
                        <span className="text-xs font-bold px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                          {puzzle.difficulty}
                        </span>
                      </div>
                      <Button
                        onClick={() => handleSavePuzzle(puzzle)}
                        className="h-8 px-3 text-xs font-bold bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg"
                      >
                        <Save className="w-3 h-3 mr-1" />
                        Save
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-bold text-gray-500">Question:</p>
                        <p className="text-sm font-bold text-gray-800">{puzzle.question}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs font-bold text-gray-500">Answer:</p>
                        <p className="text-sm text-green-600 font-bold">{puzzle.answer}</p>
                      </div>
                      
                      {puzzle.hint && (
                        <div className="bg-yellow-50 rounded-lg p-2">
                          <p className="text-xs font-bold text-yellow-800">💡 {puzzle.hint}</p>
                        </div>
                      )}
                      
                      {puzzle.explanation && (
                        <div className="bg-blue-50 rounded-lg p-2">
                          <p className="text-xs text-gray-700">{puzzle.explanation}</p>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIPuzzleGenerator;
