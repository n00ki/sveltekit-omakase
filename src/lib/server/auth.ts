import { getRequestEvent } from '$app/server';

import { redirect } from '@sveltejs/kit';
import { hasCredentialAccountByUserId, setUserAvatarFromOAuth } from '$queries';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';

import { Account, Session, User, Verification } from '$lib/db/models';
import { EMAILS, sendEmail } from '$lib/mail/mailer';
import db from '$lib/server/database';
import { normalizeFullName } from '$lib/utils/name';

type GoogleIdTokenPayload = {
  picture?: string;
};

function getGoogleProfileName(profile: {
  name?: string | null;
  given_name?: string | null;
  family_name?: string | null;
}): string {
  const name = normalizeFullName(profile.name ?? [profile.given_name, profile.family_name].filter(Boolean).join(' '));
  return name || 'User';
}

function getGoogleAvatarFromIdToken(idToken: string | null | undefined): string | null {
  if (!idToken) {
    return null;
  }

  const payload = idToken.split('.')[1];

  if (!payload) {
    return null;
  }

  try {
    const decodedPayload = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as GoogleIdTokenPayload;
    return typeof decodedPayload.picture === 'string' && decodedPayload.picture.length > 0
      ? decodedPayload.picture
      : null;
  } catch {
    return null;
  }
}

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
  databaseHooks: {
    account: {
      create: {
        after: async (account) => {
          if (account.providerId !== 'google') {
            return;
          }

          const hasCredentialAccount = await hasCredentialAccountByUserId(account.userId);

          if (!hasCredentialAccount) {
            return;
          }

          const googleAvatar = getGoogleAvatarFromIdToken(account.idToken);

          if (!googleAvatar) {
            return;
          }

          try {
            await setUserAvatarFromOAuth(account.userId, googleAvatar);
          } catch (error) {
            console.error('Failed to sync Google avatar:', error);
          }
        }
      }
    }
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail(user?.email, EMAILS.resetPassword, {
        userName: user?.name ?? 'there',
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
          name: getGoogleProfileName(profile)
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
      avatar: {
        type: 'string'
      }
    },
    deleteUser: {
      enabled: true
    }
  }
});

export type User = typeof auth.$Infer.Session.user;
export type Session = typeof auth.$Infer.Session.session;

export function requireAuth() {
  const { locals } = getRequestEvent();

  if (!locals.user || !locals.session) {
    redirect(303, '/login');
  }

  return { user: locals.user, session: locals.session };
}

export function requireGuest() {
  const { locals } = getRequestEvent();
  if (locals.user) {
    redirect(302, '/dashboard');
  }
}
