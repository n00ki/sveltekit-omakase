import type { Config } from 'drizzle-kit';
import 'dotenv/config';

export default {
  schema: './src/lib/db/models/*',
  out: './src/lib/db/migrations',
  breakpoints: true,
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL || ''
  }
} satisfies Config;
