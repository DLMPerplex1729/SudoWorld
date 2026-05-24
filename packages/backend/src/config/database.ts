import { Pool, PoolClient } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000
});

pool.on('error', (err) => {
  console.error('[Database] Unexpected error on idle client', err);
});

export const initializeDatabase = async (): Promise<void> => {
  const client = await pool.connect();
  try {
    await client.query('SELECT NOW()');
    console.log('[Database] Connection successful');
  } finally {
    client.release();
  }
};

export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};

export const getClient = (): Promise<PoolClient> => {
  return pool.connect();
};

export default pool;
