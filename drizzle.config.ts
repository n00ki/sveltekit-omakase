import type { Config } from 'drizzle-kit';
import 'dotenv/config';

const localConfig = {
  dialect: 'turso',
  schema: './src/lib/db/models/*',
  out: './src/lib/db/migrations',
  breakpoints: true,
  casing: 'snake_case',
  verbose: true,
  dbCredentials: {
    url: process.env.LOCAL_DATABASE_URL || ''
  }
} as Config;

const remoteConfig = {
  dialect: 'turso',
  schema: './src/lib/db/models/*',
  out: './src/lib/db/migrations',
  breakpoints: true,
  casing: 'snake_case',
  verbose: true,
  dbCredentials: {
    url: process.env.DATABASE_URL || '',
    authToken: process.env.DATABASE_AUTH_TOKEN || ''
  }
} as Config;

export default process.env.NODE_ENV === 'production' ? remoteConfig : localConfig;
