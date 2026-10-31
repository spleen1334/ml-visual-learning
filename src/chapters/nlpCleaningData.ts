import { supportCorpus } from './nlpData'

export const cleaningPresets = [supportCorpus[8], supportCorpus[5], supportCorpus[6], supportCorpus[0], supportCorpus[1]] as const
export const stopWords = ['at', 'the', 'is', 'not'] as const
export const stemLookup: Readonly<Record<string, string>> = { waited: 'wait', working: 'work', fixed: 'fix' }
export const lemmaLookup: Readonly<Record<string, string>> = { waited: 'wait', working: 'work', fixed: 'fix', was: 'be' }
export type CleaningOptions = { lowercase: boolean; removeStopWords: boolean; form: 'none' | 'stem' | 'lemma' }
export type CleaningPiece = { original: string; result: string; start: number; end: number; kind: 'word' | 'punctuation' | 'space'; changes: string[] }

// This intentionally small, case-insensitive lookup is not a general stemmer or lemmatizer.
export function cleanMessage(text: string, options: CleaningOptions): CleaningPiece[] {
  if (!cleaningPresets.some(item => item.text === text)) throw new Error('Unsupported message: choose a preset.')
  return Array.from(text.matchAll(/[A-Za-z]+(?:'[A-Za-z]+)*| +|[^A-Za-z ]/g), match => {
    const original = match[0]
    const kind = original[0] === ' ' ? 'space' : /^[A-Za-z]/.test(original) ? 'word' : 'punctuation'
    let result = original
    const changes: string[] = []
    if (kind === 'word') {
      if (options.lowercase && result !== result.toLowerCase()) { result = result.toLowerCase(); changes.push('lowercase') }
      const key = result.toLowerCase()
      if (options.removeStopWords && (stopWords as readonly string[]).includes(key)) {
        result = ''
        changes.push('removed stop word')
      } else if (options.form !== 'none') {
        const lookup = options.form === 'stem' ? stemLookup : lemmaLookup
        if (lookup[key] !== undefined && lookup[key] !== result) {
          result = lookup[key]
          changes.push(options.form === 'stem' ? 'stem lookup' : 'lemma lookup')
        }
      }
    }
    return { original, result, start: match.index, end: match.index + original.length, kind, changes }
  })
}

export function tokenCounts(pieces: CleaningPiece[]) {
  return { before: pieces.filter(piece => piece.kind !== 'space').length, after: pieces.filter(piece => piece.kind !== 'space' && piece.result !== '').length }
}
