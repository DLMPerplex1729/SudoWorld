-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(30) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  google_id VARCHAR(255) UNIQUE,
  avatar VARCHAR(255),
  bio TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_google_id ON users(google_id);

-- User Stats Table
CREATE TABLE IF NOT EXISTS user_stats (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  total_games_played INT DEFAULT 0,
  total_games_won INT DEFAULT 0,
  total_points INT DEFAULT 0,
  average_points DECIMAL(10, 2) DEFAULT 0,
  average_solve_time INT DEFAULT 0,
  fastest_solve_time INT,
  accuracy_rate DECIMAL(5, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Daily Streaks Table
CREATE TABLE IF NOT EXISTS daily_streaks (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_played_date DATE,
  total_days_played INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Puzzles Table
CREATE TABLE IF NOT EXISTS puzzles (
  id UUID PRIMARY KEY,
  mode VARCHAR(50) NOT NULL,
  difficulty VARCHAR(50) NOT NULL,
  grid TEXT NOT NULL,
  solution TEXT NOT NULL,
  clues TEXT NOT NULL,
  block_config TEXT,
  avg_solve_time INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_puzzles_mode_difficulty ON puzzles(mode, difficulty);

-- Game Sessions Table
CREATE TABLE IF NOT EXISTS game_sessions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  puzzle_id UUID REFERENCES puzzles(id),
  mode VARCHAR(50) NOT NULL,
  current_state TEXT NOT NULL,
  mistakes INT DEFAULT 0,
  hints_used INT DEFAULT 0,
  notes TEXT,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP,
  is_complete BOOLEAN DEFAULT FALSE,
  points INT DEFAULT 0,
  points_breakdown JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_game_sessions_user_id ON game_sessions(user_id);
CREATE INDEX idx_game_sessions_puzzle_id ON game_sessions(puzzle_id);
CREATE INDEX idx_game_sessions_is_complete ON game_sessions(is_complete);

-- Achievements Table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(255),
  unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_achievements_user_id ON achievements(user_id);

-- Friendships Table
CREATE TABLE IF NOT EXISTS friendships (
  id UUID PRIMARY KEY,
  user_id_1 UUID REFERENCES users(id) ON DELETE CASCADE,
  user_id_2 UUID REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_friendships_user_id_1 ON friendships(user_id_1);
CREATE INDEX idx_friendships_user_id_2 ON friendships(user_id_2);
CREATE INDEX idx_friendships_status ON friendships(status);

-- Follows Table
CREATE TABLE IF NOT EXISTS follows (
  id UUID PRIMARY KEY,
  follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_follows_follower_id ON follows(follower_id);
CREATE INDEX idx_follows_following_id ON follows(following_id);

-- Messages Table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY,
  conversation_id UUID NOT NULL,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_is_read ON messages(is_read);

-- Battle Matches Table
CREATE TABLE IF NOT EXISTS battle_matches (
  id UUID PRIMARY KEY,
  player_1_id UUID REFERENCES users(id) ON DELETE CASCADE,
  player_2_id UUID REFERENCES users(id) ON DELETE CASCADE,
  puzzle_id UUID REFERENCES puzzles(id),
  player_1_session_id UUID REFERENCES game_sessions(id),
  player_2_session_id UUID REFERENCES game_sessions(id),
  winner_id UUID REFERENCES users(id) ON DELETE SET NULL,
  player_1_time INT,
  player_2_time INT,
  mode VARCHAR(20) DEFAULT 'casual',
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  started_at TIMESTAMP,
  ended_at TIMESTAMP
);

CREATE INDEX idx_battle_matches_player_1_id ON battle_matches(player_1_id);
CREATE INDEX idx_battle_matches_player_2_id ON battle_matches(player_2_id);
CREATE INDEX idx_battle_matches_status ON battle_matches(status);

-- Challenges Table
CREATE TABLE IF NOT EXISTS challenges (
  id UUID PRIMARY KEY,
  type VARCHAR(20) NOT NULL,
  period VARCHAR(20) NOT NULL,
  mode VARCHAR(50) NOT NULL,
  difficulty VARCHAR(50) NOT NULL,
  puzzle_id UUID REFERENCES puzzles(id),
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_challenges_type_period ON challenges(type, period);

-- Challenge Participations Table
CREATE TABLE IF NOT EXISTS challenge_participations (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
  session_id UUID REFERENCES game_sessions(id),
  points INT DEFAULT 0,
  solve_time INT,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_challenge_participations_user_id ON challenge_participations(user_id);
CREATE INDEX idx_challenge_participations_challenge_id ON challenge_participations(challenge_id);

-- Variant Proposals Table
CREATE TABLE IF NOT EXISTS variant_proposals (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  rules TEXT NOT NULL,
  example_puzzle_id UUID REFERENCES puzzles(id),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_variant_proposals_user_id ON variant_proposals(user_id);
CREATE INDEX idx_variant_proposals_status ON variant_proposals(status);

-- Proposal Comments Table
CREATE TABLE IF NOT EXISTS proposal_comments (
  id UUID PRIMARY KEY,
  proposal_id UUID REFERENCES variant_proposals(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES proposal_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_proposal_comments_proposal_id ON proposal_comments(proposal_id);
CREATE INDEX idx_proposal_comments_user_id ON proposal_comments(user_id);
CREATE INDEX idx_proposal_comments_parent_comment_id ON proposal_comments(parent_comment_id);

-- Reactions Table
CREATE TABLE IF NOT EXISTS reactions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  target_id UUID NOT NULL,
  target_type VARCHAR(20) NOT NULL,
  reaction_type VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reactions_target_id ON reactions(target_id);
CREATE INDEX idx_reactions_user_id ON reactions(user_id);
CREATE UNIQUE INDEX idx_reactions_unique ON reactions(user_id, target_id, target_type);

-- Feedbacks Table
CREATE TABLE IF NOT EXISTS feedbacks (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES game_sessions(id),
  type VARCHAR(20),
  rating INT,
  difficulty INT,
  enjoyment INT,
  comment TEXT,
  message TEXT,
  screenshot VARCHAR(255),
  status VARCHAR(20) DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_feedbacks_user_id ON feedbacks(user_id);
CREATE INDEX idx_feedbacks_status ON feedbacks(status);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  data JSON,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
