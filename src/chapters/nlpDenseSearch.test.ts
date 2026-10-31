import { describe, expect, it } from 'vitest'
import { cosine } from './nlpLexicalSearch'
import { bankContexts, denseRanking, lexicalRanking, project2, semanticDocuments, semanticQuery } from './nlpDenseSearchData'

describe('supplied embedding demonstration', () => {
  it('keeps exact separate text and vector fixtures', () => {
    expect(semanticQuery).toEqual({ text: 'purchase', vector: [1, 1, 1] })
    expect(semanticDocuments).toEqual([
      { id: 'D1', text: 'buy item', vector: [1, .8, 1] },
      { id: 'D2', text: 'purchase history', vector: [.5, 1, .1] },
      { id: 'D3', text: 'river water', vector: [.1, .2, 1] },
    ])
  })
  it('computes different lexical and dense rankings with exact cosine contributions', () => {
    expect(lexicalRanking.results.map(row => row.id)).toEqual(['D2', 'D1', 'D3'])
    expect(lexicalRanking.results[0].score).toBeCloseTo(1 / Math.sqrt(2), 14)
    const ranking = denseRanking(semanticQuery.vector, semanticDocuments)
    expect(ranking.map(row => row.id)).toEqual(['D1', 'D2', 'D3'])
    expect(ranking[0].dot).toBeCloseTo(1 + .8 + 1, 14)
    expect(ranking[0].score).toBeCloseTo(.9949366763261821, 14)
    expect(ranking[1].score).toBeCloseTo(.8229511997978236, 14)
    expect(ranking[2].score).toBeCloseTo(.7324670207647144, 14)
  })
  it('shows two different supplied vectors for bank contexts', () => {
    expect(bankContexts.map(context => context.vector)).toEqual([[1, .2, .2], [.2, 1, .2]])
    expect(cosine(bankContexts[0].vector, bankContexts[1].vector).score).toBeCloseTo(.40740740740740744, 14)
  })
  it('drops the third coordinate only in the projection, not the cosine; handles zero and ties', () => {
    const first = [1, 1, 1] as const
    const second = [1, 1, 0] as const
    expect(project2(first)).toEqual(project2(second))
    expect(cosine(first, second).score).toBeCloseTo(Math.sqrt(2 / 3), 14)
    expect(cosine(project2(first), project2(second)).score).toBeCloseTo(1, 14)
    const ranking = denseRanking([1, 0, 0], [{ id: 'B', vector: [1, 0, 0] }, { id: 'A', vector: [1, 0, 0] }, { id: 'Z', vector: [0, 0, 0] }])
    expect(ranking.map(row => row.id)).toEqual(['A', 'B', 'Z'])
    expect(ranking[2].score).toBe(0)
  })
})
