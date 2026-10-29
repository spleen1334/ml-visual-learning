import { useState } from 'react'
import { input } from './nlpData'
import { featureTokens } from './nlpCountFeatures'
import { faqDocuments, faqSearchIndex, search } from './nlpLexicalSearch'
import './NLPIntroduction.css'
import './NLPCountTable.css'
import './NLPTfidf.css'
import './NLPSearch.css'

const presets = [{ label: 'CS11 message', value: input.text }, { label: 'Missing order', value: 'missing order' }, { label: 'Refund order', value: 'refund order' }, { label: 'Synonym: purchase', value: 'purchase' }, { label: 'Empty query', value: '' }]
const fmt = (n: number) => n.toFixed(4)
function Fraction({ top, bottom }: { top: string; bottom: string }) { return <span className="tfidf-fraction"><span>{top}</span><span>{bottom}</span></span> }
function Marked({ text, words }: { text: string; words: readonly string[] }) {
  const tokens = featureTokens(text).filter(token => words.includes(token.text))
  let position = 0
  const pieces = tokens.flatMap(token => { const prefix = text.slice(position, token.start); position = token.end; return [prefix, <mark key={token.start}>{text.slice(token.start, token.end)}</mark>] })
  return <>{pieces}{text.slice(position)}</>
}

export function NLPSearch() {
  const [query, setQuery] = useState<string>(input.text)
  const [chosen, setChosen] = useState('FAQ1')
  const result = search(faqSearchIndex, query)
  const selected = result.results.find(item => item.id === chosen)!
  const shared = selected.terms.filter(term => term.product > 0).map(term => term.word)
  const known = faqSearchIndex.index.vocabulary.filter((_, i) => result.query.counts[i] > 0)
  return <article className="nlp-lesson search-lesson">
    <header className="nlp-header"><p className="nlp-eyebrow">97.7 · Natural Language Processing</p><h1>Search by words</h1><p className="nlp-definition"><strong>Lexical search</strong> finds documents using matching words.</p><p>Turn a query into weights, compare it to the indexed FAQs, and trace the ranking.</p></header>
    <section className="nlp-map" aria-labelledby="search-title"><div className="nlp-map-heading"><div><p className="nlp-eyebrow">QUERY → WEIGHTS → SIMILARITY → RESULTS</p><h2 id="search-title">Search the support FAQs</h2></div><p>Select a result to see its calculation.</p></div>
      <p className="search-explain">A <b>query</b> is the text to search for. An <b>index</b> stores the documents and their word statistics. <b>Cosine similarity</b> compares the direction of two weighted word vectors: shared terms contribute to a dot product, adjusted by both vector lengths.</p>
      <div className="search-presets" role="group" aria-label="Choose a query">{presets.map(preset => <button key={preset.label} type="button" onClick={() => setQuery(preset.value)}>{preset.label}</button>)}</div><label className="search-query-label" htmlFor="faq-query">Query · edit locally</label><textarea id="faq-query" maxLength={250} value={query} onChange={event => setQuery(event.target.value)} rows={2} />
      <p className="search-rule">The index uses each FAQ’s <b>title + one space + body</b>. It fits vocabulary and IDF only on these three FAQs, never on the query or support-message corpus. Lowercase ASCII words with internal apostrophes; punctuation excluded, stop words retained. TF = count; IDF = ln((1 + 3)/(1 + df)) + 1. No embedding or LLM runs here.</p>
      <div className="search-query-vector"><p className="nlp-kicker">QUERY VECTOR · RAW TF–IDF</p><p><Marked text={query || '∅'} words={shared} /></p><p><b>Represented:</b> {known.length ? known.map(word => { const i = faqSearchIndex.index.vocabulary.indexOf(word); return `${word} ${fmt(result.query.raw[i])}` }).join(' · ') : 'none'}</p><p><b>Unknown words ignored:</b> {result.unknown.length ? result.unknown.join(', ') : 'none'}. Query length = √{fmt(result.query.sumSquares)} ≈ <b>{fmt(result.query.length)}</b>.</p></div>
      <p className="search-connector" aria-hidden="true">↓</p><div className="search-results-head"><h3>{result.query.hasKnownTerms ? 'Ranked FAQ documents' : 'FAQ documents · no ranking'}</h3><span>{result.query.hasKnownTerms ? 'Descending cosine; exact ties use FAQ ID order.' : 'No represented query terms: no relevance ranking is claimed.'}</span></div>
      <div className="search-results">{result.results.map((item, i) => { const doc = faqDocuments.find(faq => faq.id === item.id)!; return <button type="button" key={item.id} aria-pressed={chosen === item.id} onClick={() => setChosen(item.id)}><span className="search-rank">{result.query.hasKnownTerms ? `${i + 1} · ` : ''}{item.id}</span><strong><Marked text={doc.title} words={chosen === item.id ? shared : []} /></strong><span><Marked text={doc.text} words={chosen === item.id ? shared : []} /></span><b>Cosine {fmt(item.score)}</b></button> })}</div>
      <p className="search-rule">These are computed results; 97.1’s FAQ order was authored, so it need not match. A zero score does not prove irrelevance: “purchase” is not an exact match for “order.”</p>
      <div className="search-trace" aria-live="polite"><h3>{selected.id} · trace the score</h3><p>Gold highlights show the selected result’s shared words in both the query and FAQ. Each product below contributes to the dot product.</p><div className="count-scroll" role="region" tabIndex={0} aria-label="Scrollable matching word contributions"><table><thead><tr><th scope="col">Query term</th><th scope="col">Query count</th><th scope="col">FAQ count</th><th scope="col">FAQ IDF</th><th scope="col">Query raw TF–IDF</th><th scope="col">FAQ raw TF–IDF</th><th scope="col">Product</th></tr></thead><tbody>{selected.terms.map(term => <tr key={term.word}><th scope="row">{term.word}</th><td>{term.queryCount}</td><td>{term.documentCount}</td><td>{fmt(term.idf)}</td><td>{fmt(term.queryWeight)}</td><td>{fmt(term.documentWeight)}</td><td>{fmt(term.product)}</td></tr>)}</tbody></table></div>{!selected.terms.length && <p>No represented query terms; the dot product is zero.</p>}
        <p>Dot product = {selected.terms.filter(term => term.product > 0).map(term => fmt(term.product)).join(' + ') || '0'} ≈ <b>{fmt(selected.dot)}</b>. FAQ length = √{fmt(selected.vector.sumSquares)} ≈ <b>{fmt(selected.lengthB)}</b>.</p>
        {selected.lengthA && selected.lengthB ? <p className="tfidf-equation">cosine = <Fraction top="dot product" bottom="query length × FAQ length" /> ≈ <Fraction top={fmt(selected.dot)} bottom={`${fmt(selected.lengthA)} × ${fmt(selected.lengthB)}`} /> ≈ <b>{fmt(selected.score)}</b></p> : <p>Zero vector length: cosine is set to 0 by convention, with no division.</p>}
        <p className="search-rounding">Values are rounded to four decimals for display; full precision is used in calculation and ranking. A zero-length FAQ vector also receives score 0.</p></div>
    </section><nav className="nlp-links" aria-label="Related lessons"><b>Related lessons</b><a href="#chapter-97/97.5-which-words-distinguish-a-document">97.5 TF–IDF weights</a><a href="#chapter-99/99.12-context-memory-retrieval-tools">99.12 Context and retrieval</a></nav>
  </article>
}
