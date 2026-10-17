import { useState } from 'react'
import './ClassificationWorkflow.css'

type WorkflowStep = 'features' | 'split' | 'train' | 'select'

const workflowSteps: { id: WorkflowStep; title: string; task: string; tools: string; output: string }[] = [
  { id: 'features', title: 'Feature engineering', task: 'Create useful predictor fields from information available when a prediction is made.', tools: 'One-hot encoding, scaling, date parts, bins, or a meaningful rule.', output: 'A documented feature table with the target kept separate.' },
  { id: 'split', title: 'Data splitting', task: 'Set aside records that will not teach or tune the model.', tools: 'A reproducible, task-appropriate split; stratify classes when useful.', output: 'Training, validation, and final test records with clear roles.' },
  { id: 'train', title: 'Model training', task: 'Fit candidate models using training records only.', tools: 'Start with a simple baseline; compare suitable classification methods.', output: 'Fitted candidate models and training diagnostics.' },
  { id: 'select', title: 'Selection & tuning', task: 'Choose settings using validation data, then make one final check on test data.', tools: 'Validation comparisons, error review, and a final held-out test evaluation.', output: 'A selected model and an honest estimate of performance on unseen records.' },
]

export function CLWorkflow() {
  const [active, setActive] = useState<WorkflowStep>('features')
  const selected = workflowSteps.find(step => step.id === active)!

  return <article className="classification-workflow" aria-labelledby="cl-workflow-title">
    <header className="cl-lesson-intro">
      <p className="cl-eyebrow">Chapter 08 · Intro to Classification · 8.5</p>
      <h1 id="cl-workflow-title">A fair path from data to a class prediction</h1>
      <p>Suppose a subscriber team wants to flag accounts that may churn next month. The workflow turns that question into a prediction while keeping the evaluation separate from the model’s learning.</p>
    </header>

    <section className="cl-definition" aria-labelledby="cl-workflow-definition">
      <div><p className="cl-eyebrow">The central idea</p><h2 id="cl-workflow-definition">A classification workflow prepares predictors, separates records, trains candidates, then checks how well they generalize.</h2>
        <p>The predicted outcome is the <strong>target (Y)</strong>. The information used to predict it is the set of <strong>features (X)</strong>. A useful workflow protects the question from information that would not be available at prediction time.</p></div>
      <div className="cl-definition-mark" aria-hidden="true"><span>Features · X</span><b>→</b><span>Churn class · Y</span></div>
    </section>

    <section className="cl-workflow-panel" aria-labelledby="cl-workflow-map-title">
      <div className="cl-section-heading"><p className="cl-eyebrow">The project sequence</p><h2 id="cl-workflow-map-title">Understand the project and data first. Then build and evaluate.</h2>
        <p>Project scoping, preliminary QA, and data profiling always come before modeling. Confirm the stakeholder question, the desired outcome, what each row represents, and whether the data is reliable enough to use.</p></div>
      <div className="cl-preflight"><span aria-hidden="true">✓</span><div><strong>Always first: scope → preliminary QA → data profiling</strong><small>Check the business question, variable types, table structure, data quality, and distributions.</small></div></div>
      <ol className="cl-workflow-steps" aria-label="Classification workflow steps">
        {workflowSteps.map((step, index) => <li key={step.id}><button type="button" aria-pressed={active === step.id} onClick={() => setActive(step.id)}><span className="cl-step-number">0{index + 1}</span><strong>{step.title}</strong><span className="cl-step-arrow" aria-hidden="true">{index < workflowSteps.length - 1 ? '→' : '✓'}</span></button></li>)}
      </ol>
      <div className="cl-step-detail" aria-live="polite"><div><span>Selected step</span><h3>{selected.title}</h3></div><p><strong>Task:</strong> {selected.task}</p><p><strong>Useful tools:</strong> {selected.tools}</p><p><strong>Expected output:</strong> {selected.output}</p></div>
      <p className="cl-loop-note"><strong>Keep it iterative:</strong> if validation shows a weak candidate, revisit the features or model choice. Use the final test set only after the choice is made.</p>
    </section>

    <section className="cl-summary"><p className="cl-eyebrow">Carry this forward</p><h2>Build the prediction around the question, and the evaluation around unseen data.</h2><p>Next, try a few feature transformations on a tiny CRM table. Each operation will leave the original fields visible so you can trace where a new feature came from.</p></section>
  </article>
}

type CRMRow = { id: number; status: 'Bronze' | 'Gold' | 'Silver'; income: number; age: number; signup: string; newsletter: 0 | 1; churn: 0 | 1 }
const crmRows: CRMRow[] = [
  { id: 1, status: 'Bronze', income: 30000, age: 29, signup: '2019-01-17', newsletter: 1, churn: 0 },
  { id: 2, status: 'Gold', income: 60000, age: 37, signup: '2017-03-18', newsletter: 1, churn: 1 },
  { id: 3, status: 'Bronze', income: 15000, age: 24, signup: '2020-10-01', newsletter: 0, churn: 0 },
  { id: 4, status: 'Silver', income: 75000, age: 41, signup: '2019-04-12', newsletter: 1, churn: 0 },
  { id: 5, status: 'Bronze', income: 40000, age: 36, signup: '2020-07-23', newsletter: 1, churn: 1 },
]

type TransformId = 'onehot' | 'scale' | 'log' | 'age' | 'year' | 'priority'
const transforms: { id: TransformId; title: string; note: string }[] = [
  { id: 'onehot', title: 'One-hot status', note: 'Turn the status category into three 0/1 fields. One row is active in exactly one column.' },
  { id: 'scale', title: 'Scale income', note: 'Min–max scaling uses the training rows’ minimum ($15,000) and maximum ($75,000). The same bounds must transform future rows.' },
  { id: 'log', title: 'Log income', note: 'The natural log compresses large income values. It can help with a strongly skewed range; inspect the distribution first.' },
  { id: 'age', title: 'Age group', note: 'Discretize age into 10-year groups. This is reversible only if the original age is retained; the bin alone loses detail.' },
  { id: 'year', title: 'Signup year', note: 'Extract the calendar year from the signup date, keeping a date component that may be easier to use.' },
  { id: 'priority', title: 'Boolean rule', note: 'Create a 1/0 indicator for “age under 40 AND receives the newsletter.” This is a chosen interaction, not proof of causation.' },
]

function featureValues(kind: TransformId, row: CRMRow) {
  if (kind === 'onehot') return [row.status === 'Gold' ? '1' : '0', row.status === 'Silver' ? '1' : '0', row.status === 'Bronze' ? '1' : '0']
  if (kind === 'scale') return [((row.income - 15000) / (75000 - 15000)).toFixed(3)]
  if (kind === 'log') return [Math.log(row.income).toFixed(2)]
  if (kind === 'age') return [`${Math.floor(row.age / 10) * 10}–${Math.floor(row.age / 10) * 10 + 9}`]
  if (kind === 'year') return [row.signup.slice(0, 4)]
  return [row.age < 40 && row.newsletter === 1 ? '1' : '0']
}

export function CLFeatureEngineering() {
  const [kind, setKind] = useState<TransformId>('onehot')
  const [showSource, setShowSource] = useState(true)
  const selected = transforms.find(item => item.id === kind)!
  const headings = kind === 'onehot' ? ['Gold', 'Silver', 'Bronze'] : [kind === 'scale' ? 'Scaled income' : kind === 'log' ? 'Log income' : kind === 'age' ? 'Age group' : kind === 'year' ? 'Signup year' : 'Priority flag']
  const isSource = (field: string) => kind === 'onehot' ? field === 'Status' : kind === 'scale' || kind === 'log' ? field === 'Income' : kind === 'age' ? field === 'Age' : kind === 'year' ? field === 'Signup date' : field === 'Age' || field === 'Newsletter'
  const first = crmRows[0]
  const calculation = kind === 'onehot' ? 'Bronze → (Gold 0, Silver 0, Bronze 1)' : kind === 'scale' ? '($30,000 − $15,000) ÷ ($75,000 − $15,000) = 0.250' : kind === 'log' ? `ln($30,000) = ${Math.log(30000).toFixed(2)}` : kind === 'age' ? `Age ${first.age} → 20–29` : kind === 'year' ? `${first.signup} → ${first.signup.slice(0, 4)}` : `Age ${first.age} < 40 AND newsletter ${first.newsletter} → 1`

  return <article className="classification-workflow" aria-labelledby="cl-features-title">
    <header className="cl-lesson-intro"><p className="cl-eyebrow">Chapter 08 · Intro to Classification · 8.6</p><h1 id="cl-features-title">Make useful fields from information you already have</h1><p>To predict churn, a model needs useful customer inputs in a form it can work with. Feature engineering creates or reshapes predictors while keeping the outcome we want to predict separate.</p></header>
    <section className="cl-definition" aria-labelledby="cl-features-definition"><div><p className="cl-eyebrow">The central idea</p><h2 id="cl-features-definition">Feature engineering enriches a dataset by creating additional independent variables from existing fields.</h2><p>A well-chosen feature can expose a useful pattern or make a field model-friendly. Keep the original data available so each transformation can be understood and reversed where possible.</p></div><div className="cl-definition-mark" aria-hidden="true"><span>Existing fields</span><b>→</b><span>New predictors</span></div></section>

    <section className="cl-transform-panel" aria-labelledby="cl-transform-title"><div className="cl-section-heading"><p className="cl-eyebrow">Small CRM example</p><h2 id="cl-transform-title">Choose a transformation and trace each output to its source.</h2><p>Five customer records show how the churn target (Y) stays separate from the possible predictors (X).</p></div>
      <div className="cl-transform-controls" role="group" aria-label="Choose a feature transformation">{transforms.map(item => <button key={item.id} type="button" aria-pressed={kind === item.id} onClick={() => setKind(item.id)}>{item.title}</button>)}</div>
      <label className="cl-source-toggle"><input type="checkbox" checked={showSource} onChange={event => setShowSource(event.target.checked)} /> Show original input fields alongside the result</label>
      <p className="cl-transform-calculation"><strong>Row 1 calculation:</strong> {calculation}</p>
      <div className="cl-table-wrap"><table className="cl-data-table"><caption>Customer records; churn remains a separate outcome label.</caption><thead><tr><th scope="col">ID</th>{showSource && <><th className={isSource('Status') ? 'cl-source-column' : ''} scope="col">Status</th><th className={isSource('Income') ? 'cl-source-column' : ''} scope="col">Income</th><th className={isSource('Age') ? 'cl-source-column' : ''} scope="col">Age</th><th className={isSource('Signup date') ? 'cl-source-column' : ''} scope="col">Signup date</th><th className={isSource('Newsletter') ? 'cl-source-column' : ''} scope="col">Newsletter</th></>}<th className="cl-target-column" scope="col">Churn · Y</th>{headings.map(title => <th key={title} className="cl-feature-column" scope="col">{title} · X</th>)}</tr></thead><tbody>{crmRows.map(row => <tr key={row.id}><th scope="row">{row.id}</th>{showSource && <><td className={isSource('Status') ? 'cl-source-column' : ''}>{row.status}</td><td className={isSource('Income') ? 'cl-source-column' : ''}>${row.income.toLocaleString('en-US')}</td><td className={isSource('Age') ? 'cl-source-column' : ''}>{row.age}</td><td className={isSource('Signup date') ? 'cl-source-column' : ''}>{row.signup}</td><td className={isSource('Newsletter') ? 'cl-source-column' : ''}>{row.newsletter}</td></>}<td className="cl-target-column">{row.churn}</td>{featureValues(kind, row).map((value, index) => <td key={`${row.id}-${index}`} className="cl-feature-column">{value}</td>)}</tr>)}</tbody></table></div>
      <div className="cl-transform-note"><span className="cl-note-icon" aria-hidden="true">↳</span><p><strong>{selected.title}:</strong> {selected.note}</p></div>
      <div className="cl-leakage"><strong>Keep the target out of X.</strong><p>If the model is predicting <em>churn next month</em>, do not feed the churn label into its features. Also exclude fields recorded only after that month’s outcome; they would reveal information unavailable when the prediction is made.</p><p><strong>Fit preprocessing on training data only.</strong> For scaling, imputation, or other learned transformations, calculate parameters from training records, then apply those same parameters to validation and test records. This prevents held-out information from influencing the model setup.</p></div>
    </section>
    <section className="cl-summary"><p className="cl-eyebrow">Carry this forward</p><h2>A feature is useful when it is available, traceable, and relevant to the prediction.</h2><p>Choose transformations for the question and model. More columns do not automatically mean better predictions.</p></section>
  </article>
}

type SplitRole = 'Training' | 'Validation' | 'Test'
const splitRoles: SplitRole[] = ['Training', 'Validation', 'Test']
const splitColors: Record<SplitRole, string> = { Training: '#7ead98', Validation: '#d0a241', Test: '#438476' }
const splitRecords = Array.from({ length: 20 }, (_, index) => ({ id: index + 1, churn: (index % 2) as 0 | 1, role: 'Training' as SplitRole, classIndex: 0 }))
let churnSeen = 0
let staySeen = 0
for (const record of splitRecords) {
  const classIndex = record.churn === 1 ? churnSeen++ : staySeen++
  record.classIndex = classIndex
  record.role = classIndex < 7 ? 'Training' : classIndex < 9 ? 'Validation' : 'Test'
}

function splitPieSlices() {
  const total = splitRecords.length
  let startAngle = -90
  return splitRoles.map(role => {
    const count = splitRecords.filter(record => record.role === role).length
    const fraction = count / total
    const endAngle = startAngle + fraction * 360
    const point = (angle: number) => {
      const radians = angle * Math.PI / 180
      return [100 + 82 * Math.cos(radians), 100 + 82 * Math.sin(radians)] as const
    }
    const [startX, startY] = point(startAngle)
    const [endX, endY] = point(endAngle)
    const largeArc = fraction > 0.5 ? 1 : 0
    const path = `M 100 100 L ${startX} ${startY} A 82 82 0 ${largeArc} 1 ${endX} ${endY} Z`
    const middle = (startAngle + endAngle) / 2 * Math.PI / 180
    const labelX = 100 + 55 * Math.cos(middle)
    const labelY = 100 + 55 * Math.sin(middle)
    startAngle = endAngle
    return { role, count, percent: fraction * 100, color: splitColors[role], path, labelX, labelY }
  })
}

export function CLDataSplitting() {
  const [focus, setFocus] = useState<SplitRole>('Training')
  const total = splitRecords.length
  const slices = splitPieSlices()
  const counts = (role: SplitRole) => splitRecords.filter(record => record.role === role).length
  const percent = (count: number) => `${Math.round(count / total * 100)}%`
  return <article className="classification-workflow" aria-labelledby="cl-splitting-title">
    <header className="cl-lesson-intro"><p className="cl-eyebrow">Chapter 08 · Intro to Classification · 8.7</p><h1 id="cl-splitting-title">Keep evaluation records out of model training</h1><p>A churn model should work on customers it has not learned from. Splitting records lets us measure that ability instead of reporting only how closely a model fits familiar examples.</p></header>
    <section className="cl-definition" aria-labelledby="cl-splitting-definition"><div><p className="cl-eyebrow">The central idea</p><h2 id="cl-splitting-definition">Data splitting partitions records into separate sets for training and testing a model.</h2><p>Training data teaches the model. Validation data helps compare choices. A final test set stays untouched until model selection is complete.</p></div><div className="cl-definition-mark" aria-hidden="true"><span>Learn</span><b>→</b><span>Check unseen</span></div></section>
    <section className="cl-split-panel" aria-labelledby="cl-split-map-title"><div className="cl-section-heading"><p className="cl-eyebrow">A deterministic, stratified example</p><h2 id="cl-split-map-title">Twenty past customer records, split while preserving both churn classes.</h2><p>Within each known outcome group, records are assigned in a fixed repeatable order: 7 to training, 2 to validation, and 1 to test. A real split should match the data’s time order, grouping, and intended use; it should not rely on row order by default.</p></div>
      <div className="cl-split-summary" aria-label="Split sizes">{splitRoles.map(role => <div key={role} className={`cl-split-count cl-split-count--${role.toLowerCase()}`}><span>{role}</span><strong>{counts(role)}</strong><small>{percent(counts(role))} of this example</small></div>)}</div>
      <div className="cl-split-chart" aria-label="Split proportions">
        <svg className="cl-split-pie" viewBox="0 0 200 200" role="img">
          <title>Training, validation, and test split proportions</title>
          <desc>Of {total} records, {slices.map(slice => `${slice.count} are ${slice.role.toLowerCase()} (${percent(slice.count)})`).join(', ')}.</desc>
          {slices.map(slice => <path key={slice.role} d={slice.path} fill={slice.color} className={focus === slice.role ? 'is-focused' : ''}><title>{slice.role}: {slice.count} of {total} records, {percent(slice.count)}</title></path>)}
          {slices.map(slice => <text key={slice.role} x={slice.labelX} y={slice.labelY} textAnchor="middle" dominantBaseline="middle" aria-hidden="true">{percent(slice.count)}</text>)}
        </svg>
        <ul className="cl-split-pie-legend" aria-label="Split chart legend">{slices.map(slice => <li key={slice.role}>
          <span className="cl-split-pie-swatch" style={{ backgroundColor: slice.color }} aria-hidden="true" />
          <span><strong>{slice.role}</strong><small>{slice.count} records · {percent(slice.count)}</small></span>
        </li>)}</ul>
      </div>
      <div className="cl-role-controls" role="group" aria-label="Highlight one data split">{(['Training', 'Validation', 'Test'] as const).map(role => <button key={role} type="button" aria-pressed={focus === role} onClick={() => setFocus(role)}>Highlight {role.toLowerCase()}</button>)}</div>
      <div className="cl-record-grid" aria-label="Twenty records grouped by churn label and assigned split">{splitRecords.map(record => <div key={record.id} className={`cl-record cl-record--${record.role.toLowerCase()} ${record.churn === 1 ? 'cl-record--churn' : ''} ${focus === record.role ? 'is-focused' : ''}`} title={`Record ${record.id}: churn ${record.churn}, ${record.role.toLowerCase()}`}><span>{record.id.toString().padStart(2, '0')}</span><b>{record.churn}</b><small>{record.role === 'Training' ? 'train' : record.role === 'Validation' ? 'valid' : 'test'}</small></div>)}</div>
      <div className="cl-class-legend"><span><i className="cl-dot cl-dot--zero" /> Churn = 0 · 10 records</span><span><i className="cl-dot cl-dot--one" /> Churn = 1 · 10 records</span><small>Each tile is one record. The color identifies the split; the printed digit is the observed churn label.</small></div>
      <div className="cl-split-rules"><div><strong>Train</strong><p>Fit model parameters and learned preprocessing here.</p></div><div><strong>Validate</strong><p>Compare candidates or tune settings. Do not treat validation as fresh training data when reporting final performance.</p></div><div><strong>Test</strong><p>Hold back until choices are finished, then estimate performance once on unseen records.</p></div></div>
      <p className="cl-split-caveat"><strong>Small example, not a recommendation:</strong> a common rule of thumb reserves roughly 70–80% for training and 20–30% for evaluation. This 70/20/10 split adds validation explicitly; actual proportions depend on the task and available data. If observations are time-dependent or grouped by person, split by time or group to avoid putting related information on both sides.</p>
    </section>
    <section className="cl-summary"><p className="cl-eyebrow">Carry this forward</p><h2>Let training teach, validation guide choices, and test provide the final check.</h2><p>Do not use test results to repeatedly tune a model. The more often they guide choices, the less independent the final check becomes.</p></section>
  </article>
}

type FitStyle = 'overfit' | 'wellfit' | 'underfit'
const fitDescriptions: Record<FitStyle, { title: string; description: string; interpretation: string }> = {
  overfit: { title: 'Overfit · boundary too flexible', description: 'The boundary bends around individual training examples, including their small quirks.', interpretation: 'The narrow bend captures the teal training exception near the middle, but puts the nearby hollow orange customer on the wrong side.' },
  wellfit: { title: 'Well fit · pattern with some flexibility', description: 'A smoother boundary follows the broad separation, leaving one unusual teal training point above it.', interpretation: 'It may leave a few training points on the other side to capture a pattern that generalizes.' },
  underfit: { title: 'Underfit · boundary too simple', description: 'A straight boundary ignores the bend in the class pattern.', interpretation: 'A model can be too simple to capture a useful relationship, even on familiar examples.' },
}

function FitDiagram({ style, showUnseen }: { style: FitStyle; showUnseen: boolean }) {
  const points = [[65,145,0],[105,151,0],[145,137,0],[185,151,0],[225,137,0],[265,50,0],[305,132,0],[345,145,0],[385,129,0],[435,143,0],[65,65,1],[105,81,1],[145,60,1],[185,88,1],[225,68,1],[265,80,1],[305,63,1],[345,92,1],[385,70,1],[435,84,1]] as const
  const unseen = [[83,138,0],[160,148,0],[286,150,0],[410,138,0],[83,84,1],[160,82,1],[266,92,1],[410,88,1]] as const
  const paths: Record<FitStyle, string> = {
    overfit: 'M48 100 C120 128 190 132 226 128 C244 126 245 34 265 34 C285 34 286 127 304 128 C360 126 410 118 457 100',
    wellfit: 'M48 100 C145 140 335 140 457 100',
    underfit: 'M48 51 L457 132',
  }
  return <svg className="cl-fit-svg" viewBox="0 0 500 205" role="img" aria-label={`${style} classification boundary schematic with training and unseen points`}>
    <path className="cl-axis" d="M48 25 V175 H462"/><path className="cl-grid" d="M48 65 H458 M48 105 H458 M48 145 H458 M148 25 V175 M248 25 V175 M348 25 V175"/>
    <text x="52" y="194">lower account tenure</text><text x="373" y="194">higher tenure →</text><text className="cl-axis-label" transform="translate(15 160) rotate(-90)">Monthly activity · higher at top</text>
    <path className="cl-boundary" d={paths[style]} />
    {points.map(([x,y,klass], index) => <circle key={`train-${index}`} cx={x} cy={y} r="5.2" className={klass === 0 ? 'cl-fit-point--stay' : 'cl-fit-point--churn'}><title>{klass === 0 ? 'Stay' : 'Churn'} training example</title></circle>)}
    {showUnseen && unseen.map(([x,y,klass], index) => <circle key={`unseen-${index}`} cx={x} cy={y} r="6.2" className={`cl-fit-unseen ${klass === 0 ? 'cl-fit-point--stay' : 'cl-fit-point--churn'}`}><title>{klass === 0 ? 'Stay' : 'Churn'} unseen example</title></circle>)}
    <text x="50" y="17">Schematic · training examples{showUnseen ? ' + unseen examples' : ''}</text>
  </svg>
}

const finalWorkflow = [
  { title: 'Fit', copy: 'Train candidates on the training set; keep the target out of the inputs.' },
  { title: 'Compare', copy: 'Use validation results and error patterns to choose model complexity and settings.' },
  { title: 'Freeze', copy: 'Select the candidate and finish decisions before looking at the final test result.' },
  { title: 'Check once', copy: 'Evaluate the selected model on the untouched test set; investigate if performance differs sharply.' },
]

export function CLOverfitting() {
  const [style, setStyle] = useState<FitStyle>('wellfit')
  const [projectStep, setProjectStep] = useState(0)
  const [showUnseen, setShowUnseen] = useState(true)
  const current = fitDescriptions[style]
  return <article className="classification-workflow" aria-labelledby="cl-overfit-title">
    <header className="cl-lesson-intro"><p className="cl-eyebrow">Chapter 08 · Intro to Classification · 8.8</p><h1 id="cl-overfit-title">A model should learn a pattern, not memorize examples</h1><p>A churn model can look perfect on familiar customers yet miss the pattern for new ones. The goal is useful performance on records that did not guide model training or tuning.</p></header>
    <section className="cl-definition" aria-labelledby="cl-overfit-definition"><div><p className="cl-eyebrow">The central idea</p><h2 id="cl-overfit-definition">Overfitting happens when a model predicts training data well but performs poorly on unseen data.</h2><p>Generalization is the ability to predict accurately for new cases. A good fit balances capturing the broad pattern with ignoring incidental quirks in the sample.</p></div><div className="cl-definition-mark" aria-hidden="true"><span>Memorized rows</span><b>≠</b><span>New customers</span></div></section>
    <section className="cl-fit-panel" aria-labelledby="cl-fit-title"><div className="cl-section-heading"><p className="cl-eyebrow">See model flexibility</p><h2 id="cl-fit-title">The boundary changes how much detail the model follows.</h2><p>Choose a boundary shape. Orange dots are customers who churned; teal dots stayed. Above the boundary, the model predicts churn; below it, stay. Filled dots are training cases; hollow dots are unseen cases. Watch the unusual teal point near the middle and the nearby hollow orange point.</p></div>
      <div className="cl-fit-controls" role="group" aria-label="Choose a model boundary example">{(['overfit', 'wellfit', 'underfit'] as const).map(id => <button key={id} type="button" aria-pressed={style === id} onClick={() => setStyle(id)}>{id === 'overfit' ? 'Too flexible' : id === 'wellfit' ? 'Balanced' : 'Too simple'}</button>)}</div>
      <label className="cl-source-toggle"><input type="checkbox" checked={showUnseen} onChange={event => setShowUnseen(event.target.checked)} /> Show unseen examples</label>
      <div className="cl-fit-visual"><FitDiagram style={style} showUnseen={showUnseen} /><aside><span className={`cl-fit-badge cl-fit-badge--${style}`}>{style === 'overfit' ? 'High variance' : style === 'underfit' ? 'High bias' : 'Balance'}</span><h3>{current.title}</h3><p>{current.description}</p><p><strong>Notice:</strong> {current.interpretation}</p><div className="cl-fit-legend"><span><i className="cl-dot cl-dot--zero" /> Stay · training</span><span><i className="cl-dot cl-dot--one" /> Churn · training</span>{showUnseen && <><span><i className="cl-dot cl-dot--zero cl-dot--hollow" /> Stay · unseen</span><span><i className="cl-dot cl-dot--one cl-dot--hollow" /> Churn · unseen</span></>}<span><i className="cl-line-dot" /> Model boundary</span></div></aside></div>
      <p className="cl-schematic-note"><strong>How to read this:</strong> overfit models have high variance and can shift sharply with training details; underfit models have high bias and miss structure. The middle sketch is a teaching illustration, not a fitted model or a performance claim.</p>
    </section>
    <section className="cl-project-check" aria-labelledby="cl-project-check-title"><div className="cl-section-heading"><p className="cl-eyebrow">Chapter 08 · project reference</p><h2 id="cl-project-check-title">Use held-out data to check generalization.</h2><p>Choose a step to see what to do, which evidence to use, and what to produce. This closes the chapter’s workflow; Chapter 09 moves on to classification model families.</p></div>
      <ol className="cl-project-steps">{finalWorkflow.map((step,index)=><li key={step.title}><button type="button" aria-pressed={projectStep===index} onClick={()=>setProjectStep(index)}><span>0{index+1}</span><strong>{step.title}</strong></button></li>)}</ol>
      <div className="cl-project-detail" aria-live="polite"><strong>{finalWorkflow[projectStep].title}</strong><p>{finalWorkflow[projectStep].copy}</p><span>Tools: {projectStep === 1 ? 'validation comparisons, class-wise error review, simple baselines' : projectStep === 3 ? 'one final test evaluation and a short record of the split' : 'reproducible data split and documented modeling choices'}</span><span>Output: {projectStep === 3 ? 'final held-out performance estimate' : 'a choice or artifact ready for the next workflow step'}</span></div>
    </section>
    <section className="cl-summary"><p className="cl-eyebrow">Keep this in mind</p><h2>Good training fit matters only when the pattern carries to new cases.</h2><p>Use training to fit, validation to choose, and test to make the final generalization check. Do not repeatedly adjust a model to improve its test result.</p></section>
  </article>
}
