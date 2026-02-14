import { and, eq, isNull, or } from 'drizzle-orm';

import { Account, User } from '$lib/db/models';
import db from '$lib/server/database';

export async function hasCredentialAccountByUserId(userId: string): Promise<boolean> {
  const credentialAccount = await db
    .select({ id: Account.id })
    .from(Account)
    .where(and(eq(Account.userId, userId), eq(Account.providerId, 'credential')))
    .limit(1);

  return credentialAccount.length > 0;
}

export async function setUserAvatarFromOAuth(userId: string, avatar: string): Promise<void> {
  await db
    .update(User)
    .set({ avatar })
    // Keep user-selected avatars intact.
    .where(and(eq(User.id, userId), or(isNull(User.avatar), eq(User.avatar, ''))));
}
