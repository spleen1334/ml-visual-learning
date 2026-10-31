import { describe, expect, it } from 'vitest'
import { input } from './nlpData'
import { fitClassifier, predictClassifier, trainingRecords } from './nlpClassifierData'
import { faqSearchIndex, search } from './nlpLexicalSearch'
import { extractionPresets, recordFromAnnotations } from './nlpExtractionData'
import { workflowEvidence } from './nlpWorkflowData'

describe('workflow integration', () => {
  const evidence = workflowEvidence()
  it('reuses CS11 and the training-only classifier fit and prediction', () => {
    expect(evidence.input).toBe(input)
    expect(evidence.input.text).toBe("I'm upset. My Acme order is missing. Please refund it by Friday.")
    expect(evidence.model).toEqual(fitClassifier(trainingRecords))
    expect(evidence.model.vocabulary).toHaveLength(30)
    expect(evidence.prediction).toEqual(predictClassifier(evidence.model, input.text))
    expect(evidence.prediction.prediction).toBe('negative')
    expect(evidence.prediction.scores[0]).toBeCloseTo(.9197579087118724, 14)
    expect(evidence.cells).toEqual({ TP: ['CS10'], FP: ['CS09'], FN: [], TN: ['CS11'] })
    expect(evidence.scores).toEqual({ precision: .5, recall: 1, f1: 2 / 3 })
  })
  it('reuses the independent FAQ index and computed ranking', () => {
    expect(faqSearchIndex.index.vocabulary).toHaveLength(26)
    expect(evidence.retrieval).toEqual(search(faqSearchIndex, input.text))
    expect(evidence.retrieval.results.map(row => row.id)).toEqual(['FAQ2', 'FAQ1', 'FAQ3'])
    expect(evidence.retrieval.results[0].score).toBeCloseTo(.46053801409416684, 14)
    expect(evidence.retrieval.results[1].score).toBeCloseTo(.29428763797053353, 14)
    expect(evidence.retrieval.results[2].score).toBe(0)
  })
  it('copies only authored CS11 spans and keeps the separate entity evaluation distinct', () => {
    expect(evidence.extraction).toBe(extractionPresets[0])
    expect(evidence.extraction.annotations.map(span => [span.text, span.start, span.end])).toEqual([['Acme', 14, 18], ['Friday', 57, 63]])
    expect(evidence.record).toEqual(recordFromAnnotations(extractionPresets[0]))
    expect(evidence.record).toEqual({ person: null, organization: 'Acme', dateExpression: 'Friday' })
    expect([evidence.entityExample.tp.length, evidence.entityExample.fp.length, evidence.entityExample.fn.length]).toEqual([1, 3, 2])
  })
})
