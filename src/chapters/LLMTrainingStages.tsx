import { useEffect, useState } from 'react'
import { PlaybackButton } from '../components/PlaybackButton'
import './LargeLanguageModels.css'
import './LLMTrainingStages.css'

const prefersReducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const stages = ['Pretraining', 'Instruction tuning', 'Preference tuning']

export function LLMTrainingStages() {
  const [motion, setMotion] = useState(prefersReducedMotion)
  const [stage, setStage] = useState(() => prefersReducedMotion() ? 2 : 0)
  const [playing, setPlaying] = useState(false)
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const change = () => { setMotion(media.matches); if (media.matches) { setPlaying(false); setStage(2) } }
    media.addEventListener('change', change)
    return () => media.removeEventListener('change', change)
  }, [])
  useEffect(() => {
    if (!playing || motion) return
    if (stage === 2) { setPlaying(false); return }
    const timer = window.setTimeout(() => setStage(s => s + 1), 2200)
    return () => window.clearTimeout(timer)
  }, [playing, motion, stage])
  const select = (index: number) => { setPlaying(false); setStage(index) }

  return <article className="llm-lesson">
    <header className="llm-header">
      <p className="llm-eyebrow">99.11 · Large Language Models</p>
      <h1>Pretraining, instructions, and preferences</h1>
      <p className="llm-definition"><strong>Different training data and objectives</strong> shape different aspects of a language model’s behavior.</p>
      <p>Follow one topic through common approaches. The examples illustrate the process; this page does not train a model.</p>
    </header>
    <section className="llm-demo stages-demo" aria-labelledby="stages-title">
      <div className="llm-demo-heading"><h2 id="stages-title">From text to preferred responses</h2><p>One possible path · not a universal recipe</p></div>
      <div className="llm-playback" role="group" aria-label="Training stages playback">
        <PlaybackButton action="previous" label="Previous training stage" disabled={stage === 0} onClick={() => select(stage - 1)} />
        <PlaybackButton action={playing ? 'pause' : stage === 2 ? 'replay' : 'play'} label={motion ? 'Autoplay disabled for reduced motion' : playing ? 'Pause stage highlights' : stage === 2 ? 'Replay stage highlights' : 'Play stage highlights'} disabled={motion} onClick={() => { if (stage === 2) setStage(0); setPlaying(!playing) }} />
        <PlaybackButton action="next" label="Next training stage" disabled={stage === 2} onClick={() => select(stage + 1)} />
        <span role="status">Highlight: {stages[stage]} · {stage + 1} of 3</span>
      </div>
      <p className="llm-playback-note">Use Previous and Next to follow the path; all stages stay visible. {motion && 'Reduced motion starts at the final stage; explore manually.'}</p>
      <div className="stages-path">
        <section className={`stage-row${stage === 0 ? ' is-selected' : ''}`} aria-labelledby="stage-pretrain">
          <div className="stage-label"><span className="stage-number">01</span><h3 id="stage-pretrain">Pretraining</h3><p>Build broad text patterns</p></div>
          <div className="stage-content"><p className="stage-kicker">Data · ordinary text</p><div className="stage-paper"><span className="stage-small-label">One training text</span><p>The sky looks <mark>blue</mark> because air scatters sunlight.</p><span className="stage-target">↑ target after “The sky looks”</span></div><p><strong>Objective:</strong> predict the next token from earlier text. Repeating this across many texts can build broad language patterns. The highlighted word is one illustrative token; real tokenization varies.</p></div>
        </section>
        <div className="stage-connector" aria-hidden="true"><span>↓</span></div>
        <section className={`stage-row${stage === 1 ? ' is-selected' : ''}`} aria-labelledby="stage-sft">
          <div className="stage-label"><span className="stage-number">02</span><h3 id="stage-sft">Instruction tuning</h3><p>Learn from desired responses</p></div>
          <div className="stage-content"><p className="stage-kicker">Data · prompt + demonstration</p><div className="stage-conversation"><div><span className="stage-small-label">Prompt</span><p>Explain why the sky looks blue in one sentence.</p></div><div><span className="stage-small-label">Desired response</span><p>Air molecules scatter blue light more than red light.</p></div></div><p><strong>Objective:</strong> supervised fine-tuning (SFT) teaches the model to predict the demonstrated response token by token. Often the loss is applied only to response tokens, not the prompt; configurations vary.</p></div>
        </section>
        <div className="stage-connector" aria-hidden="true"><span>↓</span></div>
        <section className={`stage-row${stage === 2 ? ' is-selected' : ''}`} aria-labelledby="stage-preference">
          <div className="stage-label"><span className="stage-number">03</span><h3 id="stage-preference">Preference tuning</h3><p>Learn from comparisons</p></div>
          <div className="stage-content"><p className="stage-kicker">Data · same prompt + labeled response pair</p><div className="stage-pair"><div><span className="stage-choice preferred">✓ Preferred</span><p>Air molecules scatter more blue light toward us than red light.</p></div><div><span className="stage-choice rejected">× Rejected · inaccurate</span><p>The sky is blue because it reflects the ocean.</p></div></div><p><strong>Objective:</strong> use comparison labels to favor responses like the preferred one over rejected ones. These are two alternative approaches, not consecutive steps:</p>
            <div className="stage-branches"><div><span className="stage-branch-arrow" aria-hidden="true">↙</span><h4>Reward model → reinforcement learning</h4><p>Fit a separate reward model to predict preferences, then use its scores to update the language model. PPO (proximal policy optimization) is one reinforcement-learning method for that update.</p></div><div><span className="stage-branch-arrow" aria-hidden="true">↘</span><h4>Direct preference optimization (DPO)</h4><p>Use the labeled pairs directly to update the language model, without a separately fitted reward model or reinforcement-learning loop.</p></div></div>
          </div>
        </section>
      </div>
      <p className="stage-caution"><strong>Preference is not fact-checking.</strong> A model can still make up facts or get things wrong; this example pair does not prove it has learned the truth. Check important claims against reliable sources.</p>
    </section>
  </article>
}
