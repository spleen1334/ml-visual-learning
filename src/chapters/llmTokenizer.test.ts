import { describe, expect, it } from 'vitest'
import { decodeToy, tokenizeToy, TOY_END_ID, TOY_UNKNOWN_ID } from './llmTokenizer'

describe('tiny lookup tokenizer', () => {
  it('splits whole words, subwords, spaces and punctuation with stable IDs', () => {
    expect(tokenizeToy('cat playing!')).toEqual([1, 4, 2, 3, 6])
    for (const text of ['', 'cat playing!', '  cat. playing  ']) expect(decodeToy(tokenizeToy(text))).toBe(text)
  })
  it('makes unsupported characters explicit and does not claim they round-trip', () => {
    expect(tokenizeToy('cat 🐈')).toEqual([1, 4, TOY_UNKNOWN_ID])
    expect(decodeToy(tokenizeToy('cat 🐈'))).toBe('cat �')
  })
  it('treats the end marker as a special ID, not literal input', () => {
    expect(decodeToy([1, TOY_END_ID])).toBe('cat')
    expect(tokenizeToy('<end>')).not.toContain(TOY_END_ID)
    expect(() => decodeToy([999])).toThrow()
  })
})
