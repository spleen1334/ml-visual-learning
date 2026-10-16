import { useState } from 'react'
import './UnivariateMetrics.css'
import './UnivariateCheatSheet.css'

type Tool = {
  name: string
  href: string
  answers: string
  use: string
  caution: string
}

type ProjectStep = { title: string; task: string; tools: string; output: string }

const projectSteps: ProjectStep[] = [
  {
    title: 'Set the scope',
    task: 'Choose one record per completed order and a clear period, such as the last 90 days. Define delivery time in calendar days from dispatch to delivery. Pending orders are outside this measure, so findings describe completed orders only.',
    tools: 'Write down the record unit, dates, unit, and what counts as complete.',
    output: 'A defined measure and a clear population: completed orders in the chosen period.',
  },
  {
    title: 'Check the data',
    task: 'Review missing dates, impossible negative durations, duplicates, and whether all orders use the same start and end definitions. Apply a missing-value method only if the data and question support it.',
    tools: 'Use record counts, missing-value checks, duplicate checks, and valid-range checks as needed.',
    output: 'A usable set of durations and a record of exclusions or unresolved issues.',
  },
  {
    title: 'Identify each variable',
    task: 'Delivery time is numeric. Fields such as shipping method or region are categorical; their labels do not become numeric measurements just because they have codes.',
    tools: 'Check the meaning and allowed values of each field before choosing a summary.',
    output: 'A variable type that guides which summaries and charts make sense.',
  },
  {
    title: 'Choose a view that fits',
    task: 'For shipping method or region, compare category counts and proportions. For delivery time, start with a histogram; a KDE can add a smoothed view when useful.',
    tools: 'Counts and proportions for categories; a histogram for numeric shape, with KDE as an optional complement.',
    output: 'Category balance or a view of numeric shape, gaps, and clusters.',
  },
  {
    title: 'Summarize what the shape supports',
    task: 'If times are fairly balanced, report the mean and standard deviation. If the distribution is skewed, the median and percentiles may better describe a typical order and slower deliveries.',
    tools: 'Choose center and spread from the observed shape. A normal curve and its 68–95–99.7 rule are useful only when a normal model is appropriate.',
    output: 'A center and spread that match the observed distribution and stay in interpretable units.',
  },
  {
    title: 'Investigate and communicate',
    task: 'Inspect unusually long or short times and revisit the source records and QA. Correct confirmed data issues; keep valid rare deliveries visible. Summarize the period, method, shape, and limits, then propose a multivariate investigation of possible factors such as region or shipping method.',
    tools: 'Return to source records for surprises, then describe findings and limits. Use only checks and summaries that answer the question; you do not need every tool.',
    output: 'A defensible description and a next question—not a causal claim from a one-variable profile.',
  },
]

const categoricalTools: Tool[] = [
  {
    name: 'Count & proportion', href: '#chapter-05/categorical-distributions',
    answers: 'How many records, and what share, fall in each category?',
    use: 'Summarize category balance or compare groups.',
    caution: 'Check the denominator and include missing values separately; a count is not the number of distinct labels.',
  },
  {
    name: 'Nominal vs. ordinal', href: '#chapter-05/nominal-vs-ordinal',
    answers: 'Do labels have a meaningful order?',
    use: 'Choose summaries that fit the meaning: mode for either type; median can use ordered categories.',
    caution: 'A code such as 1, 2, 3 does not make nominal labels numeric. Do not average ordinal codes as if gaps were equal.',
  },
  {
    name: 'Discretization', href: '#chapter-05/discretization',
    answers: 'What useful groups can summarize a numeric value?',
    use: 'Turn a measure such as price into clear ranges for a focused comparison.',
    caution: 'Choose cut points for a reason and retain the original values when their detail matters.',
  },
]

const shapeTools: Tool[] = [
  {
    name: 'Histogram', href: '#chapter-05/histograms-kernel-densities',
    answers: 'Where do numeric observations fall, and what shape do they make?',
    use: 'Start exploring spread, clusters, gaps, skew, and unusual values.',
    caution: 'Bin width and boundaries change the picture. Read the axis and check more than one sensible bin width.',
  },
  {
    name: 'Kernel density estimate (KDE)', href: '#chapter-05/histograms-kernel-densities',
    answers: 'Where does a smoothed estimate suggest values cluster?',
    use: 'See a continuous, smoothed view alongside a histogram.',
    caution: 'Bandwidth controls smoothness; a KDE estimates density and does not add observations or prove a normal shape.',
  },
  {
    name: 'Normal curve', href: '#chapter-05/normal-distribution',
    answers: 'How does a bell-shaped model describe values around a mean?',
    use: 'Compare distances in standard deviations when a normal model is appropriate.',
    caution: 'A bell-shaped plot is descriptive evidence, not proof of normality; the 68–95–99.7 rule assumes a normal distribution.',
  },
]

const summaryTools: Tool[] = [
  {
    name: 'Mode', href: '#chapter-05/mode',
    answers: 'Which value or category occurs most often?',
    use: 'Find the most common category or repeated numeric value.',
    caution: 'There can be tied modes or no useful single mode. A histogram’s tallest bin is a modal range, not an exact mode.',
  },
  {
    name: 'Mean', href: '#chapter-05/mean',
    answers: 'What is the arithmetic balance point?',
    use: 'Summarize a numeric center when values are reasonably balanced and outliers are not dominating.',
    caution: 'Extreme values pull the mean; pair it with a graph and a spread measure.',
  },
  {
    name: 'Median', href: '#chapter-05/median',
    answers: 'What value is in the middle after ordering?',
    use: 'Describe a typical numeric value when a distribution is skewed or has outliers; it also works for ordered categories.',
    caution: 'It does not describe how far values vary around the center.',
  },
  {
    name: 'Percentile', href: '#chapter-05/percentile',
    answers: 'What value marks a chosen position in ordered data?',
    use: 'Describe a threshold such as the 90th percentile, or compare an observation with the sample.',
    caution: 'A percentile value and percentile rank answer different questions. Calculation conventions can differ.',
  },
  {
    name: 'Variance', href: '#chapter-05/variance',
    answers: 'How large are squared deviations from the mean on average?',
    use: 'Compare spread mathematically or as an input to further calculations.',
    caution: 'Units are squared. Divide by n for a population or n−1 for a sample estimate.',
  },
  {
    name: 'Standard deviation', href: '#chapter-05/standard-deviation',
    answers: 'How far from the mean do values typically vary?',
    use: 'Describe numeric spread in the same units as the observations.',
    caution: 'It is sensitive to extreme values and does not mean every observation lies within one SD.',
  },
  {
    name: 'Skewness', href: '#chapter-05/skewness',
    answers: 'Is one tail longer than the other?',
    use: 'Describe distribution asymmetry alongside a histogram and center measures.',
    caution: 'The sign points toward the longer tail; skewness alone cannot establish normality or explain the cause.',
  },
]

function ToolTable({ title, id, tools }: { title: string; id: string; tools: Tool[] }) {
  return (
    <section className="uvm__panel uvbest__section" aria-labelledby={id}>
      <div className="uvm__panel-heading">
        <p className="uvm__eyebrow">Quick reference</p>
        <h2 id={id}>{title}</h2>
      </div>
      <div className="uvbest__table-wrap">
        <table className="uvbest__table">
          <thead>
            <tr><th scope="col">Tool</th><th scope="col">What it answers</th><th scope="col">Use it when</th><th scope="col">Watch for</th></tr>
          </thead>
          <tbody>
            {tools.map(tool => (
              <tr key={tool.name}>
                <th scope="row"><a href={tool.href}>{tool.name}<span aria-hidden="true"> ↗</span></a></th>
                <td>{tool.answers}</td><td>{tool.use}</td><td>{tool.caution}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export function UVBestPractices() {
  const [selectedStep, setSelectedStep] = useState(0)
  const step = projectSteps[selectedStep]

  return (
    <article className="uvm uvbest">
      <header className="uvm__intro uvbest__intro">
        <p className="uvm__eyebrow">Chapter 5.19 · Univariate profiling</p>
        <h1>A small field guide to profiling one variable</h1>
        <p className="uvm__definition"><strong>Pick a tool that matches the variable and the question.</strong> Then read the chart and summary together.</p>
        <nav className="uvbest__workflow" aria-label="A practical profiling workflow">
          <span><b>1</b> QA the values</span><i aria-hidden="true">→</i>
          <span><b>2</b> Identify the type</span><i aria-hidden="true">→</i>
          <span><b>3</b> Plot the distribution</span><i aria-hidden="true">→</i>
          <span><b>4</b> Summarize center &amp; spread</span><i aria-hidden="true">→</i>
          <span><b>5</b> Investigate surprises</span>
        </nav>
      </header>

      <ToolTable title="Categorical variables" id="uvbest-categorical" tools={categoricalTools} />
      <ToolTable title="Numeric shape and distribution" id="uvbest-shape" tools={shapeTools} />
      <ToolTable title="Center, position, spread, and shape" id="uvbest-summaries" tools={summaryTools} />

      <section className="uvm__panel uvbest__project" aria-labelledby="uvbest-project-title">
        <div className="uvm__panel-heading">
          <p className="uvm__eyebrow">A project, from question to next step</p>
          <h2 id="uvbest-project-title">Are delivery times reliable for an online shop?</h2>
          <p><strong>Click a step to follow the project from start to finish.</strong> Describe delivery reliability using recent completed orders. Each step shows what to check, which tools help, and what to carry forward. You do not need every tool.</p>
        </div>
        <div className="uvbest__steps" role="group" aria-label="Project workflow steps">
          {projectSteps.map((item, index) => (
            <button
              className={`uvbest__step-button${selectedStep === index ? ' is-active' : ''}`}
              key={item.title}
              type="button"
              aria-pressed={selectedStep === index}
              onClick={() => setSelectedStep(index)}
            >
              <span className="uvbest__step-number">{index + 1}</span>
              <span className="uvbest__step-label">{item.title}</span>
            </button>
          ))}
        </div>
        <div className="uvbest__step-detail" aria-live="polite" aria-atomic="true">
          <h3>{step.title}</h3>
          <p>{step.task}</p>
          <p><strong>Tools:</strong> {step.tools}</p>
          <p className="uvbest__output"><strong>Output:</strong> {step.output}</p>
        </div>
      </section>

      <aside className="uvm__summary uvbest__takeaway" aria-labelledby="uvbest-takeaway-title">
        <p className="uvm__eyebrow">Keep the context</p>
        <h2 id="uvbest-takeaway-title">No single number tells the whole story.</h2>
        <p>Check data quality first, choose summaries that fit the variable, and use plots to spot patterns that a statistic can hide. Treat unusual values as clues to investigate, not automatic errors.</p>
      </aside>
    </article>
  )
}
