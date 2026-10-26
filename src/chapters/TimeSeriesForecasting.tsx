import { useEffect, useState, type ReactNode } from 'react'
import './TimeSeriesForecasting.css'
import { PlaybackButton } from '../components/PlaybackButton'
import forecastingScene from '../assets/time-series-forecasting-math.png'
import acfDay0 from '../assets/time-series-acf-day-0.png'
import acfDay1 from '../assets/time-series-acf-day-1.png'
import acfDay2 from '../assets/time-series-acf-day-2.png'
import acfDay3 from '../assets/time-series-acf-day-3.png'
import acfDay4 from '../assets/time-series-acf-day-4.png'
import acfDay5 from '../assets/time-series-acf-day-5.png'
import acfDay6 from '../assets/time-series-acf-day-6.png'
import acfDay7 from '../assets/time-series-acf-day-7.png'
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

type LessonProps = { number: string; title: string; lead: ReactNode; children: ReactNode }
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
  return <Lesson number="15.1" title="Intro to forecasting" lead="Time-series forecasting is all about predicting future values of a single, numeric dependent variable.">
    <div className="tsf__intro-scene"><img src={forecastingScene} alt="" /><div>
    <section className="tsf__text-block tsf__forecasting-basics" aria-labelledby="tsf-forecasting-101">
      <h2 id="tsf-forecasting-101">Forecasting 101</h2>
      <ul>
        <li>Forecasting works just like any other regression model, except your data must contain <strong>multiple observations of your dependent variable over time</strong> (aka <strong>time-series data</strong>).</li>
        <li>Time-series forecast models look for patterns in the observed data — like <strong>seasonality</strong> or <strong>linear/non-linear trends</strong> — to predict future values.</li>
      </ul>
    </section>
    <section className="tsf__text-block" aria-labelledby="tsf-intro-examples">
      <h2 id="tsf-intro-examples">Common examples</h2>
      <ul><li>Forecasting revenue for the next fiscal year</li><li>Predicting website traffic growth over time</li><li>Estimating sales for a new product launch</li></ul>
    </section></div></div>
  </Lesson>
}

export function TSSeasonality() {
  return <Lesson number="15.2" title="Seasonality" lead={<>Seasonality is a <strong>repeatable</strong>, <strong>predictable</strong> pattern that an outcome may follow over time.</>}>
    <p>It often follows a calendar period, such as a month, day of the week or hour, but a repeating pattern does not have to follow the calendar.</p>
    <section className="tsf__text-block tsf__seasonality-acf" aria-labelledby="tsf-seasonality-acf">
      <h2 id="tsf-seasonality-acf">Identifying seasonality with autocorrelation</h2>
      <p>We can identify seasonal patterns using an <strong>Auto Correlation Function (ACF)</strong>, then apply that seasonality to forecasts using techniques like <strong>one-hot encoding</strong> or <strong>moving averages</strong>.</p>
    </section>
    <section className="tsf__text-block" aria-labelledby="tsf-seasonality-examples">
      <h2 id="tsf-seasonality-examples">Examples from the course</h2>
      <ul><li>Website traffic by hour of the day</li><li>Seasonal product sales</li><li>Airline ticket prices around major holidays</li></ul>
    </section>
    <SourceFigure src={seasonalityPlot} alt="The time-series plot has repeated peaks near January 6, 13 and 20, separated by similar low periods." caption="The peaks recur at regular intervals, showing a repeating pattern." />
  </Lesson>
}

const acfFrames = [acfDay0, acfDay1, acfDay2, acfDay3, acfDay4, acfDay5, acfDay6, acfDay7]
const lagExample = [20, 24, 22, 25, 30, 80, 70, 21]
const lagDays = ['Mon 1', 'Tue 2', 'Wed 3', 'Thu 4', 'Fri 5', 'Sat 6', 'Sun 7', 'Mon 8']

function LagExample() {
  const [lag, setLag] = useState(1)
  return <section className="tsf__lag-example" aria-labelledby="tsf-lag-definition">
    <h2 id="tsf-lag-definition">What is a lag?</h2>
    <p>A <strong>lag</strong> is how many time steps back you look. With daily data, lag 1 means <strong>one day earlier</strong>; lag 7 means <strong>seven days earlier</strong>. With monthly data, lag 1 means one month earlier.</p>
    <p className="tsf__lag-context">Small illustrative example · daily website visits</p>
    <div className="tsf__acf-lags" aria-label="Example lag">
      {[1, 7].map(day => <button key={day} type="button" aria-pressed={lag === day} onClick={() => setLag(day)}>Lag {day} · {day === 1 ? 'yesterday' : 'one week earlier'}</button>)}
    </div>
    <div className="tsf__lag-table" tabIndex={0} role="region" aria-label="Original visits paired with earlier visits">
      <table>
        <thead><tr><th scope="col">Date</th>{lagDays.map(day => <th scope="col" key={day}>{day}</th>)}</tr></thead>
        <tbody>
          <tr><th scope="row">Visits</th>{lagExample.map((value, i) => <td key={i} className={i === 7 ? 'is-current' : i === 7 - lag ? 'is-earlier' : undefined}>{value}</td>)}</tr>
          <tr><th scope="row">Visits {lag} {lag === 1 ? 'day' : 'days'} earlier</th>{lagExample.map((_, i) => <td key={i} className={i === 7 ? 'is-earlier' : undefined}>{i < lag ? <span aria-label="No earlier observation">—</span> : lagExample[i - lag]}</td>)}</tr>
        </tbody>
      </table>
    </div>
    <p className="tsf__lag-pair" aria-live="polite"><span>Earlier: <strong>{lagDays[7 - lag]} · {lagExample[7 - lag]} visits</strong></span><span aria-hidden="true">→</span><span>Compare with: <strong>Mon 8 · 21 visits</strong></span></p>
    <p>The bottom row reuses the same observations, shifted into the column where they are compared. The dashes mean there is no earlier observation in this example; they are not zeros. ACF calculates correlation across <strong>all available pairs</strong> for a lag, not just this highlighted pair.</p>
  </section>
}
const acfCaptions = [
  'At lag 0, compare the series with itself: perfect alignment and 100% correlation.',
  'Lag by 1 day. The peaks no longer line up; correlation falls to just below 40%.',
  'Lag by 2 days. Peaks line up with low values, giving a negative correlation.',
  'Lag by 3 days. The series still do not align; correlation remains negative.',
  'Lag by 4 days. Correlation is still negative.',
  'Lag by 5 days. The peaks still do not line up; correlation remains negative.',
  'Lag by 6 days. The peaks begin to line up again, and correlation becomes positive.',
  'Lag by 7 days. The peaks and troughs closely align again: correlation is above 90%. The pattern repeats weekly.',
]

export function TSACF() {
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [lag, setLag] = useState(() => reducedMotion ? 7 : 0)
  const [playing, setPlaying] = useState(() => !reducedMotion)
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => {
      setReducedMotion(preference.matches)
      if (preference.matches) { setPlaying(false); setLag(7) }
    }
    preference.addEventListener('change', update)
    return () => preference.removeEventListener('change', update)
  }, [])
  useEffect(() => {
    if (!playing) return
    if (lag === 7) { setPlaying(false); return }
    const timer = window.setTimeout(() => setLag(current => current + 1), 3000)
    return () => window.clearTimeout(timer)
  }, [lag, playing])
  const showLag = (next: number) => { setPlaying(false); setLag(next) }
  const play = () => {
    if (playing) { setPlaying(false); return }
    if (lag === 7) setLag(0)
    setPlaying(true)
  }
  return <Lesson number="15.3" title="Auto correlation function" lead="An auto correlation function (ACF) compares a time series with lagged versions of itself, then plots those correlations.">
    <p>Take the data, <strong>lag it behind by a number of days</strong>, and see how closely it lines up with the original. A <strong>7-day lag</strong> compares today’s value with the value seven days earlier. ACF records the correlation for each lag; strong correlations at regular intervals reveal a repeating pattern.</p>
    <LagExample />
    <section className="tsf__acf-animation" aria-labelledby="tsf-acf-animation">
      <h2 id="tsf-acf-animation">Shift the series, then compare</h2>
      <p>The upper plot compares the original series (black) with its shifted copy (dashed turquoise). The lower plot adds the correlation at each lag.</p>
      <div className="tsf__acf-controls" aria-label="ACF animation controls">
        <PlaybackButton action="previous" label="Previous lag" onClick={() => showLag(lag - 1)} disabled={lag === 0} />
        <PlaybackButton action={playing ? 'pause' : lag === 7 ? 'replay' : 'play'} label={playing ? 'Pause' : lag === 7 ? 'Replay' : reducedMotion ? 'Autoplay disabled: reduced motion' : 'Autoplay'} onClick={play} disabled={reducedMotion} />
        <PlaybackButton action="next" label="Next lag" onClick={() => showLag(lag + 1)} disabled={lag === 7} />
        <span aria-live="polite">Lag: <strong>{lag} {lag === 1 ? 'day' : 'days'}</strong></span>
      </div>
      <div className="tsf__acf-lags" aria-label="Choose a lag">
        {acfFrames.map((_, day) => <button type="button" key={day} aria-pressed={lag === day} onClick={() => showLag(day)}>{day} {day === 1 ? 'day' : 'days'}</button>)}
      </div>
      <figure className="tsf__source tsf__acf-frame">
        <img src={acfFrames[lag]} width="820" height="340" alt={`Course animation at lag ${lag}: original and shifted daily series above the ACF bars.`} />
        <figcaption aria-live="polite">{acfCaptions[lag]}</figcaption>
      </figure>
    </section>
    <SourceFigure src={acfFinal} alt="The completed ACF has peaks at lags 7, 14, 21 and 28, marked as a weekly cycle." caption="Continue comparing further lags: strong correlation every seventh lag indicates a weekly cycle in this daily series." />
  </Lesson>
}

export function TSOneHot() {
  const [reference, setReference] = useState(3)
  const revenues = [1300050, 11233310, 1112050, 1582077]
  const dollars = (value: number) => value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
  const included = [0, 1, 2, 3].filter(quarter => quarter !== reference)
  return <Lesson number="15.5" title="One-hot encoding" lead="One-hot encoding represents each time period as an indicator input in a regression model.">
    <section className="tsf__seasonality-acf tsf__text-block" aria-labelledby="tsf-omit-rule">
      <h2 id="tsf-omit-rule">With an intercept, always leave one category out</h2>
      <p>For <strong>4 quarters, use 3 indicator columns</strong>. For <strong>12 months, use 11</strong>. It <strong>doesn’t matter which category you exclude</strong>: it becomes the reference category. Keep all its observations; remove only its indicator column.</p>
    </section>
    <section className="tsf__text-block" aria-labelledby="tsf-why-omit">
      <h2 id="tsf-why-omit">Why? Different coefficients can give the same answer</h2>
      <p>The course uses <strong>A + B = 5</strong>: 0 + 5, 2 + 3 and 10 − 5 all work. There are infinitely many combinations, so that equation cannot tell us one unique value for A and B.</p>
      <p>The same problem occurs with an intercept and every category indicator. Exactly one quarter is active in each row, so <strong>Q1 + Q2 + Q3 + Q4 = 1</strong> — the same constant supplied by the intercept. Increasing the intercept and subtracting the same amount from every quarter coefficient leaves every prediction unchanged.</p>
      <div className="tsf__lag-table" role="region" tabIndex={0} aria-label="Illustrative equivalent coefficient combinations">
        <table><caption>Small illustrative example · winter sales = 20 units, summer sales = 30 units</caption>
          <thead><tr><th scope="col">Intercept</th><th scope="col">Winter coefficient</th><th scope="col">Summer coefficient</th><th scope="col">Winter prediction</th><th scope="col">Summer prediction</th></tr></thead>
          <tbody>{[0, 10, 20].map(intercept => <tr key={intercept}><td>{intercept}</td><td>{20 - intercept}</td><td>{30 - intercept}</td><td>{intercept} + {20 - intercept} = <strong>20</strong></td><td>{intercept} + {30 - intercept} = <strong>30</strong></td></tr>)}</tbody>
        </table>
      </div>
      <p>All three models make identical predictions, but their coefficients differ. This is called <strong>unidentifiable</strong>: the data cannot choose a unique set of coefficients. Leaving out winter’s indicator removes this ambiguity: the intercept is 20, and summer’s coefficient is 10 — <strong>10 more units than winter</strong>.</p>
    </section>
    <SourceFigure src={oneHot} alt="The course table shows quarterly revenue and one-hot indicators Q1 to Q4." caption="The table shows what each quarter indicator means. In the fitted regression, keep three indicators and let the omitted quarter be the reference." />
    <section className="tsf__lag-example" aria-labelledby="tsf-quarter-reference">
      <h2 id="tsf-quarter-reference">Try a different reference quarter</h2>
      <p>Use the course’s four revenue observations. The reference quarter has <strong>all three retained indicators set to 0</strong>, so its prediction is the intercept. Every other quarter adds its difference from that reference.</p>
      <div className="tsf__acf-lags" aria-label="Choose the omitted reference quarter">{revenues.map((_, quarter) => <button key={quarter} type="button" aria-pressed={reference === quarter} onClick={() => setReference(quarter)}>Omit Q{quarter + 1}</button>)}</div>
      <p aria-live="polite"><strong>Reference: Q{reference + 1} · Intercept = {dollars(revenues[reference])}</strong></p>
      <div className="tsf__lag-table" tabIndex={0} role="region" aria-label="Quarter indicators and predictions with the selected reference">
        <table><thead><tr><th scope="col">Quarter</th>{included.map(q => <th key={q} scope="col">Q{q + 1} flag</th>)}<th scope="col">Difference from Q{reference + 1}</th><th scope="col">Prediction = intercept + difference</th></tr></thead>
          <tbody>{revenues.map((revenue, quarter) => <tr key={quarter}><th scope="row">Q{quarter + 1}{quarter === reference ? ' · reference' : ''}</th>{included.map(q => <td key={q}>{q === quarter ? 1 : 0}</td>)}<td>{dollars(revenue - revenues[reference])}</td><td>{dollars(revenues[reference])} {revenue < revenues[reference] ? '−' : '+'} {dollars(Math.abs(revenue - revenues[reference]))} = <strong>{dollars(revenue)}</strong></td></tr>)}</tbody>
        </table>
      </div>
      <p>Changing the reference changes the intercept and coefficient meanings, <strong>not these predictions</strong>. Here there is one observation per quarter, so the model reproduces those four values exactly; that does not establish future forecast accuracy.</p>
    </section>
    <p className="tsf__note">This rule assumes a regression <strong>with an intercept</strong>. Without an intercept, all category indicators can be included. For multiple seasonal dimensions, such as hour of day and day of week, omit one category from each dimension when using an intercept.</p>
  </Lesson>
}

export function TSLinearTrend() {
  return <Lesson number="15.7" title="Linear trending" lead={<span className="tsf__definition"><strong>Trend</strong> is the overall direction of a time series, apart from its seasonal pattern.</span>}>
    <div className="tsf__text-block">
      <ul>
        <li>Trends are often <strong>linear (up or down)</strong>, but can be non-linear as well.</li>
        <li>To account for linear trending in a regression, include a <strong>time step as an independent variable</strong>: an index value that starts at 1 and increases by 1 with each time period.</li>
        <li>It is common for time-series models to include <strong>both trend and seasonality</strong>. Use one-hot month indicators for seasonality and the time-step variable for the linear trend.</li>
      </ul>
    </div>
    <SourceFigure src={seasonalTrendMatrix} alt="The source table lists monthly revenue, time steps 1 to 12, and January through November indicator columns; December has all zero indicators." caption="T-Step counts successive months. January–November indicators identify the season; December is the reference month." />
    <section className="tsf__lag-example" aria-labelledby="tsf-time-step">
      <h2 id="tsf-time-step">T-Step = time step: how far along are we?</h2>
      <p>In this monthly revenue example, <strong>one step is one month</strong>. T-Step is simply a numbered position in time, not revenue and not a lag.</p>
      <div className="tsf__lag-table"><table><thead><tr><th scope="col">Month</th><th scope="col">First January</th><th scope="col">February</th><th scope="col">…</th><th scope="col">December</th><th scope="col">Next January</th><th scope="col">Next February</th></tr></thead><tbody><tr><th scope="row">T-Step</th><td>1</td><td>2</td><td>…</td><td>12</td><td>13</td><td>14</td></tr></tbody></table></div>
      <p><strong>Keep counting across years.</strong> Both Januaries have the January indicator set to 1, but their time steps are 1 and 13. The month indicator captures the repeating January pattern; T-Step lets the overall revenue level change over time.</p>
      <p className="tsf__equation">Predicted revenue = intercept + month effect + <strong>time-step coefficient × T-Step</strong></p>
      <p>The time-step coefficient is the model’s <strong>change in revenue per month</strong>, after accounting for the month effects. For example, a coefficient of <strong>+$10,000</strong> adds $10,000 per step: +$10,000 at step 1 and +$130,000 at step 13. The two Januaries are therefore $120,000 apart in the model. This coefficient is an illustration, not a fitted result from the table.</p>
      <p>A positive coefficient describes an upward linear trend; a negative one describes a downward trend. If it is not statistically significant, the model does not provide sufficient evidence of a linear trend—it does not prove that no trend exists.</p>
      <p className="tsf__lag-context">The table above shows the column structure for one year. With an intercept and all eleven month indicators, more than one year is needed to estimate the time trend separately from the month effects.</p>
    </section>
  </Lesson>
}

function SmoothingExample() {
  const [method, setMethod] = useState<'average' | 'weighted' | 'exponential'>('average')
  const [week, setWeek] = useState(2)
  const values = [3, 5, 4, 2, 5, 4]
  const exponential = values.reduce<number[]>((result, value, i) => [...result, i === 0 ? value : 0.5 * value + 0.5 * result[i - 1]], [])
  const smoothed = values.map((value, i) => method === 'exponential' ? exponential[i] : i < 2 ? null : method === 'average' ? (values[i - 2] + values[i - 1] + value) / 3 : values[i - 2] * 0.2 + values[i - 1] * 0.3 + value * 0.5)
  const format = (value: number) => Number(value.toFixed(3)).toString()
  const names = { average: '3-week moving average', weighted: 'Weighted moving average', exponential: 'Exponential smoothing' }
  const points = (data: (number | null)[]) => data.flatMap((value, i) => value === null ? [] : [`${65 + i * 110},${240 - value * 38}`]).join(' ')
  const used = (i: number) => method === 'exponential' ? i <= week : i >= week - 2 && i <= week
  return <section className="tsf__smoothing-example" aria-labelledby="smoothing-example-title">
    <h2 id="smoothing-example-title">See the calculation, one week at a time</h2>
    <p>A small illustrative example: six weekly guest ratings, on a 1–5 scale. Choose a technique, then a week. <strong>Highlighted ratings feed the selected result.</strong></p>
    <div className="tsf__smoothing-controls" aria-label="Smoothing technique">{(Object.keys(names) as (keyof typeof names)[]).map(key => <button key={key} type="button" aria-pressed={method === key} onClick={() => setMethod(key)}>{names[key]}</button>)}</div>
    <div className="tsf__lag-table"><table><thead><tr><th scope="col">Week</th>{values.map((_, i) => <th scope="col" key={i}>{i + 1}</th>)}</tr></thead><tbody>
      <tr><th scope="row">Observed rating</th>{values.map((value, i) => <td key={i} className={used(i) ? 'tsf__smoothing-used' : ''}>{value}</td>)}</tr>
      <tr><th scope="row">Smoothed rating</th>{smoothed.map((value, i) => <td key={i}>{value === null ? '—' : i < 2 ? format(value) : <button type="button" aria-label={`Show week ${i + 1} calculation`} aria-pressed={week === i} onClick={() => setWeek(i)}>{format(value)}</button>}</td>)}</tr>
    </tbody></table></div>
    <svg className="tsf__smoothing-chart" viewBox="0 0 670 280" role="img" aria-label={`${names[method]} compared with the six observed weekly ratings. Selected week ${week + 1}, smoothed rating ${format(smoothed[week]!)}.`}>
      {[1, 2, 3, 4, 5].map(value => <g key={value}><line x1="50" x2="635" y1={240 - value * 38} y2={240 - value * 38} stroke="#dce5de" /><text x="32" y={245 - value * 38}>{value}</text></g>)}
      <polyline points={points(values)} fill="none" stroke="#889eaa" strokeWidth="2" strokeDasharray="6 4" />
      <polyline points={points(smoothed)} fill="none" stroke="#187d76" strokeWidth="4" />
      {values.map((value, i) => <g key={i}><circle cx={65 + i * 110} cy={240 - value * 38} r="5" fill={used(i) ? '#b87625' : '#889eaa'} /><text x={65 + i * 110} y="265" textAnchor="middle">Week {i + 1}</text></g>)}
      <circle cx={65 + week * 110} cy={240 - smoothed[week]! * 38} r="8" fill="#187d76" stroke="white" strokeWidth="2" />
    </svg>
    <p className="tsf__smoothing-legend"><span>– – Observed ratings</span><strong>━ Smoothed ratings</strong></p>
    <h3>{names[method]} · Week {week + 1}</h3>
    {method === 'average' ? <>
      <p>Take this week and the previous two weeks. <strong>Give all three the same weight.</strong></p>
      <p className="tsf__equation">({values[week - 2]} + {values[week - 1]} + {values[week]}) ÷ 3 = <strong>{format(smoothed[week]!)}</strong></p>
      <p>Move forward one week: drop the oldest rating and include the newest. The first two weeks have no result because three observations are needed.</p>
    </> : method === 'weighted' ? <>
      <p>Use the same three weeks, but <strong>give newer ratings more influence</strong>: oldest 20%, middle 30%, newest 50%.</p>
      <p className="tsf__equation">({values[week - 2]} × 0.2) + ({values[week - 1]} × 0.3) + ({values[week]} × 0.5) = <strong>{format(smoothed[week]!)}</strong></p>
      <p>The weights add to 1 (100%). These example weights are chosen for the demonstration; they are not fitted by a model.</p>
    </> : <>
      <p><strong>Blend the newest rating with the previous smoothed rating.</strong> Here, each gets 50% of the weight. Start week 1 at its observed rating, 3.</p>
      <p className="tsf__equation">({values[week]} × 0.5) + ({format(exponential[week - 1])} × 0.5) = <strong>{format(exponential[week])}</strong></p>
      <p>The previous smoothed rating already contains older weeks. Their influence fades with each update, rather than dropping out after three weeks. A larger newest-value weight reacts faster; a smaller one smooths more.</p>
    </>}
    <div className="tsf__smoothing-controls" aria-label="Calculation week">{[2, 3, 4, 5].map(i => <button key={i} type="button" aria-pressed={week === i} onClick={() => setWeek(i)}>Week {i + 1}</button>)}</div>
    <p className="tsf__note">These examples use only the current and earlier weeks: a trailing smoother. The point sits at the current week and summarizes recent ratings; it is not a prediction of an unseen future rating. A centered smoother would also use later weeks, so it cannot be used at the live edge of a forecast.</p>
  </section>
}

export function TSSmoothing() {
  return <Lesson number="15.9" title="Smoothing" lead="What if my data is so noisy that I can’t tell if a trend exists?">
    <p className="tsf__definition">If your data is highly volatile, <strong>smoothing techniques</strong> can be used to reveal underlying patterns or trends.</p>
    <div className="tsf__text-block"><ul>
      <li>Common techniques like <strong>moving averages</strong> or <strong>weighted smoothing</strong> reduce random variation and “noise” in the data to help expose seasonality or trends.</li>
      <li>If the volatility is truly just noise (and something we want our model to ignore), <strong>averaging or weighting the values around each time step</strong> can help us “smooth” the data and produce more accurate forecasts.</li>
    </ul></div>
    <SourceFigure src={smoothingChart} alt="A noisy cyan time series is shown with a smoother yellow moving-average line." caption="The yellow line makes the underlying pattern easier to see beside the original observations." />
    <p><strong>Profiling tip:</strong> Smoothing is a great way to expose patterns and trends that otherwise might be tough to see; make this part of your data profiling process.</p>
    <p className="tsf__note">Smoothing can also hide real changes. A clearer pattern does not guarantee a more accurate forecast.</p>
    <SmoothingExample />
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
  return <Lesson number="15.13" title="Intervention analysis" lead={<span className="tsf__definition"><strong>Intervention analysis</strong> is a technique used to estimate the impact of a specific change (or “intervention”) on the dependent variable.</span>}>
    <div className="tsf__text-block"><ul>
      <li>Simply put, intervention analysis is about predicting what <strong><em>would have happened</em></strong> if the change or intervention never took place.</li>
      <li>By fitting a model to the “pre-intervention” data (up to the date of the change), you can compare predicted vs. actual values after that date to estimate the impact of the intervention.</li>
    </ul></div>
    <section className="tsf__text-block" aria-labelledby="tsf-intervention-examples">
      <h2 id="tsf-intervention-examples">Common examples</h2>
      <ul>
        <li>Measuring the impact of a new website or check-out page on conversion rates.</li>
        <li>Quantifying the impact of a new HR program to reduce employee churn.</li>
      </ul>
    </section>
    <SourceSequence label="Course intervention analysis from the intervention point through pre-period fitting and post-period comparison" items={[
      { src: intervention1, alt: 'A daily conversion-rate chart marks the date of a website intervention.', caption: 'Mark the intervention date in the observed series.' },
      { src: intervention2, alt: 'The chart highlights the pre-intervention period used to fit the regression model.', caption: 'Step 1: Fit a regression model to the data, using only observations from the pre-intervention period.' },
      { src: intervention3, alt: 'The fitted regression line follows the pre-intervention conversion-rate observations; later observations are faded.', caption: 'The fitted regression model follows the pre-intervention data. Forecast it into the post-intervention period.' },
      { src: intervention4, alt: 'The post-intervention chart compares actual conversion rates with the projected baseline and highlights daily differences.', caption: 'Step 2: Compare the predicted and observed values in the post-intervention period, and sum the daily residuals to estimate the impact of the change. Daily residual = actual conversion rate − predicted conversion rate.' },
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
