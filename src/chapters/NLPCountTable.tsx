import { useState } from 'react'
import { countDocuments, countMatrix, orderDocuments, type FeatureMode } from './nlpCountFeatures'
import './NLPIntroduction.css'
import './NLPCountTable.css'

export function NLPCountTable() {
  const [mode, setMode] = useState<FeatureMode>('unigram')
  const [selection, setSelection] = useState({ row: 2, term: 'waited' })
  const matrix = countMatrix(countDocuments, mode)
  const termIndex = matrix.vocabulary.indexOf(selection.term)
  const matches = matrix.occurrences[selection.row].filter(item => item.term === selection.term)
  const document = countDocuments[selection.row]
  const marked = matches.flatMap(match => match.tokens)
  const boundaries = [...new Set(marked.flatMap(token => [token.start, token.end]).concat([0, document.text.length]))].sort((a, b) => a - b)
  const changeMode = (next: FeatureMode) => {
    setMode(next)
    setSelection(next === 'unigram' ? { row: 2, term: 'waited' } : { row: 3, term: 'not helpful' })
  }
  const uni = countMatrix(orderDocuments, 'unigram')
  const bi = countMatrix(orderDocuments, 'bigram')
  return <article className="nlp-lesson count-lesson">
    <header className="nlp-header"><p className="nlp-eyebrow">97.4 · Natural Language Processing</p><h1>From messages to a count table</h1><p className="nlp-definition"><strong>A count table</strong> turns each document into a row of term counts.</p><p>Select a cell to trace its count back to the words in that message.</p></header>
    <section className="nlp-map" aria-labelledby="count-title"><div className="nlp-map-heading"><div><p className="nlp-eyebrow">TEXT → FEATURES → COUNTS</p><h2 id="count-title">Build a document–term matrix</h2></div><p>Choose a feature type, then select any count—including zero.</p></div>
      <div className="count-definitions"><p><b>Vocabulary</b> = the distinct terms that become columns. A <b>bag of words</b> counts words without keeping their full order.</p><p>A <b>unigram</b> is one word; a <b>bigram</b> is a pair of adjacent words. Both are types of <b>n-gram</b>. <b>Sparse</b> means many table entries are zero.</p></div>
      <div className="count-modes" role="group" aria-label="Choose feature type"><button type="button" aria-pressed={mode === 'unigram'} onClick={() => changeMode('unigram')}>Unigrams · one word</button><button type="button" aria-pressed={mode === 'bigram'} onClick={() => changeMode('bigram')}>Bigrams · two words</button></div>
      <p className="count-convention"><b>Counting rule:</b> lowercase ASCII words (internal apostrophes stay); exclude punctuation, keep all stop words including “not”, and do not stem or lemmatize. Bigrams join adjacent word tokens within a document, even across punctuation or sentence endings; they never cross documents. Columns are alphabetical.</p>
      <div className="count-docs"><p className="nlp-kicker">FOUR SOURCE DOCUMENTS</p>{countDocuments.map((item, index) => <div key={item.id} className={selection.row === index ? 'count-doc-active' : ''}><b>{item.id}</b><span>{index === selection.row ? boundaries.slice(0, -1).map((start, i) => { const end = boundaries[i + 1]; const text = item.text.slice(start, end); return marked.some(token => token.start <= start && token.end >= end) ? <mark key={start}>{text}</mark> : <span key={start}>{text}</span> }) : item.text}</span></div>)}</div>
      <p className="count-boundary">CS09 is a held-out test message. This is a descriptive table, not classifier fitting; its vocabulary is not the later training vocabulary.</p>
      <div className="count-matrix-heading"><h3>Document × term</h3><p><b>{countDocuments.length} × {matrix.vocabulary.length}</b> = {matrix.cells} cells · <b>{matrix.zeros} zeros</b> (sparse) · scroll sideways for all terms</p></div>
      <div className="count-scroll" tabIndex={0} role="region" aria-label="Scrollable document-term count table"><table><thead><tr><th scope="col">Document</th>{matrix.vocabulary.map(term => <th scope="col" key={term}>{term}</th>)}</tr></thead><tbody>{countDocuments.map((doc, row) => <tr key={doc.id}><th scope="row">{doc.id}</th>{matrix.vocabulary.map((term, column) => <td key={term}><button type="button" aria-pressed={selection.row === row && selection.term === term} aria-label={`${doc.id}, ${term}: ${matrix.counts[row][column]}`} onClick={() => setSelection({ row, term })}>{matrix.counts[row][column]}</button></td>)}</tr>)}</tbody></table></div>
      <div className="count-trace" aria-live="polite"><b>{document.id} × “{selection.term}” = {termIndex < 0 ? 0 : matrix.counts[selection.row][termIndex]}</b><span>{matches.length ? `${matches.length} contributing ${matches.length === 1 ? 'occurrence' : 'occurrences'} highlighted above.` : 'No contributing occurrences in this document.'}</span></div>
    </section>
    <section className="count-order"><p className="nlp-eyebrow">A SEPARATE AUTHORED EXAMPLE</p><h2>What word counts leave out</h2><p>Same words, different order. Unigram counts are identical; adjacent-word bigrams keep some local order.</p><div className="count-order-docs">{orderDocuments.map(item => <p key={item.id}><b>{item.id}</b> {item.text}</p>)}</div><div className="count-order-grid">{([['Unigrams', uni], ['Bigrams', bi]] as const).map(([title, data]) => <div key={title}><h3>{title}</h3><div className="count-scroll"><table><thead><tr><th scope="col">Doc</th>{data.vocabulary.map(term => <th scope="col" key={term}>{term}</th>)}</tr></thead><tbody>{orderDocuments.map((doc, row) => <tr key={doc.id}><th scope="row">{doc.id}</th>{data.counts[row].map((count, i) => <td key={i}>{count}</td>)}</tr>)}</tbody></table></div></div>)}</div></section>
    <nav className="nlp-links" aria-label="Related lesson"><b>Explore the course example</b><a href="#chapter-09/9.24-bag-of-words-analysis">9.24 Bag of Words Analysis →</a></nav>
  </article>
}
