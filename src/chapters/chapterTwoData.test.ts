import { describe, expect, it } from 'vitest'
import {
  average,
  fitStraightLine,
  nextLinearTrend,
  pairedStoreValues,
  PROCESS_DATA,
  salesHistogram,
} from './chapterTwoData'

describe('chapter two numeric examples', () => {
  it('uses the shared mean behavior for ordinary, singleton, empty, and invalid data', () => {
    expect(average([40, 44, 43, 50, 54])).toBeCloseTo(46.2)
    expect(average([7])).toBe(7)
    expect(() => average([])).toThrow(RangeError)
    expect(() => average([1, Number.NaN])).toThrow(RangeError)
  })

  it('fits the known monthly trend and rejects an empty trend', () => {
    expect(nextLinearTrend([40, 44, 43, 50, 54])).toBeCloseTo(56.4)
    expect(nextLinearTrend([12])).toBe(12)
    expect(() => nextLinearTrend([])).toThrow(RangeError)
  })

  it('fits a least-squares line to paired observations', () => {
    const fit = fitStraightLine([1, 2, 3], [2, 4, 6])
    expect(fit.slope).toBe(2)
    expect(fit.intercept).toBe(0)
    expect(() => fitStraightLine([], [])).toThrow(RangeError)
    expect(() => fitStraightLine([1, 2], [3])).toThrow(RangeError)
  })

  it('keeps a missing promotion value out of paired comparisons but in the sales histogram', () => {
    expect(pairedStoreValues(PROCESS_DATA)).toHaveLength(5)
    expect(pairedStoreValues(PROCESS_DATA).some((row) => row.month === 'Nov')).toBe(false)
    expect(salesHistogram(PROCESS_DATA.map((row) => row.sales)).map((bin) => bin.count)).toEqual([3, 2, 1])
  })
})
