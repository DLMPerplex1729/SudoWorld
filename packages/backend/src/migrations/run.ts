import { getClient } from '../config/database';
import fs from 'fs';
import path from 'path';

const runMigrations = async () => {
  const client = await getClient();

  try {
    await client.query('BEGIN');

    // Read and execute schema
    const schema = fs.readFileSync(
      path.join(__dirname, '001_initial_schema.sql'),
      'utf-8'
    );

    await client.query(schema);
    await client.query('COMMIT');

    console.log('[Migrations] ✓ Schema created successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('[Migrations] Error:', error);
    process.exit(1);
  } finally {
    client.release();
  }
};

runMigrations();
