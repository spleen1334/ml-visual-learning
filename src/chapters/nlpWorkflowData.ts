import { input } from './nlpData'
import { fitClassifier, predictClassifier, trainingRecords } from './nlpClassifierData'
import { classificationCells, entityCandidates, entityFixture, evaluateEntities, evaluationRows, metrics } from './nlpEvaluationData'
import { faqSearchIndex, search } from './nlpLexicalSearch'
import { extractionPresets, recordFromAnnotations } from './nlpExtractionData'

export function workflowEvidence() {
  const model = fitClassifier(trainingRecords)
  const prediction = predictClassifier(model, input.text)
  const cells = classificationCells(evaluationRows)
  const scores = metrics(cells.TP.length, cells.FP.length, cells.FN.length)
  const retrieval = search(faqSearchIndex, input.text)
  const extraction = extractionPresets.find(preset => preset.id === input.id)!
  const record = recordFromAnnotations(extraction)
  const entityExample = evaluateEntities(entityFixture.text, entityFixture.annotations, entityCandidates)
  return { input, model, prediction, cells, scores, retrieval, extraction, record, entityExample }
}
