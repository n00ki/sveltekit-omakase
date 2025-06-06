import { text, integer, primaryKey, sqliteTable } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import { generateNanoId } from '../../utils/helpers/generate';

import { User } from './user';
import { Invite } from './invite';

export const Team = sqliteTable('team', {
  id: integer().primaryKey({ autoIncrement: true }),
  publicId: text()
    .notNull()
    .$default(() => generateNanoId())
    .unique(),
  name: text().notNull(),
  avatar: text(),
  createdAt: integer()
    .notNull()
    .$default(() => Date.now()),
  updatedAt: integer()
    .notNull()
    .$default(() => Date.now())
    .$onUpdate(() => Date.now())
});

export type Team = typeof Team.$inferSelect;

export const TeamRelations = relations(Team, ({ many }) => ({
  members: many(UsersTeams),
  invites: many(Invite)
}));

export const UsersTeams = sqliteTable(
  'users_teams',
  {
    teamId: integer()
      .notNull()
      .references(() => Team.id, { onDelete: 'cascade' }),
    userId: integer()
      .notNull()
      .references(() => User.id),
    role: text({ enum: ['admin', 'member'] })
      .notNull()
      .default('member'),
    joinedAt: integer()
      .notNull()
      .$default(() => Date.now())
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

export type TeamWithRelations = Team & {
  members: (typeof UsersTeams.$inferSelect)[];
} & { invites: Invite[] };
