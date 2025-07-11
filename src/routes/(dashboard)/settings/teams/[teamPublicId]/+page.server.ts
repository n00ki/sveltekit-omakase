// Env Variables
import { PUBLIC_BASE_URL } from '$env/static/public';

// Types
import type { Action, Actions } from '@sveltejs/kit';

// Utils
import { redirect } from 'sveltekit-flash-message/server';
import { zod4 } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/client';
import { setFormFail, setFormError } from '$lib/utils/helpers/forms';
import { and, eq } from 'drizzle-orm';
import { Emails, sendEmail } from '$lib/utils/mail/mailer';
import * as m from '$lib/utils/messages.json';

// Schemas
import { createTeamInviteSchema, editTeamSchema, leaveTeamSchema, deleteTeamSchema } from '$lib/validations/team';

// Database
import db from '$lib/server/database';
import { Team, UsersTeams } from '$models/team';
import { Invite } from '$models/invite';
import { getTeamByPublicIdWithRelationsQuery, type GetTeamByPublicIdWithRelations } from '$queries/team';

export async function load(event) {
  const team = (await getTeamByPublicIdWithRelationsQuery.execute({
    publicId: event.params.teamPublicId
  })) as GetTeamByPublicIdWithRelations;

  if (!team) {
    redirect('/', { type: 'error', message: m.teams.notFound }, event);
  }

  if (!team.members.find((m) => m.userId === event.locals.user?.id)) {
    redirect('/', { type: 'error', message: m.teams.unauthorized }, event);
  }

  const createTeamInviteForm = await superValidate({ teamId: team.id }, zod4(createTeamInviteSchema), {
    id: 'create-team-invite-form',
    errors: false
  });

  const editTeamForm = await superValidate({ teamId: team.id, name: team.name }, zod4(editTeamSchema), {
    id: 'edit-team-form',
    errors: false
  });

  const leaveTeamForm = await superValidate(zod4(leaveTeamSchema), {
    id: 'leave-team-form'
  });

  const deleteTeamForm = await superValidate({ teamId: team.id }, zod4(deleteTeamSchema), {
    id: 'delete-team-form',
    errors: false
  });

  return {
    metadata: {
      title: team.name,
      breadcrumbs: [
        {
          title: 'Dashboard',
          href: '/dashboard'
        },
        {
          title: 'Teams',
          href: '/settings/teams'
        },
        {
          title: team.name,
          href: `/settings/teams/${team.publicId}`
        }
      ]
    },
    team,
    createTeamInviteForm,
    editTeamForm,
    leaveTeamForm,
    deleteTeamForm
  };
}

const createTeamInvite: Action = async (event) => {
  const createTeamInviteFormValidated = await superValidate(event.request, zod4(createTeamInviteSchema));

  if (!createTeamInviteFormValidated.valid) {
    return setFormFail(createTeamInviteFormValidated);
  }

  const { teamId, email } = createTeamInviteFormValidated.data;

  if (teamId && email) {
    if (email === event.locals.user?.email) {
      return setFormError(createTeamInviteFormValidated, m.teams.invite.send.alreadyMember, {
        status: 500,
        field: 'email'
      });
    }

    try {
      const invite = await db
        .insert(Invite)
        .values({
          teamId: teamId,
          email: email,
          expiresAt: Date.now() + 1000 * 60 * 60 * 168
        })
        .returning();

      const inviteUrl = `${PUBLIC_BASE_URL}/api/invites?team=${teamId}&token=${invite[0].token}`;
      try {
        sendEmail(email, Emails.TeamInvite, {
          url: inviteUrl,
          invitedBy: event.locals.user?.firstName + ' ' + event.locals.user?.lastName
        });
      } catch (e) {
        console.log(e);
      }
    } catch (error) {
      console.log(error);

      return setFormError(createTeamInviteFormValidated, m.general.error, {
        status: 500
      });
    }

    redirect({ type: 'success', message: `Invite sent to ${email}! Check back to see when they join.` }, event);
  }
};

const editTeam: Action = async (event) => {
  const editTeamFormValidated = await superValidate(event.request, zod4(editTeamSchema));

  if (!editTeamFormValidated.valid) {
    return setFormFail(editTeamFormValidated);
  }

  const { teamId, name } = editTeamFormValidated.data;

  if (teamId && name) {
    try {
      await db.update(Team).set({ name: name }).where(eq(Team.id, teamId));
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

    redirect({ type: 'success', message: m.teams.edit.success }, event);
  }
};

const leaveTeam: Action = async (event) => {
  const leaveTeamFormValidated = await superValidate(event.request, zod4(leaveTeamSchema));

  if (!leaveTeamFormValidated.valid) {
    return setFormFail(leaveTeamFormValidated);
  }

  const { teamId, userId } = leaveTeamFormValidated.data;

  try {
    await db.delete(UsersTeams).where(and(eq(UsersTeams.teamId, teamId), eq(UsersTeams.userId, Number(userId))));
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

  redirect('/settings/teams', { type: 'success', message: m.teams.leave.success }, event);
};

const deleteTeam: Action = async (event) => {
  const deleteTeamFormValidated = await superValidate(event.request, zod4(deleteTeamSchema));

  if (!deleteTeamFormValidated.valid) {
    return setFormFail(deleteTeamFormValidated);
  }

  const { teamId } = deleteTeamFormValidated.data;

  if (teamId) {
    try {
      await db.delete(Team).where(eq(Team.id, teamId));
    } catch (error) {
      console.log(error);

      return setFormError(deleteTeamFormValidated, m.general.error, {
        status: 500
      });
    }

    redirect('/settings/teams', { type: 'success', message: m.teams.delete.success }, event);
  }
};

export const actions: Actions = { createTeamInvite, editTeam, leaveTeam, deleteTeam };
