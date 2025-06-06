import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import { generateNanoId } from '../../utils/helpers/generate';

import { UsersTeams } from './team';

export const User = sqliteTable('user', {
  id: integer().notNull().primaryKey({ autoIncrement: true }),
  publicId: text()
    .notNull()
    .$default(() => generateNanoId())
    .unique(),
  email: text().unique(),
  googleId: integer().unique(),
  firstName: text().notNull(),
  lastName: text().notNull(),
  hashedPassword: text(),
  avatar: text(),
  admin: integer({ mode: 'boolean' }).notNull().default(false),
  createdAt: integer()
    .notNull()
    .$default(() => Date.now()),
  updatedAt: integer()
    .notNull()
    .$default(() => Date.now())
    .$onUpdate(() => Date.now())
});

export type User = typeof User.$inferSelect;

export const UserRelations = relations(User, ({ many }) => ({
  userTeams: many(UsersTeams)
}));
