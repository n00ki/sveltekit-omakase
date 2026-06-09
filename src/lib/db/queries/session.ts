import { eq } from 'drizzle-orm';

import { Session } from '$lib/db/models';
import db from '$lib/server/database';

type SessionSecurityTimestamps = {
  challengeCompletedAt: Date | null;
  createdAt: Date;
  twoFactorCompletedAt: Date | null;
};

export async function getSessionSecurityTimestampsByToken(
  sessionToken: string
): Promise<SessionSecurityTimestamps | undefined> {
  const [session] = await db
    .select({
      challengeCompletedAt: Session.challengeCompletedAt,
      createdAt: Session.createdAt,
      twoFactorCompletedAt: Session.twoFactorCompletedAt
    })
    .from(Session)
    .where(eq(Session.token, sessionToken))
    .limit(1);

  return session;
}
