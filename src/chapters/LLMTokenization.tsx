import { useEffect, useState } from 'react'
import { PlaybackButton } from '../components/PlaybackButton'
import { decodeToy, tokenizeToy, TOY_VOCABULARY } from './llmTokenizer'
import './LargeLanguageModels.css'
import './LLMTokenization.css'

const text = 'cat playing!'
const ids = tokenizeToy(text)
const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function LLMTokenization() {
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

  return <article className="llm-lesson token-lesson">
    <header className="llm-header">
      <p className="llm-eyebrow">99.2 · Large Language Models</p>
      <h1>Tokenization: text into token IDs</h1>
      <p className="llm-definition">A <strong>token is a piece of text</strong>—it can be a whole word, part of a word, a space, or punctuation.</p>
      <p>How does text become the numbers a language model can work with?</p>
    </header>

    <section className="llm-demo token-demo" aria-labelledby="token-demo-title">
      <div className="llm-demo-heading"><h2 id="token-demo-title">From text to IDs</h2><p>Using our tiny lookup tokenizer</p></div>
      <div className="token-stage"><span className="token-stage-number">01</span><div><h3>Text</h3><p className="token-input">{text}</p></div></div>
      <div className="token-arrow" aria-hidden="true">↓</div>
      <div className={`token-stage ${step < 1 ? 'token-pending' : ''}`}><span className="token-stage-number">02</span><div><h3>Split into pieces</h3>
        {step >= 1 ? <div className="token-pieces">{ids.map((id, i) => { const piece = TOY_VOCABULARY.find(item => item.id === id)!; return <span key={i} className={`token-piece token-color-${i}`} aria-label={piece.piece === ' ' ? 'space' : piece.piece}>{piece.piece === ' ' ? '␠' : piece.piece}</span> })}</div> : <p>Pieces appear here.</p>}
        <p className="token-caption">␠ represents one space. The punctuation is a piece too.</p>
      </div></div>
      <div className="token-arrow" aria-hidden="true">↓</div>
      <div className={`token-stage ${step < 2 ? 'token-pending' : ''}`}><span className="token-stage-number">03</span><div><h3>Look up each piece’s ID</h3>
        {step >= 2 ? <div className="token-pieces">{ids.map((id, i) => <span className={`token-piece token-id token-color-${i}`} key={i}>{id}</span>)}</div> : <p>IDs appear here.</p>}
        <p className="token-caption">IDs are labels for pieces, not measurements of their meaning.</p>
      </div></div>
      <div className="llm-playback" role="group" aria-label="Tokenization playback">
        <PlaybackButton action="previous" label="Previous tokenization step" disabled={step === 0} onClick={() => { setPlaying(false); setStep(step - 1) }} />
        <PlaybackButton action={playing ? 'pause' : step === 2 ? 'replay' : 'play'} label={reduce ? 'Autoplay disabled: reduced motion is preferred' : playing ? 'Pause tokenization' : step === 2 ? 'Replay tokenization' : 'Play tokenization'} disabled={reduce} aria-pressed={playing} onClick={() => { if (step === 2) setStep(0); setPlaying(!playing) }} />
        <PlaybackButton action="next" label="Next tokenization step" disabled={step === 2} onClick={() => { setPlaying(false); setStep(step + 1) }} />
        <span role="status">Step {step + 1} of 3{reduce ? ' · Reduced motion: explore with Previous and Next.' : ''}</span>
      </div>
    </section>

    <section className="token-explain" aria-label="Understanding the pieces">
      <div><h2>One word, or several pieces?</h2><p><strong>cat</strong> is one whole-word token in this lookup. <strong>playing</strong> is split into <strong>play</strong> + <strong>ing</strong>: two subword tokens. A token does not have to be a word.</p></div>
      <div><h2>Our tiny lookup vocabulary</h2><p>A <strong>vocabulary</strong> is the list of available tokens and their IDs. This hand-made lookup chooses the longest matching piece at each position.</p>
        <div className="token-vocab">{TOY_VOCABULARY.map(item => <span key={item.id}><code>{item.piece === ' ' ? '␠ (space)' : item.piece}</code> → {item.id}</span>)}</div>
        <p>Reading those IDs back gives <strong>{decodeToy(ids)}</strong>. This works for text covered by this tiny vocabulary.</p></div>
      <div><h2>Unknown and special tokens</h2><p>For an unsupported character, this lookup uses <code>&lt;unknown&gt;</code> (ID 8); its original character cannot be recovered. A special <code>&lt;end&gt;</code> marker (ID 7) can signal an end and adds no text when decoded.</p><p>These markers are separate IDs, not literal input text. Real tokenizers use different vocabularies and rules; some can represent text without an unknown token. This example does not reproduce a production tokenizer.</p></div>
    </section>
  </article>
}
