import { describe, expect, it } from 'vitest'
import { fitClassifier, predictClassifier, reviewRecord, testRecords, trainingRecords } from './nlpClassifier'

describe('multinomial naive Bayes', () => {
  const model = fitClassifier(trainingRecords)
  it('fits only eight labeled messages with hand-counted totals and likelihoods', () => {
    expect(trainingRecords).toHaveLength(8)
    expect(trainingRecords.filter(record => record.label === 'negative')).toHaveLength(4)
    expect(trainingRecords.filter(record => record.label === 'positive')).toHaveLength(4)
    expect(model.vocabulary).toHaveLength(30)
    expect(model.vocabulary).toEqual([...model.vocabulary].sort())
    expect(model.vocabulary).not.toContain('refund')
    expect(model.vocabulary).not.toContain('acme')
    expect(model.parameters.map(item => [item.total, item.prior])).toEqual([[20, .5], [16, .5]])
    const waited = model.vocabulary.indexOf('waited')
    expect(model.parameters.map(item => item.counts[waited])).toEqual([2, 0])
    expect(model.parameters[0].likelihoods[waited]).toBeCloseTo(3 / 50, 14)
    expect(model.parameters[1].likelihoods[waited]).toBeCloseTo(1 / 46, 14)
    expect(reviewRecord.label).toBe('ambiguous/mixed')
    expect(trainingRecords.some(item => item.text === reviewRecord.text)).toBe(false)
  })
  it('predicts the three frozen held-out examples with hand-checked scores', () => {
    const results = testRecords.map(record => predictClassifier(model, record.text))
    expect(results.map(result => result.prediction)).toEqual(['positive', 'positive', 'negative'])
    expect(results[0].scores[0]).toBeCloseTo(.4584055459272098, 14)
    expect(results[1].scores[0]).toBeCloseTo(.2200499168053246, 14)
    expect(results[2].scores[0]).toBeCloseTo(.9197579087118724, 14)
    expect(results[0].unknown.map(item => item.word)).toEqual(['all', 'at'])
    expect(results[1].unknown.map(item => item.word)).toEqual(['fix', 'worked'])
    expect(results[2].unknown.map(item => item.word)).toEqual(['acme', 'by', 'friday', "i'm", 'it', 'please', 'refund', 'upset'])
    for (const result of results) expect(result.scores[0] + result.scores[1]).toBeCloseTo(1, 14)
  })
  it('counts repeated query words and ignores held-out input during fitting', () => {
    const original = JSON.stringify(model)
    const one = predictClassifier(model, 'waited')
    const two = predictClassifier(model, 'waited waited unseen')
    expect(two.represented[0].count).toBe(2)
    expect(two.represented[0].contributions[0]).toBeCloseTo(2 * one.represented[0].contributions[0], 14)
    expect(two.unknown[0].word).toBe('unseen')
    predictClassifier(model, 'completely changed test message')
    expect(JSON.stringify(model)).toBe(original)
    expect(fitClassifier(trainingRecords)).toEqual(model)
  })
  it('returns priors without represented evidence and explicitly breaks ties negative-first', () => {
    for (const text of ['', 'refund acme']) {
      const result = predictClassifier(model, text)
      expect(result.noEvidence).toBe(true)
      expect(result.tie).toBe(true)
      expect(result.prediction).toBe('negative')
      expect(result.scores).toEqual([.5, .5])
    }
    expect(() => fitClassifier([])).toThrow()
  })
})
