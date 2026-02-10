import { getRequestEvent } from '$app/server';

import { error } from '@sveltejs/kit';

import * as m from '$lib/messages';

type VisibilityResource = {
  visibility: 'public' | 'private';
};

/**
 * Throws 404 if resource is private.
 * Use for resources that must be publicly visible.
 */
export function requirePublic(resource: VisibilityResource): void {
  if (resource.visibility === 'private') {
    error(404, m.general.notFound);
  }
}

/**
 * Throws 403 if user doesn't own the resource.
 * Use for actions that require ownership (update, delete).
 */
export function requireOwner(ownerId: string): void {
  const { locals } = getRequestEvent();

  if (!locals.user || locals.user.id !== ownerId) {
    error(403, m.general.forbidden);
  }
}
