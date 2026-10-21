import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import './ClassificationLogistic.css'
import { LogisticSurface } from './LogisticSurface'

import page136 from '../assets/logistic-page-136.png'
import page137 from '../assets/logistic-page-137.png'
import page138 from '../assets/logistic-page-138.png'
import page139 from '../assets/logistic-page-139.png'
import page140 from '../assets/logistic-page-140.png'
import page141 from '../assets/logistic-page-141.png'
import page142 from '../assets/logistic-page-142.png'
import page143 from '../assets/logistic-page-143.png'
import page144 from '../assets/logistic-page-144.png'
import page145 from '../assets/logistic-page-145.png'
import page146 from '../assets/logistic-page-146.png'
import page147 from '../assets/logistic-page-147.png'
import page148 from '../assets/logistic-page-148.png'
import page149 from '../assets/logistic-page-149.png'
import page150 from '../assets/logistic-page-150.png'
import page151 from '../assets/logistic-page-151.png'
import page152 from '../assets/logistic-page-152.png'
import page153 from '../assets/logistic-page-153.png'
import page154 from '../assets/logistic-page-154.png'
import page155 from '../assets/logistic-page-155.png'
import page156 from '../assets/logistic-page-156.png'
import page158 from '../assets/logistic-page-158.png'

type SourceSlide = { page: number; src: string; alt: string; caption: string }

function Lesson({ number, title, lead, children }: { number: number; title: string; lead: string; children: ReactNode }) {
  return <article className="logistic-lesson" aria-labelledby={`logistic-${number}`}>
    <header className="logistic-lesson__header">
      <p className="logistic-lesson__number">Chapter 9 · Lesson {number}</p>
      <h1 id={`logistic-${number}`}>{title}</h1>
      <p className="logistic-lesson__lead">{lead}</p>
    </header>
    {children}
  </article>
}

function SourceGallery({ slides, label }: { slides: SourceSlide[]; label: string }) {
  return <div className="logistic-gallery" aria-label={label}>
    {slides.map(slide => <figure className="logistic-source" key={slide.page}>
      <img src={slide.src} alt={slide.alt} />
      <figcaption>{slide.caption}</figcaption>
    </figure>)}
  </div>
}

function SourceSequence({ slides, label, autoplay = false }: { slides: SourceSlide[]; label: string; autoplay?: boolean }) {
  const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const [position, setPosition] = useState(() => autoplay && prefersReducedMotion() ? slides.length - 1 : 0)
  const [playing, setPlaying] = useState(() => autoplay && !prefersReducedMotion())
  const atEnd = position === slides.length - 1
  const slide = slides[position]

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => {
      if (preference.matches && autoplay) {
        setPosition(slides.length - 1)
        setPlaying(false)
      }
    }
    preference.addEventListener('change', update)
    return () => preference.removeEventListener('change', update)
  }, [autoplay, slides.length])

  useEffect(() => {
    if (!playing || atEnd) return
    const timer = window.setTimeout(() => setPosition(current => Math.min(slides.length - 1, current + 1)), 6000)
    return () => window.clearTimeout(timer)
  }, [playing, position, atEnd, slides.length])

  const move = (delta: number) => {
    setPlaying(false)
    setPosition(current => Math.max(0, Math.min(slides.length - 1, current + delta)))
  }

  const replay = () => {
    if (atEnd) setPosition(0)
    setPlaying(true)
  }

  return <div className="logistic-sequence" aria-label={label}>
    <figure className="logistic-source logistic-source--sequence" aria-live="polite">
      <img src={slide.src} alt={slide.alt} />
      <figcaption><span>Step {position + 1} of {slides.length}</span>{slide.caption}</figcaption>
    </figure>
    <div className="logistic-sequence__controls" aria-label={`${label} controls`}>
      <button type="button" onClick={() => move(-1)} disabled={position === 0}>Previous</button>
      <span aria-live="polite">Step {position + 1} of {slides.length}</span>
      <button type="button" onClick={() => move(1)} disabled={atEnd}>Next</button>
      {slides.length > 1 && <button type="button" onClick={() => playing ? setPlaying(false) : replay()}>{playing && !atEnd ? 'Pause' : atEnd ? 'Replay' : 'Autoplay'}</button>}
    </div>
  </div>
}

const introSlides: SourceSlide[] = [
  { page: 136, src: page136, alt: 'Observed binary outcomes plotted against X1, with labels at zero and one.', caption: 'Each dot is an observed X and binary Y pair.' },
  { page: 137, src: page137, alt: 'An S-shaped curve between zero and one fitted between observed binary labels.', caption: 'The curve estimates the probability of a true outcome for each X1 value.' },
]

const curveSlides: SourceSlide[] = [
  { page: 138, src: page138, alt: 'Spam probability curve using number of email recipients as X1.', caption: 'Here, X1 is the number of email recipients; Y is whether the email is spam.' },
  { page: 139, src: page139, alt: 'Three unobserved recipient counts placed on the spam probability curve at one, fifty, and ninety-five percent.', caption: 'Use the fitted curve to estimate probabilities for recipient counts not shown as observations.' },
]

const thresholdSlides: SourceSlide[] = [
  { page: 140, src: page140, alt: 'Source spam example raises the decision threshold to ninety percent because false positives are considered costly.', caption: 'The course’s spam scenario treats false positives as costly and shows a 90% decision point.' },
  { page: 141, src: page141, alt: 'Source employee attrition example lowers the decision threshold to ten percent because false positives are considered less costly.', caption: 'In the separate employee example, the source treats false positives as less costly and shows a 10% decision point.' },
]

const equationSlides: SourceSlide[] = [
  { page: 142, src: page142, alt: 'Sigmoid equation with three probability curves showing slope coefficients beta one of 0.5, 1.0, and 5.0.', caption: 'The slope coefficient β₁ changes how quickly the curve rises.' },
  { page: 143, src: page143, alt: 'The logistic curve with slope coefficient beta one set to 0.5.', caption: 'Compare the source’s slope settings.' },
  { page: 144, src: page144, alt: 'The logistic curve with slope coefficient beta one set to 1.0.', caption: 'A larger positive slope makes the transition steeper.' },
  { page: 145, src: page145, alt: 'The logistic curve with slope coefficient beta one set to 5.0.', caption: 'The largest shown slope makes the transition sharpest.' },
  { page: 146, src: page146, alt: 'The logistic equation with the intercept beta zero set to zero.', caption: 'The intercept β₀ shifts where the curve reaches 50% probability.' },
  { page: 147, src: page147, alt: 'The logistic curve after changing intercept beta zero to two.', caption: 'A positive intercept shifts the curve toward smaller X values.' },
  { page: 148, src: page148, alt: 'The logistic curve after changing intercept beta zero to negative two.', caption: 'A negative intercept shifts the curve toward larger X values.' },
]

const likelihoodSlides: SourceSlide[] = [
  { page: 149, src: page149, alt: 'Likelihood table: model outputs near the observed binary outcome receive high likelihood; mismatches receive low likelihood.', caption: 'For one row, likelihood is high when the predicted probability is close to the observed outcome.' },
  { page: 150, src: page150, alt: 'Bernoulli likelihood function: output to the power y times one minus output to the power one minus y.', caption: 'For output p and observed label y: pʸ × (1 − p)⁽¹⁻ʸ⁾.' },
  { page: 151, src: page151, alt: 'Worked likelihood calculation for observed y equals one and output probability 0.99, yielding 0.99.', caption: 'Observed 1, predicted p = 0.99 → contribution 0.99.' },
  { page: 152, src: page152, alt: 'Worked likelihood calculation for observed y equals zero and output probability 0.01, yielding 0.99.', caption: 'Observed 0, predicted p = 0.01 → contribution 1 − p = 0.99.' },
  { page: 153, src: page153, alt: 'Worked likelihood calculation for observed y equals one and output probability 0.01, yielding 0.01.', caption: 'Observed 1, predicted p = 0.01 → contribution 0.01.' },
  { page: 154, src: page154, alt: 'Worked likelihood calculation for observed y equals zero and output probability 0.99, yielding 0.01.', caption: 'Observed 0, predicted p = 0.99 → contribution 1 − p = 0.01.' },
  { page: 155, src: page155, alt: 'Spam probability curve annotated with high and low likelihood observations.', caption: 'The plot helps visualize fit; the likelihood calculation uses the observed-outcome probability for each row.' },
]

const multivariateSlides: SourceSlide[] = [
  { page: 156, src: page156, alt: 'The number of recipients is shown as one input that can help predict spam, alongside other possible features.', caption: 'The course names recipient count, typos, word counts, and sender reputation as possible inputs.' },
  { page: 158, src: page158, alt: 'General logistic equation whose weighted score includes multiple input variables X1 through Xn.', caption: 'The same sigmoid maps a weighted sum of several inputs to a probability. The source notes that plots become harder to interpret beyond two inputs.' },
]

export function LogisticIntro() {
  return <Lesson number={15} title="Intro to logistic regression" lead="Logistic regression is a classification technique that estimates the probability of a binary outcome.">
    <section className="logistic-intro-text" aria-label="Logistic regression introduction">
      <ul>
        <li>In its simplest form, logistic regression forms an <strong>S-shaped curve between 0 and 1</strong>, representing the probability of a true outcome for a given value of X.</li>
        <li>The <strong>likelihood function</strong> measures how much probability the model assigns to observed outcomes and is used to optimize the shape of the curve.</li>
        <li>Although its name includes “regression,” logistic regression is used for <strong>classification</strong>, rather than predicting a numerical target.</li>
      </ul>
      <h2>Example use cases</h2>
      <ul>
        <li>Flagging spam emails or fraudulent credit card transactions.</li>
        <li>Determining whether to serve a particular ad to a website visitor.</li>
      </ul>
    </section>
    <SourceGallery slides={introSlides} label="Logistic regression introduction from the course" />
  </Lesson>
}

export function LogisticExample() {
  return <Lesson number={16} title="Logistic regression example" lead="The source uses the number of email recipients to estimate the probability that an email is spam.">
    <SourceGallery slides={curveSlides} label="Spam probability example from the course" />
  </Lesson>
}

export function LogisticErrors() {
  return <Lesson number={17} title="Choose a decision threshold" lead="A probability threshold turns a model’s estimate into a class decision. The right choice depends on the costs of false positives and false negatives.">
    <SourceGallery slides={thresholdSlides} label="Two source examples of decision thresholds" />
    <section className="logistic-tradeoff" aria-labelledby="threshold-tradeoff">
      <h2 id="threshold-tradeoff">Choose the trade-off that fits the goal</h2>
      <div className="logistic-tradeoff__examples">
        <p><strong>Spam · higher threshold (90%)</strong>Protect regular emails from being flagged as spam (<b>false positives</b>). We accept more spam slipping through (<b>false negatives</b>); some regular emails may still be flagged.</p>
        <p><strong>Employee leaving · lower threshold (10%)</strong>Flag more employees as at risk so we can offer support early. Missing someone who leaves (<b>false negative</b>) is costlier here because of lost training investment and replacement costs. We accept more alerts for employees who would stay (<b>false positives</b>).</p>
      </div>
      <p className="logistic-tradeoff__takeaway"><strong>Higher threshold → fewer false positives, more false negatives. Lower threshold → the reverse.</strong> The error definitions stay the same; which error matters more depends on the goal. These thresholds are scenario choices, not error rates or guarantees of error-free predictions.</p>
    </section>
  </Lesson>
}

export function LogisticEquation() {
  return <Lesson number={18} title="Logistic regression equation" lead="The sigmoid turns a weighted input score into a probability between 0 and 1. Follow how the source changes the slope and intercept.">
    <SourceSequence slides={equationSlides} label="Slope and intercept sequence" autoplay />
    <p className="logistic-lesson__note"><strong>The goal is to find the curve that best fits the observed data.</strong> We adjust β₀ (intercept) and β₁ (slope), choosing the values that maximize the <strong>likelihood function</strong>—a measure of how well the model’s probabilities match the observed outcomes.</p>
  </Lesson>
}

export function LogisticLikelihood() {
  return <Lesson number={19} title="The likelihood function" lead="Likelihood scores the probabilities a model assigns to the outcomes that were observed. The source walks through all four binary-label cases.">
    <SourceSequence slides={likelihoodSlides} label="Observed-outcome likelihood calculations" autoplay />
    <p className="logistic-lesson__note"><strong>For the full dataset, multiply each row’s observed-outcome probability.</strong> Maximizing that product (or its log) is the likelihood objective. It is not a sum of probabilities or a minimization of vertical distances; the annotated plot is an intuition for fit.</p>
  </Lesson>
}

export function LogisticMultivariate() {
  return <Lesson number={20} title="Multivariate logistic regression" lead="Several input variables can contribute to the weighted score used to estimate one binary outcome’s probability.">
    <SourceGallery slides={multivariateSlides.slice(0, 1)} label="Multiple inputs" />
    <LogisticSurface />
    <SourceGallery slides={multivariateSlides.slice(1)} label="Multiple-input logistic equation" />
  </Lesson>
}

export { LogisticCase } from './LogisticWorkbookCase'
