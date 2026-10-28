import workbook from './associationWorkbookData.json'
import { APRIORI_ITEMS } from './aprioriItemFrequencies'

export type AprioriTransaction = readonly [
  id: number,
  date: number,
  time: number,
  item1: string | null,
  item2: string | null,
  item3: string | null,
  item4: string | null,
  item5: string | null,
  minimumItemSupport: number,
]

export type MarkovRecord = readonly [customerId: number, firstPurchase: string, secondPurchase: string]
export type AssociationPairMetrics = {
  itemA: string
  itemB: string
  supportA: number
  supportB: number
  jointCount: number
  jointSupport: number
  confidence: number
  lift: number
  filteredTransactionCount: number
  denominator: number
}

type WorkbookCell = string | number | null

function parseAprioriTransaction(row: WorkbookCell[]): AprioriTransaction {
  if (row.length !== 9 || typeof row[0] !== 'number' || typeof row[1] !== 'number' ||
    typeof row[2] !== 'number' || typeof row[8] !== 'number') {
    throw new TypeError('Invalid Apriori transaction row in association workbook data.')
  }
  const items = row.slice(3, 8).map((item) => {
    if (item !== null && typeof item !== 'string') {
      throw new TypeError('Invalid Apriori item in association workbook data.')
    }
    return item
  })
  return [row[0], row[1], row[2], items[0], items[1], items[2], items[3], items[4], row[8]]
}

function parseMarkovRecord(row: WorkbookCell[]): MarkovRecord {
  if (row.length !== 3 || typeof row[0] !== 'number' || typeof row[1] !== 'string' || typeof row[2] !== 'string') {
    throw new TypeError('Invalid Markov record in association workbook data.')
  }
  return [row[0], row[1], row[2]]
}

export const APRIORI_TRANSACTIONS = workbook.apriori.transactions.map(parseAprioriTransaction)
export const APRIORI_TRANSACTION_COUNT = workbook.apriori.totalTransactions
export const MARKOV_RECORDS = workbook.markov.records.map(parseMarkovRecord)
export const MARKOV_STATES = workbook.markov.states
export const MARKOV_CUSTOMER_STATES = MARKOV_STATES.filter((state) => state !== '-')

export function filterAprioriTransactions(minimumSupport: number): AprioriTransaction[] {
  return APRIORI_TRANSACTIONS.filter((row) => row[8] >= minimumSupport)
}

/** Reproduces the worksheet's mixed denominators: all records for singleton supports, filtered records for pair support. */
export function calculateSelectedPair(itemA: string, itemB: string, minimumSupport = 0.04): AssociationPairMetrics {
  const frequency = new Map<string, number>(APRIORI_ITEMS.map(({ item, count }) => [item, count]))
  const countA = frequency.get(itemA)
  const countB = frequency.get(itemB)
  if (countA === undefined || countB === undefined) throw new RangeError('Both selected items must exist in the workbook frequency list.')
  const filtered = filterAprioriTransactions(minimumSupport)
  const jointCount = filtered.reduce((total, row) => {
    const items = row.slice(3, 8)
    return total + (items.includes(itemA) && items.includes(itemB) ? 1 : 0)
  }, 0)
  const supportA = countA / APRIORI_TRANSACTION_COUNT
  const supportB = countB / APRIORI_TRANSACTION_COUNT
  const jointSupport = filtered.length ? jointCount / filtered.length : 0
  return {
    itemA, itemB, supportA, supportB, jointCount, jointSupport,
    confidence: supportA ? jointSupport / supportA : 0,
    lift: supportA * supportB ? jointSupport / (supportA * supportB) : 0,
    filteredTransactionCount: filtered.length,
    denominator: filtered.length,
  }
}

export function getMarkovTransitionCounts() {
  const counts = MARKOV_CUSTOMER_STATES.map((state) =>
    MARKOV_STATES.map((outcome) => MARKOV_RECORDS.reduce(
      (sum, record) => sum + (record[1] === state && record[2] === outcome ? 1 : 0), 0,
    )),
  )
  return counts
}

export function getMarkovOutcomeCounts(firstPurchase: string) {
  return MARKOV_STATES.map((outcome) => ({
    outcome,
    count: MARKOV_RECORDS.reduce((sum, record) => sum + (record[1] === firstPurchase && record[2] === outcome ? 1 : 0), 0),
  }))
}

/** The most likely purchased item, deliberately excluding the source '-' no-second-purchase outcome. */
export function getTopProductPrediction(firstPurchase: string) {
  return getMarkovOutcomeCounts(firstPurchase).filter(({ outcome }) => outcome !== '-')
    .reduce((best, candidate) => candidate.count > best.count ? candidate : best)
}
