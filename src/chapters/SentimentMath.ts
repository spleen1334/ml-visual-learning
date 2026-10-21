export type SentimentPrediction = { score: number; probability: number; prediction: 0 | 1; likelihood: number }

export function predictSentiment(
  features: number[],
  coefficients: number[],
  intercept: number,
  observedLabel?: number,
): SentimentPrediction {
  if (features.length !== coefficients.length) throw new Error('Each word feature must have one coefficient.')
  const score = intercept + features.reduce((sum, value, index) => sum + value * coefficients[index], 0)
  const probability = 1 / (1 + Math.exp(-score))
  const prediction: 0 | 1 = probability > 0.5 ? 1 : 0
  const likelihood = observedLabel === undefined
    ? Number.NaN
    : (probability ** observedLabel) * ((1 - probability) ** (1 - observedLabel))
  return { score, probability, prediction, likelihood }
}
