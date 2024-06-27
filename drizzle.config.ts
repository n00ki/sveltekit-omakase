import 'dotenv/config';
import type { Config } from 'drizzle-kit';

const localConfig = {
  dialect: 'sqlite',
  schema: './src/lib/db/models/*',
  out: './src/lib/db/migrations',
  breakpoints: true,
  dbCredentials: {
    url: process.env.LOCAL_DATABASE_URL || ''
  }
} as Config;

const remoteConfig = {
  dialect: 'sqlite',
  driver: 'turso',
  schema: './src/lib/db/models/*',
  out: './src/lib/db/migrations',
  breakpoints: true,
  dbCredentials: {
    url: process.env.DATABASE_URL || '',
    authToken: process.env.DATABASE_AUTH_TOKEN || ''
  }
} as Config;

export default process.env.NODE_ENV === 'production' ? remoteConfig : localConfig;
