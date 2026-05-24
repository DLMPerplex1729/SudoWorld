import express, { Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

interface AuthRequest extends Request {
  userId?: string;
}

/**
 * GET /api/challenges/:type
 * Get challenge by type (daily, weekly, monthly, yearly)
 */
router.get('/:type', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { type } = req.params;

    const validTypes = ['daily', 'weekly', 'monthly', 'yearly'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid challenge type'
      });
    }

    // TODO: Implement get challenge logic

    return res.json({
      success: true,
      data: {
        challenge: {}
      }
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch challenge'
    });
  }
});

export default router;
