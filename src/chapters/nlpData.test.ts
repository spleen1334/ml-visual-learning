import { expect, it } from 'vitest'
import { input, spans, supportCorpus } from './nlpData'

it('keeps the frozen corpus splits and authored spans consistent with the message', () => {
  expect(supportCorpus).toHaveLength(12)
  expect(supportCorpus.map(row => row.split)).toEqual([...Array(8).fill('train'), ...Array(3).fill('test'), 'review-only'])
  expect(input.text).toBe("I'm upset. My Acme order is missing. Please refund it by Friday.")
  expect(spans.map(({ text, start, end }) => [text, start, end, input.text.slice(start, end)])).toEqual([
    ['Acme', 14, 18, 'Acme'], ['Friday', 57, 63, 'Friday'],
  ])
})
