import { text, integer, primaryKey, sqliteTable } from 'drizzle-orm/sqlite-core';
import { sql, relations } from 'drizzle-orm';
import { generateNanoId } from '../../utils/helpers/generate';

import { User } from './user';
import { Invite } from './invite';

export const Team = sqliteTable('teams', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  publicId: text('public_id')
    .notNull()
    .unique()
    .$default(() => generateNanoId()),
  name: text('name').notNull(),
  avatar: text('avatar'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
});

export const TeamRelations = relations(Team, ({ many }) => ({
  members: many(UsersTeams),
  invites: many(Invite)
}));

export const UsersTeams = sqliteTable(
  'users_teams',
  {
    teamId: integer('team_id')
      .notNull()
      .references(() => Team.id, { onDelete: 'cascade' }),
    userId: integer('user_id')
      .notNull()
      .references(() => User.id),
    role: text({ enum: ['admin', 'member'] })
      .notNull()
      .default('member'),
    joinedAt: integer('joined_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`)
  },
  (t) => ({
    pk: primaryKey({ columns: [t.teamId, t.userId] })
  })
);

export const UsersTeamsRelations = relations(UsersTeams, ({ one }) => ({
  team: one(Team, {
    fields: [UsersTeams.teamId],
    references: [Team.id]
  }),
  user: one(User, {
    fields: [UsersTeams.userId],
    references: [User.id]
  })
}));

export type Team = typeof Team.$inferSelect;
export type TeamWithRelations = Team & {
  members: (typeof UsersTeams.$inferSelect)[];
} & { invites: Invite[] };
