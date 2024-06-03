import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
  dialect: 'sqlite',
  // driver: 'turso', // Optional
  schema: './src/lib/db/models/*',
  out: './src/lib/db/migrations',
  breakpoints: true,
  dbCredentials: {
    url: process.env.DATABASE_URL || '',
    authToken: process.env.DATABASE_AUTH_TOKEN || '' // Optional
  }
} satisfies Config;
