import { describe, expect, it } from 'vitest'
import {
  coneCandidateSse,
  coneForecast,
  coneRows,
  logSpendModel,
  marketingRows,
  predictLogSpend,
  predictRawSpend,
  regressionSource,
  sumSquaredError,
} from './regressionWorkbookMath'

describe('Chapter 13 source workbook regression data', () => {
  it('preserves all 1,000 workbook rows and the source date endpoints', () => {
    expect(marketingRows).toHaveLength(1000)
    expect(marketingRows[0].date).toBe('2019-01-01')
    expect(marketingRows.at(-1)?.date).toBe('2021-09-26')
    expect(new Set(marketingRows.map(row => row.date)).size).toBe(1000)
  })

  it('reproduces logged spend and both cached worksheet predictions', () => {
    for (const row of marketingRows) {
      expect(row.logSpend).toBeCloseTo(Math.log(row.spend), 12)
      expect(predictRawSpend(row.spend)).toBeCloseTo(row.linearPrediction, 10)
      expect(predictLogSpend(row.spend)).toBeCloseTo(row.logPrediction, 10)
    }
  })

  it('reconciles each full-record SSE to its regression output table', () => {
    const rawSse = sumSquaredError(marketingRows.map(row => row.revenue), marketingRows.map(row => row.linearPrediction))
    const logSse = sumSquaredError(marketingRows.map(row => row.revenue), marketingRows.map(row => row.logPrediction))
    expect(rawSse).toBeCloseTo(Number(regressionSource.nonlinear.linear.anova.rows[1][2]), 5)
    expect(logSse).toBeCloseTo(Number(regressionSource.nonlinear.log.anova.rows[1][2]), 5)
  })

  it('retains the ten Cone Zone source dates and the workbook defaults', () => {
    expect(coneRows).toHaveLength(10)
    expect(coneRows.map(row => row.date)).toEqual([
      '2020-02-15', '2020-03-24', '2020-04-11', '2020-05-16', '2020-07-20',
      '2020-08-02', '2020-09-09', '2020-07-10', '2020-07-16', '2020-08-30',
    ])
    expect(coneCandidateSse(2, 0.78)).toBeCloseTo(773.25, 10)
    expect(coneForecast(35)).toBeCloseTo(35.22, 10)
  })

  it('requires positive spend for the log-spend model', () => {
    expect(logSpendModel.intercept).toBeCloseTo(2.207519726896976, 12)
    expect(() => predictLogSpend(0)).toThrow(RangeError)
    expect(() => sumSquaredError([1], [])).toThrow(RangeError)
  })
})
