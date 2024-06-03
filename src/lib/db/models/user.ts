import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import { sql, relations } from 'drizzle-orm';

import { UsersAccounts } from './account';

export const User = sqliteTable('users', {
  id: text('id').notNull().primaryKey(),
  email: text('email').unique(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  hashedPassword: text('hashed_password'),
  avatar: text('avatar'),
  admin: integer('admin', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
});

export const UserRelations = relations(User, ({ many }) => ({
  userAccounts: many(UsersAccounts)
}));
