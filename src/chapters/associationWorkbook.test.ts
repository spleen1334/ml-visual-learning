import { describe, expect, it } from 'vitest'
import { APRIORI_ITEMS } from './aprioriItemFrequencies'
import {
  APRIORI_TRANSACTION_COUNT,
  APRIORI_TRANSACTIONS,
  MARKOV_CUSTOMER_STATES,
  MARKOV_RECORDS,
  calculateSelectedPair,
  filterAprioriTransactions,
  getMarkovOutcomeCounts,
  getMarkovTransitionCounts,
  getTopProductPrediction,
} from './associationWorkbook'

const workbookMatrix = [
  [71, 136, 138, 8, 11, 16, 9, 316],
  [70, 271, 401, 12, 31, 19, 20, 530],
  [72, 154, 29, 13, 44, 21, 11, 1139],
  [20, 15, 35, 173, 589, 747, 180, 125],
  [70, 29, 24, 163, 839, 20, 35, 1793],
  [27, 28, 37, 652, 83, 934, 962, 347],
  [27, 22, 35, 282, 133, 561, 953, 936],
]

describe('association workbook source data', () => {
  it('retains every Apriori record and calculates the actual source threshold counts', () => {
    expect(APRIORI_TRANSACTION_COUNT).toBe(9531)
    expect(APRIORI_TRANSACTIONS).toHaveLength(9531)
    expect(APRIORI_TRANSACTIONS[0].slice(0, 8)).toEqual([1, 42673, 0.41540509259259256, 'Bread', null, null, null, null])
    expect(APRIORI_ITEMS).toHaveLength(94)
    expect(filterAprioriTransactions(0.04)).toHaveLength(5238)
    expect(filterAprioriTransactions(0.2)).toHaveLength(2739)
  })

  it('reproduces the saved Coffee/Tea metrics and exposes the worksheet denominator mismatch', () => {
    const pair = calculateSelectedPair('Coffee', 'Tea')
    expect(pair.filteredTransactionCount).toBe(5238)
    expect(pair.jointCount).toBe(263)
    expect(pair.supportA).toBeCloseTo(0.4937572133, 9)
    expect(pair.supportB).toBeCloseTo(0.140908614, 9)
    expect(pair.jointSupport).toBeCloseTo(0.0502100038, 9)
    expect(pair.confidence).toBeCloseTo(0.1016896614, 9)
    expect(pair.lift).toBeCloseTo(0.7216710071, 9)
    expect(pair.denominator).toBe(5238)
  })

  it('reproduces all 56 Markov counts, preserves dash outcomes, and separates product prediction', () => {
    expect(MARKOV_RECORDS).toHaveLength(14418)
    expect(getMarkovTransitionCounts()).toEqual(workbookMatrix)
    const bikeOutcomes = getMarkovOutcomeCounts('bike')
    expect(bikeOutcomes.reduce((sum, row) => sum + row.count, 0)).toBe(705)
    expect(bikeOutcomes.find(({ outcome }) => outcome === '-')?.count).toBe(316)
    expect(getTopProductPrediction('bike')).toEqual({ outcome: 'bike speaker', count: 138 })
    expect(MARKOV_CUSTOMER_STATES).toHaveLength(7)
  })
})
