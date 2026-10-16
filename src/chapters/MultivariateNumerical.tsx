import { useId, useState } from 'react'
import './MultivariateNumerical.css'
import { pearsonCorrelation } from './multivariateMath'
import { correlationWorkbookRows } from './multivariateNumericalData'

type Props = { number: string; title: string; definition: React.ReactNode; summary: string }

function Page({ number, title, definition, summary, children }: Props & { children: React.ReactNode }) {
  const id = useId()
  return <article className="mvn" aria-labelledby={id}>
    <header className="mvn__intro"><p className="mvn__eyebrow">Chapter 6.{number} · Multivariate profiling</p><h1 id={id}>{title}</h1><p className="mvn__definition">{definition}</p></header>
    {children}
    <aside className="mvn__summary"><span>Keep in mind</span><p>{summary}</p></aside>
  </article>
}

function Section({ label, title, children }: { label: string; title: string; children: React.ReactNode }) {
  const id = useId()
  return <section className="mvn__panel" aria-labelledby={id}><div className="mvn__panel-heading"><p className="mvn__eyebrow">{label}</p><h2 id={id}>{title}</h2></div>{children}</section>
}

function PointChart({ values, label, curve = false }: { values: readonly (readonly [number, number])[]; label: string; curve?: boolean }) {
  const xMin = Math.min(...values.map(([x]) => x)); const xMax = Math.max(...values.map(([x]) => x))
  const yMin = Math.min(...values.map(([, y]) => y)); const yMax = Math.max(...values.map(([, y]) => y))
  const px = (x: number) => 28 + (x - xMin) / (xMax - xMin || 1) * 184
  const py = (y: number) => 112 - (y - yMin) / (yMax - yMin || 1) * 88
  return <svg className="mvn__small-chart" viewBox="0 0 230 146" role="img" aria-label={label}>
    <path className="mvn__axis" d="M28 15V112H216" />
    {[0, 1, 2, 3].map((tick) => <path key={tick} className="mvn__grid" d={`M28 ${24 + tick * 28}H216`} />)}
    {curve && <path className="mvn__fit" d={values.map(([x, y], i) => `${i ? 'L' : 'M'}${px(x)} ${py(y)}`).join(' ')} />}
    {values.map(([x, y], index) => <circle className="mvn__point" key={`${x}-${index}`} cx={px(x)} cy={py(y)} r="4.2" />)}
    <text className="mvn__axis-label" x="210" y="137" textAnchor="end">X</text><text className="mvn__axis-label" x="16" y="19">Y</text>
  </svg>
}

export function MVNumericalNumerical() {
  const groups = [
    { title: 'Positive', note: 'Higher X tends to appear with higher Y.', points: [[1, 1], [2, 1.5], [3, 1.4], [4, 2.1], [5, 1.9], [6, 2.2], [7, 2.5], [8, 2.3], [9, 2.9], [10, 3.1], [11, 3], [12, 3.7], [13, 3.5], [14, 4.1], [15, 4.3]] as const },
    { title: 'Negative', note: 'Higher X tends to appear with lower Y.', points: [[1, 4.5], [2, 4.1], [3, 4.2], [4, 3.6], [5, 3.8], [6, 3.3], [7, 3.5], [8, 2.8], [9, 3], [10, 2.4], [11, 2.5], [12, 1.9], [13, 2.1], [14, 1.5], [15, 1.2]] as const },
    { title: 'Curved', note: 'A clear pattern can bend instead of following a line.', points: [[-7, 4.6], [-6, 4], [-5, 3.5], [-4, 2.9], [-3, 2.4], [-2, 1.9], [-1, 1.5], [0, 1.3], [1, 1.5], [2, 1.9], [3, 2.4], [4, 2.9], [5, 3.5], [6, 4], [7, 4.6]] as const },
  ]
  return <Page number="9" title="Compare two numerical variables" definition={<>A numerical–numerical distribution pairs <strong>two measurements from the same observation</strong> to show how they move together. Each dot is one row: its horizontal and vertical positions are the row’s X and Y values.</>} summary="A scatter plot reveals the shape and direction of a two-variable pattern. Look at the points before choosing a summary statistic or drawing a conclusion.">
    <Section label="Start with a practical question" title="When spend changes, what happens to sales?">
      <p className="mvn__lead">A marketing analyst may compare weekly ad spend with weekly sales. A house analyst may compare floor area with sale price. In both cases, plot paired observations to see whether Y tends to rise, fall, curve, or show no visible pattern as X changes.</p>
      <div className="mvn__scatter-grid">{groups.map(group => <figure className="mvn__mini-plot" key={group.title}><figcaption><strong>{group.title} relationship</strong><span>{group.note}</span></figcaption><PointChart values={group.points} label={`${group.title} relationship between two numerical variables.`} /></figure>)}</div>
      <aside className="mvn__note"><strong>Read the picture first.</strong><span>Scatter plots make the relationship intuitive, but a cloud can be linear, curved, clustered, or dominated by an unusual point. Correlation summarizes only one particular part of that picture.</span></aside>
    </Section>
  </Page>
}

const workedX = [1, 2, 3] as const
const workedY = [1, 3, 2] as const
const workedR = pearsonCorrelation(workedX, workedY) ?? 0

export function MVCorrelation() {
  const [pattern, setPattern] = useState<'positive' | 'negative' | 'curve'>('positive')
  const examples = {
    positive: { title: 'Positive example', points: [[1, 1], [2, 1.5], [3, 1.4], [4, 2.1], [5, 1.9], [6, 2.2], [7, 2.5], [8, 2.3], [9, 2.9], [10, 3.1], [11, 3], [12, 3.7], [13, 3.5], [14, 4.1], [15, 4.3]] as const },
    negative: { title: 'Negative example', points: [[1, 4.5], [2, 4.1], [3, 4.2], [4, 3.6], [5, 3.8], [6, 3.3], [7, 3.5], [8, 2.8], [9, 3], [10, 2.4], [11, 2.5], [12, 1.9], [13, 2.1], [14, 1.5], [15, 1.2]] as const },
    curve: { title: 'Curved example', points: [[-7, 4.6], [-6, 4], [-5, 3.5], [-4, 2.9], [-3, 2.4], [-2, 1.9], [-1, 1.5], [0, 1.3], [1, 1.5], [2, 1.9], [3, 2.4], [4, 2.9], [5, 3.5], [6, 4], [7, 4.6]] as const },
  }
  const selectedExample = examples[pattern]
  const selectedR = pearsonCorrelation(selectedExample.points.map(([x]) => x), selectedExample.points.map(([, y]) => y))
  return <Page number="10" title="Correlation summarizes a linear relationship" definition={<>Pearson correlation, <strong>r</strong>, describes the direction and strength of a straight-line relationship between two numerical variables. It ranges from <strong>−1 to +1</strong>; zero means no linear association.</>} summary="Correlation is standardized covariance: compare whether paired values fall above or below their own means, then scale by both standard deviations. Pearson r measures linear association and does not capture every pattern.">
    <Section label="Why summarize a relationship?" title="A direction and strength you can compare">
      <p className="mvn__lead">A scatter plot can contain hundreds of weekly rows. Correlation compresses the linear co-movement into one comparable number, even when X and Y use very different units. It answers whether high values of one tend to pair with high or low values of the other.</p>
      <div className="mvn__range-visual"><div className="mvn__range-line"><span>−1</span><span>0</span><span>+1</span></div><div className="mvn__range-labels"><b>Perfect negative line</b><b>No linear association</b><b>Perfect positive line</b></div><div className="mvn__range-pointer" aria-hidden="true"><span className="is-left">↓</span><span className="is-mid">↓</span><span className="is-right">↓</span></div><div className="mvn__range-track" /></div>
      <p className="mvn__small">The closer |r| is to 1, the tighter the points follow a straight line. Values near 0 can still hide a curved relationship. If either variable is constant, its standard deviation is zero and Pearson r is undefined.</p>
      <div className="mvn__corr-explorer"><div><p className="mvn__eyebrow">Why inspect the points?</p><p className="mvn__body">These controls change the paired observations and update both the scatter plot and r. Notice how a strong U-shaped pattern can still have r = 0.</p><div className="mvn__button-row" role="group" aria-label="Choose an illustrative relationship">{(['positive', 'negative', 'curve'] as const).map(key=><button type="button" key={key} aria-pressed={pattern===key} className={pattern===key?'is-selected':''} onClick={()=>setPattern(key)}>{key==='positive'?'Positive':key==='negative'?'Negative':'Curved'}</button>)}</div><p className="mvn__live-result" aria-live="polite">{selectedExample.title}: <strong>{selectedR === null ? 'undefined' : `r = ${(Math.abs(selectedR) < 0.005 ? 0 : selectedR).toFixed(2)}`}</strong></p></div><figure className="mvn__mini-plot"><figcaption><strong>{selectedExample.title}</strong><span>15 illustrative paired observations; the scatter plot and Pearson r update together.</span></figcaption><PointChart values={selectedExample.points} label={`${selectedExample.title} paired values. Pearson correlation is ${(selectedR === null ? 'undefined' : (Math.abs(selectedR) < 0.005 ? 0 : selectedR).toFixed(2))}.`}/></figure></div>
      <div className="mvn__calculation"><div><p className="mvn__eyebrow">Worked positive example · always visible</p><p className="mvn__body">Here X measures weekly ad spend in hundreds of dollars and Y measures weekly site visits in thousands. This fixed three-week example has r = 0.50; it stays visible while you explore the patterns above.</p></div>
        <table className="mvn__table"><caption>Subtract each variable’s mean, then multiply the paired deviations.</caption><thead><tr><th>Row</th><th>X</th><th>X − x̄</th><th>Y</th><th>Y − ȳ</th><th>Product</th></tr></thead><tbody>{workedX.map((x, i) => <tr key={i}><th>{i + 1}</th><td>{x}</td><td>{x - 2}</td><td>{workedY[i]}</td><td>{workedY[i] - 2}</td><td>{(x - 2) * (workedY[i] - 2)}</td></tr>)}</tbody><tfoot><tr><th colSpan={5}>Sum of paired deviation products</th><td>1</td></tr></tfoot></table>
        <div className="mvn__equation"><span>r = Σ[(x − x̄)(y − ȳ)] ÷ √(Σ(x − x̄)² · Σ(y − ȳ)²)</span><strong>1 ÷ √(2 · 2) = {workedR.toFixed(2)}</strong></div><p className="mvn__small">The common sample-covariance form is r = sample covariance ÷ (sample SD of X × sample SD of Y). The n−1 factors cancel, giving the equivalent formula shown here. This example has r = 0.50: a moderate positive linear association in these three points.</p>
      </div>
      <div className="mvn__limitation"><p><strong>Zero does not mean “nothing is related.”</strong> It means there is no straight-line association in these paired values. Plot first, then consider whether another measure or model better describes a curved pattern.</p></div>
    </Section>
  </Page>
}

const iceCreamDrowningDays = [
  [1, 1.2, 1], [2, 1.8, 2.1], [3, 2.2, 1.7], [4, 2.4, 2.8], [5, 3.1, 2.5], [6, 3.4, 3.2],
  [7, 3.8, 4.3], [8, 4.2, 3.7], [9, 4.5, 4.7], [10, 5.1, 4.2], [11, 5.5, 5.6], [12, 6, 5.1],
  [13, 6.3, 6.7], [14, 7, 6.1], [15, 7.4, 7.2], [16, 8, 6.8], [17, 8.5, 8.6], [18, 9.2, 8.1],
] as const

export function MVCorrelationCausation() {
  const id = useId()
  const [showIceCream, setShowIceCream] = useState(true)
  const [showDrowningRisk, setShowDrowningRisk] = useState(true)
  const scatterX = (value: number) => 68 + value / 10 * 350
  const scatterY = (value: number) => 232 - value / 10 * 190
  const trendX = (day: number) => 58 + (day - 1) / 17 * 518
  const trendY = (value: number) => 180 - value / 10 * 144
  const salesValues = iceCreamDrowningDays.map(([, sales]) => sales)
  const drowningValues = iceCreamDrowningDays.map(([, , drownings]) => drownings)
  const scaleToIndex = (value: number, values: readonly number[]) => (value - Math.min(...values)) / (Math.max(...values) - Math.min(...values)) * 10
  const salesTrend = iceCreamDrowningDays.map(([day, sales]) => [day, scaleToIndex(sales, salesValues)] as const)
  const drowningsTrend = iceCreamDrowningDays.map(([day, , drownings]) => [day, scaleToIndex(drownings, drowningValues)] as const)
  const salesPath = salesTrend.map(([day, sales], index) => `${index ? 'L' : 'M'}${trendX(day)} ${trendY(sales)}`).join(' ')
  const drowningsPath = drowningsTrend.map(([day, drownings], index) => `${index ? 'L' : 'M'}${trendX(day)} ${trendY(drownings)}`).join(' ')
  const scatterPoints = iceCreamDrowningDays.map(([day, sales, drownings]) => `${day}, ice-cream sales ${sales}, recorded drownings ${drownings}`).join('; ')
  return <Page number="11" title="Correlation does not establish cause" definition={<>Correlation describes how two variables vary together. <strong>By itself, it cannot show that changing one variable causes the other to change.</strong></>} summary="An observed relationship can be useful for investigation or prediction, but it does not tell you what would happen if you deliberately changed X. Look for shared causes, timing, selection, and a suitable causal design.">
    <Section label="A familiar seasonal pattern" title="Ice cream sales and drownings can rise together">
      <p className="mvn__lead">In a New England vacation town, sunny warm days may bring both more ice-cream purchases and more swimming. Each dot below is one day, pairing that day’s ice-cream sales level with its recorded drownings level. The 18-day pattern is illustrative, with relative index values rather than absolute counts.</p>
      <div className="mvn__causality-layout"><figure className="mvn__mini-plot mvn__daily-scatter"><figcaption><strong>Paired values for each day</strong><span>Illustrative daily pattern · both axes show relative indices.</span></figcaption><svg className="mvn__daily-scatter-svg" viewBox="0 0 470 285" role="img" aria-label={`Scatter plot of 18 illustrative daily pairs. Horizontal axis: ice cream sales, relative index. Vertical axis: recorded drownings, relative index. ${scatterPoints}`}>
            <path className="mvn__axis" d="M66 42V232H426" />
            {[0, 2, 4, 6, 8, 10].map(tick => <g key={tick}><path className="mvn__grid" d={`M66 ${scatterY(tick)}H426`} /><text className="mvn__tick-label" x="56" y={scatterY(tick) + 4} textAnchor="end">{tick}</text><text className="mvn__tick-label" x={scatterX(tick) + 1} y="248" textAnchor="middle">{tick}</text></g>)}
            {iceCreamDrowningDays.map(([day, sales, risk]) => <circle key={day} className="mvn__point" cx={scatterX(sales)} cy={scatterY(risk)} r="5" />)}
            <text className="mvn__axis-label" x="246" y="278" textAnchor="middle">Ice cream sales (relative index)</text><text className="mvn__axis-label" transform="rotate(-90 16 137)" x="16" y="137" textAnchor="middle">Recorded drownings (relative index)</text>
          </svg></figure>
        <div className="mvn__daily-views"><figure className="mvn__daily-trend"><figcaption><strong>How both series change by day</strong><span>Shared day axis · each series scaled to 0–10 separately.</span></figcaption><div className="mvn__series-toggles" role="group" aria-label="Choose which day series to show">
            <button type="button" aria-pressed={showIceCream} className={`mvn__series-toggle is-sales${showIceCream ? ' is-visible' : ''}`} onClick={() => setShowIceCream(value => !value)}><i aria-hidden="true" />Ice cream sales</button>
            <button type="button" aria-pressed={showDrowningRisk} className={`mvn__series-toggle is-risk${showDrowningRisk ? ' is-visible' : ''}`} onClick={() => setShowDrowningRisk(value => !value)}><i aria-hidden="true" />Recorded drownings</button>
          </div><svg className="mvn__daily-trend-svg" viewBox="0 0 620 250" role="img" aria-label={`Daily trend for ice cream sales and recorded drownings, each scaled independently from 0 to 10.${showIceCream ? ' Ice cream sales series is shown.' : ''}${showDrowningRisk ? ' Recorded drownings series is shown.' : ''}`}>
            <path className="mvn__axis" d="M58 28V180H584" />
            {[0, 2, 4, 6, 8, 10].map(tick => <g key={tick}><path className="mvn__grid" d={`M58 ${trendY(tick)}H576`} /><text className="mvn__tick-label" x="49" y={trendY(tick) + 4} textAnchor="end">{tick}</text></g>)}
            {[1, 4, 7, 10, 13, 16, 18].map(day => <text key={day} className="mvn__tick-label" x={trendX(day)} y="198" textAnchor="middle">{day}</text>)}
            {showIceCream && <><path className="mvn__daily-line is-sales" d={salesPath} />{iceCreamDrowningDays.map(([day, sales]) => <circle key={day} className="mvn__daily-dot is-sales" cx={trendX(day)} cy={trendY(sales)} r="4.3" />)}</>}
            {showDrowningRisk && <><path className="mvn__daily-line is-risk" d={drowningsPath} />{drowningsTrend.map(([day, drownings]) => <path key={day} className="mvn__daily-dot is-risk" d={`M${trendX(day)} ${trendY(drownings) - 4.4}l4.4 4.4-4.4 4.4-4.4-4.4z`} />)}</>}
            <text className="mvn__axis-label" x="318" y="224" textAnchor="middle">Day</text><text className="mvn__axis-label" transform="rotate(-90 13 104)" x="13" y="104" textAnchor="middle">Relative level (scaled 0–10)</text>
          </svg></figure>
          <p className="mvn__daily-explanation">The scatter plot pairs both measures for each day. This view separates the same observations by day, so you can see their timing; dashed lines connect days in order. Each series is scaled separately to 0–10, so the lines compare timing and shape, not absolute levels or counts.</p>
        </div>
        <figure className="mvn__causal-figure"><figcaption><strong>A plausible shared cause</strong><span>The arrows represent a possible explanation to investigate.</span></figcaption><svg viewBox="0 0 490 280" role="img" aria-label="Warm sunny weather can increase ice cream sales and swimming activity; more swimming can increase exposure to drowning risk. There is no direct arrow from ice cream sales to drowning. Ask whether other factors explain the observed association.">
          <defs><marker id={id} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0L6 3L0 6" /></marker></defs>
          <rect className="mvn__cause-node" x="156" y="16" width="178" height="58" rx="13"/><text x="245" y="41" textAnchor="middle">Warm, sunny</text><text x="245" y="59" textAnchor="middle">weather</text>
          <rect className="mvn__cause-node mvn__cause-node--teal" x="20" y="115" width="180" height="60" rx="13"/><text x="110" y="140" textAnchor="middle">Ice cream</text><text x="110" y="158" textAnchor="middle">sales</text>
          <rect className="mvn__cause-node mvn__cause-node--gold" x="290" y="115" width="180" height="60" rx="13"/><text x="380" y="140" textAnchor="middle">Swimming</text><text x="380" y="158" textAnchor="middle">activity</text>
          <rect className="mvn__cause-node mvn__cause-node--coral" x="290" y="215" width="180" height="54" rx="13"/><text x="380" y="239" textAnchor="middle">Drowning</text><text x="380" y="257" textAnchor="middle">risk</text>
          <path className="mvn__cause-arrow" markerEnd={`url(#${id})`} d="M195 75L132 111"/><path className="mvn__cause-arrow" markerEnd={`url(#${id})`} d="M294 75L359 111"/><path className="mvn__cause-arrow" markerEnd={`url(#${id})`} d="M380 176V210"/>
          <text className="mvn__cause-caption" x="245" y="204" textAnchor="middle">Observed association does not identify a direct cause</text>
        </svg></figure></div>
      <aside className="mvn__note"><strong>What the plot can and cannot say.</strong><span>The association is worth noticing. To claim a causal effect, we need evidence that addresses shared causes, alternative explanations, and how exposure and outcome were measured. Regression alone does not automatically prove causation either.</span></aside>
    </Section>
  </Page>
}

const thirdDimensionPoints = [
  { x: 1, y: 4.5, group: 'New customers' }, { x: 2, y: 3.9, group: 'New customers' }, { x: 3, y: 3.4, group: 'New customers' }, { x: 4, y: 2.8, group: 'New customers' }, { x: 5, y: 2.3, group: 'New customers' },
  { x: 1, y: 1.2, group: 'Returning customers' }, { x: 2, y: 1.7, group: 'Returning customers' }, { x: 3, y: 2.1, group: 'Returning customers' }, { x: 4, y: 2.8, group: 'Returning customers' }, { x: 5, y: 3.3, group: 'Returning customers' },
]

export function MVThirdDimension() {
  const [encoded, setEncoded] = useState(true)
  return <Page number="12" title="Use color to reveal a third variable" definition={<>A scatter plot puts two numerical variables on its axes. <strong>Color or symbols can encode a third variable</strong>, such as a category, so group-specific patterns become visible.</>} summary="A third variable can reveal that one overall cloud contains different group relationships. Human visual comparison works for a few groups; many variables and classes need systematic analysis.">
    <Section label="Why add another variable?" title="The combined cloud can hide group patterns">
      <p className="mvn__lead">Imagine a group label distinguishes new and returning customers. Before the label is shown, the full scatter may look almost flat. Coloring by group can reveal that X and Y move in opposite directions for new customers and together for returning customers.</p>
      <div className="mvn__third-controls"><p><strong>Change the display:</strong> the same points stay in place while color either identifies the group or treats every row alike.</p><div className="mvn__button-row"><button type="button" aria-pressed={encoded} className={encoded ? 'is-selected' : ''} onClick={() => setEncoded(true)}>Color by group</button><button type="button" aria-pressed={!encoded} className={!encoded ? 'is-selected' : ''} onClick={() => setEncoded(false)}>One color</button></div></div>
      <figure className="mvn__third-figure"><figcaption><strong>{encoded ? 'Group-specific patterns appear' : 'Combined view looks nearly flat'}</strong><span>Two illustrative customer groups; same X and Y observations in both views.</span></figcaption><svg viewBox="0 0 620 315" role="img" aria-label={encoded ? 'New and returning customers overlap in the combined view. New customers show a negative pattern as X increases; returning customers show a positive pattern.' : 'All ten customer observations share one color, obscuring their opposite within-group trends.'}>
        <path className="mvn__axis" d="M60 28V258H585"/>{[0,1,2,3,4].map(t=><path className="mvn__grid" key={t} d={`M60 ${52+t*45}H585`}/>)}
        {thirdDimensionPoints.map((point,index)=><circle key={index} className={encoded ? `mvn__group-point ${point.group==='New customers'?'is-purple':'is-yellow'}` : 'mvn__point'} cx={82+(point.x-1)*118} cy={238-(point.y-1)*43} r="8"/>)}
        <text className="mvn__axis-label" x="580" y="286" textAnchor="end">X · numerical variable</text><text className="mvn__axis-label" x="19" y="24">Y</text>
      </svg><div className="mvn__legend"><span><i className="is-purple"/> New customers · negative pattern</span><span><i className="is-yellow"/> Returning customers · positive pattern</span></div></figure>
      <aside className="mvn__note"><strong>Condition on a group.</strong><span>Read each color separately to see how the relationship changes within a class. With dozens of groups or dimensions, visual inspection becomes unwieldy; profiling is a starting point for more systematic modeling.</span></aside>
    </Section>
  </Page>
}

type CaseMetric = 'traffic' | 'offline' | 'sales' | 'load'
const CASE_METRICS: Record<CaseMetric, { label: string; column: 2|3|4|5; description: string }> = {
  traffic: { label: 'Site traffic', column: 2, description: 'more traffic tended to occur in weeks with higher digital spend' },
  offline: { label: 'Offline media spend', column: 3, description: 'offline spend tended to be lower in weeks with higher digital spend' },
  sales: { label: 'Sales', column: 4, description: 'sales tended to rise with digital spend, with a curve that appears to flatten at the high end' },
  load: { label: 'Site load time', column: 5, description: 'showed almost no linear relationship with digital spend' },
}

function CorrelationScatter({ metric }: { metric: CaseMetric }) {
  const config = CASE_METRICS[metric]
  const xValues = correlationWorkbookRows.map(row => row[1]); const yValues = correlationWorkbookRows.map(row => row[config.column])
  const xMin = Math.min(...xValues); const xMax = Math.max(...xValues); const yMin = Math.min(...yValues); const yMax = Math.max(...yValues)
  const px = (x: number) => 68 + (x - xMin) / (xMax - xMin) * 480
  const py = (y: number) => 250 - (y - yMin) / (yMax - yMin) * 198
  const r = pearsonCorrelation(xValues, yValues)
  return <figure className="mvn__case-chart"><figcaption><strong>Each dot is one recorded week · {config.label}</strong><span>All 1,000 workbook rows are plotted. Values use the workbook’s numeric scale.</span></figcaption><svg viewBox="0 0 620 310" role="img" aria-label={`Scatter plot of all 1,000 weekly records: Digital media spend against ${config.label}; Pearson correlation ${r?.toFixed(3)}.`}>
    <path className="mvn__axis" d="M68 32V250H562"/>{[0,1,2,3].map(t=><path className="mvn__grid" key={t} d={`M68 ${52+t*61}H562`}/>)}
    {correlationWorkbookRows.map(row=><circle key={row[0]} className="mvn__case-point" cx={px(row[1])} cy={py(row[config.column])} r="2.3"/>)}
    <text className="mvn__axis-label" x="560" y="279" textAnchor="end">Digital media spend</text><text className="mvn__axis-label" x="15" y="25">{config.label}</text>
    <text className="mvn__tick-label" x="68" y="267">{Math.round(xMin).toLocaleString()}</text><text className="mvn__tick-label" x="562" y="267" textAnchor="end">{Math.round(xMax).toLocaleString()}</text><text className="mvn__tick-label" x="64" y="246" textAnchor="end">{Math.round(yMin).toLocaleString()}</text><text className="mvn__tick-label" x="64" y="57" textAnchor="end">{Math.round(yMax).toLocaleString()}</text>
  </svg></figure>
}

const caseSteps = [
  { title: 'Gather and check', task: 'Collect weekly digital spend, site traffic, offline spend, sales and site load time. Check that rows match the same week and that fields have the expected numeric meaning.', tools: 'Source review, type and missing-value checks', output: 'A paired weekly dataset with traceable definitions and consistent time periods.' },
  { title: 'Plot pairs', task: 'Place digital spend on X and compare it with one outcome at a time. Inspect direction, shape, clusters and unusual weeks.', tools: 'Scatter plot; color or symbols when a meaningful group is available', output: 'A visual description of what changes together and whether a line seems plausible.' },
  { title: 'Summarize carefully', task: 'Use Pearson correlation to compare linear direction and strength for each pair. Return to the scatter plot for any weak, curved or clustered pattern.', tools: 'Pearson r for numerical pairs; grouped comparisons when a category can explain variation', output: 'A compact association summary with the shape and limits stated beside it.' },
  { title: 'Interpret and investigate', task: 'Ask whether the pattern is plausible, what else may drive it, and what additional evidence would support a causal claim.', tools: 'Subject-matter context, additional variables, and an appropriate experimental or causal design', output: 'A supported next question, not a causal claim from correlation alone.' },
]

export function MVCorrelationCase() {
  const [metric, setMetric] = useState<CaseMetric>('traffic'); const [step, setStep] = useState(1)
  const config = CASE_METRICS[metric]
  const r = pearsonCorrelation(correlationWorkbookRows.map(row => row[1]), correlationWorkbookRows.map(row => row[config.column]))
  return <Page number="13" title="Explore the weekly marketing relationships" definition={<>At Loud &amp; Clear, your client wants to understand how <strong>weekly digital media spend relates to traffic, offline spend, sales, and site load time.</strong> Compare each measure against digital spend and describe the patterns before making a claim.</>} summary="The workbook suggests strong positive linear association with site traffic, strong negative association with offline spend, strong positive association with sales that visibly bends, and almost no linear association with load time. These are associations in the recorded weeks, not causal effects.">
    <Section label="Marketing analyst assignment" title="Compare digital spend with one measure at a time">
      <p className="mvn__lead">The case workbook contains 1,000 weekly observations. Select the Y variable to keep Digital_Media_Spend on the horizontal axis and inspect another relationship. The chart and Pearson r use all rows, not just a sample.</p>
      <div className="mvn__button-row mvn__case-controls" role="group" aria-label="Choose the variable compared with digital media spend">{(Object.keys(CASE_METRICS) as CaseMetric[]).map(key=><button type="button" key={key} aria-pressed={metric===key} className={metric===key?'is-selected':''} onClick={()=>setMetric(key)}>{CASE_METRICS[key].label}</button>)}</div>
      <div className="mvn__case-result"><div><span>Pearson r · all 1,000 weeks</span><strong>{r?.toFixed(3)}</strong></div><p>In this workbook, {config.description}. Correlation describes a linear summary, so compare it with the displayed scatter before interpreting it.</p></div>
      <CorrelationScatter metric={metric}/>
      <div className="mvn__steps"><div className="mvn__step-nav" aria-label="Project workflow steps">{caseSteps.map((item,index)=><button type="button" key={item.title} aria-pressed={step===index} className={step===index?'is-selected':''} onClick={()=>setStep(index)}><span>Step {index+1}</span><strong>{item.title}</strong></button>)}</div><article className="mvn__step-detail" aria-live="polite"><p className="mvn__eyebrow">Project workflow · step {step+1}</p><h3>{caseSteps[step].title}</h3><p><strong>Task</strong> {caseSteps[step].task}</p><p><strong>Useful tools</strong> {caseSteps[step].tools}</p><p><strong>Expected output</strong> {caseSteps[step].output}</p></article></div>
      <aside className="mvn__note"><strong>Interpret with care.</strong><span>The workbook does not specify measurement units. These patterns are associations in the recorded weeks; they do not establish that spend caused the outcomes.</span></aside>
    </Section>
  </Page>
}

export function MVBestPractices() {
  const [workflowStep, setWorkflowStep] = useState(0)
  const checklist = [
    ['1 · Check variable types', 'Identify categorical and numerical fields first. Pair techniques to the variable combination: tables and heat maps for categories; scatter plots and correlation for two numerical variables; distributions by group for category-plus-numerical comparisons.'],
    ['2 · Inspect data quality', 'Verify the records line up, missingness is understood and measurements are comparable. A plot can expose a problem, but it cannot repair a definition or a bad join.'],
    ['3 · Plot before summarizing', 'Read direction, shape, clustering and outliers. Pearson r is for linear association; it can miss a curve and can be sensitive to unusual points.'],
    ['4 · Compare useful groups', 'Filter or color by a meaningful category to check whether a relationship changes across classes. Keep the group labels visible and avoid splitting into so many classes that the comparison becomes noisy.'],
    ['5 · Separate association from cause', 'A relationship can help describe or predict what tends to occur together. It does not by itself tell what would happen after an intervention. Ask what other variable could explain the pattern and what evidence is needed next.'],
    ['6 · Choose the next tool', 'Use profiling to understand the observed data and decide what to investigate. If there are many interacting dimensions or a predictive objective, machine learning can extend this work after scope, QA and profiling are clear.'],
  ] as const
  return <Page number="14" title="A practical multivariate profiling checklist" definition={<>Multivariate profiling explores <strong>how two or more variables relate</strong>. Start by understanding the fields, then choose a view that fits their types and the question.</>} summary="Match the tool to the variable types, read plots and statistics together, compare meaningful groups, and treat association as a prompt for investigation rather than proof of cause.">
    <Section label="A working reference" title="Move from data to a defensible next step">
      <p className="mvn__lead">A useful analysis does not start with a favorite chart. It starts with the question, the records, and what each field means.</p>
      <div className="mvn__workflow-intro"><strong>Project workflow</strong><span>All four steps stay visible. Select a step to see its task, tools and expected output.</span></div>
      <div className="mvn__steps mvn__best-practice-steps"><nav className="mvn__step-nav" aria-label="Multivariate project workflow">{caseSteps.map((item,index)=><div className="mvn__step-node" key={item.title}><button type="button" aria-pressed={workflowStep===index} className={workflowStep===index?'is-selected':''} onClick={()=>setWorkflowStep(index)}><span>Step {index+1}</span><strong>{item.title}</strong></button>{index<caseSteps.length-1&&<span className="mvn__step-arrow" aria-hidden="true">→</span>}</div>)}</nav><article className="mvn__step-detail" aria-live="polite"><p className="mvn__eyebrow">Workflow · step {workflowStep+1}</p><h3>{caseSteps[workflowStep].title}</h3><p><strong>Task</strong> {caseSteps[workflowStep].task}</p><p><strong>Useful tools</strong> {caseSteps[workflowStep].tools}</p><p><strong>Expected output</strong> {caseSteps[workflowStep].output}</p></article></div>
      <ol className="mvn__checklist">{checklist.map(([title, text])=><li key={title}><strong>{title}</strong><span>{text}</span></li>)}</ol>
      <div className="mvn__tool-map"><div><strong>Two categorical fields</strong><span>Frequency / proportion table · heat map</span></div><div><strong>Category + numerical field</strong><span>Compare distributions · KDE / violin / box plot</span></div><div><strong>Two numerical fields</strong><span>Scatter plot · Pearson correlation for linear association</span></div><div><strong>Many variables or prediction goal</strong><span>Consider a suitable machine-learning approach after QA and profiling</span></div></div>
      <aside className="mvn__note"><strong>Keep the sequence visible.</strong><span>Project scope and data QA come before modeling. The course describes data preparation as a rough 80% of the effort; that is the course’s estimate, not a universal percentage. Quality inputs are necessary, but do not guarantee that a model is useful.</span></aside>
    </Section>
  </Page>
}

export function MVLookingAhead() {
  return <Page number="15" title="From relationships to classification" definition={<>You have finished Part 1: data QA, univariate profiling, and multivariate profiling. <strong>Part 2 builds on that foundation with supervised machine learning.</strong></>} summary="Part 1 built the habit of asking what the rows and fields mean, checking the data, and inspecting distributions and relationships. Part 2 turns to supervised classification and model evaluation.">
    <Section label="The next part of the series" title="Classification learns from labeled examples">
      <p className="mvn__lead">Classification predicts a category, such as whether a customer churns or which class a record belongs to. In Part 2, the course introduces how labeled examples support those predictions and how model results are assessed.</p>
      <div className="mvn__bridge"><div><span>Part 1 · completed foundation</span><strong>QA + profiling</strong><p>Understand the records, fields, distributions and relationships.</p></div><span className="mvn__bridge-arrow" aria-hidden="true">→</span><div><span>Part 2 · coming next</span><strong>Supervised classification</strong><p>Learn from labeled examples to predict a category.</p></div></div>
      <p className="mvn__small">The series now moves from describing the data to learning how labeled examples can support category predictions.</p>
    </Section>
  </Page>
}
