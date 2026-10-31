import { DECODER_PARAMETERS, embedContext } from './llmEmbeddingsData'

export type Vector2 = readonly [number, number]
const finite = (values: readonly number[]) => values.every(Number.isFinite)

// Row-vector × input-by-output matrix, followed by bias. Used for one head only.
export function projectHead(input: readonly number[], matrix: readonly (readonly number[])[], bias: readonly number[]): Vector2 {
  if (input.length !== 4 || matrix.length !== 4 || matrix.some(row => row.length !== 2 || !finite(row)) || bias.length !== 2 || !finite(input) || !finite(bias)) throw new RangeError('Expected finite 4-vector, 4×2 matrix and 2-bias')
  const output = [0, 1].map(j => input.reduce((sum, x, i) => sum + x * matrix[i][j], bias[j]))
  if (!finite(output)) throw new RangeError('Projection overflow')
  return [output[0], output[1]]
}
export function dot2(a: readonly number[], b: readonly number[]): number {
  if (a.length !== 2 || b.length !== 2 || !finite(a) || !finite(b)) throw new RangeError('Expected finite width-2 vectors')
  const value = a[0] * b[0] + a[1] * b[1]
  if (!Number.isFinite(value)) throw new RangeError('Dot product overflow')
  return value
}
// Finite, unmasked scores only. Subtract the maximum before exponentiation.
export function stableSoftmax(scores: readonly number[]): number[] {
  if (!scores.length || !finite(scores)) throw new RangeError('Expected nonempty finite scores')
  const max = Math.max(...scores)
  const exps = scores.map(score => Math.exp(score - max))
  const total = exps.reduce((a, b) => a + b, 0)
  return exps.map(value => value / total)
}
export function weightedValues(weights: readonly number[], values: readonly (readonly number[])[]): Vector2 {
  if (!weights.length || weights.length !== values.length || !finite(weights) || weights.some(w => w < 0) || Math.abs(weights.reduce((a, b) => a + b, 0) - 1) > 1e-10 || values.some(row => row.length !== 2 || !finite(row))) throw new RangeError('Expected normalized weights and matching finite width-2 values')
  const output = [0, 1].map(j => weights.reduce((sum, w, i) => sum + w * values[i][j], 0))
  if (!finite(output)) throw new RangeError('Weighted sum overflow')
  return [output[0], output[1]]
}
export function lastTokenAttention(ids: readonly number[]) {
  if (!ids.length) throw new RangeError('Context cannot be empty')
  const inputs = embedContext(ids)
  const head = DECODER_PARAMETERS.attention.heads[0]
  const queries = inputs.map(row => projectHead(row, head.query, head.queryBias))
  const keys = inputs.map(row => projectHead(row, head.key, head.keyBias))
  const values = inputs.map(row => projectHead(row, head.value, head.valueBias))
  const query = queries[queries.length - 1]
  const dots = keys.map(key => dot2(query, key))
  const scores = dots.map(dot => dot / Math.sqrt(2))
  const weights = stableSoftmax(scores)
  return { inputs, queries, query, keys, values, dots, scores, weights, output: weightedValues(weights, values) }
}
