import { useState } from 'react'
import type { ReactNode } from 'react'
import './ModelEvaluation.css'
import './ModelEvaluationReview.css'
import confusionMetricsDiagram from '../assets/model-selection/confusion-metrics.svg'
import multiclassComparison from '../assets/model-selection/multiclass-comparison.png'
import multiclassBcConfusion from '../assets/model-selection/multiclass-bc-confusion.png'
import { binaryMetrics, classMetrics, type BinaryCounts } from './ModelEvaluationMath'

import scoring179 from '../assets/model-selection/multiclass-scoring-179.png'
import scoring180 from '../assets/model-selection/multiclass-scoring-180.png'
import scoring181 from '../assets/model-selection/multiclass-scoring-181.png'
import scoring182 from '../assets/model-selection/multiclass-scoring-182.png'
import scoring183 from '../assets/model-selection/multiclass-scoring-183.png'
import scoring184 from '../assets/model-selection/multiclass-scoring-184.png'

type LessonProps = { number: string; title: string; lead: string; children: ReactNode }
function Lesson({ number, title, lead, children }: LessonProps) {
  return <article className="model-evaluation" aria-labelledby={`me-title-${number}`}><header className="me-header"><p className="me-eyebrow">{number} · Model selection & tuning</p><h1 id={`me-title-${number}`}>{title}</h1><p>{lead}</p></header>{children}</article>
}
function Definition({ children, note }: { children: ReactNode; note: ReactNode }) {
  return <section className="me-definition"><div><h2>{children}</h2><p>{note}</p></div></section>
}
const pct = (value: number) => `${(value * 100).toFixed(1)}%`

type Cell = keyof BinaryCounts
const labels: Record<Cell, { short: string; name: string; explanation: string }> = {
  tp: { short: 'TP', name: 'True positive', explanation: 'Predicted positive, and the actual class is positive.' },
  fp: { short: 'FP', name: 'False positive', explanation: 'Predicted positive, but the actual class is negative.' },
  fn: { short: 'FN', name: 'False negative', explanation: 'Predicted negative, but the actual class is positive.' },
  tn: { short: 'TN', name: 'True negative', explanation: 'Predicted negative, and the actual class is negative.' },
}

const baseCounts: BinaryCounts = { tp: 100, fp: 5, fn: 15, tn: 50 }
function MatrixFrame({ kind, children }: { kind: 'class' | 'product'; children: ReactNode }) {
  return <div className={`me-matrix-frame me-matrix-frame--${kind}`}>
    <div className="me-axis-top">Actual {kind}<i aria-hidden="true"/></div>
    <div className="me-axis-left"><span>Predicted<br/>{kind}</span><i aria-hidden="true"/></div>
    <div className="me-matrix-body">{children}</div>
  </div>
}

function ConfusionTable({ counts, selected, onSelect }: { counts?: BinaryCounts; selected?: Cell; onSelect?: (cell: Cell) => void }) {
  const content = (id: Cell) => <><strong>{counts ? counts[id] : labels[id].name}</strong><span>{labels[id].short}</span></>
  const cell = (id: Cell) => onSelect
    ? <button type="button" className={`me-cell me-cell--${id} ${selected === id ? 'is-selected' : ''}`} onClick={() => onSelect(id)} aria-pressed={selected === id}>{content(id)}</button>
    : <div className={`me-cell me-cell--${id}`}>{content(id)}</div>
  return <div className={`me-matrix-wrap ${counts ? '' : 'me-matrix-wrap--concept'}`}>
    <MatrixFrame kind="class">
      <table className="me-matrix"><caption className="me-visually-hidden">Predicted classes form the rows; actual classes form the columns.</caption>
        <colgroup><col className="me-row-label-column"/><col/><col/></colgroup>
        <thead><tr><th scope="col"><span className="me-visually-hidden">Predicted class</span></th><th scope="col">Positive (1)</th><th scope="col">Negative (0)</th></tr></thead>
        <tbody><tr><th scope="row">Positive (1)</th><td>{cell('tp')}</td><td>{cell('fp')}</td></tr><tr><th scope="row">Negative (0)</th><td>{cell('fn')}</td><td>{cell('tn')}</td></tr></tbody>
      </table>
    </MatrixFrame>
    {counts && <p className="me-matrix-total">Total predictions: <strong>{counts.tp + counts.fp + counts.fn + counts.tn}</strong></p>}
  </div>
}

function BinaryNumericExample({ selected }: { selected: Cell }) {
  return <figure className="me-numeric-example">
    <table><caption className="me-visually-hidden">Numeric example: predicted classes are rows and actual classes are columns.</caption>
      <thead><tr><th><span className="me-visually-hidden">Predicted / Actual</span></th><th scope="col">1</th><th scope="col">0</th></tr></thead>
      <tbody>{([['1', 'tp', 'fp'], ['0', 'fn', 'tn']] as const).map(([row, first, second]) => <tr key={row}>
        <th scope="row">{row}</th>{[first, second].map(cell => <td key={cell} className={selected === cell ? 'is-selected' : ''}><span className="me-visually-hidden">{labels[cell].name}: </span>{baseCounts[cell]}</td>)}
      </tr>)}</tbody>
    </table>
  </figure>
}

export function MSConfusionMatrix() {
  const [selected, setSelected] = useState<Cell>('tp')
  return <Lesson number="10.4" title="Confusion matrix" lead="A classifier is useful only if we can compare its predictions with labels observed later. A confusion matrix keeps every correct and incorrect outcome visible.">
    <Definition note={<>By convention, class <strong>1</strong> is positive and class <strong>0</strong> is negative. Read the model’s prediction across a row and the observed class down a column.</>}><strong>A confusion matrix</strong> summarizes a classification model by crossing its predicted classes with the actual classes.</Definition>
    <section className="me-panel"><div className="me-heading"><h2>Click a cell to name the kind of result</h2></div><p className="me-axis-key"><span><strong>Predicted:</strong> the model’s output.</span><span><strong>Actual:</strong> the observed label in the evaluation data.</span></p><div className="me-confusion-pair"><ConfusionTable selected={selected} onSelect={setSelected} /><span className="me-example-brace" aria-hidden="true">&#125;</span><BinaryNumericExample selected={selected}/></div><div className={`me-cell-explanation me-cell-explanation--${selected}`} aria-live="polite"><span>{labels[selected].short}</span><div><strong>{labels[selected].name}</strong><p>{labels[selected].explanation}</p></div></div><p className="me-note"><strong>Read the diagonal first:</strong> TP and TN lie on the diagonal, where prediction agrees with reality. FP and FN are off-diagonal errors, but their practical costs can be very different.</p></section>
    <section className="me-panel me-metrics-intro" aria-labelledby="me-metrics-intro-title">
      <div className="me-heading"><h2 id="me-metrics-intro-title">Evaluate and compare classification models</h2>
        <p>A confusion matrix is the most common, concise way to evaluate performance and compare classification models. Its cells also give us <strong>accuracy</strong>, <strong>precision</strong>, and <strong>recall</strong>.</p>
      </div>
      <figure><img src={confusionMetricsDiagram} width="1280" height="290" alt="Accuracy: (TP + TN) divided by all predictions — what share were correct? Precision: TP divided by (TP + FP) — what share of predicted positives were correct? Recall: TP divided by (TP + FN) — what share of actual positives were found?"/></figure>
    </section>

  </Lesson>
}

export function MSAccuracyPrecisionRecall() {
  const [counts, setCounts] = useState<BinaryCounts>(baseCounts)
  const metrics = binaryMetrics(counts)
  const change = (key: Cell, raw: string) => setCounts(previous => ({ ...previous, [key]: Number.isFinite(Number(raw)) ? Math.max(0, Math.floor(Number(raw))) : 0 }))
  const rows: { name: string; formula: React.ReactNode; value: number; denominator: number; use: string }[] = [
    { name: 'Accuracy', formula: <>(TP + TN) ÷ all predictions</>, value: metrics.accuracy, denominator: metrics.total, use: 'Of every prediction, what share was correct?' },
    { name: 'Precision', formula: <>TP ÷ (TP + FP)</>, value: metrics.precision, denominator: counts.tp + counts.fp, use: 'Of predicted positives, what share really was positive?' },
    { name: 'Recall', formula: <>TP ÷ (TP + FN)</>, value: metrics.recall, denominator: counts.tp + counts.fn, use: 'Of actual positives, what share did the model find?' },
  ]
  return <Lesson number="10.5" title="Accuracy, precision & recall" lead="The same four confusion-matrix cells support three useful scores. The important score depends on which kind of mistake matters in the real task.">
    <Definition note={<>All three metrics are proportions from <strong>0 to 1</strong>, often shown as percentages. A high accuracy alone can be misleading when the positive class is rare.</>}><strong>Accuracy</strong> asks whether predictions are correct overall. <strong>Precision</strong> checks positive alerts. <strong>Recall</strong> checks whether actual positives were found.</Definition>
    <section className="me-panel"><div className="me-heading"><p className="me-eyebrow">Make the numbers traceable</p><h2>Adjust a cell and watch each score use it</h2><p>These start with the course’s worked values. Change a count to see the numerator, denominator, and interpretation respond. A score is undefined when its denominator is zero.</p></div><div className="me-count-controls">{(Object.keys(labels) as Cell[]).map(key => <label key={key}><span>{labels[key].short} · {labels[key].name}</span><input type="number" min="0" step="1" value={counts[key]} onChange={event => change(key, event.target.value)} /></label>)}</div><button type="button" className="me-reset" onClick={() => setCounts(baseCounts)}>Reset counts</button><ConfusionTable counts={counts} /><div className="me-score-grid">{rows.map(row => <article key={row.name}><span>{row.name}</span><strong>{row.denominator ? pct(row.value) : 'Undefined'}</strong><code>{row.formula}</code><p>{row.use}</p></article>)}</div><div className="me-calculation"><strong>Current calculation</strong><span>Accuracy = ({counts.tp} + {counts.tn}) ÷ {metrics.total} = {metrics.total ? pct(metrics.accuracy) : 'undefined (no predictions)'}</span><span>Precision = {counts.tp} ÷ ({counts.tp} + {counts.fp}) = {counts.tp + counts.fp ? pct(metrics.precision) : 'undefined (no predicted positives)'}</span><span>Recall = {counts.tp} ÷ ({counts.tp} + {counts.fn}) = {counts.tp + counts.fn ? pct(metrics.recall) : 'undefined (no actual positives)'}</span></div></section>
    <section className="me-two-notes"><div><strong>When recall matters</strong><p>For a safety warning, a false negative can be serious: the event happened but the system did not flag it. Compare candidates by recall as well as their false-negative count.</p></div><div><strong>When precision matters</strong><p>For a spam filter, a false positive can be costly: a legitimate message is filtered. Look at precision when positive alerts need to be trustworthy.</p></div></section>
  </Lesson>
}

const products = ['A', 'B', 'C', 'D']
const good = [[214, 1, 8, 2], [15, 452, 1, 0], [0, 0, 1123, 19], [3, 2, 12, 34]]
// Separate source examples: comparison (177) and B/C diagnosis (178).
const comparisonPoor = [[14, 1, 27, 67], [55, 56, 79, 15], [11, 201, 90, 100], [63, 145, 11, 18]]
const bcConfusion = [[37, 2, 1, 0], [4, 71, 76, 1], [3, 69, 66, 0], [1, 2, 0, 201]]
function AccessibleProductMatrix({ title, matrix }: { title: string; matrix: number[][] }) {
  return <table className="me-visually-hidden"><caption>{title}. Rows are predicted products; columns are actual products.</caption>
    <thead><tr><th scope="col">Predicted product</th>{products.map(product => <th scope="col" key={product}>{product}</th>)}</tr></thead>
    <tbody>{matrix.map((row, index) => <tr key={products[index]}><th scope="row">{products[index]}</th>{row.map((value, column) => <td key={column}>{value}</td>)}</tr>)}</tbody>
  </table>
}
export function MSMulticlassConfusionMatrix() {
  return <Lesson number="10.6" title="Multi-class confusion matrix" lead="A confusion matrix also works for multiple classes. Here, a model predicts products A, B, C, and D.">
    <section className="me-panel me-source-multiclass">
      <div className="me-heading"><h2>Look for high counts along the diagonal</h2><p>The diagonal runs from top left to bottom right: these predictions match the actual product.</p></div>
      <figure><img src={multiclassComparison} width="1530" height="735" alt="Two product confusion matrices. The good matrix concentrates high counts on its outlined diagonal. The bad matrix has large counts away from the diagonal, including 201 actual B products predicted as C."/></figure>
      <AccessibleProductMatrix title="Good confusion matrix" matrix={good}/>
      <AccessibleProductMatrix title="Bad confusion matrix" matrix={comparisonPoor}/>
    </section>
    <section className="me-panel me-source-multiclass">
      <div className="me-heading"><h2>Find which classes the model confuses</h2><p>A confusion matrix can reveal relationships between classes and help guide model improvements.</p></div>
      <figure><img src={multiclassBcConfusion} width="1620" height="600" alt="The highlighted B/C block shows 71 correct B predictions and 66 correct C predictions, but 76 actual C products predicted as B and 69 actual B products predicted as C. Are B and C very similar, and do they need separate predictions? If so, could additional features help distinguish them?"/></figure>
      <AccessibleProductMatrix title="Products B and C are confused" matrix={bcConfusion}/>
    </section>
  </Lesson>
}

function AccessibleScores({ matrix, title }: { matrix: number[][]; title: string }) {
  const scores = products.map((name, index) => ({ name, ...classMetrics(matrix, index), support: matrix.reduce((sum, row) => sum + row[index], 0) }))
  const total = scores.reduce((sum, score) => sum + score.support, 0)
  return <table className="me-visually-hidden"><caption>{title}. Accuracy is one-versus-rest; support counts actual observations.</caption>
    <thead><tr><th scope="col">Product</th><th scope="col">Support</th><th scope="col">Accuracy</th><th scope="col">Precision</th><th scope="col">Recall</th></tr></thead>
    <tbody>{scores.map(score => <tr key={score.name}><th scope="row">{score.name}</th><td>{score.support}</td><td>{score.accuracy.toFixed(4)}</td><td>{score.precision.toFixed(4)}</td><td>{score.recall.toFixed(4)}</td></tr>)}</tbody>
    <tfoot><tr><th scope="row">Support-weighted average</th><td>{total}</td>{(['accuracy', 'precision', 'recall'] as const).map(metric => <td key={metric}>{(scores.reduce((sum, score) => sum + score[metric] * score.support, 0) / total).toFixed(4)}</td>)}</tr></tfoot>
  </table>
}
const scoringExamples = [
  { product: 'A', image: scoring179, description: 'True positive: 214. The teal box marks true negatives. Accuracy = (214 + 1643) / 1886 = .9846. Precision = 214 / (214 + 1 + 8 + 2) = .9511. Recall = 214 / (214 + 15 + 0 + 3) = .9224.' },
  { product: 'B', image: scoring180, description: 'Accuracy = (452 + 1415) / 1886 = .9899. Precision = 452 / (452 + 15 + 1) = .9658. Recall = 452 / (452 + 1 + 2) = .9934.' },
  { product: 'C', image: scoring181, description: 'Accuracy = (1123 + 723) / 1886 = .9788. Precision = 1123 / (1123 + 19) = .9834. Recall = 1123 / (1123 + 8 + 1 + 12) = .9816.' },
  { product: 'D', image: scoring182, description: 'Accuracy = (34 + 1814) / 1886 = .9799. Precision = 34 / (34 + 3 + 2 + 12) = .6667. Recall = 34 / (34 + 2 + 19) = .6182.' },
]
export function MSMulticlassScoring() {
  return <Lesson number="10.7" title="Multi-class scoring" lead="Calculate accuracy, precision, and recall for each class, then take a weighted average to evaluate the model as a whole.">
    {scoringExamples.map(({ product, image, description }) => <section className="me-panel me-source-multiclass" key={product}>
      <div className="me-heading"><h2>Product {product} versus every other product</h2></div>
      <figure><img src={image} width="1658" height="798" alt={description}/></figure>
      {product === 'A' && <p className="me-note">True negatives are cells where product A was <strong>neither predicted nor observed</strong>.</p>}
      {product === 'D' && <p className="me-note">Product D’s accuracy is high because most observations belong to other products. Its precision and recall show that D itself is predicted much less reliably.</p>}
    </section>)}
    <section className="me-panel me-source-multiclass">
      <div className="me-heading"><h2>Good confusion matrix: weighted scores</h2><p>Weight each class score by its number of actual observations (# Obs.). Inspect the individual classes as well as the average.</p></div>
      <figure><img src={scoring183} width="1658" height="798" alt="Good confusion matrix alongside scores for A, B, C and D. Weighted averages: one-versus-rest accuracy .9822, precision .9659, recall .9666."/></figure>
      <AccessibleProductMatrix title="Good confusion matrix" matrix={good}/><AccessibleScores title="Good matrix scores" matrix={good}/>
      <p className="me-note">For example, weighted precision = (.9511 × 232 + .9658 × 455 + .9834 × 1144 + .6667 × 55) ÷ 1886 ≈ <strong>.9659</strong>.</p>
    </section>
    <section className="me-panel me-source-multiclass">
      <div className="me-heading"><h2>Bad confusion matrix: compare the scores</h2></div>
      <figure><img src={scoring184} width="1658" height="798" alt="Bad confusion matrix alongside scores for A, B, C and D. Weighted averages: one-versus-rest accuracy .5563, precision .1994, recall .1868."/></figure>
      <AccessibleProductMatrix title="Bad confusion matrix" matrix={comparisonPoor}/><AccessibleScores title="Bad matrix scores" matrix={comparisonPoor}/>
      <p className="me-note">The accuracy column averages <strong>one-versus-rest accuracy</strong>. Overall accuracy instead counts correct predictions on the diagonal: <strong>1823 ÷ 1886 = .9666</strong> for the good matrix, and <strong>178 ÷ 953 = .1868</strong> for the bad matrix.</p>
    </section>
  </Lesson>
}

const candidates = [
  { id: 'safety', name: 'Safety alert', accuracy: 0.90, precision: 0.62, recall: 0.97, note: 'Find nearly every actual dangerous event; review extra alerts.' },
  { id: 'balanced', name: 'Balanced classifier', accuracy: 0.94, precision: 0.81, recall: 0.82, note: 'Makes a more even trade-off between false positives and false negatives.' },
  { id: 'filter', name: 'Strict filter', accuracy: 0.92, precision: 0.95, recall: 0.58, note: 'Positive alerts are usually correct, but many actual positives are missed.' },
]
export function MSModelSelection() {
  const [scenario, setScenario] = useState<'safety' | 'spam' | 'equal'>('safety')
  const metric = scenario === 'safety' ? 'recall' : scenario === 'spam' ? 'precision' : 'accuracy'
  const winner = candidates.reduce((best, item) => item[metric] > best[metric] ? item : best)
  return <Lesson number="10.8" title="Model selection" lead="Compare models using the metric that matters most for your task.">

    <section className="me-panel"><div className="me-heading"><p className="me-eyebrow">Same candidates, different decision</p><h2>Choose the business consequence first</h2><p>Change the context to see which of the same three candidates fits best.</p></div><div className="me-scenario"><label><input type="radio" name="model-selection-context" checked={scenario === 'safety'} onChange={() => setScenario('safety')} /> Missing a safety event <strong>→ Recall</strong></label><label><input type="radio" name="model-selection-context" checked={scenario === 'spam'} onChange={() => setScenario('spam')} /> Filtering legitimate email as spam <strong>→ Precision</strong></label><label><input type="radio" name="model-selection-context" checked={scenario === 'equal'} onChange={() => setScenario('equal')} /> Both errors have similar cost <strong>→ Accuracy</strong></label></div><div className="me-candidate-grid">{candidates.map(candidate => <article key={candidate.id} className={candidate.id === winner.id ? 'is-winner' : ''}><span>{candidate.id === winner.id ? 'Best match here' : 'Candidate'}</span><h3>{candidate.name}</h3><div><b>Accuracy</b><strong className={metric === 'accuracy' ? 'is-key' : ''}>{pct(candidate.accuracy)}</strong></div><div><b>Precision</b><strong className={metric === 'precision' ? 'is-key' : ''}>{pct(candidate.precision)}</strong></div><div><b>Recall</b><strong className={metric === 'recall' ? 'is-key' : ''}>{pct(candidate.recall)}</strong></div></article>)}</div><p className="me-note" aria-live="polite"><strong>{winner.name}</strong> has the highest {metric}: <strong>{pct(winner[metric])}</strong>.<br/><br/>{scenario === 'safety' ? <><strong>Recall = TP ÷ (TP + FN)</strong>: the share of actual dangers caught.<br/><br/>A <em>missed danger</em> is a <strong>false negative (FN)</strong>; an <em>extra alert when there is no danger</em> is a <strong>false positive (FP)</strong>.<br/><br/>Here, <u>missing a real danger is more costly</u>, so catching real dangers matters more than avoiding extra alerts.</> : scenario === 'spam' ? <><strong>Precision = TP ÷ (TP + FP)</strong>: the share of spam flags that are correct.<br/><br/>Spam is the <em>positive class</em>, so <em>filtering legitimate email as spam</em> is a <strong>false positive (FP)</strong>; <em>letting spam through</em> is a <strong>false negative (FN)</strong>.<br/><br/>Here, <u>filtering legitimate email is more costly</u>, so trustworthy spam flags matter more than catching every spam message.</> : <><strong>Accuracy = (TP + TN) ÷ (TP + TN + FP + FN)</strong>: <em>correct predictions divided by all predictions</em>.<br/><br/>It counts both <strong>true positives (TP)</strong> and <strong>true negatives (TN)</strong>.<br/><br/>When false positives and false negatives have <u>similar costs</u>, choose the <strong>highest accuracy</strong> among these candidates to minimize mistakes overall.</>}</p></section>
  </Lesson>
}

const driftPeriods = [0.94, 0.93, 0.92, 0.90, 0.86, 0.81, 0.76]
export function MSModelDrift() {
  const [period, setPeriod] = useState(6)
  const value = driftPeriods[period]
  const chartY = (score: number) => 218 - (score - .7) / .3 * 180
  const points = driftPeriods.map((score, index) => `${60 + index * 80},${chartY(score)}`).join(' ')
  const dropPoints = (0.94 - value) * 100
  return <Lesson number="10.9" title="Model drift" lead="Customer preferences can change even when your model stays the same.">
    <Definition note={<>Drift can occur when the relationship between the features (X) and outcome (Y) changes—for example, when customer preferences or the context around a purchase changes.</>}><strong>Model drift</strong> is deterioration in predictive performance over time, even when the collected variables and model parameters appear unchanged.</Definition>
    <aside className="me-note"><strong>Best practice: maintain models used for ongoing prediction.</strong><br/><br/>
      Plan <em>regular updates or retraining</em> to combat drift. Set the schedule around how quickly the problem changes and how much fresh labeled data is available. Monitor between updates so a performance drop can trigger an earlier review.
    </aside>

    <section className="me-panel"><div className="me-heading"><p className="me-eyebrow">A monitoring example</p><h2>Compare every period with day-one performance</h2><p>In this illustrative series, a churn classifier began with 94% accuracy. Move through later monthly checks to see when its performance meaningfully falls away from its baseline.</p></div><label className="me-range-label" htmlFor="me-drift-period">Evaluation month <strong>{period + 1}</strong></label><input id="me-drift-period" type="range" min="0" max="6" step="1" value={period} onChange={event => setPeriod(Number(event.target.value))} /><div className="me-drift-chart">
      <div className="me-drift-plot">
        <div className="me-drift-legend"><span className="me-legend-series">Monthly accuracy</span><span className="me-legend-baseline">Day-one baseline · 94%</span><span className="me-legend-threshold">Investigation threshold · 85% (illustrative)</span></div>
        <svg viewBox="0 0 580 260" role="img" aria-label={`Monthly accuracy from 94 percent at month 1 to 76 percent at month 7. Selected month ${period + 1}: ${(value * 100).toFixed(0)} percent. Baseline 94 percent; illustrative investigation threshold 85 percent.`}>
          <text x="60" y="19" className="me-drift-axis-title">Accuracy</text>
          {[.7, .8, .9, 1].map(tick => <g key={tick}><line x1="60" y1={chartY(tick)} x2="540" y2={chartY(tick)} className="me-drift-grid"/><text x="48" y={chartY(tick) + 4} textAnchor="end">{Math.round(tick * 100)}%</text></g>)}
          <line x1="60" y1={chartY(.85)} x2="540" y2={chartY(.85)} className="me-threshold"/>
          <line x1="60" y1={chartY(.94)} x2="540" y2={chartY(.94)} className="me-baseline"/>
          <polyline points={points}/>
          {driftPeriods.map((score, index) => <circle key={index} cx={60 + index * 80} cy={chartY(score)} r="3" className="me-drift-point"/>)}
          <circle cx={60 + period * 80} cy={chartY(value)} r="5" className="me-drift-selected"/>
          {driftPeriods.map((_, index) => <text key={index} x={60 + index * 80} y="240" textAnchor="middle">M{index + 1}</text>)}
        </svg>
      </div><div><span>Selected check</span><strong>{pct(value)} accuracy</strong><p>{dropPoints.toFixed(1)} percentage points below the day-one baseline.</p><b>{value < .85 ? 'Below this lesson’s illustrative 85% threshold: investigate and consider retraining with newer data.' : 'Above this lesson’s illustrative 85% threshold: continue monitoring with the same evaluation definition.'}</b></div></div></section>
    <section className="me-panel" aria-labelledby="me-drift-tips-title">
      <div className="me-heading"><h2 id="me-drift-tips-title">Tips to correct drift</h2></div>
      <ol className="me-next-steps me-drift-steps">
        <li><strong>1 · Benchmark</strong><span>Record <strong>accuracy, precision, and recall on day one</strong>. This is your starting point for later comparisons.</span></li>
        <li><strong>2 · Monitor</strong><span>Compare performance with that benchmark <strong>over time</strong> as actual outcomes become available. Check the important classes too—overall accuracy can hide missed cases.</span></li>
        <li><strong>3 · Retrain</strong><span>If performance drifts, retrain using <strong>updated training data</strong>.<br/><br/>Consider excluding older records from training <em>if you have enough newer data</em> and those old records no longer represent current conditions.</span></li>
        <li><strong>4 · Improve features</strong><span>Conduct additional <strong>feature engineering</strong> as needed: add or revise inputs that capture the changed patterns.</span></li>
      </ol>
      <p className="me-note"><strong>After retraining:</strong> check the updated model on recent data it has not trained on before replacing the current version. Retraining should improve performance; a schedule alone does not guarantee that.</p>
    </section>

  </Lesson>
}

export function MSLookingAhead() { return <Lesson number="10.10" title="Next: predict a number, not a category" lead="You have finished the classification portion of the course: methods that learn from labeled examples to predict categories such as churn/stay, spam/not spam, or product A/B/C/D."><Definition note={<>Classification predicts a discrete <strong>class label</strong>. Regression and forecasting predict a <strong>numeric value</strong>, such as a sale amount or future demand.</>}><strong>Part 2 built a classification workflow:</strong> prepare data, define features and labels, fit candidates, evaluate mistakes, select a model, and monitor it over time.</Definition><section className="me-panel"><div className="me-heading"><p className="me-eyebrow">Carry the workflow forward</p><h2>The target changes; the discipline stays</h2><p>Use this sequence for a new project. Each step produces evidence for the next; it is a guide, not a completion gate.</p></div><ol className="me-next-steps"><li><strong>1 · QA and profile</strong><span>Output: a trustworthy table and documented limitations. Decision: is the data usable?</span></li><li><strong>2 · Define X and y</strong><span>Output: prediction-time features X and an observed target y. Decision: what exactly counts as success?</span></li><li><strong>3 · Split records</strong><span>Output: separate training, validation, and final test records. Decision: which records must remain unseen?</span></li><li><strong>4 · Fit and tune</strong><span>Output: candidate models and chosen settings. Decision: which adjustments improve validation performance?</span></li><li><strong>5 · Evaluate and select</strong><span>Output: confusion matrices and decision-relevant metrics. Decision: which error is more costly?</span></li><li><strong>6 · Final test</strong><span>Output: one honest estimate on untouched records. Decision: is performance adequate to use?</span></li><li><strong>7 · Monitor</strong><span>Output: a baseline and recurring checks. Decision: when should the model be investigated or retrained?</span></li></ol><p className="me-note"><strong>Next target types:</strong> classification answers “which class?”; regression answers “what numeric value?”; forecasting answers “what numeric value in the future?” The same evidence-first workflow applies.</p></section></Lesson> }
