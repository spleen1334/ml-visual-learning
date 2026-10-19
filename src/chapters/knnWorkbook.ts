import data from './knnWorkbookData.json'

export const knnFeatures = data.features
export const knnOutcomes = ['Skipped', 'Listened', 'Favorited'] as const
export type KnnOutcome = typeof knnOutcomes[number]
export type KnnTrack = Omit<typeof data.tracks[number], 'outcome'> & { outcome: KnnOutcome }
export const knnTracks = data.tracks as KnnTrack[]
export const knnColors: Record<KnnOutcome, string> = {
  Skipped: '#e77979', Listened: '#ffd966', Favorited: '#70ad47',
}

// Mirrors AR (distance), AS (ascending RANK), AC4:AE4, AC7 and AE8.
// RANK uses competition ranks: equal distances can include more than K rows.
export function calculateKnn(tracks: readonly KnnTrack[], xFeature: number, yFeature: number, x: number, y: number, k: number) {
  const distances = tracks.map(track => Math.sqrt((x - track.scaled[xFeature]) ** 2 + (y - track.scaled[yFeature]) ** 2))
  const sorted = [...distances].sort((a, b) => a - b)
  const firstRank = new Map<number, number>()
  sorted.forEach((distance, index) => { if (!firstRank.has(distance)) firstRank.set(distance, index + 1) })
  const points = tracks.map((track, index) => ({
    ...track, x: track.scaled[xFeature], y: track.scaled[yFeature],
    distance: distances[index], rank: firstRank.get(distances[index])!,
    included: firstRank.get(distances[index])! <= k,
  }))
  const counts = knnOutcomes.map(outcome => points.filter(point => point.included && point.outcome === outcome).length)
  const total = counts.reduce((sum, count) => sum + count, 0)
  const winnerIndex = counts.indexOf(Math.max(...counts))
  return {
    points, counts, total,
    prediction: total ? (['SKIP', 'LISTEN', 'FAVORITE'] as const)[winnerIndex] : '−',
    outcome: total ? knnOutcomes[winnerIndex] : null,
    confidence: total ? counts[winnerIndex] / total : null,
  }
}
