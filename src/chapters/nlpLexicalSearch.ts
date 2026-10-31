import { authoredFaqRanking } from './nlpData'
import { featureTokens, type CountDocument } from './nlpCountFeatures'
import { fitTfidf, transformTfidf } from './nlpTfidfData'

export const faqDocuments = authoredFaqRanking.map(faq => ({ ...faq, indexedText: `${faq.title} ${faq.text}` }))
export const faqIndex = fitTfidf(faqDocuments.map(doc => ({ id: doc.id, text: doc.indexedText })))

export function cosine(a: readonly number[], b: readonly number[]) {
  if (a.length !== b.length) throw new Error('Vectors must have the same length.')
  const dot = a.reduce((sum, value, i) => sum + value * b[i], 0)
  const lengthA = Math.sqrt(a.reduce((sum, value) => sum + value * value, 0))
  const lengthB = Math.sqrt(b.reduce((sum, value) => sum + value * value, 0))
  return { dot, lengthA, lengthB, score: lengthA && lengthB ? dot / (lengthA * lengthB) : 0 }
}

export function makeSearchIndex(documents: readonly CountDocument[]) {
  const index = fitTfidf(documents)
  return { index, documents: documents.map(doc => ({ ...doc, vector: transformTfidf(index, doc.text) })) }
}

export function search(indexed: ReturnType<typeof makeSearchIndex>, queryText: string) {
  const query = transformTfidf(indexed.index, queryText)
  const unknown = [...new Set(featureTokens(queryText).map(token => token.text).filter(word => !indexed.index.vocabulary.includes(word)))].sort()
  const results = indexed.documents.map(doc => {
    const calc = cosine(query.raw, doc.vector.raw)
    const terms = indexed.index.vocabulary.flatMap((word, i) => query.counts[i] ? [{ word, queryCount: query.counts[i], documentCount: doc.vector.counts[i], idf: indexed.index.idf[i], queryWeight: query.raw[i], documentWeight: doc.vector.raw[i], product: query.raw[i] * doc.vector.raw[i] }] : [])
    return { ...doc, ...calc, terms }
  })
  // Exact equal scores use ascending IDs; no tolerance-based nontransitive comparisons.
  results.sort((a, b) => b.score - a.score || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
  return { query, unknown, results }
}

export const faqSearchIndex = makeSearchIndex(faqDocuments.map(doc => ({ id: doc.id, text: doc.indexedText })))
