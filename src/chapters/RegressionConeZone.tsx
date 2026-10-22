import { useState } from 'react'
import type { ReactNode } from 'react'
import { coneCandidateSse, coneForecast, regressionSource } from '../data/regressionWorkbookMath'
import univariateEquationImage from '../assets/regression-modeling-215.png'
import './RegressionModeling.css'
import './RegressionNonlinear.css'
import './RegressionConeZone.css'

function Lesson({ number, title, lead, children }: { number: string; title: string; lead: string; children: ReactNode }) {
  return <article className="regression-modeling" aria-labelledby={`cone-${number}`}><header><p className="rm-eyebrow">Chapter 13 · Lesson {number}</p><h1 id={`cone-${number}`}>{title}</h1><p>{lead}</p></header>{children}</article>
}

function SourceFigure({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  return <figure className="rm-source-visual"><img src={src} alt={alt} /><figcaption>{caption}</figcaption></figure>
}

function fmt(value: number, places = 2) { return Number(value).toFixed(places) }

function ConeChart({ alpha, beta, forecastTemperature, forecastPrediction, showCandidate, showTrend, showForecast, showErrors, useManual }: { alpha: number; beta: number; forecastTemperature: number; forecastPrediction: number; showCandidate: boolean; showTrend: boolean; showForecast: boolean; showErrors: boolean; useManual: boolean }) {
  const rows = regressionSource.coneZone.rows
  const x = (value: number) => 46 + (value / 55) * 390
  const y = (value: number) => 284 - (value / 60) * 250
  const trend = regressionSource.coneZone.fittedLine
  const line = (a: number, b: number) => `M ${x(0)} ${y(a)} L ${x(55)} ${y(a + b * 55)}`
  const forecastPath = rows.map((row, i) => `${i ? 'L' : 'M'} ${x(row.temperature)} ${y(useManual ? alpha + beta * row.temperature : row.fittedPrediction)}`).join(' ')
  return <svg className="rm-source-chart" viewBox="0 0 475 360" role="img" aria-label="Cone Zone scatterplot with source workbook candidate, fitted trendline, and forecast values">
    {[0, 10, 20, 30, 40, 50, 60].map(tick => <g key={`y${tick}`}><line className="rm-chart-grid" x1="46" x2="436" y1={y(tick)} y2={y(tick)} /><text x="38" y={y(tick) + 4} textAnchor="end">{tick}</text></g>)}
    {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map(tick => <g key={`x${tick}`}><line className="rm-chart-grid" x1={x(tick)} x2={x(tick)} y1="34" y2="284" /><text x={x(tick)} y="302" textAnchor="middle">{tick}</text></g>)}
    <line className="rm-chart-axis" x1="46" x2="436" y1="284" y2="284"/><line className="rm-chart-axis" x1="46" x2="46" y1="34" y2="284"/>
    {showErrors && rows.map(row => <line key={row.date} className="cone-error-line" x1={x(row.temperature)} x2={x(row.temperature)} y1={y(row.sales)} y2={y(alpha + beta * row.temperature)} />)}
    {showCandidate && <path className="rm-candidate-line" d={line(alpha, beta)} />}
    {showTrend && <path className="rm-trend-line" d={line(trend.intercept, trend.slope)} />}
    {showForecast && <path className="rm-forecast-line" d={forecastPath} />}
    {rows.map(row => <circle key={row.date} className="rm-cone-dot" cx={x(row.temperature)} cy={y(row.sales)} r="5" />)}
    {showForecast && <g aria-label={`Forecast: ${fmt(forecastPrediction, 2)} cones at ${forecastTemperature} degrees`}><line className="rm-forecast-guide" x1={x(forecastTemperature)} x2={x(forecastTemperature)} y1={y(forecastPrediction)} y2="284"/><line className="rm-forecast-guide" x1="46" x2={x(forecastTemperature)} y1={y(forecastPrediction)} y2={y(forecastPrediction)}/><circle className="rm-forecast-point" cx={x(forecastTemperature)} cy={y(forecastPrediction)} r="6"/><text className="rm-forecast-label" x={x(forecastTemperature) + 8} y={y(forecastPrediction) - 10}>{fmt(forecastPrediction, 2)}</text></g>}
    <text x="240" y="355" textAnchor="middle">Average daily temperature (°C)</text><text x="13" y="160" textAnchor="middle" transform="rotate(-90 13 160)">Cones sold</text>
    <g className="rm-chart-legend"><circle cx="65" cy="17" r="4"/><text x="74" y="21">Observed sales</text>{showCandidate && <><line className="rm-candidate-line" x1="174" x2="195" y1="17" y2="17"/><text x="201" y="21">Manual candidate</text></>}{showTrend && <><line className="rm-trend-line" x1="320" x2="341" y1="17" y2="17"/><text x="347" y="21">Fitted trend</text></>}{showForecast && <><line className="rm-forecast-line" x1="65" x2="86" y1="337" y2="337"/><text x="92" y="341">Predictions · selected line</text></>}</g>
  </svg>
}

export function RMUnivariate() {
  return <Lesson number="13.4" title="Univariate linear regression" lead="One input predicts one numerical outcome.">
    <section className="rm-panel rm-concept-panel">
      <SourceFigure src={univariateEquationImage} alt="Equation y equals alpha plus beta x plus epsilon, with labels for dependent variable, intercept, coefficient, independent variable, and residual" caption="Temperature is the input x; cone sales is the observed outcome y. The fitted line predicts ŷ = α + βx, while ε represents the part of an observed outcome left outside that line." />
      <p className="rm-equation rm-equation-inline"><strong>ŷ = 10.867 + 0.6958x</strong><span>Use the fitted equation to turn a temperature into estimated cone sales.</span></p>
    </section>
  </Lesson>
}

export function RMUnivariateCase() {
  const source = regressionSource.coneZone
  const [manualAlpha, setAlpha] = useState(source.candidate.intercept)
  const [manualBeta, setBeta] = useState(Number(source.candidate.slope.toFixed(6)))
  const [temperature, setTemperature] = useState(source.forecast.temperature)
  const [showCandidate, setShowCandidate] = useState(true)
  const [useFitted, setUseFitted] = useState(false)
  const useManual = !useFitted
  const alpha = useFitted ? source.fittedLine.intercept : manualAlpha
  const beta = useFitted ? source.fittedLine.slope : manualBeta
  const [showErrors, setShowErrors] = useState(true)
  const [showTrend, setShowTrend] = useState(true)
  const [showForecast, setShowForecast] = useState(true)
  const candidateSse = coneCandidateSse(alpha, beta)
  const prediction = useManual ? alpha + beta * temperature : coneForecast(temperature)
  const fittedSse = source.rows.reduce((sum, row) => sum + (row.sales - row.fittedPrediction) ** 2, 0)
  const residuals = source.rows.map(row => {
    const predicted = alpha + beta * row.temperature
    const residual = row.sales - predicted
    return { ...row, predicted, residual, squared: residual ** 2 }
  })

  return <Lesson number="13.5" title="Case study: Cone Zone" lead="A mobile ice-cream cart on Atlantic City’s boardwalk uses daily temperature to estimate cone sales.">
    <section className="cone-sheet" aria-label="Cone Zone sales worksheet">
      <div className="cone-data">
        <h2>Cone Zone sales</h2>
        <div className="rm-table-wrap"><table><thead><tr><th>Date</th><th>Avg temp<br />(°C)</th><th>Sales</th><th>Prediction ŷ</th></tr></thead><tbody>{source.rows.map(row => <tr key={row.date}><td>{row.date}</td><td>{row.temperature}</td><td>{row.sales}</td><td className={`cone-prediction ${useManual ? 'cone-manual-value' : ''}`}>{fmt(useManual ? alpha + beta * row.temperature : row.fittedPrediction, 3)}</td></tr>)}</tbody></table></div>
        <p className="cone-table-note">{useManual ? 'Your current trial values. Edit α or β to change these predictions.' : 'Least-squares fitted values: the best straight-line fit to these ten days, not a perfect prediction of sales.'}</p>
      </div>
      <div className="cone-main">
        <div className="cone-top">
          <div className="cone-parameters">
            <button type="button" className="cone-apply-fit" aria-pressed={useFitted} onClick={() => { setUseFitted(value => !value); setShowCandidate(true) }}>Use fitted α and β</button>
            <label>Y-intercept α<input aria-label="Candidate intercept" disabled={useFitted} type="number" step="0.1" value={alpha} onChange={event => setAlpha(Number(event.target.value))} /></label>
            <label>Line slope β<input aria-label="Candidate slope" disabled={useFitted} type="number" step="0.01" value={beta} onChange={event => setBeta(Number(event.target.value))} /></label>
            <div className="cone-total"><span>{useFitted ? 'Fitted' : 'Manual'} SSE</span><strong>{fmt(candidateSse, 2)}</strong></div>
          </div>
          <div className="cone-forecast">
            <label className="cone-forecast-input">Avg daily temp (°C)<span className="cone-input-tip" role="tooltip" id="cone-temperature-tip">Enter the temperature for which you want to forecast sales.</span><input aria-describedby="cone-temperature-tip" aria-label="Forecast temperature" type="number" step="1" value={temperature} onChange={event => setTemperature(Number(event.target.value))} /></label>
            <div><span>{useManual ? 'Manual' : 'Fitted'} forecast</span><strong>{fmt(prediction, 2)}</strong></div>
          </div>
          <fieldset className="cone-toggles"><legend>Show on chart</legend>
            <label><input type="checkbox" checked={showCandidate} onChange={event => setShowCandidate(event.target.checked)} /> Fit line · manual</label>
            <label><input type="checkbox" checked={showErrors} onChange={event => setShowErrors(event.target.checked)} /> Error lines</label>
            <label><input type="checkbox" checked={showTrend} onChange={event => setShowTrend(event.target.checked)} /> Trend line · fitted</label>
            <label><input type="checkbox" checked={showForecast} onChange={event => setShowForecast(event.target.checked)} /> Forecast</label>
          </fieldset>
        </div>
        <div className="cone-plot">
          <ConeChart alpha={alpha} beta={beta} forecastTemperature={temperature} forecastPrediction={prediction} showCandidate={showCandidate} showTrend={showTrend} showForecast={showForecast} showErrors={showErrors} useManual={useManual} />
          <div className="cone-chart-equations">
            <div className="cone-manual-equation"><b>Fit line · {useFitted ? 'fitted values applied' : 'your experiment'}</b><strong>ŷ = α + βx = {fmt(alpha, 2)} + {fmt(beta, 2)}x</strong><span>{useFitted ? 'Turn off “Use fitted α and β” to return to your manual values.' : 'Change α and β yourself, or apply the fitted values with the toggle above.'}</span></div>
            <div className="cone-fitted-equation"><b>Trend line · least-squares fit</b><span>Calculated best-fitting straight line, with the smallest sum of squared errors for these data.</span><strong>ŷ = <u title="Fitted intercept α">10.867</u> + <u title="Fitted slope β">0.6958</u>x</strong><span>α = 10.867 · β = 0.6958 · fitted SSE = <b>{fmt(fittedSse, 2)}</b></span></div>
          </div>
          <p className="cone-chart-help"><b>ŷ (“y-hat”)</b> means predicted sales; x is temperature. <b>SSE = Σ(y − ŷ)²</b> adds the squared errors; lower is better on these same ten days. Error lines show the manual line’s residuals. Forecast uses the current α and β.</p>
        </div>
      </div>
      <details className="cone-calculations"><summary>Chart calculations · candidate errors and squared errors</summary>
        <p>Residual = actual sales − candidate prediction. The table predictions and forecast use the current line parameters.</p>
        <div className="rm-table-wrap"><table><thead><tr><th>Temperature x (°C)</th><th>Actual y</th><th>Candidate ŷ</th><th>Residual y − ŷ</th><th>Residual²</th></tr></thead><tbody>{residuals.map(row => <tr key={row.date}><td>{row.temperature}</td><td>{row.sales}</td><td>{fmt(row.predicted, 2)}</td><td>{fmt(row.residual, 2)}</td><td>{fmt(row.squared, 2)}</td></tr>)}</tbody><tfoot><tr><th colSpan={4}>Sum of squared error</th><td>{fmt(candidateSse, 2)}</td></tr></tfoot></table></div>
      </details>
    </section>
  </Lesson>
}
