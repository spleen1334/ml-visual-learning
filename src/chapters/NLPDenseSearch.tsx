import { useState } from 'react'
import { cosine } from './nlpLexicalSearch'
import { bankContexts, denseRanking, lexicalRanking, project2, semanticDocuments, semanticQuery, type Vector3 } from './nlpDenseSearchData'
import './NLPIntroduction.css'
import './NLPCountTable.css'
import './NLPTfidf.css'
import './NLPDenseSearch.css'

const fmt = (value: number) => value.toFixed(3)
const vectorText = (vector: readonly number[]) => `[${vector.join(', ')}]`
function Fraction({ top, bottom }: { top: string; bottom: string }) { return <span className="tfidf-fraction"><span>{top}</span><span>{bottom}</span></span> }

function Projection({ query, document }: { query: Vector3; document: Vector3 }) {
  const [qx, qy] = project2(query)
  const [dx, dy] = project2(document)
  const x = (value: number) => 40 + value * 150
  const y = (value: number) => 205 - value * 150
  return <svg className="dense-plot" viewBox="0 0 250 250" role="img" aria-label="First two vector coordinates only; equal scales, with lines from the origin to the selected vector endpoints.">
    <line x1="40" y1="205" x2="220" y2="205" stroke="#55796a" /><line x1="40" y1="205" x2="40" y2="25" stroke="#55796a" />
    <line x1="40" y1="55" x2="190" y2="55" stroke="#d9e6d9" /><line x1="190" y1="55" x2="190" y2="205" stroke="#d9e6d9" />
    <text x="31" y="223">0</text><text x="186" y="223">1</text><text x="20" y="59">1</text><text x="206" y="223">x₁</text><text x="16" y="27">x₂</text>
    <line x1="40" y1="205" x2={x(qx)} y2={y(qy)} stroke="#17675c" strokeWidth="3" /><line x1="40" y1="205" x2={x(dx)} y2={y(dy)} stroke="#c58a36" strokeWidth="3" />
    <circle cx={x(qx)} cy={y(qy)} r="5" fill="#17675c" /><circle cx={x(dx)} cy={y(dy)} r="5" fill="#c58a36" />
  </svg>
}

export function NLPDenseSearch() {
  const [scenario, setScenario] = useState<'search' | 'bank'>('search')
  const [selected, setSelected] = useState('D1')
  const [context, setContext] = useState(0)
  const dense = denseRanking(semanticQuery.vector, semanticDocuments)
  const doc = semanticDocuments.find(item => item.id === selected)!
  const bankA = bankContexts[context]
  const bankB = bankContexts[1 - context]
  const a = scenario === 'search' ? semanticQuery.vector : bankA.vector
  const b = scenario === 'search' ? doc.vector : bankB.vector
  const calculation = cosine(a, b)
  const products = a.map((value, i) => value * b[i])
  return <article className="nlp-lesson dense-lesson">
    <header className="nlp-header"><p className="nlp-eyebrow">97.8 · Natural Language Processing</p><h1>Search beyond exact words</h1><p className="nlp-definition"><strong>Dense embeddings</strong> represent text as a list of numbers; similarity can compare those representations.</p><p>Unlike exact-word matching, a suitable embedding may place related meanings in similar directions.</p></header>
    <section className="nlp-map" aria-labelledby="dense-title"><div className="nlp-map-heading"><div><p className="nlp-eyebrow">WORDS → VECTORS → SIMILARITY</p><h2 id="dense-title">Compare two representations</h2></div><p>Switch scenarios and select a pair to inspect.</p></div>
      <p className="dense-boundary">In real models, coordinates are learned. Here every 3D vector is <b>hand-chosen for teaching</b>: no embedding model, API or training runs. Coordinate directions are illustrative, not universal meanings. A dense vector has many nonzero coordinates; <b>semantic similarity</b> seeks related meaning, but does not guarantee a useful or correct match.</p>
      <div className="dense-tabs" role="group" aria-label="Choose scenario"><button type="button" aria-pressed={scenario === 'search'} onClick={() => setScenario('search')}>Purchase and buy</button><button type="button" aria-pressed={scenario === 'bank'} onClick={() => setScenario('bank')}>Two meanings of bank</button></div>
      {scenario === 'search' ? <><p>Query: <b>“{semanticQuery.text}”</b> · supplied vector <b>{vectorText(semanticQuery.vector)}</b>. This separate three-document collection is not the support FAQ index.</p><div className="dense-ranking"><div><h3>Lexical · computed TF–IDF</h3><p>Exact word matches only; IDF is fit on these three documents.</p><ol>{lexicalRanking.results.map(item => <li key={item.id}><b>{item.id}</b> · {item.text} <strong>{fmt(item.score)}</strong></li>)}</ol></div><div><h3>Dense · computed cosine</h3><p>Same cosine calculation on supplied 3D vectors.</p><ol>{dense.map(item => { const source = semanticDocuments.find(document => document.id === item.id)!; return <li key={item.id}><b>{item.id}</b> · {source.text} <strong>{fmt(item.score)}</strong></li> })}</ol></div></div><p className="dense-note">“purchase” matches D2 literally, but not the related word “buy” in D1. The hand-chosen vectors give D1 the higher dense score; this is not a benchmark or a guarantee that semantic search always wins. Exact score ties use document ID order.</p>
        <div className="count-scroll"><table><thead><tr><th scope="col">Select</th><th scope="col">Document text</th><th scope="col">Supplied vector [x₁, x₂, x₃]</th></tr></thead><tbody>{semanticDocuments.map(item => <tr key={item.id}><th scope="row"><button type="button" aria-pressed={selected === item.id} onClick={() => setSelected(item.id)}>{item.id}</button></th><td>{item.text}</td><td>{vectorText(item.vector)}</td></tr>)}</tbody></table></div></> : <><p><b>Polysemy</b> means one word can have different meanings. A contextual representation can differ with surrounding words; the two vectors below are supplied, not automatically inferred.</p><div className="dense-contexts" role="group" aria-label="Choose bank context">{bankContexts.map((item, i) => <button key={item.id} type="button" aria-pressed={context === i} onClick={() => setContext(i)}><b>{item.id === 'finance' ? 'Financial context' : 'River context'}</b><span>{item.text}</span><span>“bank” → {vectorText(item.vector)}</span></button>)}</div><p className="dense-note">The same spelling receives different supplied vectors in these two contexts. A real contextual model might distinguish senses, but a static lookup alone cannot decide the intended sense and model outputs can still be wrong.</p></>}
      <div className="dense-calculation"><div><p className="nlp-kicker">FULL 3D · SELECTED PAIR</p><h3>{scenario === 'search' ? `Query and ${doc.id}` : `${bankA.id} and ${bankB.id} contexts`}</h3><p>A = {vectorText(a)} · B = {vectorText(b)}</p><p>Dot product = {a.map((value, i) => `${value} × ${b[i]}`).join(' + ')} = <b>{fmt(calculation.dot)}</b></p><p>Lengths: |A| = √({a.map(value => `${value}²`).join(' + ')}) ≈ {fmt(calculation.lengthA)}; |B| = √({b.map(value => `${value}²`).join(' + ')}) ≈ {fmt(calculation.lengthB)}.</p><p className="tfidf-equation">cosine = <Fraction top="dot product" bottom="|A| × |B|" /> ≈ <Fraction top={fmt(calculation.dot)} bottom={`${fmt(calculation.lengthA)} × ${fmt(calculation.lengthB)}`} /> ≈ <b>{fmt(calculation.score)}</b></p><p className="dense-note">Products: {products.map(fmt).join(' + ')}. Full precision is used; displayed values are rounded. Zero-length vectors receive score 0 by convention.</p></div><div className="dense-projection"><Projection query={a} document={b} /><p><b>Teaching projection:</b> only x₁ and x₂, with equal axis scales. <span className="dense-key-query">● A</span> · <span className="dense-key-document">● B</span>. x₃ is omitted; full 3D cosine above is authoritative. Cosine compares direction, not plotted distance.</p></div></div>
    </section><nav className="nlp-links" aria-label="Related lessons"><b>Related lesson</b><a href="#chapter-97/97.7-search-by-words">97.7 Search by words</a><a href="#chapter-99/99.3-embeddings-and-position">99.3 Embeddings and position</a></nav>
  </article>
}
