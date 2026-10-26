import { useState } from 'react'
import './UnsupervisedIntro.css'

const TECHNIQUES = [
  { family: 'Clustering / Segmentation', methods: ['K-Means Clustering', 'Hierarchical Clustering'], question: 'Are there specific groups or “clusters” of customers who behave in similar ways?' },
  { family: 'Association Mining / Basket Analysis', methods: ['Markov Chains', 'Apriori'], question: 'When customers purchase a particular item, which other items tend to be purchased as well?' },
  { family: 'Outlier Detection', methods: ['Cross-sectional Outlier Detection', 'Time-series Outlier Detection'], question: 'Are there any anomalies in the data that we wouldn’t expect to see under normal conditions?' },
  { family: 'Dimensionality Reduction', methods: ['Dimensionality Reduction'], question: 'Can we combine or reduce the number of dimensions in our data to better understand it?' },
] as const

function UnsupervisedFamilyMap() {
  return <section className="unsup-family-map" aria-label="Unsupervised learning families, methods, and example questions">
    <div className="unsup-map-root">Unsupervised learning</div>
    <div className="unsup-map-columns" aria-hidden="true"><span /><span /><strong>Unsupervised examples</strong></div>
    <div className="unsup-map-groups">
      {TECHNIQUES.map((item) => <div className="unsup-map-row" key={item.family}>
        <h2 className="unsup-map-family">{item.family}</h2>
        <ul className="unsup-map-methods">{item.methods.map((method) => <li key={method}>{method}</li>)}</ul>
        <p className="unsup-map-question">{item.question}</p>
      </div>)}
    </div>
  </section>
}

const FEATURE_ROWS = [
  ['1', '30', 'High', '$130,000', '12', '$1,300,050', '1', '0', '0', '1', '11.7'],
  ['2', '15', 'Low', '$600,000', '5', '$11,233,310', '0', '0', '1', '0', '13.3'],
  ['3', '8', 'Medium', '$15,000', '10', '$1,112,050', '0', '1', '0', '0', '9.6'],
  ['4', '22', 'Medium', '$705,000', '11', '$1,582,077', '0', '1', '0', '1', '13.5'],
  ['5', '41', 'High', '$3,000', '3', '$1,889,053', '1', '0', '0', '0', '8.0'],
] as const

export function UISupervisedVsUnsupervised() {
  return <article className="unsup-lesson" aria-labelledby="unsup-landscape-title">
    <header><p className="unsup-eyebrow">17.1 · The ML landscape</p><h1 id="unsup-landscape-title">Is there a target label to learn from?</h1><p>One useful distinction is whether examples include a known outcome that a model should learn to predict.</p></header>
    <section className="unsup-landscape" aria-label="Three groups in the course machine learning landscape">
      <div><span>Parts 2 and 3</span><h2>Supervised learning</h2><p>Learn from examples with a label: a category for classification or a number for regression.</p><strong>Known label → learn to predict</strong></div>
      <div className="is-current"><span>Part 4 · now</span><h2>Unsupervised learning</h2><p>Explore and organize observed values when there is no supplied target label to predict.</p><strong>Observed values → find patterns</strong></div>
      <div className="is-muted"><span>Advanced topics</span><h2>Beyond this course</h2><p>The course diagram includes advanced areas that this part does not cover.</p><strong>Not in the current course path</strong></div>
    </section>
    <h2 className="unsup-map-heading">Questions explored by unsupervised learning</h2>
    <UnsupervisedFamilyMap />
    <p className="unsup-note"><strong>Keep the distinction practical:</strong> classification and regression learn from known outcomes. Unsupervised methods usually help describe or organize the data; the business question determines whether a pattern is useful.</p>
  </article>
}

export function UICommonTechniques() {
  return <article className="unsup-lesson" aria-labelledby="unsup-techniques-title">
    <header><p className="unsup-eyebrow">17.2 · Common techniques</p><h1 id="unsup-techniques-title">Match the technique to the pattern you want to inspect</h1><p>The course groups several methods by the kind of structure they help explore.</p></header>
    <UnsupervisedFamilyMap />
    <p className="unsup-note">These are examples of questions, not a rule that only one method can answer each one. Start with the business objective, then choose a technique that makes its patterns easier to examine.</p>
  </article>
}

export function UIUnsupervisedWorkflow() {
  return <article className="unsup-lesson" aria-labelledby="unsup-workflow-title">
    <header><p className="unsup-eyebrow">17.3 · Unsupervised ML workflow</p><h1 id="unsup-workflow-title">Unsupervised learning workflow</h1></header>
    <section className="unsup-foundation" aria-labelledby="unsup-foundation-title">
      <ol className="unsup-foundation-steps" aria-label="Three foundation steps, always first">
        <li>Business Objective</li><li>Preliminary QA</li><li>Data Profiling</li>
      </ol>
      <div className="unsup-foundation-copy">
        <h2 id="unsup-foundation-title">Remember, these steps ALWAYS come first</h2>
        <p>Before building a model, you should have a clear understanding of the <strong>business objective</strong> (identifying clusters, detecting anomalies, etc.) and the <strong>data at hand</strong> (variable types, table structure, data quality, profiling metrics, etc.).</p>
      </div>
      <div className="unsup-foundation-example"><strong>Example</strong><p><b>Business objective:</b> identify similar customer groups. <b>Preliminary QA:</b> check missing spend values and duplicate customer IDs. <b>Data profiling:</b> inspect variable types, table structure, and the spend distribution.</p></div>
    </section>
    <div className="unsup-flow-down" aria-hidden="true">↓</div>
    <section className="unsup-workflow-section" aria-label="Unsupervised modeling workflow">
      <ol className="unsup-workflow" aria-label="Feature engineering, model application, hyperparameter tuning, and model selection">
        <li><h2>Feature Engineering</h2><p>Add new, calculated variables (or “features”) to the data set based on existing fields.</p></li>
        <li><h2>Model Application</h2><p>Apply relevant unsupervised ML techniques, based on the objective (you will typically test multiple models).</p></li>
        <li><h2>Hyperparameter Tuning</h2><p>Adjust and tune model parameters (this is typically an iterative process).</p></li>
        <li><h2>Model Selection</h2><p>Select the model that yields the most useful or insightful results, based on the objective at hand.</p></li>
      </ol>
      <svg className="unsup-feedback-arrows" viewBox="0 0 1000 84" preserveAspectRatio="none" role="img" aria-label="From hyperparameter tuning, the workflow can return to feature engineering or model application">
        <title>Iteration returns from hyperparameter tuning to feature engineering or model application.</title>
        <defs><marker id="unsup-feedback-arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="currentColor" /></marker></defs>
        <path d="M625 0 V54 H125 V12" markerEnd="url(#unsup-feedback-arrow)" />
        <path d="M625 0 V70 H375 V12" markerEnd="url(#unsup-feedback-arrow)" />
      </svg>
      <p className="unsup-feedback-caption">Tuning can lead to more feature engineering or another model run.</p>
    </section>
    <aside className="unsup-workflow-conclusion"><strong>There often are no strict rules to determine which model is best; it’s about which one helps you best answer the question at hand</strong></aside>
  </article>
}

export function UIFeatureEngineeringRecap() {
  return <article className="unsup-lesson" aria-labelledby="unsup-features-title">
    <header><p className="unsup-eyebrow">17.4 · Feature engineering recap</p><h1 id="unsup-features-title">Add fields that make the business pattern easier to inspect</h1><p>The source example adds binary indicators and a log-spend field to five monthly observations. It illustrates feature construction; no model is trained here.</p></header>
    <p className="unsup-table-instruction">Scroll the table horizontally to compare all original and engineered fields.</p>
    <div className="unsup-table-scroll" role="region" aria-label="Source feature engineering table, scroll horizontally to see all columns" tabIndex={0}>
      <table className="unsup-feature-table">
        <caption>Five source rows · original fields followed by engineered fields</caption>
        <thead>
          <tr><th className="original-group" scope="colgroup" colSpan={6}>Original fields</th><th className="engineered-group" scope="colgroup" colSpan={5}>Engineered fields</th></tr>
          <tr><th scope="col">Month ID</th><th scope="col">Social Posts</th><th scope="col">Competitive Activity</th><th scope="col">Marketing Spend</th><th scope="col">Promotion Count</th><th scope="col">Revenue</th><th scope="col">Competitive High</th><th scope="col">Competitive Medium</th><th scope="col">Competitive Low</th><th scope="col">Promotion &gt; 10<br />&amp; Social &gt; 25</th><th scope="col">Log Spend</th></tr>
        </thead>
        <tbody>{FEATURE_ROWS.map((row) => <tr key={row[0]}>{row.map((value, index) => <td key={index}>{value}</td>)}</tr>)}</tbody>
      </table>
    </div>
    <p className="unsup-note"><strong>What changed?</strong> The three competitive-activity indicators encode the category as separate 0/1 fields. Another indicator is 1 when both source thresholds are met. The source displays log spend rounded to one decimal; it does not specify the exact logarithm convention.</p>
  </article>
}

export function UIUnsupervisedTakeaways() {
  return <article className="unsup-lesson" aria-labelledby="unsup-takeaways-title">
    <header><p className="unsup-eyebrow">17.5 · Key takeaways</p><h1 id="unsup-takeaways-title">Use unsupervised learning to explore, then interpret</h1></header>
    <ol className="unsup-takeaways">
      <li><span>01</span><div><h2>Look for patterns in observed values</h2><p>The task usually starts without a target label whose value the model must predict.</p></div></li>
      <li><span>02</span><div><h2>Let the business question guide the method</h2><p>Clustering, associations, outliers, and reduced dimensions answer different kinds of questions.</p></div></li>
      <li><span>03</span><div><h2>Interpret what the result means</h2><p>A pattern is useful when it helps explain or organize the data in a way that matters for the objective.</p></div></li>
    </ol>
    <aside className="unsup-note"><strong>Next:</strong> Chapter 18 starts with clustering and segmentation, then develops K-Means and hierarchical clustering.</aside>
  </article>
}

const QUIZ = [
  { id: 'labels', question: 'In general, unsupervised ML is used when the data does not have…', options: ['Labels', 'Dates', 'Numerical values', 'Categorical fields'], answer: 0, explanation: 'Unsupervised methods are typically applied when the training data has no target labels. The observed feature values are still present.' },
  { id: 'objective', question: 'What is the primary objective of unsupervised learning?', options: ['Quality assurance', 'Data profiling', 'Finding patterns', 'Making predictions'], answer: 2, explanation: 'The course frames unsupervised learning as a way to find useful patterns and insights in observed values.' },
  { id: 'technique', question: 'Which of the following is an unsupervised ML technique?', options: ['K-Means', 'Outlier detection', 'Dimensionality reduction', 'All of the above'], answer: 3, explanation: 'The course introduces all three as unsupervised techniques, each for a different kind of analysis.' },
  { id: 'business', question: 'Generally speaking, what should guide the choice of an unsupervised result?', options: ['Minimizing mean squared error', 'Detecting missing values', 'Optimizing lift', 'Answering the business question at hand'], answer: 3, explanation: 'There may not be one target-label score that determines the winner. Choose the result that is most relevant to the business objective.' },
  { id: 'clusters', question: 'Which is a clear example of a question clustering could help explore?', options: ['Analyzing the distribution of numerical values', 'Classifying emails as spam', 'Predicting annual revenue', 'Identifying clusters of users or customers'], answer: 3, explanation: 'Clustering can help explore groups of similar users or customers. Whether it is appropriate depends on the objective and available data.' },
] as const

export function UIUnsupervisedQuiz() {
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [checked, setChecked] = useState<Record<number, boolean>>({})
  const question = QUIZ[index]
  const revealed = Boolean(checked[index])
  const correct = revealed && answers[index] === question.answer
  const score = QUIZ.filter((item, i) => checked[i] && answers[i] === item.answer).length
  function reset() { setIndex(0); setAnswers({}); setChecked({}) }
  return <article className="unsup-lesson unsup-quiz" aria-labelledby="unsup-quiz-title">
    <header><p className="unsup-eyebrow">17.6 · Optional practice · 5 questions</p><h1 id="unsup-quiz-title">Intro to Unsupervised ML quiz</h1><p>Choose an answer, check it, and read the explanation. Lessons and navigation remain open whether or not you take the quiz.</p></header>
    <nav className="unsup-quiz-map" aria-label="Quiz questions">{QUIZ.map((item, i) => <button key={item.id} type="button" aria-label={`Question ${i + 1}${checked[i] ? answers[i] === item.answer ? ', correct' : ', review' : ''}`} aria-current={index === i ? 'step' : undefined} onClick={() => setIndex(i)}>{i + 1}{checked[i] && <span aria-hidden="true">{answers[i] === item.answer ? ' ✓' : ' ↺'}</span>}</button>)}</nav>
    <section className="unsup-quiz-card" aria-label={`Question ${index + 1}`}>
      <p className="unsup-eyebrow">Question {index + 1} of {QUIZ.length}</p>
      <fieldset key={question.id} disabled={revealed}><legend>{question.question}</legend><div className="unsup-quiz-options">{question.options.map((option, i) => <label key={option} className={`${answers[index] === i ? 'selected' : ''} ${revealed && i === question.answer ? 'correct' : ''}`}><input type="radio" name={`unsup-question-${question.id}`} checked={answers[index] === i} onChange={() => setAnswers({ ...answers, [index]: i })} /><span>{option}</span>{revealed && i === question.answer && <strong>✓ Correct answer</strong>}</label>)}</div></fieldset>
      {revealed && <div className={`unsup-quiz-feedback${correct ? '' : ' review'}`} role="status"><strong>{correct ? 'Correct.' : 'Take another look.'}</strong><p>{question.explanation}</p></div>}
      <div className="unsup-quiz-actions">{!revealed ? <button className="unsup-quiz-primary" type="button" disabled={answers[index] === undefined} onClick={() => setChecked({ ...checked, [index]: true })}>Check answer</button> : <button type="button" onClick={() => { const next = { ...checked }; delete next[index]; setChecked(next); const selections = { ...answers }; delete selections[index]; setAnswers(selections) }}>Try again</button>}<div><button type="button" disabled={index === 0} onClick={() => setIndex(index - 1)}>Previous question</button><button type="button" disabled={index === QUIZ.length - 1} onClick={() => setIndex(index + 1)}>Next question →</button></div></div>
    </section>
    <footer className="unsup-quiz-summary"><p aria-live="polite">{Object.keys(checked).length === QUIZ.length ? 'All questions checked.' : `${Object.keys(checked).length} of ${QUIZ.length} checked.`} <strong>{score} correct</strong></p><button type="button" onClick={reset}>Start over</button></footer>
    <aside className="unsup-note" aria-label="Chapter summary"><strong>Chapter summary:</strong> use unsupervised methods to explore patterns in observed data, prepare useful features, and select the result that best serves the business question.</aside>
  </article>
}
