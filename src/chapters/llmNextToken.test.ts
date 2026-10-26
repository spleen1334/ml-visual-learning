import { describe, expect, it } from 'vitest'
import { appendToken, completeMostLikelyPath, generatedText, LLM_STOP_TOKEN, mostLikelyToken, NEXT_TOKEN_TREE, nextTokenState } from './llmNextToken'

describe('authored next-token example', () => {
  it('provides valid complete distributions and transitions', () => {
    for (const [id, node] of Object.entries(NEXT_TOKEN_TREE)) {
      if (id === 'complete') { expect(node.choices).toEqual([]); continue }
      expect(node.choices.reduce((sum, choice) => sum + choice.probability, 0)).toBeCloseTo(1, 12)
      expect(new Set(node.choices.map(choice => choice.token)).size).toBe(node.choices.length)
      for (const choice of node.choices) {
        expect(choice.probability).toBeGreaterThan(0)
        expect(choice.probability).toBeLessThanOrEqual(1)
        expect(NEXT_TOKEN_TREE[choice.next]).toBeDefined()
      }
    }
  })

  it('changes the next distribution when a different first token is appended', () => {
    expect(nextTokenState(appendToken([], ' sat')).choices.map(choice => choice.token)).toEqual([' down', ' quietly'])
    expect(nextTokenState(appendToken([], ' slept')).choices.map(choice => choice.token)).toEqual([' peacefully', '.'])
    expect(nextTokenState(appendToken([], ' ran')).choices.map(choice => choice.token)).toEqual([' home', ' away'])
    expect(generatedText([' ran', ' home'])).toBe('The cat ran home')
  })

  it('ends every branch with a stop token, preserving total path probability of one', () => {
    const endings: { text: string; probability: number }[] = []
    function walk(tokens: string[], probability: number) {
      expect(tokens.length).toBeLessThanOrEqual(4)
      const state = nextTokenState(tokens)
      if (state.complete) {
        expect(tokens.at(-1)).toBe(LLM_STOP_TOKEN)
        expect(generatedText(tokens)).not.toContain(LLM_STOP_TOKEN)
        expect(() => appendToken(tokens, ' sat')).toThrow()
        endings.push({ text: generatedText(tokens), probability })
        return
      }
      state.choices.forEach(choice => walk(appendToken(tokens, choice.token), probability * choice.probability))
    }
    walk([], 1)
    expect(endings.map(ending => ending.text)).toEqual([
      'The cat sat down.', 'The cat sat quietly.', 'The cat slept peacefully.', 'The cat slept.', 'The cat ran home.', 'The cat ran away.',
    ])
    expect(endings.reduce((sum, ending) => sum + ending.probability, 0)).toBeCloseTo(1, 12)
    expect(endings[0].probability).toBeCloseTo(0.5 * 0.6)
  })

  it('uses the most likely choice for playback and restores branches when going back', () => {
    expect(completeMostLikelyPath()).toEqual([' sat', ' down', '.', LLM_STOP_TOKEN])
    const beforeChoice = [' ran', ' home'].slice(0, -1)
    expect(nextTokenState(beforeChoice).choices).toEqual(NEXT_TOKEN_TREE.ran.choices)
    expect(generatedText(appendToken(beforeChoice, ' away'))).toBe('The cat ran away')
    expect(mostLikelyToken(completeMostLikelyPath())).toBeUndefined()
  })

  it('rejects a token that is unavailable in the current context', () => {
    expect(() => appendToken([], ' home')).toThrow()
    expect(() => nextTokenState([' slept', ' away'])).toThrow()
  })
})
