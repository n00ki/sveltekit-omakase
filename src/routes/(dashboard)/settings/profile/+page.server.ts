// Types
import { type Action } from '@sveltejs/kit';

// Utils
import * as auth from '$lib/server/auth';
import { redirect, setFlash } from 'sveltekit-flash-message/server';
import { fail } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';
import { eq } from 'drizzle-orm';
import * as m from '$lib/utils/messages.json';

// Schemas
import { editUserSchema } from '$lib/validations/auth';

// Database
import db from '$lib/server/database';
import { User } from '$models/user';
import { UsersTeams, Team } from '$models/team';
import { Session } from '$models/session';

export async function load() {
  const form = await superValidate(zod(editUserSchema), {
    id: 'edit-user-form'
  });

  return {
    metadata: {
      title: 'User Profile',
      breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'User Profile', href: '/settings/profile' }
      ]
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
        setFlash({ status: 500, type: 'error', message: m.general.error }, event);
        return fail(500, { form: await superValidate(zod(editUserSchema)) });
      }
    }

    redirect({ type: 'success', message: m.settings.userProfile.edit.success }, event);
  }
};

const deleteUser: Action = async (event) => {
  const user = event.locals.user;
  let userTeams = [];

  if (!user) redirect('/', { type: 'error', message: m.auth.unauthorized }, event);

  try {
    userTeams = await db.query.UsersTeams.findMany({
      where: eq(UsersTeams.userId, user.id),
      columns: {},
      with: {
        team: {
          columns: {
            id: true
          },
          with: {
            members: true
          }
        }
      }
    });
  } catch (error) {
    console.log(error);
    setFlash({ status: 500, type: 'error', message: m.general.error }, event);
    return fail(500);
  }

  try {
    try {
      if (event.locals.session) await auth.invalidateSession(event.locals.session.id);
      auth.deleteSessionTokenCookie(event);
    } catch {
      setFlash({ status: 500, type: 'error', message: m.general.error }, event);
      return fail(500, { form: await superValidate(zod(editUserSchema)) });
    }

    if (user && userTeams.length > 0) {
      await auth.invalidateUserSessions(user.id);
      await db.transaction(async (tx) => {
        // First, delete all sessions for this user
        await tx.delete(Session).where(eq(Session.userId, user.id));

        // Then delete UsersTeams
        await tx.delete(UsersTeams).where(eq(UsersTeams.userId, user.id));

        // Then handle Team deletion
        for (const userTeam of userTeams) {
          if (userTeam.team.members.length === 1) {
            // Then delete the Team
            await tx.delete(Team).where(eq(Team.id, userTeam.team.id));
          }
        }

        // Finally delete the User
        await tx.delete(User).where(eq(User.id, user.id));
      });
    }
  } catch (error) {
    console.log(error);
    setFlash({ status: 500, type: 'error', message: m.general.error }, event);
    return fail(500, { form: await superValidate(zod(editUserSchema)) });
  }

  redirect('/', { type: 'success', message: m.settings.userProfile.delete.success }, event);
};

export const actions = { editUser, deleteUser };
