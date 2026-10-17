import { useState } from 'react'
import type { ReactNode } from 'react'
import './ClassificationBasics.css'
import { LearningExamples81 } from './LearningExamples81'

const SESSION_ROWS = [
  { id: 'S-104', browser: 'Chrome', time: 6, pages: 3, purchase: 'Yes', encoded: 1 },
  { id: 'S-105', browser: 'Safari', time: 2, pages: 1, purchase: 'No', encoded: 0 },
  { id: 'S-106', browser: 'Chrome', time: 8, pages: 5, purchase: 'Yes', encoded: 1 },
]

function LessonHeader({ id, number, title, lead }: { id: string; number: string; title: string; lead: string }) {
  return <header className="classification-basics__header">
    <p className="classification-basics__eyebrow">Chapter 08 · Lesson {number}</p>
    <h1 id={id}>{title}</h1>
    <p>{lead}</p>
  </header>
}

function Summary({ children }: { children: ReactNode }) {
  return <aside className="classification-basics__summary"><span aria-hidden="true">✓</span><p>{children}</p></aside>
}

function DataTable({ showPurchase = true }: { showPurchase?: boolean }) {
  return <div className="classification-basics__table-wrap"><table className="classification-basics__table">
    <caption>Small example: each row is one website session</caption>
    <thead><tr><th scope="col">Session</th><th scope="col">Browser</th><th scope="col">Time · min</th><th scope="col">Pages</th>{showPurchase && <th scope="col" className="is-target">Purchase · label</th>}</tr></thead>
    <tbody>{SESSION_ROWS.map((row) => <tr key={row.id}><th scope="row">{row.id}</th><td>{row.browser}</td><td>{row.time}</td><td>{row.pages}</td>{showPurchase && <td className="is-target"><span className={`classification-basics__pill ${row.purchase === 'Yes' ? 'is-yes' : 'is-no'}`}>{row.purchase} · {row.encoded}</span></td>}</tr>)}</tbody>
  </table></div>
}

export function CLSupervisedUnsupervised() {
  return <article className="classification-basics" aria-labelledby="cl-supervised-title">
    <LessonHeader id="cl-supervised-title" number="1" title="Supervised vs. unsupervised learning" lead="Two kinds of machine learning look for patterns in data. The key difference is whether examples include an observed answer." />
    <section className="classification-basics__definition">
      <div><p className="classification-basics__eyebrow">The central idea</p><h2><strong>Supervised learning</strong> uses examples with a known label to predict that label. <strong>Unsupervised learning</strong> looks for useful structure when no label is supplied.</h2><p>A label is an observed outcome we want to predict, such as whether a session ended in a purchase.</p></div>
      <div className="classification-basics__learning-mark" aria-hidden="true"><span><b>Labeled</b> → Predict</span><span><b>Unlabeled</b> → Explore</span></div>
    </section>
    <section className="classification-basics__why"><p className="classification-basics__eyebrow">Why this distinction matters</p><h2>The question you ask determines what the method can learn.</h2><p>If a shop has past sessions and knows which ones purchased, it can learn to predict purchase for a new session. If purchase outcomes are unavailable, it can still explore how sessions group by browsing behavior, but it cannot learn a purchase label from those records.</p></section>
    <LearningExamples81 />
    <Summary><strong>Remember:</strong> supervised learning predicts an observed label; unsupervised learning describes structure without that label. Both search for patterns, but they answer different questions.</Summary>
  </article>
}

export function CLClassificationRegression() {
  const [target, setTarget] = useState<'class' | 'number'>('class')
  const classification = target === 'class'
  return <article className="classification-basics" aria-labelledby="cl-regression-title">
    <LessonHeader id="cl-regression-title" number="2" title="Classification vs. regression" lead="Once a problem has a known target, the target’s type helps determine which supervised learning task fits." />
    <section className="classification-basics__definition">
      <div><p className="classification-basics__eyebrow">The central idea</p><h2><strong>Classification</strong> predicts a category. <strong>Regression</strong> predicts a numerical value.</h2><p>The model’s target is the value we want to predict. Identify it before choosing a technique.</p></div>
      <div className="classification-basics__definition-mark classification-basics__definition-mark--target" aria-hidden="true"><span>target</span><b>→</b><span>{classification ? 'class' : 'number'}</span><small>supervised prediction</small></div>
    </section>
    <section className="classification-basics__target-types" aria-labelledby="cl-target-types-title">
      <div className="classification-basics__section-heading"><p className="classification-basics__eyebrow">Look at the answer being predicted</p><h2 id="cl-target-types-title">A category comes from a set of choices; a numerical target is an amount to estimate.</h2></div>
      <div className="classification-basics__type-comparison">
        <article className="classification-basics__type-card is-class">
          <span className="classification-basics__type-label">Classification · choose a category</span>
          <h3>Which label fits?</h3>
          <div className="classification-basics__type-example"><span>Spam filter</span><strong>Spam <i>or</i> not spam</strong></div>
          <div className="classification-basics__type-example"><span>Digit recognition</span><strong>One label from 0–9</strong></div>
        </article>
        <article className="classification-basics__type-card is-number">
          <span className="classification-basics__type-label">Regression · estimate a quantity</span>
          <h3>How much?</h3>
          <div className="classification-basics__type-example"><span>Delivery estimate</span><strong>42 minutes</strong></div>
          <div className="classification-basics__type-example"><span>Sale price</span><strong>$84</strong></div>
        </article>
      </div>
      <aside className="classification-basics__confusions" aria-label="Common target-type confusions">
        <strong>Check the meaning, not just the digits:</strong>
        <ul>
          <li>Purchase coded as <b>0 / 1</b> is still a Yes / No category.</li>
          <li>Ordered bands such as <b>budget / mid-range / premium</b> are categories.</li>
          <li>A count such as <b>units sold</b> is a numerical quantity to predict.</li>
        </ul>
        <p>A classifier can report an <b>80% chance of cancellation</b> and still be doing classification: its target is the category, Cancel or Stay.</p>
      </aside>
    </section>
    <section className="classification-basics__why"><p className="classification-basics__eyebrow">Why it matters</p><h2>A useful answer matches the decision someone needs to make.</h2><p>A support team may need to know which subscribers are likely to cancel so it can review accounts. A finance team may need an estimate of next quarter’s revenue. One asks for a category; the other asks for an amount.</p></section>
    <section className="classification-basics__interactive" aria-labelledby="cl-regression-interaction-title">
      <div className="classification-basics__section-heading"><p className="classification-basics__eyebrow">Change the target</p><h2 id="cl-regression-interaction-title">The same subscriber can lead to two different questions</h2><p>Keep the subscriber’s plan, tenure, and recent usage fixed. Switch only the target to see how the prediction and its purpose change.</p></div>
      <div className="classification-basics__toggle" role="group" aria-label="Choose prediction target type">
        <button type="button" aria-pressed={classification} onClick={() => setTarget('class')}>Cancellation · class</button>
        <button type="button" aria-pressed={!classification} onClick={() => setTarget('number')}>Quarterly revenue · amount</button>
      </div>
      <div className="classification-basics__target-scene">
        <div className="classification-basics__subscriber"><span className="classification-basics__avatar" aria-hidden="true">S</span><div><strong>Subscriber 24</strong><span>Features: plan, tenure, recent usage</span></div></div>
        <span className="classification-basics__arrow" aria-hidden="true">→</span>
        <div className={`classification-basics__target-answer ${classification ? 'is-category' : 'is-numeric'}`} aria-live="polite"><span>Example prediction</span><strong>{classification ? 'Cancel: Yes / No' : 'Revenue: $4,800'}</strong><small>{classification ? 'category · classification' : 'dollar amount · regression'}</small></div>
      </div>
      <p className="classification-basics__selected-purpose" aria-live="polite"><strong>Question:</strong> {classification ? 'Will this subscriber cancel next month? The team can flag accounts predicted to cancel for follow-up.' : 'How much revenue will this subscriber generate next quarter? The finance team can use the amount in its forecast.'}</p>
    </section>
    <Summary><strong>Remember:</strong> predict a class such as churn / stay with classification; predict a quantity such as revenue or units sold with regression.</Summary>
  </article>
}

const RECAPS = [
  { id: 'table', label: 'Rows & columns', title: 'A table has records and variables', detail: 'Each row is an individual record or observation. Each column is a variable describing those records.', visual: 'table' },
  { id: 'types', label: 'Variable types', title: 'Variables can be categorical or numerical', detail: 'Browser is categorical (Chrome, Safari). Time and page views are numerical. A 1 / 0 purchase field can still represent Yes / No categories.', visual: 'types' },
  { id: 'quality', label: 'QA first', title: 'Check data before trusting a pattern', detail: 'Quality assurance and profiling help reveal missing, inconsistent, or misunderstood values before model building.', visual: 'quality' },
  { id: 'conditioning', label: 'Conditioning', title: 'Compare cases in context', detail: 'Conditioning on variables means comparing or filtering cases by relevant values—for example, purchase rates by browser or by a usage range.', visual: 'conditioning' },
  { id: 'dimensions', label: 'Beyond a plot', title: 'ML extends visual analysis', detail: 'Charts help people see a few dimensions at once. Learning methods can combine more variables than a person can easily inspect visually.', visual: 'dimensions' },
] as const
type RecapId = typeof RECAPS[number]['id']

function RecapVisual({ id }: { id: RecapId }) {
  if (id === 'table') return <DataTable />
  if (id === 'types') return <div className="classification-basics__type-visual"><div><span className="classification-basics__eyebrow">Categorical</span><strong>Browser</strong><span className="classification-basics__chips"><i>Chrome</i><i>Safari</i></span></div><div><span className="classification-basics__eyebrow">Numerical</span><strong>Time · minutes</strong><span className="classification-basics__number-line"><i style={{ width: '25%' }} /><i style={{ width: '55%' }} /><i style={{ width: '78%' }} /></span></div><div><span className="classification-basics__eyebrow">Still categorical</span><strong>Purchase</strong><span className="classification-basics__chips"><i>1 = Yes</i><i>0 = No</i></span></div></div>
  if (id === 'quality') return <div className="classification-basics__qa-visual"><div><b>Browser</b><span>Chrome</span><span>Safari</span><span className="is-flagged">safari&nbsp; <em>check case consistency</em></span></div><div><b>Purchase</b><span>Yes</span><span>No</span><span className="is-flagged">blank&nbsp; <em>find out why it is missing</em></span></div></div>
  if (id === 'conditioning') {
    const chromeRows = SESSION_ROWS.filter((row) => row.browser === 'Chrome')
    const chromePurchases = chromeRows.filter((row) => row.purchase === 'Yes').length
    return <div className="classification-basics__condition-visual"><div><span>All sessions</span><strong>{SESSION_ROWS.length} records</strong></div><b aria-hidden="true">→</b><div className="is-selected"><span>Browser = Chrome</span><strong>{chromeRows.length} records</strong></div><b aria-hidden="true">→</b><div><span>Purchases among them</span><strong>{chromePurchases} of {chromeRows.length}</strong></div></div>
  }
  return <div className="classification-basics__dimensions-visual" aria-label="Adding variables expands the number of dimensions a model can consider"><div className="dimension-plot"><i /><i /><i /><i /><span>2 variables<br />can be plotted</span></div><b aria-hidden="true">+</b><div className="dimension-stack"><i /><i /><i /><i /><i /><i /><span>more variables<br />to combine</span></div><p>Visual checks remain useful; ML can combine patterns across many variables.</p></div>
}

export function CLKeyConceptsRecap() {
  const [selected, setSelected] = useState<RecapId>('table')
  const active = RECAPS.find((item) => item.id === selected)!
  return <article className="classification-basics" aria-labelledby="cl-recap-title">
    <LessonHeader id="cl-recap-title" number="3" title="A recap of key concepts" lead="Classification builds on the data skills from Part 1: understand what each row and column means, check quality, and compare cases in context." />
    <section className="classification-basics__definition">
      <div><p className="classification-basics__eyebrow">The central idea</p><h2>Reliable predictions start with a clear picture of the data.</h2><p>Records, variables, their types, and their quality shape what a model can learn and what its predictions mean.</p></div>
      <div className="classification-basics__definition-mark classification-basics__definition-mark--check" aria-hidden="true"><span>data</span><b>→</b><span>context</span><small>inspect before predicting</small></div>
    </section>
    <section className="classification-basics__why"><p className="classification-basics__eyebrow">Why revisit the foundations?</p><h2>A model can only make sense of the information it receives.</h2><p>If “1” means purchase in one table and an unknown status in another, the same pattern could be interpreted incorrectly. Profiling clarifies values before we rely on them.</p></section>
    <section className="classification-basics__interactive" aria-labelledby="cl-recap-interaction-title">
      <div className="classification-basics__section-heading"><p className="classification-basics__eyebrow">Explore the foundations</p><h2 id="cl-recap-interaction-title">Choose a concept to see it in the session data</h2><p>Each selection changes the view and highlights one practical idea.</p></div>
      <div className="classification-basics__recap-layout">
        <div className="classification-basics__recap-tabs" role="group" aria-label="Key concepts">
          {RECAPS.map((item, index) => <button key={item.id} type="button" aria-pressed={selected === item.id} onClick={() => setSelected(item.id)}><span>{String(index + 1).padStart(2, '0')}</span>{item.label}</button>)}
        </div>
        <div className="classification-basics__recap-detail" aria-live="polite"><div className="classification-basics__recap-copy"><span className="classification-basics__eyebrow">{active.label}</span><h3>{active.title}</h3><p>{active.detail}</p></div><RecapVisual id={selected} /></div>
      </div>
    </section>
    <Summary><strong>Remember:</strong> know what a row represents, distinguish categorical from numerical variables, check quality, and use profiling to understand relationships before modeling.</Summary>
  </article>
}

const FEATURE_OPTIONS = [
  { id: 'plan', label: 'Plan', value: 'Gold' },
  { id: 'tenure', label: 'Tenure', value: '18 months' },
  { id: 'usage', label: 'Recent usage', value: 'Low' },
  { id: 'newsletter', label: 'Newsletter', value: 'No' },
] as const
type FeatureId = typeof FEATURE_OPTIONS[number]['id']

export function CLClassification101() {
  const [features, setFeatures] = useState<FeatureId[]>(FEATURE_OPTIONS.map((item) => item.id))
  const toggleFeature = (id: FeatureId) => setFeatures((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  return <article className="classification-basics" aria-labelledby="cl-101-title">
    <LessonHeader id="cl-101-title" number="4" title="Classification 101" lead="Classification predicts a categorical target using information from other variables. Here is the basic structure with a familiar business question." />
    <section className="classification-basics__definition">
      <div><p className="classification-basics__eyebrow">The central idea</p><h2>A classification model uses <strong>features</strong> (X) to predict a categorical <strong>target</strong> (Y).</h2><p>The target is also called the dependent variable, output, or label. Features are also called predictors, independent variables, or explanatory variables.</p></div>
      <div className="classification-basics__definition-mark" aria-hidden="true"><span>X</span><b>→</b><span>Y</span><small>features → class</small></div>
    </section>
    <section className="classification-basics__key-terms" aria-labelledby="cl-101-key-terms-title">
      <div className="classification-basics__key-terms-heading">
        <p className="classification-basics__eyebrow">Keep this guide visible</p>
        <h2 id="cl-101-key-terms-title">Key terms: read the data and the notation</h2>
        <p>Each row below describes one past customer. The two feature columns hold available input information; the final column holds the recorded churn outcome.</p>
      </div>
      <dl className="classification-basics__term-list">
        <div><dt>Observation / record</dt><dd>One customer in the data, usually one table row.</dd></div>
        <div><dt>Feature</dt><dd>An input column describing a customer, such as plan or tenure.</dd></div>
        <div><dt>Target</dt><dd>The variable the model is asked to predict: here, churn status.</dd></div>
        <div><dt>Label</dt><dd>The observed target value attached to a record: for example, Churn.</dd></div>
      </dl>
      <div className="classification-basics__key-terms-example">
        <div className="classification-basics__mini-table-wrap">
          <table className="classification-basics__mini-table">
            <caption>Past customers · known target labels</caption>
            <thead>
              <tr><th scope="col" rowSpan={2}>Record</th><th scope="colgroup" colSpan={2} className="is-feature">X · input features</th><th scope="col" rowSpan={2} className="is-label">y · observed label</th></tr>
              <tr><th scope="col" className="is-feature">Tenure · months</th><th scope="col" className="is-feature">Sessions last month</th></tr>
            </thead>
            <tbody>
              <tr><th scope="row">Customer 01</th><td>6</td><td>2</td><td className="is-label"><span className="classification-basics__class-pill is-stay">Stay</span></td></tr>
              <tr><th scope="row">Customer 02</th><td>18</td><td>1</td><td className="is-label"><span className="classification-basics__class-pill is-churn">Churn</span></td></tr>
              <tr><th scope="row">Customer 03</th><td>3</td><td>4</td><td className="is-label"><span className="classification-basics__class-pill is-churn">Churn</span></td></tr>
            </tbody>
          </table>
          <p className="classification-basics__table-annotation"><strong>Record ID identifies the row;</strong> it is not used as a feature here.</p>
        </div>
        <figure className="classification-basics__feature-plot">
          <figcaption>Two feature columns can make the chart axes</figcaption>
          <svg viewBox="0 0 340 230" role="img" aria-labelledby="cl-101-plot-title cl-101-plot-desc">
            <title id="cl-101-plot-title">Customer sessions plotted against tenure</title>
            <desc id="cl-101-plot-desc">Horizontal axis is tenure in months, vertical axis is sessions last month. Green dots are stay records and gold dots are churn records. Both axes show features; color shows the observed target class.</desc>
            <line x1="54" y1="24" x2="54" y2="178" className="plot-axis" />
            <line x1="54" y1="178" x2="313" y2="178" className="plot-axis" />
            <line x1="54" y1="126" x2="313" y2="126" className="plot-grid" />
            <line x1="54" y1="74" x2="313" y2="74" className="plot-grid" />
            <text x="45" y="182" textAnchor="end">0</text><text x="45" y="130" textAnchor="end">2</text><text x="45" y="78" textAnchor="end">4</text><text x="45" y="28" textAnchor="end">6</text>
            <text x="54" y="195" textAnchor="middle">0</text><text x="140" y="195" textAnchor="middle">6</text><text x="227" y="195" textAnchor="middle">12</text><text x="313" y="195" textAnchor="middle">18</text>
            <text x="183" y="216" textAnchor="middle" className="axis-title">Feature: tenure · months</text>
            <text x="14" y="103" textAnchor="middle" className="axis-title" transform="rotate(-90 14 103)">Feature: sessions last month</text>
            <circle cx="140" cy="126" r="7" className="plot-stay" /><circle cx="313" cy="152" r="7" className="plot-churn" /><circle cx="97" cy="74" r="7" className="plot-churn" />
          </svg>
          <div className="classification-basics__plot-legend"><span><i className="is-stay" />Stay · class</span><span><i className="is-churn" />Churn · class</span></div>
        </figure>
      </div>
      <div className="classification-basics__notation">
        <p><strong>X</strong> means the feature table; <strong>xᵢ</strong> is one customer’s feature row. <strong>y</strong> is the observed target values; <strong>yᵢ</strong> is one known label. The course may use uppercase <strong>Y</strong> for the same target.</p>
        <p><strong>Observed y:</strong> the recorded answer. <strong>Prediction ŷ:</strong> the model’s estimate. <strong>X and y describe data roles, not chart directions.</strong> Both axes here are features; color shows the class.</p>
      </div>
      <div className="classification-basics__secondary-terms" aria-label="Related terms">
        <span><strong>Class</strong> · a possible category, like stay or churn</span>
        <span><strong>Model</strong> · learned from feature values and known labels</span>
        <span><strong>Prediction</strong> · the model’s estimated class for a case</span>
      </div>
      <p className="classification-basics__unknown-label"><strong>For a new customer, the label is not known yet.</strong> The model can use the available features to estimate a class; that estimate is a prediction, not an observed label.</p>
    </section>
    <section className="classification-basics__why"><p className="classification-basics__eyebrow">Why use it?</p><h2>Past outcomes can help organize the next decision.</h2><p>A subscriber team could use past customer records with known churn outcomes to estimate whether a new customer may leave next month. That estimate can guide who to review. It does not establish why a person will leave or guarantee the outcome.</p></section>
    <section className="classification-basics__interactive" aria-labelledby="cl-101-interaction-title">
      <div className="classification-basics__section-heading"><p className="classification-basics__eyebrow">Follow one prediction setup</p><h2 id="cl-101-interaction-title">Churn is the target; customer details are features</h2><p>Turn features on or off to change which customer details appear. The controls illustrate model inputs; they do not change or calculate the target.</p></div>
      <div className="classification-basics__churn-example">
        <div className="classification-basics__records">
          <h3>Past records · known labels</h3>
          <div className="classification-basics__record-row"><span>Customer 01 · Bronze · 6 mo</span><b className="is-stay">Stayed</b></div>
          <div className="classification-basics__record-row"><span>Customer 02 · Gold · 18 mo</span><b className="is-churn">Churned</b></div>
          <div className="classification-basics__record-row"><span>Customer 03 · Silver · 3 mo</span><b className="is-churn">Churned</b></div>
        </div>
        <div className="classification-basics__new-case">
          <h3>New customer · outcome not known</h3>
          <div className="classification-basics__feature-switches" role="group" aria-label="Choose customer features to show">
            {FEATURE_OPTIONS.map((feature) => <button key={feature.id} type="button" aria-pressed={features.includes(feature.id)} onClick={() => toggleFeature(feature.id)}><span aria-hidden="true">{features.includes(feature.id) ? '✓' : '+'}</span>{feature.label}</button>)}
          </div>
          <div className="classification-basics__feature-values" aria-live="polite">{features.length ? FEATURE_OPTIONS.filter((feature) => features.includes(feature.id)).map((feature) => <span key={feature.id}><b>{feature.label}</b>{feature.value}</span>) : <span className="is-empty">No feature values selected</span>}</div>
          <div className="classification-basics__prediction-flow"><span>Selected X values</span><b aria-hidden="true">→</b><strong>Classification model</strong><b aria-hidden="true">→</b><span className="is-target">Target Y: churn / stay</span></div>
        </div>
      </div>
      <p className="classification-basics__note"><strong>Important:</strong> a real model would learn patterns from many prepared, labeled examples and would need evaluation. The rows and flow here explain the setup only.</p>
    </section>
    <Summary><strong>Remember:</strong> identify the categorical target first, then identify the feature variables that may help predict it. Training examples need known target values; a new case can have features before its outcome is known.</Summary>
  </article>
}
