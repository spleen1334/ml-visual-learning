import { describe, expect, it } from 'vitest'
import { countVerdicts, EVALUATION_CASES, evaluationCounts, rephraseCheck } from './llmEvaluationData'

describe('authored evaluation cases', () => {
  it('counts only eligible judgments for each task', () => {
    expect(evaluationCounts()).toEqual({ supportedAccuracy: { passed: 1, eligible: 2 }, groundedness: { passed: 1, eligible: 4 }, uncertainty: { passed: 1, eligible: 3 } })
    expect(countVerdicts(['na', 'pass', 'fail'])).toEqual({ passed: 1, eligible: 2 })
    expect(() => countVerdicts(['unknown' as never])).toThrow()
  })
  it('keeps the correct unsupported guess out of supported accuracy', () => {
    const guess = EVALUATION_CASES[2]
    expect(guess.correctness.verdict).toBe('pass')
    expect(guess.groundedness.verdict).toBe('fail')
    expect(guess.supportedQuestion).toBe(false)
    expect(evaluationCounts([guess]).supportedAccuracy).toEqual({ passed: 0, eligible: 0 })
  })
  it('does not count ambiguity or unknown holiday hours as factual answers', () => {
    for (const c of EVALUATION_CASES.slice(3)) expect(c.correctness.verdict).toBe('na')
    expect(EVALUATION_CASES[3].uncertainty.verdict).toBe('pass')
    expect(EVALUATION_CASES[4].uncertainty.verdict).toBe('fail')
  })
  it('requires both consistency and reference correctness on the rephrased pair', () => {
    expect(rephraseCheck()).toBe('fail')
    const a = EVALUATION_CASES[0], b = EVALUATION_CASES[1]
    expect(rephraseCheck([a, { ...b, answerHour: 8, correctness: { ...b.correctness, verdict: 'pass' } }])).toBe('pass')
    expect(rephraseCheck([{ ...a, correctness: { ...a.correctness, verdict: 'fail' } }, { ...b, answerHour: 8 }])).toBe('fail')
    expect(() => rephraseCheck([a])).toThrow()
  })
})
