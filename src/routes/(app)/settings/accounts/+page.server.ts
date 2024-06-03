// Types
import { type Action, type Actions } from '@sveltejs/kit';

// Utils
import { redirect } from 'sveltekit-flash-message/server';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';
import { setFormFail } from '$lib/utils/helpers/forms';
import * as m from '$lib/utils/messages.json';

// Schemas
import { createAccountSchema } from '$lib/validations/account';

// Database
import db from '$lib/server/database';
import { Account, UsersAccounts } from '$models/account';
import { getAccountsByUserIdQuery, type GetAccountsByUserId } from '$queries/account';

export const load = async (event) => {
  const getUserAccounts = (await getAccountsByUserIdQuery.execute({
    id: event.locals.user!.id
  })) as GetAccountsByUserId;

  const form = await superValidate(zod(createAccountSchema));

  return {
    metadata: {
      title: 'Team Accounts'
    },
    userAccounts: getUserAccounts?.userAccounts,
    form
  };
};

const createAccount: Action = async (event) => {
  const createAccountForm = await superValidate(event.request, zod(createAccountSchema));

  if (!createAccountForm.valid) {
    return setFormFail(createAccountForm);
  }

  const { userId, name } = createAccountForm.data;

  try {
    const createAccount = await db
      .insert(Account)
      .values({
        name
      })
      .returning();

    const account = createAccount[0];

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
    {
      type: 'success',
      message: m.accounts.create.success
    },
    event
  );
};

export const actions: Actions = { createAccount };
