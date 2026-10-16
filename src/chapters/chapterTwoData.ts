import { mean } from '../math/mean'

export type MonthlySale = {
  month: string
  sales: number
}

/** Synthetic teaching data. Values are illustrative monthly sales, not a real business record. */
export const SALES_HISTORY: readonly MonthlySale[] = [
  { month: 'Sep', sales: 40 },
  { month: 'Oct', sales: 44 },
  { month: 'Nov', sales: 43 },
  { month: 'Dec', sales: 50 },
  { month: 'Jan', sales: 54 },
]

export const INITIAL_HOLDOUT_SALES = 58
export const MIN_HOLDOUT_SALES = 20
export const MAX_HOLDOUT_SALES = 80

export const average = mean

export type StoreMonth = {
  month: string
  sales: number
  promoSpend: number | null
}

/** Six synthetic store-month observations reused by the process illustrations. */
export const PROCESS_DATA: readonly StoreMonth[] = [
  { month: 'Sep', sales: 40, promoSpend: 2 },
  { month: 'Oct', sales: 44, promoSpend: 3 },
  { month: 'Nov', sales: 43, promoSpend: null },
  { month: 'Dec', sales: 50, promoSpend: 5 },
  { month: 'Jan', sales: 54, promoSpend: 6 },
  { month: 'Feb', sales: 58, promoSpend: 7 },
]

export function salesHistogram(values: readonly number[]) {
  const bins = [
    { label: '35–44', min: 35, max: 44 },
    { label: '45–54', min: 45, max: 54 },
    { label: '55–64', min: 55, max: 64 },
  ]
  return bins.map((bin) => ({
    ...bin,
    count: values.filter((value) => value >= bin.min && value <= bin.max).length,
  }))
}

export function pairedStoreValues(rows: readonly StoreMonth[]) {
  return rows.flatMap((row) => row.promoSpend === null ? [] : [{
    month: row.month,
    promoSpend: row.promoSpend,
    sales: row.sales,
  }])
}

export function fitStraightLine(xValues: readonly number[], yValues: readonly number[]) {
  if (xValues.length !== yValues.length || xValues.length === 0) {
    throw new RangeError('fitStraightLine requires equally sized, non-empty inputs')
  }
  const xMean = mean(xValues)
  const yMean = mean(yValues)
  const denominator = xValues.reduce((sum, x) => sum + (x - xMean) ** 2, 0)
  const slope = denominator === 0 ? 0 : xValues.reduce(
    (sum, x, index) => sum + (x - xMean) * (yValues[index] - yMean),
    0,
  ) / denominator
  return { slope, intercept: yMean - slope * xMean }
}

/** Least-squares straight line for x values 1..n, evaluated at the next x. */
export function nextLinearTrend(values: readonly number[]): number {
  const fit = fitStraightLine(values.map((_value, index) => index + 1), values)
  return fit.intercept + fit.slope * (values.length + 1)
}

export function formatValue(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1)
}
