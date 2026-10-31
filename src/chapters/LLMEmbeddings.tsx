import { useEffect, useState } from 'react'
import { PlaybackButton } from '../components/PlaybackButton'
import { addVectors, DECODER_VOCABULARY, embeddingFor, positionFor, POSITION_ROWS } from './llmEmbeddingsData'
import './LargeLanguageModels.css'
import './LLMEmbeddings.css'

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const vector = (values: readonly number[]) => `[ ${values.join(', ')} ]`

export function LLMEmbeddings() {
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
    const timer = window.setTimeout(() => setStep(value => value + 1), 1500)
    return () => window.clearTimeout(timer)
  }, [playing, reduce, step])
  const embedding = embeddingFor(1)
  const position = positionFor(1)
  return <article className="llm-lesson embedding-lesson">
    <header className="llm-header">
      <p className="llm-eyebrow">99.3 · Large Language Models</p>
      <h1>Embeddings and position</h1>
      <p className="llm-definition">A <strong>vector is a short list of numbers.</strong></p>
      <p>An embedding turns a token ID into a vector; a position vector adds information about where it appears.</p>
    </header>
    <section className="llm-demo embedding-demo" aria-labelledby="embedding-title">
      <div className="llm-demo-heading"><h2 id="embedding-title">From ID to a position-aware row</h2><p>Follow the token <strong>cat</strong> at position 1</p></div>
      <div className="embedding-flow">
        <div className="embedding-tables">
          <div><h3>1 · Token embedding table</h3><p>IDs are labels, not numeric meaning.</p>
            <table><thead><tr><th scope="col">ID</th><th scope="col">Token</th><th scope="col">Embedding · 4 numbers</th></tr></thead><tbody>{DECODER_VOCABULARY.map(row => <tr key={row.id} className={row.id === 1 ? 'embedding-selected' : ''}><td>{row.id}</td><td><code>{row.token.startsWith(' ') ? `␠${row.token.slice(1)}` : row.token}</code></td><td><code>{vector(row.embedding)}</code></td></tr>)}</tbody></table>
            <p className="embedding-small">␠ is a leading space. This decoder vocabulary is separate from 99.2’s tokenizer.</p>
          </div>
          <div><h3>2 · Position table</h3><p>Positions start at 0; this context holds up to 4 tokens.</p>
            <table><thead><tr><th scope="col">Position</th><th scope="col">Position vector</th></tr></thead><tbody>{POSITION_ROWS.map((row, i) => <tr key={i} className={i === 1 && step >= 1 ? 'embedding-selected' : ''}><td>{i}</td><td><code>{vector(row)}</code></td></tr>)}</tbody></table>
          </div>
        </div>
        <div className="embedding-worked"><h3>3 · Add matching numbers</h3>
          <p>Look up ID <strong>1</strong> → <strong>cat</strong> → its embedding row. Then add the position 1 row, element by element.</p>
          <div className="embedding-equation" aria-label="Embedding plus position equals result">
            <div><span>Embedding</span><code>{vector(embedding)}</code></div><b>+</b>
            <div><span>Position 1</span><code>{step >= 1 ? vector(position) : '—'}</code></div><b>=</b>
            <div className="embedding-result"><span>Combined row</span><code>{step >= 2 ? vector(addVectors(embedding, position)) : '—'}</code></div>
          </div>
          {step >= 2 && <p className="embedding-arithmetic">0 + 1 = 1 &nbsp;·&nbsp; 1 + 0 = 1 &nbsp;·&nbsp; 1 + 0 = 1 &nbsp;·&nbsp; 0 + 0 = 0</p>}
        </div>
      </div>
      <div className="llm-playback" role="group" aria-label="Embedding playback">
        <PlaybackButton action="previous" label="Previous embedding step" disabled={step === 0} onClick={() => { setPlaying(false); setStep(step - 1) }} />
        <PlaybackButton action={playing ? 'pause' : step === 2 ? 'replay' : 'play'} label={reduce ? 'Autoplay disabled: reduced motion is preferred' : playing ? 'Pause embedding' : step === 2 ? 'Replay embedding' : 'Play embedding'} disabled={reduce} aria-pressed={playing} onClick={() => { if (step === 2) setStep(0); setPlaying(!playing) }} />
        <PlaybackButton action="next" label="Next embedding step" disabled={step === 2} onClick={() => { setPlaying(false); setStep(step + 1) }} />
        <span role="status">Step {step + 1} of 3{reduce ? ' · Reduced motion: explore with Previous and Next.' : ''}</span>
      </div>
    </section>
    <section className="embedding-repeat"><div><h2>Same token, different position</h2><p>The same ID selects the same embedding. Adding a different position row changes the combined row.</p></div>
      <table><thead><tr><th scope="col">Token · ID</th><th scope="col">Embedding</th><th scope="col">Position row</th><th scope="col">Combined row</th></tr></thead><tbody>{[0, 1].map(i => <tr key={i}><td>cat · 1</td><td><code>{vector(embedding)}</code></td><td><code>{i}: {vector(positionFor(i))}</code></td><td><code>{vector(addVectors(embedding, positionFor(i)))}</code></td></tr>)}</tbody></table>
      <p className="embedding-small">These values are supplied for this example, not trained here. Coordinates do not have fixed human meanings. The position rows are a hand-authored lookup, not the original Transformer’s sinusoidal encoding.</p>
    </section>
  </article>
}
