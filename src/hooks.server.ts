import type { Handle } from '@sveltejs/kit';
import { auth } from '$lib/server/auth';
import { sequence } from '@sveltejs/kit/hooks';
import { themes } from '$lib/utils/themes';

const handleAuth: Handle = async ({ event, resolve }) => {
  const sessionId = event.cookies.get(auth.sessionCookieName);
  if (!sessionId) {
    event.locals.user = null;
    event.locals.session = null;
    return resolve(event);
  }

  const { session, user } = await auth.validateSession(sessionId);
  if (session && session.fresh) {
    const sessionCookie = auth.createSessionCookie(session.id);
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: '.',
      ...sessionCookie.attributes
    });
  }
  if (!session) {
    const sessionCookie = auth.createBlankSessionCookie();
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: '.',
      ...sessionCookie.attributes
    });
  }
  event.locals.user = user;
  event.locals.session = session;
  return resolve(event);
};

const handleTheme: Handle = async ({ event, resolve }) => {
  const theme = event.cookies.get('theme') ?? themes.default;
  event.locals.theme = theme;

  return await resolve(event, {
    transformPageChunk: ({ html }) => html.replace('%theme%', String(theme))
  });
};

export const handle: Handle = sequence(handleAuth, handleTheme);
