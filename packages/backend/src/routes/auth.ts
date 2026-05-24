import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { env } from '../config/env';
import { UserModel } from '../models/User';
import { validateRequest } from '../middleware/validation';
import { userRegistrationSchema, userLoginSchema } from '@sudoworld/shared';

const router = express.Router();

interface AuthRequest extends Request {
  userId?: string;
}

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', validateRequest(userRegistrationSchema), async (req: AuthRequest, res: Response) => {
  try {
    const { email, username, password } = req.body;

    // Check if user exists
    if (await UserModel.emailExists(email)) {
      return res.status(400).json({
        success: false,
        error: 'Email already registered'
      });
    }

    if (await UserModel.usernameExists(username)) {
      return res.status(400).json({
        success: false,
        error: 'Username already taken'
      });
    }

    // Hash password and create user
    const passwordHash = await UserModel.hashPassword(password);
    const user = await UserModel.create(email, username, passwordHash);

    // Generate token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        username: user.username
      },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRE }
    );

    return res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          avatar: user.avatar,
          emailVerified: user.email_verified
        }
      },
      message: 'Registration successful'
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Registration failed'
    });
  }
});

/**
 * POST /api/auth/login
 * Login user
 */
router.post('/login', validateRequest(userLoginSchema), async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    const isPasswordValid = await UserModel.verifyPassword(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Update last login
    await UserModel.updateLastLogin(user.id);

    // Generate token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        username: user.username
      },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRE }
    );

    return res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          avatar: user.avatar,
          emailVerified: user.email_verified
        }
      },
      message: 'Login successful'
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Login failed'
    });
  }
});

/**
 * POST /api/auth/google
 * Google OAuth login/register
 */
router.post('/google', async (req: AuthRequest, res: Response) => {
  try {
    const { googleId, email, username, avatar } = req.body;

    if (!googleId || !email) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    let user = await UserModel.findByGoogleId(googleId);

    if (!user) {
      // Generate unique username if not provided
      let finalUsername = username || email.split('@')[0];
      let counter = 1;

      while (await UserModel.usernameExists(finalUsername)) {
        finalUsername = `${username || email.split('@')[0]}${counter}`;
        counter++;
      }

      user = await UserModel.create(email, finalUsername, '', googleId);
    }

    // Update last login
    await UserModel.updateLastLogin(user.id);

    // Generate token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        username: user.username
      },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRE }
    );

    return res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          avatar: avatar || user.avatar,
          emailVerified: user.email_verified
        }
      },
      message: 'Google login successful'
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Google login failed'
    });
  }
});

/**
 * GET /api/auth/verify
 * Verify token
 */
router.get('/verify', async (req: AuthRequest, res: Response) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as any;
    const user = await UserModel.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    return res.json({
      success: true,
      data: { user }
    });
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
});

export default router;
