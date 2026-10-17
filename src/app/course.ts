import { CLCommonClassificationModels, CLIntroKNN, CLKNNExamples, CLCaseKNN, CLIntroNaiveBayes, CLNaiveBayesFrequencyTables, CLNaiveBayesConditionalProbability, CLCaseNaiveBayes } from '../chapters/ClassificationNeighborsBayes'
import { LogisticIntro, LogisticExample, LogisticErrors, LogisticEquation, LogisticLikelihood, LogisticMultivariate, LogisticCase } from '../chapters/ClassificationLogistic'
import { CLIntroDecisionTrees, CLEntropy101, CLEntropyInformationGain, CLDecisionTreeExamples, CLRandomForests, CLDecisionTreeCaseStudy } from '../chapters/ClassificationTrees'
import { CLSentimentIntro, CLTextCleaning, CLBagOfWords, CLSentimentCaseStudy } from '../chapters/ClassificationSentiment'
import { CLSupervisedUnsupervised, CLClassificationRegression, CLKeyConceptsRecap, CLClassification101 } from '../chapters/ClassificationBasics'
import { CLWorkflow, CLFeatureEngineering, CLDataSplitting, CLOverfitting } from '../chapters/ClassificationWorkflow'
import { MVIntroduction, MVCategoricalCategorical, MVHeatMapCase } from '../chapters/MultivariateCategories'
import { MVCategoricalNumerical, MVKernelDensities, MVViolinPlots, MVBoxPlots, MVLimitations } from '../chapters/MultivariateDistributions'
import { MVNumericalNumerical, MVCorrelation, MVCorrelationCausation, MVThirdDimension, MVCorrelationCase, MVBestPractices, MVLookingAhead } from '../chapters/MultivariateNumerical'
import { UVBestPractices } from '../chapters/UnivariateCheatSheet'
import type { ComponentType } from 'react'
import ChapterOne from '../chapters/ChapterOne'
import ChapterThree from '../chapters/ChapterThree'
import ChapterSeven from '../chapters/ChapterSeven'
import ChapterEleven from '../chapters/ChapterEleven'
import { RIFeatureEngineering, RIPredictionRootCause, RIRecapKeyConcepts, RIRegression101, RISupervisedUnsupervised } from '../chapters/RegressionIntro'
import { RMIntro } from '../chapters/RegressionModeling'
import { RMLeastSquares, RMLinearRelationships } from '../chapters/RegressionFoundations'
import { RMUnivariate, RMUnivariateCase } from '../chapters/RegressionConeZone'
import { RMMultiple } from '../chapters/RegressionMultiple'
import { RMNonLinear, RMNonLinearCase } from '../chapters/RegressionNonlinear'
import { QAVariableTypes, QATableStructure } from '../chapters/QAFoundations'
import { QACaseStudy } from '../chapters/QAWorkbench'
import { QAMissingValues, QARangesCounts } from '../chapters/QASmallExamples'
import QACensoring from '../chapters/QACensoring'
import { IntroToML, WhenToUseML, MLProcess, MLLandscape } from '../chapters/ChapterTwo'

import { UVIntroduction, UVCategoricalVariables, UVDiscretization, UVNominalOrdinal, UVCategoricalDistributions, UVNumericalVariables } from '../chapters/UnivariateCategories'
import { UVHistograms, UVHistogramCase, UVNormalDistribution, UVNormalCase } from '../chapters/UnivariateDistributions'
import { UVProfiling, UVMode, UVMean, UVMedian, UVPercentile, UVVariance, UVStandardDeviation, UVSkewness } from '../chapters/UnivariateMetrics'
import { MSIntroSelectionTuning, MSHyperparameters, MSImbalancedClasses } from '../chapters/ModelSelectionBasics'
import { MSConfusionMatrix, MSAccuracyPrecisionRecall, MSMulticlassConfusionMatrix, MSMulticlassScoring, MSModelSelection, MSModelDrift, MSLookingAhead } from '../chapters/ModelEvaluation'

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
  { id: 'chapter-05', number: '05', title: "Univariate Profiling", subtitle: 'One variable, many perspectives', subchapters: [
    { id: "introduction", title: "Introduction", content: UVIntroduction },
    { id: "categorical-variables", title: "Categorical Variables", content: UVCategoricalVariables },
    { id: "discretization", title: "Discretization", content: UVDiscretization },
    { id: "nominal-vs-ordinal", title: "Nominal vs. Ordinal", content: UVNominalOrdinal },
    { id: "categorical-distributions", title: "Categorical Distributions", content: UVCategoricalDistributions },
    { id: "numerical-variables", title: "Numerical Variables", content: UVNumericalVariables },
    { id: "histograms-kernel-densities", title: "Histograms & Kernel Densities", content: UVHistograms },
    { id: "case-study-histograms", title: "CASE STUDY Histograms", content: UVHistogramCase },
    { id: "normal-distribution", title: "Normal Distribution", content: UVNormalDistribution },
    { id: "case-study-normal-distribution", title: "CASE STUDY Normal Distribution", content: UVNormalCase },
    { id: "univariate-data-profiling", title: "Univariate Data Profiling", content: UVProfiling },
    { id: "mode", title: "Mode", content: UVMode },
    { id: "mean", title: "Mean", content: UVMean },
    { id: "median", title: "Median", content: UVMedian },
    { id: "percentile", title: "Percentile", content: UVPercentile },
    { id: "variance", title: "Variance", content: UVVariance },
    { id: "standard-deviation", title: "Standard Deviation", content: UVStandardDeviation },
    { id: "skewness", title: "Skewness", content: UVSkewness },
    { id: "best-practices-univariate-profiling", title: "BEST PRACTICES Univariate Profiling", content: UVBestPractices },
  ] },

  { id: 'chapter-06', number: '06', title: "Multivariate Profiling", subtitle: 'Explore relationships between variables', subchapters: [
    { id: "introduction", title: "Introduction", content: MVIntroduction },
    { id: "categorical-categorical", title: "Categorical-Categorical", content: MVCategoricalCategorical },
    { id: "case-study-heat-maps", title: "CASE STUDY Heat Maps", content: MVHeatMapCase },
    { id: "categorical-numerical", title: "Categorical-Numerical", content: MVCategoricalNumerical },
    { id: "multivariate-kernel-densities", title: "Multivariate Kernel Densities", content: MVKernelDensities },
    { id: "violin-plots", title: "Violin Plots", content: MVViolinPlots },
    { id: "box-plots", title: "Box Plots", content: MVBoxPlots },
    { id: "limitations-of-categorical-distributions", title: "Limitations of Categorical Distributions", content: MVLimitations },
    { id: "numerical-numerical", title: "Numerical-Numerical", content: MVNumericalNumerical },
    { id: "correlation", title: "Correlation", content: MVCorrelation },
    { id: "correlation-vs-causation", title: "Correlation vs. Causation", content: MVCorrelationCausation },
    { id: "visualizing-third-dimension", title: "Visualizing Third Dimension", content: MVThirdDimension },
    { id: "case-study-correlation", title: "CASE STUDY Correlation", content: MVCorrelationCase },
    { id: "best-practices-multivariate-profiling", title: "BEST PRACTICES Multivariate Profiling", content: MVBestPractices },
    { id: "looking-ahead-to-part-2", title: "Looking Ahead to Part 2", content: MVLookingAhead },
  ] },
  { id: 'chapter-07', number: '07', title: "PART 2 Classification Modeling", subtitle: 'From data foundations to category predictions', subchapters: [
    { id: "part-2-classification-modeling", title: "Part 2 Classification Modeling", content: ChapterSeven },
  ] },
  { id: 'chapter-08', number: '08', title: "Intro to Classification", subtitle: 'Labels, features & learning from unseen data', subchapters: [
    { id: "supervised-vs-unsupervised-learning", title: "Supervised vs. Unsupervised Learning", content: CLSupervisedUnsupervised },
    { id: "classification-vs-regression", title: "Classification vs. Regression", content: CLClassificationRegression },
    { id: "recap-key-concepts", title: "RECAP Key Concepts", content: CLKeyConceptsRecap },
    { id: "classification-101", title: "Classification 101", content: CLClassification101 },
    { id: "classification-workflow", title: "Classification Workflow", content: CLWorkflow },
    { id: "feature-engineering", title: "Feature Engineering", content: CLFeatureEngineering },
    { id: "data-splitting", title: "Data Splitting", content: CLDataSplitting },
    { id: "overfitting", title: "Overfitting", content: CLOverfitting },
  ] },
  { id: 'chapter-09', number: '09', title: "Classification Models", subtitle: 'Neighbors, rules & probabilities', subchapters: [
    { id: "common-classification-models", title: "Common Classification Models", content: CLCommonClassificationModels },
    { id: "intro-to-k-nearest-neighbors-knn", title: "Intro to K-Nearest Neighbors (KNN)", content: CLIntroKNN },
    { id: "knn-examples", title: "KNN Examples", content: CLKNNExamples },
    { id: "case-study-knn", title: "CASE STUDY KNN", content: CLCaseKNN },
    { id: "intro-to-nai-ve-bayes", title: "Intro to Naïve Bayes", content: CLIntroNaiveBayes },
    { id: "nai-ve-bayes-frequency-tables", title: "Naïve Bayes — Frequency Tables", content: CLNaiveBayesFrequencyTables },
    { id: "nai-ve-bayes-conditional-probability", title: "Naïve Bayes — Conditional Probability", content: CLNaiveBayesConditionalProbability },
    { id: "case-study-nai-ve-bayes", title: "CASE STUDY Naïve Bayes", content: CLCaseNaiveBayes },
    { id: "intro-to-decision-trees", title: "Intro to Decision Trees", content: CLIntroDecisionTrees },
    { id: "decision-trees-entropy-101", title: "Decision Trees — Entropy 101", content: CLEntropy101 },
    { id: "entropy-information-gain", title: "Entropy & Information Gain", content: CLEntropyInformationGain },
    { id: "decision-tree-examples", title: "Decision Tree Examples", content: CLDecisionTreeExamples },
    { id: "random-forests", title: "Random Forests", content: CLRandomForests },
    { id: "case-study-decision-trees", title: "CASE STUDY Decision Trees", content: CLDecisionTreeCaseStudy },
    { id: "intro-to-logistic-regression", title: "Intro to Logistic Regression", content: LogisticIntro },
    { id: "logistic-regression-example", title: "Logistic Regression Example", content: LogisticExample },
    { id: "false-positives-vs-false-negatives", title: "False Positives vs. False Negatives", content: LogisticErrors },
    { id: "logistic-regression-equation", title: "Logistic Regression Equation", content: LogisticEquation },
    { id: "the-likelihood-function", title: "The Likelihood Function", content: LogisticLikelihood },
    { id: "multivariate-logistic-regression", title: "Multivariate Logistic Regression", content: LogisticMultivariate },
    { id: "case-study-logistic-regression", title: "CASE STUDY Logistic Regression", content: LogisticCase },
    { id: "intro-to-sentiment-analysis", title: "Intro to Sentiment Analysis", content: CLSentimentIntro },
    { id: "cleaning-text-data", title: "Cleaning Text Data", content: CLTextCleaning },
    { id: "bag-of-words-analysis", title: "Bag of Words Analysis", content: CLBagOfWords },
    { id: "case-study-sentiment-analysis", title: "CASE STUDY Sentiment Analysis", content: CLSentimentCaseStudy },
  ] },
  { id: 'chapter-10', number: '10', title: "Model Selection & Tuning", subtitle: 'Tune, evaluate & monitor classifiers', subchapters: [
    { id: "intro-to-selection-tuning", title: "Intro to Selection & Tuning", content: MSIntroSelectionTuning },
    { id: "hyperparameters", title: "Hyperparameters", content: MSHyperparameters },
    { id: "imbalanced-classes", title: "Imbalanced Classes", content: MSImbalancedClasses },
    { id: "confusion-matrix", title: "Confusion Matrix", content: MSConfusionMatrix },
    { id: "accuracy-precision-recall", title: "Accuracy, Precision & Recall", content: MSAccuracyPrecisionRecall },
    { id: "multi-class-confusion-matrix", title: "Multi-class Confusion Matrix", content: MSMulticlassConfusionMatrix },
    { id: "multi-class-scoring", title: "Multi-class Scoring", content: MSMulticlassScoring },
    { id: "model-selection", title: "Model Selection", content: MSModelSelection },
    { id: "model-drift", title: "Model Drift", content: MSModelDrift },
    { id: "looking-ahead-to-part-3", title: "Looking ahead to Part 3", content: MSLookingAhead },
  ] },
  { id: 'chapter-11', number: '11', title: "PART 3 Regression & Forecasting", subtitle: 'From categories to numeric estimates', subchapters: [
    { id: 'part-3-regression-forecasting', title: 'Part 3 Regression & Forecasting', content: ChapterEleven },
  ] },
  { id: 'chapter-12', number: '12', title: 'Intro to Regression', subtitle: 'Features, targets & numerical predictions', subchapters: [
    { id: 'supervised-vs-unsupervised-learning', title: 'Supervised vs. Unsupervised Learning', content: RISupervisedUnsupervised },
    { id: 'recap-key-concepts', title: 'RECAP Key Concepts', content: RIRecapKeyConcepts },
    { id: 'regression-101', title: 'Regression 101', content: RIRegression101 },
    { id: 'feature-engineering-for-regression', title: 'Feature Engineering for Regression', content: RIFeatureEngineering },
    { id: 'prediction-vs-root-cause-analysis', title: 'Prediction vs. Root-Cause Analysis', content: RIPredictionRootCause },
  ] },
  { id: 'chapter-13', number: '13', title: 'Regression Modeling 101', subtitle: 'Fit lines, residuals & transformed relationships', subchapters: [
    { id: 'intro-to-regression-modeling', title: 'Intro to Regression Modeling', content: RMIntro },
    { id: 'linear-relationships', title: 'Linear Relationships', content: RMLinearRelationships },
    { id: 'least-squared-error', title: 'Least Squared Error', content: RMLeastSquares },
    { id: 'univariate-linear-regression', title: 'Univariate Linear Regression', content: RMUnivariate },
    { id: 'case-study-univariate-linear-regression', title: 'CASE STUDY Univariate Linear Regression', content: RMUnivariateCase },
    { id: 'multiple-linear-regression', title: 'Multiple Linear Regression', content: RMMultiple },
    { id: 'non-linear-regression', title: 'Non-Linear Regression', content: RMNonLinear },
    { id: 'case-study-non-linear-regression', title: 'CASE STUDY Non-Linear Regression', content: RMNonLinearCase },
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
