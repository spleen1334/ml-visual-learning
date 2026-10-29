// Frozen decoder fixture for 99.3–99.14. Independent of the 99.2 tokenizer.
// IDs are labels, not ordinal quantities. These values are hand-authored, not trained.
// Position rows are a fixed lookup, not the sinusoidal encoding in the original paper.
export type Vector4 = readonly [number, number, number, number]
export const DECODER_WIDTH = 4
export const DECODER_CONTEXT_LIMIT = 4
export const DECODER_VOCABULARY: readonly { id: number; token: string; embedding: Vector4 }[] = [
  { id: 0, token: 'The', embedding: [1, 0, 1, 0] },
  { id: 1, token: ' cat', embedding: [0, 1, 1, 0] },
  { id: 2, token: ' sat', embedding: [1, 1, 0, 0] },
  { id: 3, token: '.', embedding: [0, 0, 1, 1] },
  { id: 4, token: '<end>', embedding: [1, 0, 0, 1] },
]
export const POSITION_ROWS: readonly Vector4[] = [
  [0, 0, 0, 0], [1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0],
]

// Frozen, authored (not learned) future decoder parameters. Matrix orientation is
// input rows × output columns, multiplied by row vectors. No forward pass is
// implemented here. Formula uses zero-based indices and exact binary fractions.
// Attention is causal, each head Q/K/V has width 2, scores scale by sqrt(2),
// heads concatenate in order 0,1. Post-norm convention: LN(x + attention(x)),
// then LN(x + FF(x)); LN uses population variance, epsilon 1e-5, gamma 1,
// beta 0. FF uses ReLU. Output logits use the independent 4×5 projection.
const suppliedMatrix = (rows: number, columns: number, seed: number): readonly (readonly number[])[] =>
  Array.from({ length: rows }, (_, i) => Array.from({ length: columns }, (_, j) => (((i * 3 + j * 2 + seed) % 7) - 3) / 4))
const zeros = (length: number): readonly number[] => Array.from({ length }, () => 0)
export const DECODER_PARAMETERS = {
  provenance: 'hand-authored deterministic fixture; not trained',
  hiddenWidth: 4, heads: 2, headWidth: 2, feedForwardWidth: 8,
  contextLimit: DECODER_CONTEXT_LIMIT,
  attention: {
    causal: true, scoreScale: 'divide by sqrt(2)',
    heads: [0, 1].map(head => ({
      query: suppliedMatrix(4, 2, 1 + head * 3),
      key: suppliedMatrix(4, 2, 2 + head * 3),
      value: suppliedMatrix(4, 2, 3 + head * 3),
      queryBias: zeros(2), keyBias: zeros(2), valueBias: zeros(2),
    })),
    output: suppliedMatrix(4, 4, 7), outputBias: zeros(4),
  },
  normalization: { order: 'post-residual', epsilon: 1e-5, variance: 'population', gamma: [1, 1, 1, 1], beta: zeros(4) },
  feedForward: { input: suppliedMatrix(4, 8, 8), inputBias: zeros(8), activation: 'ReLU', output: suppliedMatrix(8, 4, 9), outputBias: zeros(4) },
  logits: { projection: suppliedMatrix(4, 5, 10), bias: zeros(5), tiedToEmbedding: false },
} as const
export function embeddingFor(id: number): Vector4 {
  const row = DECODER_VOCABULARY.find(item => item.id === id)
  if (!row) throw new RangeError('Unknown decoder token ID')
  return [...row.embedding]
}
export function positionFor(position: number): Vector4 {
  if (!Number.isInteger(position) || position < 0 || position >= DECODER_CONTEXT_LIMIT) throw new RangeError('Position outside decoder context')
  return [...POSITION_ROWS[position]]
}
export function addVectors(a: readonly number[], b: readonly number[]): Vector4 {
  if (a.length !== DECODER_WIDTH || b.length !== DECODER_WIDTH || ![...a, ...b].every(Number.isFinite)) throw new RangeError('Expected two finite width-4 vectors')
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2], a[3] + b[3]]
}
export function embedContext(ids: readonly number[]): Vector4[] {
  if (ids.length > DECODER_CONTEXT_LIMIT) throw new RangeError('Context too long')
  return ids.map((id, position) => addVectors(embeddingFor(id), positionFor(position)))
}
