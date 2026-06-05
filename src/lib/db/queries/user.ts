import { and, eq, isNull, like, or } from 'drizzle-orm';

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

export async function setUserImageFromOAuth(userId: string, image: string): Promise<void> {
  await db
    .update(User)
    .set({ image })
    .where(
      and(
        eq(User.id, userId),
        or(isNull(User.image), eq(User.image, ''), like(User.image, 'http://%'), like(User.image, 'https://%'))
      )
    );
}
