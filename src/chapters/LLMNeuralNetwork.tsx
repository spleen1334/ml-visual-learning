import { useEffect, useState } from 'react'
import { PlaybackButton } from '../components/PlaybackButton'
import { addVectors, embeddingFor, positionFor } from './llmEmbeddings'
import { NEURON_BIAS, NEURON_WEIGHTS, traceNeuron } from './llmNeuron'
import './LargeLanguageModels.css'
import './LLMNeuralNetwork.css'

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const vector = (row: readonly number[]) => `[ ${row.join(', ')} ]`
const number = (value: number) => Object.is(value, -0) ? '0' : String(value)

export function LLMNeuralNetwork() {
  const [position, setPosition] = useState(0)
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
    const timer = window.setTimeout(() => setStep(value => value + 1), 1700)
    return () => window.clearTimeout(timer)
  }, [playing, reduce, step])
  const input = addVectors(embeddingFor(1), positionFor(position))
  const result = traceNeuron(input, NEURON_WEIGHTS, NEURON_BIAS)

  return <article className="llm-lesson neuron-lesson">
    <header className="llm-header"><p className="llm-eyebrow">99.4 · Large Language Models</p><h1>The neural network inside</h1>
      <p className="llm-definition">A <strong>neural network transforms numbers</strong> through connected calculations.</p>
      <p>How can one small calculation change when its input changes?</p>
    </header>
    <section className="llm-demo neuron-demo" aria-labelledby="neuron-title">
      <div className="llm-demo-heading"><h2 id="neuron-title">Follow one neuron</h2><p>One of eight neurons in the toy feed-forward first layer</p></div>
      <div className="neuron-intro"><p>A <strong>weight</strong> multiplies an input number. A <strong>bias</strong> is added to the sum. Both are <strong>parameters</strong>: stored numbers used in the calculation.</p>
        <p>These parameters were hand-chosen and supplied, not trained. They stay fixed when the input changes; individual coordinates have no fixed human meaning.</p></div>
      <fieldset className="neuron-choice"><legend>Choose the input: cat at which position?</legend><p>Changing position changes the input row. Compare the neuron’s output.</p>
        {[0, 1].map(i => <label key={i} className={position === i ? 'is-selected' : ''}><input type="radio" name="neuron-position" checked={position === i} onChange={() => { setPlaying(false); setPosition(i) }} /> Position {i}</label>)}
      </fieldset>
      <div className="neuron-trace">
        <div className="neuron-input"><span className="neuron-kicker">INPUT · 4 NUMBERS</span><strong>Embedding + position</strong><code>{vector(embeddingFor(1))} + {vector(positionFor(position))}</code><code className="neuron-row">{vector(input)}</code></div>
        <div className="neuron-arrow" aria-hidden="true">↓</div>
        <div className="neuron-calc"><span className="neuron-kicker">MULTIPLY AND ADD</span><h3>Dot product + bias</h3><p>A <strong>dot product</strong> multiplies matching numbers and adds the results.</p>
          <div className="neuron-products">{input.map((value, i) => <div key={i}><span>Input {i + 1} × weight {i + 1}</span><code>{number(value)} × ({number(NEURON_WEIGHTS[i])})</code><strong>= {step >= 1 ? number(result.products[i]) : '—'}</strong></div>)}</div>
          <p className="neuron-sum">{step >= 1 ? <><strong>{result.products.map(number).join(' + ')}</strong> = {number(result.dot)} &nbsp; + bias {number(result.bias)} &nbsp; = <strong>{number(result.beforeActivation)}</strong></> : 'Multiply each pair, then add the products and bias.'}</p>
        </div>
        <div className="neuron-arrow" aria-hidden="true">↓</div>
        <div className="neuron-activation"><div><span className="neuron-kicker">ACTIVATION</span><h3>Apply ReLU</h3><p>An <strong>activation</strong> changes the sum. ReLU keeps positive numbers, turns negative numbers into zero, and leaves zero at zero. This bend makes it nonlinear.</p><p className="neuron-examples">ReLU(−0.25) = 0 &nbsp; · &nbsp; ReLU(0) = 0 &nbsp; · &nbsp; ReLU(0.25) = 0.25</p></div>
          <div className="neuron-output"><span>THIS NEURON’S OUTPUT</span><strong>{step >= 2 ? number(result.output) : '—'}</strong>{step >= 2 && <small>ReLU({number(result.beforeActivation)})</small>}</div>
        </div>
      </div>
      <div className="llm-playback" role="group" aria-label="Neuron calculation playback">
        <PlaybackButton action="previous" label="Previous neuron step" disabled={step === 0} onClick={() => { setPlaying(false); setStep(step - 1) }} />
        <PlaybackButton action={playing ? 'pause' : step === 2 ? 'replay' : 'play'} label={reduce ? 'Autoplay disabled: reduced motion is preferred' : playing ? 'Pause neuron calculation' : step === 2 ? 'Replay neuron calculation' : 'Play neuron calculation'} disabled={reduce} aria-pressed={playing} onClick={() => { if (step === 2) setStep(0); setPlaying(!playing) }} />
        <PlaybackButton action="next" label="Next neuron step" disabled={step === 2} onClick={() => { setPlaying(false); setStep(step + 1) }} />
        <span role="status">Step {step + 1} of 3{reduce ? ' · Reduced motion: explore with Previous and Next.' : ''}</span>
      </div>
    </section>
    <p className="neuron-boundary">This is one output of the first layer, not the whole network’s output. The toy’s first layer has eight neurons, each with its own weights. In the full block the same feed-forward transformation is applied at each token position; its actual input comes after attention and normalization. Here we use the earlier embedding-plus-position row to isolate the calculation.</p>
  </article>
}
