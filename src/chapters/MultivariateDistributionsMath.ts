export function quantile(values: number[], probability: number): number {
  if (values.length === 0) throw new Error('Cannot calculate a quantile from an empty sample.')
  if (probability < 0 || probability > 1) throw new Error('Quantile probability must be between 0 and 1.')
  const sorted = [...values].sort((a, b) => a - b)
  const position = (sorted.length - 1) * probability
  const lower = Math.floor(position)
  const fraction = position - lower
  return sorted[lower] + fraction * (sorted[Math.min(lower + 1, sorted.length - 1)] - sorted[lower])
}

export function boxStats(values: number[]) {
  if (values.length === 0) throw new Error('Cannot calculate box plot statistics from an empty sample.')
  const sorted = [...values].sort((a, b) => a - b)
  const q1 = quantile(sorted, .25)
  const median = quantile(sorted, .5)
  const q3 = quantile(sorted, .75)
  const iqr = q3 - q1
  const lowFence = q1 - 1.5 * iqr
  const highFence = q3 + 1.5 * iqr
  const inliers = sorted.filter(value => value >= lowFence && value <= highFence)
  return { q1, median, q3, iqr, lowFence, highFence, lowWhisker: Math.min(...inliers), highWhisker: Math.max(...inliers), outliers: sorted.filter(value => value < lowFence || value > highFence), min: sorted[0], max: sorted.at(-1)! }
}
