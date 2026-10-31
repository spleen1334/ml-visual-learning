import { useEffect, useState } from 'react'
import { PlaybackButton } from '../components/PlaybackButton'
import './UnsupervisedClustering.css'
import basicsCloud from '../assets/clustering-basics-cloud.png'
import basicsGroups from '../assets/clustering-basics-groups.png'
import kmeansStep1 from '../assets/kmeans-source-step-1.png'
import kmeansStep2 from '../assets/kmeans-source-step-2.png'
import kmeansStep3 from '../assets/kmeans-source-step-3.png'
import kmeansStep4 from '../assets/kmeans-source-step-4.png'
import kmeansStep5 from '../assets/kmeans-source-step-5.png'
import kmeansStep6 from '../assets/kmeans-source-step-6.png'
import hierarchicalStart from '../assets/hierarchical-187-step-0.png'
import hierarchicalMerge1 from '../assets/hierarchical-187-step-1.png'
import hierarchicalMerge2 from '../assets/hierarchical-187-step-2.png'
import hierarchicalMerge3 from '../assets/hierarchical-187-step-3.png'
import hierarchicalMerge4 from '../assets/hierarchical-187-step-4.png'
import hierarchicalMerge5 from '../assets/hierarchical-187-step-5.png'
import dendrogramAnnotated from '../assets/hierarchical-188-annotated.png'
import nonCircularSource from '../assets/hierarchical-noncircular-compare.png'
import wssDistances from '../assets/wss-source-distances.png'
import wssPoints from '../assets/wss-source-points.png'
import wssLines from '../assets/wss-source-lines.png'
import wssElbow from '../assets/wss-source-elbow.png'
import wssElbowK2 from '../assets/wss-elbow-k2.png'
import wssElbowRerun from '../assets/wss-elbow-rerun.png'

const COLORS = ['#347fb0', '#d0a021', '#3d8660'] as const
const CUSTOMER_DATA = [
  [1, 6.96, 94.69], [2, 9.38, 101.45], [3, 6.34, 102.12], [4, 4.96, 100.77], [5, 5.60, 92.28],
  [6, 6.08, 98.28], [7, 7.95, 97.79], [8, 7.81, 44.12], [9, 6.15, 103.76], [10, 6.82, 61.88],
  [11, 6.98, 34.89], [12, 5.37, 96.46], [13, 5.48, 102.56], [14, 6.87, 104.31], [15, 6.35, 77.87],
  [16, 6.89, 81.67], [17, 8.77, 31.76], [18, 6.80, 90.12], [19, 2.25, 69.70], [20, 2.86, 82.26],
  [21, 4.87, 62.01], [22, 2.56, 52.38], [23, 2.03, 67.73], [24, 1.70, 57.52], [25, 3.34, 78.36],
  [26, 4.63, 66.80], [27, 1.76, 83.56], [28, 2.84, 64.49], [29, 2.40, 36.94], [30, 2.91, 70.89],
  [31, 7.79, 58.28], [32, 2.49, 66.35], [33, 3.87, 56.33], [34, 4.45, 80.82], [35, 7.71, 21.31],
  [36, 1.64, 48.85], [37, 2.45, 72.66], [38, 7.54, 45.34], [39, 3.89, 69.76], [40, 2.75, 82.28],
  [41, 7.25, 55.19], [42, 4.10, 57.65], [43, 3.55, 41.32], [44, 2.29, 54.65], [45, 1.85, 43.57],
  [46, 3.63, 58.54], [47, 6.02, 45.99], [48, 2.59, 56.68], [49, 5.84, 105.62], [50, 3.11, 31.88],
] as const

type Point = { id: number; opens: number; spend: number; x: number; y: number }
type Center = { x: number; y: number }
type Assignment = { point: Point; distances: number[]; cluster: number; distance: number }
type Round = { centers: Center[]; assignments: Assignment[]; nextCenters: Center[]; totalDistance: number; counts: number[] }

const minimum = (values: number[]) => Math.min(...values)
const maximum = (values: number[]) => Math.max(...values)
const scalePoints = (): Point[] => {
  const openValues = CUSTOMER_DATA.map((row) => row[1])
  const spendValues = CUSTOMER_DATA.map((row) => row[2])
  const minOpen = minimum(openValues), maxOpen = maximum(openValues), minSpend = minimum(spendValues), maxSpend = maximum(spendValues)
  return CUSTOMER_DATA.map(([id, opens, spend]) => ({
    id, opens, spend,
    x: 1 + (opens - minOpen) * 99 / (maxOpen - minOpen),
    y: 1 + (spend - minSpend) * 99 / (maxSpend - minSpend),
  }))
}
const PET_POINTS = scalePoints()
const INITIAL_CENTERS: Center[] = [
  { x: 100, y: 95.1034278259 },
  { x: 42.3139534884, y: 48.7914838097 },
  { x: 1, y: 33.3385126320 },
]
const distance = (a: Center, b: Center) => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
function assignPoints(points: Point[], centers: Center[]): Assignment[] {
  return points.map((point) => {
    const pointCenter = { x: point.x, y: point.y }
    const distances = centers.map((center) => distance(pointCenter, center))
    const cluster = distances.indexOf(Math.min(...distances))
    return { point, distances, cluster, distance: distances[cluster] }
  })
}
function updateCenters(assignments: Assignment[], centers: Center[]): Center[] {
  return centers.map((center, i) => {
    const assigned = assignments.filter((item) => item.cluster === i)
    if (!assigned.length) return center
    return { x: assigned.reduce((sum, item) => sum + item.point.x, 0) / assigned.length, y: assigned.reduce((sum, item) => sum + item.point.y, 0) / assigned.length }
  })
}
function createRounds(): Round[] {
  const rounds: Round[] = []
  let centers = INITIAL_CENTERS
  for (let i = 0; i < 4; i++) {
    const assignments = assignPoints(PET_POINTS, centers)
    const counts = centers.map((_, cluster) => assignments.filter((item) => item.cluster === cluster).length)
    const nextCenters = updateCenters(assignments, centers)
    rounds.push({ centers, assignments, nextCenters, counts, totalDistance: assignments.reduce((sum, item) => sum + item.distance, 0) })
    centers = nextCenters
  }
  return rounds
}
const PET_ROUNDS = createRounds()
const fmt = (value: number, places = 1) => value.toFixed(places)

const Header = ({ eyebrow, title, intro }: { eyebrow: string; title: string; intro: string }) => <header className="cluster-header"><p className="cluster-eyebrow">{eyebrow}</p><h1>{title}</h1><p>{intro}</p></header>

export function ClusterIntroduction() {
  return <article className="cluster-lesson">
    <Header eyebrow="18.1 · Clustering & segmentation" title="Clustering & segmentation" intro="In this section we’ll introduce the fundamentals of clustering and segmentation and compare two common unsupervised models: K-Means and hierarchical clustering." />
    <p className="cluster-intro-terminology">In this course, <strong>clustering</strong> and <strong>segmentation</strong> are used interchangeably.</p>
    <section className="cluster-intro-overview" aria-label="Topics and goals for this section">
      <div className="cluster-intro-topics"><h2>Topics we’ll cover</h2><ol><li>Clustering Basics</li><li>K-Means</li><li>Hierarchical Clustering</li><li>Key Takeaways</li></ol></div>
      <div className="cluster-intro-goals"><h2>Goals for this section</h2><ul><li>Understand how segmentation and clustering models fundamentally work</li><li>Explore common models including K-Means and hierarchical clustering</li><li>Compare and contrast common clustering models</li></ul></div>
    </section>
    <aside className="cluster-callout"><strong>Remember:</strong> There is no universal “right” answer or single optimization metric for clustering and segmentation. The best outputs help you <strong>answer the question at hand and make practical, data-driven business decisions.</strong></aside>
  </article>
}

export function ClusterBasics() {
  const [showGroups, setShowGroups] = useState(false)
  return <article className="cluster-lesson">
    <Header eyebrow="18.2 · Clustering basics" title="A cluster is a group of similar observations" intro="Clustering organizes observations by similarity, even when there is no target label telling us the groups in advance." />
    <div className="cluster-definition"><div><p className="cluster-eyebrow">The central idea</p><h2>Similar within a group.<br />Distinct from other groups.</h2><p>Compare the source point cloud before and after its three groups are highlighted.</p></div><figure className="cluster-source-figure"><img src={showGroups ? basicsGroups : basicsCloud} alt={showGroups ? 'The source scatterplot with three distinct point groups highlighted in amber, violet and turquoise' : 'The source scatterplot with an unlabeled cloud of observations'} /><figcaption>Source scatterplot · {showGroups ? 'groups highlighted' : 'observations before grouping'}</figcaption><div className="cluster-source-controls" role="group" aria-label="Source clustering illustration"><button type="button" disabled={!showGroups} onClick={() => setShowGroups(false)}>Before</button><button type="button" disabled={showGroups} onClick={() => setShowGroups(true)}>Show groups</button></div></figure></div>
    <p className="cluster-note">A scatterplot can show similarity when there are two features. With many dimensions, a picture cannot display every relationship, so an algorithm can help organize the data.</p>
    <section className="cluster-process" aria-label="Clustering workflow">
      <div className="cluster-process__step"><span>Extract</span><p><strong>Collect the raw data</strong> you need for analysis, such as transactions, customer records, survey results and website pathing.</p></div>
      <div className="cluster-process__step"><span>Transform</span><p>Use <strong>feature engineering</strong> to create clear, intuitive dimensions that help you interpret each cluster and make actionable recommendations.</p></div>
      <div className="cluster-process__step"><span>Model</span><p>Apply and compare one or more <strong>clustering models</strong> iteratively. Determine an appropriate number of clusters based on the model output and business context.</p></div>
      <div className="cluster-process__step"><span>Interpret</span><p>Use <strong>multivariate analysis</strong> to understand each cluster’s characteristics through profiling metrics and distributions. The model assigns observations to clusters; <strong>it won’t interpret them for you.</strong></p></div>
    </section>
  </article>
}

export function KMeansIntroduction() {
  const [step, setStep] = useState(0)
  const steps = [
    { title: 'Step 1', detail: 'Determine what you think might be an appropriate number of clusters (in this case 2), and select arbitrary locations as initial centroids.', image: kmeansStep1 },
    { title: 'Step 2', detail: 'Assign each observation to a cluster, based on the closest centroid.', image: kmeansStep2 },
    { title: 'Step 3', detail: 'Relocate each centroid to the mean of its assigned observations, and reassign each observation to the new closest centroid.', image: kmeansStep3 },
    { title: 'Step 3', detail: 'Relocate each centroid to the mean of its assigned observations, and reassign each observation to the new closest centroid.', image: kmeansStep4 },
    { title: 'Step 4', detail: 'Continue to relocate each centroid to the mean of its assigned observations, until the clusters no longer change.', image: kmeansStep5 },
    { title: 'Step 4', detail: 'Continue to relocate each centroid to the mean of its assigned observations, until the clusters no longer change.', image: kmeansStep6 },
  ] as const
  return <article className="cluster-lesson">
    <header className="cluster-header kmeans-intro"><p className="cluster-eyebrow">18.3 · Intro to K-Means</p><h1>K-Means</h1><p><strong>K-Means</strong> is a common algorithm that <strong>assigns each observation in a dataset to a specific cluster</strong>, where <strong>K is the number of clusters</strong>.</p></header>
    <section className="kmeans-terms" aria-label="Key terms"><h2>Key terms</h2><p><strong>Centroid:</strong> a cluster center. Starting centers are chosen first; later, each center is the average position of its assigned observations.</p><p><strong>Mean:</strong> the average, found by adding values and dividing by how many there are.</p></section>
    <section className="kmeans-examples"><h2>Example use cases</h2><ul><li>Identifying customer segments for targeted marketing campaigns</li><li>Clustering store locations based on factors like sales, ratings, size, etc.</li></ul></section>
    <section className="kmeans-demo" aria-labelledby="kmeans-demo-title">
      <div className="kmeans-demo__steps"><p className="cluster-eyebrow">The K-Means loop</p><h2 id="kmeans-demo-title">{steps[step].title}</h2><p>{steps[step].detail}</p><nav aria-label="K-Means graph views">{steps.map((item,i)=><button type="button" key={item.image} aria-label={`Graph view ${i+1}: ${item.title}`} aria-current={step===i?'step':undefined} onClick={()=>setStep(i)}>{i+1}</button>)}</nav><div className="kmeans-demo__nav"><PlaybackButton action="previous" label="Previous K-Means step" disabled={step===0} onClick={()=>setStep(step-1)}/><PlaybackButton action="next" label="Next K-Means step" disabled={step===steps.length-1} onClick={()=>setStep(step+1)}/></div></div>
      <figure className="kmeans-demo__visual"><img src={steps[step].image} alt={`K-Means scatterplot, ${steps[step].title.toLowerCase()}: ${steps[step].detail}`} /><figcaption>Two clusters · selected centers and their assignments</figcaption></figure>
    </section>
  </article>
}

export function WssElbowLesson() {
  const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
  const [step, setStep] = useState(() => reducedMotion() ? 2 : 0)
  const [playing, setPlaying] = useState(() => !reducedMotion())
  const [elbowStep, setElbowStep] = useState(() => reducedMotion() ? 2 : 0)
  const [elbowPlaying, setElbowPlaying] = useState(() => !reducedMotion())
  const steps = [
    { image: wssPoints, detail: 'Start with the same two clusters and their centroids.', alt: 'Two colored clusters and their centroids.' },
    { image: wssLines, detail: 'Show the distance from each observation to its own cluster centroid.', alt: 'Lines connect each observation to its own cluster centroid.' },
    { image: wssDistances, detail: 'Square these distances and sum them to calculate WSS for the two clusters (K = 2).', alt: 'The two clusters and their distances, with an instruction to square and sum the distances.' },
  ]
  useEffect(() => {
    if (!playing) return
    const timer = window.setTimeout(() => {
      if (step >= 1) { setStep(2); setPlaying(false) } else setStep(step + 1)
    }, 3000)
    return () => window.clearTimeout(timer)
  }, [playing, step])
  useEffect(() => {
    if (!elbowPlaying) return
    const timer = window.setTimeout(() => {
      if (elbowStep >= 1) { setElbowStep(2); setElbowPlaying(false) } else setElbowStep(elbowStep + 1)
    }, 4000)
    return () => window.clearTimeout(timer)
  }, [elbowPlaying, elbowStep])
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => { if (query.matches) { setStep(2); setPlaying(false); setElbowStep(2); setElbowPlaying(false) } }
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])
  const move = (next: number) => { setPlaying(false); setStep(next) }
  return <article className="cluster-lesson">
    <header className="cluster-header"><p className="cluster-eyebrow">18.4 · WSS & elbow plots</p><h1>How do we know what’s the “right” number of clusters (K)?</h1><p>There is no “right” or “wrong” number of clusters, but <strong>within-cluster sum of squares (WSS)</strong> can help inform the decision.</p></header>
    <div className="wss-layout"><figure className="wss-distance-figure"><img src={steps[step].image} alt={steps[step].alt} /><figcaption>Two clusters · K = 2</figcaption></figure><div className="wss-explanation"><h2>Within-cluster sum of squares</h2><p><strong>WSS is the sum of the squared distances from each observation to its own cluster centroid.</strong></p><p className="wss-step" aria-live="polite"><span>Step {step + 1} of 3</span>{steps[step].detail}</p><div className="wss-playback" aria-label="WSS graph playback"><PlaybackButton action="previous" label="Previous WSS step" disabled={step === 0} onClick={() => move(step - 1)} /><PlaybackButton action={playing ? 'pause' : step === 2 ? 'replay' : 'play'} label={playing ? 'Pause WSS steps' : step === 2 ? 'Replay WSS steps' : 'Play WSS steps'} onClick={() => { if (playing) setPlaying(false); else { if (step === 2) setStep(0); setPlaying(true) } }} /><PlaybackButton action="next" label="Next WSS step" disabled={step === 2} onClick={() => move(step + 1)} /></div></div></div>
    <div className="wss-layout wss-elbow-section"><figure className="wss-chart"><img src={[wssElbowK2, wssElbowRerun, wssElbow][elbowStep]} alt={['WSS plotted for two clusters, K equals 2.', 'WSS plotted for K equals 2 through 8, with arrows indicating the additional model runs.', 'WSS plotted for K equals 2 through 8, with an arrow pointing to K equals 5 as the elbow.'][elbowStep]} /></figure><div className="wss-explanation"><h2>Look for the elbow</h2><p className="wss-step" aria-live="polite"><span>Step {elbowStep + 1} of 3</span>{elbowStep === 0 ? 'Plot the WSS for the model with two clusters (K = 2).' : elbowStep === 1 ? 'Rerun the model with additional clusters and plot the WSS for each value of K.' : <>Look for an <strong>“elbow” or inflection point</strong>, where adding another cluster has a relatively small impact on WSS. Here the curve flattens after <strong>K = 5</strong>.</>}</p><div className="wss-playback" aria-label="Elbow graph playback"><PlaybackButton action="previous" label="Previous elbow plot step" disabled={elbowStep === 0} onClick={() => { setElbowPlaying(false); setElbowStep(elbowStep - 1) }} /><PlaybackButton action={elbowPlaying ? 'pause' : elbowStep === 2 ? 'replay' : 'play'} label={elbowPlaying ? 'Pause elbow plot steps' : elbowStep === 2 ? 'Replay elbow plot steps' : 'Play elbow plot steps'} onClick={() => { if (elbowPlaying) setElbowPlaying(false); else { if (elbowStep === 2) setElbowStep(0); setElbowPlaying(true) } }} /><PlaybackButton action="next" label="Next elbow plot step" disabled={elbowStep === 2} onClick={() => { setElbowPlaying(false); setElbowStep(elbowStep + 1) }} /></div><p>Think of the elbow as a <strong>guideline, not a strict rule</strong>. The plot will look different for each dataset.</p><p>Consider whether the number of clusters is useful in practice: five customer segments may be more actionable for a marketing team than twenty.</p></div></div>
  </article>
}

export function KMeansFaqs() {
  return <article className="cluster-lesson">
    <Header eyebrow="18.5 · K-Means FAQs" title="K-Means FAQs" intro="Let’s cover some key questions about K-Means." />
    <div className="cluster-faqs">
      <section><span>01 · DIMENSIONS</span><h2>Can we create clusters based on more than 2 dimensions?</h2><ul><li>Yes! K-Means and WSS plots can scale to more than two dimensions.</li><li>At higher dimensions, <strong>profiling metrics</strong>—measures of each cluster’s characteristics—help us understand what each cluster represents, since we can’t compare all dimensions visually.</li></ul></section>
      <section><span>02 · SHAPE</span><h2>Does the shape of the clusters matter?</h2><ul><li>Yes. K-Means works best when clusters are mostly <strong>circular in shape</strong>. Other tools, like hierarchical clustering, can help address non-circular shapes.</li></ul></section>
      <section><span>03 · STARTING CENTERS</span><h2>Does the initial centroid location make a difference?</h2><ul><li>It can. A common practice is to rerun the model for the <strong>same K with multiple random starts</strong>, then compare WSS.</li><li>For example, run the two-cluster solution several times and select the run with the lowest WSS among those runs.</li></ul></section>
    </div>
  </article>
}

function PetPalsChart({ round }: { round: Round }) {
  const xPos = (value: number) => 76 + (value + 20) / 140 * 530
  const yPos = (value: number) => 340 - (value + 20) / 140 * 282
  return <svg className="pet-chart" viewBox="0 0 670 415" role="img" aria-labelledby="pet-chart-title pet-chart-desc">
    <title id="pet-chart-title">Pet Pals, promotional email opens and customer spend, scaled from 1 to 100</title>
    <desc id="pet-chart-desc">All 50 customers are plotted by scaled email opens on the horizontal axis and scaled total spend on the vertical axis. Point colors show the nearest center for this iteration. Filled squares show the current centroids; hollow diamonds show the recomputed means.</desc>
    <path className="pet-axis" d="M76 58V340H606" />
    {[-20,0,20,40,60,80,100,120].map((tick) => <g key={`x${tick}`}><path className="pet-tick" d={`M${xPos(tick)} 340v5`} /><text x={xPos(tick)} y="365" textAnchor="middle">{tick}</text></g>)}
    {[-20,0,20,40,60,80,100,120].map((tick) => <g key={`y${tick}`}><path className="pet-tick" d={`M71 ${yPos(tick)}h5`} /><text x="62" y={yPos(tick)+4} textAnchor="end">{tick}</text></g>)}
    <text x="341" y="400" textAnchor="middle">Average promotional email opens / week · scaled 1–100</text>
    <text transform="translate(18 203) rotate(-90)" textAnchor="middle">Total spend · scaled 1–100</text>
    {round.assignments.map((item) => <circle key={item.point.id} cx={xPos(item.point.x)} cy={yPos(item.point.y)} r="4.3" fill={COLORS[item.cluster]}><title>{`Customer ${item.point.id}: ${fmt(item.point.x,2)} opens scale, ${fmt(item.point.y,2)} spend scale, Cluster ${item.cluster+1}`}</title></circle>)}
    {round.centers.map((center,i) => <g key={`center${i}`} transform={`translate(${xPos(center.x)} ${yPos(center.y)})`}><rect x="-7" y="-7" width="14" height="14" fill={COLORS[i]} stroke="#173b3d" strokeWidth="1.5"/><title>{`Cluster ${i+1} center used in this assignment: (${fmt(center.x,2)}, ${fmt(center.y,2)})`}</title></g>)}
    {round.nextCenters.map((center,i) => <g key={`next${i}`} transform={`translate(${xPos(center.x)} ${yPos(center.y)})`}><path d="M0 -8L8 0 0 8 -8 0Z" fill="#fffefa" stroke={COLORS[i]} strokeWidth="3"/><title>{`Cluster ${i+1} new mean: (${fmt(center.x,2)}, ${fmt(center.y,2)})`}</title></g>)}
  </svg>
}

export function KMeansPetPalsCase() {
  const [roundIndex, setRoundIndex] = useState(0)
  const round = PET_ROUNDS[roundIndex]
  const previousTotal = roundIndex > 0 ? PET_ROUNDS[roundIndex-1].totalDistance : null
  const reduction = previousTotal ? (previousTotal-round.totalDistance)/previousTotal*100 : null
  return <article className="cluster-lesson">
    <Header eyebrow="18.6 · Case study: K-Means" title="Group Pet Pals customers by opens and spend" intro="Pet Pals sells custom 3D-printed pet models. Explore customer email opens per week and total spend to identify segments and suggest marketing actions." />
    <section className="pet-workbench">
      <p className="pet-case-intro">The worksheet scales each input from 1 to 100 and starts with three manually selected centers: customers 2, 21 and 36. The three colored rows mark the starting centers. Each round below has its own calculations.</p>
      <details className="pet-calculation"><summary>How are the values calculated?</summary><p><strong>Scale:</strong> 1 + (value − minimum) × 99 ÷ (maximum − minimum). Opens: 1.64–9.38 per week; spend: $21.31–$105.62.</p><p><strong>Distance:</strong> √[(scaled opens − center opens)² + (scaled spend − center spend)²]. Each new center is the mean of its assigned points.</p></details>
      <section className="pet-input-section" aria-labelledby="pet-input-title">
        <h2 id="pet-input-title">Customer data</h2>
        <p>Starting centers: <span className="pet-key pet-key-1">1 · blue</span>, <span className="pet-key pet-key-2">2 · yellow</span>, <span className="pet-key pet-key-3">3 · green</span>. Scaled values are used in the distance calculations.</p>
        <div className="pet-data-wrap pet-input-scroll" role="region" aria-label="All 50 customer records and starting centers" tabIndex={0}><table className="pet-data pet-input-table"><thead><tr><td colSpan={4} className="pet-input-header-spacer" aria-hidden="true"></td><th colSpan={2} scope="colgroup" className="pet-scaled-head">SCALED VALUES (1–100)</th></tr><tr><th scope="col">Cluster</th><th scope="col">Cust ID</th><th scope="col">Email Opens</th><th scope="col">Total Spent</th><th scope="col">Email Opens</th><th scope="col">Total Spent</th></tr></thead><tbody>{PET_POINTS.map(point=>{ const seed = [2,21,36].indexOf(point.id); return <tr key={point.id} className={seed >= 0 ? `pet-seed-${seed+1}` : undefined}><td>{seed >= 0 ? <span aria-label={`Starting center, cluster ${seed+1}`}>{seed+1}</span> : ''}</td><th scope="row">{point.id}</th><td>{fmt(point.opens,2)}</td><td>${fmt(point.spend,2)}</td><td>{fmt(point.x,2)}</td><td>{fmt(point.y,2)}</td></tr> })}</tbody></table></div>
      </section>
      <div className="pet-graph-heading"><h2>Cluster graph</h2><p>Select a round to view its graph and results.</p></div>
      <div className="pet-round-nav" role="group" aria-label="Select graph round">{PET_ROUNDS.map((_,i)=><button type="button" key={i} aria-pressed={roundIndex===i} onClick={()=>setRoundIndex(i)}>Round {i+1}</button>)}</div>
      <div className="pet-chart-layout"><figure className="pet-chart-frame"><PetPalsChart round={round}/><figcaption>Scaled values. Squares mark the centers used for this round; diamonds show the new means.</figcaption></figure>
        <aside className="pet-round-stats"><h3>Round {roundIndex+1} results</h3><p className="pet-distance-value">{fmt(round.totalDistance,2)}</p><span className="pet-distance-label">Total Distance</span>{reduction!==null&&<p className="pet-reduction">↓ {fmt(reduction,2)}% from the previous round</p>}<p className="pet-distance-note">Sum of unsquared distances, not WSS.</p><table><caption>Customer assignments</caption><thead><tr><th>Cluster</th><th>Customers</th></tr></thead><tbody>{round.counts.map((count,i)=><tr key={i}><th><i style={{background:COLORS[i]}}/>Cluster {i+1}</th><td>{count}</td></tr>)}</tbody><tfoot><tr><th>Total</th><td>50</td></tr></tfoot></table></aside>
      </div>
      <div className="pet-round-tables"><h2>Round calculations</h2><p>Each round assigns all 50 customers to the nearest center. The cluster tables show the assigned scaled values; their means become the next round’s centers. Scroll within each round to see all rows.</p>
        {PET_ROUNDS.map((item, roundNumber)=><section className="pet-round-block" key={roundNumber} aria-labelledby={`pet-round-${roundNumber+1}`}><div className="pet-round-block-heading"><h3 id={`pet-round-${roundNumber+1}`}>Round {roundNumber+1}</h3><span>{roundNumber===0?'Starting centers':'Uses the previous round’s means'}</span></div><div className="pet-round-scroll" role="region" aria-label={`Round ${roundNumber+1} distances and cluster tables, 50 customers`} tabIndex={0}><div className="pet-round-tables-row">
          <table className="pet-round-table pet-distances"><caption>ROUND {roundNumber+1}</caption><thead><tr><th scope="col">Cust ID</th><th scope="col">Distance to #1</th><th scope="col">Distance to #2</th><th scope="col">Distance to #3</th><th scope="col">MIN</th><th scope="col">Closest Cluster</th></tr></thead><tbody>{item.assignments.map(({point,distances,cluster,distance:itemDistance})=><tr key={point.id}><th scope="row">{point.id}</th>{distances.map((d,i)=><td key={i} >{fmt(d,2)}</td>)}<td>{fmt(itemDistance,2)}</td><td className={`pet-closest pet-closest-${cluster+1}`}>{cluster+1}</td></tr>)}</tbody><tfoot><tr><th colSpan={6}>Total Distance: {fmt(item.totalDistance,2)}</th></tr></tfoot></table>
          {COLORS.map((_,i)=><table className={`pet-round-table pet-series pet-series-${i+1}`} key={i}><caption>CLUSTER #{i+1}</caption><thead><tr><th scope="col">Email Opens</th><th scope="col">Total Spent</th></tr></thead><tbody>{item.assignments.map(({point,cluster})=><tr key={point.id} className={cluster===i ? "pet-series-member" : "pet-series-empty"}><td aria-label={cluster===i ? undefined : "Not in this cluster"}>{cluster===i?fmt(point.x,2):null}</td><td aria-label={cluster===i ? undefined : "Not in this cluster"}>{cluster===i?fmt(point.y,2):null}</td></tr>)}</tbody><tfoot><tr><td title="Mean email opens">{fmt(item.nextCenters[i].x,2)}</td><td title="Mean total spent">{fmt(item.nextCenters[i].y,2)}</td></tr><tr><th colSpan={2}>Mean · {roundNumber < PET_ROUNDS.length - 1 ? `center for Round ${roundNumber+2}` : 'updated center'}</th></tr></tfoot></table>)}
        </div></div><p className="pet-round-footnote">Cluster table bottom row: <strong>Mean</strong>. Blank cells are not assigned to that cluster. Total Distance sums unsquared distances, not WSS.</p>{roundNumber === 0 && <section className="pet-round-explanation" aria-labelledby="pet-round-one-explanation"><h4 id="pet-round-one-explanation">How round 1 works</h4><p><strong>Choose centers.</strong> The worksheet chooses K = 3, so every one of the 50 customers is compared with three starting centers—not just three customers. The centers come from the <strong>scaled columns in Customer data</strong>: customer 2 for cluster 1, customer 21 for cluster 2, and customer 36 for cluster 3. The #1, #2 and #3 distance labels refer to these centers, not customer IDs.</p><p><strong>Calculate distance.</strong> For each customer, compare both scaled inputs with each center: √[(customer opens − center opens)² + (customer spend − center spend)²]. For customer 1 and center 1: √[(69.05 − 100.00)² + (87.17 − 95.10)²] ≈ <strong>31.96</strong>. Distances to centers 2 and 3 are 46.77 and 86.76. <strong>MIN</strong> is the smallest distance, 31.96, so the closest cluster is 1.</p><p><strong>Fill the cluster tables.</strong> Copy that customer's scaled opens and spend from <strong>Customer data</strong> into the assigned cluster table—not the distances or raw values. The other two tables stay blank for that row. The mean of each cluster's assigned scaled values becomes its center for round 2; customer coordinates do not change as centers move.</p><small>Values are displayed to two decimals; calculations use full precision, so arithmetic using the rounded values can differ slightly.</small></section>}</section>)}
      </div>
    </section>
    <section className="pet-interpretation"><h2>Conclusion</h2><p><strong>The four rounds reveal three customer segments with different patterns of email engagement and spending.</strong> These are ideas to test, not measured campaign effects.</p><div><p><i style={{background:COLORS[0]}}/><strong>Cluster 1:</strong> frequent opens and high spend. Consider no change.</p><p><i style={{background:COLORS[1]}}/><strong>Cluster 2:</strong> frequent opens and lower spend. Test a discount or promotion.</p><p><i style={{background:COLORS[2]}}/><strong>Cluster 3:</strong> few opens and mixed spend. Try a different outreach approach.</p></div><small>K = 3 was chosen for this walkthrough; further rounds, different K values and starting centers can be explored.</small></section>
  </article>
}

const MERGES = [
  { from: 'Plot the observations', detail: 'Each observation starts as its own cluster.', groups: ['p1','p2','p3','p4','p5','p6'] },
  { from: 'p5 + p6', detail: 'The closest pair joins. Five groups remain.', groups: ['p1','p2','p3','p4','(p5,p6)'] },
  { from: 'p2 + p3', detail: 'A second close pair joins. Four groups remain.', groups: ['p1','(p2,p3)','p4','(p5,p6)'] },
  { from: 'p1 + (p2,p3)', detail: 'The four-cluster cut becomes three groups.', groups: ['(p1,p2,p3)','p4','(p5,p6)'] },
  { from: 'p4 + (p1,p2,p3)', detail: 'The three groups become two.', groups: ['(p1,p2,p3,p4)','(p5,p6)'] },
  { from: '(p1,p2,p3,p4) + (p5,p6)', detail: 'The final two groups join into one.', groups: ['(p1,p2,p3,p4,p5,p6)'] },
] as const
const HIERARCHICAL_IMAGES = [hierarchicalStart, hierarchicalMerge1, hierarchicalMerge2, hierarchicalMerge3, hierarchicalMerge4, hierarchicalMerge5] as const

export function HierarchicalIntroduction() {
  const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const [merge, setMerge] = useState(() => reducedMotion() ? MERGES.length - 1 : 0)
  const [playing, setPlaying] = useState(() => !reducedMotion())
  useEffect(() => {
    if (!playing) return
    const timer = window.setTimeout(() => {
      if (merge >= MERGES.length - 2) { setMerge(MERGES.length - 1); setPlaying(false) }
      else setMerge(merge + 1)
    }, 2500)
    return () => window.clearTimeout(timer)
  }, [merge, playing])
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => { if (query.matches) { setMerge(MERGES.length - 1); setPlaying(false) } }
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])
  return <article className="cluster-lesson">
    <Header eyebrow="18.7 · Intro to hierarchical clustering" title="Hierarchical clustering" intro="Like K-Means, hierarchical clustering is an unsupervised learning technique that creates clusters by grouping similar data points together." />
    <section className="hierarchical-intro"><h2>How does it work?</h2><p>In its simplest form, using two dimensions:</p><ol><li>Create a scatterplot, find the two closest points, and group them into a cluster.</li><li>Find the next two closest points or clusters, and group them together.</li><li>Repeat until all points belong to a single cluster.</li></ol></section>
    <section className="hierarchical-terms" aria-label="Key ideas"><div><h2>Bottom-up, or agglomerative</h2><p>Start with individual points and <strong>join smaller groups</strong> until they form one cluster. Divisive, or “top-down,” clustering also exists but is less common.</p></div><div><h2>What is a dendrogram?</h2><p>A <strong>dendrogram is a tree diagram</strong> that shows how points and clusters are joined.</p></div></section>
    <p className="hierarchical-shape">K-Means works best with roughly circular groups. Hierarchical clustering can be useful for non-circular groups, depending on the data and how distances between groups are defined; compare the results of both methods.</p>
    <section className="hierarchical-stepper hierarchical-187"><div className="hierarchical-187__heading"><div><p className="cluster-eyebrow">Six observations · {merge === 0 ? 'starting point' : `merge ${merge} of 5`}</p><h2>{MERGES[merge].from}</h2><p aria-live="polite">{MERGES[merge].detail} <strong>{MERGES[merge].groups.length} {MERGES[merge].groups.length === 1 ? 'cluster' : 'clusters'}.</strong></p></div><div className="hierarchical-controls" aria-label="Clustering playback"><PlaybackButton action="previous" label="Previous clustering step" disabled={merge===0} onClick={()=>{setPlaying(false);setMerge(merge-1)}}/><PlaybackButton action={playing ? 'pause' : merge===MERGES.length-1 ? 'replay' : 'play'} label={playing ? 'Pause clustering steps' : merge===MERGES.length-1 ? 'Replay clustering steps' : 'Play clustering steps'} onClick={()=>{if (playing) setPlaying(false); else {if (merge===MERGES.length-1) setMerge(0); setPlaying(true)}}}/><PlaybackButton action="next" label="Next clustering step" disabled={merge===MERGES.length-1} onClick={()=>{setPlaying(false);setMerge(merge+1)}}/></div></div><figure className="hierarchical-source-figure"><img src={HIERARCHICAL_IMAGES[merge]} alt={`Scatterplot and dendrogram: ${MERGES[merge].from}. ${MERGES[merge].groups.length} clusters.`} /><figcaption>The scatterplot and dendrogram show the same groups. Unmerged points count as individual clusters. {merge > 0 && merge < 5 && 'The dashed line shows the current number of clusters.'}</figcaption></figure><p className="hierarchical-187__preview">The complete dendrogram is shown in gray as a preview to help follow the steps; it is not known in advance when clustering.</p></section>
  </article>
}

export function DendrogramAnatomy() {
  return <article className="cluster-lesson">
    <Header eyebrow="18.8 · Anatomy of a dendrogram" title="How do you know when to stop creating new clusters?" intro="In other words, how many clusters should you choose? A dendrogram helps you understand how similar or different the groups are." />
    <figure className="dendrogram-figure dendrogram-annotated"><img src={dendrogramAnnotated} alt="Annotated dendrogram of points p1 to p6. Leaves represent individual data points; branch height indicates the distance at which clusters join. The p5 and p6 pair is circled and joins the remaining points at a much greater distance." /></figure>
    <section className="dendrogram-glossary" aria-labelledby="dendrogram-glossary-title"><h2 id="dendrogram-glossary-title">Dendrogram terms</h2><dl><div><dt>Leaf</dt><dd>One observation, such as p5 or p6, at the end of the tree.</dd></div><div><dt>Clade</dt><dd>A branch and the group of points that share a common joining point. The course uses the word for the vertical branches leading to splits.</dd></div><div><dt>Similarity</dt><dd>How close points or groups are according to the selected features and distance rule. How groups are compared also depends on the linkage method.</dd></div></dl><p><strong>In this example:</strong> p5 and p6 join early, while their group joins the rest much later, at a greater distance.</p></section>
    <section className="dendrogram-reading"><h2>Reading the dendrogram</h2><ol><li><strong>Find the leaves.</strong> Each label along the bottom is one observation.</li><li><strong>Compare joining heights.</strong> A lower join means a smaller distance. P5 and p6 join early; their group joins the rest much higher.</li><li><strong>Choose a cut.</strong> A horizontal cut gives a set of clusters. Use the business question to decide whether that grouping is useful.</li></ol><p className="dendrogram-qualification">Similarity depends on the distance and the rule for comparing groups. Not every pair within a group must be closer than every pair across groups.</p></section>
  </article>
}

export function HierarchicalFaqs() {
  return <article className="cluster-lesson">
    <Header eyebrow="18.9 · Hierarchical clustering FAQs" title="Hierarchical clustering FAQs" intro="Two common questions about distance and choosing a clustering method." />
    <section className="hierarchical-faq"><h2>How exactly do you define the distance between clusters?</h2><p>There are several valid ways to measure the distance between clusters. These are called <strong>linkage methods</strong>.</p><div className="hierarchical-faq__linkage"><h3>What is linkage?</h3><p><strong>Linkage is the rule used to define distance between clusters.</strong> Common methods compare the closest or farthest points, the average distance between point pairs, or the cluster centers (centroids).</p><div className="linkage-grid"><div><span>Minimum pairwise distance</span><strong>Single linkage</strong><p>Use the closest point from each cluster.</p></div><div><span>Maximum pairwise distance</span><strong>Complete linkage</strong><p>Use the farthest point from each cluster.</p></div><div><span>Average pairwise distance</span><strong>Average linkage</strong><p>Use the average distance across point pairs.</p></div><div><span>Distance between centers</span><strong>Centroid linkage</strong><p>Compare each cluster's centroid.</p></div></div></div></section>
    <section className="hierarchical-faq"><h2>When might you use hierarchical clustering over K-Means?</h2><p><strong>Run both models and compare their outputs</strong> using profiling metrics to see which groups are most relevant and insightful. Hierarchical clustering may produce more meaningful results when clusters are not circular or uniform in shape; the result depends on the data and linkage method.</p><figure className="shape-comparison"><img src={nonCircularSource} alt="Course comparison: K-Means divides the crescent and round groups differently from hierarchical clustering, which follows the crescent shape." /><figcaption>Course comparison · the hierarchical result follows the non-circular shape more closely in this example.</figcaption><p>K-Means is suited to roughly circular groups. Hierarchical clustering can be useful for non-circular patterns, depending on linkage and data.</p></figure><p>In data with many dimensions, these shapes may not be visible. Compare the results and profile the groups using other fields to understand what they mean.</p></section>
  </article>
}

export function ClusteringTakeaways() {
  return <article className="cluster-lesson">
    <Header eyebrow="18.10 · Key takeaways" title="A clustering result is a starting point for interpretation" intro="Review what clustering finds, which techniques to compare, and how to interpret the resulting groups." />
    <ol className="cluster-takeaways"><li><span>01</span><p>Cluster analysis finds concentrations of observations that are <strong>similar to one another and distinct from other groups.</strong><br />Common uses include identifying customer segments, clustering stores based on performance, and grouping employees.</p></li><li><span>02</span><p>Two common techniques are <strong>K-Means and hierarchical clustering.</strong><br />Test multiple models: each technique has strengths and weaknesses. Compare runs and use profiling metrics to assess which groups are relevant and insightful.</p></li><li><span>03</span><p>Models <strong>won’t tell you how to interpret</strong> what each cluster represents.<br />Use multivariate analysis and profiling—compare several characteristics across groups—to understand each cluster and its relevance to the business objective. Each observation receives a cluster label, a categorical variable you can group by to summarize other metrics, including the features used for clustering.</p></li></ol>
  </article>
}

const CLUSTER_QUIZ = [
  { id:'meaning', question:'What is one thing a clustering algorithm does not do by itself?', options:['Group observations by similarity','Assign each observation to a cluster','Describe what each cluster means for the business','Create a set of cluster assignments'], answer:2, explanation:'The algorithm creates groups and assignments. People still need to profile those groups and interpret what they mean for the business.' },
  { id:'k', question:'In K-Means, what does K represent?', options:['The number of clusters','The number of iterations','The number of features','The number of centroids that move'], answer:0, explanation:'K is the number of clusters requested. The number of iterations depends on when assignments and centers stabilize.' },
  { id:'wss', question:'Which measure is used to summarize K-Means within-cluster fit?', options:['Mean absolute error','Within-cluster sum of squares (WSS)','Accuracy','Lift'], answer:1, explanation:'WSS sums squared distances from observations to their assigned centroid. Lower WSS means points are closer to their own centers, but it tends to decrease as K grows.' },
  { id:'stop', question:'When does the K-Means assignment-and-update loop stop?', options:['After exactly three rounds','When the cluster centers stop moving','When WSS reaches zero','When every cluster has the same number of points'], answer:1, explanation:'The loop repeats assignment and mean-centroid updates until cluster assignments or centers no longer change.' },
  { id:'elbow', question:'What visual rule of thumb can help choose K from a WSS plot?', options:['The highest point','The steepest point','The elbow','The point where WSS becomes zero'], answer:2, explanation:'The elbow is where adding clusters begins to yield relatively little extra reduction in WSS. It is a guide, not a strict rule.' },
  { id:'shape', question:'Which cluster shape is K-Means best suited to, approximately?', options:['Long thin lines','Roughly circular groups','Nested rings','Any shape equally well'], answer:1, explanation:'The course describes K-Means as working best for roughly circular groups. Other shapes can be harder to represent with nearest-centroid assignments.' },
  { id:'business', question:'Which business question is a clear candidate for customer clustering?', options:['Which customers form useful groups?','Which exact revenue will each customer generate next year?','Which email is spam?','What is the average spend?'], answer:0, explanation:'Clustering can help explore groups of customers using observed characteristics. The result should still be checked and interpreted for the business objective.' },
  { id:'hierarchical-distance', question:'What is repeatedly used to decide which points or clusters to merge in hierarchical clustering?', options:['A random label','Distance','A target outcome','A prediction threshold'], answer:1, explanation:'Hierarchical clustering repeatedly merges the closest points or groups, according to the selected distance and linkage rule.' },
  { id:'tree', question:'Which visual displays the merge structure of hierarchical clustering?', options:['Confusion matrix','Histogram','Dendrogram','Residual plot'], answer:2, explanation:'A dendrogram displays observations as leaves and the joins between points or groups as branches.' },
  { id:'height', question:'In a dendrogram, what does the vertical height of a branch represent?', options:['Number of observations','Distance between groups at the merge','The average feature value','The cluster label'], answer:1, explanation:'Branch height shows the distance at which clusters merge. A horizontal cut at a chosen height gives candidate groups.' },
  { id:'noncircular', question:'When might hierarchical clustering be useful to compare with K-Means?', options:['When groups are not roughly circular','When there are no features','When all observations are identical','When a target label must be predicted'], answer:0, explanation:'Hierarchical clustering can be more useful for some non-circular patterns, depending on linkage and data. It does not guarantee a better or correct answer.' },
  { id:'compare', question:'What is a practical way to evaluate clustering for a business problem?', options:['Use only the model with the most clusters','Compare multiple methods, then profile and interpret their groups','Choose the model with the lowest possible WSS regardless of K','Treat each cluster label as a business explanation'], answer:1, explanation:'Compare suitable methods and profiles, then assess whether the resulting groups help answer the business question.' },
] as const

export function ClusteringQuiz() {
  const [index,setIndex]=useState(0)
  const [answers,setAnswers]=useState<Record<number,number>>({})
  const [checked,setChecked]=useState<Record<number,boolean>>({})
  const question=CLUSTER_QUIZ[index]
  const revealed=Boolean(checked[index])
  const correct=revealed&&answers[index]===question.answer
  const score=CLUSTER_QUIZ.filter((item,i)=>checked[i]&&answers[i]===item.answer).length
  const checkedCount=Object.keys(checked).length
  function reset(){setIndex(0);setAnswers({});setChecked({})}
  return <article className="cluster-lesson cluster-quiz" aria-labelledby="cluster-quiz-title">
    <Header eyebrow="18.11 · Optional practice · 12 questions" title="Clustering & segmentation quiz" intro="Choose an answer, check it, and read why. This quiz is optional; every lesson remains available." />
    <nav className="cluster-quiz-map" aria-label="Quiz questions">{CLUSTER_QUIZ.map((item,i)=><button type="button" key={item.id} aria-label={`Question ${i+1}${checked[i]?answers[i]===item.answer?', correct':', review':''}`} aria-current={index===i?'step':undefined} onClick={()=>setIndex(i)}>{i+1}{checked[i]&&<span aria-hidden="true">{answers[i]===item.answer?' ✓':' ↺'}</span>}</button>)}</nav>
    <section className="cluster-quiz-card" aria-label={`Question ${index+1}`}><p className="cluster-eyebrow">Question {index+1} of {CLUSTER_QUIZ.length}</p><fieldset key={question.id} disabled={revealed}><legend>{question.question}</legend><div className="cluster-quiz-options">{question.options.map((option,i)=><label key={option} className={`${answers[index]===i?'selected':''} ${revealed&&i===question.answer?'correct':''}`}><input type="radio" name={`cluster-question-${question.id}`} checked={answers[index]===i} onChange={()=>setAnswers({...answers,[index]:i})}/><span>{option}</span>{revealed&&i===question.answer&&<strong>✓ Correct answer</strong>}</label>)}</div></fieldset>
      {revealed&&<div className={`cluster-quiz-feedback${correct?'':' review'}`} role="status"><strong>{correct?'Correct.':'Take another look.'}</strong><p>{question.explanation}</p></div>}
      <div className="cluster-quiz-actions">{!revealed?<button type="button" className="cluster-primary" disabled={answers[index]===undefined} onClick={()=>setChecked({...checked,[index]:true})}>Check answer</button>:<button type="button" onClick={()=>{const next={...checked};delete next[index];setChecked(next);const nextAnswers={...answers};delete nextAnswers[index];setAnswers(nextAnswers)}}>Try again</button>}<div><button type="button" disabled={index===0} onClick={()=>setIndex(index-1)}>Previous question</button><button type="button" disabled={index===CLUSTER_QUIZ.length-1} onClick={()=>setIndex(index+1)}>Next question →</button></div></div>
    </section>
    <footer className="cluster-quiz-summary"><p aria-live="polite">{checkedCount===CLUSTER_QUIZ.length?'All questions checked.':`${checkedCount} of ${CLUSTER_QUIZ.length} checked.`} <strong>{score} correct</strong></p><button type="button" onClick={reset}>Start over</button></footer>
    <aside className="cluster-callout"><strong>Chapter summary:</strong> compare clustering methods, inspect the groups they produce, and decide whether those groups help with the business question.</aside>
  </article>
}
