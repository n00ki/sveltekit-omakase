// Types
import type { Action, Actions } from './$types';

// Utils
import { APIError as BetterAuthAPIError } from 'better-auth/api';
import { auth, redirectIfLoggedIn } from '$lib/server/auth';
import { Emails, sendEmail } from '$lib/utils/mail/mailer';
import { redirect } from 'sveltekit-flash-message/server';
import { setFormFail, setFormError, isRateLimited } from '$lib/utils/helpers/forms';
import { superValidate } from 'sveltekit-superforms/server';
import { zod4 } from 'sveltekit-superforms/adapters';
import * as m from '$lib/utils/messages.json';

// Schemas
import { registrationSchema } from '$lib/validations/auth';

export async function load() {
  redirectIfLoggedIn();

  const form = await superValidate(zod4(registrationSchema));

  return {
    metadata: {
      title: 'Register'
    },
    form
  };
}

const register: Action = async (event) => {
  const form = await superValidate(event.request, zod4(registrationSchema));

  await isRateLimited(form, event, {
    field: 'email',
    removeSensitiveData: ['password', 'passwordConfirmation']
  });

  if (!form.valid) {
    return setFormFail(form, {
      removeSensitiveData: ['password', 'passwordConfirmation']
    });
  }

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
  try {
    await auth.api.signUpEmail({
      body: {
        email,
        firstName,
        lastName,
        name: `${firstName} ${lastName}`,
        password,
        avatar: ''
      }
    });
  } catch (error) {
    if (error instanceof BetterAuthAPIError) {
      if (error.body?.code === 'USER_ALREADY_EXISTS') {
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
    }
    return setFormFail(form, {
      removeSensitiveData: ['password', 'passwordConfirmation']
    });
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
      status: 303,
      type: 'success',
      message: m.auth.register.success
    },
    event
  );
};

export const actions = {
  default: register
} satisfies Actions;
