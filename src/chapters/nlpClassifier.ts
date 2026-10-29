import { supportCorpus } from './nlpData'
import { featureTokens } from './nlpCountFeatures'

export const classes = ['negative', 'positive'] as const
export type Sentiment = typeof classes[number]
export type TrainingRecord = { text: string; label: Sentiment }
export const trainingRecords = supportCorpus.slice(0, 8) as readonly TrainingRecord[]
export const testRecords = supportCorpus.slice(8, 11)
export const reviewRecord = supportCorpus[11]

export function fitClassifier(records: readonly TrainingRecord[]) {
  if (!records.length || classes.some(label => !records.some(record => record.label === label))) throw new Error('Training requires both classes.')
  const vocabulary = [...new Set(records.flatMap(record => featureTokens(record.text).map(token => token.text)))].sort()
  if (!vocabulary.length) throw new Error('Training requires at least one word.')
  const parameters = classes.map(label => {
    const examples = records.filter(record => record.label === label)
    const words = examples.flatMap(record => featureTokens(record.text).map(token => token.text))
    const counts = vocabulary.map(word => words.filter(item => item === word).length)
    const total = words.length
    const likelihoods = counts.map(count => (count + 1) / (total + vocabulary.length))
    return { label, documents: examples.length, prior: examples.length / records.length, counts, total, likelihoods }
  })
  return { vocabulary, parameters, trainingSize: records.length }
}

export function predictClassifier(model: ReturnType<typeof fitClassifier>, text: string) {
  const tokens = featureTokens(text).map(token => token.text)
  const unique = [...new Set(tokens)].sort()
  const represented = unique.filter(word => model.vocabulary.includes(word)).map(word => {
    const column = model.vocabulary.indexOf(word)
    const count = tokens.filter(token => token === word).length
    return { word, count, column, counts: model.parameters.map(item => item.counts[column]), likelihoods: model.parameters.map(item => item.likelihoods[column]), contributions: model.parameters.map(item => count * Math.log(item.likelihoods[column])) }
  })
  const unknown = unique.filter(word => !model.vocabulary.includes(word)).map(word => ({ word, count: tokens.filter(token => token === word).length }))
  const logScores = model.parameters.map((item, i) => Math.log(item.prior) + represented.reduce((sum, term) => sum + term.contributions[i], 0))
  const max = Math.max(...logScores)
  const expScores = logScores.map(score => Math.exp(score - max))
  const sum = expScores.reduce((a, b) => a + b, 0)
  const scores = expScores.map(value => value / sum)
  const tie = logScores[0] === logScores[1]
  const prediction = classes[logScores[0] >= logScores[1] ? 0 : 1]
  return { represented, unknown, logScores, scores, tie, prediction, noEvidence: represented.length === 0 }
}
