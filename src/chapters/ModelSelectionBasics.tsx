import { useState } from 'react'
import type { ReactNode } from 'react'
import './ModelSelectionBasics.css'

function LessonHeader({ number, title, lead, id }: { number: string; title: string; lead: string; id: string }) {
  return <header className="model-selection__header">
    <p className="model-selection__eyebrow">Chapter 10 · Lesson {number}</p>
    <h1 id={id}>{title}</h1>
    <p>{lead}</p>
  </header>
}

function Summary({ children }: { children: ReactNode }) {
  return <aside className="model-selection__summary"><span aria-hidden="true">✓</span><p>{children}</p></aside>
}

const SENSOR_POINTS = [
  { id: 'A', x: 1, y: 2, label: 'Normal' },
  { id: 'B', x: 2, y: 1, label: 'Alert' },
  { id: 'C', x: 3, y: 3, label: 'Normal' },
  { id: 'D', x: 4, y: 0, label: 'Alert' },
  { id: 'E', x: 2, y: 3, label: 'Normal' },
] as const

type DistanceName = 'Euclidean' | 'Manhattan'

function distance(point: typeof SENSOR_POINTS[number], metric: DistanceName) {
  const dx = Math.abs(point.x - 3)
  const dy = Math.abs(point.y - 1)
  return metric === 'Euclidean' ? Math.sqrt(dx ** 2 + dy ** 2) : dx + dy
}

function formatDistance(value: number, metric: DistanceName) {
  return metric === 'Euclidean' ? value.toFixed(2) : value.toFixed(0)
}

export function MSIntroSelectionTuning() {
  const [focus, setFocus] = useState<'selection' | 'tuning'>('selection')
  const selecting = focus === 'selection'
  return <article className="model-selection" aria-labelledby="ms-intro-title">
    <LessonHeader id="ms-intro-title" number="1" title="Model selection and tuning" lead="After learning several classification methods, the next step is to compare candidates and adjust their settings for the prediction problem at hand." />
    <section className="model-selection__definition">
      <div><p className="model-selection__eyebrow">Two related decisions</p><h2><strong>Selection</strong> chooses the model that best fits the problem. <strong>Tuning</strong> adjusts a model’s settings to improve its predictive performance.</h2><p>Both decisions depend on the question the model must answer and the evidence used to compare its predictions.</p></div>
      <div className="model-selection__definition-mark" aria-hidden="true"><span>Compare</span><b>→</b><span>Adjust</span><small>choose a model · improve its settings</small></div>
    </section>
    <section className="model-selection__why"><p className="model-selection__eyebrow">Why both matter</p><h2>A strong algorithm still needs to fit the task.</h2><p>Suppose a plant uses sensor readings to predict a rare equipment warning. The team can compare classification models, adjust settings within a candidate, account for rare warning labels, and check whether predictions hold up over time. Each topic addresses a different part of building a useful classifier.</p></section>
    <section className="model-selection__interactive" aria-labelledby="ms-intro-explore-title">
      <div className="model-selection__section-heading"><p className="model-selection__eyebrow">Follow the decisions</p><h2 id="ms-intro-explore-title">One prediction task, two different kinds of work</h2><p>Switch the highlighted step to see what changes and what stays fixed in the sensor-warning example.</p></div>
      <div className="model-selection__toggle" role="group" aria-label="Choose a model-building decision">
        <button type="button" aria-pressed={selecting} onClick={() => setFocus('selection')}>Select a model</button>
        <button type="button" aria-pressed={!selecting} onClick={() => setFocus('tuning')}>Tune its settings</button>
      </div>
      <div className="model-selection__decision-flow" aria-live="polite">
        <div className="model-selection__task"><span>Fixed task</span><strong>Predict an equipment alert</strong><small>Inputs: sensor readings · target: observed alert label</small></div>
        <span className="model-selection__flow-arrow" aria-hidden="true">→</span>
        <div className={`model-selection__decision-card ${selecting ? 'is-active' : ''}`}><span>Step A</span><strong>Compare candidate models</strong><small>For example: k-nearest neighbors, decision tree, random forest</small></div>
        <span className="model-selection__flow-arrow" aria-hidden="true">→</span>
        <div className={`model-selection__decision-card ${!selecting ? 'is-active' : ''}`}><span>Step B</span><strong>Adjust settings within a model</strong><small>For example: number of neighbors or tree depth</small></div>
      </div>
      <p className="model-selection__focus-note"><strong>{selecting ? 'Selection:' : 'Tuning:'}</strong> {selecting ? 'compare different model approaches for this same prediction task.' : 'keep the model approach in view while trying different training settings.'} The task and its labeled examples remain the reference point.</p>
    </section>
    <Summary><strong>Remember:</strong> selection compares models for a problem; tuning searches for useful settings within a model. Class balance, evaluation, and change over time also affect whether a classifier is useful.</Summary>
  </article>
}

export function MSHyperparameters() {
  const [neighbors, setNeighbors] = useState(2)
  const [metric, setMetric] = useState<DistanceName>('Euclidean')
  const nearest = SENSOR_POINTS.map((point) => ({ ...point, distance: distance(point, metric) }))
    .sort((a, b) => a.distance - b.distance || a.id.localeCompare(b.id))
    .slice(0, neighbors)
  const alerts = nearest.filter((point) => point.label === 'Alert').length
  const normals = nearest.length - alerts
  const prediction = alerts > normals ? 'Alert' : 'Normal'
  const usedIds = new Set(nearest.map((point) => point.id))
  return <article className="model-selection" aria-labelledby="ms-hyper-title">
    <LessonHeader id="ms-hyper-title" number="2" title="Hyperparameters" lead="Classification methods have settings that can be adjusted while training. Trying settings to find a useful level is called hyperparameter optimization." />
    <section className="model-selection__definition">
      <div><p className="model-selection__eyebrow">The central idea</p><h2><strong>Hyperparameters</strong> are inputs or settings you can control while training a model.</h2><p>They shape how a method learns or searches. They are not the same as the model’s learned parameters.</p></div>
      <div className="model-selection__definition-mark"><span>Settings</span><b>→</b><span>Training</span><small>try · compare · choose</small></div>
    </section>
    <section className="model-selection__key-terms" aria-labelledby="ms-hyper-terms-title">
      <div className="model-selection__section-heading"><p className="model-selection__eyebrow">Keep these terms in view</p><h2 id="ms-hyper-terms-title">A setting is meaningful only in its model</h2><p>Different classification methods expose different choices. A few examples from the course:</p></div>
      <div className="model-selection__model-list">
        <article><h3>k-nearest neighbors</h3><p><b>K:</b> number of neighbors · <b>distance:</b> how points are compared · <b>algorithm:</b> how neighbors are searched</p></article>
        <article><h3>Decision trees</h3><p><b>Split criterion:</b> such as entropy or Gini · <b>depth, leaf size, features, minimum gain:</b> limits and choices for splits</p></article>
        <article><h3>Random forests</h3><p>Tree choices plus <b>number of trees</b>, resampling choices, and the number of features considered</p></article>
        <article><h3>Naïve Bayes &amp; logistic regression</h3><p>Naïve Bayes can use a smoothing setting. Logistic regression may use an intercept, penalty, and solver choice.</p></article>
      </div>
      <div className="model-selection__data-roles"><div><strong>Feature inputs · X</strong><span>temperature rise and vibration from each past sensor reading</span></div><div><strong>Observed label · y</strong><span>the later Normal or Alert outcome attached to that reading</span></div><div><strong>Chosen vs. learned</strong><span><em>K = 2</em> is a chosen hyperparameter; a fitted model’s learned rule or coefficients are parameters.</span></div></div>
    </section>
    <section className="model-selection__why"><p className="model-selection__eyebrow">Why adjust settings?</p><h2>Settings can change which examples influence a prediction.</h2><p>For k-nearest neighbors, choosing K decides how many nearby labeled sensor examples vote on a new reading. The mini-example below uses supplied labels and a hand-calculated neighbor rule to show that setting; it does not train a model.</p></section>
    <section className="model-selection__interactive" aria-labelledby="ms-hyper-demo-title">
      <div className="model-selection__section-heading"><p className="model-selection__eyebrow">Interactive worked example · supplied labels</p><h2 id="ms-hyper-demo-title">How K and distance change the neighbors</h2><p>Each point is a past sensor reading, with temperature rise and vibration level. Predict the label for the new reading at (3, 1). Try K = 2, then switch the distance: notice which record enters or leaves the vote.</p></div>
      <div className="model-selection__control-row">
        <fieldset className="model-selection__control"><legend>Number of neighbors, K</legend>{[1, 2, 3].map((value) => <button key={value} type="button" aria-pressed={neighbors === value} onClick={() => setNeighbors(value)}>{value}</button>)}<small>K controls how many nearby labeled examples vote.</small></fieldset>
        <fieldset className="model-selection__control"><legend>Distance definition</legend>{(['Euclidean', 'Manhattan'] as const).map((value) => <button key={value} type="button" aria-pressed={metric === value} onClick={() => setMetric(value)}>{value}</button>)}<small>{metric === 'Euclidean' ? 'Straight-line distance: √(Δtemperature² + Δvibration²).' : 'Grid distance: |Δtemperature| + |Δvibration|.'}</small></fieldset>
      </div>
      <div className="model-selection__knn-layout">
        <figure className="model-selection__plot">
          <figcaption>Training examples and the separate prediction input</figcaption>
          <svg viewBox="0 0 390 300" role="img" aria-label="Scatter plot of sensor examples by temperature rise and vibration. The new reading is at 3, 1.">
            <line x1="70" y1="246" x2="280" y2="246" className="model-selection__axis" /><line x1="70" y1="246" x2="70" y2="36" className="model-selection__axis" />
            {[0, 1, 2, 3, 4].map((tick) => <g key={tick}><line x1={70 + tick * 42} y1="246" x2={70 + tick * 42} y2="251" className="model-selection__tick"/><text x={70 + tick * 42} y="270" textAnchor="middle">{tick}</text><line x1="65" y1={246 - tick * 42} x2="70" y2={246 - tick * 42} className="model-selection__tick"/><text x="52" y={250 - tick * 42} textAnchor="middle">{tick}</text></g>)}
            <text x="175" y="294" textAnchor="middle">Temperature rise · scaled units</text><text transform="translate(20 140) rotate(-90)" textAnchor="middle">Vibration · scaled units</text>
            {nearest.map((point) => <line key={`guide-${point.id}`} x1="196" y1="204" x2={70 + point.x * 42} y2={246 - point.y * 42} className="model-selection__distance-guide" />)}
            {SENSOR_POINTS.map((point) => <g key={point.id} className={`${point.label === 'Alert' ? 'is-alert' : 'is-normal'} ${usedIds.has(point.id) ? 'is-nearest' : ''}`}><circle cx={70 + point.x * 42} cy={246 - point.y * 42} r={usedIds.has(point.id) ? 10 : 8}/><text x={70 + point.x * 42 + 13} y={246 - point.y * 42 + 4}>{point.id} · {point.label}</text></g>)}
            <path d="M 196 196 L 204 204 L 196 212 L 188 204 Z" className="model-selection__new-point"/><text x="209" y="209" className="model-selection__new-label">New · (3, 1)</text>
          </svg>
          <div className="model-selection__legend"><span><i className="is-normal"/>Normal label</span><span><i className="is-alert"/>Alert label</span><span><i className="is-selected"/>Included among current K</span></div>
        </figure>
        <div className="model-selection__calculation" aria-live="polite">
          <h3>Trace the nearest examples</h3><p className="model-selection__calculation-intro">From new point (3, 1), example B at (2, 1) has {metric === 'Euclidean' ? '√((3−2)² + (1−1)²) = 1' : '|3−2| + |1−1| = 1'} distance unit.</p>
          <ol>{nearest.map((point) => <li key={point.id}><span className={point.label === 'Alert' ? 'is-alert' : 'is-normal'}>{point.id} · {point.label}</span><b>{formatDistance(point.distance, metric)} units</b></li>)}</ol>
          <div className="model-selection__vote"><span>Visible vote</span><strong>{alerts} Alert + {normals} Normal</strong><b>Example prediction: {prediction}</b></div>
          <p className="model-selection__note">This is a tiny teaching example with supplied labels. At K = 2, Euclidean distance includes D while Manhattan distance includes C; their labels make the change in the vote visible. It is not a fitted or validated classifier.</p>
        </div>
      </div>
    </section>
    <Summary><strong>Remember:</strong> hyperparameters are adjustable training settings. K, distance, tree depth, and smoothing belong to different methods; tuning compares setting choices to find useful predictive performance.</Summary>
  </article>
}

type BalanceMethod = 'original' | 'up' | 'down' | 'weight'

const BALANCE_METHODS: { id: BalanceMethod; label: string }[] = [
  { id: 'original', label: 'Original training data' },
  { id: 'up', label: 'Up-sampling' },
  { id: 'down', label: 'Down-sampling' },
  { id: 'weight', label: 'Weighting' },
]

export function MSImbalancedClasses() {
  const [method, setMethod] = useState<BalanceMethod>('original')
  const view = {
    original: { normal: 9, alert: 1, title: 'Original training set', detail: 'Nine normal readings and one alert reading. A model that always predicts Normal would be correct on 9 of 10 rows (90%) while missing every alert.' },
    up: { normal: 9, alert: 9, title: 'After up-sampling', detail: 'The one minority Alert row is duplicated until its training count matches the nine Normal rows. There are 18 training rows, but still only one distinct Alert example.' },
    down: { normal: 1, alert: 1, title: 'After down-sampling', detail: 'Eight majority Normal rows are randomly removed, leaving one Normal and one Alert row. The balanced example has only 2 rows.' },
    weight: { normal: 9, alert: 9, title: 'Illustrative class weights', detail: 'Keep all 10 rows, but give the one Alert row 9× weight in a method that supports class weighting or weighted resampling. Its weighted contribution is 9 versus 9 for Normal.' },
  }[method]
  const isWeighted = method === 'weight'
  const rowCount = method === 'up' ? 18 : method === 'down' ? 2 : 10
  return <article className="model-selection" aria-labelledby="ms-imbalance-title">
    <LessonHeader id="ms-imbalance-title" number="3" title="Imbalanced classes" lead="A classifier can appear accurate by repeatedly predicting the common outcome. Check class frequencies before trusting accuracy alone." />
    <section className="model-selection__definition">
      <div><p className="model-selection__eyebrow">The central idea</p><h2><strong>Imbalanced classes</strong> occur when the target classes have very different frequencies.</h2><p>The more frequent outcome is the <strong>majority class</strong>; the less frequent outcome is the <strong>minority class</strong>.</p></div>
      <div className="model-selection__definition-mark model-selection__definition-mark--balance"><span>9 Normal</span><b>vs</b><span>1 Alert</span><small>one target, unequal frequencies</small></div>
    </section>
    <section className="model-selection__key-terms" aria-labelledby="ms-imbalance-terms-title">
      <div className="model-selection__section-heading"><p className="model-selection__eyebrow">Read the example</p><h2 id="ms-imbalance-terms-title">Key terms in a sensor-warning task</h2></div>
      <dl className="model-selection__term-list">
        <div><dt>Class</dt><dd>A possible target value: Normal or Alert.</dd></div>
        <div><dt>Majority class</dt><dd>The label with more training rows: Normal, 9 readings.</dd></div>
        <div><dt>Minority class</dt><dd>The less frequent label: Alert, 1 reading.</dd></div>
        <div><dt>Training data</dt><dd>Labeled examples used to teach the model; balancing methods shown here apply to this data.</dd></div>
      </dl>
      <div className="model-selection__count-bars" aria-label="Original training data has nine Normal readings and one Alert reading">
        <div><span>Normal · majority</span><span className="model-selection__bar"><i className="is-normal" style={{ width: '90%' }} /></span><b>9 rows</b></div>
        <div><span>Alert · minority</span><span className="model-selection__bar"><i className="is-alert" style={{ width: '10%' }} /></span><b>1 row</b></div>
      </div>
    </section>
    <section className="model-selection__why"><p className="model-selection__eyebrow">Why it matters</p><h2>“90% accurate” could still mean “missed every alert.”</h2><p>In this ten-reading example, a model that predicts Normal for every sensor reading gets 9 correct, or 90% accuracy. It never identifies the one Alert. This can be dangerous for rare-event detection, such as the course’s nuclear-meltdown warning example.</p><div className="model-selection__accuracy"><span>Always predict Normal</span><strong>9 / 10 correct = 90% accuracy</strong><b>0 / 1 Alert readings found</b></div></section>
    <section className="model-selection__interactive" aria-labelledby="ms-balance-demo-title">
      <div className="model-selection__section-heading"><p className="model-selection__eyebrow">Explore three training approaches</p><h2 id="ms-balance-demo-title">How can the training data be balanced?</h2><p>Choose a method to see what happens to the same 9 Normal and 1 Alert sensor records. The chart uses bar length for row count.</p></div>
      <div className="model-selection__method-tabs" role="group" aria-label="Training data balancing method">{BALANCE_METHODS.map((item) => <button key={item.id} type="button" aria-pressed={method === item.id} onClick={() => setMethod(item.id)}>{item.label}</button>)}</div>
      <div className="model-selection__balance-view" aria-live="polite">
        <div className="model-selection__balance-result"><div><span>Current view</span><h3>{view.title}</h3><p>{view.detail}</p></div><strong>{rowCount}<small>{isWeighted ? ' source rows' : ' training rows'}</small></strong></div>
        <div className="model-selection__count-bars model-selection__count-bars--current">
          <div><span>Normal · majority</span><span className="model-selection__bar"><i className="is-normal" style={{ width: `${view.normal / 18 * 100}%` }} /></span><b>{isWeighted ? '9 rows · weight 1×' : `${view.normal} rows`}</b></div>
          <div><span>Alert · minority</span><span className="model-selection__bar"><i className="is-alert" style={{ width: `${view.alert / 18 * 100}%` }} /></span><b>{isWeighted ? '1 row · weight 9×' : `${view.alert} rows`}</b></div>
        </div>
        <p className="model-selection__scale-note">{isWeighted ? 'Bars show weighted contribution on a shared 0–18 scale; labels retain the actual row counts.' : 'Bars show row counts on a shared 0–18 scale.'}</p>
      </div>
      <aside className="model-selection__caveat"><strong>Keep the roles clear:</strong> up-sampling duplicates minority rows; down-sampling randomly removes majority rows; weighting increases the minority class’s influence in supported methods such as random forests. Balancing the training set does not create new real Alert examples or fix imbalance in evaluation data.</aside>
    </section>
    <Summary><strong>Remember:</strong> imbalance can make overall accuracy hide a model’s failure on the minority class. Up-sampling, down-sampling, and weighting change how training treats the classes; know which labels are actually represented.</Summary>
  </article>
}
