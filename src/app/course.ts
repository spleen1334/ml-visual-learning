import type { ComponentType } from 'react'
import ChapterOne from '../chapters/ChapterOne'

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
  { id: 'chapter-02', number: '02', title: 'The ML Landscape', subtitle: 'Questions, patterns & predictions' },
  { id: 'chapter-03', number: '03', title: 'QA & Data Profiling', subtitle: 'Meet your first dataset' },
  { id: 'chapter-04', number: '04', title: 'Preliminary Data QA', subtitle: 'Find and understand the issues' },
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
