import { chapterHref, type Chapter } from './course'

export type CourseSearchResult = {
  id: string
  number: string
  title: string
  context: string
  href?: string
  chapterId: string
  sectionId?: string
  keywords: string
}

export function createCourseSearchIndex(course: readonly Chapter[]): CourseSearchResult[] {
  return course.flatMap(chapter => {
    const available = Boolean(chapter.content || chapter.subchapters?.some(section => section.content))
    return [
      { id: chapter.id, number: String(Number(chapter.number)), title: chapter.title, context: chapter.subtitle,
        href: available ? chapterHref(chapter) : undefined, chapterId: chapter.id,
        keywords: `${chapter.id} ${chapter.title} ${chapter.subtitle}` },
      ...(chapter.subchapters?.map((section, index) => ({
        id: `${chapter.id}/${section.id}`, number: `${Number(chapter.number)}.${index + 1}`, title: section.title,
        context: chapter.title, href: section.content ? chapterHref(chapter, section) : undefined,
        chapterId: chapter.id, sectionId: section.id,
        keywords: `${section.id} ${section.title} ${chapter.title} ${chapter.subtitle}`,
      })) ?? []),
    ]
  })
}

function normalize(value: string) {
  return value.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^a-z0-9.]+/g, ' ').trim()
}

// A small edit-distance matcher keeps spelling mistakes useful without adding a dependency.
function editDistance(left: string, right: string) {
  let previous = Array.from({ length: right.length + 1 }, (_, index) => index)
  for (let row = 1; row <= left.length; row++) {
    const current = [row]
    for (let column = 1; column <= right.length; column++) {
      current[column] = Math.min(current[column - 1] + 1, previous[column] + 1,
        previous[column - 1] + Number(left[row - 1] !== right[column - 1]))
    }
    previous = current
  }
  return previous[right.length]
}

function tokenScore(token: string, words: string[]) {
  let best = 0
  for (const word of words) {
    if (word === token) best = Math.max(best, 12)
    else if (word.startsWith(token)) best = Math.max(best, 9)
    else if (word.includes(token)) best = Math.max(best, 7)
    else if (token.length >= 4 && Math.abs(word.length - token.length) <= (token.length >= 7 ? 2 : 1)) {
      const distance = editDistance(token, word)
      if (distance <= (token.length >= 7 ? 2 : 1)) best = Math.max(best, 5 - distance)
    }
  }
  return best
}

export function searchCourse(index: readonly CourseSearchResult[], query: string): CourseSearchResult[] {
  const normalized = normalize(query)
  if (!normalized) return [...index]
  const tokens = normalized.split(/\s+/)
  return index.map((result, order) => {
    let score = 0
    const titleWords = normalize(result.title).split(/\s+/)
    const words = normalize(result.keywords).split(/\s+/)
    for (const token of tokens) {
      if (/^\d+(?:\.\d+)?$/.test(token)) {
        const number = token.split('.').map(Number).join('.')
        if (number === result.number) score += 100
        else if (!number.includes('.') && result.number.startsWith(`${number}.`)) score += 35
        else if (tokens.length > 1 && titleWords.includes(token)) score += 12
        else return { result, score: -1, order }
      } else {
        const match = tokenScore(token, words)
        if (!match) return { result, score: -1, order }
        score += match + tokenScore(token, titleWords)
      }
    }
    if (normalize(result.title) === normalized) score += 30
    return { result, score, order }
  }).filter(item => item.score >= 0).sort((a, b) => b.score - a.score || a.order - b.order).map(item => item.result)
}
