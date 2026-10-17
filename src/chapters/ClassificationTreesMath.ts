export function binaryEntropy(positive: number, total: number) {
  if (total <= 0) return 0
  const p = positive / total
  const q = 1 - p
  const term = (value: number) => value === 0 ? 0 : -value * Math.log2(value)
  return term(p) + term(q)
}

export function weightedEntropyGain(parentPositive: number, parentTotal: number, children: { positive: number; total: number }[]) {
  if (parentTotal <= 0) return 0
  const childEntropy = children.reduce((sum, child) => sum + (child.total / parentTotal) * binaryEntropy(child.positive, child.total), 0)
  return binaryEntropy(parentPositive, parentTotal) - childEntropy
}
