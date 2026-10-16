import { useId, useState } from 'react'
import type { ReactNode } from 'react'
import './MultivariateDistributions.css'
import { boxStats } from './MultivariateDistributionsMath'

type Group = { name: string; color: string; values: number[] }

const GROUPS: Group[] = [
  { name: 'Retail', color: '#178b83', values: [6, 11, 12, 13, 13, 14, 14, 14, 15, 15, 15, 15, 16, 16, 16, 17, 17, 18, 19, 31] },
  { name: 'Web', color: '#bd8a20', values: [7, 12, 14, 16, 17, 18, 18, 19, 19, 20, 20, 20, 21, 21, 22, 23, 24, 26, 27, 33] },
  { name: 'Wholesale', color: '#7351a1', values: [5, 14, 16, 18, 20, 22, 23, 24, 24, 25, 25, 26, 27, 28, 29, 30, 31, 33, 35, 39] },
]

const CHART = { left: 76, right: 726, top: 28, bottom: 274 }
const xScale = (value: number) => CHART.left + value / 40 * (CHART.right - CHART.left)

function gaussianDensity(values: number[], x: number, bandwidth: number): number {
  const scale = 1 / (values.length * bandwidth * Math.sqrt(2 * Math.PI))
  return values.reduce((sum, value) => sum + Math.exp(-0.5 * ((x - value) / bandwidth) ** 2) * scale, 0)
}

function LessonIntro({ lesson, title, definition, intro, children }: { lesson: string; title: string; definition: string; intro: ReactNode; children: ReactNode }) {
  return <article className="mv-lesson">
    <header className="mv-lesson__intro"><p className="mv-lesson__eyebrow">Lesson {lesson}</p><h1>{title}</h1><p>{intro}</p></header>
    <section className="mv-lesson__definition"><p className="mv-lesson__eyebrow">The central idea</p><h2>{definition}</h2></section>
    {children}
  </article>
}

function LessonPanel({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return <section className="mv-panel"><div className="mv-panel__heading"><div><p className="mv-lesson__eyebrow">{eyebrow}</p><h2>{title}</h2></div></div>{children}</section>
}

function SharedChart({ title, description, yLabel, yMax, yTicks, children }: { title: string; description: string; yLabel: string; yMax: number; yTicks: number[]; children: ReactNode }) {
  const titleId = useId()
  const descriptionId = useId()
  const yScale = (value: number) => CHART.bottom - value / yMax * (CHART.bottom - CHART.top)
  return <svg className="mv-chart" viewBox="0 0 760 352" role="img" aria-labelledby={`${titleId} ${descriptionId}`}>
    <title id={titleId}>{title}</title><desc id={descriptionId}>{description}</desc>
    {yTicks.map(tick => <g key={tick}><path className="mv-chart__grid" d={`M${CHART.left} ${yScale(tick)} H${CHART.right}`} /><text className="mv-chart__tick" x={CHART.left - 10} y={yScale(tick) + 4} textAnchor="end">{tick.toFixed(yMax < 1 ? 2 : 0)}</text></g>)}
    <path className="mv-chart__axis" d={`M${CHART.left} ${CHART.top} V${CHART.bottom} H${CHART.right}`} />
    {[0, 10, 20, 30, 40].map(tick => <g key={tick}><path className="mv-chart__tick-mark" d={`M${xScale(tick)} ${CHART.bottom} v5`} /><text className="mv-chart__tick" x={xScale(tick)} y={CHART.bottom + 21} textAnchor="middle">{tick}</text></g>)}
    <text className="mv-chart__axis-label" transform="translate(18 150) rotate(-90)" textAnchor="middle">{yLabel}</text>
    <text className="mv-chart__axis-label" x="401" y="334" textAnchor="middle">Order value (dollars)</text>
    {children}
  </svg>
}

function Legend() {
  return <div className="mv-legend">{GROUPS.map(group => <span key={group.name}><i style={{ backgroundColor: group.color }} />{group.name}</span>)}</div>
}

function KDEChart({ bandwidth }: { bandwidth: number }) {
  const densityMax = .13
  const lines = GROUPS.map(group => {
    const points = Array.from({ length: 161 }, (_, i) => i / 4)
    return { ...group, path: points.map(value => `${xScale(value)},${CHART.bottom - gaussianDensity(group.values, value, bandwidth) / densityMax * (CHART.bottom - CHART.top)}`).join(' ') }
  })
  return <svg className="mv-chart" viewBox="0 0 760 352" role="img" aria-label={`Grouped one-dimensional kernel density estimates by order channel with bandwidth ${bandwidth} dollars`}>
    <title>Order-value KDE repeated for three groups</title><desc>Each colored curve estimates one group's order-value distribution. Curves share the same dollar axis, so their centers, spread, overlap, and shape can be compared. This is not a two-dimensional joint density.</desc>
    <path className="mv-chart__axis" d={`M${CHART.left} ${CHART.top} V${CHART.bottom} H${CHART.right}`} />
    {[0, 10, 20, 30, 40].map(tick => <g key={tick}><path className="mv-chart__tick-mark" d={`M${xScale(tick)} ${CHART.bottom} v5`} /><text className="mv-chart__tick" x={xScale(tick)} y={CHART.bottom + 21} textAnchor="middle">{tick}</text></g>)}
    {[0, .065, .13].map(tick => <g key={tick}><path className="mv-chart__grid" d={`M${CHART.left} ${CHART.bottom - tick / densityMax * (CHART.bottom - CHART.top)} H${CHART.right}`} /><text className="mv-chart__tick" x={CHART.left - 10} y={CHART.bottom - tick / densityMax * (CHART.bottom - CHART.top) + 4} textAnchor="end">{tick.toFixed(3)}</text></g>)}
    <text className="mv-chart__axis-label" transform="translate(18 150) rotate(-90)" textAnchor="middle">Estimated density (per $)</text>
    <text className="mv-chart__axis-label" x="401" y="334" textAnchor="middle">Order value (dollars)</text>
    {lines.map(line => <polyline key={line.name} points={line.path} fill="none" stroke={line.color} strokeWidth="3" />)}
  </svg>
}

export function MVCategoricalNumerical() {
  const summary = GROUPS.map(group => ({ ...group, mean: group.values.reduce((sum, value) => sum + value, 0) / group.values.length }))
  return <LessonIntro lesson="6.4 · Categorical-Numerical" title="Compare a number across groups" definition="A categorical-numerical distribution compares the distribution of a numeric measure across the classes of a category." intro={<>A retailer wants to compare <strong>order value in dollars</strong> across three order channels. This small sample is illustrative: the category tells us which group each order belongs to, and the numeric measure shows how order values vary inside each group.</>}>
    <section className="mv-purpose"><p className="mv-lesson__eyebrow">Why use this view?</p><h2>A single average can hide spread and overlap.</h2><p>Comparing customer value, order size, or sales by a category can reveal whether groups differ in center, variation, shape, or overlap. Days and hours can also act as categories when checking sales patterns.</p></section>
    <LessonPanel eyebrow="One numeric measure · three order channels" title="Each group has its own distribution">
      <p className="mv-prompt">Read left to right on the same dollar scale. Notice where each group centers and how wide its values spread.</p>
      <SharedChart title="Order value by order channel" description="The colored marks show individual orders for three channels, positioned on one shared dollar scale. The groups have different centers and spreads, with some overlap." yLabel="Order" yMax={1} yTicks={[]}>
        {GROUPS.map((group, groupIndex) => <g key={group.name} transform={`translate(0 ${groupIndex * 72 + 52})`}><text className="mv-chart__group" x="25" y="4">{group.name}</text>{group.values.map((value, index) => <circle key={`${value}-${index}`} cx={xScale(value)} cy={((index % 5) - 2) * 8} r="5" fill={group.color} opacity=".76"><title>{group.name}: ${value}</title></circle>)}</g>)}
      </SharedChart>
      <div className="mv-table-wrap"><table className="mv-table"><caption>Same sample, summarized by channel</caption><thead><tr><th scope="col">Order channel</th><th scope="col">Orders</th><th scope="col">Mean order value</th><th scope="col">Observed range</th></tr></thead><tbody>{summary.map(group => <tr key={group.name}><th scope="row"><i style={{ backgroundColor: group.color }} />{group.name}</th><td>{group.values.length}</td><td>${group.mean.toFixed(1)}</td><td>${Math.min(...group.values)}–${Math.max(...group.values)}</td></tr>)}</tbody></table></div>
      <p className="mv-note"><strong>Notice:</strong> the group means differ, but the distributions overlap. The mean describes a center; it does not describe every order or the uncertainty in a future order.</p>
    </LessonPanel>
    <section className="mv-summary"><p className="mv-lesson__eyebrow">Keep in mind</p><h2>Cut one numeric measure by meaningful groups.</h2><p>Use the shape and spread as well as a summary metric. Keep units and axis scales consistent so comparisons are fair.</p></section>
  </LessonIntro>
}

export function MVKernelDensities() {
  const [bandwidth, setBandwidth] = useState(2.5)
  return <LessonIntro lesson="6.5 · Multivariate Kernel Densities" title="Smooth distributions, grouped by category" definition="A grouped KDE repeats a one-dimensional kernel density estimate for each category class on the same numeric axis." intro={<>A service team compares order value by channel to see whether typical orders and variability differ. KDE curves make the broad shape easier to compare when exact histogram bin edges would add visual noise.</>}>
    <section className="mv-purpose"><p className="mv-lesson__eyebrow">Why use a KDE?</p><h2>Look past arbitrary bin boundaries to compare shape.</h2><p>Each observation contributes a smooth bump; averaging those bumps estimates where values are concentrated. Repeating that estimate for each category lets the same measures—center, spread, modality, skew, and overlap—be compared group by group.</p></section>
    <LessonPanel eyebrow="Grouped univariate estimates · same dollar scale" title="Bandwidth controls how much detail is smoothed">
      <div className="mv-controls"><label htmlFor="mv-kde-bandwidth">KDE bandwidth <strong>${bandwidth.toFixed(1)}</strong><input id="mv-kde-bandwidth" type="range" min="1" max="6" step="0.5" value={bandwidth} onChange={event => setBandwidth(Number(event.target.value))} /><span>Smaller bandwidth keeps local bumps; larger bandwidth smooths them away. The data and x scale stay fixed.</span></label></div>
      <KDEChart bandwidth={bandwidth} /><Legend />
      <p className="mv-note"><strong>How to read it:</strong> a taller curve means more observations are concentrated nearby. Density is not a count, and a KDE is not a line connecting histogram bars. These are separate one-dimensional estimates by channel, not one joint two-dimensional surface.</p>
    </LessonPanel>
    <section className="mv-summary"><p className="mv-lesson__eyebrow">Keep in mind</p><h2>Read center, spread, overlap, and shape together.</h2><p>Retail centers lower and is more concentrated; Web centers higher and is wider; Wholesale has the widest spread and overlaps Web. Bandwidth changes visual smoothness, not the observations.</p></section>
  </LessonIntro>
}

function ViolinChart({ bandwidth }: { bandwidth: number }) {
  const maxDensity = Math.max(...GROUPS.flatMap(group => Array.from({ length: 121 }, (_, i) => gaussianDensity(group.values, i / 3, bandwidth))))
  const yScale = (value: number) => 294 - value / 40 * 250
  return <svg className="mv-chart" viewBox="0 0 760 352" role="img" aria-label={`Violin plots of order value by channel, density smoothing bandwidth ${bandwidth} dollars`}>
    <title>Violin plots of order value by channel</title><desc>Each violin mirrors a one-dimensional KDE across its center. The vertical axis is order value in dollars, category groups are separated along the horizontal axis, and violin width represents estimated density.</desc>
    {[0, 10, 20, 30, 40].map(tick => <g key={tick}><path className="mv-chart__grid" d={`M${CHART.left} ${yScale(tick)} H${CHART.right}`} /><text className="mv-chart__tick" x={CHART.left - 10} y={yScale(tick) + 4} textAnchor="end">{tick}</text></g>)}
    <path className="mv-chart__axis" d={`M${CHART.left} 44 V294 H${CHART.right}`} />
    {GROUPS.map((group, groupIndex) => {
      const center = 190 + groupIndex * 205
      const steps = Array.from({ length: 121 }, (_, i) => i / 3)
      const half = steps.map(value => Math.min(58, gaussianDensity(group.values, value, bandwidth) / maxDensity * 58))
      const left = steps.map((value, i) => `${center - half[i]},${yScale(value)}`)
      const right = [...steps].reverse().map((value, reverseIndex) => { const i = steps.length - 1 - reverseIndex; return `${center + half[i]},${yScale(value)}` })
      return <g key={group.name}><polygon points={[...left, ...right].join(' ')} fill={group.color} fillOpacity=".38" stroke={group.color} strokeWidth="2" />{group.values.map((value, i) => <circle key={`${value}-${i}`} cx={center + ((i % 5) - 2) * 4} cy={yScale(value)} r="2.5" fill={group.color} opacity=".65" />)}<text className="mv-chart__group" x={center} y="322" textAnchor="middle">{group.name}</text></g>
    })}
    <text className="mv-chart__axis-label" transform="translate(18 160) rotate(-90)" textAnchor="middle">Order value (dollars)</text>
    <text className="mv-chart__axis-label" x="401" y="346" textAnchor="middle">Order channel</text>
  </svg>
}

export function MVViolinPlots() {
  const [bandwidth, setBandwidth] = useState(2.5)
  return <LessonIntro lesson="6.6 · Violin Plots" title="See each group’s shape without overlap" definition="A violin plot mirrors a kernel density estimate around a centerline, with the numeric measure on the vertical axis and categories separated horizontally." intro={<>When many categories are plotted as overlapping curves, comparisons become hard to follow. A violin keeps the same distribution information while giving each channel its own space.</>}>
    <section className="mv-purpose"><p className="mv-lesson__eyebrow">Why use a violin?</p><h2>Separate groups so their shapes are easier to compare.</h2><p>Each violin uses the same order values as the grouped KDE. Its width shows estimated density at that dollar amount; a wide section means more orders cluster there. The shape depends on KDE smoothing.</p></section>
    <LessonPanel eyebrow="Same orders · mirrored grouped KDE" title="Turn the density, mirror it, and repeat by channel">
      <div className="mv-controls"><label htmlFor="mv-violin-bandwidth">KDE bandwidth <strong>${bandwidth.toFixed(1)}</strong><input id="mv-violin-bandwidth" type="range" min="1" max="6" step="0.5" value={bandwidth} onChange={event => setBandwidth(Number(event.target.value))} /><span>Changing bandwidth makes each violin more detailed or smoother. Compare the shape to the grouped KDE lesson.</span></label></div>
      <ViolinChart bandwidth={bandwidth} /><Legend />
      <p className="mv-note"><strong>Read the width:</strong> broad sections are value ranges with greater estimated density; narrow tails have fewer nearby observations. Width is a density scale, not the number of records in the category.</p>
    </LessonPanel>
    <section className="mv-summary"><p className="mv-lesson__eyebrow">Keep in mind</p><h2>A violin shows shape; its width is an estimate.</h2><p>The violin and KDE use the same sample. The mirrored outline is a visual encoding of a one-dimensional density estimate, not a second dataset.</p></section>
  </LessonIntro>
}

function BoxPlotChart() {
  const yScale = (value: number) => 294 - value / 40 * 250
  return <svg className="mv-chart" viewBox="0 0 760 352" role="img" aria-label="Box plots of order value by channel. Boxes show exact interpolated quartiles, median lines, whiskers to observed values within 1.5 interquartile ranges, and flagged values beyond them.">
    <title>Box plots with quartiles and 1.5 IQR whiskers</title><desc>For each channel, the box spans the 25th to 75th percentile using linear interpolation of sorted values, with a median line. Whiskers end at the most extreme observed values inside the 1.5 IQR fences. Points outside the fences are flagged outliers, not data errors.</desc>
    {[0, 10, 20, 30, 40].map(tick => <g key={tick}><path className="mv-chart__grid" d={`M${CHART.left} ${yScale(tick)} H${CHART.right}`} /><text className="mv-chart__tick" x={CHART.left - 10} y={yScale(tick) + 4} textAnchor="end">{tick}</text></g>)}
    <path className="mv-chart__axis" d={`M${CHART.left} 44 V294 H${CHART.right}`} />
    {GROUPS.map((group, groupIndex) => {
      const center = 190 + groupIndex * 205
      const stats = boxStats(group.values)
      const boxTop = yScale(stats.q3)
      const boxBottom = yScale(stats.q1)
      return <g key={group.name}>
        <path d={`M${center} ${yScale(stats.highWhisker)} V${boxTop} M${center - 24} ${yScale(stats.highWhisker)} H${center + 24} M${center} ${boxBottom} V${yScale(stats.lowWhisker)} M${center - 24} ${yScale(stats.lowWhisker)} H${center + 24}`} className="mv-box__whisker" stroke={group.color} />
        <rect x={center - 45} y={boxTop} width="90" height={boxBottom - boxTop} fill={group.color} fillOpacity=".25" stroke={group.color} strokeWidth="2" />
        <path d={`M${center - 45} ${yScale(stats.median)} H${center + 45}`} stroke={group.color} strokeWidth="3" />
        {stats.outliers.map((value, i) => <circle key={`${value}-${i}`} cx={center} cy={yScale(value)} r="4" fill={group.color}><title>{group.name}: ${value}, outside the 1.5×IQR fence</title></circle>)}
        <text className="mv-chart__group" x={center} y="322" textAnchor="middle">{group.name}</text>
      </g>
    })}
    <text className="mv-chart__axis-label" transform="translate(18 160) rotate(-90)" textAnchor="middle">Order value (dollars)</text>
    <text className="mv-chart__axis-label" x="401" y="346" textAnchor="middle">Order channel</text>
  </svg>
}

export function MVBoxPlots() {
  const stats = GROUPS.map(group => ({ group, stats: boxStats(group.values) }))
  return <LessonIntro lesson="6.7 · Box Plots" title="Compare medians, quartiles, and flagged values" definition="A box plot summarizes a numeric distribution with its median, 25th and 75th percentiles, whiskers, and values beyond the outlier fences." intro={<>A manager needs a quick comparison of typical order value and variation across channels. We reuse the same illustrative order values as lessons 6.4–6.6: each channel has 20 example orders, and each value is one order total in dollars. This is a teaching example, not a company transaction extract.</>}>
    <section className="mv-purpose"><p className="mv-lesson__eyebrow">Why use a box plot?</p><h2>Compare central values and spread at a glance.</h2><p>For each group, the box spans the middle half of the values. The median is the 50th percentile: the middle value in an odd-sized sample or the average of the two middle values in an even-sized sample. Whiskers extend to observed values inside the 1.5×IQR fences. Values beyond a fence are unusual in this sample and flagged for review, not identified as data errors.</p></section>
    <LessonPanel eyebrow="Three order channels · quartile method shown" title="The box is the middle 50% of observed orders">
      <section className="mv-raw-orders" aria-label="Observed order values used in the box plots">
        <p className="mv-lesson__eyebrow">The observations behind the plot</p>
        <div className="mv-raw-orders__table-wrap"><table className="mv-raw-orders__table"><caption>Example order totals in dollars, sorted within each channel</caption><thead><tr><th scope="col">Order channel</th><th scope="col">Order totals ($)</th></tr></thead><tbody>{stats.map(({ group, stats: s }) => <tr key={group.name}><th scope="row"><i style={{ backgroundColor: group.color }} />{group.name}</th><td><div className="mv-raw-orders__values">{group.values.map((value, index) => {
          const isFlagged = s.outliers.includes(value)
          return <span key={`${value}-${index}`} className={`mv-raw-orders__value${isFlagged ? ' mv-raw-orders__value--flagged' : ''}`} style={isFlagged ? { borderColor: group.color, color: group.color } : undefined} title={`${group.name}: $${value}${isFlagged ? ' — outside a 1.5×IQR fence, flagged for review' : ''}`}>{value}{isFlagged && <small>flagged</small>}</span>
        })}</div></td></tr>)}</tbody></table></div>
        <p className="mv-raw-orders__legend"><span className="mv-raw-orders__flag-sample">flagged</span> A colored outline and “flagged” label mark an observed order outside its channel’s fences. These are review signals, not errors.</p>
      </section>
      <BoxPlotChart />
      <aside className="mv-iqr-explainer" aria-label="Interquartile range worked example">
        <div className="mv-iqr-explainer__definition">
          <p className="mv-lesson__eyebrow">Read the box</p>
          <h3>Interquartile range (IQR)</h3>
          <p><strong>IQR = Q3 − Q1</strong></p>
          <p><strong>Q1</strong> is the 25th percentile and <strong>Q3</strong> is the 75th. Their difference is the spread of the middle 50%; on this vertical plot, it is the box’s height.</p>
          <p className="mv-iqr-explainer__why">IQR compares typical spread without the most extreme values dominating.</p>
        </div>
        <div className="mv-iqr-explainer__example">
          <p className="mv-lesson__eyebrow">Retail · order value in dollars</p>
          <p className="mv-iqr-explainer__calculation"><span>Q1 = $13.75</span><span>Q3 = $16.25</span><strong>IQR = $16.25 − $13.75 = $2.50</strong></p>
          <p>Fences: $13.75 − 1.5 × $2.50 = <strong>$10</strong>; $16.25 + 1.5 × $2.50 = <strong>$20</strong>.</p>
          <p>Retail’s whiskers end at the observed <strong>$11</strong> and <strong>$19</strong> inside those fences; <strong>$6</strong> and <strong>$31</strong> fall outside and are flagged.</p>
        </div>
      </aside>
      <div className="mv-box-key"><span><i className="mv-box-key__box" /> 25th to 75th percentile; line is median</span><span><i className="mv-box-key__whisker" /> Farthest observed value inside 1.5×IQR fences</span><span><i className="mv-box-key__outlier" /> Value outside a fence, flagged for review</span></div>
      <div className="mv-table-wrap"><table className="mv-table"><caption>Plotted sample summaries (quartiles use linear interpolation; displayed to one decimal)</caption><thead><tr><th scope="col">Channel</th><th scope="col">Q1</th><th scope="col">Median</th><th scope="col">Q3</th><th scope="col">IQR</th><th scope="col">Whiskers</th><th scope="col">Flagged values</th></tr></thead><tbody>{stats.map(({ group, stats: s }) => <tr key={group.name}><th scope="row"><i style={{ backgroundColor: group.color }} />{group.name}</th><td>${s.q1.toFixed(1)}</td><td>${s.median.toFixed(1)}</td><td>${s.q3.toFixed(1)}</td><td>${s.iqr.toFixed(1)}</td><td>${s.lowWhisker}–${s.highWhisker}</td><td>{s.outliers.length ? s.outliers.map(value => `$${value}`).join(', ') : 'None'}</td></tr>)}</tbody></table></div>
      <p className="mv-note"><strong>Interpret flagged points in context.</strong> An unusual order can be valid; the plot does not call it an error or remove it automatically.</p>
    </LessonPanel>
    <section className="mv-summary"><p className="mv-lesson__eyebrow">Keep in mind</p><h2>Compact summaries trade away distribution detail.</h2><p>Use a box plot for quick comparisons of median and spread. Add a violin, KDE, or the raw observations when multimodality or local shape matters.</p></section>
  </LessonIntro>
}

export function MVLimitations() {
  const [classCount, setClassCount] = useState(3)
  const [dimensionCount, setDimensionCount] = useState(2)
  const combinations = classCount ** dimensionCount
  return <LessonIntro lesson="6.8 · Limitations of Categorical Distributions" title="Know when the visual summary stops helping" definition="Categorical profiling describes observed patterns; it becomes difficult to interpret as variables or category combinations grow, and it cannot answer predictive or causal questions by itself." intro={<>A team inspects conversion rates after changing several page elements. Group summaries can describe what happened in the observed data, but they do not isolate which change drove conversions or establish what would happen next.</>}>
    <section className="mv-purpose"><p className="mv-lesson__eyebrow">Why note the limits?</p><h2>A clear chart can still be the wrong answer to the question.</h2><p>Profiling helps us understand the data and choose what to examine next. It does not turn a complex pattern into a forecast or a causal explanation. When a decision asks what will happen or what caused a change, the analysis needs a design and method suited to that question.</p></section>
    <LessonPanel eyebrow="Combinations multiply quickly" title="See how group counts expand across variables">
      <p className="mv-prompt">Choose the number of classes per variable and the number of category variables. This simple grid counts possible combinations; it does not claim every combination appears in the data.</p>
      <div className="mv-controls mv-controls--paired">
        <label htmlFor="mv-classes">Classes in each category <strong>{classCount}</strong><input id="mv-classes" type="range" min="2" max="6" step="1" value={classCount} onChange={event => setClassCount(Number(event.target.value))} /><span>More classes create more groups to scan.</span></label>
        <label htmlFor="mv-dimensions">Category variables <strong>{dimensionCount}</strong><input id="mv-dimensions" type="range" min="1" max="5" step="1" value={dimensionCount} onChange={event => setDimensionCount(Number(event.target.value))} /><span>Each new variable multiplies the possible combinations.</span></label>
      </div>
      <div className="mv-combination-result"><strong>{combinations.toLocaleString()} possible combinations</strong><span>{classCount} choices for each of {dimensionCount} variables: {classCount}<sup>{dimensionCount}</sup> = {combinations.toLocaleString()}</span></div>
      <div className="mv-combination-visual" aria-label={`${Math.min(combinations, 60)} example combination cells shown out of ${combinations} possible combinations`}>
        {Array.from({ length: Math.min(combinations, 60) }, (_, index) => <i key={index} style={{ opacity: .35 + (index % 4) * .15 }} />)}
      </div>
      {combinations > 60 && <p className="mv-caption">Showing 60 cells as a sample; {combinations - 60} more possible combinations are omitted from the sketch.</p>}
      <div className="mv-next-steps"><div><strong>Descriptive question</strong><span>Compare observed distributions by a useful, interpretable group.</span></div><div><strong>Predictive question</strong><span>Define the target, build a model, and evaluate predictions on data it did not train on.</span></div><div><strong>Causal question</strong><span>Use a study design and assumptions that support causal inference; profiling alone cannot show that a feature caused a change.</span></div></div>
      <p className="mv-note"><strong>Boundary:</strong> machine learning can help with prediction when visual summaries fall short, but it does not by itself prove causation. A complex model also needs appropriate evaluation and careful interpretation.</p>
    </LessonPanel>
    <section className="mv-summary"><p className="mv-lesson__eyebrow">Keep in mind</p><h2>Use profiling to describe and orient the next step.</h2><p>When classes or dimensions multiply, select a useful slice or move to a method designed for the question. Prediction and causal explanation need their own evidence.</p></section>
  </LessonIntro>
}
