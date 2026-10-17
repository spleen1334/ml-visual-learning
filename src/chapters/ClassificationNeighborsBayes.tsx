import { Fragment, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import './ClassificationNeighborsBayes.css'

type Label = 'Purchase' | 'No purchase'
type Point = { id: string; x: number; y: number; label: Label }

const toyPoints: Point[] = [
  { id: 'A', x: -1.2, y: -0.8, label: 'No purchase' },
  { id: 'B', x: -0.7, y: 0.1, label: 'No purchase' },
  { id: 'C', x: -0.1, y: -0.4, label: 'Purchase' },
  { id: 'D', x: 0.3, y: 0.6, label: 'Purchase' },
  { id: 'E', x: 0.9, y: -0.2, label: 'No purchase' },
  { id: 'F', x: 1.2, y: 0.9, label: 'No purchase' },
  { id: 'G', x: -1.0, y: 1.1, label: 'No purchase' },
  { id: 'H', x: 0.7, y: 1.3, label: 'Purchase' },
]
const query = { x: 0.15, y: 0.15 }
const nearestToy = toyPoints.map(point => ({ ...point, distance: Math.hypot(point.x - query.x, point.y - query.y) })).sort((a, b) => a.distance - b.distance)
const toyTrace = toyPoints.find(point => point.id === 'D')!

const spotifyNeighbors = [
  { title: 'IDGAF', tempo: 24.82, key: 63.98, label: 'Listened' },
  { title: 'Vaina Loca', tempo: 22.58, key: 55.02, label: 'Skipped' },
  { title: 'Back To You', tempo: 28.54, key: 54.97, label: 'Listened' },
  { title: 'Eastside (with Halsey & Khalid)', tempo: 18.87, key: 54.95, label: 'Listened' },
  { title: 'The Middle', tempo: 32.26, key: 63.99, label: 'Listened' },
  { title: 'Lucid Dreams', tempo: 15.14, key: 55.01, label: 'Skipped' },
  { title: 'All The Stars (with SZA)', tempo: 24.82, key: 72.98, label: 'Listened' },
  { title: 'Perfect Duet (Ed Sheeran & Beyoncé)', tempo: 23.33, key: 72.94, label: 'Listened' },
  { title: 'Perfect', tempo: 23.33, key: 72.99, label: 'Favorited' },
  { title: 'Nice For What', tempo: 21.84, key: 73.02, label: 'Listened' },
  { title: 'Let Me Go (Alesso, Florida Georgia Line & watt)', tempo: 29.28, key: 72.93, label: 'Listened' },
  { title: 'River (feat. Ed Sheeran)', tempo: 19.61, key: 73.01, label: 'Listened' },
  { title: 'Happier', tempo: 27.05, key: 46.04, label: 'Skipped' },
  { title: 'Flames', tempo: 22.59, key: 45.97, label: 'Skipped' },
  { title: 'Too Good At Goodbyes', tempo: 21.1, key: 46.03, label: 'Skipped' },
  { title: 'Finesse - Remix; feat. Cardi B', tempo: 30.77, key: 46.02, label: 'Skipped' },
  { title: "God's Plan", tempo: 9.93, key: 63.95, label: 'Listened' },
  { title: 'What Lovers Do', tempo: 34.5, key: 46.03, label: 'Listened' },
  { title: 'Youngblood', tempo: 41.94, key: 63.98, label: 'Listened' },
  { title: 'Congratulations', tempo: 44.17, key: 55, label: 'Listened' },
] as const
const spotifyQuery = { tempo: 25, key: 60 }
const rankedSpotifyNeighbors = spotifyNeighbors.map(point => ({
  ...point,
  distance: Math.hypot(point.tempo - spotifyQuery.tempo, point.key - spotifyQuery.key),
})).sort((a, b) => a.distance - b.distance)

type Customer = { id: number; newsletter: 0 | 1; facebook: 0 | 1; website: 0 | 1; purchase: 0 | 1 }
const customers: Customer[] = [
  { id: 1, newsletter: 0, facebook: 1, website: 0, purchase: 1 }, { id: 2, newsletter: 0, facebook: 0, website: 1, purchase: 0 },
  { id: 3, newsletter: 0, facebook: 0, website: 0, purchase: 0 }, { id: 4, newsletter: 0, facebook: 0, website: 0, purchase: 0 },
  { id: 5, newsletter: 1, facebook: 1, website: 1, purchase: 1 }, { id: 6, newsletter: 0, facebook: 0, website: 1, purchase: 0 },
  { id: 7, newsletter: 0, facebook: 0, website: 1, purchase: 0 }, { id: 8, newsletter: 1, facebook: 0, website: 1, purchase: 1 },
  { id: 9, newsletter: 0, facebook: 1, website: 1, purchase: 0 }, { id: 10, newsletter: 0, facebook: 1, website: 0, purchase: 0 },
  { id: 11, newsletter: 0, facebook: 1, website: 0, purchase: 0 }, { id: 12, newsletter: 0, facebook: 0, website: 1, purchase: 0 },
  { id: 13, newsletter: 1, facebook: 1, website: 1, purchase: 1 }, { id: 14, newsletter: 1, facebook: 0, website: 0, purchase: 0 },
  { id: 15, newsletter: 0, facebook: 1, website: 0, purchase: 0 }, { id: 16, newsletter: 0, facebook: 1, website: 1, purchase: 1 },
  { id: 17, newsletter: 0, facebook: 1, website: 0, purchase: 0 }, { id: 18, newsletter: 0, facebook: 0, website: 1, purchase: 0 },
  { id: 19, newsletter: 1, facebook: 0, website: 1, purchase: 1 }, { id: 20, newsletter: 1, facebook: 1, website: 0, purchase: 0 },
]
const bayesFeatures = [
  { id: 'newsletter', label: 'Subscribed to newsletter' },
  { id: 'facebook', label: 'Followed Facebook page' },
  { id: 'website', label: 'Visited website' },
] as const
type BayesFeature = typeof bayesFeatures[number]['id']
type BayesCase = Record<BayesFeature, 0 | 1>

function Header({ lesson, title, lead }: { lesson: number; title: string; lead: string }) {
  return <header className="cnb__header"><p className="cnb__eyebrow">Chapter 09 · Classification Models · 9.{lesson}</p><h1 id={`cnb-lesson-${lesson}-title`}>{title}</h1><p>{lead}</p></header>
}
function Definition({ title, text, mark }: { title: string; text: string; mark: string }) {
  return <section className="cnb__definition"><div><p className="cnb__eyebrow">The central idea</p><h2>{title}</h2><p>{text}</p></div><div className="cnb__mark" aria-hidden="true">{mark}</div></section>
}
function Why({ title, children }: { title: string; children: ReactNode }) {
  return <section className="cnb__why"><p className="cnb__eyebrow">Why it is useful</p><h2>{title}</h2><p>{children}</p></section>
}
function Summary({ children }: { children: ReactNode }) {
  return <aside className="cnb__summary"><p className="cnb__eyebrow">Remember</p><p>{children}</p></aside>
}
function Plot({ k, selected = true }: { k: number; selected?: boolean }) {
  const width = 500; const height = 360; const left = 92; const top = 30; const scale = 100
  const px = (x: number) => left + (x + 1.5) * scale
  const py = (y: number) => top + (1.6 - y) * scale
  const right = px(1.5); const bottom = py(-1)
  const xTicks = [-1, 0, 1]
  const yTicks = [-1, 0, 1]
  return <svg className="cnb__plot" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`Plot of eight labeled customers and one new customer; the ${k} nearest neighbors are highlighted`}>
    {xTicks.map(tick => <g key={`x-${tick}`} className="cnb__axis-tick"><line x1={px(tick)} y1={top} x2={px(tick)} y2={bottom} /><text x={px(tick)} y={bottom + 18} textAnchor="middle">{tick}</text></g>)}
    {yTicks.map(tick => <g key={`y-${tick}`} className="cnb__axis-tick"><line x1={left} y1={py(tick)} x2={right} y2={py(tick)} /><text x={left - 12} y={py(tick) + 4} textAnchor="end">{tick}</text></g>)}
    <line className="cnb__axis" x1={left} y1={bottom} x2={right} y2={bottom} /><line className="cnb__axis" x1={left} y1={top} x2={left} y2={bottom} />
    <text x={(left + right) / 2} y={height - 8} textAnchor="middle">Age · standardized score (SD)</text><text transform={`translate(16 ${(top + bottom) / 2}) rotate(-90)`} textAnchor="middle">Household income · standardized score (SD)</text>
    <g className="cnb__distance-trace" aria-hidden="true"><line x1={px(toyTrace.x)} y1={py(toyTrace.y)} x2={px(query.x)} y2={py(toyTrace.y)} /><line x1={px(query.x)} y1={py(toyTrace.y)} x2={px(query.x)} y2={py(query.y)} /><path d={`M ${(px(toyTrace.x) + px(query.x)) / 2} ${py(toyTrace.y)} H 395 V 88 H 403`} /><path d={`M ${px(query.x)} ${(py(toyTrace.y) + py(query.y)) / 2} H 386 V 248 H 403`} /><text x="408" y="92">Δ age .15</text><text x="408" y="252">Δ income .45</text></g>
    {toyPoints.map(point => { const rank = nearestToy.findIndex(item => item.id === point.id); const near = rank >= 0 && rank < k; return <g key={point.id} className={`cnb__dot cnb__dot--${point.label === 'Purchase' ? 'yes' : 'no'} ${selected && near ? 'is-near' : ''}`}><circle cx={px(point.x)} cy={py(point.y)} r={near ? 8 : 6} /><text x={px(point.x) + 9} y={py(point.y) - 8}>{point.id}</text><title>{point.id}: {point.label}; distance {nearestToy[rank]?.distance.toFixed(2)} SD</title></g> })}
    <circle className="cnb__query" cx={px(query.x)} cy={py(query.y)} r="10" /><text className="cnb__query-label" x={px(query.x) - 14} y={py(query.y) + 25} textAnchor="end">New customer (0.15, 0.15)</text>
  </svg>
}

export function CLCommonClassificationModels() {
  const methods = [
    { name: 'K-nearest neighbors', idea: 'Vote among similar, labeled examples.', question: 'Who behaves like this customer?' },
    { name: 'Naive Bayes', idea: 'Combine class frequencies and feature likelihoods.', question: 'How probable is each class given these clues?' },
    { name: 'Decision tree', idea: 'Follow a sequence of feature-based splits.', question: 'Which path through simple rules fits?' },
    { name: 'Random forest', idea: 'Combine predictions from many decision trees.', question: 'What do many varied trees decide together?' },
    { name: 'Logistic regression', idea: 'Estimate class probability from a weighted feature combination.', question: 'How does each input shift the odds?' },
    { name: 'Sentiment classification', idea: 'Apply classification to text features to predict a tone or emotion label.', question: 'Is this response positive, neutral, or negative?' },
  ]
  return <article className="cnb" aria-labelledby="cnb-lesson-1-title"><Header lesson={1} title="A map of common classification models" lead="A classification method predicts a category: a subscriber may stay or churn, a track may be skipped or played, and a message may be spam or legitimate." />
    <Definition title="Classification predicts the class value of a categorical target." text="The model learns from labeled examples and assigns a class to a new case. Different techniques represent and combine the evidence in different ways." mark="Features → class" />
    <Why title="Choose a model to answer a real decision question.">A support team might flag possible churn; a music service might predict whether a listener will skip a track; a trust team might review a potentially fraudulent transaction. The target class and available data shape which model is worth trying.</Why>
    <section className="cnb__panel"><div className="cnb__section-heading"><p className="cnb__eyebrow">Five model families and one classification application</p><h2>Different model families find class patterns in different ways.</h2></div><div className="cnb__method-grid">{methods.map((method, index) => <article className="cnb__method" key={method.name}><span className="cnb__method-num">0{index + 1}</span><h3>{method.name}</h3><p>{method.idea}</p><small>{method.question}</small></article>)}</div><p className="cnb__note"><strong>Keep the goal in view:</strong> the five named model families predict categories. Sentiment analysis is a classification application that can use another model, such as logistic regression.</p></section>
    <Summary>Classification predicts a categorical label. KNN, naive Bayes, trees, forests, logistic regression, and text sentiment each offer a different route from evidence to class.</Summary></article>
}

export function CLIntroKNN() {
  const [k, setK] = useState(3)
  const neighbors = nearestToy.slice(0, k)
  const yes = neighbors.filter(point => point.label === 'Purchase').length
  const no = neighbors.length - yes
  return <article className="cnb" aria-labelledby="cnb-lesson-2-title"><Header lesson={2} title="Predict a class from nearby examples" lead="If two customers have similar browsing behavior, their purchase outcomes may be alike. K-nearest neighbors (KNN) turns that intuition into a vote based on feature distance." />
    <Definition title="KNN predicts a new case from the classes of its K closest labeled observations." text="K is the number of neighbors included in the vote. Similarity is measured from the feature values, so scaling and feature choice affect what ‘close’ means." mark="Near → vote" />
    <Why title="Nearby cases can make an unfamiliar case easier to interpret.">A recommendation system can look at users with similar listening patterns; a retailer can compare a new visitor with past visitors whose purchase outcomes are known. KNN makes the comparison explicit.</Why>
    <section className="cnb__panel"><div className="cnb__section-heading"><p className="cnb__eyebrow">A small labeled example</p><h2>Find similar customers in two standardized features.</h2><p>Each dot is a past customer. Its color shows the recorded class. Both axes are standardized scores: 0 is the training average and 1 is one standard deviation above it.</p></div>
      <div className="cnb__knn-layout"><div className="cnb__chart-frame"><Plot k={k} /><div className="cnb__legend"><span><i className="is-yes" /> Purchase</span><span><i className="is-no" /> No purchase</span><span><i className="is-query" /> New customer</span></div></div><div className="cnb__side-card"><label className="cnb__control">Neighbors to include · K <input type="range" min="1" max="7" step="1" value={k} onChange={event => setK(Number(event.target.value))} /><strong>{k}</strong></label><p className="cnb__live-result" aria-live="polite"><strong>{yes > no ? 'Purchase' : no > yes ? 'No purchase' : 'Tie'}</strong><span>{yes} purchase · {no} no-purchase votes among {k} neighbors</span></p><ol className="cnb__distance-list">{neighbors.map(point => <li key={point.id}><span>Customer {point.id}</span><b>{point.distance.toFixed(2)} SD</b><em className={point.label === 'Purchase' ? 'is-yes' : 'is-no'}>{point.label}</em></li>)}</ol></div></div>
      <p className="cnb__note"><strong>Illustrative points:</strong> these eight plotted customers have example age and income scores so we can see KNN’s geometry; they are not the Spotify records in the later case study.</p>
      <p className="cnb__calculation"><strong>Trace the dashed legs to Customer D (0.30, 0.60):</strong> Δ age = 0.30 − 0.15 = 0.15 and Δ income = 0.60 − 0.15 = 0.45. The straight-line distance is √(0.15² + 0.45²) = {nearestToy.find(point => point.id === 'D')!.distance.toFixed(2)} SD, matching the equal-scale plot. Distances put examples in order; K selects how many enter the vote.</p>
      <p className="cnb__note"><strong>Scaling matters:</strong> if income is measured in dollars and age in years, raw Euclidean distance may be dominated by income’s larger numbers. Scale numerical features using training data before comparing distances.</p>
    </section><Summary>KNN compares a new case with labeled examples and predicts the most common class among the K nearest. Its vote depends on K, the chosen features, and their scales.</Summary></article>
}

export function CLKNNExamples() {
  const [k, setK] = useState(3)
  const neighbors = nearestToy.slice(0, k)
  const counts = { Purchase: neighbors.filter(item => item.label === 'Purchase').length, 'No purchase': neighbors.filter(item => item.label === 'No purchase').length }
  const ranked = [...neighbors].sort((a, b) => a.distance - b.distance)
  const tiedAtBoundary = k === 4
  return <article className="cnb" aria-labelledby="cnb-lesson-3-title"><Header lesson={3} title="Read the neighbor vote and its edge cases" lead="KNN gives a transparent classification example: identify the nearby labeled cases, count their classes, then check whether the result is stable." />
    <Definition title="The predicted class is usually the most frequent label among the selected neighbors." text="A class share such as 2 of 3 describes this particular neighborhood. It is a vote fraction, not automatically a calibrated probability that the prediction is correct." mark="Count → class" />
    <Why title="A close vote should change how cautiously you use a prediction.">If a clinic triage queue or fraud review depends on the result, a 3-to-2 neighborhood split is less decisive than a 9-to-1 split. The share helps describe the local evidence; evaluation on held-out data tells us how reliable the model is overall.</Why>
    <section className="cnb__panel"><div className="cnb__section-heading"><p className="cnb__eyebrow">Compare neighborhood sizes</p><h2>The same new customer can receive a different vote when K changes.</h2><p>These eight labeled examples use the same standardized feature coordinates. The controls redraw the neighborhood and recalculate the class counts.</p></div>
      <div className="cnb__controls-row"><label className="cnb__control">Choose K <input type="range" min="1" max="7" value={k} onChange={event => setK(Number(event.target.value))} /><strong>{k}</strong></label><span>Odd K often avoids a two-class tie, but it does not guarantee a good model.</span></div>
      <div className="cnb__knn-layout"><div className="cnb__chart-frame"><Plot k={k} /><div className="cnb__legend"><span><i className="is-yes" /> Purchase</span><span><i className="is-no" /> No purchase</span><span><i className="is-query" /> New customer</span></div></div><div className="cnb__side-card"><p className="cnb__eyebrow">Current neighborhood</p><h3>{counts.Purchase === counts['No purchase'] ? 'The vote is tied' : counts.Purchase > counts['No purchase'] ? 'Predict: Purchase' : 'Predict: No purchase'}</h3><div className="cnb__vote-bars"><div><span>Purchase</span><b style={{ width: `${(counts.Purchase / k * 100).toFixed(1)}%` }} /><strong>{counts.Purchase}</strong></div><div><span>No purchase</span><b style={{ width: `${(counts['No purchase'] / k * 100).toFixed(1)}%` }} /><strong>{counts['No purchase']}</strong></div></div><p className="cnb__fraction">Winning vote share: {Math.max(counts.Purchase, counts['No purchase'])}/{k} = {(Math.max(counts.Purchase, counts['No purchase']) / k * 100).toFixed(1)}%</p><small>Use this as a neighborhood summary, not as a promise of real-world accuracy.</small></div></div>
      <div className="cnb__table-wrap"><table className="cnb__table"><caption>Nearest records, sorted by Euclidean distance</caption><thead><tr><th scope="col">Rank</th><th scope="col">Record</th><th scope="col">Distance · SD</th><th scope="col">Observed class</th></tr></thead><tbody>{ranked.map((point, index) => <tr key={point.id}><th scope="row">{index + 1}</th><td>Customer {point.id}</td><td>{point.distance.toFixed(2)}</td><td>{point.label}</td></tr>)}</tbody></table></div>
      {tiedAtBoundary && <p className="cnb__note"><strong>Tie example:</strong> with K = 4, the vote is 2–2. A production workflow must define its tie rule in advance, such as using an odd K for two classes or checking distance-weighted votes. Do not quietly pick a class after seeing the desired answer.</p>}
      <p className="cnb__note"><strong>Choosing K:</strong> compare candidate values on validation data, then estimate final performance once on a held-out test set. A very small K can follow noise; a very large K can blur local patterns.</p>
    </section><Summary>K controls how local the vote is. Inspect class counts and ties, and select K using validation rather than the test set.</Summary></article>
}

export function CLCaseKNN() {
  const [k, setK] = useState(20)
  const neighbors = rankedSpotifyNeighbors.slice(0, k)
  const listened = neighbors.filter(item => item.label === 'Listened').length
  const skipped = neighbors.filter(item => item.label === 'Skipped').length
  const favorited = neighbors.filter(item => item.label === 'Favorited').length
  const votes = { Listened: listened, Skipped: skipped, Favorited: favorited }
  const voteMaximum = Math.max(...Object.values(votes))
  const winners = Object.entries(votes).filter(([, count]) => count === voteMaximum).map(([label]) => label)
  return <article className="cnb" aria-labelledby="cnb-lesson-4-title"><Header lesson={4} title="Case study: recommend what a listener may play" lead="Assignment: use past listening behavior to classify an unobserved track as Listened, Skipped, or Favorited from its song attributes." />
    <Definition title="A KNN classifier assigns the class most common among the closest known records." text="For this Spotify teaching workbook, each row is a track with audio features and an observed listener outcome. We compare a new track against tracks whose outcomes are already recorded." mark="Track → outcome" />
    <Why title="A recommendation needs both a useful comparison and a trustworthy evaluation.">The workbook contains 100 popular tracks with outcomes recorded as Listened, Skipped, or Favorited. It simplifies the model to two scaled attributes so we can see the geometry; it is a teaching demonstration, not a fitted production recommender.</Why>
    <section className="cnb__panel"><div className="cnb__section-heading"><p className="cnb__eyebrow">Two-feature view of the course case</p><h2>Tempo = 25 and Key = 60 on scaled 1–100 values.</h2><p>The 100-track case includes eight audio features. This zoomed view plots the supplied two-feature values and ranks them by Euclidean distance from this test point. Equal plot scales preserve that distance visually. “Key” describes a track’s musical pitch class, which is categorical; treating its encoded number as a continuous distance is only a teaching simplification. Scaling changes units, but does not prove that key differences are meaningful.</p></div>
      <div className="cnb__case-banner"><div><span>New track · Tempo</span><strong>25 / 100</strong></div><b aria-hidden="true">+</b><div><span>New track · Key</span><strong>60 / 100</strong></div><b aria-hidden="true">→</b><div><span>Most common nearby outcome</span><strong aria-live="polite">{winners.length === 1 ? winners[0] : 'Tie'}</strong></div></div>
      <label className="cnb__control">Number of nearest tracks, K <input type="range" min="1" max="20" value={k} onChange={event => setK(Number(event.target.value))} /><strong>{k}</strong></label>
      <div className="cnb__case-votes" aria-live="polite"><span><i className="is-listened" /> Listened <b>{listened}</b></span><span><i className="is-skipped" /> Skipped <b>{skipped}</b></span><span><i className="is-favorited" /> Favorited <b>{favorited}</b></span><strong>Winning vote share: {voteMaximum}/{k} = {(voteMaximum / k * 100).toFixed(1)}%</strong></div>
      <div className="cnb__neighbor-chart"><svg viewBox="0 0 500 330" role="img" aria-label={`Zoomed view of the ${k} nearest tracks by scaled Tempo and Key, with numeric ticks and equal distance per unit`}>{[122, 182, 242, 302].map(x => <line key={`vx-${x}`} className="cnb__gridline" x1={x} y1="54" x2={x} y2="270" />)}{[54, 114, 174, 234].map(y => <line key={`hy-${y}`} className="cnb__gridline" x1="110" y1={y} x2="350" y2={y} />)}<line x1="110" y1="270" x2="350" y2="270" /><line x1="110" y1="54" x2="110" y2="270" />{[10, 20, 30, 40].map(value => <text key={`tempo-${value}`} x={110 + (value - 8) * 6} y="292" textAnchor="middle">{value}</text>)}{[40, 50, 60, 70].map(value => <text key={`key-${value}`} x="98" y={270 - (value - 40) * 6 + 4} textAnchor="end">{value}</text>)}<text x="230" y="320" textAnchor="middle">Tempo · scaled 1–100</text><text transform="translate(35 162) rotate(-90)" textAnchor="middle">Key · scaled 1–100</text>{rankedSpotifyNeighbors.map((point, index) => <circle key={`${point.title}-${index}`} cx={110 + (point.tempo - 8) * 6} cy={270 - (point.key - 40) * 6} r={index < k ? 7 : 4} className={`cnb__spotify-dot cnb__spotify-dot--${point.label.toLowerCase()} ${index < k ? 'is-active' : ''}`}><title>Rank {index + 1}: {point.title}, {point.label}; scaled Tempo {point.tempo}, scaled Key {point.key}; Euclidean distance {point.distance.toFixed(2)}</title></circle>)}<path className="cnb__test-marker" d="M0 -10 L10 0 L0 10 L-10 0 Z" transform="translate(212 150)" /><text className="cnb__spotify-test-label" x="224" y="145">New track (25, 60)</text></svg><p className="cnb__test-label">Zoomed axes span Tempo 8–48 and Key 40–76; all 20 tracks fit and both use 6 SVG units per feature unit.</p></div>
      <p className="cnb__calculation"><strong>Distance example · “IDGAF”:</strong> √((24.82 − 25)² + (63.98 − 60)²) = √((−0.18)² + 3.98²) ≈ {rankedSpotifyNeighbors.find(point => point.title === 'IDGAF')!.distance.toFixed(2)} scaled-score units. The point’s offset on each equally scaled axis matches the two differences in the calculation.</p>
      <div className="cnb__table-wrap"><table className="cnb__table"><caption>Tracks ranked by Euclidean distance using only scaled Tempo and Key; change K to inspect a shorter vote</caption><thead><tr><th scope="col">Rank</th><th scope="col">Track</th><th scope="col">Tempo · scaled</th><th scope="col">Key · scaled</th><th scope="col">Distance</th><th scope="col">Recorded outcome</th></tr></thead><tbody>{neighbors.map((point, index) => <tr key={point.title}><th scope="row">{index + 1}</th><td>{point.title}</td><td>{point.tempo.toFixed(2)}</td><td>{point.key.toFixed(2)}</td><td>{point.distance.toFixed(2)}</td><td>{point.label}</td></tr>)}</tbody></table></div>
      <p className="cnb__note"><strong>What the percentage means:</strong> at K = 20, {listened} neighbors listened, {skipped} skipped, and {favorited} favorited. The winning share summarizes this neighborhood; it is not a calibrated probability that the listener will play the new track. The two-feature view leaves out six other audio attributes from the larger table.</p>
    </section><Summary>For the course’s Tempo 25 / Key 60 example, 13 of the 20 nearest tracks were listened to. Scaling keeps the two plotted features comparable; a real recommendation model needs broader evaluation and context.</Summary></article>
}

export function CLIntroNaiveBayes() {
  return <article className="cnb" aria-labelledby="cnb-lesson-5-title"><Header lesson={5} title="Use observed frequencies to compare class likelihoods" lead="Naive Bayes classifies a case by combining how common each class is with how often its observed features occur within that class." />
    <Definition title="Naive Bayes applies Bayes’ rule with a simplifying assumption that features are conditionally independent given the class." text="For a class C and features x₁…xₙ, compare P(C) × P(x₁|C) × … × P(xₙ|C), then normalize the class scores to sum to 1." mark="Prior × evidence" />
    <Why title="It can turn several simple clues into a useful class comparison.">For an email marked as spam or legitimate, the model can compare word patterns learned from labeled messages. In the customer example that follows, the clues are newsletter signup, following a page, and visiting a site; the target is whether a purchase occurred.</Why>
    <section className="cnb__panel"><div className="cnb__section-heading"><p className="cnb__eyebrow">The calculation in one view</p><h2>Start with the class prior, multiply feature likelihoods, then normalize.</h2></div><div className="cnb__bayes-flow"><div><span>1 · Prior</span><strong>P(Purchase)</strong><small>How common is the class overall?</small></div><b>×</b><div><span>2 · Likelihoods</span><strong>P(clue | class)</strong><small>How often does each clue appear within the class?</small></div><b>→</b><div><span>3 · Compare</span><strong>Normalize</strong><small>Turn class scores into values that sum to 1.</small></div></div><div className="cnb__term-strip"><article><strong>Prior</strong><span>Purchase = 1 appears in 6 of 20 records: 6/20.</span></article><article><strong>Likelihood</strong><span>Newsletter = 1 appears in 4 of 6 purchasers: 4/6.</span></article><article><strong>Normalized class score</strong><span>For this one clue: Purchase score 0.20 ÷ (0.20 + 0.10) = 66.7%.</span></article></div><p className="cnb__note"><strong>Why “naive”?</strong> Newsletter signup, following a social page, and visiting a website may be related behaviors. Treating them as conditionally independent is a simplifying assumption, not a claim about how customers actually behave.</p><p className="cnb__note"><strong>Small-data caution:</strong> zero counts can force a raw class score to zero. Smoothing is often used in practical implementations; this 20-row illustration shows unsmoothed workbook calculations and should not be read as a reliable business estimate.</p></section>
    <Summary>Naive Bayes compares classes using their prior frequencies and the likelihood of each feature value within each class, under a conditional independence assumption.</Summary></article>
}

function frequency(feature: BayesFeature, value: 0 | 1, purchase: 0 | 1) {
  return customers.filter(row => row[feature] === value && row.purchase === purchase).length
}
function conditional(feature: BayesFeature, value: 0 | 1, purchase: 0 | 1) {
  const total = customers.filter(row => row.purchase === purchase).length
  return { numerator: frequency(feature, value, purchase), denominator: total, probability: frequency(feature, value, purchase) / total }
}

export function CLNaiveBayesFrequencyTables() {
  return <article className="cnb" aria-labelledby="cnb-lesson-6-title"><Header lesson={6} title="Count feature values inside each class" lead="Before turning frequencies into probabilities, count how often each observed feature value appears among customers who purchased and those who did not." />
    <Definition title="A frequency table counts records for combinations of feature value and class." text="For each input, count 0 and 1 separately among Purchase = 1 and Purchase = 0. These counts supply the denominators for conditional probabilities." mark="Count by class" />
    <Why title="Counts make the model’s evidence visible before any multiplication.">If people who visited the site appear more often among purchasers, that pattern contributes to a purchase score. A frequency table also shows how much data supports a pattern: four customers is a small count, even if the proportion looks large.</Why>
    <section className="cnb__panel"><div className="cnb__section-heading"><p className="cnb__eyebrow">Cat Slacks workbook · 20 customer records</p><h2>Each row is one customer; the target is a recorded purchase.</h2><p>The feature columns are binary flags. The workbook has 6 purchasers and 14 non-purchasers. This tiny sample is for tracing the arithmetic, not fitting a meaningful business model.</p></div>
      <div className="cnb__counts"><div><span>Purchase = 1</span><strong>6</strong><small>customers · prior = 6/20 = 30%</small></div><div><span>Purchase = 0</span><strong>14</strong><small>customers · prior = 14/20 = 70%</small></div><div><span>All observations</span><strong>20</strong><small>records in the workbook example</small></div></div>
      <div className="cnb__bayes-evidence-layout"><div className="cnb__evidence-block"><div><p className="cnb__eyebrow">The numerator and denominator come from these records</p><h3>Among the six purchasers, four had newsletter = 1.</h3><p>Each row below is one of the six Purchase = 1 records. The six rows form the denominator; the four highlighted newsletter values form the numerator.</p></div><div className="cnb__table-wrap"><table className="cnb__table cnb__evidence-table"><caption>Purchase records used for P(Newsletter = 1 | Purchase = 1)</caption><thead><tr><th scope="col">Customer</th><th scope="col">Newsletter</th><th scope="col">Purchase</th></tr></thead><tbody>{customers.filter(row => row.purchase === 1).map(row => <tr key={row.id} className={row.newsletter === 1 ? 'is-numerator' : ''}><th scope="row">{row.id}</th><td><span className={row.newsletter === 1 ? 'cnb__evidence-value is-included' : 'cnb__evidence-value'}>{row.newsletter}</span></td><td><span className="cnb__evidence-value is-denominator">1</span></td></tr>)}</tbody></table></div></div>
      <div className="cnb__table-wrap"><table className="cnb__table cnb__frequency-table"><caption>Customer feature-value counts grouped by target class</caption><thead><tr><th scope="col">Feature value</th><th scope="col">Purchased · Y=1</th><th scope="col">No purchase · Y=0</th></tr></thead><tbody>{bayesFeatures.map(feature => <Fragment key={feature.id}><tr><th scope="row">{feature.label} = 1</th><td>{frequency(feature.id, 1, 1)}</td><td>{frequency(feature.id, 1, 0)}</td></tr><tr><th scope="row">{feature.label} = 0</th><td>{frequency(feature.id, 0, 1)}</td><td>{frequency(feature.id, 0, 0)}</td></tr></Fragment>)}</tbody></table></div></div>
      <p className="cnb__calculation"><strong>Read across the rows:</strong> {customers.filter(row => row.newsletter === 1 && row.purchase === 1).length} of the 6 purchaser rows have Newsletter = 1, so P(Newsletter = 1 | Purchase = 1) = 4/6. These same records are summarized in the frequency table.</p>
    </section><Summary>Frequency tables count the observed feature values within each target class. In this workbook, 6 of 20 customers purchased; the small counts keep every calculation inspectable.</Summary></article>
}

export function CLNaiveBayesConditionalProbability() {
  const [feature, setFeature] = useState<BayesFeature>('newsletter')
  const item = bayesFeatures.find(value => value.id === feature)!
  const yes = [0, 1].map(value => conditional(feature, value as 0 | 1, 1))
  const no = [0, 1].map(value => conditional(feature, value as 0 | 1, 0))
  return <article className="cnb" aria-labelledby="cnb-lesson-7-title"><Header lesson={7} title="Turn class counts into conditional probabilities" lead="A conditional probability answers: among cases in a known class, how often did we observe this feature value? The class after the vertical bar supplies the denominator." />
    <Definition title="P(X = x | Y = y) is the share of class y records where feature X equals x." text="Read the vertical bar as ‘given’. For example, P(Newsletter = 1 | Purchase = 1) is the number of newsletter subscribers who purchased divided by all purchasers." mark="Given → divide" />
    <Why title="Use the class as the denominator so you compare like with like.">When asking whether newsletter signup is common among purchasers, divide by the number of purchasers. Dividing by all customers would answer a different question: how common that combination is in the entire sample.</Why>
    <section className="cnb__panel"><div className="cnb__section-heading"><p className="cnb__eyebrow">Choose a feature from the workbook</p><h2>Follow the denominator in both class columns.</h2></div><div className="cnb__select-row"><label htmlFor="cnb-feature">Feature</label><select id="cnb-feature" value={feature} onChange={event => setFeature(event.target.value as BayesFeature)}>{bayesFeatures.map(value => <option key={value.id} value={value.id}>{value.label}</option>)}</select></div>
      <p className="cnb__formula" aria-live="polite"><strong>Example:</strong> P({item.label} = 1 | Purchase = 1) = {yes[1].numerator}/{yes[1].denominator} = {(yes[1].probability * 100).toFixed(1)}%.</p>
      <div className="cnb__probability-grid"><article><h3>Given Purchase = 1</h3><p>Denominator: {yes[0].denominator} purchasers</p><div className="cnb__prob-row"><span>{item.label} = 1</span><b>{yes[1].numerator}/{yes[1].denominator}</b><strong>{(yes[1].probability * 100).toFixed(1)}%</strong></div><div className="cnb__prob-row"><span>{item.label} = 0</span><b>{yes[0].numerator}/{yes[0].denominator}</b><strong>{(yes[0].probability * 100).toFixed(1)}%</strong></div><small>These two probabilities add to 100%.</small></article><article><h3>Given Purchase = 0</h3><p>Denominator: {no[0].denominator} non-purchasers</p><div className="cnb__prob-row"><span>{item.label} = 1</span><b>{no[1].numerator}/{no[1].denominator}</b><strong>{(no[1].probability * 100).toFixed(1)}%</strong></div><div className="cnb__prob-row"><span>{item.label} = 0</span><b>{no[0].numerator}/{no[0].denominator}</b><strong>{(no[0].probability * 100).toFixed(1)}%</strong></div><small>These two probabilities add to 100%.</small></article></div>
      <p className="cnb__calculation"><strong>Check the denominator:</strong> {yes[1].numerator} of {yes[1].denominator} purchasers had {item.label.toLowerCase()} = 1. Among non-purchasers, {no[1].numerator} of {no[1].denominator} had that same feature value.</p>
    </section><Summary>Conditional probability divides a feature-and-class count by the total records in that class. The denominator changes with the condition after the bar.</Summary></article>
}

function bayesScores(input: BayesCase) {
  return ([1, 0] as const).map(purchase => {
    const prior = customers.filter(row => row.purchase === purchase).length / customers.length
    const parts = bayesFeatures.map(feature => {
      const result = conditional(feature.id, input[feature.id], purchase)
      return { label: feature.label, value: input[feature.id], numerator: result.numerator, denominator: result.denominator, probability: result.probability }
    })
    return { purchase, prior, parts, raw: prior * parts.reduce((product, part) => product * part.probability, 1) }
  })
}

export function CLCaseNaiveBayes() {
  const [input, setInput] = useState<BayesCase>({ newsletter: 0, facebook: 0, website: 0 })
  const scores = useMemo(() => bayesScores(input), [input])
  const total = scores.reduce((sum, score) => sum + score.raw, 0)
  const purchaseScore = scores[0]
  const noPurchaseScore = scores[1]
  const normalizedPurchase = purchaseScore.raw / total
  const setFeature = (feature: BayesFeature, value: 0 | 1) => setInput(current => ({ ...current, [feature]: value }))
  return <article className="cnb" aria-labelledby="cnb-lesson-8-title"><Header lesson={8} title="Case study: compare purchase likelihoods" lead="Assignment: use customer interactions to estimate whether a customer will purchase the cat clothing brand’s products. We can trace every count, conditional probability, and normalized score." />
    <Definition title="Naive Bayes combines the purchase prior with each observed feature’s within-class probability." text="For a new customer, calculate one score for Purchase and one for No purchase. Normalize by their sum to compare the two classes. The independence assumption makes the multiplication manageable, but it may not match real customer behavior." mark="Prior × clues" />
    <Why title="Marketing can inspect how a combination of observed actions changes the model’s class comparison.">The teaching dataset records 20 customers, whether they subscribed to the newsletter, followed the Facebook page, visited the website, and purchased. Twenty records are far too few for a trustworthy marketing decision; they let us audit the arithmetic step by step.</Why>
    <section className="cnb__panel"><div className="cnb__section-heading"><p className="cnb__eyebrow">Cat Slacks workbook · 20 customers</p><h2>Set the new customer’s three observed interactions.</h2><p>Each switch changes one binary feature. Watch both class scores update from the same prior and conditional frequency tables.</p></div>
      <div className="cnb__case-controls">{bayesFeatures.map(feature => <div className="cnb__binary-control" key={feature.id}><span>{feature.label}</span><div role="group" aria-label={feature.label}>{([0, 1] as const).map(value => <button type="button" key={value} aria-pressed={input[feature.id] === value} onClick={() => setFeature(feature.id, value)}>{value === 1 ? 'Yes · 1' : 'No · 0'}</button>)}</div></div>)}</div>
      <div className="cnb__input-summary" aria-live="polite"><strong>New case:</strong> {bayesFeatures.map(feature => `${feature.label} = ${input[feature.id]}`).join(' · ')}</div>
      <div className="cnb__score-cards"><ScoreCard title="Purchase = 1" score={purchaseScore} normalized={normalizedPurchase} /><ScoreCard title="Purchase = 0" score={noPurchaseScore} normalized={1 - normalizedPurchase} /></div>
      <p className="cnb__calculation"><strong>Normalization:</strong> {purchaseScore.raw.toFixed(6)} ÷ ({purchaseScore.raw.toFixed(6)} + {noPurchaseScore.raw.toFixed(6)}) = {(normalizedPurchase * 100).toFixed(1)}% purchase score. The no-purchase score is the remainder, {(100 - normalizedPurchase * 100).toFixed(1)}%.</p>
      <p className="cnb__note"><strong>Interpret with care:</strong> the normalized score is a model calculation from these 20 workbook rows under the naive independence assumption. It is not a validated probability that a real person will buy, and associations in the table do not prove that an interaction causes a purchase.</p>
    </section><Summary>Compare class scores by multiplying each class prior by its feature likelihoods, then divide by the sum. The visible workbook calculation is useful for learning; reliable decisions require more representative data and validation.</Summary></article>
}

function ScoreCard({ title, score, normalized }: { title: string; score: ReturnType<typeof bayesScores>[number]; normalized: number }) {
  return <article className="cnb__score-card"><div><h3>{title}</h3><strong>{(normalized * 100).toFixed(1)}%</strong><span>normalized score</span></div><p className="cnb__score-product">Prior {(score.prior * 100).toFixed(0)}% × {score.parts.map(part => `${part.numerator}/${part.denominator}`).join(' × ')} = {score.raw.toFixed(6)}</p><ul>{score.parts.map(part => <li key={part.label}><span>{part.label} = {part.value} | {title}</span><b>{part.numerator}/{part.denominator} = {(part.probability * 100).toFixed(1)}%</b></li>)}</ul></article>
}
