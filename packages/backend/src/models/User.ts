import { query } from '../config/database';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { User } from '@sudoworld/shared';

export class UserModel {
  /**
   * Create a new user
   */
  static async create(
    email: string,
    username: string,
    passwordHash: string,
    googleId?: string
  ): Promise<User> {
    const id = uuidv4();
    const now = new Date();

    const result = await query(
      `INSERT INTO users (id, email, username, password_hash, google_id, email_verified, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, email, username, avatar, bio, email_verified, created_at, updated_at`,
      [id, email, username, passwordHash, googleId, false, now, now]
    );

    return result.rows[0];
  }

  /**
   * Find user by email
   */
  static async findByEmail(email: string): Promise<User & { password_hash: string } | null> {
    const result = await query(
      `SELECT id, email, username, password_hash, avatar, bio, google_id, email_verified, created_at, updated_at, last_login
       FROM users WHERE email = $1`,
      [email]
    );

    return result.rows[0] || null;
  }

  /**
   * Find user by ID
   */
  static async findById(id: string): Promise<User | null> {
    const result = await query(
      `SELECT id, email, username, avatar, bio, email_verified, created_at, updated_at, last_login
       FROM users WHERE id = $1`,
      [id]
    );

    return result.rows[0] || null;
  }

  /**
   * Find user by username
   */
  static async findByUsername(username: string): Promise<User | null> {
    const result = await query(
      `SELECT id, email, username, avatar, bio, email_verified, created_at, updated_at, last_login
       FROM users WHERE username = $1`,
      [username]
    );

    return result.rows[0] || null;
  }

  /**
   * Find user by Google ID
   */
  static async findByGoogleId(googleId: string): Promise<User & { password_hash: string } | null> {
    const result = await query(
      `SELECT id, email, username, password_hash, avatar, bio, google_id, email_verified, created_at, updated_at
       FROM users WHERE google_id = $1`,
      [googleId]
    );

    return result.rows[0] || null;
  }

  /**
   * Update user profile
   */
  static async updateProfile(
    id: string,
    updates: { username?: string; avatar?: string; bio?: string }
  ): Promise<User> {
    const now = new Date();
    const setClauses: string[] = ['updated_at = $1'];
    const values: any[] = [now];
    let paramIndex = 2;

    if (updates.username) {
      setClauses.push(`username = $${paramIndex}`);
      values.push(updates.username);
      paramIndex++;
    }

    if (updates.avatar) {
      setClauses.push(`avatar = $${paramIndex}`);
      values.push(updates.avatar);
      paramIndex++;
    }

    if (updates.bio) {
      setClauses.push(`bio = $${paramIndex}`);
      values.push(updates.bio);
      paramIndex++;
    }

    values.push(id);

    const result = await query(
      `UPDATE users SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING id, email, username, avatar, bio, email_verified, created_at, updated_at`,
      values
    );

    return result.rows[0];
  }

  /**
   * Update last login timestamp
   */
  static async updateLastLogin(id: string): Promise<void> {
    await query(`UPDATE users SET last_login = $1 WHERE id = $2`, [new Date(), id]);
  }

  /**
   * Delete user (soft delete)
   */
  static async delete(id: string): Promise<void> {
    await query(`UPDATE users SET deleted_at = $1 WHERE id = $2`, [new Date(), id]);
  }

  /**
   * Verify password
   */
  static async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Hash password
   */
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Check if username exists
   */
  static async usernameExists(username: string): Promise<boolean> {
    const result = await query(`SELECT id FROM users WHERE username = $1`, [username]);
    return result.rows.length > 0;
  }

  /**
   * Check if email exists
   */
  static async emailExists(email: string): Promise<boolean> {
    const result = await query(`SELECT id FROM users WHERE email = $1`, [email]);
    return result.rows.length > 0;
  }
}
