import { describe, expect, it } from 'vitest'
import { assembleContext, PASSAGE, STORED_NOTE, TOOL_REQUEST, TOOL_RESULT, USER_MESSAGE } from './llmContextData'

const defaults = { includeNote: true, findPassage: true, window: 6, reserve: 1 }
describe('context assembly teaching trace', () => {
  it('assembles only the selected input and exact messages', () => {
    expect(assembleContext(defaults, 0).messages.map(m => m.text)).toEqual([USER_MESSAGE, STORED_NOTE, PASSAGE])
    expect(assembleContext({ ...defaults, includeNote: false, findPassage: false }, 0).messages.map(m => m.text)).toEqual([USER_MESSAGE])
  })
  it('distinguishes a missing retrieval from tool execution', () => {
    const missing = { ...defaults, findPassage: false }
    const request = assembleContext(missing, 1)
    expect(request.requested).toBe(true); expect(request.executed).toBe(false)
    expect(request.messages.map(m => m.text)).toEqual([USER_MESSAGE, STORED_NOTE, TOOL_REQUEST])
    const result = assembleContext(missing, 2)
    expect(result.executed).toBe(true); expect(result.messages.at(-1)?.text).toBe(TOOL_RESULT)
    expect(assembleContext(missing, 3).complete).toBe(true)
  })
  it('reserves output and stops before generation on overflow, without dropping messages', () => {
    const first = assembleContext({ ...defaults, window: 3 }, 3)
    expect(first.overflow).toBe(true); expect(first.requested).toBe(false); expect(first.messages).toHaveLength(3)
    const second = assembleContext({ ...defaults, window: 4 }, 3)
    expect(second.executed).toBe(true); expect(second.totalUnits).toBe(6)
    expect(second.overflow).toBe(true); expect(second.complete).toBe(false)
    expect(assembleContext(defaults, 3).totalUnits).toBe(6)
    expect(assembleContext(defaults, 3).complete).toBe(true)
  })
  it('rejects invalid budgets and steps', () => {
    expect(() => assembleContext({ ...defaults, window: 0 }, 0)).toThrow()
    expect(() => assembleContext({ ...defaults, reserve: -1 }, 0)).toThrow()
    expect(() => assembleContext({ ...defaults, reserve: 0.5 }, 0)).toThrow()
    expect(() => assembleContext(defaults, 4)).toThrow()
  })
})
