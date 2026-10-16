import { useEffect, useMemo, useRef, useState } from 'react'
import {
  CATEGORIES,
  INITIAL_QA,
  inventoryMetrics,
  ISSUE_ROWS,
  prepareInventory,
  type QAState,
  type PreparedInventoryRecord,
} from './qaData'
import './QAWorkbench.css'

type Mode = 'missing' | 'ranges' | 'case-study'
type Issue = keyof typeof ISSUE_ROWS
type MetricFocus = 'min' | 'max' | 'earliest' | 'latest' | `category:${string}` | null

const ISSUE_INFO: Record<Issue, { title: string; short: string; correction: string }> = {
  missing: { title: 'Zero-coded missing prices', short: '8 prices recorded as $0', correction: 'Keep these values unknown (empty), rather than counting zero as a price.' },
  dates: { title: 'Dates stored as text', short: '15 dates not recognized', correction: 'Parse the existing date text into date values; the displayed calendar dates stay the same.' },
  identifiers: { title: 'Numeric-looking SKU', short: 'Identifier has no arithmetic meaning', correction: 'Store the SKU as text so it is treated as an identifier, not a quantity.' },
  price: { title: 'Price worth investigating', short: 'Blue Label Noodle Soup · $375', correction: 'Use the supplied manager confirmation to correct the price to $3.75.' },
  categories: { title: 'Inconsistent category labels', short: '4 labels do not match the category list', correction: 'Fix spelling, punctuation, pluralization and a trailing space so the same categories use consistent labels. No products are moved to a different category.' },
}

const ISSUE_ORDER: Issue[] = ['missing', 'dates', 'identifiers', 'price', 'categories']

const MODE_CONTENT: Record<Mode, { eyebrow: string; title: string; intro: string; label: string; definition: string; note: string }> = {
  missing: {
    eyebrow: 'Chapter 04 · 4.2 · Empty values',
    title: 'Empty values',
    intro: 'The workbook records eight absent prices as zero. Inspect the coverage and calculation before choosing how to represent them.',
    label: 'Missing and zero mean different things',
    definition: 'Zero is a recorded value. Missing means the value is unknown.',
    note: 'Switching the eight documented cells to empty excludes them from price summaries. It does not recover or estimate their prices, and all 100 product records remain in the table.',
  },
  ranges: {
    eyebrow: 'Chapter 04 · 4.3 · Ranges & counts',
    title: 'Range & count calculations',
    intro: 'Use minimum, maximum, latest-date, and category summaries to find records that deserve a closer look.',
    label: 'A profile is a signal to inspect',
    definition: 'An unusual value or an incomplete count is a question for the source, not an automatic instruction to delete a row.',
    note: 'Text-formatted dates are excluded by a date maximum, and unmatched category labels stay outside the ten intended category counts until an explicit mapping is applied.',
  },
  'case-study': {
    eyebrow: 'Chapter 04 · 4.6 · Inventory case study',
    title: 'Prepare the inventory for analysis',
    intro: 'You have joined Maven Market as a data analyst. Inspect the 100 product records, apply only documented corrections, and inspect the updated cells.',
    label: 'Quality assurance prepares data for a question',
    definition: 'Check what each field means, find values the profile cannot explain, then verify a correction against its source.',
    note: 'A successful QA pass does not make every value known: eight prices remain empty, one row for each product stays in the inventory, and an outlier alone never supplies a replacement value.',
  },
}

const LABELS: Record<Issue, string> = {
  missing: 'Represent 8 zero-coded prices as missing',
  dates: 'Parse the 15 text-formatted dates',
  identifiers: 'Store the SKU field as text',
  price: 'Correct the soup price using confirmation',
  categories: 'Fix typos so category labels are consistent',
}

function money(value: number | null, digits = 2) {
  return value === null ? '—' : `$${value.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })}`
}

function dateLabel(value: string | null) {
  if (!value) return '—'
  const date = new Date(`${value}T12:00:00Z`)
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(date)
}

function formatCategory(category: string) {
  return category.endsWith(' ') ? <>{category.slice(0, -1)}<span className="qa-workbench__space-mark" role="img" aria-label="trailing space">␠</span></> : category
}

function DefinitionDiagram() {
  return <div className="qa-workbench__diagram" role="img" aria-label="Inspect values, verify evidence, apply a documented change, and recalculate the profile.">
    <div><span>01</span><strong>Inspect</strong><small>Rows and summaries</small></div><i aria-hidden="true">→</i>
    <div><span>02</span><strong>Verify</strong><small>Check meaning and source</small></div><i aria-hidden="true">→</i>
    <div><span>03</span><strong>Prepare</strong><small>Apply a known change</small></div><i aria-hidden="true">→</i>
    <div><span>04</span><strong>Recheck</strong><small>Inspect the updated table</small></div>
  </div>
}

function FixDots({ fixes }: { fixes: Issue[] }) {
  return fixes.length ? <span className="qa-workbench__fix-dots">{fixes.map(fix => <span key={fix} data-fix={fix} className="qa-workbench__fix-dot" role="img" aria-label={LABELS[fix]} title={LABELS[fix]} />)}</span> : null
}

function MetricCard({ label, value, detail, onClick, pressed, original, fixes = [] }: { fixes?: Issue[]; label: string; value: string; detail: string; onClick?: () => void; pressed?: boolean; original?: string }) {
  const content = <><span className="qa-workbench__metric-label">{label}</span><strong className={original !== undefined && original !== value ? 'qa-workbench__changed-value' : undefined} data-original={original !== undefined && original !== value ? `Before fix: ${original}` : undefined} tabIndex={!onClick && original !== undefined && original !== value ? 0 : undefined}>{value}{original !== undefined && original !== value && <span className="qa-workbench__changed-dot" aria-label="Changed from workbook"> •</span>}</strong><small>{detail}</small><FixDots fixes={fixes} /></>
  return onClick
    ? <button type="button" className="qa-workbench__metric qa-workbench__metric--button" onClick={onClick} aria-pressed={pressed}>{content}<span className="qa-workbench__metric-action">Focus rows ↗</span></button>
    : <div className="qa-workbench__metric">{content}</div>
}

function SummaryMetrics({ currentRows, state, focus, onFocus }: { state: QAState; currentRows: PreparedInventoryRecord[]; focus: MetricFocus; onFocus: (focus: MetricFocus) => void }) {
  const before = useMemo(() => inventoryMetrics(prepareInventory(INITIAL_QA)), [])
  const current = useMemo(() => inventoryMetrics(currentRows), [currentRows])
  const withoutFix = ISSUE_ORDER.filter(issue => state[issue]).map(issue => ({ issue, metrics: inventoryMetrics(prepareInventory({ ...state, [issue]: false })) }))
  const affecting = (key: 'minPrice' | 'maxPrice' | 'meanPrice' | 'earliestDate' | 'latestDate') => withoutFix.filter(item => item.metrics[key] !== current[key]).map(item => item.issue)
  return <section className="qa-workbench__profiles" aria-labelledby="qa-profiles-title">
    <div className="qa-workbench__section-head"><div><h2 id="qa-profiles-title">Inventory at a glance</h2><p>Changed numbers are colored. Hover to see the original value.</p></div></div>
    <div className="qa-workbench__compact-profile">
      <div className="qa-workbench__metrics">
        <MetricCard label="Number of records" value={String(current.records)} detail="One product per row" />
        <MetricCard original={money(before.minPrice)} fixes={affecting('minPrice')} label="Minimum unit price" value={money(current.minPrice)} detail="" onClick={() => onFocus('min')} pressed={focus === 'min'} />
        <MetricCard original={money(before.meanPrice, 4)} fixes={affecting('meanPrice')} label="Average unit price" value={money(current.meanPrice, 4)} detail="Sum of prices ÷ non-empty prices" />
        <MetricCard original={money(before.maxPrice)} fixes={affecting('maxPrice')} label="Maximum unit price" value={money(current.maxPrice)} detail="" onClick={() => onFocus('max')} pressed={focus === 'max'} />
        <MetricCard original={dateLabel(before.earliestDate)} fixes={affecting('earliestDate')} label="Earliest stock date" value={dateLabel(current.earliestDate)} detail="" onClick={() => onFocus('earliest')} pressed={focus === 'earliest'} />
        <MetricCard original={dateLabel(before.latestDate)} fixes={affecting('latestDate')} label="Latest stock date" value={dateLabel(current.latestDate)} detail="" onClick={() => onFocus('latest')} pressed={focus === 'latest'} />
      </div>
      <table className="qa-workbench__compact-counts">
        <caption>Count by Category</caption>
        <thead><tr><th scope="col">Category</th><th scope="col">Products</th></tr></thead>
        <tbody>{CATEGORIES.map(category => {
          const count = current.categoryCounts.find(item => item.category === category)?.count ?? 0
          const original = before.categoryCounts.find(item => item.category === category)?.count ?? 0
          return <tr key={category} className={count !== original ? 'qa-workbench__category-changed' : undefined}><th scope="row">{formatCategory(category)}{count !== original && <FixDots fixes={['categories']} />}</th><td><span className={count !== original ? 'qa-workbench__changed-value' : undefined} data-original={count !== original ? `Before fix: ${original}` : undefined} tabIndex={count !== original ? 0 : undefined}>{count}</span></td></tr>
        })}</tbody>
        <tfoot><tr className={current.recognizedCategories !== before.recognizedCategories ? 'qa-workbench__category-changed' : undefined}><th scope="row">Total</th><td><span className={current.recognizedCategories !== before.recognizedCategories ? 'qa-workbench__changed-value' : undefined} data-original={current.recognizedCategories !== before.recognizedCategories ? `Before fix: ${before.recognizedCategories}` : undefined} tabIndex={current.recognizedCategories !== before.recognizedCategories ? 0 : undefined}>{current.recognizedCategories}</span></td></tr></tfoot>
      </table>
    </div>
  </section>
}

export function QAWorkbench({ mode }: { mode: Mode }) {
  const content = MODE_CONTENT[mode]
  const [state, setState] = useState<QAState>(INITIAL_QA)
  const [selectedIssue, setSelectedIssue] = useState<Issue>(mode === 'ranges' ? 'categories' : 'missing')
  const [filter, setFilter] = useState<'all' | 'selected'>('all')
  const [focus, setFocus] = useState<MetricFocus>(null)
  const [evidenceRead, setEvidenceRead] = useState(false)
  const [tableJump, setTableJump] = useState(0)
  const rows = useMemo(() => prepareInventory(state), [state])
  const metrics = useMemo(() => inventoryMetrics(rows), [rows])
  const issueRows = new Set(ISSUE_ROWS[selectedIssue])
  const visibleRows = rows.filter(row => {
    if (filter === 'selected' && selectedIssue !== 'identifiers' && !issueRows.has(row.row)) return false
    return true
  })
  const visibleIssues = mode === 'missing' ? ['missing'] as Issue[] : mode === 'ranges' ? ['dates', 'price', 'categories'] as Issue[] : ISSUE_ORDER
  const tableWrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!focus) return
    tableWrapRef.current?.querySelector('[data-metric-target="true"]')?.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'instant' })
  }, [focus, filter])

  const setMetricFocus = (next: MetricFocus) => {
    if (next) setFilter('all')
    setFocus(next)
  }

  const changeState = (issue: Issue, checked: boolean) => {
    if (issue === 'price' && checked && !evidenceRead) return
    const next = { ...state, [issue]: checked }
    setState(next)
    setSelectedIssue(issue)
    setFocus(null)
    setTableJump(value => value + 1)
  }

  useEffect(() => {
    if (!tableJump) return
    const firstRow = selectedIssue === 'identifiers' ? rows[0]?.row : ISSUE_ROWS[selectedIssue][0]
    const target = tableWrapRef.current?.querySelector(`[data-workbook-row="${firstRow}"]`)
    target?.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'instant' })
  }, [tableJump, selectedIssue, rows])

  const focusRows = (row: PreparedInventoryRecord) => {
    if (!focus) return false
    if (focus === 'min') return row.price !== null && row.price === metrics.minPrice
    if (focus === 'max') return row.price !== null && row.price === metrics.maxPrice
    if (focus === 'earliest') return !row.dateIsText && row.stockDate === metrics.earliestDate
    if (focus === 'latest') return !row.dateIsText && row.stockDate === metrics.latestDate
    return row.category === focus.slice('category:'.length)
  }

  const isIssueCell = (row: PreparedInventoryRecord, column: string) =>
    (column === 'price' && ISSUE_ROWS.missing.includes(row.row) && state.missing) ||
    (column === 'date' && ISSUE_ROWS.dates.includes(row.row) && state.dates) ||
    (column === 'sku' && state.identifiers) ||
    (column === 'price' && ISSUE_ROWS.price.includes(row.row) && state.price) ||
    (column === 'category' && ISSUE_ROWS.categories.includes(row.row) && state.categories)

  const cellFix = (row: PreparedInventoryRecord, column: string): Issue | undefined => {
    if (column === 'date' && state.dates && ISSUE_ROWS.dates.includes(row.row)) return 'dates'
    if (column === 'category' && state.categories && ISSUE_ROWS.categories.includes(row.row)) return 'categories'
    if (column === 'sku' && state.identifiers) return 'identifiers'
    if (column === 'price' && state.price && ISSUE_ROWS.price.includes(row.row)) return 'price'
    if (column === 'price' && state.missing && ISSUE_ROWS.missing.includes(row.row)) return 'missing'
    return undefined
  }

  return <article className="qa-workbench" aria-labelledby="qa-workbench-title">
    <header className="qa-workbench__intro">
      <p className="qa-workbench__eyebrow">{content.eyebrow}</p>
      <h1 id="qa-workbench-title">{content.title}</h1>
      <p><strong>{content.intro.split('.')[0]}.</strong>{content.intro.includes('.') ? content.intro.slice(content.intro.indexOf('.') + 1) : ''}</p>
      
    </header>

    <section className="qa-workbench__definition" aria-labelledby="qa-definition-title">
      <div className="qa-workbench__definition-copy"><p className="qa-workbench__eyebrow">{content.label}</p><h2 id="qa-definition-title">{content.definition}</h2><p>{content.note}</p></div>
      <DefinitionDiagram />
    </section>

    {mode === 'missing' && <section className="qa-workbench__missing-options" aria-labelledby="qa-missing-options-title">
      <div><p className="qa-workbench__eyebrow">Three possible responses</p><h2 id="qa-missing-options-title">Choose a treatment only after understanding its effect</h2></div>
      <div className="qa-workbench__option-grid">
        <article className="is-recommended"><span>Used in this workbench</span><h3>Keep as unknown</h3><p><strong>Preserve all 100 products</strong> and exclude the eight unknown prices from price summaries. Their values stay empty.</p></article>
        <article><span>Changes the population</span><h3>Remove the rows</h3><p><strong>Dropping eight products</strong> changes the records available for every later analysis. Check why the prices are missing before removing records.</p></article>
        <article><span>Needs evidence and a method</span><h3>Impute a value</h3><p><strong>Do not fill from a guess.</strong> Imputation needs a defensible source or validated method, and the added uncertainty should be documented.</p><aside className="qa-workbench__imputation-methods"><strong>Common methods</strong><p>For numbers, use a <strong>mean (average)</strong> or <strong>median</strong>; for categories, the <strong>mode (most common value)</strong>. Other options include <strong>nearest neighbors</strong> and <strong>predictive models</strong>.</p><p>The choice depends on the data and why values are missing. A filled value is still an <em>estimate</em>.</p></aside></article>
      </div>
    </section>}

    <section className="qa-workbench__workbench" aria-labelledby="qa-inspect-title">
      <div className="qa-workbench__section-head qa-workbench__section-head--start"><div><p className="qa-workbench__eyebrow">Inspect · select a known issue to highlight its cells</p><h2 id="qa-inspect-title">A 100-record product inventory</h2><p>Each row represents one product.</p></div>
        <label className="qa-workbench__filter"><input type="checkbox" role="switch" checked={filter === 'selected'} onChange={event => setFilter(event.target.checked ? 'selected' : 'all')} /><span className="qa-workbench__filter-track" aria-hidden="true" /><span>Selected issues only<small>{filter === 'selected' ? 'On · filter to the selected issue' : 'Off · show all 100 records'}</small></span></label>
      </div>
      <div className="qa-workbench__issue-tabs" role="group" aria-label="Select issue to highlight">
        {visibleIssues.map(issue => <button type="button" data-fix={issue} key={issue} aria-pressed={selectedIssue === issue} onClick={() => { setSelectedIssue(issue); setFocus(null) }}><span>{ISSUE_INFO[issue].short}</span><strong>{ISSUE_INFO[issue].title}</strong><small>{ISSUE_ROWS[issue].length || 'Field'} {ISSUE_ROWS[issue].length === 1 ? 'row' : ISSUE_ROWS[issue].length ? 'rows' : 'check'}</small></button>)}
      </div>

      <div className="qa-workbench__fix-legend" aria-label="Fix color key">
        <strong>Fix colors</strong>{visibleIssues.map(issue => <span data-fix={issue} key={issue}><i aria-hidden="true" />{({ missing: 'Empty prices', dates: 'Date parsing', identifiers: 'SKU as text', price: 'Soup price', categories: 'Category typos' })[issue]}<small>{state[issue] ? 'Applied' : 'Off'}</small></span>)}
      </div>
      <div className="qa-workbench__table-panel">
        <div className="qa-workbench__table-head"><div><h3>Product inventory</h3><span>Row numbers identify the products.</span></div><span className="qa-workbench__record-pill">Showing {visibleRows.length} of 100</span></div>
        <div className="qa-workbench__table-wrap" ref={tableWrapRef} tabIndex={0} role="region" aria-label="Scrollable product inventory">
          <table className="qa-workbench__table">
            <caption>Product inventory · click an issue above or a profile metric to find its rows.</caption>
            <thead><tr><th scope="col">Row</th><th scope="col">Stock date</th><th scope="col">Product</th><th scope="col">Category</th><th scope="col">SKU</th><th scope="col">Unit price</th><th scope="col">Units sold</th><th scope="col">Discounted</th></tr></thead>
            <tbody>{visibleRows.map(row => {
              const selected = issueRows.has(row.row)
              const focused = focusRows(row)
              return <tr data-workbook-row={row.row} key={row.row} className={`${selected ? 'is-selected-issue ' : ''}${focused ? 'is-metric-focus' : ''}`}>
                <th scope="row" data-metric-target={focused || undefined}>{row.row}<FixDots fixes={[...new Set(['date', 'category', 'sku', 'price'].map(column => cellFix(row, column)).filter((fix): fix is Issue => fix !== undefined))]} /></th>
                <td data-fix={cellFix(row, 'date')} title={cellFix(row, 'date') ? `Applied fix: ${LABELS[cellFix(row, 'date')!]}` : undefined} className={`${selectedIssue === 'dates' && ISSUE_ROWS.dates.includes(row.row) ? 'is-selected-cell ' : ''}${isIssueCell(row, 'date') ? 'is-issue-cell ' : ''}${row.dateIsText ? 'is-text-date' : ''}`}>{row.dateIsText ? <>{row.stockDate}<span className="qa-workbench__type-tag">text</span></> : dateLabel(row.stockDate)}</td>
                <td>{row.product}</td>
                <td data-fix={cellFix(row, 'category')} title={cellFix(row, 'category') ? `Applied fix: ${LABELS[cellFix(row, 'category')!]}` : undefined} className={`${selectedIssue === 'categories' && ISSUE_ROWS.categories.includes(row.row) ? 'is-selected-cell ' : ''}${isIssueCell(row, 'category') ? 'is-issue-cell' : ''}`}>{formatCategory(row.category)}</td>
                <td data-fix={cellFix(row, 'sku')} title={cellFix(row, 'sku') ? `Applied fix: ${LABELS[cellFix(row, 'sku')!]}` : undefined} className={`${selectedIssue === 'identifiers' ? 'is-selected-cell ' : ''}${isIssueCell(row, 'sku') ? 'is-issue-cell' : ''}`}><span className={typeof row.sku === 'string' ? 'qa-workbench__identifier' : ''}>{row.sku}</span></td>
                <td data-fix={cellFix(row, 'price')} title={cellFix(row, 'price') ? `Applied fix: ${LABELS[cellFix(row, 'price')!]}` : undefined} className={`${(selectedIssue === 'missing' && ISSUE_ROWS.missing.includes(row.row)) || (selectedIssue === 'price' && ISSUE_ROWS.price.includes(row.row)) ? 'is-selected-cell ' : ''}${isIssueCell(row, 'price') ? 'is-issue-cell' : ''}`}>{row.price === null ? <span className="qa-workbench__unknown">Unknown · empty</span> : money(row.price)}</td>
                <td>{row.units.toLocaleString('en-US')}</td><td>{row.discounted ? 'Yes' : 'No'}</td>
              </tr>
            })}</tbody>
          </table>
        </div>
        {filter === 'selected' && <p className="qa-workbench__filter-note">Showing rows flagged for <strong>{ISSUE_INFO[selectedIssue].title}</strong>. No records are removed from the underlying inventory.</p>}
      </div>
      <aside className="qa-workbench__table-note"><strong>What to notice:</strong> {selectedIssue === 'dates' ? 'The dates look like calendar dates, but the May entries are text and do not contribute to a date maximum until parsed.' : selectedIssue === 'identifiers' ? 'The full SKU field is highlighted: every value is an identifier, and arithmetic on an identifier has no product meaning. The workbook does not show lost digits.' : selectedIssue === 'price' ? 'The $375 entry is a signal to investigate. The correction is unavailable until you open the supplied manager confirmation.' : selectedIssue === 'categories' ? 'Spelling, punctuation, pluralization, and a single trailing space create distinct labels.' : 'The eight zero-coded values conceal missing prices. Representing them as empty keeps them out of price calculations without deleting their product records.'}</aside>
    </section>

    <SummaryMetrics currentRows={rows} state={state} focus={focus} onFocus={setMetricFocus} />

    <section className="qa-workbench__actions" aria-labelledby="qa-actions-title">
      <div className="qa-workbench__section-head"><div><p className="qa-workbench__eyebrow">Verify · apply documented changes only</p><h2 id="qa-actions-title">Try a correction</h2><p>Switch a fix on or off. The table moves to its affected cells, with changed cells highlighted.</p></div></div>
      <div className="qa-workbench__action-layout"><div className="qa-workbench__corrections">
        {visibleIssues.map(issue => <div className="qa-workbench__correction" data-fix={issue} key={issue}>
          <label><input type="checkbox" checked={state[issue]} disabled={issue === 'price' && !evidenceRead} onChange={event => changeState(issue, event.target.checked)} /><span><strong>{LABELS[issue]}</strong><small>{ISSUE_INFO[issue].correction}</small></span></label>
          {issue === 'dates' && <p className="qa-workbench__date-clue"><strong>The table continues into May.</strong> Browsing the rows reveals dates through <strong>May 30</strong>. The summary initially stops at <strong>April 28</strong> because the May entries are stored as text and ignored by the date calculation. <strong>Parsing the dates reveals the correct latest stock date: May 30.</strong></p>}
          {issue === 'price' && !evidenceRead && <button type="button" className="qa-workbench__evidence-button" onClick={() => setEvidenceRead(true)}>Read supplied correction</button>}
          {issue === 'price' && evidenceRead && <p className="qa-workbench__evidence"><strong>Manager confirmation:</strong> Blue Label Noodle Soup was entered as $375 and should be $3.75. This confirmation supports the correction.</p>}
        </div>)}
        <p className="qa-workbench__correction-note"><strong>SKU note:</strong> the case study describes storing numeric-looking SKUs as text. This workbook profile does not identify any damaged SKU rows, so changing the field type does not alter a row value or create a missing-identifier claim.</p>
      </div></div>
    </section>

    <section className="qa-workbench__summary" aria-labelledby="qa-summary-title"><p className="qa-workbench__eyebrow">What a careful QA pass establishes</p><h2 id="qa-summary-title">Keep the records. Improve how their values are represented.</h2><div><p><strong>100 product records remain.</strong> The current preparation keeps every product while clarifying the fields selected above.</p><p><strong>{state.missing ? 'Eight prices are empty and excluded.' : 'Eight zero-coded unknowns still enter the current price calculations.'}</strong> {state.missing ? `The mean uses ${metrics.priceCount} calculated prices; no missing price is guessed or imputed.` : `The workbook profile still calculates across ${metrics.priceCount} numeric cells until the missing-value switch is applied.`}</p><p><strong>Every correction is traceable.</strong> A profile flags what to check, and source evidence supports any value change.</p></div></section>
  </article>
}

export function QACaseStudy() { return <QAWorkbench mode="case-study" /> }
