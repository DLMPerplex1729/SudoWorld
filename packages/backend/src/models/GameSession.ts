import { query } from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import { GameSession } from '@sudoworld/shared';

export class GameSessionModel {
  /**
   * Create a new game session
   */
  static async create(
    userId: string,
    puzzleId: string,
    currentState: string,
    mode: string
  ): Promise<any> {
    const id = uuidv4();
    const now = new Date();

    const result = await query(
      `INSERT INTO game_sessions (id, user_id, puzzle_id, mode, current_state, mistakes, hints_used, start_time, is_complete, points, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [id, userId, puzzleId, mode, currentState, 0, 0, now, false, 0, now]
    );

    return result.rows[0];
  }

  /**
   * Find session by ID
   */
  static async findById(id: string): Promise<any | null> {
    const result = await query(
      `SELECT * FROM game_sessions WHERE id = $1`,
      [id]
    );

    return result.rows[0] || null;
  }

  /**
   * Update session state
   */
  static async updateState(
    sessionId: string,
    currentState: string,
    mistakes: number,
    hintsUsed: number
  ): Promise<void> {
    await query(
      `UPDATE game_sessions SET current_state = $1, mistakes = $2, hints_used = $3, updated_at = $4 WHERE id = $5`,
      [currentState, mistakes, hintsUsed, new Date(), sessionId]
    );
  }

  /**
   * Mark session as complete
   */
  static async markComplete(
    sessionId: string,
    points: number,
    pointsBreakdown: string
  ): Promise<void> {
    const now = new Date();

    await query(
      `UPDATE game_sessions SET is_complete = true, end_time = $1, points = $2, points_breakdown = $3, updated_at = $4 WHERE id = $5`,
      [now, points, pointsBreakdown, now, sessionId]
    );
  }

  /**
   * Get user's game history
   */
  static async getUserHistory(
    userId: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<any[]> {
    const result = await query(
      `SELECT * FROM game_sessions WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    return result.rows;
  }

  /**
   * Get user's average solve time for a puzzle
   */
  static async getAverageSolveTime(userId: string, puzzleId: string): Promise<number> {
    const result = await query(
      `SELECT AVG(EXTRACT(EPOCH FROM (end_time - start_time))) as avg_time
       FROM game_sessions
       WHERE user_id = $1 AND puzzle_id = $2 AND is_complete = true`,
      [userId, puzzleId]
    );

    return result.rows[0]?.avg_time || 0;
  }
}
