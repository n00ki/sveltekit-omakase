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

export const client = createClient({
  url: process.env.DATABASE_URL || '',
  authToken: process.env.DATABASE_AUTH_TOKEN || ''
});

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
