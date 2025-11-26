import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { progressAPI, userAPI } from '../services/api';

const GameContext = createContext();

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
};

export const GameProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  // User Profile
  const [userProfile, setUserProfile] = useState({
    name: 'Brain Master',
    avatar: '🧠',
    level: 1,
    totalStars: 0,
    totalScore: 0,
    gamesPlayed: 0,
    achievements: []
  });

  // Game State
  const [hints, setHints] = useState(5);
  const [lives, setLives] = useState(3);
  const [coins, setCoins] = useState(100);
  const [powerUps, setPowerUps] = useState({
    skipLevel: 0,
    freezeTimer: 0,
    extraHints: 0
  });

  // Settings
  const [settings, setSettings] = useState({
    soundEnabled: true,
    theme: 'light',
    selectedTheme: 'classic',
    timerMode: false
  });

  // Apply theme on mount and when it changes
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  // Level Progress
  const [levelProgress, setLevelProgress] = useState({});
  const [completedLevels, setCompletedLevels] = useState([]);
  const [dailyChallenge, setDailyChallenge] = useState(null);

  // Leaderboard
  const [leaderboard, setLeaderboard] = useState([
    { rank: 1, name: 'Pro Gamer', score: 15000, avatar: '🏆' },
    { rank: 2, name: 'Puzzle King', score: 14500, avatar: '👑' },
    { rank: 3, name: 'Brain Master', score: 14000, avatar: '🧠' },
    { rank: 4, name: 'Quiz Queen', score: 13500, avatar: '👸' },
    { rank: 5, name: 'Smart Cookie', score: 13000, avatar: '🍪' }
  ]);

  // Load progress from backend or localStorage
  useEffect(() => {
    const loadProgress = async () => {
      if (isAuthenticated && user) {
        // Load from backend if authenticated
        try {
          const data = await progressAPI.load();
          if (data.level_progress && Object.keys(data.level_progress).length > 0) {
            setLevelProgress(data.level_progress);
          }
          if (data.settings) {
            setSettings({...settings, ...data.settings});
          }
          if (data.user) {
            setCoins(data.user.coins || 100);
            setHints(data.user.hints || 5);
            setLives(data.user.lives || 3);
          }
          if (user.name) {
            setUserProfile(prev => ({
              ...prev,
              name: user.name,
              avatar: user.avatar || prev.avatar
            }));
          }
          console.log('Progress loaded from cloud');
        } catch (err) {
          console.error('Failed to load progress from cloud:', err);
          // Fall back to localStorage
          loadFromLocalStorage();
        }
      } else {
        // Load from localStorage if not authenticated
        loadFromLocalStorage();
      }
    };

    const loadFromLocalStorage = () => {
      const savedProfile = localStorage.getItem('userProfile');
      const savedHints = localStorage.getItem('hints');
      const savedLives = localStorage.getItem('lives');
      const savedCoins = localStorage.getItem('coins');
      const savedPowerUps = localStorage.getItem('powerUps');
      const savedSettings = localStorage.getItem('settings');
      const savedProgress = localStorage.getItem('levelProgress');
      const savedCompleted = localStorage.getItem('completedLevels');

      if (savedProfile) setUserProfile(JSON.parse(savedProfile));
      if (savedHints) setHints(parseInt(savedHints));
      if (savedLives) setLives(parseInt(savedLives));
      if (savedCoins) setCoins(parseInt(savedCoins));
      if (savedPowerUps) setPowerUps(JSON.parse(savedPowerUps));
      if (savedSettings) setSettings(JSON.parse(savedSettings));
      if (savedProgress) setLevelProgress(JSON.parse(savedProgress));
      if (savedCompleted) setCompletedLevels(JSON.parse(savedCompleted));
    };

    loadProgress();
  }, [isAuthenticated, user]);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('hints', hints.toString());
    
    // Sync hints to backend if authenticated
    if (isAuthenticated) {
      const syncHints = async () => {
        try {
          await userAPI.updateProfile({ hints });
        } catch (err) {
          console.error('Failed to sync hints:', err);
        }
      };
      const timeoutId = setTimeout(syncHints, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [hints, isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('lives', lives.toString());
    
    // Sync lives to backend if authenticated
    if (isAuthenticated) {
      const syncLives = async () => {
        try {
          await userAPI.updateProfile({ lives });
        } catch (err) {
          console.error('Failed to sync lives:', err);
        }
      };
      const timeoutId = setTimeout(syncLives, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [lives, isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('coins', coins.toString());
    
    // Sync coins to backend if authenticated
    if (isAuthenticated) {
      const syncCoins = async () => {
        try {
          await userAPI.updateProfile({ coins });
        } catch (err) {
          console.error('Failed to sync coins:', err);
        }
      };
      const timeoutId = setTimeout(syncCoins, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [coins, isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('powerUps', JSON.stringify(powerUps));
  }, [powerUps]);

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('levelProgress', JSON.stringify(levelProgress));
    
    // Auto-sync to backend if authenticated
    if (isAuthenticated && Object.keys(levelProgress).length > 0) {
      const syncToBackend = async () => {
        try {
          await progressAPI.sync({
            level_progress: levelProgress,
            settings: settings
          });
          console.log('Progress synced to cloud');
        } catch (err) {
          console.error('Failed to sync progress:', err);
        }
      };
      // Debounce sync to avoid too many requests
      const timeoutId = setTimeout(syncToBackend, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [levelProgress, isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('completedLevels', JSON.stringify(completedLevels));
  }, [completedLevels]);

  // Helper Functions
  const updateProfile = (updates) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
  };

  const addCoins = (amount) => {
    setCoins(prev => prev + amount);
  };

  const spendCoins = (amount) => {
    if (coins >= amount) {
      setCoins(prev => prev - amount);
      return true;
    }
    return false;
  };

  const usePowerUp = (type) => {
    if (powerUps[type] > 0) {
      setPowerUps(prev => ({ ...prev, [type]: prev[type] - 1 }));
      return true;
    }
    return false;
  };

  const buyPowerUp = (type, cost) => {
    if (spendCoins(cost)) {
      setPowerUps(prev => ({ ...prev, [type]: prev[type] + 1 }));
      return true;
    }
    return false;
  };

  const completeLevel = (levelId, stars, time, attempts) => {
    // Update completed levels
    if (!completedLevels.includes(levelId)) {
      setCompletedLevels(prev => [...prev, levelId]);
    }

    // Update level progress
    const currentProgress = levelProgress[levelId] || { stars: 0, bestTime: Infinity, attempts: 0 };
    setLevelProgress(prev => ({
      ...prev,
      [levelId]: {
        stars: Math.max(currentProgress.stars, stars),
        bestTime: Math.min(currentProgress.bestTime, time),
        attempts: currentProgress.attempts + attempts
      }
    }));

    // Calculate rewards
    const coinsEarned = stars * 10;
    addCoins(coinsEarned);

    // Update profile stats
    const newTotalStars = Object.values({
      ...levelProgress,
      [levelId]: {
        ...levelProgress[levelId],
        stars: Math.max(currentProgress.stars, stars)
      }
    }).reduce((sum, progress) => sum + (progress.stars || 0), 0);

    updateProfile({
      totalStars: newTotalStars,
      totalScore: userProfile.totalScore + (stars * 100),
      gamesPlayed: userProfile.gamesPlayed + 1
    });
  };

  const resetLives = () => {
    setLives(3);
  };

  const loseLife = () => {
    if (lives > 0) {
      setLives(prev => prev - 1);
      return lives - 1;
    }
    return 0;
  };

  const toggleTheme = () => {
    const newTheme = settings.theme === 'light' ? 'dark' : 'light';
    setSettings(prev => ({
      ...prev,
      theme: newTheme
    }));
    
    // Apply immediately
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleSound = () => {
    setSettings(prev => ({
      ...prev,
      soundEnabled: !prev.soundEnabled
    }));
  };

  const value = {
    userProfile,
    updateProfile,
    hints,
    setHints,
    lives,
    setLives,
    loseLife,
    resetLives,
    coins,
    setCoins,
    addCoins,
    spendCoins,
    powerUps,
    usePowerUp,
    buyPowerUp,
    settings,
    setSettings,
    toggleTheme,
    toggleSound,
    levelProgress,
    completedLevels,
    completeLevel,
    leaderboard,
    dailyChallenge,
    setDailyChallenge
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
