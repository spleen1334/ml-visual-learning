import { useState } from 'react'
import './ChapterSeven.css'

const ROADMAP = [
  {
    id: 'foundations',
    number: '08',
    title: 'Classification foundations',
    detail: 'First define the label, distinguish categories from numerical predictions, and prepare a fair workflow with useful features and separate training and test data.',
    topics: ['Labels & categories', 'Features', 'Train / test', 'Overfitting'],
  },
  {
    id: 'models',
    number: '09',
    title: 'Classification models',
    detail: 'Then compare several ways a model can learn patterns: neighbors, probabilities, decision rules, ensembles, logistic regression, and text sentiment.',
    topics: ['K-nearest neighbors', 'Naïve Bayes', 'Trees & forests', 'Logistic regression', 'Sentiment'],
  },
  {
    id: 'evaluation',
    number: '10',
    title: 'Model selection & tuning',
    detail: 'Finally, inspect the kinds of mistakes a model makes, compare candidates, tune their settings, and watch for performance changes over time.',
    topics: ['Performance', 'Tuning', 'Confusion matrix', 'Imbalanced classes', 'Model drift'],
  },
] as const

type RoadmapId = (typeof ROADMAP)[number]['id']

function PredictionExample() {
  return <figure className="chapter-seven__example">
    <figcaption className="chapter-seven__example-heading">
      <span className="chapter-seven__eyebrow">A classification question</span>
      <strong>Will this subscriber leave next month?</strong>
      <span>Churn means leaving the service. Each row is one customer record. The first rows show known labels; the final row has an outcome to predict.</span>
    </figcaption>
    <div className="chapter-seven__table-wrap">
      <table className="chapter-seven__table">
        <caption>Past examples with observed outcomes</caption>
        <thead><tr><th scope="col">Customer ID</th><th scope="col">Status</th><th scope="col">Age · years</th><th scope="col">Newsletter</th><th className="is-label" scope="col">Churn next month · label</th></tr></thead>
        <tbody>
          <tr><th scope="row">1</th><td>Bronze</td><td>29</td><td>Yes</td><td className="is-label"><span className="chapter-seven__label chapter-seven__label--no">No · 0</span></td></tr>
          <tr><th scope="row">2</th><td>Gold</td><td>37</td><td>Yes</td><td className="is-label"><span className="chapter-seven__label chapter-seven__label--yes">Yes · 1</span></td></tr>
          <tr className="is-new"><th scope="row">11</th><td>Bronze</td><td>40</td><td>No</td><td className="is-label"><span className="chapter-seven__unknown">not observed yet</span></td></tr>
        </tbody>
      </table>
    </div>
    <div className="chapter-seven__prediction-flow" aria-label="The model learns from labeled customer records and predicts a category for a new record">
      <div className="chapter-seven__flow-card"><span className="chapter-seven__flow-index">01</span><strong>Learn from examples</strong><span>Features <b>X</b> + known churn label <b>Y</b></span></div>
      <span className="chapter-seven__flow-arrow" aria-hidden="true">→</span>
      <div className="chapter-seven__model-mark"><span>MODEL</span><i aria-hidden="true">✳</i></div>
      <span className="chapter-seven__flow-arrow" aria-hidden="true">→</span>
      <div className="chapter-seven__flow-card chapter-seven__flow-card--output"><span className="chapter-seven__flow-index">02</span><strong>Predict a category</strong><span>New record → <b>Churn: Yes or No</b></span></div>
    </div>
    <p className="chapter-seven__example-note"><strong>What makes this classification?</strong> The model predicts one of two possible categories: <em>churn</em> or <em>stay</em>.</p>
  </figure>
}

export default function ChapterSeven() {
  const [selected, setSelected] = useState<RoadmapId>('foundations')
  const active = ROADMAP.find((item) => item.id === selected)!

  return <article className="chapter-seven" aria-labelledby="chapter-seven-title">
    <header className="chapter-seven__intro">
      <p className="chapter-seven__eyebrow">Chapter 07 · Part 2 of 4</p>
      <h1 id="chapter-seven-title">From understanding data to predicting a class</h1>
      <p>Part 1 built the groundwork: check data quality, profile individual variables, and explore relationships. Now we use those foundations to study <strong>supervised machine learning</strong> and its classification methods.</p>
      <div className="chapter-seven__transition" aria-label="Course transition from part 1 to part 2">
        <div><span>Part 1</span><strong>QA &amp; data profiling</strong><i aria-hidden="true">✓</i></div>
        <span className="chapter-seven__transition-arrow" aria-hidden="true">→</span>
        <div className="is-current"><span>Part 2</span><strong>Classification</strong><i aria-hidden="true">●</i></div>
        <span className="chapter-seven__transition-arrow" aria-hidden="true">→</span>
        <div><span>Parts 3–4</span><strong>Regression, forecasting &amp; unsupervised learning</strong><i aria-hidden="true">○</i></div>
      </div>
    </header>

    <section className="chapter-seven__definition" aria-labelledby="chapter-seven-definition">
      <div className="chapter-seven__definition-copy">
        <p className="chapter-seven__eyebrow">The central idea</p>
        <h2 id="chapter-seven-definition">Classification learns from labeled examples to predict a category for a new case.</h2>
        <p>It is a supervised learning task because examples include an observed <strong>label</strong>—the category we want to predict. Other useful information about each case acts as its <strong>features</strong>.</p>
      </div>
      <div className="chapter-seven__definition-stamp" aria-hidden="true"><span>X</span><b>→</b><span>A / B</span><small>features<br />predicted class</small></div>
    </section>

    <section className="chapter-seven__use" aria-labelledby="chapter-seven-use-title">
      <div>
        <p className="chapter-seven__eyebrow">Why predict categories?</p>
        <h2 id="chapter-seven-use-title">A useful prediction can help someone decide what to do next.</h2>
      </div>
      <p>A churn-risk category could help a subscriber team decide which accounts to review for possible outreach. It supports a decision; it does not prove why someone might leave or guarantee what they will do.</p>
    </section>

    <PredictionExample />

    <section className="chapter-seven__roadmap" aria-labelledby="chapter-seven-roadmap-title">
      <div className="chapter-seven__roadmap-heading">
        <p className="chapter-seven__eyebrow">The path through Part 2</p>
        <h2 id="chapter-seven-roadmap-title">Three steps: prepare, learn, evaluate</h2>
        <p>Choose a step to preview its question. All three are part of the course ahead.</p>
      </div>
      <div className="chapter-seven__roadmap-grid" role="group" aria-label="Part 2 roadmap">
        {ROADMAP.map((item) => <button className={`chapter-seven__roadmap-card${selected === item.id ? ' is-selected' : ''}`} type="button" aria-pressed={selected === item.id} aria-controls="chapter-seven-roadmap-detail" key={item.id} onClick={() => setSelected(item.id)}>
          <span className="chapter-seven__roadmap-number">Chapter {item.number}</span><strong>{item.title}</strong>
          <span className="chapter-seven__topic-list">{item.topics.map((topic) => <span key={topic}>{topic}</span>)}</span>
        </button>)}
      </div>
      <div className="chapter-seven__roadmap-detail" id="chapter-seven-roadmap-detail" aria-live="polite">
        <span className="chapter-seven__roadmap-detail-label">UP NEXT · CHAPTER {active.number}</span><p>{active.detail}</p>
      </div>
    </section>

    <aside className="chapter-seven__summary" aria-label="Chapter summary">
      <span className="chapter-seven__summary-mark" aria-hidden="true">✓</span>
      <p><strong>Keep the path in view:</strong> trustworthy, well-understood data comes first; classification uses labeled examples to predict a category; then we check how well those predictions work.</p>
    </aside>
  </article>
}
