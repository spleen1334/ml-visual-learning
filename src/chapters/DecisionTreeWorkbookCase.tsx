import { useMemo, useState } from 'react'
import { treeWorkbookCustomers, treeWorkbookDefaults } from './treeWorkbookData'
import {
  getTreeFeatureLabel, splitTreeGroup, summarizeTreeGroup, treeInformationGain, treeWorkbookFeatures,
  type TreeFeatureKey, type TreeGroup,
} from './treeWorkbookMath'
import './DecisionTreeWorkbookCase.css'

const pct = (value: number) => `${(value * 100).toFixed(1)}%`
const entropy = (value: number) => value.toFixed(3)

function GroupCard({ group, feature, parentLabel, parentEntropy }: { group: TreeGroup; feature: TreeFeatureKey; parentLabel: string; parentEntropy?: number }) {
  const rowsLabel = group.customers.map(customer => customer.id).join(', ')
  return <article className="dtw__group-card">
    <div className="dtw__group-head"><div><small>{parentLabel}</small><h3>{getTreeFeatureLabel(feature)} = {group.value}</h3></div><span>N = {group.total}</span></div>
    <table className="dtw__calc-table" aria-label={`${getTreeFeatureLabel(feature)} equals ${group.value} count and probability calculation`}>
      <thead><tr><th>Subscribe?</th><th>Count</th><th>Probability</th></tr></thead>
      <tbody><tr><th>1</th><td>{group.subscribed}</td><td>{group.total ? pct(group.probability) : '—'}</td></tr>
        <tr><th>0</th><td>{group.notSubscribed}</td><td>{group.total ? pct(1 - group.probability) : '—'}</td></tr>
      </tbody><tfoot><tr><th colSpan={2}>Entropy · H(p₁,p₀)</th><td>{entropy(group.entropy)}</td></tr></tfoot>
    </table>
    {parentEntropy !== undefined && <div className="dtw__branch-delta"><span>Workbook branch delta · H(parent) − H(this branch)</span><b>{(parentEntropy - group.entropy).toFixed(3)}</b></div>}
    <details className="dtw__rows"><summary>Source rows · {group.total} customers <span>{rowsLabel}</span></summary>
      <div className="dtw__table-scroll dtw__table-scroll--branch"><SourceRows customers={group.customers} label={`${getTreeFeatureLabel(feature)} = ${group.value} source rows`} /></div>
    </details>
  </article>
}

function SourceRows({ customers, label }: { customers: typeof treeWorkbookCustomers; label: string }) {
  return <table className="dtw__data dtw__data--branch" aria-label={label}>
    <thead><tr><th>ID</th><th>Newsletter</th><th>Follow</th><th>Sessions &gt; 10</th><th>Subscribe?</th></tr></thead>
    <tbody>{customers.map(customer => <tr key={customer.id}>
      <th scope="row">{customer.id}</th><td>{customer.newsletter}</td><td>{customer.follow}</td><td>{customer.sessionsOver10}</td>
      <td className={customer.subscribe ? 'dtw__class-yes' : 'dtw__class-no'}>{customer.subscribe}</td>
    </tr>)}</tbody>
  </table>
}

function SplitPanel({
  label, parent, feature, onFeatureChange,
}: {
  label: string
  parent: TreeGroup & { label: string; feature?: TreeFeatureKey }
  feature: TreeFeatureKey | null
  onFeatureChange: (feature: TreeFeatureKey | null) => void
}) {
  const children = feature ? splitTreeGroup(parent.customers, feature) : null
  const gain = children ? treeInformationGain(parent, children) : null
  const options = treeWorkbookFeatures.filter(item => item.key !== parent.feature)
  return <section className="dtw__split" aria-label={`${label} split`}>
    <div className="dtw__split-title"><div><p className="dtw__eyebrow">{label}</p><h3>Test the next feature</h3></div>
      <label className="dtw__select-label">Split on
        <select aria-label={`${label} feature`} value={feature ?? ''} onChange={event => onFeatureChange(event.target.value ? event.target.value as TreeFeatureKey : null)}>
          <option value="">—</option>{options.map(item => <option value={item.key} key={item.key}>{item.label}</option>)}
        </select>
      </label>
    </div>
    <div className="dtw__parent"><span>Current branch · {parent.label}</span><strong>{parent.subscribed} subscribed / {parent.notSubscribed} not</strong><small>N={parent.total} · H={entropy(parent.entropy)}</small></div>
    {children ? <>
      <div className="dtw__groups">{children.map(group => <GroupCard key={group.value} group={group} feature={feature!} parentLabel={`${parent.label} ·`} parentEntropy={parent.entropy} />)}</div>
      <div className="dtw__gain"><span>Weighted information gain for this split</span><strong>{gain!.toFixed(3)} bits</strong><small>H(parent) − [({children[0].total}/{parent.total})H(1) + ({children[1].total}/{parent.total})H(0)]</small></div>
    </> : <div className="dtw__empty">{label === 'SPLIT 2B' ? 'The saved worksheet leaves this second split unselected and its dependent cells show #REF!. Choose a feature to calculate from the source rows.' : 'No second split is selected.'}</div>}
  </section>
}

type Branch = TreeGroup & { label: string; feature?: TreeFeatureKey }

function TreeDiagram({ rootFeature, rootGroups, splitA, splitB }: {
  rootFeature: TreeFeatureKey
  rootGroups: [Branch, Branch]
  splitA: TreeFeatureKey | null
  splitB: TreeFeatureKey | null
}) {
  const aChildren = splitA ? splitTreeGroup(rootGroups[0].customers, splitA) : null
  const bChildren = splitB ? splitTreeGroup(rootGroups[1].customers, splitB) : null
  const leavesA = aChildren ?? [rootGroups[0]]
  const leavesB = bChildren ?? [rootGroups[1]]
  const leafText = (group: TreeGroup) => `${group.subscribed} / ${group.notSubscribed}`
  return <section className="dtw__tree" aria-label="Current decision tree">
    <div className="dtw__tree-root"><small>ROOT · 50 customers</small><strong>{getTreeFeatureLabel(rootFeature)}</strong><span>H = {entropy(summarizeTreeGroup(treeWorkbookCustomers).entropy)}</span></div>
    <svg className="dtw__tree-lines" viewBox="0 0 1000 84" preserveAspectRatio="none" aria-hidden="true"><defs><marker id="dtw-root-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10z" /></marker></defs><path d="M500 0 V35 H250 V82" markerEnd="url(#dtw-root-arrow)" /><path d="M500 35 H750 V82" markerEnd="url(#dtw-root-arrow)" /></svg>
    <div className="dtw__tree-branches">
      {rootGroups.map((branch, index) => {
        const selected = index === 0 ? splitA : splitB
        const leaves = index === 0 ? leavesA : leavesB
        return <div className="dtw__tree-branch" key={branch.value}>
          <div className="dtw__branch-label"><small>{getTreeFeatureLabel(rootFeature)} = {branch.value} · N={branch.total}</small><strong>{branch.subscribed} / {branch.notSubscribed}</strong><span>{selected ? `Split next on ${getTreeFeatureLabel(selected)}` : 'No second split selected'}</span></div>
          <svg className="dtw__leaf-lines" viewBox="0 0 100 30" preserveAspectRatio="none" role="img" aria-label={selected ? `Connectors from the ${getTreeFeatureLabel(selected)} decision to its two leaves` : 'Connector to the unsplit branch result'}>
            <defs><marker id={`dtw-arrow-${branch.value}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10z" /></marker></defs>
            {selected ? <><path d="M50 0 V11 H24 V28" markerEnd={`url(#dtw-arrow-${branch.value})`} />
            <path d="M50 0 V11 H76 V28" markerEnd={`url(#dtw-arrow-${branch.value})`} /></> : <path d="M50 0 V28" markerEnd={`url(#dtw-arrow-${branch.value})`} />}
          </svg>
          <div className={`dtw__leaf-row${selected ? '' : ' dtw__leaf-row--single'}`}>{leaves.map((leaf, leafIndex) => <div className="dtw__leaf" key={`${branch.value}-${leafIndex}`}>
            {selected && <small>{getTreeFeatureLabel(selected)} = {leaf.value}</small>}
            <strong>{leafText(leaf)}</strong><span>{leaf.total ? pct(leaf.probability) : '—'} subscribe</span>
          </div>)}</div>
        </div>
      })}
    </div>
    <div className="dtw__legend"><span><i className="dtw__swatch dtw__swatch--yes" />Subscribes</span><span><i className="dtw__swatch dtw__swatch--no" />Does not subscribe</span><small>Each leaf shows Subscribe = 1 / Subscribe = 0 counts.</small></div>
  </section>
}

export function CLDecisionTreeCaseStudy() {
  const [rootFeature, setRootFeature] = useState<TreeFeatureKey>(treeWorkbookDefaults.rootSplit)
  const [splitA, setSplitA] = useState<TreeFeatureKey | null>(treeWorkbookDefaults.secondSplitA)
  const [splitB, setSplitB] = useState<TreeFeatureKey | null>(treeWorkbookDefaults.secondSplitB)
  const [pivotNewsletter, setPivotNewsletter] = useState<'all' | '0' | '1'>('all')
  const [pivotFollow, setPivotFollow] = useState<'all' | '0' | '1'>('all')
  const rootGroupsRaw = useMemo(() => splitTreeGroup(treeWorkbookCustomers, rootFeature), [rootFeature])
  const rootGroups: [Branch, Branch] = rootGroupsRaw.map(group => ({ ...group, label: `${getTreeFeatureLabel(rootFeature)} = ${group.value}`, feature: rootFeature })) as [Branch, Branch]
  const root = summarizeTreeGroup(treeWorkbookCustomers)
  const rootGain = treeInformationGain(root, rootGroups)
  return <article className="dtw" aria-labelledby="dtw-title">
    <header className="dtw__header"><p>Chapter 09 · Classification Models · 9.14</p><h1 id="dtw-title">Case study: Decision Trees</h1><p>Use Trip Genie customer behavior to compare splits for paid subscription.</p></header>
    <div className="dtw__sheet" role="region" aria-label="Decision tree workbook case study">
      <section className="dtw__source" aria-labelledby="dtw-source-title">
        <div className="dtw__section-head"><div><h2 id="dtw-source-title">CUSTOMER INTERACTIONS</h2><span>50 training customers · target: Subscribe?</span></div>
          <div className="dtw__initial-entropy" role="group" aria-label="Initial entropy and subscription counts">
            <div className="dtw__initial-value"><span>Entropy</span><strong>{entropy(root.entropy)}</strong></div>
            <div className="dtw__initial-counts"><div className="dtw__class-yes"><strong>{root.subscribed}</strong><span>Subscribed</span></div><div className="dtw__class-no"><strong>{root.notSubscribed}</strong><span>Not subscribed</span></div></div>
          </div>
        </div>
        <div className="dtw__table-scroll" role="region" aria-label="All 50 source customers" tabIndex={0}>
          <SourceRows customers={treeWorkbookCustomers} label="All 50 customer interaction rows" />
        </div>
      </section>
      <section className="dtw__root-split" aria-labelledby="dtw-root-title">
        <div className="dtw__section-head"><div><h2 id="dtw-root-title">SPLIT 1</h2><span>Compare the target classes in both branches.</span></div>
          <label className="dtw__select-label">Test feature
            <select value={rootFeature} onChange={event => { const next = event.target.value as TreeFeatureKey; setRootFeature(next); setSplitA(treeWorkbookFeatures.find(item => item.key !== next)?.key ?? null); setSplitB(null) }}>
              {treeWorkbookFeatures.map(item => <option key={item.key} value={item.key}>{item.label}</option>)}
            </select>
          </label>
        </div>
        <table className="dtw__calc-table dtw__calc-table--root" aria-label="Class totals and root entropy">
          <thead><tr><th>Basis · Subscribe?</th><th>Count</th><th>Probability</th><th>Entropy</th></tr></thead>
          <tbody><tr><th>1</th><td>{root.subscribed}</td><td>{pct(root.probability)}</td><td rowSpan={2}>{entropy(root.entropy)}</td></tr>
            <tr><th>0</th><td>{root.notSubscribed}</td><td>{pct(1 - root.probability)}</td></tr></tbody>
          <tfoot><tr><th>Total · N</th><td>{root.total}</td><td>100%</td><td>H(parent)</td></tr></tfoot>
        </table>
        <div className="dtw__groups">{rootGroups.map(group => <GroupCard key={group.value} group={group} feature={rootFeature} parentLabel="Root branch ·" parentEntropy={root.entropy} />)}</div>
        <div className="dtw__gain"><span>Weighted information gain</span><strong>{rootGain.toFixed(3)} bits</strong><small>H(parent) − Σ (branch size / 50 × branch entropy)</small></div>
      </section>
      <TreeDiagram rootFeature={rootFeature} rootGroups={rootGroups} splitA={splitA} splitB={splitB} />
      <div className="dtw__second-splits">
        {rootGroups.map((parent, index) => <SplitPanel key={`${rootFeature}-${parent.value}`} label={`SPLIT 2${index === 0 ? 'A' : 'B'}`} parent={parent} feature={index === 0 ? splitA : splitB}
          onFeatureChange={index === 0 ? setSplitA : setSplitB} />)}
      </div>
      <section className="dtw__pivot" aria-labelledby="dtw-pivot-title"><div className="dtw__section-head"><div><h2 id="dtw-pivot-title">DECISION TREE PIVOT</h2><span>Filter the same customer outcomes by root and second feature.</span></div></div>
        <div className="dtw__pivot-controls"><label>Newsletter<select aria-label="Filter pivot by Newsletter" value={pivotNewsletter} onChange={event => setPivotNewsletter(event.target.value as typeof pivotNewsletter)}><option value="all">(All)</option><option value="1">1</option><option value="0">0</option></select></label><label>Follow<select aria-label="Filter pivot by Follow" value={pivotFollow} onChange={event => setPivotFollow(event.target.value as typeof pivotFollow)}><option value="all">(All)</option><option value="1">1</option><option value="0">0</option></select></label><span>{pivotNewsletter === 'all' && pivotFollow === 'all' ? 'Saved workbook filters: (All) · (All)' : `Matching customers: ${treeWorkbookCustomers.filter(customer => (pivotNewsletter === 'all' || customer.newsletter === Number(pivotNewsletter)) && (pivotFollow === 'all' || customer.follow === Number(pivotFollow))).length}`}</span></div>
        <div className="dtw__table-scroll dtw__table-scroll--pivot"><table className="dtw__data dtw__data--pivot"><caption>Decision Tree Pivot worksheet · B6:C56</caption><thead><tr><th>ID</th><th>Subscribe?</th></tr></thead><tbody>{treeWorkbookCustomers.filter(customer => (pivotNewsletter === 'all' || customer.newsletter === Number(pivotNewsletter)) && (pivotFollow === 'all' || customer.follow === Number(pivotFollow))).map(customer => <tr key={`pivot-${customer.id}`}><th scope="row">{customer.id}</th><td className={customer.subscribe ? 'dtw__class-yes' : 'dtw__class-no'}>{customer.subscribe}</td></tr>)}</tbody></table></div>
      </section>
    </div>
  </article>
}
