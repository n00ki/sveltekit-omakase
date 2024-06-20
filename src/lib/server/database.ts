// Utils
import 'dotenv/config';
import { dev } from '$app/environment';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

// Schemas
import * as userSchema from '$models/user';
import * as sessionSchema from '$models/session';
import * as tokenSchema from '$models/token';
import * as accountSchema from '$models/account';
import * as inviteSchema from '$models/invite';

const localClient = createClient({
  url: process.env.LOCAL_DATABASE_URL || ''
});

const remoteClient = createClient({
  url: process.env.REMOTE_DATABASE_URL || '',
  authToken: process.env.REMOTE_DATABASE_AUTH_TOKEN || ''
});

export const client = dev ? localClient : remoteClient;

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
