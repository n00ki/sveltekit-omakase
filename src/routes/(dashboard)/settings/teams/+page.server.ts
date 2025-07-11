// Types
import { type Action, type Actions } from '@sveltejs/kit';

// Utils
import { redirect } from 'sveltekit-flash-message/server';
import { zod4 } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';
import { isRateLimited, setFormFail } from '$lib/utils/helpers/forms';
import * as m from '$lib/utils/messages.json';

// Schemas
import { createTeamSchema } from '$lib/validations/team';

// Database
import db from '$lib/server/database';
import { Team, UsersTeams } from '$models/team';
import { getTeamsByUserIdQuery, type GetTeamsByUserId } from '$queries/team';
import { getUserPendingInvitesByEmailQuery, type GetUserPendingInvitesByEmail } from '$queries/invite';

export async function load(event) {
  const getUserTeams = (await getTeamsByUserIdQuery.execute({
    id: event.locals.user!.id
  })) as GetTeamsByUserId;

  const getUserPendingInvites = (await getUserPendingInvitesByEmailQuery.execute({
    email: event.locals.user!.email
  })) as GetUserPendingInvitesByEmail;

  const uniqueTeamInvites = getUserPendingInvites.reduce((unique, invite) => {
    const existingInvite = unique.find((i) => i.teamId === invite.teamId);
    if (!existingInvite) {
      unique.push(invite);
    }
    return unique;
  }, [] as GetUserPendingInvitesByEmail);

  const createTeamForm = await superValidate(zod4(createTeamSchema), { id: 'create-team-form' });

  return {
    metadata: {
      title: 'Teams',
      breadcrumbs: [
        {
          title: 'Dashboard',
          href: '/dashboard'
        },
        {
          title: 'Teams',
          href: '/settings/teams'
        }
      ]
    },
    createTeamForm,
    userTeams: getUserTeams?.userTeams,
    pendingInvites: uniqueTeamInvites
  };
}

const createTeam: Action = async (event) => {
  const createTeamForm = await superValidate(event.request, zod4(createTeamSchema));

  await isRateLimited(createTeamForm, event, { field: 'name' });

  if (!createTeamForm.valid) {
    return setFormFail(createTeamForm);
  }

  const { userId, name } = createTeamForm.data;
  let team: Team;

  try {
    const createdTeam = await db
      .insert(Team)
      .values({
        name
      })
      .returning();

    team = createdTeam[0];

    if (team) {
      await db.insert(UsersTeams).values({
        teamId: team.id,
        userId: userId,
        role: 'admin'
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

  redirect(
    `/settings/teams/${team.publicId}`,
    {
      type: 'success',
      message: m.teams.create.success
    },
    event
  );
};

export const actions: Actions = { createTeam };
