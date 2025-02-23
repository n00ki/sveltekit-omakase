// Types
import type { PreparedQueryConfig } from 'drizzle-orm/sqlite-core';
import type { SQLitePreparedQuery } from 'drizzle-orm/sqlite-core';

// Utils
import { eq, sql } from 'drizzle-orm';

// Database
import db from '$lib/server/database';
import { Account } from '$models/account';
import { User } from '$models/user';

// SELECT * FROM accounts
export const getAccounts = db.query.Account.findMany();

export const getAccountsQuery: SQLitePreparedQuery<PreparedQueryConfig> = getAccounts.prepare();
export type GetAccounts = Awaited<ReturnType<typeof getAccounts.execute>>;

// SELECT * FROM accounts WHERE id = ?
export const getAccountById = db.query.Account.findFirst({
  where: eq(Account.id, sql.placeholder('id'))
});

export const getAccountByIdQuery: SQLitePreparedQuery<PreparedQueryConfig> =
  getAccountById.prepare();
export type GetAccountById = Awaited<ReturnType<typeof getAccountById.execute>>;

// SELECT * FROM accounts WHERE public_id = ?
export const getAccountByPublicId = db.query.Account.findFirst({
  where: eq(Account.publicId, sql.placeholder('publicId'))
});

export const getAccountByPublicIdQuery: SQLitePreparedQuery<PreparedQueryConfig> =
  getAccountByPublicId.prepare();
export type GetAccountByPublicId = Awaited<ReturnType<typeof getAccountByPublicId.execute>>;

// SELECT * FROM accounts WHERE name = ?
const getAccountByName = db.query.Account.findFirst({
  where: eq(Account.name, sql.placeholder('name'))
});

export const getAccountByNameQuery: SQLitePreparedQuery<PreparedQueryConfig> =
  getAccountByName.prepare();
export type GetAccountByName = Awaited<ReturnType<typeof getAccountByName.execute>>;

// SELECT * FROM accounts public_id = ? WITH Relations
const getAccountByPublicIdWithRelations = db.query.Account.findFirst({
  where: eq(Account.publicId, sql.placeholder('publicId')),
  with: {
    members: {
      with: {
        user: true
      },
      orderBy: (members, { desc }) => [desc(members.joinedAt)]
    },
    invites: true
  }
});

export const getAccountByPublicIdWithRelationsQuery: SQLitePreparedQuery<PreparedQueryConfig> =
  getAccountByPublicIdWithRelations.prepare();
export type GetAccountByPublicIdWithRelations = Awaited<
  ReturnType<typeof getAccountByPublicIdWithRelations.execute>
>;

// SELECT * FROM UsersAccounts WHERE user id = ?
export const getAccountsByUserId = db.query.User.findFirst({
  where: eq(User.id, sql.placeholder('id')),
  columns: {},
  with: {
    userAccounts: {
      columns: {},
      with: {
        account: {
          with: {
            members: {
              with: {
                user: true
              }
            },
            invites: true
          }
        }
      }
    }
  }
});

export const getAccountsByUserIdQuery: SQLitePreparedQuery<PreparedQueryConfig> =
  getAccountsByUserId.prepare();
export type GetAccountsByUserId = Awaited<ReturnType<typeof getAccountsByUserId.execute>>;
