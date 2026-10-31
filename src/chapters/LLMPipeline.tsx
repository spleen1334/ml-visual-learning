import { useEffect, useState } from 'react'
import { PlaybackButton } from '../components/PlaybackButton'
import { DECODER_PARAMETERS, DECODER_VOCABULARY, embeddingFor, positionFor } from './llmEmbeddingsData'
import { decodeDecoder, generateDecoder } from './llmPipelineData'
import './LargeLanguageModels.css'
import './LLMPipeline.css'

const stages = ['Text', 'Token IDs', 'Embedding + position', 'Causal block', 'Logits', 'Probabilities', 'Select token', 'Update context']
const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const fmt = (n: number) => n.toFixed(4)
const vec = (row: readonly number[]) => `[ ${row.map(fmt).join(', ')} ]`
const label = (id: number) => DECODER_VOCABULARY[id].token.replace(/^ /, '␠')
const sampled = generateDecoder('The', { mode: 'sample', seed: 168, temperature: 1, maxNewTokens: 4 })
const greedy = generateDecoder('The', { mode: 'greedy', seed: 168, temperature: 1, maxNewTokens: 2 })

export function LLMPipeline() {
  const [mode, setMode] = useState<'sample' | 'greedy'>('sample')
  const trace = mode === 'sample' ? sampled : greedy
  const max = trace.steps.length * stages.length - 1
  const [cursor, setCursor] = useState(() => reduced() ? sampled.steps.length * stages.length - 1 : 0)
  const [playing, setPlaying] = useState(false)
  const [reduce, setReduce] = useState(reduced)
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => { setReduce(media.matches); if (media.matches) { setPlaying(false); setCursor(max) } }
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [max])
  useEffect(() => {
    if (!playing || reduce) return
    if (cursor >= max) { setPlaying(false); return }
    const timer = window.setTimeout(() => setCursor(value => value + 1), 1100)
    return () => window.clearTimeout(timer)
  }, [playing, reduce, cursor, max])
  const tokenIndex = Math.floor(cursor / stages.length)
  const stage = cursor % stages.length
  const current = trace.steps[tokenIndex]
  const rowIndex = current.before.length - 1
  const row = current.block.rows[rowIndex]
  const ending = trace.reason === 'end' ? 'End token selected; it is not added to text or fed back.' : trace.reason === 'length-cap' ? 'Stopped at the chosen new-token limit.' : 'Stopped at the four-token input limit; the selected token remains in the displayed text.'
  return <article className="llm-lesson pipeline-lesson">
    <header className="llm-header"><p className="llm-eyebrow">99.14 · Large Language Models</p><h1>The full LLM pipeline</h1><p className="llm-definition"><strong>Generation repeats a path from context to a next token</strong>, then uses the updated context for the next step.</p><p>Trace the same tiny decoder from text through its supplied block and back to text.</p></header>
    <section className="llm-demo pipeline-demo" aria-labelledby="pipeline-title"><div className="llm-demo-heading"><h2 id="pipeline-title">Follow the complete loop</h2><p>Prompt: The · decoder context limit: 4 tokens</p></div>
      <fieldset className="pipeline-choice"><legend>Choose how to select a token</legend><label><input type="radio" name="pipeline-mode" checked={mode === 'sample'} onChange={() => { setPlaying(false); setMode('sample'); setCursor(reduce ? sampled.steps.length * stages.length - 1 : 0) }} /> Seeded sample · seed 168 · cap 4</label><label><input type="radio" name="pipeline-mode" checked={mode === 'greedy'} onChange={() => { setPlaying(false); setMode('greedy'); setCursor(reduce ? greedy.steps.length * stages.length - 1 : 0) }} /> Greedy · cap 2</label><p>Both use temperature 1. Greedy picks the maximum; ties within 10⁻¹² use vocabulary order.</p></fieldset>
      <div className="pipeline-map" aria-label="Full generation pipeline">{stages.map((name, i) => <div className="pipeline-map-item" key={name}><button type="button" className={stage === i ? 'is-active' : ''} aria-current={stage === i ? 'step' : undefined} onClick={() => { setPlaying(false); setCursor(tokenIndex * stages.length + i) }}><span>{i + 1}</span>{name}</button>{i < stages.length - 1 && <b aria-hidden="true">→</b>}</div>)}</div><p className="pipeline-loop">↶ Updated context returns to the beginning unless a stop condition is reached.</p>
      <div className="pipeline-trace"><div className="pipeline-trace-heading"><h3>{stage + 1} · {stages[stage]}</h3><span>Token choice {tokenIndex + 1} of {trace.steps.length}</span></div>
        {stage === 0 && <><p>Current supported text</p><strong className="pipeline-large">{decodeDecoder(current.before)}</strong><p>The decoder uses its own tiny vocabulary, separate from 99.2. Only supported pieces are accepted.</p></>}
        {stage === 1 && <><p>Each piece maps to a label, not a numerical meaning.</p><strong className="pipeline-large">{current.before.map(id => label(id)).join(' · ')} → [{current.before.join(', ')}]</strong><p>␠ means a leading space. Literal &lt;end&gt; is not prompt text.</p></>}
        {stage === 2 && <><p>Each ID selects a width-4 embedding; its width-4 position row is added. Result shape: {current.before.length} × 4.</p><table><thead><tr><th>Position · token</th><th>Embedding</th><th>Position row</th><th>Sum</th></tr></thead><tbody>{current.block.attention.inputs.map((input, i) => <tr key={i}><th scope="row">{i} · {label(current.before[i])}</th><td><code>{vec(embeddingFor(current.before[i]))}</code></td><td><code>{vec(positionFor(i))}</code></td><td><code>{vec(input)}</code></td></tr>)}</tbody></table></>}
        {stage === 3 && <><p>Two causal heads mix values from this position and earlier positions. The projected width-4 result enters two residual additions and post-addition normalizations.</p><p>Selected position {rowIndex} · <strong>{label(current.before[rowIndex])}</strong></p><p>Input: <code>{vec(row.input)}</code> → attention projection: <code>{vec(row.attentionOutput)}</code> → block output: <code>{vec(row.norm2.output)}</code></p><details><summary>Inspect heads, mask and block rows</summary>{current.block.attention.heads.map((head, h) => <div key={h}><h4>Head {h + 1} · Q/K/V width 2</h4><p>Q {vec(head.queries[rowIndex])} · K rows {head.keys.map(vec).join(' · ')} · V rows {head.values.map(vec).join(' · ')}</p><p>Mask: keys at positions after {rowIndex} are blocked; weights {vec(head.rows[rowIndex].weights)} · mixture {vec(head.rows[rowIndex].output)}</p></div>)}<p>Concatenated heads: {vec(current.block.attention.combined[rowIndex].concatenated)}</p><p>Residual 1: {vec(row.residual1)} · normalization 1: {vec(row.norm1.output)}</p><p>FF pre-ReLU · 8: {vec(row.hidden)} · ReLU · 8: {vec(row.activated)}</p><p>FF output · 4: {vec(row.ffOutput)} · residual 2: {vec(row.residual2)} · normalization 2: {vec(row.norm2.output)}</p><p>Post-residual normalization uses per-row population variance and ε = 0.00001. No extra final normalization.</p><details><summary>Inspect supplied head and feed-forward weights</summary>{DECODER_PARAMETERS.attention.heads.map((head, i) => <div key={i}><h4>Head {i + 1} · input × output</h4><p>Q: {head.query.map(vec).join(' · ')}</p><p>K: {head.key.map(vec).join(' · ')}</p><p>V: {head.value.map(vec).join(' · ')}</p></div>)}<p>Attention output 4 × 4: {DECODER_PARAMETERS.attention.output.map(vec).join(' · ')}</p><p>FF input 4 × 8: {DECODER_PARAMETERS.feedForward.input.map(vec).join(' · ')}</p><p>FF output 8 × 4: {DECODER_PARAMETERS.feedForward.output.map(vec).join(' · ')}</p><p>All projection biases are zero.</p></details></details></>}
        {stage === 4 && <><p>Last hidden row · width 4: <code>{vec(current.hidden)}</code>. A supplied 4 × 5 projection gives one unnormalized score per vocabulary token.</p><table><thead><tr><th>Token</th><th>Logit</th></tr></thead><tbody>{current.logits.map((value, i) => <tr key={i}><th scope="row">{label(i)}</th><td>{fmt(value)}</td></tr>)}</tbody></table><details><summary>Inspect 4 × 5 logits weights</summary><p>Input rows × vocabulary columns: {DECODER_PARAMETERS.logits.projection.map(vec).join(' · ')}; zero bias.</p></details></>}
        {stage === 5 && <><p>Temperature 1 divides the scores; softmax converts them to probabilities. The five values sum to 1 before rounding.</p><table><thead><tr><th>Token</th><th>Probability</th></tr></thead><tbody>{current.probabilities.map((value, i) => <tr key={i}><th scope="row">{label(i)}</th><td>{(100 * value).toFixed(2)}%</td></tr>)}</tbody></table></>}
        {stage === 6 && <><p>{current.draw === null ? 'Greedy selects the highest score, resolving ties by vocabulary order.' : `The seeded draw ${current.draw.toFixed(6)} selects an interval from the probability distribution.`}</p><strong className="pipeline-large">Selected: {label(current.selected)} · ID {current.selected}</strong></>}
        {stage === 7 && <><p>{current.selected === 4 ? 'The special end token stops generation and adds no text.' : 'Append the selected ordinary token to the context.'}</p><strong className="pipeline-large">{decodeDecoder(current.after)}</strong><p>IDs: [{current.after.join(', ')}]</p>{tokenIndex === trace.steps.length - 1 && <p className="pipeline-stop"><strong>Stop:</strong> {ending}</p>}</>}
      </div>
      <div className="llm-playback" role="group" aria-label="Pipeline playback"><PlaybackButton action="previous" label="Previous pipeline stage" disabled={cursor === 0} onClick={() => { setPlaying(false); setCursor(cursor - 1) }} /><PlaybackButton action={playing ? 'pause' : cursor === max ? 'replay' : 'play'} label={reduce ? 'Autoplay disabled: reduced motion is preferred' : playing ? 'Pause pipeline' : cursor === max ? 'Replay pipeline' : 'Play pipeline'} disabled={reduce} aria-pressed={playing} onClick={() => { if (cursor === max) setCursor(0); setPlaying(!playing) }} /><PlaybackButton action="next" label="Next pipeline stage" disabled={cursor === max} onClick={() => { setPlaying(false); setCursor(cursor + 1) }} /><span role="status">Stage {stage + 1} of {stages.length} · token {tokenIndex + 1} of {trace.steps.length}{reduce ? ' · Reduced motion: use Previous and Next.' : ''}</span></div>
      <div className="pipeline-token-select" role="group" aria-label="Choose token choice">{trace.steps.map((s, i) => <button type="button" key={i} aria-pressed={i === tokenIndex} onClick={() => { setPlaying(false); setCursor(i * stages.length + stage) }}>Choice {i + 1}: {label(s.selected)}</button>)}</div>
      <p className="pipeline-boundary">Input positions are never silently shifted or discarded. If a non-end token is chosen from a four-token input, it remains in the output and generation stops before another forward pass. Displayed numbers are rounded; calculation uses full precision.</p>
    </section>
    <section className="pipeline-outside"><h2>Outside this inference loop</h2><p><strong>Parameters</strong> are fixed supplied numbers here; this toy was not trained. The genuinely trained classifier in 99.10 and the authored probability tree in 99.1 are separate demonstrations.</p><p><strong>Training</strong> changes parameters beforehand. <strong>Retrieval</strong> can add passages to context; an application may execute <strong>tools</strong> and put their results in context. Neither is performed by this toy loop.</p><p><strong>Common use cases:</strong> drafting text, summarizing a document, or answering questions from supplied material. Start with the task, choose what context it needs, then check the output against evidence and task-specific evaluation cases.</p><p><strong>Note:</strong> this tiny decoder teaches the calculation path, not those real-world abilities. Add retrieval when outside evidence is needed and tools when an external operation is needed; neither is required for every request.</p></section>
  </article>
}
