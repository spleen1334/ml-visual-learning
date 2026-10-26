import { useState } from 'react'
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
import hierarchicalMerge1 from '../assets/hierarchical-source-merge-1.png'
import hierarchicalMerge2 from '../assets/hierarchical-source-merge-2.png'
import hierarchicalMerge3 from '../assets/hierarchical-source-merge-3.png'
import hierarchicalMerge4 from '../assets/hierarchical-source-merge-4.png'
import hierarchicalMerge5 from '../assets/hierarchical-source-merge-5.png'
import dendrogramSource from '../assets/dendrogram-source.png'
import nonCircularSource from '../assets/hierarchical-noncircular-compare.png'
import wssDistances from '../assets/wss-source-distances.png'
import wssElbow from '../assets/wss-source-elbow.png'

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
    <Header eyebrow="18.1 · Clustering & segmentation" title="Group similar observations to find useful segments" intro="Clustering and segmentation are used interchangeably in this course. This chapter builds from the basic idea to K-Means and hierarchical methods, then asks how to interpret the groups." />
    <section className="cluster-intro-points" aria-label="Chapter learning path">
      <div><span>01</span><h2>See what a cluster means</h2><p>Observations in one group are similar to one another and distinct from other groups.</p></div>
      <div><span>02</span><h2>Build groups</h2><p>Compare K-Means assignments and the bottom-up merges of hierarchical clustering.</p></div>
      <div><span>03</span><h2>Interpret the result</h2><p>Profile the groups and relate them back to the business question.</p></div>
    </section>
    <aside className="cluster-callout"><strong>There is no universal “right” answer.</strong> A useful clustering result is one that helps answer the business question. The method does not explain what a group means.</aside>
  </article>
}

export function ClusterBasics() {
  const [showGroups, setShowGroups] = useState(false)
  return <article className="cluster-lesson">
    <Header eyebrow="18.2 · Clustering basics" title="A cluster is a group of similar observations" intro="Clustering organizes observations by similarity, even when there is no target label telling us the groups in advance." />
    <div className="cluster-definition"><div><p className="cluster-eyebrow">The central idea</p><h2>Similar within a group.<br />Distinct from other groups.</h2><p>Compare the source point cloud before and after its three groups are highlighted.</p></div><figure className="cluster-source-figure"><img src={showGroups ? basicsGroups : basicsCloud} alt={showGroups ? 'The source scatterplot with three distinct point groups highlighted in amber, violet and turquoise' : 'The source scatterplot with an unlabeled cloud of observations'} /><figcaption>Source scatterplot · {showGroups ? 'groups highlighted' : 'observations before grouping'}</figcaption><div className="cluster-source-controls" role="group" aria-label="Source clustering illustration"><button type="button" disabled={!showGroups} onClick={() => setShowGroups(false)}>Before</button><button type="button" disabled={showGroups} onClick={() => setShowGroups(true)}>Show groups</button></div></figure></div>
    <p className="cluster-note">A scatterplot can show similarity when there are two features. With many dimensions, a picture cannot display every relationship, so an algorithm can help organize the data.</p>
    <div className="cluster-process" aria-label="Extract, transform, model, interpret"><span>Extract</span><b aria-hidden="true">→</b><span>Transform</span><b aria-hidden="true">→</b><span>Model</span><b aria-hidden="true">→</b><span>Interpret</span></div>
  </article>
}

export function KMeansIntroduction() {
  const [step, setStep] = useState(0)
  const steps = [
    { title: 'Choose K and starting centroids', detail: 'K is the number of clusters. Select starting center locations to begin.', image: kmeansStep1 },
    { title: 'Assign each observation', detail: 'Give each point the cluster of its nearest centroid.', image: kmeansStep2 },
    { title: 'Move centers to their means', detail: 'Recalculate each center as the mean of the points assigned to it.', image: kmeansStep3 },
    { title: 'Reassign to the new nearest center', detail: 'After the centers move, check each observation against its new nearest centroid.', image: kmeansStep4 },
    { title: 'Repeat until the groups stop changing', detail: 'Continue the assignment and mean-update steps until observations no longer switch clusters.', image: kmeansStep5 },
    { title: 'The assignments have settled', detail: 'The final source view shows the two groups after the centers stop moving.', image: kmeansStep6 },
  ] as const
  return <article className="cluster-lesson">
    <Header eyebrow="18.3 · Intro to K-Means" title="K-Means alternates assignment and mean updates" intro="The source example follows two groups from initial centers, through assignment and relocation, to convergence." />
    <section className="kmeans-demo" aria-labelledby="kmeans-demo-title">
      <div className="kmeans-demo__steps"><p className="cluster-eyebrow">The K-Means loop</p><h2 id="kmeans-demo-title">{steps[step].title}</h2><p>{steps[step].detail}</p><nav aria-label="K-Means steps">{steps.map((item,i)=><button type="button" key={item.title} aria-current={step===i?'step':undefined} onClick={()=>setStep(i)}>{i+1}</button>)}</nav><div className="kmeans-demo__nav"><PlaybackButton action="previous" label="Previous K-Means step" disabled={step===0} onClick={()=>setStep(step-1)}/><PlaybackButton action="next" label="Next K-Means step" disabled={step===steps.length-1} onClick={()=>setStep(step+1)}/></div></div>
      <figure className="kmeans-demo__visual"><img src={steps[step].image} alt={`Course K-Means scatterplot, step ${step + 1}: ${steps[step].detail}`} /><figcaption>Course example · two clusters, selected centers and their assignments</figcaption></figure>
    </section>
    <p className="cluster-note"><strong>K means number of groups; it is not the number of iterations.</strong> Starting-centroid locations can change the result, so later lessons compare multiple starts.</p>
  </article>
}

export function WssElbowLesson() {
  return <article className="cluster-lesson">
    <Header eyebrow="18.4 · WSS & elbow plots" title="Use the elbow as a guide for choosing K" intro="Within-cluster sum of squares (WSS) adds the squared distance from every observation to its assigned centroid." />
    <div className="wss-layout"><figure className="wss-chart"><img src={wssElbow} alt="Source WSS chart for K equals 2 through 8, with the course's turquoise annotation pointing to K equals 5 as the elbow." /><figcaption>Course example · the curve becomes flatter after K = 5. The slide uses K = 5 as a guideline, not a strict rule.</figcaption></figure><div className="wss-explanation"><h2>Why does WSS fall?</h2><p>Adding clusters gives points more nearby centers, so the within-cluster distances cannot increase.</p><div className="wss-formula"><span>WSS =</span><span>Σ<sub>clusters</sub> Σ<sub>points in cluster</sub> distance(point, centroid)<sup>2</sup></span></div><p>Look for where another cluster adds relatively little improvement. This elbow is a <strong>rule of thumb</strong>; K = 5 is only the course example.</p></div></div>
    <figure className="wss-distance-figure"><img src={wssDistances} alt="Course K-Means figure showing points connected to two cluster centroids; the source labels instruct squaring these distances and summing them to calculate WSS." /><figcaption>WSS adds each point’s squared distance to its assigned centroid, then sums those squares across clusters.</figcaption></figure>
  </article>
}

export function KMeansFaqs() {
  return <article className="cluster-lesson">
    <Header eyebrow="18.5 · K-Means FAQs" title="What K-Means can and cannot show" intro="The method extends beyond a two-dimensional chart, but its shape assumptions and starting centers still matter." />
    <div className="cluster-faqs"><section><span>01 · DIMENSIONS</span><h2>More than two features?</h2><p>Yes. The distance calculation can use additional dimensions, though a flat plot cannot show every one. Profile the inputs carefully.</p></section><section><span>02 · SHAPE</span><h2>Which clusters fit it best?</h2><p>K-Means is best suited to roughly circular groups. It can struggle when clusters have very different shapes.</p></section><section><span>03 · STARTING CENTERS</span><h2>Can the starting points matter?</h2><p>Yes. Try multiple random starts for the same K and compare their WSS before choosing a result.</p></section></div>
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
  const [showScaled, setShowScaled] = useState(true)
  const round = PET_ROUNDS[roundIndex]
  const previousTotal = roundIndex > 0 ? PET_ROUNDS[roundIndex-1].totalDistance : null
  const reduction = previousTotal ? (previousTotal-round.totalDistance)/previousTotal*100 : null
  return <article className="cluster-lesson">
    <Header eyebrow="18.6 · Case study: K-Means" title="Group Pet Pals customers by opens and spend" intro="Pet Pals sells custom 3D-printed pet models. Explore customer email opens per week and total spend to find segments for possible marketing tests." />
    <section className="pet-workbench">
      <div className="pet-controls"><div><span>Input fields</span><strong>Average promotional email opens / week · Total amount spent</strong></div><label><input type="checkbox" checked={showScaled} onChange={(event)=>setShowScaled(event.target.checked)} />Show the 1–100 scaled columns</label></div>
      <div className="pet-formulas"><p><strong>Scale each input:</strong> 1 + (value − minimum) × 99 ÷ (maximum − minimum). Opens: 1.64–9.38 per week; spend: $21.31–$105.62.</p><p><strong>Distance to a center:</strong> √[(scaled opens − center opens)² + (scaled spend − center spend)²]. Recalculate each center as the mean of its assigned points.</p><p><strong>Starting centers:</strong> selected manually from customers 2, 21 and 36. This spreadsheet walkthrough uses K = 3; it does not establish an optimal K.</p></div>
      <div className="pet-round-nav" role="group" aria-label="K-Means workbook iterations">{PET_ROUNDS.map((_,i)=><button type="button" key={i} aria-pressed={roundIndex===i} onClick={()=>setRoundIndex(i)}>Round {i+1}</button>)}</div>
      <div className="pet-round-title"><h2>Round {roundIndex+1} of 4</h2><p>{roundIndex===0?'Start from the three manually selected centers. Each point is assigned to its nearest one.':`Use the previous round's means as centers, then assign all 50 customers again.`}</p></div>
      <div className="pet-chart-layout"><figure className="pet-chart-frame"><PetPalsChart round={round}/><figcaption>Both axes use the workbook's 1–100 scaled values. The plot uses the workbook's −20 to 120 axis extent. Square markers are the centers used for this round; open diamonds show the new means.</figcaption></figure>
        <aside className="pet-round-stats"><h3>Round results</h3><p className="pet-distance-value">{fmt(round.totalDistance,4)}</p><span className="pet-distance-label">Workbook “Total Distance”</span>{reduction!==null&&<p className="pet-reduction">↓ {fmt(reduction,2)}% from the previous round</p>}<table><caption>Customer assignments</caption><thead><tr><th>Cluster</th><th>Customers</th></tr></thead><tbody>{round.counts.map((count,i)=><tr key={i}><th><i style={{background:COLORS[i]}}/>Cluster {i+1}</th><td>{count}</td></tr>)}</tbody><tfoot><tr><th>Total</th><td>50</td></tr></tfoot></table></aside>
      </div>
      <div className="pet-centers"><h3>Centroid coordinates · scaled opens / spend</h3><div className="pet-centers-grid"><table><caption>Centers used in this round</caption><thead><tr><th>Cluster</th><th>Email opens</th><th>Total spend</th></tr></thead><tbody>{round.centers.map((center,i)=><tr key={i}><th><i style={{background:COLORS[i]}}/>Cluster {i+1}</th><td>{fmt(center.x,4)}</td><td>{fmt(center.y,4)}</td></tr>)}</tbody></table><table><caption>New means after assignments</caption><thead><tr><th>Cluster</th><th>Email opens</th><th>Total spend</th></tr></thead><tbody>{round.nextCenters.map((center,i)=><tr key={i}><th><i style={{background:COLORS[i]}}/>Cluster {i+1}</th><td>{fmt(center.x,4)}</td><td>{fmt(center.y,4)}</td></tr>)}</tbody></table></div></div>
      <div className="pet-data-wrap" role="region" aria-label="All 50 customer records with scaled fields and distances for the selected round" tabIndex={0}><table className="pet-data"><caption>All 50 customer records · current round distances and nearest-centroid assignment</caption><thead><tr><th scope="col">Customer ID</th><th scope="col">Promo email opens / week</th><th scope="col">Total amount spent</th>{showScaled&&<><th scope="col">Opens · scaled 1–100</th><th scope="col">Spend · scaled 1–100</th></>}<th scope="col">Distance to C1</th><th scope="col">Distance to C2</th><th scope="col">Distance to C3</th><th scope="col">Minimum distance</th><th scope="col">Nearest centroid</th></tr></thead><tbody>{round.assignments.map(({point,distances,cluster,distance:itemDistance})=><tr key={point.id} className={[2,21,36].includes(point.id)?'is-seed':undefined}><th scope="row">{point.id}{[2,21,36].includes(point.id)&&<span className="pet-seed-tag">Starting center</span>}</th><td>{fmt(point.opens,2)}</td><td>${fmt(point.spend,2)}</td>{showScaled&&<><td>{fmt(point.x,4)}</td><td>{fmt(point.y,4)}</td></>}{distances.map((d,i)=><td key={i} className={cluster===i?'is-assigned':''}>{fmt(d,4)}</td>)}<td>{fmt(itemDistance,4)}</td><td><span className="pet-cluster-tag" style={{color:COLORS[cluster],borderColor:COLORS[cluster]}}>Cluster {cluster+1}</span></td></tr>)}</tbody></table></div>
    </section>
    <aside className="cluster-callout"><strong>Reading the workbook correctly:</strong> the sheet's “Total Distance” adds nearest-centroid Euclidean distances. The formal WSS definition in the previous lesson adds <em>squared</em> distances, so these workbook totals are not WSS.</aside>
    <div className="pet-interpretation"><h2>Possible actions to test</h2><div><p><i style={{background:COLORS[0]}}/><strong>Cluster 1:</strong> frequent opens and high spend. Consider no change or a small test.</p><p><i style={{background:COLORS[1]}}/><strong>Cluster 2:</strong> frequent opens and lower spend. Test a discount or promotion.</p><p><i style={{background:COLORS[2]}}/><strong>Cluster 3:</strong> few opens and mixed spend. Try a different outreach approach.</p></div><small>These are hypotheses about the supplied customer groups, not measured effects of a campaign.</small></div>
    <div className="cluster-note">The workbook chooses K = 3 with manually spread starting centers for a manageable walkthrough. Earlier lessons recommend trying several K values and repeated starts before deciding how to use a real clustering result.</div>
  </article>
}

const MERGES = [
  { from: 'p5 + p6', detail: 'The closest pair joins. Five groups remain.', groups: ['p1','p2','p3','p4','(p5,p6)'] },
  { from: 'p2 + p3', detail: 'A second close pair joins. Four groups remain.', groups: ['p1','(p2,p3)','p4','(p5,p6)'] },
  { from: 'p1 + (p2,p3)', detail: 'The four-cluster cut becomes three groups.', groups: ['(p1,p2,p3)','p4','(p5,p6)'] },
  { from: 'p4 + (p1,p2,p3)', detail: 'The three groups become two.', groups: ['(p1,p2,p3,p4)','(p5,p6)'] },
  { from: '(p1,p2,p3,p4) + (p5,p6)', detail: 'The final two groups join into one.', groups: ['(p1,p2,p3,p4,p5,p6)'] },
] as const
const HIERARCHICAL_IMAGES = [hierarchicalMerge1, hierarchicalMerge2, hierarchicalMerge3, hierarchicalMerge4, hierarchicalMerge5] as const

export function HierarchicalIntroduction() {
  const [merge, setMerge] = useState(0)
  return <article className="cluster-lesson">
    <Header eyebrow="18.7 · Intro to hierarchical clustering" title="Build clusters from the bottom up" intro="Agglomerative hierarchical clustering repeatedly joins the closest two points or groups until one cluster remains." />
    <section className="hierarchical-stepper"><div><p className="cluster-eyebrow">Six source observations · merge {merge+1} of {MERGES.length}</p><h2>{MERGES[merge].from}</h2><p>{MERGES[merge].detail}</p><div className="hierarchical-controls"><PlaybackButton action="previous" label="Previous merge" disabled={merge===0} onClick={()=>setMerge(merge-1)}/><PlaybackButton action="next" label="Next merge" disabled={merge===MERGES.length-1} onClick={()=>setMerge(merge+1)}/></div><div className="hierarchical-cut">{MERGES[merge].groups.length} clusters remain after this merge.</div></div><figure className="hierarchical-source-figure"><img src={HIERARCHICAL_IMAGES[merge]} alt={`Course scatterplot and dendrogram after merge ${merge+1}: ${MERGES[merge].from}. ${MERGES[merge].groups.length} clusters remain.`} /><figcaption>Course example · the left scatterplot and right dendrogram show the same merge. A dashed line marks the current cut.</figcaption></figure></section>
    <div className="cluster-note"><strong>Agglomerative means joining step by step:</strong> each merge is kept in a tree, so you can inspect several possible groupings without rerunning the procedure.</div>
  </article>
}

export function DendrogramAnatomy() {
  return <article className="cluster-lesson">
    <Header eyebrow="18.8 · Anatomy of a dendrogram" title="A horizontal cut turns the tree into groups" intro="Leaves are individual observations. Vertical branch height shows the distance at which points or clusters join." />
    <figure className="dendrogram-figure"><img src={dendrogramSource} alt="Course dendrogram with leaves p1 to p6, vertical branches showing merge distance, and the p5 and p6 leaf pair circled." /><figcaption>Source dendrogram · branch height represents merge distance; leaf tips represent individual observations. Exact numeric distances are not labeled.</figcaption></figure>
    <div className="dendro-explain"><p><strong>Short branches:</strong> pairs such as p2+p3 and p5+p6 join at a smaller distance.</p><p><strong>Tall final branch:</strong> the p5+p6 group joins the rest at a much greater distance. The chosen cut depends on the business question.</p></div>
  </article>
}

export function HierarchicalFaqs() {
  return <article className="cluster-lesson">
    <Header eyebrow="18.9 · Hierarchical clustering FAQs" title="Linkage defines the distance between groups" intro="A hierarchical method needs a rule for deciding how close two clusters are." />
    <section className="linkage-grid"><div><span>Minimum pairwise distance</span><strong>Single linkage</strong><p>Use the closest point from each cluster.</p></div><div><span>Maximum pairwise distance</span><strong>Complete linkage</strong><p>Use the farthest point from each cluster.</p></div><div><span>Average pairwise distance</span><strong>Average linkage</strong><p>Use the average distance across point pairs.</p></div><div><span>Distance between centers</span><strong>Centroid linkage</strong><p>Compare each cluster's centroid.</p></div></section>
    <figure className="shape-comparison"><img src={nonCircularSource} alt="Course comparison: K-Means divides the crescent and round groups differently from hierarchical clustering, which follows the crescent shape." /><figcaption>Course comparison · the hierarchical result follows the non-circular shape more closely in this example.</figcaption><p>K-Means is suited to roughly circular groups. Hierarchical clustering can be useful for non-circular patterns, depending on linkage and data.</p></figure>
    <aside className="cluster-callout"><strong>Compare and interpret:</strong> try more than one clustering method where appropriate, then profile the resulting groups with other fields. The algorithm creates assignments; it does not explain their business meaning.</aside>
  </article>
}

export function ClusteringTakeaways() {
  return <article className="cluster-lesson">
    <Header eyebrow="18.10 · Key takeaways" title="A clustering result is a starting point for interpretation" intro="Clusters group observations that are similar within each group and distinct from other groups." />
    <ol className="cluster-takeaways"><li><span>01</span><p>Clustering can help explore groups of customers, stores, employees, or other observations.</p></li><li><span>02</span><p>Compare methods and settings; then profile the assigned groups with useful context.</p></li><li><span>03</span><p>Use the business question to decide whether the clusters are helpful. The algorithm does not tell you what a segment means.</p></li></ol>
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
