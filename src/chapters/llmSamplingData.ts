import { stableSoftmax } from './llmAttentionData'

export function temperatureDistribution(logits: readonly number[], temperature: number) {
  if (!Number.isFinite(temperature) || temperature <= 0 || !logits.length || !logits.every(Number.isFinite)) throw new RangeError('Expected finite logits and positive finite temperature')
  const scaled = logits.map(value => value / temperature)
  if (!scaled.every(Number.isFinite)) throw new RangeError('Temperature scaling overflow')
  return { scaled, probabilities: stableSoftmax(scaled) }
}
// Numerical Recipes 32-bit LCG: the state is the seed; each call advances once.
// Deterministic for teaching, not cryptographically secure or a production sampler.
export function nextSeededDraw(state: number) {
  if (!Number.isInteger(state) || state < 0 || state > 0xffffffff) throw new RangeError('Seed must be an unsigned 32-bit integer')
  const nextState = (Math.imul(1664525, state) + 1013904223) >>> 0
  return { state: nextState, draw: nextState / 0x100000000 }
}
export function cumulativeIntervals(probabilities: readonly number[]) {
  if (!probabilities.length || probabilities.some(p => !Number.isFinite(p) || p < 0)) throw new RangeError('Expected nonnegative finite probabilities')
  const total = probabilities.reduce((a, b) => a + b, 0)
  if (!Number.isFinite(total) || Math.abs(total - 1) > 1e-10) throw new RangeError('Probabilities must sum to one')
  let cumulative = 0
  const lastPositive = probabilities.reduce((last, p, i) => p > 0 ? i : last, -1)
  return probabilities.map((p, i) => {
    const start = cumulative
    // Assign rounding remainder to the last nonzero interval; trailing zeros stay empty.
    cumulative = i >= lastPositive ? 1 : Math.min(1, cumulative + p / total)
    return { start, end: cumulative }
  })
}
export function categoricalIndex(probabilities: readonly number[], draw: number): number {
  if (!Number.isFinite(draw) || draw < 0 || draw >= 1) throw new RangeError('Draw must be in [0, 1)')
  const intervals = cumulativeIntervals(probabilities)
  const index = intervals.findIndex(({ start, end }) => draw >= start && draw < end)
  if (index < 0) throw new RangeError('Draw has no interval')
  return index
}
export function greedyIndex(scores: readonly number[]) {
  if (!scores.length || !scores.every(Number.isFinite)) throw new RangeError('Expected finite scores')
  // Treat floating-point noise within 1e-12 relative/absolute as a tie.
  const maximum = Math.max(...scores)
  const tolerance = 1e-12 * Math.max(1, Math.abs(maximum))
  return scores.findIndex(value => maximum - value <= tolerance)
}
