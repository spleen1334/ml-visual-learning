type Matrix = readonly (readonly number[])[];

export type VisionFilter = Readonly<{
  id: 'blur' | 'x' | 'y';
  name: string;
  kernel: Matrix;
  divisor: number;
}>;

export const filterImage: Matrix = [
  [0, 0, 0, 0, 0],
  [0, 1, 1, 1, 0],
  [0, 1, 2, 1, 0],
  [0, 1, 1, 1, 0],
  [0, 0, 0, 0, 0],
];

export const visionFilters: readonly VisionFilter[] = [
  { id: 'blur', name: 'Average blur', kernel: [[1, 1, 1], [1, 1, 1], [1, 1, 1]], divisor: 9 },
  { id: 'x', name: 'X-gradient', kernel: [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]], divisor: 1 },
  { id: 'y', name: 'Y-gradient', kernel: [[-1, -2, -1], [0, 0, 0], [1, 2, 1]], divisor: 1 },
];

/** Stride-one, unpadded cross-correlation: row/column locate the window's top left.
 * Products and sum retain integer blur weights; value applies the divisor.
 */
export function filterWindow(image: Matrix, filter: VisionFilter, row: number, column: number): {
  products: number[][];
  sum: number;
  value: number;
} {
  const products = filter.kernel.map((weights, dy) =>
    weights.map((weight, dx) => image[row + dy][column + dx] * weight));
  const sum = products.reduce((total, values) => total + values.reduce((subtotal, value) => subtotal + value, 0), 0);
  return { products, sum, value: sum / filter.divisor };
}

/** Zero bias; no kernel flipping, response clipping, or display normalization. */
export function filterOutput(image: Matrix, filter: VisionFilter): number[][] {
  return Array.from({ length: image.length - filter.kernel.length + 1 }, (_, row) =>
    Array.from({ length: image[0].length - filter.kernel[0].length + 1 }, (_, column) =>
      filterWindow(image, filter, row, column).value));
}
