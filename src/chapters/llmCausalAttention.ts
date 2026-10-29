import { DECODER_PARAMETERS, embedContext, type Vector4 } from './llmEmbeddings'
import { dot2, projectHead, stableSoftmax, weightedValues } from './llmAttention'

// The frozen output projection is 4×4, oriented input rows × output columns.
export function projectAttentionOutput(input: readonly number[]): Vector4 {
  const { output, outputBias } = DECODER_PARAMETERS.attention
  if (input.length !== 4 || !input.every(Number.isFinite)) throw new RangeError('Expected finite width-4 head concatenation')
  const result = outputBias.map((bias, j) => input.reduce((sum, value, i) => sum + value * output[i][j], bias))
  if (!result.every(Number.isFinite)) throw new RangeError('Output projection overflow')
  return [result[0], result[1], result[2], result[3]]
}

export function causalAttention(ids: readonly number[]) {
  if (!ids.length) throw new RangeError('Context cannot be empty')
  const inputs = embedContext(ids)
  const heads = DECODER_PARAMETERS.attention.heads.map(head => {
    const queries = inputs.map(row => projectHead(row, head.query, head.queryBias))
    const keys = inputs.map(row => projectHead(row, head.key, head.keyBias))
    const values = inputs.map(row => projectHead(row, head.value, head.valueBias))
    const rows = queries.map((query, i) => {
      const scores = keys.map(key => dot2(query, key) / Math.sqrt(2))
      // Normalize only the allowed prefix. Exactly equivalent to replacing future
      // scores with -Infinity before softmax; zeroing after softmax is not equivalent.
      const weights = [...stableSoftmax(scores.slice(0, i + 1)), ...Array(ids.length - i - 1).fill(0)]
      return { scores, weights, output: weightedValues(weights, values) }
    })
    return { queries, keys, values, rows }
  })
  const combined = inputs.map((_, i) => {
    const concatenated: Vector4 = [...heads[0].rows[i].output, ...heads[1].rows[i].output]
    return { concatenated, projected: projectAttentionOutput(concatenated) }
  })
  return { inputs, heads, combined }
}
