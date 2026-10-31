import { useState } from 'react'
import { filterImage } from './visionFiltersData'
import { featureMap, gradients, outputSize, sampledWindow } from './visionFeatureMapsData'
import './VisionFeatureMaps.css'

function responseStyle(value: number) {
  const strength = Math.min(Math.abs(value) / 6, 1)
  const target = value < 0 ? [63, 107, 174] : [194, 75, 50]
  const rgb = target.map(channel => Math.round(255 + (channel - 255) * strength))
  const linear = rgb.map(channel => { const c = channel / 255; return c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4 })
  const light = .2126 * linear[0] + .7152 * linear[1] + .0722 * linear[2]
  return { backgroundColor: `rgb(${rgb.join(',')})`, color: 1.05 / (light + .05) >= (light + .05) / .05 ? '#fff' : '#000' }
}
export function VisionFeatureMaps() {
  const [strideTwo, setStrideTwo] = useState(false)
  const [paddingOn, setPaddingOn] = useState(false)
  const [selected, setSelected] = useState({ row: 0, column: 0, channel: 0 })
  const stride = strideTwo ? 2 : 1, padding = paddingOn ? 1 : 0
  const size = outputSize(5, 3, stride, padding)
  const maps = gradients.map(filter => featureMap(filter, stride, padding))
  const sampled = sampledWindow(selected.row, selected.column, stride, padding)
  const paddedSize = 5 + 2 * padding
  const toggle = (kind: 'stride' | 'padding') => { if (kind === 'stride') setStrideTwo(!strideTwo); else setPaddingOn(!paddingOn); setSelected({ row: 0, column: 0, channel: 0 }) }
  return <article className="vfm-lesson"><header className="vfm-header"><p className="vfm-eyebrow">98.5 · Computer Vision</p><h1>Stride, padding and feature maps</h1><p className="vfm-definition"><strong>Stride</strong> is the jump between window starts. <strong>Padding</strong> adds zeros around the image.</p><p>Change either setting to see how many places a filter can visit.</p></header>
    <section className="vfm-panel" aria-labelledby="vfm-title"><div className="vfm-heading"><div><p className="vfm-eyebrow">ONE INPUT · TWO FILTERS</p><h2 id="vfm-title">Follow the sampled window</h2></div><p>Select a cell in either map to see its input region. Both filters use the same image, not each other's output.</p></div>
      <div className="vfm-controls" role="group" aria-label="Sampling settings"><button type="button" aria-pressed={strideTwo} onClick={() => toggle('stride')}><b>Stride 2</b><span>{strideTwo ? 'On · jump 2' : 'Off · jump 1'}</span></button><button type="button" aria-pressed={paddingOn} onClick={() => toggle('padding')}><b>Padding 1</b><span>{paddingOn ? 'On · one zero border' : 'Off · no border'}</span></button></div>
      <div className="vfm-diagram"><div className="vfm-input vfm-card"><p className="vfm-kicker">INPUT · {paddedSize} × {paddedSize} {padding ? 'WITH PADDING' : ''}</p><div className="vfm-grid vfm-input-grid" style={{ gridTemplateColumns: `repeat(${paddedSize}, 1fr)` }}>{Array.from({ length: paddedSize }, (_, y) => Array.from({ length: paddedSize }, (_, x) => {
        const sourceY = y - padding, sourceX = x - padding, pad = sourceY < 0 || sourceX < 0 || sourceY >= 5 || sourceX >= 5
        const value = pad ? 0 : filterImage[sourceY][sourceX]
        const active = y >= selected.row * stride && y < selected.row * stride + 3 && x >= selected.column * stride && x < selected.column * stride + 3
        return <span key={`${y}-${x}`} className={`${pad ? 'vfm-padding' : ''} ${active ? 'vfm-selected' : ''}`} style={pad ? undefined : { backgroundColor: `rgb(${255 - 75 * value}, ${255 - 75 * value}, ${255 - 75 * value})` }}>{value}</span>
      }))}</div><p>Gray = observed intensity (0–2). Hatched cells are added zeros, not image pixels.</p></div><div className="vfm-connector" aria-hidden="true">→<small>same input</small>→</div><div className="vfm-maps">{maps.map((map, channel) => <div className="vfm-card" key={gradients[channel].id}><p className="vfm-kicker">{channel === 0 ? 'X-GRADIENT · CHANNEL 1' : 'Y-GRADIENT · CHANNEL 2'}</p><div className="vfm-grid vfm-output-grid" style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }} role="group" aria-label={`${gradients[channel].name} feature map`}>{map.map((values, row) => values.map((value, column) => <button key={`${row}-${column}`} type="button" aria-label={`${gradients[channel].name} row ${row + 1}, column ${column + 1}: ${value}`} aria-pressed={selected.channel === channel && selected.row === row && selected.column === column} style={responseStyle(value)} onClick={() => setSelected({ row, column, channel })}>{value}</button>))}</div><p>{channel === 0 ? 'Left-to-right changes; vertical edges.' : 'Top-to-bottom changes; horizontal edges.'}</p></div>)}</div></div>
      <div className="vfm-selection" aria-live="polite"><b>Selected: {gradients[selected.channel].name}, row {selected.row + 1}, column {selected.column + 1} → {maps[selected.channel][selected.row][selected.column]}</b><p>The highlighted 3 × 3 <b>receptive field</b> is the input region that feeds this output. Its top-left original coordinate is (row {sampled[0][0].row}, column {sampled[0][0].column}); coordinates outside 0–4 are padding.</p></div>
      <div className="vfm-dimensions"><div><p className="vfm-kicker">OUTPUT SIZE · ONE AXIS</p><div className="vfm-equation"><span>⌊</span><span className="vfm-fraction"><span>5 + 2 × {padding} − 3</span><span>{stride}</span></span><span>⌋ + 1 = <b>{size}</b></span></div><small>⌊ ⌋ means round down. Input size 5 · kernel size 3 · zero bias · dilation 1</small></div><div><p className="vfm-kicker">TWO OUTPUT CHANNELS</p><p><strong>{size} × {size} × 2</strong></p><small>One response map per filter: x and y are separate channels.</small></div></div>
      <p className="vfm-note">The window contains neighboring pixels; stride changes the jump <em>between</em> windows, not spacing within them. Red = positive, blue = negative, white = zero (−6 to +6); signs show direction of change. Filters use unflipped weights, with no clipping of responses.</p>
    </section></article>
}
