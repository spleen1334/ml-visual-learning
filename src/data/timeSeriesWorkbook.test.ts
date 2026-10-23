import { describe, expect, it } from 'vitest'
import { timeSeriesWorkbook } from './timeSeriesWorkbook'
import { timeSeriesWorkbookSourceGrids } from './timeSeriesWorkbookGrid'

const near = (actual: number | null, expected: number, digits = 9) => {
  expect(actual).not.toBeNull()
  expect(actual!).toBeCloseTo(expected, digits)
}

describe('Chapter 15 workbook extraction', () => {
  it('keeps every source observation and the blank forecast targets', () => {
    expect(timeSeriesWorkbook.autoCorrelation.observations).toHaveLength(120)
    expect(timeSeriesWorkbook.oneHotEncoding.observations).toHaveLength(72)
    expect(timeSeriesWorkbook.oneHotEncoding.observations.filter(row => row.temperatureC !== null)).toHaveLength(58)
    expect(timeSeriesWorkbook.seasonalityTrend.observations).toHaveLength(132)
    expect(timeSeriesWorkbook.seasonalityTrend.observations.filter(row => row.revenueMM !== null)).toHaveLength(118)
    expect(timeSeriesWorkbook.seasonalityTrend.observations.slice(-14).every(row => row.revenueMM === null)).toBe(true)
    expect(timeSeriesWorkbook.smoothing.observations).toHaveLength(1095)
    expect(timeSeriesWorkbook.nonLinearTrend.observations).toHaveLength(24)
    expect(timeSeriesWorkbook.nonLinearTrend.observations.filter(row => row.unitsSold !== null)).toHaveLength(8)
    expect(timeSeriesWorkbook.interventionAnalysis.observations).toHaveLength(91)
    expect(timeSeriesWorkbook.interventionAnalysis.observations.slice(0, 66).every(row => row.landingPage === 'Original')).toBe(true)
    expect(timeSeriesWorkbook.interventionAnalysis.observations.slice(66).every(row => row.landingPage === 'New')).toBe(true)
  })

  it('preserves ACF values and the source default for the smoothing selector', () => {
    expect(timeSeriesWorkbook.autoCorrelation.autocorrelation).toHaveLength(36)
    expect(timeSeriesWorkbook.autoCorrelation.autocorrelation[0].lag).toBe(1)
    near(timeSeriesWorkbook.autoCorrelation.autocorrelation[0].correlation, 0.6063759310920478)
    near(timeSeriesWorkbook.autoCorrelation.autocorrelation.find(point => point.lag === 12)?.correlation ?? null, 0.9820883113083245)
    expect(timeSeriesWorkbook.smoothing.selectedWindowDefault).toBe('2-Week')
    const smoothing = timeSeriesWorkbook.smoothing.observations
    expect(smoothing[0].date).toBe('2017-01-01')
    near(smoothing[3].ma1Week, smoothing.slice(0, 7).reduce((sum, row) => sum + row.averageRating, 0) / 7)
    expect(smoothing.at(-1)?.ma1Week).toBeNull()
  })

  it('recomputes all lag correlations from overlapping monthly observations', () => {
    const values = timeSeriesWorkbook.autoCorrelation.observations.map(row => row.searchVolume)
    for (const point of timeSeriesWorkbook.autoCorrelation.autocorrelation) {
      const current = values.slice(point.lag), lagged = values.slice(0, -point.lag)
      const meanX = current.reduce((sum, n) => sum + n, 0) / current.length
      const meanY = lagged.reduce((sum, n) => sum + n, 0) / lagged.length
      let xy = 0, xx = 0, yy = 0
      current.forEach((n, i) => { const x = n - meanX, y = lagged[i] - meanY; xy += x * y; xx += x * x; yy += y * y })
      near(point.correlation, xy / Math.sqrt(xx * yy))
    }
  })

  it('reconstructs the one-hot monthly predictions from the workbook coefficients', () => {
    const data = timeSeriesWorkbook.oneHotEncoding
    const coefficient = new Map(data.coefficients.map(row => [row.term, row.coefficient]))
    for (const row of data.observations) {
      const monthAdjustment = row.month === 'Jan' ? 0 : coefficient.get(row.month)!
      near(row.predictionC, coefficient.get('Intercept')! + monthAdjustment)
    }
    expect(data.chartToggleDefault).toBe(1)
  })

  it('reconstructs both gym revenue forecasts and preserves the full 14-month horizon', () => {
    const data = timeSeriesWorkbook.seasonalityTrend
    const noTrend = new Map(data.noTrendCoefficients.map(row => [row.term, row.coefficient]))
    const withTrend = new Map(data.trendCoefficients.map(row => [row.term, row.coefficient]))
    for (const row of data.observations) {
      const monthly = row.month === 'Dec' ? 0 : noTrend.get(row.month)!
      near(row.forecastNoTrendMM, noTrend.get('Intercept')! + monthly)
      const trendMonthly = row.month === 'Dec' ? 0 : withTrend.get(row.month)!
      near(row.forecastTrendMM, withTrend.get('Intercept')! + trendMonthly + withTrend.get('Tstep')! * row.step)
    }
    expect(data.regressionSummary.noTrend.observations).toBe(118)
    expect(data.regressionSummary.noTrend.adjustedRSquare).toBeCloseTo(-0.011640291902404041, 12)
    expect(data.observations.slice(-2).map(row => row.month)).toEqual(['Nov', 'Dec'])
    expect(data.observations.at(-1)?.year).toBe(2020)
  })

  it('matches each cached nonlinear model value and the source SSE over observed weeks only', () => {
    const data = timeSeriesWorkbook.nonLinearTrend
    const { A, B, C } = data.parameters
    let sse = 0
    for (const row of data.observations) {
      const model = A * Math.exp(-B * row.week * Math.exp(-C * row.week))
      near(row.modelUnits, model)
      if (row.unitsSold !== null) {
        const squaredError = (model - row.unitsSold) ** 2
        near(row.squaredError, squaredError)
        sse += squaredError
      }
    }
    near(data.sumSquaredError, sse)
    near(data.sumSquaredError, 850490.7208382974)
  })

  it('reconstructs intervention forecasts and conversion-impact calculations', () => {
    const data = timeSeriesWorkbook.interventionAnalysis
    const coefficients = new Map(data.coefficients.map(row => [row.term, row.coefficient]))
    for (const row of data.observations) {
      const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as const
      const weekdayEffect = row.weekdayDummies.reduce<number>((sum, flag, index) => sum + flag * coefficients.get(weekdays[index]!)!, 0)
      near(row.forecast, coefficients.get('Intercept')! + weekdayEffect + coefficients.get('T-Step')! * row.timeStep)
    }
    let cumulative = 0
    for (const row of data.observations.slice(66)) {
      const incremental = row.sessions * (row.conversionRate - row.forecast)
      cumulative += incremental
      near(row.incremental, incremental)
      near(row.cumulative, cumulative)
    }
    expect(data.regressionSummary.observations).toBe(66)
    expect(data.showForecastDefault).toBe(1)
  })

  it('retains all worksheet columns, cached values and formula metadata for reconstruction', () => {
    expect(timeSeriesWorkbookSourceGrids.autoCorrelation.range).toBe('B1:BH123')
    expect(timeSeriesWorkbookSourceGrids.smoothing.cells['C4']).toBe(6.91395557988749)
    expect(timeSeriesWorkbookSourceGrids.smoothing.formulas.D7).toBe('AVERAGE($C4:$C10)')
    expect(timeSeriesWorkbookSourceGrids.oneHotEncoding.cells['D4']).toBe(0)
    expect(timeSeriesWorkbookSourceGrids.oneHotEncoding.formulaAttributes.D4?.si).toBeDefined()
    expect(timeSeriesWorkbookSourceGrids.interventionAnalysis.cells['N70']).toBeCloseTo(5.355779390878723)
  })
})
