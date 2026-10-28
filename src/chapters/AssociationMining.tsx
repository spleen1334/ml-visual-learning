import { useMemo, useState } from 'react'
import './AssociationMining.css'
import { APRIORI_ITEMS } from './aprioriItemFrequencies'
import apriori20Source from '../assets/apriori-transactions-20-source.png'
import apriori10Source from '../assets/apriori-transactions-10-source.png'
import aprioriNetworkSource from '../assets/apriori-network-source.png'
import markovSubscriptionNetwork from '../assets/markov-subscription-network.png'
import baconIcon from '../assets/apriori-icon-bacon.png'
import eggsIcon from '../assets/apriori-icon-eggs.png'
import coffeeIcon from '../assets/apriori-icon-coffee.png'
import basilIcon from '../assets/apriori-icon-basil.png'
import waterIcon from '../assets/apriori-icon-water.png'
import basketAssociationIllustration from '../assets/association-basket-basics.svg'
import { APRIORI_TRANSACTIONS, APRIORI_TRANSACTION_COUNT, MARKOV_CUSTOMER_STATES, MARKOV_RECORDS, MARKOV_STATES, calculateSelectedPair, filterAprioriTransactions, getMarkovOutcomeCounts, getMarkovTransitionCounts, getTopProductPrediction } from './associationWorkbook'

const Header = ({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) => <header className="assoc-header"><p className="assoc-eyebrow">{eyebrow}</p><h1>{title}</h1>{subtitle && <p className="assoc-header-subtitle">{subtitle}</p>}</header>
const Note = ({ children }: { children: React.ReactNode }) => <aside className="assoc-note">{children}</aside>
const Metric = ({ label, children }: { label: string; children: React.ReactNode }) => <div className="assoc-metric"><span>{label}</span><strong>{children}</strong></div>
const AssocFraction = ({ numerator, denominator }: { numerator: React.ReactNode; denominator: React.ReactNode }) => <span className="assoc-fraction"><span>{numerator}</span><span>{denominator}</span></span>
const ItemIcon = ({ src, label }: { src: string; label: string }) => <img className="assoc-item-icon" src={src} alt={label} />

const excelDate = (serial: number) => new Date(Date.UTC(1899, 11, 30) + Math.floor(serial) * 86400000).toISOString().slice(0, 10)
const excelTime = (fraction: number) => new Date(Math.round(fraction * 86400000)).toISOString().slice(11, 19)
const displayProduct = (value: string) => value === '-' ? 'No second purchase' : value.replace(/\b\w/g, (letter) => letter.toUpperCase())
const PAGE_SIZE = 50

export function AssociationIntroduction() {
  return <article className="assoc-lesson assoc-introduction">
    <Header eyebrow="19.1 · Introduction" title="Association Mining" />
    <p className="assoc-intro-description">In this section we’ll introduce the fundamentals of <strong>association mining</strong> and <strong>basket analysis</strong>, and compare common techniques including Apriori and Markov Chains.</p>
    <div className="assoc-intro-overview">
      <section className="assoc-intro-topics" aria-labelledby="assoc-intro-topics-heading">
        <h2 id="assoc-intro-topics-heading">Topics we’ll cover</h2>
        <ul>
          <li>Association Mining Basics</li>
          <li>Apriori</li>
          <li>Markov Chains</li>
          <li>Key Takeaways</li>
        </ul>
      </section>
      <section className="assoc-intro-goals" aria-labelledby="assoc-intro-goals-heading">
        <h2 id="assoc-intro-goals-heading">Goals for this section</h2>
        <ul>
          <li>Understand the basics of association mining and introduce several <strong>real-world use cases</strong>.</li>
          <li>Explore common association mining techniques like Apriori and Markov Chains.</li>
          <li>Compare and contrast common unsupervised models for basket analysis, including when to use each and their strengths and weaknesses.</li>
        </ul>
      </section>
    </div>
  </article>
}

export function AssociationBasics() {
  return <article className="assoc-lesson"><Header eyebrow="19.2 · Association mining basics" title="Association Mining Basics" subtitle="Association mining reveals patterns, relationships and correlations in data, then translates them into if–then association rules." />
    <section className="assoc-basics-definition"><div className="assoc-basics-copy"><p><strong>IF</strong> a customer buys product A, <strong>THEN</strong> they are likely to buy product B.</p><p>It is often applied to <strong>transactional data</strong> to find products purchased together—this is called <strong>basket analysis</strong>.</p></div><figure className="assoc-basics-illustration"><img src={basketAssociationIllustration} alt="A basket holds two different products in one transaction, with a linking line showing their association." /></figure></section>
    <section className="assoc-use-grid assoc-source-use-cases" aria-labelledby="assoc-use-cases-heading"><h2 id="assoc-use-cases-heading">Common use cases</h2><div><b>Recommendation systems</b><p>Build product recommendations, as with Amazon or Netflix.</p></div><div><b>Targeted offers</b><p>Send product offers based on purchase history.</p></div><div><b>Store layout</b><p>Optimize physical store layouts to maximize cross-selling between products.</p></div></section>
    <Note><strong>Association is not causation.</strong> These patterns identify correlations in large datasets; they do not explain why a customer bought an item.</Note>
  </article>
}

export function AprioriBasics() {
  const baskets = [
    ...Array.from({ length: 6 }, (_, i) => ({ id: i, type: 'both' })),
    ...Array.from({ length: 4 }, (_, i) => ({ id: i + 6, type: 'a-only' })),
    { id: 10, type: 'b-only' },
    ...Array.from({ length: 9 }, (_, i) => ({ id: i + 11, type: 'neither' })),
  ] as const
  return <article className="assoc-lesson"><Header eyebrow="19.3 · Apriori algorithm" title="The Apriori Algorithm" subtitle="Apriori analyzes which products are frequently purchased together in a single transaction—for example, beer and diapers, or peanut butter and jelly." />
    <section className="assoc-apriori-concept"><h2>Start with two items</h2><p>For a two-item set, compare transactions containing <strong>item A</strong>, <strong>item B</strong>, and <strong>both A and B</strong>. This shows how often the items occur together and helps measure the strength of their association.</p></section>
    <figure className="assoc-basket-visual" role="img" aria-label="Twenty source transactions: six contain both bacon and eggs, four contain bacon only, one contains eggs only, and nine contain neither. Each tile represents one transaction.">
      <figcaption><strong>One tile = one transaction</strong><span>Which baskets contain bacon (A), eggs (B), or both?</span></figcaption>
      <div className="assoc-basket-tiles">{baskets.map((basket) => <i className={`is-${basket.type}`} key={basket.id} />)}</div>
      <div className="assoc-basket-legend"><span><i className="is-both" />A ∩ B · both <strong>6</strong></span><span><i className="is-a-only" />A only <strong>4</strong></span><span><i className="is-b-only" />B only <strong>1</strong></span><span><i className="is-neither" />Neither <strong>9</strong></span></div>
    </figure>
    <p className="assoc-formula-key"><strong>A</strong> = bacon · <strong>B</strong> = eggs · <strong>A ∩ B</strong> = one transaction contains both · <strong>N</strong> = all 20 transactions</p>
    <section className="assoc-metric-definitions" aria-label="Apriori metrics">
      <article className="assoc-formula-row"><h2>Support</h2><div><div className="assoc-equation" role="math" aria-label="Support of A equals the number of transactions containing A divided by the total number of transactions"><span>Support(A) = </span><span className="assoc-fraction"><span>transactions containing A</span><span>all transactions</span></span></div><p>How often an item or itemset appears in all transactions.</p></div></article>
      <article className="assoc-formula-row"><h2>Confidence</h2><div><div className="assoc-equation" role="math" aria-label="Confidence of A to B equals transactions containing both A and B divided by transactions containing A"><span>Confidence(A → B) = </span><span className="assoc-fraction"><span>transactions containing A ∩ B</span><span>transactions containing A</span></span></div><p>Of the transactions with A, the share that also contain B.</p></div></article>
      <article className="assoc-formula-row"><h2>Lift</h2><div><div className="assoc-equation" role="math" aria-label="Lift of A to B equals support of both A and B divided by support of A times support of B"><span>Lift(A → B) = </span><span className="assoc-fraction"><span>Support(A ∩ B)</span><span>Support(A) × Support(B)</span></span></div><p>Compares joint support with the support expected if A and B were independent.</p></div></article>
    </section>
  </article>
}

export function BasketAnalysisExample() {
  const [pair, setPair] = useState<'eggs' | 'basil' | 'water'>('eggs')
  const detail = {
    eggs: { label: 'Eggs', icon: eggsIcon, itemCount: 7, jointCount: 6, confidence: 60, lift: 1.7, rows: [1, 3, 7, 9, 11, 13] },
    basil: { label: 'Basil', icon: basilIcon, itemCount: 5, jointCount: 1, confidence: 10, lift: 0.4, rows: [5] },
    water: { label: 'Water', icon: waterIcon, itemCount: 1, jointCount: 1, confidence: 10, lift: 2, rows: [17] },
  }[pair]
  return <article className="assoc-lesson"><Header eyebrow="19.4 · Basket analysis examples" title="Basket Analysis Examples" subtitle="Calculate the association between bacon and eggs, bacon and basil, then bacon and water." />
    <div className="assoc-basket-example-layout">
      <figure className="assoc-source-figure assoc-source-table-20"><img src={apriori20Source} alt="All 20 numbered source transactions, with the original item icons in two columns. Icons are preserved without assigning names to unfamiliar items." /><figcaption>Twenty transactions · two items per transaction. Selected transaction IDs: {detail.rows.join(', ')}.</figcaption></figure>
      <section className="assoc-basket-calculation" aria-labelledby="assoc-basket-calculation-heading">
        <div className="assoc-control"><span>Compare bacon with</span>{(['eggs', 'basil', 'water'] as const).map((item) => <button key={item} aria-pressed={pair === item} className={pair === item ? 'is-active' : ''} onClick={() => setPair(item)}>{item}</button>)}</div>
        <h2 id="assoc-basket-calculation-heading">Bacon &amp; {detail.label}</h2>
        <section className="assoc-source-support-math" aria-labelledby="assoc-source-support-heading"><h3 id="assoc-source-support-heading">1 · Support</h3>
          <div className="assoc-source-math-row"><span><ItemIcon src={baconIcon} label="Bacon" /></span><AssocFraction numerator="10" denominator="20" /><span>= 0.5</span></div>
          <div className="assoc-source-math-row"><span><ItemIcon src={detail.icon} label={detail.label} /></span><AssocFraction numerator={String(detail.itemCount)} denominator="20" /><span>= {detail.itemCount / 20}</span></div>
          <div className="assoc-source-math-row"><span className="assoc-icon-pair"><ItemIcon src={baconIcon} label="Bacon" /><ItemIcon src={detail.icon} label={detail.label} /></span><AssocFraction numerator={String(detail.jointCount)} denominator="20" /><span>= {detail.jointCount / 20}</span></div>
        </section>
        <section className="assoc-source-derived-math" aria-label="Confidence and lift calculations">
          <div className="assoc-source-derived-row"><h3>2 · Confidence</h3><div className="assoc-source-equation"><span className="assoc-rule-icons"><ItemIcon src={baconIcon} label="Bacon" /> → <ItemIcon src={detail.icon} label={detail.label} /></span><span>=</span><AssocFraction numerator={<><span>Support</span><span className="assoc-icon-pair"><ItemIcon src={baconIcon} label="Bacon" /><ItemIcon src={detail.icon} label={detail.label} /></span></>} denominator={<><span>Support</span><ItemIcon src={baconIcon} label="Bacon" /></>} /><span>=</span><AssocFraction numerator={String(detail.jointCount / 20)} denominator="0.5" /><strong>= {detail.confidence}%</strong></div></div>
          <div className="assoc-source-derived-row"><h3>3 · Lift</h3><div className="assoc-source-equation"><span className="assoc-rule-icons"><ItemIcon src={baconIcon} label="Bacon" /> → <ItemIcon src={detail.icon} label={detail.label} /></span><span>=</span><AssocFraction numerator={<><span>Support</span><span className="assoc-icon-pair"><ItemIcon src={baconIcon} label="Bacon" /><ItemIcon src={detail.icon} label={detail.label} /></span></>} denominator={<><span>Support</span><ItemIcon src={baconIcon} label="Bacon" /> × <span>Support</span><ItemIcon src={detail.icon} label={detail.label} /></>} /><span>=</span><AssocFraction numerator={String(detail.jointCount / 20)} denominator={`0.5 × ${detail.itemCount / 20}`} /><strong>= {detail.lift}</strong></div></div>
        </section>
        <aside className="assoc-lift-interpretation"><strong>How to read lift</strong><span><b>&gt; 1</b> · more co-occurrence than independence</span><span><b>= 1</b> · independence reference</span><span><b>&lt; 1</b> · less co-occurrence than independence</span><small>Lift &gt; 1 indicates positive association, not proof of a strong or reliable pattern.</small></aside>
        {pair === 'water' && <aside className="assoc-water-warning"><strong>Lift = 2, but this is misleading.</strong> Bacon and water appear together in only one of 20 transactions (17). A tiny sample can inflate lift; next, minimum support helps filter such rare items.</aside>}
      </section>
    </div>
  </article>
}

export function InfrequentItemsets() {
  const items = ['Chocolate', 'Cheese', 'Banana', 'Bread']
  const pairs = ['Chocolate + Cheese', 'Chocolate + Banana', 'Chocolate + Bread', 'Cheese + Banana', 'Cheese + Bread', 'Banana + Bread']
  const triples = ['Chocolate + Cheese + Banana', 'Chocolate + Cheese + Bread', 'Chocolate + Banana + Bread', 'Cheese + Banana + Bread']
  const fours = ['Chocolate + Cheese + Banana + Bread']
  return <article className="assoc-lesson"><Header eyebrow="19.6 · Infrequent itemsets" title="Infrequent Itemsets" subtitle="Wouldn’t you want to analyze all possible item combinations? Apriori prunes combinations that cannot be frequent." />
    <p className="assoc-pruning-intro">Four items create <strong>15 possible itemsets</strong>. Their number grows rapidly as more items are added, so Apriori uses the principle that an infrequent set cannot have a frequent superset.</p>
    <section className="assoc-pruning-stage"><h2>1 · List the itemsets</h2><div className="assoc-itemset-columns"><div><h3>1 item</h3>{items.map((x) => <span key={x}>{x}</span>)}</div><div><h3>2 items</h3>{pairs.map((x) => <span key={x}>{x}</span>)}</div><div><h3>3 items</h3>{triples.map((x) => <span key={x}>{x}</span>)}</div><div><h3>4 items</h3>{fours.map((x) => <span key={x}>{x}</span>)}</div></div></section>
    <div className="assoc-pruning-grid">
      <section className="assoc-pruning-stage"><h2>2 · Prune Cheese</h2><p>First, calculate support for each single item. If <strong>Cheese</strong> is below the minimum support, remove it and every larger set containing it.</p><div className="assoc-pruning-examples"><s>Cheese</s><s>Chocolate + Cheese</s><s>Cheese + Banana</s><s>Cheese + Bread</s><s>Chocolate + Cheese + Banana</s><s>Chocolate + Cheese + Bread</s><s>Cheese + Banana + Bread</s><s>Chocolate + Cheese + Banana + Bread</s></div></section>
      <section className="assoc-pruning-stage"><h2>3 · Prune Chocolate + Bread</h2><p>Among the remaining pairs, if <strong>Chocolate + Bread</strong> is infrequent, remove every larger set containing that pair.</p><div className="assoc-pruning-examples"><s>Chocolate + Bread</s><s>Chocolate + Banana + Bread</s></div></section>
    </div>
    <section className="assoc-pruning-stage assoc-pruning-finish"><h2>4 · Repeat, then measure the remaining rules</h2><p>Repeat support calculations and pruning at each itemset size. For the combinations left, calculate <strong>confidence</strong> and <strong>lift</strong>.</p></section>
    <Note>Any combination containing an infrequent itemset is also infrequent: its transactions are a subset of the transactions containing that smaller set.</Note>
    <figure className="assoc-source-figure assoc-network-figure"><img src={aprioriNetworkSource} alt="Source association network graph with named product nodes, including tropical fruit, pip fruit, other vegetables and onions, connected to associated products." /><figcaption>A separate product-network example: arrows connect products that are also purchased together. Tropical fruit and pip fruit form one grouping; other vegetables connect to onions.</figcaption></figure>
  </article>
}

export function MultipleItemSets() {
  return <article className="assoc-lesson"><Header eyebrow="19.7 · Multiple item sets" title="Multiple Item Sets" />
    <section className="assoc-multiple-question"><h2>Can you calculate associations between <strong>multiple items</strong>, like coffee being purchased with bacon and eggs?</h2><p>Yes, you can calculate support, confidence and lift using the same exact logic as you would with individual items.</p></section>
    <div className="assoc-multiple-layout">
      <figure className="assoc-source-figure assoc-source-table-10 assoc-multiple-table"><img src={apriori10Source} alt="All ten numbered transactions in the original table, with three item columns, original product icons and blank cells preserved." /><figcaption>Three items · ten transactions</figcaption></figure>
      <section className="assoc-multiple-calculations" aria-label="Support, confidence and lift calculations">
        <section className="assoc-multiple-support"><h3>Support</h3>
          <div className="assoc-multiple-support-row"><span className="assoc-support-expression">Support (<span className="assoc-icon-pair"><ItemIcon src={baconIcon} label="Bacon" /><ItemIcon src={eggsIcon} label="Eggs" /></span>)</span><span>=</span><AssocFraction numerator="3" denominator="10" /><strong>= 0.3</strong></div>
          <div className="assoc-multiple-support-row"><span className="assoc-support-expression">Support (<ItemIcon src={coffeeIcon} label="Coffee" />)</span><span>=</span><AssocFraction numerator="4" denominator="10" /><strong>= 0.4</strong></div>
          <div className="assoc-multiple-support-row"><span className="assoc-support-expression">Support (<span className="assoc-icon-pair"><ItemIcon src={baconIcon} label="Bacon" /><ItemIcon src={eggsIcon} label="Eggs" /><ItemIcon src={coffeeIcon} label="Coffee" /></span>)</span><span>=</span><AssocFraction numerator="2" denominator="10" /><strong>= 0.2</strong></div>
        </section>
        <section className="assoc-multiple-derived">
          <div className="assoc-multiple-derived-row"><h3>Confidence</h3><div><span className="assoc-rule-icons"><span className="assoc-icon-pair"><ItemIcon src={baconIcon} label="Bacon" /><ItemIcon src={eggsIcon} label="Eggs" /></span> → <ItemIcon src={coffeeIcon} label="Coffee" /></span><span>=</span><AssocFraction numerator={<><span>Support</span><span className="assoc-icon-pair"><ItemIcon src={baconIcon} label="Bacon" /><ItemIcon src={eggsIcon} label="Eggs" /><ItemIcon src={coffeeIcon} label="Coffee" /></span></>} denominator={<>Support <span className="assoc-icon-pair"><ItemIcon src={baconIcon} label="Bacon" /><ItemIcon src={eggsIcon} label="Eggs" /></span></>} /><span>=</span><span className="assoc-final-math"><AssocFraction numerator="0.2" denominator="0.3" /><span>≈</span><strong>67%</strong></span></div></div>
          <div className="assoc-multiple-derived-row"><h3>Lift</h3><div><span className="assoc-rule-icons"><span className="assoc-icon-pair"><ItemIcon src={baconIcon} label="Bacon" /><ItemIcon src={eggsIcon} label="Eggs" /></span> → <ItemIcon src={coffeeIcon} label="Coffee" /></span><span>=</span><AssocFraction numerator={<><span>Support</span><span className="assoc-icon-pair"><ItemIcon src={baconIcon} label="Bacon" /><ItemIcon src={eggsIcon} label="Eggs" /><ItemIcon src={coffeeIcon} label="Coffee" /></span></>} denominator={<><span>Support</span> <span className="assoc-icon-pair"><ItemIcon src={baconIcon} label="Bacon" /><ItemIcon src={eggsIcon} label="Eggs" /></span> × Support <ItemIcon src={coffeeIcon} label="Coffee" /></>} /><span>=</span><span className="assoc-final-math"><AssocFraction numerator="0.2" denominator="0.3 × 0.4" /><span>≈</span><strong>1.7</strong></span></div></div>
        </section>
      </section>
    </div>
    <Note>Calculating all possible associations would be impossible for a human; this is where Machine Learning comes in!</Note>
  </article>
}

export function AprioriCaseStudy() {
  const [itemA, setItemA] = useState('Coffee')
  const [itemB, setItemB] = useState('Tea')
  const [threshold, setThreshold] = useState(0.04)
  const [page, setPage] = useState(0)
  const [showAllRecords, setShowAllRecords] = useState(false)
  const filteredRows = useMemo(() => filterAprioriTransactions(threshold), [threshold])
  const pair = useMemo(() => calculateSelectedPair(itemA, itemB, threshold), [itemA, itemB, threshold])
  const visibleRecords = showAllRecords ? APRIORI_TRANSACTIONS : filteredRows
  const pageCount = Math.ceil(visibleRecords.length / PAGE_SIZE)
  const pageRows = visibleRecords.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
  const chooseThreshold = (value: number) => { setThreshold(value); setPage(0) }
  return <article className="assoc-lesson"><Header eyebrow="19.8 · Case study" title="Case study: Apriori" subtitle="As the bakery owner at Coastal Roasters, review 9,531 transactions from six months and use the patterns to inform product placement and promotions." />
    <div className="assoc-case-facts"><Metric label="Transactions">9,531</Metric><Metric label="Distinct items">94</Metric><Metric label="Items per transaction">Up to 5</Metric></div>
    <section className="assoc-threshold-case"><div className="assoc-threshold-options" role="group" aria-label="Minimum support threshold"><span>Minimum support</span>{[0.04, 0.20].map((value) => <button key={value} className={threshold === value ? 'is-active' : ''} aria-pressed={threshold === value} onClick={() => chooseThreshold(value)}>{value.toFixed(2)}</button>)}</div><div><b>{filteredRows.length.toLocaleString()}</b><span>of {APRIORI_TRANSACTION_COUNT.toLocaleString()} transactions retained</span></div></section>
    <div className="assoc-case-layout"><section className="assoc-bars assoc-case-bars" aria-label="Support chart for the 50 most popular products"><h2>Support · top 50 products</h2>{APRIORI_ITEMS.slice(0, 50).map((row) => <div className="assoc-bar-row" key={row.item}><span>{row.item}</span><div><i style={{ width: `${row.support / APRIORI_ITEMS[0].support * 100}%` }} /></div><strong>{row.support.toFixed(3)}</strong></div>)}</section>
    <section className="assoc-pair-picker"><h2>Inspect a product pair</h2><label>Item A<select value={itemA} onChange={(e) => setItemA(e.target.value)}>{APRIORI_ITEMS.map(({ item }) => <option key={item} disabled={item === itemB}>{item}</option>)}</select></label><label>Item B<select value={itemB} onChange={(e) => setItemB(e.target.value)}>{APRIORI_ITEMS.map(({ item }) => <option key={item} disabled={item === itemA}>{item}</option>)}</select></label><div className="assoc-pair-callout"><span>Selected pair · {pair.filteredTransactionCount.toLocaleString()} filtered rows</span><strong>Lift {pair.lift.toFixed(3)}</strong><dl><dt>Support {pair.itemA}</dt><dd>{pair.supportA.toFixed(6)}</dd><dt>Support {pair.itemB}</dt><dd>{pair.supportB.toFixed(6)}</dd><dt>Joint transactions</dt><dd>{pair.jointCount.toLocaleString()}</dd><dt>Joint support</dt><dd>{pair.jointCount} / {pair.denominator.toLocaleString()} = {pair.jointSupport.toFixed(6)}</dd><dt>Confidence A → B</dt><dd>{pair.confidence.toFixed(6)}</dd></dl></div></section></div>
    <div className="assoc-table-scroll assoc-apriori-table"><table><caption>All 94 item frequencies · workbook order · support uses all {APRIORI_TRANSACTION_COUNT.toLocaleString()} transactions</caption><thead><tr><th>Item</th><th>Transactions</th><th>Support</th></tr></thead><tbody>{APRIORI_ITEMS.map((row) => <tr key={row.item}><th>{row.item}</th><td>{row.count.toLocaleString()}</td><td>{row.support.toFixed(6)}</td></tr>)}</tbody></table></div>
    <section className="assoc-records-section"><h2>Transaction records</h2><p>{showAllRecords ? `All ${APRIORI_TRANSACTIONS.length.toLocaleString()} source records.` : `${filteredRows.length.toLocaleString()} records retained at the selected support threshold.`} Browse in pages of {PAGE_SIZE}.</p><div className="assoc-record-scope" role="group" aria-label="Choose transaction records"><button className={!showAllRecords ? 'is-active' : ''} aria-pressed={!showAllRecords} onClick={() => { setShowAllRecords(false); setPage(0) }}>Filtered · {filteredRows.length.toLocaleString()}</button><button className={showAllRecords ? 'is-active' : ''} aria-pressed={showAllRecords} onClick={() => { setShowAllRecords(true); setPage(0) }}>All source records · {APRIORI_TRANSACTIONS.length.toLocaleString()}</button></div><div className="assoc-record-pagination"><button disabled={page === 0} onClick={() => setPage(page - 1)}>Previous 50</button><span>Page {page + 1} of {pageCount}</span><button disabled={page >= pageCount - 1} onClick={() => setPage(page + 1)}>Next 50</button></div><div className="assoc-table-scroll assoc-record-table"><table><caption>{showAllRecords ? 'All source transactions' : 'Filtered transactions'} {visibleRecords.length ? `${page * PAGE_SIZE + 1}–${Math.min((page + 1) * PAGE_SIZE, visibleRecords.length)} of ${visibleRecords.length.toLocaleString()}` : 'none retained'}</caption><thead><tr><th>ID</th><th>Date</th><th>Time</th><th>Item 1</th><th>Item 2</th><th>Item 3</th><th>Item 4</th><th>Item 5</th><th>Minimum item support</th></tr></thead><tbody>{pageRows.map((row) => <tr key={row[0]}><th>{row[0]}</th><td>{excelDate(row[1])}</td><td>{excelTime(row[2])}</td>{row.slice(3, 8).map((item, i) => <td key={i}>{item ?? '—'}</td>)}<td>{row[8].toFixed(6)}</td></tr>)}</tbody></table></div><div className="assoc-record-pagination"><button disabled={page === 0} onClick={() => setPage(page - 1)}>Previous 50</button><span>Page {page + 1} of {pageCount}</span><button disabled={page >= pageCount - 1} onClick={() => setPage(page + 1)}>Next 50</button></div></section>
    <Note>Filtering uses each transaction’s minimum item support. The worksheet’s single-item supports use all 9,531 transactions, while joint support divides by the retained rows; these mixed denominators are preserved as workbook output. Association is not causation.</Note>
  </article>
}

const states = ['Gold', 'Silver', 'Churn'] as const
const subscription = [[.80, .15, .05], [.20, .40, .40], [.01, .30, .69]]

export function MarkovChains() {
  const [active, setActive] = useState(0)
  return <article className="assoc-lesson"><Header eyebrow="19.9 · Markov chains" title="Markov Chains" subtitle="Markov chains describe the flow—or transition—between states of a categorical variable." />
    <section className="assoc-markov-definition"><p><strong>A Markov chain calculates the probability of moving between states over time.</strong></p><p>A state can be a customer’s subscription tier, renewing or churning, or a product purchase followed by another product purchase. To calculate transitions, observations must be tracked over time and tied to a <strong>unique customer ID</strong>, with the state known at each observation.</p></section>
    <p className="assoc-markov-example-label"><strong>Example:</strong> Monthly subscribers move between Gold, Silver and Churn.</p>
    <div className="assoc-markov-source-layout">
      <div className="assoc-markov-matrix"><table>
        <caption>Transition probabilities · each row totals 100%</caption>
        <colgroup><col className="assoc-markov-axis-column" /><col className="assoc-markov-label-column" /><col span={3} /></colgroup>
        <thead>
          <tr><th className="assoc-markov-axis-space" colSpan={2} aria-hidden="true" /><th className="assoc-markov-to-axis" colSpan={3}><strong>TO</strong> STATE</th></tr>
          <tr><th className="assoc-markov-axis-space" colSpan={2} aria-hidden="true" />{states.map((state) => <th scope="col" key={state}>{state}</th>)}</tr>
        </thead>
        <tbody>{states.map((state, i) => <tr className={i === active ? 'is-active' : ''} key={state}>
          {i === 0 && <th className="assoc-markov-from-axis" scope="rowgroup" rowSpan={3}><span><strong>FROM</strong> STATE</span></th>}
          <th className="assoc-markov-row-label" scope="row">{state}</th>{subscription[i].map((p, j) => <td key={j}>{Math.round(p * 100)}%</td>)}
        </tr>)}</tbody>
      </table></div>
      <figure className="assoc-source-figure assoc-markov-network"><img src={markovSubscriptionNetwork} alt="Directed transition graph for monthly subscription tiers: Gold has a 80% self-loop, 15% transition to Silver and 5% to Churn; Silver transitions 20% to Gold, 40% to itself, and 40% to Churn; Churn transitions 1% to Gold, 30% to Silver, and 69% to itself." /><figcaption>Each directed arrow shows the chance of moving between states; loops show customers who stay in the same state.</figcaption></figure>
    </div>
    <div className="assoc-state-tabs" aria-label="Choose a starting state">{states.map((state, i) => <button className={active === i ? 'is-active' : ''} aria-pressed={active === i} key={state} onClick={() => setActive(i)}>Start at {state}</button>)}</div>
    <p className="assoc-matrix-reading"><strong>Read the highlighted row:</strong> starting in {states[active]}, the next-month probabilities are {states.map((s, i) => `${s} ${Math.round(subscription[active][i] * 100)}%`).join(' · ')}.</p>
    <section className="assoc-markov-insights"><h2>What the transitions suggest</h2><ul><li><strong>31% of churned customers return</strong> the next month: 30% to Silver and 1% to Gold. Most returning customers choose Silver.</li><li><strong>80% of Gold subscribers renew</strong> in Gold the next month.</li></ul></section>
    <section className="assoc-markov-recommendations" aria-label="Recommendations to test"><div><h3>Recommendation · Churn → Silver</h3><p>Test a targeted Silver offer for returning churned customers.</p></div><div><h3>Recommendation · Silver → Gold</h3><p>Test a one-time Gold-upgrade offer with Silver customers.</p></div></section>
    <p className="assoc-markov-recommendation-note">These are ideas to test, not proof of profitability.</p>
    <aside className="assoc-markov-higher-order"><h2>Higher-order Markov chains</h2><p><strong>Higher-order chains use more of the past to estimate what comes next.</strong> A first-order chain uses only the current state; higher-order chains also account for earlier transitions.</p></aside>
  </article>
}

const markovCounts = getMarkovTransitionCounts()
const markovRowTotals = markovCounts.map((row) => row.reduce((sum, value) => sum + value, 0))
const markovOutcomeTotals = MARKOV_STATES.map((outcome, column) => ({ outcome, count: markovCounts.reduce((total, row) => total + row[column], 0) }))
const mostCommonOutcome = markovOutcomeTotals.reduce((best, current) => current.count > best.count ? current : best)

export function MarkovCaseStudy() {
  const [start, setStart] = useState(0)
  const [mode, setMode] = useState<'probability' | 'frequency'>('probability')
  const [page, setPage] = useState(0)
  const state = MARKOV_CUSTOMER_STATES[start]
  const results = useMemo(() => getMarkovOutcomeCounts(state), [state])
  const prediction = useMemo(() => getTopProductPrediction(state), [state])
  const pageCount = Math.ceil(MARKOV_RECORDS.length / PAGE_SIZE)
  const pageRows = MARKOV_RECORDS.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
  const selectedName = displayProduct(state)
  return <article className="assoc-lesson"><Header eyebrow="19.10 · Case study" title="Case study: Markov Chains" subtitle="As Senior Web Analyst at Alpine Supplies, use 14,418 customer purchase paths to summarize a first purchase and a separate later purchase." />
    <div className="assoc-case-facts"><Metric label="Customer records">14,418</Metric><Metric label="Starting products">7</Metric><Metric label="Possible outcomes">7 products + no second purchase</Metric></div>
    <div className="assoc-control assoc-row-picker"><span>First purchase</span>{MARKOV_CUSTOMER_STATES.map((name, i) => <button className={start === i ? 'is-active' : ''} key={name} onClick={() => { setStart(i); setPage(0) }}>{displayProduct(name)}</button>)}</div>
    <div className="assoc-prediction"><span>Most likely product after {selectedName}</span><strong>{displayProduct(prediction.outcome)}</strong><b>{mode === 'probability' ? `${(prediction.count / markovRowTotals[start] * 100).toFixed(1)}%` : `${prediction.count.toLocaleString()} customers`}</b></div>
    <div className="assoc-prediction assoc-overall-outcome"><span>Most common outcome across all customer records</span><strong>{displayProduct(mostCommonOutcome.outcome)}</strong><b>{mostCommonOutcome.count.toLocaleString()} records</b></div>
    <div className="assoc-control"><span>Chart values</span><button className={mode === 'probability' ? 'is-active' : ''} aria-pressed={mode === 'probability'} onClick={() => setMode('probability')}>Row probabilities</button><button className={mode === 'frequency' ? 'is-active' : ''} aria-pressed={mode === 'frequency'} onClick={() => setMode('frequency')}>Frequencies</button></div>
    <section className="assoc-transition-bars" aria-label={`${mode === 'probability' ? 'Probability' : 'Frequency'} by second purchase after ${selectedName}`}>
      <h2>{mode === 'probability' ? 'Next-purchase probabilities' : 'Transition counts'} · after {selectedName}</h2>
      {results.map(({ outcome, count }) => { const max = mode === 'probability' ? markovRowTotals[start] : Math.max(...results.map((result) => result.count)); const value = mode === 'probability' ? count / markovRowTotals[start] : count; return <div className="assoc-bar-row" key={outcome}><span>{displayProduct(outcome)}</span><div><i className={outcome === prediction.outcome ? 'is-predicted' : ''} style={{ width: `${value / (mode === 'probability' ? 1 : max) * 100}%` }} /></div><strong>{mode === 'probability' ? `${(value * 100).toFixed(1)}%` : count.toLocaleString()}</strong></div> })}
    </section>
    <div className="assoc-markov-matrices"><div className="assoc-table-scroll assoc-full-matrix"><table><caption>Transition frequencies · rows are first purchases</caption><thead><tr><th>First ↓ / second →</th>{MARKOV_STATES.map((value) => <th key={value}>{displayProduct(value)}</th>)}</tr></thead><tbody>{MARKOV_CUSTOMER_STATES.map((customer, r) => <tr className={start === r ? 'is-active' : ''} key={customer}><th>{displayProduct(customer)}</th>{markovCounts[r].map((count, c) => <td key={c}>{count.toLocaleString()}</td>)}</tr>)}</tbody></table></div><div className="assoc-table-scroll assoc-full-matrix"><table><caption>Transition probabilities · each starting row totals 100%</caption><thead><tr><th>First ↓ / second →</th>{MARKOV_STATES.map((value) => <th key={value}>{displayProduct(value)}</th>)}</tr></thead><tbody>{MARKOV_CUSTOMER_STATES.map((customer, r) => <tr className={start === r ? 'is-active' : ''} key={customer}><th>{displayProduct(customer)}</th>{markovCounts[r].map((count, c) => <td key={c}>{(count / markovRowTotals[r] * 100).toFixed(1)}%</td>)}</tr>)}</tbody></table></div></div>
    <section className="assoc-records-section"><h2>Customer purchase records</h2><p>All {MARKOV_RECORDS.length.toLocaleString()} customer paths are accessible in pages of {PAGE_SIZE}; “—” means no second purchase was recorded.</p><div className="assoc-record-pagination"><button disabled={page === 0} onClick={() => setPage(page - 1)}>Previous 50</button><span>Page {page + 1} of {pageCount}</span><button disabled={page >= pageCount - 1} onClick={() => setPage(page + 1)}>Next 50</button></div><div className="assoc-table-scroll assoc-record-table"><table><caption>Customer records {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, MARKOV_RECORDS.length)} of {MARKOV_RECORDS.length.toLocaleString()}</caption><thead><tr><th>Customer ID</th><th>First purchase</th><th>Second purchase</th></tr></thead><tbody>{pageRows.map(([id, first, second]) => <tr key={id}><th>{id}</th><td>{displayProduct(first)}</td><td>{displayProduct(second)}</td></tr>)}</tbody></table></div><div className="assoc-record-pagination"><button disabled={page === 0} onClick={() => setPage(page - 1)}>Previous 50</button><span>Page {page + 1} of {pageCount}</span><button disabled={page >= pageCount - 1} onClick={() => setPage(page + 1)}>Next 50</button></div></section>
    <Note>The matrix includes “no second purchase” as a separate outcome. For Bike, the most likely product is Bike speaker; across all records, “no second purchase” is the most common outcome. This workbook summarizes observed paths; it is not a trained predictive model.</Note>
  </article>
}

export function AssociationTakeaways() {
  return <article className="assoc-lesson"><Header eyebrow="19.11 · Key takeaways" title="Key Takeaways" subtitle="Association mining finds patterns in transactional data; Apriori and Markov chains describe different kinds of relationships." />
    <ol className="assoc-takeaway-list">
      <li><p><strong>Association mining reveals patterns, relationships and hidden correlations</strong> in data, then translates them into clear <strong>IF–THEN</strong> association rules.</p><p className="assoc-takeaway-detail">Common uses include recommendation systems (such as Amazon or Netflix), targeting product offers based on purchase history, and optimizing store layouts for cross-selling.</p></li>
      <li><p><strong>Apriori measures how often specific items are purchased together</strong>—<strong>basket analysis</strong>.</p><p className="assoc-takeaway-detail">Rather than analyzing every possible itemset, the Apriori principle speeds calculations by filtering infrequent transactions and itemsets, while finding association rules.</p></li>
      <li><p><strong>Markov chains measure the probability of transitioning between states of a categorical variable.</strong></p><p className="assoc-takeaway-detail">They analyze sequences of events over time, often in subscription services, to estimate what is most likely to happen next.</p></li>
    </ol>
    <section className="assoc-workflow"><h2>A practical way to choose and use them</h2><ol><li><strong>Start with the records.</strong> Are items grouped within transactions, or are categorical states tracked for the same IDs over time?</li><li><strong>Choose the matching method.</strong> Use Apriori for items purchased together; use a Markov chain for state transitions in an ordered sequence.</li><li><strong>Check the evidence.</strong> For Apriori, set a minimum support and inspect support, confidence and lift. For Markov chains, verify that transition rows account for all observed next states.</li><li><strong>Act as a test.</strong> Turn useful patterns into a recommendation, offer or layout experiment, then measure the result. A pattern suggests what to investigate; it does not establish cause or guaranteed business value.</li></ol></section>
  </article>
}

const quiz = [
  ['Association mining is commonly used for what type of analysis?', ['Basket Analysis', 'Forecasting', 'Sentiment Analysis', 'Outlier Detection'], 0, 'Association mining is often used for basket analysis, which involves understanding which particular items tend to be purchased as part of the same transaction.'],
  ['Which of the following use cases could association mining be used for?', ['Identifying outliers in a cross-sectional dataset', 'Recommending products based on previous purchases', 'Natural language processing', 'Detecting seasonality'], 1, 'Association mining can identify products which are frequently purchased together, and can be used for recommendation engines.'],
  ['Which metric calculates the number of transactions which include a particular item?', ['Lift', 'Confidence', 'Frequency', 'Support'], 3, 'Support is calculated by dividing the frequency of transactions containing an item by the total number of transactions'],
  ['Which metric calculates the conditional probability of an item being purchased, given the presence of another item in the same transaction?', ['Lift', 'Confidence', 'Frequency', 'Support'], 1, 'By definition, Confidence is the conditional probability of an item being purchased in a transaction, given the presence of another item in the same transaction'],
  ['Which metric is used to measure the "strength" of association between items?', ['Lift', 'Confidence', 'Error', 'Support'], 0, 'Lift is similar to Confidence, but provides a more accurate measure of an association\'s "strength"'],
  ['Which of the following can be used to reduce the number of transactions to analyze, and avoid skewed Confidence or Lift?', ['Outlier filters', 'Lift minimums', 'Minimum support thresholds', 'Confidence bounds'], 2, 'Minimum support thresholds filter out infrequent items, reduce the number of transactions to analyze, and helps to ensure that Lift calculations aren\'t skewed'],
  ['Generally speaking, which of the following would indicate a real and positive association between two products?', ['Confidence > 1', 'Lift > 1', 'Confidence < 1', 'Lift < 1'], 1, 'In general, a Lift greater than 1 indicates a positive association between items'],
  ['Which of the following states that if an item is infrequent, any combinations containing that item must also be infrequent?', ['The Apriori Principle', 'The Markov Chain', 'The Minimum Support Threshold', 'The Da Vinci Code'], 0, 'The Apriori Principle states that if a specific item is purchased infrequently, any combinations of transactions containing that item must also be infrequent'],
  ['Which of the following types of data would you be more likely to use Markov chains, compared to Apriori?', ['Categorical', 'Numerical', 'Cross-Sectional', 'Time-Series'], 3, 'Markov chains are commonly used to describe transitions over time'],
  ['Markov chains are used to describe the flow or transition between states of which type of variable?', ['Numerical', 'Categorical', 'Boolean', 'True/False'], 1, 'Markov chains describe changes in the states of a categorical variable over time'],
] as const

export function AssociationQuiz() {
  const [answers, setAnswers] = useState<Record<number, number>>({})
  return <article className="assoc-lesson"><Header eyebrow="19.12 · Optional quiz" title="Quiz: Association Mining" subtitle="Choose an answer to see feedback. You can change any response; this quiz does not gate lessons." />
    <div className="assoc-quiz">{quiz.map(([question, options, correct, feedback], index) => <fieldset key={question}><legend>{index + 1}. {question}</legend>{options.map((option, i) => <label className={answers[index] === i ? (i === correct ? 'is-correct' : 'is-wrong') : ''} key={option}><input type="radio" name={`assoc-q-${index}`} checked={answers[index] === i} onChange={() => setAnswers((prev) => ({ ...prev, [index]: i }))} />{option}</label>)}{answers[index] !== undefined && <p className="assoc-feedback">{answers[index] === correct ? 'Correct. ' : `The correct answer is “${options[correct]}.” `}{feedback && <>{feedback}</>}</p>}</fieldset>)}</div>
  </article>
}
