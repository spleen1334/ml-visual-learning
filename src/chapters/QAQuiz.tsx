import { useState } from 'react'
import questions from './qaQuizData.json'
import './QAQuiz.css'

export default function QAQuiz() {
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [checked, setChecked] = useState<Record<number, boolean>>({})
  const question = questions[index]
  const revealed = Boolean(checked[index])
  const correct = revealed && answers[index] === question.answer
  const checkedCount = Object.keys(checked).length
  const score = questions.filter((q, i) => checked[i] && answers[i] === q.answer).length
  function reset() { setIndex(0); setAnswers({}); setChecked({}) }
  return <article className="qa-quiz" aria-labelledby="quiz-title">
    <header><p className="eyebrow">Practice · 13 questions</p><h1 id="quiz-title">Preliminary Data QA quiz</h1><p>Choose an answer, check it, and read the explanation. Try again whenever you like.</p></header>
    <nav className="quiz-map" aria-label="Quiz questions">{questions.map((q, i) => <button key={q.id} aria-label={`Question ${i + 1}${checked[i] ? answers[i] === q.answer ? ', correct' : ', review' : ''}`} aria-current={index === i ? 'step' : undefined} onClick={() => setIndex(i)}>{i + 1}{checked[i] && <span aria-hidden="true">{answers[i] === q.answer ? ' ✓' : ' ↺'}</span>}</button>)}</nav>
    <section className="quiz-card" aria-label={`Question ${index + 1}`}>
      <p className="eyebrow">Question {index + 1} of {questions.length}</p>
      <fieldset key={question.id} disabled={revealed}><legend>{question.question}</legend><div className="quiz-options">{question.options.map((option, i) => <label key={option} className={`${answers[index] === i ? 'selected' : ''} ${revealed && i === question.answer ? 'correct' : ''}`}><input type="radio" name={`question-${question.id}`} checked={answers[index] === i} onChange={() => setAnswers({ ...answers, [index]: i })} /><span>{option}</span>{revealed && i === question.answer && <strong>✓ Correct answer</strong>}</label>)}</div></fieldset>
      {revealed && <div className={`quiz-feedback ${correct ? '' : 'review'}`} role="status"><strong>{correct ? 'Correct.' : 'Take another look.'}</strong><p>{question.explanation}</p></div>}
      <div className="quiz-actions">{!revealed ? <button className="quiz-primary" disabled={answers[index] === undefined} onClick={() => setChecked({ ...checked, [index]: true })}>Check answer</button> : <button onClick={() => { const next = { ...checked }; delete next[index]; setChecked(next); const selections = { ...answers }; delete selections[index]; setAnswers(selections) }}>Try again</button>}<div><button disabled={index === 0} onClick={() => setIndex(index - 1)}>Previous question</button><button disabled={index === questions.length - 1} onClick={() => setIndex(index + 1)}>Next question →</button></div></div>
    </section>
    <footer className="quiz-summary"><p aria-live="polite">{checkedCount === questions.length ? 'All questions checked.' : `${checkedCount} of ${questions.length} checked.`} <strong>{score} correct</strong>{checkedCount === questions.length && score < questions.length ? ' · Revisit any question to retry.' : ''}</p><button onClick={reset}>Start over</button></footer>
  </article>
}
