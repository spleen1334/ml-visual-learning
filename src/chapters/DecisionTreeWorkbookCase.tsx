import { Fragment, useMemo, useRef, useState } from 'react'
import { treeWorkbookCustomers, treeWorkbookDefaults } from './treeWorkbookData'
import {
  getTreeFeatureLabel, splitTreeGroup, summarizeTreeGroup, treeInformationGain, treeWorkbookFeatures,
  type TreeFeatureKey, type TreeGroup,
} from './treeWorkbookMath'
import './DecisionTreeWorkbookCase.css'

const entropy = (value: number) => value.toFixed(3)

function SourceRows({ customers, label }: { customers: typeof treeWorkbookCustomers; label: string }) {
  return <table className="dtw__data dtw__data--branch" aria-label={label}>
    <thead><tr><th>ID</th><th>Newsletter</th><th>Follow</th><th>Sessions &gt; 10</th><th>Subscribe?</th></tr></thead>
    <tbody>{customers.map(customer => <tr key={customer.id}>
      <th scope="row">{customer.id}</th><td>{customer.newsletter}</td><td>{customer.follow}</td><td>{customer.sessionsOver10}</td>
      <td className={customer.subscribe ? 'dtw__class-yes' : 'dtw__class-no'}>{customer.subscribe}</td>
    </tr>)}</tbody>
  </table>
}

function CalculationPopup({ parent, children = [], title }: { parent: TreeGroup; children?: TreeGroup[]; title: string }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [entropyIndex, setEntropyIndex] = useState(0)
  const selectedGroup = [parent, ...children][entropyIndex] ?? parent
  const selectedLabel = entropyIndex === 0 ? (children.length ? 'Parent' : 'Selection') : `Branch ${selectedGroup.value}`
  const p1 = selectedGroup.probability
  const p0 = 1 - p1
  const term1 = p1 > 0 ? -p1 * Math.log2(p1) : 0
  const term0 = p0 > 0 ? -p0 * Math.log2(p0) : 0
  return <>
    <button className="dtw__math-button" onClick={() => dialog.current?.showModal()}>Calculations</button>
    <dialog ref={dialog} className="dtw__math-dialog" aria-label={`${title} calculations`} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close() }}>
      <form method="dialog"><button aria-label="Close calculations">Close ×</button></form>
      <h2>{title}</h2>
      <div className="dtw__calculation-trace">
        <table className="dtw__trace-table">
          <thead><tr><th></th>{[parent, ...children].map((group, index) => <th key={index} className={`dtw__trace-color-${index}`}>{index === 0 ? (children.length ? 'Parent' : 'Selection') : `Branch ${group.value}`}</th>)}</tr></thead>
          <tbody>
            <tr><th>Subscribe 1</th>{[parent, ...children].map((group, index) => <td key={index}><strong className="dtw__class-yes">{group.subscribed}</strong><small>p₁ = {group.subscribed}/{group.total}</small></td>)}</tr>
            <tr><th>Subscribe 0</th>{[parent, ...children].map((group, index) => <td key={index}><strong className="dtw__class-no">{group.notSubscribed}</strong><small>p₀ = {group.notSubscribed}/{group.total}</small></td>)}</tr>
            <tr><th>Customers</th>{[parent, ...children].map((group, index) => <td key={index}><strong className={index === 0 ? 'dtw__parent-total' : undefined} title={index === 0 ? 'Parent customer total: denominator for branch weights' : undefined}>{group.total}</strong></td>)}</tr>
            <tr className="dtw__trace-entropy"><th>Entropy</th>{[parent, ...children].map((group, index) => <td key={index} className={`dtw__trace-color-${index}`}><button className="dtw__entropy-value" aria-label={`Show entropy calculation for ${index === 0 ? (children.length ? 'parent' : 'selection') : `branch ${group.value}`}`} aria-pressed={entropyIndex === index} onMouseEnter={() => setEntropyIndex(index)} onFocus={() => setEntropyIndex(index)} onClick={() => setEntropyIndex(index)}>{group.total ? entropy(group.entropy) : '—'}</button></td>)}</tr>
            {children.length > 0 && <>
              <tr className="dtw__trace-arrows" aria-hidden="true"><th></th>{[parent, ...children].map((_, index) => <td key={index} className={`dtw__trace-color-${index}`}><svg viewBox="0 0 40 42"><path d="M20 0 V34 M13 27 L20 35 L27 27" /></svg></td>)}</tr>
              <tr className="dtw__trace-terms"><th>Weighted<br />Info Gain</th><td className="dtw__trace-color-0"><small>Parent entropy</small><strong>{entropy(parent.entropy)}</strong></td>{children.map((group, index) => <td key={group.value} className={`dtw__trace-color-${index + 1}`}><small>Branch {group.value}: size × entropy</small><strong><span className="dtw__trace-operator">{index === 0 ? '− [' : '+'}</span> ({group.total}/{parent.total}) × {entropy(group.entropy)} {index === children.length - 1 && <span className="dtw__trace-operator">]</span>}</strong></td>)}</tr>
            </>}
          </tbody>
        </table>
      </div>
      {children.length > 0 && <div className="dtw__trace-answer">≈ <strong>{entropy(treeInformationGain(parent, children))} bits</strong></div>}
      <div className={`dtw__entropy-work dtw__trace-color-${entropyIndex}`} aria-live="polite">
        <div><strong>Entropy calculation · {selectedLabel}</strong><small>Hover or focus an entropy value above.</small></div>
        {selectedGroup.total ? <>
          <p>p₁ = {selectedGroup.subscribed}/{selectedGroup.total} = {p1.toFixed(3)} <span>p₀ = {selectedGroup.notSubscribed}/{selectedGroup.total} = {p0.toFixed(3)}</span></p>
          <p className="dtw__entropy-substitution">H = −({selectedGroup.subscribed}/{selectedGroup.total}) log₂({selectedGroup.subscribed}/{selectedGroup.total}) − ({selectedGroup.notSubscribed}/{selectedGroup.total}) log₂({selectedGroup.notSubscribed}/{selectedGroup.total})</p>
          <p className="dtw__entropy-result">≈ {term1.toFixed(4)} + {term0.toFixed(4)} ≈ <strong>{entropy(selectedGroup.entropy)} bits</strong></p>
          {(p1 === 0 || p0 === 0) && <small>A zero-probability term contributes 0.</small>}
        </> : <p>No matching customers: entropy is unavailable.</p>}
      </div>
      {children.length > 0 && <p className="dtw__excel-note"><strong>Excel Info Gain:</strong> parent entropy − one branch’s entropy. The calculation above weights both branches.</p>}
    </dialog>
  </>
}

function WorkbookGroup({ group, feature, parent, path }: { group: TreeGroup; feature: TreeFeatureKey; parent: TreeGroup; path: string }) {
  return <article className="dtw__workbook-group" aria-label={path}>
    <h3>{getTreeFeatureLabel(feature)} = {group.value}</h3>
    <div className="dtw__workbook-result">
      <div className="dtw__mini-entropy"><span>Entropy</span><strong>{entropy(group.entropy)}</strong><div className="dtw__mini-counts"><b className="dtw__class-yes" title="Subscribed">{group.subscribed}</b><b className="dtw__class-no" title="Not subscribed">{group.notSubscribed}</b></div></div>
      <div className="dtw__delta"><span>Info Gain</span><strong className={parent.entropy - group.entropy < 0 ? 'dtw__class-no' : 'dtw__class-yes'}>{(parent.entropy - group.entropy).toFixed(3)}</strong></div>
    </div>
    <details className="dtw__rows"><summary>Source rows · {group.total} customers</summary><div className="dtw__table-scroll dtw__table-scroll--branch"><SourceRows customers={group.customers} label={`${path} source rows`} /></div></details>
  </article>
}

function SplitSelector({ label, feature, exclude, onChange }: { label: string; feature: TreeFeatureKey | null; exclude?: TreeFeatureKey; onChange: (feature: TreeFeatureKey | null) => void }) {
  return <label className="dtw__node"><span>{label}</span><select aria-label={`${label} feature`} value={feature ?? ''} onChange={event => onChange(event.target.value ? event.target.value as TreeFeatureKey : null)}>
    {exclude && <option value="">— Select —</option>}{treeWorkbookFeatures.filter(item => item.key !== exclude).map(item => <option value={item.key} key={item.key}>{item.label}</option>)}
  </select></label>
}

function WorkbookFlow({ root, rootFeature, rootGroups, splitA, splitB, onRootChange, onSplitA, onSplitB }: {
  root: TreeGroup; rootFeature: TreeFeatureKey; rootGroups: [TreeGroup, TreeGroup]; splitA: TreeFeatureKey | null; splitB: TreeFeatureKey | null;
  onRootChange: (feature: TreeFeatureKey) => void; onSplitA: (feature: TreeFeatureKey | null) => void; onSplitB: (feature: TreeFeatureKey | null) => void;
}) {
  return <section className="dtw__flow-section" aria-label="Decision Trees worksheet splits">
    <div className="dtw__flow-heading"><h2>DECISION TREES</h2><span>Green: subscribed · Red: not subscribed</span><CalculationPopup parent={root} children={rootGroups} title="Split 1" /></div>
    <div className="dtw__flow-scroll" tabIndex={0} role="region" aria-label="Scrollable worksheet split layout">
      <div className="dtw__flow">
        <div className="dtw__first-node"><SplitSelector label="SPLIT 1" feature={rootFeature} onChange={value => { if (value) onRootChange(value) }} /></div>
        <div className="dtw__fork" aria-hidden="true"><svg viewBox="0 0 60 400" preserveAspectRatio="none"><defs><marker id="dtw-flow-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10z" /></marker></defs><path d="M0 200 C35 200 25 100 60 100" markerEnd="url(#dtw-flow-arrow)" /><path d="M0 200 C35 200 25 300 60 300" markerEnd="url(#dtw-flow-arrow)" /></svg></div>
        <div className="dtw__flow-branches">{rootGroups.map((branch, index) => {
          const selected = index === 0 ? splitA : splitB
          const children = selected ? splitTreeGroup(branch.customers, selected) : null
          const label = `SPLIT 2${index === 0 ? 'A' : 'B'}`
          return <div className="dtw__flow-branch" key={branch.value}>
            <WorkbookGroup group={branch} feature={rootFeature} parent={root} path={`${getTreeFeatureLabel(rootFeature)} = ${branch.value}`} />
            <div className="dtw__next-node"><SplitSelector label={label} feature={selected} exclude={rootFeature} onChange={index === 0 ? onSplitA : onSplitB} />{children && <CalculationPopup parent={branch} children={children} title={label} />}</div>
            <div className={`dtw__fork${children ? '' : ' dtw__fork--empty'}`} aria-hidden="true"><svg viewBox="0 0 60 400" preserveAspectRatio="none"><path d="M0 200 C35 200 25 100 60 100" markerEnd="url(#dtw-flow-arrow)" /><path d="M0 200 C35 200 25 300 60 300" markerEnd="url(#dtw-flow-arrow)" /></svg></div>
            <div className="dtw__final-groups">{children ? children.map(child => <WorkbookGroup key={child.value} group={child} feature={selected!} parent={branch} path={`${getTreeFeatureLabel(rootFeature)} = ${branch.value}, ${getTreeFeatureLabel(selected!)} = ${child.value}`} />) : <p className="dtw__unselected">Choose a feature for {label}.<small>The saved worksheet leaves this split unselected.</small></p>}</div>
          </div>
        })}</div>
      </div>
    </div>
    <p className="dtw__try-note">Select different combinations to compare Info Gain. Try <strong>Split 1: Sessions &gt; 10</strong>, then <strong>Split 2A: Follow</strong>. For Split 2B, Newsletter gives the larger gain in this sample.</p>
  </section>
}

function PivotRows({ customers, sessionsFilter, followFilter, onSessionsChange, onFollowChange }: {
  customers: typeof treeWorkbookCustomers; sessionsFilter: string; followFilter: string;
  onSessionsChange: (value: 'all' | '0' | '1') => void; onFollowChange: (value: 'all' | '0' | '1') => void;
}) {
  const [collapsed, setCollapsed] = useState<string[]>([])
  const toggle = (key: string) => setCollapsed(current => current.includes(key) ? current.filter(item => item !== key) : [...current, key])
  const groupButton = (key: string, value: number, label: string) => <button className="dtw__pivot-toggle" aria-label={`${collapsed.includes(key) ? 'Expand' : 'Collapse'} ${label}`} aria-expanded={!collapsed.includes(key)} onClick={() => toggle(key)}><span aria-hidden="true">{collapsed.includes(key) ? '+' : '−'}</span>{value}</button>
  return <div className="dtw__table-scroll dtw__table-scroll--pivot" role="region" aria-label="Pivot grouped by Sessions, Follow and ID" tabIndex={0}>
    <table className="dtw__data dtw__data--pivot"><thead><tr>
      <th><label>Sessions &gt; 10<select aria-label="Filter pivot by Sessions > 10" value={sessionsFilter} onChange={event => onSessionsChange(event.target.value as 'all' | '0' | '1')}><option value="all">(All)</option><option value="1">1</option><option value="0">0</option></select></label></th>
      <th><label>Follow<select aria-label="Filter pivot by Follow" value={followFilter} onChange={event => onFollowChange(event.target.value as 'all' | '0' | '1')}><option value="all">(All)</option><option value="1">1</option><option value="0">0</option></select></label></th>
      <th>ID</th><th>Subscribe?</th></tr></thead><tbody>
      {([1, 0] as const).map(sessions => {
        const sessionRows = customers.filter(customer => customer.sessionsOver10 === sessions)
        const sessionKey = `sessions-${sessions}`
        if (!sessionRows.length) return null
        return <Fragment key={sessionKey}>
          <tr className="dtw__pivot-session"><th scope="row">{groupButton(sessionKey, sessions, `Sessions > 10 = ${sessions}`)}</th><td colSpan={3}></td></tr>
          {!collapsed.includes(sessionKey) && ([1, 0] as const).map(follow => {
            const rows = sessionRows.filter(customer => customer.follow === follow)
            const key = `${sessionKey}-follow-${follow}`
            if (!rows.length) return null
            return <Fragment key={key}>
              <tr className="dtw__pivot-follow"><td></td><th scope="row">{groupButton(key, follow, `Sessions > 10 = ${sessions}, Follow = ${follow}`)}</th><td colSpan={2}></td></tr>
              {!collapsed.includes(key) && rows.map(customer => <tr className="dtw__pivot-customer" key={customer.id}><td></td><td></td><th scope="row">{customer.id}</th><td className={customer.subscribe ? 'dtw__class-yes' : 'dtw__class-no'}>{customer.subscribe}</td></tr>)}
            </Fragment>
          })}
        </Fragment>
      })}
      {!customers.length && <tr><td colSpan={4}>No matching customers.</td></tr>}
    </tbody></table>
  </div>
}

export function CLDecisionTreeCaseStudy() {
  const [rootFeature, setRootFeature] = useState<TreeFeatureKey>(treeWorkbookDefaults.rootSplit)
  const [splitA, setSplitA] = useState<TreeFeatureKey | null>(treeWorkbookDefaults.secondSplitA)
  const [splitB, setSplitB] = useState<TreeFeatureKey | null>(treeWorkbookDefaults.secondSplitB)
  const [pivotNewsletter, setPivotNewsletter] = useState<'all' | '0' | '1'>('all')
  const [pivotSessions, setPivotSessions] = useState<'all' | '0' | '1'>('all')
  const [pivotFollow, setPivotFollow] = useState<'all' | '0' | '1'>('all')
  const rootGroupsRaw = useMemo(() => splitTreeGroup(treeWorkbookCustomers, rootFeature), [rootFeature])
  const rootGroups = rootGroupsRaw
  const pivotCustomers = treeWorkbookCustomers.filter(customer => (pivotNewsletter === 'all' || customer.newsletter === Number(pivotNewsletter)) && (pivotFollow === 'all' || customer.follow === Number(pivotFollow)) && (pivotSessions === 'all' || customer.sessionsOver10 === Number(pivotSessions)))
  const pivotGroup = summarizeTreeGroup(pivotCustomers)
  const root = summarizeTreeGroup(treeWorkbookCustomers)
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
      <WorkbookFlow root={root} rootFeature={rootFeature} rootGroups={rootGroups} splitA={splitA} splitB={splitB}
        onRootChange={next => { setRootFeature(next); setSplitA(treeWorkbookFeatures.find(item => item.key !== next)?.key ?? null); setSplitB(null) }} onSplitA={setSplitA} onSplitB={setSplitB} />
      <details className="dtw__pivot"><summary className="dtw__pivot-summary"><strong>Decision Tree Pivot</strong><span>An alternative table view of the same customer data.</span></summary>
        <div className="dtw__pivot-controls"><label>Newsletter<select aria-label="Filter pivot by Newsletter" value={pivotNewsletter} onChange={event => setPivotNewsletter(event.target.value as typeof pivotNewsletter)}><option value="all">(All)</option><option value="1">1</option><option value="0">0</option></select></label><span>Matching customers: {pivotGroup.total}</span></div>
        <div className="dtw__pivot-body">
          <PivotRows customers={pivotCustomers} sessionsFilter={pivotSessions} followFilter={pivotFollow} onSessionsChange={setPivotSessions} onFollowChange={setPivotFollow} />
          <div className="dtw__pivot-result" aria-live="polite" aria-label="Filtered pivot results"><h3>Filtered customers</h3><p>{pivotGroup.total} of 50 customers</p>
            <div className="dtw__initial-entropy"><div className="dtw__initial-value"><span>Entropy</span><strong>{pivotGroup.total ? entropy(pivotGroup.entropy) : '—'}</strong></div><div className="dtw__initial-counts"><div className="dtw__class-yes"><strong>{pivotGroup.subscribed}</strong><span>Subscribed</span></div><div className="dtw__class-no"><strong>{pivotGroup.notSubscribed}</strong><span>Not subscribed</span></div></div></div>
            <p>{pivotGroup.total ? `${(pivotGroup.probability * 100).toFixed(1)}% of selected customers subscribed.` : 'No customers match these filters.'}</p>
            <CalculationPopup parent={pivotGroup} title="Pivot selection" />
          </div>
        </div>
      </details>
    </div>
  </article>
}
