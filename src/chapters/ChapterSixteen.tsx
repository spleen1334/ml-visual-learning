import './ChapterSixteen.css'

const TOPICS = [
  { number: '01', title: 'Intro to Unsupervised ML', detail: 'Review the ML landscape, supervised and unsupervised learning, feature engineering, and the workflow.' },
  { number: '02', title: 'Segmentation & Clustering', detail: 'Learn the building blocks of segmentation, then study K-Means and hierarchical clustering.' },
  { number: '03', title: 'Association Mining', detail: 'Explore common techniques and use cases, including A Priori and Markov models.' },
  { number: '04', title: 'Outlier Detection', detail: 'Study unusual observations in cross-sectional and time-series data, including nearest-neighbor distance and time-series models.' },
  { number: '05', title: 'Dimensionality Reduction', detail: 'Build core foundations and see how dimensionality reduction supports BI and unsupervised learning.' },
] as const

export default function ChapterSixteen() {
  return <article className="chapter-sixteen" aria-labelledby="chapter-sixteen-title">
    <header className="chapter-sixteen__intro">
      <p className="chapter-sixteen__eyebrow">Chapter 16 · Part 4 of 4</p>
      <h1 id="chapter-sixteen-title">Finding patterns without a target label</h1>
      <p>The course now turns to <strong>unsupervised learning</strong>: ways to explore structure in data when there is no known outcome label to predict.</p>
      <div className="chapter-sixteen__journey" aria-label="The course's four parts, with Part 4 now active">
        <div><span>Part 1</span><strong>QA &amp; data profiling</strong><i aria-hidden="true">✓</i></div>
        <b aria-hidden="true">→</b>
        <div><span>Part 2</span><strong>Classification</strong><i aria-hidden="true">✓</i></div>
        <b aria-hidden="true">→</b>
        <div><span>Part 3</span><strong>Regression &amp; forecasting</strong><i aria-hidden="true">✓</i></div>
        <b aria-hidden="true">→</b>
        <div className="is-current"><span>Part 4</span><strong>Unsupervised learning</strong><i aria-hidden="true">●</i></div>
      </div>
    </header>

    <section className="chapter-sixteen__outline" aria-labelledby="chapter-sixteen-outline-title">
      <div className="chapter-sixteen__outline-heading">
        <p className="chapter-sixteen__eyebrow">The path ahead</p>
        <h2 id="chapter-sixteen-outline-title">Five ways to explore structure in data</h2>
        <p>Each topic builds a different view of patterns that do not begin with a supplied answer.</p>
      </div>
      <ol>{TOPICS.map((topic) => <li key={topic.number}>
        <span className="chapter-sixteen__number" aria-hidden="true">{topic.number}</span>
        <h3>{topic.title}</h3>
        <p>{topic.detail}</p>
      </li>)}</ol>
    </section>

    <aside className="chapter-sixteen__summary" aria-label="Chapter summary">
      <span aria-hidden="true">✓</span>
      <p><strong>Part 4 shifts the question:</strong> instead of predicting a known label, we will look for useful structure in the data itself. The next chapter reviews the unsupervised learning workflow before the methods begin.</p>
    </aside>
  </article>
}
