import { useId, useState } from 'react'
import './QAFoundations.css'
import { observationProfile } from './observationData'

type VariableId = 'stockdate' | 'sku' | 'price' | 'category' | 'discount' | 'units'

const VARIABLES: Record<VariableId, { name: string; example: string; storage: string; meaning: string; kind: string; note: string }> = {
  stockdate: { name: 'Stock date', example: '2026-03-14', storage: 'Text characters or a date value', meaning: 'A point in calendar time', kind: 'Date / time', note: 'Parsed as a date, this value can reveal month, weekday and weekend status. As plain text, those date operations are unavailable.' },
  sku: { name: 'SKU', example: '004218', storage: 'Text characters', meaning: 'A product identifier', kind: 'Nominal / identifier', note: 'Digits in an ID label records; arithmetic on the ID does not describe product quantity or size.' },
  price: { name: 'Unit price', example: '$4.50', storage: 'Decimal number', meaning: 'A measured amount of money', kind: 'Numeric · continuous', note: 'Differences and averages are meaningful in the same currency and unit.' },
  category: { name: 'Category', example: 'Pantry', storage: 'Text characters', meaning: 'A group label', kind: 'Nominal', note: 'The labels have no natural order. A numeric code for a category would still have categorical meaning.' },
  discount: { name: 'Discount applied', example: 'Yes', storage: 'Boolean or text label', meaning: 'One of two states', kind: 'Binary', note: 'Binary variables have two possible values; their stored form may be true/false, yes/no, or 0/1.' },
  units: { name: 'Units sold', example: '18', storage: 'Whole number', meaning: 'A count of items', kind: 'Numeric · discrete', note: 'Counts are discrete, but their averages can still be meaningful: 18 and 19 units average to 18.5 units per record.' },
}

const TYPE_GLOSSARY = [
  { term: 'Numeric', definition: 'A quantity you can do meaningful arithmetic with.', icon: '⚖️', values: ['2 kg', '+', '3 kg', '=', '5 kg'], example: 'Two bags together weigh 5 kg.', takeaway: 'Adding quantities makes sense.' },
  { term: 'Continuous', definition: 'A measurement that can fall anywhere along a scale.', icon: '📏', values: ['1.70 m', '1.705 m', '1.71 m'], example: 'A person’s height can fall between two marked values.', takeaway: 'More precise measurements can reveal values in between.' },
  { term: 'Discrete', definition: 'Separate, countable values, often whole numbers.', icon: '🍎', values: ['1 apple', '2 apples', '3 apples'], example: 'Count whole apples in a basket: 2 or 3, never 2.4 whole apples.', takeaway: 'Counts have steps; averages of counts can still be useful.' },
  { term: 'Interval', definition: 'Equal gaps mean equal differences, but zero is not “none”.', icon: '🌡️', values: ['0°C', '→ +10°', '10°C', '→ +10°', '20°C'], example: '0°C does not mean there is no temperature.', takeaway: '20°C is 10° warmer than 10°C, but not twice as hot.' },
  { term: 'Ratio', definition: 'Equal gaps have meaning, and zero means none of the quantity.', icon: '📦', values: ['0 boxes', '2 boxes', '4 boxes'], example: 'An empty shelf has 0 boxes; 4 boxes are twice as many as 2.', takeaway: 'Both differences and ratios make sense.' },
  { term: 'Monetary', definition: 'An amount of money with an explicit currency.', icon: '💵', values: ['$2', '+', '$3', '=', '$5'], example: 'Two purchases in US dollars total $5.', takeaway: 'Convert currencies before combining dollars and euros.' },
  { term: 'Nominal', definition: 'Names or groups without a natural ranking.', icon: '🏷️', values: ['Tea', 'Bread', 'Fruit'], example: 'Product categories tell us which group an item belongs to.', takeaway: 'Group or count the labels; there is no “highest” category.' },
  { term: 'Ordinal', definition: 'Categories with a meaningful order, but no fixed numeric gaps.', icon: '📶', values: ['Low', '→', 'Medium', '→', 'High'], example: 'A satisfaction rating goes from low to medium to high.', takeaway: 'You can rank the levels; their gaps need not be equal.' },
  { term: 'Binary', definition: 'Exactly two possible states.', icon: '💡', values: ['Off', '↔', 'On'], example: 'A light is either off or on. A discount can be no or yes.', takeaway: 'Two states, even when stored as 0 and 1.' },
  { term: 'Date / time', definition: 'A position on a calendar or clock.', icon: '📅', values: ['14 Mar', '→ +3 days', '17 Mar'], example: 'A delivery arrives three days after an order.', takeaway: 'Use dates to find elapsed time, weekdays or months.' },
]


export function QAVariableTypes() {
  const [selected, setSelected] = useState<VariableId>('stockdate')
  const [keepZipZero, setKeepZipZero] = useState(true)
  const active = VARIABLES[selected]
  const dateParts = ['Sat', 'Weekend', 'March', 'Q1']
  return <article className="qa-foundations" aria-labelledby="qa-types-title">
    <header className="qaf-intro"><p className="qaf-eyebrow">4.1 · Variable types</p><h1 id="qa-types-title">Variable types</h1><p><strong>Storage tells us how a value is encoded; meaning tells us what it represents.</strong> Check both before choosing an operation or a model input.</p></header>

    <section className="qaf-definition" aria-labelledby="qaf-types-definition">
      <div><p className="qaf-eyebrow">The key distinction</p><h2 id="qaf-types-definition">The same stored form can carry different meaning.</h2><p>A column of digits may be a <strong>measurement, a count, a category code or an identifier</strong>. The characters alone do not settle the variable type.</p></div>
      <div className="qaf-type-equation" role="img" aria-label="Digits can represent an identifier, quantity, or category code"><span>Stored form</span><b>Digits</b><span aria-hidden="true">↓</span><span>Possible meanings</span><b>Identifier · quantity · category code</b></div>
    </section>

    <section className="qaf-card" aria-labelledby="qaf-field-title">
      <div className="qaf-heading"><p className="qaf-eyebrow">Explore one field</p><h2 id="qaf-field-title">Inspect its storage and meaning</h2><p>Choose a field. Its example and interpretation change; the glossary below stays the same.</p></div>
      <div className="qaf-field-layout">
        <div className="qaf-field-list" role="group" aria-label="Choose a field">
          {(Object.keys(VARIABLES) as VariableId[]).map(id => <button key={id} type="button" aria-pressed={selected === id} onClick={() => setSelected(id)}><span>{VARIABLES[id].name}</span><b>{VARIABLES[id].example}</b></button>)}
        </div>
        <div className="qaf-field-detail" aria-live="polite">
          <div className="qaf-detail-top"><span className="qaf-pill">{active.kind}</span><code>{active.example}</code></div>
          <dl><div><dt>Storage form</dt><dd>{active.storage}</dd></div><div><dt>What it means</dt><dd>{active.meaning}</dd></div></dl>
          <p className="qaf-note"><strong>QA clue</strong>{active.note}</p>
          {selected === 'stockdate' && <div className="qaf-date-compare"><div><span>Stored text</span><code>"2026-03-14"</code><small>Characters only · no weekday operation yet</small></div><div className="qaf-date-arrow" aria-hidden="true">→</div><div><span>After parsing as a date</span><code>Mar 14, 2026</code><small>{dateParts.join(' · ')}</small></div></div>}
        </div>
      </div>
    </section>

    <section className="qaf-zip" aria-labelledby="qaf-zip-title">
      <div><p className="qaf-eyebrow">A familiar numeric-looking ID</p><h2 id="qaf-zip-title">A ZIP code is a label, not a quantity.</h2><p>Some locations begin with zero. If software coerces the text <code>02108</code> to a number, it becomes <code>2108</code> and can no longer match the original code.</p>
        <label className="qaf-toggle"><input type="checkbox" checked={keepZipZero} onChange={event => setKeepZipZero(event.target.checked)} /><span>Keep the ZIP code as text</span></label>
      </div>
      <div className="qaf-zip-demo" aria-live="polite"><span>Original characters</span><code>02108</code><div aria-hidden="true">↓</div><span>{keepZipZero ? 'Preserved identifier' : 'Number coercion'}</span><b className={keepZipZero ? '' : 'qaf-zip-lost'}>{keepZipZero ? '02108' : '2108'}</b><small>{keepZipZero ? 'Leading zero retained · safe to match as a label' : 'Leading zero lost · no longer the same identifier'}</small></div>
    </section>

    <section className="qaf-card qaf-glossary" aria-labelledby="qaf-glossary-title"><div className="qaf-heading"><p className="qaf-eyebrow">A compact vocabulary</p><h2 id="qaf-glossary-title">Types describe different properties</h2><p>These labels can overlap. For example, a discrete variable is numeric, and a binary variable can be nominal or ordinal depending on its meaning.</p></div>
      <dl className="qaf-glossary-grid">{TYPE_GLOSSARY.map(({ term, definition, icon, values, example, takeaway }) => <div key={term}>
        <dt><span className="qaf-type-icon" aria-hidden="true">{icon}</span>{term}</dt>
        <dd><p className="qaf-type-definition">{definition}</p>
          <div className="qaf-type-example"><span className="qaf-example-label">Simple example</span><div className="qaf-example-values">{values.map((value, index) => <span key={index}>{value}</span>)}</div><p>{example}</p></div>
          {term === 'Ordinal' && <div className="qaf-ordinal-buckets"><strong>Numbers can become ordered buckets, too.</strong><div className="qaf-bucket-scale"><span><b>Low</b>0 ≤ x &lt; 5</span><span><b>Medium</b>5 ≤ x &lt; 10</span><span><b>High</b>10 ≤ x ≤ 15</span></div><p>A score of <strong>3 → Low</strong>, <strong>7 → Medium</strong>, and <strong>12 → High</strong>. We choose these cutoffs for the example; other boundaries could suit another task. The resulting labels are <em>ordinal</em> because Low &lt; Medium &lt; High.</p></div>}
          <p className="qaf-type-takeaway"><strong>What matters:</strong> {takeaway}</p>
        </dd>
      </div>)}</dl>
      <p className="qaf-emphasis"><strong>Ask what operations make sense.</strong> Sum prices or count units; group by category; compare dates by time. Do not average product codes just because they contain digits.</p>
    </section>

    <section className="qaf-summary"><p className="qaf-eyebrow">Remember</p><h2>Read the meaning before you read the data type.</h2><p>Confirm the column’s role, retain important formatting, and parse dates when calendar features matter. <em>Variable type is about what a value represents, not only how it is stored.</em></p></section>
  </article>
}

export function QAObservationLimits() {
  const sliderId = useId()
  const [observationDay, setObservationDay] = useState(14)
  const { outcomes } = observationProfile(observationDay)
  const maxDay = 50
  const x = (day: number) => 48 + (day / maxDay) * 612
  return <article className="qa-foundations" aria-labelledby="qa-limits-title">
    <header className="qaf-intro"><p className="qaf-eyebrow">4.4 · Left- and right-censored data</p><h1 id="qa-limits-title">Left- and right-censored data</h1><p><strong>Observed data may stop before the value or event of interest is visible.</strong> Range checks and counts can reveal cutoffs that change how we interpret a result.</p></header>

    <section className="qaf-definition qaf-limit-definition" aria-labelledby="qaf-limit-definition-title"><div><p className="qaf-eyebrow">Left censoring</p><h2 id="qaf-limit-definition-title">Too small to measure exactly.</h2><p>A device reports <strong>“below 5”</strong>. We keep the record, but only know its value is less than 5. This is <strong>left censoring</strong>.</p></div>
      <div className="qaf-threshold" role="img" aria-label="The measurement scale is visible from five upward; the value lies somewhere below five and is reported as less than five."><div className="qaf-threshold-value"><b>?</b><span>somewhere below 5</span></div><div className="qaf-threshold-line"><span>measurement limit = 5</span></div><div className="qaf-threshold-scale"><span>below limit</span><b>5</b><span>measured range →</span></div><strong>Recorded result: &lt; 5</strong></div>
    </section>

    <details className="qaf-selection"><summary><strong>Different issue: excluding people from a sample</strong></summary><p>An adults-only survey leaves younger people out of the sample. That is <strong>selection</strong>. Censoring keeps a record, but leaves its exact measurement or event time unknown.</p></details>

    <section className="qaf-card" aria-labelledby="qaf-timeline-title"><div className="qaf-heading"><p className="qaf-eyebrow">Right censoring · customer return example</p><h2 id="qaf-timeline-title">A customer has not returned yet. What can we say?</h2><p>Move the slider to watch longer. A green dot means a customer returned; a cross means the study ended before a return was seen.</p></div>
      <p className="qaf-right-definition"><strong>Right censoring:</strong> the study ends before we see a return. We know how long we waited, but not when the customer will return.</p>
      <div className="qaf-slider-row"><label htmlFor={sliderId}>Study observation day <strong>{observationDay}</strong></label><input id={sliderId} type="range" min="14" max="50" value={observationDay} onChange={event => setObservationDay(Number(event.target.value))} /><div className="qaf-slider-labels"><span>Day 14</span><span>Day 50</span></div></div>
      <div className="qaf-timeline-wrap"><svg className="qaf-timeline" viewBox="0 0 710 310" role="img" aria-label={`Six customer timelines through day ${observationDay}. ${outcomes.filter(row => row.observed).length} return events have been observed; ${outcomes.filter(row => !row.observed).length} customers are right-censored at the study end.`}>
        <rect x={x(observationDay)} y="26" width={x(maxDay) - x(observationDay)} height="244" fill="#f3eee0" />
        {[0, 10, 20, 30, 40, 50].map(day => <g key={day}><line className="qaf-chart-grid" x1={x(day)} y1="22" x2={x(day)} y2="274" /><text className="qaf-chart-label" x={x(day)} y="295" textAnchor="middle">{day}</text></g>)}
        <line className="qaf-study-end" x1={x(observationDay)} y1="16" x2={x(observationDay)} y2="276" /><text className="qaf-end-label" x={x(observationDay)} y="13" textAnchor="middle">study ends</text>
        {outcomes.map((row, index) => { const y = 50 + index * 37; const endDay = row.observed ? row.eventDay! : observationDay; return <g key={row.id}><text className="qaf-row-label" x="8" y={y + 4}>{row.id}</text><line className="qaf-followup" x1={x(row.start)} y1={y} x2={x(endDay)} y2={y} /><circle className="qaf-start-dot" cx={x(row.start)} cy={y} r="4" /><text className="qaf-start-label" x={x(row.start)} y={y - 9} textAnchor="middle">start {row.start}</text>{row.observed ? <g><circle className="qaf-event-dot" cx={x(row.eventDay!)} cy={y} r="7" /><text className="qaf-event-label" x={x(row.eventDay!)} y={y + 17} textAnchor="middle">return {row.eventDay}</text></g> : <g><path className="qaf-censor-mark" d={`M${x(observationDay) - 5} ${y - 6} L${x(observationDay) + 5} ${y + 6} M${x(observationDay) + 5} ${y - 6} L${x(observationDay) - 5} ${y + 6}`} /><text className="qaf-censor-label" x={observationDay > 32 ? x(observationDay) - 9 : x(observationDay) + 9} y={y + 17} textAnchor={observationDay > 32 ? 'end' : 'start'}>no return yet · {row.followup}d watched</text></g>}</g>})}
        <text className="qaf-chart-label" x="354" y="309" textAnchor="middle">Study day</text>
      </svg></div>
      <div className="qaf-legend"><span><i className="qaf-legend-event" /> Observed return event</span><span><i className="qaf-legend-censor" /> Right-censored: no return observed by study end</span></div>
      <p className="qaf-note qaf-timeline-note"><strong>What changes:</strong> the end of observation and each customer’s available follow-up. <strong>What stays fixed:</strong> six start days and their return lags. A censored customer may return later; <em>“not yet observed” does not mean “never.”</em></p>
    </section>

    <section className="qaf-summary"><p className="qaf-eyebrow">Remember</p><h2>Ask where the measurement or observation window ends.</h2><p><strong>Left censoring:</strong> value known only to be below a limit. <strong>Right censoring:</strong> event time is unknown beyond the observation end. <em>Exclusion changes who is sampled; censoring limits what is measured.</em></p></section>
  </article>
}

type Product = 'Oat milk' | 'Green tea'
type Month = 'Jan' | 'Feb' | 'Mar'
const SALES: Record<Product, Record<Month, number>> = {
  'Oat milk': { Jan: 12, Feb: 15, Mar: 9 },
  'Green tea': { Jan: 8, Feb: 11, Mar: 14 },
}
const PRODUCTS: Product[] = ['Oat milk', 'Green tea']
const MONTHS: Month[] = ['Jan', 'Feb', 'Mar']

export function QATableStructure() {
  const [view, setView] = useState<'long' | 'wide'>('long')
  const [product, setProduct] = useState<Product>('Oat milk')
  const [month, setMonth] = useState<Month>('Feb')
  const value = SALES[product][month]
  const total = PRODUCTS.flatMap(item => MONTHS.map(period => SALES[item][period])).reduce((sum, amount) => sum + amount, 0)
  return <article className="qa-foundations" aria-labelledby="qa-table-title">
    <header className="qaf-intro"><p className="qaf-eyebrow">4.5 · Table structures</p><h1 id="qa-table-title">Table structures</h1><p><strong>Long and wide tables organize the same information in different ways.</strong> Choose a structure that fits the task, and state what one row represents.</p></header>

    <section className="qaf-definition" aria-labelledby="qaf-table-definition-title"><div><p className="qaf-eyebrow">The definition</p><h2 id="qaf-table-definition-title">Long format keeps the measured field in one column.</h2><p>Wide format spreads values across columns, often one column per period.</p></div>
      <div className="qaf-shape-art" role="img" aria-label="Long format: product, month, and units columns. Wide format: product rows and one column for each month."><div><b>Long</b><span>Product · Month · Units</span><i>6 rows</i></div><strong aria-hidden="true">↔</strong><div><b>Wide</b><span>Product · Jan · Feb · Mar</span><i>2 rows</i></div></div>
    </section>

    <section className="qaf-pivot-callout" aria-labelledby="qaf-pivot-title">
      <svg viewBox="0 0 112 80" aria-hidden="true"><g fill="#c6d7bc" stroke="#47705b" strokeWidth="1.5"><rect x="4" y="6" width="24" height="16" rx="3"/><rect x="4" y="30" width="24" height="16" rx="3"/><rect x="4" y="54" width="24" height="16" rx="3"/><rect x="49" y="54" width="16" height="16" rx="3"/><rect x="70" y="54" width="16" height="16" rx="3"/><rect x="91" y="54" width="16" height="16" rx="3"/></g><path d="M41 14 H66 Q79 14 79 28 V42 M71 34 L79 42 L87 34" fill="none" stroke="#286352" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/></svg>
      <div><p className="qaf-eyebrow">The operation to remember</p><h2 id="qaf-pivot-title">Pivoting <span>Rows → columns</span></h2><p>Turn the <strong>month values in rows</strong> into <strong>month headings across columns</strong>. The sales values stay the same; their arrangement changes.</p><p className="qaf-pivot-reverse"><strong>Unpivoting</strong> goes the other way: <em>columns → rows</em>.</p></div>
    </section>

    <section className="qaf-card" aria-labelledby="qaf-table-explorer-title"><div className="qaf-heading"><p className="qaf-eyebrow">Pivot the same six observations</p><h2 id="qaf-table-explorer-title">Compare the layouts</h2><p>Try the pivot below. The values and total stay fixed; only the arrangement and row grain change.</p></div>
      <div className="qaf-table-controls" role="group" aria-label="Choose table layout"><button type="button" aria-pressed={view === 'long'} onClick={() => setView('long')}>↶ Unpivot · Long · 6 rows</button><button type="button" aria-pressed={view === 'wide'} onClick={() => setView('wide')}>↷ Pivot · Wide · 2 rows</button></div>
      <div className="qaf-pickers"><label>Highlight product<select value={product} onChange={event => setProduct(event.target.value as Product)}>{PRODUCTS.map(item => <option key={item}>{item}</option>)}</select></label><label>Highlight month<select value={month} onChange={event => setMonth(event.target.value as Month)}>{MONTHS.map(item => <option key={item}>{item}</option>)}</select></label><p aria-live="polite">Selected observation: <strong>{product} · {month} · {value} units</strong></p></div>
      <div className="qaf-table-wrap" aria-live="polite">{view === 'long' ? <table className="qaf-data-table"><caption>Long format · each row is one product-month observation</caption><thead><tr><th scope="col">Product</th><th scope="col">Month</th><th scope="col">Units</th></tr></thead><tbody>{PRODUCTS.flatMap(item => MONTHS.map(period => <tr key={`${item}-${period}`} className={item === product && period === month ? 'qaf-selected-cell' : ''}><th scope="row">{item}</th><td>{period}</td><td>{SALES[item][period]}</td></tr>))}</tbody></table> : <table className="qaf-data-table"><caption>Wide format · each row is one product, with one column per month</caption><thead><tr><th scope="col">Product</th>{MONTHS.map(period => <th key={period} scope="col" className={period === month ? 'qaf-selected-cell' : ''}>{period}</th>)}</tr></thead><tbody>{PRODUCTS.map(item => <tr key={item}><th scope="row">{item}</th>{MONTHS.map(period => <td key={period} className={item === product && period === month ? 'qaf-selected-cell' : ''}>{SALES[item][period]}</td>)}</tr>)}</tbody></table>}</div>
      <div className="qaf-table-invariants"><div><span>Visible values</span><strong>6</strong></div><div><span>Total units</span><strong>{total}</strong></div><div><span>Row grain now</span><strong>{view === 'long' ? 'Product × month' : 'Product'}</strong></div></div>
      <p className="qaf-note"><strong>What changes:</strong> columns, rows and the meaning of a row. <strong>What stays fixed:</strong> every product-month value and the 69-unit total. The highlight follows the same selected observation in either layout.</p>
    </section>

    <section className="qaf-uses"><div><p className="qaf-eyebrow">When each shape helps</p><h2>Let the question guide the structure.</h2></div><div className="qaf-use-grid"><p><strong>Long</strong><span>One variable per column; convenient for filtering, grouping, plotting and aggregation.</span></p><p><strong>Wide</strong><span>One row per entity with repeated measure columns; can be convenient for comparisons or model inputs.</span></p></div><p className="qaf-use-caveat"><em>Neither shape is always best. Keep track of the row grain so that counts and joins still mean what you expect.</em></p></section>

    <section className="qaf-summary"><p className="qaf-eyebrow">Remember</p><h2>Pivoting changes the table’s shape, not the underlying observations.</h2><p>Check the row grain, identify where each field lives, and confirm the selected values and totals remain consistent after reshaping. If multiple rows share the same product and month, choose an explicit aggregation before pivoting.</p></section>
  </article>
}
