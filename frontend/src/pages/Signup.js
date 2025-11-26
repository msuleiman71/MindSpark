import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { Button } from '../components/ui/button';
import { Brain, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';

const AVATAR_OPTIONS = ['🧠', '🚀', '🎯', '🏆', '⭐', '👑', '🤓', '🤖', '🎮', '💡'];

const Signup = () => {
  const navigate = useNavigate();
  const { signup, error: authError, setError } = useAuth();
  const { settings } = useGame();
  const themeGradient = 'from-purple-500 via-pink-500 to-red-500';
  const isDark = settings.theme === 'dark';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    avatar: '🧠'
  });
  const [loading, setLoading] = useState(false);
  const [error, setLocalError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setLocalError('');
    setError(null);
  };

  const handleAvatarSelect = (avatar) => {
    setFormData({ ...formData, avatar });
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setLocalError('Please fill in all fields');
      return false;
    }

    if (formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters long');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await signup(formData.email, formData.name, formData.password, formData.avatar);
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      setLocalError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${themeGradient} flex items-center justify-center p-4`}>
        <div className="bg-white rounded-3xl p-8 shadow-2xl text-center max-w-md">
          <div className="mb-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Account Created!</h2>
          <p className="text-gray-600">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${themeGradient} flex items-center justify-center p-4 ${isDark ? 'dark' : ''}`}>
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-white p-6 rounded-full shadow-2xl">
              <Brain className="w-16 h-16 text-purple-600" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white drop-shadow-lg">
            MINDSPARK
          </h1>
          <p className="text-lg text-white/90 mt-2">Create your account</p>
        </div>

        {/* Signup Form */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message */}
            {(error || authError) && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error || authError}</p>
              </div>
            )}

            {/* Avatar Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Choose Your Avatar
              </label>
              <div className="flex flex-wrap gap-2 justify-center">
                {AVATAR_OPTIONS.map((avatar) => (
                  <button
                    key={avatar}
                    type="button"
                    onClick={() => handleAvatarSelect(avatar)}
                    className={`text-3xl w-14 h-14 rounded-xl transition-all transform hover:scale-110 ${
                      formData.avatar === avatar
                        ? 'bg-purple-100 ring-2 ring-purple-500 scale-110'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>

            {/* Name Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                  placeholder="Your name"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                  placeholder="Min. 6 characters"
                  required
                />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>

            {/* Signup Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-purple-600 font-bold hover:text-purple-700 transition-colors"
              >
                Login
              </Link>
            </p>
          </div>

          {/* Guest Mode */}
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Continue as Guest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
