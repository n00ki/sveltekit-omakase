import { text, integer, index, sqliteTable } from 'drizzle-orm/sqlite-core';
import { sql, relations } from 'drizzle-orm';
import { generateNanoId } from '../../utils/helpers/nanoid';

import { Account } from './account';

export const Invite = sqliteTable(
  'invites',
  {
    id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
    accountId: integer('account_id')
      .notNull()
      .references(() => Account.id, { onDelete: 'cascade' }),
    email: text().notNull(),
    token: text()
      .notNull()
      .unique()
      .$default(() => generateNanoId({ token: true })),
    status: text({ enum: ['pending', 'accepted', 'expired'] })
      .notNull()
      .default('pending'),
    expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`)
  },
  (Invite) => {
    return {
      accountIdIdx: index('invites_account_id').on(Invite.accountId),
      emailIdx: index('invites_email').on(Invite.email)
    };
  }
);

export type Invite = typeof Invite.$inferSelect;

export const InviteRelations = relations(Invite, ({ one }) => ({
  account: one(Account, {
    fields: [Invite.accountId],
    references: [Account.id]
  })
}));
