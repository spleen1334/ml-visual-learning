import { useId, useState } from 'react'
import { calculateKnn, knnColors, knnFeatures, knnOutcomes, knnTracks } from './knnWorkbook'
import './KnnWorkbookCase.css'

type Result = ReturnType<typeof calculateKnn>
const ticks = Array.from({ length: 13 }, (_, index) => index * 10 - 10)
const plotX = (value: number) => 54 + (value + 10) * 3
const plotY = (value: number) => 378 - (value + 10) * 3
const scalingExamples = [{ index: 6, unit: 'BPM' }, { index: 7, unit: 'seconds' }].map(({ index, unit }) => ({
  feature: knnFeatures[index], unit,
  min: Math.min(...knnTracks.map(track => track.raw[index])),
  max: Math.max(...knnTracks.map(track => track.raw[index])),
}))

function WorkbookChart({ result, xFeature, yFeature, x, y, k, nearest }: {
  result: Result | null; xFeature: number; yFeature: number; x: number; y: number; k: string; nearest: boolean
}) {
  const clipId = useId()
  const title = nearest ? `${k || '−'} nearest neighbors` : 'Full sample'
  // Keep the full sample visible while an input cell is being cleared/replaced.
  const points = result?.points ?? knnTracks.map(track => ({ ...track, x: track.scaled[xFeature], y: track.scaled[yFeature], included: false, rank: 0, distance: 0 }))
  return <figure className="knn-sheet__chart">
    <figcaption>{title}</figcaption>
    <svg viewBox="0 0 440 430" role="img" aria-label={`${title}: ${knnFeatures[xFeature]} versus ${knnFeatures[yFeature]}`}>
      <defs><clipPath id={clipId}><rect x="54" y="18" width="360" height="360" /></clipPath></defs>
      <rect x="54" y="18" width="360" height="360" fill="#404040" />
      {ticks.map(tick => <g key={tick} className="knn-sheet__tick">
        <line x1={plotX(tick)} x2={plotX(tick)} y1="18" y2="378" />
        <line x1="54" x2="414" y1={plotY(tick)} y2={plotY(tick)} />
        <text x={plotX(tick)} y="397" textAnchor="middle">{tick}</text>
        <text x="44" y={plotY(tick) + 4} textAnchor="end">{tick}</text>
      </g>)}
      <g clipPath={`url(#${clipId})`}>
        {nearest && result && result.points.filter(point => point.included).map(point => <line key={`line-${point.id}`} className="knn-sheet__connector" x1={plotX(x)} y1={plotY(y)} x2={plotX(point.x)} y2={plotY(point.y)} />)}
        {points.map(point => <circle key={point.id} data-track={point.id} data-neighbor={nearest && point.included ? 'true' : undefined} cx={plotX(point.x)} cy={plotY(point.y)} r="3.3" fill={!nearest && point.outcome === 'Skipped' ? '#e46666' : !nearest || point.included ? knnColors[point.outcome] : '#4b4b4b'}>
          <title>{point.title} · {point.artist} · {point.outcome}{'\n'}{knnFeatures[xFeature]}: {point.x.toFixed(3)}; {knnFeatures[yFeature]}: {point.y.toFixed(3)}{result ? `\nDistance: ${point.distance.toFixed(3)} · Rank: ${point.rank}` : ''}</title>
        </circle>)}
        {nearest && result && <circle className="knn-sheet__query" cx={plotX(x)} cy={plotY(y)} r="8"><title>Unobserved value: {knnFeatures[xFeature]} {x}, {knnFeatures[yFeature]} {y}</title></circle>}
      </g>
      <text className="knn-sheet__axis" x="234" y="423" textAnchor="middle">{knnFeatures[xFeature]}</text>
      <text className="knn-sheet__axis" transform="translate(14 198) rotate(-90)" textAnchor="middle">{knnFeatures[yFeature]}</text>
    </svg>
  </figure>
}

export function KnnWorkbookCase() {
  const [xFeature, setXFeature] = useState(6)
  const [yFeature, setYFeature] = useState(2)
  const [xText, setXText] = useState('25')
  const [yText, setYText] = useState('50')
  const [kText, setKText] = useState('20')
  const x = Number(xText), y = Number(yText), k = Number(kText)
  const validValues = xText.trim() !== '' && yText.trim() !== '' && Number.isFinite(x) && Number.isFinite(y)
  const validK = kText.trim() !== '' && Number.isInteger(k) && k >= 0 && k <= 100
  const result = validValues && validK ? calculateKnn(knnTracks, xFeature, yFeature, x, y, k) : null
  const chartProps = { result, xFeature, yFeature, x, y, k: validK ? String(k) : '' }

  return <article className="cnb knn-sheet" aria-labelledby="cnb-lesson-4-title">
    <header className="cnb__header">
      <p className="cnb__eyebrow">Chapter 09 · Classification Models · 9.4</p>
      <h1 id="cnb-lesson-4-title">Case study: K-nearest neighbors</h1>
      <p>Imagine a randomly chosen Spotify user and their 100 most-played songs. Use their listening behavior and two song attributes to predict whether they will skip, listen to, or favorite an unobserved track.</p>
    </header>
    <div className="knn-sheet__workspace">
      <section className="knn-sheet__data" aria-labelledby="knn-data-title">
        <h2 id="knn-data-title" className="knn-sheet__bar">Spotify top 100 songs (2019)</h2>
        <div className="knn-sheet__table-scroll" tabIndex={0} role="region" aria-label="100 source tracks; scroll for all rows and feature columns">
          <table>
            <thead><tr><th scope="col" className="knn-sheet__track">Song title</th><th scope="col">Artist</th><th scope="col">Genre</th>{knnFeatures.map(feature => <th scope="col" key={feature}>{feature}</th>)}<th scope="col" className="knn-sheet__outcome">Outcome</th>{knnFeatures.map((feature, index) => <th scope="col" key={`scaled-${feature}`} className={`knn-sheet__scaled-column ${index === xFeature || index === yFeature ? 'is-feature' : ''}`} title="Scaled values (1–100)">{feature} (scaled)</th>)}</tr></thead>
            <tbody>{knnTracks.map(track => <tr key={track.id}>
              <th scope="row" className="knn-sheet__track" title={`${track.title} · ${track.artist}`}>{track.title}</th>
              <td>{track.artist}</td><td>{track.genre}</td>
              {track.raw.map((value, index) => <td key={index} title={String(value)}>{value.toFixed(0)}</td>)}
              <td className={`knn-sheet__outcome knn-sheet__outcome--${track.outcome.toLowerCase()}`}>{track.outcome}</td>
              {track.scaled.map((value, index) => <td key={`scaled-${index}`} title={String(value)} className={index === xFeature || index === yFeature ? 'is-feature' : ''}>{value.toFixed(0)}</td>)}
            </tr>)}</tbody>
          </table>
        </div>
        <aside className="knn-sheet__scaling" aria-labelledby="knn-scaling-title">
          <div><h2 id="knn-scaling-title">Why scale the values?</h2><p>KNN compares distances between songs. Scaling each attribute to the same <strong>1–100 range</strong> makes the values comparable, so larger numbers or different units don’t dominate the distance calculation. It also makes the table and charts easier to read together.</p></div>
          <figure className="knn-sheet__scaling-diagram"><figcaption>Original ranges → shared scale</figcaption>{scalingExamples.map(example => <div key={example.feature}><span><strong>{example.feature}</strong><small>≈ {Math.round(example.min)}–{Math.round(example.max)} {example.unit}</small></span><b aria-hidden="true">→</b><span className="knn-sheet__scaled-range"><strong>1–100</strong><small>Scaled values</small></span></div>)}<small>Workbook ranges rounded for display; each feature is scaled separately.</small></figure>
        </aside>
      </section>
      <section className="knn-sheet__model" aria-label="KNN inputs, predicted outcome and charts">
        <div className="knn-sheet__top">
          <fieldset className="knn-sheet__inputs">
            <legend className="knn-sheet__bar">Unobserved value</legend>
            <div className="knn-sheet__input-cells">
              <div><select aria-label="Horizontal feature" value={xFeature} onChange={event => setXFeature(Number(event.target.value))}>{knnFeatures.map((feature, index) => <option key={feature} value={index}>{feature}</option>)}</select><input aria-label="Horizontal unobserved value" type="number" step="any" value={xText} aria-invalid={!validValues} onChange={event => setXText(event.target.value)} /></div>
              <div><select aria-label="Vertical feature" value={yFeature} onChange={event => setYFeature(Number(event.target.value))}>{knnFeatures.map((feature, index) => <option key={feature} value={index}>{feature}</option>)}</select><input aria-label="Vertical unobserved value" type="number" step="any" value={yText} aria-invalid={!validValues} onChange={event => setYText(event.target.value)} /></div>
              <label><span># Neighbors</span><input aria-label="Number of neighbors" type="number" min="0" max="100" step="1" value={kText} aria-invalid={!validK} onChange={event => setKText(event.target.value)} /></label>
            </div>
          </fieldset>
          <svg className="knn-sheet__flow" viewBox="0 0 34 76" aria-hidden="true"><path d="M2 10 H29 M24 6 L30 10 L24 14 M5 10 C5 50 10 65 29 65 M24 61 L30 65 L24 69" /></svg>
          <section className="knn-sheet__results" aria-labelledby="knn-outcome-title" aria-live="polite" aria-atomic="true">
            <h2 id="knn-outcome-title" className="knn-sheet__bar">Predicted outcome</h2>
            <div className="knn-sheet__counts">{knnOutcomes.map((outcome, index) => <div key={outcome}><span>{outcome}</span><strong className={`knn-sheet__outcome--${outcome.toLowerCase()}`}>{result ? result.counts[index] : '−'}</strong></div>)}</div>
            <div className="knn-sheet__prediction"><strong className={result?.outcome ? `knn-sheet__outcome--${result.outcome.toLowerCase()}` : ''}>{result?.prediction ?? '−'}</strong><div><span>Confidence:</span><b>{result?.confidence != null ? `${Math.round(result.confidence * 100)}%` : '−'}</b></div></div>
          </section>
        </div>
        {(!validK || !validValues) && <p className="knn-sheet__error" role="status">{!validK ? 'Enter a whole number of neighbors from 0 to 100.' : 'Enter both unobserved values.'}</p>}
        <div className="knn-sheet__charts"><WorkbookChart {...chartProps} nearest={false} /><WorkbookChart {...chartProps} nearest /></div>
      </section>
    </div>
  </article>
}
