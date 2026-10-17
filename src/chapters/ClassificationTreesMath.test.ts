import { describe, expect, it } from 'vitest'
import { binaryEntropy, weightedEntropyGain } from './ClassificationTreesMath'

describe('decision tree entropy calculations', () => {
  it('returns zero for an empty or pure group, without evaluating log2(0)', () => {
    expect(binaryEntropy(0, 0)).toBe(0)
    expect(binaryEntropy(0, 12)).toBe(0)
    expect(binaryEntropy(12, 12)).toBe(0)
  })

  it('reaches one bit for a balanced binary group', () => {
    expect(binaryEntropy(10, 20)).toBe(1)
  })

  it('weights child entropy by each branch size when computing gain', () => {
    const gain = weightedEntropyGain(10, 20, [{ positive: 4, total: 12 }, { positive: 6, total: 8 }])
    expect(gain).toBeCloseTo(0.125, 3)
  })

  it('returns zero gain when the split preserves the parent class mix', () => {
    expect(weightedEntropyGain(10, 20, [{ positive: 5, total: 10 }, { positive: 5, total: 10 }])).toBe(0)
  })
})
