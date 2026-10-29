import { useEffect, useState } from 'react'
import { PlaybackButton } from '../components/PlaybackButton'
import { sentenceSpans, tokenize, tokenPresets, type Mode } from './nlpTokenization'
import './NLPIntroduction.css'
import './NLPTokenization.css'

const stages = ['Message', 'Sentences', 'Word pieces', 'Subwords & IDs']
const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const visible = (text: string) => text.replace(/ /g, '␠')

export function NLPTokenization() {
  const [preset, setPreset] = useState(0)
  const [stage, setStage] = useState(() => reduced() ? 3 : 0)
  const [mode, setMode] = useState<Mode>('subword')
  const [selected, setSelected] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [reduce, setReduce] = useState(reduced)
  const text = tokenPresets[preset].text
  const actualMode = stage === 3 ? mode : 'word'
  const pieces = tokenize(text, actualMode)
  const current = pieces[selected] ?? pieces[0]
  const sentences = sentenceSpans(text)
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => { setReduce(media.matches); if (media.matches) { setPlaying(false); setStage(3) } }
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  useEffect(() => {
    if (!playing || reduce) return
    if (stage === 3) { setPlaying(false); return }
    const timer = window.setTimeout(() => { setStage(value => value + 1); setSelected(0) }, 2200)
    return () => window.clearTimeout(timer)
  }, [playing, reduce, stage])
  const step = (value: number) => { setPlaying(false); setSelected(0); setStage(value) }
  return <article className="nlp-lesson nlp-token-lesson">
    <header className="nlp-header"><p className="nlp-eyebrow">97.2 · Natural Language Processing</p><h1>Where does a sentence begin and a token end?</h1><p className="nlp-definition"><strong>Tokenization</strong> splits text into pieces called tokens.</p><p>Follow one message from sentences to words, punctuation and smaller word pieces.</p></header>
    <section className="nlp-map" aria-labelledby="boundary-title">
      <div className="nlp-map-heading"><div><p className="nlp-eyebrow">MESSAGE → SENTENCES → TOKENS</p><h2 id="boundary-title">Trace the boundaries</h2></div><p>Choose a message, then step through the views.</p></div>
      <div className="nlp-token-presets" role="group" aria-label="Choose a message">{tokenPresets.map((item, index) => <button type="button" key={item.id} aria-pressed={preset === index} onClick={() => { setPlaying(false); setPreset(index); setSelected(0) }}>{item.id} · {index === 0 ? 'Three sentences' : index === 1 ? 'Subword example' : 'Repeated punctuation'}</button>)}</div>
      <p className="nlp-token-key"><b>Reading the marks:</b> ␠ is a space. <b>[start, end)</b> counts characters from zero: start is included, end is excluded.</p>
      <div className="nlp-token-stages" role="group" aria-label="Choose a view">{stages.map((name, index) => <button type="button" key={name} aria-pressed={stage === index} onClick={() => step(index)}><span>0{index + 1}</span> {name}</button>)}</div>
      <div className="nlp-source"><p className="nlp-kicker">SOURCE MESSAGE · {tokenPresets[preset].id}</p><p>{stage >= 2 && current ? <>{visible(text.slice(0, current.start))}<mark>{visible(current.text)}</mark>{visible(text.slice(current.end))}</> : visible(text)}</p></div>
      {stage >= 1 && <div className="nlp-token-section"><h3>Sentence spans</h3><p>Our tiny rule keeps consecutive <b>., !, ?</b> endings with the sentence; following spaces begin the next span. Any final remainder stays visible.</p><div className="nlp-sentence-list">{sentences.map((sentence, i) => <div key={sentence.start}><b>{i + 1}</b><code>{visible(sentence.text)}</code><small>[{sentence.start}, {sentence.end})</small></div>)}</div></div>}
      {stage >= 2 && <div className="nlp-token-section"><h3>{stage === 3 ? 'Pieces and lookup IDs' : 'Word and punctuation pieces'}</h3><p>Choose a tile to highlight its exact source span. Spaces are separate reconstruction pieces, not word tokens.</p>
        {stage === 3 && <><div className="nlp-token-modes" role="group" aria-label="Choose vocabulary">{(['word', 'subword'] as const).map(value => <button type="button" key={value} aria-pressed={mode === value} onClick={() => { setPlaying(false); setMode(value); setSelected(0) }}>{value === 'word' ? 'Whole-word vocabulary' : 'Subword vocabulary'}</button>)}</div><p>The authored subword rule splits <b>working → work + ing</b>; try CS06. Each vocabulary has its own fixed IDs: lookup labels, not numerical meaning. These are not the vocabulary in 99.2.</p></>}
        <div className="nlp-token-tiles" role="group" aria-label="Select a piece">{pieces.map((piece, index) => <button type="button" key={piece.start} className={`nlp-piece nlp-piece-${piece.kind}`} aria-pressed={index === selected} onClick={() => { setPlaying(false); setSelected(index) }}><b>{visible(piece.text)}</b><small>{piece.kind === 'space' ? 'space' : stage === 3 ? `ID ${piece.id}` : piece.kind}</small></button>)}</div>
        {current && <div className="nlp-token-selected" aria-live="polite"><b>Selected: {visible(current.text)}</b><span>{current.kind} · [{current.start}, {current.end}){stage === 3 ? current.id === null ? ' · no ID (space)' : ` · ID ${current.id}` : ''}</span></div>}
      </div>}
      <div className="nlp-playback" role="group" aria-label="Boundary tracing playback"><PlaybackButton action="previous" label="Previous view" disabled={stage === 0} onClick={() => step(stage - 1)} /><PlaybackButton action={playing ? 'pause' : stage === 3 ? 'replay' : 'play'} label={reduce ? 'Autoplay disabled: reduced motion is preferred' : playing ? 'Pause views' : stage === 3 ? 'Replay views' : 'Play views'} disabled={reduce} aria-pressed={playing} onClick={() => { if (stage === 3) { setStage(0); setSelected(0) } setPlaying(!playing) }} /><PlaybackButton action="next" label="Next view" disabled={stage === 3} onClick={() => step(stage + 1)} /><span role="status">View {stage + 1} of 4{reduce ? ' · Reduced motion: step manually.' : ''}</span></div>
      <p className="nlp-token-rule"><b>Our small English-example rule:</b> letters and internal apostrophes stay together (so “I'm” is one word); punctuation is separate. It is not a general sentence parser and does not handle abbreviations. Only the three shown messages are supported.</p>
    </section><nav className="nlp-links" aria-label="Related lesson"><b>Continue exploring</b><a href="#chapter-99/99.2-tokenization">99.2 Tokenization: text into token IDs →</a></nav>
  </article>
}
