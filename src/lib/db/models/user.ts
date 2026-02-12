import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

import { generateNanoId, generateUUIDv7 } from '../../utils/generate';

export const User = sqliteTable(
  'user',
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => generateUUIDv7()),
    publicId: text()
      .$defaultFn(() => generateNanoId())
      .unique(),
    email: text().notNull().unique(),
    emailVerified: integer({ mode: 'boolean' }).notNull().default(false),
    firstName: text().notNull(),
    lastName: text().notNull(),
    name: text().notNull(),
    avatar: text(),
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
