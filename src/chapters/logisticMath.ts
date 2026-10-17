export function sigmoid(z: number): number { return z >= 0 ? 1 / (1 + Math.exp(-z)) : Math.exp(z) / (1 + Math.exp(z)) }
export function logLikelihood(rows: readonly { x: number; y: number }[], intercept: number, slope: number): number {
  return rows.reduce((sum, row) => { const z = intercept + slope * row.x; return sum + row.y * z - (Math.max(z, 0) + Math.log1p(Math.exp(-Math.abs(z)))) }, 0)
}
export function confusion(rows: readonly { x: number; y: number }[], intercept: number, slope: number, threshold: number) {
  return rows.reduce((a, r) => { const predicted = sigmoid(intercept + slope * r.x) >= threshold; if (predicted && r.y === 0) a.fp++; else if (!predicted && r.y === 1) a.fn++; else if (predicted) a.tp++; else a.tn++; return a }, { tp: 0, tn: 0, fp: 0, fn: 0 })
}
