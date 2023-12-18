// Types
import type { Action } from './$types';

// Env Variables
import { PUBLIC_BASE_URL } from '$env/static/public';

// Utils
import db from '$lib/server/database';
import { auth } from '$lib/server/auth';
import { users, tokens } from '$lib/db/models/auth';
import { eq } from 'drizzle-orm';
import { redirect } from 'sveltekit-flash-message/server';
import { superValidate } from 'sveltekit-superforms/server';
import { requestPasswordResetSchema } from '$lib/validations/auth';
import { setFormFail, setFormError } from '$lib/utils/helpers/forms';
import { sendEmail } from '$lib/utils/mail/mailer';
import { generateRandomString } from 'lucia/utils';

export async function load({ locals }) {
  // redirect user if already logged in
  const session = await locals.auth.validate();
  if (session) throw redirect(302, '/');

  const form = await superValidate(requestPasswordResetSchema);

  return {
    metadata: {
      title: 'Request Password Reset'
    },
    form
  };
}

const requestPasswordReset: Action = async (event) => {
  const form = await superValidate(event.request, requestPasswordResetSchema);

  if (!form.valid) {
    return setFormFail(form);
  }

  const { email } = form.data;

  const getUsers = await db.select({ id: users.id }).from(users).where(eq(users.email, email));
  const user = getUsers[0];

  if (!user) {
    // we send a success message even if the user doesn't exist to prevent email enumeration
    throw redirect(
      '/',
      {
        type: 'success',
        message: 'An email has been sent to reset your password!'
      },
      event
    );
  }

  try {
    const timestamp = new Date(Date.now() + 1000 * 60 * 10);
    const createOrUpdateTokens = await db
      .insert(tokens)
      .values({
        id: generateRandomString(15),
        userId: user.id,
        expiresAt: timestamp
      })
      .onConflictDoUpdate({
        target: tokens.userId,
        set: { expiresAt: timestamp }
      })
      .returning();

    console.log(createOrUpdateTokens);

    const token = createOrUpdateTokens[0];

    await auth.invalidateAllUserSessions(user.id);

    const url = new URL(`${PUBLIC_BASE_URL}/reset-password/${email}/${token?.id}`);
    await sendEmail(email, 'Reset Password', 'ResetPassword', { url: url });
  } catch (error) {
    console.log(error);
    return setFormError(form, 'Something went wrong. Please try again later.', { status: 500 });
  }

  throw redirect(
    '/',
    {
      type: 'success',
      message: 'An email has been sent to reset your password!'
    },
    event
  );
};

export const actions = { requestPasswordReset };
