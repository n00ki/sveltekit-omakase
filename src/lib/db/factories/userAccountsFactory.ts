import type { User } from '$lib/db/models/user';
import type { Account } from '$lib/db/models/account';
import { faker } from '@faker-js/faker';

export const userAccountsFactory = async (users: User[], accounts: Account[]) => {
  return Array.from({ length: users.length }, (_, index) => ({
    userId: users[index].id,
    accountId: accounts[index].id,
    role: faker.helpers.arrayElement(['admin', 'member'])
  }));
};
