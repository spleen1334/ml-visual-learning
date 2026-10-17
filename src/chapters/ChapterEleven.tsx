import { useState } from 'react'
import './ChapterEleven.css'

const ROADMAP = [
  { id: 'intro', number: '12', title: 'Intro to regression', question: 'What makes a numerical prediction different from a category prediction?', topics: ['Regression 101', 'Features', 'Root cause vs. prediction'] },
  { id: 'models', number: '13', title: 'Regression modeling 101', question: 'How can a fitted relationship turn input values into a numerical estimate?', topics: ['Linear relationships', 'Least squared error', 'Non-linear regression'] },
  { id: 'diagnostics', number: '14', title: 'Model diagnostics', question: 'How do we inspect the quality and limits of a fitted regression model?', topics: ['R-squared', 'Error metrics', 'Model assumptions'] },
  { id: 'forecasting', number: '15', title: 'Time-series forecasting', question: 'What can the order of past observations tell us about a future value?', topics: ['Seasonality', 'Trends', 'Smoothing'] },
] as const

type RoadmapId = (typeof ROADMAP)[number]['id']

function NumericPredictionExample() {
  return <figure className="chapter-eleven__example">
    <figcaption>
      <span className="chapter-eleven__eyebrow">Two numerical questions</span>
      <strong>Both outputs are numbers. The forecasting example also makes time order essential.</strong>
    </figcaption>
    <div className="chapter-eleven__example-grid">
      <section className="chapter-eleven__example-card" aria-labelledby="regression-example-title">
        <span className="chapter-eleven__card-label">Regression</span>
        <h2 id="regression-example-title">Estimate a home’s sale price</h2>
        <div className="chapter-eleven__inputs"><span>Size<br /><b>120 m²</b></span><span>Rooms<br /><b>3</b></span><span>Area<br /><b>Central</b></span></div>
        <div className="chapter-eleven__arrow" aria-hidden="true">↓</div>
        <div className="chapter-eleven__estimate"><span>Estimated sale price</span><strong>€210,000</strong></div>
        <p>Use features about one property to estimate its <strong>numeric outcome</strong>. The rows do not need to be in time order.</p>
      </section>
      <section className="chapter-eleven__example-card chapter-eleven__example-card--forecast" aria-labelledby="forecast-example-title">
        <span className="chapter-eleven__card-label">Forecasting</span>
        <h2 id="forecast-example-title">Estimate next month’s sales</h2>
        <div className="chapter-eleven__months" aria-label="Past monthly sales were 42, 47 and 51 thousand euros. Next month is the forecast."><span>Jan<br /><b>42k</b></span><span>Feb<br /><b>47k</b></span><span>Mar<br /><b>51k</b></span><span className="is-future">Apr<br /><b>?</b></span></div>
        <div className="chapter-eleven__arrow" aria-hidden="true">↓</div>
        <div className="chapter-eleven__estimate"><span>Forecast for April</span><strong>≈ €54k</strong></div>
        <p>Use earlier observations and their <strong>time order</strong> to estimate a future value. A trend or seasonal pattern may matter.</p>
      </section>
    </div>
    <p className="chapter-eleven__example-note"><strong>Illustrative estimates:</strong> these outputs show the kind of answer each task produces; no model is fitted on this page. The next chapters examine how these methods learn from data and how to evaluate their results.</p>
  </figure>
}

export default function ChapterEleven() {
  const [selected, setSelected] = useState<RoadmapId>('intro')
  const active = ROADMAP.find((item) => item.id === selected)!

  return <article className="chapter-eleven" aria-labelledby="chapter-eleven-title">
    <header className="chapter-eleven__intro">
      <p className="chapter-eleven__eyebrow">Chapter 11 · Part 3 of 4</p>
      <h1 id="chapter-eleven-title">From predicting classes to predicting values</h1>
      <p>Part 2 used labeled examples to predict categories such as <em>churn</em> or <em>stay</em>. Part 3 focuses on <strong>regression and forecasting</strong>: foundational techniques for business questions whose useful answer is a number.</p>
      <div className="chapter-eleven__transition" aria-label="Course transition from classification to regression and forecasting">
        <div><span>Part 2</span><strong>Classification</strong><i aria-hidden="true">✓</i></div><span aria-hidden="true">→</span><div className="is-current"><span>Part 3</span><strong>Regression &amp; forecasting</strong><i aria-hidden="true">●</i></div><span aria-hidden="true">→</span><div><span>Part 4</span><strong>Unsupervised learning</strong><i aria-hidden="true">○</i></div>
      </div>
    </header>

    <section className="chapter-eleven__definition" aria-labelledby="chapter-eleven-definition">
      <div><p className="chapter-eleven__eyebrow">The central idea</p><h2 id="chapter-eleven-definition">Regression estimates a numeric outcome from inputs. Forecasting estimates what happens next using information available before that future time.</h2><p>These ideas overlap: a regression model can be used for forecasting, and forecasts can use other useful inputs as well as past values.</p></div>
      <div className="chapter-eleven__definition-mark" aria-hidden="true"><span>Inputs</span><b>→</b><span>42.5</span><small>features or past values<br />numeric estimate</small></div>
    </section>

    <section className="chapter-eleven__why" aria-labelledby="chapter-eleven-why-title"><div><p className="chapter-eleven__eyebrow">Why numerical estimates?</p><h2 id="chapter-eleven-why-title">A number can help a team plan—when its uncertainty is kept in view.</h2></div><p>A retailer may estimate the likely sales of a new store, then forecast next quarter’s demand. These outputs can inform staffing or inventory decisions; they do not reveal a single certain future.</p></section>

    <NumericPredictionExample />

    <section className="chapter-eleven__roadmap" aria-labelledby="chapter-eleven-roadmap-title">
      <div className="chapter-eleven__roadmap-heading"><p className="chapter-eleven__eyebrow">The path through Part 3</p><h2 id="chapter-eleven-roadmap-title">Four steps: frame, fit, inspect, forecast</h2><p>Select a chapter to see the question it will explore.</p></div>
      <div className="chapter-eleven__roadmap-grid" role="group" aria-label="Part 3 roadmap">{ROADMAP.map((item) => <button className={selected === item.id ? 'is-selected' : ''} type="button" aria-pressed={selected === item.id} aria-controls="chapter-eleven-roadmap-detail" key={item.id} onClick={() => setSelected(item.id)}><span>Chapter {item.number}</span><strong>{item.title}</strong><i>{item.topics.map((topic) => <em key={topic}>{topic}</em>)}</i></button>)}</div>
      <div className="chapter-eleven__roadmap-detail" id="chapter-eleven-roadmap-detail" aria-live="polite"><span>CHAPTER {active.number} PREVIEW</span><p>{active.question}</p></div>
    </section>

    <aside className="chapter-eleven__summary" aria-label="Chapter summary"><span aria-hidden="true">✓</span><p><strong>Keep the distinction clear:</strong> classification predicts a category; regression predicts a number; forecasting uses time-ordered observations to estimate a future number. Part 3 will build and examine each kind of numerical estimate.</p></aside>
  </article>
}
