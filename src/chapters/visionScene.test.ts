import { describe, expect, it } from 'vitest';
import { visionScene } from './visionScene';

const expectedIds = [
  [0, 0, 0, 0, 0, 0],
  [0, 1, 1, 0, 0, 0],
  [0, 1, 1, 0, 0, 0],
  [0, 0, 0, 2, 2, 0],
  [0, 0, 0, 2, 2, 0],
  [0, 0, 0, 0, 0, 0],
];

describe('frozen authored vision scene', () => {
  it('preserves every RGB byte at its exact row and column', () => {
    expect([visionScene.height, visionScene.width, visionScene.channels]).toEqual([6, 6, 3]);
    expect(visionScene.palette).toEqual({
      background: [240, 232, 210], teal: [40, 130, 120], orange: [220, 140, 60],
    });
    const colors = [[240, 232, 210], [40, 130, 120], [220, 140, 60]];
    expect(visionScene.pixels).toEqual(expectedIds.map((row) => row.map((id) => colors[id])));
    expect(visionScene.imageLabel).toBe('two colored squares');
  });

  it('supplies two distinct instances of the same class with half-open area-four boxes', () => {
    expect(visionScene.objects.map(({ id, classLabel, box }) => ({ id, classLabel, box }))).toEqual([
      { id: 'square1', classLabel: 'square', box: [1, 1, 3, 3] },
      { id: 'square2', classLabel: 'square', box: [3, 3, 5, 5] },
    ]);
    for (const { box: [x1, y1, x2, y2], binaryMask } of visionScene.objects) {
      expect((x2 - x1) * (y2 - y1)).toBe(4);
      binaryMask.forEach((row, y) => row.forEach((value, x) => {
        expect(value).toBe(Number(x >= x1 && x < x2 && y >= y1 && y < y2));
      }));
    }
  });

  it('keeps semantic classes separate from the 2×6×6 instance output', () => {
    expect(visionScene.semanticMask).toEqual(expectedIds.map((row) => row.map((id) => Number(id > 0))));
    expect(visionScene.semanticMask.flat().filter((id) => id === 1)).toHaveLength(8);
    expect(visionScene.semanticMask.flat().filter((id) => id === 0)).toHaveLength(28);
    expect(visionScene.instanceIdMask).toEqual(expectedIds);
    expect(visionScene.objects).toHaveLength(2);
    visionScene.objects.forEach(({ binaryMask }, index) => {
      expect(binaryMask).toHaveLength(6);
      binaryMask.forEach((row) => expect(row).toHaveLength(6));
      expect(binaryMask.flat().filter((value) => value === 1)).toHaveLength(4);
      expect(binaryMask).toEqual(expectedIds.map((row) => row.map((id) => Number(id === index + 1))));
    });
  });

  it('freezes all nested annotation and pixel data at runtime', () => {
    const assertFrozen = (value: unknown): void => {
      if (value !== null && typeof value === 'object') {
        expect(Object.isFrozen(value)).toBe(true);
        Object.values(value).forEach(assertFrozen);
      }
    };
    assertFrozen(visionScene);
  });
});
