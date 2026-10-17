import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import './ClassificationTrees.css'
import { binaryEntropy, weightedEntropyGain } from './ClassificationTreesMath'

type LessonProps = { number: string; title: string; lead: string; children: ReactNode }

function Lesson({ number, title, lead, children }: LessonProps) {
  return <article className="classification-trees" aria-labelledby={`ct-title-${number}`}>
    <header className="ct-header"><p className="ct-eyebrow">Chapter 09 · Lesson {number}</p><h1 id={`ct-title-${number}`}>{title}</h1><p>{lead}</p></header>
    {children}
  </article>
}

function Definition({ children, note }: { children: ReactNode; note: ReactNode }) {
  return <section className="ct-definition"><div><p className="ct-eyebrow">The central idea</p><h2>{children}</h2><p>{note}</p></div><div className="ct-definition-mark" aria-hidden="true"><span>Features · X</span><b>↓</b><span>Class · Y</span></div></section>
}

function Summary({ children }: { children: ReactNode }) {
  return <aside className="ct-summary"><span aria-hidden="true">✓</span><p>{children}</p></aside>
}

function fmt(value: number) { return value.toFixed(3) }

export function CLIntroDecisionTrees() {
  return <Lesson number="9" title="A decision tree asks a series of questions" lead="A tree turns labeled examples into a path of simple rules, then follows that path to predict a category for a new case.">
    <Definition note={<>Each rule tests one feature and divides the training records into two groups. The target (Y) is the class to predict; features (X) are the information used to make that prediction.</>}><strong>A decision tree</strong> predicts a category by applying a sequence of feature-based rules.</Definition>
    <section className="ct-panel" aria-labelledby="ct-tree-intro"><div className="ct-heading"><p className="ct-eyebrow">A small example · subscriber churn</p><h2 id="ct-tree-intro">Follow each rule from the root to a predicted class</h2><p>Suppose a subscription team wants to flag customers who may churn next month. The course example uses last login, age, lifetime value, and signup date to divide earlier customers by their observed churn labels.</p></div>
      <svg className="ct-tree-svg" viewBox="0 0 1000 490" role="img" aria-labelledby="ct-tree-title ct-tree-desc">
        <title id="ct-tree-title">Schematic decision tree for subscriber churn</title>
        <desc id="ct-tree-desc">Eight labeled arrows connect the root question to two decisions, each decision to its children, and the signup question to two leaves.</desc>
        <defs><marker id="ct-tree-arrow" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" /></marker></defs>
        <g className="ct-tree-edges" aria-hidden="true">
          <path d="M500 88 V112 H260 V145"/><path d="M500 112 H760 V145"/>
          <path d="M260 213 V242 H170 V278"/><path d="M260 242 H390 V278"/>
          <path d="M170 346 V388 H95 V415"/><path d="M170 388 H245 V415"/>
          <path d="M760 213 V278 H650 V315"/><path d="M760 278 H870 V315"/>
        </g>
        <g className="ct-tree-edge-labels" aria-hidden="true">
          <text x="363" y="108">No · 7 days or less</text><text x="637" y="108">Yes · more than 7 days</text>
          <text x="205" y="238">Yes · under $50</text><text x="332" y="238">No · $50 or more</text>
          <text x="125" y="385">Yes</text><text x="215" y="385">No</text>
          <text x="695" y="274">No · 35 or younger</text><text x="818" y="274">Yes · over 35</text>
        </g>
        <g className="ct-tree-node ct-tree-root"><rect x="365" y="20" width="270" height="68" rx="11"/><text className="ct-tree-kicker" x="500" y="45">ROOT · all training customers</text><text className="ct-tree-question" x="500" y="70">Last login more than 7 days ago?</text></g>
        <g className="ct-tree-node"><rect x="135" y="145" width="250" height="68" rx="11"/><text className="ct-tree-kicker" x="260" y="170">DECISION</text><text className="ct-tree-question" x="260" y="195">Lifetime value under $50?</text></g>
        <g className="ct-tree-node"><rect x="635" y="145" width="250" height="68" rx="11"/><text className="ct-tree-kicker" x="760" y="170">DECISION</text><text className="ct-tree-question" x="760" y="195">Age over 35?</text></g>
        <g className="ct-tree-node"><rect x="45" y="278" width="250" height="68" rx="11"/><text className="ct-tree-kicker" x="170" y="303">DECISION</text><text className="ct-tree-question" x="170" y="328">Signup more than 60 days ago?</text></g>
        <g className="ct-tree-leaf"><rect x="305" y="278" width="170" height="68" rx="11"/><text className="ct-tree-kicker" x="390" y="303">LEAF · course example</text><text className="ct-tree-outcome" x="390" y="330">Stay</text></g>
        <g className="ct-tree-leaf"><rect x="570" y="315" width="160" height="68" rx="11"/><text className="ct-tree-kicker" x="650" y="340">LEAF · schematic</text><text className="ct-tree-outcome" x="650" y="367">Stay</text></g>
        <g className="ct-tree-leaf ct-tree-leaf-gold"><rect x="790" y="315" width="160" height="68" rx="11"/><text className="ct-tree-kicker" x="870" y="340">LEAF · course example</text><text className="ct-tree-outcome" x="870" y="367">Churn</text></g>
        <g className="ct-tree-leaf"><rect x="20" y="415" width="150" height="68" rx="11"/><text className="ct-tree-kicker" x="95" y="440">LEAF · course path</text><text className="ct-tree-outcome" x="95" y="467">Stay</text></g>
        <g className="ct-tree-leaf ct-tree-leaf-gold"><rect x="170" y="415" width="150" height="68" rx="11"/><text className="ct-tree-kicker" x="245" y="440">LEAF · schematic</text><text className="ct-tree-outcome" x="245" y="467">Churn</text></g>
      </svg>
      <p className="ct-note"><strong>How to read it:</strong> start at the root, answer each question using the customer’s feature values, and follow the matching branch to its leaf. The source describes the 60-day path as Stay and the age-over-35 path as Churn. The opposite signup-date leaf is included only to illustrate how another split could end; its class was not reported in the course example. The diagram is schematic, not a fitted model.</p>
    </section>
    <section className="ct-why"><p className="ct-eyebrow">Why this is useful</p><h2>Simple rules can make a prediction easy to trace.</h2><p>A support team can see which questions led a customer to a churn prediction, such as a long time since login followed by an age threshold. During training, the computer tries many candidate rules and keeps splits that separate the observed classes well.</p></section>
    <Summary><strong>Remember:</strong> a tree repeatedly splits training records using feature-based rules. The path ends at a leaf, where the tree assigns a class based on the training labels that reached it.</Summary>
  </Lesson>
}

export function CLEntropy101() {
  const [yes, setYes] = useState(10)
  const total = 20
  const no = total - yes
  const h = binaryEntropy(yes, total)
  const entropyTerm = (count: number) => count === 0 ? '0' : `(${count}/20) log₂(${count}/20)`
  return <Lesson number="10" title="Entropy measures how mixed the classes are" lead="Before choosing a split, a tree needs a way to describe how uncertain the class labels are in a group of records.">
    <Definition note={<>For two classes, entropy ranges from <strong>0 bits</strong> (all records have the same label) to <strong>1 bit</strong> (the classes are split evenly). It describes label mixture, not whether a prediction is correct.</>}><strong>Entropy</strong> measures the uncertainty in a set of class labels: a mixed group has higher entropy, and a group with one class has zero entropy.</Definition>
    <section className="ct-panel" aria-labelledby="ct-entropy-control"><div className="ct-heading"><p className="ct-eyebrow">Change one class count</p><h2 id="ct-entropy-control">Move from a mixed group toward a pure group</h2><p>Imagine 20 past customer records. The target is whether each customer stayed or churned. Change how many of the 20 churned and watch the label balance and entropy update.</p></div>
      <div className="ct-entropy-demo"><div className="ct-balance" aria-label={`${yes} churn and ${no} stay labels`}><div className="ct-balance-bar"><span className="ct-bar-churn" style={{ width: `${yes / total * 100}%` }} /><span className="ct-bar-stay" style={{ width: `${no / total * 100}%` }} /></div><div className="ct-counts"><span><i className="ct-dot ct-dot--gold" />Churn: <strong>{yes}</strong> of 20</span><span><i className="ct-dot ct-dot--teal" />Stay: <strong>{no}</strong> of 20</span></div></div>
        <label className="ct-range-label" htmlFor="ct-entropy-range">Number labeled “Churn” <strong>{yes}</strong></label><input id="ct-entropy-range" type="range" min="0" max="20" step="1" value={yes} onChange={(event) => setYes(Number(event.target.value))} aria-valuetext={`${yes} churn labels out of 20`} />
        <div className="ct-formula"><div><span>Binary entropy</span><strong>H = −p<sub>churn</sub> log₂(p<sub>churn</sub>) − p<sub>stay</sub> log₂(p<sub>stay</sub>)</strong><small>When a probability is 0, its p log₂(p) term is defined as 0.</small></div><div className="ct-result"><span>Current calculation</span><strong>−{entropyTerm(yes)} − {entropyTerm(no)}</strong><b>{fmt(h)} bits</b></div></div>
        <div className="ct-entropy-scale"><span>0 · one class</span><div className="ct-scale-track"><i style={{ left: `${h * 100}%` }} /></div><span>1 · even split</span></div>
        <p className="ct-note" aria-live="polite">There are <strong>{yes} churn</strong> and <strong>{no} stay</strong> labels, so the group’s entropy is <strong>{fmt(h)} bits</strong>. {h === 0 ? 'Every record has the same class, so there is no label uncertainty.' : yes === 10 ? 'The classes are evenly balanced, which gives the greatest uncertainty for two classes.' : 'As the class balance moves away from 50/50, the label mixture becomes less uncertain.'}</p>
      </div>
    </section>
    <section className="ct-why"><p className="ct-eyebrow">Why a tree cares</p><h2>A useful split makes the child groups less mixed.</h2><p>If one branch contains mostly churn labels and another mostly stay labels, a tree can make more decisive predictions. Entropy puts a number on that change so candidate splits can be compared.</p></section>
    <Summary><strong>Remember:</strong> for two classes, entropy is 0 when a group is pure and reaches 1 bit when the labels are evenly split. The computer calculates it from the class proportions in each group.</Summary>
  </Lesson>
}

type SplitOption = 'gender' | 'login'
const splitExamples = {
  gender: { label: 'Gender', left: { name: 'Group A', positive: 5, negative: 5 }, right: { name: 'Group B', positive: 5, negative: 5 } },
  login: { label: 'Last login', left: { name: '7 days or less', positive: 4, negative: 8 }, right: { name: 'More than 7 days', positive: 6, negative: 2 } },
}

export function CLEntropyInformationGain() {
  const [selected, setSelected] = useState<SplitOption>('login')
  const example = splitExamples[selected]
  const beforeTotal = example.left.positive + example.left.negative + example.right.positive + example.right.negative
  const beforePositive = example.left.positive + example.right.positive
  const before = binaryEntropy(beforePositive, beforeTotal)
  const leftTotal = example.left.positive + example.left.negative
  const rightTotal = example.right.positive + example.right.negative
  const leftH = binaryEntropy(example.left.positive, leftTotal)
  const rightH = binaryEntropy(example.right.positive, rightTotal)
  const after = leftTotal / beforeTotal * leftH + rightTotal / beforeTotal * rightH
  const gain = weightedEntropyGain(beforePositive, beforeTotal, [example.left, example.right].map((branch) => ({ positive: branch.positive, total: branch.positive + branch.negative })))
  return <Lesson number="11" title="Information gain rewards a helpful split" lead="A candidate rule is useful when its child groups have less class uncertainty than the original group.">
    <Definition note={<>The tree compares candidate rules using <strong>gain = parent entropy − weighted child entropy</strong>. A larger positive gain means the split made the resulting groups more class-pure in this training set.</>}><strong>Information gain</strong> is the drop in entropy after a split, using the size-weighted entropy of its child groups.</Definition>
    <section className="ct-panel" aria-labelledby="ct-gain-demo"><div className="ct-heading"><p className="ct-eyebrow">Compare two candidate rules</p><h2 id="ct-gain-demo">Which feature better separates churn from stay?</h2><p>This small practice set has 20 customers, 10 churn and 10 stay. Select a candidate split to see the class counts, each branch’s entropy, and the weighted gain. These are teaching counts for this comparison.</p></div>
      <div className="ct-toggle" role="group" aria-label="Choose a candidate split"><button type="button" aria-pressed={selected === 'gender'} onClick={() => setSelected('gender')}>Split by gender</button><button type="button" aria-pressed={selected === 'login'} onClick={() => setSelected('login')}>Split by last login</button></div>
      <div className="ct-parent-card"><span>Before the split · 20 customers</span><strong>10 churn + 10 stay</strong><b>H(parent) = {fmt(before)} bits</b></div>
      <div className="ct-split-grid" aria-live="polite">{[example.left, example.right].map((branch) => { const n = branch.positive + branch.negative; const h = binaryEntropy(branch.positive, n); return <article className="ct-child-card" key={branch.name}><small>{example.label} branch</small><h3>{branch.name}</h3><div className="ct-mini-bar"><i className="ct-bar-churn" style={{ width: `${branch.positive / n * 100}%` }} /><i className="ct-bar-stay" style={{ width: `${branch.negative / n * 100}%` }} /></div><p><span>Churn</span><strong>{branch.positive}</strong><span>Stay</span><strong>{branch.negative}</strong></p><b>H = {fmt(h)} bits</b><small>Weight = {n}/20 of the original customers</small></article> })}</div>
      <div className="ct-gain-equation"><span>Weighted child entropy</span><strong>({leftTotal}/20 × {fmt(leftH)}) + ({rightTotal}/20 × {fmt(rightH)}) = {fmt(after)} bits</strong><span>Information gain</span><b>{fmt(before)} − {fmt(after)} = {fmt(gain)} bits</b></div>
      <p className="ct-note">{gain < 0.001 ? <><strong>This split does not help:</strong> each branch has the same 50/50 class mix as the parent, so the entropy stays the same and gain is zero.</> : <><strong>This split helps:</strong> the branches have different class mixes, so weighted child entropy is lower and information gain is positive. The computer can repeat this comparison at later nodes.</>}</p>
    </section>
    <Summary><strong>Remember:</strong> weight each child’s entropy by how many training records entered that branch. Information gain measures the total drop in uncertainty; comparing one branch alone can be misleading.</Summary>
  </Lesson>
}

type CustomerExample = { name: string; days: number; age?: number; value?: number; signupDays?: number }
const treeCustomers: CustomerExample[] = [
  { name: 'Customer A', days: 21, age: 52 },
  { name: 'Customer B', days: 3, value: 28, signupDays: 90 },
  { name: 'Customer C', days: 5, value: 70 },
  { name: 'Customer D', days: 21, age: 25 },
]

export function CLDecisionTreeExamples() {
  const [active, setActive] = useState(0)
  const customer = treeCustomers[active]
  const rootRight = customer.days > 7
  const ageOver35 = (customer.age ?? 0) > 35
  const valueUnder50 = (customer.value ?? 0) < 50
  const signupOver60 = (customer.signupDays ?? 0) > 60
  const leaf = rootRight ? (ageOver35 ? 'Churn' : 'Stay') : (valueUnder50 ? (signupOver60 ? 'Stay' : 'Churn') : 'Stay')
  const route = [
    { question: 'Last login > 7 days ago?', answer: rootRight ? 'Yes' : 'No' },
    ...(rootRight ? [{ question: 'Age > 35?', answer: ageOver35 ? 'Yes' : 'No' }] : [
      { question: 'Lifetime value < $50?', answer: valueUnder50 ? 'Yes' : 'No' },
      ...(valueUnder50 ? [{ question: 'Signup > 60 days ago?', answer: signupOver60 ? 'Yes' : 'No' }] : []),
    ]),
  ]
  return <Lesson number="12" title="A new case follows a path through the tree" lead="Once a tree has been trained, prediction means answering its feature questions in order until a leaf assigns a class.">
    <Definition note={<>A leaf may contain records from more than one class. In that case, a classifier usually predicts the <strong>majority class</strong> among the training examples in that leaf.</>}><strong>Training</strong> builds the tree’s feature rules from labeled examples. <strong>Prediction</strong> follows those rules for a new record and returns the class represented by its destination leaf.</Definition>
    <section className="ct-panel" aria-labelledby="ct-path-demo"><div className="ct-heading"><p className="ct-eyebrow">Trace an example</p><h2 id="ct-path-demo">Follow each answer, in order</h2><p>Choose a customer profile. Each answer follows directly from that customer’s feature values; the highlighted route ends at the predicted class.</p></div>
      <div className="ct-toggle" role="group" aria-label="Choose a customer profile">{treeCustomers.map((item, index) => <button type="button" key={item.name} aria-pressed={active === index} onClick={() => setActive(index)}>{item.name}</button>)}</div>
      <div className="ct-profile"><strong>{customer.name}</strong><span>Last login: {customer.days} days ago</span>{customer.age !== undefined && <span>Age: {customer.age} years</span>}{customer.value !== undefined && <span>Lifetime value: ${customer.value}</span>}{customer.signupDays !== undefined && <span>Signed up: {customer.signupDays} days ago</span>}</div>
      <div className="ct-journey" aria-live="polite" aria-label={`${customer.name} prediction path`}>{route.map((step, index) => <div className="ct-journey-part" key={step.question}><div className="ct-journey-node"><small>QUESTION {index + 1}</small><strong>{step.question}</strong><span>Answer: {step.answer}</span></div><i aria-hidden="true">→</i></div>)}<div className={`ct-journey-leaf ${leaf === 'Churn' ? 'is-churn' : 'is-stay'}`}><small>LEAF · prediction</small><strong>{leaf}</strong></div></div>
      <p className="ct-note"><strong>Notice the route:</strong> Customer A and Customer D both last logged in 21 days ago, but their different ages send them to different leaves. Only the features needed along the selected path are shown.</p>
    </section>
    <section className="ct-two-notes"><div><strong>How does the computer choose a numeric threshold?</strong><p>It evaluates candidate thresholds, such as age ≤ 35, and compares the resulting information gain.</p></div><div><strong>When should it stop splitting?</strong><p>Depth and minimum leaf-size settings can limit complexity. These are hyperparameters; tune them with validation data to reduce overfitting.</p></div></section>
    <Summary><strong>Remember:</strong> prediction is a sequence of feature checks. The leaf returns the class seen most often among the training examples that reached it.</Summary>
  </Lesson>
}

const forestVotes = [
  { name: 'Tree 1', vote: 'Churn' }, { name: 'Tree 2', vote: 'Stay' }, { name: 'Tree 3', vote: 'Churn' },
  { name: 'Tree 4', vote: 'Churn' }, { name: 'Tree 5', vote: 'Stay' }, { name: 'Tree 6', vote: 'Churn' }, { name: 'Tree 7', vote: 'Stay' },
]

export function CLRandomForests() {
  const [count, setCount] = useState(7)
  const votes = useMemo(() => forestVotes.slice(0, count), [count])
  const churn = votes.filter((item) => item.vote === 'Churn').length
  const stay = votes.length - churn
  const winner = churn === stay ? 'Tie' : churn > stay ? 'Churn' : 'Stay'
  return <Lesson number="13" title="A random forest combines many trees" lead="A single tree can depend heavily on early choices. A forest trains a collection of trees on varied samples and combines their predictions by voting.">
    <Definition note={<>For classification, each tree casts a class vote and the forest predicts the <strong>most common class</strong> (the mode of the votes). Variation helps reduce dependence on one tree’s choices.</>}><strong>A random forest</strong> combines predictions from many decision trees, each trained with randomness in the observations and candidate features.</Definition>
    <section className="ct-panel" aria-labelledby="ct-forest-vote"><div className="ct-heading"><p className="ct-eyebrow">One new subscriber · seven illustrative tree votes</p><h2 id="ct-forest-vote">The majority vote is the forest prediction</h2><p>Change how many votes are shown. These hand-written example votes explain the mechanism; they are not output from a trained forest.</p></div>
      <label className="ct-range-label" htmlFor="ct-forest-count">Trees included in this example <strong>{count}</strong></label><input id="ct-forest-count" type="range" min="1" max="7" step="2" value={count} onChange={(event) => setCount(Number(event.target.value))} aria-valuetext={`${count} illustrative tree votes`} />
      <div className="ct-vote-list">{votes.map((item) => <div className="ct-vote" key={item.name}><span>{item.name}</span><strong className={item.vote === 'Churn' ? 'is-churn' : 'is-stay'}>{item.vote}</strong></div>)}</div>
      <div className="ct-vote-result"><div><span>Votes</span><strong>{churn} Churn · {stay} Stay</strong></div><div><span>Forest prediction</span><strong>{winner}</strong></div></div>
    </section>
    <section className="ct-two-notes"><div><strong>Where does randomness enter?</strong><p>Each tree sees a random sample of training observations, and candidate features are randomly limited as the tree considers splits.</p></div><div><strong>Why not grow identical trees?</strong><p>Highly similar trees tend to make similar errors, so their votes add less new information. More varied trees make the combined vote more useful.</p></div></section>
    <Summary><strong>Remember:</strong> a forest is a collection of diverse trees. Each tree votes, and the most common class becomes the classification prediction.</Summary>
  </Lesson>
}

type TripRow = { id: string; newsletter: 0 | 1; facebook: 0 | 1; sessions: 0 | 1; subscribed: 0 | 1 }
const tripRows: TripRow[] = [
  { id: 'C01', newsletter: 1, facebook: 1, sessions: 1, subscribed: 1 }, { id: 'C02', newsletter: 0, facebook: 1, sessions: 1, subscribed: 1 },
  { id: 'C03', newsletter: 1, facebook: 0, sessions: 1, subscribed: 1 }, { id: 'C04', newsletter: 0, facebook: 0, sessions: 1, subscribed: 0 },
  { id: 'C05', newsletter: 1, facebook: 1, sessions: 0, subscribed: 1 }, { id: 'C06', newsletter: 0, facebook: 0, sessions: 0, subscribed: 0 },
  { id: 'C07', newsletter: 1, facebook: 0, sessions: 0, subscribed: 0 }, { id: 'C08', newsletter: 0, facebook: 1, sessions: 0, subscribed: 1 },
]

export function CLDecisionTreeCaseStudy() {
  const [feature, setFeature] = useState<keyof Pick<TripRow, 'newsletter' | 'facebook' | 'sessions'>>('sessions')
  const label = feature === 'sessions' ? 'More than 10 website sessions' : feature === 'newsletter' ? 'Subscribed to the newsletter' : 'Followed the Facebook page'
  const groups = [0, 1].map((value) => {
    const rows = tripRows.filter((row) => row[feature] === value)
    const positives = rows.filter((row) => row.subscribed === 1).length
    return { value, rows, positives, negatives: rows.length - positives, h: binaryEntropy(positives, rows.length) }
  })
  const beforePositive = tripRows.filter((row) => row.subscribed === 1).length
  const beforeH = binaryEntropy(beforePositive, tripRows.length)
  const afterH = groups.reduce((sum, group) => sum + group.rows.length / tripRows.length * group.h, 0)
  const gain = weightedEntropyGain(beforePositive, tripRows.length, groups.map((group) => ({ positive: group.positives, total: group.rows.length })))
  return <Lesson number="14" title="Case study: predicting paid subscriptions" lead="Trip Genie wants to understand which customer behaviors can help predict whether someone will subscribe to its paid travel service.">
    <Definition note={<>In the Trip Genie example, the target is whether a prospective traveler subscribes to the paid service. The features are customer behaviors recorded before that outcome.</>}><strong>A decision tree</strong> predicts a category by applying a sequence of feature-based rules.</Definition>
    <section className="ct-panel" aria-labelledby="ct-case-study"><div className="ct-heading"><p className="ct-eyebrow">Assignment and training data</p><h2 id="ct-case-study">Explore a small sample, then compare candidate splits</h2><p>Trip Genie connects global travelers with local guides and wants to predict paid subscriptions. The course walkthrough uses 50 customer records; this compact eight-row sample makes every count and calculation visible.</p></div>
      <div className="ct-table-wrap"><table className="ct-data-table"><caption>Illustrative Trip Genie training rows · 1 = yes, 0 = no</caption><thead><tr><th scope="col">Customer</th><th scope="col">Newsletter</th><th scope="col">Facebook</th><th scope="col">&gt;10 sessions</th><th scope="col">Subscribed · target</th></tr></thead><tbody>{tripRows.map((row) => <tr key={row.id}><th scope="row">{row.id}</th><td>{row.newsletter}</td><td>{row.facebook}</td><td>{row.sessions}</td><td className={row.subscribed ? 'is-positive' : 'is-negative'}>{row.subscribed ? 'Yes · 1' : 'No · 0'}</td></tr>)}</tbody></table></div>
      <div className="ct-case-target"><span>Target Y · paid subscription</span><strong>{beforePositive} subscribed · {tripRows.length - beforePositive} did not</strong><b>Before split: H = {fmt(beforeH)} bits</b></div>
      <p className="ct-eyebrow ct-case-label">Choose one feature to inspect</p><div className="ct-toggle" role="group" aria-label="Choose a Trip Genie feature">{(['newsletter', 'facebook', 'sessions'] as const).map((item) => <button type="button" aria-pressed={feature === item} key={item} onClick={() => setFeature(item)}>{item === 'newsletter' ? 'Newsletter' : item === 'facebook' ? 'Facebook follow' : '>10 sessions'}</button>)}</div>
      <p className="ct-case-feature"><strong>Feature X:</strong> {label}. The two branches divide these same customers by the selected 0/1 value.</p>
      <div className="ct-split-grid ct-case-groups" aria-live="polite">{groups.map((group) => <article className="ct-child-card" key={group.value}><small>Branch · {label}</small><h3>{group.value === 1 ? 'Yes · 1' : 'No · 0'} <span>({group.rows.length} customers)</span></h3><div className="ct-mini-bar"><i className="ct-bar-churn" style={{ width: `${group.rows.length ? group.positives / group.rows.length * 100 : 0}%` }} /><i className="ct-bar-stay" style={{ width: `${group.rows.length ? group.negatives / group.rows.length * 100 : 0}%` }} /></div><p><span>Subscribed</span><strong>{group.positives}</strong><span>Did not</span><strong>{group.negatives}</strong></p><b>H = {fmt(group.h)} bits</b></article>)}</div>
      <div className="ct-gain-equation"><span>Weighted entropy after split</span><strong>{groups.map((group) => `(${group.rows.length}/8 × ${fmt(group.h)})`).join(' + ')} = {fmt(afterH)} bits</strong><span>Information gain on this sample</span><b>{fmt(beforeH)} − {fmt(afterH)} = {fmt(gain)} bits</b></div>
      <p className="ct-note">{gain > 0.05 ? <><strong>What this split shows:</strong> this feature separates subscription labels in the teaching sample. A real model would test all candidate splits on its training data, then evaluate the selected model on held-out customers.</> : <><strong>What this split shows:</strong> this feature produces little class separation in the teaching sample. Try another feature and compare the weighted entropy.</>}</p>
    </section>
    <section className="ct-why"><p className="ct-eyebrow">From classroom example to business use</p><h2>Use the prediction to guide an action, then check it on new customers.</h2><p>A subscription team could use a validated model to decide which prospective customers might benefit from an invitation or onboarding help. A useful signal in a small training sample does not establish that the behavior causes a subscription or that the model will generalize.</p></section>
    <Summary><strong>Remember:</strong> define the customer-level target, compare feature splits by information gain, and test the finished model on records it did not learn from.</Summary>
  </Lesson>
}
