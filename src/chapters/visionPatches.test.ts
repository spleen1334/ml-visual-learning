import { describe, expect, it } from 'vitest';
import { visionPatterns } from './visionCNNData';
import { imagePatches, patchProjection } from './visionPatches';

describe('authored patch projection and position arithmetic', () => {
  it('uses the exact fixed 3×4 projection', () => {
    expect(patchProjection).toEqual([[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, .5, .5]]);
    expect(Object.isFrozen(patchProjection)).toBe(true);
    expect(patchProjection.every(Object.isFrozen)).toBe(true);
  });

  it.each(['H1', 'H3'])('reconstructs every original pixel from nine ordered patches of %s', id => {
    const pixels = visionPatterns.find(pattern => pattern.id === id)!.pixels;
    const patches = imagePatches(pixels);
    expect(patches).toHaveLength(9);
    const reconstructed = Array.from({ length: 6 }, () => Array(6).fill(-1));
    const visits = Array.from({ length: 6 }, () => Array(6).fill(0));
    patches.forEach((patch, index) => {
      expect([patch.index, patch.row, patch.column]).toEqual([index, Math.floor(index / 3), index % 3]);
      expect(patch.values).toHaveLength(4);
      expect(patch.projected).toHaveLength(3);
      expect(patch.position).toEqual([Math.floor(index / 3) / 2, (index % 3) / 2, 0]);
      expect(patch.embedding).toHaveLength(3);
      expect(patch.projected).toEqual([patch.values[0], patch.values[1], (patch.values[2] + patch.values[3]) / 2]);
      expect(patch.embedding).toEqual(patch.projected.map((value, i) => value + patch.position[i]));
      patch.values.forEach((value, i) => {
        const row = patch.row * 2 + Math.floor(i / 2);
        const column = patch.column * 2 + i % 2;
        reconstructed[row][column] = value;
        visits[row][column]++;
      });
    });
    expect(reconstructed).toEqual(pixels);
    expect(visits.flat()).toEqual(Array(36).fill(1));
  });

  it('matches the exact H1 and H3 fourth-patch worked calculations', () => {
    const patch = (id: string) => imagePatches(visionPatterns.find(pattern => pattern.id === id)!.pixels)[3];
    expect(patch('H1')).toEqual({ index: 3, row: 1, column: 0, values: [1, 1, 1, 1], projected: [1, 1, 1], position: [.5, 0, 0], embedding: [1.5, 1, 1] });
    expect(patch('H3')).toEqual({ index: 3, row: 1, column: 0, values: [1, 0, 1, 0], projected: [1, 0, .5], position: [.5, 0, 0], embedding: [1.5, 0, .5] });
  });

  it('does not mutate source pixels or share returned vectors between calls', () => {
    const pixels = visionPatterns[0].pixels.map(row => Object.freeze([...row]));
    Object.freeze(pixels);
    const before = JSON.stringify({ pixels, patchProjection, visionPatterns });
    const first = imagePatches(pixels);
    const second = imagePatches(pixels);
    expect(first).toEqual(second);
    first[3].values[0] = 99;
    first[3].projected[0] = 99;
    first[3].position[0] = 99;
    first[3].embedding[0] = 99;
    expect(second[3].values[0]).toBe(1);
    expect(second[3].projected[0]).toBe(1);
    expect(second[3].position[0]).toBe(.5);
    expect(second[3].embedding[0]).toBe(1.5);
    expect(JSON.stringify({ pixels, patchProjection, visionPatterns })).toBe(before);
  });
});
