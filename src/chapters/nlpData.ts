// Frozen authored support corpus; see docs/CHAPTER_97_SOURCE_NOTES.md.
export const supportCorpus = [
  { id: 'CS01', split: 'train', text: 'Thanks, the setup was easy.', label: 'positive' },
  { id: 'CS02', split: 'train', text: 'The update fixed my issue.', label: 'positive' },
  { id: 'CS03', split: 'train', text: 'Helpful team, quick reply.', label: 'positive' },
  { id: 'CS04', split: 'train', text: 'Great service!!', label: 'positive' },
  { id: 'CS05', split: 'train', text: 'My order is still missing.', label: 'negative' },
  { id: 'CS06', split: 'train', text: 'This app is not working.', label: 'negative' },
  { id: 'CS07', split: 'train', text: 'I waited and waited for help.', label: 'negative' },
  { id: 'CS08', split: 'train', text: 'The charge is wrong.', label: 'negative' },
  { id: 'CS09', split: 'test', text: 'Not helpful at all!', label: 'negative' },
  { id: 'CS10', split: 'test', text: 'The fix worked, thanks!', label: 'positive' },
  { id: 'CS11', split: 'test', text: "I'm upset. My Acme order is missing. Please refund it by Friday.", label: 'negative' },
  { id: 'CS12', split: 'review-only', text: 'The reply was quick, but the issue remains.', label: 'ambiguous/mixed' },
] as const

export const input = supportCorpus[10]
export const spans = ['Acme', 'Friday'].map((text, index) => ({ text, type: index === 0 ? 'organization' : 'date expression', start: input.text.indexOf(text), end: input.text.indexOf(text) + text.length }))
// Separate support FAQ collection; this order is authored, not a computed ranking.
export const authoredFaqRanking = [
  { id: 'FAQ1', title: 'Missing orders', text: 'Check the status of an order that has not arrived.' },
  { id: 'FAQ2', title: 'Refund requests', text: 'Learn how to request a refund for an order.' },
  { id: 'FAQ3', title: 'Delivery dates', text: 'Find information about delivery estimates.' },
] as const
