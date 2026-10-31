import { describe, expect, it } from 'vitest'
import { causalAttention, projectAttentionOutput } from './llmCausalAttentionData'
import { lastTokenAttention } from './llmAttentionData'

describe('causal two-head attention', () => {
  it('matches a hand-computed first row and output projection', () => {
    const result = causalAttention([0, 1, 2])
    expect(result.heads[0].rows[0].weights).toEqual([1, 0, 0])
    expect(result.heads[1].rows[0].weights).toEqual([1, 0, 0])
    expect(result.heads[0].rows[0].output).toEqual([-0.25, 0.75])
    expect(result.heads[1].rows[0].output).toEqual([1.25, -1.25])
    expect(result.combined[0].concatenated).toEqual([-0.25, 0.75, 1.25, -1.25])
    expect(result.combined[0].projected).toEqual([1.4375, -0.5, -1.5625, 0.875])
  })
  it('normalizes allowed prefix and blocks the future in both heads', () => {
    const result = causalAttention([0, 1, 2])
    for (const head of result.heads) head.rows.forEach((row, i) => {
      expect(row.weights.slice(i + 1)).toEqual(Array(2 - i).fill(0))
      expect(row.weights.reduce((a, b) => a + b, 0)).toBeCloseTo(1, 14)
      expect(row.weights[i]).toBeGreaterThan(0)
    })
    expect(result.heads[0].rows[2].output).toEqual(lastTokenAttention([0, 1, 2]).output)
  })
  it('preserves earlier outputs when a future token changes', () => {
    const a = causalAttention([0, 1, 2]), b = causalAttention([0, 1, 3])
    for (let h = 0; h < 2; h++) for (let i = 0; i < 2; i++) {
      expect(a.heads[h].rows[i].weights).toEqual(b.heads[h].rows[i].weights)
      expect(a.heads[h].rows[i].output).toEqual(b.heads[h].rows[i].output)
      expect(a.combined[i]).toEqual(b.combined[i])
    }
    expect(a.combined[2].projected).not.toEqual(b.combined[2].projected)
  })
  it('validates context and output shape', () => {
    expect(() => causalAttention([])).toThrow()
    expect(() => causalAttention([0, 1, 2, 3, 4])).toThrow()
    expect(() => causalAttention([0, 99])).toThrow()
    expect(() => projectAttentionOutput([1, 2])).toThrow()
    expect(() => projectAttentionOutput([1, 2, NaN, 4])).toThrow()
  })
})
