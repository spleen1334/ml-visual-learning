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
  content?: ComponentType
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
  { id: 'chapter-05', number: '05', title: "Univariate Profiling", subtitle: 'Planned', subchapters: [
    { id: "introduction", title: "Introduction" },
    { id: "categorical-variables", title: "Categorical Variables" },
    { id: "discretization", title: "Discretization" },
    { id: "nominal-vs-ordinal", title: "Nominal vs. Ordinal" },
    { id: "categorical-distributions", title: "Categorical Distributions" },
    { id: "numerical-variables", title: "Numerical Variables" },
    { id: "histograms-kernel-densities", title: "Histograms & Kernel Densities" },
    { id: "case-study-histograms", title: "CASE STUDY Histograms" },
    { id: "normal-distribution", title: "Normal Distribution" },
    { id: "case-study-normal-distribution", title: "CASE STUDY Normal Distribution" },
    { id: "univariate-data-profiling", title: "Univariate Data Profiling" },
    { id: "mode", title: "Mode" },
    { id: "mean", title: "Mean" },
    { id: "median", title: "Median" },
    { id: "percentile", title: "Percentile" },
    { id: "variance", title: "Variance" },
    { id: "standard-deviation", title: "Standard Deviation" },
    { id: "skewness", title: "Skewness" },
    { id: "best-practices-univariate-profiling", title: "BEST PRACTICES Univariate Profiling" },
  ] },
  { id: 'chapter-06', number: '06', title: "Multivariate Profiling", subtitle: 'Planned', subchapters: [
    { id: "introduction", title: "Introduction" },
    { id: "categorical-categorical", title: "Categorical-Categorical" },
    { id: "case-study-heat-maps", title: "CASE STUDY Heat Maps" },
    { id: "categorical-numerical", title: "Categorical-Numerical" },
    { id: "multivariate-kernel-densities", title: "Multivariate Kernel Densities" },
    { id: "violin-plots", title: "Violin Plots" },
    { id: "box-plots", title: "Box Plots" },
    { id: "limitations-of-categorical-distributions", title: "Limitations of Categorical Distributions" },
    { id: "numerical-numerical", title: "Numerical-Numerical" },
    { id: "correlation", title: "Correlation" },
    { id: "correlation-vs-causation", title: "Correlation vs. Causation" },
    { id: "visualizing-third-dimension", title: "Visualizing Third Dimension" },
    { id: "case-study-correlation", title: "CASE STUDY Correlation" },
    { id: "best-practices-multivariate-profiling", title: "BEST PRACTICES Multivariate Profiling" },
    { id: "looking-ahead-to-part-2", title: "Looking Ahead to Part 2" },
  ] },
  { id: 'chapter-07', number: '07', title: "PART 2 Classification Modeling", subtitle: 'Planned', subchapters: [
    { id: "part-2-classification-modeling", title: "Part 2 Classification Modeling" },
  ] },
  { id: 'chapter-08', number: '08', title: "Intro to Classification", subtitle: 'Planned', subchapters: [
    { id: "supervised-vs-unsupervised-learning", title: "Supervised vs. Unsupervised Learning" },
    { id: "classification-vs-regression", title: "Classification vs. Regression" },
    { id: "recap-key-concepts", title: "RECAP Key Concepts" },
    { id: "classification-101", title: "Classification 101" },
    { id: "classification-workflow", title: "Classification Workflow" },
    { id: "feature-engineering", title: "Feature Engineering" },
    { id: "data-splitting", title: "Data Splitting" },
    { id: "overfitting", title: "Overfitting" },
  ] },
  { id: 'chapter-09', number: '09', title: "Classification Models", subtitle: 'Planned', subchapters: [
    { id: "common-classification-models", title: "Common Classification Models" },
    { id: "intro-to-k-nearest-neighbors-knn", title: "Intro to K-Nearest Neighbors (KNN)" },
    { id: "knn-examples", title: "KNN Examples" },
    { id: "case-study-knn", title: "CASE STUDY KNN" },
    { id: "intro-to-nai-ve-bayes", title: "Intro to Naïve Bayes" },
    { id: "nai-ve-bayes-frequency-tables", title: "Naïve Bayes — Frequency Tables" },
    { id: "nai-ve-bayes-conditional-probability", title: "Naïve Bayes — Conditional Probability" },
    { id: "case-study-nai-ve-bayes", title: "CASE STUDY Naïve Bayes" },
    { id: "intro-to-decision-trees", title: "Intro to Decision Trees" },
    { id: "decision-trees-entropy-101", title: "Decision Trees — Entropy 101" },
    { id: "entropy-information-gain", title: "Entropy & Information Gain" },
    { id: "decision-tree-examples", title: "Decision Tree Examples" },
    { id: "random-forests", title: "Random Forests" },
    { id: "case-study-decision-trees", title: "CASE STUDY Decision Trees" },
    { id: "intro-to-logistic-regression", title: "Intro to Logistic Regression" },
    { id: "logistic-regression-example", title: "Logistic Regression Example" },
    { id: "false-positives-vs-false-negatives", title: "False Positives vs. False Negatives" },
    { id: "logistic-regression-equation", title: "Logistic Regression Equation" },
    { id: "the-likelihood-function", title: "The Likelihood Function" },
    { id: "multivariate-logistic-regression", title: "Multivariate Logistic Regression" },
    { id: "case-study-logistic-regression", title: "CASE STUDY Logistic Regression" },
    { id: "intro-to-sentiment-analysis", title: "Intro to Sentiment Analysis" },
    { id: "cleaning-text-data", title: "Cleaning Text Data" },
    { id: "bag-of-words-analysis", title: "Bag of Words Analysis" },
    { id: "case-study-sentiment-analysis", title: "CASE STUDY Sentiment Analysis" },
  ] },
  { id: 'chapter-10', number: '10', title: "Model Selection & Tuning", subtitle: 'Planned', subchapters: [
    { id: "intro-to-selection-tuning", title: "Intro to Selection & Tuning" },
    { id: "hyperparameters", title: "Hyperparameters" },
    { id: "imbalanced-classes", title: "Imbalanced Classes" },
    { id: "confusion-matrix", title: "Confusion Matrix" },
    { id: "accuracy-precision-recall", title: "Accuracy, Precision & Recall" },
    { id: "multi-class-confusion-matrix", title: "Multi-class Confusion Matrix" },
    { id: "multi-class-scoring", title: "Multi-class Scoring" },
    { id: "model-selection", title: "Model Selection" },
    { id: "model-drift", title: "Model Drift" },
    { id: "looking-ahead-to-part-3", title: "Looking ahead to Part 3" },
  ] },
]

export function chapterHref(chapter: Chapter, section?: Subchapter): string {
  return `#${chapter.id}${section ? `/${section.id}` : ''}`
}

export function resolveLesson(hash: string, course: readonly Chapter[] = chapters) {
  const [chapterId, sectionId] = hash.replace(/^#/, '').split('/')
  const chapter = course.find(item => item.id === chapterId && (item.content || item.subchapters?.some(section => section.content)))
    ?? course.find(item => item.content || item.subchapters?.some(section => section.content))
  if (!chapter) throw new Error('The course needs at least one published lesson.')
  const section = chapter.subchapters?.find(item => item.id === sectionId && item.content)
    ?? (!chapter.content ? chapter.subchapters?.find(item => item.content) : undefined)
  return { chapter, section, Content: section?.content ?? chapter.content! }
}

export function publishedLessons(course: readonly Chapter[] = chapters) {
  return course.flatMap(chapter => [
    ...(chapter.content ? [{ href: chapterHref(chapter), title: chapter.title, chapter, section: undefined as Subchapter | undefined }] : []),
    ...(chapter.subchapters?.filter(section => section.content).map(section => ({ href: chapterHref(chapter, section), title: section.title, chapter, section })) ?? []),
  ])
}
