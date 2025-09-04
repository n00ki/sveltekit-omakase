import type { Action, Actions } from '@sveltejs/kit';

import { fail } from '@sveltejs/kit';
import { redirect, setFlash } from 'sveltekit-flash-message/server';
import { zod4 } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';

import { auth } from '$lib/server/auth';
import * as m from '$lib/utils/messages.json';
import { editUserSchema } from '$lib/validations/auth';

export async function load() {
  const form = await superValidate(zod4(editUserSchema), {
    id: 'edit-user-form'
  });

  return {
    metadata: {
      title: 'User Profile',
      breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Profile Settings', href: '/settings/profile' }
      ]
    },
    form
  };
}

const editUser: Action = async (event) => {
  const form = await superValidate(event.request, zod4(editUserSchema));

  if (!form.valid) {
    return fail(400, { form });
  } else {
    const { avatarFileId, firstName, lastName } = form.data;

    if (!avatarFileId && !firstName && !lastName) {
      redirect(
        {
          type: 'warning',
          message: m.settings.userProfile.edit.noChanges
        },
        event
      );
    }

    try {
      await auth.api.updateUser({
        body: {
          ...(avatarFileId && { avatar: avatarFileId }),
          ...(firstName && { firstName }),
          ...(lastName && { lastName })
        },
        headers: event.request.headers
      });
    } catch (error) {
      console.log(error);
      setFlash({ status: 500, type: 'error', message: m.general.error }, event);
      return fail(500, { form: await superValidate(zod4(editUserSchema)) });
    }
    redirect({ status: 303, type: 'success', message: m.settings.userProfile.edit.success }, event);
  }
};

const deleteUser: Action = async (event) => {
  try {
    await auth.api.deleteUser({
      body: {},
      headers: event.request.headers // fresh session token is required
    });
  } catch (error) {
    console.log(error);
    setFlash({ status: 500, type: 'error', message: m.general.error }, event);
    return fail(500, { form: await superValidate(zod4(editUserSchema)) });
  }
  console.log('redirecting');
  redirect('/', { type: 'success', message: m.settings.userProfile.delete.success }, event);
};

export const actions = {
  'edit-user': editUser,
  'delete-user': deleteUser
} satisfies Actions;
