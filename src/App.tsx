import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react'
import { chapters, chapterHref, publishedLessons, resolveLesson } from './app/course'
import CommandPalette from './app/CommandPalette'

function subscribeToHashChange(notify: () => void) {
  window.addEventListener('hashchange', notify)
  return () => window.removeEventListener('hashchange', notify)
}

export default function App() {
  const hash = useSyncExternalStore(subscribeToHashChange, () => window.location.hash, () => '#chapter-01')
  const { chapter: currentChapter, section, Content } = resolveLesson(hash)
  const [expandedChapter, setExpandedChapter] = useState<string | null>(currentChapter.id)
  const chapterNav = useRef<HTMLElement>(null)
  const lessons = publishedLessons()
  const position = lessons.findIndex(item => item.href === chapterHref(currentChapter, section))
  const sectionNumber = section ? (currentChapter.subchapters?.findIndex(item => item.id === section.id) ?? -1) + 1 : undefined
  const previousLesson = lessons[position - 1]
  const nextLesson = lessons[position + 1]

  function revealCurrentLesson(center = false) {
    setExpandedChapter(currentChapter.id)
    // Wait for the active chapter's lesson list to open, then move only the TOC.
    const frame = requestAnimationFrame(() => {
      const nav = chapterNav.current
      const active = nav?.querySelector<HTMLElement>('[aria-current="page"]')
      if (!nav || !active) return
      const bounds = nav.getBoundingClientRect()
      const target = active.getBoundingClientRect()
      if (center || target.top < bounds.top || target.bottom > bounds.bottom) {
        nav.scrollTop += target.top - bounds.top - (nav.clientHeight - target.height) / 2
      }
      if (target.left < bounds.left || target.right > bounds.right) {
        nav.scrollLeft += target.left - bounds.left
      }
    })
    return frame
  }

  useLayoutEffect(() => {
    const frame = revealCurrentLesson()
    return () => cancelAnimationFrame(frame)
  }, [currentChapter.id, section?.id])

  useEffect(() => {
    // Upgrade existing lesson bookmarks without adding a browser-history entry.
    const legacyHash = section ? `#${currentChapter.id}/${section.id}` : undefined
    if (hash === legacyHash) {
      window.history.replaceState(window.history.state, '', chapterHref(currentChapter, section))
      window.dispatchEvent(new HashChangeEvent('hashchange'))
    }
  }, [hash, currentChapter, section])

  useEffect(() => {
    document.title = section
      ? `${currentChapter.number}.${sectionNumber} ${section.title} · ML Visual Interactive`
      : `Chapter ${currentChapter.number}: ${currentChapter.title} · ML Visual Interactive`
    document.getElementById('main')?.focus({ preventScroll: true })
    window.scrollTo(0, 0)
  }, [currentChapter.id, currentChapter.number, currentChapter.title, sectionNumber, section?.id, section?.title])
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">Skip to lesson</a>
      <aside className="sidebar" aria-label="Course chapters">
        <a className="brand" href="#chapter-01" aria-label="ML Visual Interactive home">
          <img className="brand-mark" src="/ml-visual-learning-mark.png" alt="" />
          <span className="brand-copy">ML Visual<span>Interactive learning</span></span>
        </a>
        <div className="sidebar-tools">
        <CommandPalette onFocusCurrentLesson={() => revealCurrentLesson(true)} />
        <button aria-label="Focus current lesson" className="toc-focus-button" onClick={() => revealCurrentLesson(true)} title="Center the current lesson in the table of contents">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="12" cy="12" r="7" /><circle cx="12" cy="12" r="2" /><path d="M12 2v4m0 12v4M2 12h4m12 0h4" /></svg>
        </button>
        </div>
        <nav ref={chapterNav} className="chapter-nav" aria-label="Chapters">
          {chapters.map(chapter => {
            const available = Boolean(chapter.content || chapter.subchapters?.some(item => item.content))
            const current = currentChapter.id === chapter.id
            const label = <><span className="chapter-number">{chapter.number}</span><span><span className="chapter-name">{chapter.title}</span><span className="chapter-meta">{available ? chapter.subtitle : 'In the roadmap'}</span></span></>
            return <div key={chapter.id} className="chapter-group" data-chapter-id={chapter.id}>
              <div className="chapter-heading">
                {available ? <a href={chapterHref(chapter)} className={`chapter-link ${current ? 'chapter-current' : ''}`} aria-current={current && !section ? 'page' : undefined}>{label}</a>
                  : <div className="chapter-link chapter-future">{label}</div>}
                {Boolean(chapter.subchapters?.length) && <button
                  className="chapter-toggle"
                  aria-label={`${expandedChapter === chapter.id ? 'Collapse' : 'Expand'} ${chapter.title} lessons`}
                  aria-expanded={expandedChapter === chapter.id}
                  aria-controls={`${chapter.id}-lessons`}
                  onClick={() => setExpandedChapter(expandedChapter === chapter.id ? null : chapter.id)}
                ><span aria-hidden="true">⌄</span></button>}
              </div>
              {Boolean(chapter.subchapters?.length) && <ol id={`${chapter.id}-lessons`} hidden={expandedChapter !== chapter.id} className={`subchapter-nav ${available ? '' : 'planned-sections'}`} aria-label={`${chapter.title} subchapters`}>
                {chapter.subchapters?.map((item, index) => <li key={item.id}>{item.content ? <a href={chapterHref(chapter, item)} aria-current={current && section?.id === item.id ? 'page' : undefined}><span>{Number(chapter.number)}.{index + 1}</span> {item.title}{current && section?.id === item.id && <small className="current-lesson-label">Current lesson</small>}</a> : <span className="planned-section" data-section-id={item.id}><span>{Number(chapter.number)}.{index + 1}</span> {item.title}</span>}</li>)}
              </ol>}

            </div>
          })}
        </nav>
      </aside>
      <div className="main-panel">
        <header className="topbar">
          <nav className="breadcrumb" aria-label="Current lesson">
            <span className="header-chapter">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 6c-3-2-6-2-9-1v14c3-1 6-1 9 1 3-2 6-2 9-1V5c-3-1-6-1-9 1Z" /><path d="M12 6v14" /></svg>
              Chapter <strong className="header-number">{currentChapter.number}</strong>
            </span>
            <span className="header-divider" aria-hidden="true">/</span>
            {section && <strong className="header-number header-lesson-number">{Number(currentChapter.number)}.{sectionNumber}</strong>}
            <span className="header-lesson-title">{section?.title ?? currentChapter.title}</span>
          </nav>
          {currentChapter.subchapters?.length ? <div className="chapter-track" role="img" aria-label={`${currentChapter.title}: lesson ${sectionNumber ?? 1} of ${currentChapter.subchapters.length}`} title={`Lesson ${sectionNumber ?? 1} of ${currentChapter.subchapters.length}: ${section?.title ?? currentChapter.title}`}>
            <div className="lesson-position-line" aria-hidden="true">
              <span className="lesson-position-fill" style={{ width: `${currentChapter.subchapters.length > 1 ? ((sectionNumber ?? 1) - 1) / (currentChapter.subchapters.length - 1) * 100 : 0}%` }} />
              <span className="lesson-position-marker" style={{ left: `${currentChapter.subchapters.length > 1 ? ((sectionNumber ?? 1) - 1) / (currentChapter.subchapters.length - 1) * 100 : 0}%` }}>{sectionNumber ?? 1}</span>
            </div>
          </div> : <span />}
          <nav className="lesson-pagination" aria-label="Lesson navigation">
            {previousLesson ? <a className="header-nav-button" href={previousLesson.href} aria-label={`Previous: ${previousLesson.title}`}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m12 5-7 7 7 7M5 12h14" /></svg>
              Previous<span className="nav-tooltip" aria-hidden="true">{previousLesson.title}</span>
            </a> : <button className="header-nav-button" disabled>← Previous</button>}
            {nextLesson ? <a className="header-nav-button header-nav-next" href={nextLesson.href} aria-label={`Next: ${nextLesson.title}`}>
              Next<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m12 5 7 7-7 7M5 12h14" /></svg>
              <span className="nav-tooltip" aria-hidden="true">{nextLesson.title}</span>
            </a> : <button className="header-nav-button" disabled>Next →</button>}
          </nav>
        </header>
        <main id="main" className="page-content" tabIndex={-1}>
          {currentChapter.subchapters?.length ? <nav className="lesson-strip" aria-label="Subchapters in this chapter">
            {currentChapter.subchapters.map((item, index) => <a key={item.id} href={chapterHref(currentChapter, item)} aria-current={section?.id === item.id ? 'page' : undefined}>{Number(currentChapter.number)}.{index + 1} {item.title}</a>)}
          </nav> : null}
          <Content key={`${currentChapter.id}/${section?.id ?? ""}`} />
          <div className="page-bottom">
            <button className="back-to-top" onClick={() => {
              window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
              document.getElementById('main')?.focus({ preventScroll: true })
            }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 7-7 7 7M12 5v14" /></svg>Back to top</button>
          </div>
        </main>
      </div>
    </div>
  )
}
