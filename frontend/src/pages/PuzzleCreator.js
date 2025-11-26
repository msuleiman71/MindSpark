import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ArrowLeft, Sparkles, Eye, Save, Plus } from 'lucide-react';

const PuzzleCreator = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { settings } = useGame();
  
  const [puzzleData, setPuzzleData] = useState({
    title: '',
    question: '',
    answer: '',
    hint: '',
    explanation: '',
    category: 'logic',
    difficulty: 'easy'
  });
  
  const [previewMode, setPreviewMode] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);

  const themeGradient = 'from-indigo-500 via-purple-500 to-pink-500';
  const isDark = settings.theme === 'dark';

  const categories = [
    { id: 'logic', name: 'Logic', icon: '🧠', color: 'from-blue-500 to-cyan-500' },
    { id: 'math', name: 'Math', icon: '🔢', color: 'from-purple-500 to-pink-500' },
    { id: 'word', name: 'Word', icon: '📝', color: 'from-green-500 to-emerald-500' },
    { id: 'visual', name: 'Visual', icon: '👁️', color: 'from-orange-500 to-red-500' },
    { id: 'trick', name: 'Trick', icon: '🎭', color: 'from-yellow-500 to-orange-500' },
  ];

  const difficulties = [
    { id: 'easy', name: 'Easy', color: 'text-green-600' },
    { id: 'medium', name: 'Medium', color: 'text-yellow-600' },
    { id: 'hard', name: 'Hard', color: 'text-red-600' },
  ];

  const handleInputChange = (field, value) => {
    setPuzzleData(prev => ({ ...prev, [field]: value }));
  };

  const handleTestAnswer = () => {
    const correct = userAnswer.toLowerCase().trim() === puzzleData.answer.toLowerCase().trim();
    setShowResult(true);
    
    setTimeout(() => {
      setShowResult(false);
      if (correct) setUserAnswer('');
    }, 2000);
  };

  const handleSavePuzzle = () => {
    // Save to community puzzles (backend API call would go here)
    const communityPuzzles = JSON.parse(localStorage.getItem('communityPuzzles') || '[]');
    const newPuzzle = {
      ...puzzleData,
      id: Date.now(),
      creatorId: user?.id,
      creatorName: user?.name || 'Guest',
      creatorAvatar: user?.avatar || '🧠',
      rating: 0,
      plays: 0,
      likes: 0,
      createdAt: new Date().toISOString()
    };
    
    communityPuzzles.push(newPuzzle);
    localStorage.setItem('communityPuzzles', JSON.stringify(communityPuzzles));
    
    alert('Puzzle saved to community! 🎉');
    navigate('/community-puzzles');
  };

  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${themeGradient} flex items-center justify-center p-4`}>
        <Card className="bg-white p-8 rounded-3xl text-center max-w-md">
          <h2 className="text-3xl font-black text-gray-800 mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">Please login to create puzzles</p>
          <Button onClick={() => navigate('/login')} className="w-full h-12 text-lg font-bold">
            Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${themeGradient} p-3 sm:p-4 ${isDark ? 'dark' : ''}`}>
      <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
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
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8" />
            Puzzle Creator
          </h1>
          <div className="w-16 sm:w-24"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Editor Panel */}
          <Card className="bg-white/95 backdrop-blur-sm p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-2xl">
            <h2 className="text-xl sm:text-2xl font-black text-gray-800 mb-4 flex items-center gap-2">
              <Plus className="w-6 h-6" />
              Create Your Puzzle
            </h2>
            
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Puzzle Title</label>
                <input
                  type="text"
                  value={puzzleData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., The Missing Number"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                <div className="grid grid-cols-5 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleInputChange('category', cat.id)}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        puzzleData.category === cat.id
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
                      onClick={() => handleInputChange('difficulty', diff.id)}
                      className={`flex-1 py-2 px-4 rounded-xl border-2 font-bold transition-all ${
                        puzzleData.difficulty === diff.id
                          ? 'border-purple-500 bg-purple-50 scale-105'
                          : 'border-gray-200 hover:border-gray-300'
                      } ${diff.color}`}
                    >
                      {diff.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Question</label>
                <textarea
                  value={puzzleData.question}
                  onChange={(e) => handleInputChange('question', e.target.value)}
                  placeholder="What is the puzzle question?"
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none resize-none"
                />
              </div>

              {/* Answer */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Answer</label>
                <input
                  type="text"
                  value={puzzleData.answer}
                  onChange={(e) => handleInputChange('answer', e.target.value)}
                  placeholder="The correct answer"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                />
              </div>

              {/* Hint */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Hint (Optional)</label>
                <input
                  type="text"
                  value={puzzleData.hint}
                  onChange={(e) => handleInputChange('hint', e.target.value)}
                  placeholder="A helpful hint"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                />
              </div>

              {/* Explanation */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Explanation</label>
                <textarea
                  value={puzzleData.explanation}
                  onChange={(e) => handleInputChange('explanation', e.target.value)}
                  placeholder="Explain the solution"
                  rows="2"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => setPreviewMode(!previewMode)}
                  className="flex-1 h-12 font-bold bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl"
                >
                  <Eye className="w-5 h-5 mr-2" />
                  {previewMode ? 'Edit' : 'Preview'}
                </Button>
                <Button
                  onClick={handleSavePuzzle}
                  disabled={!puzzleData.title || !puzzleData.question || !puzzleData.answer}
                  className="flex-1 h-12 font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl disabled:opacity-50"
                >
                  <Save className="w-5 h-5 mr-2" />
                  Save Puzzle
                </Button>
              </div>
            </div>
          </Card>

          {/* Preview Panel */}
          <Card className="bg-white/95 backdrop-blur-sm p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-2xl">
            <h2 className="text-xl sm:text-2xl font-black text-gray-800 mb-4 flex items-center gap-2">
              <Eye className="w-6 h-6" />
              Preview
            </h2>
            
            {previewMode ? (
              <div className="space-y-4">
                {/* Preview Header */}
                <div className="text-center mb-6">
                  <div className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 rounded-full mb-3">
                    <span className="text-2xl">{categories.find(c => c.id === puzzleData.category)?.icon}</span>
                  </div>
                  <h3 className="text-2xl font-black text-gray-800">{puzzleData.title || 'Untitled Puzzle'}</h3>
                  <p className={`text-sm font-bold mt-2 ${difficulties.find(d => d.id === puzzleData.difficulty)?.color}`}>
                    {puzzleData.difficulty.toUpperCase()}
                  </p>
                </div>

                {/* Question */}
                <div className="bg-blue-50 rounded-2xl p-6 text-center">
                  <p className="text-xl font-bold text-gray-800">
                    {puzzleData.question || 'Your question will appear here...'}
                  </p>
                </div>

                {/* Test Answer */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Test Your Puzzle</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleTestAnswer()}
                      placeholder="Type answer to test..."
                      className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                    />
                    <Button
                      onClick={handleTestAnswer}
                      className="px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl"
                    >
                      Check
                    </Button>
                  </div>
                  
                  {showResult && (
                    <div className={`mt-3 p-3 rounded-xl text-center font-bold ${
                      userAnswer.toLowerCase().trim() === puzzleData.answer.toLowerCase().trim()
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {userAnswer.toLowerCase().trim() === puzzleData.answer.toLowerCase().trim()
                        ? '✅ Correct!'
                        : '❌ Incorrect!'}
                    </div>
                  )}
                </div>

                {/* Hint */}
                {puzzleData.hint && (
                  <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4">
                    <p className="text-sm font-bold text-yellow-800">💡 Hint: {puzzleData.hint}</p>
                  </div>
                )}

                {/* Explanation */}
                {puzzleData.explanation && (
                  <div className="bg-purple-50 rounded-xl p-4">
                    <p className="text-sm font-bold text-purple-800 mb-2">📚 Explanation:</p>
                    <p className="text-sm text-gray-700">{puzzleData.explanation}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <Eye className="w-20 h-20 mx-auto mb-4" />
                <p className="text-lg">Click "Preview" to see your puzzle in action</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PuzzleCreator;
