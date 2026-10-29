export type Features = [number, number]
export type Parameters = [number, number, number]
export type TrainingRow = { name: string; x: Features; y: 0 | 1 }

// Hours are expressed in units of one hour; each feature is bounded from 0 to 1.
export const TRAINING_ROWS: TrainingRow[] = [
  { name: 'A', x: [0, 0], y: 0 }, { name: 'B', x: [1, 0], y: 1 },
  { name: 'C', x: [0, 1], y: 0 }, { name: 'D', x: [1, 1], y: 1 },
]
export const LEARNING_RATE = 0.5
export const MAX_UPDATES = 8

function validVector(value: number[], length: number) {
  if (!Array.isArray(value) || value.length !== length || !value.every(Number.isFinite)) throw new Error('Invalid vector')
}
function validFeatures(x: number[]) {
  validVector(x, 2)
  if (x.some(v => v < 0 || v > 1)) throw new Error('Features must be between 0 and 1')
}
export function sigmoid(z: number) {
  if (!Number.isFinite(z)) throw new Error('Invalid score')
  return z >= 0 ? 1 / (1 + Math.exp(-z)) : Math.exp(z) / (1 + Math.exp(z))
}
export function predict(params: Parameters, x: Features) {
  validVector(params, 3); validFeatures(x)
  const z = params[0] * x[0] + params[1] * x[1] + params[2]
  return { z, p: sigmoid(z) }
}
export function rowLoss(z: number, y: number) {
  if (!Number.isFinite(z) || (y !== 0 && y !== 1)) throw new Error('Invalid loss input')
  // Softplus form avoids log(0) even when the probability rounds to 0 or 1.
  return Math.max(z, 0) - y * z + Math.log1p(Math.exp(-Math.abs(z)))
}
export function evaluate(params: Parameters, rows: TrainingRow[] = TRAINING_ROWS) {
  validVector(params, 3)
  if (!Array.isArray(rows) || !rows.length) throw new Error('Training rows required')
  const gradient: Parameters = [0, 0, 0]
  const results = rows.map(row => {
    if (!row || (row.y !== 0 && row.y !== 1)) throw new Error('Invalid target')
    const { z, p } = predict(params, row.x)
    const loss = rowLoss(z, row.y)
    const error = p - row.y
    gradient[0] += error * row.x[0] / rows.length
    gradient[1] += error * row.x[1] / rows.length
    gradient[2] += error / rows.length
    return { z, p, loss, error }
  })
  return { results, gradient, loss: results.reduce((sum, r) => sum + r.loss / rows.length, 0) }
}
export function update(params: Parameters, rows: TrainingRow[] = TRAINING_ROWS, rate = LEARNING_RATE): Parameters {
  if (!Number.isFinite(rate) || rate <= 0) throw new Error('Invalid learning rate')
  const { gradient } = evaluate(params, rows)
  const next: Parameters = [params[0] - rate * gradient[0], params[1] - rate * gradient[1], params[2] - rate * gradient[2]]
  validVector(next, 3)
  return next
}
export function trainingState(steps: number): Parameters {
  if (!Number.isInteger(steps) || steps < 0 || steps > MAX_UPDATES) throw new Error('Invalid step')
  let params: Parameters = [0, 0, 0]
  for (let i = 0; i < steps; i++) params = update(params)
  return params
}
