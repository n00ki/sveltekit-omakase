import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { generateUUIDv7 } from '../../utils/helpers/generate';
import { User } from './user';

export const Session = sqliteTable('session', {
  id: text()
    .primaryKey()
    .$defaultFn(() => generateUUIDv7()),
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
