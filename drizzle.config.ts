import { defineConfig } from 'drizzle-kit';

import 'dotenv/config';

export default defineConfig({
  dialect: 'turso',
  schema: './src/lib/db/models/index.ts',
  out: './src/lib/db/migrations',
  breakpoints: true,
  casing: 'snake_case',
  strict: true,
  dbCredentials: {
    url: process.env.DATABASE_URL ?? '',
    authToken: process.env.NODE_ENV === 'development' ? undefined : process.env.DATABASE_AUTH_TOKEN
  }
});
