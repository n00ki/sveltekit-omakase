import { text, integer, index, sqliteTable } from 'drizzle-orm/sqlite-core';
import { sql, relations } from 'drizzle-orm';
import { generateToken } from '../../utils/helpers/generate';

import { Team } from './team';

export const Invite = sqliteTable(
  'invites',
  {
    id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
    teamId: integer('team_id')
      .notNull()
      .references(() => Team.id, { onDelete: 'cascade' }),
    email: text().notNull(),
    token: text()
      .notNull()
      .unique()
      .$default(() => generateToken()),
    status: text({ enum: ['pending', 'accepted', 'expired'] })
      .notNull()
      .default('pending'),
    expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`)
  },
  (Invite) => {
    return {
      teamIdIdx: index('invites_team_id').on(Invite.teamId),
      emailIdx: index('invites_email').on(Invite.email)
    };
  }
);

export type Invite = typeof Invite.$inferSelect;

export const InviteRelations = relations(Invite, ({ one }) => ({
  team: one(Team, {
    fields: [Invite.teamId],
    references: [Team.id]
  })
}));
