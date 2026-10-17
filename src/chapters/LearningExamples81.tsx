import './LearningExamples81.css'

const CUSTOMER_ACTIVITY = [
  { id: 'C-11', tenure: 2, sessions: 1, purchase: 'No' },
  { id: 'C-12', tenure: 4, sessions: 2, purchase: 'No' },
  { id: 'C-13', tenure: 3, sessions: 3, purchase: 'No' },
  { id: 'C-14', tenure: 12, sessions: 8, purchase: 'Yes' },
  { id: 'C-15', tenure: 15, sessions: 10, purchase: 'Yes' },
  { id: 'C-16', tenure: 9, sessions: 7, purchase: 'Yes' },
]

function CustomerRows({ includePurchase }: { includePurchase: boolean }) {
  return <div className="le81__table-scroll">
    <table className="le81__table">
      <caption>Past customers · each row is one record</caption>
      <thead><tr>
        <th scope="col">Customer</th>
        <th scope="col">Tenure · months</th>
        <th scope="col">Sessions · per week</th>
        {includePurchase && <th scope="col" className="le81__label-heading">Purchased?</th>}
      </tr></thead>
      <tbody>{CUSTOMER_ACTIVITY.map((customer) => <tr key={customer.id}>
        <th scope="row">{customer.id}</th>
        <td>{customer.tenure}</td>
        <td>{customer.sessions}</td>
        {includePurchase && <td className="le81__label-cell"><span className={`le81__label ${customer.purchase === 'Yes' ? 'is-yes' : 'is-no'}`}>{customer.purchase}</span></td>}
      </tr>)}</tbody>
    </table>
  </div>
}

function ActivityGroups() {
  const points = CUSTOMER_ACTIVITY.map((customer) => ({
    ...customer,
    x: 58 + customer.tenure * 27,
    y: 250 - customer.sessions * 17,
    group: customer.sessions <= 3 ? 'brief' : 'regular',
  }))

  return <figure className="le81__plot">
    <figcaption>Same kinds of inputs · possible grouping by activity</figcaption>
    <svg viewBox="0 0 600 300" role="img" aria-labelledby="le81-plot-title le81-plot-description">
      <title id="le81-plot-title">Customers grouped by tenure and weekly sessions</title>
      <desc id="le81-plot-description">Six unlabeled customer records appear in two activity groups. The lower-left group has shorter tenure and fewer weekly sessions; the upper-right group has longer tenure and more weekly sessions.</desc>
      <line className="le81__axis" x1="58" y1="250" x2="550" y2="250" />
      <line className="le81__axis" x1="58" y1="250" x2="58" y2="38" />
      <line className="le81__grid" x1="58" y1="182" x2="550" y2="182" />
      <line className="le81__grid" x1="58" y1="114" x2="550" y2="114" />
      <line className="le81__grid" x1="220" y1="38" x2="220" y2="250" />
      <line className="le81__grid" x1="382" y1="38" x2="382" y2="250" />
      <text className="le81__tick" x="51" y="255" textAnchor="end">0</text>
      <text className="le81__tick" x="51" y="187" textAnchor="end">4</text>
      <text className="le81__tick" x="51" y="119" textAnchor="end">8</text>
      <text className="le81__tick" x="51" y="48" textAnchor="end">12</text>
      <text className="le81__tick" x="58" y="270" textAnchor="middle">0</text>
      <text className="le81__tick" x="220" y="270" textAnchor="middle">6</text>
      <text className="le81__tick" x="382" y="270" textAnchor="middle">12</text>
      <text className="le81__axis-label" x="304" y="294" textAnchor="middle">Customer tenure · months</text>
      <text className="le81__axis-label" transform="translate(17 145) rotate(-90)" textAnchor="middle">Sessions · per week</text>
      {points.map((point) => <g key={point.id}>
        <circle className={`le81__dot is-${point.group}`} cx={point.x} cy={point.y} r="8" />
        <text className="le81__point-label" x={point.x + 11} y={point.y - 8}>{point.id}</text>
      </g>)}
      <text className="le81__group-label is-brief" x="116" y="100">Group A · brief activity</text>
      <text className="le81__group-label is-regular" x="348" y="65">Group B · regular activity</text>
    </svg>
  </figure>
}

export function LearningExamples81() {
  return <section className="le81" aria-labelledby="le81-title">
    <header className="le81__heading">
      <p className="le81__eyebrow">Two customer questions · two kinds of learning</p>
      <h2 id="le81-title">The available answers change the task</h2>
      <p>Use tenure and weekly sessions as inputs in both examples. The difference is what the data says about each past customer.</p>
    </header>

    <div className="le81__examples">
      <article className="le81__example is-supervised" aria-labelledby="le81-supervised-title">
        <header className="le81__example-heading">
          <span className="le81__step">Example 1 · Supervised</span>
          <h3 id="le81-supervised-title">Supervised · predict a purchase category</h3>
          <p>Past customers have recorded purchase outcomes, so the model can learn from features paired with known answers.</p>
        </header>

        <div className="le81__data">
          <span className="le81__data-label">Input · features plus observed labels</span>
          <CustomerRows includePurchase />
        </div>

        <div className="le81__flow" aria-label="Labeled customer records are used to learn, then features from a new customer are used for prediction">
          <div><span>Learn from</span><strong>past labeled customers</strong></div>
          <b aria-hidden="true">→</b>
          <div className="le81__flow-new"><span>Then provide</span><strong>new customer’s tenure + sessions</strong></div>
          <b aria-hidden="true">→</b>
          <div className="le81__flow-result"><span>Possible model output</span><strong>Purchase: Yes or No</strong></div>
        </div>

        <div className="le81__purpose">
          <strong>Question</strong>
          <p>Given this new customer’s activity, which purchase category should the model predict?</p>
        </div>
          <p className="le81__why"><strong>Why use it?</strong> A shop could use the predicted category to decide which new customers may need follow-up.</p>
      </article>

      <article className="le81__example is-unsupervised" aria-labelledby="le81-unsupervised-title">
        <header className="le81__example-heading">
          <span className="le81__step">Example 2 · Unsupervised</span>
          <h3 id="le81-unsupervised-title">Unsupervised · group by activity</h3>
          <p>Purchase outcomes are not supplied. The method can still find customers with similar observed behavior.</p>
        </header>

        <div className="le81__data">
          <span className="le81__data-label">Input · features only, no purchase label</span>
          <CustomerRows includePurchase={false} />
        </div>

        <div className="le81__result">
          <span className="le81__data-label">Illustrative view of a possible grouping</span>
          <ActivityGroups />
          <p className="le81__group-note"><strong>Group names are added to describe the pattern.</strong> The grouping is based on tenure and session frequency; those names were not supplied as target answers.</p>
        </div>

        <div className="le81__purpose">
          <strong>Question</strong>
          <p>Which customers have similar activity patterns, so the shop can describe or explore its customer base?</p>
        </div>
        <p className="le81__why"><strong>Why use it?</strong> Groups can help summarize behavior or guide further investigation. These groups do not predict purchase and do not automatically mean “buyers” or “non-buyers.”</p>
      </article>
    </div>

    <p className="le81__takeaway"><strong>Keep the task straight:</strong> supplied outcomes support prediction of those outcomes; without them, learning can describe structure in the features.</p>
  </section>
}
