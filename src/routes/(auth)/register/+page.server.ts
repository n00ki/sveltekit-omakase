// Types
import type { Action } from './$types';

// Utils
import { generateSessionToken, createSession, setSessionTokenCookie } from '$lib/server/auth';
import { redirect } from 'sveltekit-flash-message/server';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';
import { setFormFail, setFormError, isRateLimited } from '$lib/utils/helpers/forms';
import { eq } from 'drizzle-orm';
import { Emails, sendEmail } from '$lib/utils/mail/mailer';
import { generateNanoId } from '$lib/utils/helpers/generate';
import { hashPassword } from '$lib/utils/helpers/password';
import * as m from '$lib/utils/messages.json';

// Schemas
import { registrationSchema } from '$lib/validations/auth';

// Database
import db from '$lib/server/database';
import { User } from '$models/user';
import { Account, UsersAccounts } from '$models/account';

export async function load({ locals }) {
  // redirect to `/` if logged in
  if (locals.user) redirect(302, '/');

  const form = await superValidate(zod(registrationSchema));

  return {
    metadata: {
      title: 'Register'
    },
    form
  };
}

const register: Action = async (event) => {
  const form = await superValidate(event.request, zod(registrationSchema));

  await isRateLimited(form, event, {
    field: 'email',
    removeSensitiveData: ['password', 'passwordConfirmation']
  });

  if (!form.valid) {
    return setFormFail(form, {
      removeSensitiveData: ['password', 'passwordConfirmation']
    });
  } else {
    const { email, firstName, lastName, password, passwordConfirmation } = form.data;

    if (password !== passwordConfirmation) {
      return setFormError(
        form,
        m.auth.register.passwordsMismatch,
        {
          field: 'passwordConfirmation',
          removeSensitiveData: ['password', 'passwordConfirmation']
        },
        event
      );
    }

    const existingUser = await db.query.User.findFirst({
      where: eq(User.email, email),
      columns: {
        id: true
      }
    });

    if (existingUser) {
      return setFormError(
        form,
        m.auth.register.emailIsTaken,
        {
          field: 'email',
          removeSensitiveData: ['password', 'passwordConfirmation']
        },
        event
      );
    }

    let userId = null;
    const userPublicId = generateNanoId();
    const userHashedPassword = await hashPassword(password);

    try {
      await db.transaction(async (tx) => {
        const createUser = await tx
          .insert(User)
          .values({
            publicId: userPublicId,
            email,
            firstName,
            lastName,
            hashedPassword: userHashedPassword
          })
          .returning();

        const createAccount = await tx
          .insert(Account)
          .values({
            type: 'personal',
            name: `${firstName} ${lastName}`
          })
          .returning();

        userId = createUser[0].id;
        const accountId = createAccount[0].id;

        await tx.insert(UsersAccounts).values({
          userId: createUser[0].id,
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
    } catch (e) {
      console.log(e);

      return setFormError(
        form,
        m.general.error,
        {
          status: 500,
          removeSensitiveData: ['password', 'passwordConfirmation']
        },
        event
      );
    }

    // Send welcome email
    try {
      sendEmail(email, Emails.Welcome, {
        userFirstName: firstName
      });
    } catch (e) {
      console.log(e);
    }

    redirect(
      '/login',
      {
        type: 'success',
        message: m.auth.register.success
      },
      event
    );
  }
};

export const actions = { register };
