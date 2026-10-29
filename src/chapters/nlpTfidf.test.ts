import { describe, expect, it } from 'vitest'
import { countDocuments, countMatrix } from './nlpCountFeatures'
import { fitTfidf, transformTfidf } from './nlpTfidf'

describe('TF–IDF fitting and frozen transformation', () => {
  const index = fitTfidf(countDocuments)
  it('uses document frequency rather than occurrence frequency and smoothed natural-log IDF', () => {
    expect(index.vocabulary).toEqual(countMatrix(countDocuments, 'unigram').vocabulary)
    expect(index.documentCount).toBe(4)
    for (const word of ['helpful', 'not']) {
      const i = index.vocabulary.indexOf(word)
      expect(index.df[i]).toBe(2)
      expect(index.idf[i]).toBeCloseTo(Math.log(5 / 3) + 1, 14)
    }
    const i = index.vocabulary.indexOf('waited')
    expect(index.df[i]).toBe(1)
    expect(index.idf[i]).toBeCloseTo(Math.log(5 / 2) + 1, 14)
    const row = transformTfidf(index, countDocuments[2].text)
    expect(row.counts[i]).toBe(2)
    expect(row.raw[i]).toBeCloseTo(2 * (Math.log(5 / 2) + 1), 14)
    expect(row.raw[index.vocabulary.indexOf('helpful')]).toBe(0)
  })
  it('normalizes nonzero rows to length one without changing raw weights', () => {
    const row = transformTfidf(index, countDocuments[2].text)
    expect(row.length).toBeCloseTo(Math.sqrt(row.raw.reduce((sum, value) => sum + value ** 2, 0)), 14)
    expect(row.normalized.reduce((sum, value) => sum + value ** 2, 0)).toBeCloseTo(1, 14)
    expect(row.raw[index.vocabulary.indexOf('waited')]).toBeCloseTo(2 * (1 + Math.log(2.5)), 14)
  })
  it('ignores unknown words and handles zero vectors without NaN or refitting', () => {
    const saved = JSON.stringify(index)
    const row = transformTfidf(index, 'Unseen vocabulary!')
    expect(row.hasKnownTerms).toBe(false)
    expect(row.length).toBe(0)
    expect(row.raw.every(value => value === 0)).toBe(true)
    expect(row.normalized.every(value => value === 0)).toBe(true)
    expect(JSON.stringify(index)).toBe(saved)
    expect(transformTfidf(index, '').normalized.every(value => value === 0)).toBe(true)
  })
  it('is deterministic across document order and rejects an empty collection', () => {
    expect(fitTfidf([...countDocuments].reverse())).toEqual(index)
    expect(() => fitTfidf([])).toThrow('empty collection')
    expect(fitTfidf([{ id: 'empty', text: '' }]).vocabulary).toEqual([])
  })
})
