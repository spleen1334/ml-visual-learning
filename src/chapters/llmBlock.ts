import { addVectors, DECODER_PARAMETERS, type Vector4 } from './llmEmbeddingsData'
import { causalAttention } from './llmCausalAttentionData'
import { relu } from './llmNeuron'

export function layerNormalize(row: readonly number[]) {
  if (row.length !== 4 || !row.every(Number.isFinite)) throw new RangeError('Expected finite width-4 row')
  const mean = row.reduce((a, b) => a + b, 0) / 4
  const variance = row.reduce((sum, x) => sum + (x - mean) ** 2, 0) / 4
  const epsilon = DECODER_PARAMETERS.normalization.epsilon
  const denominator = Math.sqrt(variance + epsilon)
  const { gamma, beta } = DECODER_PARAMETERS.normalization
  const output = row.map((x, i) => ((x - mean) / denominator) * gamma[i] + beta[i])
  if (![mean, variance, denominator, ...output].every(Number.isFinite)) throw new RangeError('Normalization overflow')
  const normalized: Vector4 = [output[0], output[1], output[2], output[3]]
  return { mean, variance, epsilon, denominator, output: normalized }
}

export function linearRow(input: readonly number[], matrix: readonly (readonly number[])[], bias: readonly number[]): number[] {
  if (!input.length || !bias.length || matrix.length !== input.length || !input.every(Number.isFinite) || !bias.every(Number.isFinite) || matrix.some(row => row.length !== bias.length || !row.every(Number.isFinite))) throw new RangeError('Invalid finite projection shape')
  const result = bias.map((b, j) => input.reduce((sum, x, i) => sum + x * matrix[i][j], b))
  if (!result.every(Number.isFinite)) throw new RangeError('Projection overflow')
  return result
}

export function transformerBlock(ids: readonly number[]) {
  const attention = causalAttention(ids)
  const ff = DECODER_PARAMETERS.feedForward
  const rows = attention.inputs.map((input, i) => {
    const attentionOutput = attention.combined[i].projected
    const residual1 = addVectors(input, attentionOutput)
    const norm1 = layerNormalize(residual1)
    const hidden = linearRow(norm1.output, ff.input, ff.inputBias)
    const activated = hidden.map(relu)
    const ffOutput = linearRow(activated, ff.output, ff.outputBias)
    const residual2 = addVectors(norm1.output, ffOutput)
    const norm2 = layerNormalize(residual2)
    return { input, attentionOutput, residual1, norm1, hidden, activated, ffOutput, residual2, norm2 }
  })
  return { attention, rows }
}
