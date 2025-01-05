// Types
import type { RequestEvent } from '@sveltejs/kit';
import type { OAuth2Tokens } from 'arctic';

// Utils
import { generateSessionToken, createSession, setSessionTokenCookie } from '$lib/server/auth';
import { google } from '$lib/server/oauth';
import { decodeIdToken } from 'arctic';
import { ObjectParser } from '@pilcrowjs/object-parser';
import { eq, or } from 'drizzle-orm';
import { redirect } from 'sveltekit-flash-message/server';
import { sendEmail } from '$lib/utils/mail/mailer';
import { generateNanoId } from '$lib/utils/helpers/generate';
import * as m from '$lib/utils/messages.json';

// Database
import db from '$lib/server/database';
import { User } from '$models/user';
import { Account, UsersAccounts } from '$models/account';

export async function GET(event: RequestEvent): Promise<Response> {
  const code = event.url.searchParams.get('code');
  const state = event.url.searchParams.get('state');
  const storedState = event.cookies.get('google_oauth_state') ?? null;
  const codeVerifier = event.cookies.get('google_code_verifier') ?? null;
  if (code === null || state === null || storedState === null || codeVerifier === null) {
    redirect('/login', { type: 'error', message: m.auth.login.error }, event);
  }
  if (state !== storedState) {
    redirect('/login', { type: 'error', message: m.auth.login.error }, event);
  }

  let tokens: OAuth2Tokens;

  try {
    tokens = await google.validateAuthorizationCode(code, codeVerifier);
  } catch {
    console.log('Invalid code or client credentials');
    redirect('/login', { type: 'error', message: m.auth.login.error }, event);
  }
  const claims = decodeIdToken(tokens.idToken());
  const claimsParser = new ObjectParser(claims);

  const googleId = claimsParser.getString('sub');
  const firstName = claimsParser.getString('given_name');
  const lastName = claimsParser.getString('family_name');
  const email = claimsParser.getString('email');

  const existingUser = await db.query.User.findFirst({
    where: or(eq(User.googleId, Number(googleId)), eq(User.email, email)),
    columns: {
      id: true,
      googleId: true,
      avatar: true
    }
  });

  if (existingUser) {
    if (!existingUser.googleId) {
      await db
        .update(User)
        .set({ googleId: Number(googleId) })
        .where(eq(User.id, existingUser.id));
    }

    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, existingUser.id);
    setSessionTokenCookie(event, sessionToken, session.expiresAt);

    redirect(
      '/',
      {
        type: 'success',
        message: m.auth.login.success
      },
      event
    );
  }

  let userId = null;
  const userPublicId = generateNanoId();

  try {
    await db.transaction(async (tx) => {
      const user = await tx
        .insert(User)
        .values({
          publicId: userPublicId,
          email,
          googleId: Number(googleId),
          firstName,
          lastName
        })
        .returning();

      const userAccount = await tx
        .insert(Account)
        .values({
          type: 'personal',
          name: `${firstName} ${lastName}`
        })
        .returning();

      userId = user[0].id;
      const accountId = userAccount[0].id;

      await tx.insert(UsersAccounts).values({
        userId: userId,
        accountId: accountId,
        role: 'admin'
      });
    });

    if (userId) {
      // Automatically log in the user
      try {
        const sessionToken = generateSessionToken();
        const session = await createSession(sessionToken, userId);
        setSessionTokenCookie(event, sessionToken, session.expiresAt);
      } catch (e) {
        console.log(e);
      }
    }

    // Send welcome email
    try {
      sendEmail(email, 'Welcome', { userFirstName: firstName });
    } catch (e) {
      console.log(e);
    }
  } catch (error) {
    console.log(error);
    redirect('/register', { type: 'error', message: m.general.error }, event);
  }

  redirect(
    '/',
    {
      type: 'success',
      message: m.auth.login.success
    },
    event
  );
}
