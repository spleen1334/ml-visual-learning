import { useEffect, useState } from 'react'
import { PlaybackButton } from '../components/PlaybackButton'
import { faqSearchIndex } from './nlpLexicalSearch'
import { workflowEvidence } from './nlpWorkflowData'
import './NLPIntroduction.css'
import './NLPWorkflow.css'

const evidence = workflowEvidence()
const names = ['Task', 'Data', 'Representation', 'Method', 'Output', 'Evaluation']
type Branch = 'classification' | 'search' | 'extraction'
const branches: { id: Branch; name: string; purpose: string }[] = [
  { id: 'classification', name: 'Classification', purpose: 'Choose a label' },
  { id: 'search', name: 'Search', purpose: 'Rank evidence' },
  { id: 'extraction', name: 'Extraction', purpose: 'Fill fields' },
]
const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const format = (value: number | null) => value === null ? 'not defined' : value.toFixed(3)

export function NLPWorkflow() {
  const [branch, setBranch] = useState<Branch>('classification')
  const [step, setStep] = useState(() => reduced() ? 5 : 0)
  const [playing, setPlaying] = useState(false)
  const [reduce, setReduce] = useState(reduced)
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => { setReduce(media.matches); if (media.matches) { setPlaying(false); setStep(5) } }
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  useEffect(() => {
    if (!playing || reduce) return
    if (step === 5) { setPlaying(false); return }
    const timer = window.setTimeout(() => setStep(value => value + 1), 2400)
    return () => window.clearTimeout(timer)
  }, [playing, reduce, step])
  const select = (value: number) => { setPlaying(false); setStep(value) }
  const prediction = evidence.prediction
  const missing = prediction.represented.find(word => word.word === 'missing')!
  const faqTerm = evidence.retrieval.results[0].terms.find(term => term.word === 'refund')!
  const { cells, scores, entityExample } = evidence
  const commonData = 'Check text quality and reference labels or spans first; keep the evaluation cases separate from fitting.'
  const content: Record<Branch, { summary: string[]; detail: string[]; link: string; href: string }> = {
    classification: {
      summary: ['Predict sentiment label', `${evidence.model.trainingSize} labeled training messages`, `${evidence.model.vocabulary.length} training words`, 'Fit Naive Bayes', `${prediction.prediction} label`, `Compare ${Object.values(cells).reduce((sum, ids) => sum + ids.length, 0)} references`],
      detail: [
        'A category is the requested output: predict the sentiment label, not a support answer.',
        `${commonData} CS01–CS08 provide authored references; CS11 is held out.`,
        `Computed counts use the training-only vocabulary of ${evidence.model.vocabulary.length} words. “missing” occurs ${missing.count} time in CS11; unseen words are ignored.`,
        `Computed fit: “missing” has training counts ${missing.counts.join(' negative / ')} positive, giving likelihoods ${missing.likelihoods.map(value => value.toFixed(3)).join(' / ')}. The model was fitted before this held-out message.`,
        `Computed prediction: ${prediction.prediction} · negative score ${(prediction.scores[0] * 100).toFixed(2)}%. Authored CS11 reference: ${evidence.input.label}. The score is not a guarantee.`,
        `Separate three-case check, treating positive sentiment as the positive class: TP ${cells.TP.length} (${cells.TP.join(', ')}), FP ${cells.FP.length} (${cells.FP.join(', ')}), FN ${cells.FN.length}, TN ${cells.TN.length} (${cells.TN.join(', ')}). Precision ${format(scores.precision)}, recall ${format(scores.recall)}, F1 ${format(scores.f1)}.`,
      ], link: '97.6 Classifier', href: '#chapter-97/97.6-a-small-text-classifier',
    },
    search: {
      summary: ['Find ranked FAQs', 'Separate FAQ collection', `${faqSearchIndex.index.vocabulary.length} FAQ index terms`, 'TF–IDF + cosine', 'Ranked FAQ list', 'Judge relevance'],
      detail: [
        'A ranked list of potentially useful support documents is the requested output.',
        `${commonData} The three FAQ titles and bodies form a separate search collection, not classifier training data.`,
        `Computed FAQ-only vocabulary and IDF use ${faqSearchIndex.index.vocabulary.length} terms; CS11 is transformed as a query without refitting. “refund” appears ${faqTerm.queryCount} time in the query and ${faqTerm.documentCount} times in ${evidence.retrieval.results[0].id}.`,
        `Computed raw TF–IDF cosine: the “refund” contribution to ${evidence.retrieval.results[0].id}'s dot product is ${faqTerm.product.toFixed(3)}. This index is not the classifier vocabulary.`,
        `Computed ranking: ${evidence.retrieval.results.map(item => `${item.id} ${item.score.toFixed(3)}`).join(' → ')}. The order in 97.1 was authored, not this computation.`,
        'Cosine is a matching score, not evidence of relevance or truth. Evaluate ranking with separate relevance judgments, especially near the top; do not borrow classifier F1.',
      ], link: '97.7 Search calculation', href: '#chapter-97/97.7-search-by-words',
    },
    extraction: {
      summary: ['Extract record fields', 'Authored span references', 'Character spans + types', 'Copy by type', 'Structured record', 'Check exact spans'],
      detail: [
        'A structured record is the requested output: identify fields in the message.',
        `${commonData} CS11 has authored organization and date-expression annotations; a real annotator or model can be wrong.`,
        `Supplied annotations: ${evidence.extraction.annotations.map(span => `${span.text} [${span.start}, ${span.end}) · ${span.type}`).join('; ')}. They are not live NER predictions.`,
        'Computed rule: copy the first authored span of each type into its field; leave unannotated fields null.',
        `Computed record: person ${evidence.record.person ?? 'null'}, organization ${evidence.record.organization}, date expression ${evidence.record.dateExpression}. Null is not proof of absence; Friday is not a resolved date.`,
        `Exact span-and-type matching is needed. The separate authored Maya candidate example in 97.10 has TP ${entityExample.tp.length}, FP ${entityExample.fp.length}, FN ${entityExample.fn.length}; it is not measured performance of a live NER model.`,
      ], link: '97.9 Extraction', href: '#chapter-97/97.9-turn-text-into-a-structured-record',
    },
  }
  const active = content[branch]
  return <article className="nlp-lesson nlp-workflow-lesson">
    <header className="nlp-header"><p className="nlp-eyebrow">97.11 · Natural Language Processing</p><h1>Follow the complete NLP workflow</h1><p className="nlp-definition"><strong>Start with the output you need</strong>, then choose data, a representation, a method and a way to evaluate it.</p><p>Follow one message through three possible tasks. You do not need every branch.</p></header>
    <section className="nlp-map" aria-labelledby="nlp-workflow-title"><div className="nlp-map-heading"><div><p className="nlp-eyebrow">ONE MESSAGE · THREE PATHS</p><h2 id="nlp-workflow-title">Choose a task, follow the path</h2></div><p>Select a path or step; all steps remain available.</p></div>
      <div className="nlp-workflow-message"><p className="nlp-kicker">SHARED INPUT · {evidence.input.id}</p><p>{evidence.input.text}</p></div>
      <div className="nlp-workflow-branches" role="group" aria-label="Choose an NLP task">{branches.map(item => <button key={item.id} type="button" aria-pressed={branch === item.id} onClick={() => { setPlaying(false); setBranch(item.id) }}><strong>{item.name}</strong><small>{item.purpose}</small></button>)}<a href="#chapter-99/99.14-full-pipeline"><strong>Optional LLM ↗</strong><small>Draft or summarize</small></a></div>
      <div className="nlp-workflow-map" role="group" aria-label="Choose a workflow step">{names.map((name, index) => <div className="nlp-workflow-node" key={name}><button type="button" aria-pressed={step === index} onClick={() => select(index)}><span>0{index + 1}</span><strong>{name}</strong><small>{active.summary[index]}</small></button>{index < names.length - 1 && <b aria-hidden="true">→</b>}</div>)}</div>
      <div className="nlp-workflow-detail" aria-live="polite"><p className="nlp-kicker">{branches.find(item => item.id === branch)?.name} · {names[step]}</p><p>{active.detail[step]}</p><a href={active.href}>{active.link} →</a>{step === 5 && branch !== 'search' && <> · <a href="#chapter-97/97.10-how-do-we-know-it-works">97.10 Evaluation →</a></>}</div>
      <div className="nlp-workflow-playback" role="group" aria-label="Workflow playback"><PlaybackButton action="previous" label="Previous workflow step" disabled={step === 0} onClick={() => select(step - 1)} /><PlaybackButton action={playing ? 'pause' : step === 5 ? 'replay' : 'play'} label={reduce ? 'Autoplay disabled: reduced motion is preferred' : playing ? 'Pause workflow' : step === 5 ? 'Replay workflow' : 'Play workflow'} disabled={reduce} aria-pressed={playing} onClick={() => { if (step === 5) setStep(0); setPlaying(!playing) }} /><PlaybackButton action="next" label="Next workflow step" disabled={step === 5} onClick={() => select(step + 1)} /><span role="status">Step {step + 1} of 6{reduce ? ' · Reduced motion: use manual controls.' : ''}</span></div>
    </section>
    <section className="nlp-workflow-llm"><p className="nlp-eyebrow">ANOTHER OPTION · NOT A REQUIRED STEP</p><h2>What if the output is new text?</h2><p>For drafting or summarization, an LLM may be an option alongside these paths. Check its output against the source. The summary in 97.1 is authored, not a live LLM result; retrieval can supply context but does not guarantee truth.</p><a href="#chapter-99/99.14-full-pipeline">99.14 LLM pipeline</a> · <a href="#chapter-99/99.12-context-memory-retrieval-tools">99.12 Retrieval and context</a> · <a href="#chapter-97/97.1-what-can-we-do-with-language">97.1 Task map</a></section>
    <section className="nlp-workflow-guidance"><h2>Common use cases</h2><p><b>Labels:</b> route a support message by sentiment. <b>Ranked evidence:</b> find relevant support guidance. <b>Fields:</b> extract organizations and date expressions. <b>Drafts:</b> summarize a message with an optional LLM and check the source.</p><h2>Note</h2><p>First inspect data quality and reference labels or spans, and prevent leakage. Choose a method for the output you need; inspect errors using task-appropriate checks, then evaluate changes on fresh held-out cases. Do not assume every project needs every tool.</p></section>
  </article>
}
