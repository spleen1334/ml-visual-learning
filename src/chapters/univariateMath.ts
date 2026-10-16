/** Arithmetic mean of a finite, non-empty collection. */
export function mean(values: readonly number[]): number {
  assertNumbers(values, 'mean requires at least one finite value');
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

/** Median of numeric observations. A numeric midpoint is meaningful only when the scale supports it. */
export function median(values: readonly number[]): number {
  assertNumbers(values, 'median requires at least one finite value');
  const ordered = [...values].sort((a, b) => a - b);
  const middle = Math.floor(ordered.length / 2);
  return ordered.length % 2 ? ordered[middle] : (ordered[middle - 1] + ordered[middle]) / 2;
}

/** Return every value tied for the highest frequency, in first-observed order. */
export function modes<T extends string | number>(values: readonly T[]): T[] {
  if (values.length === 0) throw new RangeError('mode requires at least one value');
  if (values.some(value => typeof value === 'number' && !Number.isFinite(value))) {
    throw new RangeError('mode requires finite numeric values');
  }
  const counts = new Map<T, number>();
  values.forEach(value => counts.set(value, (counts.get(value) ?? 0) + 1));
  const highest = Math.max(...counts.values());
  return [...counts].filter(([, count]) => count === highest).map(([value]) => value);
}

/** Excel PERCENTILE.INC: interpolate at (n - 1) * p, including both endpoints. */
export function percentileInc(values: readonly number[], p: number): number {
  assertNumbers(values, 'PERCENTILE.INC requires at least one finite value');
  if (!Number.isFinite(p) || p < 0 || p > 1) throw new RangeError('p must be between 0 and 1');
  const ordered = [...values].sort((a, b) => a - b);
  const position = (ordered.length - 1) * p;
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  const fraction = position - lower;
  return ordered[lower] + (ordered[upper] - ordered[lower]) * fraction;
}

export function percentileRank(values: readonly number[], target: number, inclusive = false): number {
  assertNumbers(values, 'percentile rank requires at least one finite value');
  if (!Number.isFinite(target)) throw new RangeError('target must be finite');
  const count = values.filter(value => inclusive ? value <= target : value < target).length;
  return count / values.length;
}

export function variance(values: readonly number[], kind: 'sample' | 'population'): number {
  assertNumbers(values, `${kind} variance requires at least one finite value`);
  if (kind === 'sample' && values.length < 2) throw new RangeError('sample variance requires at least two values');
  const center = mean(values);
  const squaredDeviations = values.reduce((sum, value) => sum + (value - center) ** 2, 0);
  return squaredDeviations / (kind === 'sample' ? values.length - 1 : values.length);
}

export function standardDeviation(values: readonly number[], kind: 'sample' | 'population'): number {
  return Math.sqrt(variance(values, kind));
}

/** Third standardized central moment (population form); this describes asymmetry, not normality. */
export function skewness(values: readonly number[]): number {
  assertNumbers(values, 'skewness requires at least two finite values');
  if (values.length < 2) throw new RangeError('skewness requires at least two values');
  const center = mean(values);
  const secondMoment = values.reduce((sum, value) => sum + (value - center) ** 2, 0) / values.length;
  if (secondMoment === 0) throw new RangeError('skewness is undefined when every value is equal');
  const thirdMoment = values.reduce((sum, value) => sum + (value - center) ** 3, 0) / values.length;
  return thirdMoment / secondMoment ** 1.5;
}

function assertNumbers(values: readonly number[], message: string): void {
  if (values.length === 0 || values.some(value => !Number.isFinite(value))) throw new RangeError(message);
}
