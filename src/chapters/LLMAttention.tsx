import { useEffect, useState } from 'react'
import { PlaybackButton } from '../components/PlaybackButton'
import { DECODER_PARAMETERS } from './llmEmbeddings'
import { lastTokenAttention } from './llmAttention'
import './LargeLanguageModels.css'
import './LLMAttention.css'

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const data = lastTokenAttention([0, 1, 2])
const names = ['The', '␠cat', '␠sat']
const vec = (row: readonly number[]) => `[ ${row.join(', ')} ]`
const fmt = (n: number) => n.toFixed(4)
const head = DECODER_PARAMETERS.attention.heads[0]

export function LLMAttention() {
  const [step, setStep] = useState(() => reduced() ? 3 : 0)
  const [playing, setPlaying] = useState(false)
  const [reduce, setReduce] = useState(reduced)
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => { setReduce(media.matches); if (media.matches) { setPlaying(false); setStep(3) } }
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  useEffect(() => {
    if (!playing || reduce) return
    if (step === 3) { setPlaying(false); return }
    const timer = window.setTimeout(() => setStep(value => value + 1), 2000)
    return () => window.clearTimeout(timer)
  }, [playing, reduce, step])
  return <article className="llm-lesson attention-lesson">
    <header className="llm-header"><p className="llm-eyebrow">99.5 · Large Language Models</p><h1>Attention: queries, keys, and values</h1><p className="llm-definition"><strong>Attention mixes information from token positions</strong>, using a weight for each position.</p><p>How does the current token combine the available rows?</p></header>
    <section className="llm-demo attention-demo" aria-labelledby="attention-title">
      <div className="llm-demo-heading"><h2 id="attention-title">Follow one attention head</h2><p>Context: The cat sat · current token: <strong>sat</strong></p></div>
      <p className="attention-intro">A <strong>query (Q)</strong> is the current token’s list for comparison. A <strong>key (K)</strong> is each token’s list to compare with it. A <strong>value (V)</strong> is the list contributed to the mixture. Each is made from the input using supplied weights.</p>
      <div className="attention-section"><h3>1 · Make Q, K and V</h3><p>Each input is the embedding + position row from 99.3. A projection multiplies its 4 numbers by a 4 × 2 table of weights and adds a bias, producing 2 numbers. ␠ means a leading space.</p>
        <div className="attention-scroll"><table><thead><tr><th>Position · token</th><th>Input · 4 numbers</th><th>Q · 2 numbers</th><th>K · 2 numbers</th><th>V · 2 numbers</th></tr></thead><tbody>{names.map((name, i) => <tr key={name} className={i === 2 ? 'attention-current' : ''}><th scope="row">{i} · {name}{i === 2 ? ' (current)' : ''}</th><td><code>{vec(data.inputs[i])}</code></td><td><code>{vec(data.queries[i])}</code></td><td><code>{vec(data.keys[i])}</code></td><td><code>{vec(data.values[i])}</code></td></tr>)}</tbody></table></div>
        <details><summary>Inspect the supplied projection weights</summary><p>Rows correspond to input numbers 1–4; columns to the two output numbers. All biases are [0, 0]. The weights are hand-authored, not trained.</p><div className="attention-matrices">{(['query', 'key', 'value'] as const).map((key, i) => <div key={key}><strong>{['Q', 'K', 'V'][i]} weights · 4 × 2</strong><table><thead><tr><th>Input</th><th>Output 1</th><th>Output 2</th></tr></thead><tbody>{head[key].map((row, j) => <tr key={j}><th scope="row">{j + 1}</th><td>{row[0]}</td><td>{row[1]}</td></tr>)}</tbody></table></div>)}</div><p>For example, current Q first number = 1 × (−0.5) + 2 × 0.25 + 0 × (−0.75) + 0 × 0 + 0 = 0.</p></details>
      </div>
      <div className="attention-arrow" aria-hidden="true">↓</div>
      <div className="attention-section"><h3>2 · Compare current Q with each K</h3><p>A <strong>dot product</strong> multiplies matching numbers and adds them. Divide each result by √2 because each key has 2 numbers. All positions shown are at or before the current token.</p>
        <p className="attention-query">Current Q for sat: <code>{vec(data.query)}</code></p>
        <div className="attention-score-grid">{names.map((name, i) => <div key={name}><strong>{name} · K {vec(data.keys[i])}</strong><span>{data.query[0]} × ({data.keys[i][0]}) + {data.query[1]} × ({data.keys[i][1]}) = {data.dots[i]}</span><span>Scaled score: {step >= 1 ? <><span className="attention-fraction"><span>{data.dots[i]}</span><span>√2</span></span> ≈ {fmt(data.scores[i])}</> : '—'}</span></div>)}</div>
      </div>
      <div className="attention-arrow" aria-hidden="true">↓</div>
      <div className="attention-section"><h3>3 · Convert scores into weights</h3><p><strong>Softmax</strong> converts the scaled scores to nonnegative weights that add to 1. We will open this conversion in 99.8.</p>
        <div className="attention-weights">{names.map((name, i) => <div key={name}><span>{name}</span><strong>{step >= 2 ? fmt(data.weights[i]) : '—'}</strong><div className="attention-bar"><span style={{ width: step >= 2 ? `${data.weights[i] * 100}%` : '0%' }} /></div></div>)}</div><p className="attention-small">{step >= 2 ? 'Weights sum to 1 before rounding; displayed values are rounded to 4 decimal places.' : 'Weights appear here.'}</p>
      </div>
      <div className="attention-arrow" aria-hidden="true">↓</div>
      <div className="attention-section attention-output"><h3>4 · Mix the value rows</h3><p>Multiply each value row by its weight, then add matching numbers. This is one head’s output for <strong>sat</strong>, not the full model result.</p>
        {step >= 3 ? <><p className="attention-worked">First output number ≈ {data.weights.map((w, i) => `${fmt(w)} × (${data.values[i][0]})`).join(' + ')} = <strong>{fmt(data.output[0])}</strong></p><p className="attention-result">Head output ≈ [ {fmt(data.output[0])}, {fmt(data.output[1])} ]</p><p className="attention-small">Calculations use unrounded weights, so displayed arithmetic is approximate.</p></> : <p>Mixture appears here.</p>}
      </div>
      <div className="llm-playback" role="group" aria-label="Attention calculation playback">
        <PlaybackButton action="previous" label="Previous attention step" disabled={step === 0} onClick={() => { setPlaying(false); setStep(step - 1) }} />
        <PlaybackButton action={playing ? 'pause' : step === 3 ? 'replay' : 'play'} label={reduce ? 'Autoplay disabled: reduced motion is preferred' : playing ? 'Pause attention calculation' : step === 3 ? 'Replay attention calculation' : 'Play attention calculation'} disabled={reduce} aria-pressed={playing} onClick={() => { if (step === 3) setStep(0); setPlaying(!playing) }} />
        <PlaybackButton action="next" label="Next attention step" disabled={step === 3} onClick={() => { setPlaying(false); setStep(step + 1) }} /><span role="status">Step {step + 1} of 4{reduce ? ' · Reduced motion: explore with Previous and Next.' : ''}</span>
      </div>
    </section>
    <p className="attention-boundary">These supplied weights are not trained. Attention weights describe this numerical mixture; they do not prove reasoning or causation.</p>
  </article>
}
