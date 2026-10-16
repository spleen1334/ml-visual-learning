/** Pearson's product-moment correlation for paired numeric observations. */
export function pearsonCorrelation(x: readonly number[], y: readonly number[]): number | null {
  if (x.length !== y.length || x.length < 2 || x.some(value => !Number.isFinite(value)) || y.some(value => !Number.isFinite(value))) return null
  const xMean = x.reduce((total, value) => total + value, 0) / x.length
  const yMean = y.reduce((total, value) => total + value, 0) / y.length
  let crossDeviation = 0
  let xSquaredDeviation = 0
  let ySquaredDeviation = 0
  for (let i = 0; i < x.length; i += 1) {
    const dx = x[i] - xMean
    const dy = y[i] - yMean
    crossDeviation += dx * dy
    xSquaredDeviation += dx * dx
    ySquaredDeviation += dy * dy
  }
  if (xSquaredDeviation === 0 || ySquaredDeviation === 0) return null
  return crossDeviation / Math.sqrt(xSquaredDeviation * ySquaredDeviation)
}

