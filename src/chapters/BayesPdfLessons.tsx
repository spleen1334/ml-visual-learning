import { Fragment, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import {
  pdfBayesConditional, pdfBayesCount, pdfBayesCountSteps, pdfBayesCustomers,
  pdfBayesFeatures, pdfBayesLookups, pdfBayesQuery, pdfBayesScore,
} from './bayesPdf'
import type { BayesFlag, PdfFeature } from './bayesPdf'
import './BayesPdfLessons.css'

function useSourceAnimation(lastStep: number, delay: (step: number) => number) {
  const [step, setStep] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches ? lastStep : 0)
  const [paused, setPaused] = useState(false)
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const reduce = () => { if (preference.matches) setStep(lastStep) }
    preference.addEventListener('change', reduce)
    return () => preference.removeEventListener('change', reduce)
  }, [lastStep])
  useEffect(() => {
    if (paused || step >= lastStep) return
    const timer = window.setTimeout(() => setStep(current => Math.min(current + 1, lastStep)), delay(step))
    return () => window.clearTimeout(timer)
  }, [step, paused, lastStep, delay])
  return {
    step, lastStep, paused, complete: step === lastStep,
    previous: () => { setPaused(true); setStep(current => Math.max(0, current - 1)) },
    next: () => { setPaused(true); setStep(current => Math.min(lastStep, current + 1)) },
    play: () => { if (step === lastStep) setStep(0); setPaused(false) },
    pause: () => setPaused(true),
    replay: () => { setStep(0); setPaused(false) },
  }
}
const countDelay = (step: number) => step === 0 ? 3000 : 1700
const probabilityDelay = (step: number) => step < 13 ? 800 : 1600

function LessonHeader({ number, title, children }: { number: number; title: string; children?: ReactNode }) {
  return <header className="bpdf__header"><p>9.{number} · Naive Bayes</p><h1>{title}</h1>{children}</header>
}

function Playback({ animation }: { animation: ReturnType<typeof useSourceAnimation> }) {
  return <div className="bpdf__playback" aria-label="Animation controls">
    <button type="button" onClick={animation.previous} disabled={animation.step === 0} aria-label="Previous animation step">Previous</button>
    <span className="bpdf__step" aria-live="polite">Step {animation.step + 1} / {animation.lastStep + 1}</span>
    <button type="button" onClick={animation.next} disabled={animation.complete} aria-label="Next animation step">Next</button>
    <button type="button" onClick={animation.paused || animation.complete ? animation.play : animation.pause}>{animation.paused || animation.complete ? 'Autoplay' : 'Pause'}</button>
    <button type="button" onClick={animation.replay}>Replay</button>
  </div>
}

export function CLIntroNaiveBayes() {
  return <article className="bpdf">
    <LessonHeader number={5} title="Naive Bayes">
      <p className="bpdf__definition">Naive Bayes uses past examples to predict which group a new case most likely belongs to.</p>
    </LessonHeader>
    <div className="bpdf__intro-diagram" aria-label="Customer features lead to class probabilities and a purchase prediction">
      <div className="bpdf__intro-input"><span>Customer features</span><div><b>Newsletter</b><b>Facebook</b><b>Website</b></div></div>
      <span className="bpdf__intro-arrow" aria-hidden="true">→</span>
      <div className="bpdf__intro-probabilities"><span>Compare probabilities</span><b>Purchase</b><b>No Purchase</b></div>
      <span className="bpdf__intro-arrow" aria-hidden="true">→</span>
      <strong className="bpdf__prediction">Predicted class</strong>
    </div>
    <p className="bpdf__naive">“Naive” means treating the features as independent, given the class.</p>
  </article>
}

function CustomerTable({ active, explain = false }: {
  active?: typeof pdfBayesCountSteps[number]
  explain?: boolean
}) {
  return <div className="bpdf__customer-wrap">
    <div className="bpdf__table-labels"><span>Each record is a <strong>customer</strong></span><span>Input features →</span><span>Target ↓</span></div>
    <table className={`bpdf__customers ${explain ? 'bpdf__customers--outlined' : ''}`} aria-label="Ten observed customers from the course">
      <thead><tr><th scope="col">Cust. ID</th><th scope="col">Subscribed to<br />Newsletter</th><th scope="col">Followed FB<br />Page</th><th scope="col">Visited<br />Website</th><th scope="col">Purchase?</th></tr></thead>
      <tbody>{pdfBayesCustomers.map(row => {
        const matched = active && row[active.feature] === active.value && row.purchase === active.purchase
        return <tr key={row.id}><th scope="row">{row.id}</th>{pdfBayesFeatures.map(feature => <td key={feature.key} className={matched && active?.feature === feature.key ? 'is-match' : ''}>{row[feature.key]}</td>)}<td className={matched ? 'is-match' : ''}>{row.purchase}</td></tr>
      })}</tbody>
      <tfoot><tr><th scope="row">11</th><td>0</td><td>1</td><td>1</td><td><strong>???</strong></td></tr></tfoot>
    </table>
    <p className="bpdf__table-foot">1 = Yes &nbsp;·&nbsp; 0 = No <span>Customer 11: the unobserved purchase to predict</span></p>
  </div>
}

function FrequencyTables({ revealed = 12, active, probabilities = false, showPriors = true }: {
  revealed?: number
  active?: typeof pdfBayesCountSteps[number]
  probabilities?: boolean
  showPriors?: boolean
}) {
  return <div className="bpdf__frequencies" aria-label="Frequency tables grouped by purchase class">
    <h3>PURCHASE</h3>
    {pdfBayesFeatures.map(feature => <table className="bpdf__frequency" key={feature.key} aria-label={`${feature.short} frequency table`}>
      <thead><tr><th aria-label="Feature" /><th aria-label="Feature value" /><th scope="col">1</th><th scope="col">0</th></tr></thead>
      <tbody>{([1, 0] as const).map((value, rowIndex) => <tr key={value}>
        {rowIndex === 0 && <th scope="rowgroup" rowSpan={2} className="bpdf__feature-name">{feature.short}</th>}
        <th scope="row">{value}</th>{([1, 0] as const).map(purchase => {
          const index = pdfBayesCountSteps.findIndex(item => item.feature === feature.key && item.value === value && item.purchase === purchase)
          const selected = active?.feature === feature.key && active.value === value && active.purchase === purchase
          return <td key={purchase} className={selected ? 'is-active' : ''}><span className={index < revealed ? '' : 'bpdf__concealed'}>{pdfBayesCount(feature.key, value, purchase)}</span>{probabilities && selected && <small>÷ 5</small>}</td>
        })}</tr>)}</tbody>
    </table>)}
    <div className={`bpdf__priors ${showPriors ? '' : 'bpdf__concealed'}`}><span>Overall:</span><b>50%</b><b>50%</b></div>
  </div>
}

export function CLNaiveBayesFrequencyTables() {
  const animation = useSourceAnimation(14, countDelay)
  const { step } = animation
  const active = step >= 2 && step <= 13 ? pdfBayesCountSteps[step - 2] : undefined
  return <article className="bpdf">
    <LessonHeader number={6} title="Frequency tables"><p>A frequency table counts how often values occur together. Here, we count each Yes/No answer separately for customers who purchased and those who did not.</p></LessonHeader>
    <section className="bpdf__sheet" data-step={step} aria-label="Automatic frequency-table demonstration">
      <Playback animation={animation} />
      <div className="bpdf__count-layout">
        <CustomerTable active={active} explain={step === 0} />
        <div className={step === 0 ? 'bpdf__concealed' : ''}><FrequencyTables revealed={Math.max(0, step - 1)} active={active} showPriors={step === 14} /></div>
      </div>
      <p className="bpdf__count-caption" aria-live="polite">{active
        ? `${pdfBayesFeatures.find(feature => feature.key === active.feature)!.short} = ${active.value} and Purchase = ${active.purchase} → ${pdfBayesCount(active.feature, active.value, active.purchase)} ${pdfBayesCount(active.feature, active.value, active.purchase) === 1 ? 'customer' : 'customers'}`
        : step === 14 ? '5 purchases + 5 no purchases = 10 customers' : 'Ten observed customers → three frequency tables'}</p>
    </section>
  </article>
}

function ProbabilityList({ step }: { step: number }) {
  const activeFactor = step >= 15 && step <= 18 ? step - 15 : step >= 21 && step <= 24 ? step - 21 : -1
  const activePurchase = step >= 21 ? 0 : 1
  return <div className="bpdf__lookups" aria-label="Conditional probabilities and class priors">
    {pdfBayesLookups.map((lookup, index) => {
      const featureIndex = pdfBayesFeatures.findIndex(feature => feature.key === lookup.feature)
      const matched = step >= 14 && lookup.value === pdfBayesQuery[lookup.feature]
      const selected = matched && lookup.purchase === activePurchase && (activeFactor === featureIndex || (step === 19 && lookup.purchase === 1) || (step === 25 && lookup.purchase === 0))
      return <div key={lookup.label} className={`bpdf__lookup ${index < step ? '' : 'bpdf__concealed'} ${selected || step === index + 1 ? 'is-active' : ''} ${matched && step === 26 ? 'is-used' : ''}`}>
        <span>{lookup.label}</span><i aria-hidden="true" /><b>{Math.round(lookup.probability * 100)}%</b>
      </div>
    })}
    {([1, 0] as const).map(purchase => <div key={purchase} className={`bpdf__lookup bpdf__prior-lookup ${step >= 13 ? '' : 'bpdf__concealed'} ${activeFactor === 3 && activePurchase === purchase ? 'is-active' : ''}`}><span>P ({purchase ? 'Purchase' : 'No Purchase'})</span><i aria-hidden="true" /><b>50%</b></div>)}
  </div>
}

function ProductColumn({ purchase, step }: { purchase: BayesFlag; step: number }) {
  const start = purchase ? 14 : 20
  const factors = pdfBayesFeatures.map(feature => ({
    label: pdfBayesLookups.find(item => item.feature === feature.key && item.value === pdfBayesQuery[feature.key] && item.purchase === purchase)!.label,
    percentage: Math.round(pdfBayesConditional(feature.key, pdfBayesQuery[feature.key], purchase) * 100),
  }))
  factors.push({ label: `P (${purchase ? 'Purchase' : 'No Purchase'})`, percentage: 50 })
  return <div className="bpdf__product-column">
    <h3>Prob. given Purchase = <strong>{purchase}</strong></h3><div className="bpdf__equals">=</div>
    <div className={`bpdf__product ${step >= start ? '' : 'bpdf__concealed'}`}>{factors.map((factor, index) => <Fragment key={factor.label}>
      {index > 0 && <span className="bpdf__times">×</span>}
      <div className={step === start + index + 1 ? 'is-active' : ''}>{step >= start + index + 1 ? <strong>{factor.percentage}%</strong> : <span>{factor.label}</span>}</div>
    </Fragment>)}</div>
    <div className="bpdf__equals">=</div><div className="bpdf__raw"><strong className={step >= start + 5 ? '' : 'bpdf__concealed'}>{(pdfBayesScore(purchase) * 100).toFixed(1)}%</strong></div>
  </div>
}

export function CLNaiveBayesConditionalProbability() {
  const animation = useSourceAnimation(26, probabilityDelay)
  const { step } = animation
  const lookup = step > 0 && step <= 12 ? pdfBayesLookups[step - 1] : undefined
  const active = lookup ? { feature: lookup.feature as PdfFeature, value: lookup.value, purchase: lookup.purchase } : undefined
  const prediction = 100 * pdfBayesScore(1) / (pdfBayesScore(1) + pdfBayesScore(0))
  return <article className="bpdf">
    <LessonHeader number={7} title="Conditional probability"><p>Frequency tables give us the <strong>conditional probability</strong> of each outcome.</p></LessonHeader>
    <section className="bpdf__sheet" data-step={step} aria-label="Automatic Naive Bayes probability calculation">
      <Playback animation={animation} />
      <div className="bpdf__probability-layout">
        <FrequencyTables active={active} probabilities />
        <ProbabilityList step={step} />
        <div className={`bpdf__calculation ${step >= 13 ? '' : 'bpdf__concealed'}`}>
          <div className="bpdf__query"><h3>Unobserved value:</h3><div>{pdfBayesFeatures.map(feature => <div key={feature.key}><span>{feature.short}</span><b>{pdfBayesQuery[feature.key]}</b></div>)}</div></div>
          <svg className="bpdf__branch" viewBox="0 0 440 38" aria-hidden="true"><defs><marker id="bpdf-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 10 5 0 10Z" fill="#888" /></marker></defs><path d="M220 0 Q220 22 108 30 M220 0 Q220 22 332 30" fill="none" stroke="#888" strokeWidth="1.5" markerEnd="url(#bpdf-arrow)" /></svg>
          <div className="bpdf__products"><ProductColumn purchase={1} step={step} /><ProductColumn purchase={0} step={step} /></div>
        </div>
      </div>
      <div className={`bpdf__final ${step === 26 ? '' : 'bpdf__concealed'}`} aria-live="polite"><em>Overall Purchase Probability:</em><span className="bpdf__fraction"><b>9.6%</b><b>(9.6% + 0.8%)</b></span><span>=</span><strong>{prediction.toFixed(1)}%</strong><span aria-hidden="true">→</span><b className="bpdf__prediction">PURCHASE</b></div>
      <p className="bpdf__denominator"><strong>Why divide by 5?</strong> “Given Purchase” means looking only at the 5 purchasers; “given No Purchase” means looking only at the 5 non-purchasers. For example, 3 purchasers subscribed: 3 ÷ 5 = 60%. The 50% shown below the tables is separate: each group contains 5 of all 10 customers.</p>
    </section>
  </article>
}
