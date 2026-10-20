import type { TreeWorkbookCustomer } from './treeWorkbookData'

export const treeWorkbookFeatures = [
  { key: 'newsletter', label: 'Newsletter' },
  { key: 'follow', label: 'Follow' },
  { key: 'sessionsOver10', label: 'Sessions > 10' },
] as const

export type TreeFeatureKey = (typeof treeWorkbookFeatures)[number]['key']
export type TreeGroup = {
  value: 0 | 1
  customers: TreeWorkbookCustomer[]
  subscribed: number
  notSubscribed: number
  total: number
  probability: number
  entropy: number
  feature?: TreeFeatureKey
}

export function treeEntropy(positive: number, total: number) {
  if (total <= 0) return 0
  const p = positive / total
  const q = 1 - p
  return (p === 0 ? 0 : -p * Math.log2(p)) + (q === 0 ? 0 : -q * Math.log2(q))
}

export function treeInformationGain(parent: TreeGroup, children: TreeGroup[]) {
  if (!parent.total) return 0
  const weightedChildren = children.reduce((sum, child) => sum + child.total / parent.total * child.entropy, 0)
  return parent.entropy - weightedChildren
}

export function summarizeTreeGroup(customers: TreeWorkbookCustomer[], value: 0 | 1 = 1): TreeGroup {
  const subscribed = customers.filter(customer => customer.subscribe === 1).length
  const total = customers.length
  return {
    value,
    customers,
    subscribed,
    notSubscribed: total - subscribed,
    total,
    probability: total ? subscribed / total : 0,
    entropy: treeEntropy(subscribed, total),
  }
}

export function splitTreeGroup(customers: TreeWorkbookCustomer[], feature: TreeFeatureKey): [TreeGroup, TreeGroup] {
  return ([1, 0] as const).map(value => summarizeTreeGroup(customers.filter(customer => customer[feature] === value), value)) as [TreeGroup, TreeGroup]
}

export function getTreeFeatureLabel(feature: TreeFeatureKey) {
  return treeWorkbookFeatures.find(item => item.key === feature)?.label ?? feature
}
