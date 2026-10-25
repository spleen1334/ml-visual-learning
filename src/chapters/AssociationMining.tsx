import { useMemo, useState } from 'react'
import './AssociationMining.css'
import { APRIORI_ITEMS } from './aprioriItemFrequencies'
import apriori20Source from '../assets/apriori-transactions-20-source.png'
import apriori10Source from '../assets/apriori-transactions-10-source.png'
import aprioriSupportSource from '../assets/apriori-support-threshold-source.png'

const Header = ({ eyebrow, title, intro }: { eyebrow: string; title: string; intro: string }) => <header className="assoc-header"><p className="assoc-eyebrow">{eyebrow}</p><h1>{title}</h1><p>{intro}</p></header>
const Note = ({ children }: { children: React.ReactNode }) => <aside className="assoc-note">{children}</aside>
const Metric = ({ label, children }: { label: string; children: React.ReactNode }) => <div className="assoc-metric"><span>{label}</span><strong>{children}</strong></div>

const aprioriRows = [
  ['Coffee', 'Bread', 'Below 1', 'Customers buying coffee were less likely to also buy bread in this sample.'],
  ['Coffee', 'Tea', '0.72', 'The workbook’s filtered pair calculation gives a lift of 0.7217.'],
  ['Coffee', 'Cake', '1.14', 'The case video reports a lift around 1.14.'],
  ['Coffee', 'Pastry', '1.54', 'The workbook’s calculation is about 1.54, above the independence reference of 1.'],
] as const

export function AssociationIntroduction() {
  return <article className="assoc-lesson"><Header eyebrow="19.1 · Association mining" title="Find items and states that tend to occur together" intro="This section studies two kinds of patterns: items in the same transaction and transitions between states over time." />
    <div className="assoc-methods"><section><span className="assoc-method-no">A</span><h2>Apriori · one basket</h2><p>Which products appear together in a single transaction?</p><div className="assoc-basket"><b>Basket 28</b><span>Coffee</span><span>Bread</span></div></section><section><span className="assoc-method-no">B</span><h2>Markov chain · next state</h2><p>After one purchase or state, what is observed next?</p><div className="assoc-flow"><span>First purchase</span><i aria-hidden="true">→</i><span>Later purchase</span></div></section></div>
  </article>
}

export function AssociationBasics() {
  return <article className="assoc-lesson"><Header eyebrow="19.2 · Association mining basics" title="Turn repeated co-occurrences into an if–then rule" intro="A basket analysis looks for products that are often purchased together, such as coffee and pastry." />
    <div className="assoc-rule"><span>IF</span><b>a customer buys coffee</b><span>THEN</span><b>they may also buy pastry</b></div>
    <section className="assoc-use-grid"><div><b>Recommend</b><p>Use purchase patterns to suggest another item.</p></div><div><b>Target an offer</b><p>Choose a promotion based on previous purchases.</p></div><div><b>Plan placement</b><p>Explore which products are often selected together.</p></div></section>
    <Note>These patterns describe association in the observed data. They do not show that buying one product caused someone to buy another.</Note>
  </article>
}

export function AprioriBasics() {
  return <article className="assoc-lesson"><Header eyebrow="19.3 · The Apriori algorithm" title="Measure how often items occur together" intro="Apriori compares how often an item appears, how often a pair appears, and how often the second item appears when the first is present." />
    <div className="assoc-formulas"><Metric label="Support of A">transactions with A ÷ all transactions</Metric><Metric label="Confidence A → B">support(A and B) ÷ support(A)</Metric><Metric label="Lift A ↔ B">support(A and B) ÷ [support(A) × support(B)]</Metric></div>
    <div className="assoc-lift-scale"><span>Lift below 1<br /><b>less co-occurrence</b></span><span>1<br /><b>independence reference</b></span><span>Lift above 1<br /><b>positive association</b></span></div>
    <Note>Confidence is directional: A → B and B → A can differ. Lift compares the joint support with what independence would predict.</Note>
  </article>
}

export function BasketAnalysisExample() {
  const [pair, setPair] = useState<'eggs' | 'basil' | 'water'>('eggs')
  const detail = {
    eggs: { label: 'Eggs', support: '7 / 20 = 0.35', joint: '6 / 20 = 0.30', confidence: '0.30 / 0.50 = 60%', lift: '0.30 / (0.50 × 0.35) = 1.7', n: '6 baskets', rows: [1, 3, 7, 9, 11, 13] },
    basil: { label: 'Basil', support: '5 / 20 = 0.25', joint: '1 / 20 = 0.05', confidence: '0.05 / 0.50 = 10%', lift: '0.05 / (0.50 × 0.25) = 0.4', n: '1 basket', rows: [5] },
    water: { label: 'Water', support: '1 / 20 = 0.05', joint: '1 / 20 = 0.05', confidence: '0.05 / 0.50 = 10%', lift: '0.05 / (0.50 × 0.05) = 2', n: '1 basket', rows: [17] },
  }[pair]
  return <article className="assoc-lesson"><Header eyebrow="19.4 · Basket analysis examples" title="Compare bacon with eggs, basil or water" intro="The course’s 20-basket example shows why confidence and lift need the support counts beside them." />
    <div className="assoc-control"><span>Compare bacon with</span>{(['eggs', 'basil', 'water'] as const).map((item) => <button key={item} className={pair === item ? 'is-active' : ''} onClick={() => setPair(item)}>{item}</button>)}</div>
    <div className="assoc-calc-grid"><Metric label="Support · bacon">10 / 20 = 0.50</Metric><Metric label={`Support · ${detail.label.toLowerCase()}`}>{detail.support}</Metric><Metric label="Support · both">{detail.joint}</Metric><Metric label="Confidence bacon → item">{detail.confidence}</Metric><Metric label="Lift">{detail.lift}</Metric><Metric label="Joint evidence">{detail.n}</Metric></div>
    <div className="assoc-joint-rows"><strong>Source rows with bacon and {detail.label.toLowerCase()}</strong><div>{detail.rows.map((row) => <span key={row}>Transaction {row}</span>)}</div></div>
    {pair === 'water' ? <Note>Lift is 2, but the pair appears in just one of 20 transactions. A high lift from such sparse evidence can be misleading; check frequency and context before acting.</Note> : <Note>{pair === 'eggs' ? 'Six of the ten bacon baskets also contain eggs. Lift above 1 indicates positive co-occurrence in this sample.' : 'Only one basket contains both bacon and basil; lift below 1 indicates less co-occurrence than the independence reference.'}</Note>}
    <figure className="assoc-source-figure assoc-source-table-20"><img src={apriori20Source} alt="Source table with all 20 numbered transactions and the original illustrated first and second item columns. Unfamiliar product icons remain unlabeled as shown in the course PDF." /><figcaption>All 20 source transactions, in the original order. The row numbers above identify the selected bacon pair within this table.</figcaption></figure>
  </article>
}

export function MinimumSupport() {
  return <article className="assoc-lesson"><Header eyebrow="19.5 · Minimum support thresholds" title="Filter rare items before interpreting a strong lift" intro="In the course’s 20-basket example, a support cutoff near 0.15 removes low-volume purchases before comparing pairs." />
    <figure className="assoc-source-figure assoc-source-support"><img src={aprioriSupportSource} alt="Source support-frequency bar chart: vertical axis is Support from 0 to 0.5, with 12 illustrated item categories in descending frequency and an annotated drop-off where support equals 0.15." /><figcaption>Source support-frequency visual. The 0.15 cutoff is an example-specific choice for these 20 transactions.</figcaption></figure>
    <Note>At the source cutoff, transactions 4, 6, 8, 10, 15 and 17 are filtered because they contain items with support below 0.15. The separate water example shows why sparse evidence matters: bacon and water occur once, even though their lift is 2.</Note>
  </article>
}

export function InfrequentItemsets() {
  const [pruned, setPruned] = useState(false)
  const items = ['Chocolate', 'Cheese', 'Banana', 'Bread']
  const pairs = ['Chocolate + Cheese', 'Chocolate + Banana', 'Chocolate + Bread', 'Cheese + Banana', 'Cheese + Bread', 'Banana + Bread']
  const triples = ['Chocolate + Cheese + Banana', 'Chocolate + Cheese + Bread', 'Chocolate + Banana + Bread', 'Cheese + Banana + Bread']
  return <article className="assoc-lesson"><Header eyebrow="19.6 · Infrequent itemsets" title="Prune combinations that contain an infrequent item" intro="Four products create 15 non-empty itemsets. Apriori uses subset frequency to avoid checking every larger combination." />
    <div className="assoc-prune-control"><span>Source example: Cheese is below the minimum support.</span><button onClick={() => setPruned((value) => !value)}>{pruned ? 'Show all itemsets' : 'Prune cheese itemsets'}</button></div>
    <div className="assoc-itemset-columns"><div><h2>Single items</h2>{items.map((x) => <span className={pruned && x === 'Cheese' ? 'is-pruned' : ''} key={x}>{x}</span>)}</div><div><h2>Pairs</h2>{pairs.map((x) => <span className={pruned && x.includes('Cheese') ? 'is-pruned' : ''} key={x}>{x}</span>)}</div><div><h2>Three items</h2>{triples.map((x) => <span className={pruned && x.includes('Cheese') ? 'is-pruned' : ''} key={x}>{x}</span>)}</div><div><h2>Four items</h2><span className={pruned ? 'is-pruned' : ''}>Chocolate + Cheese + Banana + Bread</span></div></div>
    <Note>If an itemset is infrequent, every larger set containing it is also infrequent because those transactions are a subset. Pruning cheese removes 1 single, 3 pairs, 3 triples and the four-item set.</Note>
  </article>
}

export function MultipleItemSets() {
  return <article className="assoc-lesson"><Header eyebrow="19.7 · Multiple item sets" title="Treat a group of items as the rule’s starting set" intro="The source example uses ten transactions to compare {bacon, eggs} with coffee." />
    <div className="assoc-triplet"><div><span>Starting set</span><strong>Bacon + eggs</strong><b>3 / 10 = 0.30</b></div><i aria-hidden="true">→</i><div><span>Possible next item</span><strong>Coffee</strong><b>4 / 10 = 0.40</b></div><i aria-hidden="true">→</i><div><span>All three together</span><strong>Bacon + eggs + coffee</strong><b>2 / 10 = 0.20</b></div></div>
    <div className="assoc-result"><Metric label="Confidence {bacon, eggs} → coffee">0.20 / 0.30 ≈ 67%</Metric><Metric label="Lift">0.20 / (0.30 × 0.40) ≈ 1.7</Metric></div>
    <figure className="assoc-source-figure assoc-source-table-10"><img src={apriori10Source} alt="Source table of all ten numbered transactions with three illustrated item columns. The original icons and blank cells are preserved without adding names for unfamiliar products." /><figcaption>All ten source transactions, in the original order. The calculation uses the source counts shown above: three with bacon and eggs, four with coffee, and two with all three.</figcaption></figure>
    <Note>The rule conditions on both bacon and eggs appearing together. The ten-row example is small and illustrative; computer search is needed for a large set of possible combinations.</Note>
  </article>
}

export function AprioriCaseStudy() {
  const [selected, setSelected] = useState(1)
  const [threshold, setThreshold] = useState(0.04)
  const pair = aprioriRows[selected]
  return <article className="assoc-lesson"><Header eyebrow="19.8 · CASE STUDY Apriori" title="Coastal Roasters: find products bought in the same visit" intro="As the bakery owner, review 9,531 transactions from six months and use the patterns to inform product placement and promotions." />
    <div className="assoc-case-facts"><Metric label="Transactions">9,531</Metric><Metric label="Distinct items">94</Metric><Metric label="Items per transaction">Up to 5</Metric></div>
    <div className="assoc-threshold-case"><label>Support threshold <strong>{threshold.toFixed(2)}</strong><input type="range" min="0.04" max="0.20" step="0.16" value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} /></label><div><b>{threshold === 0.04 ? '5,238' : '2,739'}</b><span>{threshold === 0.04 ? 'transactions retained in the workbook case' : 'transactions retained at 0.20 in the video demonstration'}</span></div></div>
    <div className="assoc-case-layout"><div className="assoc-bars assoc-case-bars" role="img" aria-label="Support values for the 50 most popular products in the workbook"><h2>Support · top 50 products</h2>{APRIORI_ITEMS.slice(0, 50).map((row) => <div className="assoc-bar-row" key={row.item}><span>{row.item}</span><div><i style={{ width: `${row.support / APRIORI_ITEMS[0].support * 100}%` }} /></div><strong>{row.support.toFixed(3)}</strong></div>)}</div>
    <div className="assoc-pair-picker"><label>Inspect a source pair<select value={selected} onChange={(e) => setSelected(Number(e.target.value))}>{aprioriRows.map(([a, b], i) => <option value={i} key={`${a}-${b}`}>{a} + {b}</option>)}</select></label><div className="assoc-pair-callout"><span>Source result</span><strong>{pair[2]}</strong><p>{pair[3]}</p></div></div></div>
    <div className="assoc-table-scroll assoc-apriori-table"><table><caption>All 94 item frequencies in workbook order</caption><thead><tr><th>Item</th><th>Transactions</th><th>Support</th></tr></thead><tbody>{APRIORI_ITEMS.map((row) => <tr key={row.item}><th>{row.item}</th><td>{row.count.toLocaleString()}</td><td>{row.support.toFixed(3)}</td></tr>)}</tbody></table></div>
    <Note>Pair results shown here are from the workbook’s .04 setting; changing the threshold above only contrasts the two retained-row counts shown in the source demonstration. Workbook caveat: single-item supports use all 9,531 transactions, while its joint-support formula divides by the 5,238 filtered rows. These are worksheet results with inconsistent support denominators. The video’s coffee–cake and coffee–pastry lift values are approximate. A lift above 1 indicates positive co-occurrence in this sample, not causation.</Note>
  </article>
}

const states = ['Gold', 'Silver', 'Churn'] as const
const subscription = [[.80, .15, .05], [.20, .40, .40], [.01, .30, .69]]

export function MarkovChains() {
  const [active, setActive] = useState(0)
  return <article className="assoc-lesson"><Header eyebrow="19.9 · Markov chains" title="Read a transition row from the current state" intro="A Markov chain summarizes how a categorical state changes from one time point to the next. Rows show where people start; columns show their next state." />
    <div className="assoc-state-tabs">{states.map((state, i) => <button className={active === i ? 'is-active' : ''} key={state} onClick={() => setActive(i)}>Start at {state.toLowerCase()}</button>)}</div>
    <div className="assoc-transition"><div><span>Current state</span><strong>{states[active]}</strong></div><i aria-hidden="true">→</i>{states.map((state, i) => <div className={i === active ? 'is-same' : ''} key={state}><span>Next {state.toLowerCase()}</span><strong>{Math.round(subscription[active][i] * 100)}%</strong></div>)}</div>
    <div className="assoc-markov-matrix"><table><caption>Course’s illustrative monthly subscription transitions</caption><thead><tr><th>From \ To</th>{states.map((state) => <th key={state}>{state}</th>)}</tr></thead><tbody>{states.map((state, i) => <tr className={i === active ? 'is-active' : ''} key={state}><th>{state}</th>{subscription[i].map((p, j) => <td key={j}>{Math.round(p * 100)}%</td>)}</tr>)}</tbody></table></div>
    <Note>Each row totals 100% because this example assigns every customer to a known next state. The numbers are pretend teaching data, not an estimate from the workbook case.</Note>
  </article>
}

const products = ['Bike', 'Bike basket', 'Bike speaker', 'Tent', 'Backpack', 'Cookware', 'Cooler', 'No second purchase'] as const
const customers = ['Bike', 'Bike basket', 'Bike speaker', 'Tent', 'Backpack', 'Cookware', 'Cooler'] as const
const transitionCounts = [
  [71,136,138,8,11,16,9,316],
  [70,271,401,12,31,19,20,530],
  [72,154,29,13,44,21,11,1139],
  [20,15,35,173,589,747,180,125],
  [70,29,24,163,839,20,35,1793],
  [27,28,37,652,83,934,962,347],
  [27,22,35,282,133,561,953,936],
]
const rowTotals = transitionCounts.map((row) => row.reduce((sum, value) => sum + value, 0))

export function MarkovCaseStudy() {
  const [start, setStart] = useState(0)
  const [mode, setMode] = useState<'probability' | 'frequency'>('probability')
  const results = useMemo(() => transitionCounts[start].map((count) => mode === 'frequency' ? count : count / rowTotals[start]), [start, mode])
  const predicted = results.indexOf(Math.max(...results))
  return <article className="assoc-lesson"><Header eyebrow="19.10 · CASE STUDY Markov chains" title="Alpine Supplies: see what customers buy next" intro="As Senior Web Analyst, use 14,418 customer purchase paths to summarize a first purchase and a separate later purchase." />
    <div className="assoc-case-facts"><Metric label="Customer records">14,418</Metric><Metric label="Starting products">7</Metric><Metric label="Possible outcomes">7 products + no second purchase</Metric></div>
    <div className="assoc-control"><span>Show</span><button className={mode === 'probability' ? 'is-active' : ''} onClick={() => setMode('probability')}>Row probabilities</button><button className={mode === 'frequency' ? 'is-active' : ''} onClick={() => setMode('frequency')}>Frequencies</button></div>
    <div className="assoc-control assoc-row-picker"><span>First purchase</span>{customers.map((name, i) => <button className={start === i ? 'is-active' : ''} key={name} onClick={() => setStart(i)}>{name}</button>)}</div>
    <div className="assoc-prediction"><span>Most likely next outcome after {customers[start].toLowerCase()}</span><strong>{products[predicted]}</strong><b>{mode === 'probability' ? `${(results[predicted] * 100).toFixed(1)}%` : `${results[predicted].toLocaleString()} customers`}</b></div>
    <div className="assoc-transition-bars" role="img" aria-label={`${mode === 'probability' ? 'Probability' : 'Frequency'} by next purchase after ${customers[start]}`}>
      <h2>{mode === 'probability' ? 'Next-purchase probabilities' : 'Transition counts'} · after {customers[start].toLowerCase()}</h2>
      {products.map((product, i) => <div className="assoc-bar-row" key={product}><span>{product}</span><div><i className={i === predicted ? 'is-predicted' : ''} style={{ width: `${mode === 'probability' ? results[i] * 100 : results[i] / Math.max(...results) * 100}%` }} /></div><strong>{mode === 'probability' ? `${(results[i] * 100).toFixed(1)}%` : results[i].toLocaleString()}</strong></div>)}
    </div>
    <div className="assoc-table-scroll assoc-full-matrix"><table><caption>{mode === 'probability' ? 'Full workbook probability matrix; each starting row sums to 100%' : 'Full workbook transition frequency matrix'}</caption><thead><tr><th>First purchase ↓ / next →</th>{products.map((p) => <th key={p}>{p}</th>)}</tr></thead><tbody>{customers.map((customer, r) => <tr className={start === r ? 'is-active' : ''} key={customer}><th>{customer}</th>{transitionCounts[r].map((count, c) => <td key={c}>{mode === 'probability' ? `${(count / rowTotals[r] * 100).toFixed(1)}%` : count.toLocaleString()}</td>)}</tr>)}</tbody></table></div>
    <Note>The full table keeps the workbook’s eight outcomes, including no second purchase. For a first bike purchase, the workbook counts 71 bikes, 136 bike baskets, 138 bike speakers, 8 tents, 11 backpacks, 16 cookware, 9 coolers and 316 with no second purchase. Bike speaker is the most likely product outcome (138 / 705 = 19.6%); “no second purchase” is more common overall (316 / 705 = 44.8%).</Note>
  </article>
}

export function AssociationTakeaways() {
  return <article className="assoc-lesson"><Header eyebrow="19.11 · Key takeaways" title="Choose the method that matches the question" intro="Both methods summarize patterns in data; they differ in what counts as an observation and what relationship they describe." />
    <div className="assoc-compare"><section><h2>Apriori</h2><b>Within a transaction</b><p>Which products co-occur in one basket?</p><span>Support · confidence · lift</span></section><section><h2>Markov chain</h2><b>Across ordered time points</b><p>Given a current state, what state comes next?</p><span>Transition frequencies · row probabilities</span></section></div>
    <Note>Use the results as evidence for further investigation. Purchase patterns alone do not show why a customer acted or prove that a proposed promotion will work.</Note>
  </article>
}

const quiz = [
  ['Association mining is commonly used for what type of analysis?', ['Basket analysis', 'Forecasting', 'Sentiment analysis', 'Outlier detection'], 0, 'Basket analysis examines which products appear in the same transaction.'],
  ['Which use case fits association mining?', ['Finding cross-sectional outliers', 'Recommending products from prior purchases', 'Natural language processing', 'Detecting seasonality'], 1, 'Purchase co-occurrence can inform product recommendations.'],
  ['Which metric is transactions containing an item divided by all transactions?', ['Lift', 'Confidence', 'Frequency', 'Support'], 3, 'Support reports an item or itemset’s frequency across transactions.'],
  ['Which metric is P(B | A) for items in one transaction?', ['Lift', 'Confidence', 'Frequency', 'Support'], 1, 'Confidence A→B divides joint support by support(A).'],
  ['Which metric compares joint support with support(A) × support(B)?', ['Lift', 'Confidence', 'Error', 'Support'], 0, 'Lift uses the product of individual supports as the independence reference.'],
  ['What can filter rare items before examining rules?', ['Outlier filters', 'Lift minimums', 'Minimum support thresholds', 'Confidence bounds'], 2, 'A support threshold removes infrequent items/itemsets.'],
  ['What usually indicates positive co-occurrence relative to independence?', ['Confidence > 1', 'Lift > 1', 'Confidence < 1', 'Lift < 1'], 1, 'Lift above 1 indicates positive association in the sample; check support and context too.'],
  ['What does the Apriori principle say about a superset of an infrequent itemset?', ['It must also be infrequent', 'It is a Markov state', 'It must be frequent', 'It establishes causation'], 0, 'A superset cannot occur more often than one of its subsets.'],
  ['When are Markov chains especially useful?', ['Time-ordered state transitions', 'Unordered numeric values', 'One cross-sectional snapshot', 'Text sentiment labels only'], 0, 'Markov transitions describe categorical states over time.'],
  ['Markov chains describe transitions between which variable’s states?', ['Numerical', 'Categorical', 'Boolean only', 'Continuous'], 1, 'States are categories, such as subscription tiers or products.'],
] as const

export function AssociationQuiz() {
  const [answers, setAnswers] = useState<Record<number, number>>({})
  return <article className="assoc-lesson"><Header eyebrow="19.12 · Optional quiz" title="Check the chapter’s key distinctions" intro="Choose an answer to see a source-based explanation. You can change any response; this quiz does not gate lessons." />
    <div className="assoc-quiz">{quiz.map(([question, options, correct, explanation], index) => <fieldset key={question}><legend>{index + 1}. {question}</legend>{options.map((option, i) => <label className={answers[index] === i ? (i === correct ? 'is-correct' : 'is-wrong') : ''} key={option}><input type="radio" name={`assoc-q-${index}`} checked={answers[index] === i} onChange={() => setAnswers((prev) => ({ ...prev, [index]: i }))} />{option}</label>)}{answers[index] !== undefined && <p className="assoc-feedback">{answers[index] === correct ? 'Correct. ' : `The source answer is “${options[correct]}.” `}{explanation}</p>}</fieldset>)}</div>
  </article>
}
