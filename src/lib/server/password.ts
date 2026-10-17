import { and, eq, ne } from 'drizzle-orm';

import { Session } from '#lib/db/models/index.ts';
import { auth } from '#lib/server/auth.ts';
import db from '#lib/server/database.ts';

export async function updateCredentialPassword(userId: string, password: string, currentSessionToken: string) {
  const authContext = await auth.$context;
  const passwordHash = await authContext.password.hash(password);

  await authContext.internalAdapter.updatePassword(userId, passwordHash);
  await db.delete(Session).where(and(eq(Session.userId, userId), ne(Session.token, currentSessionToken)));
}
