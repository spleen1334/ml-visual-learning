import { useId, useState } from 'react'
import { mean, median, modes, percentileInc, percentileRank, skewness, standardDeviation, variance } from './univariateMath'
import './UnivariateMetrics.css'

type LessonProps = { number: string; title: string; definition: React.ReactNode; children: React.ReactNode; summary: readonly string[] }

function Lesson({ number, title, definition, children, summary }: LessonProps) {
  const titleId = useId()
  return <article className="uvm" aria-labelledby={titleId}>
    <header className="uvm__intro"><p className="uvm__eyebrow">Chapter 5.{number} · Univariate profiling</p><h1 id={titleId}>{title}</h1><p className="uvm__definition">{definition}</p></header>
    {children}
    <section className="uvm__summary" aria-label="Lesson summary"><p className="uvm__eyebrow">Keep in mind</p><ul>{summary.map((item, index) => { const firstSentence = item.match(/^(.+?[.:;])\s+(.+)$/) ?? item.match(/^((?:\S+\s+){4}\S+)\s+(.+)$/); return <li key={index}>{firstSentence ? <><strong>{firstSentence[1]}</strong><span>{firstSentence[2]}</span></> : <strong>{item}</strong>}</li> })}</ul></section>
  </article>
}

function Panel({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  const id = useId()
  return <section className="uvm__panel" aria-labelledby={id}><div className="uvm__panel-heading"><p className="uvm__eyebrow">{eyebrow}</p><h2 id={id}>{title}</h2></div>{children}</section>
}

function Values({ values, highlight }: { values: readonly number[]; highlight?: number | readonly number[] }) {
  return <ol className="uvm__values" aria-label={`Values: ${values.join(', ')}`}>{values.map((value, index) => <li className={(typeof highlight === 'number' ? index === highlight : highlight?.includes(index)) ? 'is-highlighted' : ''} key={`${index}-${value}`}><span>{value}</span></li>)}</ol>
}

function RangeControl({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (value: number) => void }) {
  return <label className="uvm__range"><span>{label} <output>{value}</output></span><input type="range" min={min} max={max} value={value} onChange={event => onChange(Number(event.target.value))} /></label>
}

function DefinitionNote({ title, children }: { title: string; children: React.ReactNode }) {
  return <aside className="uvm__note"><strong>{title}</strong><span>{children}</span></aside>
}

export function UVProfiling() {
  return <Lesson number="11" title="Turn a variable into a useful summary" definition={<>Univariate profiling uses <strong>statistics to describe one variable at a time.</strong> A few well-chosen measures help us communicate its center and spread alongside a graph.</>} summary={[
    'Use a metric and a distribution together: each reveals a different part of the data.',
    'A simple center is a baseline guess when only this variable is available; it is not a complete predictive model.',
    'Check data quality before trusting a summary, then compare the variable with other fields when a pattern needs explaining.',
  ]}>
    <Panel eyebrow="A small example" title="One set of values, several useful questions">
      <div className="uvm__split">
        <div><p className="uvm__body">For five delivery times (in minutes), <strong>11, 12, 12, 13, 17</strong>, the center and spread tell different stories.</p><Values values={[11, 12, 12, 13, 17]} /><div className="uvm__metric-row"><div><span>Most frequent</span><strong>12 min</strong></div><div><span>Mean</span><strong>13 min</strong></div><div><span>Median</span><strong>12 min</strong></div></div></div>
        <figure className="uvm__figure"><figcaption><strong>Ask more than one question</strong><span>Where is the center? How spread out are values? Is a long tail pulling the average?</span></figcaption><svg viewBox="0 0 440 170" role="img" aria-label="Five delivery times shown on a number line; two observations stack at twelve minutes and one is higher at seventeen minutes."><path className="uvm__axis" d="M35 125H410" />{[10, 12, 14, 16, 18].map((tick, i) => <g key={tick}><path className="uvm__tick" d={`M${55 + i * 83} 120v10`} /><text x={55 + i * 83} y="150" textAnchor="middle">{tick}</text></g>)}{[11, 12, 13, 17].map((value) => <g key={value}><circle className={`uvm__dot ${value === 17 ? 'uvm__dot--accent' : ''}`} cx={55 + (value - 10) * 41.5} cy="88" r="8" />{value === 12 && <circle className="uvm__dot" cx={55 + (value - 10) * 41.5} cy="68" r="8" />}<text className="uvm__point-label" x={55 + (value - 10) * 41.5} y="110" textAnchor="middle">{value}{value === 12 ? ' ×2' : ''}</text></g>)}</svg></figure>
      </div>
      <DefinitionNote title="The point">Mode, mean and median summarize the center in different ways; variance and standard deviation describe spread; skewness describes asymmetry.</DefinitionNote>
    </Panel>
  </Lesson>
}

export function UVMode() {
  const [extra, setExtra] = useState<'none' | 'A' | 'B'>('none')
  const values = ['A', 'A', 'B', 'B', 'C', ...(extra === 'none' ? [] : [extra])]
  const currentModes = modes(values)
  const counts = ['A', 'B', 'C'].map(label => ({ label, count: values.filter(value => value === label).length }))
  return <Lesson number="12" title="The mode is the most frequent value" definition={<>A mode is the <strong>value or values observed most often.</strong> It works for categories as well as numbers, and a dataset can have more than one mode.</>} summary={[
    'A tie is real: report every value sharing the highest frequency.',
    'For a continuous numerical distribution, a mode may describe a peak or range rather than a repeated exact decimal.',
    'Several peaks can hint that different groups are mixed together; check other variables to investigate.',
  ]}>
    <Panel eyebrow="Watch the count change" title="An exact tie can become a single mode with one observation">
      <div className="uvm__split">
        <div><p className="uvm__body">These are five customers’ preferred sections. Add one response to see whether the most common category changes.</p><div className="uvm__chip-row" aria-label="Customer sections">{values.map((value, index) => <span className={`uvm__chip ${currentModes.includes(value) ? 'is-mode' : ''}`} key={`${value}-${index}`}>{value}</span>)}</div><div className="uvm__button-row"><button type="button" aria-pressed={extra === 'none'} className={extra === 'none' ? 'is-selected' : ''} onClick={() => setExtra('none')}>Keep the tie</button><button type="button" aria-pressed={extra === 'A'} className={extra === 'A' ? 'is-selected' : ''} onClick={() => setExtra('A')}>Add one A</button><button type="button" aria-pressed={extra === 'B'} className={extra === 'B' ? 'is-selected' : ''} onClick={() => setExtra('B')}>Add one B</button></div><p className="uvm__live-answer" aria-live="polite">{currentModes.length > 1 ? <>Two modes: <strong>{currentModes.join(' and ')}</strong>, each observed {Math.max(...counts.map(item => item.count))} times.</> : <>Mode: <strong>{currentModes[0]}</strong>, observed {Math.max(...counts.map(item => item.count))} times.</>}</p></div>
        <div className="uvm__bars" aria-label="Frequency by section">{counts.map(({ label, count }) => <div className="uvm__bar-row" key={label}><span>{label}</span><div className="uvm__bar-track"><span className={currentModes.includes(label) ? 'is-mode' : ''} style={{ width: `${(count / values.length) * 100}%` }} /></div><strong>{count}</strong></div>)}</div>
      </div>
      <DefinitionNote title="Why profile the mode?">It identifies the common category or a peak in the data. It can be a useful one-variable baseline, but it does not explain why a value is common.</DefinitionNote>
    </Panel>
  </Lesson>
}

export function UVMean() {
  const [last, setLast] = useState(15)
  const values = [10, 12, 13, 14, 16, 18, last]
  const average = mean(values)
  const center = median(values)
  return <Lesson number="13" title="The mean balances every value" definition={<>The arithmetic mean is the <strong>sum of the values divided by the number of observations.</strong> It uses every number, so an extreme value can pull it toward the tail.</>} summary={[
    'At the starting values, (10 + 12 + 13 + 14 + 16 + 18 + 15) ÷ 7 = 14. The mean has the same units as the observations.',
    'Move the last delivery time upward: every value contributes, so the mean shifts toward it.',
    'Use the mean for a numerical variable when the scale is meaningful; investigate outliers and missing values first.',
  ]}>
    <Panel eyebrow="Move one observation" title="The mean responds to an outlier">
      <div className="uvm__split"><div><p className="uvm__body">Six delivery times stay fixed. Move the seventh from 15 to a much longer delivery; the calculation updates immediately.</p><RangeControl label="Seventh delivery time, minutes" value={last} min={15} max={80} onChange={setLast} /><Values values={values} highlight={6} /><div className="uvm__equation"><span>Mean = sum ÷ count</span><strong>({values.join(' + ')}) ÷ {values.length} = {average.toFixed(1)} min</strong></div></div><figure className="uvm__figure"><figcaption><strong>Two centers, same observations</strong><span>The median remains {center} min for this example; the mean moves toward the long delivery.</span></figcaption><div className="uvm__center-compare"><div><span>Median</span><strong>{center}</strong><small>middle after sorting</small></div><div className={last > 30 ? 'is-changed' : ''}><span>Mean</span><strong>{average.toFixed(1)}</strong><small>uses every value</small></div></div><svg viewBox="0 0 440 150" role="img" aria-label={`Seven delivery times plotted by observation number, with values in minutes. The last value is ${last} minutes.`}><path className="uvm__axis" d="M45 119H410M45 29V119" /><path className="uvm__gridline" d="M45 74H405M45 29H405" /><text className="uvm__axis-label" x="39" y="122" textAnchor="end">0</text><text className="uvm__axis-label" x="39" y="77" textAnchor="end">40</text><text className="uvm__axis-label" x="39" y="32" textAnchor="end">80</text>{values.map((value, index) => { const y = 119 - (value / 80) * 90; const x = 62 + index * 52; return <g key={index}><path className={`uvm__lollipop ${index === 6 ? 'is-accent' : ''}`} d={`M${x} 118V${y}`} /><circle className={`uvm__dot ${index === 6 ? 'uvm__dot--accent' : ''}`} cx={x} cy={y} r="7"/><text className="uvm__point-label" x={x} y={y - 10} textAnchor="middle">{value}</text><text className="uvm__axis-label" x={x} y="140" textAnchor="middle">{index + 1}</text></g>})}<text className="uvm__axis-label" x="220" y="150" textAnchor="middle">observation</text><text className="uvm__tail-label" x="405" y="18" textAnchor="end">minutes</text></svg></figure></div>
      <DefinitionNote title="Best use">The mean is a simple numerical baseline when only one value is available. It is sensitive to outliers, so pair it with the median and a view of the distribution.</DefinitionNote>
    </Panel>
  </Lesson>
}

export function UVMedian() {
  const [last, setLast] = useState(18)
  const values = [5, 7, 9, 12, 15, last]
  const ordered = [...values].sort((a, b) => a - b)
  const centerPair = ordered.slice(2, 4)
  const center = median(values)
  return <Lesson number="14" title="The median is the middle rank" definition={<>Sort the observations and find the middle. With an even number of observations, the numeric median is the <strong>mean of the two middle values.</strong></>} summary={[
    'With six values, the middle pair is averaged: (9 + 12) ÷ 2 = 10.5.',
    'Move the largest observation from 18 to 80: the middle pair stays 9 and 12, so the median does not move.',
    'Median uses order, so it can summarize ordinal data. Averaging two ordinal labels is not meaningful unless their scale supports it.',
  ]}>
    <Panel eyebrow="Sort, then find the middle" title="Changing an extreme rank need not change the center">
      <div className="uvm__split"><div><p className="uvm__body">These six queue lengths are ranked from shortest to longest below. The highlighted pair determines the median.</p><RangeControl label="Longest queue, people" value={last} min={18} max={80} onChange={setLast} /><Values values={ordered} highlight={[2, 3]} /><div className="uvm__equation"><span>Even count · average the two middle values</span><strong>({centerPair[0]} + {centerPair[1]}) ÷ 2 = {center}</strong></div></div><figure className="uvm__figure"><figcaption><strong>Rank matters; distance to the extreme does not</strong><span>The last value changes, while the two center ranks remain in place.</span></figcaption><svg viewBox="0 0 440 175" role="img" aria-label="Six sorted values with the third and fourth values highlighted as the middle pair."><path className="uvm__axis" d="M35 125H405" />{ordered.map((value, index) => { const x = 55 + index * 66; return <g key={index}><circle className={`uvm__dot ${index === 2 || index === 3 ? 'uvm__dot--center' : ''} ${index === 5 ? 'uvm__dot--accent' : ''}`} cx={x} cy="92" r="17"/><text className="uvm__point-label" x={x} y="97" textAnchor="middle">{value}</text><text className="uvm__axis-label" x={x} y="154" textAnchor="middle">rank {index + 1}</text></g>})}</svg></figure></div>
      <DefinitionNote title="Median is robust to extremes">Because it depends on rank rather than distance, a large outlier can change the mean much more than the median.</DefinitionNote>
    </Panel>
  </Lesson>
}

export function UVPercentile() {
  const [percent, setPercent] = useState(25)
  const scores = [60, 70, 70, 90, 100]
  const value = percentileInc(scores, percent / 100)
  const position = (scores.length - 1) * percent / 100
  const rankAt70 = percentileRank(scores, 70)
  const rankAt70Inclusive = percentileRank(scores, 70, true)
  return <Lesson number="15" title="A percentile gives a value at a chosen position" definition={<>The <strong>p-th percentile</strong> is a value associated with a chosen point in an ordered distribution. It helps compare a value with the spread of the sample.</>} summary={[
    'This page uses Excel PERCENTILE.INC: position = (n − 1) × p, with linear interpolation between neighboring ranks.',
    'A percentile (a value) differs from a percentile rank (a share of observations below a chosen value).',
    'Ties mean different rank conventions can give different answers; state the convention when ranking values.',
  ]}>
    <Panel eyebrow="Excel PERCENTILE.INC" title="Move the requested percentile and follow its position">
      <div className="uvm__split"><div><p className="uvm__body">For these five test scores, choose a percentile. The inclusive Excel method places the requested point between ranks when needed.</p><RangeControl label="Requested percentile" value={percent} min={0} max={100} onChange={setPercent} /><Values values={[...scores].sort((a, b) => a - b)} /><div className="uvm__equation"><span>Position = (n − 1) × p</span><strong>(5 − 1) × {percent}% = rank position {position.toFixed(2)}</strong><strong>PERCENTILE.INC = {value.toFixed(1)} points</strong></div><div className="uvm__rank-note"><strong>At score 70:</strong><span>{Math.round(rankAt70 * 100)}% are below it; {Math.round(rankAt70Inclusive * 100)}% are at or below it. The two 70s create this gap.</span></div></div><figure className="uvm__figure"><figcaption><strong>A percentile returns a score</strong><span>Here the selected percentile falls at or between adjacent sorted scores.</span></figcaption><div className="uvm__percentile-track" aria-label={`${percent}th percentile is ${value.toFixed(1)} points`}><div className="uvm__percentile-scale">{scores.map((score, index) => <span key={`${score}-${index}`} style={{ left: `${(index / (scores.length - 1)) * 100}%` }}><i className={position >= index && position < index + 1 || percent === 100 && index === scores.length - 1 ? 'is-active' : ''} /><b>{score}</b><small>rank {index + 1}</small></span>)}</div><div className="uvm__percentile-marker" style={{ left: `${percent}%` }}><strong>{value.toFixed(1)}</strong><span>{percent}th</span></div></div><div className="uvm__legend"><span><i className="uvm__legend-dot" />Sorted observation</span><span><i className="uvm__legend-diamond" />Interpolated percentile</span></div></figure></div>
      <DefinitionNote title="Keep the terms separate"><strong>PERCENTILE.INC</strong> selects a value from a position. A percentile rank starts with a value and asks what proportion lies below (or at/below) it. Ties make the chosen rule matter.</DefinitionNote>
    </Panel>
  </Lesson>
}

type DeliveryService = 'reliable' | 'variable'
const DELIVERY_SERVICES: Record<DeliveryService, { name: string; values: readonly number[] }> = {
  reliable: { name: 'Reliable service A', values: [29, 30, 31] },
  variable: { name: 'Variable service B', values: [10, 30, 50] },
}

function DeliveryServiceControls({ service, setService }: { service: DeliveryService; setService: (service: DeliveryService) => void }) {
  return <div className="uvm__button-row" role="group" aria-label="Choose a delivery service to inspect">
    <button type="button" aria-pressed={service === 'reliable'} className={service === 'reliable' ? 'is-selected' : ''} onClick={() => setService('reliable')}>Reliable service A</button>
    <button type="button" aria-pressed={service === 'variable'} className={service === 'variable' ? 'is-selected' : ''} onClick={() => setService('variable')}>Variable service B</button>
  </div>
}

function DeliveryInterpretation({ service, metric }: { service: DeliveryService; metric: 'variance' | 'sd' }) {
  return <aside className={`uvm__delivery-insight ${service === 'variable' ? 'is-variable' : ''}`} aria-live="polite">
    <strong>{service === 'variable' ? 'The same mean hides a much bigger spread.' : 'Service A: deliveries stay close to the average.'}</strong>
    <p>{service === 'variable' ? <>The mean is still <b>30 minutes</b>, but deliveries take <b>10, 30, and 50 minutes</b> instead of 29, 30, and 31. Looking only at the average makes the services seem alike.</> : <>Deliveries take <b>29, 30, and 31 minutes</b>: each is within one minute of the <b>30-minute mean</b>.</>}</p>
    <p>{metric === 'variance' ? <><b>Sample variance: {service === 'variable' ? '400 min² versus A’s 1 min²' : '1 min²'}.</b> {service === 'variable' ? 'That is 400 times the variance, revealing the inconsistency the mean misses. It does not mean deliveries take 400 minutes.' : 'Select service B to see how the spread changes even though the mean stays the same.'}</> : <><b>Sample standard deviation: {service === 'variable' ? '20 minutes versus A’s 1 minute' : '1 minute'}.</b> {service === 'variable' ? 'The spread is 20 times as large, expressed in delivery-time units.' : 'Select service B to compare a much less consistent service with the same average.'}</>}</p>
  </aside>
}

function DeliveryComparison({ selected }: { selected: DeliveryService }) {
  const x = (value: number) => 100 + value * 5
  const rows: readonly DeliveryService[] = ['reliable', 'variable']
  return <figure className="uvm__figure uvm__spread-figure">
    <figcaption><strong>Both services average 30 minutes</strong><span>Each dot is one delivery. The shared 0–60 minute axis makes the difference in consistency visible.</span></figcaption>
    <svg viewBox="0 0 440 225" role="img" aria-label="Reliable service A has delivery times 29, 30, and 31 minutes. Variable service B has delivery times 10, 30, and 50 minutes. Both average 30 minutes on the same zero to sixty minute axis. Each delivery has its own row so close values remain readable.">
      <path className="uvm__axis" d="M100 190H400" />
      {[0, 10, 20, 30, 40, 50, 60].map(tick => <g key={tick}><path className="uvm__tick" d={`M${x(tick)} 185v10`} /><text x={x(tick)} y="211" textAnchor="middle">{tick}</text></g>)}
      <path className="uvm__spread-center" d={`M${x(30)} 22V191`} />
      <text className="uvm__spread-label" x={x(30)} y="16" textAnchor="middle">shared mean · 30</text>
      {rows.map((key, rowIndex) => {
        const row = DELIVERY_SERVICES[key]
        const firstY = rowIndex === 0 ? 52 : 126
        return <g className={`uvm__delivery-service ${selected === key ? 'is-selected' : ''}`} key={key}>
          {row.values.map((value, index) => <g key={index}>
            {index === 0 && <text className="uvm__delivery-name" x="4" y={firstY + index * 21 + 4}>{key === 'reliable' ? 'A' : 'B'}</text>}
            <text className="uvm__delivery-label" x="28" y={firstY + index * 21 + 4}>Delivery {index + 1}</text>
            <path className="uvm__delivery-guide" d={`M100 ${firstY + index * 21}H400`} />
            <circle className={`uvm__dot ${index === 1 ? 'uvm__dot--center' : key === 'variable' ? 'uvm__dot--accent' : ''}`} cx={x(value)} cy={firstY + index * 21} r="7" />
            <text className="uvm__point-label" x={x(value)} y={firstY + index * 21 - 9} textAnchor="middle">{value}</text>
          </g>)}
        </g>
      })}
      <text className="uvm__axis-label" x="250" y="225" textAnchor="middle">delivery time (minutes)</text>
    </svg>
    <table className="uvm__table uvm__delivery-table"><caption>Recorded delivery times (minutes)</caption><thead><tr><th scope="col">Service</th><th scope="col">Delivery 1</th><th scope="col">Delivery 2</th><th scope="col">Delivery 3</th><th scope="col">Mean</th></tr></thead><tbody>{rows.map(key => <tr className={selected === key ? 'is-selected' : ''} key={key}><th scope="row">{DELIVERY_SERVICES[key].name}</th>{DELIVERY_SERVICES[key].values.map((value, index) => <td key={index}>{value}</td>)}<td>30</td></tr>)}</tbody></table>
  </figure>
}

function DeviationTable({ values }: { values: readonly number[] }) {
  const center = mean(values)
  return <table className="uvm__table"><caption>Each squared distance contributes to the numerator.</caption><thead><tr><th scope="col">Value x</th><th scope="col">x − mean ({center})</th><th scope="col">(x − mean)²</th></tr></thead><tbody>{values.map((value, index) => <tr key={`${index}-${value}`}><th scope="row">{value}</th><td>{value - center}</td><td>{(value - center) ** 2}</td></tr>)}</tbody><tfoot><tr><th scope="row" colSpan={2}>Sum of squared deviations</th><td>{values.reduce((sum, value) => sum + (value - center) ** 2, 0)}</td></tr></tfoot></table>
}

export function UVVariance() {
  const [service, setService] = useState<DeliveryService>('reliable')
  const values = DELIVERY_SERVICES[service].values
  const amount = variance(values, 'sample')
  const divisor = values.length - 1
  const squaredTotal = values.reduce((sum, value) => sum + (value - mean(values)) ** 2, 0)
  return <Lesson number="16" title="Variance measures squared distance from the mean" definition={<>Variance measures <strong>how spread out numerical values are around their mean</strong>, using their squared distances from that mean. A smaller variance means values cluster more closely together; a larger variance means they are more spread out.</>} summary={[
    'Both services average 30 minutes, but service B varies much more from delivery to delivery.',
    'Sample variance is 1 min² for service A and 400 min² for service B.',
    'Variance uses squared units. Standard deviation takes its square root to express spread in minutes.',
  ]}>
    <Panel eyebrow="Compare two delivery services" title="Same average, different consistency">
      <p className="uvm__body">A delivery manager compares three deliveries from each service. Select a service to inspect its variance calculation; the shared chart keeps both services in view.</p>
      <DeliveryServiceControls service={service} setService={setService} />
      <DeliveryInterpretation service={service} metric="variance" />
      <div className="uvm__delivery-layout"><DeliveryComparison selected={service} /><div className="uvm__delivery-calculation"><p className="uvm__eyebrow">{DELIVERY_SERVICES[service].name} · variance</p><p className="uvm__body">Its mean is 30 minutes. Subtract 30 from each delivery, then square each difference.</p><DeviationTable values={values} /><div className="uvm__equation"><span>Sample variance = squared differences ÷ (n − 1)</span><strong>{squaredTotal} min² ÷ {divisor} = {amount.toFixed(2)} min²</strong></div><p className="uvm__small">We use the sample formula because these three recorded deliveries are a sample of the service’s ongoing deliveries. The squared unit (minutes²) is a calculation measure, not a delivery time.</p></div></div>
      <DefinitionNote title="What to notice">Both averages are 30 minutes. The variable service’s sample variance is much larger, so its delivery times are less consistent. Standard deviation expresses that spread in minutes.</DefinitionNote>
    </Panel>
  </Lesson>
}

function EmpiricalRuleVisual() {
  const rows = [
    { range: 1, percent: 'about 68%', label: 'within 1 SD' },
    { range: 2, percent: 'about 95%', label: 'within 2 SD' },
    { range: 3, percent: 'about 99.7%', label: 'within 3 SD' },
  ]
  const curve = 'M8 48 C55 48 76 44 104 35 C129 27 142 8 180 7 C218 8 231 27 256 35 C284 44 305 48 352 48 Z'
  return <div className="uvm__empirical" aria-label="For normal data, approximately 68 percent is within one standard deviation, 95 percent within two, and 99.7 percent within three."><p className="uvm__eyebrow">Empirical rule · approximately normal data</p>{rows.map(({ range, percent, label }) => <div className="uvm__empirical-row" key={range}><svg viewBox="0 0 360 56" role="img" aria-label={`${percent} within ${range} standard deviation${range > 1 ? 's' : ''} of the mean.`}><rect className="uvm__empirical-band" x={180 - range * 47} y="5" width={range * 94} height="43" rx="4"/><path className="uvm__empirical-fill" d={curve}/><path className="uvm__empirical-curve" d={curve}/><path className="uvm__empirical-axis" d="M8 48H352M180 5V50"/><text x="180" y="56" textAnchor="middle">mean</text></svg><div><strong>{percent}</strong><span>{label}</span></div></div>)}</div>
}

export function UVStandardDeviation() {
  const [service, setService] = useState<DeliveryService>('reliable')
  const values = DELIVERY_SERVICES[service].values
  const spread = standardDeviation(values, 'sample')
  const squaredSpread = variance(values, 'sample')
  return <Lesson number="17" title="Standard deviation returns spread to the data’s scale" definition={<>Standard deviation is the <strong>square root of variance.</strong> It describes spread in the same units as the original values.</>} summary={[
    'For the sample, service A has a standard deviation of 1 minute; service B has 20 minutes.',
    'Variance is in squared units (minutes²); standard deviation returns to the original unit (minutes).',
    'The 68–95–99.7 empirical rule approximates ranges only for a normal distribution; these three points are not normal data.',
  ]}>
    <Panel eyebrow="Take the square root" title="Describe spread in minutes">
      <p className="uvm__body">For a customer, the average alone does not show whether deliveries arrive close to that time. Select a service to compare how far its times typically vary around 30 minutes.</p>
      <DeliveryServiceControls service={service} setService={setService} />
      <DeliveryInterpretation service={service} metric="sd" />
      <div className="uvm__delivery-layout"><DeliveryComparison selected={service} /><div className="uvm__delivery-calculation"><p className="uvm__eyebrow">{DELIVERY_SERVICES[service].name} · standard deviation</p><p className="uvm__body">Take the square root of its variance to return to minutes.</p><div className="uvm__unit-compare"><div><span>Variance</span><strong>{squaredSpread.toFixed(2)}</strong><small>minutes² · calculation measure</small></div><div className="uvm__root-arrow" aria-hidden="true">√ →</div><div><span>Standard deviation</span><strong>{spread.toFixed(2)}</strong><small>minutes · useful scale for spread</small></div></div><div className="uvm__equation"><span>Sample standard deviation = √variance</span><strong>√{squaredSpread.toFixed(2)} min² = {spread.toFixed(2)} min</strong></div><p className="uvm__small">We use the sample formula for these three deliveries. Standard deviation describes spread around the mean; it is not the average absolute distance.</p></div></div>
      <div className="uvm__normal-note"><strong>When the bell curve matters</strong><span>The empirical rule says about 68%, 95%, and 99.7% of normally distributed values lie within 1, 2, and 3 standard deviations of the mean. Our six delivery times illustrate spread between two services; they are not a normal distribution. See the <a href="#chapter-05/normal-distribution">normal distribution lesson</a> for the bell-shaped model.</span></div><EmpiricalRuleVisual />
      <DefinitionNote title="Would 45 minutes surprise you?"><strong>For A:</strong> 45 minutes is far beyond the observed 29–31 minute deliveries. <strong>For B:</strong> it sits inside the observed 10–50 minute range. Standard deviation puts that difference in context. A high value is a reason to investigate, not automatically an error; three deliveries alone cannot establish how likely it is.</DefinitionNote>
    </Panel>
  </Lesson>
}

type SkewDirection = 'left' | 'symmetric' | 'right'
const SKEW_DATA: Record<SkewDirection, readonly number[]> = {
  left: [-8, -1, 0, 1, 2, 3, 4, 4, 5, 5, 5, 6],
  symmetric: [-3, -2, -1, 0, 1, 2, 3],
  right: [-6, -5, -5, -5, -4, -3, -2, -1, 0, 1, 8],
}

function SkewCurve({ direction }: { direction: SkewDirection }) {
  const curve = direction === 'left'
    ? 'M18 112 C65 110 105 106 142 93 C180 79 217 55 243 31 C258 16 278 13 292 30 C314 56 320 89 340 103 C360 111 386 112 410 112'
    : direction === 'right'
      ? 'M30 112 C54 111 78 111 100 103 C120 94 126 61 148 36 C162 20 182 16 197 32 C223 56 260 79 298 93 C335 106 374 110 422 112'
      : 'M18 112 C65 111 86 105 118 91 C147 75 167 40 220 32 C273 40 293 75 322 91 C354 106 375 111 422 112'
  const tail = direction === 'left' ? 'M18 112 C65 110 105 106 142 93 C180 79 217 55 243 31' : direction === 'right' ? 'M197 32 C223 56 260 79 298 93 C335 106 374 110 422 112' : ''
  return <svg viewBox="0 0 440 150" role="img" aria-label={`${direction === 'symmetric' ? 'Approximately symmetric' : `${direction}-skewed`} schematic distribution. The highlighted tail shows the direction named by skewness.`}><path className="uvm__axis" d="M18 116H422" /><path className="uvm__curve" d={curve} />{direction !== 'symmetric' && <path className="uvm__tail" d={tail} />}<text className="uvm__axis-label" x="220" y="141" textAnchor="middle">schematic distribution</text><text className="uvm__tail-label" x={direction === 'left' ? 42 : direction === 'right' ? 395 : 220} y="34" textAnchor={direction === 'left' ? 'start' : direction === 'right' ? 'end' : 'middle'}>{direction === 'symmetric' ? 'similar tails' : `${direction} tail`}</text><text className="uvm__axis-label" x={direction === 'left' ? 277 : direction === 'right' ? 166 : 220} y="20" textAnchor="middle">peak</text></svg>
}

export function UVSkewness() {
  const [direction, setDirection] = useState<SkewDirection>('right')
  const skew = skewness(SKEW_DATA[direction])
  const label = direction === 'symmetric' ? 'approximately symmetric example' : `${direction}-skewed example`
  return <Lesson number="18" title="Skewness describes the direction of a longer tail" definition={<>Skewness describes <strong>asymmetry</strong> in a distribution. The direction names the longer tail: a long left tail gives negative skew; a long right tail gives positive skew.</>} summary={[
    'Choose a shape: the sign of the third standardized moment matches the tail direction in these examples.',
    'The mean can be pulled toward a long tail, while the mode and median often remain nearer the peak.',
    'Skewness alone does not test normality or explain the cause of an unusual shape.',
  ]}>
    <Panel eyebrow="Compare the tail" title="The tail names the skew direction">
      <div className="uvm__shape-tabs" role="group" aria-label="Choose an example distribution">{(['left', 'symmetric', 'right'] as const).map(option => <button type="button" aria-pressed={direction === option} className={direction === option ? 'is-selected' : ''} onClick={() => setDirection(option)} key={option}>{option === 'symmetric' ? 'Roughly symmetric' : `${option[0].toUpperCase()}${option.slice(1)} tail`}</button>)}</div>
      <div className="uvm__split uvm__split--skew"><figure className="uvm__figure"><figcaption><strong>{label}</strong><span>These curves illustrate shape; they are not fitted probability models.</span></figcaption><SkewCurve direction={direction} /><p className="uvm__tail-direction">{direction === 'symmetric' ? 'Similar tails on both sides' : `The ${direction} tail stretches farther from the center`}</p></figure><div className="uvm__skew-copy"><div className="uvm__metric-large"><span>Skewness of the illustrative values</span><strong>{skew.toFixed(2)}</strong><small>third standardized moment · population form</small></div><p className="uvm__body">The long tail can pull the mean toward it. For a right tail that pull is rightward; for a left tail it is leftward.</p><DefinitionNote title="Interpret with care">A near-zero skewness value describes approximate symmetry in this moment summary. Symmetry does not establish that the data follow a normal distribution.</DefinitionNote></div></div>
    </Panel>
  </Lesson>
}

