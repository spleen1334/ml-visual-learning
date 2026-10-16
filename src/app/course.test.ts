import { describe, expect, it } from 'vitest'
import { chapters, chapterHref, publishedLessons, resolveLesson, type Chapter } from './course'
const Overview = () => null
const Detail = () => null
const course: Chapter[] = [
  { id: 'chapter-01', number: '01', title: 'Intro', subtitle: '', content: Overview },
  { id: 'chapter-02', number: '02', title: 'Large chapter', subtitle: '', subchapters: [{ id: 'missing-values', title: 'Missing values', content: Detail }] },
  { id: 'chapter-03', number: '03', title: 'Planned', subtitle: '', subchapters: [{ id: 'planned-section', title: 'Planned section' }] },
]
describe('optional subchapters', () => {
  it('keeps simple chapters as one page', () => expect(resolveLesson('#chapter-01', course).Content).toBe(Overview))
  it('opens a subchapter from a direct link', () => expect(resolveLesson('#chapter-02/missing-values', course).Content).toBe(Detail))
  it('opens the first subchapter when no overview exists', () => expect(resolveLesson('#chapter-02', course).section?.id).toBe('missing-values'))
  it('falls back safely for unpublished or unknown chapters', () => {
    expect(resolveLesson('#chapter-03', course).chapter.id).toBe('chapter-01')
    expect(resolveLesson('#unknown', course).Content).toBe(Overview)
  })
  it('falls back for an unknown subchapter', () => expect(resolveLesson('#chapter-02/unknown', course).Content).toBe(Detail))
  it('creates stable nested links', () => expect(chapterHref(course[1], course[1].subchapters![0])).toBe('#chapter-02/missing-values'))
})

describe('lesson sequence', () => {
  it('includes only published pages in chapter and section order', () => {
    expect(publishedLessons(course).map(item => item.href)).toEqual(['#chapter-01', '#chapter-02/missing-values'])
  })
  it('includes an optional chapter overview before its subchapters', () => {
    const withOverview = [{ ...course[1], content: Overview }]
    expect(publishedLessons(withOverview).map(item => item.href)).toEqual(['#chapter-02', '#chapter-02/missing-values'])
  })
})


describe('chapter five publication', () => {
  it('publishes all 19 source lessons and keeps future outlines out of pagination', () => {
    const lessons = publishedLessons()
    expect(lessons.filter(item => item.chapter.id === 'chapter-05')).toHaveLength(19)
    expect(lessons.some(item => Number(item.chapter.number) > 7)).toBe(false)
    expect(resolveLesson('#chapter-05').section?.id).toBe('introduction')
    expect(resolveLesson('#chapter-05/variance').section?.id).toBe('variance')
    expect(chapters.find(item => item.id === 'chapter-06')?.subchapters?.length).toBe(15)
  })
})


describe('chapter six publication', () => {
  it('publishes all 15 source lessons and resolves direct links', () => {
    const lessons = publishedLessons().filter(item => item.chapter.id === 'chapter-06')
    expect(lessons).toHaveLength(15)
    expect(resolveLesson('#chapter-06').section?.id).toBe('introduction')
    for (const lesson of lessons) expect(resolveLesson(lesson.href).Content).toBe(lesson.section?.content)
    expect(lessons.at(-1)?.section?.id).toBe('looking-ahead-to-part-2')
    expect(publishedLessons().some(item => Number(item.chapter.number) > 7)).toBe(false)
  })
})

describe('chapter seven publication', () => {
  it('publishes the Part 2 orientation while leaving chapters eight through ten as outlines', () => {
    const lessons = publishedLessons()
    expect(lessons.filter(item => item.chapter.id === 'chapter-07').map(item => item.href)).toEqual(['#chapter-07/part-2-classification-modeling'])
    expect(resolveLesson('#chapter-07/part-2-classification-modeling').section?.id).toBe('part-2-classification-modeling')
    expect(lessons.at(-1)?.href).toBe('#chapter-07/part-2-classification-modeling')
    expect(lessons.some(item => ['chapter-08', 'chapter-09', 'chapter-10'].includes(item.chapter.id))).toBe(false)
  })
})
