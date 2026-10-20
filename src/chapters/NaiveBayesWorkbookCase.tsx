import { Fragment, useState } from 'react'
import {
  bayesWorkbookCustomers, bayesWorkbookDefaultInput, bayesWorkbookFeatures, calculateBayesWorkbook,
} from './bayesWorkbook'
import './NaiveBayesWorkbookCase.css'

const percent = (value: number) => `${(value * 100).toFixed(1)}%`
type BayesResult = ReturnType<typeof calculateBayesWorkbook>

function ConditionalTable({ result, classIndex }: { result: BayesResult; classIndex: number }) {
  const group = result.classes[classIndex]
  const className = group.purchase ? 'Purchase' : 'No_Purchase'
  const product = [...group.features.map(feature => feature.probabilities[feature.selectedValue ? 0 : 1]), group.prior]
  return <table className="nbw__conditional" aria-label={`Conditional probabilities given ${className}`}>
    <colgroup><col /><col /><col /></colgroup>
    <tbody>{group.features.flatMap(feature => ([1, 0] as const).map((value, valueIndex) =>
      <tr key={`${feature.key}-${value}`}>
        <th scope="row">{value ? '' : 'No_'}{feature.label} | {className}</th>
        <td className={feature.selectedValue === value ? 'nbw__selected' : ''}
          title={`${feature.counts[valueIndex]} / ${group.total} = ${feature.probabilities[valueIndex]}`}>
          {percent(feature.probabilities[valueIndex])}
        </td>
        {feature.key === 'newsletter' && value === 1 && <td rowSpan={6} className={`nbw__product nbw__product--${group.purchase ? 'purchase' : 'no-purchase'}`}
          title={`${product.join(' × ')} = ${group.raw}`}>
          <output aria-label={`${className} raw product`}>{percent(group.raw)}</output>
        </td>}
      </tr>,
    ))}</tbody>
  </table>
}

export function NaiveBayesWorkbookCase() {
  const [input, setInput] = useState({ ...bayesWorkbookDefaultInput })
  const result = calculateBayesWorkbook(input)
  return <article className="nbw" aria-labelledby="nbw-title">
    <header className="nbw__header">
      <p>Chapter 09 · Classification Models · 9.8</p>
      <h1 id="nbw-title">Case study: Naive Bayes</h1>
      <p>Estimate how likely a customer is to purchase based on whether they subscribe to the newsletter, follow the Facebook page, or visit the website.</p>
    </header>
    <div className="nbw__scroll" role="region" aria-label="Naive Bayes workbook" tabIndex={0}>
      <div className="nbw__sheet">
        <table className="nbw__customers" aria-label="20 source customers">
          <thead><tr><th scope="col">Customer ID</th><th scope="col">Subscribed to Newsletter</th><th scope="col">Followed Facebook Page</th><th scope="col">Visited Website</th><th scope="col">Purchase</th></tr></thead>
          <tbody>{bayesWorkbookCustomers.map(customer => <tr key={customer.id}>
            <td>{customer.id}</td><td>{customer.newsletter}</td><td>{customer.facebook}</td><td>{customer.website}</td><td>{customer.purchase}</td>
          </tr>)}</tbody>
        </table>
        <div className="nbw__middle">
          <table className="nbw__frequency" aria-label="Feature frequencies by purchase class">
            <colgroup><col /><col /><col /><col /></colgroup>
            <thead><tr><td colSpan={2} /><th colSpan={2} scope="colgroup">Purchase</th></tr></thead>
            <tbody>{bayesWorkbookFeatures.map((feature, index) => <Fragment key={feature.key}>
              <tr className="nbw__frequency-labels"><td colSpan={2} /><th scope="col">1</th><th scope="col">0</th></tr>
              {([1, 0] as const).map((value, valueIndex) => <tr key={value}>
                {valueIndex === 0 && <th rowSpan={2} scope="rowgroup" className="nbw__feature-name">{feature.label}</th>}
                <th scope="row" className="nbw__binary-value">{value}</th>
                {result.classes.map(group => <td className="nbw__frequency-count" key={group.purchase}>{group.features[index].counts[valueIndex]}</td>)}
              </tr>)}
            </Fragment>)}</tbody>
            <tfoot><tr><th colSpan={2} scope="row">Total:</th>{result.classes.map(group => <td key={group.purchase}>{group.total}</td>)}</tr>
              <tr><th colSpan={2} scope="row"><span className="nbw__sr-only">Prior probability</span></th>{result.classes.map(group => <td key={group.purchase}>{(group.prior * 100).toFixed(0)}%</td>)}</tr>
            </tfoot>
          </table>
          <fieldset className="nbw__inputs"><legend>UNOBSERVED VALUE</legend>
            {bayesWorkbookFeatures.map(feature => <label key={feature.key} htmlFor={`nbw-${feature.key}`}>
              <span>{feature.label}</span><span className={`nbw__input-value ${input[feature.key] ? 'nbw__input-value--yes' : ''}`}>
                <input id={`nbw-${feature.key}`} type="checkbox" checked={input[feature.key]}
                  onChange={event => setInput(current => ({ ...current, [feature.key]: event.target.checked }))} />
                <span>{input[feature.key] ? 'Yes' : 'No'}</span>
              </span>
            </label>)}
          </fieldset>
        </div>
        <section className="nbw__right" aria-labelledby="nbw-conditional-title">
          <h2 id="nbw-conditional-title">CONDITIONAL PROBABILITIES</h2>
          <div className="nbw__probabilities" aria-live="polite">
            <ConditionalTable result={result} classIndex={0} />
            <ConditionalTable result={result} classIndex={1} />
            <div className="nbw__answer"><strong>Purchase Probability:</strong><output aria-label="Purchase probability"
              title={`${result.classes[0].raw} / (${result.classes[0].raw} + ${result.classes[1].raw}) = ${result.purchaseProbability}`}>
              {percent(result.purchaseProbability)}
            </output></div>
          </div>
        </section>
      </div>
    </div>
  </article>
}
