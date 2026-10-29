import { describe, expect, it } from 'vitest'
import { stableSoftmax } from './llmAttention'
import { lastDecoderDistribution, logitsFromHidden } from './llmLogits'

const near = (actual: readonly number[], expected: readonly number[]) => {
  expect(actual).toHaveLength(expected.length)
  expected.forEach((x, i) => expect(actual[i]).toBeCloseTo(x, 10))
}
describe('decoder logits and softmax', () => {
  it('matches independently calculated last-token decoder fixture', () => {
    const result = lastDecoderDistribution([0, 1, 2])
    near(result.hidden, [-0.355100919479, 1.662450893320, -0.296691870927, -1.010658102914])
    near(result.logits, [0.815682086265, -0.324955296946, 0.296471312142, 0.815682086265, -2.093606977045])
    near(result.probabilities, [0.336800168341, 0.107646466465, 0.200392713360, 0.336800168341, 0.018360483493])
    expect(result.probabilities.reduce((a, b) => a + b, 0)).toBeCloseTo(1, 14)
    expect(result.probabilities.every(p => p >= 0 && Number.isFinite(p))).toBe(true)
    expect(logitsFromHidden([1, 0, 0, 0]).logits).toEqual([0, 0.5, -0.75, -0.25, 0.25])
  })
  it('normalizes scores, preserves order and survives large common shifts', () => {
    near(stableSoftmax([0, 1, 2]), [0.090030573170, 0.244728471055, 0.665240955775])
    near(stableSoftmax([1000, 1001, 1002]), stableSoftmax([0, 1, 2]))
    near(stableSoftmax([4, 4, 4, 4, 4]), [0.2, 0.2, 0.2, 0.2, 0.2])
    const extreme = stableSoftmax([10000, 0, -10000])
    expect(extreme).toEqual([1, 0, 0])
    expect(extreme.every(Number.isFinite)).toBe(true)
    const p = stableSoftmax([-2, 0, 3]); expect(p[0]).toBeLessThan(p[1]); expect(p[1]).toBeLessThan(p[2])
  })
  it('rejects malformed rows, contexts and scores', () => {
    expect(() => logitsFromHidden([1, 2])).toThrow()
    expect(() => logitsFromHidden([0, 0, NaN, 0])).toThrow()
    expect(() => lastDecoderDistribution([])).toThrow()
    expect(() => lastDecoderDistribution([0, 1, 2, 3, 4])).toThrow()
    expect(() => stableSoftmax([])).toThrow()
    expect(() => stableSoftmax([0, Infinity])).toThrow()
  })
})
