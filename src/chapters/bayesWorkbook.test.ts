import { describe, expect, it } from 'vitest'
import {
  bayesWorkbookCustomers, bayesWorkbookDefaultInput, calculateBayesWorkbook, type BayesWorkbookInput,
} from './bayesWorkbook'

describe('Naive Bayes workbook parity', () => {
  it('preserves all 20 source rows, frequency tables, totals, priors and saved defaults', () => {
    expect(bayesWorkbookCustomers.map(customer => customer.id)).toEqual(Array.from({ length: 20 }, (_, index) => index + 1))
    expect(bayesWorkbookDefaultInput).toEqual({ newsletter: true, facebook: true, website: false })
    const result = calculateBayesWorkbook(bayesWorkbookDefaultInput)
    expect(result.classes.map(group => group.total)).toEqual([6, 14])
    expect(result.classes.map(group => group.prior)).toEqual([.3, .7])
    expect(result.classes.map(group => group.features.map(feature => feature.counts))).toEqual([
      [[4, 2], [4, 2], [5, 1]], [[2, 12], [6, 8], [6, 8]],
    ])
    expect(result.classes[0].features.map(feature => feature.probabilities)).toEqual([[4 / 6, 2 / 6], [4 / 6, 2 / 6], [5 / 6, 1 / 6]])
    expect(result.classes[1].features.map(feature => feature.probabilities)).toEqual([[2 / 14, 12 / 14], [6 / 14, 8 / 14], [6 / 14, 8 / 14]])
    // Cached source values O6, O13 and N20 from the saved worksheet.
    expect(result.classes[0].raw).toBeCloseTo(.02222222222222222, 15)
    expect(result.classes[1].raw).toBeCloseTo(.024489795918367342, 15)
    expect(result.purchaseProbability).toBeCloseTo(.47572815533980584, 15)
  })

  // Independently calculated exact fractions from the source frequency tables.
  it.each([
    [false, false, false, 1 / 180, 48 / 245, 49 / 1777],
    [false, false, true, 1 / 36, 36 / 245, 245 / 1541],
    [false, true, false, 1 / 90, 36 / 245, 49 / 697],
    [false, true, true, 1 / 18, 27 / 245, 245 / 731],
    [true, false, false, 1 / 90, 8 / 245, 49 / 193],
    [true, false, true, 1 / 18, 6 / 245, 245 / 353],
    [true, true, false, 1 / 45, 6 / 245, 49 / 103],
    [true, true, true, 1 / 9, 9 / 490, 490 / 571],
  ])('matches Newsletter=%s Facebook=%s Website=%s', (newsletter, facebook, website, purchase, noPurchase, normalized) => {
    const input: BayesWorkbookInput = { newsletter, facebook, website }
    const result = calculateBayesWorkbook(input)
    expect(result.classes[0].raw).toBeCloseTo(purchase, 15)
    expect(result.classes[1].raw).toBeCloseTo(noPurchase, 15)
    expect(result.purchaseProbability).toBeCloseTo(normalized, 15)
    result.classes.forEach(group => expect(group.features.map(feature => feature.selectedValue)).toEqual([+newsletter, +facebook, +website]))
  })

  it('derives counts and likelihoods from the supplied source rows', () => {
    const result = calculateBayesWorkbook({ newsletter: true, facebook: true, website: true }, [
      { id: 1, newsletter: 1, facebook: 1, website: 1, purchase: 1 },
      { id: 2, newsletter: 0, facebook: 0, website: 0, purchase: 1 },
      { id: 3, newsletter: 1, facebook: 1, website: 1, purchase: 0 },
      { id: 4, newsletter: 1, facebook: 0, website: 1, purchase: 0 },
    ])
    expect(result.classes.map(group => group.raw)).toEqual([1 / 16, 1 / 4])
    expect(result.purchaseProbability).toBe(.2)
  })
})
