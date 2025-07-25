// Types
import type { Action } from './$types';

// Env Variables
import { PUBLIC_BASE_URL } from '$env/static/public';

// Utils
import { invalidateUserSessions } from '$lib/server/auth';
import { redirect } from 'sveltekit-flash-message/server';
import { zod4 } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';
import { setFormFail, setFormError, isRateLimited } from '$lib/utils/helpers/forms';
import { eq } from 'drizzle-orm';
import { Emails, sendEmail } from '$lib/utils/mail/mailer';
import { generateToken } from '$lib/utils/helpers/generate';
import * as m from '$lib/utils/messages.json';

// Schemas
import { requestPasswordResetSchema } from '$lib/validations/auth';

// Database
import db from '$lib/server/database';
import { User } from '$models/user';
import { Token } from '$models/token';

export async function load({ locals }) {
  // redirect user if already logged in
  if (locals.user) redirect(302, '/');

  const form = await superValidate(zod4(requestPasswordResetSchema));

  return {
    metadata: {
      title: 'Request Password Reset'
    },
    form
  };
}

const requestPasswordReset: Action = async (event) => {
  const form = await superValidate(event.request, zod4(requestPasswordResetSchema));

  await isRateLimited(form, event, { field: 'email' });

  if (!form.valid) {
    return setFormFail(form);
  }

  const { email } = form.data;

  const user = await db.query.User.findFirst({
    where: eq(User.email, email),
    columns: {
      id: true,
      publicId: true,
      firstName: true
    }
  });

  if (!user) {
    // we send a success message even if the user doesn't exist to prevent email enumeration
    redirect(
      '/',
      {
        type: 'success',
        message: m.auth.requestResetPassword.success
      },
      event
    );
  }

  try {
    const timestamp = Date.now() + 1000 * 60 * 10;

    const createOrUpdateTokens = await db
      .insert(Token)
      .values({
        userId: user.id,
        expiresAt: timestamp
      })
      .onConflictDoUpdate({
        target: Token.userId,
        set: { key: generateToken(), expiresAt: timestamp }
      })
      .returning();

    const token = createOrUpdateTokens[0];

    await invalidateUserSessions(user.id);

    const url = new URL(`${PUBLIC_BASE_URL}/reset-password/update?user=${user.publicId}&token=${token?.key}`);

    await sendEmail(email, Emails.ResetPassword, {
      url: url.toString(),
      userFirstName: user.firstName
    });
  } catch (error) {
    console.log(error);
    return setFormError(form, m.general.error, {
      status: 500
    });
  }

  redirect(
    '/',
    {
      type: 'success',
      message: m.auth.requestResetPassword.success
    },
    event
  );
};

export const actions = { requestPasswordReset };
