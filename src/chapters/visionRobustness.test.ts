import { describe, expect, it } from 'vitest';
import { cnnFilters, visionPatterns } from './visionCNN';
import { heldOutPatterns, trainHead } from './visionTraining';
import { classificationMetrics, evaluateRobustness, robustnessPresets, transformPattern } from './visionRobustness';

describe('held-out robustness presets', () => {
  const features = [
    [[2, 2, 0, 0, 0, 0, 0, 0], [1, 1, 1, 1, 0, 2, 0, 2], Array(8).fill(0), Array(8).fill(0)],
    [[2, 2, 0, 0, 0, 0, 0, 0], [1, 1, 1, 1, 2, 2, 2, 2], [0, 0, 0, 0, 2, 0, 2, 0], Array(8).fill(0)],
    [[1, 1, 0, 0, 0, 0, 0, 0], [.5, .5, .5, .5, 0, 1, 0, 1], Array(8).fill(0), Array(8).fill(0)],
    [[2, 2, 0, 0, 0, 0, 0, 0], [1, 1, 1, 1, 0, 2, 0, 2], Array(8).fill(0), [1, 0, 0, 0, 1, 0, 0, 0]],
  ];
  const probabilities = [
    [.923790, .435540, .519086, .519086],
    [.923790, .010495, .014620, .519086],
    [.783416, .477153, .519086, .519086],
    [.923790, .435540, .519086, .403545],
  ];
  const matrices = [[[2, 0], [1, 1]], [[1, 1], [1, 1]], [[2, 0], [1, 1]], [[2, 0], [0, 2]]];

  it('matches all 16 feature vectors, reference probabilities and confusion cells', () => {
    expect(robustnessPresets.map(p => p.id)).toEqual(['original', 'shift', 'contrast', 'noise']);
    robustnessPresets.forEach((preset, index) => {
      const result = evaluateRobustness(preset.id);
      expect(result.rows.map(row => row.features)).toEqual(features[index]);
      expect(result.matrix).toEqual(matrices[index]);
      expect(result.count).toBe(4);
      expect(result.correct).toBe([3, 2, 3, 4][index]);
      expect(result.rows.map(row => row.id)).toEqual(['H3', 'V3', 'H4', 'V4']);
      expect(result.rows.map(row => row.label)).toEqual(['horizontal', 'vertical', 'horizontal', 'vertical']);
      expect(result.rows.map(row => row.sourceGroup)).toEqual(['broken-horizontal', 'broken-vertical', 'triple-horizontal', 'triple-vertical']);
      result.rows.forEach((row, record) => {
        expect(row.probabilities[0]).toBeCloseTo(probabilities[index][record], 5);
        expect(row.probabilities[1]).toBeCloseTo(1 - probabilities[index][record], 5);
        expect(row.probabilities.every(Number.isFinite)).toBe(true);
        expect(row.pixels).toHaveLength(6);
        row.pixels.forEach(values => expect(values).toHaveLength(6));
        const observed = row.label === 'horizontal' ? 0 : 1;
        const predicted = row.prediction === 'horizontal' ? 0 : 1;
        expect(result.matrix[observed][predicted]).toBeGreaterThan(0);
      });
      // Independent score arithmetic from the frozen final parameter references.
      const w = [.3023263165000687, .3023263165000687, .3679856800623563, .3679856800623563, -.5358750280470677, -.377114109678589, -.5358750280470677, -.377114109678589];
      result.rows.forEach((row, record) => {
        const score = features[index][record].reduce((sum, feature, column) => sum + feature * w[column], .03819095917827112);
        expect(row.scores[0]).toBeCloseTo(score, 12);
        expect(row.scores[1]).toBeCloseTo(-score, 12);
        expect(row.probabilities[0]).toBeCloseTo(1 / (1 + Math.exp(-2 * score)), 12);
      });
    });
  });

  it('computes exact per-class metrics and null undefined denominators', () => {
    expect(evaluateRobustness('original').metrics).toEqual([
      { label: 'horizontal', tp: 2, fp: 1, fn: 0, precision: 2 / 3, recall: 1 },
      { label: 'vertical', tp: 1, fp: 0, fn: 1, precision: 1, recall: .5 },
    ]);
    expect(evaluateRobustness('contrast').metrics).toEqual(evaluateRobustness('original').metrics);
    expect(evaluateRobustness('shift').metrics.map(m => [m.tp, m.fp, m.fn, m.precision, m.recall])).toEqual([[1, 1, 1, .5, .5], [1, 1, 1, .5, .5]]);
    expect(evaluateRobustness('noise').metrics.map(m => [m.tp, m.fp, m.fn, m.precision, m.recall])).toEqual([[2, 0, 0, 1, 1], [2, 0, 0, 1, 1]]);
    expect(classificationMetrics([[0, 0], [0, 0]]).map(m => [m.precision, m.recall])).toEqual([[null, null], [null, null]]);
    expect(classificationMetrics([[0, 2], [0, 0]]).map(m => [m.precision, m.recall])).toEqual([[null, 0], [0, null]]);
  });

  it('applies each transform independently to original pixels without mutation', () => {
    const input = [[0, 1, 0, 1, 0, 1], [1, 0, 1, 0, 1, 0]];
    expect(transformPattern(input, 'shift')).toEqual([[0, 0, 1, 0, 1, 0], [0, 1, 0, 1, 0, 1]]);
    expect(transformPattern(input, 'contrast')).toEqual([[0, .5, 0, .5, 0, .5], [.5, 0, .5, 0, .5, 0]]);
    expect(transformPattern(input, 'noise')).toEqual([[1, 1, 0, 1, 0, 1], [1, 0, 1, 0, 1, 0]]);
    expect(transformPattern([[1, 0]], 'noise')).toEqual([[0, 0]]);
    const copy = transformPattern(input, 'original');
    expect(copy).toEqual(input);
    expect(copy[0]).not.toBe(input[0]);
    expect(input).toEqual([[0, 1, 0, 1, 0, 1], [1, 0, 1, 0, 1, 0]]);
  });

  it('preserves fitting data, filters, fitted parameters and source groups', () => {
    const head = trainHead().head;
    const before = JSON.stringify({ head, cnnFilters, visionPatterns });
    for (const preset of robustnessPresets) {
      const result = evaluateRobustness(preset.id, head);
      result.rows.forEach((row, index) => {
        expect(row.original).toEqual(heldOutPatterns[index].pixels);
        expect(row.pixels).toEqual(transformPattern(heldOutPatterns[index].pixels, preset.id));
        expect(row.original).not.toBe(heldOutPatterns[index].pixels);
        row.original[0][0] = 99;
        row.pixels[0][0] = 99;
      });
    }
    expect(JSON.stringify({ head, cnnFilters, visionPatterns })).toBe(before);
    expect(evaluateRobustness('original', head)).toEqual(evaluateRobustness('original'));
  });
});
