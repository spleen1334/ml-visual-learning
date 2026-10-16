import { describe, expect, it } from 'vitest'
import { boxStats, quantile } from './MultivariateDistributionsMath'

describe('box plot summaries', () => {
  it('uses linearly interpolated quartiles from sorted observations', () => {
    const values = [6, 2, 5, 1, 4, 3]
    expect(quantile(values, .25)).toBe(2.25)
    expect(quantile(values, .5)).toBe(3.5)
    expect(quantile(values, .75)).toBe(4.75)
    expect(values).toEqual([6, 2, 5, 1, 4, 3])
  })

  it('places whiskers on the furthest observed values within 1.5 IQR and flags points beyond', () => {
    const summary = boxStats([30, 6, 2, 5, 1, 4, 3])
    expect(summary).toMatchObject({ q1: 2.5, median: 4, q3: 5.5, iqr: 3, lowFence: -2, highFence: 10, lowWhisker: 1, highWhisker: 6, outliers: [30] })
  })
})
