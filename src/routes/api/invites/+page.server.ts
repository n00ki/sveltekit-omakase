// Utils
import { redirect } from 'sveltekit-flash-message/server';
import { eq, and, ne } from 'drizzle-orm';
import * as m from '$lib/utils/messages.json';

// Database
import db from '$lib/server/database';
import { Invite } from '$models/invite';
import { UsersTeams } from '$models/team';

export async function load(event) {
  if (!event.locals.user) {
    redirect('/login', { type: 'error', message: m.teams.invite.receive.mustLogin }, event);
  }

  const teamIdParam = event.url.searchParams.get('team');
  const inviteToken = event.url.searchParams.get('token');

  if (!inviteToken || !teamIdParam) {
    redirect('/', { type: 'error', message: m.teams.invite.receive.invalidUrl }, event);
  }

  const teamId = parseInt(teamIdParam);

  const invite = await db.query.Invite.findFirst({
    where: eq(Invite.teamId, teamId) && eq(Invite.token, inviteToken)
  });

  if (!invite) {
    redirect('/', { type: 'error', message: m.teams.invite.receive.invalidUrl }, event);
  }

  if (invite.email !== event.locals.user?.email) {
    redirect('/', { type: 'error', message: m.teams.invite.receive.invalidUrl }, event);
  }

  if (invite.status !== 'pending') {
    redirect('/', { type: 'error', message: m.teams.invite.receive.claimed }, event);
  }

  if (invite.expiresAt < new Date(Date.now())) {
    await db.update(Invite).set({ status: 'expired' }).where(eq(Invite.id, invite.id));

    redirect('/', { type: 'error', message: m.teams.invite.receive.expiredUrl }, event);
  }

  try {
    const addUserToTeam = await db.insert(UsersTeams).values({
      teamId: invite.teamId,
      userId: event.locals.user?.id,
      role: 'member',
      joinedAt: new Date(Date.now())
    });

    if (addUserToTeam) {
      // Mark the current invite as accepted
      await db
        .update(Invite)
        .set({
          status: 'accepted'
        })
        .where(eq(Invite.id, invite.id));

      // Expire any other pending invites for the same team and email
      await db
        .update(Invite)
        .set({
          status: 'expired'
        })
        .where(
          and(
            eq(Invite.teamId, invite.teamId),
            eq(Invite.email, invite.email),
            eq(Invite.status, 'pending'),
            ne(Invite.id, invite.id)
          )
        );
    }
  } catch (error) {
    console.log(error);
    redirect(
      '/',
      {
        status: 500,
        type: 'error',
        message: m.general.error
      },
      event
    );
  }

  redirect(
    '/settings/teams',
    {
      type: 'success',
      message: m.teams.invite.receive.success
    },
    event
  );
}
