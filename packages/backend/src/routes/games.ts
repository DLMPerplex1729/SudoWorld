import express, { Request, Response } from 'express';
import { authMiddleware, optionalAuth } from '../middleware/auth';
import { GameSessionModel } from '../models/GameSession';
import { PuzzleModel } from '../models/Puzzle';
import {
  Sudoku9x9Solver,
  Sudoku16x16Solver,
  Sudoku6x6IrregularSolver,
  Sudoku4x4x4CubeSolver
} from '../utils/sudokuSolver';
import { scoringEngine } from '../utils/scoringEngine';
import { GameMode, Difficulty } from '@sudoworld/shared';

const router = express.Router();

interface AuthRequest extends Request {
  userId?: string;
}

/**
 * POST /api/games/start
 * Start a new game
 */
router.post('/start', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { mode, difficulty } = req.body;

    if (!mode || !difficulty) {
      return res.status(400).json({
        success: false,
        error: 'Missing mode or difficulty'
      });
    }

    let puzzle: any = await PuzzleModel.getRandomByModeAndDifficulty(mode, difficulty);

    if (!puzzle) {
      // Generate new puzzle if not found
      puzzle = await generatePuzzle(mode, difficulty);
    }

    let session = null;

    if (req.userId) {
      session = await GameSessionModel.create(
        req.userId,
        puzzle.id,
        puzzle.grid,
        mode
      );
    }

    return res.status(201).json({
      success: true,
      data: {
        sessionId: session?.id,
        puzzle: {
          id: puzzle.id,
          grid: JSON.parse(puzzle.grid),
          blockConfig: puzzle.block_config ? JSON.parse(puzzle.block_config) : undefined
        }
      }
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to start game'
    });
  }
});

/**
 * POST /api/games/move
 * Make a move in the game
 */
router.post('/move', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { sessionId, position, value } = req.body;

    if (!sessionId || !position || value === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    const session = await GameSessionModel.findById(sessionId);

    if (!session || session.user_id !== req.userId) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized'
      });
    }

    const currentState = JSON.parse(session.current_state);
    // Update state with move
    if (session.mode.includes('cubic')) {
      currentState[position.x][position.y][position.z] = value;
    } else {
      currentState[position.row][position.col] = value;
    }

    await GameSessionModel.updateState(
      sessionId,
      JSON.stringify(currentState),
      session.mistakes,
      session.hints_used
    );

    return res.json({
      success: true,
      data: { state: currentState }
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to make move'
    });
  }
});

/**
 * POST /api/games/:sessionId/submit
 * Submit completed game
 */
router.post('/:sessionId/submit', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { sessionId } = req.params;
    const { currentState } = req.body;

    const session = await GameSessionModel.findById(sessionId);

    if (!session || session.user_id !== req.userId) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized'
      });
    }

    const puzzle = await PuzzleModel.findById(session.puzzle_id);
    const solution = JSON.parse(puzzle.solution);

    // Verify solution
    const isCorrect = verifySolution(currentState, solution, session.mode);

    if (!isCorrect) {
      return res.status(400).json({
        success: false,
        error: 'Solution is incorrect'
      });
    }

    // Calculate score
    const solveTime = Math.floor((Date.now() - new Date(session.start_time).getTime()) / 1000);
    const avgSolveTime = await GameSessionModel.getAverageSolveTime(req.userId, puzzle.id);

    const scoring = scoringEngine.calculateScore({
      difficulty: session.mode as Difficulty,
      solveTimeSeconds: solveTime,
      mistakesCount: session.mistakes,
      hintsUsed: session.hints_used,
      avgSolveTimeSeconds: avgSolveTime
    });

    // Mark session as complete
    await GameSessionModel.markComplete(
      sessionId,
      scoring.totalPoints,
      JSON.stringify(scoring)
    );

    return res.json({
      success: true,
      data: {
        points: scoring.totalPoints,
        scoring
      }
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to submit game'
    });
  }
});

/**
 * POST /api/games/:sessionId/hint
 * Get a hint
 */
router.post('/:sessionId/hint', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { sessionId } = req.params;

    const session = await GameSessionModel.findById(sessionId);

    if (!session || session.user_id !== req.userId) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized'
      });
    }

    const puzzle = await PuzzleModel.findById(session.puzzle_id);
    const solution = JSON.parse(puzzle.solution);
    const currentState = JSON.parse(session.current_state);

    // Find an empty cell and provide a hint
    let hint = null;

    if (session.mode.includes('cubic')) {
      for (let x = 0; x < 4; x++) {
        for (let y = 0; y < 4; y++) {
          for (let z = 0; z < 4; z++) {
            if (currentState[x][y][z] === 0) {
              hint = {
                position: { x, y, z },
                value: solution[x][y][z]
              };
              break;
            }
          }
          if (hint) break;
        }
        if (hint) break;
      }
    } else {
      for (let row = 0; row < currentState.length; row++) {
        for (let col = 0; col < currentState[row].length; col++) {
          if (currentState[row][col] === 0) {
            hint = {
              position: { row, col },
              value: solution[row][col]
            };
            break;
          }
        }
        if (hint) break;
      }
    }

    // Update hints count
    await GameSessionModel.updateState(
      sessionId,
      session.current_state,
      session.mistakes,
      session.hints_used + 1
    );

    return res.json({
      success: true,
      data: { hint }
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to get hint'
    });
  }
});

// Helper functions

async function generatePuzzle(mode: GameMode, difficulty: string) {
  let grid: any, solution: any, blockConfig: any;

  switch (mode) {
    case 'standard9x9': {
      const solver = new Sudoku9x9Solver();
      solver.generate();
      const puzzle = solver.createPuzzle(difficulty as any);
      grid = puzzle.puzzle;
      solution = puzzle.solution;
      break;
    }
    case 'hexadecimal16x16': {
      const solver = new Sudoku16x16Solver();
      solver.generate();
      const puzzle = solver.createPuzzle(difficulty as any);
      grid = puzzle.puzzle;
      solution = puzzle.solution;
      break;
    }
    case 'irregular6x6': {
      const solver = new Sudoku6x6IrregularSolver();
      solver.generate();
      const puzzle = solver.createPuzzle(difficulty as any);
      grid = puzzle.puzzle;
      solution = puzzle.solution;
      blockConfig = puzzle.blockConfig;
      break;
    }
    case 'cubic4x4x4': {
      const solver = new Sudoku4x4x4CubeSolver();
      solver.generate();
      const puzzle = solver.createPuzzle(difficulty as any);
      grid = puzzle.puzzle;
      solution = puzzle.solution;
      break;
    }
  }

  return await PuzzleModel.create(
    mode,
    difficulty,
    JSON.stringify(grid),
    JSON.stringify(solution),
    JSON.stringify(grid),
    blockConfig ? JSON.stringify(blockConfig) : undefined
  );
}

function verifySolution(submitted: any, solution: any, mode: string): boolean {
  if (mode.includes('cubic')) {
    for (let x = 0; x < 4; x++) {
      for (let y = 0; y < 4; y++) {
        for (let z = 0; z < 4; z++) {
          if (submitted[x][y][z] !== solution[x][y][z]) return false;
        }
      }
    }
  } else {
    for (let i = 0; i < submitted.length; i++) {
      for (let j = 0; j < submitted[i].length; j++) {
        if (submitted[i][j] !== solution[i][j]) return false;
      }
    }
  }
  return true;
}

export default router;
