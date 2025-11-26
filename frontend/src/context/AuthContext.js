import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, progressAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('auth_token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('auth_token');
      if (storedToken) {
        try {
          const userData = await authAPI.getCurrentUser();
          setUser(userData);
          setToken(storedToken);
        } catch (err) {
          console.error('Auth check failed:', err);
          // Clear invalid token
          localStorage.removeItem('auth_token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    // Add a small delay to avoid race conditions
    const timeoutId = setTimeout(checkAuth, 100);
    return () => clearTimeout(timeoutId);
  }, []);

  const signup = async (email, name, password, avatar = '🧠') => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await authAPI.signup(email, name, password, avatar);
      
      // Store token and user
      localStorage.setItem('auth_token', response.access_token);
      setToken(response.access_token);
      setUser(response.user);
      
      // Migrate localStorage data if exists
      await migrateLocalStorageData();
      
      setLoading(false);
      return response;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await authAPI.login(email, password);
      
      // Store token and user
      localStorage.setItem('auth_token', response.access_token);
      setToken(response.access_token);
      setUser(response.user);
      
      setLoading(false);
      return response;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear local state regardless of API call success
      localStorage.removeItem('auth_token');
      setToken(null);
      setUser(null);
    }
  };

  const migrateLocalStorageData = async () => {
    try {
      // Get existing localStorage data
      const levelProgress = JSON.parse(localStorage.getItem('levelProgress') || '{}');
      const settings = JSON.parse(localStorage.getItem('settings') || '{}');
      const achievements = JSON.parse(localStorage.getItem('achievements') || '[]');
      
      // Only migrate if there's data
      if (Object.keys(levelProgress).length > 0) {
        await progressAPI.sync({
          level_progress: levelProgress,
          settings: settings,
          achievements: achievements
        });
        
        console.log('Successfully migrated localStorage data to cloud');
      }
    } catch (err) {
      console.error('Failed to migrate localStorage data:', err);
    }
  };

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!token && !!user,
    signup,
    login,
    logout,
    setError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
