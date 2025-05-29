import { config } from 'dotenv';
import db from '$lib/server/database';

import { User } from '$models/user';
import { Team, UsersTeams } from '$models/team';

import { userFactory } from './factories/userFactory';
import { teamFactory } from './factories/teamFactory';
import { usersTeamsFactory } from './factories/usersTeamsFactory';

async function seed() {
  config();

  if (process.env.NODE_ENV === 'production') {
    console.error('Seed script should not be run in production!');
    process.exit(1);
  }

  console.log(`🌱 Seeding the database with 100 users and 100 teams...`);

  const users = await userFactory(100);
  const teams = await teamFactory(100);
  const usersTeams = await usersTeamsFactory(users, teams);

  try {
    await db.batch([
      db.insert(User).values(users),
      db.insert(Team).values(teams),
      db.insert(UsersTeams).values(usersTeams)
    ]);

    console.log('Database seeded.');
  } catch (error) {
    console.error('Error seeding the database:', error);
    process.exit(1);
  }
}

seed();
