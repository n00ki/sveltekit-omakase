import type { Handle } from '@sveltejs/kit';
import { auth } from '$lib/server/auth';
import { sequence } from '@sveltejs/kit/hooks';
import { themes } from '$lib/utils/themes';

const handleAuth: Handle = async ({ event, resolve }) => {
  event.locals.auth = auth.handleRequest(event);
  return await resolve(event);
};

const handleTheme: Handle = async ({ event, resolve }) => {
  const theme = event.cookies.get('theme') ?? themes.default;
  event.locals.theme = theme;

  return await resolve(event, {
    transformPageChunk: ({ html }) => html.replace('%theme%', String(theme))
  });
};

export const handle: Handle = sequence(handleAuth, handleTheme);
