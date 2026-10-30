import { describe, expect, it } from 'vitest';
import { cnnFilters, cnnForward, type CNNHead } from './visionCNN';
import { evaluateHead, headGradient, heldOutPatterns, stepHead, trainingPatterns, trainHead, zeroHead } from './visionTraining';

const flatten = (head: CNNHead) => [...head.weights.flat(), ...head.biases];
const fromFlat = (values: number[]): CNNHead => ({ weights: [values.slice(0, 8), values.slice(8, 16)], biases: values.slice(16) });

describe('deterministic head-only training', () => {
  it('reproduces reference losses and all final parameters from zero', () => {
    expect(trainingPatterns.map(p => p.id)).toEqual(['H1', 'V1', 'H2', 'V2']);
    expect(heldOutPatterns.map(p => p.id)).toEqual(['H3', 'V3', 'H4', 'V4']);
    expect(flatten(zeroHead())).toEqual(Array(18).fill(0));
    const { head, history } = trainHead();
    expect(history).toHaveLength(201);
    for (const [epoch, loss] of [[0, .6931471805599453], [1, .6099361438973124], [10, .2711810589326533], [200, .016605757428318088]]) {
      expect(history[epoch].epoch).toBe(epoch);
      expect(history[epoch].trainLoss).toBeCloseTo(loss, 13);
    }
    const horizontal = [.3023263165000687, .3023263165000687, .3679856800623563, .3679856800623563, -.5358750280470677, -.377114109678589, -.5358750280470677, -.377114109678589];
    head.weights[0].forEach((value, index) => expect(value).toBeCloseTo(horizontal[index], 13));
    head.weights[1].forEach((value, index) => expect(value).toBeCloseTo(-horizontal[index], 13));
    expect(head.biases[0]).toBeCloseTo(.03819095917827112, 13);
    expect(head.biases[1]).toBeCloseTo(-.03819095917827109, 13);
    for (const record of history) {
      expect([record.trainLoss, record.testLoss, ...flatten(record.head)].every(Number.isFinite)).toBe(true);
    }
  });

  it('shows held-out probabilities and the zero-feature V4 failure', () => {
    const predictions = evaluateHead(trainHead().head, heldOutPatterns).predictions;
    const expected = [[.923790, .076210], [.435540, .564460], [.519086, .480914], [.519086, .480914]];
    predictions.forEach((p, index) => p.probabilities.forEach((value, output) => expect(value).toBeCloseTo(expected[index][output], 5)));
    expect(predictions.map(p => p.prediction)).toEqual(['horizontal', 'vertical', 'horizontal', 'horizontal']);
    expect(predictions[3].label).toBe('vertical');
    expect(predictions[2].features).toEqual(Array(8).fill(0));
    expect(predictions[3].features).toEqual(Array(8).fill(0));
    expect(evaluateHead(zeroHead(), heldOutPatterns).predictions.every(p => p.prediction === 'horizontal')).toBe(true);
  });

  it('matches central differences for all 18 parameters at zero and nonzero heads', () => {
    for (const head of [zeroHead(), fromFlat(Array.from({ length: 18 }, (_, index) => (index - 8) * .017))]) {
      const analytic = flatten(headGradient(head));
      const parameters = flatten(head);
      parameters.forEach((_, index) => {
        const plus = [...parameters];
        const minus = [...parameters];
        plus[index] += 1e-5;
        minus[index] -= 1e-5;
        const numeric = (evaluateHead(fromFlat(plus), trainingPatterns).loss - evaluateHead(fromFlat(minus), trainingPatterns).loss) / 2e-5;
        expect(Number.isFinite(analytic[index])).toBe(true);
        expect(Math.abs(numeric - analytic[index])).toBeLessThan(1e-7);
      });
    }
  });

  it('uses exactly the four training records, never held-out data or labels', () => {
    const head = fromFlat(Array.from({ length: 18 }, (_, index) => index * .01));
    const manual = Array(18).fill(0);
    for (const pattern of trainingPatterns) {
      const { features, probabilities } = cnnForward(pattern.pixels, head);
      for (let output = 0; output < 2; output++) {
        const error = probabilities[output] - Number(pattern.label === (output === 0 ? 'horizontal' : 'vertical'));
        features.forEach((feature, index) => { manual[output * 8 + index] += error * feature / 4; });
        manual[16 + output] += error / 4;
      }
    }
    flatten(headGradient(head)).forEach((value, index) => expect(value).toBeCloseTo(manual[index], 14));
    const expectedStep = flatten(head).map((value, index) => value - .05 * manual[index]);
    expect(flatten(stepHead(head))).toEqual(expectedStep);
    const original = heldOutPatterns.map(p => ({ label: p.label, pixels: p.pixels }));
    const before = trainHead(10);
    try {
      heldOutPatterns.forEach(p => { p.label = p.label === 'horizontal' ? 'vertical' : 'horizontal'; p.pixels = Array.from({ length: 6 }, () => Array(6).fill(7)); });
      const after = trainHead(10);
      expect(after.head).toEqual(before.head);
      expect(after.history.map(r => r.trainLoss)).toEqual(before.history.map(r => r.trainLoss));
    } finally {
      heldOutPatterns.forEach((p, index) => Object.assign(p, original[index]));
    }
  });

  it('resets deterministically, preserves inputs/filters, and keeps history heads independent', () => {
    const before = JSON.stringify({ cnnFilters, trainingPatterns, heldOutPatterns });
    const first = trainHead(10);
    expect(trainHead(10)).toEqual(first);
    expect(JSON.stringify({ cnnFilters, trainingPatterns, heldOutPatterns })).toBe(before);
    const initial = zeroHead();
    const snapshot = JSON.stringify(initial);
    headGradient(initial);
    evaluateHead(initial, trainingPatterns);
    stepHead(initial);
    expect(JSON.stringify(initial)).toBe(snapshot);
    expect(zeroHead().weights[0]).not.toBe(initial.weights[0]);
    first.history.slice(1).forEach((record, index) => {
      expect(record.head).not.toBe(first.history[index].head);
      expect(record.head.weights[0]).not.toBe(first.history[index].head.weights[0]);
      expect(record.head.biases).not.toBe(first.history[index].head.biases);
    });
  });

  it('computes finite cross-entropy even when target probabilities underflow', () => {
    const head = { weights: zeroHead().weights, biases: [10000, -10000] };
    expect(evaluateHead(head, trainingPatterns).loss).toBe(10000);
    expect(flatten(headGradient(head)).every(Number.isFinite)).toBe(true);
  });
});
