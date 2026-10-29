import { useEffect, useId, useMemo, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { PlaybackButton } from '../components/PlaybackButton'
import './OutlierDetection.css'
import { OUTLIER_STORE_SALES, type StoreSale } from './outlierWorkbookData'
import pdfCross334 from '../assets/outlier-pdf-cross-334.png'
import pdfCross335 from '../assets/outlier-pdf-cross-335.png'
import pdfCross336 from '../assets/outlier-pdf-cross-336.png'
import pdfCross337 from '../assets/outlier-pdf-cross-337.png'
import pdfCross338 from '../assets/outlier-pdf-cross-338.png'
import pdfCross339 from '../assets/outlier-pdf-cross-339.png'
import pdfCross340 from '../assets/outlier-pdf-cross-340.png'
import pdfCross341 from '../assets/outlier-pdf-cross-341.png'
import pdfTime343 from '../assets/outlier-pdf-time-343.png'
import pdfTime344 from '../assets/outlier-pdf-time-344.png'
import pdfTime345 from '../assets/outlier-pdf-time-345.png'
import pdfTime346 from '../assets/outlier-pdf-time-346.png'
import pdfTime347 from '../assets/outlier-pdf-time-347.png'
import nearestNeighborDiagram from '../assets/outlier-nearest-neighbor.png'
import outlierBasicsIllustration from '../assets/outlier-basics-observations.webp'

const BASE_CLASS = 'outlier-lesson'
function Header({ eyebrow, title, intro }: { eyebrow: string; title: string; intro: ReactNode }) {
  return <header className="od-header"><p className="od-eyebrow">{eyebrow}</p><h1>{title}</h1><p>{intro}</p></header>
}

function useStepPlayback(stepCount: number) {
  const lastStep = stepCount - 1
  const initialReducedMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
  const [reducedMotion, setReducedMotion] = useState(initialReducedMotion)
  const [step, setStep] = useState(() => initialReducedMotion() ? lastStep : 0)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => {
      setReducedMotion(preference.matches)
      if (preference.matches) {
        setIsPlaying(false)
        setStep(lastStep)
      }
    }
    updatePreference()
    preference.addEventListener('change', updatePreference)
    return () => preference.removeEventListener('change', updatePreference)
  }, [lastStep])

  useEffect(() => {
    if (!isPlaying) return
    if (step >= lastStep) {
      setIsPlaying(false)
      return
    }
    const timer = window.setTimeout(() => setStep((current) => Math.min(current + 1, lastStep)), 2200)
    return () => window.clearTimeout(timer)
  }, [isPlaying, step, lastStep])

  const showStep = (nextStep: number) => {
    setIsPlaying(false)
    setStep(Math.max(0, Math.min(nextStep, lastStep)))
  }
  const togglePlayback = () => {
    if (reducedMotion) return
    if (isPlaying) {
      setIsPlaying(false)
      return
    }
    if (step >= lastStep) setStep(0)
    setIsPlaying(true)
  }

  return { step, isPlaying, reducedMotion, showStep, togglePlayback }
}

function PlaybackControls({
  ariaLabel,
  step,
  stepCount,
  isPlaying,
  reducedMotion,
  onToggle,
  onPrevious,
  onNext,
}: {
  ariaLabel: string
  step: number
  stepCount: number
  isPlaying: boolean
  reducedMotion: boolean
  onToggle: () => void
  onPrevious: () => void
  onNext: () => void
}) {
  const playLabel = reducedMotion ? 'Autoplay disabled: reduced motion is preferred' : isPlaying ? `Pause ${ariaLabel}` : step === stepCount - 1 ? `Play ${ariaLabel} from the beginning` : `Play ${ariaLabel}`
  return <div className="od-playback" role="group" aria-label={`${ariaLabel} playback controls`}>
    <PlaybackButton action={isPlaying ? 'pause' : step === stepCount - 1 && !reducedMotion ? 'replay' : 'play'} label={playLabel} className="od-playback__toggle" aria-pressed={isPlaying} disabled={reducedMotion} onClick={onToggle}/>
    <PlaybackButton action="previous" label={`Previous ${ariaLabel} step`} disabled={step === 0} onClick={onPrevious}/>
    <PlaybackButton action="next" label={`Next ${ariaLabel} step`} disabled={step === stepCount - 1} onClick={onNext}/>
    <span className="od-playback__status" role="status" aria-live="polite">{reducedMotion ? 'Reduced motion: showing the completed view.' : isPlaying ? `Playing step ${step + 1} of ${stepCount}.` : `Paused on step ${step + 1} of ${stepCount}.`}</span>
  </div>
}

export function OutlierIntroduction() {
  return <article className={BASE_CLASS}>
    <Header eyebrow="20.1 · Introduction" title="Outlier detection" intro={<>Introduce <strong>statistical outliers</strong> and review common methods for detecting cross-sectional and time-series outliers and anomalies.</>} />
    <div className="od-source-intro"><section><h2>Topics we’ll cover</h2><ul className="od-source-topics"><li>Outlier Detection Basics</li><li>Cross-sectional Outliers</li><li>Time-Series Outliers</li><li>Key Takeaways</li></ul></section><section><h2>Goals for this section</h2><ul className="od-source-list"><li>Understand different types of outliers, and how they can impact an analysis</li><li>Learn how to identify outliers in a cross-sectional dataset using a “nearest neighbors” approach</li><li>Learn how to use regression analysis to detect outliers in a time-series dataset</li></ul></section></div>
    <p className="od-source-callout">The terms <strong>outlier detection, anomaly detection, and rare-event detection</strong> are often used interchangeably; they all focus on finding observations which are materially different than the others. Outliers are also sometimes called “pathological” data.</p>
  </article>
}

export function OutlierBasics() {
  return <article className={BASE_CLASS}>
    <Header eyebrow="20.2 · Outlier detection basics" title="Outlier detection basics" intro="Identify unusual observations and understand what they mean in context." />
    <div className="od-basics-layout"><div>
      <p className="od-source-definition"><strong>Outlier detection</strong> is used to identify observations in a dataset which are either <strong>unexpected or statistically different</strong> from the others.</p>
      <section className="od-source-section"><h2>Two general types of outliers</h2><ul className="od-source-list"><li><strong>Data/recording issues:</strong> Values which were captured or categorized incorrectly and must be corrected or excluded to avoid skewing the analysis.</li><li><strong>Business outliers:</strong> Legitimate values which provide real and meaningful information, such as a fraudulent transaction or an unexpected spike in sales.</li></ul></section>
    </div><img className="od-basics-illustration" src={outlierBasicsIllustration} alt="A group of observations with one unusual observation apart from the others." /></div>
    <section className="od-source-section"><h2>Common use cases</h2><ul className="od-source-list"><li>Identifying store locations which are behaving abnormally compared to others</li><li>Detecting web traffic anomalies which would be impossible to detect otherwise</li><li>Flagging potentially fraudulent credit card transactions</li></ul></section>
  </article>
}

export function CrossSectionalOutliers() {
  return <article className={BASE_CLASS}>
    <Header eyebrow="20.3 · Cross-sectional outliers" title="Cross-sectional outliers" intro="Compare observations across features at one point in time." />
    <p className="od-source-definition"><strong>Cross-sectional outlier detection</strong> measures the similarity between observations in a dataset and identifies observations which are <strong>unusually different or dissimilar</strong>.</p>
    <ul className="od-source-list"><li>Detecting outliers in one or two dimensions is often straightforward, using basic profiling metrics (such as interquartile range) or visual analysis (scatterplots, box plots, etc.).</li><li>Detecting outliers in <strong>3+ dimensions</strong> is trickier and often requires more sophisticated techniques; <strong>this is where machine learning comes in!</strong></li></ul>
    <section className="od-source-neighbor"><img src={nearestNeighborDiagram} alt="Scatterplot with a circle around an observation and an arrow to its nearest neighbor."/><div><p>A common technique is to calculate the distance between each observation and its <strong>nearest neighbor</strong>, and plot those distances to reveal outliers.</p><p className="od-source-scale"><strong>Note:</strong> Scale raw data when feature units or ranges differ to produce consistent and meaningful distance calculations.</p><p className="od-source-clarification">Exclude the observation itself when finding its nearest neighbor; a distinct observation can have a distance of zero.</p></div></section>
  </article>
}

const PDF_CROSS_STEPS = [
  { title: 'Three variables, 101 stores', detail: 'Normalized category sales use X1, X2, and X3. The table gives the three measurements for each store.', src: pdfCross334, alt: 'Normalized sales data for three product categories across 101 stores, before the plots are introduced.' },
  { title: 'Single-variable plots do not flag it', detail: 'The box plots, violin plots, and kernel-density plots look ordinary when each category is considered alone.', src: pdfCross335, alt: 'Box and violin plots for the three category-sales variables, with no obvious outlier.' },
  { title: 'The three densities look ordinary', detail: 'Each variable has a familiar distribution, so its individual density does not reveal the unusual store.', src: pdfCross336, alt: 'Three kernel-density plots for normalized category sales that appear ordinary.' },
  { title: 'X1 and X2 still look ordinary', detail: 'The first pairwise view does not make the planted point obvious.', src: pdfCross337, alt: 'Pairwise scatterplot of X1 and X2, without a clear outlier.' },
  { title: 'X2 and X3 still look ordinary', detail: 'The second pairwise view also looks like a typical cloud of observations.', src: pdfCross338, alt: 'Pairwise scatterplot of X2 and X3, without a clear outlier.' },
  { title: 'X1 and X3 still look ordinary', detail: 'None of the three two-feature views exposes the unusual combination clearly.', src: pdfCross339, alt: 'Pairwise scatterplot of X1 and X3, without a clear outlier.' },
  { title: 'A third dimension exposes it', detail: 'The 3-D view shows one store separated from the main cloud. A higher-dimensional data set cannot be displayed this way.', src: pdfCross340, alt: 'Three-dimensional view of the normalized categories with one isolated store.' },
  { title: 'Nearest-neighbor distances expose it', detail: 'The distribution of nearest-neighbor distances isolates the store that was hard to see in one- and two-dimensional plots.', src: pdfCross341, alt: 'A nearest-neighbor-distance box plot and histogram, each showing one isolated high value.' },
] as const

export function CrossSectionalExample() {
  const { step, isPlaying, reducedMotion, showStep, togglePlayback } = useStepPlayback(PDF_CROSS_STEPS.length)
  const current = PDF_CROSS_STEPS[step]
  return <article className={BASE_CLASS}>
    <Header eyebrow="20.4 · Cross-sectional outlier example" title="The joint pattern can reveal what each variable hides" intro="Follow the source’s normalized sales example as it moves from individual distributions to pairwise views and nearest-neighbor distances." />
    <section className="od-source-stepper"><div className="od-source-stepper__copy"><p className="od-eyebrow">{String(step + 1).padStart(2,'0')} / {PDF_CROSS_STEPS.length}</p><h2>{current.title}</h2><p>{current.detail}</p><nav aria-label="Cross-sectional example steps">{PDF_CROSS_STEPS.map((item,i)=><button key={item.title} type="button" aria-label={`Show step ${i+1}: ${item.title}`} aria-current={step===i?'step':undefined} onClick={()=>showStep(i)}>{i+1}</button>)}</nav><PlaybackControls ariaLabel="Cross-sectional example" step={step} stepCount={PDF_CROSS_STEPS.length} isPlaying={isPlaying} reducedMotion={reducedMotion} onToggle={togglePlayback} onPrevious={()=>showStep(step-1)} onNext={()=>showStep(step+1)}/></div><figure><img src={current.src} alt={current.alt}/><figcaption>Normalized category sales · 101 stores</figcaption></figure></section>
    <p className="od-note">Nearest-neighbor distance is useful when the data has more features than a chart can show. The source also demonstrates that distributions can look ordinary one feature at a time.</p>
  </article>
}

type Neighbor = { store: StoreSale; nearestStore: number; distance: number }
const euclidean = (a: StoreSale, b: StoreSale) => Math.hypot(a.toys-b.toys, a.boardGames-b.boardGames, a.puzzles-b.puzzles)
const WORKBOOK_NEIGHBORS: readonly Neighbor[] = OUTLIER_STORE_SALES.map((store) => {
  let closest: StoreSale | undefined
  let smallest = Number.POSITIVE_INFINITY
  for (const candidate of OUTLIER_STORE_SALES) {
    if (candidate.store === store.store) continue
    const d = euclidean(store,candidate)
    if (d < smallest) { smallest = d; closest = candidate }
  }
  return { store, nearestStore: closest!.store, distance: smallest }
})
const NN_MAX = Math.max(...WORKBOOK_NEIGHBORS.map((item)=>item.distance))
const NN_MIN = Math.min(...WORKBOOK_NEIGHBORS.map((item)=>item.distance))
// Workbook DL8:DL107: minimum FFFCFCFF to maximum FFF8696B.
const minDistanceColor = (distance: number) => {
  const t = (distance - NN_MIN) / (NN_MAX - NN_MIN)
  return `rgb(${[252, 252, 255].map((start, i) => Math.round(start + ([248, 105, 107][i] - start) * t)).join(', ')})`
}
const percentileExclusive = (values: number[], p: number) => {
  const sorted = [...values].sort((a,b)=>a-b), position=(sorted.length+1)*p-1, low=Math.floor(position), high=Math.ceil(position)
  return sorted[low] + (sorted[high]-sorted[low])*(position-low)
}
const PAIRS = [
  { x: 'toys', y: 'boardGames', label: 'Toys and Board Games' },
  { x: 'toys', y: 'puzzles', label: 'Toys and Puzzles' },
  { x: 'boardGames', y: 'puzzles', label: 'Board Games and Puzzles' },
] as const

function StoreScatter({ x, y, label, selectedStore, onSelectStore }: typeof PAIRS[number] & { selectedStore: number; onSelectStore: (store: number) => void }) {
  const px=(value:number)=>44+value/6500*330, py=(value:number)=>218-value/6500*185
  return <figure className="od-chart-card"><figcaption>{label}</figcaption><svg viewBox="0 0 400 264" role="group" aria-label={`${label} scatterplot for all 100 Brain Games stores. Select a point to highlight its store in the table.`}>
    <path className="od-axis" d="M44 28V218H374" />
    {[0,2000,4000,6000].map(t=><g key={t}><path className="od-tick" d={`M${px(t)} 218v5`} /><text x={px(t)} y="242" textAnchor="middle">{t.toLocaleString()}</text><path className="od-grid" d={`M44 ${py(t)}H374`} /><text x="36" y={py(t)+4} textAnchor="end">{t/1000}k</text></g>)}
    {OUTLIER_STORE_SALES.map(row=><circle key={row.store} className="od-store-point" role="button" tabIndex={0} aria-pressed={row.store===selectedStore} aria-label={`Select Store ${row.store}: ${row[x].toLocaleString()} ${x} revenue and ${row[y].toLocaleString()} ${y} revenue${row.store===57?' · largest nearest-neighbor distance':''}`} cx={px(row[x])} cy={py(row[y])} r={row.store===selectedStore?6:row.store===57?5.5:3.3} fill={row.store===57?'#d4a13a':'#188b88'} stroke={row.store===selectedStore?'#173b3d':row.store===57?'#503b12':'none'} strokeWidth={row.store===selectedStore?2.5:1.5} onClick={()=>onSelectStore(row.store)} onKeyDown={(event)=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();onSelectStore(row.store)}}}><title>{`Store ${row.store}: ${row[x].toLocaleString()} and ${row[y].toLocaleString()}${row.store===57?' · flagged by nearest-neighbor distance':''}`}</title></circle>)}
    <text x="209" y="259" textAnchor="middle">{x==='toys'?'Toys':'Board Games'} revenue</text><text transform="translate(13 126) rotate(-90)" textAnchor="middle">{y==='puzzles'?'Puzzles':'Board Games'} revenue</text>
  </svg></figure>
}

function NeighborDistribution({ onChooseStore }: { onChooseStore: () => void }) {
  const vals=WORKBOOK_NEIGHBORS.map(x=>x.distance), bins=40, width=340, max=1800, counts=Array.from({length:bins},()=>0)
  for(const v of vals) counts[Math.min(bins-1,Math.floor(v/max*bins))]++
  const maxCount=Math.max(...counts), q1=percentileExclusive(vals,.25), median=percentileExclusive(vals,.5), q3=percentileExclusive(vals,.75)
  const iqr=q3-q1, lowWhisker=Math.min(...vals.filter(v=>v>=q1-1.5*iqr)), highWhisker=Math.max(...vals.filter(v=>v<=q3+1.5*iqr))
  const x=(v:number)=>45+v/max*width, y=(c:number)=>150-c/maxCount*115
  return <div className="od-distribution-grid">
    <figure className="od-chart-card"><figcaption>Nearest-neighbor distance · all stores</figcaption><svg viewBox="0 0 420 215" role="img" aria-label="Histogram of all 100 nearest-neighbor distances, with Store 57 in its own far-right bin">
      <path className="od-axis" d="M44 28V151H392" />{[0,Math.ceil(maxCount/2),maxCount].map(t=><g key={t}><path className="od-grid" d={`M44 ${y(t)}H392`} /><text x="37" y={y(t)+4} textAnchor="end">{t}</text></g>)}
      {counts.map((count,i)=><rect key={i} x={45+i*width/bins+1} y={y(count)} width={width/bins-3} height={150-y(count)} rx="2" fill={i===bins-1?'#d6a438':'#168f8b'} />)}
      {[0,500,1000,1500].map(t=><g key={t}><path className="od-tick" d={`M${x(t)} 151v5`} /><text x={x(t)} y="175" textAnchor="middle">{t.toLocaleString()}</text></g>)}
      <text x="218" y="202" textAnchor="middle">Distance to nearest store (same revenue units)</text>
    </svg></figure>
    <figure className="od-chart-card"><figcaption>Box plot · one distant store</figcaption><svg viewBox="0 0 420 215" role="img" aria-label={`Nearest-neighbor distance box plot. The high outlier is Store 57 at ${NN_MAX.toFixed(1)}.`}>
      <path className="od-axis" d="M44 151H392" />{[0,500,1000,1500].map(t=><g key={t}><path className="od-tick" d={`M${x(t)} 151v5`} /><text x={x(t)} y="175" textAnchor="middle">{t.toLocaleString()}</text></g>)}
      <path d={`M${x(lowWhisker)} 100H${x(q1)} M${x(q3)} 100H${x(highWhisker)} M${x(lowWhisker)} 90V110 M${x(highWhisker)} 90V110`} stroke="#52716d" strokeWidth="3" />
      <rect x={x(q1)} y="68" width={x(q3)-x(q1)} height="64" fill="#bde5da" stroke="#167f7d" strokeWidth="2" />
      <path d={`M${x(median)} 68V132`} stroke="#164d4a" strokeWidth="3" /><circle cx={x(NN_MAX)} cy="100" r="7" fill="#d6a438" stroke="#503b12" strokeWidth="2" />
      <text x={x(NN_MAX)-6} y="63" textAnchor="end">Store 57</text><text x="218" y="202" textAnchor="middle">Distance to nearest store</text>
    </svg><button type="button" className="od-chart-link" onClick={onChooseStore}>Show Store 57 in the table →</button></figure>
  </div>
}

function CalculatedHeaderHelp({ label, explanation }: { label: string; explanation: string }) {
  const id = useId()
  const [position, setPosition] = useState<{ left: number; top: number } | null>(null)
  const show = (button: HTMLButtonElement) => {
    const rect = button.getBoundingClientRect()
    setPosition({ left: Math.max(8, Math.min(rect.left, window.innerWidth - 328)), top: Math.max(8, Math.min(rect.bottom + 8, window.innerHeight - 160)) })
  }
  useEffect(() => {
    const close = () => setPosition(null)
    window.addEventListener('scroll', close, true)
    window.addEventListener('resize', close)
    return () => { window.removeEventListener('scroll', close, true); window.removeEventListener('resize', close) }
  }, [])
  return <><button type="button" className="od-calculated-help" aria-describedby={position ? id : undefined} onMouseEnter={event => show(event.currentTarget)} onMouseLeave={event => { if (document.activeElement !== event.currentTarget) setPosition(null) }} onFocus={event => show(event.currentTarget)} onBlur={() => setPosition(null)} onClick={event => show(event.currentTarget)} onKeyDown={event => { if (event.key === 'Escape') setPosition(null) }}>{label}</button>{position && createPortal(<div id={id} role="tooltip" className="od-calculated-tooltip" style={position}><strong>{label}</strong><span>{explanation}</span></div>, document.body)}</>
}

export function CrossSectionalCase() {
  const [selectedStore,setSelectedStore]=useState(57)
  const [matrixOpen,setMatrixOpen]=useState(false)
  const ordered=useMemo(()=>[...WORKBOOK_NEIGHBORS].sort((a,b)=>a.store.store-b.store.store),[])
  const selected=WORKBOOK_NEIGHBORS.find(x=>x.store.store===selectedStore)!
  const table=(matrix:boolean)=><div className={`od-table-scroll${matrix?' od-table-scroll--matrix':''}`}><table className="od-data-table"><caption>{matrix?'Complete pairwise Euclidean distance matrix · row store to column store':'All 100 stores · source revenue values and nearest neighbor'}</caption><thead><tr>{matrix?<><th scope="col">Store</th>{OUTLIER_STORE_SALES.map(row=><th scope="col" key={row.store}>{row.store}</th>)}</>:<><th scope="col">Store</th><th scope="col">Toys</th><th scope="col">Board Games</th><th scope="col">Puzzles</th><th scope="col" className="od-nearest-header od-calculated-start"><CalculatedHeaderHelp label="Nearest store" explanation="A calculated store ID, not an original dataset column. We compare this row with every other store using Euclidean distance across Toys, Board Games and Puzzles revenue; this is the store with the smallest distance." /></th><th scope="col" className="od-min-header"><CalculatedHeaderHelp label="Min distance" explanation="The smallest calculated Euclidean distance to another store, also called the nearest-neighbor (NN) distance. A larger value means the store is farther away even from its closest neighbor. This is not an original dataset column." /></th></>}</tr></thead><tbody>{ordered.map(({store,nearestStore,distance})=><tr key={store.store} className={store.store===selectedStore?'is-selected':undefined} onClick={matrix?undefined:()=>setSelectedStore(store.store)}>{matrix?<><th scope="row">{store.store}</th>{OUTLIER_STORE_SALES.map(target=><td key={target.store} className={store.store===target.store?'is-diagonal':undefined}>{store.store===target.store?'—':euclidean(store,target).toFixed(1)}</td>)}</>:<><th scope="row"><button type="button" className="od-row-button" aria-pressed={store.store===selectedStore} onClick={()=>setSelectedStore(store.store)}>Store {store.store}</button></th><td>{store.toys.toLocaleString()}</td><td>{store.boardGames.toLocaleString()}</td><td>{store.puzzles.toLocaleString()}</td><td className="od-calculated-start">{nearestStore}</td><td style={{backgroundColor: minDistanceColor(distance)}}>{distance.toFixed(2)}</td></>}</tr>)}</tbody></table></div>
  return <article className={BASE_CLASS}>
    <Header eyebrow="20.5 · Case study: cross-sectional outlier" title="Does any location show an unusual composition of revenue?" intro="Compare revenue from Toys, Board Games, and Puzzles across Brain Games’ 100 store locations to see whether any location has an unusual revenue mix." />
    <h2 className="od-case-section-heading">Step 1 · Visual analysis</h2>
    <p>These scatterplots compare two revenue categories at a time, but they do not clearly identify an outlier across all three categories together.</p>
    <section className="od-scatter-grid" aria-label="Pairwise scatterplots">{PAIRS.map(pair=><StoreScatter key={pair.label} {...pair} selectedStore={selectedStore} onSelectStore={setSelectedStore}/>)}</section>
    <h2 className="od-case-section-heading">Step 2 · Calculate nearest-neighbor distances</h2>
    <p>Because the scatterplots do not give a clear answer, calculate each store’s distance to its nearest neighbor using all three revenue categories. The Min distance values begin to reveal stores that are much farther from their neighbors.</p>
    <div className="od-formula-note">
      <strong>Distance from store to store</strong>
      <div className="od-distance-equation">
        <div className="od-distance-math" role="math" aria-label="Distance from store i to store j equals the square root of the squared difference in Toys, plus the squared difference in Board Games, plus the squared difference in Puzzles.">
          <span><i>d</i><sub><i>ij</i></sub> = </span>
          <span className="od-distance-root"><span className="od-distance-radical">√</span><span className="od-distance-radicand">
            (Toys<sub><i>i</i></sub> − Toys<sub><i>j</i></sub>)<sup>2</sup> + (Board Games<sub><i>i</i></sub> − Board Games<sub><i>j</i></sub>)<sup>2</sup> + (Puzzles<sub><i>i</i></sub> − Puzzles<sub><i>j</i></sub>)<sup>2</sup>
          </span></span>
        </div>
      </div>
      <p><i>i</i> and <i>j</i> identify the two stores being compared.</p>
      <p>The workbook uses the three category amounts as supplied; because they share a revenue scale, no separate normalization is applied in this case.</p>
    </div>
    {table(false)}
    <p className="od-min-note"><strong>Min</strong> is the minimum distance to another store. Darker red indicates a larger minimum distance.</p>
    <details className="od-matrix-details" onToggle={(event)=>setMatrixOpen((event.currentTarget as HTMLDetailsElement).open)}>
      <summary>Open the complete 100 × 100 distance matrix</summary>
      {matrixOpen&&table(true)}
    </details>
    <h2 className="od-case-section-heading">Step 3 · Detect the outlier</h2>
    <p>Plot the Min distances calculated in Step 2—not the original revenue values. The histogram and box plot make Store 57’s unusually large nearest-neighbor distance stand out.</p>
    <NeighborDistribution onChooseStore={()=>setSelectedStore(57)} />
    <div className="od-result-strip"><div><span>Selected nearest-neighbor distance</span><strong>{selected.distance.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}</strong><small>Store {selected.store.store} · nearest store {selected.nearestStore}</small></div><section className="od-case-conclusion" aria-labelledby="od-store-conclusion"><h2 id="od-store-conclusion">Case study conclusion</h2><p><strong>Store 57 is far from every other store</strong> in this three-category revenue space. Its row is highlighted in the source table and distance plots.</p></section></div>
  </article>
}

export function TimeSeriesOutliers() {
  return <article className={BASE_CLASS}>
    <Header eyebrow="20.6 · Time-series outliers" title="Time-series outliers" intro="Account for trend and seasonality." />
    <div className="od-time-flow" aria-label="Time-series outlier detection steps"><section><span>01</span><h2>Fit the expected pattern</h2><p>Use a time trend and seasonal indicators, such as hour-of-day categories.</p></section><b aria-hidden="true">→</b><section><span>02</span><h2>Calculate each residual</h2><div className="od-time-equation"><div><i>e</i><sub>t</sub> = <i>y</i><sub>t</sub> − <i>ŷ</i><sub>t</sub></div><p><i>e</i><sub>t</sub> = residual<br/><i>y</i><sub>t</sub> = observed value<br/><i>ŷ</i><sub>t</sub> = predicted value at time <i>t</i></p></div></section><b aria-hidden="true">→</b><section><span>03</span><h2>Inspect the residuals</h2><p>A very large positive or negative residual means that point fell far from its expected value.</p></section></div>
    <figure className="od-source-figure"><img src={pdfTime343} alt="Three source panels show an observed seasonal series, a fitted regression and residuals, then a residual box plot with one unusual point highlighted."/><figcaption>First account for the expected time pattern; then inspect the remaining errors.</figcaption></figure>
    <p className="od-note">The detection task is unsupervised because the unusual observations have no supplied labels. Regression is an intermediate tool for estimating expected sessions.</p>
  </article>
}

const PDF_TIME_STEPS = [
  { title:'8,760 hourly sessions', detail:'The recurring hourly pattern and gradual increase make a visual scan difficult.', src:pdfTime344, alt:'Hourly website sessions across a year, showing dense repeating cycles and a slow upward trend.' },
  { title:'The raw distribution hides the anomaly', detail:'The histogram shows the recurring low- and high-session periods, but the inserted outlier does not stand apart.', src:pdfTime345, alt:'Course slide with the hourly session series and its histogram; the raw histogram does not expose the anomaly.' },
  { title:'Model time and hour of day', detail:'Use a linear time step for the trend and one-hot indicators for hour-of-day seasonality. Compare observed sessions with predictions.', src:pdfTime346, alt:'Website-session model table and slide explanation showing time step and hour indicators as predictors.' },
  { title:'A residual distribution exposes it', detail:'After subtracting predictions from observations, the box plot shows one unusually low residual.', src:pdfTime347, alt:'Residual table and box plot with one unusually low residual circled.' },
] as const

export function TimeSeriesExample() {
  const { step, isPlaying, reducedMotion, showStep, togglePlayback } = useStepPlayback(PDF_TIME_STEPS.length)
  const current=PDF_TIME_STEPS[step]
  return <article className={BASE_CLASS}>
    <Header eyebrow="20.7 · Time-series outlier example" title="Seasonality can hide an unusual hour" intro="Follow the course’s 8,760-hour website-sessions example from the raw series to the residual box plot." />
    <section className="od-source-stepper od-source-stepper--time"><div className="od-source-stepper__copy"><p className="od-eyebrow">{String(step+1).padStart(2,'0')} / {PDF_TIME_STEPS.length}</p><h2>{current.title}</h2><p>{current.detail}</p><nav aria-label="Website sessions example steps">{PDF_TIME_STEPS.map((item,i)=><button key={item.title} type="button" aria-label={`Show step ${i+1}: ${item.title}`} aria-current={step===i?'step':undefined} onClick={()=>showStep(i)}>{i+1}</button>)}</nav><PlaybackControls ariaLabel="Website sessions example" step={step} stepCount={PDF_TIME_STEPS.length} isPlaying={isPlaying} reducedMotion={reducedMotion} onToggle={togglePlayback} onPrevious={()=>showStep(step-1)} onNext={()=>showStep(step+1)}/></div><figure><img src={current.src} alt={current.alt}/><figcaption>Website sessions · hourly observations</figcaption></figure></section>
    <div className="od-residual-formula"><div className="od-residual-equation"><i>e</i><sub>t</sub> = <i>y</i><sub>t</sub> − <i>ŷ</i><sub>t</sub></div><p className="od-residual-labels"><i>e</i><sub>t</sub> = residual<br/><i>y</i><sub>t</sub> = observed sessions at hour <i>t</i><br/><i>ŷ</i><sub>t</sub> = predicted sessions at hour <i>t</i></p><p className="od-residual-interpretation">Positive means the model underpredicted. Negative means it overpredicted.</p></div>
    <p className="od-note">An unusual residual deserves investigation. The source reminds us that a real anomaly can be valuable information, not automatically a bad record.</p>
  </article>
}

export function OutlierTakeaways() {
  return <article className={BASE_CLASS}>
    <Header eyebrow="20.8 · Key takeaways" title="Key takeaways" intro={<><strong>Outlier detection</strong> is used to identify observations in a dataset which are either <strong>unexpected</strong> or <strong>statistically different</strong> from the others.</>} />
    <section className="od-recap" aria-label="Key takeaways">
      <div className="od-recap__item"><span aria-hidden="true">✓</span><div><h2>Common use cases</h2><p><em>Common use cases include detecting web traffic anomalies, flagging fraudulent credit card transactions, identifying unusually high or low-performing store locations, etc.</em></p></div></div>
      <div className="od-recap__item"><span aria-hidden="true">✓</span><div><h2>Cross-sectional analysis</h2><p>For cross-sectional analysis, plotting <strong>“nearest neighbor” distances</strong> can help detect anomalies when visual profiling falls short.</p><p className="od-recap__detail"><em>This approach is ideal for exposing outliers in large, complex or highly-dimensional datasets.</em></p></div></div>
      <div className="od-recap__item"><span aria-hidden="true">✓</span><div><h2>Time-series analysis</h2><p>For time-series analysis, you can fit a <strong>regression model</strong> to the data and plot the residuals to clearly identify outliers.</p><p className="od-recap__detail"><em>This allows you to quickly find outliers, while controlling for seasonality and trending.</em></p></div></div>
    </section>
    <section className="od-recap-workflow"><p className="od-eyebrow">Putting it into practice</p><h2>A practical order of checks</h2><ol><li><strong>Start with the data.</strong> Check unusual values against their source and context.</li><li><strong>Choose the comparison.</strong> For cross-sectional data, inspect plots and use nearest-neighbor distances when visual profiling falls short; scale features when their units or ranges differ. For a time series, model trend and seasonality and inspect residuals instead.</li><li><strong>Investigate before acting.</strong> Determine whether a flag is a recording error or a legitimate event.</li></ol></section>
    <section className="od-recap-note"><h2>Note</h2><p>Correct or exclude a confirmed recording error. A genuine unusual observation may instead be a useful business signal, so investigate it before acting.</p></section>
  </article>
}

type Question = { prompt: string; options: string[]; answer: number; explanation: string }
const OUTLIER_QUIZ: Question[] = [
  { prompt:'Which type of outlier should be corrected or excluded from an analysis?', options:['A value caused by a recording issue or human error','A value that is statistically far from other values','A value discovered with a nearest-neighbor calculation','A legitimate unusually high sale'], answer:0, explanation:'A recording issue is invalid data. Verify it, correct it when possible, or exclude the bad record.' },
  { prompt:'Which distance can help detect unusual observations in cross-sectional data?', options:['Parabolic distance','Nearest-neighbor distance','Mean distance','Linear distance'], answer:1, explanation:'The nearest-neighbor distance measures how far each observation is from its closest other observation.' },
  { prompt:'When is visual analysis especially likely to miss a cross-sectional outlier?', options:['When the data has many dimensions','When every value is positive','When there are no null values','When the observations are sorted'], answer:0, explanation:'A chart can show only a few dimensions at once, so a point may look ordinary in every pairwise view.' },
  { prompt:'Which model can help identify time-series outliers after accounting for trend and seasonality?', options:['KNN classification','Naïve Bayes','Support Vector Machine','Regression'], answer:3, explanation:'A regression model estimates the expected value from time trend and seasonal indicators; residuals show departures from it.' },
  { prompt:'What can you plot to expose unusual observations in a time-series model?', options:['Sum of Squared Error','Standard deviation','Residuals','Maximum and minimum values'], answer:2, explanation:'A residual is the observed value minus the prediction. An unusually large residual signals a point far from the fitted pattern.' },
  { prompt:'Before calculating nearest-neighbor distances, what should you do if features use different units or ranges?', options:['Normalize or scale the features','Sort the records','Split the data into train and test sets','Remove every extreme value'], answer:0, explanation:'Scaling prevents a feature with large numeric units from dominating the distance calculation.' },
]

export function OutlierQuiz() {
  const [index,setIndex]=useState(0), [choice,setChoice]=useState<number|null>(null), [checked,setChecked]=useState(false), [answers,setAnswers]=useState<Record<number,boolean>>({})
  const question=OUTLIER_QUIZ[index], complete=Object.keys(answers).length===OUTLIER_QUIZ.length
  const select=(i:number)=>{setIndex(i);setChoice(null);setChecked(false)}
  const check=()=>{if(choice===null)return;setAnswers({...answers,[index]:choice===question.answer});setChecked(true)}
  const next=()=>{if(index<OUTLIER_QUIZ.length-1)select(index+1)}
  return <article className={BASE_CLASS}>
    <Header eyebrow="20.9 · Optional quiz" title="Check the outlier ideas" intro="Answer the source questions in order. Lessons and chapter navigation stay open whether or not you complete the quiz." />
    <nav className="od-quiz-map" aria-label="Quiz questions">{OUTLIER_QUIZ.map((_,i)=><button type="button" key={i} aria-current={index===i?'step':undefined} onClick={()=>select(i)}>{i+1}</button>)}</nav>
    <section className="od-quiz-card"><fieldset><legend>{index+1}. {question.prompt}</legend><div className="od-quiz-options">{question.options.map((option,i)=><label key={option} className={`${choice===i?'selected':''} ${checked&&i===question.answer?'correct':''}`}><input type="radio" name={`outlier-${index}`} value={i} checked={choice===i} onChange={()=>setChoice(i)} disabled={checked}/><span>{option}</span></label>)}</div></fieldset>
      {checked&&<div className={`od-quiz-feedback ${choice===question.answer?'':'review'}`} role="status"><strong>{choice===question.answer?'Correct':'Review the explanation'}</strong><p>{question.explanation}</p></div>}
      <div className="od-quiz-actions"><span>Question {index+1} of {OUTLIER_QUIZ.length}</span><div>{checked&&index>0&&<button type="button" onClick={()=>select(index-1)}>← Previous</button>}{!checked?<button type="button" className="od-primary" disabled={choice===null} onClick={check}>Check answer</button>:<button type="button" className="od-primary" onClick={next} disabled={index===OUTLIER_QUIZ.length-1}>Next question →</button>}</div></div>
    </section>
    <p className="od-quiz-summary">Completed answers <strong>{Object.keys(answers).length} / {OUTLIER_QUIZ.length}</strong>{complete&&<span> · Correct <strong>{Object.values(answers).filter(Boolean).length} / {OUTLIER_QUIZ.length}</strong></span>}</p>
  </article>
}
