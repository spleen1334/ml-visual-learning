import { describe, expect, it } from 'vitest'
import { treeWorkbookCustomers, treeWorkbookDefaults } from './treeWorkbookData'
import {
  splitTreeGroup, summarizeTreeGroup, treeEntropy, treeInformationGain, treeWorkbookFeatures,
} from './treeWorkbookMath'

describe('Decision Trees workbook reproduction', () => {
  it('preserves all 50 source IDs and binary worksheet fields', () => {
    expect(treeWorkbookCustomers).toHaveLength(50)
    expect(treeWorkbookCustomers.map(customer => customer.id)).toEqual(Array.from({ length: 50 }, (_, index) => index + 1))
    for (const customer of treeWorkbookCustomers) {
      expect([customer.newsletter, customer.follow, customer.sessionsOver10, customer.subscribe].every(value => value === 0 || value === 1)).toBe(true)
    }
    expect(treeWorkbookCustomers.filter(customer => customer.subscribe === 1)).toHaveLength(26)
    expect(treeWorkbookCustomers.filter(customer => customer.subscribe === 0)).toHaveLength(24)
  })

  it('retains the saved split selections and cached root entropy', () => {
    expect(treeWorkbookDefaults).toEqual({ rootSplit: 'newsletter', secondSplitA: 'follow', secondSplitB: null })
    const root = summarizeTreeGroup(treeWorkbookCustomers)
    expect(root.entropy).toBeCloseTo(0.99884553599520176, 14)
  })

  it('matches source counts, child entropies, and source branch deltas for saved defaults', () => {
    const root = summarizeTreeGroup(treeWorkbookCustomers)
    const [newsletterYes, newsletterNo] = splitTreeGroup(treeWorkbookCustomers, 'newsletter')
    expect([newsletterYes.total, newsletterYes.subscribed, newsletterYes.notSubscribed]).toEqual([26, 17, 9])
    expect([newsletterNo.total, newsletterNo.subscribed, newsletterNo.notSubscribed]).toEqual([24, 9, 15])
    expect(newsletterYes.entropy).toBeCloseTo(0.93058612913199301, 14)
    expect(newsletterNo.entropy).toBeCloseTo(0.95443400292496494, 14)
    expect(root.entropy - newsletterYes.entropy).toBeCloseTo(0.06825940686320875, 14)

    const [followYes, followNo] = splitTreeGroup(newsletterYes.customers, 'follow')
    expect([followYes.total, followYes.subscribed, followYes.notSubscribed]).toEqual([15, 12, 3])
    expect([followNo.total, followNo.subscribed, followNo.notSubscribed]).toEqual([11, 5, 6])
    expect(followYes.entropy).toBeCloseTo(0.72192809488736231, 14)
    expect(followNo.entropy).toBeCloseTo(0.99403021147695647, 14)
    expect(newsletterYes.entropy - followYes.entropy).toBeCloseTo(0.2086580342446307, 14)
    expect(newsletterYes.entropy - followNo.entropy).toBeCloseTo(-0.06344408234496346, 14)
  })

  it('handles empty and pure branches without evaluating log2(0)', () => {
    expect(treeEntropy(0, 0)).toBe(0)
    expect(treeEntropy(0, 12)).toBe(0)
    expect(treeEntropy(12, 12)).toBe(0)
    const pure = treeWorkbookCustomers.filter(customer => customer.sessionsOver10 === 1 && customer.follow === 1)
    expect(pure).toHaveLength(12)
    expect(summarizeTreeGroup(pure).entropy).toBe(0)
  })

  it('partitions each node exactly for every root and second-feature combination', () => {
    for (const rootFeature of treeWorkbookFeatures.map(feature => feature.key)) {
      const [yes, no] = splitTreeGroup(treeWorkbookCustomers, rootFeature)
      expect(yes.total + no.total).toBe(50)
      expect(yes.subscribed + no.subscribed).toBe(26)
      expect(yes.notSubscribed + no.notSubscribed).toBe(24)
      for (const childFeature of treeWorkbookFeatures.map(feature => feature.key).filter(feature => feature !== rootFeature)) {
        for (const parent of [yes, no]) {
          const [childYes, childNo] = splitTreeGroup(parent.customers, childFeature)
          expect(childYes.total + childNo.total).toBe(parent.total)
          expect(childYes.subscribed + childNo.subscribed).toBe(parent.subscribed)
          expect(childYes.notSubscribed + childNo.notSubscribed).toBe(parent.notSubscribed)
          const gain = treeInformationGain(parent, [childYes, childNo])
          expect(gain).toBeGreaterThanOrEqual(-1e-12)
          expect(gain).toBeLessThanOrEqual(parent.entropy + 1e-12)
        }
      }
    }
  })

  it('uses branch-size weighting for information gain', () => {
    const root = summarizeTreeGroup(treeWorkbookCustomers)
    const children = splitTreeGroup(treeWorkbookCustomers, 'newsletter')
    const expected = root.entropy - children.reduce((sum, child) => sum + child.total / root.total * child.entropy, 0)
    expect(treeInformationGain(root, children)).toBeCloseTo(expected, 14)
    expect(treeInformationGain(root, children)).not.toBeCloseTo(root.entropy - children[0].entropy, 3)
  })
})
