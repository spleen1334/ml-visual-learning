import { describe, expect, it } from 'vitest';
import { boxOverlap, candidateMask, maskOverlap, suppliedCandidates, visibleCandidates } from './visionOverlapData';
import { visionScene } from './visionScene';

const emptyMask = () => Array.from({ length: 6 }, () => Array(6).fill(0));

describe('box and instance-mask overlap', () => {
  it('preserves the supplied candidates and default intersection/union arithmetic', () => {
    expect(suppliedCandidates).toEqual([
      { id: 'candidate1', classLabel: 'square', score: .8, box: [1, 1, 4, 3] },
      { id: 'candidate2', classLabel: 'square', score: .6, box: [3, 3, 5, 5] },
    ]);
    expect(boxOverlap(suppliedCandidates[0].box, visionScene.objects[0].box)).toEqual({
      areaA: 6, areaB: 4, intersection: 4, union: 6, iou: 2 / 3,
    });
    expect(boxOverlap(suppliedCandidates[1].box, visionScene.objects[1].box).iou).toBe(1);
  });

  it('handles identical, disjoint, touching, partial, and contained half-open boxes', () => {
    expect(boxOverlap([1, 1, 3, 3], [1, 1, 3, 3])).toEqual({ areaA: 4, areaB: 4, intersection: 4, union: 4, iou: 1 });
    expect(boxOverlap([0, 0, 1, 1], [2, 2, 3, 3])).toEqual({ areaA: 1, areaB: 1, intersection: 0, union: 2, iou: 0 });
    expect(boxOverlap([0, 0, 2, 2], [2, 0, 4, 2]).intersection).toBe(0);
    expect(boxOverlap([0, 0, 2, 2], [1, 1, 3, 3])).toEqual({ areaA: 4, areaB: 4, intersection: 1, union: 7, iou: 1 / 7 });
    expect(boxOverlap([0, 0, 4, 4], [1, 1, 2, 2])).toEqual({ areaA: 16, areaB: 1, intersection: 1, union: 16, iou: 1 / 16 });
  });

  it('clamps each degenerate dimension and returns null only for zero union', () => {
    expect(boxOverlap([1, 1, 1, 3], [0, 0, 2, 2])).toEqual({ areaA: 0, areaB: 4, intersection: 0, union: 4, iou: 0 });
    expect(boxOverlap([3, 3, 1, 1], [0, 0, 2, 2]).areaA).toBe(0);
    expect(boxOverlap([0, 0, 2, -1], [1, 1, 3, 3]).areaA).toBe(0);
    expect(boxOverlap([1, 1, 1, 3], [0, 0, 2, 0])).toEqual({ areaA: 0, areaB: 0, intersection: 0, union: 0, iou: null });
  });

  it('counts exactly the four reference cells plus the extra candidate pixel', () => {
    expect(candidateMask).toEqual([
      [0, 0, 0, 0, 0, 0], [0, 1, 1, 0, 0, 0], [0, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0],
    ]);
    expect(maskOverlap(visionScene.objects[0].binaryMask, candidateMask)).toEqual({ countA: 4, countB: 5, intersection: 4, union: 5, iou: .8 });
    expect(maskOverlap(candidateMask, candidateMask)).toEqual({ countA: 5, countB: 5, intersection: 5, union: 5, iou: 1 });
    expect(maskOverlap(visionScene.objects[0].binaryMask, visionScene.objects[1].binaryMask)).toEqual({ countA: 4, countB: 4, intersection: 0, union: 8, iou: 0 });
    expect(maskOverlap(emptyMask(), candidateMask)).toEqual({ countA: 0, countB: 5, intersection: 0, union: 5, iou: 0 });
    expect(maskOverlap(emptyMask(), emptyMask())).toEqual({ countA: 0, countB: 0, intersection: 0, union: 0, iou: null });
  });

  it('filters scores inclusively without changing geometry or inputs', () => {
    const before = JSON.stringify({ suppliedCandidates, candidateMask, visionScene });
    expect(visibleCandidates(.5).map(c => c.id)).toEqual(['candidate1', 'candidate2']);
    expect(visibleCandidates(.7).map(c => c.id)).toEqual(['candidate1']);
    expect(visibleCandidates(.8).map(c => c.id)).toEqual(['candidate1']);
    expect(visibleCandidates(.9)).toEqual([]);
    const visible = visibleCandidates(.5);
    visible.pop();
    boxOverlap(suppliedCandidates[0].box, visionScene.objects[0].box);
    maskOverlap(candidateMask, visionScene.objects[0].binaryMask);
    expect(JSON.stringify({ suppliedCandidates, candidateMask, visionScene })).toBe(before);
    expect(Object.isFrozen(suppliedCandidates[0].box)).toBe(true);
    expect(candidateMask.every(Object.isFrozen)).toBe(true);
  });
});
