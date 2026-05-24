// Game Mode Types
export type GameMode2D = 'standard9x9' | 'irregular6x6' | 'hexadecimal16x16';
export type GameMode3D = 'cubic4x4x4';
export type GameMode = GameMode2D | GameMode3D;

// Difficulty Levels for 2D Modes
export type Difficulty2D =
  | 'baby'
  | 'beginner'
  | 'easy'
  | 'getting_the_hang_of_this'
  | 'medium'
  | 'getting_good'
  | 'tricky'
  | 'hard'
  | 'difficult'
  | 'extreme'
  | 'diabolical'
  | 'downright_evil'
  | 'please_tell_me_this_aint_impossible';

// Difficulty Levels for 3D Mode
export type Difficulty3D = 'beginner' | 'easy' | 'medium' | 'hard' | 'extreme';

export type Difficulty = Difficulty2D | Difficulty3D;

// Position Types
export interface Position2D {
  row: number;
  col: number;
}

export interface Position3D {
  x: number;
  y: number;
  z: number;
}

export type Position = Position2D | Position3D;

// Puzzle Types
export interface Puzzle2D {
  id: string;
  mode: GameMode2D;
  difficulty: Difficulty2D;
  grid: number[][];
  solution: number[][];
  clues: number[][];
  avgSolveTime: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Puzzle3D {
  id: string;
  mode: 'cubic4x4x4';
  difficulty: Difficulty3D;
  cube: number[][][];
  solution: number[][][];
  clues: number[][][];
  avgSolveTime: number;
  createdAt: Date;
  updatedAt: Date;
}

export type Puzzle = Puzzle2D | Puzzle3D;

// Game Session Types
export interface GameSession {
  id: string;
  userId: string;
  puzzle: Puzzle;
  currentState: number[][] | number[][][];
  mistakes: number;
  hintsUsed: number;
  notes: Map<string, number[]>; // For candidate tracking
  startTime: Date;
  endTime?: Date;
  isComplete: boolean;
  points: number;
  pointsBreakdown: PointsBreakdown;
}

export interface PointsBreakdown {
  basePoints: number;
  difficultyMultiplier: number;
  timeBonus: number;
  mistakePenalty: number;
  hintPenalty: number;
  totalPoints: number;
}

// User Types
export interface User {
  id: string;
  email: string;
  username: string;
  passwordHash?: string; // Not sent to client
  avatar?: string;
  bio?: string;
  googleId?: string; // For OAuth
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

export interface UserProfile extends Omit<User, 'passwordHash'> {
  stats: UserStats;
  achievements: Achievement[];
  dailyStreak: number;
  totalGamesPlayed: number;
  friendCount: number;
  followerCount: number;
  isFollowed?: boolean;
  isFriend?: boolean;
}

export interface UserStats {
  userId: string;
  totalGamesPlayed: number;
  totalGamesWon: number;
  totalPoints: number;
  averagePoints: number;
  averageSolveTime: number; // in seconds
  fastestSolveTime: number; // in seconds
  accuracyRate: number; // percentage
  gamesPerMode: Record<GameMode, number>;
  gamesPerDifficulty: Record<Difficulty, number>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Achievement {
  id: string;
  userId: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
}

// Leaderboard Types
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar?: string;
  points: number;
  gamesPlayed: number;
  averageTime: number;
  winStreak: number;
}

export interface Leaderboard {
  id: string;
  type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  period: string; // "2024-05-24" for daily, "2024-W21" for weekly, etc.
  entries: LeaderboardEntry[];
  createdAt: Date;
  updatedAt: Date;
}

// Challenge Types
export interface Challenge {
  id: string;
  type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  period: string;
  mode: GameMode;
  difficulty: Difficulty;
  puzzle: Puzzle;
  startDate: Date;
  endDate: Date;
}

export interface ChallengeParticipation {
  id: string;
  userId: string;
  challengeId: string;
  sessionId: string;
  points: number;
  solveTime: number;
  completedAt: Date;
}

// Social Types
export interface Friendship {
  id: string;
  userId1: string;
  userId2: string;
  status: 'pending' | 'accepted' | 'blocked';
  createdAt: Date;
  updatedAt: Date;
}

export interface FriendRequest {
  id: string;
  from: User;
  to: User;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  respondedAt?: Date;
}

export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderUsername: string;
  content: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Conversation {
  id: string;
  participants: string[]; // User IDs
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  lastMessage?: Message;
}

// Battle Types
export interface BattleMatch {
  id: string;
  player1Id: string;
  player2Id: string;
  player1Username: string;
  player2Username: string;
  puzzle: Puzzle;
  player1SessionId: string;
  player2SessionId: string;
  winnerId?: string;
  player1Time?: number;
  player2Time?: number;
  mode: 'casual' | 'ranked';
  status: 'pending' | 'ongoing' | 'completed';
  createdAt: Date;
  startedAt?: Date;
  endedAt?: Date;
}

// Variant Proposal Types
export interface VariantProposal {
  id: string;
  userId: string;
  authorUsername: string;
  title: string;
  description: string;
  rules: string;
  examplePuzzle?: Puzzle;
  reactionCounts: ReactionCount;
  comments: ProposalComment[];
  status: 'pending' | 'shortlisted' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

export interface ProposalComment {
  id: string;
  proposalId: string;
  userId: string;
  username: string;
  content: string;
  reactionCounts: ReactionCount;
  replies: ProposalComment[];
  parentCommentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReactionCount {
  thumbsUp: number;
  thumbsDown: number;
  fire: number;
  lightbulb: number;
  heart: number;
  thinking: number;
  laugh: number;
}

export type ReactionType = keyof ReactionCount;

export interface UserReaction {
  id: string;
  userId: string;
  targetId: string; // proposalId or commentId
  targetType: 'proposal' | 'comment';
  reactionType: ReactionType;
  createdAt: Date;
}

// Feedback Types
export interface PuzzleFeedback {
  id: string;
  userId: string;
  sessionId: string;
  rating: number; // 1-5
  difficulty: number; // 1-5 perceived difficulty
  enjoyment: number; // 1-5
  comment?: string;
  createdAt: Date;
}

export interface SystemFeedback {
  id: string;
  userId: string;
  type: 'bug' | 'feature_request' | 'general';
  message: string;
  screenshot?: string; // URL
  status: 'new' | 'acknowledged' | 'in_progress' | 'resolved';
  createdAt: Date;
  updatedAt: Date;
}

// Authentication Types
export interface AuthResponse {
  token: string;
  user: User;
  expiresIn: number;
}

export interface TokenPayload {
  userId: string;
  email: string;
  username: string;
  iat: number;
  exp: number;
}

// API Response Wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: 'friend_request' | 'friend_accepted' | 'game_completed' | 'leaderboard_change' | 'challenge_started' | 'battle_invite';
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: Date;
}

// Daily Streak
export interface DailyStreak {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastPlayedDate: Date;
  totalDaysPlayed: number;
}
