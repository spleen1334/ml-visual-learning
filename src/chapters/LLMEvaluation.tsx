import { useEffect, useState } from 'react'
import { PlaybackButton } from '../components/PlaybackButton'
import { EVALUATION_CASES, evaluationCounts, rephraseCheck, type Check, type Verdict } from './llmEvaluation'
import './LargeLanguageModels.css'
import './LLMEvaluation.css'

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const verdictText: Record<Verdict, string> = { pass: 'Pass', fail: 'Fail', na: 'Not applicable' }
function CheckRow({ title, check }: { title: string; check: Check }) {
  return <li><div><strong>{title}</strong><span className={`eval-verdict is-${check.verdict}`}>{verdictText[check.verdict]}</span></div><p>{check.reason}</p></li>
}

export function LLMEvaluation() {
  const [motion, setMotion] = useState(reduced)
  const [index, setIndex] = useState(() => reduced() ? EVALUATION_CASES.length - 1 : 0)
  const [playing, setPlaying] = useState(false)
  const last = EVALUATION_CASES.length - 1
  const item = EVALUATION_CASES[index], counts = evaluationCounts()
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const change = () => { setMotion(media.matches); if (media.matches) { setPlaying(false); setIndex(last) } }
    media.addEventListener('change', change)
    return () => media.removeEventListener('change', change)
  }, [last])
  useEffect(() => {
    if (!playing || motion) return
    if (index === last) { setPlaying(false); return }
    const timer = window.setTimeout(() => setIndex(i => i + 1), 2300)
    return () => window.clearTimeout(timer)
  }, [playing, motion, index, last])
  const choose = (i: number) => { setPlaying(false); setIndex(i) }
  const robustness: Check = item.id === 'A' || item.id === 'B'
    ? { verdict: rephraseCheck(), reason: 'A says 8 PM and rephrased B says 6 PM. The pair must give the same hour and both match the 8 PM reference.' }
    : { verdict: 'na', reason: 'Only A and B form the rephrased pair.' }
  return <article className="llm-lesson">
    <header className="llm-header">
      <p className="llm-eyebrow">99.13 · Large Language Models</p>
      <h1>Limitations and evaluation</h1>
      <p className="llm-definition"><strong>A plausible answer is not necessarily correct.</strong> Evaluate it against the task, evidence, and other relevant checks.</p>
      <p>Inspect five authored library examples, not outputs from a model or a measured benchmark. All library hours here are illustrative.</p>
    </header>
    <section className="llm-demo eval-demo" aria-labelledby="eval-title">
      <div className="llm-demo-heading"><h2 id="eval-title">Question → evidence → answer → checks</h2><p>One small set · no model inference</p></div>
      <div className="llm-playback" role="group" aria-label="Evaluation case playback">
        <PlaybackButton action="previous" label="Previous evaluation case" disabled={index === 0} onClick={() => choose(index - 1)} />
        <PlaybackButton action={playing ? 'pause' : index === last ? 'replay' : 'play'} label={motion ? 'Autoplay disabled for reduced motion' : playing ? 'Pause case walkthrough' : index === last ? 'Replay cases' : 'Play case walkthrough'} disabled={motion} onClick={() => { if (index === last) setIndex(0); setPlaying(!playing) }} />
        <PlaybackButton action="next" label="Next evaluation case" disabled={index === last} onClick={() => choose(index + 1)} />
        <span role="status">Case {item.id} · {index + 1} of {EVALUATION_CASES.length}</span>
      </div>
      <p className="llm-playback-note">Select any case or use Previous and Next. All case names remain visible. {motion && 'Reduced motion starts at the last case; explore manually.'}</p>
      <div className="eval-cases" role="group" aria-label="Select an evaluation case">{EVALUATION_CASES.map((c, i) => <button type="button" key={c.id} className={i === index ? 'is-selected' : ''} aria-pressed={i === index} onClick={() => choose(i)}><span>{c.id}</span>{c.title}</button>)}</div>
      <div className="eval-trace">
        <div className="eval-evidence"><h3>Case {item.id} · {item.title}</h3><div><span>Question</span><p>{item.question}</p></div><div><span>Context given to the model</span><p>{item.context}</p></div><div><span>Reference for the evaluator</span><p>{item.reference}</p></div></div>
        <div className="eval-arrow" aria-hidden="true">→</div>
        <div className="eval-answer"><span>Authored candidate output</span><blockquote>“{item.output}”</blockquote><p>The evaluator’s reference can be separate from what the model was given.</p></div>
        <div className="eval-arrow" aria-hidden="true">→</div>
        <div className="eval-checks"><h3>Checks for this case</h3><ul><CheckRow title="Correctness" check={item.correctness} /><CheckRow title="Groundedness" check={item.groundedness} /><CheckRow title="Uncertainty handling" check={item.uncertainty} /><CheckRow title="Robustness · pair A/B" check={robustness} /></ul></div>
      </div>
      <div className="eval-rules"><p><strong>Correctness</strong> means matching the known reference. <strong>Groundedness</strong> means the given context supports the claim; a correct guess can still be unsupported.</p><p><strong>Uncertainty handling</strong> means asking or abstaining when information is missing or ambiguous; confidence alone is not evidence. <strong>Robustness</strong> here means the A/B rephrasing gives the same hour and both match the reference.</p></div>
      <div className="eval-counts"><h3>Count only eligible cases</h3><div className="eval-count-grid"><div><strong>{counts.supportedAccuracy.passed} / {counts.supportedAccuracy.eligible}</strong><span>Supported factual accuracy</span><small>Correct among A and B, whose questions have enough given evidence. C is an unsupported guess; D and E have no single known answer.</small></div><div><strong>{counts.groundedness.passed} / {counts.groundedness.eligible}</strong><span>Grounded claims</span><small>Supported claims among A, B, C and E. D asks rather than claiming an hour.</small></div><div><strong>{counts.uncertainty.passed} / {counts.uncertainty.eligible}</strong><span>Missing or ambiguous information</span><small>Appropriate ask/abstain among C, D and E. A and B have sufficient evidence.</small></div><div><strong>{rephraseCheck() === 'pass' ? 1 : 0} / 1</strong><span>Robust rephrasing pairs</span><small>A and B are the one pair: same question, different wording. Both must agree and be correct.</small></div></div></div>
      <p className="eval-caution"><strong>For a real evaluation:</strong> check facts and evidence, inspect failures, then add fresh held-out cases that were not used to fit or tune the system. These authored examples are not measured held-out performance; five cases cannot establish broad ability or cover every situation.</p>
    </section>
  </article>
}
