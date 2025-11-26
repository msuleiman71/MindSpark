import { useEffect } from 'react';
import { useGame } from '../context/GameContext';

export const themes = {
  classic: {
    id: 'classic',
    name: 'Classic',
    colors: {
      primary: 'from-purple-400 via-pink-400 to-yellow-400',
      secondary: 'from-blue-400 via-cyan-400 to-teal-400',
      accent: 'from-green-400 to-emerald-500'
    }
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean Blue',
    colors: {
      primary: 'from-blue-400 via-cyan-400 to-teal-400',
      secondary: 'from-indigo-400 via-blue-500 to-cyan-500',
      accent: 'from-cyan-400 to-blue-500'
    }
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset',
    colors: {
      primary: 'from-orange-400 via-red-400 to-pink-500',
      secondary: 'from-yellow-400 via-orange-500 to-red-500',
      accent: 'from-red-400 to-pink-500'
    }
  },
  forest: {
    id: 'forest',
    name: 'Forest',
    colors: {
      primary: 'from-green-400 via-emerald-400 to-teal-500',
      secondary: 'from-lime-400 via-green-500 to-emerald-600',
      accent: 'from-emerald-400 to-teal-500'
    }
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight',
    colors: {
      primary: 'from-indigo-600 via-purple-700 to-pink-600',
      secondary: 'from-slate-700 via-indigo-800 to-purple-900',
      accent: 'from-purple-600 to-pink-600'
    }
  },
  neon: {
    id: 'neon',
    name: 'Neon',
    colors: {
      primary: 'from-fuchsia-500 via-purple-500 to-indigo-500',
      secondary: 'from-pink-500 via-fuchsia-600 to-purple-600',
      accent: 'from-fuchsia-500 to-purple-600'
    }
  },
  autumn: {
    id: 'autumn',
    name: 'Autumn',
    colors: {
      primary: 'from-amber-400 via-orange-500 to-red-500',
      secondary: 'from-yellow-500 via-amber-600 to-orange-700',
      accent: 'from-orange-500 to-red-600'
    }
  },
  galaxy: {
    id: 'galaxy',
    name: 'Galaxy',
    colors: {
      primary: 'from-violet-600 via-purple-600 to-indigo-800',
      secondary: 'from-indigo-900 via-purple-800 to-pink-700',
      accent: 'from-purple-600 to-indigo-800'
    }
  }
};

export const useTheme = () => {
  const { settings } = useGame();
  const selectedTheme = themes[settings.selectedTheme] || themes.classic;

  useEffect(() => {
    // Apply theme colors as CSS variables
    const root = document.documentElement;
    root.style.setProperty('--theme-primary', selectedTheme.colors.primary);
    root.style.setProperty('--theme-secondary', selectedTheme.colors.secondary);
    root.style.setProperty('--theme-accent', selectedTheme.colors.accent);
  }, [selectedTheme]);

  return selectedTheme;
};

export const getThemeGradient = (themeId) => {
  return themes[themeId]?.colors.primary || themes.classic.colors.primary;
};
