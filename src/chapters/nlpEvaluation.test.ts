import { describe, expect, it } from 'vitest'
import { fitClassifier, predictClassifier, reviewRecord, testRecords, trainingRecords } from './nlpClassifierData'
import { classificationCells, entityCandidates, entityFixture, evaluateEntities, evaluationRows, metrics, shiftProbe } from './nlpEvaluationData'

describe('classifier evaluation', () => {
  it('uses actual held-out predictions and selects contributing IDs in the approved orientation', () => {
    const model = fitClassifier(trainingRecords)
    expect(evaluationRows.map(row => row.id)).toEqual(['CS09', 'CS10', 'CS11'])
    expect(evaluationRows.map(row => row.predicted)).toEqual(testRecords.map(row => predictClassifier(model, row.text).prediction))
    expect(evaluationRows.map(row => row.predicted)).toEqual(['positive', 'positive', 'negative'])
    expect(evaluationRows[0].scores[1]).toBeCloseTo(.5415944540727902, 14)
    expect(classificationCells(evaluationRows)).toEqual({ TP: ['CS10'], FP: ['CS09'], FN: [], TN: ['CS11'] })
    expect(metrics(1, 1, 0)).toEqual({ precision: .5, recall: 1, f1: 2 / 3 })
  })
  it('handles undefined denominators without NaN and excludes ambiguity and domain probe', () => {
    expect(metrics(0, 0, 0)).toEqual({ precision: null, recall: null, f1: null })
    expect(metrics(0, 0, 1)).toEqual({ precision: null, recall: 0, f1: null })
    expect(metrics(0, 1, 1)).toEqual({ precision: 0, recall: 0, f1: null })
    expect(evaluationRows.some(row => row.text === reviewRecord.text || row.text === shiftProbe.text)).toBe(false)
    expect(reviewRecord.label).toBe('ambiguous/mixed')
    expect(shiftProbe.text).toBe('The book was not helpful.')
    expect(shiftProbe.prediction).toEqual(predictClassifier(fitClassifier(trainingRecords), shiftProbe.text))
    expect(shiftProbe.prediction.unknown.map(word => word.word)).toEqual(['book'])
  })
})

describe('exact entity matching', () => {
  it('counts exact matches, wrong boundaries and types, and spurious candidates separately', () => {
    const result = evaluateEntities(entityFixture.text, entityFixture.annotations, entityCandidates)
    expect(result.tp.map(span => span.text)).toEqual(['Maya'])
    expect(result.fp.map(span => span.text)).toEqual(['contacted', 'Acm', 'Friday'])
    expect(result.fn.map(span => span.text)).toEqual(['Acme', 'Friday'])
    expect(result.precision).toBe(.25)
    expect(result.recall).toBeCloseTo(1 / 3, 14)
    expect(result.f1).toBeCloseTo(2 / 7, 14)
  })
  it('rejects duplicate exact keys and invalid offsets, while handling empty sets', () => {
    expect(() => evaluateEntities(entityFixture.text, entityFixture.annotations, [entityCandidates[0], entityCandidates[0]])).toThrow('Duplicate')
    expect(() => evaluateEntities(entityFixture.text, entityFixture.annotations, [{ ...entityCandidates[0], end: 3 }])).toThrow('Invalid')
    expect(evaluateEntities(entityFixture.text, [], [])).toEqual({ tp: [], fp: [], fn: [], precision: null, recall: null, f1: null })
  })
})
