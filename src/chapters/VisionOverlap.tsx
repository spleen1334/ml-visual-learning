import { useEffect, useState } from 'react'
import { visionScene, type VisionBox } from './visionScene'
import { suppliedCandidates, candidateMask, boxOverlap, maskOverlap, visibleCandidates } from './visionOverlap'
import './VisionOverlap.css'

const refBox = visionScene.objects[0].box
const refMask = visionScene.objects[0].binaryMask
type Mask = readonly (readonly number[])[]
const fmt = (value: number | null) => value === null ? 'not defined' : value.toFixed(3)
const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b)
function Fraction({ numerator, denominator }: { numerator: number; denominator: number }) { return <span className="vo-fraction"><span>{numerator}</span><span>{denominator}</span></span> }
function OverlapFraction({ intersection, union }: { intersection: number; union: number }) {
  const divisor = gcd(intersection, union)
  return <><Fraction numerator={intersection} denominator={union} />{divisor > 1 && <> = <Fraction numerator={intersection / divisor} denominator={union / divisor} /></>}</>
}
function EdgeInput({ label, value, min, max, update }: { label: string; value: number; min: number; max: number; update: (value: number) => void }) {
  const [draft, setDraft] = useState(String(value))
  useEffect(() => setDraft(String(value)), [value])
  return <label>{label}<input type="number" min={min} max={max} step="1" value={draft} onChange={event => { const text = event.currentTarget.value; setDraft(text); const number = Number(text); if (text !== '' && Number.isInteger(number) && number >= min && number <= max) update(number) }} onBlur={() => setDraft(String(value))} /></label>
}
export function VisionOverlap() {
  const [tab, setTab] = useState<'boxes' | 'masks'>('boxes')
  const [box, setBox] = useState<VisionBox>(suppliedCandidates[0].box)
  const [threshold, setThreshold] = useState(.5)
  const [mask, setMask] = useState<Mask>(candidateMask)
  const boxStats = boxOverlap(refBox, box)
  const maskStats = maskOverlap(refMask, mask)
  const visible = visibleCandidates(threshold)
  const showFirst = visible.some(item => item.id === suppliedCandidates[0].id)
  const editEdge = (index: number, value: number) => setBox(current => {
    const result: [number, number, number, number] = [...current]
    result[index] = value
    return result
  })
  const toggleCell = (row: number, column: number) => setMask(current => current.map((values, y) => values.map((value, x) => y === row && x === column ? 1 - value : value)))
  return <article className="vo-lesson"><header className="vo-header"><p className="vo-eyebrow">98.10 · Computer Vision</p><h1>From labels to boxes and masks</h1><p className="vo-definition"><strong>Intersection over union (IoU)</strong> measures overlap: the shared area or pixels divided by everything covered by either shape.</p><p>A <b>mask</b> marks which pixels belong to an object. Compare an authored candidate with a fixed reference; neither is a live model prediction.</p></header>
    <section className="vo-panel" aria-labelledby="vo-title"><div className="vo-heading"><div><p className="vo-eyebrow">ONE SCENE · TWO COMPARISONS</p><h2 id="vo-title">Compare a candidate to its reference</h2></div><p>Choose boxes or masks. Their edits are independent.</p></div><div className="vo-tabs" role="group" aria-label="Choose comparison"><button type="button" aria-pressed={tab === 'boxes'} onClick={() => setTab('boxes')}>Box overlap</button><button type="button" aria-pressed={tab === 'masks'} onClick={() => setTab('masks')}>Mask overlap</button></div>
      {tab === 'boxes' ? <div className="vo-layout"><div><p className="vo-kicker">SQUARE SCENE · REFERENCE AND CANDIDATES</p><svg className="vo-scene" viewBox="-.25 -.25 6.5 6.5" role="img" aria-label={`Two square reference boxes. ${showFirst ? 'Candidate 1 shown.' : 'Candidate 1 hidden by score threshold.'} ${visible.some(item => item.id === suppliedCandidates[1].id) ? 'Candidate 2 shown.' : 'Candidate 2 hidden by score threshold.'}`}>
        {visionScene.pixels.map((row, y) => row.map((pixel, x) => <rect key={`${y}-${x}`} x={x} y={y} width="1" height="1" fill={`rgb(${pixel.join(',')})`} stroke="#fff" strokeWidth=".025" />))}
        {visionScene.objects.map(object => { const [x1,y1,x2,y2] = object.box; return <rect key={object.id} x={x1} y={y1} width={x2-x1} height={y2-y1} fill="none" stroke="#124a40" strokeWidth=".09" /> })}
        {visible.map(item => { const [x1,y1,x2,y2] = item.id === suppliedCandidates[0].id ? box : item.box; return <rect key={item.id} x={x1} y={y1} width={x2-x1} height={y2-y1} fill="none" stroke="#9d3827" strokeWidth=".09" strokeDasharray=".18 .1" /> })}
        <text x="1.03" y=".9" fontSize=".22" fill="#124a40" fontWeight="bold">Reference 1</text><text x="3.03" y="5.3" fontSize=".22" fill="#124a40" fontWeight="bold">Reference 2</text>{showFirst && <text x="1.03" y="3.27" fontSize=".22" fill="#9d3827" fontWeight="bold">Candidate 1</text>}{visible.some(item => item.id === suppliedCandidates[1].id) && <text x="3.03" y="2.85" fontSize=".22" fill="#9d3827" fontWeight="bold">Candidate 2</text>}
      </svg><p className="vo-legend"><span>━━ Reference</span><span>┄┄ Candidate</span> Both objects are class <b>square</b>, but are separate instances.</p></div><div className="vo-details"><h3>Candidate 1 vs reference 1</h3><p>Reference: [{refBox.join(', ')}]. Candidate score: {suppliedCandidates[0].score}. {!showFirst && <b>The score filter hides candidate 1 in the scene; this independent comparison remains visible.</b>}</p><div className="vo-edges">{['Left', 'Top', 'Right', 'Bottom'].map((label, index) => <EdgeInput key={label} label={label} value={box[index]} min={index >= 2 ? box[index - 2] : 0} max={index < 2 ? box[index + 2] : 6} update={value => editEdge(index, value)} />)}</div><p className="vo-small">Integer edges 0–6. [left, top, right, bottom]; right and bottom edges are excluded. Areas use square coordinate units.</p><button type="button" className="vo-reset" onClick={() => setBox(suppliedCandidates[0].box)}>Reset box</button><div className="vo-calc" aria-live="polite"><p>Reference area = <b>{boxStats.areaA}</b> · Candidate area = <b>{boxStats.areaB}</b></p><p>Intersection = <b>{boxStats.intersection}</b> · Union = {boxStats.areaA} + {boxStats.areaB} − {boxStats.intersection} = <b>{boxStats.union}</b></p><div className="vo-equation">IoU = <OverlapFraction intersection={boxStats.intersection} union={boxStats.union} /> = <b>{fmt(boxStats.iou)}</b></div></div><label className="vo-threshold">Score threshold: <b>{threshold.toFixed(1)}</b><input type="range" min="0" max="1" step="0.1" value={threshold} onChange={event => setThreshold(Number(event.currentTarget.value))} /></label><p className="vo-small">Visible candidates: {visible.length ? visible.map(item => `${item.id} (${item.score})`).join(', ') : 'none'}. Scores are supplied, not model confidence estimates.</p></div></div> : <div className="vo-layout"><div><p className="vo-kicker">INSTANCE 1 · TOGGLE CANDIDATE PIXELS</p><div className="vo-mask-grid" role="group" aria-label="Toggle candidate mask pixels">{mask.map((row, y) => row.map((value, x) => { const reference = !!refMask[y][x]; return <button key={`${y}-${x}`} type="button" aria-pressed={!!value} aria-label={`Row ${y + 1}, column ${x + 1}: ${reference ? 'reference' : 'not reference'}, ${value ? 'candidate selected' : 'candidate not selected'}`} className={reference && value ? 'vo-both' : reference ? 'vo-ref' : value ? 'vo-candidate' : ''} onClick={() => toggleCell(y, x)}>{reference && value ? 'B' : reference ? 'R' : value ? 'C' : '·'}</button> }))}</div><p className="vo-legend"><span>B = both</span><span>R = reference only</span><span>C = candidate only</span><span>· = neither</span></p></div><div className="vo-details"><h3>Candidate mask vs reference 1</h3><p>Each button toggles one candidate pixel; the four-pixel reference remains fixed. A semantic mask groups the square class, while this instance mask identifies one object.</p><button type="button" className="vo-reset" onClick={() => setMask(candidateMask)}>Reset mask</button><div className="vo-calc" aria-live="polite"><p>Reference pixels = <b>{maskStats.countA}</b> · Candidate pixels = <b>{maskStats.countB}</b></p><p>Intersection = <b>{maskStats.intersection}</b> · Union = {maskStats.countA} + {maskStats.countB} − {maskStats.intersection} = <b>{maskStats.union}</b></p><div className="vo-equation">IoU = <Fraction numerator={maskStats.intersection} denominator={maskStats.union} /> = <b>{fmt(maskStats.iou)}</b></div></div><p className="vo-small">Mask IoU counts discrete pixels, not box area. When both masks are empty, IoU is not defined.</p></div></div>}
      <p className="vo-note"><b>Score threshold</b> filters candidates by their supplied score. It is not an IoU matching threshold, which checks spatial agreement, or duplicate suppression, which removes overlapping candidates. Editing shapes does not run a detector or segmenter.</p>
    </section></article>
}
