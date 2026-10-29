// An intentionally tiny longest-match lookup, not a production tokenizer.
export const TOY_VOCABULARY = [
  { piece: 'cat', id: 1 }, { piece: 'play', id: 2 }, { piece: 'ing', id: 3 },
  { piece: ' ', id: 4 }, { piece: '.', id: 5 }, { piece: '!', id: 6 },
] as const
export const TOY_END_ID = 7
export const TOY_UNKNOWN_ID = 8

export function tokenizeToy(text: string): number[] {
  const ids: number[] = []
  const pieces = [...TOY_VOCABULARY].sort((a, b) => b.piece.length - a.piece.length)
  for (let offset = 0; offset < text.length;) {
    const match = pieces.find(item => text.startsWith(item.piece, offset))
    if (match) { ids.push(match.id); offset += match.piece.length }
    else { ids.push(TOY_UNKNOWN_ID); offset += (text.codePointAt(offset)! > 0xffff ? 2 : 1) }
  }
  return ids
}

// Special markers are not literal input text; unknowns cannot be recovered.
export function decodeToy(ids: number[]): string {
  return ids.map(id => {
    if (id === TOY_END_ID) return ''
    if (id === TOY_UNKNOWN_ID) return '�'
    const item = TOY_VOCABULARY.find(entry => entry.id === id)
    if (!item) throw new Error(`Unknown token ID: ${id}`)
    return item.piece
  }).join('')
}
