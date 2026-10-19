import { useEffect, useMemo, useRef, useState } from 'react'
import { chapters } from './course'
import { createCourseSearchIndex, searchCourse, type CourseSearchResult } from './courseSearch'
import './CommandPalette.css'

const searchIndex = createCourseSearchIndex(chapters)

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const dialog = useRef<HTMLDialogElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const results = useMemo(() => searchCourse(searchIndex, query), [query])
  const activeResult = results[active]

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k' && !event.altKey && !event.isComposing) {
        event.preventDefault()
        setOpen(value => !value)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    if (!open) return
    const element = dialog.current!
    element.showModal()
    input.current?.focus()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      element.close()
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  useEffect(() => {
    if (open) document.getElementById(`course-search-option-${active}`)?.scrollIntoView({ block: 'nearest' })
  }, [active, query, open])

  function show() {
    setQuery('')
    setActive(0)
    setOpen(true)
  }

  function choose(result: CourseSearchResult) {
    // Close before navigation so the modal restores focus before the lesson receives it.
    dialog.current?.close()
    setOpen(false)
    if (result.href) {
      window.location.hash = result.href
      document.getElementById('main')?.focus({ preventScroll: true })
    } else {
      const outline = document.querySelector<HTMLElement>(`[data-chapter-id="${result.chapterId}"]`)
      const details = outline?.querySelector('details')
      if (details) details.open = true
      const target = result.sectionId
        ? outline?.querySelector<HTMLElement>(`[data-section-id="${result.sectionId}"]`)
        : outline?.querySelector<HTMLElement>('summary, .chapter-future')
      target?.focus({ preventScroll: true })
      target?.scrollIntoView({ block: 'nearest' })
    }
  }

  return <>
    <button type="button" className="course-search-trigger" onClick={show} aria-haspopup="dialog" aria-expanded={open} aria-controls="course-search-dialog">
      <span aria-hidden="true">⌕</span><span>Search course</span><kbd>⌘ / Ctrl K</kbd>
    </button>
    <dialog ref={dialog} id="course-search-dialog" className="course-search-dialog" aria-labelledby="course-search-title"
      onCancel={event => { event.preventDefault(); setOpen(false) }}
      onClick={event => { if (event.target === event.currentTarget) setOpen(false) }}>
      <div className="course-search-panel">
        <div className="course-search-heading"><h2 id="course-search-title">Find a chapter or lesson</h2><button type="button" className="course-search-close" onClick={() => setOpen(false)} aria-label="Close course search">Esc</button></div>
        <label className="course-search-label" htmlFor="course-search-input">Search by number, title, or outline text</label>
        <input ref={input} id="course-search-input" className="course-search-input" type="text" role="combobox"
          autoComplete="off" spellCheck={false} placeholder="Try 9.4, regression, or empty values…" value={query}
          aria-autocomplete="list" aria-expanded={open} aria-controls="course-search-results"
          aria-activedescendant={activeResult ? `course-search-option-${active}` : undefined}
          onChange={event => { setQuery(event.target.value); setActive(0) }}
          onKeyDown={event => {
            if (event.nativeEvent.isComposing) return
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
              event.preventDefault()
              if (results.length) setActive(value => (value + (event.key === 'ArrowDown' ? 1 : -1) + results.length) % results.length)
            } else if (event.key === 'Enter' && activeResult) { event.preventDefault(); choose(activeResult) }
          }} />
        <p className="course-search-count" role="status">{results.length ? `${results.length} ${results.length === 1 ? 'result' : 'results'}${query ? '' : ' · Course outline'}` : 'No matching chapters or lessons. Try a shorter phrase or a chapter number.'}</p>
        <div id="course-search-results" className="course-search-results" role="listbox" aria-label="Course search results">
          {results.map((result, index) => <div key={result.id} id={`course-search-option-${index}`} role="option" aria-selected={active === index}
            className="course-search-option" onClick={() => choose(result)} onMouseMove={() => setActive(index)}>
            <span className="course-search-number">{result.number}</span>
            <span className="course-search-copy"><strong>{result.title}</strong><span>{result.context}</span></span>
            <span className={`course-search-kind${result.href ? '' : ' is-planned'}`}>{result.href ? result.sectionId ? 'Lesson' : 'Chapter' : 'Outline only'}</span>
          </div>)}
        </div>
        <p className="course-search-help"><span><kbd>↑</kbd> <kbd>↓</kbd> to move</span><span><kbd>Enter</kbd> to open</span><span><kbd>Esc</kbd> to close</span></p>
      </div>
    </dialog>
  </>
}
