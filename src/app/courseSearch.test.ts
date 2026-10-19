import { describe, expect, it } from 'vitest'
import { chapters, resolveLesson, type Chapter } from './course'
import { createCourseSearchIndex, searchCourse } from './courseSearch'

const index = createCourseSearchIndex(chapters)

describe('course command search', () => {
  it('indexes chapter headings, subtitles and each numbered lesson', () => {
    expect(index).toHaveLength(chapters.length + chapters.reduce((count, chapter) => count + (chapter.subchapters?.length ?? 0), 0))
    expect(searchCourse(index, 'invitation to explore')[0].id).toBe('chapter-01')
    expect(searchCourse(index, 'fit lines residuals').some(item => item.id === 'chapter-13')).toBe(true)
  })

  it('normalizes chapter and subchapter numbers without substring collisions', () => {
    for (const query of ['4', '04']) {
      const matches = searchCourse(index, query)
      expect(matches[0].id).toBe('chapter-04')
      expect(matches.every(item => item.chapterId === 'chapter-04')).toBe(true)
    }
    for (const query of ['4.2', '04.2', '04.02']) {
      expect(searchCourse(index, query).map(item => item.href)).toEqual(['#chapter-04/4.2-missing-values'])
    }
    expect(searchCourse(index, '9.4')[0].href).toBe('#chapter-09/9.4-case-study-knn')
  })

  it('matches words in any order, prefixes, accents and small spelling mistakes', () => {
    expect(searchCourse(index, 'regresion')[0].title.toLowerCase()).toContain('regression')
    expect(searchCourse(index, 'regression logistic').some(item => item.title === 'Logistic Regression Equation')).toBe(true)
    expect(searchCourse(index, 'naive bayes').some(item => item.sectionId === 'intro-to-nai-ve-bayes')).toBe(true)
    expect(searchCourse(index, '9 sentimnt')[0].title).toContain('Sentiment')
    expect(searchCourse(index, 'confus matr')[0].title).toBe('Confusion Matrix')
    expect(searchCourse(index, 'regression 101')[0].title).toBe('Regression 101')
  })

  it('keeps blank results in outline order and handles missing results', () => {
    expect(searchCourse(index, '   ')).toEqual(index)
    expect(searchCourse(index, 'zzzzqqqqnotalesson')).toEqual([])
  })

  it('uses navigable canonical URLs for all published search results', () => {
    for (const result of index.filter(item => item.href)) {
      const resolved = resolveLesson(result.href!)
      expect(resolved.chapter.id).toBe(result.chapterId)
      if (result.sectionId) expect(resolved.section?.id).toBe(result.sectionId)
    }
  })

  it('includes future outlines without giving unpublished content a lesson URL', () => {
    const Content = () => null
    const course: Chapter[] = [
      { id: 'chapter-01', number: '01', title: 'Introduction', subtitle: '', content: Content },
      { id: 'chapter-02', number: '02', title: 'Future methods', subtitle: 'Clustering', subchapters: [{ id: 'cluster', title: 'Cluster analysis' }] },
      { id: 'chapter-03', number: '03', title: 'Partly published', subtitle: '', subchapters: [{ id: 'published', title: 'Published', content: Content }, { id: 'future', title: 'Future' }] },
    ]
    const results = createCourseSearchIndex(course)
    expect(searchCourse(results, 'clustering').every(item => item.href === undefined)).toBe(true)
    expect(searchCourse(results, '2.1')[0]).toMatchObject({ sectionId: 'cluster', href: undefined })
    expect(searchCourse(results, '3')[0].href).toBe('#chapter-03')
    expect(searchCourse(results, '3.2')[0].href).toBeUndefined()
  })
})
