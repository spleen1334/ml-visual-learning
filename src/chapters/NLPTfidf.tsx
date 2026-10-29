import { useState } from 'react'
import { countDocuments, featureTokens } from './nlpCountFeatures'
import { fitTfidf, transformTfidf } from './nlpTfidf'
import './NLPIntroduction.css'
import './NLPCountTable.css'
import './NLPTfidf.css'

const index = fitTfidf(countDocuments)
const rows = countDocuments.map(document => transformTfidf(index, document.text))
const fmt = (n: number) => n.toFixed(3)

function Fraction({ top, bottom }: { top: string; bottom: string }) {
  return <span className="tfidf-fraction"><span>{top}</span><span>{bottom}</span></span>
}

export function NLPTfidf() {
  const [selected, setSelected] = useState({ row: 2, term: 'waited' })
  const [normalized, setNormalized] = useState(false)
  const column = index.vocabulary.indexOf(selected.term)
  const row = rows[selected.row]
  const df = index.df[column]
  const tf = row.counts[column]
  const idf = index.idf[column]
  const contributing = countDocuments.filter((_, i) => rows[i].counts[column] > 0)
  const zeros = rows.reduce((total, item) => total + item.raw.filter(value => value === 0).length, 0)
  return <article className="nlp-lesson tfidf-lesson">
    <header className="nlp-header"><p className="nlp-eyebrow">97.5 · Natural Language Processing</p><h1>Which words distinguish a document?</h1><p className="nlp-definition"><strong>TF–IDF</strong> weights a term’s count using how many documents contain it.</p><p>Choose a cell to follow the count through the collection and into its weight.</p></header>
    <section className="nlp-map" aria-labelledby="tfidf-title"><div className="nlp-map-heading"><div><p className="nlp-eyebrow">COUNT → DOCUMENT FREQUENCY → WEIGHT</p><h2 id="tfidf-title">Trace a word’s weight</h2></div><p>All four messages and every vocabulary term remain available.</p></div>
      <p className="tfidf-intro"><b>Term frequency (tf)</b> is the word count in one document. <b>Document frequency (df)</b> counts documents containing the word, not its total appearances. <b>Inverse document frequency (idf)</b> gives words found in fewer documents a larger multiplier. The natural logarithm <b>ln</b> compresses the ratio, making large differences less extreme.</p>
      <p className="tfidf-equation tfidf-general">idf = ln( <Fraction top="1 + N" bottom="1 + df" /> ) + 1 &nbsp; · &nbsp; raw TF–IDF = tf × idf <small>(N = number of documents)</small></p>
      <p className="count-convention">Same word rule as 97.4: lowercase ASCII words with internal apostrophes; punctuation excluded, stop words kept, no stemming or lemmatization. CS09 is held-out for the later classifier; these four documents are a descriptive collection, not classifier fitting.</p>
      <div className="count-docs"><p className="nlp-kicker">SOURCE DOCUMENTS · N = 4</p>{countDocuments.map((doc, i) => {
        const tokens = featureTokens(doc.text).filter(token => token.text === selected.term)
        let position = 0
        const parts = tokens.flatMap(token => { const prefix = doc.text.slice(position, token.start); position = token.end; return [prefix, <mark key={token.start}>{doc.text.slice(token.start, token.end)}</mark>] })
        return <div key={doc.id} className={i === selected.row ? 'count-doc-active' : ''}><b>{doc.id}</b><span>{parts}{doc.text.slice(position)} {tokens.length > 0 && <small className="tfidf-doc-match">· contains term</small>}</span></div>
      })}</div>
      <div className="tfidf-table-head"><div><h3>Document × term</h3><p>4 × {index.vocabulary.length} = {4 * index.vocabulary.length} cells · {zeros} zeros · scroll sideways for all terms</p></div><label><input type="checkbox" checked={normalized} onChange={event => setNormalized(event.target.checked)} /> Optional L2 normalization</label></div>
      <div className="count-scroll" tabIndex={0} role="region" aria-label="Scrollable TF-IDF matrix"><table><thead><tr><th scope="col">Document</th>{index.vocabulary.map(term => <th key={term} scope="col">{term}</th>)}</tr></thead><tbody>{countDocuments.map((doc, i) => <tr key={doc.id}><th scope="row">{doc.id}</th>{index.vocabulary.map((term, j) => <td key={term}><button type="button" aria-pressed={i === selected.row && term === selected.term} aria-label={`${doc.id}, ${term}: ${normalized ? 'normalized' : 'raw'} ${fmt(normalized ? rows[i].normalized[j] : rows[i].raw[j])}`} onClick={() => setSelected({ row: i, term })}>{fmt(normalized ? rows[i].normalized[j] : rows[i].raw[j])}</button></td>)}</tr>)}</tbody></table></div>
      <p className="tfidf-rounding">Table shows {normalized ? 'L2-normalized' : 'raw'} weights rounded to 3 decimals; calculations retain full precision. Raw weights can exceed 1.</p>
      <div className="tfidf-trace" aria-live="polite"><h3>{countDocuments[selected.row].id} × “{selected.term}”</h3><div className="tfidf-steps"><div><span>01 · Within this document</span><p><b>tf = {tf}</b> {tf === 1 ? 'occurrence' : 'occurrences'}</p></div><div><span>02 · Across the collection</span><p><b>df = {df}</b> of N = {index.documentCount} documents</p><small>{contributing.map(doc => doc.id).join(', ')} contain “{selected.term}”.</small></div><div><span>03 · Multiplier</span><p className="tfidf-equation">idf = ln( <Fraction top={`1 + ${index.documentCount}`} bottom={`1 + ${df}`} /> ) + 1 ≈ <b>{fmt(idf)}</b></p></div><div><span>04 · Raw weight</span><p className="tfidf-equation">tf × idf = {tf} × {fmt(idf)} ≈ <b>{fmt(row.raw[column])}</b></p></div></div>
        {normalized && <div className="tfidf-normalization"><h4>Optional: normalize this document’s vector</h4><p>Vector normalization scales all raw weights in this row to length 1; it is not text cleaning.</p><p className="tfidf-equation">Length = √(sum of all raw weights²) = √({fmt(row.sumSquares)}) ≈ <b>{fmt(row.length)}</b></p><p className="tfidf-squares">Sum of squares: {row.raw.map((value, i) => value > 0 ? `${index.vocabulary[i]} ${fmt(value)}²` : null).filter(Boolean).join(' + ')} ≈ {fmt(row.sumSquares)} (zero terms contribute 0).</p><p className="tfidf-equation">Normalized weight = <Fraction top={fmt(row.raw[column])} bottom={fmt(row.length)} /> ≈ <b>{fmt(row.normalized[column])}</b></p></div>}
      </div>
      <p className="tfidf-note">In this collection “helpful” and “not” appear in two documents each; “waited” appears twice in one document. A larger IDF is not proof that a rare word is useful or a reliable sentiment signal. This is arithmetic on counts, not a trained neural model.</p>
    </section><nav className="nlp-links" aria-label="Related lesson"><b>Related lesson</b><a href="#chapter-97/97.4-from-messages-to-a-count-table">97.4 From messages to a count table</a></nav>
  </article>
}
