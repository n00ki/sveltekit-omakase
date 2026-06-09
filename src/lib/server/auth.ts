import { getRequestEvent } from '$app/server';

import { redirect } from '@sveltejs/kit';
import { setUserImageFromOAuth } from '$queries';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { twoFactor } from 'better-auth/plugins';
import { sveltekitCookies } from 'better-auth/svelte-kit';

import { Account, Session, TwoFactor, User, Verification } from '$lib/db/models';
import { EMAILS, sendEmail } from '$lib/mail/mailer';
import db from '$lib/server/database';
import { normalizeFullName } from '$lib/utils/name';

import { config } from '$config/server';

type GoogleProfile = {
  family_name?: string | null;
  given_name?: string | null;
  name?: string | null;
  picture?: string | null;
};

type GoogleIdTokenPayload = {
  picture?: string;
};

type OAuthAccount = {
  idToken?: string | null;
  providerId: string;
  userId: string;
};

function nonEmptyString(value: string | null | undefined): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function getGoogleProfileName(profile: GoogleProfile): string {
  const name = normalizeFullName(profile.name ?? [profile.given_name, profile.family_name].filter(Boolean).join(' '));
  return name || 'User';
}

function getGoogleProfileImage(profile: GoogleProfile): string | undefined {
  return nonEmptyString(profile.picture);
}

function getGoogleImageFromIdToken(idToken: string | null | undefined): string | undefined {
  if (!idToken) {
    return undefined;
  }

  const payload = idToken.split('.')[1];

  if (!payload) {
    return undefined;
  }

  try {
    const decodedPayload = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as GoogleIdTokenPayload;
    return nonEmptyString(decodedPayload.picture);
  } catch {
    return undefined;
  }
}

async function syncGoogleImage(account: OAuthAccount | null | undefined): Promise<void> {
  if (!account || account.providerId !== 'google') {
    return;
  }

  const image = getGoogleImageFromIdToken(account.idToken);

  if (!image) {
    return;
  }

  try {
    await setUserImageFromOAuth(account.userId, image);
  } catch (error) {
    console.error('Failed to sync Google profile image:', error);
  }
}

export const auth = betterAuth({
  appName: config.app.name,
  database: drizzleAdapter(db, {
    provider: 'sqlite',
    schema: {
      user: User,
      session: Session,
      account: Account,
      verification: Verification,
      twoFactor: TwoFactor
    }
  }),
  plugins: [
    twoFactor({
      issuer: config.app.name,
      backupCodeOptions: {
        amount: 8
      },
      twoFactorCookieMaxAge: 10 * 60
    }),
    sveltekitCookies(getRequestEvent)
  ],
  advanced: {
    cookiePrefix: config.auth.session.cookiePrefix,
    database: {
      generateId: false
    }
  },
  session: {
    expiresIn: config.auth.session.expiresIn
  },
  databaseHooks: {
    account: {
      create: {
        after: syncGoogleImage
      },
      update: {
        after: syncGoogleImage
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
        const image = getGoogleProfileImage(profile);

        return {
          ...(image && { image }),
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
