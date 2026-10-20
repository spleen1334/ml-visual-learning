import type { ReactNode } from 'react'
import './ClassificationTrees.css'
export { CLEntropy101, CLEntropyInformationGain, CLDecisionTreeExamples, CLRandomForests } from './DecisionTreePdfLessons'
export { CLDecisionTreeCaseStudy } from './DecisionTreeWorkbookCase'

type LessonProps = { number: string; title: string; lead: string; children: ReactNode }

function Lesson({ number, title, lead, children }: LessonProps) {
  return <article className="classification-trees" aria-labelledby={`ct-title-${number}`}>
    <header className="ct-header"><p className="ct-eyebrow">Chapter 09 · Lesson {number}</p><h1 id={`ct-title-${number}`}>{title}</h1><p>{lead}</p></header>
    {children}
  </article>
}

function Definition({ children, note }: { children: ReactNode; note: ReactNode }) {
  return <section className="ct-definition"><div><p className="ct-eyebrow">The central idea</p><h2>{children}</h2><p>{note}</p></div><div className="ct-definition-mark" aria-hidden="true"><span>Features · X</span><b>↓</b><span>Class · Y</span></div></section>
}

export function CLIntroDecisionTrees() {
  return <Lesson number="9" title="A decision tree asks a series of questions" lead="A decision tree follows feature-based rules to predict a category, such as whether a subscriber will churn.">
    <Definition note={<>Each rule tests one feature and divides the training records into two groups. The target (Y) is the class to predict; features (X) are the information used to make that prediction.</>}><strong>A decision tree</strong> predicts a category by applying a sequence of feature-based rules.</Definition>
    <section className="ct-panel" aria-labelledby="ct-tree-intro"><div className="ct-heading"><p className="ct-eyebrow">A small example · subscriber churn</p><h2 id="ct-tree-intro">Follow each rule from the root to a predicted class</h2><p>Start at the root and follow each answer to a leaf: the predicted class.</p></div>
      <svg className="ct-tree-svg" viewBox="0 0 1000 490" role="img" aria-labelledby="ct-tree-title ct-tree-desc">
        <title id="ct-tree-title">Schematic decision tree for subscriber churn</title>
        <desc id="ct-tree-desc">Eight labeled arrows connect the root question to two decisions, each decision to its children, and the signup question to two leaves.</desc>
        <defs><marker id="ct-tree-arrow" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" /></marker></defs>
        <g className="ct-tree-edges" aria-hidden="true">
          <path d="M500 88 V112 H260 V145"/><path d="M500 112 H760 V145"/>
          <path d="M260 213 V242 H170 V278"/><path d="M260 242 H390 V278"/>
          <path d="M170 346 V388 H95 V415"/><path d="M170 388 H245 V415"/>
          <path d="M760 213 V278 H650 V315"/><path d="M760 278 H870 V315"/>
        </g>
        <g className="ct-tree-edge-labels" aria-hidden="true">
          <text x="363" y="108">No · 7 days or less</text><text x="637" y="108">Yes · more than 7 days</text>
          <text x="205" y="238">Yes · under $50</text><text x="332" y="238">No · $50 or more</text>
          <text x="125" y="385">Yes</text><text x="215" y="385">No</text>
          <text x="695" y="274">No · 35 or younger</text><text x="818" y="274">Yes · over 35</text>
        </g>
        <g className="ct-tree-node ct-tree-root"><rect x="365" y="20" width="270" height="68" rx="11"/><text className="ct-tree-kicker" x="500" y="45">ROOT · all training customers</text><text className="ct-tree-question" x="500" y="70">Last login more than 7 days ago?</text></g>
        <g className="ct-tree-node"><rect x="135" y="145" width="250" height="68" rx="11"/><text className="ct-tree-kicker" x="260" y="170">DECISION</text><text className="ct-tree-question" x="260" y="195">Lifetime value under $50?</text></g>
        <g className="ct-tree-node"><rect x="635" y="145" width="250" height="68" rx="11"/><text className="ct-tree-kicker" x="760" y="170">DECISION</text><text className="ct-tree-question" x="760" y="195">Age over 35?</text></g>
        <g className="ct-tree-node"><rect x="45" y="278" width="250" height="68" rx="11"/><text className="ct-tree-kicker" x="170" y="303">DECISION</text><text className="ct-tree-question" x="170" y="328">Signup more than 60 days ago?</text></g>
        <g className="ct-tree-leaf"><rect x="305" y="278" width="170" height="68" rx="11"/><text className="ct-tree-kicker" x="390" y="303">LEAF · course example</text><text className="ct-tree-outcome" x="390" y="330">Stay</text></g>
        <g className="ct-tree-leaf"><rect x="570" y="315" width="160" height="68" rx="11"/><text className="ct-tree-kicker" x="650" y="340">LEAF · schematic</text><text className="ct-tree-outcome" x="650" y="367">Stay</text></g>
        <g className="ct-tree-leaf ct-tree-leaf-gold"><rect x="790" y="315" width="160" height="68" rx="11"/><text className="ct-tree-kicker" x="870" y="340">LEAF · course example</text><text className="ct-tree-outcome" x="870" y="367">Churn</text></g>
        <g className="ct-tree-leaf"><rect x="20" y="415" width="150" height="68" rx="11"/><text className="ct-tree-kicker" x="95" y="440">LEAF · course path</text><text className="ct-tree-outcome" x="95" y="467">Stay</text></g>
        <g className="ct-tree-leaf ct-tree-leaf-gold"><rect x="170" y="415" width="150" height="68" rx="11"/><text className="ct-tree-kicker" x="245" y="440">LEAF · schematic</text><text className="ct-tree-outcome" x="245" y="467">Churn</text></g>
      </svg>
      <p className="ct-note">A schematic of the course’s rules, not a fitted model. “Stay” means no churn. Two opposite-path leaves are illustrative; the complete source examples follow in 9.12.</p>
    </section>
    <section className="ct-terms" aria-label="How the tree chooses a split"><p><strong>Entropy</strong> measures how mixed the class labels are in a group.</p><p><strong>Information gain</strong> is the reduction in entropy after a split, weighted by the sizes of its branches. Training compares candidate rules and chooses useful splits.</p></section>
  </Lesson>
}
