import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';

import { User } from './user';

export const Session = sqliteTable('sessions', {
  id: text().notNull().primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => User.id),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

export type SessionType = typeof Session.$inferSelect;
