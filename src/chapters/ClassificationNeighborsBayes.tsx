import type { ReactNode } from 'react'
import './ClassificationNeighborsBayes.css'
export { KnnWorkbookCase as CLCaseKNN } from './KnnWorkbookCase'
import knnPage100 from '../assets/knn-page-100.png'
import knnPage101 from '../assets/knn-page-101.png'
import knnPage102 from '../assets/knn-page-102.png'

export { NaiveBayesWorkbookCase as CLCaseNaiveBayes } from './NaiveBayesWorkbookCase'
export { CLIntroNaiveBayes, CLNaiveBayesFrequencyTables, CLNaiveBayesConditionalProbability } from './BayesPdfLessons'

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
