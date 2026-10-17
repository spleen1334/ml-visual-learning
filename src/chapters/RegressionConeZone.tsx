import { useState } from 'react'
import type { ReactNode } from 'react'
import './RegressionModeling.css'

type Point = { x: number; y: number }

const conePoints: Point[] = [
  { x: 5, y: 8 }, { x: 10, y: 16 }, { x: 15, y: 19 }, { x: 20, y: 30 }, { x: 25, y: 35 },
  { x: 30, y: 30 }, { x: 35, y: 43 }, { x: 40, y: 41 }, { x: 45, y: 44 }, { x: 50, y: 34 },
]

const fittedAlpha = 10.8666666667
const fittedBeta = 0.6957575758

function Lesson({ number, title, lead, children }: { number: string; title: string; lead: string; children: ReactNode }) {
  return <article className="regression-modeling" aria-labelledby={`rm-${number}-title`}><header><p className="rm-eyebrow">Chapter 13 · Lesson {number}</p><h1 id={`rm-${number}-title`}>{title}</h1><p>{lead}</p></header>{children}</article>
}

function Definition({ children }: { children: ReactNode }) {
  return <section className="rm-definition"><p className="rm-eyebrow">The central idea</p><h2>{children}</h2></section>
}

function Summary({ children }: { children: ReactNode }) {
  return <aside className="rm-summary"><span>✓</span><p>{children}</p></aside>
}

function ConePlot({ alpha, beta, showResiduals = false }: { alpha: number; beta: number; showResiduals?: boolean }) {
  const px = (x: number) => 42 + x * 4.4
  const py = (y: number) => 204 - y * 3.25
  const lineStart = Math.max(0, Math.min(55, -alpha / (beta || 1)))
  const lineEnd = Math.max(0, Math.min(55, (55 - alpha) / (beta || 1)))
  return <svg className="rm-scatter" viewBox="0 0 300 235" role="img" aria-label="Cone sales observations, selected line, and residuals">
    <line x1="42" y1="25" x2="42" y2="204"/><line x1="42" y1="204" x2="286" y2="204"/>
    {[10, 20, 30, 40, 50].map(x => <text key={`x${x}`} x={px(x)} y="221" textAnchor="middle">{x}</text>)}
    {[10, 20, 30, 40, 50].map(y => <text key={`y${y}`} x="34" y={py(y) + 4} textAnchor="end">{y}</text>)}
    <text x="164" y="234" textAnchor="middle">Temperature (°C)</text><text x="12" y="114" transform="rotate(-90 12 114)" textAnchor="middle">Cones sold</text>
    {showResiduals && conePoints.map(point => <line key={`residual-${point.x}`} x1={px(point.x)} x2={px(point.x)} y1={py(point.y)} y2={py(alpha + beta * point.x)} style={{ stroke: '#c26e38', strokeDasharray: '4 3', strokeWidth: 1.5 }} />)}
    <path className="rm-line" d={`M${px(lineStart)} ${py(alpha + beta * lineStart)} L${px(lineEnd)} ${py(alpha + beta * lineEnd)}`}/>
    {conePoints.map(point => <circle key={`${point.x}-${point.y}`} cx={px(point.x)} cy={py(point.y)} r="4.5"/>)}
  </svg>
}

export function RMUnivariate() {
  return <Lesson number="13.4" title="Univariate linear regression" lead="Simple, or univariate, linear regression learns a straight-line relationship from one input and one numerical outcome, then uses it to estimate an outcome for a new input.">
    <Definition>Observed data include real-world variation: <strong>y = α + βx + ε</strong>. The fitted model leaves that variation aside when predicting: <strong>ŷ = α + βx</strong>.</Definition>
    <section className="rm-panel">
      <h2>From observed records to an estimate</h2>
      <p>Here, each observed record is a temperature and the number of cones sold that day. The model learns an intercept α and slope β from those paired observations.</p>
      <div className="rm-flow" aria-label="Regression learning and prediction sequence">
        <b>Observed (X, y) pairs</b><i>→</i><b>fit α and β</b><i>→</i><b>learned equation</b><i>→</i><b>new X</b><i>→</i><b>prediction ŷ</b>
      </div>
      <div className="rm-two">
        <div className="rm-equation"><span>Observed relationship</span><strong>y = α + βx + ε</strong><span>ε represents the part of an observed outcome the straight-line model does not explain.</span></div>
        <div className="rm-equation"><span>Prediction rule</span><strong>ŷ = α + βx</strong><span><strong>ŷ (“y-hat”)</strong> is the model’s predicted or estimated y for a given x. It is not the observed outcome.</span></div>
      </div>
      <p className="rm-note">For Cone Zone, x is average daily temperature and y is cones sold. A fitted relationship describes these data; it does not by itself show that temperature caused sales to change.</p>
    </section>
    <Summary><strong>Remember:</strong> observations help fit α and β; the learned equation then turns a new x into an estimated outcome, ŷ.</Summary>
  </Lesson>
}

export function RMUnivariateCase() {
  const [alpha, setAlpha] = useState(10)
  const [beta, setBeta] = useState(0.5)
  const [temperature, setTemperature] = useState(35)
  const rows = conePoints.map(point => {
    const prediction = alpha + beta * point.x
    const residual = point.y - prediction
    return { ...point, prediction, residual, squared: residual ** 2 }
  })
  const sse = rows.reduce((total, row) => total + row.squared, 0)
  const forecast = alpha + beta * temperature

  return <Lesson number="13.5" title="Case study: Cone Zone" lead="Use ten observed days to explore how a one-input regression line fits temperature and cone-sales data, then calculate a prediction for a separate temperature.">
    <Definition>Temperature is the input <strong>X</strong> in degrees Celsius; cones sold is the numerical outcome <strong>y</strong>. We can adjust a candidate line and see its errors against the observed days.</Definition>
    <section className="rm-panel">
      <h2>Observed records</h2>
      <p>These are the ten source observations used in this exercise.</p>
      <div className="rm-table-wrap"><table><caption>Cone Zone sample · 10 observed days</caption><thead><tr><th>Temperature (°C)</th><th>Cones sold</th></tr></thead><tbody>{conePoints.map(point => <tr key={point.x}><td>{point.x}</td><td>{point.y}</td></tr>)}</tbody></table></div>
      <h2>Explore a manual candidate</h2>
      <p>Change the intercept α and slope β of the <strong>manual candidate line</strong>. The chart shows each vertical residual from an observed point to the line; the table and SSE update with it.</p>
      <div className="rm-two">
        <div>
          <label className="rm-control">Manual candidate · intercept α<input aria-label="Manual candidate intercept alpha" type="number" step="0.1" value={alpha} onChange={event => setAlpha(Number(event.target.value))}/></label>
          <label className="rm-control">Manual candidate · slope β (cones per °C)<input aria-label="Manual candidate slope beta" type="number" step="0.01" value={beta} onChange={event => setBeta(Number(event.target.value))}/></label>
          <div className="rm-equation"><span>Manual candidate equation</span><strong>ŷ = {alpha.toFixed(2)} + {beta.toFixed(4)}x</strong></div>
          <div className="rm-sse"><span>Manual candidate sum of squared errors (SSE)</span><strong>{sse.toFixed(2)} cones²</strong><span>SSE adds all ten squared residuals. A smaller value means this line is closer to these observations under this measure.</span></div>
          <button className="rm-choice" style={{ marginTop: 16, padding: '9px 13px', border: '1px solid #9abdb6', borderRadius: 9, color: '#173b3d', background: '#fff', font: 'inherit', fontWeight: 750, cursor: 'pointer' }} onClick={() => { setAlpha(fittedAlpha); setBeta(fittedBeta) }}>Use fitted line</button>
        </div>
        <div><ConePlot alpha={alpha} beta={beta} showResiduals/><p className="rm-note"><span style={{ color: '#c26e38', fontWeight: 800 }}>Dashed segments</span> show actual y minus predicted ŷ. Positive residuals sit above the line; negative residuals sit below.</p></div>
      </div>
      <div className="rm-table-wrap"><table><caption>Live residuals for the manual candidate</caption><thead><tr><th>Temperature x (°C)</th><th>Actual y</th><th>Predicted ŷ</th><th>Residual y − ŷ</th><th>Residual²</th></tr></thead><tbody>{rows.map(row => <tr key={row.x}><td>{row.x}</td><td>{row.y}</td><td>{row.prediction.toFixed(2)}</td><td>{row.residual.toFixed(2)}</td><td>{row.squared.toFixed(2)}</td></tr>)}</tbody></table></div>
    </section>
    <section className="rm-panel">
      <h2>Make a separate temperature prediction</h2>
      <p>This input is for a new day’s temperature; it does not change the observed records or the SSE.</p>
      <label className="rm-control">New-day temperature (°C)<input type="number" step="1" value={temperature} onChange={event => setTemperature(Number(event.target.value))}/></label>
      <div className="rm-equation"><span>Prediction using the selected line</span><strong>ŷ = {alpha.toFixed(4)} + {beta.toFixed(4)} × {temperature || 0} = {(Number.isFinite(forecast) ? forecast : 0).toFixed(2)} cones</strong></div>
      <p className="rm-note"><strong>Scope:</strong> the ten records make the fitting and prediction mechanics visible. They do not establish that this is a valid or dependable sales forecast.</p>
    </section>
    <Summary><strong>Remember:</strong> a fitted line summarizes the observed sample, and a new temperature produces a model estimate—not a promise of actual sales.</Summary>
  </Lesson>
}
