import { describe, expect, it } from 'vitest'
import { addVectors, DECODER_PARAMETERS, DECODER_VOCABULARY, embedContext, embeddingFor, positionFor, POSITION_ROWS } from './llmEmbeddingsData'

describe('frozen decoder embeddings', () => {
  it('looks up every supplied width-four row and position', () => {
    expect(DECODER_VOCABULARY.map(row => embeddingFor(row.id))).toEqual([[1, 0, 1, 0], [0, 1, 1, 0], [1, 1, 0, 0], [0, 0, 1, 1], [1, 0, 0, 1]])
    expect(POSITION_ROWS.map((_, i) => positionFor(i))).toEqual([[0, 0, 0, 0], [1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0]])
  })
  it('adds coordinate by coordinate, including repeated tokens', () => {
    expect(embedContext([1, 1, 2])).toEqual([[0, 1, 1, 0], [1, 1, 1, 0], [1, 2, 0, 0]])
    expect(embedContext([])).toEqual([])
    expect(addVectors([2, -1, 0, 4], [1, 2, 3, -1])).toEqual([3, 1, 3, 3])
  })
  it('rejects invalid IDs, positions, context lengths and vector shapes', () => {
    for (const id of [-1, 1.5, NaN, 5]) expect(() => embeddingFor(id)).toThrow()
    for (const pos of [-1, 0.5, 4, NaN]) expect(() => positionFor(pos)).toThrow()
    expect(() => embedContext([1, 1, 1, 1, 1])).toThrow()
    expect(() => embedContext([1, 99])).toThrow()
    expect(() => addVectors([1, 2], [1, 2, 3, 4])).toThrow()
    expect(() => addVectors([1, 2, 3, Infinity], [1, 2, 3, 4])).toThrow()
  })
  it('freezes authored future parameter dimensions and conventions', () => {
    const p = DECODER_PARAMETERS
    const shape = (matrix: readonly (readonly number[])[], rows: number, columns: number) => {
      expect(matrix).toHaveLength(rows)
      expect(matrix.every(row => row.length === columns && row.every(Number.isFinite))).toBe(true)
    }
    expect(p.provenance).toBe('hand-authored deterministic fixture; not trained')
    expect([p.hiddenWidth, p.heads, p.headWidth, p.feedForwardWidth, p.contextLimit]).toEqual([4, 2, 2, 8, 4])
    expect(p.attention.heads).toHaveLength(2)
    p.attention.heads.forEach(head => {
      for (const matrix of [head.query, head.key, head.value]) shape(matrix, 4, 2)
      for (const bias of [head.queryBias, head.keyBias, head.valueBias]) expect(bias).toEqual([0, 0])
    })
    shape(p.attention.output, 4, 4)
    shape(p.feedForward.input, 4, 8)
    shape(p.feedForward.output, 8, 4)
    shape(p.logits.projection, 4, DECODER_VOCABULARY.length)
    expect(p.attention.heads[0].query[0]).toEqual([-0.5, 0])
    expect(p.attention.heads[1].value[3]).toEqual([-0.5, 0])
    expect(p.normalization).toEqual({ order: 'post-residual', epsilon: 1e-5, variance: 'population', gamma: [1, 1, 1, 1], beta: [0, 0, 0, 0] })
    expect(p.feedForward.activation).toBe('ReLU')
    expect(p.logits.tiedToEmbedding).toBe(false)
    expect([p.attention.outputBias.length, p.feedForward.inputBias.length, p.feedForward.outputBias.length, p.logits.bias.length]).toEqual([4, 8, 4, 5])
  })
})
