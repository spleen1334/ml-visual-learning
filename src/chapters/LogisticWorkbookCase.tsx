import { useState } from 'react'
import workbook from './logisticWorkbookData.json'
import { sigmoid } from './logisticMath'
import './LogisticWorkbookCase.css'

const saved = { intercept: -21.962, slope: 2.516 }
const raw = workbook.rawData
const sorted = [...raw].sort((a, b) => a.emailsPerWeek - b.emailsPerWeek)
const probability = (x: number, intercept: number, slope: number) => sigmoid(intercept + slope * x)
const outcomeProbability = (p: number, y: number) => y === 1 ? p : 1 - p

export function LogisticCase() {
  const [optimized, setOptimized] = useState(true)
  const [intercept, setIntercept] = useState(-11.5)
  const [slope, setSlope] = useState(2)
  const [showModel, setShowModel] = useState(true)
  const [jitter, setJitter] = useState(false)
  const [query, setQuery] = useState('9')
  const [selected, setSelected] = useState<number | null>(null)
  const b0 = optimized ? saved.intercept : intercept
  const b1 = optimized ? saved.slope : slope
  const score = sorted.reduce((sum, row) => sum + outcomeProbability(probability(row.emailsPerWeek, b0, b1), row.unsubscribe), 0)
  const queryX = query.trim() === '' ? null : Number(query)
  const queryP = queryX !== null && Number.isFinite(queryX) ? probability(queryX, saved.intercept, saved.slope) : null
  const sx = (x: number) => 64 + x / 18 * 660
  const sy = (p: number) => 360 - (p + .2) / 1.4 * 310
  const modelPath = sorted.map((row, i) => `${i ? 'L' : 'M'}${sx(row.emailsPerWeek)},${sy(probability(row.emailsPerWeek, b0, b1))}`).join(' ')
  const selectedRow = raw.find(row => row.customer === selected)
  return <article className="lrw" aria-labelledby="lrw-title">
    <header><p className="lrw__eyebrow">9.21 · Logistic regression</p><h1 id="lrw-title">Case study: logistic regression</h1><p>As marketing manager at <strong>Lux Dining</strong>, investigate how weekly email frequency relates to unsubscribing. Use the supplied model to find its 50% decision point.</p></header>
    <div className="lrw__sheet">
      <section className="lrw__records" aria-label="Emails per week and unsubscribes">
        <h2>Emails Per Week &amp; Unsubscribes</h2>
        <div className="lrw__scroll" tabIndex={0} aria-label="All 624 customer records, scroll to see more">
          <table><thead><tr>{['Customer', 'Emails Per Week', 'Unsubscribe', 'Prediction', 'Likelihood'].map(title => <th scope="col" key={title}>{title}</th>)}</tr></thead><tbody>{raw.map(row => <tr key={row.customer} className={selected === row.customer ? 'is-selected' : ''}>
            <th scope="row"><button aria-pressed={selected === row.customer} aria-label={`Trace customer ${row.customer}`} onClick={() => setSelected(selected === row.customer ? null : row.customer)}>{row.customer}</button></th><td>{row.emailsPerWeek.toFixed(2)}</td><td>{row.unsubscribe}</td><td>{row.predictionCached.toFixed(3)}</td><td>{row.likelihoodCached.toFixed(3)}</td>
          </tr>)}</tbody></table>
        </div>
        <p className="lrw__caption">624 customers · 1 = unsubscribed, 0 = stayed. Prediction and Likelihood columns use the saved coefficients, as in Excel. Select a customer number to trace its calculation.</p>
        {selectedRow && <div className="lrw__trace" aria-live="polite"><strong>Customer {selectedRow.customer} · observed y = {selectedRow.unsubscribe}</strong><p>p = 1 / (1 + e<sup>−(−21.962 + 2.516 × {selectedRow.emailsPerWeek})</sup>) = {selectedRow.predictionCached.toFixed(6)}</p><p>Probability of this observed outcome: <b>{selectedRow.unsubscribe === 1 ? 'p' : '1 − p'} = {selectedRow.likelihoodCached.toFixed(6)}</b></p></div>}
      </section>
      <section className="lrw__model" aria-label="Workbook model controls and chart">
        <div className="lrw__controls">
          <div className="lrw__query"><strong className="lrw__query-title">Test a specific case</strong><p id="lrw-query-help">Enter emails per week (input X) to predict the probability of unsubscribing.</p><label>Emails Per Week: <input aria-label="Emails per week to predict" aria-describedby="lrw-query-help" type="number" step="any" value={query} onChange={event => setQuery(event.target.value)} /></label><div><span>Unsubscribe Probability:</span><output aria-live="polite">{queryP === null ? '—' : `${(queryP * 100).toFixed(1)}%`}</output></div><p>Prediction uses the saved fitted model.</p></div>
          <div className="lrw__fit">
            <h2>Model settings</h2>
            <div className="lrw__fit-values">
          <div className="lrw__coefficients">
            <label>Select β₀ <input aria-label="Select intercept beta zero" type="number" min={-25} max={0} step={.5} value={b0} disabled={optimized} onChange={event => { if (event.target.value !== '') setIntercept(Math.max(-25, Math.min(0, Number(event.target.value)))) }} /></label>
            <label>Select β₁ <input aria-label="Select slope beta one" type="number" min={0} max={25} step={.5} value={b1} disabled={optimized} onChange={event => { if (event.target.value !== '') setSlope(Math.max(0, Math.min(25, Number(event.target.value)))) }} /></label>
          </div>
          <div className="lrw__objective"><span>LIKELIHOOD*</span><output aria-live="polite">{showModel ? score.toFixed(1) : '—'}</output><label><input type="checkbox" checked={optimized} onChange={event => setOptimized(event.target.checked)} />Optimize · restore saved fit</label></div>
            </div>
            <p className="lrw__model-note"><strong>Optimize restores the pre-calculated fitted model.</strong> The course supplies β₀ and β₁; no new optimization runs here. Uncheck to adjust the curve. The table and test case keep using the saved model.</p>
          </div>
        </div>
        <svg className="lrw__chart" viewBox="0 0 770 420" role="img" aria-label="Workbook chart: emails per week from 0 to 18, unsubscribe probability from minus 20 to 120 percent; observed binary labels, logistic model and unobserved value.">
          <defs><clipPath id="lrw-plot"><rect x="64" y="50" width="660" height="310" /></clipPath></defs>
          {[-.2, 0, .2, .4, .6, .8, 1, 1.2].map(p => <g key={p}><line x1="64" x2="724" y1={sy(p)} y2={sy(p)} className="lrw__grid" /><text x="54" y={sy(p) + 4} textAnchor="end">{Math.round(p * 100)}%</text></g>)}
          {[0, 2, 4, 6, 8, 10, 12, 14, 16, 18].map(x => <text key={x} x={sx(x)} y="382" textAnchor="middle">{x}</text>)}
          <g clipPath="url(#lrw-plot)">
            {showModel && <>
              <line x1="64" x2="724" y1={sy(.5)} y2={sy(.5)} className="lrw__decision" />
              {b1 !== 0 && -b0 / b1 >= 0 && -b0 / b1 <= 18 && <g>
                <line x1={sx(-b0 / b1)} x2={sx(-b0 / b1)} y1={sy(.5)} y2={sy(0)} className="lrw__decision" />
                <text x={sx(-b0 / b1) + 9} y={sy(.5) - 12}>50% at {(-b0 / b1).toFixed(2)} emails/week</text>
              </g>}
              <path d={modelPath} className="lrw__curve" />
            </>}
            {raw.map((row, i) => { const offset = jitter ? (((i * 73 + 19) % 201) - 100) / 1000 : 0; return <circle key={row.customer} cx={sx(row.emailsPerWeek)} cy={sy(row.unsubscribe + offset)} r={row.customer === selected ? 5 : 2.6} className={row.customer === selected ? 'lrw__selected' : 'lrw__observed'}><title>Customer {row.customer}: {row.emailsPerWeek} emails/week; observed unsubscribe {row.unsubscribe}</title></circle> })}
            {queryP !== null && queryX !== null && <circle cx={sx(queryX)} cy={sy(queryP)} r="5.5" className="lrw__query-point"><title>Saved model prediction at {queryX} emails/week: {(queryP * 100).toFixed(1)}%</title></circle>}
          </g>
          <text transform="translate(17 205) rotate(-90)" textAnchor="middle">UNSUBSCRIBE PROBABILITY</text><text x="394" y="410" textAnchor="middle">EMAILS PER WEEK</text>
          <g className="lrw__legend"><line x1="542" x2="565" y1="220" y2="220" className="lrw__curve"/><text x="574" y="224">Logistic Model</text><circle cx="553" cy="242" r="3" className="lrw__observed"/><text x="574" y="246">Observed Values</text><circle cx="553" cy="264" r="4" className="lrw__query-point"/><text x="574" y="268">Unobserved Value</text></g>
        </svg>
        <div className="lrw__chart-controls"><label><input type="checkbox" checked={jitter} onChange={event => setJitter(event.target.checked)}/>Add Jitter</label><label><input type="checkbox" checked={showModel} onChange={event => setShowModel(event.target.checked)}/>Show Model</label></div>
        {jitter && <p className="lrw__jitter-note"><strong>Jitter separates overlapping dots</strong> by up to ±0.1 vertically. <strong>Observed labels remain 0 or 1</strong>; a repeatable spread replaces Excel’s random redraw.</p>}
        <p className="lrw__correction">* The worksheet’s “Likelihood” total <strong>adds</strong> each observed-outcome probability. Statistical likelihood <strong>multiplies</strong> them (see 9.19). The saved coefficients are supplied course values.</p>
        <details className="lrw__calculation"><summary>Worksheet calculation</summary><p>Plotted p = 1 / (1 + e<sup>−({b0} + {b1} × emails)</sup>). Each row contributes p if y = 1, or 1 − p if y = 0. The displayed worksheet total is their sum: {showModel ? score.toFixed(6) : 'hidden with model'}.</p><p>The saved model reaches 50% at {( -saved.intercept / saved.slope).toFixed(2)} emails/week. This is the course’s decision point, not evidence that changing email frequency causes a customer to unsubscribe.</p></details>
      </section>
    </div>
    <details className="lrw__chart-source"><summary>Chart source table · all 624 sorted observations</summary><div className="lrw__scroll" tabIndex={0} aria-label="Complete sorted chart source"><table><thead><tr>{['Emails', 'Unsubscribe', 'Model', 'Unsubscribe (w/Jitter)', 'Likelihood'].map(title => <th scope="col" key={title}>{title}</th>)}</tr></thead><tbody>{sorted.map((row, index) => { const p = probability(row.emailsPerWeek, b0, b1); const original = raw[index]; const offset = jitter ? (((index * 73 + 19) % 201) - 100) / 1000 : 0; return <tr key={row.customer}><td>{row.emailsPerWeek.toFixed(2)}</td><td>{row.unsubscribe}</td><td>{showModel ? p.toFixed(6) : '—'}</td><td>{(original.unsubscribe + offset).toFixed(3)}</td><td>{showModel ? outcomeProbability(p, row.unsubscribe).toFixed(6) : '—'}</td></tr> })}</tbody></table></div><p className="lrw__caption">Emails and Unsubscribe are sorted together for the curve. The jitter column keeps the original customer order and pairs with the original email column for the observed dots.</p></details>
  </article>
}
