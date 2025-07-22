import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';

export const Verification = sqliteTable('verification', {
  id: integer().primaryKey({ autoIncrement: true }),
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
