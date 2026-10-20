// Source: Maven_ML_Demos_COMPLETE.xlsx, Naive Bayes, B4:F23.
export const bayesWorkbookFeatures = [
  { key: 'newsletter', label: 'Newsletter' },
  { key: 'facebook', label: 'Facebook' },
  { key: 'website', label: 'Website' },
] as const
export type BayesWorkbookFeature = typeof bayesWorkbookFeatures[number]['key']
export type BayesWorkbookInput = Record<BayesWorkbookFeature, boolean>
export const bayesWorkbookDefaultInput: BayesWorkbookInput = { newsletter: true, facebook: true, website: false }
export type BayesWorkbookCustomer = {
  id: number; newsletter: number; facebook: number; website: number; purchase: number
}
const sourceRows = [
  [1, 0, 1, 0, 1],
  [2, 0, 0, 1, 0],
  [3, 0, 0, 0, 0],
  [4, 0, 0, 0, 0],
  [5, 1, 1, 1, 1],
  [6, 0, 0, 1, 0],
  [7, 0, 0, 1, 0],
  [8, 1, 0, 1, 1],
  [9, 0, 1, 1, 0],
  [10, 0, 1, 0, 0],
  [11, 0, 1, 0, 0],
  [12, 0, 0, 1, 0],
  [13, 1, 1, 1, 1],
  [14, 1, 0, 0, 0],
  [15, 0, 1, 0, 0],
  [16, 0, 1, 1, 1],
  [17, 0, 1, 0, 0],
  [18, 0, 0, 1, 0],
  [19, 1, 0, 1, 1],
  [20, 1, 1, 0, 0],
] as const
export const bayesWorkbookCustomers: readonly BayesWorkbookCustomer[] = sourceRows.map(([id, newsletter, facebook, website, purchase]) => ({ id, newsletter, facebook, website, purchase }))

// COUNTIFS J5:K14; COUNTIF J16:K16; class priors J17:K17.
export function calculateBayesWorkbook(input: BayesWorkbookInput, customers = bayesWorkbookCustomers) {
  const classes = ([1, 0] as const).map(purchase => {
    const members = customers.filter(customer => customer.purchase === purchase)
    const features = bayesWorkbookFeatures.map(feature => {
      const counts = ([1, 0] as const).map(value => members.filter(customer => customer[feature.key] === value).length)
      const probabilities = counts.map(count => count / members.length)
      return { ...feature, counts, probabilities, selectedValue: input[feature.key] ? 1 : 0 }
    })
    const prior = members.length / customers.length
    // VLOOKUP selections in O6/O13 multiply three likelihoods, then the prior.
    const raw = features.reduce((product, feature) => product * feature.probabilities[feature.selectedValue ? 0 : 1], 1) * prior
    return { purchase, total: members.length, prior, features, raw }
  })
  return { classes, purchaseProbability: classes[0].raw / (classes[0].raw + classes[1].raw) }
}
