import { text, integer, primaryKey, sqliteTable } from 'drizzle-orm/sqlite-core';
import { sql, relations } from 'drizzle-orm';
import { generateNanoId } from '../../utils/helpers/generate';

import { User } from './user';
import { Invite } from './invite';

export const Account = sqliteTable('accounts', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  publicId: text('public_id')
    .notNull()
    .unique()
    .$default(() => generateNanoId()),
  type: text({ enum: ['personal', 'team'] })
    .notNull()
    .default('team'),
  name: text().notNull(),
  avatar: text(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
});

export const AccountRelations = relations(Account, ({ many }) => ({
  members: many(UsersAccounts),
  invites: many(Invite)
}));

export const UsersAccounts = sqliteTable(
  'users_accounts',
  {
    accountId: integer('account_id')
      .notNull()
      .references(() => Account.id, { onDelete: 'cascade' }),
    userId: integer('user_id')
      .notNull()
      .references(() => User.id),
    role: text({ enum: ['admin', 'member'] })
      .notNull()
      .default('member'),
    joinedAt: integer('joined_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`)
  },
  (t) => ({
    pk: primaryKey({ columns: [t.accountId, t.userId] })
  })
);

export const UsersAccountsRelations = relations(UsersAccounts, ({ one }) => ({
  account: one(Account, {
    fields: [UsersAccounts.accountId],
    references: [Account.id]
  }),
  user: one(User, {
    fields: [UsersAccounts.userId],
    references: [User.id]
  })
}));

export type Account = typeof Account.$inferSelect;
export type AccountWithRelations = Account & {
  members: (typeof UsersAccounts.$inferSelect)[];
} & { invites: Invite[] };
