import { describe, expect, it } from 'vitest';
import { mean, median, modes, percentileInc, percentileRank, skewness, standardDeviation, variance } from './univariateMath';

describe('univariate profiling calculations', () => {
  it('finds centers while leaving the source order untouched', () => {
    const values = [8, 2, 4, 6];
    expect(mean(values)).toBe(5);
    expect(median(values)).toBe(5);
    expect(values).toEqual([8, 2, 4, 6]);
    expect(median([1, 3, 9])).toBe(3);
  });

  it('returns all exact mode ties and supports categorical values', () => {
    expect(modes([1, 2, 2, 3, 3])).toEqual([2, 3]);
    expect(modes(['A', 'B', 'A'])).toEqual(['A']);
    expect(modes(['east', 'west'])).toEqual(['east', 'west']);
  });

  it('matches Excel PERCENTILE.INC interpolation and distinguishes rank conventions with ties', () => {
    expect(percentileInc([0, 10, 20, 30, 40], 0.25)).toBe(10);
    expect(percentileInc([60, 70, 70, 90, 100], 0.25)).toBe(70);
    expect(percentileInc([0, 10, 20, 30, 40], 0.125)).toBe(5);
    expect(percentileRank([60, 70, 70, 90, 100], 70)).toBe(0.2);
    expect(percentileRank([60, 70, 70, 90, 100], 70, true)).toBe(0.6);
  });

  it('uses n - 1 for sample variance and n for population variance', () => {
    expect(variance([2, 4, 6], 'population')).toBeCloseTo(8 / 3);
    expect(variance([2, 4, 6], 'sample')).toBe(4);
    expect(standardDeviation([2, 4, 6], 'sample')).toBe(2);
    expect(standardDeviation([2, 4, 6], 'population')).toBeCloseTo(Math.sqrt(8 / 3));
  });

  it('separates location from spread and squares the scale factor in variance', () => {
    const original = [2, 4, 6];
    const shifted = original.map(value => value + 100);
    expect(mean(shifted)).toBe(104);
    expect(variance(shifted, 'sample')).toBe(variance(original, 'sample'));
    const widened = original.map(value => 4 + 2 * (value - 4));
    expect(mean(widened)).toBe(4);
    expect(variance(widened, 'sample')).toBe(4 * variance(original, 'sample'));
    expect(standardDeviation(widened, 'sample')).toBe(2 * standardDeviation(original, 'sample'));
  });

  it('keeps the center fixed as symmetric observations spread apart', () => {
    for (const distance of [1, 2, 3, 4]) {
      const values = [4 - distance, 4, 4 + distance];
      expect(mean(values)).toBe(4);
      expect(variance(values, 'sample')).toBe(distance ** 2);
      expect(variance(values, 'population')).toBeCloseTo(2 * distance ** 2 / 3);
      expect(standardDeviation(values, 'sample')).toBe(distance);
    }
  });

  it('gives skewness the sign of the longer tail for mirrored examples', () => {
    expect(skewness([1, 2, 3, 4, 10])).toBeGreaterThan(0);
    expect(skewness([-10, -4, -3, -2, -1])).toBeLessThan(0);
    expect(skewness([1, 2, 3, 4, 5])).toBe(0);
  });

  it('rejects undefined or invalid calculation inputs', () => {
    expect(() => mean([])).toThrow(RangeError);
    expect(() => median([Number.NaN])).toThrow(RangeError);
    expect(() => modes([])).toThrow(RangeError);
    expect(() => percentileInc([1, 2], 1.1)).toThrow(RangeError);
    expect(() => variance([4], 'sample')).toThrow(RangeError);
    expect(() => skewness([3, 3, 3])).toThrow(RangeError);
  });
});
