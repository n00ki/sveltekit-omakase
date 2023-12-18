import { redirect } from '@sveltejs/kit';

export const actions = {
  set: async ({ url, cookies }) => {
    const theme = url.searchParams.get('theme');
    const redirectTo = url.searchParams.get('redirect');

    if (theme) {
      cookies.set('theme', theme, {
        path: '/',
        httpOnly: false,
        maxAge: 60 * 60 * 24 * 365
      });
    }

    redirect(303, redirectTo ?? '/');
  }
};
