import { Fragment, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import './ClassificationNeighborsBayes.css'
export { KnnWorkbookCase as CLCaseKNN } from './KnnWorkbookCase'
import knnPage100 from '../assets/knn-page-100.png'
import knnPage101 from '../assets/knn-page-101.png'
import knnPage102 from '../assets/knn-page-102.png'

type Customer = { id: number; newsletter: 0 | 1; facebook: 0 | 1; website: 0 | 1; purchase: 0 | 1 }
const customers: Customer[] = [
  { id: 1, newsletter: 0, facebook: 1, website: 0, purchase: 1 }, { id: 2, newsletter: 0, facebook: 0, website: 1, purchase: 0 },
  { id: 3, newsletter: 0, facebook: 0, website: 0, purchase: 0 }, { id: 4, newsletter: 0, facebook: 0, website: 0, purchase: 0 },
  { id: 5, newsletter: 1, facebook: 1, website: 1, purchase: 1 }, { id: 6, newsletter: 0, facebook: 0, website: 1, purchase: 0 },
  { id: 7, newsletter: 0, facebook: 0, website: 1, purchase: 0 }, { id: 8, newsletter: 1, facebook: 0, website: 1, purchase: 1 },
  { id: 9, newsletter: 0, facebook: 1, website: 1, purchase: 0 }, { id: 10, newsletter: 0, facebook: 1, website: 0, purchase: 0 },
  { id: 11, newsletter: 0, facebook: 1, website: 0, purchase: 0 }, { id: 12, newsletter: 0, facebook: 0, website: 1, purchase: 0 },
  { id: 13, newsletter: 1, facebook: 1, website: 1, purchase: 1 }, { id: 14, newsletter: 1, facebook: 0, website: 0, purchase: 0 },
  { id: 15, newsletter: 0, facebook: 1, website: 0, purchase: 0 }, { id: 16, newsletter: 0, facebook: 1, website: 1, purchase: 1 },
  { id: 17, newsletter: 0, facebook: 1, website: 0, purchase: 0 }, { id: 18, newsletter: 0, facebook: 0, website: 1, purchase: 0 },
  { id: 19, newsletter: 1, facebook: 0, website: 1, purchase: 1 }, { id: 20, newsletter: 1, facebook: 1, website: 0, purchase: 0 },
]
const bayesFeatures = [
  { id: 'newsletter', label: 'Subscribed to newsletter' },
  { id: 'facebook', label: 'Followed Facebook page' },
  { id: 'website', label: 'Visited website' },
] as const
type BayesFeature = typeof bayesFeatures[number]['id']
type BayesCase = Record<BayesFeature, 0 | 1>

function Header({ lesson, title, lead }: { lesson: number; title: string; lead: string }) {
  return <header className="cnb__header"><p className="cnb__eyebrow">Chapter 09 · Classification Models · 9.{lesson}</p><h1 id={`cnb-lesson-${lesson}-title`}>{title}</h1><p>{lead}</p></header>
}
function Definition({ title, text, mark }: { title: string; text: string; mark: string }) {
  return <section className="cnb__definition"><div><p className="cnb__eyebrow">The central idea</p><h2>{title}</h2><p>{text}</p></div><div className="cnb__mark" aria-hidden="true">{mark}</div></section>
}
function Why({ title, children }: { title: string; children: ReactNode }) {
  return <section className="cnb__why"><p className="cnb__eyebrow">Why it is useful</p><h2>{title}</h2><p>{children}</p></section>
}
function Summary({ children }: { children: ReactNode }) {
  return <aside className="cnb__summary"><p className="cnb__eyebrow">Remember</p><p>{children}</p></aside>
}
export function CLCommonClassificationModels() {
  const methods = [
    { name: 'K-nearest neighbors', idea: 'Vote among similar, labeled examples.', question: 'Who behaves like this customer?' },
    { name: 'Naive Bayes', idea: 'Combine class frequencies and feature likelihoods.', question: 'How probable is each class given these clues?' },
    { name: 'Decision tree', idea: 'Follow a sequence of feature-based splits.', question: 'Which path through simple rules fits?' },
    { name: 'Random forest', idea: 'Combine predictions from many decision trees.', question: 'What do many varied trees decide together?' },
    { name: 'Logistic regression', idea: 'Estimate class probability from a weighted feature combination.', question: 'How does each input shift the odds?' },
    { name: 'Sentiment classification', idea: 'Apply classification to text features to predict a tone or emotion label.', question: 'Is this response positive, neutral, or negative?' },
  ]
  return <article className="cnb" aria-labelledby="cnb-lesson-1-title"><Header lesson={1} title="A map of common classification models" lead="A classification method predicts a category: a subscriber may stay or churn, a track may be skipped or played, and a message may be spam or legitimate." />
    <Definition title="Classification predicts the class value of a categorical target." text="The model learns from labeled examples and assigns a class to a new case. Different techniques represent and combine the evidence in different ways." mark="Features → class" />
    <Why title="Choose a model to answer a real decision question.">A support team might flag possible churn; a music service might predict whether a listener will skip a track; a trust team might review a potentially fraudulent transaction. The target class and available data shape which model is worth trying.</Why>
    <section className="cnb__panel"><div className="cnb__section-heading"><p className="cnb__eyebrow">Five model families and one classification application</p><h2>Different model families find class patterns in different ways.</h2></div><div className="cnb__method-grid">{methods.map((method, index) => <article className="cnb__method" key={method.name}><span className="cnb__method-num">0{index + 1}</span><h3>{method.name}</h3><p>{method.idea}</p><small>{method.question}</small></article>)}</div><p className="cnb__note"><strong>Keep the goal in view:</strong> the five named model families predict categories. Sentiment analysis is a classification application that can use another model, such as logistic regression.</p></section>
    <Summary>Classification predicts a categorical label. KNN, naive Bayes, trees, forests, logistic regression, and text sentiment each offer a different route from evidence to class.</Summary></article>
}

function KNNTieIllustration() {
  return <figure className="cnb__mini-visual">
    <figcaption>Illustrative tie · 3 votes each, different total distances</figcaption>
    <div className="cnb__distance-comparison">
      <div><strong>Purchase · 3 neighbors</strong><div className="cnb__distance-segments">{[1, 2, 3].map(value => <span key={value} style={{ flex: value }}>{value}</span>)}</div><b>1 + 2 + 3 = 6</b></div>
      <div><strong>No Purchase · 3 neighbors</strong><div className="cnb__distance-segments is-other">{[2, 3, 4].map(value => <span key={value} style={{ flex: value }}>{value}</span>)}</div><b>2 + 3 + 4 = 9</b></div>
    </div>
    <p className="cnb__visual-result">Same vote count → shorter total distance → <strong>Purchase</strong></p>
    <small>Each segment is one neighbor’s distance to the new observation, in the same scaled units. Hand-set values demonstrate the course’s tie rule; they are not measurements from the plot above.</small>
  </figure>
}

function KNNChoiceIllustration() {
  return <figure className="cnb__mini-visual">
    <figcaption>Illustrative validation results · same 100 held-out cases</figcaption>
    <div className="cnb__k-comparison">{[{ k: 1, correct: 78 }, { k: 3, correct: 86 }, { k: 5, correct: 91 }, { k: 9, correct: 84 }].map(({ k, correct }) => <div key={k} className={k === 5 ? 'is-best' : ''}><strong>K = {k}</strong><div className="cnb__accuracy-track"><span style={{ width: correct + '%' }} /></div><b>{correct}/100 correct · {correct}%</b>{k === 5 && <em>Best of these candidates</em>}</div>)}</div>
    <p className="cnb__visual-result">Compare on validation data → <strong>choose K = 5 here</strong> → evaluate once on test data</p>
    <small>Hand-set scores explain the selection process. K = 5 is not a general recommendation; another dataset can favor another K.</small>
  </figure>
}

function KNNFeaturesIllustration() {
  return <figure className="cnb__mini-visual">
    <figcaption>Illustrative distance with three numerical features</figcaption>
    <div className="cnb__table-wrap"><table className="cnb__table"><caption>All inputs below have already been scaled using training data.</caption><thead><tr><th scope="col">Observation</th><th scope="col">Age</th><th scope="col">Income</th><th scope="col">Visits</th></tr></thead><tbody><tr><th scope="row">New customer</th><td>0.2</td><td>0.6</td><td>0.1</td></tr><tr><th scope="row">Known customer A</th><td>0.5</td><td>0.2</td><td>0.1</td></tr><tr className="cnb__feature-differences"><th scope="row">Difference · A − new</th><td>0.3</td><td>−0.4</td><td>0</td></tr></tbody></table></div>
    <div className="cnb__feature-contributions"><span>Age<br /><strong>0.3² = 0.09</strong></span><b>+</b><span>Income<br /><strong>(−0.4)² = 0.16</strong></span><b>+</b><span>Visits<br /><strong>0² = 0</strong></span><b>→</b><span>Distance<br /><strong>√0.25 = 0.5</strong></span></div>
    <p className="cnb__visual-result">Each extra numerical feature adds another squared difference under the square root.</p>
    <small>Hand-set values. Repeat for every known customer, rank the distances, and let the K nearest labels vote—no multidimensional plot required.</small>
  </figure>
}

export function CLIntroKNN() {
  return <article className="cnb cnb--source-examples" aria-labelledby="cnb-lesson-2-title">
    <header className="cnb__header"><p className="cnb__eyebrow">Chapter 09 · Classification Models · 9.2</p><h1 id="cnb-lesson-2-title">K-Nearest Neighbors (KNN)</h1><p className="cnb__knn-intro"><strong>KNN predicts a new observation’s class from its K closest labeled examples.</strong> K is the number of neighbors considered. Compare their input values, find the nearest neighbors, and predict the most common class among them.</p></header>
    <img src={knnPage100} width={1440} height={1010} alt="Course page 100: age 28, household income $85,000, K = 10. The highlighted neighbors include 9 purchases and 1 no purchase, predicting Purchase. The source calls the 90% neighbor vote share confidence." />
    <img src={knnPage101} width={1440} height={1010} alt="Course page 101: age 44, household income $40,000, K = 20. The highlighted neighbors include 14 no purchases and 6 purchases, predicting No Purchase. The source calls the 70% neighbor vote share confidence." />
    <aside className="cnb__summary"><p><strong>Read the percentages as neighbor vote shares.</strong> In the first example, 9 of 10 neighbors purchased: 90% of the votes. This does not establish a 90% chance that the prediction is correct.</p></aside>
    <Summary>Compare the new observation with labeled examples, select the K nearest, and predict their most common class.</Summary>
  </article>
}

export function CLKNNExamples() {
  return <article className="cnb cnb--source-examples" aria-labelledby="cnb-lesson-3-title">
    <Header lesson={3} title="KNN: ties, choosing K, and more features" lead="The basic neighbor vote is simple. This example introduces a tie, followed by three practical questions about using KNN." />
    <img src={knnPage102} width={1440} height={1010} alt="Course page 102: age 50, household income $80,000, K = 6. Three neighbors purchased and three did not: the vote is tied, so a tie-breaking rule is needed." />
    <section className="cnb__knn-explanations" aria-label="Ties, choosing K, and multiple features">
      <section><h2>What if there’s a tie?</h2><p>This example has <strong>3 Purchase and 3 No Purchase</strong> neighbors. The course breaks this tie by comparing each tied class’s <strong>total distance to the new observation</strong>: the class with the shorter total wins.</p><p>This is one possible tie-breaking rule. Choose the rule in advance; KNN implementations can handle ties differently.</p><KNNTieIllustration /></section>
      <section><h2>How do we choose the right value for K?</h2><p>Try <strong>several K values</strong> and compare how accurately they predict labels on <strong>validation data</strong> or through cross-validation. Select K using those results, then evaluate the chosen model on a separate test set.</p><p>A small K uses a very local neighborhood; a larger K includes more observations and can smooth over local patterns.</p><KNNChoiceIllustration /></section>
      <section><h2>What if we have more than two input variables?</h2><p>The customer scatter plots use two input variables, or <strong>features</strong>: age and household income. More features add more dimensions, which become difficult to visualize together.</p><p>A computer can still calculate distances using <strong>many features</strong> and apply the same nearest-neighbor logic. Scale numerical features appropriately so larger units do not dominate the distance.</p><KNNFeaturesIllustration /></section>
    </section>
    <Summary>Define how ties are resolved, choose K using validation data, and compare scaled feature values—even when there are too many features to plot.</Summary>
  </article>
}

export function CLIntroNaiveBayes() {
  return <article className="cnb" aria-labelledby="cnb-lesson-5-title"><Header lesson={5} title="Use observed frequencies to compare class likelihoods" lead="Naive Bayes classifies a case by combining how common each class is with how often its observed features occur within that class." />
    <Definition title="Naive Bayes applies Bayes’ rule with a simplifying assumption that features are conditionally independent given the class." text="For a class C and features x₁…xₙ, compare P(C) × P(x₁|C) × … × P(xₙ|C), then normalize the class scores to sum to 1." mark="Prior × evidence" />
    <Why title="It can turn several simple clues into a useful class comparison.">For an email marked as spam or legitimate, the model can compare word patterns learned from labeled messages. In the customer example that follows, the clues are newsletter signup, following a page, and visiting a site; the target is whether a purchase occurred.</Why>
    <section className="cnb__panel"><div className="cnb__section-heading"><p className="cnb__eyebrow">The calculation in one view</p><h2>Start with the class prior, multiply feature likelihoods, then normalize.</h2></div><div className="cnb__bayes-flow"><div><span>1 · Prior</span><strong>P(Purchase)</strong><small>How common is the class overall?</small></div><b>×</b><div><span>2 · Likelihoods</span><strong>P(clue | class)</strong><small>How often does each clue appear within the class?</small></div><b>→</b><div><span>3 · Compare</span><strong>Normalize</strong><small>Turn class scores into values that sum to 1.</small></div></div><div className="cnb__term-strip"><article><strong>Prior</strong><span>Purchase = 1 appears in 6 of 20 records: 6/20.</span></article><article><strong>Likelihood</strong><span>Newsletter = 1 appears in 4 of 6 purchasers: 4/6.</span></article><article><strong>Normalized class score</strong><span>For this one clue: Purchase score 0.20 ÷ (0.20 + 0.10) = 66.7%.</span></article></div><p className="cnb__note"><strong>Why “naive”?</strong> Newsletter signup, following a social page, and visiting a website may be related behaviors. Treating them as conditionally independent is a simplifying assumption, not a claim about how customers actually behave.</p><p className="cnb__note"><strong>Small-data caution:</strong> zero counts can force a raw class score to zero. Smoothing is often used in practical implementations; this 20-row illustration shows unsmoothed workbook calculations and should not be read as a reliable business estimate.</p></section>
    <Summary>Naive Bayes compares classes using their prior frequencies and the likelihood of each feature value within each class, under a conditional independence assumption.</Summary></article>
}

function frequency(feature: BayesFeature, value: 0 | 1, purchase: 0 | 1) {
  return customers.filter(row => row[feature] === value && row.purchase === purchase).length
}
function conditional(feature: BayesFeature, value: 0 | 1, purchase: 0 | 1) {
  const total = customers.filter(row => row.purchase === purchase).length
  return { numerator: frequency(feature, value, purchase), denominator: total, probability: frequency(feature, value, purchase) / total }
}

export function CLNaiveBayesFrequencyTables() {
  return <article className="cnb" aria-labelledby="cnb-lesson-6-title"><Header lesson={6} title="Count feature values inside each class" lead="Before turning frequencies into probabilities, count how often each observed feature value appears among customers who purchased and those who did not." />
    <Definition title="A frequency table counts records for combinations of feature value and class." text="For each input, count 0 and 1 separately among Purchase = 1 and Purchase = 0. These counts supply the denominators for conditional probabilities." mark="Count by class" />
    <Why title="Counts make the model’s evidence visible before any multiplication.">If people who visited the site appear more often among purchasers, that pattern contributes to a purchase score. A frequency table also shows how much data supports a pattern: four customers is a small count, even if the proportion looks large.</Why>
    <section className="cnb__panel"><div className="cnb__section-heading"><p className="cnb__eyebrow">Cat Slacks workbook · 20 customer records</p><h2>Each row is one customer; the target is a recorded purchase.</h2><p>The feature columns are binary flags. The workbook has 6 purchasers and 14 non-purchasers. This tiny sample is for tracing the arithmetic, not fitting a meaningful business model.</p></div>
      <div className="cnb__counts"><div><span>Purchase = 1</span><strong>6</strong><small>customers · prior = 6/20 = 30%</small></div><div><span>Purchase = 0</span><strong>14</strong><small>customers · prior = 14/20 = 70%</small></div><div><span>All observations</span><strong>20</strong><small>records in the workbook example</small></div></div>
      <div className="cnb__bayes-evidence-layout"><div className="cnb__evidence-block"><div><p className="cnb__eyebrow">The numerator and denominator come from these records</p><h3>Among the six purchasers, four had newsletter = 1.</h3><p>Each row below is one of the six Purchase = 1 records. The six rows form the denominator; the four highlighted newsletter values form the numerator.</p></div><div className="cnb__table-wrap"><table className="cnb__table cnb__evidence-table"><caption>Purchase records used for P(Newsletter = 1 | Purchase = 1)</caption><thead><tr><th scope="col">Customer</th><th scope="col">Newsletter</th><th scope="col">Purchase</th></tr></thead><tbody>{customers.filter(row => row.purchase === 1).map(row => <tr key={row.id} className={row.newsletter === 1 ? 'is-numerator' : ''}><th scope="row">{row.id}</th><td><span className={row.newsletter === 1 ? 'cnb__evidence-value is-included' : 'cnb__evidence-value'}>{row.newsletter}</span></td><td><span className="cnb__evidence-value is-denominator">1</span></td></tr>)}</tbody></table></div></div>
      <div className="cnb__table-wrap"><table className="cnb__table cnb__frequency-table"><caption>Customer feature-value counts grouped by target class</caption><thead><tr><th scope="col">Feature value</th><th scope="col">Purchased · Y=1</th><th scope="col">No purchase · Y=0</th></tr></thead><tbody>{bayesFeatures.map(feature => <Fragment key={feature.id}><tr><th scope="row">{feature.label} = 1</th><td>{frequency(feature.id, 1, 1)}</td><td>{frequency(feature.id, 1, 0)}</td></tr><tr><th scope="row">{feature.label} = 0</th><td>{frequency(feature.id, 0, 1)}</td><td>{frequency(feature.id, 0, 0)}</td></tr></Fragment>)}</tbody></table></div></div>
      <p className="cnb__calculation"><strong>Read across the rows:</strong> {customers.filter(row => row.newsletter === 1 && row.purchase === 1).length} of the 6 purchaser rows have Newsletter = 1, so P(Newsletter = 1 | Purchase = 1) = 4/6. These same records are summarized in the frequency table.</p>
    </section><Summary>Frequency tables count the observed feature values within each target class. In this workbook, 6 of 20 customers purchased; the small counts keep every calculation inspectable.</Summary></article>
}

export function CLNaiveBayesConditionalProbability() {
  const [feature, setFeature] = useState<BayesFeature>('newsletter')
  const item = bayesFeatures.find(value => value.id === feature)!
  const yes = [0, 1].map(value => conditional(feature, value as 0 | 1, 1))
  const no = [0, 1].map(value => conditional(feature, value as 0 | 1, 0))
  return <article className="cnb" aria-labelledby="cnb-lesson-7-title"><Header lesson={7} title="Turn class counts into conditional probabilities" lead="A conditional probability answers: among cases in a known class, how often did we observe this feature value? The class after the vertical bar supplies the denominator." />
    <Definition title="P(X = x | Y = y) is the share of class y records where feature X equals x." text="Read the vertical bar as ‘given’. For example, P(Newsletter = 1 | Purchase = 1) is the number of newsletter subscribers who purchased divided by all purchasers." mark="Given → divide" />
    <Why title="Use the class as the denominator so you compare like with like.">When asking whether newsletter signup is common among purchasers, divide by the number of purchasers. Dividing by all customers would answer a different question: how common that combination is in the entire sample.</Why>
    <section className="cnb__panel"><div className="cnb__section-heading"><p className="cnb__eyebrow">Choose a feature from the workbook</p><h2>Follow the denominator in both class columns.</h2></div><div className="cnb__select-row"><label htmlFor="cnb-feature">Feature</label><select id="cnb-feature" value={feature} onChange={event => setFeature(event.target.value as BayesFeature)}>{bayesFeatures.map(value => <option key={value.id} value={value.id}>{value.label}</option>)}</select></div>
      <p className="cnb__formula" aria-live="polite"><strong>Example:</strong> P({item.label} = 1 | Purchase = 1) = {yes[1].numerator}/{yes[1].denominator} = {(yes[1].probability * 100).toFixed(1)}%.</p>
      <div className="cnb__probability-grid"><article><h3>Given Purchase = 1</h3><p>Denominator: {yes[0].denominator} purchasers</p><div className="cnb__prob-row"><span>{item.label} = 1</span><b>{yes[1].numerator}/{yes[1].denominator}</b><strong>{(yes[1].probability * 100).toFixed(1)}%</strong></div><div className="cnb__prob-row"><span>{item.label} = 0</span><b>{yes[0].numerator}/{yes[0].denominator}</b><strong>{(yes[0].probability * 100).toFixed(1)}%</strong></div><small>These two probabilities add to 100%.</small></article><article><h3>Given Purchase = 0</h3><p>Denominator: {no[0].denominator} non-purchasers</p><div className="cnb__prob-row"><span>{item.label} = 1</span><b>{no[1].numerator}/{no[1].denominator}</b><strong>{(no[1].probability * 100).toFixed(1)}%</strong></div><div className="cnb__prob-row"><span>{item.label} = 0</span><b>{no[0].numerator}/{no[0].denominator}</b><strong>{(no[0].probability * 100).toFixed(1)}%</strong></div><small>These two probabilities add to 100%.</small></article></div>
      <p className="cnb__calculation"><strong>Check the denominator:</strong> {yes[1].numerator} of {yes[1].denominator} purchasers had {item.label.toLowerCase()} = 1. Among non-purchasers, {no[1].numerator} of {no[1].denominator} had that same feature value.</p>
    </section><Summary>Conditional probability divides a feature-and-class count by the total records in that class. The denominator changes with the condition after the bar.</Summary></article>
}

function bayesScores(input: BayesCase) {
  return ([1, 0] as const).map(purchase => {
    const prior = customers.filter(row => row.purchase === purchase).length / customers.length
    const parts = bayesFeatures.map(feature => {
      const result = conditional(feature.id, input[feature.id], purchase)
      return { label: feature.label, value: input[feature.id], numerator: result.numerator, denominator: result.denominator, probability: result.probability }
    })
    return { purchase, prior, parts, raw: prior * parts.reduce((product, part) => product * part.probability, 1) }
  })
}

export function CLCaseNaiveBayes() {
  const [input, setInput] = useState<BayesCase>({ newsletter: 0, facebook: 0, website: 0 })
  const scores = useMemo(() => bayesScores(input), [input])
  const total = scores.reduce((sum, score) => sum + score.raw, 0)
  const purchaseScore = scores[0]
  const noPurchaseScore = scores[1]
  const normalizedPurchase = purchaseScore.raw / total
  const setFeature = (feature: BayesFeature, value: 0 | 1) => setInput(current => ({ ...current, [feature]: value }))
  return <article className="cnb" aria-labelledby="cnb-lesson-8-title"><Header lesson={8} title="Case study: compare purchase likelihoods" lead="Assignment: use customer interactions to estimate whether a customer will purchase the cat clothing brand’s products. We can trace every count, conditional probability, and normalized score." />
    <Definition title="Naive Bayes combines the purchase prior with each observed feature’s within-class probability." text="For a new customer, calculate one score for Purchase and one for No purchase. Normalize by their sum to compare the two classes. The independence assumption makes the multiplication manageable, but it may not match real customer behavior." mark="Prior × clues" />
    <Why title="Marketing can inspect how a combination of observed actions changes the model’s class comparison.">The teaching dataset records 20 customers, whether they subscribed to the newsletter, followed the Facebook page, visited the website, and purchased. Twenty records are far too few for a trustworthy marketing decision; they let us audit the arithmetic step by step.</Why>
    <section className="cnb__panel"><div className="cnb__section-heading"><p className="cnb__eyebrow">Cat Slacks workbook · 20 customers</p><h2>Set the new customer’s three observed interactions.</h2><p>Each switch changes one binary feature. Watch both class scores update from the same prior and conditional frequency tables.</p></div>
      <div className="cnb__case-controls">{bayesFeatures.map(feature => <div className="cnb__binary-control" key={feature.id}><span>{feature.label}</span><div role="group" aria-label={feature.label}>{([0, 1] as const).map(value => <button type="button" key={value} aria-pressed={input[feature.id] === value} onClick={() => setFeature(feature.id, value)}>{value === 1 ? 'Yes · 1' : 'No · 0'}</button>)}</div></div>)}</div>
      <div className="cnb__input-summary" aria-live="polite"><strong>New case:</strong> {bayesFeatures.map(feature => `${feature.label} = ${input[feature.id]}`).join(' · ')}</div>
      <div className="cnb__score-cards"><ScoreCard title="Purchase = 1" score={purchaseScore} normalized={normalizedPurchase} /><ScoreCard title="Purchase = 0" score={noPurchaseScore} normalized={1 - normalizedPurchase} /></div>
      <p className="cnb__calculation"><strong>Normalization:</strong> {purchaseScore.raw.toFixed(6)} ÷ ({purchaseScore.raw.toFixed(6)} + {noPurchaseScore.raw.toFixed(6)}) = {(normalizedPurchase * 100).toFixed(1)}% purchase score. The no-purchase score is the remainder, {(100 - normalizedPurchase * 100).toFixed(1)}%.</p>
      <p className="cnb__note"><strong>Interpret with care:</strong> the normalized score is a model calculation from these 20 workbook rows under the naive independence assumption. It is not a validated probability that a real person will buy, and associations in the table do not prove that an interaction causes a purchase.</p>
    </section><Summary>Compare class scores by multiplying each class prior by its feature likelihoods, then divide by the sum. The visible workbook calculation is useful for learning; reliable decisions require more representative data and validation.</Summary></article>
}

function ScoreCard({ title, score, normalized }: { title: string; score: ReturnType<typeof bayesScores>[number]; normalized: number }) {
  return <article className="cnb__score-card"><div><h3>{title}</h3><strong>{(normalized * 100).toFixed(1)}%</strong><span>normalized score</span></div><p className="cnb__score-product">Prior {(score.prior * 100).toFixed(0)}% × {score.parts.map(part => `${part.numerator}/${part.denominator}`).join(' × ')} = {score.raw.toFixed(6)}</p><ul>{score.parts.map(part => <li key={part.label}><span>{part.label} = {part.value} | {title}</span><b>{part.numerator}/{part.denominator} = {(part.probability * 100).toFixed(1)}%</b></li>)}</ul></article>
}
