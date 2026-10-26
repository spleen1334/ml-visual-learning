import { useMemo, useState, type ReactNode } from 'react'
import './MultivariateCategories.css'

type LessonProps = { lesson: string; title: string; definition: string; intro: string; summary: string; children: ReactNode }

function Lesson({ lesson, title, definition, intro, summary, children }: LessonProps) {
  const titleId = `mvc-${lesson}-title`
  return <article className="mvc-lesson" aria-labelledby={titleId}>
    <header className="mvc-intro"><p className="mvc-eyebrow">6.{lesson} · Multivariate profiling</p><h1 id={titleId}>{title}</h1><p>{intro}</p></header>
    <section className="mvc-definition"><p className="mvc-eyebrow">The key idea</p><p className="mvc-definition-text">{definition}</p></section>
    {children}
    <section className="mvc-summary"><p className="mvc-eyebrow">Remember</p><p><strong>{summary}</strong></p></section>
  </article>
}

const inventorySizes = ['X-Small', 'Small', 'Medium', 'Large', 'X-Large'] as const
const designs = ['Design 1', 'Design 2', 'Design 3', 'Design 4', 'Design 5'] as const
export const inventoryCounts = [
  [2, 31, 44, 48, 3],
  [5, 33, 39, 33, 19],
  [5, 48, 28, 36, 37],
  [16, 27, 6, 38, 42],
  [35, 28, 1, 31, 3],
]
const inventory = inventoryCounts

type TableView = 'count' | 'share' | 'heat'

function ViewControls({ view, setView, label }: { view: TableView; setView: (view: TableView) => void; label: string }) {
  return <div className="mvc-view-control" role="group" aria-label={label}>
    <button type="button" aria-pressed={view === 'count'} onClick={() => setView('count')}>Counts</button>
    <button type="button" aria-pressed={view === 'share'} onClick={() => setView('share')}>Percentage (%)</button>
    <button type="button" aria-pressed={view === 'heat'} onClick={() => setView('heat')}>Heat map</button>
  </div>
}

function fmt(value: number) { return new Intl.NumberFormat('en-US').format(value) }
function heatColor(value: number, min: number, max: number, highIsGood = false) {
  const position = max === min ? 0.5 : (value - min) / (max - min)
  const hue = Math.round((highIsGood ? position : 1 - position) * 135)
  return `hsl(${hue} 53% 82%)`
}

function accidentScale(values: number[]) {
  return { min: Math.min(...values), max: Math.max(...values) }
}

function accidentScaleLabel(scale: { min: number; max: number }, percentage: boolean) {
  if (percentage) return `${(scale.min / accidentTotal * 100).toFixed(2)}–${(scale.max / accidentTotal * 100).toFixed(2)}%`
  return `${fmt(scale.min)}–${fmt(scale.max)}`
}

function InventoryTable({ view }: { view: TableView }) {
  const total = inventory.flat().reduce((sum, count) => sum + count, 0)
  return <div className="mvc-table-scroll" tabIndex={0} aria-label="Scrollable inventory table">
    <table className={`mvc-matrix ${view === 'heat' ? 'mvc-heat' : ''}`}>
      <caption>Product inventory by size and design · {total} products in this sample</caption>
      <thead><tr><th scope="col">Size ↓ / Design →</th>{designs.map(design => <th scope="col" key={design}>{design}</th>)}</tr></thead>
      <tbody>{inventory.map((row, r) => <tr key={inventorySizes[r]}><th scope="row">{inventorySizes[r]}</th>{row.map((count, c) => <td key={designs[c]} style={view === 'heat' ? { backgroundColor: heatColor(count, 1, 48, true) } : undefined}>
        {view === 'share' ? `${(count / total * 100).toFixed(1)}%` : fmt(count)}
      </td>)}</tr>)}</tbody>
    </table>
  </div>
}

export function MVIntroduction() {
  const [focus, setFocus] = useState<'store' | 'customer'>('store')
  const examples = {
    store: { a: 'Design', b: 'Size', labels: ['Design 4', 'Medium'], note: 'Which product combinations are common in this inventory?' },
    customer: { a: 'Region', b: 'Channel', labels: ['North', 'Online'], note: 'How do customer groups and shopping channels occur together?' },
  }
  const current = examples[focus]
  return <Lesson lesson="1" title="Multivariate profiling" intro="A single field can describe what is in a dataset; relationships between fields reveal how values occur together." definition="Multivariate profiling describes relationships between two or more variables. When we join variables to study their combined distribution, it is called a joint distribution." summary="Move from one field at a time to combinations that help explain patterns and guide which analysis or modeling tools to consider next.">
    <section className="mvc-card" aria-labelledby="mvc-overview-title">
      <div className="mvc-section-heading"><p className="mvc-eyebrow">Why look at variables together?</p><h2 id="mvc-overview-title">A group can hide a different pattern</h2><p>Stores may have the same overall mix while carrying very different combinations of product design and size. A joint view makes those pairings visible.</p></div>
      <div className="mvc-example-switch" role="group" aria-label="Choose a multivariate profiling example">
        <button type="button" aria-pressed={focus === 'store'} onClick={() => setFocus('store')}>Product inventory</button>
        <button type="button" aria-pressed={focus === 'customer'} onClick={() => setFocus('customer')}>Customer groups</button>
      </div>
      <div className="mvc-join-visual" aria-live="polite">
        <svg viewBox="0 0 900 210" role="img" aria-label={`Two categorical fields, ${current.a} and ${current.b}, combine into one joint category: ${current.labels.join(' + ')}`}>
          <rect x="18" y="25" width="245" height="145" rx="15" fill="#f2f4eb" stroke="#d1ddd1" strokeWidth="2"/><rect x="328" y="25" width="245" height="145" rx="15" fill="#f2f4eb" stroke="#d1ddd1" strokeWidth="2"/><rect x="638" y="25" width="245" height="145" rx="15" fill="#e6f0e9" stroke="#a8c9b7" strokeWidth="2"/>
          <text x="140" y="62" className="mvc-art-kicker">FIELD 1</text><text x="140" y="108" className="mvc-art-title">{current.a}</text><text x="450" y="62" className="mvc-art-kicker">FIELD 2</text><text x="450" y="108" className="mvc-art-title">{current.b}</text>
          <text x="294" y="111" className="mvc-art-join">+</text><path d="M575 99h50m-12-12 12 12-12 12" fill="none" stroke="#b48943" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          <text x="760" y="62" className="mvc-art-kicker">ONE COMBINATION</text><text x="760" y="108" className="mvc-art-title">{current.labels[0]}</text><text x="760" y="136" className="mvc-art-title">+ {current.labels[1]}</text>
        </svg>
        <p className="mvc-example-note"><strong>{current.note}</strong> Choose a pair of fields to see the kind of joint combination you could count.</p>
      </div>
      <div className="mvc-use-cases"><div><b>See relationships</b><span>Compare categories or numerical measures across groups.</span></div><div><b>Choose useful tools</b><span>Variable types help determine which tables and plots fit.</span></div><div><b>Prepare for modeling</b><span>Profiling helps build context before selecting a model.</span></div></div>
    </section>
  </Lesson>
}

export function MVCategoricalCategorical() {
  const [view, setView] = useState<TableView>('count')
  const total = inventory.flat().reduce((sum, count) => sum + count, 0)
  return <Lesson lesson="2" title="Categorical-categorical distributions" intro="Product teams can use a joint table to see whether certain designs or sizes occur together more often in their inventory." definition="A categorical-categorical distribution counts the records in each unique combination of two or more categorical variables." summary="Frequency tables show counts, proportion tables show each cell’s share of the total, and heat maps add color to make relative patterns easier to see. A high inventory count does not by itself mean excess stock; compare with demand before drawing that conclusion.">
    <section className="mvc-card" aria-labelledby="mvc-inventory-title">
      <div className="mvc-section-heading"><p className="mvc-eyebrow">One inventory · three views</p><h2 id="mvc-inventory-title">Design and size in the same table</h2><p>Each cell represents products at the intersection of a design and a size. The supplied course example contains {total} products.</p></div>
      <ViewControls view={view} setView={setView} label="Choose how to view product inventory" />
        <p className="mvc-control-hint" aria-live="polite">{view === 'count' ? 'Each cell is a product count.' : view === 'share' ? `Each cell is its percentage of all ${fmt(total)} products; all cells sum to 100%.` : 'Color encodes the cell count: green is higher and red is lower in this sample.'}</p>
      <InventoryTable view={view} />
      <div className="mvc-reading-notes"><p><strong>Read a cell:</strong> Design 1 and X-Large intersect at 35 products.</p><p><strong>Compare the pattern:</strong> Design 1 has low counts in most sizes, while Designs 4 and 5 show higher counts for Large. The table describes this sample, not sales or demand.</p></div>
    </section>
  </Lesson>
}

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const
const hours = ['12 AM', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM']
export const accidentFrequencyByDayHour = [
  [2153, 973, 683, 574, 717, 958, 1962, 2869, 5638, 5267, 4577, 4667, 4651, 4843, 5631, 5236, 6274, 6160, 5159, 3993, 3071, 2428, 2086, 1639],
  [1984, 796, 601, 440, 500, 875, 1939, 2915, 5880, 5568, 4891, 4899, 4959, 5051, 5933, 5347, 6487, 6442, 5569, 4386, 3369, 2719, 2357, 1886],
  [1998, 908, 579, 439, 554, 881, 1868, 2976, 5713, 5233, 4556, 4626, 4857, 4923, 5915, 5528, 6548, 6665, 5869, 4474, 3499, 2901, 2571, 1903],
  [2259, 961, 689, 551, 639, 866, 1815, 2884, 5789, 5508, 4802, 4747, 4933, 5105, 5981, 5479, 6554, 6597, 5869, 4492, 3700, 3006, 2803, 2105],
  [2582, 1244, 902, 713, 802, 972, 1974, 2852, 5516, 5300, 4709, 4820, 5011, 5308, 6361, 5966, 7093, 6934, 5932, 4903, 3954, 3233, 3120, 2608],
  [3148, 1997, 1678, 1476, 1727, 1383, 1303, 1194, 2359, 2807, 3243, 3843, 4240, 4616, 5096, 4547, 5358, 4913, 4532, 3775, 3547, 3285, 3146, 2826],
  [3071, 2185, 1786, 1677, 1958, 1591, 1185, 1103, 1786, 2073, 2694, 3108, 3586, 4060, 4856, 4180, 4933, 4379, 4037, 3475, 3100, 2724, 2530, 1980],
]
const accidentCounts = accidentFrequencyByDayHour
export const accidentDayTotals = [82209, 85793, 85984, 88134, 92809, 76039, 68057]
export const accidentHourTotals = [17195, 9064, 6918, 5870, 6897, 7526, 12046, 16793, 32681, 31756, 29472, 30710, 32237, 33906, 39773, 36283, 43247, 42090, 36967, 29498, 24240, 20296, 18613, 14947]
export const accidentTotal = 579025

export function MVHeatMapCase() {
  const [view, setView] = useState<TableView>('heat')
  const cellScale = accidentScale(accidentCounts.flat())
  const hourScale = accidentScale(accidentHourTotals)
  const dayScale = accidentScale(accidentDayTotals)
  const selectedRead = useMemo(() => view === 'count' ? 'Raw counts keep the exact number visible, but a 168-cell table is hard to scan. Choose a color view to spot patterns faster.' : view === 'share' ? `Every value is a percentage of all ${fmt(accidentTotal)} accidents in the two-year sample. Color helps compare patterns; each total uses its own scale.` : 'Color ranges from green for fewer sample accidents to red for more. Cells, hour totals, and day totals each use their own scale so the larger totals do not flatten cell colors.', [view])
  return <Lesson lesson="3" title="Case study: Heat maps" intro="The New York Department of Transportation wants to understand when accidents were recorded in New York City during 2019–2020, to plan a safe-driving public service campaign." definition="A heat map uses color to encode the values in a table. It can make high and low frequencies across two categorical fields easier to spot." summary="The sample has weekday peaks around the morning and evening commute, while weekend counts are relatively more concentrated in late-night hours. These are accident counts, not per-driver risk: exposure, traffic volume and other factors would be needed to compare individual risk or make causal claims.">
    <section className="mvc-card" aria-labelledby="mvc-heatmap-title">
      <div className="mvc-case-brief"><span className="mvc-case-mark" aria-hidden="true">NYC<br/>DOT</span><div><p className="mvc-eyebrow">Assignment</p><h2 id="mvc-heatmap-title">When were accidents recorded?</h2><p>Compare accident frequency by <strong>hour of day</strong> and <strong>day of week</strong> to help the commissioner choose campaign timing.</p></div></div>
      <div className="mvc-case-metrics"><div><span>Accidents in sample</span><strong>{fmt(accidentTotal)}</strong></div><div><span>Period</span><strong>2019–2020</strong></div><div><span>Most accidents in one cell</span><strong>Fri · 4 PM · 7,093</strong></div></div>
      <div className="mvc-section-heading mvc-case-heading"><p className="mvc-eyebrow">Choose a display</p><h3>Day of week × hour of day</h3><p>The same counts can be hard to scan across 168 cells. <strong>Color makes repeated high and low periods easier to notice.</strong> Row and column totals show the counts for each hour and day.</p></div>
      <ViewControls view={view} setView={setView} label="Choose an accident frequency display" />
      <p className="mvc-control-hint" aria-live="polite">{selectedRead}</p>
      <div className="mvc-accident-scroll" tabIndex={0} aria-label="Scrollable accident frequency table">
        <table className={`mvc-accident-table ${view === 'heat' ? 'mvc-heat' : ''}`}>
          <caption>NYC auto accidents · 2019–2020 · rows are hours, columns are weekdays</caption>
          <thead><tr><th scope="col">Hour ↓ / Day →</th>{days.map(day => <th scope="col" key={day}>{day}</th>)}<th scope="col">Hour total</th></tr></thead>
          <tbody>{hours.map((hour, h) => <tr key={hour}><th scope="row">{hour}</th>{days.map((day, d) => {
            const count = accidentCounts[d][h]
            const percent = count / accidentTotal * 100
            return <td key={day} title={`${day}, ${hour}: ${fmt(count)} accidents`} style={view !== 'count' ? { backgroundColor: heatColor(percent, cellScale.min / accidentTotal * 100, cellScale.max / accidentTotal * 100) } : undefined}>{view === 'share' ? `${percent.toFixed(2)}%` : fmt(count)}</td>
          })}<td className="mvc-total-cell" title={`Hour total: ${fmt(accidentHourTotals[h])} accidents${view !== 'count' ? '; uses the hour-total color scale' : ''}`} style={view !== 'count' ? { backgroundColor: heatColor(accidentHourTotals[h] / accidentTotal * 100, hourScale.min / accidentTotal * 100, hourScale.max / accidentTotal * 100) } : undefined}>{view === 'share' ? `${(accidentHourTotals[h] / accidentTotal * 100).toFixed(2)}%` : fmt(accidentHourTotals[h])}</td></tr>)}
            <tr className="mvc-total-row"><th scope="row">Day total</th>{accidentDayTotals.map((total, d) => <td key={days[d]} title={`Day total: ${fmt(total)} accidents${view !== 'count' ? '; uses the day-total color scale' : ''}`} style={view !== 'count' ? { backgroundColor: heatColor(total / accidentTotal * 100, dayScale.min / accidentTotal * 100, dayScale.max / accidentTotal * 100) } : undefined}>{view === 'share' ? `${(total / accidentTotal * 100).toFixed(2)}%` : fmt(total)}</td>)}<td className="mvc-grand-total">{view === 'share' ? '100.00%' : fmt(accidentTotal)}</td></tr>
          </tbody>
        </table>
      </div>
      {view !== 'count' && <div className="mvc-heat-legend"><span>Lower value</span><span className="mvc-legend-bar" aria-hidden="true"/><span>Higher value</span><small>{view === 'share' ? `Percent of all ${fmt(accidentTotal)} accidents. ` : 'Accident counts. '}Separate scales keep larger totals from flattening cell colors: cells ({accidentScaleLabel(cellScale, view === 'share')}), hour totals ({accidentScaleLabel(hourScale, view === 'share')}), and day totals ({accidentScaleLabel(dayScale, view === 'share')}). Grand total uses a fixed teal highlight.</small></div>}
      <section className="mvc-case-conclusion" aria-labelledby="mvc-heatmap-conclusion"><h2 id="mvc-heatmap-conclusion">Case study conclusion</h2><div className="mvc-reading-notes mvc-case-insights"><p><strong>Weekdays:</strong> the <strong>morning and late-afternoon cells are warmer</strong>, with the largest weekday count Friday at 4 PM.</p><p><strong>Weekend:</strong> Saturday and Sunday have a <strong>larger share of their daily counts in the late-night hours</strong> than weekdays do.</p></div></section>
      <p className="mvc-caution"><strong>Interpret with care:</strong> the table counts reported accidents by time. It does not include how many vehicles or miles were traveled in each time slot, so it cannot tell us the risk per driver or explain why the pattern occurs.</p>
    </section>
  </Lesson>
}
