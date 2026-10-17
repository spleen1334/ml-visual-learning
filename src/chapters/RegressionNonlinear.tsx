import { useState } from 'react'
import type { ReactNode } from 'react'
import './RegressionModeling.css'
import './RegressionNonlinear.css'

function Lesson({ number, title, lead, children }: { number: string; title: string; lead: string; children: ReactNode }) {
  return <article className="regression-modeling" aria-labelledby={`rn-${number}-title`}><header><p className="rm-eyebrow">Chapter 13 · Lesson {number}</p><h1 id={`rn-${number}-title`}>{title}</h1><p>{lead}</p></header>{children}</article>
}
function Definition({ children }: { children: ReactNode }) { return <section className="rm-definition"><p className="rm-eyebrow">The central idea</p><h2>{children}</h2></section> }
function Summary({ children }: { children: ReactNode }) { return <aside className="rm-summary"><span>✓</span><p>{children}</p></aside> }

const sourcePoints = [
  { id: 'Row 22', spend: 20.0925, logSpend: 3.0003, revenue: 302.1628 },
  { id: 'Row 23', spend: 44.853, logSpend: 3.8034, revenue: 364.3576 },
  { id: 'Row 26', spend: 133.1715, logSpend: 4.8916, revenue: 479.202 },
  { id: 'Row 27', spend: 178.1975, logSpend: 5.1829, revenue: 513.3044 },
  { id: 'Row 24', spend: 199.271, logSpend: 5.2947, revenue: 536.1085 },
  { id: 'Row 25', spend: 203.3019, logSpend: 5.3147, revenue: 565.9596 },
] as const
const raw = (spend: number) => 342.476437515154 + 1.0101418437966931 * spend
const logModel = (spend: number) => 2.207519726896976 + 99.59589743693455 * Math.log(spend)

function SpendChart({ transformed, model, selected = 0 }: { transformed: boolean; model?: 'raw' | 'log'; selected?: number }) {
  const width = 520, height = 270, left = 56, bottom = 225
  const xValue = (point: typeof sourcePoints[number]) => transformed ? point.logSpend : point.spend
  const xMin = transformed ? 2.8 : 0, xMax = transformed ? 5.5 : 225
  const px = (value: number) => left + ((value - xMin) / (xMax - xMin)) * 430
  const py = (value: number) => bottom - ((value - 280) / 310) * 180
  const modelPath = model ? Array.from({ length: 60 }, (_, index) => {
    const spend = 20 + index * 3.35
    const x = transformed ? Math.log(spend) : spend
    const y = model === 'raw' ? raw(spend) : logModel(spend)
    return `${index ? 'L' : 'M'}${px(x).toFixed(1)} ${py(y).toFixed(1)}`
  }).join(' ') : undefined
  const ticks = transformed ? [3, 4, 5] : [0, 50, 100, 150, 200]
  return <svg className="rn-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={transformed ? 'The same daily observations plotted against natural-log ad spend' : 'Daily revenue plotted against raw ad spend'}><line x1={left} y1="28" x2={left} y2={bottom}/><line x1={left} y1={bottom} x2="486" y2={bottom}/>{ticks.map(tick => <g key={tick}><line className="rn-grid" x1={px(tick)} y1="28" x2={px(tick)} y2={bottom}/><text x={px(tick)} y="244" textAnchor="middle">{tick}</text></g>)}{[300, 400, 500].map(tick => <g key={tick}><line className="rn-grid" x1={left} y1={py(tick)} x2="486" y2={py(tick)}/><text x="47" y={py(tick) + 4} textAnchor="end">${tick}</text></g>)}{modelPath && <path className={`rn-model rn-model--${model}`} d={modelPath}/>} {sourcePoints.map((point, index) => <circle key={point.id} className={index === selected ? 'rn-dot rn-dot--selected' : 'rn-dot'} cx={px(xValue(point))} cy={py(point.revenue)} r={index === selected ? 6 : 4.5}/>) }<text x="272" y="265" textAnchor="middle">{transformed ? 'ln(daily ad spend)' : 'daily ad spend ($)'}</text><text x="16" y="138" textAnchor="middle" transform="rotate(-90 16 138)">daily revenue ($)</text></svg>
}

export function RMNonLinear() {
  const [view, setView] = useState<'raw' | 'log'>('raw')
  const point = sourcePoints[0]
  return <Lesson number="13.7" title="Non-linear regression" lead="A curve can sometimes become a straight-line relationship after transforming one variable—then ordinary least squares can fit the transformed data."><Definition>This lesson shows one common approach to a curved relationship: transform a feature, then fit a linear model. For diminishing returns, use <strong>y = α + β ln(x) + ε</strong>.</Definition><section className="rm-panel"><div className="rm-heading"><p className="rm-eyebrow">Same source records, different horizontal scale</p><h2>Log-transform ad spend—not the observations themselves</h2><p>These are six identifiable daily records from the course workbook. Revenue stays the same; only the horizontal coordinate changes.</p></div><div className="rm-choice" role="group" aria-label="Choose a transformation view"><button aria-pressed={view === 'raw'} onClick={() => setView('raw')}>Raw spend</button><button aria-pressed={view === 'log'} onClick={() => setView('log')}>ln(spend)</button></div><div className="rn-transform"><SpendChart transformed={view === 'log'} selected={0}/><div><strong>{view === 'raw' ? 'Raw spend: the rate bends' : 'ln(spend): the pattern is closer to a line'}</strong><p>{view === 'raw' ? 'At lower spend, a similar extra budget is associated with a larger revenue rise than at higher spend. A straight line systematically misses that changing rate.' : 'The logarithm compresses high spend values. That makes the same revenue pattern more suitable for a linear fitted line.'}</p><div className="rn-mapping"><span>Row 22</span><b>${point.spend.toFixed(2)} spend</b><i>→</i><b>ln(${point.spend.toFixed(2)}) = {point.logSpend.toFixed(3)}</b><i>→</i><b>${point.revenue.toFixed(2)} revenue stays unchanged</b></div><p className="rm-note">A log needs positive input values. Another source example transforms the target instead: exponential population growth can use <strong>ln(y) = α + βx + ε</strong>.</p></div></div></section><Summary><strong>Remember:</strong> a transformation changes a variable’s representation, not the underlying records. Plot the same observations before and after, then evaluate whether the transformed model improves predictions.</Summary></Lesson>
}

export function RMNonLinearCase() {
  const [model, setModel] = useState<'raw' | 'log'>('raw')
  const [spend, setSpend] = useState(100)
  const [selected, setSelected] = useState(0)
  const prediction = model === 'raw' ? raw(spend) : logModel(spend)
  const record = sourcePoints[selected]
  const recordPrediction = model === 'raw' ? raw(record.spend) : logModel(record.spend)
  const residual = record.revenue - recordPrediction
  const sse = model === 'raw' ? 668423.616976 : 383219.779323
  return <Lesson number="13.8" title="Case study: non-linear regression" lead="Maven Marketing compares two source-workbook models to predict daily revenue from daily ad spend for an upcoming campaign."><Definition>The assignment: inspect historical spend and revenue, compare a raw linear fit with a log-spend fit, then use the better-fitting candidate to estimate campaign revenue.</Definition><section className="rm-panel"><div className="rm-heading"><p className="rm-eyebrow">Workbook case · 1,000 daily records</p><h2>Compare models on the same historical records</h2><p>The workbook fits both candidates to records from 2019-01-01 through 2021-09-26. Select a model and a displayed source record to inspect its prediction error.</p></div><div className="rn-case-controls"><div className="rm-choice" role="group" aria-label="Choose model"><button aria-pressed={model === 'raw'} onClick={() => setModel('raw')}>Raw linear model</button><button aria-pressed={model === 'log'} onClick={() => setModel('log')}>Log-spend model</button></div><label>Inspect source record<select value={selected} onChange={event => setSelected(Number(event.target.value))}>{sourcePoints.map((point, index) => <option value={index} key={point.id}>{point.id} · ${point.spend.toFixed(0)} spend</option>)}</select></label></div><div className="rn-case-grid"><SpendChart transformed={false} model={model} selected={selected}/><div className="rn-inspector"><span>{model === 'raw' ? 'Raw model' : 'Log-spend model'} · source-supplied training fit</span><strong>{model === 'raw' ? 'ŷ = 342.476 + 1.010 × spend' : 'ŷ = 2.208 + 99.596 × ln(spend)'}</strong><div><b>{record.id}: observed revenue</b><strong>${record.revenue.toFixed(2)}</strong></div><div><b>Model prediction</b><strong>${recordPrediction.toFixed(2)}</strong></div><div><b>Residual = actual − prediction</b><strong>${residual.toFixed(2)}</strong></div><div className="rn-sse"><b>Training SSE</b><strong>{sse.toLocaleString(undefined, { maximumFractionDigits: 2 })}</strong><small>{model === 'raw' ? 'Raw fit' : 'Log-spend fit: lower by 285,203.84 on these training records.'}</small></div></div></div><div className="rn-predict"><div><p className="rm-eyebrow">New campaign budget</p><h3>Estimate one future day</h3><label>Daily ad spend: ${spend}<input type="range" min="25" max="220" step="5" value={spend} onChange={event => setSpend(Number(event.target.value))}/></label></div><div className="rn-substitution"><span>{model === 'raw' ? `342.476 + 1.010 × ${spend}` : `2.208 + 99.596 × ln(${spend})`}</span><strong>Predicted revenue: ${prediction.toFixed(2)}</strong></div></div><p className="rm-note"><strong>Interpret carefully:</strong> the lower score compares training fit because the workbook fits both models on all 1,000 rows. It does not prove better future performance; test on appropriate unseen days next. Nor does this association prove the causal return from extra ad spend.</p></section><Summary><strong>Remember:</strong> the log model captures diminishing predicted gains: at $50, $100, $150, and $200 spend it predicts about $391.83, $460.86, $501.25, and $529.90. Equal budget increases need not produce equal revenue increases.</Summary></Lesson>
}
