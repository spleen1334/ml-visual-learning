import { useState } from 'react'
import ChapterOne from './chapters/ChapterOne'
import { readCompletion, saveCompletion } from './app/progress'

const chapters = [
  ['01', 'Getting Started', 'An invitation to explore'],
  ['02', 'The ML Landscape', 'Questions, patterns & predictions'],
  ['03', 'QA & Data Profiling', 'Meet your first dataset'],
  ['04', 'Preliminary Data QA', 'Find and understand the issues'],
  ['05', 'Univariate Profiling', 'Discover the shape of data'],
]

export default function App() {
  const [complete, setComplete] = useState(readCompletion)
  const [storageUnavailable, setStorageUnavailable] = useState(false)

  function finishChapter() {
    setComplete(true)
    setStorageUnavailable(!saveCompletion())
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">Skip to lesson</a>
      <aside className="sidebar" aria-label="Course chapters">
        <a className="brand" href="#chapter-01" aria-label="ML Visual Interactive home">
          <span className="brand-mark" aria-hidden="true">m<span>l</span></span>
          <span className="brand-copy">ML Visual<span>Interactive learning</span></span>
        </a>
        <div className="sidebar-intro"><span className="eyebrow">The visual guide</span><p>A little curiosity.<br />A lot of discovery.</p></div>
        <nav className="chapter-nav" aria-label="Chapters">
          {chapters.map(([number, title, subtitle], i) => i === 0 ? (
            <a key={number} href="#chapter-01" className="chapter-link chapter-current" aria-current="page">
              <span className="chapter-number">{complete ? '✓' : number}</span>
              <span><span className="chapter-name">{title}</span><span className="chapter-meta">{complete ? 'Completed · revisit anytime' : subtitle}</span></span>
            </a>
          ) : (
            <div key={number} className="chapter-link chapter-future">
              <span className="chapter-number">{number}</span>
              <span><span className="chapter-name">{title}</span><span className="chapter-meta">In the roadmap</span></span>
            </div>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="progress-label"><span>Your journey</span><span>{complete ? '1' : '0'} / 5</span></div>
          <div className="progress-track" role="progressbar" aria-label="Chapters completed" aria-valuemin={0} aria-valuemax={5} aria-valuenow={complete ? 1 : 0}><div className="progress-fill" style={{ width: complete ? '20%' : '0%' }} /></div>
          <p>Learn by changing things.<br />Keep asking “what if?”</p>
        </div>
      </aside>
      <div className="main-panel">
        <header className="topbar"><span className="breadcrumb">THE FOUNDATIONS <span aria-hidden="true">/</span> CHAPTER 01</span><span className="local-badge"><span aria-hidden="true">●</span> Your personal learning lab</span></header>
        <main id="main" className="page-content" tabIndex={-1}>
          <ChapterOne onComplete={finishChapter} />
          {complete && <div className="completion-banner" role="status"><strong>Chapter 01 complete.</strong><span>You have explored, changed a value, and reset your experiment. Chapter 02 is the next build milestone.</span>{storageUnavailable && <p>Browser storage is unavailable. Your completion is kept for this visit only.</p>}</div>}
          <footer className="chapter-footer"><span>01 / 05 <span aria-hidden="true">—</span> Getting Started</span><span>Next: The ML Landscape <span className="roadmap-tag">Coming next</span></span></footer>
        </main>
      </div>
    </div>
  )
}
