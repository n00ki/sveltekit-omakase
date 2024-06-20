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
    url: process.env.REMOTE_DATABASE_URL || '',
    authToken: process.env.REMOTE_DATABASE_AUTH_TOKEN || ''
  }
};

export default process.env.NODE_ENV === 'production' ? remoteConfig : localConfig;
