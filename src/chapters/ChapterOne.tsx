import { useId, useState } from 'react';
import { mean } from '../math/mean';

type ChapterOneProps = {
  onComplete: () => void;
};

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

function formatNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function DotPlot({ values, average }: { values: readonly number[]; average: number }) {
  const titleId = useId();
  const descriptionId = useId();
  const width = 620;
  const height = 214;
  const left = 72;
  const right = 30;
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
        and 10. The fifth value is {values[4]}. The vertical teal line marks the mean, {formatNumber(average)} units.
      </desc>

      {ticks.map((tick) => (
        <g key={tick} className="chapter-one__plot-tick">
          <line x1={x(tick)} x2={x(tick)} y1="26" y2="168" />
          <text x={x(tick)} y="190" textAnchor="middle">
            {tick}
          </text>
        </g>
      ))}

      <line
        className="chapter-one__mean-line"
        x1={x(average)}
        x2={x(average)}
        y1="22"
        y2="168"
      />
      <text className="chapter-one__mean-label" x={x(average)} y="16" textAnchor="middle">
        Mean {formatNumber(average)}
      </text>

      {values.map((value, index) => {
        const cy = 49 + index * 27;
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
      <text className="chapter-one__axis-label" x={left + chartWidth / 2} y="210" textAnchor="middle">
        Units sold in one day
      </text>
    </svg>
  );
}

export default function ChapterOne({ onComplete }: ChapterOneProps) {
  const [fifthValue, setFifthValue] = useState(INITIAL_FIFTH_VALUE);
  const [hasChangedValue, setHasChangedValue] = useState(false);
  const [hasReset, setHasReset] = useState(false);
  const [selectedStep, setSelectedStep] = useState<WorkflowId | ''>('');
  const [prediction, setPrediction] = useState('');
  const [selectedObservation, setSelectedObservation] = useState('');
  const [checkResult, setCheckResult] = useState<'correct' | 'incomplete' | ''>('');
  const numberInputId = useId();
  const sliderId = useId();
  const calculationId = useId();

  const values = [...INITIAL_VALUES, fifthValue];
  const initialMean = mean([...INITIAL_VALUES, INITIAL_FIFTH_VALUE]);
  const currentMean = mean(values);
  const delta = currentMean - initialMean;
  const selectedWorkflow = WORKFLOW_STEPS.find((step) => step.id === selectedStep);
  const canComplete = hasChangedValue && hasReset && fifthValue === INITIAL_FIFTH_VALUE;

  function updateFifthValue(nextValue: number) {
    const boundedValue = Math.min(MAX_VALUE, Math.max(MIN_VALUE, Math.round(nextValue)));
    setFifthValue(boundedValue);
    setHasChangedValue((changed) => changed || boundedValue > INITIAL_FIFTH_VALUE);
    setCheckResult('');
  }

  function resetExperiment() {
    setFifthValue(INITIAL_FIFTH_VALUE);
    setHasReset(true);
    setCheckResult('');
  }

  function submitCheck() {
    if (!canComplete) {
      setCheckResult('incomplete');
      return;
    }

    if (selectedStep === 'prepare' && selectedObservation === 'follows') {
      setCheckResult('correct');
      onComplete();
      return;
    }

    setCheckResult('incomplete');
  }

  return (
    <article className="chapter-one" aria-labelledby="chapter-one-title">
      <header className="chapter-one__intro">
        <p className="chapter-one__eyebrow">Chapter 01 · Getting started</p>
        <h1 id="chapter-one-title">Learn the idea before the algorithm</h1>
        <p className="chapter-one__subtitle">
          A visual, beginner-friendly introduction to machine learning and data science. We’ll make
          familiar ideas easier to inspect, one small question at a time.
        </p>
        <p>
          This course uses guided examples and interactive models to show what methods do and why
          they work. You do not need to code or arrive with a statistics background. The aim is to
          build intuition you can carry into later tools and projects.
        </p>
      </header>

      <section className="chapter-one__section" aria-labelledby="chapter-one-roadmap-title">
        <div className="chapter-one__section-heading">
          <p className="chapter-one__eyebrow">Your course map</p>
          <h2 id="chapter-one-roadmap-title">Four steps, with room to revisit</h2>
          <p>Choose a step to see the kind of question it helps answer.</p>
        </div>
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
            These are unit sales across five days. The first four days stay at 4, 6, 8, and 10 units.
            Change Day 5, then watch where the average moves.
          </p>
        </div>

        <fieldset className="chapter-one__prediction">
          <legend>Before you move the control: if Day 5 rises, what do you predict?</legend>
          <label><input type="radio" name="prediction" value="less" checked={prediction === 'less'} onChange={() => setPrediction('less')} /> The average rises by less than Day 5 does</label>
          <label><input type="radio" name="prediction" value="same" checked={prediction === 'same'} onChange={() => setPrediction('same')} /> The average stays where it is</label>
          <label><input type="radio" name="prediction" value="equal" checked={prediction === 'equal'} onChange={() => setPrediction('equal')} /> The average rises by the same amount</label>
          {prediction && (
            <p className="chapter-one__prediction-feedback" role="status">
              {prediction === 'less'
                ? 'Good prediction. One of five values changes, so the average moves by one fifth of that change. Try it and see.'
                : 'Try changing Day 5 and watch the average line. The other four days still count in the total, so the result may surprise you.'}
            </p>
          )}
        </fieldset>

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
                value={fifthValue}
                onChange={(event) => {
                  if (event.currentTarget.value !== '') updateFifthValue(Number(event.currentTarget.value));
                }}
              />
            </div>
          </div>
          <button className="chapter-one__reset" type="button" onClick={resetExperiment}>
            Reset to 12 units
          </button>
        </div>

        <div className="chapter-one__visual" aria-label="Daily sales dot plot and values">
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

        <details className="chapter-one__calculation">
          <summary aria-controls={calculationId}>Show the calculation</summary>
          <div id={calculationId}>
            <p>Add the five daily values and divide by the five days.</p>
            <p className="chapter-one__equation">
              ({values.join(' + ')}) ÷ 5 = {formatNumber(currentMean)} units per day
            </p>
            <p>
              Day 5 changes the total by {fifthValue - INITIAL_FIFTH_VALUE} units. Spread across five
              days, that changes the average by {formatNumber(delta)} units.
            </p>
          </div>
        </details>
      </section>

      <section className="chapter-one__check" aria-labelledby="chapter-one-check-title">
        <p className="chapter-one__eyebrow">Quick check</p>
        <h2 id="chapter-one-check-title">Can you choose a useful starting point?</h2>
        <p>Use what you noticed in the experiment, then choose the best answer for each question.</p>

        <fieldset className="chapter-one__check-question">
          <legend>When you first receive a dataset, where should you start?</legend>
          <label><input type="radio" name="first-step" value="prepare" checked={selectedStep === 'prepare'} onChange={() => { setSelectedStep('prepare'); setCheckResult(''); }} /> Check and prepare the data</label>
          <label><input type="radio" name="first-step" value="model" checked={selectedStep === 'model'} onChange={() => { setSelectedStep('model'); setCheckResult(''); }} /> Fit a model before looking at the data</label>
        </fieldset>

        <fieldset className="chapter-one__check-question">
          <legend>What did the average do when Day 5 rose above 12?</legend>
          <label><input type="radio" name="observation" value="follows" checked={selectedObservation === 'follows'} onChange={() => { setSelectedObservation('follows'); setCheckResult(''); }} /> It rose too, by less than the change in that one day</label>
          <label><input type="radio" name="observation" value="same" checked={selectedObservation === 'same'} onChange={() => { setSelectedObservation('same'); setCheckResult(''); }} /> It stayed the same because four days did not change</label>
          <label><input type="radio" name="observation" value="equal" checked={selectedObservation === 'equal'} onChange={() => { setSelectedObservation('equal'); setCheckResult(''); }} /> It rose by the full amount Day 5 changed</label>
        </fieldset>

        <button className="chapter-one__check-button" type="button" onClick={submitCheck}>
          Check my answers
        </button>
        <p className="chapter-one__check-feedback" role="status" aria-live="polite">
          {checkResult === 'correct'
            ? 'That’s it. Start by preparing the data, and notice that one changed value moves the average by one fifth of its change. Your experiment is reset and ready to continue.'
            : checkResult === 'incomplete'
              ? !canComplete
                ? 'First, raise Day 5 above 12 so you can observe the average move, then use Reset to return to the starting data. After that, choose both answers.'
                : 'Take another look at the course map and the average change, then try those two choices again.'
              : ''}
        </p>
      </section>

      <details className="chapter-one__source">
        <summary>About this chapter</summary>
        <p>
          This introduction adapts the course overview and expectations from “01. Getting Started/1.
          Course Structure &amp; Outline.vtt” and “01. Getting Started/4. Setting Expectations.vtt”.
          The lesson wording here is original; no transcript is reproduced.
        </p>
      </details>
    </article>
  );
}
