import { describe, expect, it } from 'vitest';
import { filterImage, filterOutput, filterWindow, visionFilters } from './visionFiltersData';

describe('98.4 unflipped cross-correlation', () => {
  it('preserves the exact authored image and integer kernel conventions', () => {
    expect(filterImage).toEqual([
      [0, 0, 0, 0, 0], [0, 1, 1, 1, 0], [0, 1, 2, 1, 0],
      [0, 1, 1, 1, 0], [0, 0, 0, 0, 0],
    ]);
    expect(visionFilters.map(({ id, kernel, divisor }) => ({ id, kernel, divisor }))).toEqual([
      { id: 'blur', kernel: [[1, 1, 1], [1, 1, 1], [1, 1, 1]], divisor: 9 },
      { id: 'x', kernel: [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]], divisor: 1 },
      { id: 'y', kernel: [[-1, -2, -1], [0, 0, 0], [1, 2, 1]], divisor: 1 },
    ]);
  });

  it('matches every output cell, retaining signed gradient responses', () => {
    const [blur, x, y] = visionFilters;
    expect(filterOutput(filterImage, blur)).toEqual([
      [5 / 9, 7 / 9, 5 / 9], [7 / 9, 10 / 9, 7 / 9], [5 / 9, 7 / 9, 5 / 9],
    ]);
    expect(filterOutput(filterImage, x)).toEqual([[4, 0, -4], [6, 0, -6], [4, 0, -4]]);
    expect(filterOutput(filterImage, y)).toEqual([[4, 6, 4], [0, 0, 0], [-4, -6, -4]]);
  });

  it('exposes nine products, their raw sum, and the separate blur division', () => {
    expect(filterWindow(filterImage, visionFilters[0], 1, 1)).toEqual({
      products: [[1, 1, 1], [1, 2, 1], [1, 1, 1]], sum: 10, value: 10 / 9,
    });
    // Left-middle window: the unflipped x kernel yields positive six.
    const window = filterWindow(filterImage, visionFilters[1], 1, 0);
    expect(window.products.map((row) => row.map((value) => value === 0 ? 0 : value))).toEqual([
      [0, 0, 1], [0, 0, 4], [0, 0, 1],
    ]);
    expect(window.sum).toBe(6);
    expect(window.value).toBe(6);
    expect(filterWindow(filterImage, visionFilters[1], 1, 2).sum).toBe(-6);
  });

  it('leaves image and filters unchanged and returns independent result matrices', () => {
    const imageBefore = JSON.stringify(filterImage);
    const filtersBefore = JSON.stringify(visionFilters);
    for (const filter of visionFilters) {
      const output = filterOutput(filterImage, filter);
      const window = filterWindow(filterImage, filter, 0, 0);
      output[0][0] = 999;
      window.products[0][0] = 999;
    }
    expect(JSON.stringify(filterImage)).toBe(imageBefore);
    expect(JSON.stringify(visionFilters)).toBe(filtersBefore);
    expect(filterOutput(filterImage, visionFilters[0])[0][0]).toBe(5 / 9);
  });
});
