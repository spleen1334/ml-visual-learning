import { describe, expect, it } from 'vitest'
import {
  CATEGORIES,
  CATEGORY_FIXES,
  INITIAL_QA,
  inventoryMetrics,
  ISSUE_ROWS,
  prepareInventory,
  RAW_INVENTORY,
} from './qaData'

describe('Chapter 04 preliminary QA inventory', () => {
  it('preserves the workbook baseline and its profiling totals', () => {
    const metrics = inventoryMetrics(prepareInventory(INITIAL_QA))

    expect(RAW_INVENTORY).toHaveLength(100)
    expect(CATEGORIES).toHaveLength(10)
    expect(metrics).toMatchObject({
      records: 100,
      priceCount: 100,
      missingPrices: 0,
      minPrice: 0,
      maxPrice: 375,
      priceSum: 591.44,
      earliestDate: '2020-01-01',
      latestDate: '2020-04-28',
      recognizedCategories: 96,
      distinctCategories: 14,
    })
    expect(metrics.meanPrice).toBeCloseTo(5.9144, 12)
    expect(metrics.categoryCounts.find((entry) => entry.category === 'Frozen Foods')?.count).toBe(11)
    expect(metrics.categoryCounts.find((entry) => entry.category === 'Frozen Food')?.count).toBe(1)
  })

  it('applies only the exact workbook issue rows when their QA switch is enabled', () => {
    expect(ISSUE_ROWS).toEqual({
      missing: [11, 19, 24, 25, 36, 53, 85, 98],
      dates: Array.from({ length: 15 }, (_value, index) => index + 89),
      identifiers: [],
      price: [34],
      categories: [24, 29, 42, 71],
    })
    expect(CATEGORY_FIXES).toEqual({
      '24': 'Cookies, Snacks & Candy',
      '29': 'Frozen Foods',
      '42': 'Fruits & Vegetables',
      '71': 'Canned Goods & Soups',
    })

    const rows = prepareInventory({ ...INITIAL_QA, missing: true })
    expect(rows.filter((row) => row.price === null).map((row) => row.row)).toEqual(ISSUE_ROWS.missing)
    expect(rows.find((row) => row.row === 10)?.price).toBe(1.4)
    expect(rows.find((row) => row.row === 34)?.price).toBe(375)
  })

  it('cleans dates, identifiers, outlier price, and categories independently', () => {
    const dated = prepareInventory({ ...INITIAL_QA, dates: true })
    expect(dated.find((row) => row.row === 89)).toMatchObject({ stockDate: '2020-05-03', dateIsText: false })
    expect(dated.find((row) => row.row === 103)).toMatchObject({ stockDate: '2020-05-30', dateIsText: false })
    expect(dated.filter((row) => row.dateIsText)).toHaveLength(0)
    expect(inventoryMetrics(dated).latestDate).toBe('2020-05-30')
    expect(inventoryMetrics(prepareInventory(INITIAL_QA)).latestDate).toBe('2020-04-28')

    expect(prepareInventory({ ...INITIAL_QA, identifiers: true })[0].sku).toBe('10660')
    expect(typeof prepareInventory(INITIAL_QA)[0].sku).toBe('number')

    const priced = prepareInventory({ ...INITIAL_QA, price: true })
    expect(priced.find((row) => row.row === 34)?.price).toBe(3.75)
    expect(priced.find((row) => row.row === 33)?.price).toBe(3.18)

    const categorized = prepareInventory({ ...INITIAL_QA, categories: true })
    expect(ISSUE_ROWS.categories.map((row) => categorized.find((entry) => entry.row === row)?.category))
      .toEqual(Object.values(CATEGORY_FIXES))
    expect(inventoryMetrics(categorized).recognizedCategories).toBe(100)
  })

  it('matches the combined cleaned profile and handles empty metric inputs', () => {
    const cleaned = prepareInventory({
      missing: true,
      dates: true,
      identifiers: true,
      price: true,
      categories: true,
    })
    const metrics = inventoryMetrics(cleaned)

    expect(metrics).toMatchObject({
      records: 100,
      priceCount: 92,
      missingPrices: 8,
      minPrice: 1.13,
      maxPrice: 8.99,
      latestDate: '2020-05-30',
      recognizedCategories: 100,
      distinctCategories: 10,
    })
    expect(metrics.meanPrice).toBeCloseTo(2.393369565217391, 12)
    expect(inventoryMetrics([])).toMatchObject({
      records: 0,
      priceCount: 0,
      missingPrices: 0,
      minPrice: null,
      maxPrice: null,
      meanPrice: null,
      priceSum: 0,
      earliestDate: null,
      latestDate: null,
      recognizedCategories: 0,
      distinctCategories: 0,
      categoryCounts: [],
    })
  })
})
