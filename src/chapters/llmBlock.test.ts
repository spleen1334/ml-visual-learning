import { describe, expect, it } from 'vitest'
import { layerNormalize, linearRow, transformerBlock } from './llmBlock'

const closeRow = (actual: readonly number[], expected: readonly number[]) => {
  expect(actual).toHaveLength(expected.length)
  expected.forEach((x, i) => expect(actual[i]).toBeCloseTo(x, 9))
}
describe('post-norm transformer block', () => {
  it('matches an independently calculated first-token fixture', () => {
    const row = transformerBlock([0, 1, 2]).rows[0]
    expect(row.input).toEqual([1, 0, 1, 0])
    expect(row.attentionOutput).toEqual([1.4375, -0.5, -1.5625, 0.875])
    expect(row.residual1).toEqual([2.4375, -0.5, -0.5625, 0.875])
    expect(row.norm1.mean).toBe(0.5625)
    expect(row.norm1.variance).toBe(1.501953125)
    closeRow(row.norm1.output, [1.529930268469, -0.866960485466, -0.917958161081, 0.254988378078])
    closeRow(row.hidden, [-0.29323663479, -0.29323663479, 0.777714553138, -1.899663416682, -0.29323663479, 1.223944214775, 0.777714553138, -0.29323663479])
    closeRow(row.activated, [0, 0, 0.777714553138, 0, 0, 1.223944214775, 0.777714553138, 0])
    closeRow(row.ffOutput, [0.194428638285, 0.223114830818, -0.529100884512, -0.500414691978])
    closeRow(row.residual2, [1.724358906754, -0.643845654647, -1.447059045594, -0.2454263139])
    closeRow(row.norm2.output, [1.608548386188, -0.420571224912, -1.108778683858, -0.079198477418])
  })
  it('uses population variance and epsilon including a constant row', () => {
    const n = layerNormalize([1, 2, 3, 4])
    expect(n.mean).toBe(2.5); expect(n.variance).toBe(1.25); expect(n.epsilon).toBe(0.00001)
    expect(layerNormalize([2, 2, 2, 2]).output).toEqual([0, 0, 0, 0])
    expect(n.output[0]).toBeCloseTo(-1.5 / Math.sqrt(1.25001), 12)
  })
  it('keeps earlier outputs invariant to a later token', () => {
    const a = transformerBlock([0, 1, 2]), b = transformerBlock([0, 1, 3])
    expect(a.rows.slice(0, 2)).toEqual(b.rows.slice(0, 2))
    expect(a.rows[2].norm2.output).not.toEqual(b.rows[2].norm2.output)
    for (const row of a.rows) expect([...row.norm2.output, ...row.hidden].every(Number.isFinite)).toBe(true)
  })
  it('rejects invalid contexts, shapes and nonfinite values', () => {
    expect(() => transformerBlock([])).toThrow()
    expect(() => transformerBlock([0, 1, 2, 3, 4])).toThrow()
    expect(() => layerNormalize([1, 2, 3])).toThrow()
    expect(() => layerNormalize([1, 2, 3, Infinity])).toThrow()
    expect(() => layerNormalize([Number.MAX_VALUE, -Number.MAX_VALUE, 0, 0])).toThrow()
    expect(() => linearRow([1, 2], [[1], [1, 2]], [0])).toThrow()
    expect(() => linearRow([1], [[NaN]], [0])).toThrow()
    expect(() => linearRow([Number.MAX_VALUE], [[2]], [0])).toThrow()
  })
})
