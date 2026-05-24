import Joi from 'joi';

// Puzzle Validation
export const validate9x9Puzzle = (grid: number[][]): boolean => {
  if (!grid || grid.length !== 9) return false;

  for (let i = 0; i < 9; i++) {
    if (!grid[i] || grid[i].length !== 9) return false;
    for (let j = 0; j < 9; j++) {
      if (grid[i][j] < 0 || grid[i][j] > 9) return false;
    }
  }
  return true;
};

export const validate6x6Puzzle = (grid: number[][]): boolean => {
  if (!grid || grid.length !== 6) return false;

  for (let i = 0; i < 6; i++) {
    if (!grid[i] || grid[i].length !== 6) return false;
    for (let j = 0; j < 6; j++) {
      if (grid[i][j] < 0 || grid[i][j] > 6) return false;
    }
  }
  return true;
};

export const validate16x16Puzzle = (grid: number[][]): boolean => {
  if (!grid || grid.length !== 16) return false;

  for (let i = 0; i < 16; i++) {
    if (!grid[i] || grid[i].length !== 16) return false;
    for (let j = 0; j < 16; j++) {
      if (grid[i][j] < 0 || grid[i][j] > 15) return false;
    }
  }
  return true;
};

export const validate4x4x4Cube = (cube: number[][][]): boolean => {
  if (!cube || cube.length !== 4) return false;

  for (let i = 0; i < 4; i++) {
    if (!cube[i] || cube[i].length !== 4) return false;
    for (let j = 0; j < 4; j++) {
      if (!cube[i][j] || cube[i][j].length !== 4) return false;
      for (let k = 0; k < 4; k++) {
        if (cube[i][j][k] < 0 || cube[i][j][k] > 4) return false;
      }
    }
  }
  return true;
};

// User Registration Validation
export const userRegistrationSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.alphanum': 'Username must contain only letters and numbers',
      'string.min': 'Username must be at least 3 characters',
      'string.max': 'Username cannot exceed 30 characters'
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address'
    }),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      'string.pattern.base': 'Password must contain uppercase, lowercase, number, and special character',
      'string.min': 'Password must be at least 8 characters'
    }),
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Passwords do not match'
    })
});

export const userLoginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .required()
});

// User Profile Update Validation
export const userProfileUpdateSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .optional(),
  bio: Joi.string()
    .max(500)
    .optional(),
  avatar: Joi.string()
    .uri()
    .optional()
});

// Game Move Validation
export interface GameMoveData {
  sessionId: string;
  position: Position2D | Position3D;
  value: number;
}

export interface Position2D {
  row: number;
  col: number;
}

export interface Position3D {
  x: number;
  y: number;
  z: number;
}

export const validate2DMove = (move: any): move is GameMoveData => {
  return (
    move.sessionId &&
    typeof move.position === 'object' &&
    'row' in move.position &&
    'col' in move.position &&
    typeof move.position.row === 'number' &&
    typeof move.position.col === 'number' &&
    move.position.row >= 0 &&
    move.position.col >= 0 &&
    typeof move.value === 'number' &&
    move.value >= 0
  );
};

export const validate3DMove = (move: any): move is GameMoveData => {
  return (
    move.sessionId &&
    typeof move.position === 'object' &&
    'x' in move.position &&
    'y' in move.position &&
    'z' in move.position &&
    typeof move.position.x === 'number' &&
    typeof move.position.y === 'number' &&
    typeof move.position.z === 'number' &&
    move.position.x >= 0 &&
    move.position.y >= 0 &&
    move.position.z >= 0 &&
    typeof move.value === 'number' &&
    move.value >= 0
  );
};

// Feedback Validation
export const puzzleFeedbackSchema = Joi.object({
  rating: Joi.number()
    .min(1)
    .max(5)
    .required(),
  difficulty: Joi.number()
    .min(1)
    .max(5)
    .required(),
  enjoyment: Joi.number()
    .min(1)
    .max(5)
    .required(),
  comment: Joi.string()
    .max(500)
    .optional()
});

export const systemFeedbackSchema = Joi.object({
  type: Joi.string()
    .valid('bug', 'feature_request', 'general')
    .required(),
  message: Joi.string()
    .min(10)
    .max(1000)
    .required(),
  screenshot: Joi.string()
    .uri()
    .optional()
});

// Variant Proposal Validation
export const variantProposalSchema = Joi.object({
  title: Joi.string()
    .min(5)
    .max(100)
    .required(),
  description: Joi.string()
    .min(20)
    .max(1000)
    .required(),
  rules: Joi.string()
    .min(50)
    .max(5000)
    .required()
});

export const proposalCommentSchema = Joi.object({
  content: Joi.string()
    .min(1)
    .max(1000)
    .required(),
  parentCommentId: Joi.string()
    .optional()
});

export const gameStartSchema = Joi.object({
  mode: Joi.string()
    .valid('standard9x9', 'irregular6x6', 'hexadecimal16x16', 'cubic4x4x4')
    .required(),
  difficulty: Joi.string()
    .required()
});
