import { loadFlash } from 'sveltekit-flash-message/server';

export const load = loadFlash(async (event) => {
  const theme = event.locals.theme;
  return {
    user: event.locals.user ?? null,
    theme: theme ?? null
  };
});
