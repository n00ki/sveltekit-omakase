import { and, eq, isNull, like, or } from 'drizzle-orm';

import { User } from '$lib/db/models';
import db from '$lib/server/database';

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
