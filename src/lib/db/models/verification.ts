import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { generateUUIDv7 } from '../../utils/helpers/generate';

export const Verification = sqliteTable('verification', {
  id: text()
    .primaryKey()
    .$defaultFn(() => generateUUIDv7()),
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: integer().notNull(),
  createdAt: integer({ mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer({ mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date())
});

export type verification = typeof Verification.$inferSelect;
