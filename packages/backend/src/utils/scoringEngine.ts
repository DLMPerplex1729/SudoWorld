import { Difficulty2D, Difficulty3D, Difficulty } from '@sudoworld/shared';

interface ScoringParams {
  difficulty: Difficulty;
  solveTimeSeconds: number;
  mistakesCount: number;
  hintsUsed: number;
  avgSolveTimeSeconds: number;
}

interface ScoringResult {
  basePoints: number;
  difficultyMultiplier: number;
  timeBonus: number;
  mistakePenalty: number;
  hintPenalty: number;
  totalPoints: number;
}

export class ScoringEngine {
  /**
   * Calculate base points based on difficulty
   */
  private getBasePoints(difficulty: Difficulty): number {
    const basPoints2D: Record<Difficulty2D, number> = {
      'baby': 50,
      'beginner': 100,
      'easy': 150,
      'getting_the_hang_of_this': 200,
      'medium': 300,
      'getting_good': 400,
      'tricky': 500,
      'hard': 650,
      'difficult': 800,
      'extreme': 1000,
      'diabolical': 1250,
      'downright_evil': 1500,
      'please_tell_me_this_aint_impossible': 2000
    };

    const basePoints3D: Record<Difficulty3D, number> = {
      'beginner': 100,
      'easy': 200,
      'medium': 400,
      'hard': 600,
      'extreme': 900
    };

    return (basPoints2D[difficulty as Difficulty2D] || basePoints3D[difficulty as Difficulty3D] || 100);
  }

  /**
   * Get difficulty multiplier
   */
  private getDifficultyMultiplier(difficulty: Difficulty): number {
    const multipliers2D: Record<Difficulty2D, number> = {
      'baby': 0.5,
      'beginner': 0.75,
      'easy': 1.0,
      'getting_the_hang_of_this': 1.2,
      'medium': 1.5,
      'getting_good': 1.8,
      'tricky': 2.0,
      'hard': 2.3,
      'difficult': 2.6,
      'extreme': 3.0,
      'diabolical': 3.5,
      'downright_evil': 4.0,
      'please_tell_me_this_aint_impossible': 5.0
    };

    const multipliers3D: Record<Difficulty3D, number> = {
      'beginner': 1.0,
      'easy': 1.5,
      'medium': 2.0,
      'hard': 2.5,
      'extreme': 3.5
    };

    return (multipliers2D[difficulty as Difficulty2D] || multipliers3D[difficulty as Difficulty3D] || 1.0);
  }

  /**
   * Calculate time bonus (faster = more points)
   * Bonus is highest when solve time is optimal (around 60-80% of avg)
   */
  private calculateTimeBonus(solveTime: number, avgSolveTime: number): number {
    if (avgSolveTime <= 0) return 0;

    const optimalTime = avgSolveTime * 0.75; // 75% of average is optimal
    const timeFactor = solveTime / optimalTime;

    if (timeFactor <= 0.5) {
      // Very fast - maximum bonus
      return 50;
    } else if (timeFactor <= 1.0) {
      // Optimal zone - linear bonus from 25 to 50
      return 25 + (1.0 - timeFactor) * 100;
    } else if (timeFactor <= 2.0) {
      // Slower than optimal - linear penalty from 25 to -25
      return 25 - (timeFactor - 1.0) * 50;
    } else {
      // Very slow
      return -25;
    }
  }

  /**
   * Calculate mistake penalty
   */
  private calculateMistakePenalty(mistakes: number): number {
    const penaltyPerMistake = 10;
    return Math.min(mistakes * penaltyPerMistake, 100); // Max 100 point penalty
  }

  /**
   * Calculate hint penalty
   */
  private calculateHintPenalty(hintsUsed: number): number {
    const penaltyPerHint = 5;
    return Math.min(hintsUsed * penaltyPerHint, 50); // Max 50 point penalty
  }

  /**
   * Calculate total score
   */
  calculateScore(params: ScoringParams): ScoringResult {
    const basePoints = this.getBasePoints(params.difficulty);
    const difficultyMultiplier = this.getDifficultyMultiplier(params.difficulty);
    const timeBonus = this.calculateTimeBonus(params.solveTimeSeconds, params.avgSolveTimeSeconds);
    const mistakePenalty = this.calculateMistakePenalty(params.mistakesCount);
    const hintPenalty = this.calculateHintPenalty(params.hintsUsed);

    const totalPoints = Math.max(
      0,
      Math.round(
        basePoints * difficultyMultiplier * (1 + (timeBonus / 100)) - mistakePenalty - hintPenalty
      )
    );

    return {
      basePoints,
      difficultyMultiplier,
      timeBonus,
      mistakePenalty,
      hintPenalty,
      totalPoints
    };
  }

  /**
   * Calculate leaderboard points
   * Total points from a session or challenge
   */
  calculateLeaderboardPoints(scores: ScoringResult[]): number {
    return scores.reduce((sum, score) => sum + score.totalPoints, 0);
  }
}

export const scoringEngine = new ScoringEngine();
