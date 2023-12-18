import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

export const pool = new pg.Pool({
  connectionString:
    process.env.NODE_ENV === 'test' ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL
});

const db = drizzle(pool);
export default db;
