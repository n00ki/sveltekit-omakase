import { load as loadFlash } from 'sveltekit-flash-message/server';

export async function load(event) {
  return {
    ...loadFlash(event),
    user: event.locals.user,
    session: event.locals.session
  };
}
