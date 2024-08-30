// Stores
import { dev } from '$app/environment';

// Utils
import { Lucia, TimeSpan } from 'lucia';
import { LibSQLAdapter } from '@lucia-auth/adapter-sqlite';

// Database
import { client } from '$lib/server/database';

const adapter = new LibSQLAdapter(client, {
  user: 'users',
  session: 'sessions'
});

export const auth = new Lucia(adapter, {
  getUserAttributes: (attributes: DatabaseUserAttributes) => {
    return {
      email: attributes.email,
      firstName: attributes.first_name,
      lastName: attributes.last_name,
      avatar: attributes.avatar
    };
  },
  sessionExpiresIn: new TimeSpan(7, 'd'),
  sessionCookie: {
    name: '__auth_session',
    attributes: {
      secure: !dev,
      sameSite: 'strict'
    }
  }
});

declare module 'lucia' {
  interface Register {
    Lucia: typeof auth;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}
