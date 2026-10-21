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
    <Header id="sentiment-cleaning-title" number="9.23" title="Clean text for the task" lead="Prepare the text so useful words are easier to compare, while checking each change against the meaning you need to preserve." />
    <section className="sentiment__panel">
      <h2>The source example</h2>
      <div className="sentiment__clean-example">
        <p className="sentiment__source-label">Original text</p><blockquote>“The computer is running hot because I'm mining bitcoin!”</blockquote>
        <div className="sentiment__clean-steps"><p><span>Remove selected stop words and punctuation</span><del>the</del> computer <del>is</del> running hot <del>because I'm</del> mining bitcoin<del>!</del></p><p><span>Reduce word forms</span>running → run · mining → mine</p></div>
        <p className="sentiment__clean-result"><span>One possible cleaned version</span><strong>computer run hot mine bitcoin</strong></p>
      </div>
      <div className="sentiment__cleaning-notes"><p><strong>Common choices:</strong> remove selected punctuation, standardize case, correct spelling or encoding, reduce words to a stem or lemma, and remove task-specific stop words.</p><p><strong>Stop words</strong> are common words that may add little for a task. <strong>Stemming</strong> trims word forms; <strong>lemmatization</strong> maps them to a base form. The source keeps context-dependent choices explicit.</p></div>
      <p className="sentiment__warning"><strong>Cleaning can erase a useful signal.</strong> The source notes that capitalization or punctuation can show intensity (“GREAT!” versus “great”). Preserve negation such as “not” when it matters to the label.</p>
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
      <div className="sentiment__table-wrap" tabIndex={0} aria-label="Word feature table, scroll horizontally"><table className="sentiment__table sentiment__lesson-table"><caption>Words are input features X; sentiment is the observed target y for training rows.</caption><thead><tr><th scope="col">Review text</th>{words.map(word => <th scope="col" key={word}>{word} · X</th>)}<th className="is-target" scope="col">Sentiment · y</th></tr></thead><tbody>{sample.map(row => <tr key={row.text}><th scope="row">{row.text}</th>{row.words.map((value, index) => <td className={value ? 'is-present' : ''} key={words[index]}>{value}</td>)}<td className="is-target">{row.label}</td></tr>)}</tbody></table></div>
      <p className="sentiment__source-note">Rows one and two are hand-labeled training examples. The third is a new review: its word features are known, but its sentiment is the value to predict.</p>
      <div className="sentiment__nuance-examples"><p><strong>“If you like watching paint dry, you’ll love this movie.”</strong><br />A word-presence list may see <em>like</em> and <em>love</em> while missing the sarcastic meaning.</p><p><strong>“The new version is awfully good, not as bad as expected.”</strong><br />Removing or ignoring negation can change how the words are read together.</p></div>
      <p className="sentiment__warning"><strong>This is binary word presence.</strong> Some bag-of-words methods count repeated words instead. Both basic forms lose word order and much of the surrounding context.</p>
    </section>
  </article>
}

function FullReviewTable({ rows, title, test = false }: { rows: typeof workbook.training | typeof workbook.test; title: string; test?: boolean }) {
  return <div className="sentiment__table-wrap sentiment__workbook-wrap" tabIndex={0} aria-label={title + ", scroll for all rows and columns"}><table className="sentiment__table sentiment__workbook-table"><caption>{title}</caption><thead><tr><th scope="col">Sheet row</th><th scope="col">{test ? 'New review' : 'Raw review'}</th><th scope="col">Clean text</th>{workbook.features.map(word => <th scope="col" key={word}>{word.trim()}</th>)}{!test && <th scope="col">Human label y</th>}<th scope="col">Model P(positive)</th>{!test && <th scope="col">Observed-label likelihood</th>}{test && <th scope="col">Sheet predicted class</th>}</tr></thead><tbody>{rows.map(row => {
    const result = predictSentiment(row.features, workbook.coefficients, workbook.intercept)
    const trainingRow = row as WorkbookReview
    const testRow = row as (typeof workbook.test)[number]
    return <tr key={row.row}><th scope="row">{row.row}</th><td className="sentiment__review-cell">{row.raw}</td><td className="sentiment__review-cell">{row.clean}</td>{row.features.map((value, index) => <td className={value ? 'is-present' : ''} key={workbook.features[index]}>{value}</td>)}{!test && <td className="is-target">{trainingRow.label ? 'Positive (1)' : 'Negative (0)'}</td>}<td>{result.probability.toFixed(6)}</td>{!test && <td>{predictSentiment(row.features, workbook.coefficients, workbook.intercept, trainingRow.label).likelihood.toFixed(6)}</td>}{test && <td className="is-target">{testRow.sheetClass ? 'Positive (1)' : 'Negative (0)'}</td>}</tr>
  })}</tbody></table></div>
}

export function CLSentimentCaseStudy() {
  const [selectedRow, setSelectedRow] = useState(57)
  const selected = workbook.test.find(row => row.row === selectedRow) ?? workbook.test[0]
  const output = predictSentiment(selected.features, workbook.coefficients, workbook.intercept)
  const sourceOutput = selected.probability
  const contributions = workbook.features.flatMap((word, index) => selected.features[index] ? [{ word: word.trim(), value: workbook.coefficients[index] }] : [])
  return <article className="sentiment" aria-labelledby="sentiment-case-title">
    <Header id="sentiment-case-title" number="9.25" title="Case study: book-review sentiment" lead="The fictional Bark Twain the Data Dog series is receiving reviews. Use the workbook’s labeled examples to classify new reviews and inspect the predictions for unseen reviews." />
    <section className="sentiment__panel sentiment__case-panel">
      <ol className="sentiment__pipeline"><li>Clean and tokenize text</li><li>Hand-label training reviews</li><li>Fit logistic regression</li><li>Predict held-out reviews</li><li>Check against independent labels*</li></ol>
      <p className="sentiment__source-note">The workbook contains 47 training reviews and 7 test reviews. Training labels are hand-scored human judgments; test classes are model outputs. *Independent test labels would be needed to evaluate accuracy.</p>
      <details className="sentiment__details" open><summary>Workbook training rows · 47 reviews and all 25 word features</summary><FullReviewTable rows={workbook.training} title="Sentiment Analysis sheet · rows 4–50. Binary features, hand-scored labels, and saved model outputs." /></details>
      <div className="sentiment__model-block"><div><h2>Saved logistic model</h2><p>The source video uses logistic regression to combine the 25 word features. The workbook stores the fitted intercept and coefficients; this lesson applies those saved values.</p><p className="sentiment__equation">P(positive) = 1 ÷ (1 + e<sup>−(β₀ + Σ featureᵢ × βᵢ)</sup>)</p><p className="sentiment__source-note">The sheet reports objective <strong>{workbook.objective.toFixed(2)}</strong> in AJ52 as the sum of per-row observed-label probabilities (AJ4:AJ50). That is the workbook's Solver score, not a joint likelihood or an accuracy score.</p><details className="sentiment__details sentiment__coefficient-details"><summary>Saved intercept and 25 workbook coefficients</summary><div className="sentiment__table-wrap sentiment__coefficients-wrap"><table className="sentiment__table"><tbody><tr><th scope="row">Intercept β₀</th><td>{workbook.intercept.toFixed(6)}</td></tr>{workbook.features.map((word, index) => <tr key={word}><th scope="row">β · {word.trim()}</th><td>{workbook.coefficients[index].toFixed(6)}</td></tr>)}</tbody></table></div></details></div></div>
      <section className="sentiment__prediction-block" aria-labelledby="sentiment-test-heading"><div className="sentiment__section-heading"><h2 id="sentiment-test-heading">Predict an unseen review</h2><p>Choose one of the seven source reviews to trace its word features through the saved model.</p></div>
        <div className="sentiment__review-select" role="group" aria-label="Select a test review">{workbook.test.map(row => <button type="button" key={row.row} aria-pressed={selectedRow === row.row} onClick={() => setSelectedRow(row.row)}>Review {row.row - 56}</button>)}</div>
        <div className="sentiment__selected-review"><div><span>Raw review · workbook row {selected.row}</span><blockquote>“{selected.raw}”</blockquote></div><div><span>Clean text</span><strong>{selected.clean}</strong></div></div>
        <BinaryFeatureTable review={selected} highlight caption="Unseen review represented with the same 25 binary word features used by the workbook model." />
        <div className="sentiment__prediction"><span>Workbook model output</span><strong>{(sourceOutput * 100).toFixed(2)}% positive</strong><div className="sentiment__probability-track" role="img" aria-label={`${(sourceOutput * 100).toFixed(2)} percent probability of positive sentiment`}><i style={{ width: `${Math.min(100, Math.max(0, sourceOutput * 100))}%` }} /></div><p>Using the sheet’s probability &gt; 0.5 rule, predicted class: <b>{output.prediction ? 'Positive' : 'Negative'}</b>. Sheet class output: <b>{selected.sheetClass ? 'Positive' : 'Negative'}</b>.</p><small>Recomputed from the saved coefficients: P(positive) = {output.probability.toFixed(9)}. The test-set class column repeats the model output; it is not an independent human label.</small><details className="sentiment__calculation-details"><summary>Trace this prediction</summary><p>Score = intercept {workbook.intercept.toFixed(4)}{contributions.map(item => ` ${item.value < 0 ? '−' : '+'} ${Math.abs(item.value).toFixed(4)} (${item.word})`).join('')} = {output.score.toFixed(4)}</p><p>Logistic score → P(positive) = {output.probability.toFixed(9)}.</p></details></div>
      </section>
      <details className="sentiment__details"><summary>Workbook test set · all 7 rows, features, predictions and sheet class outputs</summary><FullReviewTable rows={workbook.test} title="Sentiment Analysis sheet · rows 57–63. The final column is the thresholded model output, not a separate evaluation label." test /></details>
      <p className="sentiment__warning"><strong>One source boundary matters.</strong> The workbook does not preserve independent human labels for its seven test rows: AG57–AG58 calculate a class directly from the model probability, and the remaining cached classes match that rule. In the video, the instructor says a human might judge “It was OK, not great” as negative while the model predicts positive from <em>great</em>. Treat this as a plausible disagreement, not a measured test error.</p>
    </section>
  </article>
}
