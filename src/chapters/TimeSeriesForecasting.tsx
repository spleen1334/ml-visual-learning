import type { ReactNode } from 'react'
import './TimeSeriesForecasting.css'
import forecastingScene from '../assets/time-series-forecasting-math.png'
import acfLag1 from '../assets/time-series-acf-lag-1.webp'
import acfLag2 from '../assets/time-series-acf-lag-2.webp'
import acfLag3 from '../assets/time-series-acf-lag-3.webp'
import acfFinal from '../assets/time-series-acf-final.webp'
import seasonalityPlot from '../assets/time-series-seasonality-plot.webp'
import oneHot from '../assets/time-series-one-hot.webp'
import seasonalTrendMatrix from '../assets/time-series-seasonal-trend-matrix.webp'
import smoothingChart from '../assets/time-series-smoothing-chart.webp'
import nonlinear1 from '../assets/time-series-nonlinear-1.webp'
import nonlinear2 from '../assets/time-series-nonlinear-2.webp'
import nonlinear3 from '../assets/time-series-nonlinear-3.webp'
import nonlinear4 from '../assets/time-series-nonlinear-4.webp'
import nonlinearSource from '../assets/time-series-nonlinear-source.webp'
import intervention1 from '../assets/time-series-intervention-1.webp'
import intervention2 from '../assets/time-series-intervention-2.webp'
import intervention3 from '../assets/time-series-intervention-3.webp'
import intervention4 from '../assets/time-series-intervention-4.webp'
import partFour from '../assets/time-series-part-four.webp'

type LessonProps = { number: string; title: string; lead: string; children: ReactNode }
type SourceImage = { src: string; alt: string; caption: string }

function Lesson({ number, title, lead, children }: LessonProps) {
  return <article className="tsf" aria-labelledby={`tsf-${number}`}>
    <header className="tsf__header">
      <p className="tsf__eyebrow">Chapter 15 · Lesson {number}</p>
      <h1 id={`tsf-${number}`}>{title}</h1>
      <p className="tsf__lead">{lead}</p>
    </header>
    {children}
  </article>
}

function SourceFigure({ src, alt, caption }: SourceImage) {
  return <figure className="tsf__source">
    <img src={src} alt={alt} />
    <figcaption>{caption}</figcaption>
  </figure>
}

function SourceSequence({ items, label }: { items: SourceImage[]; label: string }) {
  return <div className="tsf__sequence" aria-label={label}>
    {items.map(item => <SourceFigure key={item.src} {...item} />)}
  </div>
}

export function TSIntro() {
  return <Lesson number="15.1" title="Intro to forecasting" lead="Time-series forecasting predicts future values of a single numeric dependent variable recorded over time.">
    <div className="tsf__intro-scene"><img src={forecastingScene} alt="" /><div><p>Forecasting uses regression ideas to look for patterns in past observations, such as seasonality or a linear or non-linear trend.</p>
    <section className="tsf__text-block" aria-labelledby="tsf-intro-examples">
      <h2 id="tsf-intro-examples">Common examples</h2>
      <ul><li>Forecasting revenue for the next fiscal year</li><li>Predicting website traffic growth over time</li><li>Estimating sales for a new product launch</li></ul>
    </section></div></div>
  </Lesson>
}

export function TSSeasonality() {
  return <Lesson number="15.2" title="Seasonality" lead="Seasonality is a repeatable, predictable pattern that an outcome may follow over time.">
    <p>It often follows a calendar period, such as a month, day of the week or hour, but a repeating pattern does not have to follow the calendar.</p>
    <section className="tsf__text-block" aria-labelledby="tsf-seasonality-examples">
      <h2 id="tsf-seasonality-examples">Examples from the course</h2>
      <ul><li>Website traffic by hour of the day</li><li>Seasonal product sales</li><li>Airline ticket prices around major holidays</li></ul>
    </section>
    <SourceFigure src={seasonalityPlot} alt="The time-series plot has repeated peaks near January 6, 13 and 20, separated by similar low periods." caption="The peaks recur at regular intervals, showing a repeating pattern." />
    <p className="tsf__note">An autocorrelation function can help identify a repeating period. One-hot encoding or moving averages can then represent seasonal patterns in a forecast.</p>
  </Lesson>
}

export function TSACF() {
  return <Lesson number="15.3" title="Auto correlation function" lead="An auto correlation function (ACF) compares a time series with lagged versions of itself.">
    <p>A <strong>lag</strong> is an earlier version of the same series, shifted by a number of time periods. Correlations across those lags help show which time periods repeat.</p>
    <SourceSequence label="Course ACF graph built from lag overlays to the completed correlation chart" items={[
      { src: acfLag1, alt: 'The observed daily series is compared with itself at lag zero; the ACF shows 100% correlation at lag 0.', caption: 'At lag 0, the series is compared with itself, so correlation is 100%.' },
      { src: acfLag2, alt: 'The daily series is overlaid with a shifted copy; the ACF includes correlations for the first lags.', caption: 'Shift the same series to compare additional lags.' },
      { src: acfLag3, alt: 'Additional shifted copies are compared above the growing ACF lag plot.', caption: 'Each lag adds a correlation to the same ACF scale.' },
      { src: acfFinal, alt: 'The completed ACF has peaks at lags 7, 14, 21 and 28, marked as a weekly cycle.', caption: 'Here, strong correlation every seventh lag indicates a weekly cycle in the daily series.' },
    ]} />
  </Lesson>
}

export function TSOneHot() {
  return <Lesson number="15.5" title="One-hot encoding" lead="One-hot encoding represents each time period as an indicator input in a regression model.">
    <p>The source example assigns quarterly revenue to Q1, Q2, Q3 and Q4 indicators. When a regression includes an intercept, omit one indicator as the reference category; the other coefficients are measured relative to it.</p>
    <SourceFigure src={oneHot} alt="The course table shows quarterly revenue and one-hot indicators Q1 to Q4." caption="The table shows what each quarter indicator means. In the fitted regression, keep three indicators and let the omitted quarter be the reference." />
  </Lesson>
}

export function TSLinearTrend() {
  return <Lesson number="15.7" title="Linear trending" lead="A trend is the overall direction of a time series, apart from its seasonal pattern.">
    <p>A linear trend can be represented by a <strong>time step</strong>: an index starting at 1 and increasing by one for each time period. If the model also needs to represent seasonality, combine that input with one-hot period indicators.</p>
    <SourceFigure src={seasonalTrendMatrix} alt="The source table lists monthly revenue, time steps 1 to 12, and January through November indicator columns; December has all zero indicators." caption="The December row is the reference month: the model includes January–November indicators with an intercept." />
  </Lesson>
}

export function TSSmoothing() {
  return <Lesson number="15.9" title="Smoothing" lead="Smoothing can make a volatile series easier to read by revealing its broader pattern.">
    <p>Moving averages and weighted smoothing combine nearby values to reduce short-term variation. The source example overlays a moving average on the observed series.</p>
    <SourceFigure src={smoothingChart} alt="A noisy cyan time series is shown with a smoother yellow moving-average line." caption="The yellow line makes the broader pattern easier to see beside the original observations." />
    <p className="tsf__note">A smoother line can also hide a real change or lag behind a turning point. Use it to inspect the series, not as proof that every variation is noise or that forecasts will improve.</p>
  </Lesson>
}

export function TSNonLinear() {
  return <Lesson number="15.11" title="Non-linear trends" lead="Time-series data may follow a non-linear trend instead of a seasonal pattern or straight trend.">
    <p>The course compares several curve shapes against the same weekly product-sales series: exponential, cubic, step functions, ADBUDG and Gompertz. These are possible shapes for a changing rate of growth; selecting one does not establish that future sales will follow it.</p>
    <SourceSequence label="Course sequence comparing non-linear curve families against the same observed product-sales series" items={[
      { src: nonlinearSource, alt: 'The raw 20-week product-sales series before a candidate trend is added, on a scale from 0 to 1,200 sales.', caption: 'Observed product sales by week before comparing candidate trend shapes.' },
      { src: nonlinear1, alt: 'Weekly product sales are compared with an exponential curve on a 0 to 1,200 sales scale.', caption: '1 · Exponential' },
      { src: nonlinear2, alt: 'The same weekly sales are compared with a cubic curve on the unchanged axis.', caption: '2 · Cubic' },
      { src: nonlinear3, alt: 'The same weekly sales are compared with a step-function curve on the unchanged axis.', caption: '3 · Step function' },
      { src: nonlinear4, alt: 'The same weekly sales are compared with ADBUDG and Gompertz curves; the source notes their use for logistic growth patterns.', caption: '4 · ADBUDG and Gompertz' },
    ]} />
    <p className="tsf__note">The source describes ADBUDG and Gompertz as flexible logistic curves used in cases such as product launches and diminishing returns.</p>
  </Lesson>
}

export function TSIntervention() {
  return <Lesson number="15.13" title="Intervention analysis" lead="Intervention analysis estimates the impact of a specific change on an outcome over time.">
    <p>It asks what might have happened if the change had not occurred. Fit a regression model using only the pre-intervention observations, extend its forecast into the later period, then compare the forecast baseline with actual values.</p>
    <SourceSequence label="Course intervention analysis from the intervention point through pre-period fitting and post-period comparison" items={[
      { src: intervention1, alt: 'A daily conversion-rate chart marks the date of a website intervention.', caption: 'Mark the intervention date in the observed series.' },
      { src: intervention2, alt: 'The chart highlights the pre-intervention period used to fit the regression model.', caption: 'Fit the model using only observations before the change.' },
      { src: intervention3, alt: 'The fitted regression line follows the pre-intervention conversion-rate observations; later observations are faded.', caption: 'Extend that same pre-intervention fit into a baseline.' },
      { src: intervention4, alt: 'The post-intervention chart compares actual conversion rates with the projected baseline and highlights daily differences.', caption: 'The source spans Jan 1–Mar 31. For each post-period day, residual = actual CVR − baseline CVR; sum these daily differences to estimate the change.' },
    ]} />
    <p className="tsf__note">The estimate depends on the pre-period model and on other conditions staying comparable. A difference after the change alone does not prove the intervention caused it.</p>
  </Lesson>
}

export function TSLookingAhead() {
  return <Lesson number="15.15" title="Looking ahead to Part 4" lead="Part 3 has introduced regression and time-series forecasting. Part 4 turns to unsupervised learning.">
    <SourceFigure src={partFour} alt="The four-part course map highlights Part 4, Unsupervised Learning, after Part 3, Regression and Forecasting." caption="Part 4 follows regression and forecasting." />
    <section className="tsf__text-block" aria-labelledby="tsf-part-four-topics">
      <h2 id="tsf-part-four-topics">Part 4 topics</h2>
      <ul><li>Intro to Unsupervised ML</li><li>Segmentation and Clustering</li><li>Association Mining</li><li>Outlier Detection</li><li>Dimensionality Reduction</li></ul>
    </section>
  </Lesson>
}
