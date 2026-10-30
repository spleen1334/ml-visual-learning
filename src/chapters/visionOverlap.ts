import { visionScene, type VisionBox, type VisionMask } from './visionScene';

/** Supplied candidates, not model inference or calibrated probabilities. */
export const suppliedCandidates: readonly Readonly<{
  id: string;
  classLabel: 'square';
  score: number;
  box: VisionBox;
}>[] = Object.freeze([
  Object.freeze({ id: 'candidate1', classLabel: 'square' as const, score: .8, box: Object.freeze([1, 1, 4, 3] as const) }),
  Object.freeze({ id: 'candidate2', classLabel: 'square' as const, score: .6, box: Object.freeze([3, 3, 5, 5] as const) }),
]);

export const candidateMask: VisionMask = Object.freeze(visionScene.objects[0].binaryMask.map((row, r) =>
  Object.freeze(row.map((value, c) => r === 2 && c === 3 ? 1 : value))));

/** Continuous half-open XYXY regions, with no inclusive-coordinate +1. */
export function boxOverlap(a: VisionBox, b: VisionBox) {
  const areaA = Math.max(0, a[2] - a[0]) * Math.max(0, a[3] - a[1]);
  const areaB = Math.max(0, b[2] - b[0]) * Math.max(0, b[3] - b[1]);
  const intersection = Math.max(0, Math.min(a[2], b[2]) - Math.max(a[0], b[0])) *
    Math.max(0, Math.min(a[3], b[3]) - Math.max(a[1], b[1]));
  const union = areaA + areaB - intersection;
  return { areaA, areaB, intersection, union, iou: union === 0 ? null : intersection / union };
}

/** Binary 6×6 instance masks: overlap measures pixel counts, not box areas. */
export function maskOverlap(a: VisionMask, b: VisionMask) {
  let countA = 0;
  let countB = 0;
  let intersection = 0;
  for (let row = 0; row < 6; row++) {
    for (let column = 0; column < 6; column++) {
      const inA = a[row][column] === 1;
      const inB = b[row][column] === 1;
      countA += Number(inA);
      countB += Number(inB);
      intersection += Number(inA && inB);
    }
  }
  const union = countA + countB - intersection;
  return { countA, countB, intersection, union, iou: union === 0 ? null : intersection / union };
}

/** Score filtering only: not matching or duplicate suppression. */
export const visibleCandidates = (threshold: number) => suppliedCandidates.filter(candidate => candidate.score >= threshold);
