import { useId, useState } from 'react'
import type { ReactNode } from 'react'
import './UnivariateDistributions.css'
import heightData from './uvHeightData.json'

type Bin = { start: number; end: number; count: number }
type Measure = 'count' | 'density'

const AGE_VALUES = [8, 29, 45, 25, 33, 37, 19, 43, 21, 28, 32, 40, 24, 17, 28, 5, 22, 39, 15, 47, 12]
const SAMPLE_HEIGHTS = heightData as { referenceSample: number[]; athleteSample: number[]; source: { workbook: string; sheet: string; referenceSampleRange: string; athleteSampleRange: string; note: string } }

function average(values: readonly number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

export function histogram(values: readonly number[], width: number, min: number, max: number): Bin[] {
  const bins: Bin[] = []
  for (let start = min; start < max; start += width) bins.push({ start, end: Math.min(max, start + width), count: 0 })
  values.forEach(value => {
    const index = Math.min(bins.length - 1, Math.floor((value - min) / width))
    if (index >= 0 && value <= max) bins[index].count += 1
  })
  return bins
}

export function localBinWidth(value: number, width: number, min: number, max: number): number {
  const lastStart = min + (Math.ceil((max - min) / width) - 1) * width
  return value >= lastStart ? max - lastStart : width
}

export function gaussianDensity(values: readonly number[], x: number, bandwidth: number): number {
  const scale = 1 / (values.length * bandwidth * Math.sqrt(2 * Math.PI))
  return values.reduce((sum, value) => sum + Math.exp(-0.5 * ((x - value) / bandwidth) ** 2) * scale, 0)
}

function rangeValues(start: number, end: number, steps: number): number[] {
  return Array.from({ length: steps + 1 }, (_, index) => start + (end - start) * index / steps)
}

function Intro({ lesson, title, definition, intro, children }: { lesson: string; title: string; definition: string; intro: ReactNode; children: ReactNode }) {
  return <article className="uv-lesson">
    <header className="uv-lesson__intro"><p className="uv-lesson__eyebrow">Chapter 05 · {lesson}</p><h1>{title}</h1><p>{intro}</p></header>
    <section className="uv-lesson__definition"><p className="uv-lesson__eyebrow">The central idea</p><h2>{definition}</h2></section>
    {children}
  </article>
}

function AxisChart({ title, description, children, yLabel, xLabel, yTicks, xTicks, x, y, bottom = 274 }: {
  title: string; description: string; children?: ReactNode; yLabel: string; xLabel: string
  yTicks: number[]; xTicks: { value: number; label: string }[]; x: (v: number) => number; y: (v: number) => number; bottom?: number
}) {
  const titleId = useId()
  const descriptionId = useId()
  return <svg className="uv-chart" viewBox="0 0 760 350" role="img" aria-labelledby={`${titleId} ${descriptionId}`}>
    <title id={titleId}>{title}</title><desc id={descriptionId}>{description}</desc>
    {yTicks.map(tick => <g key={tick}><path className="uv-chart__grid" d={`M70 ${y(tick)} H732`} /><text className="uv-chart__tick" x="60" y={y(tick) + 4} textAnchor="end">{Number.isInteger(tick) ? tick : tick.toFixed(2)}</text></g>)}
    <path className="uv-chart__axis" d={`M70 24 V${bottom} H732`} />
    {xTicks.map(tick => <g key={tick.value}><path className="uv-chart__tick-mark" d={`M${x(tick.value)} ${bottom} v5`} /><text className="uv-chart__tick" x={x(tick.value)} y={bottom + 20} textAnchor="middle">{tick.label}</text></g>)}
    <text className="uv-chart__axis-label" transform="translate(17 150) rotate(-90)" textAnchor="middle">{yLabel}</text>
    <text className="uv-chart__axis-label" x="401" y="334" textAnchor="middle">{xLabel}</text>
    {children}
  </svg>
}

function HistogramLessonChart({ width, bandwidth, measure }: { width: number; bandwidth: number; measure: Measure }) {
  const min = 0
  const max = 50
  const bins = histogram(AGE_VALUES, width, min, max)
  const heights = bins.map(bin => {
    const actualWidth = bin.end - bin.start
    return measure === 'count' ? bin.count : bin.count / (AGE_VALUES.length * actualWidth)
  })
  const maxObserved = Math.max(...heights, ...rangeValues(min, max, 100).map(v => {
    const d = gaussianDensity(AGE_VALUES, v, bandwidth)
    const localWidth = localBinWidth(v, width, min, max)
    return measure === 'count' ? d * AGE_VALUES.length * localWidth : d
  }))
  const yMax = measure === 'count' ? Math.max(4, Math.ceil(maxObserved / 2) * 2) : Math.max(.08, Math.ceil(maxObserved * 100) / 100)
  const x = (value: number) => 70 + value / 50 * 662
  const y = (value: number) => 274 - value / yMax * 226
  const linePoints = rangeValues(min, max, 140).map(value => {
    const density = gaussianDensity(AGE_VALUES, value, bandwidth)
    const localWidth = localBinWidth(value, width, min, max)
    const plotted = measure === 'count' ? density * AGE_VALUES.length * localWidth : density
    return `${x(value)},${y(plotted)}`
  }).join(' ')
  const ticks = measure === 'count' ? [0, yMax / 2, yMax] : [0, yMax / 2, yMax]
  return <AxisChart title="Age histogram with a kernel density estimate" description={`Twenty-one ages from the course example are grouped into ${width}-year bins. Bars show ${measure === 'count' ? 'counts' : 'probability density'} and the smooth curve is a Gaussian kernel density estimate using ${bandwidth} years of bandwidth.`} yLabel={measure === 'count' ? 'Observations per bin' : 'Density (per year)'} xLabel="Age (years)" yTicks={ticks} xTicks={[0, 10, 20, 30, 40, 50].map(value => ({ value, label: String(value) }))} x={x} y={y}>
    {bins.map(bin => {
      const actualWidth = bin.end - bin.start
      const value = measure === 'count' ? bin.count : bin.count / (AGE_VALUES.length * actualWidth)
      const left = x(bin.start) + 1
      const barWidth = Math.max(1, x(bin.end) - x(bin.start) - 2)
      const top = y(value)
      return <g key={bin.start}><rect className="uv-chart__bar" x={left} y={top} width={barWidth} height={274 - top} rx="2" />{bin.count > 0 && width >= 5 && <text className="uv-chart__bar-label" x={left + barWidth / 2} y={top - 5} textAnchor="middle">{bin.count}</text>}</g>
    })}
    <polyline className="uv-chart__density-line" points={linePoints} />
  </AxisChart>
}

const KDE_SKETCH_AGES = [12, 24, 34, 44]

function KernelSketch({ bandwidth }: { bandwidth: number }) {
  const values = rangeValues(0, 50, 160)
  const contributions = KDE_SKETCH_AGES.map(age => values.map(value => gaussianDensity([age], value, bandwidth) / KDE_SKETCH_AGES.length))
  const total = values.map(value => gaussianDensity(KDE_SKETCH_AGES, value, bandwidth))
  const peak = Math.max(...total) * 1.15
  const x = (value: number) => 70 + value / 50 * 662
  const y = (value: number) => 202 - value / peak * 142
  const line = (points: number[]) => points.map((value, index) => `${x(values[index])},${y(value)}`).join(' ')
  return <figure className="uv-kde-sketch">
    <svg viewBox="0 0 760 242" role="img" aria-labelledby="uv-kde-sketch-title uv-kde-sketch-desc">
      <title id="uv-kde-sketch-title">Four age kernels combine into one smooth estimate</title>
      <desc id="uv-kde-sketch-desc">Four separate smooth Gaussian bumps, centered at ages 12, 24, 34, and 44, are averaged to make the gold density curve. Their width follows the KDE bandwidth control below.</desc>
      <path className="uv-kde-sketch__axis" d="M70 202 H732" />
      {[0, 10, 20, 30, 40, 50].map(value => <g key={value}><path className="uv-kde-sketch__tick" d={`M${x(value)} 202 v5`} /><text x={x(value)} y="224" textAnchor="middle">{value}</text></g>)}
      {contributions.map((points, index) => <polyline key={KDE_SKETCH_AGES[index]} className="uv-kde-sketch__kernel" points={line(points)} />)}
      <polyline className="uv-kde-sketch__total" points={line(total)} />
      {KDE_SKETCH_AGES.map(age => <g key={age}><circle className="uv-kde-sketch__age" cx={x(age)} cy="202" r="4" /><text className="uv-kde-sketch__age-label" x={x(age)} y="194" textAnchor="middle">{age}</text></g>)}
      <text className="uv-kde-sketch__axis-label" x="401" y="240" textAnchor="middle">Example age (years)</text>
    </svg>
    <figcaption><span><i className="uv-kde-sketch__key uv-kde-sketch__key--kernel" /> One smooth kernel for each of four example ages</span><span><i className="uv-kde-sketch__key uv-kde-sketch__key--total" /> Combined contributions: the KDE curve</span></figcaption>
  </figure>
}

function KDEExplainer({ bandwidth }: { bandwidth: number }) {
  return <section className="uv-kde-explainer" aria-labelledby="uv-kde-explainer-title">
    <div className="uv-kde-explainer__copy">
      <p className="uv-lesson__eyebrow">The smooth view · KDE</p>
      <h2 id="uv-kde-explainer-title">A KDE estimates where observations cluster by placing a small smooth bump at each value, then averaging the bumps.</h2>
      <p>Bin boundaries can split nearby ages into separate bars, creating artificial gaps or a choppy shape. KDE helps you see the overall <strong>peaks, spread, and tails</strong> and compare distributions without choosing bin edges.</p>
      <p>It is <strong>not a line connecting bar tops</strong>, and it assumes no normal shape. Gaussian kernels are the little bumps; averaging them does not make the overall curve normal.</p>
      <p className="uv-kde-explainer__read"><strong>How to read it:</strong> a higher curve means more observations are nearby. On the density scale, probability is the <strong>area across an interval</strong>, not the height at one point.</p>
    </div>
    <div className="uv-kde-explainer__visual">
      <div className="uv-kde-explainer__figure-label"><strong>Four ages, shown separately</strong><span>Sketch bandwidth: {bandwidth} years</span></div>
      <KernelSketch bandwidth={bandwidth} />
      <p className="uv-kde-explainer__caption">This small illustration uses ages 12, 24, 34, and 44; the histogram below uses a separate sample of 21 ages. Each bump contributes one quarter; add the four contributions to get the curve.</p>
      <p className="uv-kde-explainer__bandwidth"><strong>Bandwidth controls bump width:</strong> a smaller value keeps more detail and noise; a larger value smooths more and can hide peaks.</p>
    </div>
  </section>
}

export function UVHistograms() {
  const [binWidth, setBinWidth] = useState(10)
  const [bandwidth, setBandwidth] = useState(4)
  const [measure, setMeasure] = useState<Measure>('count')
  const bins = histogram(AGE_VALUES, binWidth, 0, 50)
  return <Intro lesson="07 · Histograms & Kernel Densities" title="Histograms and kernel density" definition="A histogram counts how many numeric observations fall inside each chosen range." intro={<>A histogram turns one numeric column into ranges, or <strong>bins</strong>. The bar height records how many values land in each bin. A kernel density estimate adds a smooth view of the same distribution.</>}>
    <KDEExplainer bandwidth={bandwidth} />
    <section className="uv-lesson__panel" aria-labelledby="uv-hist-title"><div className="uv-panel__heading"><div><p className="uv-lesson__eyebrow">One column · 21 ages</p><h2 id="uv-hist-title">Changing the view changes the shape you notice</h2></div><span className="uv-pill">{AGE_VALUES.length} values · all binned</span></div>
      <p className="uv-kde-prompt">Keep bin width fixed, move bandwidth, and watch the gold line change while bin counts stay unchanged.</p>
      <div className="uv-controls" aria-label="Histogram controls">
        <label>Bin width <strong>{binWidth} years</strong><select value={binWidth} onChange={event => setBinWidth(Number(event.target.value))}><option value="5">5 years</option><option value="10">10 years</option><option value="25">25 years</option></select><span className="uv-control-hint">Wider bins combine neighboring ages.</span></label>
        <label>KDE bandwidth <strong>{bandwidth} years</strong><input type="range" min="2" max="10" step="1" value={bandwidth} onChange={event => setBandwidth(Number(event.target.value))} /><span className="uv-control-hint">More bandwidth smooths away small bumps.</span></label>
        <fieldset><legend>Vertical scale</legend><label className="uv-radio"><input type="radio" name="age-measure" checked={measure === 'count'} onChange={() => setMeasure('count')} /> Count</label><label className="uv-radio"><input type="radio" name="age-measure" checked={measure === 'density'} onChange={() => setMeasure('density')} /> Density</label><span className="uv-control-hint">Density bars have total area 1; the KDE uses the same scale.</span></fieldset>
      </div>
      <HistogramLessonChart width={binWidth} bandwidth={bandwidth} measure={measure} />
      <div className="uv-legend"><span><i className="uv-swatch uv-swatch--bars" /> Histogram</span><span><i className="uv-swatch uv-swatch--line" /> Kernel density estimate</span></div>
      <div className="uv-bin-summary"><strong>Counts by bin</strong><span>{bins.map(bin => `[${bin.start}, ${bin.end}${bin.end === 50 ? ']' : ')'}: ${bin.count}`).join(' · ')}</span><b>Σ {bins.reduce((sum, bin) => sum + bin.count, 0)} = {AGE_VALUES.length}</b></div>
      <p className="uv-note"><strong>Notice:</strong> the bars show the exact bin counts; the KDE is a smoothed estimate. Bin width controls grouping, while bandwidth controls smoothing. A narrow bin can look noisy, and a very wide one can hide detail.</p>
    </section>
    <section className="uv-lesson__summary"><p className="uv-lesson__eyebrow">Keep in mind</p><h2>Read the bins and the smooth line together.</h2><p>Histogram bars depend on chosen bin boundaries. A KDE smooths the pattern, but it does not add observations or make a small sample representative. Outliers and sample size still matter.</p></section>
  </Intro>
}

function mulberry32(seed: number) {
  return () => {
    let value = seed += 0x6D2B79F5
    value = Math.imul(value ^ value >>> 15, value | 1)
    value ^= value + Math.imul(value ^ value >>> 7, value | 61)
    return ((value ^ value >>> 14) >>> 0) / 4294967296
  }
}

export function simulateDice(seed: number, count: number): number[] {
  const random = mulberry32(seed)
  return Array.from({ length: count }, () => Math.floor(random() * 6) + 1 + Math.floor(random() * 6) + 1)
}

export function fairDiceProbabilities(): number[] {
  return Array.from({ length: 11 }, (_, index) => (index < 6 ? index + 1 : 11 - index) / 36)
}

export function UVHistogramCase() {
  const [rollCount, setRollCount] = useState(36)
  const [seed, setSeed] = useState(42)
  const [showSmooth, setShowSmooth] = useState(false)
  const rolls = simulateDice(seed, rollCount)
  const counts = Array.from({ length: 11 }, (_, index) => rolls.filter(value => value === index + 2).length)
  const expected = fairDiceProbabilities().map(probability => rollCount * probability)
  const maxY = Math.ceil(Math.max(...counts, ...expected) / 2) * 2 + 2
  const x = (value: number) => 94 + (value - 2) / 10 * 620
  const y = (value: number) => 274 - value / maxY * 225
  const smooth = rangeValues(2, 12, 120).map(value => `${x(value)},${y(gaussianDensity(rolls, value, 0.8) * rollCount)}`).join(' ')
  return <Intro lesson="08 · Case Study: Histograms" title="Do these dice rolls look unusual?" definition="Two fair dice do not make all sums equally likely: 7 has six ways to occur, while 2 and 12 each have one." intro={<>As the casino’s new Pit Boss, compare craps-table outcomes with the distribution expected from two fair dice. This simulation makes the chance pattern visible; a small mismatch by itself is not evidence of cheating.</>}>
    <section className="uv-dice-purpose" aria-labelledby="uv-dice-purpose-title"><p className="uv-lesson__eyebrow">Why make this comparison?</p><h2 id="uv-dice-purpose-title">A casino manager sees unusually low profits and asks whether dice might be loaded.</h2><p>Record two-dice sums, then compare observed frequencies with what fair dice predict to find patterns worth investigating. <strong>This example simulates fair dice, so it demonstrates chance variation; it is not a loaded-dice experiment.</strong></p></section>
    <section className="uv-lesson__panel" aria-labelledby="uv-dice-title"><div className="uv-panel__heading"><div><p className="uv-lesson__eyebrow">Two dice · sums from 2 to 12</p><h2 id="uv-dice-title">Observed rolls against fair-dice expectation</h2></div><span className="uv-pill">Sample {seed} · {rollCount} rolls</span></div>
      <div className="uv-controls uv-controls--case"><label>Number of rolls <strong>{rollCount}</strong><input type="range" min="36" max="360" step="36" value={rollCount} onChange={event => setRollCount(Number(event.target.value))} /><span className="uv-control-hint">A larger sample usually looks closer in proportion, but will still vary.</span></label>
        <button className="uv-action" type="button" onClick={() => setSeed(current => current + 1)}>Generate next reproducible sample <span aria-hidden="true">↻</span></button>
        <label className="uv-check uv-dice-kde-toggle"><input type="checkbox" checked={showSmooth} onChange={event => setShowSmooth(event.target.checked)} /><span><strong>Show smoothed sample estimate (KDE)</strong><small>Gaussian bumps from the observed rolls (bandwidth 0.8 sum units), averaged and scaled by N × 1 sum unit to show counts.</small></span></label></div>
      <div className="uv-dice-series" aria-label="What each chart mark means">
        <div><i className="uv-swatch uv-swatch--bars" /><span><strong>Observed bars</strong><small>Exact count of rolls at each integer sum.</small></span></div>
        <div><i className="uv-swatch uv-swatch--expected" /><span><strong>Fair-dice expectation</strong><small>Ways to make a sum ÷ 36 × N. For 7: 6 ÷ 36 × {rollCount} = {(rollCount / 6).toFixed(1)} expected rolls.</small></span></div>
        <div><i className="uv-swatch uv-swatch--sample-smooth" /><span><strong>Smoothed sample guide</strong><small>A kernel density estimate (KDE) mathematically smooths the sample’s jagged counts so its broad shape is easier to compare with the fair-dice expectation. It describes this sample.</small></span></div>
      </div>
      <AxisChart title="Observed dice sums and expected counts" description={`Bars show the exact count of each integer sum among ${rollCount} simulated fair-dice rolls. A dashed gold line marks theoretical expected counts, computed from the number of ways to make each sum divided by 36, times the sample size. The optional blue KDE smooths the observed rolls using bandwidth 0.8 sum units and scales the density to the count axis; portions between integers are visual only because only integer sums can occur.`} yLabel="Rolls (count)" xLabel="Sum of two dice" yTicks={[0, maxY / 2, maxY]} xTicks={Array.from({ length: 11 }, (_, index) => ({ value: index + 2, label: String(index + 2) }))} x={x} y={y}>
        {counts.map((count, index) => { const cx = x(index + 2); const top = y(count); return <g key={index}><rect className="uv-chart__bar" x={cx - 15} y={top} width="30" height={274 - top} rx="3" /><text className="uv-chart__bar-label" x={cx} y={top - 5} textAnchor="middle">{count}</text></g> })}
        <polyline className="uv-chart__expected-line" points={expected.map((value, index) => `${x(index + 2)},${y(value)}`).join(' ')} />
        {expected.map((value, index) => <circle key={index} className="uv-chart__expected-dot" cx={x(index + 2)} cy={y(value)} r="3.5" />)}
        {showSmooth && <polyline className="uv-chart__sample-smooth" points={smooth} />}
      </AxisChart>
      <div className="uv-legend"><span><i className="uv-swatch uv-swatch--bars" /> Observed (Σ {counts.reduce((a, b) => a + b, 0)})</span><span><i className="uv-swatch uv-swatch--expected" /> Expected count</span>{showSmooth && <span><i className="uv-swatch uv-swatch--sample-smooth" /> Smoothed sample guide</span>}</div>
      <div className="uv-bin-summary"><strong>Expected count by sum</strong><span>{expected.map((value, index) => `${index + 2}: ${value.toFixed(1)}`).join(' · ')}</span></div>
      <p className="uv-note"><strong>Interpret carefully:</strong> only sums 2 through 12 are possible; any KDE line between integers is a visual guide, not an outcome or exact probability for a sum. These are deterministic computer-generated fair-dice rolls, not an experiment with loaded dice. Random samples vary, and expected counts are a benchmark, not a pass/fail line.</p>
    </section>
    <section className="uv-lesson__summary"><p className="uv-lesson__eyebrow">What the case shows</p><h2>Compare the shape, then account for chance.</h2><p>A histogram can reveal patterns worth investigating. It cannot, on its own, establish why they happened.</p></section>
  </Intro>
}

function normalDensity(value: number, mean: number, sd: number): number {
  return Math.exp(-0.5 * ((value - mean) / sd) ** 2) / (sd * Math.sqrt(2 * Math.PI))
}

type NormalRange = 1 | 2 | 3

function WeightSpreadComparison() {
  const chart = (sd: number) => {
    const x = (value: number) => 38 + (value - 410) / 180 * 284
    const y = (density: number) => 148 - density / 0.042 * 96
    const points = rangeValues(410, 590, 160).map(value => `${x(value)},${y(normalDensity(value, 500, sd))}`).join(' ')
    const observedX = x(530)
    const observedY = y(normalDensity(530, 500, sd))
    return <g>
      <path className="uv-sd-chart__axis" d="M38 148 H322" />
      {[470, 500, 530].map(value => <g key={value}><path className="uv-sd-chart__tick" d={`M${x(value)} 148 v5`} /><text className="uv-sd-chart__tick-label" x={x(value)} y="169" textAnchor="middle">{value}</text></g>)}
      <polyline className="uv-sd-chart__curve" points={points} />
      <path className="uv-sd-chart__observation" d={`M${observedX} 32 V148`} />
      <circle className="uv-sd-chart__dot" cx={observedX} cy={observedY} r="4" />
      <text className="uv-sd-chart__observation-label" x={observedX} y="25" textAnchor="middle">530 g</text>
      <text className="uv-sd-chart__axis-label" x="180" y="190" textAnchor="middle">Bag weight (g)</text>
    </g>
  }
  return <figure className="uv-sd-context__figure">
    <svg viewBox="0 0 760 214" role="img" aria-labelledby="uv-sd-compare-title uv-sd-compare-desc">
      <title id="uv-sd-compare-title">The same 530 gram bag under two normal models</title>
      <desc id="uv-sd-compare-desc">Both curves share the same 410 to 590 gram axis and mean of 500 grams. With standard deviation 10, 530 grams is three standard deviations above the mean in the thin tail. With standard deviation 30, it is one standard deviation above the mean and nearer the center.</desc>
      <text className="uv-sd-chart__heading" x="180" y="14" textAnchor="middle">Machine A · SD 10 g · +3 SD</text>
      <text className="uv-sd-chart__heading" x="580" y="14" textAnchor="middle">Machine B · SD 30 g · +1 SD</text>
      <g>{chart(10)}</g><g transform="translate(400 0)">{chart(30)}</g>
    </svg>
    <figcaption>Same horizontal scale: 500 g is the center in both; the wider curve makes 530 g less far from typical.</figcaption>
  </figure>
}

export function UVNormalDistribution() {
  const [mean, setMean] = useState(0)
  const [sd, setSd] = useState(1)
  const [shadedRange, setShadedRange] = useState<NormalRange>(1)
  const yMax = 0.72
  const x = (value: number) => 70 + (value + 10) / 20 * 662
  const y = (value: number) => 274 - value / yMax * 226
  const curve = rangeValues(-10, 10, 240).map(value => `${x(value)},${y(normalDensity(value, mean, sd))}`).join(' ')
  const shade = rangeValues(mean - shadedRange * sd, mean + shadedRange * sd, 60).map(value => `${x(value)},${y(normalDensity(value, mean, sd))}`).join(' ')
  const rangeProbability: Record<NormalRange, string> = { 1: '68%', 2: '95%', 3: '99.7%' }
  const weightCurve = 'M20 160 ' + rangeValues(20, 440, 140).map(px => `L${px} ${160 - 124 * Math.exp(-0.5 * ((px - 230) / 60) ** 2)}`).join(' ') + ' L440 160 Z'
  return <Intro lesson="09 · Normal Distribution" title="A bell-shaped model for values" definition="A normal distribution is symmetric around its mean, with most of its density near the center and thinner tails farther away." intro={<>Its location is set by the mean (μ); its spread is set by the standard deviation (σ). The same curve can move left or right and become narrower or wider.</>}>
    <section className="uv-lesson__panel uv-normal-purpose" aria-labelledby="uv-normal-purpose-title">
      <p className="uv-lesson__eyebrow">Why use a normal distribution?</p>
      <h2 id="uv-normal-purpose-title">Turn a familiar shape into expectations.</h2>
      <p className="uv-normal-purpose__lead">If a numerical variable is approximately normal, its <strong>mean and standard deviation</strong> let us estimate how common a range of values should be. That gives us a benchmark for interpreting new observations.</p>
      <div className="uv-normal-example">
        <div><span className="uv-pill">Example · bag weights</span><h3>Most bags are near 500 g.</h3><p>Imagine a filling machine whose bag weights are approximately normal, with a <strong>mean of 500 g</strong> and a <strong>standard deviation of 10 g</strong>.</p><p className="uv-normal-example__result">About <strong>95%</strong> of bags weigh <strong>480–520 g</strong>: the mean ± two standard deviations.</p></div>
        <figure><svg viewBox="0 0 460 225" role="img" aria-label="Normal bag-weight model centered at 500 grams. The shaded range from 480 to 520 grams contains approximately 95 percent of the distribution."><defs><clipPath id="uv-weight-band"><rect x="110" y="25" width="240" height="135" /></clipPath></defs><path d={weightCurve} fill="#edf1e9"/><path d={weightCurve} fill="#a8ceba" clipPath="url(#uv-weight-band)"/><path d={weightCurve} fill="none" stroke="#267665" strokeWidth="3"/><path d="M20 160H440 M110 160V170 M230 160V170 M350 160V170" fill="none" stroke="#8ba196"/><text x="230" y="95" textAnchor="middle">≈95% of bags</text><text x="110" y="191" textAnchor="middle">480 g</text><text x="230" y="191" textAnchor="middle">500 g</text><text x="350" y="191" textAnchor="middle">520 g</text><text x="230" y="217" textAnchor="middle">mean ± 2 standard deviations</text></svg><figcaption>A model gives a typical range; real observations tell us whether it fits.</figcaption></figure>
      </div>
      <section className="uv-sd-context" aria-labelledby="uv-sd-context-title">
        <p className="uv-lesson__eyebrow">Why standard deviation matters</p>
        <h3 id="uv-sd-context-title">A 530 g bag is 30 g above the mean. Is that a lot?</h3>
        <p><strong>Standard deviation gives that distance context.</strong> It measures spread, so we can express how far an observation is from the mean in units of the usual variation.</p>
        <div className="uv-sd-context__comparison">
          <div><span>Machine A · mean 500 g · SD 10 g</span><strong>(530 − 500) ÷ 10 = 3 SD above</strong><p>Weights usually cluster tightly. A 530 g bag is <b>unusual under this normal model</b> and worth checking.</p></div>
          <div><span>Machine B · mean 500 g · SD 30 g</span><strong>(530 − 500) ÷ 30 = 1 SD above</strong><p>Weights vary much more. The very same 530 g bag is <b>within a common range</b> for this normal model.</p></div>
        </div>
        <WeightSpreadComparison />
        <p className="uv-sd-context__takeaway"><strong>Unusual is a reason to explore, not a verdict of “wrong.”</strong> Check the measurement, the filling process, or whether this bag belongs to a different product group. It may be a valid rare observation. A normal distribution has tails: values far from the mean can still occur.</p>
      </section>
      <div className="uv-normal-uses">
        <div><span>01 · Estimate proportions</span><h3>How much is typical?</h3><p>Use areas under the curve to estimate the share within a range. Here, roughly <strong>95 in 100 bags</strong> fall between 480 and 520 g.</p></div>
        <div><span>02 · Investigate extremes</span><h3>Is this unusually far away?</h3><p>A 530 g bag is <strong>three standard deviations above the mean</strong>. It deserves a closer look, even though an unusual value can still be correct.</p></div>
        <div><span>03 · Support statistical methods</span><h3>Does an assumption fit?</h3><p>Some confidence intervals and model tests assume approximately normal <strong>errors or sampling distributions</strong>. This does not mean every ML input must be normal.</p></div>
      </div>
    </section>
    <section className="uv-lesson__panel" aria-labelledby="uv-normal-title"><div className="uv-panel__heading"><div><p className="uv-lesson__eyebrow">A theoretical distribution</p><h2 id="uv-normal-title">Move the center; change the spread</h2></div><span className="uv-pill">Fixed axes · x from −10 to 10</span></div>
      <div className="uv-controls uv-controls--normal"><label>Mean, μ <strong>{mean.toFixed(1)}</strong><input type="range" min="-2" max="2" step="0.1" value={mean} onChange={event => setMean(Number(event.target.value))} /><span className="uv-control-hint">Changing μ moves the curve without changing its spread.</span></label>
        <label>Standard deviation, σ <strong>{sd.toFixed(1)}</strong><input type="range" min="0.6" max="2.4" step="0.1" value={sd} onChange={event => setSd(Number(event.target.value))} /><span className="uv-control-hint">Changing σ spreads out or concentrates the curve.</span></label>
        <div className="uv-sigma-select" role="group" aria-label="Choose the number of standard deviations to shade"><span>Shade around μ</span><div>{([1, 2, 3] as const).map(range => <button key={range} type="button" aria-pressed={shadedRange === range} onClick={() => setShadedRange(range)}>±{range}σ</button>)}</div><small>{rangeProbability[shadedRange]} · {(mean - shadedRange * sd).toFixed(1)} to {(mean + shadedRange * sd).toFixed(1)}</small></div></div>
      <div className="uv-normal-bridge" aria-label={`Mean ${mean.toFixed(1)} value units; variance ${(sd * sd).toFixed(2)} value units squared; standard deviation ${sd.toFixed(1)} value units`}>
        <div><span>Mean · location</span><strong>μ = {mean.toFixed(1)}</strong><small>value units</small></div><b className="uv-normal-bridge__link">independent</b>
        <div><span>Variance · squared spread</span><strong>σ² = {(sd * sd).toFixed(2)}</strong><small>value units² · σ × σ</small></div><b className="uv-normal-bridge__link">√variance →</b>
        <div><span>Standard deviation · spread</span><strong>σ = {sd.toFixed(1)}</strong><small>value units</small></div>
      </div>
      <p className="uv-normal-bridge__note">Changing μ moves the curve but leaves variance and SD unchanged. Changing σ changes the spread: σ × σ gives variance in squared units, and √variance gives SD in the original units.</p>
      <AxisChart title="Normal probability density curve" description={`Normal curve with mean ${mean.toFixed(1)} and standard deviation ${sd.toFixed(1)}. The shaded area marks values within ${shadedRange} standard deviation${shadedRange === 1 ? '' : 's'} of the mean, about ${rangeProbability[shadedRange]} of a normal distribution. Axes stay fixed from minus 10 to 10 while the curve changes.`} yLabel="Probability density" xLabel="Value (value units)" yTicks={[0, 0.2, 0.4, 0.6]} xTicks={[-10, -5, 0, 5, 10].map(value => ({ value, label: String(value) }))} x={x} y={y}>
        <polygon className="uv-chart__normal-band" points={`${x(mean - shadedRange * sd)},274 ${shade} ${x(mean + shadedRange * sd)},274`} /><polyline className="uv-chart__normal-line" points={curve} />
        <path className="uv-chart__mean-marker" d={`M${x(mean)} 34 V274`} /><text className="uv-chart__mean-label" x={x(mean) + 5} y="46">μ = {mean.toFixed(1)}</text>
        {[-1, 1].map(direction => {
          const boundary = mean + direction * shadedRange * sd
          const markerLabel = `${direction < 0 ? '−' : '+'}${shadedRange}σ`
          return <g key={direction}><path className="uv-chart__range-marker" d={`M${x(boundary)} ${y(normalDensity(boundary, mean, sd))} V274`} /><text className="uv-chart__range-label" x={x(boundary) + (direction < 0 ? -5 : 5)} y={Math.max(62, y(normalDensity(boundary, mean, sd)) - 8)} textAnchor={direction < 0 ? 'end' : 'start'}>{markerLabel}</text></g>
        })}
      </AxisChart>
      <div className="uv-formula"><span>Normal density</span><strong>f(x) = <span className="uv-frac">1 / (σ√2π)</span> · e<sup>−½((x−μ)/σ)²</sup></strong><span>μ = {mean.toFixed(1)} · σ = {sd.toFixed(1)}</span></div>
      <div className="uv-empirical"><strong>The empirical rule, when the data are approximately normal</strong><span>About 68% within μ ± 1σ <b>{(mean - sd).toFixed(1)} to {(mean + sd).toFixed(1)}</b></span><span>About 95% within μ ± 2σ <b>{(mean - 2 * sd).toFixed(1)} to {(mean + 2 * sd).toFixed(1)}</b></span><span>About 99.7% within μ ± 3σ <b>{(mean - 3 * sd).toFixed(1)} to {(mean + 3 * sd).toFixed(1)}</b></span></div>
      <p className="uv-note">The curve is a model, not a promise that real data follow it. The empirical rule applies to a normal distribution; inspect the observed data before using it.</p>
    </section>
    <section className="uv-lesson__summary"><p className="uv-lesson__eyebrow">What to remember</p><h2>Mean sets location. Standard deviation sets spread.</h2><p>Normal curves are useful comparison models in statistics and machine learning. A familiar bell shape should be checked against the actual sample and question.</p></section>
  </Intro>
}

export function UVNormalCase() {
  const [binWidth, setBinWidth] = useState(3)
  const [bandwidth, setBandwidth] = useState(3)
  const [showKde, setShowKde] = useState(true)
  const [showReference, setShowReference] = useState(true)
  const [showAthletes, setShowAthletes] = useState(true)
  const min = 130
  const max = 210
  const referenceBins = histogram(SAMPLE_HEIGHTS.referenceSample, binWidth, min, max)
  const athleteBins = histogram(SAMPLE_HEIGHTS.athleteSample, binWidth, min, max)
  const maxCount = Math.max(...referenceBins.map(bin => bin.count), ...athleteBins.map(bin => bin.count))
  const smoothMaximum = showKde ? Math.max(...rangeValues(min, max, 160).flatMap(value => {
    const localWidth = localBinWidth(value, binWidth, min, max)
    return [
      gaussianDensity(SAMPLE_HEIGHTS.referenceSample, value, bandwidth) * SAMPLE_HEIGHTS.referenceSample.length * localWidth,
      gaussianDensity(SAMPLE_HEIGHTS.athleteSample, value, bandwidth) * SAMPLE_HEIGHTS.athleteSample.length * localWidth,
    ]
  })) : 0
  const yMax = Math.ceil(Math.max(maxCount, smoothMaximum) / 100) * 100
  const x = (value: number) => 70 + (value - min) / (max - min) * 662
  const y = (value: number) => 274 - value / yMax * 226
  const refCurve = rangeValues(min, max, 160).map(value => `${x(value)},${y(gaussianDensity(SAMPLE_HEIGHTS.referenceSample, value, bandwidth) * SAMPLE_HEIGHTS.referenceSample.length * binWidth)}`).join(' ')
  const athleteCurve = rangeValues(min, max, 160).map(value => `${x(value)},${y(gaussianDensity(SAMPLE_HEIGHTS.athleteSample, value, bandwidth) * SAMPLE_HEIGHTS.athleteSample.length * binWidth)}`).join(' ')
  const xTicks = [130, 150, 170, 190, 210].map(value => ({ value, label: String(value) }))
  return <Intro lesson="10 · Case Study: Normal Distribution" title="Female athletes vs. the general population" definition="Compare the heights of female Olympic athletes with women in the general population to see how their typical height, spread and overall distribution differ." intro={<>You are analyzing heights from the 2016 Summer Olympics. Compare <strong>4,967 female athletes</strong> with a <strong>5,000-woman general-population reference sample</strong>. Look for where each group clusters, how widely heights vary, and whether the shapes look similar.</>}>
    <section className="uv-lesson__panel" aria-labelledby="uv-height-title"><div className="uv-panel__heading"><div><p className="uv-lesson__eyebrow">Height · centimeters</p><h2 id="uv-height-title">Who is taller, and how much do the heights vary?</h2></div><span className="uv-pill">{SAMPLE_HEIGHTS.referenceSample.length.toLocaleString()} women · {SAMPLE_HEIGHTS.athleteSample.length.toLocaleString()} female athletes</span></div>
      <div className="uv-controls uv-controls--case"><label>Bin width <strong>{binWidth} cm</strong><input type="range" min="1" max="5" step="1" value={binWidth} onChange={event => setBinWidth(Number(event.target.value))} /><span className="uv-control-hint">Wider bins combine more heights in each bar.</span></label>
        <label>KDE bandwidth <strong>{bandwidth} cm</strong><input type="range" min="1" max="8" step="1" value={bandwidth} onChange={event => setBandwidth(Number(event.target.value))} /><span className="uv-control-hint">Wider bandwidth makes each smooth line less wavy.</span></label>
        <label className="uv-check"><input type="checkbox" checked={showKde} onChange={event => setShowKde(event.target.checked)} /> Show smoothed density estimates</label></div>
      <div className="uv-series-controls" role="group" aria-label="Show or hide height distributions">
        <span>Show distributions</span>
        <button type="button" aria-pressed={showReference} onClick={() => setShowReference(value => !value)}><i className="uv-swatch uv-swatch--reference" aria-hidden="true" /> General population · women <b>{showReference ? 'On' : 'Off'}</b></button>
        <button type="button" aria-pressed={showAthletes} onClick={() => setShowAthletes(value => !value)}><i className="uv-swatch uv-swatch--athlete" aria-hidden="true" /> Female Olympic athletes <b>{showAthletes ? 'On' : 'Off'}</b></button>
        <small>Show either sample or both. Each button controls its bars and smoothed line; axes stay the same for comparison.</small>
      </div>
      {!showReference && !showAthletes && <p className="uv-note" role="status">Both distributions are hidden. Turn either sample on to show its graph.</p>}
      <AxisChart title="Height distributions for two supplied samples" description={`${showReference ? "General-population women shown" : "General-population women hidden"}; ${showAthletes ? "Female Olympic athletes shown" : "Female Olympic athletes hidden"}. Bar widths are ${binWidth} centimeters. The horizontal axis is height in centimeters and the vertical axis is observation count.`} yLabel="Observations per bin" xLabel="Height (cm)" yTicks={[0, yMax / 2, yMax]} xTicks={xTicks} x={x} y={y}>
        {showReference && referenceBins.map((bin, index) => { const left = x(bin.start) + 1; const width = x(bin.end) - x(bin.start) - 2; const top = y(bin.count); return <rect key={`r-${index}`} className="uv-chart__reference-bar" x={left} y={top} width={Math.max(1, width)} height={274 - top} /> })}
        {showAthletes && athleteBins.map((bin, index) => { const left = x(bin.start) + 1; const width = x(bin.end) - x(bin.start) - 2; const top = y(bin.count); return <rect key={`a-${index}`} className="uv-chart__athlete-bar" x={left} y={top} width={Math.max(1, width)} height={274 - top} /> })}
        {showKde && showReference && <polyline className="uv-chart__reference-line" points={refCurve} />}{showKde && showAthletes && <polyline className="uv-chart__density-line" points={athleteCurve} />}
      </AxisChart>
      <div className="uv-legend">{showReference && <span><i className="uv-swatch uv-swatch--reference" /> General population · women · {SAMPLE_HEIGHTS.referenceSample.length.toLocaleString()}</span>}{showAthletes && <span><i className="uv-swatch uv-swatch--athlete" /> Female Olympic athletes · {SAMPLE_HEIGHTS.athleteSample.length.toLocaleString()}</span>}{showKde && showReference && <span><i className="uv-swatch uv-swatch--reference-line" /> General-population KDE</span>}{showKde && showAthletes && <span><i className="uv-swatch uv-swatch--line" /> Female-athlete KDE</span>}</div>
      <div className="uv-sample-means"><strong>Mean height in these records</strong><span>Women in general population <b>{average(SAMPLE_HEIGHTS.referenceSample).toFixed(1)} cm</b></span><span>Female Olympic athletes <b>{average(SAMPLE_HEIGHTS.athleteSample).toFixed(1)} cm</b></span></div>
      <div className="uv-bin-summary"><strong>What this comparison shows</strong><span>Female athletes average <b>{average(SAMPLE_HEIGHTS.athleteSample).toFixed(1)} cm</b>, compared with <b>{average(SAMPLE_HEIGHTS.referenceSample).toFixed(1)} cm</b> for women in the reference sample: about <b>{(average(SAMPLE_HEIGHTS.athleteSample) - average(SAMPLE_HEIGHTS.referenceSample)).toFixed(1)} cm taller</b>. The athlete distribution sits farther to the right. Compare the widths and tails too; the average alone does not describe every woman.</span></div>
      <p className="uv-note"><strong>Scope:</strong> this chart describes only the two samples shown. It does not establish that either represents a broader population, or that height caused athletic success. Small changes to bin width can make the apparent peak shift by a bin.</p>
    </section>
    <section className="uv-lesson__summary"><p className="uv-lesson__eyebrow">Case study takeaway</p><h2>Compare distributions on the same scale, with sample limits in view.</h2><p>A center, shape, or spread difference can suggest a follow-up question. The sample source and how it was collected determine how far that comparison can be generalized.</p></section>
  </Intro>
}
