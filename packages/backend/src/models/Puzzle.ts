import { query } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export class PuzzleModel {
  /**
   * Create a new puzzle
   */
  static async create(
    mode: string,
    difficulty: string,
    grid: string,
    solution: string,
    clues: string,
    blockConfig?: string
  ): Promise<any> {
    const id = uuidv4();
    const now = new Date();

    const result = await query(
      `INSERT INTO puzzles (id, mode, difficulty, grid, solution, clues, block_config, avg_solve_time, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [id, mode, difficulty, grid, solution, clues, blockConfig, 0, now, now]
    );

    return result.rows[0];
  }

  /**
   * Find puzzle by ID
   */
  static async findById(id: string): Promise<any | null> {
    const result = await query(
      `SELECT * FROM puzzles WHERE id = $1`,
      [id]
    );

    return result.rows[0] || null;
  }

  /**
   * Get random puzzle by mode and difficulty
   */
  static async getRandomByModeAndDifficulty(mode: string, difficulty: string): Promise<any | null> {
    const result = await query(
      `SELECT * FROM puzzles WHERE mode = $1 AND difficulty = $2 ORDER BY RANDOM() LIMIT 1`,
      [mode, difficulty]
    );

    return result.rows[0] || null;
  }

  /**
   * Update average solve time
   */
  static async updateAverageSolveTime(puzzleId: string, solveTime: number): Promise<void> {
    await query(
      `UPDATE puzzles SET avg_solve_time = $1, updated_at = $2 WHERE id = $3`,
      [solveTime, new Date(), puzzleId]
    );
  }
}
