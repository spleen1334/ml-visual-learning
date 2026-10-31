import { describe, expect, it } from 'vitest'
import { evaluate, MAX_UPDATES, predict, rowLoss, sigmoid, trainingState, update } from './llmTrainingData'

describe('separate trained classifier', () => {
  it('matches the hand-computed initial loss, gradient and update', () => {
    const initial = trainingState(0)
    expect(evaluate(initial).loss).toBeCloseTo(Math.log(2), 12)
    expect(evaluate(initial).gradient).toEqual([-0.25, 0, 0])
    expect(update(initial)).toEqual([0.125, 0, 0])
  })
  it('matches finite differences for all three parameters', () => {
    const params = trainingState(3), epsilon = 1e-5
    const gradient = evaluate(params).gradient
    for (let i = 0; i < 3; i++) {
      const plus = [...params] as typeof params, minus = [...params] as typeof params
      plus[i] += epsilon; minus[i] -= epsilon
      expect((evaluate(plus).loss - evaluate(minus).loss) / (2 * epsilon)).toBeCloseTo(gradient[i], 8)
    }
  })
  it('recomputes deterministic finite states with decreasing in-sample loss', () => {
    expect(trainingState(0)).toEqual([0, 0, 0])
    expect(trainingState(5)).toEqual(trainingState(5))
    for (let i = 1; i <= MAX_UPDATES; i++) {
      expect(trainingState(i).every(Number.isFinite)).toBe(true)
      expect(evaluate(trainingState(i)).loss).toBeLessThan(evaluate(trainingState(i - 1)).loss)
    }
  })
  it('predicts a separate input without changing training and remains stable at extreme scores', () => {
    const params = trainingState(2), before = [...params]
    expect(predict(params, [0.5, 0.5]).p).toBeGreaterThan(0)
    expect(params).toEqual(before)
    expect(sigmoid(-1000)).toBe(0)
    expect(rowLoss(-1000, 1)).toBe(1000)
    expect(rowLoss(1000, 0)).toBe(1000)
  })
  it('rejects invalid shapes and domains', () => {
    expect(() => predict([0, 0] as never, [0, 0])).toThrow()
    expect(() => predict([0, 0, 0], [2, 0])).toThrow()
    expect(() => evaluate([0, 0, 0], [])).toThrow()
    expect(() => rowLoss(0, 2)).toThrow()
    expect(() => update([0, 0, 0], undefined, 0)).toThrow()
    expect(() => trainingState(9)).toThrow()
  })
})
