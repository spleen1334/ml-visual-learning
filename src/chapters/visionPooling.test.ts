import { describe, expect, it } from 'vitest'
import { average, comparisonWindows, maxPool, poolWindow, relu, signedMaps } from './visionPoolingData'

describe('activation and pooling', () => {
  const x = [[1,1,0,0,0],[3,4,0,0,0],[4,6,0,0,0],[3,4,0,0,0],[1,1,0,0,0]]
  const y = x[0].map((_, col) => x.map(row => row[col]))
  it('applies ReLU to both complete signed maps', () => { expect(relu(signedMaps[0])).toEqual(x); expect(relu(signedMaps[1])).toEqual(y) })
  it('max-pools complete windows and excludes the last row and column', () => {
    expect(maxPool(x)).toEqual([[4,0],[6,0]])
    expect(maxPool(y)).toEqual([[4,6],[0,0]])
    expect(poolWindow(x, 0, 0)).toEqual([1,1,3,4])
    const altered = x.map((row, i) => row.map((value, j) => i === 4 || j === 4 ? 999 : value))
    expect(maxPool(altered)).toEqual(maxPool(x))
  })
  it('shows distinct windows with the same max but different averages without mutation', () => {
    const before = JSON.stringify(signedMaps)
    expect(comparisonWindows.map(values => Math.max(...values))).toEqual([4,4])
    expect(comparisonWindows.map(average)).toEqual([2.25,1])
    maxPool(relu(signedMaps[0])); expect(JSON.stringify(signedMaps)).toBe(before)
  })
})
