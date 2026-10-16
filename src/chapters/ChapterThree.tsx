import { useId, useState } from 'react'
import './ChapterThree.css'

type Observation = {
  sku: string
  product: string
  category: string
  price: number | null
  units: number
}

// A small, explicitly synthetic inventory used unchanged in every view.
const INVENTORY: readonly Observation[] = [
  { sku: 'A-101', product: 'Oat milk', category: 'Pantry', price: 4, units: 18 },
  { sku: 'B-204', product: 'Green tea', category: 'Drinks', price: 7.5, units: 11 },
  { sku: 'A-118', product: 'Rice', category: 'Pantry', price: 3, units: 22 },
  { sku: 'C-310', product: 'Olive oil', category: 'Pantry', price: 12, units: 7 },
  { sku: 'D-052', product: 'Trail mix', category: 'Snacks', price: 6, units: 15 },
  { sku: 'B-229', product: 'Tomato soup', category: 'Pantry', price: null, units: 13 },
]

const STAGES = [
  { id: 'qa', label: '1 · QA', title: 'Can we trust what is recorded?', variable: 'Check the table', columns: ['sku', 'product', 'price'] },
  { id: 'one', label: '2 · One variable', title: 'What does one column look like?', variable: 'Unit price', columns: ['price'] },
  { id: 'many', label: '3 · Relationships', title: 'How do two columns move together?', variable: 'Price and weekly units', columns: ['price', 'units'] },
] as const

type StageId = (typeof STAGES)[number]['id']

function InventoryTable({ stage }: { stage: StageId }) {
  const active = STAGES.find(item => item.id === stage)!
  const columns: readonly string[] = active.columns
  return <div className="chapter-three__table-wrap">
    <table className="chapter-three__table">
      <caption>Six product records · one row is one product observation</caption>
      <thead><tr>
        <th className={columns.includes('sku') ? 'is-active' : ''} scope="col">SKU</th>
        <th className={columns.includes('product') ? 'is-active' : ''} scope="col">Product</th>
        <th scope="col">Category</th>
        <th className={columns.includes('price') ? 'is-active' : ''} scope="col">Price ($)</th>
        <th className={columns.includes('units') ? 'is-active' : ''} scope="col">Units / week</th>
      </tr></thead>
      <tbody>{INVENTORY.map(row => <tr key={row.sku}>
        <th className={columns.includes('sku') ? 'is-active' : ''} scope="row">{row.sku}</th><td className={columns.includes('product') ? 'is-active' : ''}>{row.product}</td><td>{row.category}</td>
        <td className={columns.includes('price') ? 'is-active' : ''}>{row.price === null ? <span className="chapter-three__missing">Empty · unknown</span> : row.price.toFixed(row.price % 1 ? 2 : 0)}</td>
        <td className={columns.includes('units') ? 'is-active' : ''}>{row.units}</td>
      </tr>)}</tbody>
    </table>
  </div>
}

function QAVisual() {
  const observed = INVENTORY.filter(row => row.price !== null)
  return <figure className="chapter-three__visual">
    <figcaption><strong>First pass: check coverage and plausible values</strong><span>Unit price · observed records only</span></figcaption>
    <div className="chapter-three__qa-range" role="img" aria-label="Five recorded prices range from 3 to 12 dollars. One of six prices is empty and its value is unknown.">
      <div className="chapter-three__range-track"><span /></div>
      <div className="chapter-three__range-labels"><span>Min $3</span><span>Max $12</span></div>
      <div className="chapter-three__qa-counts"><span><b>{observed.length}/6</b> prices recorded</span><span><b>{INVENTORY.length - observed.length}/6</b> empty</span></div>
    </div>
    <p className="chapter-three__visual-note"><strong>Empty is not zero.</strong> The soup price is unknown; no replacement is implied.</p>
  </figure>
}

function UnivariateVisual() {
  const values = INVENTORY.flatMap(row => row.price === null ? [] : [row.price])
  const bins = [
    { label: '$0–<5', count: values.filter(value => value >= 0 && value < 5).length },
    { label: '$5–<10', count: values.filter(value => value >= 5 && value < 10).length },
    { label: '$10–<15', count: values.filter(value => value >= 10 && value < 15).length },
  ]
  const max = Math.max(...bins.map(bin => bin.count))
  return <figure className="chapter-three__visual">
    <figcaption><strong>One-variable profile: price</strong><span>Five observed prices · dollars</span></figcaption>
    <div className="chapter-three__bars" role="img" aria-label="Histogram of recorded unit prices: two from 0 up to but excluding 5 dollars, two from 5 up to but excluding 10 dollars, and one from 10 up to but excluding 15 dollars. One price is missing.">
      {bins.map(bin => <div className="chapter-three__bar-column" key={bin.label}>
        <span className="chapter-three__bar-count">{bin.count}</span><div className="chapter-three__bar" style={{ height: `${Math.max(8, (bin.count / max) * 110)}px` }} />
        <span className="chapter-three__bar-label">{bin.label}</span>
      </div>)}
    </div>
    <p className="chapter-three__visual-note">A distribution describes <strong>one variable at a time</strong>. The empty price is not placed in a bin.</p>
  </figure>
}

function RelationshipVisual() {
  const titleId = useId()
  const descriptionId = useId()
  const rows = INVENTORY.filter((row): row is Observation & { price: number } => row.price !== null)
  const x = (price: number) => 44 + (price / 13) * 260
  const y = (units: number) => 160 - (units / 25) * 120
  return <figure className="chapter-three__visual">
    <figcaption><strong>Two-variable view: price and weekly units</strong><span>Paired records with both values</span></figcaption>
    <svg className="chapter-three__scatter" viewBox="0 0 360 220" role="img" aria-labelledby={`${titleId} ${descriptionId}`}>
      <title id={titleId}>Price and weekly units for five products</title>
      <desc id={descriptionId}>Five dots plot the same products shown in the table. Horizontal axis is unit price in dollars and vertical axis is units sold per week. Tomato soup is not plotted because its price is empty. This small example does not show cause.</desc>
      {[0, 10, 20].map(tick => <g key={tick}><path className="chapter-three__grid" d={`M44 ${y(tick)} H308`} /><text x="36" y={y(tick) + 4} textAnchor="end">{tick}</text></g>)}
      <path className="chapter-three__axis" d="M44 24 V160 H308" />
      {rows.map(row => <g key={row.sku}><circle cx={x(row.price)} cy={y(row.units)} r="6" /><text className="chapter-three__dot-label" x={x(row.price) + 8} y={y(row.units) - 7}>{row.sku}</text></g>)}
      {[0, 4, 8, 12].map(tick => <text key={tick} x={x(tick)} y="178" textAnchor="middle">{tick}</text>)}
      <text x="174" y="205" textAnchor="middle">Unit price ($)</text><text transform="translate(13 101) rotate(-90)" textAnchor="middle">Units / week</text>
    </svg>
    <p className="chapter-three__visual-note">Paired values let us inspect a relationship. <em>A pattern here does not show that price caused sales.</em></p>
  </figure>
}

export default function ChapterThree() {
  const [stage, setStage] = useState<StageId>('qa')
  const active = STAGES.find(item => item.id === stage)!
  return <article className="chapter-three" aria-labelledby="chapter-three-title">
    <header className="chapter-three__intro">
      <p className="chapter-three__eyebrow">Chapter 03 · Part 1</p>
      <h1 id="chapter-three-title">Meet the inventory</h1>
      <p><strong>Before a model can learn, an analyst needs to understand the data.</strong> Imagine joining the Maven Market analyst team. In this part, we will check that records are usable, describe individual columns, and explore how columns relate.</p>

    </header>

    <section className="chapter-three__definition" aria-labelledby="chapter-three-definition">
      <div><p className="chapter-three__eyebrow">The foundation</p><h2 id="chapter-three-definition">Quality assurance means checking whether data is trustworthy enough for the question.</h2>
        <p>Profiling helps us <strong>understand the shape of the data</strong>: first each variable on its own, then relationships between variables.</p>
      </div>
      <svg className="chapter-three__definition-art" viewBox="0 0 290 175" role="img" aria-label="Three linked steps: check records, inspect a column, compare columns.">
        <path d="M55 52 H232 V128 H55" />
        <circle cx="55" cy="52" r="20" /><circle cx="232" cy="52" r="20" /><circle cx="232" cy="128" r="20" /><circle cx="55" cy="128" r="20" />
        <text x="55" y="57" textAnchor="middle">QA</text><text x="232" y="57" textAnchor="middle">1</text><text x="232" y="133" textAnchor="middle">2+</text><text x="55" y="133" textAnchor="middle">ML</text>
        <text className="chapter-three__art-label" x="55" y="24" textAnchor="middle">Check records</text><text className="chapter-three__art-label" x="232" y="24" textAnchor="middle">One variable</text><text className="chapter-three__art-label" x="232" y="164" textAnchor="middle">Relationships</text><text className="chapter-three__art-label" x="55" y="164" textAnchor="middle">Model later</text>
        <text x="143" y="47" textAnchor="middle">→</text><text x="249" y="96" textAnchor="middle">↓</text><text x="143" y="123" textAnchor="middle">←</text>
      </svg>
    </section>

    <section className="chapter-three__map" aria-labelledby="chapter-three-map-title">
      <div className="chapter-three__section-heading"><p className="chapter-three__eyebrow">A short route through Part 1</p><h2 id="chapter-three-map-title">Prepare → understand → model</h2><p>Use the selector to preview the first three steps on the same inventory.</p></div>
      <ol className="chapter-three__stages" aria-label="Data preparation and profiling steps">
        {STAGES.map(item => <li key={item.id}><button type="button" aria-pressed={stage === item.id} onClick={() => setStage(item.id)}><span>{item.label}</span><strong>{item.title}</strong></button></li>)}
      </ol>
      <p className="chapter-three__revisit"><span aria-hidden="true">↶</span> QA can send us back to inspect or revise earlier steps. Modeling comes after this foundation; it is not explored on this page.</p>
    </section>

    <section className="chapter-three__explorer" aria-labelledby="chapter-three-explorer-title">
      <div className="chapter-three__section-heading"><p className="chapter-three__eyebrow">Look at the same rows in three ways</p><h2 id="chapter-three-explorer-title">One small retail inventory</h2><p>The highlighted columns and visual follow the selected step. The underlying six records stay fixed.</p></div>
      <div className="chapter-three__explorer-body">
        <div className="chapter-three__table-panel"><div className="chapter-three__panel-heading"><div><h3>Product inventory</h3></div><span className="chapter-three__record-count">6 records</span></div><InventoryTable stage={stage} /></div>
        <div className="chapter-three__inspector" aria-live="polite"><div className="chapter-three__panel-heading"><div><span className="chapter-three__panel-kicker">{active.label}</span><h3>{active.variable}</h3></div></div>
          {stage === 'qa' ? <QAVisual /> : stage === 'one' ? <UnivariateVisual /> : <RelationshipVisual />}
        </div>
      </div>
      <aside className="chapter-three__guidance"><strong>What changes:</strong> the highlighted columns and the view. <strong>What stays fixed:</strong> all six records and their values. <strong>Notice:</strong> one empty price remains unknown in every view.</aside>
    </section>

    <section className="chapter-three__grain" aria-labelledby="chapter-three-grain-title">
      <div className="chapter-three__grain-copy"><p className="chapter-three__eyebrow">How to read a table</p><h2 id="chapter-three-grain-title">Rows are records; columns are variables.</h2><p>Here, each row is <strong>one product observation</strong>. Each column stores one kind of detail: the SKU identifies the product, while price and weekly units are measurements.</p><p>That description is the table’s <strong>grain</strong>. Naming it helps us count the right thing and avoid treating an identifier as a measurement.</p></div>
      <div className="chapter-three__grain-card" aria-label="Table structure example"><div className="chapter-three__grain-row"><span>row</span><strong>one product record</strong></div><div className="chapter-three__grain-columns"><span>SKU<br /><small>identifier</small></span><span>Price<br /><small>dollars</small></span><span>Units<br /><small>per week</small></span></div><p>6 rows × 5 columns</p></div>
    </section>

    <section className="chapter-three__summary" aria-labelledby="chapter-three-summary-title">
      <p className="chapter-three__eyebrow">Keep this sequence in mind</p><h2 id="chapter-three-summary-title">Trust the records. Learn their shape. Then model.</h2>
      <ul><li><strong>QA</strong><span>Check whether the table is fit to use; flag questions such as an empty value without guessing a correction.</span></li><li><strong>Univariate profiling</strong><span>Describe one variable’s values and distribution.</span></li><li><strong>Multivariate profiling</strong><span>Inspect how two or more variables vary together, without claiming cause from a pattern alone.</span></li></ul>
      <p className="chapter-three__next">Next: Chapter 04 introduces practical QA checks for variable types, empty values, ranges, counts and table structure.</p>
    </section>
  </article>
}
