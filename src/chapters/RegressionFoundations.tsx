import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { PlaybackButton } from '../components/PlaybackButton'
import equation from '../assets/regression-modeling-205.png'
import patterns from '../assets/regression-modeling-206.png'
import perfectLine from '../assets/regression-modeling-207.png'
import noisyLines from '../assets/regression-modeling-208.png'
import step1 from '../assets/least-squares-step-1.png'
import step2 from '../assets/least-squares-step-2.png'
import step3 from '../assets/least-squares-step-3.png'
import step4 from '../assets/least-squares-step-4.png'
import step5 from '../assets/least-squares-step-5.png'
import './RegressionModeling.css'
import './RegressionFoundations.css'

function Lesson({ number, title, lead, children }: { number: string; title: string; lead: string; children: ReactNode }) {
  return <article className="regression-modeling regression-foundations" aria-labelledby={`rf-${number}-title`}><header><p className="rm-eyebrow">Chapter 13 · Lesson {number}</p><h1 id={`rf-${number}-title`}>{title}</h1><p>{lead}</p></header>{children}</article>
}

function SourceFigure({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return <figure className={`rf-source-figure ${className}`}><img src={src} alt={alt} /></figure>
}

export function RMLinearRelationships() {
  return <Lesson number="13.2" title="Linear relationships" lead="A linear relationship changes at a steady rate: equal steps in x produce equal steps in y.">
    <section className="rm-panel">
      <h2>A straight line has an intercept and a slope</h2>
      <SourceFigure src={equation} alt="The source equation y equals alpha plus beta x, with arrows labeling y as the outcome, x as the input, alpha as the y-intercept, and beta as slope (rise over run); the adjacent graph marks the intercept and slope." className="rf-equation-figure" />
      <p><strong>y = α + βx.</strong> The intercept α is y when x is zero. The slope β is the change in y for each one-unit increase in x.</p>
    </section>
    <section className="rm-panel">
      <h2>Four patterns in observed data</h2>
      <SourceFigure src={patterns} alt="Four source scatterplots: positive linear, negative linear, nonlinear logarithmic, and no relationship." className="rf-pattern-figure" />
      <div className="rf-pattern-explanations">
        <div><h3>Positive linear</h3><p>As <strong>x increases, y tends to increase</strong>. The points follow an upward straight trend, with a roughly steady change in y for each extra unit of x.</p></div>
        <div><h3>Negative linear</h3><p>As <strong>x increases, y tends to decrease</strong>. The points follow a downward straight trend, again with a roughly steady rate of change.</p></div>
        <div><h3>Non-linear</h3><p>The points follow a <strong>curve</strong>, so the rate changes. In this logarithmic example, y rises quickly at first, then increases more slowly as x grows.</p></div>
        <div><h3>No relationship</h3><p>The points form a cloud with <strong>no clear upward, downward, or curved trend</strong>. Here, knowing x gives little guidance about y.</p></div>
      </div>
    </section>
    <section className="rm-panel rf-perfect-noisy">
      <div><h2>A perfect line is rare in real data</h2><p>With a perfectly linear relationship, every point lies on one line and y can be calculated exactly from x. Real observations vary around candidate lines; least squares compares their errors.</p></div>
      <SourceFigure src={perfectLine} alt="A source graph where every observed point lies on one straight line, illustrating a perfectly linear relationship." />
      <SourceFigure src={noisyLines} alt="The ten noisy source observations with three candidate straight lines. The source explains that variance allows several lines to fit the data and introduces least squared error for choosing a best fit." />
    </section>
  </Lesson>
}

type Candidate = 'first' | 'second'
type Point = { x: number; y: number }
const observations: Point[] = [
  { x: 10, y: 10 }, { x: 20, y: 25 }, { x: 30, y: 20 }, { x: 35, y: 30 }, { x: 40, y: 40 },
  { x: 50, y: 15 }, { x: 60, y: 40 }, { x: 65, y: 30 }, { x: 70, y: 50 }, { x: 80, y: 40 },
]
const candidates: Record<Candidate, { label: string; alpha: number; beta: number }> = {
  first: { label: 'y = 10 + 0.5x', alpha: 10, beta: 0.5 },
  second: { label: 'y = 12 + 0.4x', alpha: 12, beta: 0.4 },
}

function calculateRows(candidate: Candidate) {
  const { alpha, beta } = candidates[candidate]
  return observations.map(point => {
    const prediction = alpha + beta * point.x
    const residual = point.y - prediction
    return { ...point, prediction, residual, squared: residual ** 2 }
  })
}

function totalSse(candidate: Candidate) {
  return calculateRows(candidate).reduce((total, row) => total + row.squared, 0)
}

const steps = [
  { title: 'Plot the observations', description: 'Plot each (x, y) pair and record the observed values.', image: step1 },
  { title: 'Draw a candidate line', description: 'Use y = 10 + 0.5x to calculate a predicted y for every x.', image: step2 },
  { title: 'Calculate each residual', description: 'A residual is the prediction error: actual y − predicted y. The dashed vertical gap joins an observation to the line at the same x.', image: step3 },
  { title: 'Square the residuals and add them', description: 'The sum of squared errors (SSE) measures the total squared error for this line.', image: step4 },
  { title: 'Try another line and compare', description: 'Repeat the calculation with y = 12 + 0.4x. Its smaller SSE means a closer overall fit to the same ten observations.', image: step5 },
]

export function RMLeastSquares() {
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [step, setStep] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 4 : 0)
  const [playing, setPlaying] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => { setReducedMotion(query.matches); if (query.matches) { setPlaying(false); setStep(4) } }
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  useEffect(() => {
    if (!playing || reducedMotion) return
    const timer = window.setTimeout(() => {
      if (step === 4) setPlaying(false)
      else setStep(step + 1)
    }, 5500)
    return () => window.clearTimeout(timer)
  }, [playing, reducedMotion, step])
  const candidate: Candidate = step === 4 ? 'second' : 'first'
  const rows = calculateRows(candidate)
  const navigate = (next: number) => { setPlaying(false); setStep(next) }
  return <Lesson number="13.3" title="Least squared error" lead="Find the line that minimizes the total squared prediction error across the dataset.">
    <section className="rm-panel rf-error-definition">
      <h2>What is a residual?</h2>
      <p>A <strong>residual</strong> is an error: the difference between an observed value and the value predicted by the line.</p>
      <p className="rf-formula">Residual = actual y − predicted y</p>
      <p>For x = 10, the first line predicts 15, but the observed y is 10. The residual is <strong>10 − 15 = −5</strong>. Above the line, residuals are positive; below it, they are negative.</p>
    </section>
    <section className="rm-panel rf-walkthrough">
      <h2>Least squares, step by step</h2>
      <ol className="rf-step-strip" aria-label="Five steps of least squares">{steps.map((item, index) => <li key={item.title} aria-current={step === index ? 'step' : undefined}><button onClick={() => navigate(index)}><span>Step {index + 1}</span>{item.title}</button></li>)}</ol>
      <div className="rm-choice rf-playback"><PlaybackButton action="previous" label="Previous step" onClick={() => navigate(Math.max(0, step - 1))} disabled={step === 0}/><PlaybackButton action={playing ? 'pause' : step === 4 ? 'replay' : 'play'} label={playing ? 'Pause' : step === 4 ? 'Replay five steps' : 'Play'} disabled={reducedMotion} onClick={() => { if (step === 4) setStep(0); setPlaying(!playing) }}/><PlaybackButton action="next" label="Next step" onClick={() => navigate(Math.min(4, step + 1))} disabled={step === 4}/></div>
      <div className="rf-step-caption"><h3>Step {step + 1}: {steps[step].title}</h3><p>{steps[step].description}</p></div>
      <div className="rf-slide-layout">
        <figure className="rf-step-graph"><img src={steps[step].image} alt={step === 0 ? 'Ten observed points on a scatterplot, with x from 10 to 80 and y from 10 to 50.' : `${candidates[candidate].label} drawn through the same ten points${step >= 2 ? ', with dashed vertical residuals' : ''}${step === 4 ? '; the first line remains faintly visible for comparison' : ''}.`} /></figure>
        <div className="rm-table-wrap rf-step-table"><table><caption>Same ten observations at every step</caption><thead><tr><th>x</th><th>Actual y</th>{step >= 1 && <th>Predicted y</th>}{step >= 2 && <th>Residual</th>}{step >= 3 && <th>Residual²</th>}</tr></thead><tbody>{rows.map(row => <tr key={row.x}><td>{row.x}</td><td>{row.y}</td>{step >= 1 && <td>{row.prediction}</td>}{step >= 2 && <td>{row.residual}</td>}{step >= 3 && <td>{row.squared}</td>}</tr>)}</tbody>{step >= 3 && <tfoot><tr><th colSpan={4}>SSE</th><td>{totalSse(candidate)}</td></tr></tfoot>}</table></div>
      </div>
      {step >= 2 && <p className="rf-worked-residual">At x = 10: actual <strong>10</strong> − predicted <strong>{rows[0].prediction}</strong> = residual <strong>{rows[0].residual}</strong>{step >= 3 && <> → squared error <strong>({rows[0].residual})² = {rows[0].squared}</strong></>}</p>}
      {step >= 3 && <p className="rf-formula">SSE = sum of all ten squared residuals = <strong>{totalSse(candidate)}</strong></p>}
    </section>
    <section className="rm-panel">
      <h2>Why square the errors?</h2>
      <div className="rf-pattern-explanations"><div><h3>Errors cannot cancel out</h3><p>Positive and negative residuals can add to zero even when predictions are wrong. Squaring makes them non-negative: <strong>(−5)² = 25</strong> and <strong>(+5)² = 25</strong>, so both errors count.</p></div><div><h3>Large errors count more</h3><p>An error of 10 contributes <strong>100</strong>; an error of 5 contributes <strong>25</strong>. Doubling an error makes its squared contribution four times larger, so outliers can strongly influence the fitted line.</p></div></div>
      <p>Squaring also gives a smooth objective that software can optimize efficiently.</p>
    </section>
    <section className="rm-panel">
      <h2>Lower SSE means a better fit to these data</h2>
      <div className="rf-sse-comparison"><div><span>Candidate 1</span><strong>y = 10 + 0.5x</strong><b>SSE = 862.5</b></div><div className="rf-better-fit"><span>Candidate 2 · lower error</span><strong>y = 12 + 0.4x</strong><b>SSE = 722</b></div></div>
      <p><strong>722 is lower than 862.5</strong>, so the second line fits this dataset better overall. It need not improve the error for every individual point.</p>
      <p>Keep the dataset fixed and repeat the fit calculation with different intercepts and slopes, seeking the <strong>smallest possible SSE</strong>. These two lines illustrate the comparison; the second is not necessarily the best possible line. Software finds the minimizing parameters efficiently, rather than relying on repeated guesses.</p>
    </section>
  </Lesson>
}
