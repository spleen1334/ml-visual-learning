import { useState } from 'react'
import './RegressionModeling.css'
import './RegressionMultiple.css'

type Feature = 'guests' | 'bedrooms' | 'entire' | 'hotel' | 'private' | 'manhattan' | 'brooklyn'
type Listing = {
  id: string
  guests: number
  bedrooms: number
  room: 'private' | 'entire' | 'hotel'
  district: 'Brooklyn' | 'Manhattan'
  observed: number
}
type Model = {
  name: string
  formula: string
  intercept: number
  coefficients: Partial<Record<Feature, number>>
  sse: number
}

const listings: Listing[] = [
  { id: '5121', guests: 2, bedrooms: 1, room: 'private', district: 'Brooklyn', observed: 60 },
  { id: '5178', guests: 2, bedrooms: 1, room: 'private', district: 'Manhattan', observed: 79 },
]

const models: Model[] = [
  { name: 'M1 · guests', formula: '55.71 + 16.6 × guests', intercept: 55.71, coefficients: { guests: 16.6 }, sse: 226577 },
  { name: 'M2 · guests + bedrooms', formula: '52.59 + 15.4 × guests + 5.1 × bedrooms', intercept: 52.59, coefficients: { guests: 15.4, bedrooms: 5.1 }, sse: 224259 },
  { name: 'M3 · room type', formula: '43.82 + 5.7 × guests + 5.1 × bedrooms + 63.7 × entire + 65.4 × hotel + 9.8 × private', intercept: 43.82, coefficients: { guests: 5.7, bedrooms: 5.1, entire: 63.7, hotel: 65.4, private: 9.8 }, sse: 172201 },
  { name: 'M4 · district', formula: '26.1 + 6.3 × guests + 6.7 × bedrooms + 60.5 × entire + 54.5 × hotel + 10.6 × private + 28.5 × Manhattan + 9.8 × Brooklyn', intercept: 26.1, coefficients: { guests: 6.3, bedrooms: 6.7, entire: 60.5, hotel: 54.5, private: 10.6, manhattan: 28.5, brooklyn: 9.8 }, sse: 158591 },
]

const featureLabels: Record<Feature, string> = {
  guests: 'Guests', bedrooms: 'Bedrooms', entire: 'Entire home', hotel: 'Hotel room', private: 'Private room', manhattan: 'Manhattan', brooklyn: 'Brooklyn',
}

function featureValues(listing: Listing): Record<Feature, number> {
  return {
    guests: listing.guests,
    bedrooms: listing.bedrooms,
    entire: Number(listing.room === 'entire'),
    hotel: Number(listing.room === 'hotel'),
    private: Number(listing.room === 'private'),
    manhattan: Number(listing.district === 'Manhattan'),
    brooklyn: Number(listing.district === 'Brooklyn'),
  }
}

function money(value: number) { return `$${value.toFixed(2)}` }

function Plane({ model, listing }: { model: Model; listing: Listing }) {
  const values = featureValues(listing)
  const categoryOffset = model.intercept + Object.entries(model.coefficients).reduce((total, [feature, coefficient]) => {
    return feature === 'guests' || feature === 'bedrooms' ? total : total + (coefficient ?? 0) * values[feature as Feature]
  }, 0)
  const guestsSlope = model.coefficients.guests ?? 0
  const bedroomSlope = model.coefficients.bedrooms ?? 0
  const z = (guests: number, bedrooms: number) => categoryOffset + guestsSlope * guests + bedroomSlope * bedrooms
  const project = (guests: number, bedrooms: number) => {
    const price = z(guests, bedrooms)
    return [60 + guests * 29 + bedrooms * 18, 198 - guests * 5 - bedrooms * 13 - (price - 50) * 0.36] as const
  }
  const guestLines = [0, 1, 2, 3, 4, 5, 6].map(guests => {
    const [x1, y1] = project(guests, 0)
    const [x2, y2] = project(guests, 4)
    return `M${x1},${y1} L${x2},${y2}`
  })
  const bedroomLines = [0, 1, 2, 3, 4].map(bedrooms => {
    const [x1, y1] = project(0, bedrooms)
    const [x2, y2] = project(6, bedrooms)
    return `M${x1},${y1} L${x2},${y2}`
  })
  const [pointX, pointY] = project(listing.guests, listing.bedrooms)
  const [guestAxisX, guestAxisY] = project(6, 0)
  const [bedroomAxisX, bedroomAxisY] = project(0, 4)
  const [priceAxisX, priceAxisY] = project(0, 0)

  return <svg className="rm-multiple-plane" viewBox="0 0 360 245" role="img" aria-label={`Three dimensional fitted plane for ${model.name}, with guests, bedrooms, and predicted nightly price axes`}>
    <path className="rm-multiple-plane-fill" d={`M${project(0, 0).join(',')} L${project(6, 0).join(',')} L${project(6, 4).join(',')} L${project(0, 4).join(',')} Z`} />
    {guestLines.map((path, index) => <path key={`g${index}`} className="rm-multiple-grid" d={path} />)}
    {bedroomLines.map((path, index) => <path key={`b${index}`} className="rm-multiple-grid" d={path} />)}
    <path className="rm-multiple-axis" d={`M${project(0, 0).join(',')} L${guestAxisX},${guestAxisY}`} />
    <path className="rm-multiple-axis" d={`M${project(0, 0).join(',')} L${bedroomAxisX},${bedroomAxisY}`} />
    <path className="rm-multiple-axis" d={`M${project(0, 0).join(',')} L${priceAxisX},${priceAxisY - 45}`} />
    <circle className="rm-multiple-point" cx={pointX} cy={pointY} r="6" />
    <text x={guestAxisX - 4} y={guestAxisY + 21} textAnchor="end">Guests</text>
    <text x={bedroomAxisX - 5} y={bedroomAxisY + 3} textAnchor="end">Bedrooms</text>
    <text x={priceAxisX - 5} y={priceAxisY - 50} textAnchor="end">Price · $</text>
    <text className="rm-multiple-point-label" x={pointX + 8} y={pointY - 7}>Listing {listing.id}</text>
  </svg>
}

export function RMMultiple() {
  const [modelIndex, setModelIndex] = useState(0)
  const [listingId, setListingId] = useState('5121')
  const model = models[modelIndex]
  const listing = listings.find(item => item.id === listingId) ?? listings[0]
  const values = featureValues(listing)
  const terms = Object.entries(model.coefficients) as [Feature, number][]
  const prediction = model.intercept + terms.reduce((sum, [feature, coefficient]) => sum + values[feature] * coefficient, 0)

  return <article className="regression-modeling" aria-labelledby="rmm-title">
    <header><p className="rm-eyebrow">Chapter 13 · Lesson 13.6</p><h1 id="rmm-title">Multiple linear regression</h1><p>Estimate one nightly price from several listing details. The model fits all coefficients together, so each coefficient describes its input while the other included inputs are accounted for.</p></header>
    <section className="rm-definition"><p className="rm-eyebrow">The central idea</p><h2>Multiple regression extends a line to several inputs: <strong>ŷ = α + β₁x₁ + β₂x₂ + … + βₙxₙ</strong>.</h2></section>

    <section className="rm-panel rm-multiple-panel">
      <div><h2>Build a price estimate from an Airbnb listing</h2><p>Choose a fitted model and one of two course examples. Follow each input’s contribution into the final price estimate.</p></div>
      <div className="rm-multiple-controls">
        <div><span className="rm-multiple-label">Fitted model</span><div className="rm-choice rm-multiple-models" role="group" aria-label="Choose an Airbnb price model">{models.map((item, index) => <button key={item.name} aria-pressed={modelIndex === index} onClick={() => setModelIndex(index)}>{item.name}</button>)}</div></div>
        <label className="rm-multiple-label" htmlFor="rm-listing">Listing example<select id="rm-listing" value={listingId} onChange={event => setListingId(event.target.value)}><option value="5121">ID 5121 · Brooklyn · observed $60</option><option value="5178">ID 5178 · Manhattan · observed $79</option></select></label>
      </div>

      <div className="rm-multiple-summary"><div><span>{model.name}</span><strong>Price = {model.formula}</strong></div><div className="rm-multiple-price"><span>Predicted nightly price</span><strong>{money(prediction)}</strong></div></div>

      <div className="rm-multiple-worked">
        <div className="rm-multiple-listing">
          <h3>Listing {listing.id}</h3>
          <p>{listing.guests} guests · {listing.bedrooms} bedroom · {listing.room} room · {listing.district}</p>
          <div className="rm-multiple-observed"><span>Observed nightly price</span><strong>{money(listing.observed)}</strong></div>
          <p className="rm-multiple-gap">Model estimate differs by <strong>{money(Math.abs(prediction - listing.observed))}</strong> for this example.</p>
        </div>
        <div className="rm-multiple-contributions">
          <h3>Trace the model’s contributions</h3>
          <div className="rm-multiple-term"><span>Intercept · starting value</span><b>—</b><strong>{money(model.intercept)}</strong></div>
          {terms.map(([feature, coefficient]) => {
            const value = values[feature]
            const contribution = value * coefficient
            const isIndicator = feature !== 'guests' && feature !== 'bedrooms'
            return <div className={`rm-multiple-term${isIndicator ? ' is-indicator' : ''}`} key={feature}>
              <span>{featureLabels[feature]}</span><b>{isIndicator ? `${value} × ${coefficient}` : `${value} × ${coefficient}`}</b><strong>{money(contribution)}</strong>
            </div>
          })}
          <div className="rm-multiple-total"><span>Estimated price</span><strong>{money(prediction)} / night</strong></div>
          {terms.some(([feature]) => feature !== 'guests' && feature !== 'bedrooms') && <p className="rm-note">Room and district fields are indicator variables: 1 means this listing has that category; 0 means it does not. A zero indicator contributes $0.</p>}
        </div>
      </div>

      <div className="rm-multiple-geometry">
        <div><h3>Two inputs form a fitted plane</h3><p>This three dimensional view uses guests and bedrooms as its horizontal inputs, with predicted nightly price as height. Other selected category indicators are held fixed for the chosen listing.</p><Plane model={model} listing={listing} /></div>
        <div className="rm-multiple-sse"><h3>Training fit across the nested models</h3><p>Each model adds another group of predictors. Compare their supplied training sum of squared errors (SSE): lower means less squared error on these training records.</p>
          {models.map(item => <div className="rm-multiple-sse-row" key={item.name}><span>{item.name.split(' · ')[0]}</span><div className="rm-multiple-sse-track" aria-label={`${item.name}, training SSE ${item.sse.toLocaleString()}`}><i style={{ width: `${(item.sse / models[0].sse) * 100}%` }} /></div><b>{item.sse.toLocaleString()}</b></div>)}
          <p className="rm-note">Because these OLS models are nested, adding predictors cannot increase training SSE. A lower training SSE alone does not prove better predictions for new listings; check performance on held out data.</p>
        </div>
      </div>
    </section>
    <aside className="rm-summary"><span>✓</span><p><strong>Remember:</strong> multiple regression adds up an intercept and one contribution per input. Coefficients describe fitted relationships conditional on the other included fields; they do not automatically establish cause and effect.</p></aside>
  </article>
}
