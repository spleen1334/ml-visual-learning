import { useState } from 'react'
import { average, comparisonWindows, maxPool, poolWindow, relu, signedMaps } from './visionPoolingData'
import './VisionPooling.css'

function signedStyle(value: number) {
  const amount = Math.abs(value) / 6, target = value < 0 ? [63,107,174] : [194,75,50]
  const rgb = target.map(channel => Math.round(255 + (channel - 255) * amount))
  const linear = rgb.map(channel => { const c = channel / 255; return c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4 })
  const light = .2126 * linear[0] + .7152 * linear[1] + .0722 * linear[2]
  return { backgroundColor: `rgb(${rgb.join(',')})`, color: 1.05 / (light + .05) >= (light + .05) / .05 ? '#fff' : '#000' }
}
function Fraction({ numerator, denominator }: { numerator: number; denominator: number }) { return <span className="vpool-fraction"><span>{numerator}</span><span>{denominator}</span></span> }

export function VisionPooling() {
  const [channel, setChannel] = useState(0)
  const [selected, setSelected] = useState({ row: 0, column: 0 })
  const signed = signedMaps[channel], activated = relu(signed), pooled = maxPool(activated)
  const values = poolWindow(activated, selected.row, selected.column)
  return <article className="vpool-lesson"><header className="vpool-header"><p className="vpool-eyebrow">98.6 · Computer Vision</p><h1>Activations and pooling</h1><p className="vpool-definition"><strong>ReLU</strong> changes negative values to zero and leaves positive values unchanged.</p><p>Then max pooling keeps the largest value in each small window.</p></header>
    <section className="vpool-panel" aria-labelledby="vpool-title"><div className="vpool-heading"><div><p className="vpool-eyebrow">ONE CHANNEL · THREE STAGES</p><h2 id="vpool-title">Follow a value through pooling</h2></div><p>Choose a channel, then select a pooled cell to highlight the four values that contributed.</p></div>
      <div className="vpool-channels" role="group" aria-label="Choose a feature map channel">{['X-gradient', 'Y-gradient'].map((label, i) => <button key={label} type="button" aria-pressed={channel === i} onClick={() => setChannel(i)}>{label}</button>)}</div>
      <div className="vpool-flow"><div className="vpool-stage"><p className="vpool-kicker">SIGNED RESPONSE · 5 × 5</p><div className="vpool-grid vpool-five">{signed.map((row, y) => row.map((value, x) => <span key={`${y}-${x}`} style={signedStyle(value)}>{value}</span>))}</div><p>Blue = negative · white = zero · red = positive (−6 to +6).</p></div><span className="vpool-arrow" aria-hidden="true">→</span><div className="vpool-stage"><p className="vpool-kicker">RELU · 5 × 5</p><div className="vpool-grid vpool-five">{activated.map((row, y) => row.map((value, x) => { const unused = y === 4 || x === 4, active = y >= selected.row * 2 && y < selected.row * 2 + 2 && x >= selected.column * 2 && x < selected.column * 2 + 2; return <span key={`${y}-${x}`} className={`${unused ? 'vpool-unused' : ''} ${active ? 'vpool-contributor' : ''}`}>{value}</span> }))}</div><p>Outlined: selected window. Hatched: unused final row and column.</p></div><span className="vpool-arrow" aria-hidden="true">→</span><div className="vpool-stage"><p className="vpool-kicker">MAX POOL · 2 × 2</p><div className="vpool-grid vpool-two" role="group" aria-label="Choose a pooled output">{pooled.map((row, y) => row.map((value, x) => <button type="button" key={`${y}-${x}`} aria-label={`Pool row ${y + 1}, column ${x + 1}: ${value}`} aria-pressed={selected.row === y && selected.column === x} onClick={() => setSelected({ row: y, column: x })}>{value}</button>))}</div><p>2 × 2 windows · stride 2 · no padding</p></div></div>
      <div className="vpool-detail" aria-live="polite"><p className="vpool-kicker">SELECTED OUTPUT · ROW {selected.row + 1}, COLUMN {selected.column + 1}</p><p>max({values.join(', ')}) = <strong>{Math.max(...values)}</strong> · retain the largest of the four values.</p></div><p className="vpool-note">Only complete 2 × 2 windows are pooled. The last row and column of this 5 × 5 map are <b>not used</b>; no extra padding is added. Pooling has no learned parameters here.</p>
    </section>
    <section className="vpool-loss"><div><p className="vpool-eyebrow">WHAT POOLING LOSES</p><h2>Different windows, same maximum</h2><p>Downsampling makes a smaller map but loses spatial detail. An <b>average</b> adds the values and divides by their count; here it distinguishes these two windows.</p></div><div className="vpool-comparisons">{comparisonWindows.map((window, index) => <div className="vpool-comparison" key={index}><b>Window {index === 0 ? 'A' : 'B'}</b><div className="vpool-mini">{window.map((value, i) => <span key={i}>{value}</span>)}</div><p>max = <b>{Math.max(...window)}</b></p><p>average = <Fraction numerator={window.reduce((a,b) => a + b, 0)} denominator={4} /> = <b>{average(window)}</b></p></div>)}</div><p className="vpool-caution">Pooling does not guarantee the same result for every shift of an image.</p></section>
  </article>
}
