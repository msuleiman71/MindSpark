// Game Mode Puzzle Assignments
// Each mode gets unique puzzles to avoid repetition

import { largePuzzleBank } from './largePuzzleBank';
import { engagingPuzzles } from './engagingPuzzles';

// ASSIGNMENTS:
// Main Levels (All Levels page): ID 1-15 (original puzzles.js)
// Daily Challenge: Random 3 from ID 1000-1049
// Categories: Use ID ranges based on category
// Time Attack: Use ID 1050-1074
// Tournament: Use ID 1075-1099
// Community: Separate database (already done)

export const gameModePuzzles = {
  // Main 15 levels stay the same (puzzles.js 1-15)
  mainLevels: {
    range: [1, 15],
    source: 'original'
  },
  
  // Daily Challenge: Logic & Math puzzles
  dailyChallenge: {
    range: [1000, 1034], // Logic (1000-1004) + Math (1030-1034)
    count: 3,
    mode: 'random'
  },
  
  // Category Mode Assignments
  categories: {
    logic: [1000, 1004], // 5 logic puzzles
    math: [1030, 1034],   // 5 math puzzles
    word: [1060, 1064],   // 5 word puzzles
    riddle: [1090, 1094], // 5 riddle puzzles
    trick: [1120, 1124]   // 5 trick puzzles
  },
  
  // Time Attack: Mixed easy/medium
  timeAttack: {
    puzzles: [1000, 1001, 1030, 1031, 1060, 1061, 1090, 1091, 1120, 1121],
    mode: 'sequential'
  },
  
  // Weekly Tournament: Hard puzzles only
  tournament: {
    puzzles: [1004, 1034, 1064, 1094, 1124],
    mode: 'random'
  }
};

// Get puzzles for specific game mode
export const getPuzzlesForMode = (modeName) => {
  const config = gameModePuzzles[modeName];
  if (!config) return [];
  
  if (config.range) {
    const [start, end] = config.range;
    return largePuzzleBank.filter(p => p.id >= start && p.id <= end);
  }
  
  if (config.puzzles) {
    return largePuzzleBank.filter(p => config.puzzles.includes(p.id));
  }
  
  return [];
};

// Get random puzzles for daily challenge
export const getDailyChallengePuzzles = () => {
  const available = getPuzzlesForMode('dailyChallenge');
  const today = new Date().toDateString();
  const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const shuffled = [...available].sort(() => {
    return (seed % 100) - 50;
  });
  
  return shuffled.slice(0, 3);
};

// Get puzzles for specific category
export const getCategoryPuzzles = (categoryName) => {
  const ranges = gameModePuzzles.categories[categoryName.toLowerCase()];
  if (!ranges) return [];
  
  const [start, end] = ranges;
  return largePuzzleBank.filter(p => p.id >= start && p.id <= end);
};
