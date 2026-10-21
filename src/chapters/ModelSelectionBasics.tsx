import { useState } from 'react'
import upsamplingDiagram from '../assets/model-selection/upsampling.svg'
import downsamplingDiagram from '../assets/model-selection/downsampling.svg'
import weightedSamplingDiagram from '../assets/model-selection/weighted-sampling.svg'
import './ModelSelectionBasics.css'

function LessonHeader({ number, title, lead, id }: { number: string; title: string; lead: string; id: string }) {
  return <header className="model-selection__header">
    <p className="model-selection__eyebrow">10.{number} · Model selection & tuning</p>
    <h1 id={id}>{title}</h1>
    <p>{lead}</p>
  </header>
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
    <LessonHeader id="ms-intro-title" number="1" title="Model selection and tuning" lead="Compare classification models for the same task, then adjust their settings." />
    <section className="model-selection__definition">
      <div><p className="model-selection__eyebrow">Two related decisions</p><h2><strong>Selection</strong> chooses the model that best fits the problem. <strong>Tuning</strong> adjusts a model’s settings to improve its predictive performance.</h2><p>Use validation data to compare candidates and settings; reserve untouched test data for the final check.</p></div>
      <div className="model-selection__definition-mark" aria-hidden="true"><span>Compare</span><b>→</b><span>Adjust</span><small>choose a model · improve its settings</small></div>
    </section>
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
  </article>
}

type ModelIconName = 'neighbors' | 'bayes' | 'tree' | 'forest' | 'logistic'

// Recreate the five model symbols and setting order from the course slide.
function HyperparameterModelIcon({ model }: { model: ModelIconName }) {
  return <svg className="model-selection__model-icon" viewBox="0 0 100 100" aria-hidden="true">
    <defs><linearGradient id={`ms-icon-${model}`} x1="0" y1="1" x2="1" y2="0"><stop stopColor="#36e5da"/><stop offset="1" stopColor="#eef79a"/></linearGradient></defs>
    <circle cx="50" cy="50" r="49" fill="#3e403f"/>
    <g fill="none" stroke={`url(#ms-icon-${model})`} strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round">
      {model === 'neighbors' && <><path d="M46 51 71 25 M46 51 52 77 M46 51 24 65 M46 51 30 24 M46 51 76 70" strokeDasharray="4 4"/><path d="M46 51 71 25"/><circle cx="46" cy="51" r="8"/><circle cx="71" cy="25" r="5"/><circle cx="52" cy="77" r="5"/><circle cx="24" cy="65" r="3" fill="#36e5da"/><circle cx="30" cy="24" r="3" fill="#b9efaa"/><circle cx="76" cy="70" r="3" fill="#b9efaa"/></>}
      {model === 'bayes' && <><path d="M50 30 25 68 M50 30 50 70 M50 30 75 68" strokeWidth="4"/><circle cx="50" cy="27" r="12" fill={`url(#ms-icon-${model})`}/><circle cx="25" cy="71" r="9"/><circle cx="50" cy="75" r="9"/><circle cx="75" cy="71" r="9"/></>}
      {model === 'tree' && <><path d="M50 31V41H25V48 M50 41H75V48 M25 59V67H15V73 M25 67H35V73 M75 59V67H65V73 M75 67H85V73"/><rect x="33" y="19" width="34" height="13"/><rect x="16" y="47" width="18" height="12"/><rect x="66" y="47" width="18" height="12"/>{[15,35,65,85].map(x => <rect key={x} x={x-4} y="73" width="8" height="7"/>)}</>}
      {model === 'forest' && <><path d="M28 68H16L24 53H19L28 37H23L38 16 52 37H47L56 53H51L59 68H48 M38 68V82 M62 68H83L76 53H81L72 37H77L63 16 50 35 M63 68V82"/><path d="M50 25 65 46H60L69 61H64L73 76H29L38 61H33L42 46H37Z M50 76V87"/></>}
      {model === 'logistic' && <><path d="M20 70H80 M52 20V82" strokeWidth="1.3" strokeDasharray="4 4"/><path d="M21 75C43 80 49 71 52 52S59 31 80 30" strokeWidth="5"/></>}
    </g>
  </svg>
}

const HYPERPARAMETER_MODELS: { model: ModelIconName; title: string; settings: [string, string][] }[] = [
  { model: 'neighbors', title: 'K-Nearest Neighbors', settings: [
    ['K', 'Number of neighbors that vote.'], ['Distance definition', 'How distance is measured.'], ['NN Algorithm', 'How nearest neighbors are searched.'],
  ] },
  { model: 'bayes', title: 'Naïve Bayes', settings: [
    ['Smoothing parameters', 'Adjust probability estimates for rare or unseen feature values.'],
  ] },
  { model: 'tree', title: 'Decision Trees', settings: [
    ['Criterion (entropy, gini)', 'How a split is scored.'], ['Tree depth', 'Maximum levels of splits.'], ['Leaf size', 'Minimum records in a leaf.'], ['Max Features', 'Features considered for a split.'], ['Min gain', 'Minimum improvement required for a split.'],
  ] },
  { model: 'forest', title: 'Random Forests', settings: [
    ['# Trees', 'Number of trees.'], ['# Samples', 'Records sampled for each tree.'], ['# Features', 'Features considered for a split.'], ['Re-Sampling', 'How training records are sampled.'],
  ] },
  { model: 'logistic', title: 'Logistic Regression', settings: [
    ['Intercept', 'Whether to fit a constant term.'], ['Penalty Term', 'Regularization applied to coefficients.'], ['Solver', 'Algorithm used to fit the model.'],
  ] },
]

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
    <LessonHeader id="ms-hyper-title" number="2" title="Hyperparameters" lead="Hyperparameters are settings chosen before fitting, such as the number of neighbors K or a tree’s maximum depth." />
    <section className="model-selection__definition">
      <div><p className="model-selection__eyebrow">Adjustable settings</p><h2><strong>Hyperparameters</strong> are inputs or settings you can control while training a model.</h2><p>They shape how a method learns or searches. They are not the same as the model’s learned parameters.</p></div>
      <div className="model-selection__definition-mark"><span>Settings</span><b>→</b><span>Training</span><small>try · compare · choose</small></div>
    </section>
    <section className="model-selection__key-terms" aria-labelledby="ms-hyper-terms-title">
      <div className="model-selection__section-heading"><h2 id="ms-hyper-terms-title">Settings by model</h2><p>Each method has its own choices. These are examples of settings you can tune.</p></div>
      <div className="model-selection__model-list">
        {HYPERPARAMETER_MODELS.map(({ model, title, settings }) => <article key={model}>
          <HyperparameterModelIcon model={model}/><h3>{title}</h3>
          <p className="model-selection__examples-label">Examples:</p>
          <ul>{settings.map(([name, meaning]) => <li key={name}><strong>{name}</strong><small>{meaning}</small></li>)}</ul>
        </article>)}
      </div>

    </section>
    <section className="model-selection__interactive model-selection__knn-example" aria-labelledby="ms-hyper-demo-title">
      <div className="model-selection__section-heading"><p className="model-selection__eyebrow">Interactive worked example · supplied labels</p><h2 id="ms-hyper-demo-title">How K and distance change the neighbors</h2><p>Predict Normal or Alert for the new reading at (3, 1). Start with K = 2, then switch distance to see which labeled readings vote.</p></div>
      <div className="model-selection__data-roles"><div><strong>Inputs · X</strong><span>Temperature rise and vibration.</span></div><div><strong>Labels · y</strong><span>Observed Normal or Alert outcome.</span></div><div><strong>Chosen setting</strong><span>K controls how many readings vote; it is not learned here.</span></div></div>
      <div className="model-selection__control-row">
        <fieldset className="model-selection__control"><legend>Number of neighbors, K</legend>{[1, 2, 3].map((value) => <button key={value} type="button" aria-pressed={neighbors === value} onClick={() => setNeighbors(value)}>{value}</button>)}<small>K controls how many nearby labeled examples vote.</small></fieldset>
        <fieldset className="model-selection__control"><legend>Distance definition</legend>{(['Euclidean', 'Manhattan'] as const).map((value) => <button key={value} type="button" aria-pressed={metric === value} onClick={() => setMetric(value)}>{value}</button>)}<small>{metric === 'Euclidean' ? 'Straight-line distance: √(Δtemperature² + Δvibration²).' : 'Grid distance: |Δtemperature| + |Δvibration|.'}</small></fieldset>
      </div>
      <div className="model-selection__knn-layout">
        <figure className="model-selection__plot">
          <figcaption>Labeled readings and the new input</figcaption>
          <svg viewBox="0 0 460 340" role="img" aria-label="Scatter plot of sensor examples by temperature rise and vibration. The new reading is at 3, 1.">
            <line x1="90" y1="280" x2="358" y2="280" className="model-selection__axis" /><line x1="90" y1="280" x2="90" y2="12" className="model-selection__axis" />
            {[0, 1, 2, 3, 4].map((tick) => <g key={tick}>
              <line x1={90 + tick * 64} y1="280" x2={90 + tick * 64} y2="285" className="model-selection__tick"/>
              <text x={90 + tick * 64} y="303" textAnchor="middle">{tick}</text>
              <line x1="85" y1={280 - tick * 64} x2="90" y2={280 - tick * 64} className="model-selection__tick"/>
              <text x="73" y={284 - tick * 64} textAnchor="middle">{tick}</text>
            </g>)}
            <text x="218" y="329" textAnchor="middle">Temperature rise · scaled units</text>
            <text transform="translate(24 152) rotate(-90)" textAnchor="middle">Vibration · scaled units</text>
            {nearest.map((point) => <polyline key={`guide-${point.id}`} points={metric === 'Manhattan' ? `282,216 ${90 + point.x * 64},216 ${90 + point.x * 64},${280 - point.y * 64}` : `282,216 ${90 + point.x * 64},${280 - point.y * 64}`} fill="none" className="model-selection__distance-guide" />)}
            {SENSOR_POINTS.map((point) => <g key={point.id} className={`${point.label === 'Alert' ? 'is-alert' : 'is-normal'} ${usedIds.has(point.id) ? 'is-nearest' : ''}`}>
              <circle cx={90 + point.x * 64} cy={280 - point.y * 64} r={usedIds.has(point.id) ? 8 : 6}/>
              <text x={90 + point.x * 64 + (point.id === 'E' || point.id === 'B' ? -13 : 13)} y={280 - point.y * 64 + 4} textAnchor={point.id === 'E' || point.id === 'B' ? 'end' : 'start'}>{point.id} · {point.label}</text>
            </g>)}
            <path d="M 282 208 L 290 216 L 282 224 L 274 216 Z" className="model-selection__new-point"/>
            <text x="296" y="220" className="model-selection__new-label">New · (3, 1)</text>
          </svg>
          <div className="model-selection__legend"><span><i className="is-normal"/>Normal label</span><span><i className="is-alert"/>Alert label</span><span><i className="is-selected"/>Included in K</span></div>
        </figure>
        <div className="model-selection__calculation" aria-live="polite">
          <h3>Trace the nearest examples</h3><p className="model-selection__calculation-intro">From new point (3, 1), example B at (2, 1) has {metric === 'Euclidean' ? '√((3−2)² + (1−1)²) = 1' : '|3−2| + |1−1| = 1'} distance unit.</p>
          <ol>{nearest.map((point) => <li key={point.id}><span className={point.label === 'Alert' ? 'is-alert' : 'is-normal'}>{point.id} · {point.label}</span><b>{formatDistance(point.distance, metric)} {point.distance === 1 ? 'unit' : 'units'}</b></li>)}</ol>
          <div className="model-selection__vote"><span>Visible vote</span><strong>{alerts} Alert + {normals} Normal</strong><b>Example prediction: {prediction}</b></div>
          <p className="model-selection__note">Illustrative readings; no model is fitted. Equal distances use ID order (C before D at Manhattan distance 2). Tied votes choose Normal in this example.</p>
        </div>
      </div>
    </section>
  </article>
}

type BalanceMethod = 'up' | 'down' | 'weight'

const BALANCE_METHODS = [
  {
    id: 'up', label: 'Up-sampling', image: upsamplingDiagram,
    definition: 'Copy minority-class rows to balance the training data.',
    result: 'After duplicating minority rows',
    alt: 'Two tables joined by yellow arrows. Each yellow minority row on the left is copied into several rows on the right; green rows identify the majority class.',
  },
  {
    id: 'down', label: 'Down-sampling', image: downsamplingDiagram,
    definition: 'Randomly remove majority-class rows to leave a smaller, balanced training set.',
    result: 'After removing majority rows',
    alt: 'A tall training table with crosses beside removed green majority rows. Arrows carry the retained yellow minority rows and selected green majority rows into a smaller balanced table.',
  },
  {
    id: 'weight', label: 'Weighting', image: weightedSamplingDiagram,
    definition: 'When sampling training rows, give minority-class rows a higher chance of being picked—for example, in a random forest.',
    result: 'Sampled with minority rows more likely',
    alt: 'A training table and a sampled table connected by green and yellow arrows. Repeated yellow arrows show minority observations being selected more often during sampling.',
  },
] satisfies { id: BalanceMethod; label: string; image: string; definition: string; result: string; alt: string }[]

export function MSImbalancedClasses() {
  const [method, setMethod] = useState<BalanceMethod>('up')
  const selected = BALANCE_METHODS.find(item => item.id === method)!
  return <article className="model-selection" aria-labelledby="ms-imbalance-title">
    <LessonHeader id="ms-imbalance-title" number="3" title="Imbalanced classes" lead="Classes are imbalanced when their outcomes occur at very different frequencies in the training data." />
    <section className="model-selection__class-key" aria-labelledby="ms-class-key-title">
      <h2 id="ms-class-key-title">Majority and minority classes</h2>
      <div className="model-selection__class-pair">
        <div><span className="model-selection__class-swatch is-majority" aria-hidden="true"/><div><h3>Majority class</h3><p>The outcome that occurs more often.</p></div></div>
        <div><span className="model-selection__class-swatch is-minority" aria-hidden="true"/><div><h3>Minority class</h3><p>The outcome that occurs less often.</p></div></div>
      </div>
      <p className="model-selection__rare-event">A model can look accurate by always predicting the majority class, while missing the minority cases you need to detect.</p>
    </section>
    <section className="model-selection__interactive model-selection__balance-example" aria-labelledby="ms-balance-demo-title">
      <div className="model-selection__section-heading"><h2 id="ms-balance-demo-title">Balancing the training data</h2></div>
      <div className="model-selection__method-tabs" role="group" aria-label="Training data balancing method">
        {BALANCE_METHODS.map(item => <button key={item.id} type="button" aria-pressed={method === item.id} aria-controls="ms-balance-view" onClick={() => setMethod(item.id)}>{item.label}</button>)}
      </div>
      <div className="model-selection__balance-legend" aria-label="Row colors">
        <span><i className="is-majority" aria-hidden="true"/>Green rows · Majority class</span>
        <span><i className="is-minority" aria-hidden="true"/>Yellow rows · Minority class</span>
      </div>
      <div id="ms-balance-view" className="model-selection__source-balance" key={method}>
        <figure className="model-selection__balance-figure">
          <div className="model-selection__table-labels"><span>Training data</span><span>{selected.result}</span></div>
          <img src={selected.image} width="710" height="680" alt={selected.alt}/>
        </figure>
        <div className="model-selection__balance-explanation" aria-live="polite">
          <h3>{selected.label}</h3><p>{selected.definition}</p>

        </div>
      </div>
    </section>
  </article>
}
