import { cnnForward, type CNNHead } from './visionCNN';
import { heldOutPatterns, trainHead } from './visionTraining';

export type RobustPreset = 'original' | 'shift' | 'contrast' | 'noise';
export const robustnessPresets: { id: RobustPreset; name: string }[] = [
  { id: 'original', name: 'Original' },
  { id: 'shift', name: 'Right shift by one' },
  { id: 'contrast', name: 'Half contrast' },
  { id: 'noise', name: 'Corner noise' },
];

export function transformPattern(pixels: readonly (readonly number[])[], preset: RobustPreset): number[][] {
  return pixels.map((row, r) => row.map((value, c) => {
    if (preset === 'shift') return c === 0 ? 0 : row[c - 1];
    if (preset === 'contrast') return value * .5;
    if (preset === 'noise' && r === 0 && c === 0) return 1 - value;
    return value;
  }));
}

/** Observed rows H/V; predicted columns H/V. Undefined ratios stay null. */
export function classificationMetrics(matrix: readonly (readonly number[])[]) {
  return (['horizontal', 'vertical'] as const).map((label, index) => {
    const tp = matrix[index][index];
    const fp = matrix[1 - index][index];
    const fn = matrix[index][1 - index];
    return { label, tp, fp, fn, precision: tp + fp === 0 ? null : tp / (tp + fp), recall: tp + fn === 0 ? null : tp / (tp + fn) };
  });
}

// Fit once on the original training split, never on transformed or held-out data.
const fittedHead = trainHead().head;

export function evaluateRobustness(preset: RobustPreset, head: CNNHead = fittedHead) {
  const matrix = [[0, 0], [0, 0]];
  const rows = heldOutPatterns.map(pattern => {
    const original = pattern.pixels.map(row => [...row]);
    const pixels = transformPattern(original, preset);
    const { features, scores, probabilities } = cnnForward(pixels, head);
    const prediction: 'horizontal' | 'vertical' = scores[0] >= scores[1] ? 'horizontal' : 'vertical';
    matrix[pattern.label === 'horizontal' ? 0 : 1][prediction === 'horizontal' ? 0 : 1]++;
    return { id: pattern.id, label: pattern.label, sourceGroup: pattern.sourceGroup, original, pixels, features, scores, probabilities, prediction };
  });
  return { rows, matrix, metrics: classificationMetrics(matrix), correct: matrix[0][0] + matrix[1][1], count: rows.length };
}
