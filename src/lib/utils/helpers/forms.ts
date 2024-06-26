// Types
import { type NumericRange, type RequestEvent } from '@sveltejs/kit';

// Utils
import { fail } from '@sveltejs/kit';
import { setError, type SuperValidated } from 'sveltekit-superforms/server';
import { setFlash } from 'sveltekit-flash-message/server';
import { RetryAfterRateLimiter } from 'sveltekit-rate-limiter/server';

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

const limiter = new RetryAfterRateLimiter({
  IP: [10, 'h'],
  IPUA: [5, 'm']
});

export const isRateLimited = async (
  form: SuperValidated<Record<string, unknown>>,
  event: RequestEvent,
  opts: { field: string; removeSensitiveData?: string[] }
) => {
  const status = await limiter.check(event);
  if (status.limited) {
    return setFormError(
      form,
      `Too many attempts. Try again in ${status.retryAfter} seconds.`,
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
