export type Verdict = 'pass' | 'fail' | 'na'
export type Check = { verdict: Verdict; reason: string }
export type EvaluationCase = {
  id: string; title: string; question: string; context: string; reference: string; output: string
  supportedQuestion: boolean; answerHour: number | null; correctness: Check; groundedness: Check; uncertainty: Check
}

// Explicit, human-authored judgments for these particular examples, not a general-purpose grader.
export const EVALUATION_CASES: EvaluationCase[] = [
  { id: 'A', title: 'Supported answer', question: 'What time does North close on Thursday?', context: 'North branch guide: Thursday hours 9 AM–8 PM.', reference: 'North closes at 8 PM on Thursday.', output: 'North closes at 8 PM on Thursday.', supportedQuestion: true, answerHour: 8,
    correctness: { verdict: 'pass', reason: '8 PM matches the reference.' }, groundedness: { verdict: 'pass', reason: 'The given guide supports 8 PM.' }, uncertainty: { verdict: 'na', reason: 'The question and evidence are sufficient.' } },
  { id: 'B', title: 'Rephrased question', question: 'On Thursday, when does the North branch shut?', context: 'North branch guide: Thursday hours 9 AM–8 PM.', reference: 'North closes at 8 PM on Thursday.', output: 'North closes at 6 PM on Thursday.', supportedQuestion: true, answerHour: 6,
    correctness: { verdict: 'fail', reason: '6 PM conflicts with the 8 PM reference.' }, groundedness: { verdict: 'fail', reason: 'The given guide says 8 PM, not 6 PM.' }, uncertainty: { verdict: 'na', reason: 'The question and evidence are sufficient.' } },
  { id: 'C', title: 'Unsupported guess', question: 'What time does North close on Thursday?', context: 'No hours passage was provided.', reference: 'Independent reference: North closes at 8 PM on Thursday.', output: 'North closes at 8 PM on Thursday.', supportedQuestion: false, answerHour: 8,
    correctness: { verdict: 'pass', reason: 'The guess matches the independent reference.' }, groundedness: { verdict: 'fail', reason: 'The supplied context does not support the claim.' }, uncertainty: { verdict: 'fail', reason: 'With no hours in context, it should ask or abstain instead of guessing.' } },
  { id: 'D', title: 'Ambiguous branch', question: 'When does the library close on Thursday?', context: 'North: Thursday closes 8 PM. South: Thursday closes 6 PM.', reference: 'The branch is unspecified; ask which branch.', output: 'Which branch: North or South?', supportedQuestion: false, answerHour: null,
    correctness: { verdict: 'na', reason: 'No single branch was specified; this is not a factual-answer case.' }, groundedness: { verdict: 'na', reason: 'The response asks a question rather than asserting an hour.' }, uncertainty: { verdict: 'pass', reason: 'It asks which branch instead of choosing one.' } },
  { id: 'E', title: 'Missing holiday hours', question: 'When does North close on the holiday Thursday?', context: 'North branch guide: regular Thursday hours 9 AM–8 PM. No holiday hours provided.', reference: 'Holiday hours are unknown; ask or abstain.', output: 'North closes at 8 PM on the holiday.', supportedQuestion: false, answerHour: 8,
    correctness: { verdict: 'na', reason: 'Holiday hours are unknown; no factual reference is available.' }, groundedness: { verdict: 'fail', reason: 'Regular hours do not establish holiday hours.' }, uncertainty: { verdict: 'fail', reason: 'It asserts a holiday time instead of asking or abstaining.' } },
]

export function countVerdicts(checks: Verdict[]) {
  if (!checks.every(v => v === 'pass' || v === 'fail' || v === 'na')) throw new Error('Invalid verdict')
  return { passed: checks.filter(v => v === 'pass').length, eligible: checks.filter(v => v !== 'na').length }
}
export function evaluationCounts(cases: EvaluationCase[] = EVALUATION_CASES) {
  const supported = cases.filter(c => c.supportedQuestion)
  return {
    supportedAccuracy: countVerdicts(supported.map(c => c.correctness.verdict)),
    groundedness: countVerdicts(cases.map(c => c.groundedness.verdict)),
    uncertainty: countVerdicts(cases.map(c => c.uncertainty.verdict)),
  }
}
// Pair A/B asks the same question in different words. Both answers must match
// each other AND the reference; consistency alone could repeat the same error.
export function rephraseCheck(cases: EvaluationCase[] = EVALUATION_CASES): Verdict {
  const a = cases.find(c => c.id === 'A'), b = cases.find(c => c.id === 'B')
  if (!a || !b) throw new Error('Rephrase pair required')
  return a.answerHour !== null && a.answerHour === b.answerHour && a.correctness.verdict === 'pass' && b.correctness.verdict === 'pass' ? 'pass' : 'fail'
}
