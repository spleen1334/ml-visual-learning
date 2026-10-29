import { useEffect, useState } from 'react'
import { PlaybackButton } from '../components/PlaybackButton'
import { evaluate, LEARNING_RATE, MAX_UPDATES, predict, TRAINING_ROWS, trainingState, update } from './llmTraining'
import './LargeLanguageModels.css'
import './LLMTraining.css'

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const fmt = (n: number) => Math.abs(n) < 0.00005 ? '0.0000' : n.toFixed(4)

export function LLMTraining() {
  const [motion, setMotion] = useState(reduced)
  const [step, setStep] = useState(() => reduced() ? MAX_UPDATES : 0)
  const [playing, setPlaying] = useState(false)
  const [study, setStudy] = useState(0.5)
  const [practice, setPractice] = useState(0.5)
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const change = () => { setMotion(media.matches); if (media.matches) { setPlaying(false); setStep(MAX_UPDATES) } }
    media.addEventListener('change', change)
    return () => media.removeEventListener('change', change)
  }, [])
  useEffect(() => {
    if (!playing || motion) return
    if (step >= MAX_UPDATES) { setPlaying(false); return }
    const timer = window.setTimeout(() => setStep(s => s + 1), 1600)
    return () => window.clearTimeout(timer)
  }, [playing, motion, step])

  const params = trainingState(step), current = evaluate(params), next = update(params)
  const example = current.results[1], heldOut = predict(params, [study, practice])
  const previous = step ? trainingState(step - 1) : null
  const previousEval = previous ? evaluate(previous) : null
  return <article className="llm-lesson">
    <header className="llm-header">
      <p className="llm-eyebrow">99.10 · Large Language Models</p>
      <h1>Training: loss and gradients</h1>
      <p className="llm-definition"><strong>Training changes parameters</strong> to reduce a measure of prediction error called loss.</p>
      <p>Follow a small, separate logistic classifier as it learns from four labeled quiz records. This is not the decoder or a trained LLM.</p>
    </header>
    <section className="llm-demo training-demo" aria-labelledby="train-title">
      <div className="llm-demo-heading"><h2 id="train-title">From records to an update</h2><p>All numbers rounded to 4 decimals · full precision used for calculations</p></div>
      <div className="llm-playback" role="group" aria-label="Training playback">
        <PlaybackButton action="previous" label="Previous update" disabled={step === 0} onClick={() => { setPlaying(false); setStep(step - 1) }} />
        <PlaybackButton action={playing ? 'pause' : step === MAX_UPDATES ? 'replay' : 'play'} label={motion ? 'Autoplay disabled for reduced motion' : playing ? 'Pause training' : step === MAX_UPDATES ? 'Replay training' : 'Play training'} disabled={motion} onClick={() => { if (step === MAX_UPDATES) setStep(0); setPlaying(!playing) }} />
        <PlaybackButton action="next" label="Make one training update" disabled={step === MAX_UPDATES} onClick={() => { setPlaying(false); setStep(step + 1) }} />
        <PlaybackButton action="replay" label="Reset parameters to zero" disabled={step === 0 && !playing} onClick={() => { setPlaying(false); setStep(0) }} />
        <span role="status">{step} of {MAX_UPDATES} updates</span>
      </div>
      <p className="llm-playback-note">Next fits once using all four rows; Previous recomputes the earlier state. {motion && 'Reduced motion starts at the completed state; explore with Previous and Next.'}</p>
      <div className="training-table-wrap">
        <table className="training-table"><caption>Training records · target y: 1 = passed the quiz, 0 = did not pass</caption><thead><tr><th>Student</th><th>x₁: study hours</th><th>x₂: practice hours</th><th>Observed y</th><th>Predicted p</th><th>Loss</th></tr></thead><tbody>{TRAINING_ROWS.map((row, i) => <tr key={row.name} className={i === 1 ? 'training-highlight' : ''}><th>{row.name}{i === 1 && ' ← example'}</th><td>{row.x[0]}</td><td>{row.x[1]}</td><td>{row.y}</td><td>{fmt(current.results[i].p)}</td><td>{fmt(current.results[i].loss)}</td></tr>)}</tbody></table>
      </div>
      <p className="training-arrow" aria-hidden="true">↓</p>
      <div className="training-flow">
        <section><h3>1 · Predict for student B →</h3><p>Current parameters: <strong>w₁ = {fmt(params[0])}, w₂ = {fmt(params[1])}, b = {fmt(params[2])}</strong>. Weights multiply the features; bias b shifts the score.</p><div className="training-equation">z = w₁x₁ + w₂x₂ + b<br />≈ {fmt(params[0])} × 1 + {fmt(params[1])} × 0 + {fmt(params[2])} = {fmt(example.z)}</div><div className="training-equation">p = <span className="training-fraction"><span>1</span><span>1 + e<sup>−z</sup></span></span> ≈ {fmt(example.p)}</div><p>The sigmoid turns score z into p, the probability of passing; e ≈ 2.7183.</p></section>
        <section><h3>2 · Measure loss ↙</h3><p>Cross-entropy penalizes a low probability for the observed outcome. Here B passed (y = 1):</p><div className="training-equation">loss = −ln(p) ≈ −ln({fmt(example.p)}) = {fmt(example.loss)}</div><p>ln is the natural logarithm. For y = 0, loss is −ln(1 − p). A confident wrong prediction costs more.</p><div className="training-equation">Average training loss = <span className="training-fraction"><span>{current.results.map(r => fmt(r.loss)).join(' + ')}</span><span>4 students</span></span> ≈ <strong>{fmt(current.loss)}</strong></div></section>
        <section><h3>3 · Find the direction →</h3><p>A <strong>gradient</strong> says how a small increase in each parameter changes average loss. For each row, take p − y; multiply by x₁ or x₂ for its weight, or by 1 for the bias. Average each column.</p><div className="training-equation">B: p − y ≈ {fmt(example.p)} − 1 = {fmt(example.error)}<br />B contributions: ({fmt(example.error)} × 1, {fmt(example.error)} × 0, {fmt(example.error)} × 1)</div><p>Average gradient (w₁, w₂, b): <strong>({current.gradient.map(fmt).join(', ')})</strong></p></section>
        <section><h3>4 · Take a small step</h3><p>Subtract learning rate × gradient from each parameter. The fixed learning rate is {LEARNING_RATE}; {step < MAX_UPDATES ? 'this preview becomes real when you press Next.' : 'the preview below is not applied: this demonstration stops after eight updates.'}</p><div className="training-equation">next w₁ ≈ {fmt(params[0])} − {LEARNING_RATE} × ({fmt(current.gradient[0])}) = {fmt(next[0])}<br />next w₂ ≈ {fmt(params[1])} − {LEARNING_RATE} × ({fmt(current.gradient[1])}) = {fmt(next[1])}<br />next b ≈ {fmt(params[2])} − {LEARNING_RATE} × ({fmt(current.gradient[2])}) = {fmt(next[2])}</div>{previousEval && <p>Last update: average training loss {fmt(previousEval.loss)} → <strong>{fmt(current.loss)}</strong>. This is improvement on the training rows, not proof of performance on new students.</p>}</section>
      </div>
      <p className="training-arrow" aria-hidden="true">↓</p>
      <section className="training-heldout"><div><h3>Separate prediction · not used for fitting</h3><p>Choose hours for a new student. These inputs only change the prediction; they never change the training rows or parameters. No observed quiz result is available here, so this is not an evaluation.</p></div><div className="training-inputs"><label>Study hours <select value={study} onChange={e => setStudy(Number(e.target.value))}>{[0.25, 0.5, 0.75].map(v => <option key={v} value={v}>{v}</option>)}</select></label><label>Practice hours <select value={practice} onChange={e => setPractice(Number(e.target.value))}>{[0.25, 0.5, 0.75].map(v => <option key={v} value={v}>{v}</option>)}</select></label><strong>Predicted chance of passing: {(heldOut.p * 100).toFixed(1)}%</strong></div></section>
    </section>
    <div className="llm-clarifications"><p><strong>Connection to language models:</strong> next-token training also compares predictions with observed targets, calculates loss and gradients, and updates parameters. Its inputs, targets, architecture and scale differ greatly from this tiny classifier.</p></div>
  </article>
}
