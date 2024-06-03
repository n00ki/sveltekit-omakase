import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';

import { User } from './user';

export const Session = sqliteTable('sessions', {
  id: text('id').notNull().primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => User.id),
  expiresAt: integer('expires_at').notNull()
});
