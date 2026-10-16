import { describe, expect, it } from 'vitest'
import { observationProfile } from './observationData'

describe('fixed follow-up window', () => {
  it('keeps incomplete observation distinct from a negative outcome', () => {
    const early = observationProfile(14)
    expect(early.outcomes.filter(row => row.observed)).toHaveLength(3)
    expect(early.outcomes.find(row => row.id === 'C6')).toMatchObject({ followup: 0, observed: false })
    expect(early.rate).toBeNull()
    expect(early.eligible).toHaveLength(0)
  })
  it('includes events and eligibility exactly on their boundaries', () => {
    expect(observationProfile(19).outcomes.find(row => row.id === 'C4')?.observed).toBe(false)
    expect(observationProfile(20).outcomes.find(row => row.id === 'C4')?.observed).toBe(true)
    expect(observationProfile(29).rate).toBeNull()
    expect(observationProfile(30).eligible.map(row => row.id)).toEqual(['C1'])
    expect(observationProfile(30).rate).toBe(1)
  })
  it('keeps a fully followed customer without a return in the denominator', () => {
    const mature = observationProfile(50)
    expect(mature.eligible).toHaveLength(6)
    expect(mature.withinThirty).toBe(5)
    expect(mature.rate).toBeCloseTo(5 / 6)
    expect(mature.outcomes.find(row => row.id === 'C5')).toMatchObject({ observed: false, followup: 39 })
  })
})
