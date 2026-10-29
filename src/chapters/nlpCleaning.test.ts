import { describe, expect, it } from 'vitest'
import { cleanMessage, cleaningPresets, tokenCounts, type CleaningOptions } from './nlpCleaning'

const off: CleaningOptions = { lowercase: false, removeStopWords: false, form: 'none' }
const output = (pieces: ReturnType<typeof cleanMessage>) => pieces.map(piece => piece.result).join('')

describe('bounded text cleaning', () => {
  it('reconstructs every original, preserving contiguous source offsets and punctuation', () => {
    for (const preset of cleaningPresets) {
      const pieces = cleanMessage(preset.text, off)
      expect(output(pieces)).toBe(preset.text)
      let end = 0
      for (const piece of pieces) {
        expect(piece.start).toBe(end)
        expect(preset.text.slice(piece.start, piece.end)).toBe(piece.original)
        end = piece.end
      }
      expect(end).toBe(preset.text.length)
      expect(tokenCounts(pieces).before).toBe(tokenCounts(pieces).after)
    }
  })
  it('exposes loss of negation and exact count while preserving punctuation and spaces', () => {
    const result = cleanMessage(cleaningPresets[0].text, { ...off, lowercase: true, removeStopWords: true })
    expect(output(result)).toBe(' helpful  all!')
    expect(result.filter(p => !p.result).map(p => [p.original, p.start, p.end])).toEqual([['Not', 0, 3], ['at', 12, 14]])
    expect(tokenCounts(result)).toEqual({ before: 5, after: 3 })
    expect(output(cleanMessage(cleaningPresets[0].text, off))).toBe(cleaningPresets[0].text)
  })
  it('uses explicit distinct lookup tables, including repetitions and lemma was → be', () => {
    const stem = cleanMessage(cleaningPresets[2].text, { ...off, form: 'stem' })
    expect(output(stem)).toBe('I wait and wait for help.')
    expect(stem.filter(p => p.changes.includes('stem lookup')).map(p => p.original)).toEqual(['waited', 'waited'])
    expect(output(cleanMessage(cleaningPresets[3].text, { ...off, form: 'lemma' }))).toBe('Thanks, the setup be easy.')
    expect(output(cleanMessage(cleaningPresets[3].text, { ...off, form: 'stem' }))).toBe(cleaningPresets[3].text)
  })
  it('does not mutate reference labels and rejects arbitrary inputs', () => {
    const labels = cleaningPresets.map(preset => preset.label)
    cleaningPresets.forEach(preset => cleanMessage(preset.text, { lowercase: true, removeStopWords: true, form: 'lemma' }))
    expect(cleaningPresets.map(preset => preset.label)).toEqual(labels)
    expect(() => cleanMessage('Other text', off)).toThrow('Unsupported message')
  })
})
