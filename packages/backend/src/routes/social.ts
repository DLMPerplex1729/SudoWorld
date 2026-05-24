import express, { Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

interface AuthRequest extends Request {
  userId?: string;
}

/**
 * POST /api/social/friends/request
 * Send friend request
 */
router.post('/friends/request', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { targetUserId } = req.body;

    if (!targetUserId) {
      return res.status(400).json({
        success: false,
        error: 'Missing targetUserId'
      });
    }

    // TODO: Implement friend request logic

    return res.json({
      success: true,
      message: 'Friend request sent'
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to send friend request'
    });
  }
});

/**
 * GET /api/social/friends
 * Get user's friends list
 */
router.get('/friends', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    // TODO: Implement get friends logic

    return res.json({
      success: true,
      data: {
        friends: []
      }
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch friends'
    });
  }
});

export default router;
