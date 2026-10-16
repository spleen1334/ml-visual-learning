import inventoryData from './qaInventory.json'

export type QAState = {
  missing: boolean
  dates: boolean
  identifiers: boolean
  price: boolean
  categories: boolean
}

export type InventoryRecord = {
  row: number
  stockDate: string
  dateIsText: boolean
  product: string
  category: string
  sku: number | string
  price: number
  units: number
  discounted: number
}

export type PreparedInventoryRecord = Omit<InventoryRecord, 'price'> & {
  price: number | null
}

export const INITIAL_QA: QAState = {
  missing: false,
  dates: false,
  identifiers: false,
  price: false,
  categories: false,
}

export const RAW_INVENTORY: readonly InventoryRecord[] = inventoryData.records
export const CATEGORIES: readonly string[] = inventoryData.categories

export const ISSUE_ROWS = inventoryData.issueRows
export const CATEGORY_FIXES: Readonly<Record<string, string>> = inventoryData.categoryFixes

function parseTextDate(value: string): string {
  const match = /^(\d{1,2})-([A-Za-z]{3})-(\d{2})$/.exec(value)
  if (!match) return value

  const months: Record<string, string> = {
    Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
    Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12',
  }
  const month = months[match[2]]
  if (!month) return value
  const year = Number(match[3]) >= 70 ? `19${match[3]}` : `20${match[3]}`
  return `${year}-${month}-${match[1].padStart(2, '0')}`
}

export function prepareInventory(state: QAState): PreparedInventoryRecord[] {
  return RAW_INVENTORY.map((record) => {
    const isMissing = state.missing && ISSUE_ROWS.missing.includes(record.row)
    const shouldParseDate = state.dates && ISSUE_ROWS.dates.includes(record.row)
    const fixedCategory = state.categories ? CATEGORY_FIXES[String(record.row)] : undefined
    const fixedPrice = state.price && record.row === ISSUE_ROWS.price[0]

    return {
      ...record,
      stockDate: shouldParseDate ? parseTextDate(record.stockDate) : record.stockDate,
      dateIsText: shouldParseDate ? false : record.dateIsText,
      sku: state.identifiers ? String(record.sku) : record.sku,
      price: isMissing ? null : fixedPrice ? 3.75 : record.price,
      category: fixedCategory ?? record.category,
    }
  })
}

export function inventoryMetrics(rows: readonly PreparedInventoryRecord[]) {
  const prices = rows.flatMap((row) => row.price === null ? [] : [row.price])
  const categories = [...new Set(rows.map((row) => row.category))]
  const recognized = new Set(CATEGORIES)
  const datedRows = rows.filter((row) => !row.dateIsText && /^\d{4}-\d{2}-\d{2}$/.test(row.stockDate))
  const dates = datedRows.map((row) => row.stockDate).sort()
  const categoryCounts = categories.map((category) => ({
    category,
    count: rows.filter((row) => row.category === category).length,
  })).sort((a, b) => {
    const aIndex = CATEGORIES.indexOf(a.category)
    const bIndex = CATEGORIES.indexOf(b.category)
    if (aIndex < 0 && bIndex < 0) return a.category.localeCompare(b.category)
    if (aIndex < 0) return 1
    if (bIndex < 0) return -1
    return aIndex - bIndex
  })
  const priceSum = Math.round(prices.reduce((sum, price) => sum + price, 0) * 100) / 100

  return {
    records: rows.length,
    priceCount: prices.length,
    missingPrices: rows.length - prices.length,
    minPrice: prices.length ? Math.min(...prices) : null,
    maxPrice: prices.length ? Math.max(...prices) : null,
    meanPrice: prices.length ? priceSum / prices.length : null,
    priceSum,
    earliestDate: dates[0] ?? null,
    latestDate: dates.at(-1) ?? null,
    recognizedCategories: rows.filter((row) => recognized.has(row.category)).length,
    distinctCategories: categories.length,
    categoryCounts,
  }
}
