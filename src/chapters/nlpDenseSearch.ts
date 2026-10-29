import { cosine, makeSearchIndex, search } from './nlpLexicalSearch'

export type Vector3 = readonly [number, number, number]
export const semanticQuery = { text: 'purchase', vector: [1, 1, 1] as Vector3 }
// Separate authored collection; these are supplied teaching coordinates, not model outputs.
export const semanticDocuments = [
  { id: 'D1', text: 'buy item', vector: [1, 0.8, 1] as Vector3 },
  { id: 'D2', text: 'purchase history', vector: [0.5, 1, 0.1] as Vector3 },
  { id: 'D3', text: 'river water', vector: [0.1, 0.2, 1] as Vector3 },
] as const
export const bankContexts = [
  { id: 'finance', text: 'The bank holds my savings.', vector: [1, 0.2, 0.2] as Vector3 },
  { id: 'river', text: 'The bank borders the river.', vector: [0.2, 1, 0.2] as Vector3 },
] as const
export const semanticLexicalIndex = makeSearchIndex(semanticDocuments.map(({ id, text }) => ({ id, text })))
export const lexicalRanking = search(semanticLexicalIndex, semanticQuery.text)
export function denseRanking(query: readonly number[], documents: readonly { id: string; vector: readonly number[] }[]) {
  return documents.map(doc => ({ ...doc, ...cosine(query, doc.vector) })).sort((a, b) => b.score - a.score || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
}
export function project2(vector: Vector3): readonly [number, number] { return [vector[0], vector[1]] }
