export type BinaryCounts = { tp: number; fp: number; fn: number; tn: number }

export function binaryMetrics({ tp, fp, fn, tn }: BinaryCounts) {
  const total = tp + fp + fn + tn
  return {
    total,
    accuracy: total ? (tp + tn) / total : 0,
    precision: tp + fp ? tp / (tp + fp) : 0,
    recall: tp + fn ? tp / (tp + fn) : 0,
  }
}

export function classMetrics(matrix: number[][], target: number) {
  const total = matrix.flat().reduce((sum, value) => sum + value, 0)
  const tp = matrix[target][target]
  const fp = matrix[target].reduce((sum, value) => sum + value, 0) - tp
  const fn = matrix.reduce((sum, row) => sum + row[target], 0) - tp
  const tn = total - tp - fp - fn
  return { ...binaryMetrics({ tp, fp, fn, tn }), tp, fp, fn, tn }
}
