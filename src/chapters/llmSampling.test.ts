import { describe, expect, it } from 'vitest'
import { categoricalIndex, cumulativeIntervals, greedyIndex, nextSeededDraw, temperatureDistribution } from './llmSamplingData'
import { lastDecoderDistribution } from './llmLogitsData'

describe('temperature and seeded sampling', () => {
  const logits = lastDecoderDistribution([0, 1, 2]).logits
  it('sharpens and flattens the fixed actual distribution', () => {
    const cold = temperatureDistribution(logits, 0.5), normal = temperatureDistribution(logits, 1), warm = temperatureDistribution(logits, 2)
    expect(normal.scaled).toEqual(logits)
    for (const d of [cold, normal, warm]) { expect(d.probabilities.reduce((a, b) => a + b, 0)).toBeCloseTo(1, 14); expect(d.probabilities.every(p => p >= 0)).toBe(true) }
    expect(cold.probabilities[0]).toBeGreaterThan(normal.probabilities[0])
    expect(normal.probabilities[0]).toBeGreaterThan(warm.probabilities[0])
    expect(cold.probabilities[4]).toBeLessThan(normal.probabilities[4])
    expect(normal.probabilities[4]).toBeLessThan(warm.probabilities[4])
    expect(greedyIndex(logits)).toBe(0)
    expect(greedyIndex([2, 1, 2])).toBe(0)
  })
  it('replays the same unsigned seed sequence with golden draws', () => {
    const first = nextSeededDraw(42), second = nextSeededDraw(first.state)
    expect(first).toEqual({ state: 1083814273, draw: 1083814273 / 4294967296 })
    expect(second).toEqual({ state: 378494188, draw: 378494188 / 4294967296 })
    expect(nextSeededDraw(42)).toEqual(first)
    expect(categoricalIndex(temperatureDistribution(logits, 1).probabilities, first.draw)).toBe(0)
  })
  it('uses half-open intervals and skips zero-probability tokens', () => {
    const p = [0, 0.25, 0, 0.75, 0]
    expect(cumulativeIntervals(p)).toEqual([{ start: 0, end: 0 }, { start: 0, end: 0.25 }, { start: 0.25, end: 0.25 }, { start: 0.25, end: 1 }, { start: 1, end: 1 }])
    expect(categoricalIndex(p, 0)).toBe(1)
    expect(categoricalIndex(p, 0.25)).toBe(3)
    expect(categoricalIndex(p, 1 - Number.EPSILON)).toBe(3)
    expect(categoricalIndex([0.1, 0.2, 0.7, 0], 1 - Number.EPSILON)).toBe(2)
  })
  it('rejects invalid domains and scaling overflow', () => {
    for (const t of [0, -1, NaN, Infinity, Number.MIN_VALUE]) expect(() => temperatureDistribution([1], t)).toThrow()
    expect(() => temperatureDistribution([], 1)).toThrow()
    expect(() => temperatureDistribution([NaN], 1)).toThrow()
    for (const s of [-1, 0.5, 4294967296, NaN]) expect(() => nextSeededDraw(s)).toThrow()
    for (const u of [-1, 1, NaN]) expect(() => categoricalIndex([1], u)).toThrow()
    expect(() => cumulativeIntervals([0, 0])).toThrow()
    expect(() => cumulativeIntervals([0.5, -0.1])).toThrow()
    expect(() => greedyIndex([])).toThrow()
  })
})
