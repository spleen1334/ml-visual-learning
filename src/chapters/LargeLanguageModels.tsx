import { useEffect, useState } from 'react'
import { PlaybackButton } from '../components/PlaybackButton'
import { appendToken, completeMostLikelyPath, generatedText, LLM_PROMPT, LLM_STOP_TOKEN, mostLikelyToken, nextTokenState } from './llmNextToken'
import './LargeLanguageModels.css'

const prefersReducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function LLMNextToken() {
  const [reducedMotion, setReducedMotion] = useState(prefersReducedMotion)
  const [tokens, setTokens] = useState<string[]>(() => prefersReducedMotion() ? completeMostLikelyPath() : [])
  const [playing, setPlaying] = useState(false)
  const state = nextTokenState(tokens)
  // Retain the final distribution after the stop token has been selected.
  const choices = state.complete ? nextTokenState(tokens.slice(0, -1)).choices : state.choices

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => {
      setReducedMotion(preference.matches)
      if (preference.matches) {
        setPlaying(false)
        setTokens(completeMostLikelyPath())
      }
    }
    preference.addEventListener('change', update)
    return () => preference.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!playing || reducedMotion) return
    if (state.complete) { setPlaying(false); return }
    const timer = window.setTimeout(() => {
      setTokens(current => {
        const token = mostLikelyToken(current)
        return token === undefined ? current : appendToken(current, token)
      })
    }, 1800)
    return () => window.clearTimeout(timer)
  }, [playing, reducedMotion, state.complete, tokens])

  function choose(token: string) {
    setPlaying(false)
    setTokens(current => appendToken(current, token))
  }

  function next() {
    const token = mostLikelyToken(tokens)
    if (token !== undefined) choose(token)
  }

  const playLabel = reducedMotion ? 'Autoplay disabled: reduced motion is preferred' : playing ? 'Pause token generation' : state.complete ? 'Replay token generation' : 'Autoplay: choose the most likely token each time'

  return <article className="llm-lesson">
    <header className="llm-header">
      <p className="llm-eyebrow">99.1 · Large Language Models</p>
      <h1>What does an LLM predict?</h1>
      <p className="llm-definition">A text-generating LLM <strong>predicts the next token</strong> from the tokens already in its context.</p>
      <p>It assigns probabilities to possible next tokens. Choose one, append it to the text, and repeat.</p>
    </header>

    <section className="llm-demo" aria-labelledby="llm-demo-title">
      <div className="llm-demo-heading">
        <h2 id="llm-demo-title">One token at a time</h2>
        <p>Illustrative, hand-chosen probabilities · no trained model</p>
      </div>
      <ol className="llm-loop" aria-label="Generation loop">
        <li><span>1</span>Read the context</li><li aria-hidden="true">→</li>
        <li><span>2</span>Choose a next token</li><li aria-hidden="true">→</li>
        <li><span>3</span>Append it and repeat <span aria-hidden="true">↺</span></li>
      </ol>

      <div className="llm-context">
        <div className="llm-context-label"><strong>Current context</strong><span>Prompt + appended tokens</span></div>
        <p className="llm-text" aria-label={`Current text: ${generatedText(tokens)}`}><span className="llm-prompt">{LLM_PROMPT}</span>{tokens.filter(token => token !== LLM_STOP_TOKEN).map((token, index) => <span className="llm-token" key={index}>{token}</span>)}{state.complete && <span className="llm-end">&lt;end&gt;</span>}</p>
      </div>

      <figure className="llm-distribution">
        <figcaption><strong>{state.complete ? 'The stop token ends generation' : 'Probability of the next token'}</strong><span>{state.complete ? 'No more tokens are appended.' : 'Click any bar to append that token. Notice how the choices change.'}</span></figcaption>
        <div className="llm-chart-axis" aria-hidden="true"><span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span></div>
        <div className="llm-chart" role="group" aria-label="Next-token probabilities">
          {choices.map(choice => <button className={`llm-bar-row${state.complete ? ' is-complete' : ''}`} key={choice.token} type="button" disabled={state.complete} onClick={() => choose(choice.token)} aria-label={`Append ${choice.token === LLM_STOP_TOKEN ? 'end of text' : choice.token.trim()}, ${Math.round(choice.probability * 100)} percent probability`}>
            <span className="llm-bar-label">{choice.token === LLM_STOP_TOKEN ? '<end>' : choice.token.trim()}</span>
            <span className="llm-bar-track"><span className="llm-bar" style={{ width: `${choice.probability * 100}%` }} /></span>
            <strong>{Math.round(choice.probability * 100)}%</strong>
          </button>)}
        </div>
        <p className="llm-chart-note">These are all the choices in this tiny example; their probabilities add up to 100%. A real model has a much larger token vocabulary.</p>
      </figure>

      <div className="llm-playback" role="group" aria-label="Token generation playback">
        <PlaybackButton action="previous" label="Previous token: undo the last choice" disabled={!tokens.length} onClick={() => { setPlaying(false); setTokens(tokens.slice(0, -1)) }} />
        <PlaybackButton action={playing ? 'pause' : state.complete ? 'replay' : 'play'} label={playLabel} disabled={reducedMotion} aria-pressed={playing} onClick={() => { if (state.complete) setTokens([]); setPlaying(!playing) }} />
        <PlaybackButton action="next" label="Next token: append the most likely choice" disabled={state.complete} onClick={next} />
        <PlaybackButton action="replay" label="Reset to the original prompt" disabled={!tokens.length && !playing} onClick={() => { setPlaying(false); setTokens([]) }} />
        <span role="status" aria-live="polite">{state.complete ? 'Finished: the stop token was selected.' : tokens.length ? `${tokens.length} token${tokens.length === 1 ? '' : 's'} appended. Choose the next one.` : 'Start with the prompt. Choose a token below it.'}</span>
      </div>
      <p className="llm-playback-note">Play and Next choose the most likely token. To explore an alternative, go back and click another bar.{reducedMotion ? ' Reduced motion: the completed example is shown first; use Previous or Reset to explore manually.' : ''}</p>
    </section>

    <div className="llm-clarifications">
      <p><strong>A token is a piece of text.</strong> It can be a word, part of a word, punctuation, or a special marker such as <code>&lt;end&gt;</code>. Here, word tokens include their preceding space.</p>
      <p><strong>Generating is inference.</strong> The context changes as tokens are added. The model’s learned numbers, its <em>parameters</em>, normally stay fixed during generation; training is what changes them.</p>
    </div>
  </article>
}
