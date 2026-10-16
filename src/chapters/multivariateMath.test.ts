import { describe, expect, it } from 'vitest'
import { pearsonCorrelation } from './multivariateMath'
import { correlationWorkbookRows } from './multivariateNumericalData'

describe('pearsonCorrelation', () => {
  it('returns signed strength for increasing, decreasing and unrelated pairs', () => {
    expect(pearsonCorrelation([1, 2, 3], [2, 4, 6])).toBeCloseTo(1)
    expect(pearsonCorrelation([1, 2, 3], [6, 4, 2])).toBeCloseTo(-1)
    expect(pearsonCorrelation([1, 2, 3, 4], [2, 4, 3, 1])).toBeCloseTo(-0.4)
  })

  it('returns null when correlation is undefined or the paired data are invalid', () => {
    expect(pearsonCorrelation([], [])).toBeNull()
    expect(pearsonCorrelation([1], [2])).toBeNull()
    expect(pearsonCorrelation([1, 1], [2, 3])).toBeNull()
    expect(pearsonCorrelation([1, 2], [3])).toBeNull()
    expect(pearsonCorrelation([1, Number.NaN], [2, 3])).toBeNull()
  })

  it('reproduces the relationships in all 1,000 workbook rows', () => {
    expect(correlationWorkbookRows).toHaveLength(1000)
    const digitalSpend = correlationWorkbookRows.map(row => row[1])
    expect(pearsonCorrelation(digitalSpend, correlationWorkbookRows.map(row => row[2]))).toBeCloseTo(0.900530773, 7)
    expect(pearsonCorrelation(digitalSpend, correlationWorkbookRows.map(row => row[3]))).toBeCloseTo(-0.900526456, 7)
    expect(pearsonCorrelation(digitalSpend, correlationWorkbookRows.map(row => row[4]))).toBeCloseTo(0.963741486, 7)
    expect(pearsonCorrelation(digitalSpend, correlationWorkbookRows.map(row => row[5]))).toBeCloseTo(-0.015882542, 7)
  })

  it('shows why Pearson r can miss a strong curved relationship', () => {
    expect(pearsonCorrelation([-2, -1, 0, 1, 2], [4, 1, 0, 1, 4])).toBeCloseTo(0)
  })
})
