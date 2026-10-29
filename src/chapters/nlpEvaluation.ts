import { fitClassifier, predictClassifier, testRecords, trainingRecords, type Sentiment } from './nlpClassifier'
import { extractionPresets, type EntitySpan } from './nlpExtraction'

export type Cell = 'TP' | 'FP' | 'FN' | 'TN'
export type BinaryRow = { id: string; actual: Sentiment; predicted: Sentiment }
export function cellFor(row: BinaryRow): Cell {
  return row.predicted === 'positive' ? row.actual === 'positive' ? 'TP' : 'FP' : row.actual === 'positive' ? 'FN' : 'TN'
}
export function classificationCells(rows: readonly BinaryRow[]) {
  const cells: Record<Cell, string[]> = { TP: [], FP: [], FN: [], TN: [] }
  rows.forEach(row => cells[cellFor(row)].push(row.id))
  return cells
}
export function metrics(tp: number, fp: number, fn: number) {
  const precision = tp + fp ? tp / (tp + fp) : null
  const recall = tp + fn ? tp / (tp + fn) : null
  const f1 = precision !== null && recall !== null && precision + recall > 0 ? 2 * precision * recall / (precision + recall) : null
  return { precision, recall, f1 }
}

export const evaluationModel = fitClassifier(trainingRecords)
export const evaluationRows = testRecords.map(record => {
  const prediction = predictClassifier(evaluationModel, record.text)
  return { ...record, actual: record.label as Sentiment, predicted: prediction.prediction, scores: prediction.scores }
})
export const shiftProbe = { text: 'The book was not helpful.', prediction: predictClassifier(evaluationModel, 'The book was not helpful.') }

export const entityFixture = extractionPresets[1]
export const entityCandidates: readonly EntitySpan[] = [
  { text: 'Maya', start: 0, end: 4, type: 'person' },
  { text: 'contacted', start: 5, end: 14, type: 'organization' },
  { text: 'Acm', start: 15, end: 18, type: 'organization' },
  { text: 'Friday', start: 23, end: 29, type: 'person' },
]
const key = (span: EntitySpan) => `${span.start}:${span.end}:${span.type}`
export function evaluateEntities(text: string, references: readonly EntitySpan[], candidates: readonly EntitySpan[]) {
  for (const spans of [references, candidates]) {
    const keys = new Set<string>()
    for (const span of spans) {
      if (span.start < 0 || span.end <= span.start || span.end > text.length || !Number.isInteger(span.start) || !Number.isInteger(span.end) || text.slice(span.start, span.end) !== span.text) throw new Error('Invalid span')
      if (keys.has(key(span))) throw new Error('Duplicate span')
      keys.add(key(span))
    }
  }
  const referenceKeys = new Set(references.map(key))
  const candidateKeys = new Set(candidates.map(key))
  const tp = candidates.filter(span => referenceKeys.has(key(span)))
  const fp = candidates.filter(span => !referenceKeys.has(key(span)))
  const fn = references.filter(span => !candidateKeys.has(key(span)))
  return { tp, fp, fn, ...metrics(tp.length, fp.length, fn.length) }
}
