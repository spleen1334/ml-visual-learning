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
  it('creates stable nested links', () => expect(chapterHref(course[1], course[1].subchapters![0])).toBe('#chapter-02/2.1-missing-values'))
})

describe('lesson sequence', () => {
  it('includes only published pages in chapter and section order', () => {
    expect(publishedLessons(course).map(item => item.href)).toEqual(['#chapter-01', '#chapter-02/2.1-missing-values'])
  })
  it('includes an optional chapter overview before its subchapters', () => {
    const withOverview = [{ ...course[1], content: Overview }]
    expect(publishedLessons(withOverview).map(item => item.href)).toEqual(['#chapter-02', '#chapter-02/2.1-missing-values'])
  })
})

describe('numbered lesson URLs', () => {
  it('generates numbers matching the sidebar and resolves both canonical and legacy links', () => {
    for (const chapter of chapters) {
      chapter.subchapters?.forEach((section, index) => {
        if (!section.content) return
        const href = chapterHref(chapter, section)
        expect(href).toBe(`#${chapter.id}/${Number(chapter.number)}.${index + 1}-${section.id}`)
        expect(resolveLesson(href).section).toBe(section)
        expect(resolveLesson(`#${chapter.id}/${section.id}`).section).toBe(section)
      })
    }
  })
  it('uses 9.4 for the KNN case and preserves its previous and next lesson order', () => {
    const lessons = publishedLessons()
    const index = lessons.findIndex(lesson => lesson.href === '#chapter-09/9.4-case-study-knn')
    expect(index).toBeGreaterThan(0)
    expect(lessons[index - 1].href).toBe('#chapter-09/9.3-knn-examples')
    expect(lessons[index + 1].href).toBe('#chapter-09/9.5-intro-to-nai-ve-bayes')
  })
  it('does not resolve a mismatched lesson number as the named section', () => {
    expect(resolveLesson('#chapter-09/9.3-case-study-knn').section?.id).toBe('common-classification-models')
  })
})


describe('chapter five publication', () => {
  it('publishes all 19 source lessons and keeps future outlines out of pagination', () => {
    const lessons = publishedLessons()
    expect(lessons.filter(item => item.chapter.id === 'chapter-05')).toHaveLength(19)
    expect(lessons.some(item => Number(item.chapter.number) > 21 && !['chapter-97', 'chapter-99'].includes(item.chapter.id))).toBe(false)
    expect(resolveLesson('#chapter-05').section?.id).toBe('introduction')
    expect(resolveLesson('#chapter-05/variance').section?.id).toBe('variance')
    expect(chapters.find(item => item.id === 'chapter-06')?.subchapters?.length).toBe(17)
  })
})


describe('chapter six publication', () => {
  it('publishes all 15 source lessons plus quiz and resolves direct links', () => {
    const lessons = publishedLessons().filter(item => item.chapter.id === 'chapter-06')
    expect(lessons).toHaveLength(17)
    expect(resolveLesson('#chapter-06').section?.id).toBe('introduction')
    for (const lesson of lessons) expect(resolveLesson(lesson.href).Content).toBe(lesson.section?.content)
    expect(lessons.at(-1)?.section?.id).toBe('quiz-multivariate-profiling')
    expect(publishedLessons().some(item => Number(item.chapter.number) > 21 && !['chapter-97', 'chapter-99'].includes(item.chapter.id))).toBe(false)
  })
})

describe('chapter seven publication', () => {
  it('publishes the Part 2 orientation before later classification chapters', () => {
    const lessons = publishedLessons()
    expect(lessons.filter(item => item.chapter.id === 'chapter-07').map(item => item.href)).toEqual(['#chapter-07/7.1-part-2-classification-modeling'])
    expect(resolveLesson('#chapter-07/part-2-classification-modeling').section?.id).toBe('part-2-classification-modeling')
    expect(lessons.find(item => item.chapter.id === 'chapter-11')?.href).toBe('#chapter-11/11.1-part-3-regression-forecasting')
    expect(lessons.some(item => item.chapter.id === 'chapter-10')).toBe(true)
  })
})


describe('chapter eight publication', () => {
  it('publishes all eight lessons plus quiz in source order and resolves direct links', () => {
    const lessons = publishedLessons().filter(item => item.chapter.id === 'chapter-08')
    expect(lessons).toHaveLength(9)
    expect(resolveLesson('#chapter-08').section?.id).toBe('supervised-vs-unsupervised-learning')
    for (const lesson of lessons) expect(resolveLesson(lesson.href).Content).toBe(lesson.section?.content)
    expect(lessons.at(-1)?.section?.id).toBe('quiz-intro-classification')
    expect(publishedLessons().some(item => Number(item.chapter.number) > 21 && !['chapter-97', 'chapter-99'].includes(item.chapter.id))).toBe(false)
  })
})

describe('chapter sixteen publication', () => {
  it('publishes the Part 4 orientation before the unsupervised introduction', () => {
    const lessons = publishedLessons()
    expect(lessons.find(item => item.chapter.id === 'chapter-16')?.href).toBe('#chapter-16')
    expect(resolveLesson('#chapter-16').Content).toBe(chapters.find(item => item.id === 'chapter-16')?.content)
    expect(lessons.some(item => Number(item.chapter.number) > 21 && !['chapter-97', 'chapter-99'].includes(item.chapter.id))).toBe(false)
  })
})

describe('chapter seventeen publication', () => {
  it('publishes the source lessons and optional quiz in order', () => {
    const lessons = publishedLessons().filter(item => item.chapter.id === 'chapter-17')
    expect(lessons.map(item => item.section?.id)).toEqual([
      'supervised-vs-unsupervised-learning', 'common-unsupervised-techniques', 'unsupervised-ml-workflow',
      'recap-feature-engineering', 'key-takeaways-unsupervised-ml', 'quiz-intro-unsupervised-ml',
    ])
    for (const lesson of lessons) expect(resolveLesson(lesson.href).Content).toBe(lesson.section?.content)
    expect(lessons.at(-1)?.href).toBe('#chapter-17/17.6-quiz-intro-unsupervised-ml')
    expect(publishedLessons().some(item => Number(item.chapter.number) > 21 && !['chapter-97', 'chapter-99'].includes(item.chapter.id))).toBe(false)
  })
})

describe('chapter eighteen publication', () => {
  it('publishes the clustering lessons and optional quiz in source order', () => {
    const lessons = publishedLessons().filter(item => item.chapter.id === 'chapter-18')
    expect(lessons.map(item => item.section?.id)).toEqual([
      'introduction', 'clustering-basics', 'intro-to-k-means', 'wss-elbow-plots', 'k-means-faqs', 'case-study-k-means',
      'intro-to-hierarchical-clustering', 'anatomy-dendrogram', 'hierarchical-clustering-faqs', 'key-takeaways-clustering-segmentation', 'quiz-clustering-segmentation',
    ])
    for (const lesson of lessons) expect(resolveLesson(lesson.href).Content).toBe(lesson.section?.content)
    expect(lessons.at(-1)?.href).toBe('#chapter-18/18.11-quiz-clustering-segmentation')
    expect(publishedLessons().some(item => Number(item.chapter.number) > 21 && !['chapter-97', 'chapter-99'].includes(item.chapter.id))).toBe(false)
  })
})

describe('chapters nineteen through twenty-one publication', () => {
  it('publishes each chapter in source order with numbered direct links', () => {
    const expected = {
      'chapter-19': ['introduction', 'association-mining-basics', 'apriori-algorithm', 'basket-analysis-examples', 'minimum-support-thresholds', 'infrequent-itemsets', 'multiple-item-sets', 'case-study-apriori', 'markov-chains', 'case-study-markov-chains', 'key-takeaways-association-mining', 'quiz-association-mining'],
      'chapter-20': ['introduction', 'outlier-detection-basics', 'cross-sectional-outliers', 'cross-sectional-outlier-example', 'case-study-cross-sectional-outlier', 'time-series-outliers', 'time-series-outlier-example', 'key-takeaways-outlier-detection', 'quiz-outlier-detection'],
      'chapter-21': ['introduction', 'dimensionality-reduction-basics', 'principal-component-analysis', 'pca-example', 'interpreting-components', 'scree-plots', 'advanced-techniques', 'key-takeaways-dimensionality-reduction', 'quiz-dimensionality-reduction'],
    }
    for (const [chapterId, sectionIds] of Object.entries(expected)) {
      const lessons = publishedLessons().filter(item => item.chapter.id === chapterId)
      expect(lessons.map(item => item.section?.id)).toEqual(sectionIds)
      for (const lesson of lessons) expect(resolveLesson(lesson.href).Content).toBe(lesson.section?.content)
      expect(lessons.at(-1)?.href).toContain('quiz-')
    }
    expect(publishedLessons().some(item => Number(item.chapter.number) > 21 && !['chapter-97', 'chapter-99'].includes(item.chapter.id))).toBe(false)
  })
})


describe('chapter nine publication', () => {
 it('publishes the 25 source lessons plus quiz with stable direct links before chapter ten', () => {
  const lessons = publishedLessons().filter(item => item.chapter.id === 'chapter-09')
  expect(lessons).toHaveLength(26)
  expect(resolveLesson('#chapter-09').section?.id).toBe('common-classification-models')
  for (const lesson of lessons) expect(resolveLesson(lesson.href).Content).toBe(lesson.section?.content)
  expect(lessons.at(-1)?.section?.id).toBe('quiz-classification-models')
  expect(chapters.find(c => c.id === 'chapter-10')?.subchapters?.every(s => s.content)).toBe(true)
 })
})

describe('chapter ten publication', () => {
 it('publishes all source lessons in order with stable direct links', () => {
  const lessons = publishedLessons().filter(item => item.chapter.id === 'chapter-10')
  expect(lessons).toHaveLength(11)
  expect(resolveLesson('#chapter-10').section?.id).toBe('intro-to-selection-tuning')
  expect(lessons.at(-1)?.section?.id).toBe('quiz-model-selection-tuning')
  for (const lesson of lessons) expect(resolveLesson(lesson.href).Content).toBe(lesson.section?.content)
 })
})

describe('chapter eleven publication', () => {
 it('publishes the Part 3 orientation after model selection', () => {
  const lessons = publishedLessons()
  expect(lessons.filter(item => item.chapter.id === 'chapter-11').map(item => item.href)).toEqual(['#chapter-11/11.1-part-3-regression-forecasting'])
  expect(resolveLesson('#chapter-11/part-3-regression-forecasting').section?.id).toBe('part-3-regression-forecasting')
  expect(lessons.find(item => item.chapter.id === 'chapter-11')?.href).toBe('#chapter-11/11.1-part-3-regression-forecasting')
 })
})

describe('chapter twelve publication', () => {
 it('publishes the five source lessons plus quiz in order with stable direct links', () => {
  const lessons = publishedLessons().filter(item => item.chapter.id === 'chapter-12')
  expect(lessons).toHaveLength(6)
  expect(resolveLesson('#chapter-12').section?.id).toBe('supervised-vs-unsupervised-learning')
  expect(lessons.at(-1)?.section?.id).toBe('quiz-intro-regression')
  for (const lesson of lessons) expect(resolveLesson(lesson.href).Content).toBe(lesson.section?.content)
 })
})

describe('chapter thirteen publication', () => {
 it('publishes the eight source lessons plus quiz in order with stable direct links', () => {
  const lessons = publishedLessons().filter(item => item.chapter.id === 'chapter-13')
  expect(lessons).toHaveLength(9)
  expect(resolveLesson('#chapter-13').section?.id).toBe('intro-to-regression-modeling')
  expect(lessons.at(-1)?.section?.id).toBe('quiz-regression-modeling')
  for (const lesson of lessons) expect(resolveLesson(lesson.href).Content).toBe(lesson.section?.content)
 })
})

describe('chapter fourteen publication', () => {
 it('publishes all eleven source lessons plus quiz in order with stable direct links', () => {
  const lessons = publishedLessons().filter(item => item.chapter.id === 'chapter-14')
  expect(lessons).toHaveLength(12)
  expect(resolveLesson('#chapter-14').section?.id).toBe('intro-to-model-diagnostics')
  expect(lessons.at(-1)?.section?.id).toBe('quiz-model-diagnostics')
  for (const lesson of lessons) expect(resolveLesson(lesson.href).Content).toBe(lesson.section?.content)
 })
})


describe('chapter fifteen publication', () => {
  it('publishes the source sequence followed by optional quiz and resolves all direct links', () => {
    const lessons = publishedLessons().filter(item => item.chapter.id === 'chapter-15')
    expect(lessons).toHaveLength(16)
    expect(resolveLesson('#chapter-15').section?.id).toBe('intro-to-forecasting')
    expect(lessons.filter(item => item.title.startsWith('CASE STUDY'))).toHaveLength(6)
    expect(lessons.at(-1)?.section?.id).toBe('quiz-time-series-forecasting')
    for (const lesson of lessons) expect(resolveLesson(lesson.href).Content).toBe(lesson.section?.content)
    const all = publishedLessons()
    const first = all.findIndex(item => item.href === lessons[0].href)
    expect(all[first - 1].section?.id).toBe('quiz-model-diagnostics')
  })
})


describe('chapter four quiz', () => {
  it('places the optional quiz after the case study and before chapter five', () => {
    const lessons = publishedLessons()
    const index = lessons.findIndex(item => item.href === '#chapter-04/4.7-quiz')
    expect(index).toBeGreaterThan(0)
    expect(lessons[index - 1].section?.id).toBe('inventory-case')
    expect(lessons[index + 1].chapter.id).toBe('chapter-05')
    expect(resolveLesson(lessons[index].href).section?.id).toBe('quiz')
  })
})

describe('chapter ninety-seven gradual publication', () => {
  it('publishes the first nine lessons, with two outlines and stable links before chapter 99', () => {
    const chapter = chapters.find(item => item.id === 'chapter-97')!
    expect(chapter.subchapters).toHaveLength(11)
    expect(chapter.subchapters?.slice(9).every(item => !item.content)).toBe(true)
    const all = publishedLessons()
    const lessons = all.filter(item => item.chapter.id === chapter.id)
    expect(lessons.map(item => item.href)).toEqual(['#chapter-97/97.1-what-can-we-do-with-language', '#chapter-97/97.2-sentence-and-token-boundaries', '#chapter-97/97.3-cleaning-can-remove-meaning', '#chapter-97/97.4-from-messages-to-a-count-table', '#chapter-97/97.5-which-words-distinguish-a-document', '#chapter-97/97.6-a-small-text-classifier', '#chapter-97/97.7-search-by-words', '#chapter-97/97.8-search-beyond-exact-words', '#chapter-97/97.9-turn-text-into-a-structured-record'])
    expect(resolveLesson(lessons[0].href).section).toBe(chapter.subchapters?.[0])
    expect(resolveLesson('#chapter-97/what-can-we-do-with-language').section).toBe(chapter.subchapters?.[0])
    expect(resolveLesson(lessons[1].href).section).toBe(chapter.subchapters?.[1])
    expect(resolveLesson('#chapter-97/sentence-and-token-boundaries').section).toBe(chapter.subchapters?.[1])
    expect(resolveLesson(lessons[2].href).section).toBe(chapter.subchapters?.[2])
    expect(resolveLesson('#chapter-97/cleaning-can-remove-meaning').section).toBe(chapter.subchapters?.[2])
    expect(resolveLesson(lessons[3].href).section).toBe(chapter.subchapters?.[3])
    expect(resolveLesson('#chapter-97/from-messages-to-a-count-table').section).toBe(chapter.subchapters?.[3])
    expect(resolveLesson(lessons[4].href).section).toBe(chapter.subchapters?.[4])
    expect(resolveLesson('#chapter-97/which-words-distinguish-a-document').section).toBe(chapter.subchapters?.[4])
    expect(resolveLesson(lessons[5].href).section).toBe(chapter.subchapters?.[5])
    expect(resolveLesson('#chapter-97/a-small-text-classifier').section).toBe(chapter.subchapters?.[5])
    expect(resolveLesson(lessons[6].href).section).toBe(chapter.subchapters?.[6])
    expect(resolveLesson('#chapter-97/search-by-words').section).toBe(chapter.subchapters?.[6])
    expect(resolveLesson(lessons[7].href).section).toBe(chapter.subchapters?.[7])
    expect(resolveLesson('#chapter-97/search-beyond-exact-words').section).toBe(chapter.subchapters?.[7])
    expect(resolveLesson(lessons[8].href).section).toBe(chapter.subchapters?.[8])
    expect(resolveLesson('#chapter-97/turn-text-into-a-structured-record').section).toBe(chapter.subchapters?.[8])
    const index = all.indexOf(lessons[0])
    expect(all[index - 1].chapter.id).toBe('chapter-21')
    expect(all[index + 9].href).toBe('#chapter-99/99.1-what-does-an-llm-predict')
    expect(chapters.some(item => item.id === 'chapter-98')).toBe(false)
  })
})

describe('chapter ninety-nine gradual publication', () => {
  it('publishes all fourteen chapter 99 lessons', () => {
    const chapter = chapters.find(item => item.id === 'chapter-99')!
    expect(chapter.subchapters).toHaveLength(14)
    const lessons = publishedLessons().filter(item => item.chapter.id === chapter.id)
    expect(lessons.map(item => item.href)).toEqual(['#chapter-99/99.1-what-does-an-llm-predict', '#chapter-99/99.2-tokenization', '#chapter-99/99.3-embeddings-and-position', '#chapter-99/99.4-neural-network', '#chapter-99/99.5-attention-qkv', '#chapter-99/99.6-masking-and-heads', '#chapter-99/99.7-transformer-block', '#chapter-99/99.8-logits-and-softmax', '#chapter-99/99.9-sampling-and-temperature', '#chapter-99/99.10-training-loss-and-gradients', '#chapter-99/99.11-pretraining-and-post-training', '#chapter-99/99.12-context-memory-retrieval-tools', '#chapter-99/99.13-limitations-and-evaluation', '#chapter-99/99.14-full-pipeline'])
    expect(chapter.subchapters?.every(item => !!item.content)).toBe(true)
    expect(resolveLesson(lessons[0].href).section?.id).toBe('what-does-an-llm-predict')
    const all = publishedLessons()
    expect(resolveLesson(lessons[1].href).section?.id).toBe('tokenization')
    expect(resolveLesson(lessons[2].href).section?.id).toBe('embeddings-and-position')
    expect(resolveLesson('#chapter-99/embeddings-and-position').section?.id).toBe('embeddings-and-position')
    expect(resolveLesson(lessons[3].href).section?.id).toBe('neural-network')
    expect(resolveLesson('#chapter-99/neural-network').section?.id).toBe('neural-network')
    expect(resolveLesson(lessons[4].href).section?.id).toBe('attention-qkv')
    expect(resolveLesson('#chapter-99/attention-qkv').section?.id).toBe('attention-qkv')
    expect(resolveLesson(lessons[5].href).section?.id).toBe('masking-and-heads')
    expect(resolveLesson('#chapter-99/masking-and-heads').section?.id).toBe('masking-and-heads')
    expect(resolveLesson(lessons[6].href).section?.id).toBe('transformer-block')
    expect(resolveLesson('#chapter-99/transformer-block').section?.id).toBe('transformer-block')
    expect(resolveLesson(lessons[7].href).section?.id).toBe('logits-and-softmax')
    expect(resolveLesson('#chapter-99/logits-and-softmax').section?.id).toBe('logits-and-softmax')
    expect(resolveLesson(lessons[8].href).section?.id).toBe('sampling-and-temperature')
    expect(resolveLesson('#chapter-99/sampling-and-temperature').section?.id).toBe('sampling-and-temperature')
    expect(resolveLesson(lessons[9].href).section?.id).toBe('training-loss-and-gradients')
    expect(resolveLesson('#chapter-99/training-loss-and-gradients').section?.id).toBe('training-loss-and-gradients')
    expect(resolveLesson(lessons[10].href).section?.id).toBe('pretraining-and-post-training')
    expect(resolveLesson('#chapter-99/pretraining-and-post-training').section?.id).toBe('pretraining-and-post-training')
    expect(resolveLesson(lessons[11].href).section?.id).toBe('context-memory-retrieval-tools')
    expect(resolveLesson('#chapter-99/context-memory-retrieval-tools').section?.id).toBe('context-memory-retrieval-tools')
    expect(resolveLesson(lessons[12].href).section?.id).toBe('limitations-and-evaluation')
    expect(resolveLesson('#chapter-99/limitations-and-evaluation').section?.id).toBe('limitations-and-evaluation')
    expect(resolveLesson(lessons[13].href).section?.id).toBe('full-pipeline')
    expect(resolveLesson('#chapter-99/full-pipeline').section?.id).toBe('full-pipeline')
    expect(all.at(-15)?.chapter.id).toBe('chapter-97')
    expect(all.at(-1)?.href).toBe(lessons[13].href)
  })
})
