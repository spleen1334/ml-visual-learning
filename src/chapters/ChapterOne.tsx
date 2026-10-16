import { useId, useState, useSyncExternalStore } from 'react';
import { mean } from '../math/mean';

const INITIAL_VALUES = [4, 6, 8, 10] as const;
const INITIAL_FIFTH_VALUE = 12;
const MIN_VALUE = 0;
const MAX_VALUE = 40;

const WORKFLOW_STEPS = [
  {
    id: 'prepare',
    label: 'Prepare data',
    detail: 'Check that rows, values, and labels are usable before drawing conclusions.',
  },
  {
    id: 'individual',
    label: 'Explore individual variables',
    detail: 'Look at one column at a time: its values, typical level, and spread.',
  },
  {
    id: 'relationships',
    label: 'Explore relationships',
    detail: 'Compare variables to see whether they move together or differ across groups.',
  },
  {
    id: 'model',
    label: 'Build a model',
    detail: 'Use a suitable method to describe a pattern or make a prediction, then inspect its limits.',
  },
] as const;

type WorkflowId = (typeof WORKFLOW_STEPS)[number]['id'];

function WorkflowDiagram({ selectedStep }: { selectedStep: WorkflowId | '' }) {
  return (
    <figure className="course-flow">
      <figcaption><strong>From raw data to a useful model</strong><span>Illustrative views of the work at each stage</span></figcaption>
      <ol className="course-flow__stages">
        {WORKFLOW_STEPS.map((step, index) => (
          <li key={step.id} className={selectedStep === step.id ? 'course-flow__stage is-selected' : 'course-flow__stage'}>
            <span className="course-flow__label">0{index + 1} · {['Check', 'Describe', 'Connect', 'Predict'][index]}</span>
            <svg viewBox="0 0 160 110" role="img" aria-label={[
              'Prepare: a table with a missing value and an unusual value highlighted for inspection.',
              'Individual variables: histogram bars show how values are distributed.',
              'Relationships: a scatter plot shows two variables tending to increase together.',
              'Model: a fitted line summarizes a trend, with a new prediction highlighted.',
            ][index]}>
              {index === 0 ? <>
                {[0, 1, 2, 3].map(row => [0, 1, 2].map(col => <rect key={`${row}-${col}`} x={15 + col * 44} y={15 + row * 21} width="39" height="16" rx="3" className={row === 1 && col === 1 ? 'flow-cell-missing' : row === 3 && col === 2 ? 'flow-cell-suspect' : 'flow-cell'} />))}
                <text x="78" y="48" textAnchor="middle">?</text><text x="122" y="90" textAnchor="middle">!</text>
              </> : <>
                <path d="M18 12 V92 H148" className="flow-axis" />
                {index === 1 ? [20, 39, 66, 49, 28, 12].map((height, j) => <rect key={j} x={27 + j * 19} y={91 - height} width="14" height={height} rx="2" className="flow-bar" />) : <>
                  {[[32, 77], [48, 72], [59, 52], [77, 61], [90, 42], [109, 38], [127, 22]].map(([x, y], j) => <circle key={j} cx={x} cy={y} r="4" className="flow-point" />)}
                  {index === 3 && <><path d="M25 85 L143 16" className="flow-fit" /><circle cx="139" cy="18" r="6" className="flow-prediction" /></>}
                </>}
              </>}
            </svg>
            <strong>{step.label}</strong>
            <span className="course-flow__question">{['Can I trust these values?', 'What is typical? What varies?', 'Which values move together?', 'What can this pattern tell us?'][index]}</span>
          </li>
        ))}
      </ol>
      <p className="course-flow__loop"><span aria-hidden="true">↶</span> <strong>Revisit any earlier step.</strong> A surprising pattern can send you back to inspect the data.</p>
    </figure>
  );
}

function CalculationFlow({ values, average }: { values: number[]; average: number }) {
  const arrowId = useId();
  const total = values.reduce((sum, value) => sum + value, 0);
  return (
    <section className="calculation-flow" aria-labelledby={`${arrowId}-heading`}>
      <p className="chapter-one__eyebrow">Follow the numbers</p>
      <h3 id={`${arrowId}-heading`}>Five rows → one average</h3>
      <p>Each table row contributes <strong>one value to the total</strong>. Then share that total equally across <strong>all five rows</strong>.</p>
      <svg viewBox="0 0 560 350" role="img" aria-label={`Day values ${values.join(', ')} add to ${total}. Divide that total by the five table rows to get ${formatNumber(average)} units per day.`}>
        <defs><marker id={arrowId} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill="#126b63" /></marker></defs>
        <text x="45" y="22" className="calc-caption">VALUES FROM THE TABLE</text>
        {values.map((value, index) => {
          const x = 56 + index * 108;
          return <g key={index}>
            <rect x={x - 43} y="38" width="86" height="64" rx="8" className={index === 4 ? 'calc-source calc-source--editable' : 'calc-source'} />
            <text x={x} y="60" textAnchor="middle" className="calc-day">Day {index + 1}</text>
            <text x={x} y="86" textAnchor="middle" className="calc-value">{value}</text>
            <path d={`M${x} 108 V151`} className="calc-arrow" markerEnd={`url(#${arrowId})`} />
            <text x={x} y="184" textAnchor="middle" className="calc-value">{value}</text>
            {index < 4 && <text x={x + 54} y="184" textAnchor="middle" className="calc-plus">+</text>}
          </g>;
        })}
        <path d="M18 199 H542" className="calc-fraction" />
        <text x="280" y="231" textAnchor="middle" className="calc-value">5 rows</text>
        <path d="M18 112 V128 H30 M542 112 V128 H530" className="calc-bracket" />
        <text x="280" y="250" textAnchor="middle" className="calc-note">Count every row once → divide by 5</text>
        <rect x="80" y="261" width="400" height="68" rx="10" className="calc-result" />
        <text x="280" y="288" textAnchor="middle" className="calc-day">TOTAL ÷ NUMBER OF ROWS</text>
        <text x="280" y="315" textAnchor="middle" className="calc-value">{total} ÷ 5 = {formatNumber(average)} units per day</text>
      </svg>
      <p className="calculation-flow__takeaway"><strong>The denominator stays at 5.</strong> Moving Day 5 changes a value, <em>not the number of rows</em>.</p>
    </section>
  );
}

function formatNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function subscribeToChartWidth(notify: () => void) {
  const query = window.matchMedia('(max-width: 620px)');
  query.addEventListener('change', notify);
  return () => query.removeEventListener('change', notify);
}

function DotPlot({ values, average }: { values: readonly number[]; average: number }) {
  const compact = useSyncExternalStore(subscribeToChartWidth, () => window.matchMedia('(max-width: 620px)').matches, () => false);
  const titleId = useId();
  const descriptionId = useId();
  const width = compact ? 340 : 620;
  const height = compact ? 270 : 214;
  const left = compact ? 52 : 72;
  const right = compact ? 24 : 30;
  const bottom = compact ? 218 : 168;
  const chartWidth = width - left - right;
  const x = (value: number) => left + (value / MAX_VALUE) * chartWidth;
  const ticks = [0, 10, 20, 30, 40];

  return (
    <svg
      className="chapter-one__dot-plot"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-labelledby={`${titleId} ${descriptionId}`}
    >
      <title id={titleId}>Five daily unit-sale values and their mean</title>
      <desc id={descriptionId}>
        A horizontal dot plot on a scale from zero to forty units. The first four values are 4, 6, 8,
        and 10. The fifth value is {values[4]}. A dashed vertical line marks the mean, {formatNumber(average)} units.
      </desc>

      {ticks.map((tick) => (
        <g key={tick} className="chapter-one__plot-tick">
          <line x1={x(tick)} x2={x(tick)} y1="26" y2={bottom} />
          <text x={x(tick)} y={bottom + 22} textAnchor="middle">
            {tick}
          </text>
        </g>
      ))}

      <line
        className="chapter-one__mean-line"
        x1={x(average)}
        x2={x(average)}
        y1="22"
        y2={bottom}
      />
      <text className="chapter-one__mean-label" x={x(average)} y="16" textAnchor="middle">
        Mean {formatNumber(average)}
      </text>

      {values.map((value, index) => {
        const cy = compact ? 50 + index * 37 : 49 + index * 27;
        return (
          <g key={`day-${index + 1}`} className={index === 4 ? 'chapter-one__dot chapter-one__dot--editable' : 'chapter-one__dot'}>
            <text x="8" y={cy + 4}>
              Day {index + 1}
            </text>
            <circle cx={x(value)} cy={cy} r="7" />
            <text className="chapter-one__point-value" x={x(value) + 12} y={cy + 4}>
              {value}
            </text>
          </g>
        );
      })}
      <text className="chapter-one__axis-label" x={left + chartWidth / 2} y={height - 4} textAnchor="middle">
        Units sold in one day
      </text>
    </svg>
  );
}

export default function ChapterOne() {
  const [fifthValue, setFifthValue] = useState(INITIAL_FIFTH_VALUE);
  const [fifthValueDraft, setFifthValueDraft] = useState(String(INITIAL_FIFTH_VALUE));
  const [selectedStep, setSelectedStep] = useState<WorkflowId | ''>('');
  const numberInputId = useId();
  const sliderId = useId();

  const values = [...INITIAL_VALUES, fifthValue];
  const initialMean = mean([...INITIAL_VALUES, INITIAL_FIFTH_VALUE]);
  const currentMean = mean(values);
  const delta = currentMean - initialMean;
  const selectedWorkflow = WORKFLOW_STEPS.find((step) => step.id === selectedStep);

  function updateFifthValue(nextValue: number) {
    const boundedValue = Math.min(MAX_VALUE, Math.max(MIN_VALUE, Math.round(nextValue)));
    setFifthValue(boundedValue);
    setFifthValueDraft(String(boundedValue));

  }

  function resetExperiment() {
    setFifthValue(INITIAL_FIFTH_VALUE);
    setFifthValueDraft(String(INITIAL_FIFTH_VALUE));

  }

  function commitFifthValueDraft() {
    const parsedValue = Number(fifthValueDraft);
    if (fifthValueDraft.trim() === '' || !Number.isFinite(parsedValue)) {
      setFifthValueDraft(String(fifthValue));
      return;
    }

    updateFifthValue(parsedValue);
  }

  return (
    <article className="chapter-one" aria-labelledby="chapter-one-title">
      <header className="chapter-one__intro">
        <p className="chapter-one__eyebrow">Chapter 01 · Getting started</p>
        <h1 id="chapter-one-title">Learn the idea before the algorithm</h1>
        <p className="chapter-one__subtitle">
          A visual learning companion for exploring machine learning and data science. Work through
          one small question at a time and see how each result is built.
        </p>
        <div className="chapter-one__intro-notes">
          <p><strong>See it. Change it. Understand it.</strong> Guided examples give you space to build intuition before reaching for algorithms.</p>
          <p className="chapter-one__welcome"><em>Start with curiosity.</em> No coding or statistics background is needed.</p>
        </div>
      </header>

      <section className="chapter-one__section" aria-labelledby="chapter-one-roadmap-title">
        <div className="chapter-one__section-heading">
          <p className="chapter-one__eyebrow">Your course map</p>
          <h2 id="chapter-one-roadmap-title">Four steps, with room to revisit</h2>
          <p>Choose a step to see the kind of question it helps answer.</p>
        </div>
        <WorkflowDiagram selectedStep={selectedStep} />
        <ol className="chapter-one__workflow" aria-label="Machine learning learning workflow">
          {WORKFLOW_STEPS.map((step, index) => (
            <li key={step.id} className="chapter-one__workflow-item">
              <button
                type="button"
                className="chapter-one__workflow-button"
                aria-pressed={selectedStep === step.id}
                onClick={() => setSelectedStep(step.id)}
              >
                <span className="chapter-one__workflow-number">{String(index + 1).padStart(2, '0')}</span>
                <span>{step.label}</span>
              </button>
            </li>
          ))}
        </ol>
        <p className="chapter-one__workflow-detail" aria-live="polite">
          {selectedWorkflow?.detail ?? 'Select any step to preview what you will explore there.'}
          {' '}The work can loop back when a question reveals something to fix or inspect.
        </p>
      </section>

      <section className="chapter-one__experiment" aria-labelledby="chapter-one-experiment-title">
        <div className="chapter-one__experiment-copy">
          <p className="chapter-one__eyebrow">Try a small change</p>
          <h2 id="chapter-one-experiment-title">What happens to the average when one day is higher?</h2>
          <p>
            These are unit sales across <strong>five days</strong>. The first four days stay at 4, 6, 8, and 10 units.
            <strong>Change Day 5</strong>, then watch where the average moves.
          </p>
        </div>

        <aside className="chapter-one__callout" aria-labelledby="notice-title">
          <h3 id="notice-title">Watch how one value moves the average</h3>
          <p>When Day 5 rises, the average rises by <strong>one fifth of that change</strong>, because the total is shared across five days.</p>
          <p>Try changing Day 5 from 12 to 22: the day gains <strong>10 units</strong>, while the average gains <strong>2 units</strong>, moving from 8 to 10.</p>
        </aside>

        <div className="chapter-one__controls">
          <label htmlFor={sliderId}>Day 5 units sold</label>
          <div className="chapter-one__slider-row">
            <input
              id={sliderId}
              aria-label="Day 5 units sold slider"
              type="range"
              min={MIN_VALUE}
              max={MAX_VALUE}
              step="1"
              value={fifthValue}
              onChange={(event) => updateFifthValue(Number(event.currentTarget.value))}
            />
            <div className="chapter-one__number-control">
              <label htmlFor={numberInputId}>Day 5 value</label>
              <input
                id={numberInputId}
                type="number"
                min={MIN_VALUE}
                max={MAX_VALUE}
                step="1"
                value={fifthValueDraft}
                onChange={(event) => {
                  setFifthValueDraft(event.currentTarget.value);
                }}
                onBlur={commitFifthValueDraft}
              />
            </div>
          </div>
          <button className="chapter-one__reset" type="button" onClick={resetExperiment}>
            Reset to 12 units
          </button>
        </div>

        <div className="chapter-one__visual" role="group" aria-label="Daily sales dot plot and values">
          <DotPlot values={values} average={currentMean} />
          <div className="chapter-one__mean-result" aria-live="polite">
            <p><span>Current average</span><strong>{formatNumber(currentMean)} units</strong></p>
            <p><span>Change from the starting average (8)</span><strong>{delta > 0 ? '+' : ''}{formatNumber(delta)} units</strong></p>
          </div>
          <p className="chapter-one__chart-alt">
            Values by day: {values.map((value, index) => `Day ${index + 1}, ${value}`).join('; ')}.
            {' '}The average is {formatNumber(currentMean)} units.
          </p>
          <table className="chapter-one__data-table">
            <caption>Daily unit sales</caption>
            <thead><tr><th scope="col">Day</th><th scope="col">Units sold</th></tr></thead>
            <tbody>{values.map((value, index) => (
              <tr key={`row-${index}`}>
                <th scope="row">Day {index + 1}</th>
                <td>{value}{index === 4 ? ' (editable)' : ''}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>

        <CalculationFlow values={values} average={currentMean} />
      </section>

      <section className="chapter-one__summary" aria-labelledby="chapter-one-summary-title">
        <p className="chapter-one__eyebrow">Chapter summary</p>
        <h2 id="chapter-one-summary-title">What to take with you</h2>
        <ul>
          <li><strong>Prepare before you model.</strong><span>Check your rows, values and labels before drawing conclusions.</span></li>
          <li><strong>Look closely, then connect.</strong><span>Explore individual variables, then relationships. <em>Revisit earlier steps</em> whenever something needs attention.</span></li>
          <li><strong>One value affects the whole average.</strong><span>The mean is <em>total ÷ number of values</em>. Across five days, a <strong>10-unit</strong> change in one day moves the mean by <strong>2 units</strong>.</span></li>
          <li><strong>Learn by changing things.</strong><span>Move a value, watch the chart and open the calculation. Connect the idea to <em>what you can see</em>.</span></li>
        </ul>
      </section>
    </article>
  );
}
