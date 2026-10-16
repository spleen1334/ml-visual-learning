import type { ComponentType } from 'react'
import ChapterOne from '../chapters/ChapterOne'
import ChapterThree from '../chapters/ChapterThree'
import { QAVariableTypes, QATableStructure } from '../chapters/QAFoundations'
import { QACaseStudy } from '../chapters/QAWorkbench'
import { QAMissingValues, QARangesCounts } from '../chapters/QASmallExamples'
import QACensoring from '../chapters/QACensoring'
import { IntroToML, WhenToUseML, MLProcess, MLLandscape } from '../chapters/ChapterTwo'

export type Subchapter = {
  id: string
  title: string
  content: ComponentType
}

export type Chapter = {
  id: string
  number: string
  title: string
  subtitle: string
  content?: ComponentType
  subchapters?: readonly Subchapter[]
}

export const chapters: readonly Chapter[] = [
  { id: 'chapter-01', number: '01', title: 'Getting Started', subtitle: 'An invitation to explore', content: ChapterOne },
  { id: 'chapter-02', number: '02', title: 'The ML Landscape', subtitle: 'Questions, patterns & predictions', subchapters: [
    { id: 'what-is-ml', title: 'What is machine learning?', content: IntroToML },
    { id: 'when-to-use-ml', title: 'When does ML help?', content: WhenToUseML },
    { id: 'the-workflow', title: 'The data workflow', content: MLProcess },
    { id: 'the-landscape', title: 'A map of the methods', content: MLLandscape },
  ] },
  { id: 'chapter-03', number: '03', title: 'QA & Data Profiling', subtitle: 'Meet your first dataset', content: ChapterThree },
  { id: 'chapter-04', number: '04', title: 'Preliminary Data QA', subtitle: 'Inspect, explain & repair', subchapters: [
    { id: 'variable-types', title: 'Variable types', content: QAVariableTypes },
    { id: 'missing-values', title: 'Empty values', content: QAMissingValues },
    { id: 'ranges-counts', title: 'Range & count calculations', content: QARangesCounts },
    { id: 'observation-limits', title: 'Left- and right-censored data', content: QACensoring },
    { id: 'table-structure', title: 'Table structures', content: QATableStructure },
    { id: 'inventory-case', title: 'Maven Market case study', content: QACaseStudy },
  ] },
  { id: 'chapter-05', number: '05', title: 'Univariate Profiling', subtitle: 'Discover the shape of data' },
]

export function chapterHref(chapter: Chapter, section?: Subchapter): string {
  return `#${chapter.id}${section ? `/${section.id}` : ''}`
}

export function resolveLesson(hash: string, course: readonly Chapter[] = chapters) {
  const [chapterId, sectionId] = hash.replace(/^#/, '').split('/')
  const chapter = course.find(item => item.id === chapterId && (item.content || item.subchapters?.length))
    ?? course.find(item => item.content || item.subchapters?.length)
  if (!chapter) throw new Error('The course needs at least one published lesson.')
  const section = chapter.subchapters?.find(item => item.id === sectionId)
    ?? (!chapter.content ? chapter.subchapters?.[0] : undefined)
  return { chapter, section, Content: section?.content ?? chapter.content! }
}

export function publishedLessons(course: readonly Chapter[] = chapters) {
  return course.flatMap(chapter => [
    ...(chapter.content ? [{ href: chapterHref(chapter), title: chapter.title, chapter, section: undefined as Subchapter | undefined }] : []),
    ...(chapter.subchapters?.map(section => ({ href: chapterHref(chapter, section), title: section.title, chapter, section })) ?? []),
  ])
}
