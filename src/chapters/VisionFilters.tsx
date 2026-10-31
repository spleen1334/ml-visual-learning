import { useEffect, useState } from 'react'
import { PlaybackButton } from '../components/PlaybackButton'
import { filterImage as filterImage5x5, visionFilters, filterWindow, filterOutput } from './visionFiltersData'
import './VisionFilters.css'

const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const number = (value: number) => Number.isInteger(value) ? String(value) : value.toFixed(2)
const inputColor = (value: number) => `rgb(${255 - value * 75}, ${255 - value * 75}, ${255 - value * 75})`
const responseColor = (value: number, signed: boolean) => {
  if (!signed) { const shade = Math.round(255 - value / 2 * 150); return `rgb(${shade}, ${shade}, ${shade})` }
  const strength = Math.min(Math.abs(value) / 6, 1)
  const mix = (end: number) => Math.round(255 + (end - 255) * strength)
  return value < 0 ? `rgb(${mix(63)}, ${mix(107)}, ${mix(174)})` : `rgb(${mix(194)}, ${mix(75)}, ${mix(50)})`
}
const responseTextColor = (background: string) => {
  const channels = background.match(/\d+/g)!.map(value => {
    const channel = Number(value) / 255
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  })
  const luminance = 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
  return (1.05 / (luminance + 0.05)) >= ((luminance + 0.05) / 0.05) ? '#fff' : '#000'
}

export function VisionFilters() {
  const [filterIndex, setFilterIndex] = useState(0)
  const [step, setStep] = useState(() => reducedMotion() ? 8 : 0)
  const [playing, setPlaying] = useState(false)
  const [reduce, setReduce] = useState(reducedMotion)
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => { setReduce(media.matches); if (media.matches) { setPlaying(false); setStep(8) } }
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  useEffect(() => {
    if (!playing || reduce) return
    if (step === 8) { setPlaying(false); return }
    const timer = window.setTimeout(() => setStep(current => current + 1), 1200)
    return () => window.clearTimeout(timer)
  }, [step, playing, reduce])
  const select = (next: number) => { setPlaying(false); setStep(next) }
  const filter = visionFilters[filterIndex]
  const row = Math.floor(step / 3), column = step % 3
  const windowResult = filterWindow(filterImage5x5, filter, row, column)
  const output = filterOutput(filterImage5x5, filter)
  const signed = filter.id !== 'blur'
  return <article className="vf-lesson"><header className="vf-header"><p className="vf-eyebrow">98.4 · Computer Vision</p><h1>A filter slides over an image</h1><p className="vf-definition">A <strong>filter</strong> looks at a small neighborhood of pixels and combines them to make a new value.</p><p>A filter's numbers form a <b>kernel</b>. The resulting grid of values is a <b>feature map</b>.</p></header>
    <section className="vf-panel" aria-labelledby="vf-title"><div className="vf-heading"><div><p className="vf-eyebrow">ONE WINDOW · NINE PRODUCTS</p><h2 id="vf-title">Follow the filter across the image</h2></div><p>Select an output cell to move the highlighted 3 × 3 neighborhood, or play through all nine positions.</p></div>
      <div className="vf-choices" role="group" aria-label="Choose a filter">{visionFilters.map((item, i) => <button key={item.id} type="button" aria-pressed={filterIndex === i} onClick={() => { setPlaying(false); setFilterIndex(i) }}><b>{item.name}</b><small>{item.id === 'blur' ? 'Average neighbors' : item.id === 'x' ? 'Left-to-right change' : 'Top-to-bottom change'}</small></button>)}</div>
      <p className="vf-filter-description">{filter.id === 'blur' ? 'Blur averages nearby intensities, smoothing local differences.' : filter.id === 'x' ? 'The x-gradient measures left-to-right change and responds to vertical edges.' : 'The y-gradient measures top-to-bottom change and responds to horizontal edges.'}</p>
      <div className="vf-flow"><div className="vf-stage"><p className="vf-kicker">INPUT · 5 × 5</p><div className="vf-grid vf-input-grid">{filterImage5x5.map((values, y) => values.map((value, x) => <span key={`${y}-${x}`} className={y >= row && y < row + 3 && x >= column && x < column + 3 ? 'vf-window' : ''} style={{ backgroundColor: inputColor(value) }}>{value}</span>))}</div><p>Grayscale intensity · 0–2 units<br />White = 0, dark gray = 2</p></div><span className="vf-arrow" aria-hidden="true">→</span>
      <div className="vf-stage"><p className="vf-kicker">KERNEL · 3 × 3{filter.divisor === 9 ? ' NUMERATORS' : ''}</p><div className="vf-grid vf-three">{filter.kernel.map((values, y) => values.map((value, x) => <span key={`${y}-${x}`}>{value}</span>))}</div><p>{filter.divisor === 9 ? 'Each actual weight is 1 ÷ 9.' : 'Signed weights detect changes.'}</p></div><span className="vf-arrow" aria-hidden="true">→</span>
      <div className="vf-stage"><p className="vf-kicker">FEATURE MAP · 3 × 3</p><div className="vf-grid vf-three" role="group" aria-label="Choose an output cell">{output.map((values, y) => values.map((value, x) => { const background = responseColor(value, signed); return <button key={`${y}-${x}`} type="button" aria-pressed={step === y * 3 + x} aria-label={`Output row ${y + 1}, column ${x + 1}: ${number(value)}`} style={{ backgroundColor: background, color: responseTextColor(background) }} onClick={() => select(y * 3 + x)}>{number(value)}</button> }))}</div><p>{signed ? 'Blue = negative · white = 0 · red = positive; scale −6 to +6.' : 'Gray intensity · 0–2 units; white = 0, darker = higher.'}</p></div></div>
      <div className="vf-playback" role="group" aria-label="Filter window playback"><PlaybackButton action="previous" label="Previous window" disabled={step === 0} onClick={() => select(step - 1)} /><PlaybackButton action={playing ? 'pause' : step === 8 ? 'replay' : 'play'} label={reduce ? 'Autoplay disabled: reduced motion is preferred' : playing ? 'Pause filter' : step === 8 ? 'Replay filter' : 'Play filter'} disabled={reduce} aria-pressed={playing} onClick={() => { if (step === 8) setStep(0); setPlaying(!playing) }} /><PlaybackButton action="next" label="Next window" disabled={step === 8} onClick={() => select(step + 1)} /><span role="status">Position {step + 1} of 9{reduce ? ' · Reduced motion: select any cell manually.' : ''}</span></div>
      <div className="vf-calculation" aria-live="polite"><div><p className="vf-kicker">OUTPUT ROW {row + 1}, COLUMN {column + 1}</p><h3>Multiply and add</h3><p>{filter.divisor === 9 ? 'Multiply each pixel by its matching numerator, add the products, then divide by 9. This gives the weighted sum.' : <>Multiply each neighborhood value by its matching kernel weight, then add the nine products. This is a <b>weighted sum</b>.</>}</p></div><div><div className="vf-products" aria-label="Nine pixel times kernel products">{windowResult.products.map((values, y) => values.map((product, x) => <span key={`${y}-${x}`}><small>{filterImage5x5[row + y][column + x]} × {filter.kernel[y][x]}</small><b>{product}</b></span>))}</div><p className="vf-result">Sum = <b>{windowResult.sum}</b>{filter.divisor === 9 ? <> · average = <span className="vf-fraction"><span>{windowResult.sum}</span><span>9</span></span> = <b>{number(windowResult.value)}</b></> : <> · response = <b>{number(windowResult.value)}</b></>}</p></div></div>
      <p className="vf-note">The kernel is not flipped here: this operation is <b>cross-correlation</b>, commonly called convolution in CNNs. For edge filters, zero means no response to this filter; the sign indicates the direction of change, not an error. The map shows exact signed values; decimal blur values are rounded for display.</p>
    </section></article>
}
