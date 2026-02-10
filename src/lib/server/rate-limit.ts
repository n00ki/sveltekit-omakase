import { getRequestEvent } from '$app/server';

import { error, invalid } from '@sveltejs/kit';
import { RetryAfterRateLimiter } from 'sveltekit-rate-limiter/server';

const limiter = new RetryAfterRateLimiter({
  IP: [100, 'h'],
  IPUA: [10, 'm']
});

/**
 * Check rate limit and show error if limited.
 * Call this at the start of any remote function that needs rate limiting.
 *
 * @param issueField - Optional field issue function to show error on specific form field.
 *                     If not provided, throws a 429 error.
 */
export async function checkRateLimit(issueField?: (message: string) => { message: string }): Promise<void> {
  const event = getRequestEvent();
  const status = await limiter.check(event);

  if (status.limited) {
    const message = `Too many attempts. Try again in ${status.retryAfter} seconds.`;

    if (issueField) {
      invalid(issueField(message));
    }

    error(429, message);
  }
}
