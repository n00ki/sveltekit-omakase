// Utils
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient, type Client } from '@libsql/client';

// Schemas
import * as userSchema from '$models/user';
import * as sessionSchema from '$models/session';
import * as tokenSchema from '$models/token';
import * as accountSchema from '$models/account';
import * as inviteSchema from '$models/invite';

const env = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const vars = {
  DATABASE_URL: process.env.DATABASE_URL || '',
  DATABASE_AUTH_TOKEN: process.env.DATABASE_AUTH_TOKEN || '',
  LOCAL_DATABASE_URL: process.env.LOCAL_DATABASE_URL || ''
};

export let client: Client;

if (env === 'production') {
  if (!vars.DATABASE_URL) {
    throw new Error('DATABASE_URL is required in production mode');
  }

  if (!vars.DATABASE_AUTH_TOKEN) {
    throw new Error('DATABASE_AUTH_TOKEN is required in production mode');
  }

  const remoteClient = createClient({
    url: process.env.DATABASE_URL || '',
    authToken: process.env.DATABASE_AUTH_TOKEN || ''
  });

  client = remoteClient;
} else {
  if (!vars.LOCAL_DATABASE_URL) {
    throw new Error('LOCAL_DATABASE_URL is required in development mode');
  }

  const localClient = createClient({
    url: process.env.LOCAL_DATABASE_URL || ''
  });

  client = localClient;
}

const db = drizzle(client, {
  schema: {
    ...userSchema,
    ...sessionSchema,
    ...tokenSchema,
    ...accountSchema,
    ...inviteSchema
  }
});

export default db;
