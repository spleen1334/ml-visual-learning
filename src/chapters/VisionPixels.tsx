import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { visionScene } from './visionScene'
import { editChannel, grayscale, scaleByte, type PixelImage } from './visionPixels'
import './VisionPixels.css'

const views = ['RGB', 'Red', 'Green', 'Blue', 'Grayscale'] as const
const channels = ['Red', 'Green', 'Blue'] as const
type View = typeof views[number]

function ChannelInput({ channel, value, onValue }: { channel: string; value: number; onValue: (value: number) => void }) {
  const [draft, setDraft] = useState(String(value))
  useEffect(() => setDraft(String(value)), [value])
  return <label><span>{channel}</span><input type="number" min="0" max="255" step="1" value={draft} onChange={event => { const next = event.currentTarget.value; setDraft(next); if (next !== '' && Number.isInteger(Number(next)) && Number(next) >= 0 && Number(next) <= 255) onValue(Number(next)) }} onBlur={() => setDraft(String(value))} /><small>÷ 255 = {scaleByte(value).toFixed(3)}</small></label>
}

export function VisionPixels() {
  const [image, setImage] = useState<PixelImage>(visionScene.pixels)
  const [row, setRow] = useState(1)
  const [column, setColumn] = useState(1)
  const [view, setView] = useState<View>('RGB')
  const grid = useRef<HTMLDivElement>(null)
  const pixel = image[row][column]
  const move = (event: KeyboardEvent<HTMLButtonElement>) => {
    const offsets: Record<string, [number, number]> = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] }
    const offset = offsets[event.key]
    if (!offset) return
    event.preventDefault()
    const nextRow = Math.max(0, Math.min(5, row + offset[0]))
    const nextColumn = Math.max(0, Math.min(5, column + offset[1]))
    setRow(nextRow); setColumn(nextColumn)
    grid.current?.querySelector<HTMLButtonElement>(`[data-row="${nextRow}"][data-column="${nextColumn}"]`)?.focus()
  }
  return <article className="vp-lesson">
    <header className="vp-header"><p className="vp-eyebrow">98.2 · Computer Vision</p><h1>An image is a grid of numbers</h1><p className="vp-definition">An image is made of <strong>pixels</strong>: tiny colored cells arranged in a grid.</p></header>
    <div className="vp-terms"><p><b>Resolution</b> is the grid's width and height in pixels.</p><p><b>RGB</b> uses red, green and blue values for each pixel; <b>grayscale</b> uses one brightness value.</p><p>A <b>tensor</b> is a numerical array with dimensions, such as rows × columns × color channels.</p></div>
    <section className="vp-panel" aria-labelledby="vp-title"><div className="vp-heading"><div><p className="vp-eyebrow">ONE IMAGE · MANY NUMBERS</p><h2 id="vp-title">Inspect a pixel</h2></div><p>Select a cell, then change its channels. Use arrow keys to move around the grid.</p></div>
      <div className="vp-views" role="group" aria-label="Image view">{views.map(item => <button key={item} type="button" aria-pressed={view === item} onClick={() => setView(item)}>{item}</button>)}</div>
      <div className="vp-layout"><div className="vp-image"><p className="vp-kicker">{view.toUpperCase()} VIEW · ROWS AND COLUMNS 0–5</p><div className="vp-column-labels" aria-hidden="true"><span />{Array.from({ length: 6 }, (_, i) => <span key={i}>{i}</span>)}</div><div ref={grid} className="vp-grid" role="group" aria-label="Image pixels"><div className="vp-row-labels" aria-hidden="true">{Array.from({ length: 6 }, (_, i) => <span key={i}>{i}</span>)}</div><div className="vp-cells">{image.map((pixels, y) => pixels.map((rgb, x) => {
        const value = view === 'Grayscale' ? grayscale(rgb) : view === 'RGB' ? null : rgb[channels.indexOf(view)]
        const color = value === null ? `rgb(${rgb.join(',')})` : `rgb(${value},${value},${value})`
        return <button type="button" key={`${y}-${x}`} data-row={y} data-column={x} tabIndex={row === y && column === x ? 0 : -1} aria-label={`Row ${y}, column ${x}: RGB ${rgb.join(', ')}`} aria-pressed={row === y && column === x} style={{ backgroundColor: color }} onClick={() => { setRow(y); setColumn(x) }} onKeyDown={move} />
      }))}</div></div><p className="vp-image-note">{view === 'RGB' ? 'Original colors, including any edits.' : view === 'Grayscale' ? 'One weighted brightness value per pixel.' : `${view} channel shown as brightness: 0 is black, 255 is white.`}</p></div>
      <div className="vp-inspector" aria-live="polite"><p className="vp-kicker">SELECTED PIXEL · ROW {row}, COLUMN {column}</p><h3>RGB bytes: ({pixel.join(', ')})</h3><p>Each channel is a whole number from 0 to 255. Edit one to change only this pixel.</p><div className="vp-channels">{channels.map((channel, index) => <ChannelInput key={`${row}-${column}-${channel}`} channel={channel} value={pixel[index]} onValue={value => setImage(current => editChannel(current, row, column, index, value))} />)}</div><button type="button" className="vp-reset" onClick={() => setImage(visionScene.pixels)}>Reset image</button>
      <div className="vp-calculation"><b>Grayscale for this pixel</b><div className="vp-formula" aria-label={`Round the quantity 299 times ${pixel[0]} plus 587 times ${pixel[1]} plus 114 times ${pixel[2]}, divided by 1000: ${grayscale(pixel)}`}><span>round (</span><span className="vp-fraction"><span>299 × {pixel[0]} + 587 × {pixel[1]} + 114 × {pixel[2]}</span><span>1000</span></span><span>) = <strong>{grayscale(pixel)}</strong></span></div><small>These weights combine the three channels into one brightness value.</small></div></div></div>
      <div className="vp-dimensions"><p><b>RGB tensor</b> · 6 rows × 6 columns × 3 channels = <strong>108 values</strong></p><p><b>Grayscale</b> · 6 × 6 × 1 = <strong>36 values</strong></p></div><p className="vp-footnote">Dividing each byte by 255 scales it to 0–1. This is different from mean/std standardization, which subtracts a mean and divides by a standard deviation. Edits are exploratory; no model or annotations are updated.</p>
    </section>
  </article>
}
