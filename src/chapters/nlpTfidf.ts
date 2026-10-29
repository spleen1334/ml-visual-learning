import { countInVocabulary, countMatrix, type CountDocument } from './nlpCountFeatures'

export type TfidfIndex = { vocabulary: string[]; documentCount: number; df: number[]; idf: number[] }

// Empty input is rejected: there is no document collection to fit.
export function fitTfidf(documents: readonly CountDocument[]): TfidfIndex {
  if (documents.length === 0) throw new Error('Cannot fit TF–IDF on an empty collection.')
  const { vocabulary, counts } = countMatrix(documents, 'unigram')
  const df = vocabulary.map((_, column) => counts.filter(row => row[column] > 0).length)
  const idf = df.map(value => Math.log((1 + documents.length) / (1 + value)) + 1)
  return { vocabulary, documentCount: documents.length, df, idf }
}

// Unknown terms are ignored; no query text changes the fitted statistics.
export function transformTfidf(index: TfidfIndex, text: string) {
  const counts = countInVocabulary(text, 'unigram', index.vocabulary)
  const raw = counts.map((value, i) => value * index.idf[i])
  const sumSquares = raw.reduce((sum, value) => sum + value * value, 0)
  const length = Math.sqrt(sumSquares)
  const normalized = raw.map(value => length === 0 ? 0 : value / length)
  return { counts, raw, sumSquares, length, normalized, hasKnownTerms: counts.some(value => value > 0) }
}
