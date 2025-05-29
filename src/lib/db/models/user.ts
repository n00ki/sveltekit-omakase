import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import { sql, relations } from 'drizzle-orm';

import { UsersTeams } from './team';

export const User = sqliteTable('users', {
  id: integer().notNull().primaryKey({ autoIncrement: true }),
  publicId: text('public_id').notNull(),
  email: text().unique(),
  googleId: integer('google_id').unique(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  hashedPassword: text('hashed_password'),
  avatar: text(),
  admin: integer({ mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
});

export const UserRelations = relations(User, ({ many }) => ({
  userTeams: many(UsersTeams)
}));

export type User = typeof User.$inferSelect;
