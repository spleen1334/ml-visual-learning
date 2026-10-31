import { useEffect, useState } from 'react'
import { PlaybackButton } from '../components/PlaybackButton'
import { DECODER_PARAMETERS } from './llmEmbeddingsData'
import { causalAttention } from './llmCausalAttentionData'
import './LargeLanguageModels.css'
import './LLMCausalAttention.css'

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const fmt = (value: number) => value.toFixed(4)
const vec = (row: readonly number[]) => `[ ${row.map(fmt).join(', ')} ]`

export function LLMCausalAttention() {
  const [last, setLast] = useState(2)
  const [selected, setSelected] = useState(1)
  const [step, setStep] = useState(() => reduced() ? 2 : 0)
  const [playing, setPlaying] = useState(false)
  const [reduce, setReduce] = useState(reduced)
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => { setReduce(media.matches); if (media.matches) { setPlaying(false); setStep(2) } }
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  useEffect(() => {
    if (!playing || reduce) return
    if (step === 2) { setPlaying(false); return }
    const timer = window.setTimeout(() => setStep(value => value + 1), 1800)
    return () => window.clearTimeout(timer)
  }, [playing, reduce, step])
  const data = causalAttention([0, 1, last])
  const names = ['The', '␠cat', last === 2 ? '␠sat' : '.']
  return <article className="llm-lesson causal-lesson">
    <header className="llm-header"><p className="llm-eyebrow">99.6 · Large Language Models</p><h1>Causal masking and multiple heads</h1><p className="llm-definition"><strong>Causal attention cannot look ahead</strong>: each token can use itself and earlier tokens, not later ones.</p><p>How do two attention calculations respect that boundary?</p></header>
    <section className="llm-demo causal-demo" aria-labelledby="causal-title">
      <div className="llm-demo-heading"><h2 id="causal-title">Two heads, one causal rule</h2><p>Rows are queries; columns are keys. Positions start at 0.</p></div>
      <p>A <strong>head</strong> is one attention calculation. These two heads use different supplied projections to make width-2 Q, K and V lists from each width-4 input. They can produce different numerical mixtures—not necessarily distinct human roles.</p>
      <div className="causal-controls"><fieldset><legend>Change the last token</legend><p>Choose an earlier query to see that its result stays the same.</p>{[{ id: 2, label: '␠sat' }, { id: 3, label: '.' }].map(choice => <label key={choice.id}><input type="radio" name="causal-last" checked={last === choice.id} onChange={() => { setPlaying(false); setLast(choice.id) }} /> {choice.label}</label>)}</fieldset>
        <fieldset><legend>Select a query row</legend><p>Compare its scores, weights and mixture below.</p>{names.map((name, i) => <label key={i}><input type="radio" name="causal-query" checked={selected === i} onChange={() => { setPlaying(false); setSelected(i) }} /> {i} · {name}</label>)}</fieldset></div>
      <p className="causal-note"><strong>Mask before softmax:</strong> future scores are blocked (equivalent to setting them to −∞); softmax then gives them exactly 0 weight. The diagonal is allowed: a token can use its own value.</p>
      <div className="causal-grids">{data.heads.map((head, h) => <div className="causal-card" key={h}><h3>Head {h + 1} · attention weights</h3><p>Query ↓ &nbsp; · &nbsp; Key →</p><div className="causal-table-scroll"><table><thead><tr><th scope="col">Query / key</th>{names.map((name, i) => <th scope="col" key={i}>{i} · {name}</th>)}</tr></thead><tbody>{head.rows.map((row, i) => <tr key={i} className={selected === i ? 'causal-selected' : ''}><th scope="row">{i} · {names[i]}{i === selected ? ' ◀' : ''}</th>{row.weights.map((weight, j) => <td key={j} className={j > i ? 'causal-blocked' : 'causal-allowed'}>{j > i ? <span>⊘ blocked<br /><small>weight 0</small></span> : step >= 1 ? fmt(weight) : '—'}</td>)}</tr>)}</tbody></table></div><p className="causal-small">Each row sums to 1 before rounding. Blocked cells are always zero.</p></div>)}</div>
      <div className="causal-arrow" aria-hidden="true">↓</div>
      <h3>Selected query: {selected} · {names[selected]}</h3>
      <div className="causal-details">{data.heads.map((head, h) => { const row = head.rows[selected]; return <div className="causal-card" key={h}><h4>Head {h + 1}</h4><p>Q = <code>{vec(head.queries[selected])}</code></p><div className="causal-table-scroll"><table><thead><tr><th>Key position</th><th>Scaled score</th><th>After mask</th><th>Weight</th><th>Value V</th></tr></thead><tbody>{names.map((name, i) => <tr key={i}><th scope="row">{i} · {name}</th><td>{fmt(row.scores[i])}</td><td>{i > selected ? '−∞ blocked' : fmt(row.scores[i])}</td><td>{i > selected ? '0' : step >= 1 ? fmt(row.weights[i]) : '—'}</td><td><code>{vec(head.values[i])}</code></td></tr>)}</tbody></table></div><p>Weighted V mixture · width 2: <strong>{step >= 2 ? vec(row.output) : '—'}</strong></p></div> })}</div>
      <div className="causal-arrow" aria-hidden="true">↓</div>
      <div className="causal-output"><h3>Join the heads, then project</h3><p>Place head 1’s two numbers beside head 2’s two numbers (not added) → four-number row → supplied 4 × 4 output projection.</p><div className="causal-flow"><div><span>Head 1 · 2 numbers</span><strong>{step >= 2 ? vec(data.heads[0].rows[selected].output) : '—'}</strong></div><b>and</b><div><span>Head 2 · 2 numbers</span><strong>{step >= 2 ? vec(data.heads[1].rows[selected].output) : '—'}</strong></div><b>→</b><div><span>Concatenated · 4</span><strong>{step >= 2 ? vec(data.combined[selected].concatenated) : '—'}</strong></div><b>→</b><div><span>Projected · 4</span><strong>{step >= 2 ? vec(data.combined[selected].projected) : '—'}</strong></div></div>
        <details><summary>Inspect the 4 × 4 output projection weights</summary><p>Input numbers are rows; output numbers are columns. Bias is [0, 0, 0, 0].</p><table><thead><tr><th>Input</th>{[1, 2, 3, 4].map(i => <th key={i}>Output {i}</th>)}</tr></thead><tbody>{DECODER_PARAMETERS.attention.output.map((row, i) => <tr key={i}><th scope="row">{i + 1}</th>{row.map((value, j) => <td key={j}>{value}</td>)}</tr>)}</tbody></table></details>
      </div>
      <div className="llm-playback" role="group" aria-label="Causal attention playback"><PlaybackButton action="previous" label="Previous causal attention step" disabled={step === 0} onClick={() => { setPlaying(false); setStep(step - 1) }} /><PlaybackButton action={playing ? 'pause' : step === 2 ? 'replay' : 'play'} label={reduce ? 'Autoplay disabled: reduced motion is preferred' : playing ? 'Pause causal attention' : step === 2 ? 'Replay causal attention' : 'Play causal attention'} disabled={reduce} aria-pressed={playing} onClick={() => { if (step === 2) setStep(0); setPlaying(!playing) }} /><PlaybackButton action="next" label="Next causal attention step" disabled={step === 2} onClick={() => { setPlaying(false); setStep(step + 1) }} /><span role="status">Step {step + 1} of 3{reduce ? ' · Reduced motion: explore with Previous and Next.' : ''}</span></div>
    </section><p className="causal-boundary">Values are rounded to four decimals for display; calculations use full precision. These parameters are supplied, hand-authored and not trained. Attention weights describe mixtures, not proof of reasoning or causation.</p>
  </article>
}
