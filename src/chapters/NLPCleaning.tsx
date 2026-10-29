import { useState } from 'react'
import { supportCorpus } from './nlpData'
import { cleanMessage, cleaningPresets, lemmaLookup, stemLookup, stopWords, tokenCounts, type CleaningOptions } from './nlpCleaning'
import './NLPIntroduction.css'
import './NLPCleaning.css'

const initial: CleaningOptions = { lowercase: false, removeStopWords: false, form: 'none' }
const display = (value: string) => value.replace(/ /g, '␠')

export function NLPCleaning() {
  const [preset, setPreset] = useState(0)
  const [options, setOptions] = useState<CleaningOptions>(initial)
  const [selected, setSelected] = useState<number | null>(null)
  const message = cleaningPresets[preset]
  const pieces = cleanMessage(message.text, options)
  const counts = tokenCounts(pieces)
  const selectedPiece = selected === null ? null : pieces[selected]
  const notHelpful = supportCorpus[8].text.slice(0, 11)
  const helpful = supportCorpus[2].text.slice(0, 7)
  return <article className="nlp-lesson nlp-cleaning">
    <header className="nlp-header"><p className="nlp-eyebrow">97.3 · Natural Language Processing</p><h1>Cleaning can remove meaning</h1><p className="nlp-definition"><strong>Text normalization</strong> is a choice to change text into a more consistent form.</p><p>It is not numerical vector normalization. A useful change for one task can remove a clue needed for another. Preprocessing depends on the task, language and model; no choice is automatically correct.</p></header>
    <section className="nlp-map" aria-labelledby="cleaning-title">
      <div className="nlp-map-heading"><div><p className="nlp-eyebrow">ORIGINAL → TRANSFORMED</p><h2 id="cleaning-title">See what each choice changes</h2></div><p>Switch choices on and off; select a piece to trace it.</p></div>
      <div className="clean-definitions"><p><b>Lowercasing</b> changes capital letters to lowercase.</p><p><b>Stop words</b> are words a task may choose to leave out.</p><p><b>Stemming</b> shortens a word to a stem, which need not be a dictionary word.</p><p><b>Lemmatization</b> maps a word to a base dictionary form (a lemma).</p></div>
      <div className="clean-presets" role="group" aria-label="Choose a support message">{cleaningPresets.map((item, index) => <button type="button" key={item.id} aria-pressed={preset === index} onClick={() => { setPreset(index); setSelected(null) }}>{item.id}</button>)}</div>
      <div className="clean-options"><label><input type="checkbox" checked={options.lowercase} onChange={event => setOptions({ ...options, lowercase: event.target.checked })} /> Lowercase</label><label><input type="checkbox" checked={options.removeStopWords} onChange={event => setOptions({ ...options, removeStopWords: event.target.checked })} /> Remove listed stop words</label><label><input type="checkbox" checked={options.form === 'stem'} onChange={event => setOptions({ ...options, form: event.target.checked ? 'stem' : 'none' })} /> Stem lookup</label><label><input type="checkbox" checked={options.form === 'lemma'} onChange={event => setOptions({ ...options, form: event.target.checked ? 'lemma' : 'none' })} /> Lemma lookup</label></div>
      <p className="clean-rule">Order: lowercase → remove stop words → one lookup. Matching ignores case; lookups return the lowercase forms shown. The deliberately risky authored stop list is <b>{stopWords.join(', ')}</b>. Stem and lemma lookups are mutually exclusive, not general algorithms.</p>
      <div className="clean-lookup"><span><b>Stem lookup:</b> {Object.entries(stemLookup).map(([from, to]) => `${from} → ${to}`).join(' · ')}</span><span><b>Lemma lookup:</b> {Object.entries(lemmaLookup).map(([from, to]) => `${from} → ${to}`).join(' · ')}</span></div>
      <div className="clean-trace"><div className="clean-row"><p className="nlp-kicker">ORIGINAL · {message.id} · {counts.before} TOKENS</p><div className="clean-pieces">{pieces.map((piece, index) => <button key={piece.start} type="button" className={`clean-piece ${piece.changes.length ? piece.result ? 'changed' : 'deleted' : ''}`} aria-pressed={selected === index} onClick={() => setSelected(index)} title={`${piece.original} [${piece.start}, ${piece.end})`}>{display(piece.original)}</button>)}</div></div><div className="clean-direction" aria-hidden="true">↓</div><div className="clean-row"><p className="nlp-kicker">TRANSFORMED · {counts.after} TOKENS</p><div className="clean-pieces">{pieces.map((piece, index) => <button key={piece.start} type="button" className={`clean-piece ${piece.changes.length ? piece.result ? 'changed' : 'deleted' : ''}`} aria-pressed={selected === index} onClick={() => setSelected(index)} aria-label={piece.result ? `Transformed ${piece.result}` : `Removed ${piece.original}`}>{piece.result ? display(piece.result) : '∅'}</button>)}</div></div></div>
      <p className="clean-caption"><mark className="clean-legend-change">Gold = changed</mark> · <mark className="clean-legend-delete">Rose = removed</mark> · ␠ = preserved space; ∅ = removed word. Tokens here are words and individual punctuation marks; spaces are not counted. Spaces remain in place after removal.</p>
      <div className="clean-selection" aria-live="polite">{selectedPiece ? <><b>{display(selectedPiece.original)} → {selectedPiece.result ? display(selectedPiece.result) : '∅'}</b><span>Original character span [{selectedPiece.start}, {selectedPiece.end}) · {selectedPiece.changes.length ? selectedPiece.changes.join(' → ') : 'unchanged'}</span></> : <span>Select any piece in either row to see its original character span and changes.</span>}</div>
      <div className="clean-contrast"><div><p className="nlp-kicker">WHY “NOT” MATTERS</p><h3>Two different phrases</h3><p>Compare the remaining words from two support-message spans, ignoring case and spaces.</p></div><div className="clean-comparison"><div><small>CS03 · original span</small><b>{helpful}</b><span>Remaining word: helpful</span></div><div><small>CS09 · original span</small><b>{notHelpful}</b><span>Remaining word after removal: helpful</span></div></div><p>Removing <b>not</b> leaves the same word and erases the negation clue—not proof that the customers’ actual satisfaction is known. The full transformed text still preserves its spaces, and reference sentiment labels stay unchanged.</p></div>
    </section><nav className="nlp-links" aria-label="Related lessons"><b>Explore related lessons</b><a href="#chapter-09/9.23-cleaning-text-data">9.23 Cleaning text data</a><a href="#chapter-09/9.25-case-study-sentiment-analysis">9.25 Sentiment case study</a></nav>
  </article>
}
