import { describe, expect, it } from 'vitest'
import { decodeDecoder, encodeDecoder, generateDecoder } from './llmPipeline'
import { transformerBlock } from './llmBlock'
import { lastDecoderDistribution } from './llmLogits'

const sample = { mode: 'sample', seed: 168, temperature: 1, maxNewTokens: 4 } as const
describe('complete decoder pipeline', () => {
  it('encodes and decodes the separate strict decoder vocabulary', () => {
    expect(encodeDecoder('The cat sat.')).toEqual([0, 1, 2, 3])
    expect(decodeDecoder([0, 1, 2, 3])).toBe('The cat sat.')
    for (const text of ['', 'cat', 'The<end>', 'The cat sat.The']) expect(() => encodeDecoder(text)).toThrow()
    for (const ids of [[4], [-1], [99], [1.5]]) expect(() => decodeDecoder(ids)).toThrow()
  })
  it('replays the complete sampled trace, ends without feeding end back', () => {
    const trace = generateDecoder('The', sample)
    expect(trace.steps.map(s => s.selected)).toEqual([1, 2, 3, 4])
    expect(trace.steps.map(s => s.before)).toEqual([[0], [0, 1], [0, 1, 2], [0, 1, 2, 3]])
    ;[0.3011767806, 0.5167994560, 0.8505235130, 0.8866163706].forEach((x, i) => expect(trace.steps[i].draw).toBeCloseTo(x, 9))
    expect(trace.text).toBe('The cat sat.'); expect(trace.reason).toBe('end')
    expect(trace.context).toEqual([0, 1, 2, 3])
    expect(generateDecoder('The', sample)).toEqual(trace)
    const step = trace.steps[2]
    expect(step.block).toEqual(transformerBlock(step.before))
    expect(step.logits).toEqual(lastDecoderDistribution(step.before).logits)
    expect(step.hidden).toEqual(step.block.rows[2].norm2.output)
    expect(step.probabilities.reduce((a, b) => a + b, 0)).toBeCloseTo(1, 14)
  })
  it('distinguishes length and context stops while retaining generated text', () => {
    const options = { ...sample, mode: 'greedy' as const, maxNewTokens: 2 }
    const trace = generateDecoder('The', options)
    expect(trace.steps.map(s => s.selected)).toEqual([1, 1])
    expect(trace.text).toBe('The cat cat'); expect(trace.reason).toBe('length-cap')
    const full = generateDecoder('The cat cat cat', options)
    expect(full.reason).toBe('context-cap')
    expect(full.steps).toHaveLength(1)
    expect(full.steps[0].before).toHaveLength(4)
    expect(full.context).toHaveLength(5)
    expect(full.text).toBe(decodeDecoder(full.context))
  })
  it('guards option domains and overlong prompts', () => {
    expect(() => generateDecoder('The', { ...sample, mode: 'invalid' as 'sample' })).toThrow()
    for (const cap of [0, 5, 1.5]) expect(() => generateDecoder('The', { ...sample, maxNewTokens: cap })).toThrow()
    for (const temperature of [0, -1, NaN, Infinity]) expect(() => generateDecoder('The', { ...sample, temperature })).toThrow()
    for (const seed of [-1, 1.5, Infinity]) expect(() => generateDecoder('The', { ...sample, seed })).toThrow()
    expect(() => generateDecoder('The cat sat.The', sample)).toThrow()
  })
})
