// Adaptive Difficulty AI System

export class AdaptiveDifficultyEngine {
  constructor() {
    this.playerStats = this.loadStats();
  }

  loadStats() {
    const saved = localStorage.getItem('playerDifficultyStats');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      averageTime: 45, // seconds
      successRate: 0.7,
      streakCount: 0,
      categoryPerformance: {},
      recommendedDifficulty: 'medium'
    };
  }

  saveStats() {
    localStorage.setItem('playerDifficultyStats', JSON.stringify(this.playerStats));
  }

  // Update stats after puzzle completion
  recordPuzzleResult(puzzleId, category, difficulty, timeSpent, success, stars) {
    // Update average time
    this.playerStats.averageTime = 
      (this.playerStats.averageTime * 0.8) + (timeSpent * 0.2);

    // Update success rate
    const newRate = success ? 1 : 0;
    this.playerStats.successRate = 
      (this.playerStats.successRate * 0.9) + (newRate * 0.1);

    // Update streak
    if (success && stars >= 2) {
      this.playerStats.streakCount++;
    } else {
      this.playerStats.streakCount = 0;
    }

    // Update category performance
    if (!this.playerStats.categoryPerformance[category]) {
      this.playerStats.categoryPerformance[category] = {
        successRate: 0,
        averageStars: 0,
        attempts: 0
      };
    }

    const catStats = this.playerStats.categoryPerformance[category];
    catStats.attempts++;
    catStats.successRate = (catStats.successRate * 0.9) + (newRate * 0.1);
    catStats.averageStars = (catStats.averageStars * 0.9) + (stars * 0.1);

    // Recalculate recommended difficulty
    this.updateRecommendedDifficulty();
    this.saveStats();
  }

  updateRecommendedDifficulty() {
    const { successRate, averageTime, streakCount } = this.playerStats;

    // AI Logic for difficulty adjustment
    if (successRate > 0.85 && averageTime < 30 && streakCount > 5) {
      this.playerStats.recommendedDifficulty = 'expert';
    } else if (successRate > 0.75 && averageTime < 45) {
      this.playerStats.recommendedDifficulty = 'hard';
    } else if (successRate > 0.6) {
      this.playerStats.recommendedDifficulty = 'medium';
    } else {
      this.playerStats.recommendedDifficulty = 'easy';
    }
  }

  getRecommendedDifficulty() {
    return this.playerStats.recommendedDifficulty;
  }

  getCategoryRecommendation(category) {
    const catStats = this.playerStats.categoryPerformance[category];
    if (!catStats || catStats.attempts < 3) {
      return 'medium'; // Default for new categories
    }

    if (catStats.successRate > 0.8 && catStats.averageStars > 2.5) {
      return 'hard';
    } else if (catStats.successRate > 0.6) {
      return 'medium';
    } else {
      return 'easy';
    }
  }

  getPlayerInsights() {
    return {
      level: this.getPlayerLevel(),
      strongestCategory: this.getStrongestCategory(),
      weakestCategory: this.getWeakestCategory(),
      recommendedDifficulty: this.getRecommendedDifficulty(),
      improvementTips: this.getImprovementTips()
    };
  }

  getPlayerLevel() {
    const { successRate, averageTime } = this.playerStats;
    if (successRate > 0.85 && averageTime < 30) return 'Expert';
    if (successRate > 0.75 && averageTime < 45) return 'Advanced';
    if (successRate > 0.6) return 'Intermediate';
    return 'Beginner';
  }

  getStrongestCategory() {
    let best = null;
    let bestScore = 0;

    Object.entries(this.playerStats.categoryPerformance).forEach(([cat, stats]) => {
      const score = stats.successRate * stats.averageStars;
      if (score > bestScore) {
        bestScore = score;
        best = cat;
      }
    });

    return best || 'None yet';
  }

  getWeakestCategory() {
    let worst = null;
    let worstScore = Infinity;

    Object.entries(this.playerStats.categoryPerformance).forEach(([cat, stats]) => {
      const score = stats.successRate * stats.averageStars;
      if (score < worstScore && stats.attempts > 2) {
        worstScore = score;
        worst = cat;
      }
    });

    return worst || 'None yet';
  }

  getImprovementTips() {
    const tips = [];
    const { successRate, averageTime } = this.playerStats;

    if (successRate < 0.5) {
      tips.push('Try easier difficulty levels to build confidence');
    }
    if (averageTime > 60) {
      tips.push('Practice speed by using Time Attack mode');
    }
    if (this.playerStats.streakCount < 2) {
      tips.push('Focus on consistency to build longer streaks');
    }

    const weakest = this.getWeakestCategory();
    if (weakest !== 'None yet') {
      tips.push(`Practice more ${weakest} puzzles to improve`);
    }

    return tips.length > 0 ? tips : ['Keep up the great work!'];
  }
}

export const difficultyEngine = new AdaptiveDifficultyEngine();
