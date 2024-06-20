// Utils
import 'dotenv/config';
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
  url: process.env.DATABASE_URL || '',
  authToken: process.env.DATABASE_AUTH_TOKEN || ''
});

export const client = process.env.NODE_ENV === 'production' ? remoteClient : localClient;

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
