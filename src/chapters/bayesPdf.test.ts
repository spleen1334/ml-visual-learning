import { describe, expect, it } from 'vitest'
import { pdfBayesCustomers, pdfBayesCount, pdfBayesScore } from './bayesPdf'

describe('PDF ten-customer Naive Bayes example', () => {
  it('preserves the PDF frequency tables and balanced classes', () => {
    expect(pdfBayesCustomers).toHaveLength(10)
    expect(pdfBayesCustomers.filter(row => row.purchase === 1)).toHaveLength(5)
    for (const [feature, expected] of [
      ['newsletter', [[3, 4], [2, 1]]],
      ['facebook', [[4, 1], [1, 4]]],
      ['website', [[3, 2], [2, 3]]],
    ] as const) {
      expect([1, 0].map(value => [1, 0].map(purchase => pdfBayesCount(feature, value as 0 | 1, purchase as 0 | 1)))).toEqual(expected)
    }
  })

  it('reproduces the two products and normalized 0/1/1 prediction', () => {
    expect(pdfBayesScore(1)).toBeCloseTo(0.096)
    expect(pdfBayesScore(0)).toBeCloseTo(0.008)
    expect(100 * pdfBayesScore(1) / (pdfBayesScore(1) + pdfBayesScore(0))).toBeCloseTo(92.3076923)
  })
})
