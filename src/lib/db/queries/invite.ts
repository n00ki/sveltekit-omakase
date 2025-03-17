import { and } from 'drizzle-orm';
// Types
import type { PreparedQueryConfig } from 'drizzle-orm/sqlite-core';
import type { SQLitePreparedQuery } from 'drizzle-orm/sqlite-core';

// Utils
import { eq, sql } from 'drizzle-orm';

// Database
import db from '$lib/server/database';
import { Invite } from '$models/invite';

// SELECT * FROM invites WHERE email = ?
export const getUserPendingInvitesByEmail = db.query.Invite.findMany({
  where: and(eq(Invite.email, sql.placeholder('email')), eq(Invite.status, 'pending')),
  with: {
    account: {
      columns: {
        id: true,
        name: true
      }
    }
  },
  orderBy: (invites, { desc }) => [desc(invites.createdAt)]
});

export const getUserPendingInvitesByEmailQuery: SQLitePreparedQuery<PreparedQueryConfig> =
  getUserPendingInvitesByEmail.prepare();
export type GetUserPendingInvitesByEmail = Awaited<
  ReturnType<typeof getUserPendingInvitesByEmail.execute>
>;
