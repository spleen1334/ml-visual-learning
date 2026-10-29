import { supportCorpus } from './nlpData'

export type CountDocument = { id: string; text: string }
export type FeatureMode = 'unigram' | 'bigram'
export type FeatureToken = { text: string; start: number; end: number }
export type Occurrence = { term: string; tokens: FeatureToken[] }
export const countDocuments = [supportCorpus[2], supportCorpus[5], supportCorpus[6], supportCorpus[8]] as const
export const orderDocuments = [{ id: 'A', text: 'cat chased dog' }, { id: 'B', text: 'dog chased cat' }] as const

// ASCII words with internal apostrophes, lowercased; punctuation and spaces are
// separators, not features. No stop-word removal, stemming, or lemmatization.
export function featureTokens(text: string): FeatureToken[] {
  return Array.from(text.matchAll(/[A-Za-z]+(?:'[A-Za-z]+)*/g), match => ({ text: match[0].toLowerCase(), start: match.index, end: match.index + match[0].length }))
}

export function featureOccurrences(text: string, mode: FeatureMode): Occurrence[] {
  const tokens = featureTokens(text)
  if (mode === 'unigram') return tokens.map(token => ({ term: token.text, tokens: [token] }))
  return tokens.slice(0, -1).map((token, index) => ({ term: `${token.text} ${tokens[index + 1].text}`, tokens: [token, tokens[index + 1]] }))
}

export function countMatrix(documents: readonly CountDocument[], mode: FeatureMode) {
  const occurrences = documents.map(doc => featureOccurrences(doc.text, mode))
  const vocabulary = [...new Set(occurrences.flatMap(row => row.map(occurrence => occurrence.term)))].sort()
  const counts = occurrences.map(row => vocabulary.map(term => row.filter(occurrence => occurrence.term === term).length))
  const zeros = counts.flat().filter(count => count === 0).length
  return { vocabulary, counts, occurrences, zeros, cells: documents.length * vocabulary.length }
}

// Out-of-vocabulary features contribute zero to a fixed supplied vocabulary.
export function countInVocabulary(text: string, mode: FeatureMode, vocabulary: readonly string[]) {
  const occurrences = featureOccurrences(text, mode)
  return vocabulary.map(term => occurrences.filter(item => item.term === term).length)
}
