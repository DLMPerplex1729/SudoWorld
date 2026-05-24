# SudoWorld 🎮

A comprehensive Sudoku gaming platform with multiple game modes, social features, real-time battles, and a community-driven variant proposal system.

## 🎯 Game Modes

### 1. Standard 9x9 Sudoku
- Classic Sudoku with digits 1-9
- Standard 3x3 block divisions
- All 13 difficulty levels

### 2. Irregular 6x6 Sudoku
- Numbers 1-6
- **Dynamic block configurations** randomly generated:
  - One horizontal/vertical 1x6 or 6x1 strip
  - Remaining 30 squares filled with non-overlapping 2x3 and 3x2 blocks
  - Zero overlaps or gaps guaranteed
- All 13 difficulty levels

### 3. Hexadecimal 16x16 Sudoku
- Digits 0-F (0-15)
- 4x4 block divisions
- All 13 difficulty levels

### 4. 3D Cubic Sudoku (4x4x4)
- Numbers 1-4
- 3D visualization with multiple view modes:
  - **3D Cube View**: Full cube with numbers in cell centers
  - **Slice View**: Toggle between XY, YZ, XZ orientations with layer switching
- 5 difficulty levels (Beginner to Extreme)
- 3-mistake limit

## 📊 Difficulty Levels (2D Modes)

1. Baby
2. Beginner
3. Easy
4. Getting the hang of this...
5. Medium
6. Getting good...
7. Tricky
8. Hard
9. Difficult
10. Extreme
11. Diabolical
12. Downright Evil
13. Please tell me this ain't Impossible

## 🎮 Core Features

### Gameplay
- ✅ **Number Pad**: Quick input selection
- ✅ **Notes/Candidates**: Track possible values
- ✅ **Hints**: Reduce points but help solve
- ✅ **Mistake System**: 3 mistakes = game over
- ✅ **Timer**: Track solve time
- ✅ **Red Highlight**: Mark incorrect entries
- ✅ **Feedback Popups**: After each puzzle

### Scoring System
- Base points depend on difficulty
- Time bonus: Faster solves = more points
- Mistake penalty: -X points per wrong entry
- Hint penalty: -Y points per hint used
- Formula: `basePoints × (1 + timeFactor - mistakeFactor - hintFactor)`

### Progression & Rewards
- **Daily Streak**: Track consecutive daily plays
- **Achievements**: Unlock badges for milestones
- **Leaderboards**:
  - Daily (resets at midnight UTC)
  - Weekly (resets Mondays)
  - Monthly (resets 1st of month)
  - Yearly (resets Jan 1st)
- **Rewards**: Points translate to cosmetics, themes, avatars

### Challenges
- **Daily Challenge**: One puzzle, all users same puzzle
- **Weekly Challenge**: 7 different puzzles
- **Monthly Challenge**: 30 different puzzles
- **Yearly Challenge**: 365 different puzzles
- Random game mode selection

### Social Features
- **Authentication**:
  - Google OAuth login
  - Email/password signup
  - Session management
- **User Profiles**:
  - Stats: Total games, win rate, average time
  - Achievements & badges
  - Daily streak count
  - Activity history
- **Social Interactions**:
  - Follow users (see their updates)
  - Send friend requests
  - Accept/reject requests
  - In-game chat with friends
  - See friends' active games
- **Notifications**:
  - Friend request alerts
  - When friends finish a game
  - Leaderboard rank changes
  - Challenge notifications

### Online Battles (1v1)
- **Matchmaking**: Random opponent selection
- **Real-time Sync**: WebSocket-powered
- **Concurrent Solving**: Both players solve same puzzle
- **Winner**: First to complete correctly wins
- **Ranked & Casual** modes
- **Battle History**: Track head-to-head records

### Community Variant Proposals
- **User Submissions**: Propose new Sudoku variants
- **Reaction System**: Emoji reactions (👍, 🔥, 💡, etc.)
- **Comments & Replies**: Nested discussion threads
- **Popularity Metrics**: Auto-ranked by engagement
- **Admin Review**: Manual quality check before integration
- **Rewards**: Best proposals get substantial rewards

### Video Tutorials & Coaching
- **Rule Explanations**: Per game mode
- **Interface Walkthrough**: How to use the platform
- **Strategy Guides**:
  - Solving techniques (Naked singles, Hidden singles, etc.)
  - Optimization tips
  - Common mistakes
- **AI Coach**: Hints + strategy suggestions without penalty

### Statistics
- Average solve time per puzzle
- Win/loss rate
- Best time for each difficulty
- Games played per mode
- Current streak
- All-time stats

## 🏗️ Tech Stack

### Frontend
- **Framework**: Next.js 14 + React 18
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **3D Graphics**: Three.js
- **Real-time**: Socket.io client
- **HTTP Client**: Axios
- **Validation**: Joi

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Real-time**: Socket.io
- **Database**: PostgreSQL
- **Cache**: Redis
- **Authentication**: JWT + bcrypt
- **Validation**: Joi

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Hosting**: Vercel (frontend), AWS/DigitalOcean (backend)
- **Authentication**: Firebase Auth or Auth0
- **CDN**: CloudFront (for static assets)
- **Database Backup**: AWS RDS automated backups

## 📦 Project Structure

```
SudoWorld/
├── packages/
│   ├── shared/
│   │   ├── src/
│   │   │   ├── types/
│   │   │   │   └── index.ts          # Shared TypeScript types
│   │   │   └── validators.ts         # Input validation schemas
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── backend/
│   │   ├── src/
│   │   │   ├── server.ts             # Express setup
│   │   │   ├── config/
│   │   │   │   ├── database.ts       # PostgreSQL connection
│   │   │   │   ├── redis.ts          # Redis connection
│   │   │   │   └── env.ts            # Environment config
│   │   │   ├── models/
│   │   │   │   ├── User.ts
│   │   │   │   ├── GameSession.ts
│   │   │   │   ├── Leaderboard.ts
│   │   │   │   ├── Challenge.ts
│   │   │   │   ├── UserStats.ts
│   │   │   │   ├── Friendship.ts
│   │   │   │   ├── Message.ts
│   │   │   │   └── VariantProposal.ts
│   │   │   ├── services/
│   │   │   │   ├── sudokuService.ts  # Solver & generator
│   │   │   │   ├── gameService.ts    # Game logic
│   │   │   │   ├── scoringService.ts # Points calculation
│   │   │   │   ├── leaderboardService.ts
│   │   │   │   ├── authService.ts
│   │   │   │   ├── socialService.ts
│   │   │   │   ├── matchmakingService.ts
│   │   │   │   └── notificationService.ts
│   │   │   ├── routes/
│   │   │   │   ├── auth.ts
│   │   │   │   ├── games.ts
│   │   │   │   ├── leaderboards.ts
│   │   │   │   ├── social.ts
│   │   │   │   ├── challenges.ts
│   │   │   │   ├── users.ts
│   │   │   │   └── proposals.ts
│   │   │   ├── websocket/
│   │   │   │   ├── battleHandler.ts
│   │   │   │   ├── chatHandler.ts
│   │   │   │   └── notificationHandler.ts
│   │   │   ├── middleware/
│   │   │   │   ├── auth.ts
│   │   │   │   ├── errorHandler.ts
│   │   │   │   └── validation.ts
│   │   │   ├── migrations/
│   │   │   │   ├── 001_create_users_table.ts
│   │   │   │   ├── 002_create_game_sessions_table.ts
│   │   │   │   └── ...
│   │   │   └── seeds/
│   │   │       └── seedDatabase.ts
│   │   ├── tests/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── frontend/
│       ├── src/
│       │   ├── app/
│       │   │   ├── layout.tsx
│       │   │   ├── page.tsx
│       │   │   ├── auth/
│       │   │   ├── play/
│       │   │   ├── leaderboards/
│       │   │   ├── social/
│       │   │   ├── profile/
│       │   │   └── proposals/
│       │   ├── components/
│       │   │   ├── GameBoard/
│       │   │   │   ├── Board9x9.tsx
│       │   │   │   ├── Board6x6.tsx
│       │   │   │   ├── Board16x16.tsx
│       │   │   │   └── CubeView3D.tsx
│       │   │   ├── Common/
│       │   │   │   ├── NumberPad.tsx
│       │   │   │   ├── Timer.tsx
│       │   │   │   ├── HintButton.tsx
│       │   │   │   └── ScoreDisplay.tsx
│       │   │   ├── Social/
│       │   │   │   ├── UserProfile.tsx
│       │   │   │   ├── LeaderboardList.tsx
│       │   │   │   ├── ChatWindow.tsx
│       │   │   │   └── FriendsList.tsx
│       │   │   └── Proposals/
│       │   │       ├── ProposalCard.tsx
│       │   │       ├── ProposalForm.tsx
│       │   │       └── ReactionPanel.tsx
│       │   ├── hooks/
│       │   ├── store/
│       │   │   ├── slices/
│       │   │   └── store.ts
│       │   ├── utils/
│       │   └── styles/
│       ├── public/
│       ├── package.json
│       ├── next.config.js
│       └── tsconfig.json
│
├── docker-compose.yml
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/DLMPerplex1729/SudoWorld.git
   cd SudoWorld
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your credentials
   ```

4. **Start development environment**
   ```bash
   docker-compose up -d
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Database: PostgreSQL on localhost:5432
   - Cache: Redis on localhost:6379

## 🛣️ Development Roadmap

### Phase 1: Foundation (Weeks 1-3)
- [x] Project scaffolding
- [ ] Authentication system
- [ ] Database schema & migrations
- [ ] Basic UI framework

### Phase 2: Core Gameplay (Weeks 4-8)
- [ ] 9x9 Sudoku solver & generator
- [ ] Game logic & validation
- [ ] Score calculation
- [ ] Number pad & UI
- [ ] Single-player flow

### Phase 3: Extended Modes (Weeks 9-12)
- [ ] 6x6 irregular block generator
- [ ] 16x16 hexadecimal mode
- [ ] 3D cubic solver & rendering
- [ ] Multi-view interface

### Phase 4: Social & Progression (Weeks 13-16)
- [ ] User profiles
- [ ] Following/friendship system
- [ ] Leaderboards (all 4 types)
- [ ] Daily streak tracker
- [ ] In-game chat

### Phase 5: Advanced Features (Weeks 17-20)
- [ ] Online 1v1 battles
- [ ] Video tutorials
- [ ] Daily/weekly/monthly challenges
- [ ] Achievement system
- [ ] Feedback system

### Phase 6: Community (Weeks 21-23)
- [ ] Variant proposal forum
- [ ] Reaction & comment system
- [ ] Admin review interface
- [ ] Variant integration pipeline

### Phase 7: Polish & Launch (Weeks 24-25)
- [ ] Performance optimization
- [ ] Bug fixes & testing
- [ ] Mobile optimization
- [ ] Production deployment

## 📄 License

MIT License - See LICENSE file for details

## 👨‍💻 Author

**DLMPerplex1729** - Project Creator

## 🙏 Contributing

Contributions are welcome! Please read CONTRIBUTING.md first.

## 📞 Support

For issues or questions, please open an issue on GitHub.