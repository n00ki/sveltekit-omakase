import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import { generateNanoId } from '../../utils/helpers/nanoid';

import { User } from './user';

export const Token = sqliteTable('tokens', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  key: text()
    .notNull()
    .unique()
    .$default(() => generateNanoId({ token: true })),
  userId: text('user_id')
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
