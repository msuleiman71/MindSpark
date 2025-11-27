// Daily Challenges System
import { getDailyChallengePuzzles } from './gameModeAssignments';

export const generateDailyChallenge = () => {
  const today = new Date().toDateString();
  
  // Get unique puzzles for daily challenge (different from main levels)
  const puzzles = getDailyChallengePuzzles();
  
  return {
    date: today,
    puzzles: puzzles,
    reward: 100, // coins
    bonusStars: 3
  };
};

export const checkDailyChallengeCompletion = (completedPuzzles) => {
  const daily = generateDailyChallenge();
  const requiredIds = daily.puzzles.map(p => p.id);
  return requiredIds.every(id => completedPuzzles.includes(id));
};
