import { describe, expect, it } from 'vitest'
import { binaryMetrics, classMetrics } from './ModelEvaluationMath'

describe('model-evaluation calculations', () => {
  it('derives the course binary metrics from a confusion matrix', () => {
    expect(binaryMetrics({ tp: 100, fp: 5, fn: 15, tn: 50 })).toMatchObject({ total: 170 })
    expect(binaryMetrics({ tp: 100, fp: 5, fn: 15, tn: 50 }).accuracy).toBeCloseTo(150 / 170)
    expect(binaryMetrics({ tp: 100, fp: 5, fn: 15, tn: 50 }).precision).toBeCloseTo(100 / 105)
    expect(binaryMetrics({ tp: 100, fp: 5, fn: 15, tn: 50 }).recall).toBeCloseTo(100 / 115)
  })

  it('turns one multiclass target into one-vs-rest counts', () => {
    const result = classMetrics([[8, 1], [2, 9]], 0)
    expect(result).toMatchObject({ tp: 8, fp: 1, fn: 2, tn: 9, total: 20 })
  })
})
