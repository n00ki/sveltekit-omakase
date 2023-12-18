// Packages
import { lucia } from 'lucia';
import { pg } from '@lucia-auth/adapter-postgresql';
// Utils
import { pool } from '$lib/server/database';
import { sveltekit } from 'lucia/middleware';

// Stores
import { dev } from '$app/environment';

export const auth = lucia({
  adapter: pg(pool, {
    user: 'users',
    key: 'keys',
    session: 'sessions'
  }),
  env: dev ? 'DEV' : 'PROD',
  middleware: sveltekit(),
  getUserAttributes: (data) => {
    return {
      email: data.email,
      avatar: data.avatar
    };
  },
  csrfProtection: true,
  sessionCookie: {
    name: '__auth_session',
    attributes: {
      sameSite: 'strict'
    }
  }
});

export type Auth = typeof auth;
