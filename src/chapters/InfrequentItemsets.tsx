import { useState } from 'react'
import './AssociationMining.css'
import './InfrequentItemsets.css'
import aprioriNetworkSource from '../assets/apriori-network-source.png'
import { allNonemptyItemsets, itemsetMinimumSupport, itemsetProducts, itemsetTransactions, pairMetrics, support, type ItemsetProductId, type ItemsetPairMetrics } from './itemsetExample'

const Header = ({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) => <header className="assoc-header"><p className="assoc-eyebrow">{eyebrow}</p><h1>{title}</h1>{subtitle && <p className="assoc-header-subtitle">{subtitle}</p>}</header>

const products = itemsetProducts.map((product) => ({ ...product, key: product.id, label: product.name }))

function ItemsetDiagram({ step }: { step: number }) {
  const columns = [1, 2, 3, 4]
  const isPruned = (set: string[]) => step >= 1 && set.includes('cheese') || step >= 2 && set.includes('chocolate') && set.includes('bread')
  return <div className="ii-diagram" aria-label={`All 15 itemsets; pruning shown through step ${step}`}>
    {columns.map((size) => <section className="ii-column" key={size}>
      <h3>{size}-item sets:</h3>
      {allNonemptyItemsets.filter((set) => set.length === size).map((set) => <div className={`ii-combination${isPruned([...set]) ? ' is-pruned' : ''}`} key={set.join('-')} aria-label={`${set.map((key) => products.find((item) => item.key === key)?.label).join(' and ')}${isPruned([...set]) ? ', pruned' : ''}`}>
        {set.map((key) => { const item = products.find((product) => product.key === key)!; return <span key={key} title={item.label}>{productIcon[key]}</span> })}
      </div>)}
    </section>)}
  </div>
}

const productIcon: Record<ItemsetProductId, string> = { chocolate: '🍫', cheese: '🧀', banana: '🍌', bread: '🍞' }
const percent = (value: number) => `${Math.round(value * 100)}%`

function Fraction({ numerator, denominator }: { numerator: React.ReactNode; denominator: React.ReactNode }) {
  return <span className="ii-fraction"><span>{numerator}</span><span>{denominator}</span></span>
}

const directions = [
  { antecedent: 'chocolate', consequent: 'banana' },
  { antecedent: 'bread', consequent: 'banana' },
] as const

function WorkedExample() {
  const [selected, setSelected] = useState<ItemsetPairMetrics>(() => pairMetrics('chocolate', 'banana')!)
  const matchingRows = support([selected.antecedent, selected.consequent]).matchingTransactionIds
  const pairSupport = support([selected.antecedent, selected.consequent])
  const aSupport = support([selected.antecedent])
  const bSupport = support([selected.consequent])
  const pairLabel = (pair: readonly string[]) => pair.map((key) => itemsetProducts.find((item) => item.id === key)?.name).join(' + ')
  const pairScores = directions.map(({ antecedent, consequent }) => pairMetrics(antecedent, consequent)!)

  return <section className="ii-worked" aria-labelledby="ii-worked-title">
    <header className="ii-worked-heading"><p className="ii-kicker">ADDED WORKED EXAMPLE · STEP 5</p><h2 id="ii-worked-title">Support, confidence and lift from ten transactions</h2><p>Same four products, now with visible transaction records. <strong>All supports use these ten original transactions.</strong> Minimum support: <strong>{percent(itemsetMinimumSupport)}</strong>.</p></header>
    <div className="ii-worked-layout">
      <section className="ii-data-panel" aria-labelledby="ii-transactions-title">
        <h3 id="ii-transactions-title">The dataset · 10 transactions</h3>
        <div className="ii-table-scroll"><table className="ii-data-table"><thead><tr><th scope="col">#</th>{itemsetProducts.map(({ id, name }) => <th scope="col" key={id}><span aria-hidden="true">{productIcon[id]}</span><br />{name}</th>)}</tr></thead><tbody>{itemsetTransactions.map(({ id, items }) => <tr className={matchingRows.includes(id) ? 'is-matched' : ''} key={id}><th scope="row">{id}</th>{itemsetProducts.map(({ id: productId }) => <td key={productId}>{items.includes(productId) ? '✓' : '—'}</td>)}</tr>)}</tbody></table></div>
        <p className="ii-table-key"><span>✓</span> Product appears in the transaction · highlighted rows contain the selected pair.</p>
      </section>
      <section className="ii-calculation-panel" aria-labelledby="ii-support-title">
        <h3 id="ii-support-title">Count each item and pair</h3>
        <p className="ii-mini-label">Single-item support</p>
        <div className="ii-support-list">{itemsetProducts.map(({ id, name }) => { const value = support([id]); return <div className="ii-support-row" key={id}><span>{productIcon[id]} {name}</span><strong>{value.count}/10 = {percent(value.support)}</strong></div> })}</div>
        <p className="ii-mini-label">Pair support · frequent at {percent(itemsetMinimumSupport)} or more</p>
        <div className="ii-pair-list">{allNonemptyItemsets.filter((set) => set.length === 2).map((pair) => {
          const itemset = [...pair] as ItemsetProductId[]
          const value = support(itemset)
          return <div className={`ii-support-row${value.support < itemsetMinimumSupport ? ' is-below' : ''}`} key={pair.join('-')}><span>{pairLabel(pair)}</span><strong>{value.count}/10 = {percent(value.support)}</strong></div>
        })}</div>
      </section>
    </div>
    <section className="ii-metrics" aria-labelledby="ii-metric-title">
      <div className="ii-metric-heading"><div><h3 id="ii-metric-title">Follow one association</h3><p>Select a frequent pair to trace its matching rows and calculation.</p></div><label>Association <select value={`${selected.antecedent}-${selected.consequent}`} onChange={(event) => { const [a, b] = event.target.value.split('-'); const next = pairMetrics(a, b); if (next) setSelected(next) }}>{directions.map(({ antecedent, consequent }) => <option key={`${antecedent}-${consequent}`} value={`${antecedent}-${consequent}`}>{itemsetProducts.find((p) => p.id === antecedent)?.name} → {itemsetProducts.find((p) => p.id === consequent)?.name}</option>)}</select></label></div>
      <div className="ii-formulas">
        <div className="ii-formula"><span>Support of the pair</span><strong><Fraction numerator={pairSupport.count} denominator={pairSupport.total} /> = {percent(pairSupport.support)}</strong><small>Both products appear in the same transaction.</small></div>
        <div className="ii-formula"><span>Confidence · {itemsetProducts.find((p) => p.id === selected.antecedent)?.name} → {itemsetProducts.find((p) => p.id === selected.consequent)?.name}</span><strong><Fraction numerator={pairSupport.count} denominator={aSupport.count} /> = {percent(selected.confidence)}</strong><small>Of transactions with the first item, this many also contain the second.</small></div>
        <div className="ii-formula"><span>Lift</span><strong><Fraction numerator={`${percent(pairSupport.support)}`} denominator={`${percent(aSupport.support)} × ${percent(bSupport.support)}`} /> = {selected.lift.toFixed(2)}</strong><small>Compare the pair’s support with what the two item supports would suggest independently.</small></div>
      </div>
      <p className="ii-lift-note"><strong>Lift above 1</strong> means the pair appears together more often than independence would suggest; <strong>below 1</strong> means less often. A frequent pair is not automatically a positive association.</p>
    </section>
    <section className="ii-case-network" aria-labelledby="ii-network-title">
      <div className="ii-case-network-heading"><h3 id="ii-network-title">Frequent pairs in this dataset</h3><p>Each connected pair meets the {percent(itemsetMinimumSupport)} support threshold. Select an edge to see its rule calculation above.</p></div>
      <div className="ii-graph" role="group" aria-label="Network of frequent pairs in the ten transactions">
        <svg className="ii-graph-lines" viewBox="0 0 600 250" aria-hidden="true"><line x1="130" y1="64" x2="300" y2="64"/><line x1="300" y1="64" x2="470" y2="175"/></svg>
        <button type="button" className={`ii-edge ii-edge-one${selected.antecedent === 'chocolate' ? ' is-selected' : ''}`} onClick={() => setSelected(pairScores[0])} aria-label="Chocolate and Banana: support 40 percent; select Chocolate to Banana rule">40% support</button>
        <button type="button" className={`ii-edge ii-edge-two${selected.antecedent === 'bread' && selected.consequent === 'banana' ? ' is-selected' : ''}`} onClick={() => setSelected(pairScores[1])} aria-label="Banana and Bread: support 30 percent; select Bread to Banana rule">30% support</button>
        <div className="ii-node ii-node-chocolate"><span>{productIcon.chocolate}</span>Chocolate</div><div className="ii-node ii-node-banana"><span>{productIcon.banana}</span>Banana</div><div className="ii-node ii-node-bread"><span>{productIcon.bread}</span>Bread</div>
        <div className="ii-node ii-node-cheese is-pruned"><span>{productIcon.cheese}</span>Cheese <small>below threshold</small></div>
      </div>
      <p className="ii-network-caption">Cheese appears faded because its support is 20%. Chocolate + Bread has 10% support, below the threshold, so it has no edge.</p>
    </section>
  </section>
}

const stepCopy = [
  <>Calculate support for each <strong>1-item set</strong>, and filter out all transactions containing items below the threshold (<em>in this case <strong>cheese</strong></em>).</>,
  <>Based on the remaining itemsets, calculate support for each <strong>2-item set</strong>, and filter out transactions containing any pairs below the threshold (<em>in this case <strong>chocolate &amp; bread</strong></em>).</>,
  <>Repeat until all infrequent itemsets have been eliminated, and filter transactions accordingly.</>,
  <>Based on the filtered transactions, you can use an apriori model to calculate confidence and lift and identify the strongest associations.</>,
]

export function InfrequentItemsets() {
  return <article className="assoc-lesson ii-lesson">
    <Header eyebrow="19.6 · Infrequent itemsets" title="Infrequent Itemsets" subtitle="Wouldn’t you want to analyze all possible item combinations, instead of calculating individual associations?" />
    <section className="ii-opening" aria-label="How Apriori reduces itemsets">
      <p>Yes! In reality that’s how Apriori works. But since the number of configurations increases exponentially with each item, this is impractical for humans to do.</p>
      <p>To reduce or “prune” the number of itemsets to analyze, we can use the <strong>apriori principle</strong>, which basically states that if an item is infrequent, any combinations containing that item must also be infrequent.</p>
    </section>
    <div className="ii-steps">
      <section className="ii-step ii-step-zero">
        <div className="ii-step-copy"><h2>STEP 0: THE ITEMS AND POSSIBLE COMBINATIONS</h2><p>Consider a shop that sells <strong>4 items</strong> (<em>chocolate, cheese, bananas &amp; bread</em>). There are <strong>15 possible combinations</strong> or itemsets (<em>ignoring duplicates</em>).</p></div>
        <ItemsetDiagram step={0} />
      </section>
      {stepCopy.map((copy, index) => <section className="ii-step" key={index}>
        <div className="ii-step-copy"><h2>STEP {index + 1}:</h2><p>{copy}</p></div>
        <ItemsetDiagram step={index + 1} />
      </section>)}
    </div>
    <WorkedExample />
    <section className="ii-network" aria-label="Association network example">
      <div><h2>Visualize the associations</h2><p>Association rules can also be shown as a network. When one product is purchased, the connected products are often purchased too. This is a separate example: tropical fruit appears in the center of one network, while other vegetables are often associated with onions.</p></div>
      <figure className="assoc-source-figure assoc-network-figure"><img src={aprioriNetworkSource} alt="Association network with named product nodes, including tropical fruit, pip fruit, other vegetables and onions, connected to associated products." /><figcaption>A separate product-network example of products purchased together.</figcaption></figure>
    </section>
  </article>
}
