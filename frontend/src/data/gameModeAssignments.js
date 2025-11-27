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
  
  // Daily Challenge: Engaging mixed puzzles
  dailyChallenge: {
    range: [2000, 2039], // Logic + Math (engaging versions)
    count: 3,
    mode: 'random'
  },
  
  // Category Mode Assignments (ENGAGING PUZZLES)
  categories: {
    logic: [2000, 2003], // 4 mind-bending logic puzzles
    math: [2020, 2023],   // 4 interesting math puzzles
    word: [2040, 2043],   // 4 creative word puzzles
    riddle: [2060, 2063], // 4 brain-teaser riddles
    trick: [2080, 2083]   // 4 mind-bending tricks
  },
  
  // Time Attack: Mixed engaging puzzles
  timeAttack: {
    puzzles: [2000, 2001, 2020, 2021, 2040, 2041, 2060, 2061, 2080, 2081],
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
  
  // Combine both puzzle banks
  const allPuzzles = [...largePuzzleBank, ...engagingPuzzles];
  
  if (config.range) {
    const [start, end] = config.range;
    return allPuzzles.filter(p => p.id >= start && p.id <= end);
  }
  
  if (config.puzzles) {
    return allPuzzles.filter(p => config.puzzles.includes(p.id));
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
  const allPuzzles = [...largePuzzleBank, ...engagingPuzzles];
  return allPuzzles.filter(p => p.id >= start && p.id <= end);
};
