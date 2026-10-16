import { describe, expect, it } from 'vitest'
import { fairDiceProbabilities, gaussianDensity, histogram, localBinWidth, simulateDice } from './UnivariateDistributions'

describe('univariate distribution calculations', () => {
  it('keeps the KDE count scale nonzero at the final bin endpoint', () => {
    expect(localBinWidth(50, 10, 0, 50)).toBe(10)
    expect(localBinWidth(210, 3, 130, 210)).toBe(2)
    expect(localBinWidth(170, 3, 130, 210)).toBe(3)
  })
  it('assigns values to half-open bins and counts every included boundary once', () => {
    const bins = histogram([0, 4.999, 5, 9.999, 10, 15, -1, 16], 5, 0, 15)
    expect(bins.map(bin => [bin.start, bin.end, bin.count])).toEqual([[0, 5, 2], [5, 10, 2], [10, 15, 2]])
    expect(bins.reduce((sum, bin) => sum + bin.count, 0)).toBe(6)
  })

  it('gives the exact fair two-dice probabilities, which sum to one', () => {
    const probabilities = fairDiceProbabilities()
    expect(probabilities).toEqual([1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1].map(ways => ways / 36))
    expect(probabilities.reduce((sum, probability) => sum + probability, 0)).toBeCloseTo(1)
    expect(probabilities[5]).toBe(6 / 36)
    expect(probabilities[0]).toBe(1 / 36)
  })

  it('repeats dice samples for the same seed and returns the requested number of rolls', () => {
    expect(simulateDice(17, 80)).toEqual(simulateDice(17, 80))
    expect(simulateDice(17, 80)).toHaveLength(80)
    expect(simulateDice(17, 80).every(sum => sum >= 2 && sum <= 12)).toBe(true)
  })

  it('keeps the kernel density estimate normalized across the real line', () => {
    const observations = [0, 2, 5]
    const bandwidth = 0.7
    const low = -20
    const high = 25
    const steps = 4500
    const step = (high - low) / steps
    let area = 0
    for (let index = 0; index <= steps; index += 1) {
      const weight = index === 0 || index === steps ? 0.5 : 1
      area += weight * gaussianDensity(observations, low + index * step, bandwidth)
    }
    expect(area * step).toBeCloseTo(1, 4)
  })
})
