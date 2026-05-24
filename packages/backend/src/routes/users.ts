import express, { Request, Response } from 'express';
import { authMiddleware, optionalAuth } from '../middleware/auth';
import { UserModel } from '../models/User';
import { validateRequest } from '../middleware/validation';
import { userProfileUpdateSchema } from '@sudoworld/shared';

const router = express.Router();

interface AuthRequest extends Request {
  userId?: string;
}

/**
 * GET /api/users/me
 * Get current user profile
 */
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await UserModel.findById(req.userId!);

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
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch user'
    });
  }
});

/**
 * GET /api/users/:username
 * Get user profile by username
 */
router.get('/:username', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { username } = req.params;

    const user = await UserModel.findByUsername(username);

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
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch user'
    });
  }
});

/**
 * PUT /api/users/me
 * Update user profile
 */
router.put('/me', authMiddleware, validateRequest(userProfileUpdateSchema), async (req: AuthRequest, res: Response) => {
  try {
    const user = await UserModel.updateProfile(req.userId!, req.body);

    return res.json({
      success: true,
      data: { user }
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to update profile'
    });
  }
});

export default router;
