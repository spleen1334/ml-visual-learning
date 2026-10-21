import { useMemo, useState } from 'react'
import './ClassificationSentiment.css'
import workbook from './sentimentWorkbookData.json'
import { predictSentiment } from './SentimentMath'

type WorkbookReview = (typeof workbook.training)[number]

function Header({ id, number, title, lead }: { id: string; number: string; title: string; lead: string }) {
  return <header className="sentiment__intro"><p className="sentiment__eyebrow">Chapter 09 · {number}</p><h1 id={id}>{title}</h1><p>{lead}</p></header>
}

function BinaryFeatureTable({
  review,
  highlight,
  caption,
}: {
  review: Pick<WorkbookReview, 'features'>
  highlight?: boolean
  caption?: string
}) {
  return <div className="sentiment__table-wrap" tabIndex={0} aria-label="Word feature table, scroll horizontally"><table className="sentiment__table sentiment__binary-table">
    {caption && <caption>{caption}</caption>}
    <thead><tr>{workbook.features.map((word, index) => <th className={highlight && review.features[index] ? 'is-selected-feature' : ''} scope="col" key={word}>{word.trim()}</th>)}</tr></thead>
    <tbody><tr>{review.features.map((value, index) => <td className={value ? 'is-present' : ''} key={workbook.features[index]}>{value}</td>)}</tr></tbody>
  </table></div>
}

function SentimentWordCloud() {
  return <div className="sentiment__wordcloud" role="img" aria-label="A word cloud of book-review words, shown as a simple count-based summary">
    <span className="wc wc--good">good</span><span className="wc wc--read">read</span><span className="wc wc--bad">bad</span><span className="wc wc--book">book</span>
    <span className="wc wc--great">great</span><span className="wc wc--worse">worse</span><span className="wc wc--love">love</span><span className="wc wc--trash">trash</span><span className="wc wc--time">time</span>
    <span className="wc wc--waste">waste</span><span className="wc wc--author">author</span><span className="wc wc--garbage">garbage</span><span className="wc wc--character">character</span>
  </div>
}

export function CLSentimentIntro() {
  return <article className="sentiment" aria-labelledby="sentiment-intro-title">
    <Header id="sentiment-intro-title" number="9.22" title="Sentiment analysis" lead="Sentiment analysis predicts the tone or feeling behind text. Here, we study it as a supervised classification task." />
    <section className="sentiment__panel">
      <p className="sentiment__definition-copy"><strong>Text → numeric word features → sentiment class.</strong> A person labels the training reviews; a classifier learns from those examples and predicts labels for new text.</p>
      <div className="sentiment__use-cases"><div><h2>Where it helps</h2><p>Group negative customer reviews for human follow-up, or compare themes in open-ended survey responses.</p><p>It can support product research or employee feedback analysis; the label is an estimate of expressed tone.</p></div><SentimentWordCloud /></div>
      <p className="sentiment__warning"><strong>A word cloud is only a rough summary.</strong> It counts words, but it does not reliably assign tone. People must interpret it, so conclusions can vary.</p>
    </section>
  </article>
}

export function CLTextCleaning() {
  return <article className="sentiment" aria-labelledby="sentiment-cleaning-title">
    <Header id="sentiment-cleaning-title" number="9.23" title="Clean text for the task" lead="Make useful words easier to compare. Choose only the changes that preserve meaning for your task." />
    <section className="sentiment__panel">
      <h2>One sentence, cleaned</h2>
      <div className="sentiment__clean-example">
        <p className="sentiment__source-label">Original text</p><blockquote>“The computer is running hot because I'm mining bitcoin!”</blockquote>
        <div className="sentiment__clean-steps"><p><span>Remove selected stop words and punctuation</span><del>the</del> computer <del>is</del> running hot <del>because I'm</del> mining bitcoin<del>!</del></p><p><span>Reduce word forms</span>running → run · mining → mine</p></div>
        <p className="sentiment__clean-result"><span>One possible cleaned version</span><strong>computer run hot mine bitcoin</strong></p>
      </div>
      <section className="sentiment__clean-options" aria-labelledby="clean-options-title">
        <h2 id="clean-options-title">Cleaning choices at a glance</h2>
        <p className="sentiment__clean-options-intro">Small illustrative examples · these are choices, not mandatory steps.</p>
        <div className="sentiment__clean-cards">
          <section><h3>Standardize case</h3><div className="sentiment__mini-example">Bitcoin <span>→</span> bitcoin</div><p>Treat upper- and lowercase forms alike.</p></section>
          <section><h3>Remove punctuation</h3><div className="sentiment__mini-example">hello, world! <span>→</span> hello world</div><p>Drop punctuation when it adds no useful signal.</p></section>
          <section><h3>Correct spelling</h3><div className="sentiment__mini-example">compter <span>→</span> computer</div><p>Fix typos so the same word matches.</p></section>
          <section><h3>Fix text encoding</h3><div className="sentiment__mini-example">cafÃ© <span>→</span> café</div><p>Decode text correctly to restore broken characters.</p></section>
          <section><h3>Stem · trimmed word</h3><div className="sentiment__mini-example">studies <span>→</span> studi</div><p><strong>Stemming</strong> trims endings using rules. The result may not be a real word.</p></section>
          <section><h3>Lemma · dictionary form</h3><div className="sentiment__mini-example">studies <span>→</span> study</div><p><strong>Lemmatization</strong> uses vocabulary and grammar to find the base form.</p></section>
          <section className="sentiment__stop-card"><div><h3>Task-specific stop words</h3><p>Common words you choose to ignore because they add little to <strong>your task</strong>.</p></div><div className="sentiment__mini-example"><del>the</del> computer <del>is</del> hot <span>→</span> computer hot</div><p><strong>For sentiment, keep “not”:</strong> “not good” means something different from “good.”</p></section>
        </div>
      </section>
      <p className="sentiment__warning"><strong>Keep useful signals.</strong> “GREAT!” can convey more intensity than “great.” Stemming and lemmatization are alternatives; results depend on the method.</p>
    </section>
  </article>
}

export function CLBagOfWords() {
  const sample = useMemo(() => [
    { text: 'I HATE this garbage!', words: [1, 1, 0, 0], label: 'Negative' },
    { text: 'I love this book.', words: [0, 0, 1, 1], label: 'Positive' },
    { text: 'This book is garbage', words: [0, 1, 0, 1], label: 'Unseen' },
  ], [])
  const words = ['hate', 'garbage', 'love', 'book']
  return <article className="sentiment" aria-labelledby="sentiment-bow-title">
    <Header id="sentiment-bow-title" number="9.24" title="Turn text into word features" lead="A bag of words represents each review with numeric values for selected words. This source example uses binary presence: one if a word appears, zero if it does not." />
    <section className="sentiment__panel">
      <p className="sentiment__source-label">Tokenize the cleaned text, then mark word presence</p>
      <div className="sentiment__table-wrap" tabIndex={0} aria-label="Word feature table, scroll horizontally"><table className="sentiment__table sentiment__lesson-table"><thead>
        <tr className="sentiment__variable-groups">
          <th scope="col" rowSpan={2}>Review text</th>
          <th scope="colgroup" colSpan={words.length} className="sentiment__inputs-heading"><strong>X · Independent variables</strong><span>Word-presence inputs · 1 = present, 0 = absent</span></th>
          <th scope="col" className="sentiment__target-heading"><strong>y · Dependent variable</strong><span>Sentiment label to learn and predict</span></th>
        </tr>
        <tr>{words.map(word => <th scope="col" key={word}>{word}</th>)}<th className="is-target" scope="col">Sentiment</th></tr>
      </thead><tbody>{sample.map(row => <tr key={row.text}><th scope="row">{row.text}</th>{row.words.map((value, index) => <td className={value ? 'is-present' : ''} key={words[index]}>{value}</td>)}<td className="is-target">{row.label}</td></tr>)}</tbody></table></div>
      <p className="sentiment__source-note">Rows one and two are hand-labeled training examples. The third is a new review: its word features are known, but its sentiment is the value to predict.</p>
      <section className="sentiment__language-nuance" aria-labelledby="language-nuance-title">
        <h2 id="language-nuance-title">Handling language nuances</h2>
        <p>Individual words can mislead us about <strong>y — the sentiment we want to predict.</strong></p>
        <div className="sentiment__nuance-examples">
          <div><h3>Sarcasm</h3><blockquote>“If you like watching paint dry, you’ll love this movie.”</blockquote><p><strong>“Like” and “love” look positive.</strong> The comparison to watching paint dry suggests a boring movie: a negative opinion.</p></div>
          <div><h3>Context &amp; negation</h3><blockquote>“The new version is awfully good, not as bad as expected.”</blockquote><p><strong>“Awfully” and “bad” look negative.</strong> But “awfully good” means very good, and “not as bad” softens the criticism.</p></div>
        </div>
        <div className="sentiment__nuance-help"><p><strong>Feature engineering:</strong> give the model more useful inputs, such as phrases (“not good”) or features that preserve word order and context.</p><p><strong>More varied, labeled examples:</strong> include sarcasm, negation, and wording from the task so the model can learn these patterns.</p></div>
        <p className="sentiment__warning"><strong>No model is perfect.</strong> Relevant examples and better features can improve accuracy; more observations alone are no guarantee. Check performance on separate labeled examples the model has not learned from.</p>
      </section>
      <p className="sentiment__source-note">This table uses binary word presence. Some bag-of-words methods count repeated words instead; both basic forms lose word order.</p>
    </section>
  </article>
}

function FullReviewTable({ rows, title, test = false, coefficients, intercept }: { rows: typeof workbook.training | typeof workbook.test; title: string; test?: boolean; coefficients: number[]; intercept: number }) {
  return <div className="sentiment__table-wrap sentiment__workbook-wrap" tabIndex={0} aria-label={title + ", scroll for all rows and columns"}><table className="sentiment__table sentiment__workbook-table"><caption>{title}</caption><thead>
    <tr className="sentiment__workbook-groups">
      <th scope="col" rowSpan={2}>Sheet row</th><th scope="col" rowSpan={2}>{test ? 'New review' : 'Raw review'}</th><th scope="col" rowSpan={2}>Clean text</th>
      <th scope="colgroup" colSpan={workbook.features.length} className="sentiment__bow-heading"><span><strong>Bag of words · X</strong>25 independent word features · 1 = present, 0 = absent</span></th>
      {!test && <th scope="colgroup" className="is-target">Sentiment</th>}
      <th scope="colgroup" colSpan={2} className="sentiment__logistic-heading">Logistic prediction</th>
    </tr>
    <tr>{workbook.features.map(word => <th scope="col" className="sentiment__bow-word" key={word}>{word.trim()}</th>)}
      {!test && <th scope="col" className="is-target">Human label y<br />Dependent variable</th>}
      <th scope="col">Prediction<br /><small>P(positive)</small></th>
      <th scope="col">{test ? 'Sheet predicted class' : 'Likelihood'}</th>
    </tr>
  </thead><tbody>{rows.map(row => {
    const result = predictSentiment(row.features, coefficients, intercept)
    const trainingRow = row as WorkbookReview
    const testRow = row as (typeof workbook.test)[number]
    return <tr key={row.row}><th scope="row">{row.row}</th><td className="sentiment__review-cell">{row.raw}</td><td className="sentiment__review-cell">{row.clean}</td>{row.features.map((value, index) => <td className={value ? 'is-present' : ''} key={workbook.features[index]}>{value}</td>)}{!test && <td className="is-target">{trainingRow.label ? 'Positive (1)' : 'Negative (0)'}</td>}<td>{result.probability.toFixed(6)}</td>{!test && <td>{predictSentiment(row.features, coefficients, intercept, trainingRow.label).likelihood.toFixed(6)}</td>}{test && <td className="is-target">{testRow.sheetClass ? 'Positive (1)' : 'Negative (0)'}</td>}</tr>
  })}</tbody></table></div>
}

export function CLSentimentCaseStudy() {
  const [selectedRow, setSelectedRow] = useState(57)
  const [optimized, setOptimized] = useState(true)
  const [manualCoefficients, setCoefficients] = useState<number[]>(workbook.coefficients.map(() => 0))
  const [manualIntercept, setIntercept] = useState(0)
  const coefficients = optimized ? workbook.coefficients : manualCoefficients
  const intercept = optimized ? workbook.intercept : manualIntercept
  const solverScore = workbook.training.reduce((sum, row) => sum + predictSentiment(row.features, coefficients, intercept, row.label).likelihood, 0)
  const selected = workbook.test.find(row => row.row === selectedRow) ?? workbook.test[0]
  const output = predictSentiment(selected.features, coefficients, intercept)
  const sourceOutput = output.probability
  const contributions = workbook.features.flatMap((word, index) => selected.features[index] ? [{ word: word.trim(), value: coefficients[index] }] : [])
  return <article className="sentiment" aria-labelledby="sentiment-case-title">
    <Header id="sentiment-case-title" number="9.25" title="Case study: book-review sentiment" lead="The fictional Bark Twain the Data Dog series is receiving reviews. Use the workbook’s labeled examples to classify new reviews and inspect the predictions for unseen reviews." />
    <section className="sentiment__panel sentiment__case-panel">
      <ol className="sentiment__pipeline"><li>Clean and tokenize text</li><li>Hand-label training reviews</li><li>Fit logistic regression</li><li>Predict held-out reviews</li><li>Check against independent labels*</li></ol>
      <p className="sentiment__source-note">The workbook contains 47 training reviews and 7 test reviews. Training labels are hand-scored human judgments; test classes are model outputs. *Independent test labels would be needed to evaluate accuracy.</p>
      <p className="sentiment__bow-note"><strong>“Terrible” through “better” form the bag of words.</strong> Each review becomes 25 binary inputs (X). The separate human sentiment label is the target (y) the model learns to predict.</p>
      <section className="sentiment__prediction-guide" aria-labelledby="sentiment-columns-title">
        <h2 id="sentiment-columns-title">From word features to sentiment</h2>
        <ol className="sentiment__prediction-flow">
          <li><strong>Words · X</strong><span>0/1 inputs</span></li>
          <li><strong>Beta values</strong><span>Weight the words</span></li>
          <li><strong>Prediction · p</strong><span>Probability of positive sentiment</span></li>
        </ol>
        <div className="sentiment__likelihood-demo">
          <div className="sentiment__demo-prediction"><span>Example prediction</span><strong>90% positive</strong><div className="sentiment__demo-bar" role="img" aria-label="90 percent probability of positive sentiment, 10 percent negative"><i /></div><small>Above 50% → predict positive</small></div>
          <div className="sentiment__demo-labels"><h3>Likelihood follows the human label</h3><p><span>Human label: <b>positive</b></span><strong>p = 90%</strong></p><p><span>Human label: <b>negative</b></span><strong>1 − p = 10%</strong></p></div>
        </div>
        <p className="sentiment__guide-takeaway">Change beta values → predictions and likelihoods change. <strong>Human labels stay fixed.</strong></p>
      </section>
      <details className="sentiment__details" open><summary>Workbook training rows · 47 reviews and all 25 word features</summary><FullReviewTable coefficients={coefficients} intercept={intercept} rows={workbook.training} title="Sentiment Analysis sheet · rows 4–50. Binary features, hand-scored labels, and saved model outputs." /></details>
      <div className="sentiment__model-block"><div><div className="sentiment__fit-toolbar"><div><h2>Logistic model</h2></div><button type="button" role="switch" aria-checked={optimized} aria-label="Optimize using saved fit" className="sentiment__optimize-switch" onClick={() => setOptimized(value => !value)}><span aria-hidden="true" className="sentiment__switch-track"><i /></span>Optimize · {optimized ? 'On' : 'Off'}</button></div><p className="sentiment__fit-status" aria-live="polite">{optimized ? 'Saved optimized beta values' : 'Manual beta values'}</p><p className="sentiment__solver-score">Worksheet score: <strong>{solverScore.toFixed(2)}</strong></p><p className="sentiment__equation">P(positive) = 1 ÷ (1 + e<sup>−(β₀ + Σ featureᵢ × βᵢ)</sup>)</p><p className="sentiment__source-note">The sheet reports objective <strong>{workbook.objective.toFixed(2)}</strong> in AJ52 as the sum of per-row observed-label probabilities (AJ4:AJ50). That is the workbook's Solver score, not a joint likelihood or an accuracy score.</p><details className="sentiment__details sentiment__coefficient-details" open><summary>Beta values · intercept and 25 word coefficients</summary><div className="sentiment__table-wrap sentiment__coefficients-wrap"><table className="sentiment__table"><tbody><tr><th scope="row">Intercept β₀</th><td><input aria-label="Sentiment intercept beta zero" disabled={optimized} type="number" step="any" value={intercept} onChange={event => { if (event.target.value !== '') setIntercept(Number(event.target.value)) }} /></td></tr>{workbook.features.map((word, index) => <tr key={word}><th scope="row">β · {word.trim()}</th><td><input aria-label={`Coefficient for ${word.trim()}`} disabled={optimized} type="number" step="any" value={coefficients[index]} onChange={event => { if (event.target.value !== '') setCoefficients(values => values.map((value, i) => i === index ? Number(event.target.value) : value)) }} /></td></tr>)}</tbody></table></div></details></div></div>
      <section className="sentiment__prediction-block" aria-labelledby="sentiment-test-heading"><div className="sentiment__section-heading"><h2 id="sentiment-test-heading">Predict an unseen review</h2><p>Choose one of the seven source reviews to trace its word features through the current model.</p></div>
        <div className="sentiment__review-select" role="group" aria-label="Select a test review">{workbook.test.map(row => <button type="button" key={row.row} aria-pressed={selectedRow === row.row} onClick={() => setSelectedRow(row.row)}>Review {row.row - 56}</button>)}</div>
        <div className="sentiment__selected-review"><div><span>Raw review · workbook row {selected.row}</span><blockquote>“{selected.raw}”</blockquote></div><div><span>Clean text</span><strong>{selected.clean}</strong></div></div>
        <BinaryFeatureTable review={selected} highlight caption="Unseen review represented with the same 25 binary word features used by the workbook model." />
        <div className="sentiment__prediction"><span>Current model output</span><strong>{(sourceOutput * 100).toFixed(2)}% positive</strong><div className="sentiment__probability-track" role="img" aria-label={`${(sourceOutput * 100).toFixed(2)} percent probability of positive sentiment`}><i style={{ width: `${Math.min(100, Math.max(0, sourceOutput * 100))}%` }} /></div><p>Using the sheet’s probability &gt; 0.5 rule, predicted class: <b>{output.prediction ? 'Positive' : 'Negative'}</b>. Sheet class output: <b>{selected.sheetClass ? 'Positive' : 'Negative'}</b>.</p><small>Computed from the current coefficients: P(positive) = {output.probability.toFixed(9)}. The test-set class column repeats the model output; it is not an independent human label.</small><details className="sentiment__calculation-details"><summary>Trace this prediction</summary><p>Score = intercept {intercept.toFixed(4)}{contributions.map(item => ` ${item.value < 0 ? '−' : '+'} ${Math.abs(item.value).toFixed(4)} (${item.word})`).join('')} = {output.score.toFixed(4)}</p><p>Logistic score → P(positive) = {output.probability.toFixed(9)}.</p></details></div>
      </section>
      <details className="sentiment__details"><summary>Workbook test set · all 7 rows, features, predictions and sheet class outputs</summary><FullReviewTable coefficients={coefficients} intercept={intercept} rows={workbook.test} title="Sentiment Analysis sheet · rows 57–63. The final column is the thresholded model output, not a separate evaluation label." test /></details>
      <p className="sentiment__warning"><strong>One source boundary matters.</strong> The workbook does not preserve independent human labels for its seven test rows: AG57–AG58 calculate a class directly from the model probability, and the remaining cached classes match that rule. In the video, the instructor says a human might judge “It was OK, not great” as negative while the model predicts positive from <em>great</em>. Treat this as a plausible disagreement, not a measured test error.</p>
    </section>
  </article>
}
