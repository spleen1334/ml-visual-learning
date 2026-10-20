import source from './treeWorkbookData.json'

export type TreeWorkbookCustomer = {
  id: number
  newsletter: 0 | 1
  follow: 0 | 1
  sessionsOver10: 0 | 1
  subscribe: 0 | 1
}

export const treeWorkbookCustomers = source.customers as TreeWorkbookCustomer[]
export const treeWorkbookDefaults = source.defaults as {
  rootSplit: 'newsletter' | 'follow' | 'sessionsOver10'
  secondSplitA: 'newsletter' | 'follow' | 'sessionsOver10'
  secondSplitB: 'newsletter' | 'follow' | 'sessionsOver10' | null
}
