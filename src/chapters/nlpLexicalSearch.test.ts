import { describe, expect, it } from 'vitest'
import { input } from './nlpData'
import { featureTokens } from './nlpCountFeatures'
import { cosine, faqDocuments, faqSearchIndex, makeSearchIndex, search } from './nlpLexicalSearch'

describe('lexical FAQ search', () => {
  it('computes cosine and handles mismatched and zero vectors', () => {
    expect(cosine([1, 1], [1, 0]).score).toBeCloseTo(1 / Math.sqrt(2), 14)
    expect(cosine([0, 0], [1, 0]).score).toBe(0)
    expect(cosine([1, 0], [0, 0]).score).toBe(0)
    expect(() => cosine([1], [1, 2])).toThrow()
  })
  it('indexes the exact title and body with the three-document vocabulary', () => {
    expect(faqDocuments.map(doc => doc.indexedText)).toEqual([
      'Missing orders Check the status of an order that has not arrived.',
      'Refund requests Learn how to request a refund for an order.',
      'Delivery dates Find information about delivery estimates.',
    ])
    expect(faqSearchIndex.index.documentCount).toBe(3)
    expect(faqSearchIndex.index.vocabulary).toHaveLength(26)
    const order = faqSearchIndex.index.vocabulary.indexOf('order')
    expect(faqSearchIndex.index.df[order]).toBe(2)
    expect(faqSearchIndex.index.idf[order]).toBeCloseTo(1 + Math.log(4 / 3), 14)
  })
  it('matches golden FAQ rankings and contribution sums', () => {
    const fixtures = [
      [input.text, ['FAQ2', 'FAQ1', 'FAQ3'], [0.46053801409416684, 0.29428763797053353, 0]],
      ['missing order', ['FAQ1', 'FAQ2', 'FAQ3'], [0.3761305927901108, 0.13204130183910784, 0]],
      ['refund order', ['FAQ2', 'FAQ1', 'FAQ3'], [0.5886160813216482, 0.13783185822837235, 0]],
    ] as const
    for (const [query, ids, scores] of fixtures) {
      const result = search(faqSearchIndex, query)
      expect(result.results.map(item => item.id)).toEqual(ids)
      result.results.forEach((item, i) => {
        expect(item.score).toBeCloseTo(scores[i], 14)
        expect(item.terms.reduce((sum, term) => sum + term.product, 0)).toBeCloseTo(item.dot, 14)
      })
    }
  })
  it('keeps statistics frozen and returns a zero vector for unknown or empty queries', () => {
    const before = JSON.stringify(faqSearchIndex.index)
    for (const query of ['purchase', '', '!?']) {
      const result = search(faqSearchIndex, query)
      expect(result.query.hasKnownTerms).toBe(false)
      expect(result.results.map(item => item.id)).toEqual(['FAQ1', 'FAQ2', 'FAQ3'])
      expect(result.results.every(item => item.score === 0)).toBe(true)
    }
    expect(search(faqSearchIndex, 'purchase').unknown).toEqual(['purchase'])
    expect(JSON.stringify(faqSearchIndex.index)).toBe(before)
  })
  it('resolves exact ties by ID and handles an empty indexed document', () => {
    const index = makeSearchIndex([{ id: 'B', text: 'same' }, { id: 'A', text: 'same' }, { id: 'C', text: '' }])
    const result = search(index, 'same')
    expect(result.results.map(item => item.id)).toEqual(['A', 'B', 'C'])
    expect(result.results.map(item => item.score)).toEqual([1, 1, 0])
    expect(result.results[2].lengthB).toBe(0)
  })
  it('retains source offsets for highlighted query and title/body words', () => {
    for (const text of [input.text, ...faqDocuments.map(doc => doc.indexedText)]) {
      for (const token of featureTokens(text)) expect(text.slice(token.start, token.end).toLowerCase()).toBe(token.text)
    }
  })
})
