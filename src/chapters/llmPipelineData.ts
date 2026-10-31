import { DECODER_CONTEXT_LIMIT, DECODER_VOCABULARY } from './llmEmbeddingsData'
import { transformerBlock } from './llmBlock'
import { lastDecoderDistribution } from './llmLogitsData'
import { categoricalIndex, greedyIndex, nextSeededDraw, temperatureDistribution } from './llmSamplingData'

// This strict longest-match decoder vocabulary is independent of 99.2's tokenizer.
// The literal end marker is never accepted as prompt text.
const ordinary = DECODER_VOCABULARY.filter(item => item.id !== 4)
export function encodeDecoder(text: string): number[] {
  if (!text) throw new RangeError('Prompt must not be empty')
  const ids: number[] = []
  for (let offset = 0; offset < text.length;) {
    const match = ordinary.filter(item => text.startsWith(item.token, offset)).sort((a, b) => b.token.length - a.token.length)[0]
    if (!match) throw new RangeError('Unsupported prompt text')
    ids.push(match.id); offset += match.token.length
  }
  if (ids.length > DECODER_CONTEXT_LIMIT) throw new RangeError('Prompt exceeds context limit')
  return ids
}
export function decodeDecoder(ids: readonly number[]): string {
  return ids.map(id => {
    const item = ordinary.find(entry => entry.id === id)
    if (!item) throw new RangeError('Expected ordinary decoder IDs')
    return item.token
  }).join('')
}
export type PipelineOptions = { mode: 'sample' | 'greedy'; temperature: number; seed: number; maxNewTokens: number }
export function generateDecoder(prompt: string, options: PipelineOptions) {
  const ids = encodeDecoder(prompt)
  if (options.mode !== 'sample' && options.mode !== 'greedy') throw new RangeError('Invalid selection mode')
  if (!Number.isInteger(options.maxNewTokens) || options.maxNewTokens < 1 || options.maxNewTokens > 4) throw new RangeError('Length cap must be 1–4')
  // Validate seed and temperature even when greedy is selected.
  nextSeededDraw(options.seed)
  temperatureDistribution([0], options.temperature)
  let state = options.seed
  let context = ids
  let reason: 'end' | 'length-cap' | 'context-cap' = 'length-cap'
  const steps = []
  for (let i = 0; i < options.maxNewTokens; i++) {
    const before = [...context]
    const block = transformerBlock(before)
    const distribution = lastDecoderDistribution(before)
    const { scaled, probabilities } = temperatureDistribution(distribution.logits, options.temperature)
    const random = options.mode === 'sample' ? nextSeededDraw(state) : null
    if (random) state = random.state
    const selected = random ? categoricalIndex(probabilities, random.draw) : greedyIndex(distribution.logits)
    // End is recorded but never appended. A non-end token is retained even if
    // it exceeds the four-token input limit; no further forward pass is run.
    context = selected === 4 ? before : [...before, selected]
    steps.push({ before, block, ...distribution, scaled, probabilities, draw: random?.draw ?? null, selected, after: [...context] })
    if (selected === 4) { reason = 'end'; break }
    if (context.length > DECODER_CONTEXT_LIMIT) { reason = 'context-cap'; break }
    if (i === options.maxNewTokens - 1) { reason = 'length-cap'; break }
  }
  return { promptIds: ids, steps, context, text: decodeDecoder(context), reason, finalSeed: state }
}
