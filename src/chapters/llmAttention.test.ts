import { describe, expect, it } from 'vitest'
import { dot2, lastTokenAttention, projectHead, stableSoftmax, weightedValues } from './llmAttentionData'
import { DECODER_PARAMETERS } from './llmEmbeddingsData'

describe('one-head last-token attention', () => {
  it('matches independently calculated projection and attention fixture', () => {
    const a = lastTokenAttention([0, 1, 2])
    expect(a.inputs).toEqual([[1, 0, 1, 0], [1, 1, 1, 0], [1, 2, 0, 0]])
    expect(a.query).toEqual([0, 1.5])
    expect(a.keys).toEqual([[-0.75, 0.25], [-0.25, -0.5], [0.75, -1.25]])
    expect(a.values).toEqual([[-0.25, 0.75], [0.5, 0.25], [1.5, -0.5]])
    expect(a.dots).toEqual([0.375, -0.75, -1.875])
    ;[0.2651650429449553, -0.5303300858899106, -1.3258252147247764].forEach ( (x, i) => expect(a.scores[i]).toBeCloseTo(x, 12))
    ;[0.6041998637649082, 0.2727102604721683, 0.12308987576292356].forEach((x, i) => expect(a.weights[i]).toBeCloseTo(x, 12))
    expect(a.weights.reduce((x, y) => x + y, 0)).toBeCloseTo(1, 14)
    expect(a.output[0]).toBeCloseTo(0.16993997793924243, 12)
    expect(a.output[1]).toBeCloseTo(0.45978252506026146, 12)
    expect(projectHead([1, 0, 0, 0], DECODER_PARAMETERS.attention.heads[0].query, [1, -1])).toEqual([0.5, -1])
  })
  it('uses a stable normalized softmax', () => {
    expect(stableSoftmax([1000, 1000])).toEqual([0.5, 0.5])
    expect(stableSoftmax([1001, 1000])[0]).toBeCloseTo(stableSoftmax([1, 0])[0], 14)
    expect(stableSoftmax([1000, -1000])).toEqual([1, 0])
  })
  it('rejects malformed, nonfinite and inconsistent inputs', () => {
    expect(() => lastTokenAttention([])).toThrow()
    expect(() => lastTokenAttention([0, 1, 2, 3, 4])).toThrow()
    expect(() => projectHead([1], [[1, 2]], [0, 0])).toThrow()
    expect(() => projectHead([1, 1, 1, 1], [[1, 2], [1, 2], [1, 2], [1, NaN]], [0, 0])).toThrow()
    expect(() => dot2([1], [2, 3])).toThrow()
    expect(() => dot2([Infinity, 0], [1, 1])).toThrow()
    expect(() => stableSoftmax([])).toThrow()
    expect(() => stableSoftmax([0, NaN])).toThrow()
    expect(() => weightedValues([0.5], [[1, 2]])).toThrow()
    expect(() => weightedValues([1], [[1, Infinity]])).toThrow()
    expect(() => weightedValues([1, 0], [[1, 2]])).toThrow()
  })
})
