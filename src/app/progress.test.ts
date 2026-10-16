import { afterEach, describe, expect, it, vi } from 'vitest'
import { readCompletion, saveCompletion } from './progress'

afterEach(() => vi.unstubAllGlobals())

describe('chapter completion persistence', () => {
  it('starts fresh and restores a completed chapter', () => {
    const entries = new Map<string, string>()
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => entries.get(key) ?? null,
      setItem: (key: string, value: string) => entries.set(key, value),
    })
    expect(readCompletion()).toBe(false)
    expect(saveCompletion()).toBe(true)
    expect(readCompletion()).toBe(true)
  })

  it.each(['broken json', 'null', 'true', '{"version":2,"chapter01":true}', '{"version":1,"chapter01":"true"}'])(
    'recovers safely from an invalid or incompatible stored value: %s', (saved) => {
      vi.stubGlobal('localStorage', { getItem: () => saved })
      expect(readCompletion()).toBe(false)
    },
  )

  it('keeps learning usable when browser storage is denied', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => { throw new Error('Storage denied') },
      setItem: () => { throw new Error('Storage denied') },
    })
    expect(readCompletion()).toBe(false)
    expect(saveCompletion()).toBe(false)
  })
})
