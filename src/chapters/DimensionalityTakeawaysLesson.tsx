import './DimensionalityTakeawaysLesson.css'

export function DimensionalityTakeawaysLesson() {
  return <article className="dr-lesson dr-takeaways-lesson">
    <header className="dr-header">
      <p className="dr-eyebrow">21.8 · Key takeaways</p>
      <h1>Dimensionality reduction</h1>
      <p>A quick review of the ideas and where to use them.</p>
    </header>

    <div className="dr-takeaways-lesson-source">
      <section className="dr-takeaways-lesson-item">
        <span className="dr-takeaways-lesson-check" aria-hidden="true">✓</span>
        <div><p className="dr-takeaways-lesson-statement"><strong>Dimensionality reduction</strong> is used to reduce the number of columns in a data set while losing as little information as possible.</p>
          <p className="dr-takeaways-lesson-detail"><em>This can be used for model optimization, or to identify overarching trends or patterns in a granular dataset.</em></p></div>
      </section>
      <section className="dr-takeaways-lesson-item">
        <span className="dr-takeaways-lesson-check" aria-hidden="true">✓</span>
        <div><p className="dr-takeaways-lesson-statement">One of the most common dimensionality reduction techniques is known as <strong>Principal Component Analysis</strong> (PCA).</p>
          <p className="dr-takeaways-lesson-detail"><em>PCA essentially fits lines through the observations in a data set to create new dimensions to analyze.</em></p></div>
      </section>
      <section className="dr-takeaways-lesson-item">
        <span className="dr-takeaways-lesson-check" aria-hidden="true">✓</span>
        <div><p className="dr-takeaways-lesson-statement">Dimensionality reduction requires <strong>human logic and intuition</strong> to interpret what each component actually means.</p>
          <p className="dr-takeaways-lesson-detail"><em>This will help you simplify your data, understand it on a deeper level, and conduct further analysis.</em></p></div>
      </section>
    </div>

    <section className="dr-takeaways-lesson-uses">
      <h2>Common use cases</h2>
      <div className="dr-takeaways-lesson-columns">
        <div><h3>Business intelligence</h3><p>Summarize item-level sales, find overarching survey trends, or understand customers’ main traits.</p></div>
        <div><h3>Model optimization</h3><p>Reduce redundant dimensions, visualize clusters, or address multicollinearity before further analysis.</p></div>
      </div>
    </section>

    <section className="dr-takeaways-lesson-workflow">
      <h2>Putting it into practice</h2>
      <ol>
        <li><strong>Check the goal and data.</strong> Look for related or redundant columns and decide whether a simpler representation would help.</li>
        <li><strong>Choose and interpret.</strong> If PCA fits the goal, inspect the scree plot to help choose how many components to retain, then use the loadings and your judgment to interpret them.</li>
        <li><strong>Continue the analysis.</strong> Use the retained components for the task at hand, such as visualization, prediction, classification, or clustering.</li>
      </ol>
    </section>
    <p className="dr-takeaways-lesson-note"><strong>Note:</strong> The scree plot’s elbow is a guide, not a fixed rule. PCA’s fitted-line description is an intuition; improved predictions and reduced multicollinearity are possible benefits, not guarantees.</p>
  </article>
}
