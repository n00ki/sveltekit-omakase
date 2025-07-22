// Types
import { type NumericRange, type RequestEvent } from '@sveltejs/kit';

// Utils
import { fail } from '@sveltejs/kit';
import { RetryAfterRateLimiter } from 'sveltekit-rate-limiter/server';
import { setError, type SuperValidated } from 'sveltekit-superforms/server';
import { setFlash } from 'sveltekit-flash-message/server';

/**
 * Handles generic form failures with automatic cleanup and user feedback.
 * Provides a consistent pattern for failing forms while optionally removing sensitive data
 * and showing flash messages to users.
 *
 * @param form - SuperValidated form instance to fail
 * @param opts - Optional configuration
 * @param opts.status - HTTP status code (defaults to 400)
 * @param opts.removeSensitiveData - Field names to clear from form data
 * @param opts.event - Request event for flash message display
 * @returns SvelteKit fail response or undefined if form is invalid
 */
export const setFormFail = (
  form: SuperValidated<Record<string, unknown>>,
  opts?: {
    status?: NumericRange<400, 599>;
    removeSensitiveData?: string[];
    event?: RequestEvent;
  }
) => {
  if (!form) return;
  if (opts?.removeSensitiveData) {
    for (const field of opts.removeSensitiveData) {
      if (form.data[field]) {
        form.data[field] = '';
      }
    }
  }

  if (opts?.event)
    setFlash(
      {
        type: 'error',
        message: 'Something went wrong. Please try again later.'
      },
      opts.event
    );

  return fail(opts?.status ?? 400, { form });
};

/**
 * Sets field-specific form errors with automatic cleanup and user feedback.
 * Coordinates SuperForms field errors with flash messages for comprehensive error handling.
 *
 * @param form - SuperValidated form instance
 * @param text - Error message to display
 * @param opts - Optional configuration
 * @param opts.status - HTTP status code (defaults to 400)
 * @param opts.field - Specific field to attach error to
 * @param opts.removeSensitiveData - Field names to clear from form data
 * @param event - Request event for flash message display
 * @returns SuperValidated form with error set or undefined
 */
export const setFormError = (
  form: SuperValidated<Record<string, unknown>>,
  text: string,
  opts?: {
    status?: NumericRange<400, 599>;
    field?: string;
    removeSensitiveData?: string[];
  },
  event?: RequestEvent
) => {
  if (!form) return;

  if (opts?.removeSensitiveData) {
    for (const field of opts.removeSensitiveData) {
      if (form.data[field]) {
        form.data[field] = '';
      }
    }
  }

  if (event) setFlash({ type: 'error', message: text }, event);
  if (opts?.field) return setError(form, opts?.field, text, { status: opts?.status ?? 400 });
};

/**
 * Form submission rate limiter to prevent abuse.
 * Uses IP and User-Agent combination for granular control.
 */
const limiter = new RetryAfterRateLimiter({
  IP: [10, 'h'], // 10 allowed requests per hour for a specific IP
  IPUA: [5, 'm'] // 5 allowed requests per minute for a specific IP and User-Agent
});

/**
 * Checks if current request exceeds rate limits and handles the error automatically.
 * Integrates rate limiting directly into form validation flow with user-friendly messages.
 *
 * @param form - SuperValidated form instance
 * @param event - Request event containing IP and User-Agent
 * @param opts - Configuration options
 * @param opts.field - Field to attach rate limit error to
 * @param opts.removeSensitiveData - Field names to clear from form data
 * @returns Form error response if rate limited, undefined otherwise
 */
export const isRateLimited = async (
  form: SuperValidated<Record<string, unknown>>,
  event: RequestEvent,
  opts: { field: string; removeSensitiveData?: string[] }
) => {
  const status = await limiter.check(event);
  if (status.limited) {
    return setFormError(
      form,
      status.retryAfter <= 60
        ? `Too many attempts. Try again in ${status.retryAfter} seconds.`
        : 'Too many attempts. Please try again in an hour.',
      {
        status: 429,
        field: opts?.field,
        removeSensitiveData: opts?.removeSensitiveData
      },
      event
    );
  }
  return;
};
