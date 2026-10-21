import { useId, useState } from 'react'
import {
  average,
  fitStraightLine,
  formatValue,
  INITIAL_HOLDOUT_SALES,
  MAX_HOLDOUT_SALES,
  MIN_HOLDOUT_SALES,
  nextLinearTrend,
  pairedStoreValues,
  PROCESS_DATA,
  SALES_HISTORY,
  salesHistogram,
} from './chapterTwoData'
import './ChapterTwo.css'

const QUESTIONS = [
  {
    id: 'churn',
    title: 'Who may leave next month?',
    kind: 'Classification',
    description: 'Use past customer examples to estimate a category: likely to leave or likely to stay.',
    visual: 'classification',
  },
  {
    id: 'sales',
    title: 'How many units might sell?',
    kind: 'Regression',
    description: 'Estimate a number, such as next month’s sales, from patterns in earlier observations.',
    visual: 'regression',
  },
  {
    id: 'basket',
    title: 'Which items appear together?',
    kind: 'Association',
    description: 'Look for products that often show up in the same baskets. A pattern is not a reason why.',
    visual: 'association',
  },
  {
    id: 'history',
    title: 'What happened last quarter?',
    kind: 'Descriptive analysis',
    description: 'Summarize recorded results to understand the past. A useful answer may not need a model.',
    visual: 'history',
  },
] as const

type QuestionId = (typeof QUESTIONS)[number]['id']

function QuestionIllustration({ kind }: { kind: (typeof QUESTIONS)[number]['visual'] }) {
  const descriptions = {
    classification: 'Two labeled customer groups show examples in the stay and leave categories.',
    regression: 'Monthly sales points rise along a simple fitted trend line.',
    association: 'Three shopping baskets show bread and tea occurring together in two baskets.',
    history: 'Bars summarize recorded sales for three past months.',
  }
  return (
    <svg className="landscape-lesson__chart" viewBox="0 0 360 210" role="img" aria-label={descriptions[kind]}>
      <path className="landscape-lesson__chart-axis" d="M42 18 V164 H338" />
      {kind === 'classification' && <>
        <text className="landscape-lesson__chart-label" x="52" y="30">Past examples</text>
        {[['stay', 80, 70], ['stay', 125, 110], ['stay', 170, 58], ['leave', 220, 92], ['leave', 270, 53], ['leave', 300, 123]].map(([group, x, y], i) => (
          <circle key={i} cx={Number(x)} cy={Number(y)} r="9" className={`landscape-lesson__chart-dot landscape-lesson__chart-dot--${group}`} />
        ))}
        <text className="landscape-lesson__chart-label" x="83" y="190">Stayed</text>
        <text className="landscape-lesson__chart-label" x="233" y="190">Left</text>
        <path className="landscape-lesson__chart-grid" d="M196 38 V164" />
      </>}
      {kind === 'regression' && <>
        <text className="landscape-lesson__chart-label" x="52" y="30">Monthly units</text>
        <path className="landscape-lesson__chart-line" d="M67 138 L316 51" />
        {[[67, 138], [118, 125], [169, 112], [220, 88], [271, 69]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="5" className="landscape-lesson__chart-dot" />)}
        <text className="landscape-lesson__chart-label" x="48" y="184">Earlier months</text>
        <text className="landscape-lesson__chart-label" x="263" y="184">Later</text>
      </>}
      {kind === 'association' && <>
        <text className="landscape-lesson__chart-label" x="48" y="30">Illustrative baskets</text>
        {[['Bread', 160], ['Tea', 230], ['Fruit', 300]].map(([label, x]) => <text key={label} className="landscape-lesson__chart-label" x={Number(x)} y="58" textAnchor="middle">{label}</text>)}
        {[['Basket 1', ['●', '●', '']], ['Basket 2', ['●', '●', '●']], ['Basket 3', ['', '●', '●']]].map(([label, cells], row) => <g key={String(label)}>
          <text className="landscape-lesson__chart-label" x="48" y={91 + row * 33}>{label}</text>
          {(cells as string[]).map((cell, col) => <text key={col} className={col < 2 && cell ? 'landscape-lesson__chart-item is-highlighted' : 'landscape-lesson__chart-item'} x={[160, 230, 300][col]} textAnchor="middle" y={91 + row * 33}>{cell || '·'}</text>)}
        </g>)}
        <text className="landscape-lesson__chart-label" x="48" y="194">Bread and tea appear together in two baskets.</text>
      </>}
      {kind === 'history' && <>
        <text className="landscape-lesson__chart-label" x="52" y="30">Recorded units sold</text>
        {[['Oct', 73], ['Nov', 106], ['Dec', 81]].map(([month, height], i) => <g key={month}>
          <rect x={78 + i * 82} y={164 - Number(height)} width="42" height={Number(height)} rx="5" className="landscape-lesson__chart-bar" />
          <text className="landscape-lesson__chart-label" x={99 + i * 82} y="184" textAnchor="middle">{month}</text>
        </g>)}
        <text className="landscape-lesson__chart-label" x="206" y="76" textAnchor="middle">Past results</text>
      </>}
    </svg>
  )
}

export function IntroToML() {
  const [selected, setSelected] = useState<QuestionId>('churn')
  const active = QUESTIONS.find((item) => item.id === selected)!
  return (
    <article className="landscape-lesson" aria-labelledby="intro-ml-title">
      <header className="landscape-lesson__intro">
        <p className="landscape-lesson__eyebrow">Chapter 2.1 · Start with a question</p>
        <h1 id="intro-ml-title">What is machine learning?</h1>
        <p><strong>Learn useful patterns from examples.</strong> Start with the <em>question you want to answer</em>, then decide whether a model can help.</p>
      </header>
      <section className="landscape-lesson__definition" aria-labelledby="ml-definition-title">
        <p className="landscape-lesson__eyebrow">A simple definition</p>
        <h2 id="ml-definition-title">The idea in one sentence</h2>
        <p className="landscape-lesson__definition-statement">Using statistical models to <strong>find patterns</strong> and <strong>make predictions.</strong></p>
        <p className="landscape-lesson__definition-detail">A model learns from <strong>examples in existing data</strong>. It uses the patterns it finds to <em>describe structure</em> or estimate an outcome for a new case.</p>
        <ol className="landscape-lesson__definition-flow" aria-label="How a machine learning model uses data">
          <li><strong>Input data</strong><span>Past examples</span><table className="landscape-lesson__definition-mini-table" aria-hidden="true"><thead><tr><th>Month</th><th>Sales</th></tr></thead><tbody><tr><td>Oct</td><td>44</td></tr><tr><td>Dec</td><td>50</td></tr></tbody></table></li>
          <li><strong>Learn a pattern</strong><span>Notice how examples relate</span><svg className="landscape-lesson__definition-visual" viewBox="0 0 120 48" aria-hidden="true" focusable="false"><path d="M8 42V5M8 42H114" /><path d="M18 36L39 31L59 26L81 17L104 9" /><circle cx="18" cy="36" r="3" /><circle cx="39" cy="31" r="3" /><circle cx="59" cy="26" r="3" /><circle cx="81" cy="17" r="3" /><circle cx="104" cy="9" r="3" /></svg></li>
          <li><strong>Estimate new cases</strong><span>Use the pattern on a new example</span><svg className="landscape-lesson__definition-visual" viewBox="0 0 120 48" aria-hidden="true" focusable="false"><path d="M8 42V5M8 42H114" /><path d="M18 36L39 31L59 26L81 17" /><circle cx="18" cy="36" r="3" /><circle cx="39" cy="31" r="3" /><circle cx="59" cy="26" r="3" /><path d="M81 17L104 10" strokeDasharray="4 3" /><circle className="is-forecast" cx="104" cy="10" r="4" /><text x="94" y="8">?</text></svg></li>
        </ol>
      </section>
      <section className="landscape-lesson__section" aria-labelledby="intro-ml-examples">
        <div className="landscape-lesson__section-heading">
          <p className="landscape-lesson__eyebrow">Four kinds of questions</p>
          <h2 id="intro-ml-examples">Choose a question to see the shape of its answer</h2>
          <p>These examples are illustrative. Their tiny charts explain the question type; they are not trained models.</p>
        </div>
        <div className="landscape-lesson__choice-grid" role="group" aria-label="Example business questions">
          {QUESTIONS.map((item) => <button key={item.id} type="button" className={selected === item.id ? 'landscape-lesson__choice landscape-lesson__choice--selected' : 'landscape-lesson__choice'} aria-pressed={selected === item.id} onClick={() => setSelected(item.id)}>
            <span className="landscape-lesson__choice-title">{item.title}</span><span>{item.kind}</span>
          </button>)}
        </div>
        <div className="landscape-lesson__interactive">
          <div className="landscape-lesson__copy" aria-live="polite">
            <p className="landscape-lesson__eyebrow">{active.kind}</p>
            <h3>{active.title}</h3>
            <p><strong>{active.kind === "Classification" ? "Predict a category." : active.kind === "Regression" ? "Predict a number." : active.kind === "Association" ? "Discover co-occurrence." : "Describe the past."}</strong><br />{active.description}</p>
          </div>
          <figure className="landscape-lesson__figure">
            <QuestionIllustration kind={active.visual} />
            <figcaption className="landscape-lesson__caption">A sketch of the answer’s form, not evidence about real customers or sales.</figcaption>
          </figure>
        </div>
      </section>
      <aside className="landscape-lesson__callout"><strong>Begin with the decision.</strong> Clarify what answer would be useful, what data is available, and what action the answer could support. A pattern alone does not explain its cause.</aside>
      <Summary title="From question to useful answer" items={[
        ['Name the question.', 'Decide whether you need a category, a number, a grouping, or a description of what already happened.'],
        ['Check the evidence.', 'Examples in the data need to match the question and have reliable labels or measurements.'],
        ['Keep the limits visible.', 'A prediction can help inform a decision, but it does not prove what caused an outcome.'],
      ]} />
    </article>
  )
}

function SalesComparisonChart({ actual, meanForecast, trendFit }: { actual: number; meanForecast: number; trendFit: { slope: number; intercept: number } }) {
  const titleId = useId()
  const descId = useId()
  const trendForecast = trendFit.intercept + trendFit.slope * 6
  // Keep the scale fixed so only the simulated result moves when the slider changes.
  const y = (value: number) => 160 - (value / 100) * 130
  const x = (index: number) => 54 + index * 52
  const ticks = [0, 25, 50, 75, 100]
  return <svg className="landscape-lesson__chart" viewBox="0 0 380 220" role="img" aria-labelledby={`${titleId} ${descId}`}>
    <title id={titleId}>Five historical monthly sales values, two February forecasts, and the observed value</title>
    <desc id={descId}>Sales values for September through January are {SALES_HISTORY.map((p) => p.sales).join(', ')}. The solid line shows the least-squares trend fitted to those five training observations. It continues as a dashed forecast into February. For February, the previous average forecast is {formatValue(meanForecast)}, the trend forecast is {formatValue(trendForecast)}, and the observed value is {actual} units.</desc>
    {ticks.map((tick) => <g key={tick}><path className="landscape-lesson__chart-grid" d={`M44 ${y(tick)} H354`} /><text className="landscape-lesson__chart-axis-label" x="38" y={y(tick) + 4} textAnchor="end">{formatValue(tick)}</text></g>)}
    <path className="landscape-lesson__chart-axis" d="M44 22 V160 H354" />
    <path className="landscape-lesson__chart-observed-line" d={SALES_HISTORY.map((point, i) => `${i === 0 ? 'M' : 'L'}${x(i)} ${y(point.sales)}`).join(' ')} />
    <path className="landscape-lesson__chart-line" d={`M${x(0)} ${y(trendFit.intercept + trendFit.slope)} L${x(4)} ${y(trendFit.intercept + trendFit.slope * 5)}`} />
    {SALES_HISTORY.map((point, i) => <g key={point.month}><circle className="landscape-lesson__chart-dot" cx={x(i)} cy={y(point.sales)} r="5" /><text className="landscape-lesson__chart-axis-label" x={x(i)} y="178" textAnchor="middle">{point.month}</text></g>)}
    <path className="landscape-lesson__chart-baseline" d={`M${x(4)} ${y(meanForecast)} H${x(5)}`} />
    <path className="landscape-lesson__chart-forecast" d={`M${x(4)} ${y(trendFit.intercept + trendFit.slope * 5)} L${x(5)} ${y(trendForecast)}`} />
    <circle className="landscape-lesson__chart-prediction" cx={x(5)} cy={y(actual)} r="7" />
    <text className="forecast-actual-label" x="350" y="18" textAnchor="end">Orange dot: actual {actual}</text>
    <text className="landscape-lesson__chart-axis-label" x={x(5)} y="178" textAnchor="middle">Feb</text>
    <text className="landscape-lesson__chart-label" x="185" y="205" textAnchor="middle">Month · vertical scale: units sold</text>
  </svg>
}

export function WhenToUseML() {
  const [actual, setActual] = useState(INITIAL_HOLDOUT_SALES)
  const [actualDraft, setActualDraft] = useState(String(INITIAL_HOLDOUT_SALES))
  const inputId = useId()
  const history = SALES_HISTORY.map((point) => point.sales)
  const meanForecast = average(history)
  const trendFit = fitStraightLine(history.map((_value, index) => index + 1), history)
  const trendForecast = nextLinearTrend(history)
  const meanError = Math.abs(actual - meanForecast)
  const trendError = Math.abs(actual - trendForecast)
  return <article className="landscape-lesson" aria-labelledby="when-use-ml-title">
    <header className="landscape-lesson__intro">
      <p className="landscape-lesson__eyebrow">Chapter 2.2 · Match the tool to the need</p>
      <h1 id="when-use-ml-title">Use the simplest analysis that answers the question well</h1>
      <p><strong>Start with a simple summary or chart.</strong> When relationships become difficult to inspect by eye, a statistical model can help you <em>summarize patterns and make repeatable estimates</em>.</p>
    </header>
    <section className="landscape-lesson__help-principle" aria-labelledby="ml-help-principle-title">
      <p className="landscape-lesson__eyebrow">A useful rule of thumb</p>
      <h2 id="ml-help-principle-title">When does machine learning help?</h2>
      <p className="landscape-lesson__help-statement">When learned patterns lead to <strong>useful predictions on new examples</strong>—and those predictions <em>improve on a simple baseline.</em></p>
      <div className="landscape-lesson__help-cards" role="list">
        <article className="landscape-lesson__help-card" role="listitem">
          <svg viewBox="0 0 112 62" aria-hidden="true" focusable="false"><path d="M10 52H104M18 50V30H38V50M47 50V17H67V50M76 50V24H96V50" /><path d="M18 12H96" strokeDasharray="3 4" /></svg>
          <h3>Simple summaries</h3><p><strong>Describe what happened.</strong> A chart or average may answer a past-tense question without a model.</p>
        </article>
        <article className="landscape-lesson__help-card" role="listitem">
          <svg viewBox="0 0 112 62" aria-hidden="true" focusable="false"><path d="M10 52V8M10 52H104M18 45L37 38L55 40L75 23L97 14" /><circle cx="18" cy="45" r="3" /><circle cx="37" cy="38" r="3" /><circle cx="55" cy="40" r="3" /><circle cx="75" cy="23" r="3" /><circle cx="97" cy="14" r="3" /></svg>
          <h3>Useful patterns</h3><p><strong>Summarize relationships</strong> when several variables interact or patterns are hard to compare by eye.</p>
        </article>
        <article className="landscape-lesson__help-card" role="listitem">
          <svg viewBox="0 0 112 62" aria-hidden="true" focusable="false"><path d="M10 52H104M17 44V34H31V44M45 30V20H59V30M73 17H87V44H73Z" /><path d="M66 48V10" strokeDasharray="4 3" /><circle className="is-forecast" cx="66" cy="35" r="5" /><path d="M89 15H101M89 20H101M89 25H101" /></svg>
          <h3>Test against a baseline</h3><p><strong>Check new examples.</strong> Compare model predictions with a simple reference before relying on them.</p>
        </article>
      </div>
      <p className="landscape-lesson__help-note"><strong>Not every useful question needs a model.</strong> Descriptive questions about recorded results often need a clear summary, not a prediction.</p>
    </section>
    <section className="landscape-lesson__section" aria-labelledby="when-use-ml-demo">
      <div className="landscape-lesson__section-heading"><p className="landscape-lesson__eyebrow">A small forecasting comparison</p><h2 id="when-use-ml-demo">Make a forecast. Then see how far it misses.</h2><p><strong>The point of this experiment:</strong> a more elaborate forecast is not automatically better. Change the result we later observe and compare the two errors.</p></div>
      <div className="landscape-lesson__interactive">
        <div className="landscape-lesson__copy">
          <ol className="forecast-story">
            <li><strong>Before February:</strong> use September–January to make two forecasts: <strong>46.2</strong> from the average, and <strong>56.4</strong> from the trend.</li>
            <li><strong>After February:</strong> observe how many units actually sold. The slider lets you simulate that result.</li>
            <li><strong>Compare the gap:</strong> the closer forecast has the smaller error <em>for this month</em>.</li>
          </ol>
          <p className="landscape-lesson__caption">“Held out” means February was kept out of the data used to make the forecasts.</p>
          <div className="landscape-lesson__controls">
            <label htmlFor={inputId}><strong>Suppose February actually sold {actual} units</strong></label>
            <p id={`${inputId}-help`} className="forecast-control-help">Move the slider to change the <strong>orange actual-sales dot</strong>. Watch the error bars below. Both forecasts stay fixed—we made them before seeing February.</p>
            <div className="landscape-lesson__input-row"><input id={inputId} aria-label="Simulated actual February sales" aria-describedby={`${inputId}-help`} type="range" min={MIN_HOLDOUT_SALES} max={MAX_HOLDOUT_SALES} value={actual} onChange={(event) => { const value = Number(event.currentTarget.value); setActual(value); setActualDraft(String(value)) }} /><input aria-label="Observed February sales in units" type="number" min={MIN_HOLDOUT_SALES} max={MAX_HOLDOUT_SALES} value={actualDraft} onChange={(event) => setActualDraft(event.currentTarget.value)} onBlur={() => { const parsed = Number(actualDraft); const value = actualDraft.trim() === '' || !Number.isFinite(parsed) ? actual : Math.min(MAX_HOLDOUT_SALES, Math.max(MIN_HOLDOUT_SALES, Math.round(parsed))); setActual(value); setActualDraft(String(value)) }} /></div>
            <div className="forecast-presets"><button type="button" onClick={() => { setActual(46); setActualDraft('46') }}>Try 46 units</button><button type="button" onClick={() => { setActual(58); setActualDraft('58') }}>Try 58 units</button></div>
            <button className="landscape-lesson__reset" type="button" onClick={() => { setActual(INITIAL_HOLDOUT_SALES); setActualDraft(String(INITIAL_HOLDOUT_SALES)) }}>Reset to 58 units</button>
          </div>
          <div className="landscape-lesson__calculation" aria-live="polite">
            <p><span>Average forecast · fixed</span><strong>{formatValue(meanForecast)} units</strong><small>({history.join(' + ')}) ÷ 5</small></p>
            <p><span>Trend forecast · fixed</span><strong>{formatValue(trendForecast)} units</strong><small>Least-squares line fitted to the same five values</small></p>
            <p><span>Observed February</span><strong>{actual} units</strong><small>Held out while both forecasts were made</small></p>
          </div>
          <p className="landscape-lesson__note"><strong>Why don’t the lines move?</strong> You are changing the outcome used to <em>evaluate</em> the forecasts, not the earlier data used to <em>fit</em> them. Moving the slider does not retrain either method.</p>
        </div>
        <figure className="landscape-lesson__figure">
          <SalesComparisonChart actual={actual} meanForecast={meanForecast} trendFit={trendFit} />
          <figcaption className="landscape-lesson__legend"><span className="landscape-lesson__legend-item landscape-lesson__legend-item--history">Observed history</span><span className="landscape-lesson__legend-item">Fitted trend + forecast</span><span className="landscape-lesson__legend-item landscape-lesson__legend-item--baseline">Average forecast</span><span className="landscape-lesson__legend-item landscape-lesson__legend-item--observed">February observed value</span></figcaption>
          <table className="landscape-lesson__data-table"><caption>Monthly sales used in the comparison</caption><thead><tr><th scope="col">Month</th><th scope="col">Units</th><th scope="col">Role</th></tr></thead><tbody>{SALES_HISTORY.map((p) => <tr key={p.month}><th scope="row">{p.month}</th><td>{p.sales}</td><td>Training history</td></tr>)}<tr><th scope="row">Feb</th><td>{actual}</td><td>Held-out observation</td></tr></tbody></table>
        </figure>
      </div>
      <section className="forecast-errors" aria-labelledby="forecast-errors-title" aria-live="polite">
        <h3 id="forecast-errors-title">How far did each forecast miss?</h3>
        <p><strong>Shorter bar = smaller error.</strong> Error is the distance between the forecast and actual sales, regardless of direction.</p>
        {[{ label: 'Average', forecast: meanForecast, error: meanError }, { label: 'Trend', forecast: trendForecast, error: trendError }].map(result => <div className="forecast-error-row" key={result.label}>
          <div><strong>{result.label} forecast</strong><span>{formatValue(result.forecast)} forecast → {actual} actual</span></div>
          <div className="forecast-error-track"><span style={{ width: `${result.error / 60 * 100}%` }} /></div>
          <strong>{formatValue(result.error)} units off</strong>
        </div>)}
        <p className="forecast-verdict"><strong>{Math.abs(meanError - trendError) < 0.000001 ? 'Both forecasts are equally close for this result.' : `${meanError < trendError ? 'The simple average' : 'The fitted trend'} is closer for this result.`}</strong> Try 46 and 58 to see the comparison reverse. One month does not tell us which method will be more reliable over time.</p>
      </section>
    </section>
    <aside className="landscape-lesson__callout"><strong>Complexity is a clue, not a rule.</strong> When many dimensions or interacting patterns are difficult to inspect visually, a model may help. First ask whether simpler summaries answer the real question, and whether the data can support a useful check on new examples.</aside>
    <Summary title="When a model can help" items={[
      ['A pattern is hard to see directly.', 'Several variables may interact, or the number of possible combinations may make manual comparison impractical.'],
      ['A repeatable estimate is useful.', 'A model can apply the same rule to new cases, but the estimate still needs review against data it did not use to fit.'],
      ['A simpler baseline stays in view.', 'Compare a model with a plain reference such as the historical average. A more elaborate method is useful only when it helps the task.'],
    ]} />
  </article>
}

const PROCESS_STAGES = [
  { id: 'qa', title: 'Quality assurance', group: 'Prepare', description: 'Inspect rows, types, missing values, ranges, and labels. November promotion spend is missing in this example; keep that unknown visible and check its source.', illustration: 'qa' },
  { id: 'univariate', title: 'Univariate profiling', group: 'Understand', description: 'Study one variable at a time. The chart groups all six monthly sales observations into ranges; each bar count is calculated from the same table.', illustration: 'univariate' },
  { id: 'multivariate', title: 'Multivariate profiling', group: 'Understand', description: 'Compare variables together. The scatter uses only the five months with both sales and promotion spend recorded; association alone does not establish cause.', illustration: 'multivariate' },
  { id: 'model', title: 'Machine learning', group: 'Model', description: 'A simple fitted line can summarize the five complete sales/promotion pairs and estimate a value at a new spend level. This tiny example is not a reliable business model.', illustration: 'model' },
] as const

type ProcessId = (typeof PROCESS_STAGES)[number]['id']

function ProcessNotes({ selected }: { selected: ProcessId }) {
  const notes = {
    qa: [
      ['Inspect rows & meaning', <>Know what <strong>one row represents</strong>. Confirm that units and labels answer the question you actually have.</>],
      ['Check types, gaps & ranges', <>Look for <strong>missing values</strong>, dates stored as text and unusual values. <em>A suspicious value needs investigation.</em></>],
      ['Keep the unknown visible', <>November’s promotion spend is <strong>missing—not zero</strong>. Check the source before filling it in or dropping the row.</>],
    ],
    univariate: [
      ['One variable at a time', <>Focus on <strong>sales</strong>. Ask what is typical, how much values vary and whether anything looks unusual.</>],
      ['Read the distribution', <>The bars count <strong>all six months</strong> in sales ranges: <strong>3 + 2 + 1 = 6</strong> observations.</>],
      ['Keep usable values', <>November’s sales value is known, even though promotion spend is not. <em>It still belongs in this sales-only view.</em></>],
    ],
    multivariate: [
      ['Compare two variables', <>Each dot pairs <strong>promotion spend</strong> with <strong>sales</strong> for the same month.</>],
      ['Use complete pairs', <>Only <strong>five months</strong> have both values. November stays out of this paired view because its spend is unknown.</>],
      ['Separate pattern from cause', <>An upward pattern means the values move together. It <strong>does not prove</strong> that spending more caused higher sales.</>],
    ],
    model: [
      ['Turn a pattern into a rule', <>A fitted line summarizes the <strong>five complete pairs</strong> and can estimate sales at a new spend level.</>],
      ['Look beyond the fitted data', <>An estimate at <strong>$8k</strong> extends beyond the observed spend range. <em>That makes the assumption especially important.</em></>],
      ['Evaluate before relying on it', <>Check predictions against <strong>separate observations</strong>. A fitted line alone is not evidence of a dependable business model.</>],
    ],
  } as const
  return <dl className="workflow-reading-points">{notes[selected].map(([heading, body]) => <div key={heading}><dt>{heading}</dt><dd>{body}</dd></div>)}</dl>
}

function ProcessIllustration({ selected }: { selected: ProcessId }) {
  if (selected === 'qa') return <div className="landscape-lesson__visual-table"><table className="landscape-lesson__data-table"><caption>Monthly store records used throughout this example</caption><thead><tr><th scope="col">Month</th><th scope="col">Sales (units)</th><th scope="col">Promo spend ($k)</th></tr></thead><tbody>{PROCESS_DATA.map((row) => <tr key={row.month}><th scope="row">{row.month}</th><td>{row.sales}</td><td>{row.promoSpend === null ? <strong>Missing</strong> : row.promoSpend}</td></tr>)}</tbody></table><p className="landscape-lesson__note">November’s value stays missing until its source is checked. It is excluded from paired comparisons; the sales value remains usable for a one-variable view.</p></div>
  const bins = salesHistogram(PROCESS_DATA.map((row) => row.sales))
  const pairs = pairedStoreValues(PROCESS_DATA)
  const fit = fitStraightLine(pairs.map((point) => point.promoSpend), pairs.map((point) => point.sales))
  const predictedAtEight = fit.intercept + fit.slope * 8
  return <svg className="landscape-lesson__chart" viewBox="0 0 370 230" role="img" aria-label={selected === 'univariate' ? `Distribution of all six monthly sales values: ${bins.map((bin) => `${bin.label}, ${bin.count} ${bin.count === 1 ? 'month' : 'months'}`).join('; ')}.` : selected === 'model' ? `Scatter plot of five complete promotion-spend and sales pairs, a fitted straight line, and an illustrative estimate of ${formatValue(predictedAtEight)} units at eight thousand dollars of promotion spend. The missing November pair is excluded.` : 'Scatter plot of five complete promotion-spend and sales pairs. November is excluded because its promotion spend is missing; association does not show causation.'}>
    <path className="landscape-lesson__chart-axis" d="M48 22 V172 H346" />
    {selected === 'univariate' ? <>
      {bins.map((bin, i) => {
        const height = bin.count * 22
        return <g key={bin.label}><rect className="landscape-lesson__chart-bar" x={84 + i * 82} y={172 - height} width="46" height={height} rx="4" /><text className="landscape-lesson__chart-axis-label" x={107 + i * 82} y={164 - height} textAnchor="middle">{bin.count}</text><text className="landscape-lesson__chart-axis-label" x={107 + i * 82} y="192" textAnchor="middle">{bin.label}</text></g>
      })}
      <text className="landscape-lesson__chart-label" x="192" y="218" textAnchor="middle">Monthly sales (units) · months per range</text>
    </> : <>
      {[40, 45, 50, 55, 60].map((sales) => <g key={sales}><path className="landscape-lesson__chart-grid" d={`M48 ${172 - sales * 2.2} H346`} /><text className="landscape-lesson__chart-axis-label" x="42" y={176 - sales * 2.2} textAnchor="end">{sales}</text></g>)}
      {[0, 2, 4, 6, 8].map((spend) => <g key={spend}><path className="landscape-lesson__chart-grid" d={`M${48 + spend * 37.2} 22 V172`} /><text className="landscape-lesson__chart-axis-label" x={48 + spend * 37.2} y="190" textAnchor="middle">{spend}</text></g>)}
      {selected === 'model' && <path className="landscape-lesson__chart-line" d={`M${48 + 2 * 37.2} ${172 - (fit.intercept + fit.slope * 2) * 2.2} L${48 + 7 * 37.2} ${172 - (fit.intercept + fit.slope * 7) * 2.2}`} />}
      {pairs.map((point) => <g key={point.month}><circle className="landscape-lesson__chart-dot" cx={48 + point.promoSpend * 37.2} cy={172 - point.sales * 2.2} r="5" /><text className="landscape-lesson__chart-axis-label" x={48 + point.promoSpend * 37.2} y={164 - point.sales * 2.2} textAnchor="middle">{point.month}</text></g>)}
      {selected === 'model' && <><path className="landscape-lesson__chart-prediction" d={`M${48 + 7 * 37.2} ${172 - (fit.intercept + fit.slope * 7) * 2.2} L${48 + 8 * 37.2} ${172 - predictedAtEight * 2.2}`} /><circle className="landscape-lesson__chart-prediction" cx={48 + 8 * 37.2} cy={172 - predictedAtEight * 2.2} r="6" /></>}
      <text className="landscape-lesson__chart-label" x="190" y="218" textAnchor="middle">Promotion spend ($k)</text>
      <text className="landscape-lesson__chart-axis-label" transform="translate(18 125) rotate(-90)">Sales (units)</text>
    </>}
  </svg>
}

export function MLProcess() {
  const [selected, setSelected] = useState<ProcessId>('qa')
  const stage = PROCESS_STAGES.find((item) => item.id === selected)!
  const pairs = pairedStoreValues(PROCESS_DATA)
  const fitted = fitStraightLine(pairs.map(row => row.promoSpend), pairs.map(row => row.sales))
  return <article className="landscape-lesson" aria-labelledby="ml-process-title">
    <header className="landscape-lesson__intro"><p className="landscape-lesson__eyebrow">Chapter 2.3 · Build from the data outward</p><h1 id="ml-process-title">The model is one part of a larger data workflow</h1><p><strong>Prepare → understand → model.</strong> Each stage depends on the evidence before it.<br /><em>Incomplete or inconsistent inputs can undermine every result that follows.</em> Return to earlier steps whenever a result raises questions.</p></header>
    <section className="landscape-lesson__prep-emphasis" aria-labelledby="data-prep-heading">
      <div className="landscape-lesson__prep-heading"><p className="landscape-lesson__eyebrow">Start below the surface</p><h2 id="data-prep-heading">Data prep, QA &amp; profiling are the foundation</h2><p><strong>ML models are only as good as the data they are built on.</strong></p></div>
      <figure className="landscape-lesson__iceberg">
          <blockquote className="landscape-lesson__garbage-quote"><strong>Garbage in, garbage out.</strong></blockquote>
          <figcaption><span>The modeling step is a small visible tip above a much larger base of preparation and understanding.</span></figcaption>
          <div className="landscape-lesson__iceberg-diagram" role="img" aria-label="The small visible tip is model building. Below the surface, the much larger part of the iceberg is data preparation, quality assurance, and profiling.">
            <div className="landscape-lesson__iceberg-waterline"><span>Above the surface</span><span>Below the surface</span></div>
            <div className="landscape-lesson__iceberg-tip"><strong>Build a model</strong><span>Visible tip</span></div>
            <div className="landscape-lesson__iceberg-base"><strong>Data preparation, QA &amp; profiling</strong><span>Inspect, clean, describe, and connect the data</span></div>
          </div>
          <p className="landscape-lesson__iceberg-estimate"><strong>80%+</strong><span>Course estimate of the workflow devoted to data preparation and QA.</span></p>
          <p className="landscape-lesson__note">The course’s rough workflow estimate; the split varies by project.</p>
        </figure>
        <div className="landscape-lesson__prep-reasons" role="group" aria-label="Why preparation and profiling matter">
          <article className="landscape-lesson__prep-reason"><h3>Missing values</h3><p><strong>Unknown ≠ zero.</strong> Recording a missing sales value as zero can pull the average downward. <em>Check the meaning before replacing it.</em></p></article>
          <article className="landscape-lesson__prep-reason"><h3>Incorrect types</h3><p><strong>Appearance ≠ usable type.</strong> A date can look correct while being stored as text. <em>Check how the value can actually be used.</em></p></article>
          <article className="landscape-lesson__prep-reason"><h3>Biased or incomplete data</h3><p><strong>Who is missing?</strong> If some customers never appear in the data, a model may poorly represent them. <em>Check coverage, not just the number of rows.</em></p></article>
        </div>
      <p className="landscape-lesson__prep-footnote"><strong>Good data is necessary, not sufficient.</strong> Preparation reduces avoidable problems; it cannot guarantee that a model is useful or correct.</p>
    </section>
    <section className="landscape-lesson__section" aria-labelledby="process-map-heading">
      <div className="landscape-lesson__section-heading"><p className="landscape-lesson__eyebrow">Follow one small example</p><h2 id="process-map-heading">From a store table to a possible estimate</h2><p>Choose each stage to see what it asks of the same monthly store data.</p></div>
      <ol className="landscape-lesson__stage-list" aria-label="Machine learning process stages">{PROCESS_STAGES.map((item, index) => <li className={selected === item.id ? 'landscape-lesson__stage landscape-lesson__stage--selected' : 'landscape-lesson__stage'} key={item.id}><button type="button" className="landscape-lesson__stage-button" aria-pressed={selected === item.id} onClick={() => setSelected(item.id)}><span className="landscape-lesson__stage-number">0{index + 1}</span><span className="landscape-lesson__stage-name">{item.title}</span><span className="landscape-lesson__stage-group">{item.group}</span></button></li>)}</ol>
      <div className="landscape-lesson__interactive">
        <div className="landscape-lesson__copy" aria-live="polite"><p className="landscape-lesson__eyebrow">Stage {String(PROCESS_STAGES.findIndex((s) => s.id === selected) + 1).padStart(2, '0')} · {stage.group}</p><h3>{stage.title}</h3><ProcessNotes selected={selected} /></div>
        <figure className="landscape-lesson__figure"><ProcessIllustration selected={selected} />{selected === 'model' && <p className="landscape-lesson__note"><strong>Illustrative estimate at $8k spend: {formatValue(fitted.intercept + fitted.slope * 8)} units.</strong> The line uses five complete pairs; November stays excluded. This extends beyond the observed spend range and does not measure the effect of spending more.</p>}</figure>
      </div>
    </section>
    <p className="landscape-lesson__takeaway"><strong>The work can loop.</strong> A model’s surprising result may lead back to the source records, variable definitions, or an earlier chart. Keep unresolved questions visible while you investigate.</p>
    <Summary title="A careful path through the workflow" items={[
      ['Prepare and check.', 'Confirm that values, types, row meanings, and missing entries are understood before analysis.'],
      ['Describe, then compare.', 'Inspect individual variables first, then explore relationships between multiple variables.'],
      ['Model and evaluate.', 'Use a suitable method when needed, check performance on separate data, and revisit earlier work when results raise questions.'],
    ]} />
  </article>
}

const LANDSCAPE = [
  { id: 'classification', group: 'Supervised learning', title: 'Classification', description: 'Learn from examples with known categories to estimate a category for a new case.', kind: 'two-groups' },
  { id: 'regression', group: 'Supervised learning', title: 'Regression', description: 'Learn from examples with measured numeric outcomes to estimate a number for a new case.', kind: 'trend' },
  { id: 'clustering', group: 'Unsupervised learning', title: 'Clustering and segmentation', description: 'Group observations by similarities in their inputs when no target category is supplied.', kind: 'clusters' },
  { id: 'association', group: 'Unsupervised learning', title: 'Association patterns', description: 'Find items or events that commonly occur together. Co-occurrence is not causation.', kind: 'association' },
] as const

type LandscapeId = (typeof LANDSCAPE)[number]['id']

function LandscapeIllustration({ selected }: { selected: LandscapeId }) {
  const description = LANDSCAPE.find((item) => item.id === selected)!.description
  const dots = selected === 'classification' ? [[68, 64], [91, 83], [116, 55], [231, 108], [261, 82], [288, 122]] : selected === 'clustering' ? [[82, 57], [103, 72], [116, 48], [220, 112], [246, 126], [259, 101], [157, 85], [180, 111]] : [[67, 130], [104, 115], [145, 95], [187, 85], [231, 63], [276, 48]]
  return <svg className="landscape-lesson__chart" viewBox="0 0 360 210" role="img" aria-label={`${LANDSCAPE.find((item) => item.id === selected)!.title}: ${description}`}>
    <path className="landscape-lesson__chart-axis" d="M40 18 V158 H340" />
    {selected === 'association' ? <>
      <text className="landscape-lesson__chart-label" x="49" y="39">Basket</text>
      {['Bread', 'Tea', 'Fruit'].map((item, col) => <text key={item} className="landscape-lesson__chart-axis-label" x={151 + col * 65} y="39" textAnchor="middle">{item}</text>)}
      {['Basket A', 'Basket B', 'Basket C'].map((label, row) => <g key={label}><text className="landscape-lesson__chart-axis-label" x="49" y={76 + row * 32}>{label}</text>{['Bread', 'Tea', 'Fruit'].map((item, col) => <rect key={item} x={122 + col * 65} y={58 + row * 32} width="58" height="22" rx="6" className={(row < 2 && col < 2) || (row === 2 && col > 0) ? 'landscape-lesson__chart-bar' : 'landscape-lesson__chart-grid'} />)}</g>)}
      <text className="landscape-lesson__chart-label" x="182" y="184" textAnchor="middle">Items that often occur together</text>
    </> : <>
      {selected === 'classification' && <path className="landscape-lesson__chart-grid" d="M178 31 V158" />}
      {selected === 'clustering' && <><ellipse className="landscape-lesson__chart-region" cx="96" cy="68" rx="55" ry="40" /><ellipse className="landscape-lesson__chart-region" cx="240" cy="116" rx="58" ry="38" /></>}
      {selected === 'regression' && <path className="landscape-lesson__chart-line" d="M58 137 L310 37" />}
      {dots.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="6" className={`landscape-lesson__chart-dot${selected === 'classification' ? (x < 180 ? ' landscape-lesson__chart-dot--group-a' : ' landscape-lesson__chart-dot--group-b') : ''}`} />)}
      <text className="landscape-lesson__chart-label" x="190" y="190" textAnchor="middle">{selected === 'classification' ? 'Inputs → known category' : selected === 'regression' ? 'Input values → numeric outcome' : 'Similar inputs → groups'}</text>
    </>}
  </svg>
}

export function MLLandscape() {
  const [selected, setSelected] = useState<LandscapeId>('classification')
  const item = LANDSCAPE.find((entry) => entry.id === selected)!
  return <article className="landscape-lesson" aria-labelledby="ml-landscape-title">
    <header className="landscape-lesson__intro"><p className="landscape-lesson__eyebrow">Chapter 2.4 · A map of the methods</p><h1 id="ml-landscape-title">Start by asking whether outcomes are labeled</h1><p><strong>Do your examples include a known outcome?</strong> That is the first distinction in this map.<br />Then ask whether you need a <em>category, a number, a group or a co-occurrence pattern</em>.</p></header>
    <section className="landscape-lesson__section" aria-labelledby="landscape-map-heading">
      <div className="landscape-lesson__section-heading"><p className="landscape-lesson__eyebrow">Select a family</p><h2 id="landscape-map-heading">A map of methods and terms</h2><p>Supervised examples include a known outcome. Unsupervised exploration looks for structure without a supplied outcome label.</p></div>
      <figure className="landscape-lesson__branch-map method-atlas" aria-labelledby="ml-family-map-title">
        <figcaption id="ml-family-map-title">Machine learning landscape <span>Following the course map</span></figcaption>
        <div className="method-atlas__root">Machine learning</div>
        <div className="landscape-lesson__branches">
          <section className="landscape-lesson__branch"><h3>Supervised learning</h3><p>Learn from examples with <strong>known outcomes</strong>.</p><div className="method-atlas__supervised">
            <section className="method-atlas__column"><h4>Classification</h4><p>Estimate a <strong>category</strong></p><ul>{['K-nearest neighbors', 'Naïve Bayes', 'Logistic regression', 'Sentiment analysis'].map(name => <li key={name}>{name}</li>)}</ul><div className="method-atlas__more"><strong>Further methods</strong><ul>{['Random forests', 'Support vector machines', 'Gradient boosting', 'Neural networks / deep learning'].map(name => <li key={name}>{name}</li>)}</ul></div></section>
            <section className="method-atlas__column"><h4>Regression</h4><p>Estimate a <strong>number</strong></p><ul>{['Least squares', 'Linear regression', 'Forecasting', 'Nonlinear regression', 'Monte Carlo'].map(name => <li key={name}>{name}</li>)}</ul><div className="method-atlas__more"><strong>Further methods</strong><ul>{['LASSO / Ridge', 'State-space models', 'Generalized linear models', 'VAR', 'DFA'].map(name => <li key={name}>{name}</li>)}</ul></div></section>
          </div></section>
          <section className="landscape-lesson__branch"><h3>Unsupervised learning</h3><p>Explore structure with <strong>no supplied outcome</strong>.</p><div className="method-atlas__column method-atlas__unsupervised"><h4>Patterns &amp; structure</h4><ul>{['Clustering / segmentation', 'K-means', 'Outlier detection', 'Markov chains'].map(name => <li key={name}>{name}</li>)}</ul><div className="method-atlas__more"><strong>Further topics</strong><ul>{['Matrix factorization', 'Principal components', 'Factor analysis', 'UMAP', 't-SNE', 'Topological data analysis', 'Advanced clustering'].map(name => <li key={name}>{name}</li>)}</ul></div></div></section>
        </div>
        <p className="method-atlas__note"><strong>Read this as a course roadmap.</strong> It includes algorithms, applications and broader techniques. Sentiment analysis is an application; forecasting is a task; Monte Carlo is a simulation technique. Outlier detection and Markov chains are broader topics, rather than clustering methods.</p>
      </figure>
      <div className="landscape-lesson__choice-grid landscape-lesson__choice-grid--landscape" role="group" aria-label="Learning method families">{LANDSCAPE.map((entry) => <button key={entry.id} type="button" className={selected === entry.id ? 'landscape-lesson__choice landscape-lesson__choice--selected' : 'landscape-lesson__choice'} aria-pressed={selected === entry.id} onClick={() => setSelected(entry.id)}><span className="landscape-lesson__choice-detail">{entry.group}</span><span className="landscape-lesson__choice-title">{entry.title}</span></button>)}</div>
      <div className="landscape-lesson__interactive"><div className="landscape-lesson__copy" aria-live="polite"><p className="landscape-lesson__eyebrow">{item.group}</p><h3>{item.title}</h3><p><strong>{item.group === "Supervised learning" ? "Known outcomes guide learning." : "Look for structure without a target."}</strong><br />{item.description}</p>{selected === 'classification' && <p className="landscape-lesson__note"><strong>Examples named in this course:</strong> k-nearest neighbors, naïve Bayes, logistic regression, and sentiment analysis.</p>}{selected === 'regression' && <p className="landscape-lesson__note"><strong>Examples named in this course:</strong> least squares, linear regression, forecasting, nonlinear regression, and Monte Carlo methods.</p>}{selected === 'clustering' && <p className="landscape-lesson__note"><strong>Clustering:</strong> k-means and segmentation. <strong>Other unsupervised topics:</strong> outlier detection and Markov chains; these are not clustering methods.</p>}{selected === 'association' && <p className="landscape-lesson__note">A discovered association can be useful to investigate. It does not show that one item caused another to be selected.</p>}</div><figure className="landscape-lesson__figure"><LandscapeIllustration selected={selected} /><figcaption className="landscape-lesson__caption">A simplified illustration of the question type, not a model result.</figcaption></figure></div>
    </section>
    <section className="landscape-lesson__section" aria-labelledby="advanced-topics-heading"><div className="landscape-lesson__section-heading"><p className="landscape-lesson__eyebrow">Advanced topics</p><h2 id="advanced-topics-heading">Beyond the Foundation</h2><p>These labels describe different things: application areas, model families and learning setups. They overlap; they are not four mutually exclusive branches.</p></div><div className="landscape-lesson__topic-grid">{[
      ['Natural language processing', 'An application area for working with text, including reviews, themes and sentiment.', 'Latent semantic analysis · Latent Dirichlet allocation · Word embeddings · Translation'],
      ['Computer vision', 'Analyze images and video, often with learned feature representations.', 'Convolutional neural networks · Style transfer'],
      ['Deep learning', 'A family of neural-network methods used across language, images, and other data.', 'Feedforward networks · Convolutional neural networks · RNN / LSTM · Attention · Autoencoders · GANs'],
      ['Reinforcement learning', 'A different learning setup: an agent learns which actions to take through interaction and rewards.', 'Q-learning · Deep RL · Multi-armed bandits'],
    ].map(([title, body, examples]) => <div className="landscape-lesson__topic" key={title}><h3>{title}</h3><p>{body}</p><p className="method-atlas__examples"><strong>Examples</strong><span>{examples}</span></p></div>)}</div></section>
    <Summary title="How to read the map" items={[
      ['Look for the outcome.', 'Known category or number in historical examples points toward a supervised task.'],
      ['Look for structure.', 'When no outcome is supplied, unsupervised methods can help describe groups or co-occurrence.'],
      ['Choose for the question and data.', 'Method names are a starting point; useful analysis also depends on quality checks, evaluation, and context.'],
    ]} />
  </article>
}

function Summary({ title, items }: { title: string; items: readonly (readonly [string, string])[] }) {
  const id = useId()
  return <section className="landscape-lesson__summary" aria-labelledby={id}><p className="landscape-lesson__eyebrow">Subchapter summary</p><h2 id={id}>{title}</h2><ul>{items.map(([heading, body]) => <li key={heading}><strong>{heading}</strong><span>{body}</span></li>)}</ul></section>
}
