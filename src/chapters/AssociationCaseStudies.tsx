import { useMemo, useState } from 'react'
import './AssociationMining.css'
import './AssociationCaseStudies.css'
import { APRIORI_ITEMS } from './aprioriItemFrequencies'
import {
  APRIORI_TRANSACTIONS, APRIORI_TRANSACTION_COUNT, MARKOV_CUSTOMER_STATES,
  MARKOV_RECORDS, MARKOV_STATES, calculateSelectedPair, filterAprioriTransactions,
  getMarkovTransitionCounts, getTopProductPrediction,
} from './associationWorkbook'
import markovSourceChart from '../assets/association-case-markov-source-chart.svg'

const PAGE_SIZE = 50
const number = (value: number) => value.toLocaleString('en-US')
const percent = (value: number, digits = 1) => `${(value * 100).toFixed(digits)}%`
const excelDate = (serial: number) => new Date(Date.UTC(1899, 11, 30) + Math.floor(serial) * 86400000).toISOString().slice(0, 10)
const excelTime = (fraction: number) => new Date(Math.round(fraction * 86400000)).toISOString().slice(11, 19)
const product = (value: string) => value === '-' ? 'No second purchase' : value.replace(/\b\w/g, (letter) => letter.toUpperCase())

function RecordPagination({ page, setPage, count }: { page: number; setPage: (page: number) => void; count: number }) {
  const pages = Math.ceil(count / PAGE_SIZE)
  return <nav className="association-sheet-pagination" aria-label="Record pages">
    <button disabled={page === 0} onClick={() => setPage(page - 1)} aria-label="Previous 50 records" title="Previous 50 records">←</button>
    <label>Page <input type="number" min={1} max={pages} value={page + 1} onChange={(event) => {
      const next = Number(event.target.value)
      if (Number.isInteger(next) && next >= 1 && next <= pages) setPage(next - 1)
    }} /> of {pages}</label>
    <button disabled={page === pages - 1} onClick={() => setPage(page + 1)} aria-label="Next 50 records" title="Next 50 records">→</button>
  </nav>
}

function AprioriSupportChart({ threshold }: { threshold: number }) {
  const items = APRIORI_ITEMS.slice(0, 50)
  const left = 43, top = 20, width = 666, height = 264
  const step = width / items.length
  return <figure className="association-sheet-support">
    <figcaption><strong>Support</strong> (Top 50 Products)</figcaption>
    <div className="association-sheet-chart-scroll" tabIndex={0} aria-label="Scrollable support chart">
      <svg viewBox="0 0 730 440" role="img" aria-labelledby="association-support-title association-support-description">
        <title id="association-support-title">Support for the top 50 products</title>
        <desc id="association-support-description">Vertical columns on a support scale from 0 to 0.6. Cyan marks products at or above the selected minimum support; black marks products below it. All 94 exact values are in the adjacent frequency table.</desc>
        {Array.from({ length: 7 }, (_, tick) => {
          const value = tick / 10
          const y = top + height * (1 - value / .6)
          return <g key={tick}><line x1={left} y1={y} x2={left + width} y2={y} stroke="#d8dfdc" /><text x={left - 9} y={y + 4} textAnchor="end" className="association-sheet-axis">{value === 0 ? '0' : value.toFixed(1)}</text></g>
        })}
        {items.map(({ item, support }, index) => {
          const x = left + step * index + step * .17
          const barHeight = support / .6 * height
          return <g key={item}><title>{item}: {support.toFixed(6)} ({percent(support)}) · {support >= threshold ? 'above' : 'below'} minimum support</title><rect x={x} y={top + height - barHeight} width={step * .66} height={barHeight} fill={support >= threshold ? '#26e2f6' : '#353837'} /><text transform={`translate(${x + step * .33},${top + height + 7}) rotate(-90)`} textAnchor="end" className="association-sheet-category">{item}</text></g>
        })}
      </svg>
    </div>
    <p className="association-sheet-chart-key"><span><i />At or above {threshold.toFixed(2)}</span><span><i />Below {threshold.toFixed(2)}</span></p>
  </figure>
}

export function AprioriCaseStudy() {
  const [threshold, setThreshold] = useState(.04)
  const [itemA, setItemA] = useState('Coffee')
  const [itemB, setItemB] = useState('Tea')
  const [page, setPage] = useState(0)
  const retained = useMemo(() => filterAprioriTransactions(threshold).length, [threshold])
  const pair = useMemo(() => calculateSelectedPair(itemA, itemB, threshold), [itemA, itemB, threshold])
  const rows = APRIORI_TRANSACTIONS.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
  return <article className="assoc-lesson association-case-sheet">
    <header className="assoc-header"><p className="assoc-eyebrow">19.8 · Case study: Apriori</p><h1>Case study: Apriori</h1><p className="assoc-header-subtitle">As owner of <strong>Coastal Roasters</strong>, find which items customers purchase together in 9,531 transactions over six months, to inform product placement and promotions.</p></header>
    <div className="association-sheet-overflow">
      <div className="association-sheet-apriori">
        <section className="association-sheet-records" aria-label="Coastal Roasters transaction records">
          <h2 className="association-sheet-title">Coastal Roasters transactions</h2>
          <p className="association-sheet-small">All {number(APRIORI_TRANSACTION_COUNT)} records · up to five items per transaction.</p>
          <RecordPagination page={page} setPage={setPage} count={APRIORI_TRANSACTION_COUNT} />
          <div className="association-sheet-table-scroll association-sheet-apriori-records" tabIndex={0} aria-label="Scrollable transaction records, including all five items">
            <table><caption>Transactions {number(page * PAGE_SIZE + 1)}–{number(Math.min((page + 1) * PAGE_SIZE, APRIORI_TRANSACTION_COUNT))} of {number(APRIORI_TRANSACTION_COUNT)}</caption><thead><tr><th scope="col">ID</th><th scope="col">Date</th><th scope="col">Time</th>{[1, 2, 3, 4, 5].map((item) => <th key={item} scope="col">Item {item}</th>)}</tr></thead><tbody>
              {rows.map((row) => {
                const excluded = row[8] < threshold
                const joint = !excluded && row.slice(3, 8).includes(itemA) && row.slice(3, 8).includes(itemB)
                return <tr key={row[0]} className={`${excluded ? 'is-excluded' : ''} ${joint ? 'is-joint' : ''}`} title={excluded ? `Excluded: minimum item support ${row[8].toFixed(6)} is below ${threshold.toFixed(2)}` : `Retained: minimum item support ${row[8].toFixed(6)}`}><th scope="row">{row[0]}</th><td>{excelDate(row[1])}</td><td>{excelTime(row[2])}</td>{row.slice(3, 8).map((item, index) => <td key={index}>{item === itemA || item === itemB ? <b>{item}</b> : item ?? ''}</td>)}</tr>
              })}
            </tbody></table>
          </div>
          <p className="association-sheet-small">Dimmed rows fall below the threshold. Tinted rows contain both selected items. Scroll right for all five item columns.</p>
        </section>
        <section className="association-sheet-frequencies" aria-label="All 94 product frequencies">
          <h2 className="association-sheet-title association-sheet-title-yellow">Item frequencies</h2>
          <p className="association-sheet-small">94 items · original worksheet order</p>
          <div className="association-sheet-table-scroll association-sheet-frequency-scroll" tabIndex={0} aria-label="Scrollable full item frequency table">
            <table aria-describedby="association-frequency-threshold-note"><caption>Support uses all 9,531 transactions</caption><thead><tr><th scope="col">Item</th><th scope="col">Count</th><th scope="col">Support</th></tr></thead><tbody>{APRIORI_ITEMS.map(({ item, count, support }) => {
              const excluded = support < threshold
              const selected = item === itemA || item === itemB
              return <tr key={item} className={`${selected ? 'is-selected-item' : ''} ${excluded ? 'is-excluded' : ''}`} title={`${excluded ? 'Below minimum support' : 'At or above minimum support'}: ${support.toFixed(6)} ${excluded ? '<' : '≥'} ${threshold.toFixed(2)}`}><th scope="row" title={item}>{item}{excluded && <span className="association-sheet-visually-hidden"> — Below minimum support</span>}</th><td>{number(count)}</td><td title={support.toFixed(9)}>{support.toFixed(3)}</td></tr>
            })}</tbody></table>
          </div>
          <p className="association-sheet-small" id="association-frequency-threshold-note">Dimmed items are below the support threshold; all 94 remain listed.</p>
        </section>
        <section className="association-sheet-analysis" aria-label="Support threshold, selected-pair calculations and chart">
          <div className="association-sheet-pair-top">
            <div className="association-sheet-inputs">
              <label className="association-sheet-threshold">Support threshold<input type="number" min={0} max={1} step={.01} value={threshold} onChange={(event) => {
                const value = Number(event.target.value)
                if (event.target.value !== '' && Number.isFinite(value) && value >= 0 && value <= 1) setThreshold(value)
              }} /></label>
              <p className="association-sheet-retained" aria-live="polite">{number(retained)} transactions retained</p>
              <label>Select item 1<select value={itemA} onChange={(event) => setItemA(event.target.value)}>{APRIORI_ITEMS.map(({ item }) => <option key={item} disabled={item === itemB}>{item}</option>)}</select></label>
              <label>Select item 2<select value={itemB} onChange={(event) => setItemB(event.target.value)}>{APRIORI_ITEMS.map(({ item }) => <option key={item} disabled={item === itemA}>{item}</option>)}</select></label>
            </div>
            <div className="association-sheet-calculations" aria-live="polite">
              <h2 className="association-sheet-title association-sheet-title-yellow">Confidence &amp; lift</h2>
              <dl><dt>Support ({itemA})</dt><dd>{percent(pair.supportA)}</dd><dt>Support ({itemB})</dt><dd>{percent(pair.supportB)}</dd><dt>Support ({itemA}, {itemB})</dt><dd title={`${pair.jointCount} / ${number(pair.denominator)}`}>{percent(pair.jointSupport)}</dd></dl>
              <dl className="association-sheet-pair-result"><dt>Confidence</dt><dd title={`${pair.jointSupport.toFixed(6)} ÷ ${pair.supportA.toFixed(6)}`}>{percent(pair.confidence)}</dd><dt>Lift</dt><dd title={`${pair.jointSupport.toFixed(6)} ÷ (${pair.supportA.toFixed(6)} × ${pair.supportB.toFixed(6)})`}>{pair.lift.toFixed(2)}</dd></dl>
            </div>
          </div>
          <AprioriSupportChart threshold={threshold} />
          <p className="association-sheet-small association-sheet-denominator">Worksheet output: single-item support uses all 9,531 transactions; joint support uses {number(pair.jointCount)} ÷ {number(pair.denominator)} retained transactions. These mixed denominators are preserved.</p>
        </section>
      </div>
    </div>
  </article>
}

const transitionCounts = getMarkovTransitionCounts()
const rowTotals = transitionCounts.map((row) => row.reduce((total, count) => total + count, 0))

function TransitionMatrix({ probability, selected }: { probability: boolean; selected: number }) {
  const values = transitionCounts.map((row, index) => row.map((count) => probability ? count / rowTotals[index] : count))
  const productMaximum = Math.max(...values.flatMap((row) => row.slice(0, 7)))
  const noneMaximum = Math.max(...values.map((row) => row[7]))
  const heat = (value: number, column: number) => {
    const intensity = value / (column === 7 ? noneMaximum : productMaximum)
    return `rgb(${Math.round(255 - intensity * 238)}, ${Math.round(255 - intensity * 46)}, ${Math.round(255 - intensity * 27)})`
  }
  return <section className="association-sheet-matrix" aria-label={probability ? 'Probability matrix' : 'Frequency matrix'}>
    <h2 className="association-sheet-title">{probability ? 'Probability matrix' : 'Frequency matrix'}</h2>
    <div className="association-sheet-table-scroll" tabIndex={0} aria-label={`Scrollable ${probability ? 'probability' : 'frequency'} matrix`}>
      <table><caption>First purchase ↓ · second purchase →{probability ? ' · % of each first-purchase row' : ''}</caption><thead><tr><th scope="col"><span className="association-sheet-visually-hidden">First purchase</span></th>{MARKOV_STATES.map((state) => <th scope="col" className={state === '-' ? 'association-sheet-none' : ''} key={state}>{state === '-' ? <span title="No second purchase">No second<br />purchase</span> : state}</th>)}</tr></thead><tbody>{MARKOV_CUSTOMER_STATES.map((state, row) => <tr key={state} className={selected === row ? 'is-selected-state' : ''}><th scope="row">{state}</th>{values[row].map((value, column) => <td key={column} className={column === 7 ? 'association-sheet-none' : ''} style={{ backgroundColor: heat(value, column) }} title={probability ? `${number(transitionCounts[row][column])} ÷ ${number(rowTotals[row])} = ${percent(value, 2)}` : `${product(state)} → ${product(MARKOV_STATES[column])}: ${number(value)} customers`}>{probability ? percent(value, 0) : number(value)}</td>)}</tr>)}</tbody></table>
    </div>
  </section>
}

export function MarkovCaseStudy() {
  const [first, setFirst] = useState('bike')
  const [page, setPage] = useState(0)
  const selected = MARKOV_CUSTOMER_STATES.indexOf(first)
  const prediction = getTopProductPrediction(first)
  const rows = MARKOV_RECORDS.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
  const noSecond = transitionCounts[selected][7]
  return <article className="assoc-lesson association-case-sheet">
    <header className="assoc-header"><p className="assoc-eyebrow">19.10 · Case study: Markov chains</p><h1>Case study: Markov Chains</h1><p className="assoc-header-subtitle">As Senior Web Analyst at <strong>Alpine Supplies</strong>, use 14,418 customer purchase paths to identify the most likely next product and inform a cross-sell strategy. First and second purchases are separate events.</p></header>
    <div className="association-sheet-overflow"><div className="association-sheet-markov">
      <section className="association-sheet-records" aria-label="Alpine Supplies customer purchase paths">
        <h2 className="association-sheet-title">Alpine Supplies purchase paths</h2>
        <p className="association-sheet-small">All {number(MARKOV_RECORDS.length)} customer records</p>
        <RecordPagination page={page} setPage={setPage} count={MARKOV_RECORDS.length} />
        <div className="association-sheet-table-scroll association-sheet-markov-records" tabIndex={0} aria-label="Scrollable customer purchase paths"><table><caption>Customers {number(page * PAGE_SIZE + 1)}–{number(Math.min((page + 1) * PAGE_SIZE, MARKOV_RECORDS.length))} of {number(MARKOV_RECORDS.length)}</caption><thead><tr><th scope="col">Cust ID</th><th scope="col">first_purchase</th><th scope="col">second_purchase</th></tr></thead><tbody>{rows.map(([id, start, second]) => <tr key={id} className={start === first ? 'is-selected-customer' : ''}><th scope="row">{id}</th><td>{start}</td><td>{second === '-' ? <span aria-label="No second purchase">–</span> : second}</td></tr>)}</tbody></table></div>
        <p className="association-sheet-small">“–” means no second purchase was recorded. Tinted rows share the selected first purchase.</p>
      </section>
      <section className="association-sheet-markov-results" aria-label="Purchase transition matrices and next-product prediction">
        <TransitionMatrix selected={selected} probability={false} />
        <TransitionMatrix selected={selected} probability />
        <p className="association-sheet-small association-sheet-heat-key">Darker cyan = higher values. Products and “no second purchase” use separate color scales. Each probability row totals 100% before rounding.</p>
        <div className="association-sheet-markov-selector"><label>First purchase<select value={first} onChange={(event) => setFirst(event.target.value)}>{MARKOV_CUSTOMER_STATES.map((state) => <option key={state} value={state}>{state}</option>)}</select></label><div><span>Next purchase</span><output>{prediction.outcome}</output></div></div>
        <p className="association-sheet-small association-sheet-prediction-note" aria-live="polite">Most likely <strong>product</strong>: {prediction.outcome}, {number(prediction.count)} of {number(rowTotals[selected])} customers ({percent(prediction.count / rowTotals[selected], 0)}). No second purchase: {number(noSecond)} ({percent(noSecond / rowTotals[selected], 0)}).</p>
        <figure className="association-sheet-radial"><figcaption><strong>Purchase paths after Bike · saved view</strong>The selector updates the matrices and prediction; this chart stays on Bike. Customers without a second purchase are not plotted.</figcaption><img src={markovSourceChart} alt="Customer purchase-path scatter chart for a first purchase of bike. The 389 recorded second purchases radiate in cyan toward seven product icons: bike, bike basket, bike speaker, tent, backpack, cookware and cooler. The 316 customers with no second purchase are omitted." /></figure>
      </section>
    </div></div>
  </article>
}
