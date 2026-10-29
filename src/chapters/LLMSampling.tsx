import { useEffect, useState } from 'react'
import { PlaybackButton } from '../components/PlaybackButton'
import { DECODER_VOCABULARY } from './llmEmbeddings'
import { lastDecoderDistribution } from './llmLogits'
import { categoricalIndex, cumulativeIntervals, greedyIndex, nextSeededDraw, temperatureDistribution } from './llmSampling'
import './LargeLanguageModels.css'
import './LLMSampling.css'

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const logits = lastDecoderDistribution([0, 1, 2]).logits
const initialSeed = 42
const first = nextSeededDraw(initialSeed)
const name = (i: number) => DECODER_VOCABULARY[i].token.replace(/^ /, '␠')
const fmt = (n: number) => n.toFixed(4)

export function LLMSampling() {
  const [temperature, setTemperature] = useState(1)
  const [random, setRandom] = useState(first)
  const [count, setCount] = useState(1)
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
    const timer = window.setTimeout(() => setStep(value => value + 1), 1800)
    return () => window.clearTimeout(timer)
  }, [playing, reduce, step])
  const { scaled, probabilities } = temperatureDistribution(logits, temperature)
  const intervals = cumulativeIntervals(probabilities)
  const selected = categoricalIndex(probabilities, random.draw)
  const greedy = greedyIndex(logits)
  return <article className="llm-lesson sampling-lesson">
    <header className="llm-header"><p className="llm-eyebrow">99.9 · Large Language Models</p><h1>Sampling and temperature</h1><p className="llm-definition"><strong>Temperature divides the logits</strong> before softmax; it must be greater than zero.</p><p>Lower temperature sharpens the distribution; higher temperature flattens it. The model weights do not change.</p></header>
    <section className="llm-demo sampling-demo" aria-labelledby="sampling-title"><div className="llm-demo-heading"><h2 id="sampling-title">Choose a next token</h2><p>Same five decoder logits as 99.8 · context: The cat sat</p></div>
      <fieldset className="sampling-temperature"><legend>Temperature</legend><p>Change the divisor and compare the probabilities and selected interval.</p>{[0.5, 1, 2].map(t => <label key={t}><input type="radio" name="sampling-temperature" checked={temperature === t} onChange={() => { setPlaying(false); setTemperature(t) }} /> {t}{t === 0.5 ? ' · sharper' : t === 2 ? ' · flatter' : ''}</label>)}</fieldset>
      <div className="sampling-panel"><h3>1 · Divide scores, then softmax</h3><p>Original logits: <code>[ {logits.map(fmt).join(', ')} ]</code></p><p>Logits ÷ {temperature}: <code>{step >= 1 ? `[ ${scaled.map(fmt).join(', ')} ]` : '—'}</code></p>
        <div className="sampling-heading"><span>Token</span><span>Probability · 0% → 100%</span></div>{probabilities.map((p, i) => <div className={`sampling-row ${step >= 3 && selected === i ? 'is-selected' : ''}`} key={i}><strong>{name(i)}</strong><div className="sampling-bar"><div className="sampling-track"><div style={{ width: step >= 1 ? `${p * 100}%` : '0%' }} /></div><span>{step >= 1 ? `${(p * 100).toFixed(2)}%` : '—'}</span></div></div>)}
        <p className="sampling-small">Greedy picks the highest score: <strong>{name(greedy)}</strong>. The and . are tied up to floating-point precision; this example breaks ties by the earliest vocabulary entry (tolerance 10⁻¹²).</p></div>
      <div className="sampling-arrow" aria-hidden="true">↓</div>
      <div className="sampling-panel"><h3>2 · Draw from the probability intervals</h3><p>Sampling uses a draw from 0 up to but not including 1. Each token gets an interval as wide as its probability; the draw selects the interval containing it.</p>
        <div className="sampling-band" aria-label="Cumulative probability interval band">{intervals.map((interval, i) => <div key={i} className={`sampling-segment sampling-color-${i}`} style={{ width: `${(interval.end - interval.start) * 100}%` }} title={`${name(i)}: ${fmt(interval.start)} to ${fmt(interval.end)}`} />)}{step >= 2 && <div className="sampling-marker" style={{ left: `${random.draw * 100}%` }} aria-label={`Draw ${random.draw.toFixed(6)}`} />}</div><div className="sampling-endpoints"><span>0</span><span>1</span></div>
        <p className="sampling-draw">Seed {initialSeed} · draw {count}: <strong>{step >= 2 ? random.draw.toFixed(6) : '—'}</strong>{step >= 3 && <> → selected <strong>{name(selected)}</strong></>}</p>
        <div className="sampling-scroll"><table><thead><tr><th>Token</th><th>Interval [start, end)</th><th>Result</th></tr></thead><tbody>{intervals.map((interval, i) => <tr key={i} className={step >= 3 && selected === i ? 'is-selected' : ''}><th scope="row"><span className={`sampling-dot sampling-color-${i}`} />{name(i)}</th><td>[{fmt(interval.start)}, {fmt(interval.end)})</td><td>{step >= 3 && selected === i ? '← draw falls here' : ''}</td></tr>)}</tbody></table></div>
        <p className="sampling-small">Boundaries shown rounded; selection uses full precision. A boundary belongs to the interval on its right. ␠ is a leading space.</p><div className="sampling-actions"><button type="button" onClick={() => { setPlaying(false); setRandom(nextSeededDraw(random.state)); setCount(count + 1); setStep(3) }}>Next draw</button><button type="button" onClick={() => { setPlaying(false); setRandom(first); setCount(1); setStep(3) }}>Reset seed</button></div><p className="sampling-small">A fixed seed makes this sequence repeatable. Reset returns to the first draw; this teaching generator is not a production sampler.</p>
      </div>
      <div className="llm-playback" role="group" aria-label="Sampling playback"><PlaybackButton action="previous" label="Previous sampling step" disabled={step === 0} onClick={() => { setPlaying(false); setStep(step - 1) }} /><PlaybackButton action={playing ? 'pause' : step === 3 ? 'replay' : 'play'} label={reduce ? 'Autoplay disabled: reduced motion is preferred' : playing ? 'Pause sampling trace' : step === 3 ? 'Replay sampling trace' : 'Play sampling trace'} disabled={reduce} aria-pressed={playing} onClick={() => { if (step === 3) setStep(0); setPlaying(!playing) }} /><PlaybackButton action="next" label="Next sampling step" disabled={step === 3} onClick={() => { setPlaying(false); setStep(step + 1) }} /><span role="status">Step {step + 1} of 4{reduce ? ' · Reduced motion: explore with Previous and Next.' : ''}</span></div>
    </section>
  </article>
}
