export type FieldIssue = { message?: string };

function joinWithAnd(items: string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

function normalizeMessages(issues: FieldIssue[]): string[] {
  return issues.map((issue) => issue.message?.trim()).filter((message): message is string => !!message);
}

/**
 * Summarizes multiple field issues into a single human-readable string.
 *
 * @param issues - Array of field issues with optional message properties
 * @returns Combined message string or null if no issues
 */
export function summarizeIssues(issues: FieldIssue[]): string | null {
  const messages = normalizeMessages(issues);
  if (messages.length === 0) return null;
  if (messages.length === 1) return messages[0];
  return joinWithAnd(messages);
}

/**
 * Summarizes multiple field issues, combining those with a common prefix.
 * Useful for fields with multiple validation rules that share a prefix.
 *
 * @param prefix - Common prefix to extract and combine
 * @param issues - Array of field issues with optional message properties
 * @returns Combined message string or null if no issues
 * @example
 * ```ts
 * summarizeIssuesWithPrefix("Password must ", [
 *   { message: "Password must be at least 8 characters" },
 *   { message: "Password must contain a number" }
 * ]);
 * // Returns: "Password must be at least 8 characters and contain a number"
 * ```
 */
export function summarizeIssuesWithPrefix(prefix: string, issues: FieldIssue[]): string | null {
  const messages = normalizeMessages(issues);
  if (messages.length === 0) return null;
  if (messages.length === 1) return messages[0];

  if (messages.every((message) => message.startsWith(prefix))) {
    const parts = messages.map((message) => message.slice(prefix.length));
    return `${prefix}${joinWithAnd(parts)}`;
  }

  return joinWithAnd(messages);
}
