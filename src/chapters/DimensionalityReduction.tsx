import { Fragment } from 'react'
import { ScreePlotLesson } from './DimensionalityScreeLesson'
import { DimensionalityTakeawaysLesson } from './DimensionalityTakeawaysLesson'
import pcaPairs from '../assets/pca-example-pairs.png'
import pcaComponents from '../assets/pca-example-components.png'
import pcaPositions from '../assets/pca-example-positions.png'
import './DimensionalityReduction.css'
import SourceQuiz from './SourceQuiz'
import type { SourceQuizQuestion } from './SourceQuiz'

const students = [
  [1, 1.8, 2.1, 5.4, 5.6], [2, 2.9, 3.1, 6.6, 5.7], [3, 4.6, 5.7, 2.8, 1.6], [4, 8.0, 7.1, 3.5, 3.4], [5, 8.1, 8.0, 1.3, 2.2],
  [6, 8.3, 5.6, 7.0, 9.1], [7, 4.4, 4.2, 9.1, 7.3], [8, 7.2, 6.3, 8.1, 7.8], [9, 4.2, 5.1, 9.9, 9.3], [10, 8.7, 10.3, 8.2, 8.7],
] as const
const componentScores = [[2.8, 7.8], [4.3, 8.7], [7.3, 3.2], [10.7, 4.9], [11.4, 2.6], [10.0, 11.5], [6.1, 11.6], [9.6, 11.3], [6.6, 13.6], [13.5, 12.0]] as const
const subjects = ['Spelling', 'Vocabulary', 'Multiplication', 'Geometry'] as const

function Header({ eyebrow, title, intro }: { eyebrow: string; title: string; intro: string }) {
  return <header className="dr-header"><p className="dr-eyebrow">{eyebrow}</p><h1>{title}</h1><p>{intro}</p></header>
}

function Table({ headers, rows, label }: { headers: string[]; rows: (string | number)[][]; label: string }) {
  return <div className="dr-table-scroll"><table className="dr-table"><caption>{label}</caption><thead><tr>{headers.map((header) => <th key={header} scope="col">{header}</th>)}</tr></thead><tbody>{rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>)}</tbody></table></div>
}

function PCAExampleTable() {
  const headers = ['Student', ...subjects, 'Component 1', 'Component 2']
  return <div className="dr-table-scroll"><table className="dr-table dr-trace-table"><caption>Student scores and component weightings</caption><thead><tr>{headers.map((header) => <th key={header} scope="col">{header}</th>)}</tr></thead><tbody>
    {students.map((row, i) => {
      const trace = row[0] === 3 ? 'two' : row[0] === 6 ? 'one' : null
      const cells = [row[0], ...row.slice(1).map((value) => value.toFixed(1)), ...componentScores[i].map((value) => value.toFixed(1))]
      const highlighted = trace === 'one' ? [1, 2, 5] : trace === 'two' ? [3, 4, 6] : []
      return <Fragment key={row[0]}><tr>{cells.map((cell, j) => <td key={j} className={highlighted.includes(j) ? `dr-trace-cell dr-trace-${trace}` : undefined}>{cell}</td>)}</tr>
        {trace && <tr className={`dr-trace-row dr-trace-${trace}`}><td colSpan={7}><span className="dr-trace-label">Student {row[0]} · Component {trace === 'one' ? '1' : '2'}</span><span>{trace === 'one' ? 'Spelling 8.3 and Vocabulary 5.6' : 'Multiplication 2.8 and Geometry 1.6'}</span><span className="dr-trace-arrow" aria-hidden="true">→</span><span>projection onto Component {trace === 'one' ? '1' : '2'}</span><span className="dr-trace-arrow" aria-hidden="true">→</span><strong>supplied position {trace === 'one' ? '10.0' : '3.2'}</strong></td></tr>}
      </Fragment>
    })}
  </tbody></table></div>
}

export function DRIntroduction() {
  return <article className="dr-lesson"><header className="dr-header"><p className="dr-eyebrow">21.1 · Introduction</p><h1>Dimensionality reduction</h1><p>In this section we’ll review the fundamentals of <strong>dimensionality reduction</strong>, discuss common Machine Learning and business use cases, and introduce core techniques like <strong>Principal Component Analysis (PCA)</strong>.</p></header>
    <div className="dr-intro-grid"><section><h2>Topics we’ll cover</h2><div className="dr-intro-topics"><span>Dimensionality Reduction Basics</span><span>Principal Component Analysis</span><span>Advanced Techniques</span><span>Key Takeaways</span></div></section><section><h2>Goals for this section</h2><ul><li>Understand how dimensionality reduction can be applied in <strong>business and Machine Learning</strong> contexts</li><li>Explore the intuition behind core <strong>linear</strong> dimensionality reduction techniques, including Principal Component Analysis (PCA)</li><li>Introduce more advanced models, including techniques for <strong>non-linear</strong> dimensionality reduction</li></ul></section></div>
  </article>
}

export function DRBasics() {
  const business = ['Summarizing item-level sales data to better understand group or category performance', 'Analyzing survey data to understand overarching trends and findings without parsing through individual question responses', 'Understanding the main traits or characteristics of your customers (website activity, transaction patterns, survey response data, etc.)']
  const machine = ['Improving a model’s predictive power by reducing redundant or unnecessary dimensions in the data', 'Visualizing clusters in limited dimensions to spot-check cluster/segmentation outputs', 'Reducing trivial correlations and removing multicollinearity to build more accurate and meaningful models']
  return <article className="dr-lesson"><header className="dr-header"><p className="dr-eyebrow">21.2 · Dimensionality reduction basics</p><h1>Dimensionality reduction</h1><p className="dr-definition"><strong>Dimensionality reduction</strong> involves reducing the number of columns (<em>i.e. dimensions</em>) in a dataset while <strong>losing as little information as possible</strong>.</p></header>
    <p className="dr-source-intro">This can be used strictly as a ML optimization technique, or to help develop a better understanding of the data for business intelligence, market research, etc.</p>
    <div className="dr-use-cases"><section><h2>Common business use cases</h2><ul>{business.map((item) => <li key={item}>{item}</li>)}</ul></section><section><h2>Common ML use cases</h2><ul>{machine.map((item) => <li key={item}>{item}</li>)}</ul></section></div><p className="dr-qualification">Improved predictions and reduced multicollinearity are possible benefits, not guarantees.</p>
  </article>
}

function PCAIntroGraph() {
  // Symmetric coordinates have zero cross-covariance along the two directions.
  const points = [[-80, -5], [-50, 8], [-20, 0], [20, 0], [50, -8], [80, 5]] as const
  const center = { x: 170, y: 135 }
  return <figure className="dr-pca-intro-graph">
    <svg viewBox="0 0 700 260" role="img" aria-labelledby="pca-intro-title pca-intro-desc">
      <title id="pca-intro-title">From two original dimensions to one component</title>
      <desc id="pca-intro-desc">Six observations follow a diagonal direction through their center. Perpendicular dotted lines project them onto the first component. Their positions along that component are shown on a horizontal one-dimensional line.</desc>
      <defs><marker id="dr-pca-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="#527970" /></marker></defs>
      <text className="dr-pca-heading" x="170" y="25" textAnchor="middle">Original dimensions</text>
      <path className="dr-pca-axis" d="M65 205H280 M65 205V48" />
      <text className="dr-pca-label" x="173" y="231" textAnchor="middle">Original dimension 1</text>
      <text className="dr-pca-label" transform="translate(26 128) rotate(-90)" textAnchor="middle">Original dimension 2</text>
      <path className="dr-pca-component" d="M90 195L250 75" markerEnd="url(#dr-pca-arrow)" />
      {points.map(([t, n]) => {
        const x = center.x + 0.8 * t, y = center.y - 0.6 * t
        return <g key={t}><line className="dr-pca-projection" x1={x + 0.6 * n} y1={y + 0.8 * n} x2={x} y2={y} /><circle className="dr-pca-dot" cx={x + 0.6 * n} cy={y + 0.8 * n} r="5" /><circle className="dr-pca-projected-dot" cx={x} cy={y} r="2.5" /></g>
      })}
      <text className="dr-pca-label dr-pca-emphasis" x="212" y="64">First component</text>
      <path className="dr-pca-transfer" d="M315 135H370" markerEnd="url(#dr-pca-arrow)" />
      <text className="dr-pca-heading" x="515" y="75" textAnchor="middle">New dimension</text>
      <path className="dr-pca-component" d="M405 135H625" markerEnd="url(#dr-pca-arrow)" />
      {points.map(([t]) => <circle className="dr-pca-dot" key={t} cx={515 + t} cy="135" r="5" />)}
      <text className="dr-pca-label" x="515" y="169" textAnchor="middle">Position on the first component</text>
    </svg>
    <figcaption>The first component follows the main variation. Each observation is projected straight onto it; its position becomes a value on the new dimension.</figcaption>
  </figure>
}

export function DRPCAIntro() {
  const steps = [
    <>Use <strong>high-dimensional data</strong> that could be more useful if it could be accurately represented with <strong>fewer dimensions</strong></>,
    <>Find <strong>“components”</strong> or lines that fit through those dimensions, to potentially use as <strong>new dimensions</strong> to represent the data</>,
    <>Interpret the <strong>weighting</strong> of each component on the <strong>original dimensions</strong> to build an intuition for what they represent</>,
    <>Select the <strong>“principal” components</strong> which explain a <strong>material proportion of the variance</strong> in the data</>,
    <>Use those principal components <strong>in place of existing dimensions</strong> for <strong>further analysis</strong></>,
  ]
  return <article className="dr-lesson"><header className="dr-header"><p className="dr-eyebrow">21.3 · Principal component analysis</p><h1>Principal Component Analysis</h1><p className="dr-definition">One of the most common dimensionality reduction techniques is <strong>Principal Component Analysis (PCA)</strong>.</p></header>
    <p className="dr-source-intro">In the simplest form, PCA finds lines that best fit through the observations in a data set, and uses those lines to create <em>new dimensions</em> to analyze.</p>
    <PCAIntroGraph />
    <ol className="dr-source-steps">{steps.map((detail, i) => <li key={i}><div className="dr-step-heading">Step {i + 1}</div><p>{detail}</p></li>)}</ol>
    <p className="dr-qualification">The “best-fit lines” description is a simplified intuition. Components are new dimensions, not selected original columns.</p>
  </article>
}

export function DRPCAExample() {
  return <article className="dr-lesson dr-example"><Header eyebrow="21.4 · PCA example" title="Student test scores by subject" intro="Explore four test scores for ten students, then record their positions on two new dimensions." />
    <section><h2>Plot pairs of dimensions</h2>
      <Table label="Student test scores by subject (n = 10)" headers={['Student', ...subjects]} rows={students.map((row) => [row[0], ...row.slice(1).map((value) => value.toFixed(1))])} />
      <p>Plotting pairs of dimensions reveals some correlation between <strong>Spelling / Vocabulary</strong> and <strong>Multiplication / Geometry</strong> test scores. The two middle plots do not show the same clear relationship.</p>
      <figure className="dr-example-figure"><img src={pcaPairs} alt="Four scatterplots: spelling versus vocabulary, vocabulary versus multiplication, spelling versus multiplication, and multiplication versus geometry. The first and last pairs are outlined." /></figure>
      <p>Linear dimensionality reduction techniques find lines that fit through <em>highly correlated</em> dimensions first.</p>
    </section>
    <section><h2>Find components and their weightings</h2>
      <p>In dimensionality reduction, these lines are called <strong>components</strong> or <strong>factors</strong>. Observations are given a <strong>weighting</strong> for each component, measuring their position along the line.</p>
      <figure className="dr-example-figure"><img src={pcaComponents} alt="Spelling versus vocabulary and multiplication versus geometry scatterplots with turquoise component lines. An orange weighting and projection illustrate a student's position on the first component." /></figure>
    </section>
    <section><h2>Record the new dimensions</h2>
      <p>Plot the component weightings for each point and record them as <strong>new dimensions</strong> in the table.</p>
      <PCAExampleTable />
      <figure className="dr-example-figure"><img src={pcaPositions} alt="The first component plot marks spelling 8.3 and vocabulary 5.6 at weighting 10.0. The second marks multiplication 2.8 and geometry 1.6 at weighting 3.2. Orange lines show the positions and projections." /></figure>
      <p className="dr-trace-key"><span className="dr-trace-one"><strong>Student 6 · Component 1:</strong> 10.0</span><br /><span className="dr-trace-two"><strong>Student 3 · Component 2:</strong> 3.2</span></p>
      <p><strong>Note:</strong> We’re looking at only two new dimensions here, but PCA scales to <em>any number of dimensions</em>.</p>
      <p className="dr-qualification">The example supplies these component scores; it does not specify the centering, scaling, or calculation used to obtain them.</p>
    </section>
  </article>
}

export function DRInterpretComponents() {
  const stages = [
    { name: 'language', number: 1, coefficients: ['0.72', '0.69', '−0.02', '0.03'], highlighted: [0, 1] },
    { name: 'math', number: 2, coefficients: ['0.004', '0.001', '0.68', '0.72'], highlighted: [2, 3] },
  ] as const
  return <article className="dr-lesson dr-interpret"><Header eyebrow="21.5 · Interpreting components" title="What does each component mean?" intro="Use the loadings to interpret the two new student-score dimensions." />
    <ul className="dr-interpret-intro"><li>PCA will generate many potential components, and it won’t be immediately clear what they actually represent.</li><li>In practice, PCA models calculate weights (or <strong>“loadings”</strong>) to help explain the relationship between each component and the original dimensions <em>(think of loadings like coefficients in a linear regression)</em>.</li></ul>
    {stages.map((stage) => <section className="dr-interpret-stage" key={stage.number}><h2>Component {stage.number}: “{stage.name}”</h2>
      <div className="dr-interpret-layout"><div className="dr-interpret-work"><div className="dr-table-scroll"><table className="dr-interpret-table"><caption>Original scores and component scores</caption><thead><tr><th scope="col">Student</th>{subjects.map((subject, i) => <th scope="col" key={subject}><span className="dr-interpret-variable">X<sub>{i + 1}</sub></span>{subject}</th>)}<th scope="col" className="dr-interpret-result">{stage.number === 1 && <span className="dr-interpret-variable dr-interpret-y">Y</span>}Language</th><th scope="col" className="dr-interpret-result">{stage.number === 2 && <span className="dr-interpret-variable dr-interpret-y">Y</span>}{stage.number === 1 ? 'Component 2' : 'Math'}</th></tr></thead><tbody>{students.map((row, i) => <tr key={row[0]}><td>{row[0]}</td>{row.slice(1).map((value, j) => <td key={j}>{value.toFixed(1)}</td>)}{componentScores[i].map((value, j) => <td key={j}>{value.toFixed(1)}</td>)}</tr>)}</tbody></table></div>
      <div className="dr-interpret-formula" aria-label={`Component ${stage.number} loadings`}><span>Y = </span>{stage.coefficients.map((coefficient, i) => <span className={stage.highlighted.some((index) => index === i) ? 'dr-interpret-strong-term' : ''} key={i}>{i > 0 && ' + '}({coefficient}) X<sub>{i + 1}</sub></span>)}</div><p className="dr-interpret-formula-caption">Loadings multiply the original dimensions; Y represents the component.</p></div>
      <aside className="dr-interpret-callout">High coefficients on {stage.number === 1 ? <>X<sub>1</sub> (<strong>spelling</strong>) and X<sub>2</sub> (<strong>vocabulary</strong>)</> : <>X<sub>3</sub> (<strong>multiplication</strong>) and X<sub>4</sub> (<strong>geometry</strong>)</>}, so we might interpret component {stage.number} as <strong>“{stage.name}”</strong>.</aside></div>
    </section>)}
    <p className="dr-warning"><strong>Note:</strong> This requires <strong>human intuition</strong>; your model won’t tell you what the components mean! Some components may not have a clear interpretation.</p>
    <p className="dr-qualification">The table contains supplied component scores (student positions), not loadings. The example does not specify centering or scaling, and the displayed loadings do not exactly reproduce those scores.</p>
  </article>
}

export function DRScreePlot() {
  return <ScreePlotLesson />
}

export function DRAdvancedTechniques() {
  return <article className="dr-lesson dr-advanced"><Header eyebrow="21.7 · Advanced techniques" title="What about nonlinear dimensionality reduction?" intro="PCA is one approach to reducing dimensions; other techniques can account for curved relationships." />
    <ul className="dr-advanced-source"><li><strong>Linear dimensionality reduction</strong> is well researched and widely used, and can be applied across a broad range of business intelligence and machine learning use cases.</li><li>Other, <em>nonlinear</em> dimensionality reduction techniques exist, but are more <strong>specialized and complex</strong> in their underlying algorithms and math:
      <ul><li>Kernel PCA</li><li>t-Distributed Stochastic Neighbor Embedding (t-SNE)</li><li>Uniform Manifold Approximation &amp; Projection (UMAP)</li><li>Self-Organizing Maps</li></ul></li></ul>
    <figure className="dr-advanced-visual"><div><h2>Straight or curved?</h2><p>Linear PCA uses straight directions to create new dimensions. A nonlinear approach can account for a curved pattern instead.</p><p className="dr-advanced-caption">Think of tracing a bend and opening it out. This is an intuition, not the output of a fitted model; nonlinear methods work in different ways.</p></div>
      <svg viewBox="0 0 500 190" role="img" aria-labelledby="dr-advanced-title dr-advanced-desc"><title id="dr-advanced-title">A curved pattern and an opened-out representation</title><desc id="dr-advanced-desc">Colored points follow a curved path, then appear in the same order along a straight path. This illustrates the intuition of opening out a curved pattern.</desc><path d="M35 139 C35 43 195 43 195 139" fill="none" stroke="#7ca89a" strokeWidth="5" strokeLinecap="round" /><path d="M273 97 H459" fill="none" stroke="#7ca89a" strokeWidth="5" strokeLinecap="round" /><path d="M216 96 H253 M246 89 L253 96 L246 103" fill="none" stroke="#466f66" strokeWidth="2" />{[[35,139],[48,88],[83,61],[115,56],[147,61],[182,88],[195,139]].map(([x,y], i) => <circle key={x} cx={x} cy={y} r="6" fill={i < 2 ? '#d49367' : i < 5 ? '#168f88' : '#526f83'} />)}{[285,311,337,363,389,415,441].map((x, i) => <circle key={x} cx={x} cy="97" r="6" fill={i < 2 ? '#d49367' : i < 5 ? '#168f88' : '#526f83'} />)}<text x="115" y="174" textAnchor="middle">Curved pattern</text><text x="363" y="133" textAnchor="middle">Opened-out view</text></svg>
    </figure>
    <p className="dr-note"><strong>Note:</strong> Nonlinear results can be harder to interpret, though they can still be visualized. The course describes UMAP and t-SNE as similar in application and notes that UMAP can run faster; actual speed depends on the data and settings.</p>
  </article>
}

export function DRTakeaways() {
  return <DimensionalityTakeawaysLesson />
}

const quiz: SourceQuizQuestion[] = [
  { id: 'columns', question: 'Dimensionality reduction is used to reduce the number of…', options: ['Rows', 'Values', 'Duplicates', 'Columns'], answer: 3, explanation: 'Dimensions are the columns or features in the dataset.' },
  { id: 'not-use', question: 'Generally speaking, which is not a dimensionality-reduction use in the course?', options: ['Reducing columns', 'Producing new dimensions for later analysis', 'Understanding common traits in data', 'Time-series decomposition'], answer: 3, explanation: 'The course treats time-series decomposition as a regression topic, not a dimensionality-reduction use.' },
  { id: 'pca', question: 'Which is a common dimensionality-reduction technique?', options: ['Principal Component Analysis', 'Decision Tree', 'Random Forest', 'Logistic Regression'], answer: 0, explanation: 'PCA is the central linear method in this chapter.' },
  { id: 'components', question: 'In the course’s PCA intuition, fitted lines through the data are called…', options: ['Weightings', 'Components', 'Regressions', 'Vectors'], answer: 1, explanation: 'The course calls these new dimensions components (or factors in factor analysis).' },
  { id: 'scree', question: 'Which visual can help decide how many components to keep?', options: ['Scatter plot', 'Box plot', 'Histogram', 'Scree plot'], answer: 3, explanation: 'A scree plot shows each component’s variance contribution and the cumulative amount.' },
  { id: 'loadings', question: 'What helps interpret a component’s relationship to the original columns?', options: ['Factors', 'Variance alone', 'Loadings', 'All of the above'], answer: 2, explanation: 'Loadings show how the component relates to the original dimensions; people still interpret the pattern.' },
]
export function DRQuiz() { return <SourceQuiz title="Dimensionality Reduction" questions={quiz} /> }
