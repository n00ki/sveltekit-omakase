import type { Action, Actions } from '@sveltejs/kit';

import { fail } from '@sveltejs/kit';
import { redirect, setFlash } from 'sveltekit-flash-message/server';
import { zod4 } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';

import { auth } from '$lib/server/auth';
import { setFormError } from '$lib/utils/helpers/forms';
import * as m from '$lib/utils/messages.json';
import { editPasswordSchema } from '$lib/validations/auth';

export async function load() {
  const form = await superValidate(zod4(editPasswordSchema));

  return {
    metadata: {
      title: 'Update Password',
      breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Password Settings', href: '/settings/password' }
      ]
    },
    form
  };
}

const editPassword: Action = async (event) => {
  const form = await superValidate(event.request, zod4(editPasswordSchema));

  if (!form.valid) {
    return fail(400, { form });
  } else {
    const { password, passwordConfirmation } = form.data;

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
      await auth.api.setPassword({
        body: {
          newPassword: password
        },
        headers: event.request.headers
      });
    } catch (error) {
      console.log(error);
      setFlash({ status: 500, type: 'error', message: m.general.error }, event);
      return fail(500, { form: await superValidate(zod4(editPasswordSchema)) });
    }

    try {
      await auth.api.signOut({
        headers: event.request.headers
      });
    } catch (error) {
      console.log(error);
      redirect({ type: 'success', message: m.settings.password.edit.success }, event);
    }
    redirect('/login', { status: 303, type: 'success', message: m.settings.password.edit.success }, event);
  }
};

export const actions = {
  default: editPassword
} satisfies Actions;
