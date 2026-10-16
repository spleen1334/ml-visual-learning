import { useState } from 'react'
import './QACensoring.css'
import './QAFoundations.css'

const AGES = [
  { age: 18, count: 78 }, { age: 20, count: 95 }, { age: 22, count: 119 },
  { age: 24, count: 139 }, { age: 26, count: 158 }, { age: 28, count: 174 },
  { age: 30, count: 185 }, { age: 32, count: 194 }, { age: 34, count: 199 },
  { age: 36, count: 204 }, { age: 38, count: 207 }, { age: 40, count: 210 },
  { age: 42, count: 207 }, { age: 44, count: 201 }, { age: 46, count: 191 },
  { age: 48, count: 178 }, { age: 50, count: 162 }, { age: 52, count: 145 },
  { age: 54, count: 128 }, { age: 56, count: 111 }, { age: 58, count: 96 },
  { age: 60, count: 82 }, { age: 62, count: 69 }, { age: 64, count: 57 },
  { age: 66, count: 46 }, { age: 68, count: 37 }, { age: 70, count: 29 },
  { age: 72, count: 22 }, { age: 74, count: 17 }, { age: 76, count: 12 },
  { age: 78, count: 9 }, { age: 80, count: 6 }, { age: 82, count: 4 },
  { age: 84, count: 3 }, { age: 86, count: 2 }, { age: 88, count: 1 },
]

const COHORTS = [
  { date: 'Jan 1', followup: 90, complete: 8 },
  { date: 'Jan 16', followup: 75, complete: 8 },
  { date: 'Jan 31', followup: 60, complete: 8 },
  { date: 'Feb 15', followup: 45, complete: 8 },
  { date: 'Mar 2', followup: 30, complete: 8 },
  { date: 'Mar 17', followup: 15, complete: 8 },
]

function ShopperHistogram({ showComparison }: { showComparison: boolean }) {
  const left = 52
  const top = 18
  const width = 428
  const height = 194
  const barWidth = width / 45
  const xAge = (age: number) => left + (age / 90) * width
  const yCount = (count: number) => top + height - (count / 220) * height
  const youthBars = [86, 110, 132, 150, 166, 178, 183, 181, 174]
  return <svg className="qac-histogram" viewBox="0 0 510 264" role="img" aria-label={showComparison
    ? 'Schematic age histogram. The survey records shoppers from age 18 upward. Hatched bars below 18 are an illustrative comparison only; no under-18 survey records exist.'
    : 'Schematic age histogram for surveyed mall shoppers aged 18 and older. The distribution peaks near age 40 and tapers toward older ages.'}>
    <defs><pattern id="qac-youth-hatch" width="7" height="7" patternTransform="rotate(45)" patternUnits="userSpaceOnUse"><rect width="7" height="7" fill="#f5e7c7" /><line x1="0" y1="0" x2="0" y2="7" stroke="#c79642" strokeWidth="2" /></pattern></defs>
    {[0, 50, 100, 150, 200].map(tick => <g key={tick}><line className="qac-grid" x1={left} x2={left + width} y1={yCount(tick)} y2={yCount(tick)} /><text className="qac-axis" x={left - 9} y={yCount(tick) + 3} textAnchor="end">{tick}</text></g>)}
    {showComparison && youthBars.map((count, index) => <rect key={index} x={xAge(index * 2)} y={yCount(count)} width={barWidth - 1} height={top + height - yCount(count)} fill="url(#qac-youth-hatch)" />)}
    {AGES.map(({ age, count }) => <rect key={age} x={xAge(age)} y={yCount(count)} width={barWidth - 1} height={top + height - yCount(count)} rx="1" className="qac-age-bar" />)}
    <line className="qac-cutoff" x1={xAge(18) - 3} x2={xAge(18) - 3} y1={top - 3} y2={top + height} />
    <text className="qac-cutoff-label" x={xAge(18) + 5} y="15">survey begins at 18</text>
    {[0, 18, 30, 50, 70, 90].map(age => <g key={age}><line className="qac-axis-tick" x1={xAge(age)} x2={xAge(age)} y1={top + height} y2={top + height + 4} /><text className="qac-axis" x={xAge(age)} y={top + height + 17} textAnchor="middle">{age}</text></g>)}
    <text className="qac-axis-title" x={left + width / 2} y="257" textAnchor="middle">Age (years)</text>
    <text className="qac-axis-title" x="12" y={top + height / 2} textAnchor="middle" transform={`rotate(-90 12 ${top + height / 2})`}>Shoppers counted</text>
    {showComparison && <text className="qac-youth-label" x={xAge(7)} y={top + height - 8} textAnchor="middle">illustrative only</text>}
  </svg>
}

function RepeatPurchaseChart({ waitForWindow }: { waitForWindow: boolean }) {
  const left = 45
  const top = 20
  const width = 478
  const height = 180
  const x = (index: number) => left + index * (width / 5)
  const y = (percent: number) => top + height - percent / 100 * height
  const returnDays = [3, 5, 7, 10, 14, 18, 22, 27, null, null]
  const values = COHORTS.map(cohort => returnDays.filter(day => day !== null && day <= Math.min(30, cohort.followup + (waitForWindow ? 15 : 0))).length / returnDays.length * 100)
  const path = values.map((value, index) => `${index === 0 ? 'M' : 'L'} ${x(index)} ${y(value)}`).join(' ')
  const bandStart = x(4) + (x(5) - x(4)) * .08
  return <svg className="qac-repeat-chart" viewBox="0 0 550 258" role="img" aria-label={waitForWindow
    ? 'Repeat purchase rate by customer cohort. Each cohort has a complete 30-day follow-up window and the rate is 80 percent.'
    : 'Repeat purchase rate by customer cohort. The first five cohorts have 30 days or more to return and show 80 percent. The latest cohort has only 15 days and currently shows 50 percent; the remaining customers have incomplete follow-up for a 30-day outcome.'}>
    <rect className="qac-recent-band" x={bandStart} y={top} width={left + width - bandStart} height={height} />
    {[0, 20, 40, 60, 80, 100].map(tick => <g key={tick}><line className="qac-grid" x1={left} x2={left + width} y1={y(tick)} y2={y(tick)} /><text className="qac-axis" x={left - 8} y={y(tick) + 3} textAnchor="end">{tick}%</text></g>)}
    <path d={path} className="qac-rate-line" />
    {values.map((value, index) => <g key={COHORTS[index].date}><circle className={index === 5 && !waitForWindow ? 'qac-rate-point qac-rate-point--recent' : 'qac-rate-point'} cx={x(index)} cy={y(value)} r="5" /><text className="qac-point-value" x={x(index)} y={y(value) - 10} textAnchor="middle">{value}%</text><text className="qac-axis" x={x(index)} y={top + height + 17} textAnchor="middle">{COHORTS[index].date}</text></g>)}
    <text className="qac-axis-title" x={left + width / 2} y="251" textAnchor="middle">Customer cohort · first purchase date</text>
    <text className="qac-axis-title" x={left} y="11">Repeat purchase rate (%)</text>
    <text className="qac-region-label" x={left + width - 4} y={top + 14} textAnchor="end">{waitForWindow ? '30-day window complete' : 'only 15 days observed'}</text>
  </svg>
}

export default function QACensoring() {
  const [showComparison, setShowComparison] = useState(false)
  const [waitForWindow, setWaitForWindow] = useState(false)
  const observedRecentRate = waitForWindow ? 80 : 50

  return <article className="qa-foundations qa-censoring" aria-labelledby="qac-title">
    <header className="qaf-intro"><p className="qaf-eyebrow">4.4 · Left- and right-censored data</p><h1 id="qac-title">Left- and right-censored data</h1><p><strong>A recording limit can hide the true value or event time.</strong> Check how observations enter the dataset and how long each one has had to be observed.</p></header>

    <section className="qaf-definition qac-definition" aria-labelledby="qac-definition-title"><div><p className="qaf-eyebrow">The key idea</p><h2 id="qac-definition-title">The observed edge may not be the natural edge.</h2><p><strong>Left censoring</strong> hides values below a measurement floor. <strong>Right censoring</strong> means follow-up ends before an event is seen. In both cases, the exact value or event time remains unknown.</p></div><aside className="qac-device" aria-label="A device reports readings below 5 as less than 5"><span>Measurement floor</span><strong>&lt; 5</strong><div className="qac-device-scale"><i /><b>5</b><i /><i /></div><small>Exact value is somewhere below 5</small></aside></section>

    <section className="qac-example-grid" aria-label="Examples of data cutoffs">
      <section className="qaf-card qac-example" aria-labelledby="qac-shopper-title"><div className="qaf-heading"><p className="qaf-eyebrow">Mall Shopper Survey Results</p><h2 id="qac-shopper-title">Who is missing below age 18?</h2><p>The survey begins at 18, so younger shoppers are absent from the sample.</p></div>
        <div className="qac-chart-frame"><ShopperHistogram showComparison={showComparison} /></div>
        <label className="qac-toggle"><input type="checkbox" checked={showComparison} onChange={event => setShowComparison(event.target.checked)} /><span aria-hidden="true" /><b>Show an illustrative under-18 comparison</b></label>
        {showComparison && <p className="qac-caption">Hatched bars are a teaching illustration only; the survey recorded no under-18 ages.</p>}
        <p className="qac-callout"><strong>What the data supports:</strong> an average age for surveyed shoppers age 18 and older. It does not establish the age distribution of all mall shoppers.</p>
        <p className="qac-distinction"><strong>Important distinction:</strong> excluding under-18 shoppers is sample selection (often called left truncation), not true left censoring. No under-18 record with an unknown age is present.</p>
      </section>

      <section className="qaf-card qac-example" aria-labelledby="qac-repeat-title"><div className="qaf-heading"><p className="qaf-eyebrow">Ecommerce Repeat Purchase Rate</p><h2 id="qac-repeat-title">Why does the newest cohort dip?</h2><p>Some customers have had less time to make a second purchase.</p></div>
        <div className="qac-chart-frame"><RepeatPurchaseChart waitForWindow={waitForWindow} /></div>
        <div className="qac-rate-summary" aria-live="polite"><div><span>Older, fully observed cohorts</span><strong>80%</strong><small>8 of 10 returned within 30 days</small></div><div className={waitForWindow ? 'qac-rate-summary-recent qac-rate-summary-recent--complete' : 'qac-rate-summary-recent'}><span>Newest cohort · {waitForWindow ? '30 days observed' : '15 days observed'}</span><strong>{observedRecentRate}%</strong><small>{waitForWindow ? '8 of 10 returned within 30 days' : '5 of 10 returned so far; 5 may still return'}</small></div></div>
        <label className="qac-toggle"><input type="checkbox" checked={waitForWindow} onChange={event => setWaitForWindow(event.target.checked)} /><span aria-hidden="true" /><b>Wait 15 more days for a full 30-day window</b></label>
        <p className="qac-callout"><strong>Do not read the recent drop as worse customer behavior.</strong> {waitForWindow ? 'After waiting, all cohorts have a complete 30-day window. The newest cohort also reaches 80%: the earlier dip reflected incomplete observation.' : 'Some return times in the latest cohort are right-censored: the observation window closed before those customers returned. Their 30-day outcomes are not yet fully known.'}</p>
      </section>
    </section>

    <section className="qaf-summary qac-summary"><p className="qaf-eyebrow">Remember</p><h2>Ask where the edge came from.</h2><p>A cutoff may reflect <strong>who was included</strong>, a device’s measurement limit, or <strong>how long people were observed</strong>. Match the conclusion to that process before comparing groups or training a model.</p></section>
  </article>
}
