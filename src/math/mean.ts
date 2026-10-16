/** Return the arithmetic mean of a non-empty collection of numbers. */
export function mean(values: readonly number[]): number {
  if (values.length === 0) {
    throw new RangeError('mean requires at least one value');
  }

  if (values.some((value) => !Number.isFinite(value))) {
    throw new RangeError('mean requires finite numbers');
  }

  return values.reduce((total, value) => total + value, 0) / values.length;
}
