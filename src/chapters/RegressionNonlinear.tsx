import type { ReactNode } from 'react'
import { useId, useState } from 'react'
import { createPortal } from 'react-dom'
import { marketingRows, predictLogSpend, predictRawSpend, regressionSource } from '../data/regressionWorkbookMath'
import nonlinearMarketingImage from '../assets/regression-modeling-223.png'
import nonlinearPopulationImage from '../assets/regression-modeling-224.png'
import './RegressionModeling.css'
import './RegressionNonlinear.css'

function Lesson({ number, title, lead, children }: { number: string; title: string; lead: string; children: ReactNode }) {
  return <article className="regression-modeling" aria-labelledby={`rn-${number}-title`}><header><p className="rm-eyebrow">Chapter 13 · Lesson {number}</p><h1 id={`rn-${number}-title`}>{title}</h1><p>{lead}</p></header>{children}</article>
}

function SourceFigure({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  return <figure className="rm-source-visual"><img src={src} alt={alt} /><figcaption>{caption}</figcaption></figure>
}

function number(value: number): string {
  return new Intl.NumberFormat('en-US', { maximumSignificantDigits: 6, useGrouping: false }).format(value)
}

function Chart({ showRaw, showLog }: { showRaw: boolean; showLog: boolean }) {
  const width = 760, height = 390, left = 62, right = 730, top = 25, bottom = 330
  const x = (value: number) => left + (value / 250) * (right - left)
  const y = (value: number) => bottom - ((value - 250) / 400) * (bottom - top)
  const rawPath = Array.from({ length: 101 }, (_, i) => {
    const spend = i * 2.5
    return `${i ? 'L' : 'M'} ${x(spend).toFixed(1)} ${y(predictRawSpend(spend)).toFixed(1)}`
  }).join(' ')
  const minSpend = Math.min(...marketingRows.map(row => row.spend))
  const logPath = Array.from({ length: 101 }, (_, i) => {
    const spend = minSpend + i * ((250 - minSpend) / 100)
    return `${i ? 'L' : 'M'} ${x(spend).toFixed(1)} ${y(predictLogSpend(spend)).toFixed(1)}`
  }).join(' ')
  return <svg className="rm-source-chart rm-marketing-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="All one thousand workbook days, with the selected linear and non-linear predictions">
    {[250, 300, 350, 400, 450, 500, 550, 600, 650].map(tick => <g key={`y${tick}`}><line className="rm-chart-grid" x1={left} x2={right} y1={y(tick)} y2={y(tick)} /><text x={left - 9} y={y(tick) + 4} textAnchor="end">${tick}</text></g>)}
    {[0, 50, 100, 150, 200, 250].map(tick => <g key={`x${tick}`}><line className="rm-chart-grid" x1={x(tick)} x2={x(tick)} y1={top} y2={bottom} /><text x={x(tick)} y={bottom + 19} textAnchor="middle">${tick}</text></g>)}
    <line className="rm-chart-axis" x1={left} x2={right} y1={bottom} y2={bottom}/><line className="rm-chart-axis" x1={left} x2={left} y1={top} y2={bottom}/>
    {marketingRows.map(row => <circle key={row.date} className="rm-marketing-dot" cx={x(row.spend)} cy={y(row.revenue)} r="2.2" />)}
    {showRaw && <path className="rm-candidate-line" d={rawPath} />}{showLog && <path className="rm-trend-line" d={logPath} />}
    <text x={(left + right) / 2} y="380" textAnchor="middle">Daily ad spend</text><text x="15" y="180" textAnchor="middle" transform="rotate(-90 15 180)">Daily revenue</text>
  </svg>
}

const outputHelp: Record<string, string> = {
  'Regression Statistics': 'Measures of how closely the model fits the historical revenue data.',
  ANOVA: 'Analysis of variance: splits total revenue variation into variation explained by the model and unexplained error.',
  Measure: 'The statistic being reported.', Value: 'The calculated value of this statistic.',
  'Multiple R': 'Correlation between observed and fitted revenue. Closer to 1 means a stronger fit here.',
  'R Square': 'R²: the fraction of historical revenue variation explained by the model. 0.84 means about 84%.',
  'Adjusted R Square': 'R² adjusted for the number of predictors and observations, to account for added model complexity.',
  'Standard Error': 'Estimated spread of residual errors, in revenue dollars: √(residual SS / residual df). Lower means a closer fit to these historical records; it does not guarantee better future forecasts.',
  Observations: 'Number of daily records used to fit the model.',
  Source: 'The part of revenue variation summarized in this row.',
  df: 'Degrees of freedom: independent information available for estimating variation. Here: 1 predictor, 998 residual degrees of freedom, 999 total.',
  SS: 'Sum of squares: squared revenue differences added together. Residual SS is the sum of squared prediction errors (SSE).',
  MS: 'Mean square: SS divided by its degrees of freedom (df).',
  F: 'F statistic: regression MS divided by residual MS. Tests whether the predictor adds explanatory information compared with an intercept-only model.',
  'Significance F': 'P-value for the overall F test, assuming its statistical conditions hold. A displayed zero is an extremely small rounded value, not exactly zero.',
  Regression: 'Revenue variation explained by the fitted model.',
  Residual: 'Revenue variation left unexplained: observed revenue minus fitted revenue.',
  Total: 'Total variation of observed revenue around its mean; equals regression SS plus residual SS.',
  Term: 'The intercept or predictor whose coefficient is estimated.',
  Coefficients: 'Estimated numbers in the model equation: the intercept and the multiplier for the predictor.',
  't Stat': 't statistic: estimated coefficient divided by its standard error. Used to test whether that coefficient differs from zero.',
  'P-value': 'Evidence against a zero coefficient, assuming the model’s statistical conditions hold. Smaller values indicate stronger evidence; they do not measure effect size. A displayed zero is rounded.',
  'Lower 95%': 'Lower end of the coefficient’s 95% confidence interval, under the model assumptions.',
  'Upper 95%': 'Upper end of the coefficient’s 95% confidence interval, under the model assumptions.',
  'Lower 95.0%': 'Duplicate lower 95% confidence limit included in the Excel output.',
  'Upper 95.0%': 'Duplicate upper 95% confidence limit included in the Excel output.',
  Intercept: 'Predicted revenue when the predictor is zero: ad spend = $0 in the linear model, or ln(ad spend) = 0 (spend = $1) in the non-linear model. This can be outside the observed data range.',
  ad_spend: 'Daily advertising spend in dollars. Its coefficient is the predicted revenue change for $1 more spend.',
  log_ad_spend: 'Natural logarithm of daily advertising spend. Its coefficient multiplies ln(spend); a 1% spend increase corresponds to about coefficient / 100 more revenue dollars.',
}

function OutputLabel({ value, coefficient = false }: { value: string | number; coefficient?: boolean }) {
  const id = useId()
  const [position, setPosition] = useState<{ left: number; top: number } | null>(null)
  const help = coefficient && value === 'Standard Error'
    ? 'Uncertainty in this estimated coefficient, in the coefficient’s units. This is different from the overall model Standard Error in Regression Statistics.'
    : outputHelp[String(value)]
  if (!help) return <>{value}</>
  const show = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect()
    setPosition({ left: Math.max(12, Math.min(rect.left, window.innerWidth - 332)), top: Math.max(12, Math.min(rect.bottom + 8, window.innerHeight - 180)) })
  }
  return <><button type="button" className="rm-output-help" aria-describedby={position ? id : undefined}
    onMouseEnter={event => show(event.currentTarget)} onMouseLeave={() => setPosition(null)}
    onFocus={event => show(event.currentTarget)} onBlur={() => setPosition(null)}
    onClick={event => show(event.currentTarget)} onKeyDown={event => { if (event.key === 'Escape') setPosition(null) }}
  >{value}</button>{position && createPortal(<div id={id} role="tooltip" className="rm-output-tooltip" style={position}>{help}</div>, document.body)}</>
}

function SourceTable({ title, headers, rows }: { title: string; headers: (string | number)[]; rows: (string | number | null)[][] }) {
  return <div className="rm-table-wrap rm-output-table"><table><caption><OutputLabel value={title} /></caption><thead><tr>{headers.map((header, i) => <th key={`${header}-${i}`} scope="col"><OutputLabel value={header} coefficient={title === 'Coefficients'} /></th>)}</tr></thead><tbody>{rows.map((row, rowIndex) => <tr key={rowIndex} className={row[0] === 'Standard Error' ? 'rm-standard-error' : undefined}>{row.map((value, cellIndex) => <td key={cellIndex}>{typeof value === 'number' ? number(value) : <OutputLabel value={value ?? ''} />}</td>)}</tr>)}</tbody></table></div>
}

function ModelOutput({ title, output }: { title: string; output: typeof regressionSource.nonlinear.linear }) {
  return <section className="rm-model-output"><h3>{title}</h3><div className="rm-output-grid">
    <SourceTable title={output.summary.title} headers={output.summary.headers} rows={output.summary.rows} />
    <SourceTable title={output.anova.title} headers={output.anova.headers} rows={output.anova.rows} />
  </div><SourceTable title={output.coefficients.title} headers={output.coefficients.headers} rows={output.coefficients.rows} /></section>
}

export function RMNonLinear() {
  return <Lesson number="13.7" title="Non-linear regression" lead="Transform a variable when it makes a curved relationship more suitable for a linear model.">
    <section className="rm-panel rm-transform-panel">
      <SourceFigure src={nonlinearMarketingImage} alt="Marketing spend and sales curve, then sales plotted against log marketing spend follow a straighter pattern" caption="The marketing example transforms X: daily spend becomes its logarithm, while sales stay on the original scale." />
      <p className="rm-source-scenario"><strong>Diminishing returns:</strong> extra marketing spend is associated with a larger sales rise at low spend than at high spend. A log-spend model writes <strong>y = α + β ln(x) + ε</strong>.</p>
      <SourceFigure src={nonlinearPopulationImage} alt="Population increases exponentially over time, then log population increases approximately linearly over time" caption="The population example transforms Y: time stays on its original scale, while population becomes its logarithm." />
      <p className="rm-source-scenario"><strong>Exponential growth:</strong> use <strong>ln(y) = α + βx + ε</strong> when population is positive. A logarithm is defined only for positive values.</p>
    </section>
  </Lesson>
}

export function RMNonLinearCase() {
  const [showRaw, setShowRaw] = useState(false)
  const [showLog, setShowLog] = useState(true)
  const linear = regressionSource.nonlinear.linear
  const log = regressionSource.nonlinear.log
  return <Lesson number="13.8" title="Case study: Maven Marketing" lead="Create a model to predict a campaign’s daily revenue from its planned daily ad spend.">
    <section className="rm-panel">
      <h2>Daily records and model predictions</h2>
      <p>The 1,000 daily records span {marketingRows[0].date} to {marketingRows.at(-1)?.date}. Revenue is fit first to raw spend, then to ln(spend).</p>
      <fieldset className="rm-series-controls"><legend>Show prediction lines</legend><label><input type="checkbox" checked={showRaw} onChange={event => setShowRaw(event.target.checked)} /> Linear prediction <span>ŷ = 342.476 + 1.010 × spend</span></label><label><input type="checkbox" checked={showLog} onChange={event => setShowLog(event.target.checked)} /> Non-linear prediction <span>ŷ = 2.208 + 99.596 × ln(spend)</span></label></fieldset>
      <div className="rm-chart-wrap"><Chart showRaw={showRaw} showLog={showLog} /></div>
      <p className="rm-note">Compare the two fits on held-out days before using a model for future campaigns. Historical association alone does not establish causal return on spend.</p>
      <div className="rm-table-wrap rm-record-table"><table><colgroup><col span={4} /><col span={2} className="rm-marketing-forecast" /></colgroup><thead><tr><th colSpan={4} scope="colgroup" className="rm-marketing-data-heading">Daily Marketing Spend &amp; Sales</th><th rowSpan={2} scope="col" className="rm-marketing-forecast-heading">Forecast<br />(Linear)</th><th rowSpan={2} scope="col" className="rm-marketing-forecast-heading">Forecast<br />(Non-Linear)</th></tr><tr><th scope="col">Date</th><th scope="col">Ad spend ($)</th><th scope="col">Log ad spend</th><th scope="col">Revenue ($)</th></tr></thead><tbody>{marketingRows.map(row => <tr key={row.date}><td>{row.date}</td><td>{number(row.spend)}</td><td>{number(row.logSpend)}</td><td>{number(row.revenue)}</td><td>{number(row.linearPrediction)}</td><td>{number(row.logPrediction)}</td></tr>)}</tbody></table></div>
    </section>
    <section className="rm-panel rm-outputs-panel">
      <ModelOutput title="Linear regression" output={linear} />
      <ModelOutput title="Non-linear regression" output={log} />
    </section>
  </Lesson>
}
