import { describe, expect, it } from 'vitest';
import { mean } from './mean';

describe('mean', () => {
  it('averages a collection of values', () => {
    expect(mean([4, 6, 8, 10, 12])).toBe(8);
  });

  it('handles a single value and zero', () => {
    expect(mean([0])).toBe(0);
    expect(mean([7])).toBe(7);
  });

  it('returns a fractional mean when the total does not divide evenly', () => {
    expect(mean([1, 2])).toBe(1.5);
  });

  it('rejects an empty collection because it has no defined average', () => {
    expect(() => mean([])).toThrow(RangeError);
  });

  it('rejects non-finite values instead of returning an unusable result', () => {
    expect(() => mean([1, Number.NaN])).toThrow(RangeError);
    expect(() => mean([1, Number.POSITIVE_INFINITY])).toThrow(RangeError);
  });
});
