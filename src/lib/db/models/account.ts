import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { generateUUIDv7 } from '../../utils/generate';
import { User } from './user';

export const Account = sqliteTable('account', {
  id: text()
    .primaryKey()
    .$defaultFn(() => generateUUIDv7()),
  accountId: text().notNull(),
  providerId: text().notNull(),
  userId: text()
    .notNull()
    .references(() => User.id, { onDelete: 'cascade' }),
  accessToken: text(),
  refreshToken: text(),
  idToken: text(),
  accessTokenExpiresAt: integer(),
  refreshTokenExpiresAt: integer(),
  scope: text(),
  password: text(),
  createdAt: integer({ mode: 'timestamp' }).notNull(),
  updatedAt: integer({ mode: 'timestamp' }).notNull()
});

export type Account = typeof Account.$inferSelect;
