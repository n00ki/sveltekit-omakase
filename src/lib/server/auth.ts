// Utils
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { Emails, sendEmail } from '$lib/utils/mail/mailer';
import { getRequestEvent } from '$app/server';
import { redirect } from '@sveltejs/kit';
import { sveltekitCookies } from 'better-auth/svelte-kit';

// Database
import db from './database';
import { User, Session, Account, Verification } from '../db/models';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'sqlite',
    schema: {
      user: User,
      session: Session,
      account: Account,
      verification: Verification
    }
  }),
  plugins: [sveltekitCookies(getRequestEvent)],
  advanced: {
    cookiePrefix: 'somakase',
    database: {
      generateId: false
    }
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7 // 7 days
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail(user?.email, Emails.ResetPassword, {
        userFirstName: user.name.split(' ')[0],
        url
      });
    }
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      redirectUri: `${process.env.PUBLIC_BASE_URL}/auth/social/callback/google`,
      overrideUserInfoOnSignIn: false,
      mapProfileToUser: (profile) => {
        return {
          firstName: profile.given_name,
          lastName: profile.family_name
        };
      }
    }
  },
  user: {
    additionalFields: {
      publicId: {
        type: 'string',
        unique: true,
        index: true,
        input: false
      },
      firstName: {
        type: 'string'
      },
      lastName: {
        type: 'string'
      },
      avatar: {
        type: 'string'
      }
    },
    deleteUser: {
      enabled: true
    }
  }
});

// Export individual types for convenience
export type User = typeof auth.$Infer.Session.user;
export type Session = typeof auth.$Infer.Session.session;

export async function requireLogin(request: Request) {
  const session = await auth.api.getSession(request);

  if (!session) {
    redirect(302, '/login');
  }

  return session;
}

export async function redirectIfLoggedIn(request: Request) {
  const session = await auth.api.getSession(request);

  if (session) {
    redirect(302, '/dashboard');
  }
}
