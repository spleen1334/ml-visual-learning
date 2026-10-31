import { describe, expect, it } from 'vitest'
import { addVectors, DECODER_PARAMETERS, embeddingFor, positionFor } from './llmEmbeddingsData'
import { NEURON_BIAS, NEURON_COLUMN, NEURON_WEIGHTS, relu, traceNeuron } from './llmNeuron'

describe('one frozen feed-forward neuron', () => {
  const input = (position: number) => addVectors(embeddingFor(1), positionFor(position))
  it('uses the third frozen output column and shows the hand calculation', () => {
    expect(NEURON_COLUMN).toBe(2)
    expect(NEURON_WEIGHTS).toEqual([0.5, -0.5, 0.25, -0.75])
    expect(NEURON_BIAS).toBe(0)
    expect(DECODER_PARAMETERS.provenance).toBe('hand-authored deterministic fixture; not trained')
    expect(traceNeuron(input(0), NEURON_WEIGHTS, NEURON_BIAS)).toEqual({ products: [0, -0.5, 0.25, -0], dot: -0.25, bias: 0, beforeActivation: -0.25, output: 0 })
    expect(traceNeuron(input(1), NEURON_WEIGHTS, NEURON_BIAS)).toEqual({ products: [0.5, -0.5, 0.25, -0], dot: 0.25, bias: 0, beforeActivation: 0.25, output: 0.25 })
  })
  it('adds bias before applying ReLU', () => {
    expect(traceNeuron([1, 0, 0, 0], [2, 0, 0, 0], -3)).toMatchObject({ dot: 2, beforeActivation: -1, output: 0 })
    expect(traceNeuron([1, 0, 0, 0], [2, 0, 0, 0], 3)).toMatchObject({ dot: 2, beforeActivation: 5, output: 5 })
    expect([-2, 0, 2].map(relu)).toEqual([0, 0, 2])
  })
  it('rejects bad shapes, nonfinite values, and overflow', () => {
    expect(() => traceNeuron([1], NEURON_WEIGHTS, 0)).toThrow()
    expect(() => traceNeuron(input(0), [1], 0)).toThrow()
    expect(() => traceNeuron([1, 2, NaN, 4], NEURON_WEIGHTS, 0)).toThrow()
    expect(() => traceNeuron(input(0), [1, 2, 3, Infinity], 0)).toThrow()
    expect(() => traceNeuron(input(0), NEURON_WEIGHTS, Infinity)).toThrow()
    expect(() => traceNeuron([Number.MAX_VALUE, 0, 0, 0], [2, 0, 0, 0], 0)).toThrow()
    expect(() => relu(NaN)).toThrow()
  })
})
