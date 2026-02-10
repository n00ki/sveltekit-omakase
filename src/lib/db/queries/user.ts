import { and, eq } from 'drizzle-orm';

import { Account } from '$lib/db/models';
import db from '$lib/server/database';

export async function hasCredentialAccountByUserId(userId: string): Promise<boolean> {
  const credentialAccount = await db
    .select({ id: Account.id })
    .from(Account)
    .where(and(eq(Account.userId, userId), eq(Account.providerId, 'credential')))
    .limit(1);

  return credentialAccount.length > 0;
}
