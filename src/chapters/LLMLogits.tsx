import { useEffect, useState } from 'react'
import { PlaybackButton } from '../components/PlaybackButton'
import { DECODER_PARAMETERS, DECODER_VOCABULARY } from './llmEmbeddings'
import { stableSoftmax } from './llmAttention'
import { lastDecoderDistribution } from './llmLogits'
import './LargeLanguageModels.css'
import './LLMLogits.css'

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const sample = stableSoftmax([0, 1, 2])
const actual = lastDecoderDistribution([0, 1, 2])
const fmt = (n: number) => n.toFixed(4)
const vec = (row: readonly number[]) => `[ ${row.map(fmt).join(', ')} ]`

export function LLMLogits() {
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
    const timer = window.setTimeout(() => setStep(value => value + 1), 1900)
    return () => window.clearTimeout(timer)
  }, [playing, reduce, step])
  return <article className="llm-lesson logits-lesson">
    <header className="llm-header"><p className="llm-eyebrow">99.8 · Large Language Models</p><h1>Logits and softmax</h1><p className="llm-definition">A <strong>logit is an unnormalized score</strong>, not a probability; it can be negative.</p><p>Softmax converts scores into nonnegative probabilities that add to 1.</p></header>
    <section className="llm-demo logits-demo" aria-labelledby="logits-title"><div className="llm-demo-heading"><h2 id="logits-title">From scores to probabilities</h2><p>First, a small three-score calculation</p></div>
      <div className="logits-example"><h3>Separate example · three scores: [0, 1, 2]</h3><p><strong>Exponentiation</strong> means raising the number e (about 2.7183) to each score. It converts each score to a positive number.</p>
        <div className="logits-example-grid">{[0, 1, 2].map((n, i) => <div key={n}><span>Score {n}</span><strong>e<sup>{n}</sup> ≈ {['1.0000', '2.7183', '7.3891'][i]}</strong><span>{step >= 1 ? `Probability ≈ ${fmt(sample[i])}` : 'Probability: —'}</span></div>)}</div>
        <p>Sum of exponentials ≈ 1.0000 + 2.7183 + 7.3891 ≈ <strong>11.1073</strong> (using unrounded values). Divide each exponential by this same sum.</p>
        <p className="logits-equation">For score 2: <span className="logits-fraction"><span>e²</span><span>e⁰ + e¹ + e²</span></span> ≈ <span className="logits-fraction"><span>7.3891</span><span>11.1073</span></span> ≈ <strong>{step >= 1 ? fmt(sample[2]) : '—'}</strong></p>
        <p className="logits-small">For numerical stability, subtract the largest score from every score before exponentiating: [0, 1, 2] → [−2, −1, 0]. This gives the <strong>same probabilities</strong> while avoiding huge exponentials. Computation uses unrounded values.</p>
      </div>
      <div className="logits-arrow" aria-hidden="true">↓</div>
      <div className="logits-decoder"><h3>Now the toy decoder · five vocabulary tokens</h3><p>For context <strong>The cat sat</strong>, take the final block output for <strong>sat</strong>. The supplied 4 × 5 projection creates one logit per token; these five scores are separate from the three-score example.</p>
        <div className="logits-flow"><div><span>Final hidden row · 4</span><code>{vec(actual.hidden)}</code></div><b>→</b><div><span>Projection · 4 × 5</span><strong>5 logits</strong></div><b>→</b><div><span>Softmax</span><strong>5 probabilities</strong></div></div>
        <details><summary>Inspect the supplied projection and one logit</summary><p>Input numbers are rows; vocabulary tokens are output columns. All biases are zero. The values are hand-authored, not trained.</p><div className="logits-scroll"><table><thead><tr><th>Input</th>{DECODER_VOCABULARY.map(item => <th key={item.id}>{item.token.startsWith(' ') ? `␠${item.token.slice(1)}` : item.token}</th>)}</tr></thead><tbody>{DECODER_PARAMETERS.logits.projection.map((row, i) => <tr key={i}><th scope="row">{i + 1}</th>{row.map((x, j) => <td key={j}>{x}</td>)}</tr>)}</tbody></table></div><p>Logit for <strong>The</strong> ≈ {actual.hidden.map((value, i) => `${fmt(value)} × (${DECODER_PARAMETERS.logits.projection[i][0]})`).join(' + ')} + 0 ≈ <strong>{fmt(actual.logits[0])}</strong>.</p></details>
        <div className="logits-bars" aria-label="Decoder token logits and probabilities"><div className="logits-bars-heading"><span>Token</span><span>Logit</span><span>Probability · 0% → 100%</span></div>{DECODER_VOCABULARY.map((item, i) => <div className="logits-bar-row" key={item.id}><strong>{item.token.startsWith(' ') ? `␠${item.token.slice(1)}` : item.token}</strong><code>{step >= 2 ? fmt(actual.logits[i]) : '—'}</code><div className="logits-bar-cell"><div className="logits-track"><div style={{ width: step >= 3 ? `${100 * actual.probabilities[i]}%` : '0%' }} /></div><span>{step >= 3 ? `${(100 * actual.probabilities[i]).toFixed(2)}%` : '—'}</span></div></div>)}</div>
        <p className="logits-small">␠ denotes a leading space. Probabilities sum to 1 before rounding. These are the toy decoder’s calculated scores, not a claim of model quality.</p>
      </div>
      <div className="llm-playback" role="group" aria-label="Logits and softmax playback"><PlaybackButton action="previous" label="Previous softmax step" disabled={step === 0} onClick={() => { setPlaying(false); setStep(step - 1) }} /><PlaybackButton action={playing ? 'pause' : step === 3 ? 'replay' : 'play'} label={reduce ? 'Autoplay disabled: reduced motion is preferred' : playing ? 'Pause softmax' : step === 3 ? 'Replay softmax' : 'Play softmax'} disabled={reduce} aria-pressed={playing} onClick={() => { if (step === 3) setStep(0); setPlaying(!playing) }} /><PlaybackButton action="next" label="Next softmax step" disabled={step === 3} onClick={() => { setPlaying(false); setStep(step + 1) }} /><span role="status">Step {step + 1} of 4{reduce ? ' · Reduced motion: explore with Previous and Next.' : ''}</span></div>
    </section>
  </article>
}
