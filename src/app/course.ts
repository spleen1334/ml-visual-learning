import QAQuiz from '../chapters/QAQuiz'
import { LLMEvaluation } from '../chapters/LLMEvaluation'
import { LLMContext } from '../chapters/LLMContext'
import { LLMTrainingStages } from '../chapters/LLMTrainingStages'
import { LLMTraining } from '../chapters/LLMTraining'
import SourceQuiz from '../chapters/SourceQuiz'
import quiz05 from '../chapters/quiz05Data.json'
import quiz06 from '../chapters/quiz06Data.json'
import quiz08 from '../chapters/quiz08Data.json'
import quiz09 from '../chapters/quiz09Data.json'
import quiz10 from '../chapters/quiz10Data.json'
import quiz12 from '../chapters/quiz12Data.json'
import quiz13 from '../chapters/quiz13Data.json'
import quiz14 from '../chapters/quiz14Data.json'
import quiz15 from '../chapters/quiz15Data.json'

const Quiz05Quiz = () => SourceQuiz({ title: "Univariate Profiling", questions: quiz05 })
const Quiz06Quiz = () => SourceQuiz({ title: "Multivariate Profiling", questions: quiz06 })
const Quiz08Quiz = () => SourceQuiz({ title: "Intro to Classification", questions: quiz08 })
const Quiz09Quiz = () => SourceQuiz({ title: "Classification Models", questions: quiz09 })
const Quiz10Quiz = () => SourceQuiz({ title: "Model Selection & Tuning", questions: quiz10 })
const Quiz12Quiz = () => SourceQuiz({ title: "Intro to Regression", questions: quiz12 })
const Quiz13Quiz = () => SourceQuiz({ title: "Regression Modeling", questions: quiz13 })
const Quiz14Quiz = () => SourceQuiz({ title: "Model Diagnostics", questions: quiz14 })
const Quiz15Quiz = () => SourceQuiz({ title: "Time-Series Forecasting", questions: quiz15 })
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
import { RDIntro, RDSampleOutput, RDRSquared, RDErrorMetrics, RDHomoskedasticity, RDNullHypothesis, RDFSignificance, RDTValues, RDMulticollinearity, RDVIF, RDRecap } from '../chapters/RegressionDiagnostics'
import { TSIntro, TSSeasonality, TSACF, TSOneHot, TSLinearTrend, TSSmoothing, TSNonLinear, TSIntervention, TSLookingAhead } from '../chapters/TimeSeriesForecasting'
import { TSACFCase, TSOneHotCase, TSLinearTrendCase, TSSmoothingCase, TSNonLinearCase, TSInterventionCase } from '../chapters/TimeSeriesCases'
import ChapterSixteen from '../chapters/ChapterSixteen'
import { UICommonTechniques, UIFeatureEngineeringRecap, UISupervisedVsUnsupervised, UIUnsupervisedQuiz, UIUnsupervisedTakeaways, UIUnsupervisedWorkflow } from '../chapters/UnsupervisedIntro'
import { ClusterBasics, ClusterIntroduction, ClusteringQuiz, ClusteringTakeaways, DendrogramAnatomy, HierarchicalFaqs as HierarchicalClusteringFaqs, HierarchicalIntroduction, KMeansFaqs, KMeansIntroduction, KMeansPetPalsCase, WssElbowLesson } from '../chapters/UnsupervisedClustering'
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
import { DRIntroduction, DRBasics, DRPCAIntro, DRPCAExample, DRInterpretComponents, DRScreePlot, DRAdvancedTechniques, DRTakeaways, DRQuiz } from '../chapters/DimensionalityReduction'
import { AssociationIntroduction, AssociationBasics, AprioriBasics, BasketAnalysisExample, MultipleItemSets, MarkovChains, AssociationTakeaways, AssociationQuiz } from '../chapters/AssociationMining'
import { MinimumSupport } from '../chapters/MinimumSupport'
import { InfrequentItemsets } from '../chapters/InfrequentItemsets'
import { AprioriCaseStudy, MarkovCaseStudy } from '../chapters/AssociationCaseStudies'
import { OutlierIntroduction, OutlierBasics, CrossSectionalOutliers, CrossSectionalExample, CrossSectionalCase, TimeSeriesOutliers, TimeSeriesExample, OutlierTakeaways, OutlierQuiz } from '../chapters/OutlierDetection'
import { LLMNextToken } from '../chapters/LargeLanguageModels'
import { LLMTokenization } from '../chapters/LLMTokenization'
import { LLMEmbeddings } from '../chapters/LLMEmbeddings'
import { LLMNeuralNetwork } from '../chapters/LLMNeuralNetwork'
import { LLMAttention } from '../chapters/LLMAttention'
import { LLMCausalAttention } from '../chapters/LLMCausalAttention'
import { LLMTransformerBlock } from '../chapters/LLMTransformerBlock'
import { LLMLogits } from '../chapters/LLMLogits'
import { LLMSampling } from '../chapters/LLMSampling'
import { LLMPipeline } from '../chapters/LLMPipeline'
import { NLPIntroduction } from '../chapters/NLPIntroduction'

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
    { id: 'quiz', title: 'Quiz · Preliminary Data QA', content: QAQuiz },
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
    { id: 'quiz-univariate-profiling', title: 'Quiz · Univariate Profiling', content: Quiz05Quiz },
    { id: 'quiz-multivariate-profiling', title: 'Quiz · Multivariate Profiling', content: Quiz06Quiz },
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
    { id: 'quiz-intro-classification', title: 'Quiz · Intro to Classification', content: Quiz08Quiz },
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
    { id: 'quiz-classification-models', title: 'Quiz · Classification Models', content: Quiz09Quiz },
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
    { id: 'quiz-model-selection-tuning', title: 'Quiz · Model Selection & Tuning', content: Quiz10Quiz },
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
    { id: 'quiz-intro-regression', title: 'Quiz · Intro to Regression', content: Quiz12Quiz },
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
    { id: 'quiz-regression-modeling', title: 'Quiz · Regression Modeling', content: Quiz13Quiz },
  ] },
  { id: 'chapter-14', number: '14', title: 'Model Diagnostics', subtitle: 'Check fit, errors & feature stability', subchapters: [
    { id: 'intro-to-model-diagnostics', title: 'Intro to Model Diagnostics', content: RDIntro },
    { id: 'sample-model-output', title: 'Sample Model Output', content: RDSampleOutput },
    { id: 'r-squared', title: 'R-Squared', content: RDRSquared },
    { id: 'mean-error-metrics', title: 'Mean Error Metrics (MSE, MAE, MAPE)', content: RDErrorMetrics },
    { id: 'homoskedasticity', title: 'Homoskedasticity', content: RDHomoskedasticity },
    { id: 'null-hypothesis', title: 'Null Hypothesis', content: RDNullHypothesis },
    { id: 'f-significance', title: 'F-Significance', content: RDFSignificance },
    { id: 't-values-p-values', title: 'T-Values & P-Values', content: RDTValues },
    { id: 'multicollinearity', title: 'Multicollinearity', content: RDMulticollinearity },
    { id: 'variance-inflation-factor', title: 'Variance Inflation Factor', content: RDVIF },
    { id: 'recap-sample-model-output', title: 'RECAP Sample Model Output', content: RDRecap },
    { id: 'quiz-model-diagnostics', title: 'Quiz · Model Diagnostics', content: Quiz14Quiz },
  ] },
  { id: 'chapter-15', number: '15', title: 'Time-Series Forecasting', subtitle: 'Seasonality, trends & interventions', subchapters: [
    { id: 'intro-to-forecasting', title: 'Intro to Forecasting', content: TSIntro },
    { id: 'seasonality', title: 'Seasonality', content: TSSeasonality },
    { id: 'auto-correlation-function', title: 'Auto Correlation Function', content: TSACF },
    { id: 'case-study-seasonality-with-acf', title: 'CASE STUDY Seasonality with ACF', content: TSACFCase },
    { id: 'one-hot-encoding', title: 'One-Hot Encoding', content: TSOneHot },
    { id: 'case-study-seasonality-with-one-hot-encoding', title: 'CASE STUDY Seasonality with One-Hot Encoding', content: TSOneHotCase },
    { id: 'linear-trending', title: 'Linear Trending', content: TSLinearTrend },
    { id: 'case-study-seasonality-with-linear-trend', title: 'CASE STUDY Seasonality with Linear Trend', content: TSLinearTrendCase },
    { id: 'smoothing', title: 'Smoothing', content: TSSmoothing },
    { id: 'case-study-smoothing', title: 'CASE STUDY Smoothing', content: TSSmoothingCase },
    { id: 'non-linear-trends', title: 'Non-Linear Trends', content: TSNonLinear },
    { id: 'case-study-non-linear-trend', title: 'CASE STUDY Non-Linear Trend', content: TSNonLinearCase },
    { id: 'intervention-analysis', title: 'Intervention Analysis', content: TSIntervention },
    { id: 'case-study-intervention-analysis', title: 'CASE STUDY Intervention Analysis', content: TSInterventionCase },
    { id: 'looking-ahead-to-part-4', title: 'Looking Ahead to Part 4', content: TSLookingAhead },
    { id: 'quiz-time-series-forecasting', title: 'Quiz · Time-Series Forecasting', content: Quiz15Quiz },
  ] },
  { id: 'chapter-16', number: '16', title: 'Part 4: Unsupervised Learning', subtitle: 'Find patterns without a target label', content: ChapterSixteen },
  { id: 'chapter-17', number: '17', title: 'Intro to Unsupervised ML', subtitle: 'Explore patterns and useful structure', subchapters: [
    { id: 'supervised-vs-unsupervised-learning', title: 'Supervised vs. Unsupervised Learning', content: UISupervisedVsUnsupervised },
    { id: 'common-unsupervised-techniques', title: 'Common Unsupervised Techniques', content: UICommonTechniques },
    { id: 'unsupervised-ml-workflow', title: 'Unsupervised ML Workflow', content: UIUnsupervisedWorkflow },
    { id: 'recap-feature-engineering', title: 'RECAP Feature Engineering', content: UIFeatureEngineeringRecap },
    { id: 'key-takeaways-unsupervised-ml', title: 'KEY TAKEAWAYS Intro to Unsupervised ML', content: UIUnsupervisedTakeaways },
    { id: 'quiz-intro-unsupervised-ml', title: 'Quiz · Intro to Unsupervised ML', content: UIUnsupervisedQuiz },
  ] },
  { id: 'chapter-18', number: '18', title: 'Clustering & Segmentation', subtitle: 'Group observations and interpret the result', subchapters: [
    { id: 'introduction', title: 'Introduction', content: ClusterIntroduction },
    { id: 'clustering-basics', title: 'Clustering Basics', content: ClusterBasics },
    { id: 'intro-to-k-means', title: 'Intro to K-Means', content: KMeansIntroduction },
    { id: 'wss-elbow-plots', title: 'WSS & Elbow Plots', content: WssElbowLesson },
    { id: 'k-means-faqs', title: 'K-Means FAQs', content: KMeansFaqs },
    { id: 'case-study-k-means', title: 'CASE STUDY K-Means', content: KMeansPetPalsCase },
    { id: 'intro-to-hierarchical-clustering', title: 'Intro to Hierarchical Clustering', content: HierarchicalIntroduction },
    { id: 'anatomy-dendrogram', title: 'Anatomy of a Dendrogram', content: DendrogramAnatomy },
    { id: 'hierarchical-clustering-faqs', title: 'Hierarchical Clustering FAQs', content: HierarchicalClusteringFaqs },
    { id: 'key-takeaways-clustering-segmentation', title: 'KEY TAKEAWAYS Clustering & Segmentation', content: ClusteringTakeaways },
    { id: 'quiz-clustering-segmentation', title: 'Quiz · Clustering & Segmentation', content: ClusteringQuiz },
  ] },
  { id: 'chapter-19', number: '19', title: 'Association Mining & Basket Analysis', subtitle: 'Find co-occurring items and state transitions', subchapters: [
    { id: 'introduction', title: 'Introduction', content: AssociationIntroduction },
    { id: 'association-mining-basics', title: 'Association Mining Basics', content: AssociationBasics },
    { id: 'apriori-algorithm', title: 'The Apriori Algorithm', content: AprioriBasics },
    { id: 'basket-analysis-examples', title: 'Basket Analysis Examples', content: BasketAnalysisExample },
    { id: 'minimum-support-thresholds', title: 'Minimum Support Thresholds', content: MinimumSupport },
    { id: 'infrequent-itemsets', title: 'Infrequent Itemsets', content: InfrequentItemsets },
    { id: 'multiple-item-sets', title: 'Multiple Item Sets', content: MultipleItemSets },
    { id: 'case-study-apriori', title: 'CASE STUDY Apriori', content: AprioriCaseStudy },
    { id: 'markov-chains', title: 'Markov Chains', content: MarkovChains },
    { id: 'case-study-markov-chains', title: 'CASE STUDY Markov Chains', content: MarkovCaseStudy },
    { id: 'key-takeaways-association-mining', title: 'KEY TAKEAWAYS Association Mining', content: AssociationTakeaways },
    { id: 'quiz-association-mining', title: 'Quiz · Association Mining', content: AssociationQuiz },
  ] },
  { id: 'chapter-20', number: '20', title: 'Outlier Detection', subtitle: 'Find unusual observations in context', subchapters: [
    { id: 'introduction', title: 'Introduction', content: OutlierIntroduction },
    { id: 'outlier-detection-basics', title: 'Outlier Detection Basics', content: OutlierBasics },
    { id: 'cross-sectional-outliers', title: 'Cross-Sectional Outliers', content: CrossSectionalOutliers },
    { id: 'cross-sectional-outlier-example', title: 'Cross-Sectional Outlier Example', content: CrossSectionalExample },
    { id: 'case-study-cross-sectional-outlier', title: 'CASE STUDY Cross-Sectional Outlier', content: CrossSectionalCase },
    { id: 'time-series-outliers', title: 'Time-Series Outliers', content: TimeSeriesOutliers },
    { id: 'time-series-outlier-example', title: 'Time-Series Outlier Example', content: TimeSeriesExample },
    { id: 'key-takeaways-outlier-detection', title: 'KEY TAKEAWAYS Outlier Detection', content: OutlierTakeaways },
    { id: 'quiz-outlier-detection', title: 'Quiz · Outlier Detection', content: OutlierQuiz },
  ] },
  { id: 'chapter-21', number: '21', title: 'Dimensionality Reduction', subtitle: 'Summarize many features into fewer dimensions', subchapters: [
    { id: 'introduction', title: 'Introduction', content: DRIntroduction },
    { id: 'dimensionality-reduction-basics', title: 'Dimensionality Reduction Basics', content: DRBasics },
    { id: 'principal-component-analysis', title: 'Principal Component Analysis', content: DRPCAIntro },
    { id: 'pca-example', title: 'PCA Example', content: DRPCAExample },
    { id: 'interpreting-components', title: 'Interpreting Components', content: DRInterpretComponents },
    { id: 'scree-plots', title: 'Scree Plots', content: DRScreePlot },
    { id: 'advanced-techniques', title: 'Advanced Techniques', content: DRAdvancedTechniques },
    { id: 'key-takeaways-dimensionality-reduction', title: 'KEY TAKEAWAYS Dimensionality Reduction', content: DRTakeaways },
    { id: 'quiz-dimensionality-reduction', title: 'Quiz · Dimensionality Reduction', content: DRQuiz },
  ] },
  { id: 'chapter-97', number: '97', title: 'Natural Language Processing, NLP', subtitle: 'From text to useful outputs', subchapters: [
    { id: 'what-can-we-do-with-language', title: 'What can we do with language?', content: NLPIntroduction },
    { id: 'sentence-and-token-boundaries', title: 'Where does a sentence begin and a token end?' },
    { id: 'cleaning-can-remove-meaning', title: 'Cleaning can remove meaning' },
    { id: 'from-messages-to-a-count-table', title: 'From messages to a count table' },
    { id: 'which-words-distinguish-a-document', title: 'Which words distinguish a document?' },
    { id: 'a-small-text-classifier', title: 'A small text classifier' },
    { id: 'search-by-words', title: 'Search by words' },
    { id: 'search-beyond-exact-words', title: 'Search beyond exact words' },
    { id: 'turn-text-into-a-structured-record', title: 'Turn text into a structured record' },
    { id: 'how-do-we-know-it-works', title: 'How do we know it works?' },
    { id: 'follow-the-complete-nlp-workflow', title: 'Follow the complete NLP workflow' },
  ] },
  { id: 'chapter-99', number: '99', title: 'Large Language Models, LLMs', subtitle: 'From next-token prediction to a complete pipeline', subchapters: [
    { id: 'what-does-an-llm-predict', title: 'What does an LLM predict?', content: LLMNextToken },
    { id: 'tokenization', title: 'Tokenization: text into token IDs', content: LLMTokenization },
    { id: 'embeddings-and-position', title: 'Embeddings and position', content: LLMEmbeddings },
    { id: 'neural-network', title: 'The neural network inside', content: LLMNeuralNetwork },
    { id: 'attention-qkv', title: 'Attention: queries, keys, and values', content: LLMAttention },
    { id: 'masking-and-heads', title: 'Causal masking and multiple heads', content: LLMCausalAttention },
    { id: 'transformer-block', title: 'A Transformer block', content: LLMTransformerBlock },
    { id: 'logits-and-softmax', title: 'Logits and softmax', content: LLMLogits },
    { id: 'sampling-and-temperature', title: 'Sampling and temperature', content: LLMSampling },
    { id: 'training-loss-and-gradients', title: 'Training: loss and gradients', content: LLMTraining },
    { id: 'pretraining-and-post-training', title: 'Pretraining, instructions, and preferences', content: LLMTrainingStages },
    { id: 'context-memory-retrieval-tools', title: 'Context, memory, retrieval, and tools', content: LLMContext },
    { id: 'limitations-and-evaluation', title: 'Limitations and evaluation', content: LLMEvaluation },
    { id: 'full-pipeline', title: 'The full LLM pipeline', content: LLMPipeline },
  ] },
]

export function chapterHref(chapter: Chapter, section?: Subchapter): string {
  const index = section ? chapter.subchapters?.findIndex(item => item.id === section.id) ?? -1 : -1
  return `#${chapter.id}${section ? `/${Number(chapter.number)}.${index + 1}-${section.id}` : ''}`
}

export function resolveLesson(hash: string, course: readonly Chapter[] = chapters) {
  const [chapterId, sectionId] = hash.replace(/^#/, '').split('/')
  const chapter = course.find(item => item.id === chapterId && (item.content || item.subchapters?.some(section => section.content)))
    ?? course.find(item => item.content || item.subchapters?.some(section => section.content))
  if (!chapter) throw new Error('The course needs at least one published lesson.')
  const section = chapter.subchapters?.find(item => item.content && (item.id === sectionId || chapterHref(chapter, item) === `#${chapterId}/${sectionId}`))
    ?? (!chapter.content ? chapter.subchapters?.find(item => item.content) : undefined)
  return { chapter, section, Content: section?.content ?? chapter.content! }
}

export function publishedLessons(course: readonly Chapter[] = chapters) {
  return course.flatMap(chapter => [
    ...(chapter.content ? [{ href: chapterHref(chapter), title: chapter.title, chapter, section: undefined as Subchapter | undefined }] : []),
    ...(chapter.subchapters?.filter(section => section.content).map(section => ({ href: chapterHref(chapter, section), title: section.title, chapter, section })) ?? []),
  ])
}
