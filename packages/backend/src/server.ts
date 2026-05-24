import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import 'express-async-errors';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

// Import configuration
import { initializeDatabase } from './config/database';
import { initializeRedis } from './config/redis';

// Import middleware
import { authMiddleware } from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';

// Import routes
import authRoutes from './routes/auth';
import gameRoutes from './routes/games';
import leaderboardRoutes from './routes/leaderboards';
import socialRoutes from './routes/social';
import challengeRoutes from './routes/challenges';
import userRoutes from './routes/users';
import proposalRoutes from './routes/proposals';

// Import WebSocket handlers
import { initBattleHandler } from './websocket/battleHandler';
import { initChatHandler } from './websocket/chatHandler';
import { initNotificationHandler } from './websocket/notificationHandler';

const app: Express = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

const PORT = process.env.BACKEND_PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/leaderboards', leaderboardRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/proposals', proposalRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.path
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Make io available to routes
declare global {
  var io: SocketIOServer;
}
globalThis.io = io;

// Initialize WebSocket handlers
io.on('connection', (socket) => {
  console.log(`[Socket.io] User connected: ${socket.id}`);

  initBattleHandler(socket, io);
  initChatHandler(socket, io);
  initNotificationHandler(socket, io);

  socket.on('disconnect', () => {
    console.log(`[Socket.io] User disconnected: ${socket.id}`);
  });
});

// Start server
const startServer = async () => {
  try {
    // Initialize database
    console.log('[Database] Initializing PostgreSQL connection...');
    await initializeDatabase();
    console.log('[Database] ✓ Connected');

    // Initialize Redis
    console.log('[Redis] Initializing Redis connection...');
    await initializeRedis();
    console.log('[Redis] ✓ Connected');

    // Start HTTP server
    httpServer.listen(PORT, () => {
      console.log(`\n🎮 SudoWorld Server running on port ${PORT}`);
      console.log(`📡 Environment: ${NODE_ENV}`);
      console.log(`🔗 WebSocket listening...\n`);
    });
  } catch (error) {
    console.error('[Startup Error]', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n[Shutdown] Gracefully shutting down...');
  httpServer.close(() => {
    console.log('[Shutdown] Server closed');
    process.exit(0);
  });
});

startServer();

export default app;
