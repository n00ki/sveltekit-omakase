import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import { generateToken } from '../../utils/helpers/generate';

import { User } from './user';

export const Token = sqliteTable('tokens', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  key: text()
    .notNull()
    .unique()
    .$default(() => generateToken()),
  userId: integer('user_id')
    .references(() => User.id, { onDelete: 'cascade' })
    .unique(),
  expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull()
});

export type Token = typeof Token.$inferSelect;

export const TokenRelations = relations(Token, ({ one }) => ({
  user: one(User, {
    fields: [Token.userId],
    references: [User.id]
  })
}));
