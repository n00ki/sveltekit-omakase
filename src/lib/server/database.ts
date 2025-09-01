import 'dotenv/config';

import type { Client } from '@libsql/client';

import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';

import * as schema from '$lib/db/models/index';

export const client: Client = createClient({
  url: process.env.DATABASE_URL || '',
  authToken: process.env.NODE_ENV === 'development' ? undefined : process.env.DATABASE_AUTH_TOKEN
});

const db = drizzle(client, {
  schema,
  casing: 'snake_case'
});

export default db;
