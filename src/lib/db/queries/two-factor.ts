import { eq } from 'drizzle-orm';

import { TwoFactor, User } from '$lib/db/models';
import db from '$lib/server/database';

export async function getTwoFactorByUserId(userId: string): Promise<TwoFactor | undefined> {
  const [twoFactor] = await db.select().from(TwoFactor).where(eq(TwoFactor.userId, userId)).limit(1);
  return twoFactor;
}

export async function hasEnabledTwoFactorByUserId(userId: string): Promise<boolean> {
  const [user] = await db
    .select({ twoFactorEnabled: User.twoFactorEnabled })
    .from(User)
    .where(eq(User.id, userId))
    .limit(1);
  const twoFactor = await getTwoFactorByUserId(userId);

  return !!user?.twoFactorEnabled && twoFactor?.verified === true;
}
