// Types
import { type Action } from '@sveltejs/kit';

// Utils
import { auth } from '$lib/server/auth';
import { redirect } from 'sveltekit-flash-message/server';
import { fail } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';
import { setFormError } from '$lib/utils/helpers/forms';
import { eq } from 'drizzle-orm';
import * as m from '$lib/utils/messages.json';

// Schemas
import { editUserSchema } from '$lib/validations/auth';

// Database
import db from '$lib/server/database';
import { User } from '$models/user';
import { UsersAccounts, Account } from '$models/account';

export async function load() {
  const form = await superValidate(zod(editUserSchema), {
    id: 'edit-user-form'
  });

  return {
    metadata: {
      title: 'User Profile'
    },
    form
  };
}

const editUser: Action = async (event) => {
  const form = await superValidate(event.request, zod(editUserSchema));

  if (!form.valid) {
    return fail(400, { form });
  } else {
    const user = event.locals.user;

    if (!user) {
      redirect(
        {
          type: 'error',
          message: m.auth.unauthorized
        },
        event
      );
    }

    const { avatar } = form.data;

    if (!avatar) {
      redirect(
        {
          type: 'warning',
          message: m.settings.userProfile.edit.noChanges
        },
        event
      );
    }

    if (avatar && typeof avatar === 'string') {
      try {
        await db.update(User).set({ avatar }).where(eq(User.id, user.id));
      } catch (error) {
        console.log(error);
        return setFormError(form, m.general.error, {
          status: 500,
          field: 'avatar'
        });
      }
    }

    throw redirect({ type: 'success', message: m.settings.userProfile.edit.success }, event);
  }
};

const deleteUser: Action = async (event) => {
  const user = event.locals.user;
  let userAccounts = [];

  if (!user) redirect('/', { type: 'error', message: m.auth.unauthorized }, event);

  try {
    userAccounts = await db.query.UsersAccounts.findMany({
      where: eq(UsersAccounts.userId, user.id),
      columns: {},
      with: {
        account: {
          columns: {
            id: true,
            type: true
          }
        }
      }
    });
  } catch (error) {
    console.log(error);
    redirect(
      {
        status: 500,
        type: 'error',
        message: m.general.error
      },
      event
    );
  }

  try {
    try {
      await auth.invalidateUserSessions(user.id);
      const sessionCookie = auth.createBlankSessionCookie();
      event.cookies.set(sessionCookie.name, sessionCookie.value, {
        path: '.',
        ...sessionCookie.attributes
      });
    } catch {
      redirect(
        {
          status: 500,
          type: 'error',
          message: m.general.error
        },
        event
      );
    }

    if (user && userAccounts.length > 0) {
      await db.transaction(async (tx) => {
        await tx.delete(UsersAccounts).where(eq(UsersAccounts.userId, user.id));
        userAccounts.forEach(async (ua) => {
          if (ua.account.type === 'personal') {
            await tx.delete(Account).where(eq(Account.id, ua.account.id));
          }
        });
        await tx.delete(User).where(eq(User.id, user.id));
      });
    }
  } catch (error) {
    console.log(error);
    redirect(
      {
        status: 500,
        type: 'error',
        message: m.general.error
      },
      event
    );
  }

  redirect('/', { type: 'success', message: m.settings.userProfile.delete.success }, event);
};

export const actions = { editUser, deleteUser };
