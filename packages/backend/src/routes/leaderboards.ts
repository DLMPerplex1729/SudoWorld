import express, { Request, Response } from 'express';
import { optionalAuth } from '../middleware/auth';
import { getLeaderboard } from '../config/redis';

const router = express.Router();

interface AuthRequest extends Request {
  userId?: string;
}

/**
 * GET /api/leaderboards/:type
 * Get leaderboard by type (daily, weekly, monthly, yearly)
 */
router.get('/:type', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { type } = req.params;
    const { page = '1', limit = '100' } = req.query;

    const validTypes = ['daily', 'weekly', 'monthly', 'yearly'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid leaderboard type'
      });
    }

    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.min(100, parseInt(limit as string));
    const offset = (pageNum - 1) * limitNum;

    const leaderboardKey = `leaderboard:${type}:${getCurrentPeriod(type)}`;
    const entries = await getLeaderboard(leaderboardKey, offset, offset + limitNum - 1);

    return res.json({
      success: true,
      data: {
        type,
        page: pageNum,
        limit: limitNum,
        entries
      }
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch leaderboard'
    });
  }
});

function getCurrentPeriod(type: string): string {
  const now = new Date();

  switch (type) {
    case 'daily':
      return now.toISOString().split('T')[0];
    case 'weekly': {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      return weekStart.toISOString().split('T')[0];
    }
    case 'monthly':
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    case 'yearly':
      return `${now.getFullYear()}`;
    default:
      return '';
  }
}

export default router;
