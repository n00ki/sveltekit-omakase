// Env Variables
import { PUBLIC_BASE_URL } from '$env/static/public';

// Types
import type { Action, Actions } from '@sveltejs/kit';

// Utils
import { redirect } from 'sveltekit-flash-message/server';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/client';
import { setFormFail, setFormError } from '$lib/utils/helpers/forms';
import { and, eq } from 'drizzle-orm';
import { Emails, sendEmail } from '$lib/utils/mail/mailer';
import * as m from '$lib/utils/messages.json';

// Schemas
import {
  createAccountInviteSchema,
  editAccountSchema,
  leaveAccountSchema,
  deleteAccountSchema
} from '$lib/validations/account';

// Database
import db from '$lib/server/database';
import { Account, UsersAccounts } from '$models/account';
import { Invite } from '$models/invite';
import {
  getAccountByPublicIdWithRelationsQuery,
  type GetAccountByPublicIdWithRelations
} from '$queries/account';

export const load = async (event) => {
  // redirect to `/` if logged in
  if (!event.locals.user) redirect(302, '/');

  const account = (await getAccountByPublicIdWithRelationsQuery.execute({
    publicId: event.params.accountPublicId
  })) as GetAccountByPublicIdWithRelations;

  if (!account) {
    redirect('/', { type: 'error', message: m.accounts.notFound }, event);
  }

  if (!account.members.find((m) => m.userId === event.locals.user?.id)) {
    redirect('/', { type: 'error', message: m.accounts.unauthorized }, event);
  }

  const createAccountInviteForm = await superValidate(
    { accountId: account.id },
    zod(createAccountInviteSchema),
    {
      id: 'create-account-invite-form',
      errors: false
    }
  );

  const editAccountForm = await superValidate(
    { accountId: account.id, name: account.name },
    zod(editAccountSchema),
    {
      id: 'edit-account-form',
      errors: false
    }
  );

  const leaveAccountForm = await superValidate(zod(leaveAccountSchema), {
    id: 'leave-account-form'
  });

  const deleteAccountForm = await superValidate(
    { accountId: account.id },
    zod(deleteAccountSchema),
    {
      id: 'delete-account-form',
      errors: false
    }
  );

  return {
    metadata: {
      title: account.name
    },
    account,
    createAccountInviteForm,
    editAccountForm,
    leaveAccountForm,
    deleteAccountForm
  };
};

const createAccountInvite: Action = async (event) => {
  const createAccountInviteForm = await superValidate(
    event.request,
    zod(createAccountInviteSchema)
  );

  if (!createAccountInviteForm.valid) {
    return setFormFail(createAccountInviteForm);
  }

  const { accountId, email } = createAccountInviteForm.data;

  if (accountId && email) {
    if (email === event.locals.user?.email) {
      return setFormError(createAccountInviteForm, m.accounts.invite.send.alreadyMember, {
        status: 500,
        field: 'email'
      });
    }

    try {
      const invite = await db
        .insert(Invite)
        .values({
          accountId: accountId,
          email: email,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 168)
        })
        .returning();

      const inviteUrl = `${PUBLIC_BASE_URL}/api/invites?account=${accountId}&token=${invite[0].token}`;
      try {
        sendEmail(email, Emails.AccountInvite, {
          url: inviteUrl,
          invitedBy: event.locals.user?.firstName + ' ' + event.locals.user?.lastName
        });
      } catch (e) {
        console.log(e);
      }
    } catch (error) {
      console.log(error);

      return setFormError(createAccountInviteForm, m.general.error, {
        status: 500
      });
    }

    redirect(
      { type: 'success', message: `Invite sent to ${email}! Check back to see when they join.` },
      event
    );
  }
};

const editAccount: Action = async (event) => {
  const editAccountForm = await superValidate(event.request, zod(editAccountSchema));

  if (!editAccountForm.valid) {
    return setFormFail(editAccountForm);
  }

  const { accountId, name } = editAccountForm.data;

  if (accountId && name) {
    try {
      await db.update(Account).set({ name: name }).where(eq(Account.id, accountId));
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

    redirect({ type: 'success', message: m.accounts.edit.success }, event);
  }
};

const leaveAccount: Action = async (event) => {
  const leaveAccountForm = await superValidate(event.request, zod(leaveAccountSchema));

  if (!leaveAccountForm.valid) {
    return setFormFail(leaveAccountForm);
  }

  const { accountId, userId } = leaveAccountForm.data;

  try {
    await db
      .delete(UsersAccounts)
      .where(and(eq(UsersAccounts.accountId, accountId), eq(UsersAccounts.userId, Number(userId))));
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

  redirect('/settings/accounts', { type: 'success', message: m.accounts.leave.success }, event);
};

const deleteAccount: Action = async (event) => {
  const deleteAccountForm = await superValidate(event.request, zod(deleteAccountSchema));

  if (!deleteAccountForm.valid) {
    return setFormFail(deleteAccountForm);
  }

  const { accountId } = deleteAccountForm.data;

  if (accountId) {
    try {
      await db.delete(Account).where(eq(Account.id, accountId));
    } catch (error) {
      console.log(error);

      return setFormError(deleteAccountForm, m.general.error, {
        status: 500
      });
    }

    redirect('/settings/accounts', { type: 'success', message: m.accounts.delete.success }, event);
  }
};

export const actions: Actions = { createAccountInvite, editAccount, leaveAccount, deleteAccount };
