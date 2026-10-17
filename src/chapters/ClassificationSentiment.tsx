import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import './ClassificationSentiment.css'

const words = ['hate', 'garbage', 'love', 'book', 'not', 'great'] as const
type Review = { id: string; text: string; sentiment: 'Negative' | 'Positive' }

const examples: Review[] = [
  { id: 'A', text: 'I hate this garbage', sentiment: 'Negative' },
  { id: 'B', text: 'I love this book', sentiment: 'Positive' },
  { id: 'C', text: 'This book is not great', sentiment: 'Negative' },
]

function cleanText(text: string, lowercase: boolean, punctuation: boolean) {
  let result = text
  if (lowercase) result = result.toLowerCase()
  if (punctuation) result = result.replace(/[.,!?;:"()[\]{}]/g, ' ').replace(/\s+/g, ' ').trim()
  return result
}

function hasWord(text: string, word: string) {
  const tokens: string[] = text.toLowerCase().match(/[a-z]+(?:'[a-z]+)?/g) ?? []
  return tokens.includes(word.toLowerCase())
}

function Header({ id, number, title, lead }: { id: string; number: string; title: string; lead: string }) {
  return <header className="sentiment__intro"><p className="sentiment__eyebrow">Chapter 09 · Classification Models · {number}</p><h1 id={id}>{title}</h1><p>{lead}</p></header>
}

function Definition({ label, children, note }: { label: string; children: ReactNode; note: string }) {
  return <section className="sentiment__definition"><div><p className="sentiment__eyebrow">{label}</p><h2>{children}</h2><p>{note}</p></div><div className="sentiment__definition-flow" aria-hidden="true"><span>Text</span><b>→</b><span>Class</span></div></section>
}

function Summary({ children }: { children: ReactNode }) {
  return <section className="sentiment__summary"><p className="sentiment__eyebrow">Carry this forward</p><h2>{children}</h2></section>
}

export function CLSentimentIntro() {
  return <article className="sentiment" aria-labelledby="sentiment-intro-title">
    <Header id="sentiment-intro-title" number="9.22" title="Can a review sound positive or negative?" lead="A reader may describe a book as “wonderful,” “disappointing,” or “not bad.” Sentiment analysis turns labeled text into a classification problem so a model can estimate the tone of a new review." />
    <Definition label="The central idea" note="It is a supervised task: people first label examples, then a model learns patterns that may help classify new text.">Sentiment analysis predicts the emotional tone or opinion expressed in text.</Definition>
    <section className="sentiment__panel" aria-labelledby="sentiment-intro-example"><div className="sentiment__section-heading"><p className="sentiment__eyebrow">A tiny review sample</p><h2 id="sentiment-intro-example">The label is the outcome we want to predict.</h2><p>Imagine an author sorting reader feedback about a new mystery novel. These short examples make the roles visible.</p></div>
      <div className="sentiment__review-pair">{examples.slice(0, 2).map(review => <div className="sentiment__review-card" key={review.id}><blockquote>“{review.text}”</blockquote><span className={review.sentiment === 'Positive' ? 'is-positive' : 'is-negative'}>{review.sentiment} · observed label</span></div>)}</div>
      <div className="sentiment__roles"><div><span className="sentiment__role-tag sentiment__role-tag--x">X · features</span><strong>The words in a review</strong><p>Text fields are prepared into inputs the model can use.</p></div><b aria-hidden="true">→</b><div><span className="sentiment__role-tag sentiment__role-tag--y">y · target</span><strong>Positive or negative</strong><p>A person supplies this label for training examples.</p></div><b aria-hidden="true">→</b><div><span className="sentiment__role-tag sentiment__role-tag--prediction">ŷ · prediction</span><strong>Estimated tone</strong><p>The model's output for a review it has not seen.</p></div></div>
      <p className="sentiment__caveat"><strong>Text classification sits within a wider language field.</strong> Sentiment analysis is often grouped under natural language processing (NLP), but here we focus on the supervised classification task.</p>
    </section>
    <Summary>Text becomes a classification problem when reviews are paired with clear human-assigned tone labels.</Summary>
  </article>
}

export function CLTextCleaning() {
  const [lowercase, setLowercase] = useState(true)
  const [punctuation, setPunctuation] = useState(true)
  const [removeNegation, setRemoveNegation] = useState(false)
  const raw = "I DON'T love this book... not at all!"
  const prepared = useMemo(() => {
    let value = cleanText(raw, lowercase, punctuation)
    if (removeNegation) value = value.replace(/\b(?:not|no|don't|doesn't|never)\b/gi, '').replace(/\s+/g, ' ').trim()
    return value
  }, [lowercase, punctuation, removeNegation])
  return <article className="sentiment" aria-labelledby="sentiment-cleaning-title">
    <Header id="sentiment-cleaning-title" number="9.23" title="Clean the text without erasing its meaning" lead="Reviews arrive with different capitalization, punctuation, typos, and word forms. Preparation can make useful patterns easier to recognize, but each change should fit the task." />
    <Definition label="The central idea" note="Cleaning is a preparation choice, not a universal recipe. Keep the original text so edits can be reviewed.">Text cleaning reduces noise while preserving information that matters for the classification task.</Definition>
    <section className="sentiment__panel" aria-labelledby="sentiment-cleaning-example"><div className="sentiment__section-heading"><p className="sentiment__eyebrow">Try a review snippet</p><h2 id="sentiment-cleaning-example">Switch common preparation steps on and off.</h2><p>Notice that changing case or punctuation leaves the message’s words intact. Removing negation can reverse what those words mean together.</p></div>
      <div className="sentiment__clean-controls" role="group" aria-label="Text cleaning options">
        <label><input type="checkbox" checked={lowercase} onChange={event => setLowercase(event.target.checked)} /> Normalize capitalization</label>
        <label><input type="checkbox" checked={punctuation} onChange={event => setPunctuation(event.target.checked)} /> Remove punctuation</label>
        <label className="sentiment__danger-option"><input type="checkbox" checked={removeNegation} onChange={event => setRemoveNegation(event.target.checked)} /> Remove negation words</label>
      </div>
      <div className="sentiment__clean-compare"><div><span>Original review</span><blockquote>“{raw}”</blockquote></div><b aria-hidden="true">→</b><div><span>Prepared text</span><blockquote>{prepared || '∅ (no words remain)'}</blockquote></div></div>
      <div className="sentiment__warning"><strong>Keep meaning in view.</strong><p>“I don't love this book” and “I love this book” differ by one small word. Removing “don't” destroys that distinction. A stop-word list or stemming rule should be checked against examples from the actual task.</p></div>
      <div className="sentiment__cleaning-notes"><p><strong>Common options:</strong> standardize case, handle punctuation and encoding, correct important spelling errors, remove task-specific noise, or reduce word forms with stemming/lemmatization.</p><p><strong>Check before applying:</strong> inspect what each rule changes, especially negation, names, slang, and meaningful punctuation.</p></div>
    </section>
    <Summary>Cleaning should make useful signals easier to learn while preserving context the model needs.</Summary>
  </article>
}

export function CLBagOfWords() {
  const [selected, setSelected] = useState('C')
  const review = examples.find(item => item.id === selected)!
  return <article className="sentiment" aria-labelledby="sentiment-bow-title">
    <Header id="sentiment-bow-title" number="9.24" title="Turn words into simple numeric features" lead="A numeric classifier needs a numeric representation of text. A bag of words creates numeric features from selected words in each review." />
    <Definition label="The central idea" note="A bag can record word counts; this example uses binary presence: 1 means a word appears at least once and 0 means it does not.">A bag-of-words representation turns each text into numeric features based on its selected words.</Definition>
    <section className="sentiment__panel" aria-labelledby="sentiment-bow-example"><div className="sentiment__section-heading"><p className="sentiment__eyebrow">Three short book reviews</p><h2 id="sentiment-bow-example">Select a review and trace its words into the feature table.</h2><p>Each row is one observation. The word columns are X features; the observed sentiment is y.</p></div>
      <div className="sentiment__review-select" role="group" aria-label="Select a review to inspect">{examples.map(item => <button key={item.id} type="button" aria-pressed={selected === item.id} onClick={() => setSelected(item.id)}>Review {item.id}</button>)}</div>
      <p className="sentiment__calculation"><strong>Selected text:</strong> “{review.text}” &nbsp; <strong>Present words:</strong> {words.filter(word => hasWord(review.text, word)).join(', ') || 'none from this feature list'}</p>
      <div className="sentiment__table-wrap"><table className="sentiment__table"><caption>Binary word-presence features computed from the example sentences.</caption><thead><tr><th scope="col">Review</th><th scope="col">Text</th>{words.map(word => <th className={hasWord(review.text, word) && selected === review.id ? 'is-selected-feature' : ''} key={word} scope="col">{word} · X</th>)}<th scope="col" className="is-target">Sentiment · y</th></tr></thead><tbody>{examples.map(item => <tr key={item.id} className={selected === item.id ? 'is-current' : ''}><th scope="row">{item.id}</th><td>{item.text}</td>{words.map(word => <td className={hasWord(item.text, word) ? 'is-present' : ''} key={`${item.id}-${word}`}>{hasWord(item.text, word) ? '1' : '0'}</td>)}<td className="is-target">{item.sentiment}</td></tr>)}</tbody></table></div>
      <p className="sentiment__warning"><strong>What the bag leaves out:</strong> word order, how often a word repeats, and context. “Not great” contains <em>great</em>, but the basic binary table cannot represent how “not” changes its meaning unless the feature design captures it.</p>
    </section>
    <Summary>Bag of words makes text countable, while leaving important parts of language outside this simple representation.</Summary>
  </article>
}

const caseTraining: Review[] = [
  { id: 'T1', text: 'I love this story', sentiment: 'Positive' },
  { id: 'T2', text: 'This book is great', sentiment: 'Positive' },
  { id: 'T3', text: 'I hate this story', sentiment: 'Negative' },
  { id: 'T4', text: 'This ending is terrible', sentiment: 'Negative' },
]
const caseTests: Review[] = [
  { id: 'N1', text: 'Not great after all', sentiment: 'Negative' },
  { id: 'N2', text: "I love it, not hate it", sentiment: 'Positive' },
]
const illustrativeWeights: Record<string, number> = { love: 1.2, great: 0.9, hate: -1.2, terrible: -1.1, not: -0.8 }
const caseFeatures = Object.keys(illustrativeWeights)
const sigmoid = (value: number) => 1 / (1 + Math.exp(-value))

export function CLSentimentCaseStudy() {
  const [selected, setSelected] = useState('N1')
  const [showLabels, setShowLabels] = useState(false)
  const review = caseTests.find(item => item.id === selected)!
  const present = Object.keys(illustrativeWeights).filter(word => hasWord(review.text, word))
  const score = present.reduce((sum, word) => sum + illustrativeWeights[word], 0)
  const probability = sigmoid(score)
  const predicted = probability >= 0.5 ? 'Positive' : 'Negative'
  return <article className="sentiment" aria-labelledby="sentiment-case-title">
    <Header id="sentiment-case-title" number="9.25" title="From reader feedback to a first text classifier" lead="You are the author of the fictional Bark Twain the Data Dog mystery series. Reviews of the newest book are arriving, and you want to organize their tone and prepare to score future feedback." />
    <Definition label="The central idea" note="A classifier learns patterns from examples with known labels, then estimates a class for a new review. Separate unseen reviews for evaluation.">Sentiment analysis uses labeled text to learn patterns for classifying the tone of new text.</Definition>
    <section className="sentiment__panel" aria-labelledby="sentiment-case-example"><div className="sentiment__section-heading"><p className="sentiment__eyebrow">The author’s assignment</p><h2 id="sentiment-case-example">Keep each step visible from raw text to a new prediction.</h2><p>Prepare reviews, assign sentiment labels, and see what a simple word-based model predicts.</p></div>
      <ol className="sentiment__pipeline"><li><strong>Training features + labels</strong><span>reviews become X; people provide y</span></li><li><strong>Fit model</strong><span>use labeled examples to choose parameters</span></li><li><strong>Model weights</strong><span>parameters used to score features</span></li><li><strong>Unseen text features</strong><span>represent a held-out review as X</span></li><li><strong>Prediction</strong><span>score features and apply a threshold</span></li><li><strong>Human-label comparison</strong><span>check the prediction against y</span></li></ol>
      <div className="sentiment__training-explainer"><strong>Why train?</strong><p>Training uses examples with known human labels (the feature inputs <b>X</b> and target labels <b>y</b>) to choose model parameters. Those parameters are then applied to features from a review the model has not seen.</p></div>
      <div className="sentiment__case-columns"><section><h3>Training input · features X and labels y</h3><p className="sentiment__small-note">Each row pairs binary word-presence features with a human-assigned target label.</p><div className="sentiment__table-wrap sentiment__training-table-wrap"><table className="sentiment__table sentiment__training-table"><caption>Four labeled examples showing the inputs a fitting step would use.</caption><thead><tr><th scope="col">ID</th><th scope="col">Review text</th>{caseFeatures.map(word => <th scope="col" key={word}>{word} · X</th>)}<th scope="col" className="is-target">Sentiment · y</th></tr></thead><tbody>{caseTraining.map(item => <tr key={item.id}><th scope="row">{item.id}</th><td>{item.text}</td>{caseFeatures.map(word => <td className={hasWord(item.text, word) ? 'is-present' : ''} key={`${item.id}-${word}`}>{hasWord(item.text, word) ? '1' : '0'}</td>)}<td className="is-target">{item.sentiment}</td></tr>)}</tbody></table></div><div className="sentiment__manual-weights"><h4>Example model weights · manually supplied</h4><p>These values illustrate what a fitted model's output could look like. They were <strong>not learned from the four rows above</strong>; no fitting is performed in this example.</p><div>{caseFeatures.map(word => <span key={word}><b>{word}</b><strong>{illustrativeWeights[word] > 0 ? '+' : ''}{illustrativeWeights[word].toFixed(1)}</strong></span>)}</div></div><p className="sentiment__small-note">In an actual fit, an algorithm would use the labeled feature rows to select weights that reduce prediction error.</p></section>
        <section><h3>Unseen review · prediction first</h3><div className="sentiment__review-select" role="group" aria-label="Select a held-out review">{caseTests.map(item => <button key={item.id} type="button" aria-pressed={selected === item.id} onClick={() => setSelected(item.id)}>Review {item.id}</button>)}</div><blockquote className="sentiment__new-review">“{review.text}”</blockquote><div className="sentiment__selected-features"><strong>Selected review features · X</strong><div>{caseFeatures.map(word => <span className={hasWord(review.text, word) ? 'is-on' : ''} key={word}><b>{word}</b><i>{hasWord(review.text, word) ? '1' : '0'}</i></span>)}</div></div><div className="sentiment__prediction"><span>Illustrative calculation using the manual weights above</span><strong>{Math.round(probability * 100)}% estimated positive</strong><div className="sentiment__probability-track" role="img" aria-label={`${Math.round(probability * 100)} percent estimated positive`}><i style={{ width: `${probability * 100}%` }} /></div><small>Score = {present.map(word => `${word} (${illustrativeWeights[word] > 0 ? '+' : ''}${illustrativeWeights[word]})`).join(' + ') || 'no matching features'} = {score.toFixed(1)}; logistic score → probability.</small><p className="sentiment__threshold">Decision rule: probability ≥ 50% → <b>Positive</b>; probability &lt; 50% → <b>Negative</b>. Predicted class: <strong className={predicted === 'Positive' ? 'is-positive' : 'is-negative'}>{predicted}</strong>.</p></div><label className="sentiment__label-toggle"><input type="checkbox" checked={showLabels} onChange={event => setShowLabels(event.target.checked)} /> Compare with the held-out human label</label>{showLabels && <div className="sentiment__heldout-labels"><p><strong>{review.id} human label:</strong> {review.sentiment} · {predicted === review.sentiment ? 'matches' : 'differs from'} the predicted class {predicted}. The label is revealed only after prediction.</p></div>}</section></div>
      <div className="sentiment__warning"><strong>A word list is not language understanding.</strong><p>In “Not great after all,” the positive word <em>great</em> can outweigh <em>not</em> in this simple example. In “I love it, not hate it,” separate word weights cannot tell which sentiment word is negated. Bag-of-words models miss order, scope, sarcasm and other context; compare predictions with unseen, human-labeled reviews before relying on them.</p></div>
    </section>
    <Summary>A useful sentiment workflow prepares text, defines labels, separates unseen reviews, and checks model errors before use.</Summary>
  </article>
}

