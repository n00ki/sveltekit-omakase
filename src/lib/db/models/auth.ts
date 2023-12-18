import { pgTable, pgEnum, bigint, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';

export const role = pgEnum('role', ['ADMIN', 'MEMBER']);

export const users = pgTable(
  'users',
  {
    id: text('id').primaryKey(),
    email: text('email').unique(),
    role: text('role', { enum: ['ADMIN', 'MEMBER'] })
      .notNull()
      .default('MEMBER'),
    avatar: text('avatar'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
  },
  (users) => {
    return {
      emailIdx: uniqueIndex('email_idx').on(users.email)
    };
  }
);

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  activeExpires: bigint('active_expires', { mode: 'number' }).notNull(),
  idleExpires: bigint('idle_expires', { mode: 'number' }).notNull()
});

export const keys = pgTable('keys', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  hashedPassword: text('hashed_password')
});

export const tokens = pgTable(
  'tokens',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' })
      .unique(),
    expiresAt: timestamp('expires_at').notNull()
  },
  (tokens) => {
    return {
      userIdIdx: uniqueIndex('user_id_idx').on(tokens.userId)
    };
  }
);
