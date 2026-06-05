import type { RequestHandler } from './$types';

import { redirect } from '@sveltejs/kit';

export const GET: RequestHandler = () => {
  redirect(308, '/settings/security');
};
