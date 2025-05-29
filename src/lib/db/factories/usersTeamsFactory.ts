import type { User } from '$lib/db/models/user';
import type { Team } from '$lib/db/models/team';
import { faker } from '@faker-js/faker';

export const usersTeamsFactory = async (users: User[], teams: Team[]) => {
  return Array.from({ length: users.length }, (_, index) => ({
    userId: users[index].id,
    teamId: teams[index].id,
    role: faker.helpers.arrayElement(['admin', 'member'])
  }));
};
