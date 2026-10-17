import { DATABASE_AUTH_TOKEN, DATABASE_URL } from '$app/env/private';

import type { Client } from '@libsql/client';

import { dev } from '$app/env';

import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';

import * as schema from '#lib/db/models/index.ts';

export const client: Client = createClient({
  url: DATABASE_URL,
  authToken: dev ? undefined : DATABASE_AUTH_TOKEN
});

const db = drizzle(client, {
  schema,
  casing: 'snake_case'
});

export default db;
