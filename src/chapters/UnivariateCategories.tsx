import { useState, type ReactNode } from 'react'
import './UnivariateCategories.css'

type LessonProps = { lesson: string; title: string; definition: string; intro?: string; children: ReactNode; summary: string }

function Lesson({ lesson, title, definition, intro, children, summary }: LessonProps) {
  const titleId = `uvcat-${lesson}-title`
  return <article className="uvcat-lesson" aria-labelledby={titleId}>
    <header className="uvcat-intro"><p className="uvcat-eyebrow">5.{lesson} · Univariate profiling</p><h1 id={titleId}>{title}</h1>{intro && <p>{intro}</p>}</header>
    <section className="uvcat-definition"><p className="uvcat-eyebrow">The key idea</p><p className="uvcat-definition-text">{definition}</p></section>
    {children}
    <section className="uvcat-summary"><p className="uvcat-eyebrow">Remember</p><p><strong>{summary}</strong></p></section>
  </article>
}

const overviewFields = {
  section: { label: 'Section', value: 'Camping', kind: 'Categorical · nominal', why: 'A group label. Compare or summarize a number, such as sales, by this category.' },
  size: { label: 'Size', value: 'Medium', kind: 'Categorical · ordinal', why: 'A category with an order. The gap from Small to Medium is not a measured amount.' },
  price: { label: 'Unit price', value: '$129.00', kind: 'Numerical · measured amount', why: 'A quantity with meaningful arithmetic. You can summarize prices with a mean, minimum or maximum.' },
  quantity: { label: 'Quantity', value: '3', kind: 'Numerical · count', why: 'A number of items. Individual counts are whole numbers; a mean across records can be fractional.' },
} as const

export function UVIntroduction() {
  const [field, setField] = useState<keyof typeof overviewFields>('section')
  const current = overviewFields[field]
  return <Lesson lesson="1" title="Univariate profiling" intro="After preliminary quality checks, inspect each field on its own before combining variables or building a model." definition="Univariate profiling is a descriptive analysis of each variable by itself." summary="Understand one field at a time: what it represents, which values occur, and how those values are distributed. This prepares you for sound modeling and later multivariable analysis.">
    <section className="uvcat-card" aria-labelledby="uvcat-overview-explore">
      <div className="uvcat-section-heading"><p className="uvcat-eyebrow">Explore a product record</p><h2 id="uvcat-overview-explore">Choose a field to inspect</h2><p>Notice how its meaning guides the questions we can ask.</p></div>
      <div className="uvcat-picker-layout">
        <div className="uvcat-picker" role="group" aria-label="Choose a product field">
          {(Object.keys(overviewFields) as Array<keyof typeof overviewFields>).map(key => <button key={key} type="button" aria-pressed={field === key} onClick={() => setField(key)}><span>{overviewFields[key].label}</span><b>{overviewFields[key].value}</b></button>)}
        </div>
        <div className="uvcat-field-readout" aria-live="polite"><span className="uvcat-chip">{current.kind}</span><h3>{current.label}: <code>{current.value}</code></h3><p>{current.why}</p></div>
      </div>
      <div className="uvcat-use-cases"><div><b>Understand the field</b><span>Check its possible values, unusual observations and distribution.</span></div><div><b>Prepare for modeling</b><span>Know whether the field represents a class or a quantity.</span></div><div><b>Guide the next analysis</b><span>Profile individual fields before studying how they relate.</span></div></div>
    </section>
  </Lesson>
}

export function UVCategoricalVariables() {
  const [example, setExample] = useState<'binary' | 'codes'>('binary')
  return <Lesson lesson="2" title="Categorical variables" intro="Categories can describe groups, states, or classes that a model is meant to predict." definition="A categorical variable contains category labels as its values, rather than measured quantities." summary="A category may be stored as words or digits. Read its meaning before doing arithmetic: 0/1 can name two states, and numeric codes can still be labels.">
    <section className="uvcat-card" aria-labelledby="uvcat-category-example">
      <div className="uvcat-section-heading"><p className="uvcat-eyebrow">What does the value mean?</p><h2 id="uvcat-category-example">A number can still be a label</h2><p>Switch examples to see how interpretation follows meaning, not the characters used to store a value.</p></div>
      <div className="uvcat-switches" role="group" aria-label="Choose a categorical example"><button type="button" aria-pressed={example === 'binary'} onClick={() => setExample('binary')}>Binary flag</button><button type="button" aria-pressed={example === 'codes'} onClick={() => setExample('codes')}>Numeric codes</button></div>
      {example === 'binary' ? <div className="uvcat-category-visual" aria-live="polite"><div className="uvcat-category-label"><span>Discount applied?</span><b>Binary · two categories</b></div><div className="uvcat-state-pair"><span><small>stored as</small><b>0</b><em>No</em></span><i aria-hidden="true">↔</i><span><small>stored as</small><b>1</b><em>Yes</em></span></div><svg className="uvcat-example-art" viewBox="0 0 900 190" role="img" aria-label="Two product tags show the discount flag: one without a discount and one with a discount"><rect x="12" y="10" width="420" height="170" rx="16" fill="#f5f4eb" stroke="#d9ddd5"/><rect x="468" y="10" width="420" height="170" rx="16" fill="#e9f2ea" stroke="#c7d9cb"/><text x="42" y="43" className="art-kicker">RECORD A · 0 / NO</text><path d="M56 77h135l62 42-62 42H56a12 12 0 0 1-12-12V89a12 12 0 0 1 12-12Z" fill="#fffefa" stroke="#4a806c" strokeWidth="3"/><circle cx="76" cy="110" r="7" fill="none" stroke="#4a806c" strokeWidth="3"/><text x="104" y="112" className="art-label">$50.00</text><text x="104" y="136" className="art-small">regular price</text><text x="290" y="111" className="art-arrow">→</text><text x="325" y="111" className="art-result">No</text><text x="500" y="43" className="art-kicker">RECORD B · 1 / YES</text><path d="M514 77h135l62 42-62 42H514a12 12 0 0 1-12-12V89a12 12 0 0 1 12-12Z" fill="#fffefa" stroke="#4a806c" strokeWidth="3"/><circle cx="534" cy="110" r="7" fill="none" stroke="#4a806c" strokeWidth="3"/><text x="562" y="112" className="art-label">$50.00</text><text x="562" y="136" className="art-small">regular price</text><circle cx="700" cy="110" r="34" fill="#d5a34b"/><text x="700" y="106" className="art-badge">10%</text><text x="700" y="122" className="art-badge-small">OFF</text><text x="742" y="111" className="art-arrow">→</text><text x="790" y="111" className="art-result">Yes</text></svg><p>Here, 0 and 1 stand for <strong>No</strong> and <strong>Yes</strong>. Averaging this flag can report the share marked Yes, but adding the codes does not mean discounts have been measured in units.</p></div> : <div className="uvcat-category-visual" aria-live="polite"><div className="uvcat-category-label"><span>Survey region code</span><b>Categorical · nominal</b></div><div className="uvcat-code-pair"><span><b>1</b> North</span><span><b>2</b> South</span><span><b>3</b> West</span></div><svg className="uvcat-example-art" viewBox="0 0 900 190" role="img" aria-label="Three map panels label North, South, and West with identifiers 1, 2, and 3"><rect x="12" y="10" width="276" height="170" rx="16" fill="#f5f4eb" stroke="#d9ddd5"/><rect x="312" y="10" width="276" height="170" rx="16" fill="#f5f4eb" stroke="#d9ddd5"/><rect x="612" y="10" width="276" height="170" rx="16" fill="#f5f4eb" stroke="#d9ddd5"/><path d="M56 101 79 77l23 18 20-30 25 17 22-5 25 28-10 23H69Z" fill="#c8dfcb" stroke="#4a806c" strokeWidth="3" strokeLinejoin="round"/><circle cx="132" cy="104" r="8" fill="#d5a34b"/><text x="224" y="60" className="art-code">1</text><text x="40" y="157" className="art-label">North</text><path d="M354 111 375 82l26 19 16-26 30 9 21-12 33 27 19 42H360Z" fill="#e5d7ae" stroke="#947445" strokeWidth="3" strokeLinejoin="round"/><circle cx="435" cy="110" r="8" fill="#d5a34b"/><text x="524" y="60" className="art-code">2</text><text x="340" y="157" className="art-label">South</text><path d="M653 116 681 89l18 11 25-34 22 20 21-12 26 35 22 13-5 20H652Z" fill="#d8e2ca" stroke="#648267" strokeWidth="3" strokeLinejoin="round"/><circle cx="749" cy="109" r="8" fill="#d5a34b"/><text x="824" y="60" className="art-code">3</text><text x="640" y="157" className="art-label">West</text></svg><p>The codes identify regions; region 3 is not three times region 1. Likewise, “discrete” describes separated possible values, often counts, and does not by itself mean categorical.</p></div>}
      <p className="uvcat-note"><strong>How categories help:</strong> use labels such as store or month to group a numerical measure, or predict a category as a class.</p>
    </section>
  </Lesson>
}

export function UVDiscretization() {
  const [lowCut, setLowCut] = useState(100)
  const [highCut, setHighCut] = useState(500)
  const prices = [35, 65, 99, 100, 249, 349, 499, 500, 699, 850]
  const level = (price: number) => price < lowCut ? 'Low' : price < highCut ? 'Medium' : 'High'
  return <Lesson lesson="3" title="Discretization" intro="A numeric measure can be turned into useful buckets by applying clear, non-overlapping rules." definition="Discretization creates a new categorical variable from an existing numerical variable by assigning its values to ranges." summary="Define each boundary precisely so every value belongs to one bucket. Keep the original numerical field when its detail is still useful; discretization discards within-bin differences in the new label.">
    <section className="uvcat-card" aria-labelledby="uvcat-discretize-demo">
      <div className="uvcat-section-heading"><p className="uvcat-eyebrow">Price level · interactive example</p><h2 id="uvcat-discretize-demo">Move the cutoffs and see the labels update</h2><p>Low includes values below its cutoff; Medium starts there and ends before the high cutoff; High includes that cutoff and above.</p></div>
      <div className="uvcat-cutoff-controls">
        <label>Low / Medium boundary <strong>${lowCut}</strong><input type="range" min="50" max={highCut - 50} step="10" value={lowCut} onChange={event => setLowCut(Number(event.target.value))} aria-label="Price cutoff between Low and Medium" /></label>
        <label>Medium / High boundary <strong>${highCut}</strong><input type="range" min={lowCut + 50} max="800" step="10" value={highCut} onChange={event => setHighCut(Number(event.target.value))} aria-label="Price cutoff between Medium and High" /></label>
      </div>
      <div className="uvcat-rule-strip" aria-live="polite"><span><b>Low</b> Price &lt; ${lowCut}</span><span><b>Medium</b> ${lowCut} ≤ Price &lt; ${highCut}</span><span><b>High</b> Price ≥ ${highCut}</span></div>
      <div className="uvcat-price-samples" aria-label="Price examples and assigned price levels">{prices.map(price => <div key={price} className={`uvcat-price-${level(price).toLowerCase()}`}><code>${price}</code><span aria-hidden="true">↓</span><b>{level(price)}</b></div>)}</div>
      <p className="uvcat-note"><strong>Notice:</strong> at the defaults, exactly $100 is Medium and exactly $500 is High. The intervals touch without overlap or a gap.</p>
    </section>
  </Lesson>
}

const categoryExamples = {
  section: { name: 'Product section', type: 'Nominal', values: ['Camping', 'Biking', 'Hiking'], explanation: 'There is no natural ranking. Reordering the labels does not change what they mean.' },
  size: { name: 'Product size', type: 'Ordinal', values: ['Small', 'Medium', 'Large'], explanation: 'The labels have an order, but the distance from Small to Medium need not equal the distance from Medium to Large.' },
  rating: { name: 'Service rating', type: 'Ordinal', values: ['Low', 'Medium', 'High'], explanation: 'The levels rank responses. They do not say how many units separate one level from another.' },
  page: { name: 'Landing page', type: 'Nominal', values: ['Page A', 'Page B', 'Page C'], explanation: 'Letter names identify alternatives. A preferred page is not automatically a higher-ranked category.' },
} as const

function CategoryArtwork({ selected, ordered }: { selected: keyof typeof categoryExamples; ordered: boolean }) {
  if (!ordered && selected === 'section') return <svg className="uvcat-example-art" viewBox="0 0 960 250" role="img" aria-label="Three product section labels: a tent for Camping, a bicycle for Biking, and a mountain for Hiking. The labels have no ranking.">
    <rect x="8" y="8" width="300" height="234" rx="16" fill="#f5f4eb" stroke="#d9ddd5"/><rect x="330" y="8" width="300" height="234" rx="16" fill="#f5f4eb" stroke="#d9ddd5"/><rect x="652" y="8" width="300" height="234" rx="16" fill="#f5f4eb" stroke="#d9ddd5"/>
    <path d="M72 133 158 56l86 77v45H72Z" fill="#dce8d6" stroke="#397966" strokeWidth="5" strokeLinejoin="round"/><path d="m145 180 13-124 48 124" fill="none" stroke="#397966" strokeWidth="5" strokeLinejoin="round"/><path d="M168 95h25" stroke="#397966" strokeWidth="4"/><text x="158" y="220" className="art-label art-centered">Camping</text>
    <circle cx="392" cy="151" r="43" fill="none" stroke="#397966" strokeWidth="5"/><circle cx="558" cy="151" r="43" fill="none" stroke="#397966" strokeWidth="5"/><path d="m392 151 51-70 39 70h-90l48-70 43 70m-83-2h-20m82 0h22m-58-68h17" fill="none" stroke="#397966" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/><text x="480" y="220" className="art-label art-centered">Biking</text>
    <path d="m698 172 74-104 49 66 28-33 53 71H698Z" fill="#dce8d6" stroke="#397966" strokeWidth="5" strokeLinejoin="round"/><path d="m752 172 20-40 20 40" fill="#fffefa" stroke="#397966" strokeWidth="3"/><path d="M785 62v33m-12-12 12-21 12 21" fill="none" stroke="#d5a34b" strokeWidth="4" strokeLinecap="round"/><text x="802" y="220" className="art-label art-centered">Hiking</text>
  </svg>
  if (!ordered) return <svg className="uvcat-example-art" viewBox="0 0 960 250" role="img" aria-label="Three equal-size landing-page cards identified as Page A, Page B, and Page C. Letter labels identify options without ranking them.">
    <rect x="8" y="8" width="300" height="234" rx="16" fill="#f5f4eb" stroke="#d9ddd5"/><rect x="330" y="8" width="300" height="234" rx="16" fill="#f5f4eb" stroke="#d9ddd5"/><rect x="652" y="8" width="300" height="234" rx="16" fill="#f5f4eb" stroke="#d9ddd5"/>
    {[0, 1, 2].map((index) => { const x = 54 + index * 322; const label = ['A', 'B', 'C'][index]; return <g key={label}><rect x={x} y="43" width="212" height="119" rx="9" fill="#fffefa" stroke="#397966" strokeWidth="3"/><path d={`M${x + 18} 63h176`} stroke="#d6dfd4" strokeWidth="8" strokeLinecap="round"/><rect x={x + 18} y="82" width="58" height="58" rx="6" fill="#dce8d6"/><path d={`M${x + 91} 91h96m-96 19h83m-83 19h68`} stroke="#829c8a" strokeWidth="5" strokeLinecap="round"/><text x={x + 106} y="218" className="art-label art-centered">Page {label}</text></g> })}
  </svg>
  if (selected === 'size') return <svg className="uvcat-example-art" viewBox="0 0 960 250" role="img" aria-label="Three shirts increase in size from Small to Medium to Large, showing the meaningful order of sizes without a numeric scale.">
    <rect x="8" y="8" width="944" height="234" rx="16" fill="#f5f4eb" stroke="#d9ddd5"/><path d="M250 80h150m-12-12 12 12-12 12m172-12h150m-12-12 12 12-12 12" fill="none" stroke="#d5a34b" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="m107 90 42-24 31 26 30-26 42 24-17 44-27-10v73h-57v-73l-27 10Z" fill="#e6efdf" stroke="#397966" strokeWidth="4" strokeLinejoin="round"/><path d="m420 76 47-27 35 29 34-29 47 27-20 48-31-12v84h-61v-84l-31 12Z" fill="#dce8d6" stroke="#397966" strokeWidth="4" strokeLinejoin="round"/><path d="m707 63 54-30 39 33 39-33 54 30-23 54-35-14v94h-70v-94l-35 14Z" fill="#c8dfcb" stroke="#397966" strokeWidth="4" strokeLinejoin="round"/>
    <text x="200" y="222" className="art-label art-centered">Small</text><text x="500" y="222" className="art-label art-centered">Medium</text><text x="800" y="222" className="art-label art-centered">Large</text>
  </svg>
  return <svg className="uvcat-example-art" viewBox="0 0 960 250" role="img" aria-label="Rating bars grow from one filled segment for Low, to two for Medium, to three for High. The order is meaningful but the gaps are not measured units.">
    <rect x="8" y="8" width="944" height="234" rx="16" fill="#f5f4eb" stroke="#d9ddd5"/>
    {[{ x: 140, label: 'Low', fill: 1 }, { x: 420, label: 'Medium', fill: 2 }, { x: 700, label: 'High', fill: 3 }].map(({ x, label, fill }) => <g key={label}><text x={x + 65} y="66" className="art-label art-centered">{label}</text>{[0, 1, 2].map((segment) => <rect key={segment} x={x + segment * 47} y="104" width="38" height="64" rx="7" fill={segment < fill ? '#4b927d' : '#e4e8df'} stroke={segment < fill ? '#397966' : '#cbd3c8'} strokeWidth="2"/>)}<text x={x + 65} y="203" className="art-small art-centered">{fill} of 3 levels</text></g>)}
    <path d="M313 136h76m-12-12 12 12-12 12m204-12h76m-12-12 12 12-12 12" fill="none" stroke="#d5a34b" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
}

export function UVNominalOrdinal() {
  const [selected, setSelected] = useState<keyof typeof categoryExamples>('section')
  const current = categoryExamples[selected]
  const ordered = current.type === 'Ordinal'
  return <Lesson lesson="4" title="Nominal and ordinal variables" intro="Both are categorical. The difference is whether the labels carry a meaningful order." definition="Nominal categories have no inherent rank. Ordinal categories have an order, but the gaps between levels do not have a defined numeric meaning." summary="Ask whether the order comes from the variable’s meaning. If it does, preserve the order; do not assume equal spacing between ordinal levels.">
    <section className="uvcat-card" aria-labelledby="uvcat-nominal-demo">
      <div className="uvcat-section-heading"><p className="uvcat-eyebrow">Inspect some category fields</p><h2 id="uvcat-nominal-demo">Does order carry meaning?</h2><p>Choose a field. The arrows appear only when its categories have a meaningful rank.</p></div>
      <div className="uvcat-field-tabs" role="group" aria-label="Choose a category field">{(Object.keys(categoryExamples) as Array<keyof typeof categoryExamples>).map(key => <button type="button" key={key} aria-pressed={selected === key} onClick={() => setSelected(key)}>{categoryExamples[key].name}</button>)}</div>
      <div className="uvcat-order-demo" aria-live="polite"><div className="uvcat-order-heading"><span className="uvcat-chip">{current.type}</span><b>{current.name}</b></div><div className={ordered ? 'uvcat-labels uvcat-labels-ordered' : 'uvcat-labels'}>{current.values.map((value, index) => <span key={value}>{value}{ordered && index < current.values.length - 1 && <i aria-hidden="true">→</i>}</span>)}</div><CategoryArtwork selected={selected} ordered={ordered}/><p>{current.explanation}</p>{!ordered && <p className="uvcat-reorder-hint"><strong>Same categories, any display order:</strong> {current.values.slice().reverse().join(' · ')}</p>}</div>
      <p className="uvcat-note"><strong>Keep perspective:</strong> an ordinal order is meaningful, but a numeric score assigned to its levels does not make their spacing equal.</p>
    </section>
  </Lesson>
}

export function UVCategoricalDistributions() {
  const [counts, setCounts] = useState({ Camping: 14, Biking: 6 })
  const [view, setView] = useState<'count' | 'proportion'>('count')
  const total = counts.Camping + counts.Biking
  const adjust = (section: keyof typeof counts, delta: number) => setCounts(values => ({ ...values, [section]: Math.max(0, values[section] + delta) }))
  return <Lesson lesson="5" title="Categorical distributions" intro="Count each distinct label to see which categories occur and how often." definition="A categorical distribution shows the unique values a variable contains and how often each value occurs." summary="Frequency is the count in a category; proportion is that count divided by the total. The starting example has 14 Camping and 6 Biking records: 70% and 30% of 20.">
    <section className="uvcat-card" aria-labelledby="uvcat-dist-demo">
      <div className="uvcat-section-heading"><p className="uvcat-eyebrow">Product section · starting example</p><h2 id="uvcat-dist-demo">Compare counts and proportions</h2><p>Use the buttons to adjust example records; the total and shares recalculate immediately.</p></div>
      <div className="uvcat-dist-controls"><div className="uvcat-view-toggle" role="group" aria-label="Distribution display"><button type="button" aria-pressed={view === 'count'} onClick={() => setView('count')}>Frequency · count</button><button type="button" aria-pressed={view === 'proportion'} onClick={() => setView('proportion')}>Proportion · percent</button></div><span className="uvcat-total">Total records <b>{total}</b></span><button type="button" className="uvcat-reset-counts" onClick={() => setCounts({ Camping: 14, Biking: 6 })}>Reset to starting counts</button></div>
      <div className="uvcat-dist-axis" aria-hidden="true"><span>Relative bar length · {view === 'count' ? 'count' : 'share'}</span><span>{view === 'count' ? `0` : '0%'}<i>→</i>{view === 'count' ? Math.max(counts.Camping, counts.Biking) : '100%'}</span></div>
      <div className="uvcat-dist-chart" aria-live="polite">{(Object.keys(counts) as Array<keyof typeof counts>).map(section => {
        const count = counts[section]
        const share = total === 0 ? 0 : count / total * 100
        const barWidth = view === 'count' ? Math.max(counts.Camping, counts.Biking) ? count / Math.max(counts.Camping, counts.Biking) * 100 : 0 : share
        return <div className="uvcat-dist-row" key={section}><div className="uvcat-dist-label"><b>{section}</b><span>{view === 'count' ? `${count} records` : total === 0 ? '— · no records' : `${share.toFixed(0)}% of ${total}`}</span></div><div className="uvcat-bar-track"><span style={{ width: `${barWidth}%` }} /></div><div className="uvcat-count-controls"><button type="button" aria-label={`Remove one ${section} record`} disabled={count === 0} onClick={() => adjust(section, -1)}>−</button><button type="button" aria-label={`Add one ${section} record`} onClick={() => adjust(section, 1)}>+</button></div></div>
      })}</div>
      <div className="uvcat-fraction-note"><span>Camping</span><b>{total ? `${counts.Camping} ÷ ${total} = ${(counts.Camping / total * 100).toFixed(0)}%` : `${counts.Camping} ÷ 0 = undefined`}</b><span>Biking</span><b>{total ? `${counts.Biking} ÷ ${total} = ${(counts.Biking / total * 100).toFixed(0)}%` : `${counts.Biking} ÷ 0 = undefined`}</b></div>
      <p className="uvcat-note"><strong>Frequency counts records, not distinct labels.</strong> A two-category table has two labels, even when many records fall under each. A heat map can show counts at the intersections of two categorical fields.</p>
    </section>
  </Lesson>
}

function NumericArtwork({ measure, values, formatted }: { measure: 'price' | 'quantity'; values: number[]; formatted: (value: number) => string }) {
  const isPrice = measure === 'price'
  return <svg className="uvcat-example-art uvcat-numeric-art" viewBox="0 0 960 250" role="img" aria-label={isPrice ? `Three product price tags show ${values.map(formatted).join(', ')}.` : `Three product boxes show quantities of ${values.join(', ')} items per record.`}>
    <rect x="8" y="8" width="944" height="234" rx="16" fill="#f5f4eb" stroke="#d9ddd5"/>
    {values.map((value, index) => {
      const x = 73 + index * 300
      return <g key={`${measure}-${index}`}>
        <rect x={x} y="36" width="214" height="174" rx="12" fill="#fffefa" stroke="#d9ddd5" strokeWidth="2"/>
        <text x={x + 107} y="64" className="art-kicker art-centered">RECORD {index + 1}</text>
        {isPrice ? <g><path d={`M${x + 43} 86h108l35 37-35 37H${x + 43}a9 9 0 0 1-9-9V95a9 9 0 0 1 9-9Z`} fill="#e7efe2" stroke="#397966" strokeWidth="3"/><circle cx={x + 54} cy="123" r="6" fill="none" stroke="#397966" strokeWidth="3"/><text x={x + 111} y="129" className="art-label art-centered">{formatted(value)}</text><text x={x + 107} y="187" className="art-small art-centered">unit price · USD</text></g> : <g><path d={`M${x + 49} 99h116v57H${x + 49}Z`} fill="#dce8d6" stroke="#397966" strokeWidth="3"/><path d={`M${x + 49} 99l58-28 58 28m-58-28v28m-58 0 58 29 58-29m-58 29v28`} fill="none" stroke="#397966" strokeWidth="3" strokeLinejoin="round"/><text x={x + 107} y="184" className="art-label art-centered">{formatted(value)}</text></g>}
      </g>
    })}
  </svg>
}

export function UVNumericalVariables() {
  const [measure, setMeasure] = useState<'price' | 'quantity'>('price')
  const [summary, setSummary] = useState<'average' | 'sum' | 'minmax'>('average')
  const values = measure === 'price' ? [40, 60, 100] : [1, 2, 3]
  const sum = values.reduce((total, value) => total + value, 0)
  const formatted = (value: number) => measure === 'price' ? `$${value.toFixed(value % 1 === 0 ? 0 : 1)}` : `${value}${value % 1 ? ' items per record' : ' items'}`
  return <Lesson lesson="6" title="Numerical variables" intro="Numerical fields describe amounts and counts that can be summarized with meaningful arithmetic." definition="A numerical variable contains numbers that represent a measurable amount or quantity." summary="Numerical measures can be aggregated (sum, count, average, minimum or maximum) and compared across categories. Check meaning and units before calculating; coded category labels are still categorical.">
    <section className="uvcat-card" aria-labelledby="uvcat-numeric-demo">
      <div className="uvcat-section-heading"><p className="uvcat-eyebrow">An aggregate is a question about values</p><h2 id="uvcat-numeric-demo">See what the summary says</h2><p>Choose a numeric field and a summary. These three example records show every value used in the calculation.</p></div>
      <div className="uvcat-aggregate-controls"><fieldset><legend>Measure</legend><button type="button" aria-pressed={measure === 'price'} onClick={() => setMeasure('price')}>Unit price</button><button type="button" aria-pressed={measure === 'quantity'} onClick={() => setMeasure('quantity')}>Quantity</button></fieldset><fieldset><legend>Summary</legend><button type="button" aria-pressed={summary === 'average'} onClick={() => setSummary('average')}>Average</button><button type="button" aria-pressed={summary === 'sum'} onClick={() => setSummary('sum')}>Sum</button><button type="button" aria-pressed={summary === 'minmax'} onClick={() => setSummary('minmax')}>Min / max</button></fieldset></div>
      <NumericArtwork measure={measure} values={values} formatted={formatted}/>
      <div className="uvcat-aggregate-visual" aria-live="polite"><div className="uvcat-number-values"><span>{measure === 'price' ? 'Unit price · USD' : 'Quantity · items'}{values.map((value, index) => <b key={index}>{formatted(value)}</b>)}</span><i aria-hidden="true">→</i></div><div className="uvcat-aggregate-result"><small>{summary === 'average' ? 'Average' : summary === 'sum' ? 'Sum' : 'Range'}</small><strong>{summary === 'average' ? formatted(sum / values.length) : summary === 'sum' ? formatted(sum) : `${formatted(Math.min(...values))} to ${formatted(Math.max(...values))}`}</strong><span>{summary === 'average' ? `${formatted(sum)} ÷ ${values.length} records` : summary === 'sum' ? `${values.map(formatted).join(' + ')}` : `${values.length} records · low to high`}</span></div></div>
      <p className="uvcat-note"><strong>Use a category as a dimension.</strong> For example, compare average unit price by product section. Quantity is a count, so a group average may be fractional even though each record has a whole number of items.</p>
    </section>
  </Lesson>
}
