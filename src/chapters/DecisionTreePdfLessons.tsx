import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { PlaybackButton } from '../components/PlaybackButton'
import { binaryEntropy } from './ClassificationTreesMath'
import gender from '../assets/tree-page-123.png'
import entropy from '../assets/tree-page-125.png'
import gain from '../assets/tree-page-126.png'
import branches from '../assets/tree-page-127.png'
import customerA from '../assets/tree-page-128.png'
import customerB from '../assets/tree-page-129.png'
import customerC from '../assets/tree-page-130.png'
import forest from '../assets/tree-page-132.png'
import './DecisionTreePdfLessons.css'

function Page({ number, title, lead, children }: { number: number; title: string; lead: ReactNode; children: ReactNode }) {
  return <article className="tree-pdf"><header><p className="tree-pdf__number">9.{number} · Decision trees</p><h1>{title}</h1><p className="tree-pdf__lead">{lead}</p></header>{children}</article>
}
function Slide({ src, alt }: { src: string; alt: string }) {
  return <img className="tree-pdf__slide" src={src} alt={alt} />
}
export function CLEntropy101() {
  return <Page number={10} title="Entropy" lead={<>Entropy measures uncertainty in the class labels. For two classes, it runs from <strong>0 = low uncertainty</strong> (all one class) to <strong>1 = high uncertainty</strong> (an even split).</>}>
    <p className="tree-pdf__goal">Our goal is to find <strong>independent variables (X)</strong> whose splits produce <strong>low-entropy target groups</strong>. Those variables help separate customers who churn from those who do not; we measure entropy in the target labels after splitting, rather than in X itself.</p>
    <Slide src={gender} alt="Gender split: parent 10 Yes and 10 No. Male branch has 4 Yes and 4 No; female branch has 6 Yes and 6 No. Every group stays 50/50, so entropy remains 1 and information gain is zero." />
    <Slide src={entropy} alt="Binary entropy formula: minus P1 times log base 2 of P1 minus P2 times log base 2 of P2. Each probability is its class count divided by N. The curve rises from 0 at P1=0 to 1 at P1=0.5, then falls to 0 at P1=1. The vertical axis is entropy; the horizontal axis is the probability of Class 1." />
    <p className="tree-pdf__goal"><strong>What is a bit?</strong> A bit is a unit of information. Because this formula uses the base-2 logarithm (<strong>log₂</strong>), entropy is measured in <strong>bits</strong>. For two classes, <strong>0 bits</strong> means no label uncertainty and <strong>1 bit</strong> means maximum uncertainty: an even 50/50 split. Information gain uses the same unit: a gain of 0.224 bits means uncertainty fell by that amount, not that prediction accuracy rose by 22.4%.</p>
    <p className="tree-pdf__note">P₁ and P₂ are the two class proportions; they add to 1. A zero-probability term contributes 0. Entropy measures label uncertainty, not prediction accuracy.</p>
  </Page>
}
export function CLEntropyInformationGain() {
  const parent = binaryEntropy(11, 20)
  const after = 12 / 20 * binaryEntropy(4, 12) + 8 / 20 * binaryEntropy(7, 8)
  return <Page number={11} title="Entropy & information gain" lead={<>Information gain measures how much a split reduces uncertainty. <strong>Higher gain means better class separation.</strong></>}>
    <section className="tree-pdf__gain-intro" aria-labelledby="gain-purpose"><h2 id="gain-purpose">Which independent variable helps most?</h2><p>The computer ranks candidate splits across <strong>input variables (X)</strong> by information gain, chooses the highest gain at this node, then repeats within each branch. Prediction quality is checked on unseen data.</p></section>
    <Slide src={gain} alt="Last-login split: fewer than 7 days has 4 Yes and 8 No, entropy 0.918; more than 7 days has 7 Yes and 1 No, entropy 0.544. The branches are less mixed. The source incorrectly labels the parent 10 Yes and 10 No." />
    <section className="tree-pdf__branch-change" aria-labelledby="printed-changes"><h3 id="printed-changes">Reading the parentheses</h3>
      <p><strong>Branch change = child entropy − immediate parent entropy.</strong></p>
      <div className="tree-pdf__table-scroll"><table className="tree-pdf__change-table"><thead><tr><th scope="col">Branch</th><th scope="col">Slide calculation</th><th scope="col">Meaning</th></tr></thead><tbody><tr><th scope="row">Fewer than 7 days</th><td>0.91 − 1 = <strong>−0.09</strong></td><td>Less uncertainty</td></tr><tr><th scope="row">More than 7 days</th><td>0.54 − 1 = <strong>−0.46</strong></td><td>A larger decrease</td></tr></tbody></table></div>
      <p>These changes describe individual branches. <strong>Information gain combines both branches</strong>, weighted by customer count.</p>
    </section>
    <section className="tree-pdf__calculation" aria-labelledby="gain-worked"><h2 id="gain-worked">Last login: calculate the whole split’s gain</h2>
      <p className="tree-pdf__source-fix"><strong>Source correction:</strong> the branches total <strong>11 churn + 9 no churn</strong>, not the slide’s 10 + 10. Below we use consistent counts and more precise entropies.</p>
      <h3 className="tree-pdf__step-title">1 · Count customers and calculate branch entropy</h3>
      <div className="tree-pdf__branch-calculations">
        <div><h3>Fewer than 7 days</h3><p><strong>4 churn + 8 no churn = 12</strong></p><p>H = −(4/12) log₂(4/12) − (8/12) log₂(8/12)<br />≈ <strong>0.9183 bits</strong></p><p>Weight: <strong>12/20 = 60%</strong></p></div>
        <div><h3>More than 7 days</h3><p><strong>7 churn + 1 no churn = 8</strong></p><p>H = −(7/8) log₂(7/8) − (1/8) log₂(1/8)<br />≈ <strong>0.5436 bits</strong></p><p>Weight: <strong>8/20 = 40%</strong></p></div>
      </div>
      <h3 className="tree-pdf__step-title">2 · Combine uncertainty across all 20 customers</h3>
      <p>The larger branch gets more weight: <strong>12 + 8 = 20 customers</strong>.</p>
      <p className="tree-pdf__equation">After split ≈ (<strong>60%</strong> × 0.9183) + (<strong>40%</strong> × 0.5436)<br />≈ <strong>{after.toFixed(4)} bits</strong></p>
      <h3 className="tree-pdf__step-title">3 · Subtract from the parent’s uncertainty</h3>
      <p>Parent: <strong>11/20 churn</strong> and <strong>9/20 no churn</strong> → entropy <strong>{parent.toFixed(4)} bits</strong>.</p>
      <p className="tree-pdf__equation"><strong>Information gain = before − after</strong><br />≈ {parent.toFixed(4)} − {after.toFixed(4)} = <strong>{(parent - after).toFixed(4)} bits</strong></p>
    </section>
    <Slide src={branches} alt="Continue splitting: lifetime value divides 4 Yes/8 No into 2 Yes/3 No (entropy .97) and 2 Yes/5 No (entropy .86). Age divides 7 Yes/1 No into 0 Yes/1 No and 7 Yes/0 No, both entropy 0. A child can be more mixed even when weighted entropy decreases." />
    <section className="tree-pdf__branch-change" aria-labelledby="branch-sign"><h3 id="branch-sign">Positive or negative?</h3>
      <p>Again: <strong>child entropy − its immediate parent’s entropy</strong>, using the slide’s printed values.</p>
      <div className="tree-pdf__table-scroll"><table className="tree-pdf__change-table"><thead><tr><th scope="col">Child</th><th scope="col">Change</th><th scope="col">Meaning</th></tr></thead><tbody><tr><th scope="row">LTV &lt;$50</th><td>0.97 − 0.91 = <strong>+0.06</strong></td><td>More uncertainty</td></tr><tr><th scope="row">LTV &gt;$50</th><td>0.86 − 0.91 = <strong>−0.05</strong></td><td>Less uncertainty</td></tr><tr><th scope="row">Each age child</th><td>0 − 0.54 = <strong>−0.54</strong></td><td>Pure: one class</td></tr></tbody></table></div>
      <p><strong>Zero change means unchanged uncertainty.</strong> One child can become more mixed while the whole split still improves; judge the split by its weighted information gain.</p>
    </section>
  </Page>
}

const exampleRoot = { x: 488, y: 12, width: 202, height: 103 }
const examples = [
  {
    src: customerA, features: [['Age', '52 years'], ['Last login', '21 days ago']], prediction: 'CHURN',
    alt: 'Course tree: last login over 7 days, then age over 35, reaching the 7 churn / 0 no-churn leaf.',
    frames: [
      { label: 'Start at the root with this customer.', box: exampleRoot, path: '' },
      { label: 'Last login: 21 > 7 days → follow the right branch.', box: { x: 669, y: 196, width: 202, height: 103 }, path: 'M589 115 L589 148 Q590 165 690 165 Q750 165 770 191' },
      { label: 'Age: 52 > 35 → leaf with 7 churn and 0 no churn.', box: { x: 825, y: 398, width: 205, height: 103 }, path: 'M770 299 L770 332 Q770 363 855 365 Q912 365 927 393' },
      { label: 'The leaf predicts CHURN.', box: { x: 871, y: 581, width: 221, height: 90 }, path: 'M928 501 L928 547 Q928 560 982 560 L982 577' },
    ],
  },
  {
    src: customerB, features: [['Last login', '3 days ago'], ['Lifetime value (LTV)', '$28'], ['Sign-up', '90 days ago']], prediction: 'NO CHURN',
    alt: 'Course tree: last login under 7 days, lifetime value under $50, signup over 60 days, reaching 1 churn / 3 no churn.',
    frames: [
      { label: 'Start at the root with this customer.', box: exampleRoot, path: '' },
      { label: 'Last login: 3 < 7 days → follow the left branch.', box: { x: 314, y: 196, width: 202, height: 103 }, path: 'M589 115 L589 148 Q589 165 485 165 Q435 165 415 191' },
      { label: 'Lifetime value: $28 < $50 → follow the left branch.', box: { x: 151, y: 399, width: 203, height: 103 }, path: 'M415 299 L415 332 Q415 362 324 364 Q270 364 253 394' },
      { label: 'Sign-up: 90 > 60 days → leaf with 1 churn and 3 no churn.', box: { x: 289, y: 605, width: 202, height: 102 }, path: 'M253 502 L253 539 Q253 563 344 564 Q377 564 390 600' },
      { label: 'The majority in this leaf predicts NO CHURN.', box: { x: 871, y: 581, width: 221, height: 90 }, path: 'M491 656 L521 656 L521 708 L850 708 L850 626 L866 626' },
    ],
  },
  {
    src: customerC, features: [['Last login', '5 days ago'], ['Lifetime value (LTV)', '$70']], prediction: 'NO CHURN',
    alt: 'Course tree: last login under 7 days, lifetime value over $50, reaching 2 churn / 5 no churn.',
    frames: [
      { label: 'Start at the root with this customer.', box: exampleRoot, path: '' },
      { label: 'Last login: 5 < 7 days → follow the left branch.', box: { x: 314, y: 196, width: 202, height: 103 }, path: 'M589 115 L589 148 Q589 165 485 165 Q435 165 415 191' },
      { label: 'Lifetime value: $70 > $50 → leaf with 2 churn and 5 no churn.', box: { x: 377, y: 399, width: 202, height: 103 }, path: 'M415 299 L415 332 Q415 362 500 364 Q530 364 543 394' },
      { label: 'The majority in this leaf predicts NO CHURN.', box: { x: 871, y: 581, width: 221, height: 90 }, path: 'M579 450 L603 450 L603 553 L850 553 L850 626 L866 626' },
    ],
  },
]
const customerFrames = examples.flatMap((example, exampleIndex) => example.frames.map((_, phase) => ({ exampleIndex, phase })))
const lastCustomerFrame = customerFrames.length - 1

export function CLDecisionTreeExamples() {
  const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const [position, setPosition] = useState(() => reducedMotion() ? lastCustomerFrame : 0)
  const [playing, setPlaying] = useState(() => !reducedMotion())
  const [reduced, setReduced] = useState(reducedMotion)
  const overlay = useRef<SVGSVGElement>(null)
  const previousPosition = useRef(position)
  const { exampleIndex, phase } = customerFrames[position]
  const example = examples[exampleIndex]
  const frame = example.frames[phase]
  const complete = phase === example.frames.length - 1
  const atEnd = position === lastCustomerFrame
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => { setReduced(preference.matches); if (preference.matches) { setPosition(lastCustomerFrame); setPlaying(false) } }
    preference.addEventListener('change', update)
    return () => preference.removeEventListener('change', update)
  }, [])
  useEffect(() => {
    if (!playing || atEnd) return
    const timer = window.setTimeout(() => setPosition(current => Math.min(lastCustomerFrame, current + 1)), complete ? 3000 : 2300)
    return () => window.clearTimeout(timer)
  }, [playing, position, complete, atEnd])
  useEffect(() => {
    if (playing && !reduced) overlay.current?.unpauseAnimations()
    else {
      if (previousPosition.current !== position || reduced) overlay.current?.setCurrentTime(2)
      overlay.current?.pauseAnimations()
    }
    previousPosition.current = position
  }, [playing, position, reduced])
  const move = (delta: number) => { setPlaying(false); setPosition(current => Math.max(0, Math.min(lastCustomerFrame, current + delta))) }
  const chooseExample = (index: number) => {
    setPlaying(false)
    setPosition(customerFrames.findIndex(item => item.exampleIndex === index && item.phase === (reduced ? examples[index].frames.length - 1 : 0)))
  }
  return <Page number={12} title="Decision tree examples" lead="Follow one customer’s values through the tree to a prediction.">
    <dl className="tree-pdf__node-terms" aria-label="Standard decision-tree terms"><div><dt>Root node</dt><dd>The starting node: all training customers.</dd></div><div><dt>Decision node</dt><dd>A node split by a feature-based rule.</dd></div><div><dt>Leaf node</dt><dd>A final group whose labels determine the prediction.</dd></div></dl>
    <div className="tree-pdf__example-tabs" role="group" aria-label="Choose customer example">{examples.map((_, index) => <button key={index} aria-pressed={exampleIndex === index} onClick={() => chooseExample(index)}>Example {index + 1}</button>)}</div>
    <header className="tree-pdf__customer-header"><h2>Example {exampleIndex + 1}</h2><dl>{example.features.map(([name, value]) => <div key={name}><dt>{name}</dt><dd>{value}</dd></div>)}</dl></header>
    <div className="tree-pdf__playback" aria-label="Customer path animation"><PlaybackButton action="previous" label="Previous customer path step" disabled={position === 0} onClick={() => move(-1)}/><span>Path step {phase + 1} / {example.frames.length}</span><PlaybackButton action="next" label="Next customer path step" disabled={atEnd} onClick={() => move(1)}/><PlaybackButton action={playing && !atEnd ? 'pause' : atEnd ? 'replay' : 'play'} label={playing && !atEnd ? 'Pause customer path animation' : atEnd ? 'Replay customer path animation' : 'Autoplay customer path animation'} onClick={() => { if (atEnd) { setPosition(0); setPlaying(true) } else setPlaying(!playing) }}/><PlaybackButton action="replay" label="Replay example" onClick={() => { setPosition(customerFrames.findIndex(item => item.exampleIndex === exampleIndex)); setPlaying(true) }}/></div>
    <p className="tree-pdf__path-caption" aria-live="polite">{frame.label}</p>
    <div className="tree-pdf__animated-tree" data-example={exampleIndex + 1} data-phase={phase}>
      <Slide src={example.src} alt={example.alt} />
      <svg ref={overlay} key={position} viewBox="0 0 1110 715" className={`tree-pdf__path-overlay ${playing ? '' : 'is-paused'}`} aria-hidden="true">
        {!complete && <rect x="868" y="578" width="228" height="96" rx="16" className="tree-pdf__prediction-cover" />}
        {!complete && <text x="982" y="632" className="tree-pdf__waiting-label">Follow the path…</text>}
        {example.frames.slice(1, phase + 1).map((item, index) => <path key={index} d={item.path} className={`tree-pdf__traced-path ${index === phase - 1 && playing && !reduced ? 'is-drawing' : ''}`} pathLength="1" />)}
        <rect {...frame.box} rx="10" className={`tree-pdf__active-node ${complete ? 'is-prediction' : ''}`} />
        {phase === 0 ? <circle cx="589" cy="58" r="10" className="tree-pdf__customer-dot" /> : <circle r="10" className="tree-pdf__customer-dot">{!reduced ? <animateMotion dur="1.3s" path={frame.path} fill="freeze" /> : <animateMotion dur="0.001s" path={frame.path} fill="freeze" />}</circle>}
      </svg>
    </div>
    <p className={`tree-pdf__path-result ${complete ? 'is-visible' : ''}`} aria-live="polite">{complete ? `Prediction: ${example.prediction}` : 'The highlighted circle represents the customer being classified.'}</p>
    <p className="tree-pdf__note">These are standard technical terms. The animation follows the supplied course tree; it does not train a new model. The source’s parent-count inconsistency is explained in 9.11.</p>
    <section className="tree-pdf__faq" aria-labelledby="tree-common-questions"><h2 id="tree-common-questions">Common questions</h2>
      <article><h3>When should the tree stop splitting?</h3><p>Growing too many branches can <strong>overfit</strong>: memorizing training examples instead of predicting new cases well.</p><p><strong>Hyperparameters</strong> are settings that control how a model learns. For a tree, these include:</p><dl className="tree-pdf__hyperparameters"><div><dt>Maximum depth</dt><dd>Limits the number of splits along a root-to-leaf path.</dd></div><div><dt>Minimum leaf size</dt><dd>Requires a minimum number of training records in each leaf.</dd></div></dl><p>Choose these settings using validation data. The tree learns its actual split rules from training data.</p></article>
      <article><h3>Where should a numerical variable be split?</h3><p>Test several <strong>thresholds</strong> for the same variable. Each threshold creates two groups: values <strong>at or below</strong> the cutoff and values <strong>above</strong> it.</p>
        <div className="tree-pdf__thresholds" aria-label="Illustrative candidate age thresholds">{[25, 35, 45].map(age => <div key={age}><strong>Age ≤ {age} / Age &gt; {age}</strong><span>Count both groups’ class labels</span><span>↓</span><span>Calculate weighted entropy</span><span>↓</span><b>Compare information gain</b></div>)}</div>
        <p className="tree-pdf__threshold-note">Illustrative candidate cutoffs; the source tree uses age 35. Gain values require the training records.</p>
        <p>Compare thresholds <strong>within each variable</strong>, then compare the candidate splits <strong>across variables</strong>. Choose the variable-and-threshold pair with the highest gain at this node. A more pure group on just one side is not enough: both sides count, weighted by their sizes.</p></article>
      <article><h3>Does the best first split guarantee the best model?</h3><p>Not necessarily! That’s why we often use a collection of multiple decision trees, known as a <strong>random forest</strong>.</p></article>
    </section>
  </Page>
}
export function CLRandomForests() {
  return <Page number={13} title="Random forests" lead={<>A random forest combines decision trees built with random samples of observations and random candidate features at each split.</>}>
    <Slide src={forest} alt="Source forest diagram: four illustrated trees connect to candidate features Age, Gender, Income, Sign-Up, Log-In and LTV across Split 1, Split 2 and Split N. Tree predictions are Churn, No Churn, Churn and Churn. Arrows join their votes into final prediction Churn." />
    <p className="tree-pdf__note">For classification, the most frequent class—the <strong>mode</strong>—wins the vote. These are the source’s schematic votes, not a forest trained on this page.</p>
  </Page>
}
