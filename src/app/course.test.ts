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
    expect(lessons.some(item => Number(item.chapter.number) > 14)).toBe(false)
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
    expect(publishedLessons().some(item => Number(item.chapter.number) > 14)).toBe(false)
  })
})

describe('chapter seven publication', () => {
  it('publishes the Part 2 orientation before later classification chapters', () => {
    const lessons = publishedLessons()
    expect(lessons.filter(item => item.chapter.id === 'chapter-07').map(item => item.href)).toEqual(['#chapter-07/part-2-classification-modeling'])
    expect(resolveLesson('#chapter-07/part-2-classification-modeling').section?.id).toBe('part-2-classification-modeling')
    expect(lessons.find(item => item.chapter.id === 'chapter-11')?.href).toBe('#chapter-11/part-3-regression-forecasting')
    expect(lessons.some(item => item.chapter.id === 'chapter-10')).toBe(true)
  })
})


describe('chapter eight publication', () => {
  it('publishes all eight lessons in source order and resolves direct links', () => {
    const lessons = publishedLessons().filter(item => item.chapter.id === 'chapter-08')
    expect(lessons).toHaveLength(8)
    expect(resolveLesson('#chapter-08').section?.id).toBe('supervised-vs-unsupervised-learning')
    for (const lesson of lessons) expect(resolveLesson(lesson.href).Content).toBe(lesson.section?.content)
    expect(lessons.at(-1)?.section?.id).toBe('overfitting')
    expect(publishedLessons().some(item => Number(item.chapter.number) > 14)).toBe(false)
  })
})


describe('chapter nine publication', () => {
 it('publishes the 25 source lessons with stable direct links before chapter ten', () => {
  const lessons = publishedLessons().filter(item => item.chapter.id === 'chapter-09')
  expect(lessons).toHaveLength(25)
  expect(resolveLesson('#chapter-09').section?.id).toBe('common-classification-models')
  for (const lesson of lessons) expect(resolveLesson(lesson.href).Content).toBe(lesson.section?.content)
  expect(lessons.at(-1)?.section?.id).toBe('case-study-sentiment-analysis')
  expect(chapters.find(c => c.id === 'chapter-10')?.subchapters?.every(s => s.content)).toBe(true)
 })
})

describe('chapter ten publication', () => {
 it('publishes all source lessons in order with stable direct links', () => {
  const lessons = publishedLessons().filter(item => item.chapter.id === 'chapter-10')
  expect(lessons).toHaveLength(10)
  expect(resolveLesson('#chapter-10').section?.id).toBe('intro-to-selection-tuning')
  expect(lessons.at(-1)?.section?.id).toBe('looking-ahead-to-part-3')
  for (const lesson of lessons) expect(resolveLesson(lesson.href).Content).toBe(lesson.section?.content)
 })
})

describe('chapter eleven publication', () => {
 it('publishes the Part 3 orientation after model selection', () => {
  const lessons = publishedLessons()
  expect(lessons.filter(item => item.chapter.id === 'chapter-11').map(item => item.href)).toEqual(['#chapter-11/part-3-regression-forecasting'])
  expect(resolveLesson('#chapter-11/part-3-regression-forecasting').section?.id).toBe('part-3-regression-forecasting')
  expect(lessons.find(item => item.chapter.id === 'chapter-11')?.href).toBe('#chapter-11/part-3-regression-forecasting')
 })
})

describe('chapter twelve publication', () => {
 it('publishes the five non-quiz source lessons in order with stable direct links', () => {
  const lessons = publishedLessons().filter(item => item.chapter.id === 'chapter-12')
  expect(lessons).toHaveLength(5)
  expect(resolveLesson('#chapter-12').section?.id).toBe('supervised-vs-unsupervised-learning')
  expect(lessons.at(-1)?.section?.id).toBe('prediction-vs-root-cause-analysis')
  for (const lesson of lessons) expect(resolveLesson(lesson.href).Content).toBe(lesson.section?.content)
 })
})

describe('chapter thirteen publication', () => {
 it('publishes the eight non-quiz source lessons in order with stable direct links', () => {
  const lessons = publishedLessons().filter(item => item.chapter.id === 'chapter-13')
  expect(lessons).toHaveLength(8)
  expect(resolveLesson('#chapter-13').section?.id).toBe('intro-to-regression-modeling')
  expect(lessons.at(-1)?.section?.id).toBe('case-study-non-linear-regression')
  for (const lesson of lessons) expect(resolveLesson(lesson.href).Content).toBe(lesson.section?.content)
 })
})

describe('chapter fourteen publication', () => {
 it('publishes all eleven non-quiz source lessons in order with stable direct links', () => {
  const lessons = publishedLessons().filter(item => item.chapter.id === 'chapter-14')
  expect(lessons).toHaveLength(11)
  expect(resolveLesson('#chapter-14').section?.id).toBe('intro-to-model-diagnostics')
  expect(lessons.at(-1)?.section?.id).toBe('recap-sample-model-output')
  for (const lesson of lessons) expect(resolveLesson(lesson.href).Content).toBe(lesson.section?.content)
 })
})
