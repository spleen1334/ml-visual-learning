import { describe, expect, it } from 'vitest'
import {
  accidentDayTotals,
  accidentFrequencyByDayHour,
  accidentHourTotals,
  accidentTotal,
  inventoryCounts,
} from './MultivariateCategories'

describe('Chapter 6 categorical frequency fixtures', () => {
  it('preserves the 25-cell product table and its 638-record total', () => {
    expect(inventoryCounts).toHaveLength(5)
    expect(inventoryCounts.every((row) => row.length === 5)).toBe(true)
    expect(inventoryCounts.flat().reduce((sum, count) => sum + count, 0)).toBe(638)
  })

  it('keeps all 168 accident counts consistent with workbook margins', () => {
    expect(accidentFrequencyByDayHour).toHaveLength(7)
    expect(accidentFrequencyByDayHour.every((row) => row.length === 24)).toBe(true)
    expect(accidentFrequencyByDayHour.map((row) => row.reduce((sum, count) => sum + count, 0))).toEqual(accidentDayTotals)
    expect(accidentFrequencyByDayHour[0].map((_, hour) => accidentFrequencyByDayHour.reduce((sum, row) => sum + row[hour], 0))).toEqual(accidentHourTotals)
    expect(accidentDayTotals.reduce((sum, count) => sum + count, 0)).toBe(accidentTotal)
    expect(accidentHourTotals.reduce((sum, count) => sum + count, 0)).toBe(accidentTotal)
  })
})
