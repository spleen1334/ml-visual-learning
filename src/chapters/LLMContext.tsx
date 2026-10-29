import { useEffect, useState } from 'react'
import { PlaybackButton } from '../components/PlaybackButton'
import { assembleContext, PASSAGE, STORED_NOTE, TOOL_REQUEST, TOOL_RESULT } from './llmContext'
import './LargeLanguageModels.css'
import './LLMContext.css'

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const labels = ['Assemble the first request', 'Model requests a tool', 'Application returns a tool result', 'Next response']

export function LLMContext() {
  const [motion, setMotion] = useState(reduced)
  const [step, setStep] = useState(() => reduced() ? 3 : 0)
  const [playing, setPlaying] = useState(false)
  const [includeNote, setIncludeNote] = useState(true)
  const [findPassage, setFindPassage] = useState(true)
  const [window, setWindow] = useState(6)
  const options = { includeNote, findPassage, window, reserve: 1 }
  const trace = assembleContext(options, step)
  useEffect(() => {
    const media = globalThis.window.matchMedia('(prefers-reduced-motion: reduce)')
    const change = () => { setMotion(media.matches); if (media.matches) { setPlaying(false); setStep(3) } }
    media.addEventListener('change', change)
    return () => media.removeEventListener('change', change)
  }, [])
  useEffect(() => {
    if (!playing || motion) return
    if (step === 3 || trace.overflow) { setPlaying(false); return }
    const timer = globalThis.window.setTimeout(() => setStep(s => s + 1), 1800)
    return () => globalThis.window.clearTimeout(timer)
  }, [playing, motion, step, trace.overflow])
  const restart = () => { setPlaying(false); setStep(0) }

  return <article className="llm-lesson">
    <header className="llm-header">
      <p className="llm-eyebrow">99.12 · Large Language Models</p>
      <h1>Context, memory, retrieval, and tools</h1>
      <p className="llm-definition"><strong>Context is the information supplied to a model for a particular generation.</strong> Stored information is not automatically visible.</p>
      <p>A library question follows an authored trace, not a model run. All hours below are illustrative, not real opening hours.</p>
    </header>
    <div className="context-terms"><p><strong>Stored memory</strong> is a note kept outside the request. <strong>Retrieval</strong> finds outside passages to insert. A <strong>tool</strong> is functionality the application can execute on a model’s request.</p><p>A <strong>context window</strong> is a model-specific size limit for input and output, and for some models reasoning tokens too.</p></div>
    <section className="llm-demo context-demo" aria-labelledby="context-title">
      <div className="llm-demo-heading"><h2 id="context-title">A Thursday library question</h2><p>Local teaching fixtures · no model, search, or external service</p></div>
      <div className="context-controls"><label><input type="checkbox" checked={includeNote} onChange={e => { setIncludeNote(e.target.checked); restart() }} /> Insert stored note</label><label><input type="checkbox" checked={findPassage} onChange={e => { setFindPassage(e.target.checked); restart() }} /> Retrieval finds passage</label><label>Teaching window <select value={window} onChange={e => { setWindow(Number(e.target.value)); restart() }}><option value={6}>6 units</option><option value={4}>4 units</option></select></label></div>
      <div className="llm-playback" role="group" aria-label="Request trace playback">
        <PlaybackButton action="previous" label="Previous trace step" disabled={step === 0} onClick={() => { setPlaying(false); setStep(step - 1) }} />
        <PlaybackButton action={playing ? 'pause' : step === 3 || trace.overflow ? 'replay' : 'play'} label={motion ? 'Autoplay disabled for reduced motion' : playing ? 'Pause trace' : step === 3 || trace.overflow ? 'Replay trace' : 'Play trace'} disabled={motion} onClick={() => { if (step === 3 || trace.overflow) setStep(0); setPlaying(!playing) }} />
        <PlaybackButton action="next" label="Next trace step" disabled={step === 3 || trace.overflow} onClick={() => { setPlaying(false); setStep(step + 1) }} />
        <PlaybackButton action="replay" label="Reset trace" disabled={step === 0 && !playing} onClick={restart} />
        <span role="status">{trace.overflow ? 'Stopped: context exceeds the window.' : `${step + 1} of 4 · ${labels[step]}`}</span>
      </div>
      <p className="llm-playback-note">Next traces one event. Changing a control restarts the trace. {motion && 'Reduced motion starts with the completed trace; use Previous and Next manually.'}</p>
      <div className="context-path">
        <div className="context-outside"><h3>Outside the request</h3><div className="context-source"><strong>Fixed model parameters</strong><p>Learned numbers used by the model, not request text; this trace does not update them.</p></div><div className="context-source"><strong>Stored note</strong><p>“{STORED_NOTE}”</p><span>{includeNote ? 'Copied into context ↓' : 'Not inserted · stays outside'}</span></div><div className="context-source"><strong>Document collection</strong><p>“{PASSAGE}”</p><span>{findPassage ? 'Passage found and inserted ↓' : 'No passage found · none inserted'}</span></div></div>
        <div className="context-direction" aria-hidden="true">→</div>
        <div className="context-boundary"><h3>{step === 1 && trace.requested ? 'Draft for the next request' : step >= 2 && trace.executed ? 'Next generation’s input' : 'First generation’s input'}</h3><p className="context-subtitle">Exact messages inside the request boundary</p><ol>{trace.messages.map((message, i) => <li key={message.source}><span>{message.source} · 1 unit</span><p>{message.text}</p>{step === 1 && i === trace.messages.length - 1 && trace.requested && <small>Authored output from first generation; retained for the next request.</small>}</li>)}</ol><div className={`context-budget${trace.overflow ? ' is-overflow' : ''}`}><strong>{trace.inputUnits} message units + {options.reserve} reserved output unit = {trace.totalUnits} / {window}</strong><span>{step === 1 && trace.requested ? 'Draft count; the tool result is not here yet.' : trace.overflow ? 'Over budget: generation stops. Nothing is silently dropped.' : 'Fits the teaching window.'}</span></div></div>
      </div>
      <div className="context-tool"><div className={`context-tool-step${trace.requested ? ' is-active' : ''}`}><span>1 · Model → application</span><strong>Request a tool</strong><p>{trace.requested ? TOOL_REQUEST : 'Not requested yet.'}</p><small>Authored trace: a request is not execution.</small></div><div className="context-tool-arrow" aria-hidden="true">→</div><div className={`context-tool-step${trace.executed ? ' is-active' : ''}`}><span>2 · Application → tool</span><strong>Execute local fixture</strong><p>{trace.executed ? TOOL_RESULT : 'Not executed yet.'}</p><small>{trace.executed ? 'Result appended for the next request.' : 'No result until the application runs the tool.'}</small></div><div className="context-tool-arrow" aria-hidden="true">→</div><div className={`context-tool-step${trace.complete ? ' is-active' : ''}`}><span>3 · Next generation</span><strong>Authored response preview</strong><p>{trace.complete ? 'The illustrative North branch closes at 8 PM on Thursday.' : trace.overflow ? 'Stopped: request does not fit.' : 'Not reached yet.'}</p><small>No response is generated by a model here.</small></div></div>
      <p className="context-explainer"><strong>Counting this example:</strong> one teaching unit is one whole message, including its role and text; this is not a real tokenizer or a real model limit. One unit is reserved for output. Real systems count model-specific tokens, including tool descriptions and other input, and may also count reasoning. A missing retrieved passage means only that no passage was found—not that the library has no hours or that a tool ran. Retrieved or tool information can be stale or wrong; verify important details.</p>
    </section>
  </article>
}
