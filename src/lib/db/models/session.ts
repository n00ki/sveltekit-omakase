import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';

import { User } from './user';

export const Session = sqliteTable('session', {
  id: text().notNull().primaryKey(),
  userId: integer()
    .notNull()
    .references(() => User.id),
  expiresAt: integer().notNull()
});

export type Session = typeof Session.$inferSelect;
