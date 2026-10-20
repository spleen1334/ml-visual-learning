// The ten-customer teaching example on PDF viewer pages 107–118.
// The separate workbook case deliberately uses a different, twenty-row dataset.
export type BayesFlag = 0 | 1
export type PdfFeature = 'newsletter' | 'facebook' | 'website'
export const pdfBayesFeatures = [
  { key: 'newsletter', short: 'NEWS', label: 'Subscribed to Newsletter' },
  { key: 'facebook', short: 'FB', label: 'Followed FB Page' },
  { key: 'website', short: 'SITE', label: 'Visited Website' },
] as const

export const pdfBayesCustomers = [
  [1, 0, 1, 0, 1], [2, 1, 0, 1, 0], [3, 1, 1, 0, 1],
  [4, 0, 0, 0, 0], [5, 1, 0, 0, 0], [6, 1, 1, 1, 1],
  [7, 1, 0, 1, 0], [8, 0, 1, 1, 1], [9, 1, 0, 1, 1],
  [10, 1, 1, 0, 0],
].map(([id, newsletter, facebook, website, purchase]) => ({
  id, newsletter: newsletter as BayesFlag, facebook: facebook as BayesFlag,
  website: website as BayesFlag, purchase: purchase as BayesFlag,
}))

export const pdfBayesQuery = { newsletter: 0, facebook: 1, website: 1 } as const
export const pdfBayesCountSteps = pdfBayesFeatures.flatMap(feature =>
  ([1, 0] as const).flatMap(value => ([1, 0] as const).map(purchase => ({ feature: feature.key, value, purchase }))),
)

export function pdfBayesCount(feature: PdfFeature, value: BayesFlag, purchase: BayesFlag) {
  return pdfBayesCustomers.filter(row => row[feature] === value && row.purchase === purchase).length
}

export function pdfBayesConditional(feature: PdfFeature, value: BayesFlag, purchase: BayesFlag) {
  return pdfBayesCount(feature, value, purchase) / pdfBayesCustomers.filter(row => row.purchase === purchase).length
}

export function pdfBayesScore(purchase: BayesFlag) {
  return pdfBayesFeatures.reduce((score, feature) =>
    score * pdfBayesConditional(feature.key, pdfBayesQuery[feature.key], purchase),
  pdfBayesCustomers.filter(row => row.purchase === purchase).length / pdfBayesCustomers.length)
}

export const pdfBayesLookups = ([1, 0] as const).flatMap(purchase => pdfBayesFeatures.flatMap(feature =>
  ([1, 0] as const).map(value => ({
    feature: feature.key, value, purchase,
    label: `P (${value ? feature.short === 'NEWS' ? 'News' : feature.short === 'SITE' ? 'Site' : 'FB' : `No ${feature.short === 'NEWS' ? 'News' : feature.short === 'SITE' ? 'Site' : 'FB'}`} | ${purchase ? 'Purchase' : 'No Purchase'})`,
    probability: pdfBayesConditional(feature.key, value, purchase),
  })),
))
