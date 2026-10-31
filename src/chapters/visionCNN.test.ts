import { describe, expect, it } from 'vitest';
import { cnnFilters, cnnForward, suppliedHead, visionPatterns } from './visionCNNData';

describe('authored CNN forward pass', () => {
  it('preserves all eight exact structures, labels and disjoint source groups', () => {
    expect(visionPatterns.map(p => [p.id, p.label, p.split, p.sourceGroup, p.pixels.map(row => row.join('')).join('/')])).toEqual([
      ['H1', 'horizontal', 'train', 'solid-horizontal', '000000/000000/111111/111111/000000/000000'],
      ['V1', 'vertical', 'train', 'solid-vertical', '000000/001100/001100/001100/001100/000000'],
      ['H2', 'horizontal', 'train', 'paired-horizontal', '000000/111111/000000/000000/111111/000000'],
      ['V2', 'vertical', 'train', 'paired-vertical', '010010/010010/010010/010010/010010/010010'],
      ['H3', 'horizontal', 'test', 'broken-horizontal', '000000/000000/101010/101010/000000/000000'],
      ['V3', 'vertical', 'test', 'broken-vertical', '000000/010010/010010/000000/010010/010010'],
      ['H4', 'horizontal', 'test', 'triple-horizontal', '000000/111111/000000/111111/000000/111111'],
      ['V4', 'vertical', 'test', 'triple-vertical', '101010/101010/101010/101010/101010/101010'],
    ]);
    const trainGroups = new Set(visionPatterns.filter(p => p.split === 'train').map(p => p.sourceGroup));
    expect(visionPatterns.filter(p => p.split === 'test').every(p => !trainGroups.has(p.sourceGroup))).toBe(true);
    visionPatterns.forEach(p => {
      expect(p.pixels).toHaveLength(6);
      p.pixels.forEach(row => expect(row).toHaveLength(6));
    });
  });

  it('matches independently calculated channel-major features for every pattern', () => {
    expect(visionPatterns.map(p => cnnForward(p.pixels).features)).toEqual([
      [3, 3, 0, 0, 0, 0, 0, 0], [2, 2, 0, 0, 3, 0, 3, 0],
      [0, 0, 3, 3, 0, 0, 0, 0], [0, 0, 0, 0, 0, 3, 0, 3],
      [2, 2, 0, 0, 0, 0, 0, 0], [1, 1, 1, 1, 0, 2, 0, 2],
      [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0],
    ]);
  });

  it('exposes the complete H1 tensors and supplied score calculation', () => {
    const result = cnnForward(visionPatterns[0].pixels);
    const zero4 = Array.from({ length: 4 }, () => [0, 0, 0, 0]);
    expect(result.convolution).toEqual([
      [[3, 3, 3, 3], [3, 3, 3, 3], [-3, -3, -3, -3], [-3, -3, -3, -3]], zero4,
    ]);
    expect(result.activated).toEqual([
      [[3, 3, 3, 3], [3, 3, 3, 3], [0, 0, 0, 0], [0, 0, 0, 0]], zero4,
    ]);
    expect(result.pooled).toEqual([[[3, 3], [0, 0]], [[0, 0], [0, 0]]]);
    expect(result.scores).toEqual([1.5, -1.5]);
    expect(result.probabilities[0]).toBeCloseTo(.9525741268, 10);
    expect(result.probabilities[1]).toBeCloseTo(.0474258732, 10);
  });

  it('retains fixed 18 filter weights and two biases without mutating inputs or head', () => {
    expect(cnnFilters.map(f => f.kernel)).toEqual([
      [[-1, -1, -1], [0, 0, 0], [1, 1, 1]],
      [[-1, 0, 1], [-1, 0, 1], [-1, 0, 1]],
    ]);
    expect(cnnFilters.flatMap(f => f.kernel.flat())).toHaveLength(18);
    expect(cnnFilters.map(f => f.bias)).toEqual([0, 0]);
    expect(suppliedHead).toEqual({ weights: [
      [.25, .25, .25, .25, -.25, -.25, -.25, -.25],
      [-.25, -.25, -.25, -.25, .25, .25, .25, .25],
    ], biases: [0, 0] });
    const before = JSON.stringify({ visionPatterns, cnnFilters, suppliedHead });
    for (const pattern of visionPatterns) {
      const result = cnnForward(pattern.pixels);
      expect(result.probabilities.every(p => Number.isFinite(p) && p >= 0 && p <= 1)).toBe(true);
      expect(result.probabilities.reduce((a, b) => a + b, 0)).toBeCloseTo(1, 14);
      expect(result.convolution.flat(2).every(Number.isFinite)).toBe(true);
      result.convolution[0][0][0] = 999;
      result.features[0] = 999;
    }
    expect(JSON.stringify({ visionPatterns, cnnFilters, suppliedHead })).toBe(before);
  });

  it('uses stable softmax for large scores with a custom readonly head', () => {
    const result = cnnForward(visionPatterns[0].pixels, {
      weights: [Array(8).fill(0), Array(8).fill(0)], biases: [10000, 9997],
    });
    expect(result.scores).toEqual([10000, 9997]);
    expect(result.probabilities[0]).toBeCloseTo(.9525741268, 10);
    expect(result.probabilities.every(Number.isFinite)).toBe(true);
  });
});
