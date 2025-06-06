import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import { generateToken } from '../../utils/helpers/generate';

import { User } from './user';

export const Token = sqliteTable('token', {
  id: integer().primaryKey({ autoIncrement: true }),
  key: text()
    .notNull()
    .unique()
    .$default(() => generateToken()),
  userId: integer()
    .references(() => User.id, { onDelete: 'cascade' })
    .unique(),
  expiresAt: integer().notNull()
});

export type Token = typeof Token.$inferSelect;

export const TokenRelations = relations(Token, ({ one }) => ({
  user: one(User, {
    fields: [Token.userId],
    references: [User.id]
  })
}));
