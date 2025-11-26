import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { ArrowLeft, Plus, Trash2, Eye, Send, Sparkles } from 'lucide-react';
import api from '../services/api';

const PuzzleCreator = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [question, setQuestion] = useState('');
  const [type, setType] = useState('tap');
  const [category, setCategory] = useState('general');
  const [difficulty, setDifficulty] = useState('medium');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [hint, setHint] = useState('');
  const [explanation, setExplanation] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const puzzleTypes = [
    { value: 'tap', label: 'Tap Puzzle' },
    { value: 'input', label: 'Input Answer' },
    { value: 'sequence', label: 'Sequence' },
    { value: 'find', label: 'Find the Item' }
  ];

  const categories = [
    { value: 'general', label: 'General Knowledge' },
    { value: 'math', label: 'Math' },
    { value: 'logic', label: 'Logic' },
    { value: 'word', label: 'Word Puzzle' },
    { value: 'visual', label: 'Visual' }
  ];

  const difficulties = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' }
  ];

  const handleAddOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
      if (correctAnswer >= newOptions.length) {
        setCorrectAnswer(newOptions.length - 1);
      }
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const validatePuzzle = () => {
    if (!title.trim()) {
      setError('Please enter a title');
      return false;
    }
    if (!question.trim()) {
      setError('Please enter a question');
      return false;
    }
    if (type === 'tap' || type === 'find') {
      if (options.filter(o => o.trim()).length < 2) {
        setError('Please provide at least 2 options');
        return false;
      }
      if (!options[correctAnswer]?.trim()) {
        setError('Please select a valid correct answer');
        return false;
      }
    }
    setError('');
    return true;
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!validatePuzzle()) {
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const puzzleData = {
        title,
        description,
        question,
        type,
        category,
        difficulty,
        hint,
        explanation
      };

      // Add type-specific data
      if (type === 'tap' || type === 'find') {
        puzzleData.options = options.filter(o => o.trim());
        puzzleData.correctAnswer = correctAnswer;
      } else if (type === 'input') {
        puzzleData.correctAnswer = options[0];
      } else if (type === 'sequence') {
        puzzleData.sequence = options.filter(o => o.trim());
      }

      await api.post('/community/puzzles', puzzleData);
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/community-puzzles');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create puzzle');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 flex items-center justify-center p-4">
        <Card className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">Please login to create puzzles</p>
          <Button onClick={() => navigate('/login')} className="w-full">
            Go to Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 p-2 sm:p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            onClick={() => navigate('/community-puzzles')}
            className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm rounded-full h-10 sm:h-12 px-4 sm:px-6"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            <span className="text-sm sm:text-base">Back</span>
          </Button>
          <div className="text-center flex-1 mx-4">
            <h1 className="text-2xl sm:text-4xl font-black text-white drop-shadow-lg flex items-center gap-2 justify-center">
              <Sparkles className="w-6 h-6 sm:w-10 sm:h-10" />
              <span className="text-xl sm:text-4xl">Puzzle Creator</span>
            </h1>
          </div>
          <div className="w-20 sm:w-24"></div>
        </div>

        {/* Success Message */}
        {success && (
          <Card className="bg-green-50 border-2 border-green-500 p-4 sm:p-6 rounded-2xl sm:rounded-3xl text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-green-700 mb-2">✅ Puzzle Created!</h3>
            <p className="text-sm sm:text-base text-green-600">Redirecting to community puzzles...</p>
          </Card>
        )}

        {/* Error Message */}
        {error && (
          <Card className="bg-red-50 border-2 border-red-500 p-4 rounded-2xl text-center">
            <p className="text-sm sm:text-base text-red-600 font-semibold">{error}</p>
          </Card>
        )}

        {/* Creator Form */}
        <Card className="bg-white/95 backdrop-blur-sm p-4 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl">
          <div className="space-y-4 sm:space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm sm:text-base font-bold text-gray-700 mb-2">
                Puzzle Title *
              </label>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your puzzle a catchy title"
                className="h-10 sm:h-12 text-sm sm:text-base"
                maxLength={100}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm sm:text-base font-bold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description"
                className="w-full h-20 sm:h-24 p-3 border rounded-xl text-sm sm:text-base"
                maxLength={200}
              />
            </div>

            {/* Type, Category, Difficulty */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Type *</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full h-10 sm:h-12 px-3 border rounded-xl text-sm sm:text-base"
                >
                  {puzzleTypes.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-10 sm:h-12 px-3 border rounded-xl text-sm sm:text-base"
                >
                  {categories.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full h-10 sm:h-12 px-3 border rounded-xl text-sm sm:text-base"
                >
                  {difficulties.map(d => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Question */}
            <div>
              <label className="block text-sm sm:text-base font-bold text-gray-700 mb-2">
                Question *
              </label>
              <Input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What is your puzzle question?"
                className="h-10 sm:h-12 text-sm sm:text-base"
                maxLength={200}
              />
            </div>

            {/* Options/Answers */}
            <div>
              <label className="block text-sm sm:text-base font-bold text-gray-700 mb-2">
                {type === 'input' ? 'Correct Answer *' : type === 'sequence' ? 'Sequence Items *' : 'Options *'}
              </label>
              <div className="space-y-2 sm:space-y-3">
                {options.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    {(type === 'tap' || type === 'find') && (
                      <input
                        type="radio"
                        checked={correctAnswer === index}
                        onChange={() => setCorrectAnswer(index)}
                        className="mt-3 sm:mt-4"
                      />
                    )}
                    <Input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`${type === 'input' ? 'Answer' : type === 'sequence' ? `Item ${index + 1}` : `Option ${index + 1}`}`}
                      className="flex-1 h-10 sm:h-12 text-sm sm:text-base"
                    />
                    {options.length > 2 && index > 1 && (type !== 'input') && (
                      <Button
                        onClick={() => handleRemoveOption(index)}
                        variant="outline"
                        className="h-10 sm:h-12 px-2 sm:px-3"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {type !== 'input' && options.length < 6 && (
                  <Button
                    onClick={handleAddOption}
                    variant="outline"
                    className="w-full h-10 sm:h-12 text-sm sm:text-base"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Option
                  </Button>
                )}
              </div>
            </div>

            {/* Hint */}
            <div>
              <label className="block text-sm sm:text-base font-bold text-gray-700 mb-2">
                Hint (Optional)
              </label>
              <Input
                type="text"
                value={hint}
                onChange={(e) => setHint(e.target.value)}
                placeholder="Give players a hint"
                className="h-10 sm:h-12 text-sm sm:text-base"
                maxLength={150}
              />
            </div>

            {/* Explanation */}
            <div>
              <label className="block text-sm sm:text-base font-bold text-gray-700 mb-2">
                Explanation (Optional)
              </label>
              <textarea
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="Explain the answer after puzzle is solved"
                className="w-full h-20 sm:h-24 p-3 border rounded-xl text-sm sm:text-base"
                maxLength={300}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <Button
                onClick={() => setShowPreview(!showPreview)}
                variant="outline"
                className="flex-1 h-12 sm:h-14 text-base sm:text-lg font-bold border-2 rounded-xl"
              >
                <Eye className="w-5 h-5 mr-2" />
                {showPreview ? 'Hide Preview' : 'Preview'}
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || success}
                className="flex-1 h-12 sm:h-14 text-base sm:text-lg font-bold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl"
              >
                <Send className="w-5 h-5 mr-2" />
                {isSubmitting ? 'Publishing...' : 'Publish Puzzle'}
              </Button>
            </div>
          </div>
        </Card>

        {/* Preview */}
        {showPreview && (
          <Card className="bg-white/95 backdrop-blur-sm p-4 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 text-center">Preview</h3>
            <div className="bg-blue-50 p-4 sm:p-6 rounded-xl sm:rounded-2xl">
              <h4 className="text-lg sm:text-xl font-bold text-gray-800 mb-3">{title || 'Untitled Puzzle'}</h4>
              <p className="text-base sm:text-lg text-gray-700 mb-4">{question || 'Your question will appear here'}</p>
              {(type === 'tap' || type === 'find') && (
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {options.filter(o => o.trim()).map((opt, idx) => (
                    <div
                      key={idx}
                      className={`p-3 sm:p-4 rounded-xl text-center font-bold text-sm sm:text-base ${
                        idx === correctAnswer ? 'bg-green-200 border-2 border-green-500' : 'bg-white'
                      }`}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              )}
              {type === 'input' && (
                <div className="bg-white p-3 sm:p-4 rounded-xl">
                  <p className="text-sm text-gray-600">Answer: {options[0] || '___'}</p>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PuzzleCreator;
