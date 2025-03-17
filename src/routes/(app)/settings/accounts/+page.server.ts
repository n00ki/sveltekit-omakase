// Types
import { type Action, type Actions } from '@sveltejs/kit';

// Utils
import { redirect } from 'sveltekit-flash-message/server';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';
import { isRateLimited, setFormFail } from '$lib/utils/helpers/forms';
import * as m from '$lib/utils/messages.json';

// Schemas
import { createAccountSchema } from '$lib/validations/account';

// Database
import db from '$lib/server/database';
import { Account, UsersAccounts } from '$models/account';
import { getAccountsByUserIdQuery, type GetAccountsByUserId } from '$queries/account';
import {
  getUserPendingInvitesByEmailQuery,
  type GetUserPendingInvitesByEmail
} from '$queries/invite';

export const load = async (event) => {
  const getUserAccounts = (await getAccountsByUserIdQuery.execute({
    id: event.locals.user!.id
  })) as GetAccountsByUserId;

  const getUserPendingInvites = (await getUserPendingInvitesByEmailQuery.execute({
    email: event.locals.user!.email
  })) as GetUserPendingInvitesByEmail;

  const uniqueAccountInvites = getUserPendingInvites.reduce((unique, invite) => {
    const existingInvite = unique.find((i) => i.accountId === invite.accountId);
    if (!existingInvite) {
      unique.push(invite);
    }
    return unique;
  }, [] as GetUserPendingInvitesByEmail);

  const form = await superValidate(zod(createAccountSchema));

  return {
    metadata: {
      title: 'Team Accounts'
    },
    form,
    userAccounts: getUserAccounts?.userAccounts,
    pendingInvites: uniqueAccountInvites
  };
};

const createAccount: Action = async (event) => {
  const createAccountForm = await superValidate(event.request, zod(createAccountSchema));

  await isRateLimited(createAccountForm, event, { field: 'name' });

  if (!createAccountForm.valid) {
    return setFormFail(createAccountForm);
  }

  const { userId, name } = createAccountForm.data;
  let account: Account;

  try {
    const createAccount = await db
      .insert(Account)
      .values({
        name
      })
      .returning();

    account = createAccount[0];

    if (account) {
      await db.insert(UsersAccounts).values({
        accountId: account.id,
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
    `/settings/accounts/${account.publicId}`,
    {
      type: 'success',
      message: m.accounts.create.success
    },
    event
  );
};

export const actions: Actions = { createAccount };
