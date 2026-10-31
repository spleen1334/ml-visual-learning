import { useEffect, useState } from 'react'
import { PlaybackButton } from '../components/PlaybackButton'
import { DECODER_PARAMETERS } from './llmEmbeddingsData'
import { transformerBlock } from './llmBlock'
import './LargeLanguageModels.css'
import './LLMTransformerBlock.css'

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const data = transformerBlock([0, 1, 2])
const tokens = ['The', '␠cat', '␠sat']
const fmt = (n: number) => n.toFixed(4)
const vec = (row: readonly number[]) => `[ ${row.map(fmt).join(', ')} ]`

export function LLMTransformerBlock() {
  const [position, setPosition] = useState(0)
  const [step, setStep] = useState(() => reduced() ? 5 : 0)
  const [playing, setPlaying] = useState(false)
  const [reduce, setReduce] = useState(reduced)
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => { setReduce(media.matches); if (media.matches) { setPlaying(false); setStep(5) } }
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  useEffect(() => {
    if (!playing || reduce) return
    if (step === 5) { setPlaying(false); return }
    const timer = window.setTimeout(() => setStep(value => value + 1), 1700)
    return () => window.clearTimeout(timer)
  }, [playing, reduce, step])
  const row = data.rows[position]
  const norm = row.norm1
  return <article className="llm-lesson block-lesson">
    <header className="llm-header"><p className="llm-eyebrow">99.7 · Large Language Models</p><h1>A Transformer block</h1><p className="llm-definition">A <strong>Transformer block combines attention and a small feed-forward network</strong>, with additions and normalization around them.</p><p>Follow one token row through our supplied decoder block.</p></header>
    <section className="llm-demo block-demo" aria-labelledby="block-title"><div className="llm-demo-heading"><h2 id="block-title">One block, one row at a time</h2><p>Context: The cat sat · each input row has 4 numbers</p></div>
      <p>A <strong>residual connection</strong> adds a stage’s incoming row back to its output. <strong>Layer normalization</strong> centers and rescales the four numbers <em>within that token’s row</em>, not across tokens.</p>
      <fieldset className="block-selector"><legend>Choose a token position to trace</legend>{tokens.map((name, i) => <label key={i}><input type="radio" name="block-position" checked={position === i} onChange={() => { setPlaying(false); setPosition(i) }} /> {i} · {name}</label>)}</fieldset>
      <div className="block-diagram">
        <div className={`block-stage ${step === 0 ? 'is-active' : ''}`}><span>01 · INPUT</span><h3>Embedding + position · width 4</h3><code>{vec(row.input)}</code></div>
        <div className="block-residual-path"><div className="block-bypass"><span>Input row bypasses attention</span><b>↓</b><b>→</b></div><div className="block-main"><div className="block-arrow">↓</div><div className={`block-stage ${step === 1 ? 'is-active' : ''}`}><span>02 · CAUSAL ATTENTION</span><h3>Two heads → output projection · width 4</h3><code>{vec(row.attentionOutput)}</code><p>Uses this token and earlier tokens only.</p></div><div className="block-arrow">↓</div><div className={`block-stage block-add ${step === 2 ? 'is-active' : ''}`}><span>03 · RESIDUAL ADDITION</span><h3>Input + attention output</h3><code>{vec(row.residual1)}</code></div></div></div>
        <div className="block-arrow">↓</div><div className={`block-stage ${step === 3 ? 'is-active' : ''}`}><span>04 · NORMALIZE AFTER ADDITION</span><h3>Layer normalization 1 · width 4</h3><code>{vec(norm.output)}</code></div>
        <div className="block-residual-path"><div className="block-bypass"><span>Normalized row bypasses feed-forward</span><b>↓</b><b>→</b></div><div className="block-main"><div className="block-arrow">↓</div><div className={`block-stage ${step === 4 ? 'is-active' : ''}`}><span>05 · FEED-FORWARD</span><h3>4 → 8 → ReLU → 4</h3><code>{vec(row.ffOutput)}</code><p>The same supplied network is applied separately at every position. ReLU keeps positive numbers and turns negatives to zero.</p><details><summary>Inspect hidden rows and supplied weights</summary><p>Before ReLU · 8: <code>{vec(row.hidden)}</code></p><p>After ReLU · 8: <code>{vec(row.activated)}</code></p><p>Weights below: input rows × output columns; biases are all zero.</p>{(['input', 'output'] as const).map(key => <div className="block-table-scroll" key={key}><h4>{key === 'input' ? 'First projection · 4 × 8' : 'Second projection · 8 × 4'}</h4><table><thead><tr><th>Input</th>{DECODER_PARAMETERS.feedForward[key][0].map((_, j) => <th key={j}>Out {j + 1}</th>)}</tr></thead><tbody>{DECODER_PARAMETERS.feedForward[key].map((r, i) => <tr key={i}><th scope="row">{i + 1}</th>{r.map((value, j) => <td key={j}>{value}</td>)}</tr>)}</tbody></table></div>)}</details></div><div className="block-arrow">↓</div><div className={`block-stage block-add ${step === 5 ? 'is-active' : ''}`}><span>06 · RESIDUAL ADDITION</span><h3>Normalized row + feed-forward output</h3><code>{vec(row.residual2)}</code></div></div></div>
        <div className="block-arrow">↓</div><div className={`block-stage block-result ${step === 5 ? 'is-active' : ''}`}><span>BLOCK OUTPUT</span><h3>Layer normalization 2 · width 4</h3><code>{vec(row.norm2.output)}</code><p>No additional final normalization in this toy block.</p></div>
      </div>
      <div className="llm-playback" role="group" aria-label="Transformer block playback"><PlaybackButton action="previous" label="Previous block step" disabled={step === 0} onClick={() => { setPlaying(false); setStep(step - 1) }} /><PlaybackButton action={playing ? 'pause' : step === 5 ? 'replay' : 'play'} label={reduce ? 'Autoplay disabled: reduced motion is preferred' : playing ? 'Pause block trace' : step === 5 ? 'Replay block trace' : 'Play block trace'} disabled={reduce} aria-pressed={playing} onClick={() => { if (step === 5) setStep(0); setPlaying(!playing) }} /><PlaybackButton action="next" label="Next block step" disabled={step === 5} onClick={() => { setPlaying(false); setStep(step + 1) }} /><span role="status">Step {step + 1} of 6{reduce ? ' · Reduced motion: explore with Previous and Next.' : ''}</span></div>
      <div className="block-normalization"><h3>Inside the first normalization</h3><p>For this one residual row, mean = <strong>{fmt(norm.mean)}</strong>; population variance (average squared distance from the mean) = <strong>{fmt(norm.variance)}</strong>. Epsilon = <strong>0.00001</strong> keeps the denominator safe even when variance is zero.</p><p>First number: <span className="block-fraction"><span>{fmt(row.residual1[0])} − {fmt(norm.mean)}</span><span>√({fmt(norm.variance)} + 0.00001)</span></span> ≈ <strong>{fmt(norm.output[0])}</strong></p><p>In this toy, the normalization’s scale (gamma) is 1 and offset (beta) is 0 for every number. The second normalization uses the same method on its own residual row.</p></div>
    </section><p className="block-boundary">Values are rounded to four decimals for display; calculations use full precision. Parameters are supplied and hand-authored, not trained. This decoder-only toy is an adaptation, not the original encoder–decoder architecture.</p>
  </article>
}
