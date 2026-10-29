import { supportCorpus } from './nlpData'

export const tokenPresets = [supportCorpus[10], supportCorpus[5], supportCorpus[3]] as const
export type Mode = 'word' | 'subword'
export type Piece = { text: string; start: number; end: number; kind: 'word' | 'punctuation' | 'space'; id: number | null }
export type TextSpan = { text: string; start: number; end: number }

function assertSupported(text: string) {
  if (text !== '' && !tokenPresets.some(preset => preset.text === text)) throw new Error('Unsupported text: choose a preset.')
}

// Teaching rule: consecutive final punctuation belongs together; following spaces
// stay with the next sentence. A final remainder, including spaces, is retained.
export function sentenceSpans(text: string): TextSpan[] {
  assertSupported(text)
  const spans: TextSpan[] = []
  const endings = /[.!?]+/g
  let start = 0
  for (const match of text.matchAll(endings)) {
    const end = match.index + match[0].length
    spans.push({ text: text.slice(start, end), start, end })
    start = end
  }
  if (start < text.length) spans.push({ text: text.slice(start), start, end: text.length })
  return spans
}

function rawPieces(text: string, mode: Mode): Omit<Piece, 'id'>[] {
  const result: Omit<Piece, 'id'>[] = []
  for (const match of text.matchAll(/[A-Za-z]+(?:'[A-Za-z]+)*| +|[^A-Za-z ]/g)) {
    const value = match[0]
    const start = match.index
    if (mode === 'subword' && value === 'working') {
      result.push({ text: 'work', start, end: start + 4, kind: 'word' }, { text: 'ing', start: start + 4, end: start + 7, kind: 'word' })
    } else {
      result.push({ text: value, start, end: start + value.length, kind: value[0] === ' ' ? 'space' : /^[A-Za-z]/.test(value) ? 'word' : 'punctuation' })
    }
  }
  return result
}

// Fixed, separate authored vocabularies, sorted once across every supported preset.
export const vocabularies = Object.fromEntries((['word', 'subword'] as const).map(mode => [mode,
  [...new Set(tokenPresets.flatMap(preset => rawPieces(preset.text, mode).filter(piece => piece.kind !== 'space').map(piece => piece.text)))].sort(),
])) as Record<Mode, string[]>

export function tokenize(text: string, mode: Mode): Piece[] {
  assertSupported(text)
  return rawPieces(text, mode).map(piece => ({ ...piece, id: piece.kind === 'space' ? null : vocabularies[mode].indexOf(piece.text) }))
}
