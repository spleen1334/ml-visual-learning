import screePlot from '../assets/pca-scree-plot.png'
import clusteringPlot from '../assets/pca-scree-clustering.png'
import './DimensionalityScreeLesson.css'

const students = [
  [1, 1.8, 2.1, 5.4, 5.6, 2.8, 7.8], [2, 2.9, 3.1, 6.6, 5.7, 4.3, 8.7],
  [3, 4.6, 5.7, 2.8, 1.6, 7.3, 3.2], [4, 8.0, 7.1, 3.5, 3.4, 10.7, 4.9],
  [5, 8.1, 8.0, 1.3, 2.2, 11.4, 2.6], [6, 8.3, 5.6, 7.0, 9.1, 10.0, 11.5],
  [7, 4.4, 4.2, 9.1, 7.3, 6.1, 11.6], [8, 7.2, 6.3, 8.1, 7.8, 9.6, 11.3],
  [9, 4.2, 5.1, 9.9, 9.3, 6.6, 13.6], [10, 8.7, 10.3, 8.2, 8.7, 13.5, 12.0],
] as const

function StudentTable({ reduced = false }: { reduced?: boolean }) {
  const headers = reduced ? ['Student ID', 'Language', 'Math'] : ['Student ID', 'Spelling', 'Vocabulary', 'Multiplication', 'Geometry', 'Language', 'Math']
  return <div className="dr-scree-lesson-table-wrap"><table className="dr-scree-lesson-table"><thead><tr>{headers.map((header, i) => <th className={(reduced ? i > 0 : i > 4) ? 'dr-scree-lesson-component' : ''} scope="col" key={header}>{header}</th>)}</tr></thead><tbody>{students.map((row) => {
    const cells = reduced ? [row[0], row[5], row[6]] : row
    return <tr key={row[0]}>{cells.map((value, i) => <td key={i}>{i === 0 ? value : value.toFixed(1)}</td>)}</tr>
  })}</tbody></table></div>
}

export function ScreePlotLesson() {
  return <article className="dr-lesson dr-scree-lesson">
    <header className="dr-header"><p className="dr-eyebrow">21.6 · Scree plots</p><h1>How many components should we keep?</h1><p className="dr-scree-lesson-definition">A <strong>scree plot</strong> visualizes how much variance is explained by the components, helping us choose how many to retain.</p></header>
    <section className="dr-scree-lesson-stage">
      <p>Look for the <strong>“elbow”</strong> where additional components add relatively little value, similar to a WSS chart for clustering. Variance describes how much the data varies; cumulative variance adds the contributions up as components are included.</p>
      <p>The components up to and including the elbow can be retained as the <strong>principal components</strong>; the others can be disregarded.</p>
      <figure className="dr-scree-lesson-figure"><img src={screePlot} alt="Scree plot with seven component bars and a turquoise cumulative-variance line, on a zero to 100 percent scale. The curve rises to about 89 percent at component two and then flattens. An arrow points to the bend: the first two components explain most of the variance and later components have minimal impact." /><figcaption>Dark bars: variance explained by each component. Turquoise line: cumulative variance explained. Component numbers run from 1 to 7.</figcaption></figure>
      <p className="dr-scree-lesson-note">The elbow is a guide, not a guarantee; the choice also depends on how much information the analysis needs.</p>
    </section>
    <section className="dr-scree-lesson-stage"><h2>Return to the student data</h2>
      <StudentTable />
      <p>In this example, defining components for <strong>language</strong> and <strong>math</strong> helped us simplify and better understand the data set.</p>
      <p>Using the new components we derived, we can conduct further analysis like <strong>predictive modeling, classification, and clustering</strong>.</p>
    </section>
    <section className="dr-scree-lesson-stage"><h2>Explore the reduced dimensions</h2>
      <div className="dr-scree-lesson-cluster"><StudentTable reduced /><figure className="dr-scree-lesson-figure"><img src={clusteringPlot} alt="Scatterplot of student language and math component scores, both axes ranging from 0 to 16. Three turquoise outlines group students whose scores lean toward math, toward language, or are high in both." /></figure></div>
      <p>For example, <strong>clustering</strong> (grouping similar observations) might help us understand student testing patterns: most skew towards either language or math, while a few excel in both subjects.</p>
      <p>These two dimensions can be plotted together; four original dimensions are harder to visualize at once. PCA can also help with data sets containing many more dimensions.</p>
    </section>
  </article>
}
