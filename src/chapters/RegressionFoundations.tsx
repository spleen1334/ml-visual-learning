import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import './RegressionModeling.css'
import './RegressionFoundations.css'

function Lesson({ number, title, lead, children }: { number: string; title: string; lead: string; children: ReactNode }) {
  return <article className="regression-modeling" aria-labelledby={`rf-${number}-title`}><header><p className="rm-eyebrow">Chapter 13 · Lesson {number}</p><h1 id={`rf-${number}-title`}>{title}</h1><p>{lead}</p></header>{children}</article>
}

function Definition({ children }: { children: ReactNode }) {
  return <section className="rm-definition"><p className="rm-eyebrow">The central idea</p><h2>{children}</h2></section>
}

function Summary({ children }: { children: ReactNode }) {
  return <aside className="rm-summary"><span>✓</span><p>{children}</p></aside>
}

type Point = { x: number; y: number }

const observations: Point[] = [
  { x: 10, y: 10 }, { x: 20, y: 25 }, { x: 30, y: 20 }, { x: 35, y: 30 }, { x: 40, y: 40 },
  { x: 50, y: 15 }, { x: 60, y: 40 }, { x: 65, y: 30 }, { x: 70, y: 50 }, { x: 80, y: 40 },
]

function TaxiGraph({ rate, selectedRide }: { rate: number; selectedRide: number }) {
  const left = 42
  const right = 286
  const top = 15
  const bottom = 194
  const px = (km: number) => left + km / 10 * (right - left)
  const py = (fare: number) => bottom - fare / 35 * (bottom - top)
  const fare = (km: number) => 3 + rate * km
  const steps = [0, 2, 4, 6, 8, 10]
  return <svg className="rf-chart" viewBox="0 0 310 230" role="img" aria-label={`Taxi fare starts at 3 euros and rises by ${rate.toFixed(1)} euros per kilometre. Selected ride: ${selectedRide} kilometres.`}>
    {[0, 10, 20, 30].map(value => <g key={`y-${value}`}><line className="rf-grid" x1={left} y1={py(value)} x2={right} y2={py(value)} /><text x={left - 8} y={py(value) + 4} textAnchor="end">€{value}</text></g>)}
    {steps.map(value => <g key={`x-${value}`}><line className="rf-grid rf-grid-vertical" x1={px(value)} y1={top} x2={px(value)} y2={bottom} /><text x={px(value)} y={bottom + 16} textAnchor="middle">{value}</text></g>)}
    <line className="rf-axis" x1={left} y1={bottom} x2={right} y2={bottom} /><line className="rf-axis" x1={left} y1={top} x2={left} y2={bottom} />
    <path className="rf-taxi-line" d={`M${px(0)} ${py(fare(0))} L${px(10)} ${py(fare(10))}`} />
    <line className="rf-rise" x1={px(4)} y1={py(fare(4))} x2={px(4)} y2={py(fare(6))} />
    <line className="rf-run" x1={px(4)} y1={py(fare(4))} x2={px(6)} y2={py(fare(4))} />
    <circle className="rf-intercept-dot" cx={px(0)} cy={py(3)} r="5" />
    <text className="rf-label" x={px(0) + 7} y={py(3) - 8}>Intercept €3</text>
    <text className="rf-label" x={px(6) + 5} y={py(fare(4)) + 4}>run +2 km</text>
    <text className="rf-label" x={px(4) + 6} y={(py(fare(4)) + py(fare(6))) / 2}>rise +€{(rate * 2).toFixed(1)}</text>
    <line className="rf-selection" x1={px(selectedRide)} y1={bottom} x2={px(selectedRide)} y2={py(fare(selectedRide))} />
    <circle className="rf-selected-point" cx={px(selectedRide)} cy={py(fare(selectedRide))} r="7" />
    <text className="rf-label" x={px(selectedRide) + 7} y={py(fare(selectedRide)) - 9}>{selectedRide} km · €{fare(selectedRide).toFixed(2)}</text>
    <text x="165" y="225" textAnchor="middle">Distance · km</text><text x="12" y="105" transform="rotate(-90 12 105)" textAnchor="middle">Fare</text>
  </svg>
}

const patternPoints = {
  positive: [{ x: 0, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 2.7 }, { x: 3, y: 4 }, { x: 4, y: 4.7 }],
  negative: [{ x: 0, y: 4.7 }, { x: 1, y: 4 }, { x: 2, y: 3.3 }, { x: 3, y: 2 }, { x: 4, y: 1.2 }],
  log: [{ x: 0, y: 1 }, { x: 1, y: 3.6 }, { x: 2, y: 4.5 }, { x: 3, y: 4.9 }, { x: 4, y: 5 }],
  none: [{ x: 0, y: 3.9 }, { x: 1, y: 1.3 }, { x: 2, y: 4.6 }, { x: 3, y: 2.4 }, { x: 4, y: 3.4 }],
}

function MiniPattern({ title, type }: { title: string; type: keyof typeof patternPoints }) {
  const points = patternPoints[type]
  const px = (x: number) => 12 + x * 32
  const py = (y: number) => 67 - y * 10
  const trend = type === 'positive' ? `M${px(0)} ${py(1)} L${px(4)} ${py(5)}` : type === 'negative' ? `M${px(0)} ${py(5)} L${px(4)} ${py(1)}` : type === 'log' ? `M${px(0)} ${py(1)} C${px(1)} ${py(4.5)} ${px(2)} ${py(5)} ${px(4)} ${py(5)}` : ''
  return <div className="rf-mini"><strong>{title}</strong><svg viewBox="0 0 160 82" role="img" aria-label={`${title} scatterplot`}><line className="rf-axis" x1="10" y1="68" x2="150" y2="68" /><line className="rf-axis" x1="10" y1="8" x2="10" y2="68" />{trend && <path className={`rf-mini-trend rf-mini-${type}`} d={trend} />}{points.map((point, index) => <circle key={index} className="rf-mini-dot" cx={px(point.x)} cy={py(point.y)} r="3.3" />)}</svg></div>
}

export function RMLinearRelationships() {
  const [rate, setRate] = useState(1.5)
  const [ride, setRide] = useState(6)
  const fare = 3 + rate * ride
  return <Lesson number="13.2" title="Linear relationships" lead="A linear relationship changes at a steady rate: equal steps in the input produce equal steps in the outcome.">
    <Definition>For a straight line, <strong>y = α + βx</strong>. The <strong>intercept α</strong> is the outcome when x is zero; the <strong>slope β</strong> is how much y changes for each one-unit increase in x.</Definition>
    <section className="rm-panel">
      <h2>A taxi fare has a starting charge and a rate</h2>
      <p>Use a plausible fare model: €3 to start, then a positive charge per kilometre. The line begins at €3 and rises at the same rate for every kilometre.</p>
      <div className="rf-controls"><label className="rm-control">Rate β: €{rate.toFixed(2)} per km<input aria-label="Taxi price per kilometre" type="range" min="0.5" max="3" step="0.25" value={rate} onChange={event => setRate(Number(event.target.value))} /></label><label className="rm-control">Selected ride: {ride} km<input aria-label="Selected ride distance" type="range" min="1" max="10" step="1" value={ride} onChange={event => setRide(Number(event.target.value))} /></label></div>
      <div className="rf-taxi-layout"><TaxiGraph rate={rate} selectedRide={ride} /><div className="rf-equation-card"><span>Fare equation</span><strong>Fare = €3 + €{rate.toFixed(2)} × distance</strong><p><b>Intercept:</b> €3 at 0 km</p><p><b>Selected ride:</b> €3 + €{rate.toFixed(2)} × {ride} = <strong>€{fare.toFixed(2)}</strong></p><p className="rm-note">Every additional 2 km adds €{(rate * 2).toFixed(2)} at this fixed rate. The slider cannot make the fare rate negative.</p></div></div>
    </section>
    <section className="rm-panel"><h2>Four common patterns in the points</h2><p>Each mini-plot uses observed points. A log-shaped pattern curves while its rate changes; it is not the same shape as a straight line.</p><div className="rf-minis"><MiniPattern title="Positive linear" type="positive" /><MiniPattern title="Negative linear" type="negative" /><MiniPattern title="Log-shaped curve" type="log" /><MiniPattern title="No clear relationship" type="none" /></div></section>
    <Summary><strong>Remember:</strong> slope tells the direction and steady rate of a line; the intercept tells where it meets the y-axis. Real data can show positive, negative, curved, or no clear relationship.</Summary>
  </Lesson>
}

type Candidate = 'first' | 'second'
const candidates: Record<Candidate, { label: string; alpha: number; beta: number }> = {
  first: { label: 'y = 10 + 0.5x', alpha: 10, beta: 0.5 },
  second: { label: 'y = 12 + 0.4x', alpha: 12, beta: 0.4 },
}

function calculateSse(candidate: Candidate) {
  const { alpha, beta } = candidates[candidate]
  return observations.reduce((total, point) => total + (point.y - (alpha + beta * point.x)) ** 2, 0)
}

function ResidualGraph({ candidate, selectedX, rows }: { candidate: Candidate; selectedX: number; rows: { x: number; y: number; prediction: number; residual: number }[] }) {
  const model = candidates[candidate]
  const px = (x: number) => 42 + x / 80 * 250
  const py = (y: number) => 205 - y / 55 * 180
  return <svg className="rf-chart rf-residual-chart" viewBox="0 0 310 238" role="img" aria-label={`${model.label} with observed points and vertical residuals; selected observation x equals ${selectedX}`}>
    {[0, 10, 20, 30, 40, 50].map(y => <g key={`y-${y}`}><line className="rf-grid" x1="42" y1={py(y)} x2="292" y2={py(y)} /><text x="34" y={py(y) + 4} textAnchor="end">{y}</text></g>)}
    {[0, 20, 40, 60, 80].map(x => <g key={`x-${x}`}><line className="rf-grid rf-grid-vertical" x1={px(x)} y1="25" x2={px(x)} y2="205" /><text x={px(x)} y="222" textAnchor="middle">{x}</text></g>)}
    <line className="rf-axis" x1="42" y1="205" x2="292" y2="205" /><line className="rf-axis" x1="42" y1="25" x2="42" y2="205" />
    <path className="rf-taxi-line" d={`M${px(0)} ${py(model.alpha)} L${px(80)} ${py(model.alpha + model.beta * 80)}`} />
    {rows.map(row => <g key={row.x}><line className={`rf-residual${row.x === selectedX ? ' rf-residual-selected' : ''}`} x1={px(row.x)} y1={py(row.y)} x2={px(row.x)} y2={py(row.prediction)} /><circle className={`rf-observed${row.x === selectedX ? ' rf-observed-selected' : ''}`} cx={px(row.x)} cy={py(row.y)} r={row.x === selectedX ? 6 : 4} /><circle className={`rf-predicted${row.x === selectedX ? ' rf-predicted-selected' : ''}`} cx={px(row.x)} cy={py(row.prediction)} r={row.x === selectedX ? 5 : 3} /></g>)}
    <text x="166" y="237" textAnchor="middle">Input x</text><text x="12" y="112" transform="rotate(-90 12 112)" textAnchor="middle">Outcome y</text><text className="rf-legend" x="53" y="17">● actual  ○ predicted  │ residual</text>
  </svg>
}

export function RMLeastSquares() {
  const [candidate, setCandidate] = useState<Candidate>('first')
  const [selectedX, setSelectedX] = useState(35)
  const model = candidates[candidate]
  const rows = useMemo(() => observations.map(point => {
    const prediction = model.alpha + model.beta * point.x
    const residual = point.y - prediction
    return { ...point, prediction, residual, squared: residual ** 2 }
  }), [model])
  const selected = rows.find(row => row.x === selectedX)!
  const first35 = observations.find(row => row.x === 35)!.y - (10 + 0.5 * 35)
  const second35 = observations.find(row => row.x === 35)!.y - (12 + 0.4 * 35)
  return <Lesson number="13.3" title="Least squared error" lead="Least squares compares candidate lines by adding the squared vertical gaps between actual outcomes and predictions.">
    <Definition>A <strong>residual</strong> is actual y minus predicted y. Square each residual, then add them: <strong>SSE = Σ(actual − predicted)²</strong>. The lower total is the better fit among the candidates being compared.</Definition>
    <section className="rm-panel">
      <h2>Compare the two source candidate lines</h2>
      <p>These are the exact ten source observations. Select a candidate line, then select any input value to link its point, residual, and table row.</p>
      <div className="rm-choice" role="group" aria-label="Choose candidate regression line">{(['first', 'second'] as Candidate[]).map(key => <button key={key} aria-pressed={candidate === key} onClick={() => setCandidate(key)}>{candidates[key].label}</button>)}</div>
      <div className="rf-sse-comparison"><div aria-current={candidate === 'first' ? 'true' : undefined}><span>Candidate 1</span><strong>y = 10 + 0.5x</strong><b>SSE = {calculateSse('first').toFixed(1)}</b></div><div aria-current={candidate === 'second' ? 'true' : undefined}><span>Candidate 2</span><strong>y = 12 + 0.4x</strong><b>SSE = {calculateSse('second').toFixed(0)}</b></div><p>Candidate 2 has the smaller overall SSE, even though its residual at x = 35 is worse: {first35.toFixed(1)} for Candidate 1 versus {second35.toFixed(1)} for Candidate 2. The improvements at x = 50, 65, and 80 more than offset that local increase.</p></div>
      <div className="rf-trace-layout"><div><ResidualGraph candidate={candidate} selectedX={selectedX} rows={rows} /><label className="rm-control">Selected record x = {selectedX}<input aria-label="Select source observation by x" type="range" min="10" max="80" step="5" value={selectedX} onChange={event => setSelectedX(Number(event.target.value))} /></label></div><div className="rf-selected-card"><span>Selected source record · x = {selected.x}</span><strong>Actual y = {selected.y}</strong><b>Prediction = {model.alpha} + {model.beta} × {selected.x} = {selected.prediction.toFixed(1)}</b><p>Residual = actual − prediction</p><p>{selected.y} − {selected.prediction.toFixed(1)} = <strong>{selected.residual.toFixed(1)}</strong></p><p>Residual² = ({selected.residual.toFixed(1)})² = <strong>{selected.squared.toFixed(2)}</strong></p></div></div>
      <div className="rm-table-wrap rf-record-table"><table><caption>Source records and their contribution to the selected line’s SSE · active record highlighted</caption><thead><tr><th>x</th><th>Actual y</th><th>Predicted y</th><th>Actual − predicted</th><th>Residual²</th></tr></thead><tbody>{rows.map(row => <tr key={row.x} className={row.x === selectedX ? 'rf-active-record' : ''} onClick={() => setSelectedX(row.x)} aria-selected={row.x === selectedX}><td>{row.x}</td><td>{row.y}</td><td>{row.prediction.toFixed(1)}</td><td>{row.residual.toFixed(1)}</td><td>{row.squared.toFixed(2)}</td></tr>)}</tbody><tfoot><tr><th colSpan={4}>Displayed SSE total</th><th>{rows.reduce((total, row) => total + row.squared, 0).toFixed(candidate === 'first' ? 1 : 0)}</th></tr></tfoot></table></div>
      <p className="rm-note">The plotted residual connectors show vertical errors. A selected connector and table row stay linked. Squaring makes errors non-negative and gives larger gaps more influence.</p>
    </section>
    <Summary><strong>Remember:</strong> least squares minimizes the sum, not every individual residual. A candidate can have a worse error for one record and still have the lower overall SSE.</Summary>
  </Lesson>
}
