/** Fixed authored arithmetic, not a trained ViT projection or encoder. */
export const patchProjection: readonly (readonly number[])[] = Object.freeze([
  Object.freeze([1, 0, 0, 0]),
  Object.freeze([0, 1, 0, 0]),
  Object.freeze([0, 0, .5, .5]),
]);

/** Nine non-overlapping 2×2 patches of a 6×6 single-channel image.
 * Row/column are patch-grid coordinates; values and patches are row-major.
 * Position vectors are authored teaching values, not learned embeddings.
 */
export function imagePatches(pixels: readonly (readonly number[])[]) {
  return Array.from({ length: 9 }, (_, index) => {
    const row = Math.floor(index / 3);
    const column = index % 3;
    const values = [
      pixels[row * 2][column * 2], pixels[row * 2][column * 2 + 1],
      pixels[row * 2 + 1][column * 2], pixels[row * 2 + 1][column * 2 + 1],
    ];
    const projected = patchProjection.map(weights => weights.reduce((sum, weight, i) => sum + weight * values[i], 0));
    const position = [row / 2, column / 2, 0];
    const embedding = projected.map((value, i) => value + position[i]);
    return { index, row, column, values, projected, position, embedding };
  });
}
