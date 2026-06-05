import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

import { generatePublicId, generateUUIDv7 } from '../../utils/generate';

export const User = sqliteTable(
  'user',
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => generateUUIDv7()),
    publicId: text()
      .$defaultFn(() => generatePublicId())
      .unique(),
    email: text().notNull().unique(),
    emailVerified: integer({ mode: 'boolean' }).notNull().default(false),
    name: text().notNull(),
    image: text(),
    createdAt: integer({ mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer({ mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdateFn(() => new Date())
  },
  (User) => [uniqueIndex('public_id_index').on(User.publicId)]
);
