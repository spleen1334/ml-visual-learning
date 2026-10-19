import { describe, expect, it } from 'vitest'
import { calculateKnn, knnFeatures, knnTracks, type KnnTrack } from './knnWorkbook'

describe('KNN workbook parity', () => {
  it('preserves all source rows and min-max scaled features at full precision', () => {
    expect(knnTracks).toHaveLength(100)
    expect(knnFeatures).toEqual(['Danceability', 'Energy', 'Key', 'dB', 'Speechiness', 'Acousticness', 'Tempo', 'Duration'])
    knnFeatures.forEach((_, index) => {
      const raw = knnTracks.map(track => track.raw[index])
      const min = Math.min(...raw)
      const max = Math.max(...raw)
      knnTracks.forEach(track => expect(track.scaled[index]).toBeCloseTo(1 + (track.raw[index] - min) * 99 / (max - min), 10))
    })
  })

  it.each([
    [50, 20, [9, 11, 0], 'LISTEN', .55],
    [60, 20, [6, 13, 1], 'LISTEN', .65],
    [60, 2, [1, 1, 0], 'SKIP', .5],
    [50, 100, [27, 54, 19], 'LISTEN', .54],
    [50, 0, [0, 0, 0], '−', null],
  ])('matches Tempo=25 / Key=%s / K=%s', (key, k, counts, prediction, confidence) => {
    const result = calculateKnn(knnTracks, 6, 2, 25, key, k)
    expect(result.counts).toEqual(counts)
    expect(result.prediction).toBe(prediction)
    expect(result.confidence).toBe(confidence)
  })

  it('includes every equal-distance boundary neighbor and divides by included rows', () => {
    const tracks: KnnTrack[] = [
      { id: 1, title: 'A', artist: '', genre: '', raw: [1, 0], scaled: [1, 0], outcome: 'Skipped' },
      { id: 2, title: 'B', artist: '', genre: '', raw: [-1, 0], scaled: [-1, 0], outcome: 'Listened' },
      { id: 3, title: 'C', artist: '', genre: '', raw: [0, 1], scaled: [0, 1], outcome: 'Listened' },
      { id: 4, title: 'D', artist: '', genre: '', raw: [2, 0], scaled: [2, 0], outcome: 'Favorited' },
    ]
    const result = calculateKnn(tracks, 0, 1, 0, 0, 1)
    expect(result.points.map(point => point.rank)).toEqual([1, 1, 1, 4])
    expect(result.total).toBe(3)
    expect(result.counts).toEqual([1, 2, 0])
    expect(result.confidence).toBe(2 / 3)
    expect(result.prediction).toBe('LISTEN')
  })

  it('uses either selected feature, including the same feature on both axes', () => {
    for (let x = 0; x < 8; x++) for (let y = 0; y < 8; y++) {
      const result = calculateKnn(knnTracks, x, y, 31, 74, 7)
      result.points.forEach(point => {
        const expected = Math.sqrt((31 - point.scaled[x]) ** 2 + (74 - point.scaled[y]) ** 2)
        expect(point.distance).toBe(expected)
        expect(point.rank).toBe(1 + result.points.filter(other => other.distance < expected).length)
      })
    }
  })
})
