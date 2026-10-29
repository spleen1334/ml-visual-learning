import { useEffect, useState } from 'react'
import { PlaybackButton } from '../components/PlaybackButton'
import { authoredFaqRanking, input, spans } from './nlpData'
import './NLPIntroduction.css'

const tasks = ['Classification', 'Extraction', 'Search', 'Generation'] as const
const shapes = ['One category label', 'Text spans + types', 'Ranked documents', 'New text']
const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function NLPIntroduction() {
  const [task, setTask] = useState(() => reduced() ? 3 : 0)
  const [playing, setPlaying] = useState(false)
  const [reduce, setReduce] = useState(reduced)
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => { setReduce(media.matches); if (media.matches) { setPlaying(false); setTask(3) } }
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  useEffect(() => {
    if (!playing || reduce) return
    if (task === 3) { setPlaying(false); return }
    const timer = window.setTimeout(() => setTask(value => value + 1), 2200)
    return () => window.clearTimeout(timer)
  }, [playing, reduce, task])
  const select = (value: number) => { setPlaying(false); setTask(value) }
  return <article className="nlp-lesson">
    <header className="nlp-header"><p className="nlp-eyebrow">97.1 · Natural Language Processing</p><h1>What can we do with language?</h1><p className="nlp-definition"><strong>Natural language processing (NLP)</strong> is working with human language using computers.</p><p>The same message can be used for different tasks—and each task produces a different kind of output.</p></header>
    <section className="nlp-map" aria-labelledby="nlp-map-title"><div className="nlp-map-heading"><div><p className="nlp-eyebrow">ONE MESSAGE · FOUR TASKS</p><h2 id="nlp-map-title">Follow the input to its output</h2></div><p>Select a task or play through the map.</p></div>
      <div className="nlp-terms"><span><b>Document</b> = one piece of text</span><span><b>Corpus</b> = a collection of documents</span><span><b>Label</b> = a category name</span><span><b>Span</b> = a continuous piece of text</span></div>
      <div className="nlp-tasks" role="group" aria-label="Choose a language task">{tasks.map((name, i) => <button key={name} type="button" aria-pressed={task === i} onClick={() => select(i)}><span>0{i + 1}</span><strong>{name}</strong><small>{shapes[i]}</small></button>)}</div>
      <div className="nlp-flow"><div className="nlp-input"><p className="nlp-kicker">INPUT · DOCUMENT {input.id}</p><p className="nlp-message">{task === 1 ? <>{input.text.slice(0, spans[0].start)}<mark>{spans[0].text}</mark>{input.text.slice(spans[0].end, spans[1].start)}<mark>{spans[1].text}</mark>{input.text.slice(spans[1].end)}</> : input.text}</p><p>One message from the customer-support corpus.</p></div><div className="nlp-arrow" aria-hidden="true">→</div><div className="nlp-output" aria-live="polite"><p className="nlp-kicker">OUTPUT · {shapes[task].toUpperCase()}</p>
        {task === 0 && <><h3>Negative</h3><p>Authored reference label for the message’s expressed tone—not a model prediction.</p></>}
        {task === 1 && <><h3>Two authored spans</h3><ul className="nlp-spans">{spans.map(span => <li key={span.text}><b>{span.text}</b><span>{span.type} · [{span.start}, {span.end})</span></li>)}</ul><p>Offsets start at zero; the end is excluded. Friday is a date expression, not a resolved calendar date.</p></>}
        {task === 2 && <><h3>Support FAQ results</h3><p>Authored ranking from a separate support FAQ collection; no search score is computed.</p><ol className="nlp-results">{authoredFaqRanking.map(doc => <li key={doc.id}><b>{doc.title}</b><span>{doc.id} · {doc.text}</span></li>)}</ol></>}
        {task === 3 && <><h3>A summary</h3><blockquote>The customer is upset about a missing Acme order and requests a refund by Friday.</blockquote><p>Authored summary, not a live LLM result or a refund decision.</p></>}
      </div></div>
      <div className="nlp-playback" role="group" aria-label="Task map playback"><PlaybackButton action="previous" label="Previous task" disabled={task === 0} onClick={() => select(task - 1)} /><PlaybackButton action={playing ? 'pause' : task === 3 ? 'replay' : 'play'} label={reduce ? 'Autoplay disabled: reduced motion is preferred' : playing ? 'Pause task map' : task === 3 ? 'Replay task map' : 'Play task map'} disabled={reduce} aria-pressed={playing} onClick={() => { if (task === 3) setTask(0); setPlaying(!playing) }} /><PlaybackButton action="next" label="Next task" disabled={task === 3} onClick={() => select(task + 1)} /><span role="status">Task {task + 1} of 4{reduce ? ' · Reduced motion: select a task or step manually.' : ''}</span></div>
    </section>
    <p className="nlp-beyond">NLP also includes speech recognition, translation, parsing and topic discovery; those are outside this introduction.</p><nav className="nlp-links" aria-label="Related lessons"><b>Explore related lessons</b><a href="#chapter-09/9.22-intro-to-sentiment-analysis">9.22 Sentiment analysis</a><a href="#chapter-09/9.23-cleaning-text-data">9.23 Cleaning text</a><a href="#chapter-09/9.24-bag-of-words-analysis">9.24 Bag of words</a><a href="#chapter-09/9.25-case-study-sentiment-analysis">9.25 Sentiment case study</a><a href="#chapter-99/99.14-full-pipeline">99.14 LLM pipeline</a></nav>
  </article>
}
