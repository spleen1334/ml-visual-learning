import { describe, expect, it } from 'vitest'
import { sentenceSpans, tokenize, tokenPresets, vocabularies, type Mode } from './nlpTokenization'

describe('authored boundary and token rules', () => {
  it('reconstructs every supported message with contiguous exact offsets in both views', () => {
    for (const { text } of tokenPresets) {
      for (const spans of [sentenceSpans(text), tokenize(text, 'word'), tokenize(text, 'subword')]) {
        let end = 0
        for (const span of spans) {
          expect(span.start).toBe(end)
          expect(span.end).toBeGreaterThan(span.start)
          expect(span.end).toBeLessThanOrEqual(text.length)
          expect(text.slice(span.start, span.end)).toBe(span.text)
          end = span.end
        }
        expect(end).toBe(text.length)
        expect(spans.map(span => span.text).join('')).toBe(text)
      }
    }
  })
  it('keeps apostrophes, spaces, and repeated punctuation according to the named rule', () => {
    const [first, , repeated] = tokenPresets
    expect(sentenceSpans(first.text).map(span => span.text)).toEqual(["I'm upset.", ' My Acme order is missing.', ' Please refund it by Friday.'])
    expect(tokenize(first.text, 'word')[0].text).toBe("I'm")
    expect(sentenceSpans(repeated.text).map(span => span.text)).toEqual(['Great service!!'])
    expect(tokenize(repeated.text, 'word').slice(-2).map(piece => piece.text)).toEqual(['!', '!'])
  })
  it('uses fixed mode-specific lookup IDs and the explicit working split', () => {
    const text = tokenPresets[1].text
    expect(tokenize(text, 'word').filter(piece => piece.text === 'working')).toHaveLength(1)
    expect(tokenize(text, 'subword').filter(piece => ['work', 'ing'].includes(piece.text)).map(piece => [piece.text, piece.start, piece.end])).toEqual([['work', 16, 20], ['ing', 20, 23]])
    for (const mode of ['word', 'subword'] as Mode[]) {
      for (const preset of tokenPresets) for (const piece of tokenize(preset.text, mode)) {
        expect(piece.id).toBe(piece.kind === 'space' ? null : vocabularies[mode].indexOf(piece.text))
        if (piece.id !== null) expect(vocabularies[mode][piece.id]).toBe(piece.text)
      }
    }
  })
  it('accepts empty text and explicitly rejects unsupported input', () => {
    expect(sentenceSpans('')).toEqual([])
    expect(tokenize('', 'word')).toEqual([])
    expect(() => sentenceSpans('Other text.')).toThrow('Unsupported text')
    expect(() => tokenize('Other text.', 'subword')).toThrow('Unsupported text')
  })
})
