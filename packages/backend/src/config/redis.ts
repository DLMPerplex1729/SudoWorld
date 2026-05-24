import { createClient, RedisClientType } from 'redis';

let redisClient: RedisClientType;

export const initializeRedis = async (): Promise<void> => {
  redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  });

  redisClient.on('error', (err) => console.error('[Redis] Error:', err));
  redisClient.on('connect', () => console.log('[Redis] Connected'));

  await redisClient.connect();
};

export const getRedisClient = (): RedisClientType => {
  if (!redisClient) {
    throw new Error('Redis client not initialized');
  }
  return redisClient;
};

export const setCache = async (key: string, value: any, ttl: number = 3600): Promise<void> => {
  const client = getRedisClient();
  await client.setEx(key, ttl, JSON.stringify(value));
};

export const getCache = async (key: string): Promise<any> => {
  const client = getRedisClient();
  const data = await client.get(key);
  return data ? JSON.parse(data) : null;
};

export const deleteCache = async (key: string): Promise<void> => {
  const client = getRedisClient();
  await client.del(key);
};

export const incrementScore = async (leaderboardKey: string, userId: string, points: number): Promise<void> => {
  const client = getRedisClient();
  await client.zIncrBy(leaderboardKey, points, userId);
};

export const getLeaderboard = async (leaderboardKey: string, start: number = 0, end: number = 99): Promise<any[]> => {
  const client = getRedisClient();
  const entries = await client.zRevRangeWithScores(leaderboardKey, start, end);
  return entries.map((entry, index) => ({
    rank: start + index + 1,
    userId: entry.value,
    points: entry.score
  }));
};

export const getUserRank = async (leaderboardKey: string, userId: string): Promise<number | null> => {
  const client = getRedisClient();
  return await client.zRevRank(leaderboardKey, userId);
};
