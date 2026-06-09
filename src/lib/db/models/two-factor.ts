import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { generateUUIDv7 } from '../../utils/generate';
import { User } from './user';

export const TwoFactor = sqliteTable(
  'two_factor',
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => generateUUIDv7()),
    secret: text().notNull(),
    backupCodes: text().notNull(),
    userId: text()
      .notNull()
      .references(() => User.id, { onDelete: 'cascade' }),
    verified: integer({ mode: 'boolean' }).notNull().default(false)
  },
  (TwoFactor) => [index('two_factor_user_id_index').on(TwoFactor.userId)]
);

export type TwoFactor = typeof TwoFactor.$inferSelect;
