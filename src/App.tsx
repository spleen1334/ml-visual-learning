import { useSyncExternalStore } from 'react'
import { chapters, chapterHref, resolveLesson } from './app/course'

function subscribeToHashChange(notify: () => void) {
  window.addEventListener('hashchange', notify)
  return () => window.removeEventListener('hashchange', notify)
}

export default function App() {
  const hash = useSyncExternalStore(subscribeToHashChange, () => window.location.hash, () => '#chapter-01')
  const { chapter: currentChapter, section, Content } = resolveLesson(hash)
  const nextChapter = chapters[chapters.indexOf(currentChapter) + 1]
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
          {chapters.map(chapter => {
            const available = Boolean(chapter.content || chapter.subchapters?.length)
            const current = currentChapter.id === chapter.id
            const label = <><span className="chapter-number">{chapter.number}</span><span><span className="chapter-name">{chapter.title}</span><span className="chapter-meta">{available ? chapter.subtitle : 'In the roadmap'}</span></span></>
            return <div key={chapter.id} className="chapter-group">
              {available ? <a href={chapterHref(chapter)} className={`chapter-link ${current ? 'chapter-current' : ''}`} aria-current={current && !section ? 'page' : undefined}>{label}</a>
                : <div className="chapter-link chapter-future">{label}</div>}
              {chapter.subchapters?.length ? <ol className="subchapter-nav" aria-label={`${chapter.title} subchapters`}>
                {chapter.subchapters.map((item, index) => <li key={item.id}><a href={chapterHref(chapter, item)} aria-current={current && section?.id === item.id ? 'page' : undefined}><span>{chapter.number}.{index + 1}</span> {item.title}</a></li>)}
              </ol> : null}
            </div>
          })}
        </nav>
        <div className="sidebar-footer">
          <div className="progress-label"><span>Explore at your own pace</span></div>
          <p>Learn by changing things.<br />Keep asking “what if?”</p>
        </div>
      </aside>
      <div className="main-panel">
        <header className="topbar"><span className="breadcrumb">THE FOUNDATIONS <span aria-hidden="true">/</span> CHAPTER {currentChapter.number}{section && <> / {section.title}</>}</span><span className="local-badge"><span aria-hidden="true">●</span> Your personal learning lab</span></header>
        <main id="main" className="page-content" tabIndex={-1}>
          <Content key={`${currentChapter.id}/${section?.id ?? ""}`} />
          <footer className="chapter-footer"><span>{currentChapter.number} / 05 <span aria-hidden="true">—</span> {currentChapter.title}</span>{nextChapter && <span>Next: {nextChapter.title} <span className="roadmap-tag">Coming next</span></span>}</footer>
        </main>
      </div>
    </div>
  )
}
