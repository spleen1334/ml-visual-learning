import { describe, expect, it } from 'vitest'
import { filterImage } from './visionFilters'
import { featureMap, gradients, outputSize, sampledWindow } from './visionFeatureMaps'

describe('stride and padding', () => {
  const cases = [
    { stride: 1, padding: 0, size: 3, x: [[4,0,-4],[6,0,-6],[4,0,-4]] },
    { stride: 2, padding: 0, size: 2, x: [[4,-4],[4,-4]] },
    { stride: 1, padding: 1, size: 5, x: [[1,1,0,-1,-1],[3,4,0,-4,-3],[4,6,0,-6,-4],[3,4,0,-4,-3],[1,1,0,-1,-1]] },
    { stride: 2, padding: 1, size: 3, x: [[1,0,-1],[4,0,-4],[1,0,-1]] },
  ]
  it.each(cases)('matches x and y maps for stride $stride padding $padding', ({ stride, padding, size, x }) => {
    expect(outputSize(5, 3, stride, padding)).toBe(size)
    expect(featureMap(gradients[0], stride, padding)).toEqual(x)
    expect(featureMap(gradients[1], stride, padding)).toEqual(x[0].map((_, col) => x.map(row => row[col])))
  })
  it('identifies zero padding and original sampled coordinates without modifying input', () => {
    const before = JSON.stringify(filterImage)
    const window = sampledWindow(0, 0, 2, 1)
    expect(window[0].map(cell => [cell.row, cell.column, cell.value, cell.padded])).toEqual([[-1,-1,0,true],[-1,0,0,true],[-1,1,0,true]])
    expect(window[2][2]).toEqual({ row: 1, column: 1, value: 1, padded: false })
    expect(sampledWindow(1, 1, 2, 1)[0][0]).toEqual({ row: 1, column: 1, value: 1, padded: false })
    featureMap(gradients[0], 2, 1)
    expect(JSON.stringify(filterImage)).toBe(before)
  })
})
