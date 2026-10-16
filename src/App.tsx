import { useEffect, useSyncExternalStore } from 'react'
import { chapters, chapterHref, publishedLessons, resolveLesson } from './app/course'

function subscribeToHashChange(notify: () => void) {
  window.addEventListener('hashchange', notify)
  return () => window.removeEventListener('hashchange', notify)
}

export default function App() {
  const hash = useSyncExternalStore(subscribeToHashChange, () => window.location.hash, () => '#chapter-01')
  const { chapter: currentChapter, section, Content } = resolveLesson(hash)
  const lessons = publishedLessons()
  const position = lessons.findIndex(item => item.href === chapterHref(currentChapter, section))
  const previousLesson = lessons[position - 1]
  const nextLesson = lessons[position + 1]
  const nextChapter = chapters[chapters.indexOf(currentChapter) + 1]

  useEffect(() => {
    document.title = `${section?.title ?? currentChapter.title} · ML Visual Interactive`
    document.getElementById('main')?.focus({ preventScroll: true })
    window.scrollTo(0, 0)
  }, [currentChapter.id, currentChapter.title, section?.id, section?.title])
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
                {chapter.subchapters.map((item, index) => <li key={item.id}><a href={chapterHref(chapter, item)} aria-current={current && section?.id === item.id ? 'page' : undefined}><span>{Number(chapter.number)}.{index + 1}</span> {item.title}</a></li>)}
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
          {currentChapter.subchapters?.length ? <nav className="lesson-strip" aria-label="Subchapters in this chapter">
            {currentChapter.subchapters.map((item, index) => <a key={item.id} href={chapterHref(currentChapter, item)} aria-current={section?.id === item.id ? 'page' : undefined}>{Number(currentChapter.number)}.{index + 1} {item.title}</a>)}
          </nav> : null}
          <Content key={`${currentChapter.id}/${section?.id ?? ""}`} />
          <footer className="chapter-footer">
            <span>{currentChapter.number} / 05 <span aria-hidden="true">—</span> {currentChapter.title}{section && <> · {(currentChapter.subchapters?.findIndex(item => item.id === section.id) ?? 0) + 1} / {currentChapter.subchapters?.length} lessons</>}</span>
            <nav className="lesson-pagination" aria-label="Lesson navigation">
              {previousLesson && <a className="secondary-button" href={previousLesson.href}>← {previousLesson.title}</a>}
              {nextLesson ? <a className="primary-button" href={nextLesson.href}>Next: {nextLesson.title} →</a> : nextChapter && <span>Next: {nextChapter.title} <span className="roadmap-tag">Coming next</span></span>}
            </nav>
          </footer>
        </main>
      </div>
    </div>
  )
}
