import { DECODER_PARAMETERS, DECODER_WIDTH } from './llmEmbeddingsData'

// Third output of the frozen 4×8 feed-forward input projection (zero-based column 2).
export const NEURON_COLUMN = 2
export const NEURON_WEIGHTS = DECODER_PARAMETERS.feedForward.input.map(row => row[NEURON_COLUMN])
export const NEURON_BIAS = DECODER_PARAMETERS.feedForward.inputBias[NEURON_COLUMN]

export function relu(value: number): number {
  if (!Number.isFinite(value)) throw new RangeError('Expected a finite activation input')
  return Math.max(0, value)
}

export function traceNeuron(input: readonly number[], weights: readonly number[], bias: number) {
  if (input.length !== DECODER_WIDTH || weights.length !== DECODER_WIDTH || ![...input, ...weights, bias].every(Number.isFinite)) throw new RangeError('Expected finite width-4 input and weights, and a finite bias')
  const products = input.map ( (value, i) => value * weights[i])
  const dot = products.reduce((sum, value) => sum + value, 0)
  const beforeActivation = dot + bias
  if (![...products, dot, beforeActivation].every(Number.isFinite)) throw new RangeError('Neuron calculation must remain finite')
  return { products, dot, bias, beforeActivation, output: relu(beforeActivation) }
}
