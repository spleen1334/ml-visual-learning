import { describe, expect, it } from 'vitest'
import { input, spans } from './nlpData'
import { extractionPresets, grammar, recordFromAnnotations, validateAnnotations } from './nlpExtractionData'

describe('authored extraction fixtures', () => {
  it('validates every exact, non-overlapping typed source span', () => {
    for (const preset of extractionPresets) {
      expect(() => validateAnnotations(preset)).not.toThrow()
      for (const span of preset.annotations) {
        expect(span.start).toBeGreaterThanOrEqual(0)
        expect(span.end).toBeLessThanOrEqual(preset.text.length)
        expect(preset.text.slice(span.start, span.end)).toBe(span.text)
        expect(['person', 'organization', 'date expression']).toContain(span.type)
      }
    }
    expect(() => validateAnnotations({ id: 'bad', label: 'bad', text: 'Maya', annotations: [{ text: 'Maya', type: 'person', start: 1, end: 4 }] })).toThrow('Invalid authored span')
  })
  it('reuses CS11 annotations and copies only supplied types to fields', () => {
    const preset = extractionPresets[0]
    expect(preset.text).toBe(input.text)
    expect(preset.annotations).toEqual(spans)
    expect(preset.annotations.map(span => [span.text, span.start, span.end])).toEqual([['Acme', 14, 18], ['Friday', 57, 63]])
    expect(recordFromAnnotations(preset)).toEqual({ person: null, organization: 'Acme', dateExpression: 'Friday' })
    expect(recordFromAnnotations(extractionPresets[1])).toEqual({ person: 'Maya', organization: 'Acme', dateExpression: 'Friday' })
  })
  it('keeps company and fruit context distinct without matching on spelling alone', () => {
    expect(recordFromAnnotations(extractionPresets[2])).toEqual({ person: null, organization: 'Apple', dateExpression: null })
    expect(recordFromAnnotations(extractionPresets[3])).toEqual({ person: 'Maya', organization: null, dateExpression: null })
    expect(extractionPresets[3].text).toBe('Maya ate an apple.')
  })
  it('defines valid grammatical spans, roles and directed reading arrows independently of entity types', () => {
    expect(grammar.text).toBe(extractionPresets[1].text)
    for (const word of grammar.words) expect(grammar.text.slice(word.start, word.end)).toBe(word.text)
    expect(grammar.words.map(word => [word.pos, word.role])).toEqual([['proper noun', 'subject'], ['verb', 'action'], ['proper noun', 'object']])
    expect(grammar.arrows).toEqual([{ from: 0, to: 1 }, { from: 1, to: 2 }])
    for (const arrow of grammar.arrows) {
      expect(grammar.words[arrow.from]).toBeDefined()
      expect(grammar.words[arrow.to]).toBeDefined()
    }
  })
})
