import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { User } from './user';

export const Session = sqliteTable('session', {
  id: integer().primaryKey({ autoIncrement: true }),
  token: text().notNull().unique(),
  createdAt: integer({ mode: 'timestamp' }).notNull(),
  updatedAt: integer({ mode: 'timestamp' }).notNull(),
  expiresAt: integer({ mode: 'timestamp' }).notNull(),
  ipAddress: text(),
  userAgent: text(),
  userId: text()
    .notNull()
    .references(() => User.id, { onDelete: 'cascade' })
});
