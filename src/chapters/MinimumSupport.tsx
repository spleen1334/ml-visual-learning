import './AssociationMining.css'
import './MinimumSupport.css'
import aprioriSupportSource from '../assets/apriori-support-threshold-source.png'
import aprioriFilteredTransactionsSource from '../assets/apriori-filtered-transactions-source.png'

export function MinimumSupport() {
  return <article className="assoc-lesson minimum-support-lesson">
    <header className="assoc-header">
      <p className="assoc-eyebrow">19.5 · Minimum support thresholds</p>
      <h1>Minimum Support Thresholds</h1>
      <p className="assoc-header-subtitle">Plot item support, then choose a cutoff for filtering infrequent purchases.</p>
    </header>

    <p className="minimum-support-question">How do we account for <strong><u>infrequently purchased items</u>?</strong></p>

    <div className="minimum-support-layout">
      <div className="minimum-support-chart-column">
        <figure className="assoc-source-figure assoc-source-support">
          <img src={aprioriSupportSource} alt="Bar chart of support for 12 items. The bars descend from 0.50, and an arrow marks the drop-off at support 0.15." />
          <figcaption>Item support, ordered from most to least frequent · the drop-off suggests a cutoff at <strong>0.15</strong>.</figcaption>
        </figure>
        <aside className="minimum-support-cutoff-note" aria-label="What the minimum support cutoff does">
          <span className="minimum-support-note-label">The cutoff · <strong>0.15</strong></span>
          <p>Items with support <strong>below 0.15</strong> are <em>left out of the analysis</em>. In this example, transactions containing those items—<strong>4, 6, 8, 10, 15 and 17</strong>—are removed before the next calculations.</p>
          <small>That leaves fewer transactions to analyze and helps avoid misleading confidence and lift calculations.</small>
        </aside>
      </div>
      <figure className="assoc-source-figure assoc-source-filtered minimum-support-filtered">
        <img src={aprioriFilteredTransactionsSource} alt="The 20 source transactions after filtering. Transactions 4, 6, 8, 10, 15 and 17 are faded because they contain an item with support below 0.15." />
        <figcaption>After filtering · faded transaction IDs contain an item below the cutoff.</figcaption>
      </figure>
    </div>
  </article>
}
