import { describe, expect, it } from 'vitest'
import workbook from './sentimentWorkbookData.json'
import { predictSentiment } from './SentimentMath'

describe('sentiment workbook calculations', () => {
  it('preserves the workbook shape and applies its saved logistic coefficients', () => {
    expect(workbook.training).toHaveLength(47)
    expect(workbook.test).toHaveLength(7)
    expect(workbook.features).toHaveLength(25)
    expect(workbook.coefficients).toHaveLength(25)

    for (const row of [...workbook.training, ...workbook.test]) {
      expect(row.features).toHaveLength(25)
      const output = predictSentiment(row.features, workbook.coefficients, workbook.intercept)
      expect(output.probability).toBeCloseTo(row.probability, 10)
    }
  })

  it('reproduces the stored training likelihood objective', () => {
    const likelihood = workbook.training.reduce((sum, row) => {
      return sum + predictSentiment(row.features, workbook.coefficients, workbook.intercept, row.label).likelihood
    }, 0)
    expect(likelihood).toBeCloseTo(workbook.objective, 7)
  })

  it('retains the row 63 prediction of positive from the “great” feature', () => {
    const row = workbook.test.find(item => item.row === 63)!
    const output = predictSentiment(row.features, workbook.coefficients, workbook.intercept)
    expect(row.features[workbook.features.indexOf('great')]).toBe(1)
    expect(output.prediction).toBe(1)
    expect(output.probability).toBeGreaterThan(0.99)
  })
})
