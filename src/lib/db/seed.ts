import { config } from 'dotenv';
import db from '$lib/server/database';

import { User } from '$models/user';
import { Account, UsersAccounts } from '$models/account';

import { userFactory } from './factories/userFactory';
import { accountFactory } from './factories/accountFactory';
import { userAccountsFactory } from './factories/userAccountsFactory';

async function seed() {
  config();

  if (process.env.NODE_ENV === 'production') {
    console.error('Seed script should not be run in production!');
    process.exit(1);
  }

  console.log(`🌱 Seeding the database with 100 users and 100 accounts...`);

  const users = await userFactory(100);
  const accounts = await accountFactory(100);
  const userAccounts = await userAccountsFactory(users, accounts);

  try {
    await db.batch([
      db.insert(User).values(users),
      db.insert(Account).values(accounts),
      db.insert(UsersAccounts).values(userAccounts)
    ]);

    console.log('Database seeded.');
  } catch (error) {
    console.error('Error seeding the database:', error);
    process.exit(1);
  }
}

seed();
