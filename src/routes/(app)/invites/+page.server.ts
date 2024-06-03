// Utils
import { redirect } from 'sveltekit-flash-message/server';
import { eq } from 'drizzle-orm';
import * as m from '$lib/utils/messages.json';

// Database
import db from '$lib/server/database';
import { Invite } from '$models/invite';
import { UsersAccounts } from '$models/account';

export const load = async (event) => {
  if (!event.locals.user) {
    redirect('/login', { type: 'error', message: m.accounts.invite.receive.mustLogin }, event);
  }

  const accountId = event.url.searchParams.get('account');
  const inviteToken = event.url.searchParams.get('token');
  if (!inviteToken || !accountId) {
    redirect('/', { type: 'error', message: m.accounts.invite.receive.invalidUrl }, event);
  }

  const invite = await db.query.Invite.findFirst({
    where: eq(Invite.accountId, parseInt(accountId)) && eq(Invite.token, inviteToken)
  });

  if (!invite) {
    redirect('/', { type: 'error', message: m.accounts.invite.receive.invalidUrl }, event);
  }

  if (invite.email !== event.locals.user?.email) {
    redirect('/', { type: 'error', message: m.accounts.invite.receive.invalidUrl }, event);
  }

  if (invite.status !== 'pending') {
    redirect('/', { type: 'error', message: m.accounts.invite.receive.claimed }, event);
  }

  if (invite.expiresAt < new Date(Date.now())) {
    await db.update(Invite).set({ status: 'expired' }).where(eq(Invite.id, invite.id));

    redirect('/', { type: 'error', message: m.accounts.invite.receive.expiredUrl }, event);
  }

  try {
    const addUserToAccount = await db.insert(UsersAccounts).values({
      accountId: invite.accountId,
      userId: event.locals.user?.id,
      role: 'member',
      joinedAt: new Date(Date.now())
    });

    if (addUserToAccount) {
      await db
        .update(Invite)
        .set({
          status: 'accepted'
        })
        .where(eq(Invite.id, invite.id));
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
    '/settings/accounts',
    {
      type: 'success',
      message: m.accounts.invite.receive.success
    },
    event
  );
};
