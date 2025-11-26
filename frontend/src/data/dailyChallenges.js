// Daily Challenges System
import { advancedPuzzles } from './advancedPuzzles';

export const generateDailyChallenge = () => {
  const today = new Date().toDateString();
  const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Select 3 puzzles for daily challenge
  const shuffled = [...advancedPuzzles].sort(() => {
    return (seed % 100) - 50;
  });
  
  return {
    date: today,
    puzzles: shuffled.slice(0, 3),
    reward: 100, // coins
    bonusStars: 3
  };
};

export const checkDailyChallengeCompletion = (completedPuzzles) => {
  const daily = generateDailyChallenge();
  const requiredIds = daily.puzzles.map(p => p.id);
  return requiredIds.every(id => completedPuzzles.includes(id));
};
