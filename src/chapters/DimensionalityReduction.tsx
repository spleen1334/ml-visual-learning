import type { CSSProperties } from 'react'
import './DimensionalityReduction.css'
import SourceQuiz from './SourceQuiz'
import type { SourceQuizQuestion } from './SourceQuiz'

const students = [
  [1, 1.8, 2.1, 5.4, 5.6], [2, 2.9, 3.1, 6.6, 5.7], [3, 4.6, 5.7, 2.8, 1.6], [4, 8.0, 7.1, 3.5, 3.4], [5, 8.1, 8.0, 1.3, 2.2],
  [6, 8.3, 5.6, 7.0, 9.1], [7, 4.4, 4.2, 9.1, 7.3], [8, 7.2, 6.3, 8.1, 7.8], [9, 4.2, 5.1, 9.9, 9.3], [10, 8.7, 10.3, 8.2, 8.7],
] as const
const componentScores = [[2.8, 7.8], [4.3, 8.7], [7.3, 3.2], [10.7, 4.9], [11.4, 2.6], [10.0, 11.5], [6.1, 11.6], [9.6, 11.3], [6.6, 13.6], [13.5, 12.0]] as const
const subjects = ['Spelling', 'Vocabulary', 'Multiplication', 'Geometry'] as const
const paired = [[0, 1], [1, 2], [0, 2], [2, 3]] as const

function Header({ eyebrow, title, intro }: { eyebrow: string; title: string; intro: string }) {
  return <header className="dr-header"><p className="dr-eyebrow">{eyebrow}</p><h1>{title}</h1><p>{intro}</p></header>
}

function Table({ headers, rows, label }: { headers: string[]; rows: (string | number)[][]; label: string }) {
  return <div className="dr-table-scroll"><table className="dr-table"><caption>{label}</caption><thead><tr>{headers.map((header) => <th key={header} scope="col">{header}</th>)}</tr></thead><tbody>{rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>)}</tbody></table></div>
}

export function DRIntroduction() {
  return <article className="dr-lesson"><Header eyebrow="21.1 · Introduction" title="Reduce many columns to a smaller set of useful dimensions" intro="This chapter introduces dimensionality reduction, PCA, and the limits of interpreting its results." />
    <div className="dr-chapter-map" aria-label="Chapter topics"><span>Dimensionality reduction basics</span><b aria-hidden="true">→</b><span>Principal component analysis</span><b aria-hidden="true">→</b><span>Advanced techniques</span><b aria-hidden="true">→</b><span>Key takeaways</span></div>
  </article>
}

export function DRBasics() {
  const business = ['Summarize item-level sales to compare groups or categories', 'Find broad trends across large surveys without inspecting every question', 'Describe customer traits from activity, transactions, or survey responses']
  const machine = ['Reduce redundant or unnecessary dimensions; this can help a model, but does not guarantee better predictions', 'Visualize clusters in two or three dimensions to spot-check a segmentation', 'Reduce correlated inputs and multicollinearity for a more useful model']
  return <article className="dr-lesson"><Header eyebrow="21.2 · Dimensionality reduction basics" title="Keep fewer columns while retaining useful information" intro="Dimensionality reduction summarizes a high-dimensional dataset in fewer dimensions for business understanding or machine learning." />
    <div className="dr-use-cases"><section><p className="dr-eyebrow">Business intelligence</p><h2>Find the broad picture</h2><ul>{business.map((item) => <li key={item}>{item}</li>)}</ul></section><section><p className="dr-eyebrow">Machine learning</p><h2>Make data easier to work with</h2><ul>{machine.map((item) => <li key={item}>{item}</li>)}</ul></section></div>
  </article>
}

export function DRPCAIntro() {
  const steps = [
    ['Start with many columns', 'Choose data that could be represented more usefully in fewer dimensions.'],
    ['Find components', 'Fit new lines through patterns in the original dimensions; these lines become candidate dimensions.'],
    ['Read the loadings', 'Check how each component relates to the original columns, then use judgment to interpret it.'],
    ['Choose principal components', 'Keep components that explain a material share of the variance; a scree plot can guide the choice.'],
    ['Continue with fewer dimensions', 'Use the retained component scores for later analysis in place of the original columns.'],
  ]
  return <article className="dr-lesson"><Header eyebrow="21.3 · Principal component analysis" title="PCA builds new dimensions from patterns in the old ones" intro="Principal component analysis (PCA) finds component directions through the observations and records each observation’s position on them." />
    <ol className="dr-pca-steps">{steps.map(([title, detail], i) => <li key={title}><span>{i + 1}</span><div><h2>{title}</h2><p>{detail}</p></div></li>)}</ol>
    <p className="dr-note">This is the course’s visual intuition for PCA. The slides do not derive the underlying calculations.</p>
  </article>
}

function PairPlot({ xIndex, yIndex }: { xIndex: number; yIndex: number }) {
  const left = 40, top = 15, width = 240, height = 150
  const x = (v: number) => left + (v / 12) * width
  const y = (v: number) => top + height - (v / 12) * height
  return <svg viewBox="0 0 310 205" role="img" aria-label={`${subjects[xIndex]} plotted horizontally against ${subjects[yIndex]} vertically for the ten students`}>
    {[0, 2, 4, 6, 8, 10, 12].map((tick) => <g key={`grid-${tick}`}><path className="dr-grid" d={`M${x(tick)} ${top}V${top + height} M${left} ${y(tick)}H${left + width}`} /><text className="dr-tick" x={x(tick)} y={top + height + 16} textAnchor="middle">{tick}</text><text className="dr-tick" x={left - 7} y={y(tick) + 3} textAnchor="end">{tick}</text></g>)}
    {students.map((row) => <circle key={row[0]} cx={x(row[xIndex + 1])} cy={y(row[yIndex + 1])} r="3.5"><title>{`Student ${row[0]}: ${subjects[xIndex]} ${row[xIndex + 1]}, ${subjects[yIndex]} ${row[yIndex + 1]}`}</title></circle>)}
    <text className="dr-axis-label" x={left + width / 2} y="198" textAnchor="middle">{subjects[xIndex]} (X)</text><text className="dr-axis-label" transform="translate(12 90) rotate(-90)" textAnchor="middle">{subjects[yIndex]} (Y)</text>
  </svg>
}

export function DRPCAExample() {
  return <article className="dr-lesson"><Header eyebrow="21.4 · PCA example" title="Ten students’ scores reveal two related subject pairs" intro="Compare the four course source plots, then see the exact student scores that PCA summarizes." />
    <section className="dr-pairs" aria-label="Four source score relationships">{paired.map(([xIndex, yIndex]) => <figure key={`${xIndex}-${yIndex}`}><figcaption>{subjects[xIndex]} (X) / {subjects[yIndex]} (Y)</figcaption><PairPlot xIndex={xIndex} yIndex={yIndex} /></figure>)}</section>
    <p className="dr-note"><strong>What the source points out:</strong> Spelling and Vocabulary move together, as do Multiplication and Geometry. The middle pair plots show weaker relationships. PCA looks for compact dimensions that capture shared variation.</p>
    <Table label="PDF p. 353 · student test scores (n = 10)" headers={['Student', ...subjects]} rows={students.map((row) => [...row])} />
    <Table label="PDF pp. 356–357 · source component scores" headers={['Student', 'Language component', 'Math component']} rows={componentScores.map((row, i) => [i + 1, row[0].toFixed(1), row[1].toFixed(1)])} />
    <p className="dr-note">The course records each student’s position on the two new component lines as new columns. These are the source’s displayed scores, not values recalculated here.</p>
  </article>
}

export function DRInterpretComponents() {
  const rows = students.map((row, i) => [...row, componentScores[i][0].toFixed(1), componentScores[i][1].toFixed(1)])
  return <article className="dr-lesson"><Header eyebrow="21.5 · Interpreting components" title="Loadings help people name a component" intro="A component is a combination of original columns. Its loadings show how strongly each original dimension contributes in the course example." />
    <div className="dr-loading-grid"><section><h2>Component 1 → “language”</h2><p>Large loadings sit on Spelling and Vocabulary.</p><div className="dr-equation">Y = <strong>0.72</strong> × Spelling + <strong>0.69</strong> × Vocabulary − 0.02 × Multiplication + 0.03 × Geometry</div><div className="dr-bars" aria-label="Language component loadings"><span style={{ '--loading': '72%' } as CSSProperties}>Spelling <b>0.72</b></span><span style={{ '--loading': '69%' } as CSSProperties}>Vocabulary <b>0.69</b></span><span style={{ '--loading': '2%' } as CSSProperties}>Multiplication <b>−0.02</b></span><span style={{ '--loading': '3%' } as CSSProperties}>Geometry <b>0.03</b></span></div></section>
      <section><h2>Component 2 → “math”</h2><p>Large loadings sit on Multiplication and Geometry.</p><div className="dr-equation">Y = 0.004 × Spelling + 0.001 × Vocabulary + <strong>0.68</strong> × Multiplication + <strong>0.72</strong> × Geometry</div><div className="dr-bars" aria-label="Math component loadings"><span style={{ '--loading': '1%' } as CSSProperties}>Spelling <b>0.004</b></span><span style={{ '--loading': '1%' } as CSSProperties}>Vocabulary <b>0.001</b></span><span style={{ '--loading': '68%' } as CSSProperties}>Multiplication <b>0.68</b></span><span style={{ '--loading': '72%' } as CSSProperties}>Geometry <b>0.72</b></span></div></section></div>
    <p className="dr-warning"><strong>Names are an interpretation.</strong> PCA supplies loadings and component scores; a person decides whether “language” and “math” are useful labels. The model does not explain what a component means.</p>
    <Table label="The course joins original scores with its two named component scores" headers={['Student', ...subjects, 'Language', 'Math']} rows={rows} />
  </article>
}

export function DRScreePlot() {
  const individual = [49, 40, 7, 2, 1, 1, 0]
  const cumulative = [49, 89, 96, 98, 99, 100, 100]
  const x = (i: number) => 64 + i * 66
  const y = (v: number) => 205 - v * 1.65
  return <article className="dr-lesson"><Header eyebrow="21.6 · Scree plots" title="Keep the components before the curve flattens" intro="A scree plot compares each component’s variance contribution with cumulative variance. The course uses the elbow as a practical guide." />
    <figure className="dr-scree"><svg viewBox="0 0 560 260" role="img" aria-labelledby="scree-title scree-desc"><title id="scree-title">Course scree plot shape</title><desc id="scree-desc">Seven bars show component variance contributions of about 49, 40, 7, 2, 1, 1, and less than 1 percent. The cumulative line reaches about 89 percent by component two and then flattens.</desc>
      {[0, 20, 40, 60, 80, 100].map((tick) => <g key={tick}><path className="dr-grid" d={`M54 ${y(tick)}H526`} /><text className="dr-tick" x="45" y={y(tick) + 4} textAnchor="end">{tick}%</text></g>)}
      {individual.map((value, i) => <g key={i}><rect className="dr-bar" x={x(i) - 17} y={y(value)} width="34" height={205 - y(value)} /><text className="dr-tick" x={x(i)} y="225" textAnchor="middle">{i + 1}</text></g>)}
      <path className="dr-cumulative" d={cumulative.map((value, i) => `${i ? 'L' : 'M'}${x(i)} ${y(value)}`).join(' ')} />{cumulative.map((value, i) => <circle className="dr-cumulative-dot" key={i} cx={x(i)} cy={y(value)} r="4"><title>{`After component ${i + 1}: approximately ${value}% cumulative in this simplified reading`}</title></circle>)}
      <text className="dr-axis-label" x="286" y="251" textAnchor="middle">Component number</text><text className="dr-label" x="107" y="111">Individual contribution ▪</text><text className="dr-label" x="314" y="65">Cumulative variance —</text>
      <path className="dr-elbow" d={`M${x(1)} ${y(89)}v14`} /><text className="dr-label" x={x(1)} y={y(89) + 30} textAnchor="middle">source elbow</text>
    </svg><figcaption>Approximate readings from the source chart (PDF p. 358); the course keeps the first two components.</figcaption></figure>
    <p className="dr-note">The first two components account for roughly 89% together in the chart. Later components add little, so the plotted curve flattens. An elbow is a heuristic: consider the analysis goal and the information you can afford to lose.</p>
  </article>
}

export function DRAdvancedTechniques() {
  const methods = [['Kernel PCA', 'PCA extended to capture nonlinear relationships.'], ['t-SNE', 'A nonlinear method the course lists for specialized dimensionality reduction.'], ['UMAP', 'Uniform Manifold Approximation and Projection; the video describes it as similar in application to t-SNE.'], ['Self-Organizing Maps', 'Another specialized method listed by the course.']]
  return <article className="dr-lesson"><Header eyebrow="21.7 · Advanced techniques" title="Nonlinear methods can reveal more complex structure" intro="PCA is a widely used linear approach. The course also introduces several more specialized nonlinear techniques." />
    <div className="dr-method-list">{methods.map(([name, detail], i) => <section key={name}><span>0{i + 1}</span><div><h2>{name}</h2><p>{detail}</p></div></section>)}</div>
    <p className="dr-note">Nonlinear methods can be harder to interpret. The course notes that UMAP is similar to t-SNE in application and says it runs faster; treat that as the course’s broad comparison, not a universal performance guarantee.</p>
  </article>
}

export function DRTakeaways() {
  return <article className="dr-lesson"><Header eyebrow="21.8 · Key takeaways" title="Reduce dimensions, then decide what they mean" intro="Use fewer columns when a compact representation helps answer the business question or supports a later analysis." />
    <div className="dr-takeaways"><section><h2>Reduce</h2><p>Dimensionality reduction retains a smaller number of dimensions while trying to preserve useful information.</p></section><section><h2>Interpret</h2><p>PCA forms new component dimensions. Read loadings and use human judgment to interpret them.</p></section><section><h2>Continue</h2><p>Use retained component scores for analysis such as prediction, classification, or clustering, while keeping the original objective in view.</p></section></div>
  </article>
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
