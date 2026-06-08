export const BYTES_IN_MB = 1_000_000;

export function mb(value: number): number {
  return Math.round(value * BYTES_IN_MB);
}
