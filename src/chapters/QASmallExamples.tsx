import { useEffect, useRef, useState } from 'react'
import './QASmallExamples.css'
import './QAFoundations.css'

const PEOPLE = [
  { name: 'Alex', age: 32 },
  { name: 'Bea', age: 34 },
  { name: 'Gina', age: 0 },
  { name: 'Leo', age: 36 },
  { name: 'Maya', age: 41 },
]

export function QAMissingValues() {
  const [zeroIsMissing, setZeroIsMissing] = useState(false)
  const tableRef = useRef<HTMLDivElement>(null)
  const observed = PEOPLE.filter(person => !(zeroIsMissing && person.name === 'Gina')).map(person => person.age)
  const sum = observed.reduce((total, age) => total + age, 0)
  const average = sum / observed.length

  useEffect(() => {
    if (zeroIsMissing) tableRef.current?.scrollIntoView({ block: 'center', behavior: 'instant' })
  }, [zeroIsMissing])

  return <article className="qa-foundations qa-small" aria-labelledby="qa-small-missing-title">
    <header className="qaf-intro"><p className="qaf-eyebrow">4.2 · Empty values</p><h1 id="qa-small-missing-title">Empty values</h1><p><strong>An empty value means the data was not recorded or is unavailable.</strong> Zero is a real value, so check what it means before treating it as missing. Investigating empty values, and how they are recorded in your data, is a prerequisite for every single analysis.</p></header>

    <section className="qaf-definition"><div><p className="qaf-eyebrow">The key distinction</p><h2>“No value recorded” and “a value of zero” mean different things.</h2><p>A product with no sales may correctly have <strong>0 units sold</strong>. A person's age recorded as 0 may instead signal an unrecorded age. Use context or ask the person who recorded the data.</p></div><div className="qas-zero-pair" aria-label="Zero is a value; empty means not recorded"><div><span>Recorded value</span><strong>0</strong><small>Zero units sold can be correct.</small></div><b aria-hidden="true">≠</b><div><span>Not recorded</span><strong>—</strong><small>An empty value is unknown.</small></div></div></section>

    <section className="qaf-card" aria-labelledby="qas-example-title"><div className="qaf-heading"><p className="qaf-eyebrow">Five ages · one small example</p><h2 id="qas-example-title">A zero pulls the average below all four known ages.</h2><p>Here, Gina's 0 is confirmed to stand for an age that was never recorded. Switch it to an empty value to see how the average changes.</p></div>
      <label className="qas-switch"><input type="checkbox" checked={zeroIsMissing} onChange={event => setZeroIsMissing(event.target.checked)} /><span aria-hidden="true" /><b>Treat Gina's 0 as missing</b><small>{zeroIsMissing ? 'On · Gina stays in the table; her age is empty' : 'Off · 0 is currently included as an age'}</small></label>
      <div className="qas-example-layout"><div className="qas-table-wrap" ref={tableRef} tabIndex={-1}><table className="qas-table"><caption>Five people and their recorded ages</caption><thead><tr><th scope="col">Person</th><th scope="col">Age</th></tr></thead><tbody>{PEOPLE.map(person => { const missing = person.name === 'Gina' && zeroIsMissing; return <tr key={person.name} className={missing ? 'qas-missing-row' : undefined}><th scope="row">{person.name}</th><td className={missing ? 'qas-cell qas-cell--missing' : undefined}>{missing ? <span className="qas-empty" title="Before fix: 0">Empty <small>original: 0</small></span> : person.age}</td></tr> })}</tbody></table></div>
        <div className="qas-average" aria-live="polite"><span>Current average age</span><strong className={zeroIsMissing ? 'qas-changed' : undefined} data-original={zeroIsMissing ? 'Before fix: 28.6' : undefined} tabIndex={zeroIsMissing ? 0 : undefined}>{average.toFixed(2).replace(/0$/, '')}</strong><div className="qas-equation"><b>{sum}</b><i>÷</i><b>{observed.length}</b></div><small>{sum} recorded years ÷ {observed.length} recorded ages = average</small><p className={zeroIsMissing ? 'qas-insight qas-insight--missing' : 'qas-insight'}>{zeroIsMissing ? 'Gina is unknown, so the average uses the other four ages.' : '28.6 is lower than every other age: a clue that the zero may have been used for “not recorded.”'}</p></div></div>
      <p className="qas-caveat"><strong>Check the source first:</strong> if 0 were a genuine recorded age or quantity, changing it to empty would be wrong. The example treats it as missing because that has been confirmed.</p>
    </section>
    <section className="qaf-card qas-options" aria-labelledby="qas-options-title"><div className="qaf-heading"><p className="qaf-eyebrow">Three ways to handle empty values</p><h2 id="qas-options-title">Choose after checking why the value is empty.</h2></div><div className="qas-option-grid">
      <article><h3>Keep it empty</h3><p>Retain the record and leave the unknown value empty. Many calculations skip empty values while keeping the rest of the row.</p></article>
      <article><h3>Remove the record</h3><p>Remove a row only when that is appropriate for the analysis. Check whether missingness follows a pattern, since removal can change who or what remains.</p></article>
      <article><h3>Impute an estimate</h3><p>Fill the empty value only with a defensible source or method. A filled value is still an estimate and should not introduce bias.</p><p className="qas-methods"><strong>Common imputation methods</strong><br /><b>Mean</b> (average) or <b>conditional mean</b> for numbers; <b>median</b> for a numeric middle value; <b>mode</b> (most common value) for categories; or <b>linear interpolation</b> between nearby numeric values.</p></article>
    </div></section>

    <p className="qas-color-legend"><strong>Color key</strong><span data-color="missing"><i /> Empty value</span></p>
  </article>
}

type RangeOperation = 'minAge' | 'maxAge' | 'minDate' | 'maxDate'
const RANGE_ROWS = [
  { id: 1, age: 18, date: 'Apr 2', day: 2, month: 4 },
  { id: 2, age: 32, date: 'Apr 14', day: 14, month: 4 },
  { id: 3, age: 65, date: 'Apr 28', day: 28, month: 4 },
  { id: 4, age: 41, date: 'May 3', day: 3, month: 5 },
  { id: 5, age: 27, date: 'May 18', day: 18, month: 5 },
  { id: 6, age: 54, date: 'May 30', day: 30, month: 5 },
]
const rawLabels = ['Pantry', 'Produce', 'Bakery', 'Pantry', 'Pantry ', 'Produce']

export function QARangesCounts() {
  const [operation, setOperation] = useState<RangeOperation>('minAge')
  const [parseDates, setParseDates] = useState(false)
  const [fixTypo, setFixTypo] = useState(false)
  const [countView, setCountView] = useState<'count' | 'distinct'>('count')
  const [category, setCategory] = useState('Pantry')
  const tableRef = useRef<HTMLDivElement>(null)
  const countRef = useRef<HTMLDivElement>(null)
  const typedDate = (row: typeof RANGE_ROWS[number]) => row.month === 5 && !parseDates ? null : row.month * 100 + row.day
  const dateRows = RANGE_ROWS.filter(row => typedDate(row) !== null)
  const selectedDateValues = dateRows.map(row => typedDate(row)!)
  const rangeValues = operation.endsWith('Age') ? RANGE_ROWS.map(row => row.age) : selectedDateValues
  const result = operation.startsWith('min') ? Math.min(...rangeValues) : Math.max(...rangeValues)
  const resultRows = operation.endsWith('Age') ? RANGE_ROWS.filter(row => row.age === result).map(row => row.id) : dateRows.filter(row => typedDate(row) === result).map(row => row.id)
  const dateText = operation.endsWith('Age') ? String(result) : `${Math.floor(result / 100) === 4 ? 'Apr' : 'May'} ${result % 100}`
  const labels = rawLabels.map(label => fixTypo && label === 'Pantry ' ? 'Pantry' : label)
  const distinctLabels = [...new Set(labels)]
  const count = labels.filter(label => label === category).length
  const uniqueFirstRows = labels.map((label, index) => labels.indexOf(label) === index ? index : -1).filter(index => index >= 0)
  const distinctMatchRows = uniqueFirstRows

  useEffect(() => {
    tableRef.current?.querySelector('[data-range-hit="true"]')?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' })
  }, [operation, parseDates])
  useEffect(() => {
    countRef.current?.querySelector('[data-count-hit="true"]')?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' })
  }, [category, countView, fixTypo])

  const chooseOperation = (next: RangeOperation) => { setOperation(next); tableRef.current?.scrollIntoView({ block: 'center', behavior: 'instant' }) }
  const chooseCountView = (next: 'count' | 'distinct') => { setCountView(next); countRef.current?.scrollIntoView({ block: 'center', behavior: 'instant' }) }
  const toggleDates = (checked: boolean) => { setParseDates(checked); if (operation === 'maxDate' || operation === 'minDate') tableRef.current?.scrollIntoView({ block: 'center', behavior: 'instant' }) }
  const rangeOperationLabel = operation.startsWith('min') ? 'MIN' : 'MAX'

  return <article className="qa-foundations qa-small" aria-labelledby="qa-small-ranges-title">
    <header className="qaf-intro"><p className="qaf-eyebrow">4.3 · Range and count calculations</p><h1 id="qa-small-ranges-title">Range and count calculations</h1><p><strong>MIN and MAX show the smallest and largest values; counts show how often values or labels occur.</strong> These simple checks can expose unexpected values, categories, and formatting issues.</p></header>

    <section className="qaf-definition"><div><p className="qaf-eyebrow">A quick QA check</p><h2>The range of a column is its minimum and maximum values.</h2><p>Range calculation is a helpful tool to understand your variables, confirm that ranges are realistic, and identify potential outliers. A range alone does not prove an error; check the field definition and how the data was prepared.</p></div><div className="qas-range-definition"><div><span>Numeric range</span><b>MIN</b><i>→</i><b>MAX</b><small>smallest → largest</small></div><div><span>Category check</span><b>COUNTIF</b><small>how many rows match this label?</small></div></div></section>

    <section className="qaf-card" aria-labelledby="qas-range-title"><div className="qaf-heading"><p className="qaf-eyebrow">Range check · six records</p><h2 id="qas-range-title">Click MIN or MAX to find its source value.</h2><p>Each operation highlights the matching cell and shows the calculation. Age is numeric; Stock date should be a parsed date.</p></div>
      <div className="qas-operation-row" role="group" aria-label="Choose a range operation">{([['minAge', 'MIN · Age'], ['maxAge', 'MAX · Age'], ['minDate', 'MIN · Stock date'], ['maxDate', 'MAX · Stock date']] as [RangeOperation, string][]).map(([id, label]) => <button type="button" key={id} aria-pressed={operation === id} onClick={() => chooseOperation(id)}>{label}</button>)}</div>
      <div className="qas-formula" aria-live="polite"><span>{rangeOperationLabel}({operation.endsWith('Age') ? 'Age' : 'Stock date'})</span><b>=</b><strong>{dateText}</strong><small>{operation.endsWith('Age') ? `from ${RANGE_ROWS.length} numeric ages` : `${dateRows.length} values currently parsed as dates`}</small></div>
      <label className="qas-inline-switch qas-date-switch"><input type="checkbox" checked={parseDates} onChange={event => toggleDates(event.target.checked)} /><span aria-hidden="true" /><b>Parse the May text dates</b><small>{parseDates ? 'On · May dates now take part in MIN and MAX' : 'Off · Apr is parsed, May is still text'}</small></label>
      <div className="qas-table-wrap" ref={tableRef} tabIndex={-1}><table className="qas-table"><caption>Age range and stock dates · blue identifies date parsing</caption><thead><tr><th scope="col">Record</th><th scope="col">Age</th><th scope="col">Stock date</th><th scope="col">Stored as</th></tr></thead><tbody>{RANGE_ROWS.map(row => { const rawTextDate = row.month === 5 && !parseDates; const selected = resultRows.includes(row.id); return <tr key={row.id}><th scope="row">{row.id}</th><td className={selected && operation.endsWith('Age') ? 'qas-cell qas-cell--range' : undefined} data-range-hit={selected && operation.endsWith('Age') || undefined}>{row.age}</td><td className={`${rawTextDate ? 'qas-cell--date-text ' : ''}${selected && operation.endsWith('Date') ? 'qas-cell qas-cell--range-date' : ''}`} data-range-hit={selected && operation.endsWith('Date') || undefined}>{row.date}</td><td>{rawTextDate ? <span className="qas-type-text">text</span> : <span className="qas-type-date">date</span>}</td></tr> })}</tbody></table></div>
      <p className="qas-caveat"><strong>Date caveat:</strong> text that looks like a date is still text. Apr values are already parsed; May values are ignored until parsed, so the apparent MAX is Apr 28. Parsing reveals May 30. The labels Apr and May themselves are calendar months, not a promise that the stored values have date type.</p>
    </section>

    <section className="qaf-card" aria-labelledby="qas-count-title"><div className="qaf-heading"><p className="qaf-eyebrow">Count calculations · six records</p><h2 id="qas-count-title">How many records fall within each category?</h2><p><strong>Count calculations help you understand the number of records or observations that fall within specific categories.</strong> Click a category below to count and highlight its matching records.</p></div>
      <div className="qas-count-controls"><div className="qas-operation-row" role="group" aria-label="Choose count calculation"><button type="button" aria-pressed={countView === 'count'} onClick={() => chooseCountView('count')}>Count by category · COUNTIF</button><button type="button" aria-pressed={countView === 'distinct'} onClick={() => chooseCountView('distinct')}>Distinct labels</button></div></div>
      <div className="qas-formula qas-formula--category" aria-live="polite"><span>{countView === 'count' ? `COUNTIF(Category, "${category}")` : 'DISTINCT_COUNT(Category)'}</span><b>=</b><strong>{countView === 'count' ? count : distinctLabels.length}</strong><small>{countView === 'count' ? `${count} of ${labels.length} records match exactly` : `${distinctLabels.length} raw labels among ${labels.length} records`}</small></div>
      <label className="qas-inline-switch qas-category-switch"><input type="checkbox" checked={fixTypo} onChange={event => { setFixTypo(event.target.checked); if (event.target.checked && category === 'Pantry ') setCategory('Pantry') }} /><span aria-hidden="true" /><b>Trim the extra space from “Pantry ”</b><small>{fixTypo ? 'On · typo merged into Pantry' : 'Off · raw labels retained'}</small></label>
      <div className="qas-count-layout"><div className="qas-table-wrap" ref={countRef} tabIndex={-1}><table className="qas-table"><caption>Category labels · green identifies category consistency</caption><thead><tr><th scope="col">Record</th><th scope="col">Category</th><th scope="col">COUNTIF match</th></tr></thead><tbody>{rawLabels.map((raw, index) => { const shown = labels[index]; const distinctHit = countView === 'distinct' && distinctMatchRows.includes(index); const countHit = countView === 'count' && shown === category; const changed = raw !== shown; return <tr key={index + 1} className={changed ? 'qas-category-row' : undefined}><th scope="row">{index + 1}</th><td className={`${distinctHit || countHit ? 'qas-cell qas-cell--distinct ' : ''}${changed ? 'qas-cell--category-fixed ' : ''}${raw.endsWith(' ') && !fixTypo ? 'qas-category-space' : ''}`} data-count-hit={distinctHit || countHit || undefined} title={changed ? 'Original label: Pantry ' : undefined}>{shown}{raw.endsWith(' ') && !fixTypo && <span className="qas-space-marker" aria-label="trailing space">·</span>}</td><td>{countHit ? <span className="qas-match">match</span> : '—'}</td></tr> })}</tbody><tfoot><tr><th scope="row" colSpan={2}>Total records</th><td>{labels.length}</td></tr><tr className="qas-distinct-total"><th scope="row" colSpan={2}>Distinct labels</th><td>{distinctLabels.length}{distinctLabels.length !== 3 && <small> · expected 3 after checking labels</small>}</td></tr></tfoot></table></div>
      <div><table className="qas-table qas-count-summary"><caption>Count by Category</caption><thead><tr><th scope="col">Category</th><th scope="col">Records</th></tr></thead><tbody>{distinctLabels.map(label => <tr key={label}><th scope="row"><button type="button" aria-pressed={countView === 'count' && category === label} onClick={() => { setCategory(label); setCountView('count') }}>{label.trim()}{label.endsWith(' ') && <span aria-label="trailing space">␠</span>}</button></th><td>{labels.filter(item => item === label).length}</td></tr>)}</tbody><tfoot><tr><th scope="row">Total</th><td>{labels.length}</td></tr></tfoot></table>
      <div className="qas-distinct-explanation"><strong>Distinct count asks a different question:</strong><p>How many <em>unique labels</em> does the field contain? Here: <b>{distinctLabels.length}</b>. A trailing space splits “Pantry” into two labels. Fixing it changes <strong>4 labels → 3</strong>, while the number of records stays <strong>6</strong>.</p></div></div></div>
      <p className="qas-caveat"><strong>What changed:</strong> trimming the confirmed trailing space joins one label, taking the distinct count from 4 to 3. COUNTIF counts records matching a chosen category; the total stays 6. Distinct count answers how many different labels appear.</p>
    </section>
    <p className="qas-color-legend"><strong>Color key</strong><span data-color="missing"><i /> Empty value</span><span data-color="date"><i /> Date parsing</span><span data-color="category"><i /> Category consistency</span></p>
  </article>
}
