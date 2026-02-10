const RATE_LIMIT_PATTERN = /Try again in (\d+) seconds?/;

type Issues = { message?: string }[] | undefined;
type IssuesGetter = () => Issues;

/**
 * Wraps a field's `issues` function to show a live countdown for rate limit errors.
 * Returns a new getter function that can be passed to `Field.Error`.
 *
 * @example
 * ```svelte
 * <script>
 *   const emailErrors = useRateLimitCountdown(() => login.fields.email.issues());
 * </script>
 *
 * <Field.Error errors={emailErrors()} />
 * ```
 */
export function useRateLimitCountdown(getIssues: IssuesGetter): IssuesGetter {
  let countdownSeconds = $state<number | null>(null);
  let intervalId: ReturnType<typeof setInterval> | null = null;

  const originalMessage = $derived(getIssues()?.[0]?.message);

  $effect(() => {
    // Clear any existing interval
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    countdownSeconds = null;

    if (!originalMessage) return;

    const match = originalMessage.match(RATE_LIMIT_PATTERN);
    if (!match) return;

    const seconds = parseInt(match[1], 10);
    countdownSeconds = seconds;

    intervalId = setInterval(() => {
      if (countdownSeconds !== null && countdownSeconds > 1) {
        countdownSeconds--;
      } else {
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
        countdownSeconds = null;
      }
    }, 1000);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };
  });

  return () => {
    const current = getIssues();
    if (!current || current.length === 0) return current;
    if (countdownSeconds === null) return current;

    return current.map((issue) => {
      if (!issue.message) return issue;
      return {
        ...issue,
        message: issue.message.replace(
          RATE_LIMIT_PATTERN,
          `Try again in ${countdownSeconds} second${countdownSeconds === 1 ? '' : 's'}`
        )
      };
    });
  };
}
