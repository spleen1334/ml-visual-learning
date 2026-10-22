import planeViews from '../assets/regression-modeling-218.png'
import listings from '../assets/regression-modeling-219.png'
import predictions from '../assets/regression-modeling-221.png'
import './RegressionModeling.css'
import './RegressionMultiple.css'

const formulas = [
  {
    model: 'Model 1',
    inputs: <><strong>Accommodation (X₁)</strong></>,
    equation: <>Y = 55.71 + (16.6 × X₁)</>,
  },
  {
    model: 'Model 2',
    inputs: <><strong>Accommodation (X₁)</strong> and <strong>bedrooms (X₂)</strong></>,
    equation: <>Y = 52.59 + (15.4 × X₁) + (5.1 × X₂)</>,
  },
  {
    model: 'Model 3',
    inputs: <><strong>Accommodation (X₁)</strong>, <strong>bedrooms (X₂)</strong>, and <strong>room type</strong>: entire place (X₃), hotel room (X₄), private room (X₅)</>,
    equation: <>Y = 43.82 + (5.7 × X₁) + (5.1 × X₂) + (63.7 × X₃) + (65.4 × X₄) + (9.8 × X₅)</>,
  },
  {
    model: 'Model 4',
    inputs: <>Model 3 inputs plus <strong>district</strong>: Manhattan (X₆) and Brooklyn (X₇)</>,
    equation: <>Y = 26.1 + (6.3 × X₁) + (6.7 × X₂) + (60.5 × X₃) + (54.5 × X₄) + (10.6 × X₅) + (28.5 × X₆) + (9.8 × X₇)</>,
  },
]

const trainingSse = [
  { model: 'Model 1', value: '226,577' },
  { model: 'Model 2', value: '224,259' },
  { model: 'Model 3', value: '172,201' },
  { model: 'Model 4', value: '158,591' },
]

function SourceFigure({ src, alt, caption, className = '', scroll = false }: { src: string; alt: string; caption: string; className?: string; scroll?: boolean }) {
  return <figure className={`rm-multiple-figure ${className}`}>
    {scroll ? <div className="rm-multiple-figure__scroll"><img src={src} alt={alt} /></div> : <img src={src} alt={alt} />}
    <figcaption>{caption}</figcaption>
  </figure>
}

export function RMMultiple() {
  return <article className="regression-modeling regression-multiple" aria-labelledby="rmm-title">
    <header>
      <p className="rm-eyebrow">Chapter 13 · Lesson 13.6</p>
      <h1 id="rmm-title">Multiple linear regression</h1>
      <p>Predict one numerical outcome from several independent variables, each with its own coefficient.</p>
    </header>

    <section className="rm-panel rm-multiple-equation" aria-labelledby="rmm-equation-title">
      <h2 id="rmm-equation-title">One target, several inputs</h2>
      <p className="rm-multiple-equation__formula"><var>y</var> = α + β₁<var>x</var>₁ + β₂<var>x</var>₂ + β₃<var>x</var>₃ + … + βₙ<var>x</var>ₙ + ε</p>
      <dl className="rm-multiple-symbols">
        <div><dt><var>y</var></dt><dd>numerical dependent variable (target)</dd></div>
        <div><dt>α</dt><dd>y-intercept</dd></div>
        <div><dt>βᵢ</dt><dd>coefficient for input <var>x</var>ᵢ</dd></div>
        <div><dt>ε</dt><dd>error or residual</dd></div>
      </dl>
    </section>

    <section className="rm-panel" aria-labelledby="rmm-plane-title">
      <div>
        <h2 id="rmm-plane-title">With two inputs, the fitted line becomes a plane</h2>
        <p>Each purple point is an observed value. The plane shows fitted values across two inputs; the two views reveal its shape from different angles.</p>
      </div>
      <SourceFigure
        src={planeViews}
        className="rm-multiple-plane-figure"
        alt="Two source views of a fitted plane through a three-dimensional scatterplot. The horizontal inputs are X1 and X2, the vertical target is Y, observed points are purple, and the fitted plane is shaded green to turquoise."
        caption="With more than two independent variables, the model still works, but a chart cannot show all input dimensions at once."
      />
    </section>

    <section className="rm-panel" aria-labelledby="rmm-data-title">
      <div>
        <h2 id="rmm-data-title">Estimate an Airbnb listing price</h2>
        <p>The source example uses listing details to predict nightly price. Each row is one listing; the price column is the observed target.</p>
      </div>
      <SourceFigure
        src={listings}
        className="rm-multiple-listings-figure"
        scroll
        alt="The source Airbnb listing table. Columns show list ID, New York city, district, room type, accommodates, bedrooms, one-hot room and district indicators, and observed nightly price."
        caption="Listing records and the input fields used in the four models. Scroll right to see all fields; the source table continues beyond the visible rows."
      />
    </section>

    <section className="rm-panel" aria-labelledby="rmm-formulas-title">
      <div>
        <h2 id="rmm-formulas-title">Four models add inputs step by step</h2>
        <p>In each formula, <strong>Y is the predicted nightly price</strong>. Each model selects more independent variables (input columns) from the listing table: accommodation, then bedrooms, room type, and district.</p>
      </div>
      <ol className="rm-multiple-formulas">
        {formulas.map(({ model, inputs, equation }) => <li key={model}>
          <h3>{model}</h3>
          <p>{inputs}</p>
          <div className="rm-multiple-formula" aria-label={`${model} prediction formula`}>{equation}</div>
        </li>)}
      </ol>
    </section>

    <section className="rm-panel" aria-labelledby="rmm-predictions-title">
      <div>
        <h2 id="rmm-predictions-title">Predictions for the same listings</h2>
        <p>Compare each model’s predicted price with the observed price in the table.</p>
      </div>
      <SourceFigure
        src={predictions}
        className="rm-multiple-predictions-figure"
        scroll
        alt="Source prediction table for Airbnb listings, showing listing inputs and observed price beside the predicted prices from Models 1 through 4."
        caption="The same source listings are scored by each model. Scroll right to compare all four prediction columns."
      />
      <div className="rm-multiple-sse" aria-label="Training sum of squared error for each model">
        <h3>Training sum of squared error (SSE)</h3>
        <dl>{trainingSse.map(({ model, value }) => <div key={model}><dt>{model}</dt><dd>{value}</dd></div>)}</dl>
      </div>
      <p><strong>As these four models add more independent variables, the training error falls: SSE drops from 226,577 to 158,591.</strong></p>
      <p className="rm-note">Lower SSE means a closer fit to these training records. More variables do not guarantee better predictions for unseen listings; held-out evaluation is needed for that.</p>
    </section>
  </article>
}
