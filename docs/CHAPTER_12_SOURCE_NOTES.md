# Chapter 12 — Intro to Regression: source notes

## Course sources and lesson order

Course title: **Visual Guide to Machine Learning**. The matching folder is `../12. Intro to Regression/`. I reviewed all five numbered lesson VTTs and the PDF pages below. The folder also contains `6.7 QUIZ Intro to Regression.html`; it is an assessment, so it is omitted from the lesson sequence.

| Order | Lesson | PDF pages | Main source material |
| --- | --- | --- | --- |
| 1 | Supervised vs. Unsupervised Learning | 191–193 | ML landscape; observed labels; classification predicts categories and regression predicts numerical values. |
| 2 | RECAP Key Concepts | 194 | Rows as records/observations, columns as variables; categorical vs. numerical fields; QA and profiling first. |
| 3 | Regression 101 | 195–198 | Numeric dependent variable (Y); independent variables (X); observed records train a model; unseen Y can be predicted from known X; regression workflow. |
| 4 | Feature Engineering for Regression | 199–201 | Creating useful features, one-hot encoding, Boolean feature, log spend; data splitting and overfitting are shown as related workflow context. |
| 5 | Prediction vs. Root-Cause Analysis | 202 | Predictive accuracy and causal explanation are different goals. |

PDF 189 is the course outline and p190 is a copyright divider; they are useful orientation, not substantive Chapter 12 lesson pages. Page ranges above use one-based PDF viewer pages. Page 203 is another copyright divider.

## Key definitions and examples

- **Supervised learning** uses observed labels (the outcome being predicted); **unsupervised learning** has no label and describes or organizes the data. The course names purchase, sentiment, product type, revenue, and churn as label examples. A binary 1/0 purchase field is categorical despite its numeric storage.
- **Classification** predicts a categorical target; **regression** predicts a numerical target. Revenue and units sold are the course's forecasting examples. In regression notation, Y is the numeric dependent/target/output variable; X values are independent variables, predictors, features, explanatory variables, or covariates.
- Regression example: predict monthly revenue from social posts, competitive activity, marketing spend, and promotion count. Competitive activity is categorical; the PDF says to transform it into model-friendly numeric fields. The table has ten observed months and an eleventh row with known inputs but unknown revenue (`???`) to illustrate prediction.
- **Feature engineering** creates additional independent variables from existing fields. The PDF's sample features are one-hot flags for High/Medium/Low competitive activity, `Promotion >10 & Social >25`, and `Log Spend` (natural log of marketing spend). Its example values include High → (1,0,0), Low → (0,0,1); the combined Boolean flag is 1 for rows 1 and 4. The sample values are illustrative, not a validated business model.
- The workflow puts measurement planning, preliminary QA, and profiling before modeling. It then shows feature engineering, splitting into training/test records, model training, and selection/tuning. The PDF gives a rough 70–80% training / 20–30% test split rule of thumb. The test data should not be used for optimization. Overfitting means fitting training records so closely that performance on unseen test data is poor; the slide contrasts overfit, well-fit, and underfit cases.
- The final lesson distinguishes **prediction** (accurate numeric estimates, even without proven causality) from **root-cause analysis** (estimating causal impact of inputs). The subtitles say this course emphasizes prediction and points interested learners toward causal inference and parametric statistics.

## Workbook materials and source boundaries

`../Learning Files/3. Maven_ML_Demos_COMPLETE.xlsx` includes tabs titled **One-Hot Encoding**, **Univariate Linear Regression**, and **Non-Linear Regression**, among others. One-Hot Encoding is the directly relevant workbook reference for this chapter's engineered-feature example; the regression model tabs align more directly with the later Regression Modeling chapter. No workbook output is needed to reproduce the Chapter 12 examples, which are already shown in the PDF.

Workbook inspection caveat: the `One-Hot Encoding` worksheet relation resolves to a worksheet XML whose visible top-left cells are headed `BRAZIL AVG TEMP (C˚)` and show month indicators and regression output. That appears inconsistent with the tab name and course lesson; avoid attributing those displayed data or model results to the Chapter 12 marketing example unless the workbook is visually checked in Excel. The PDF alone is the reliable reference for the marketing/one-hot example here.

## Corrections and uncertainties to preserve

- The PDF/VTT correctly require a numerical **target** for regression, but categorical **input features** can be used after suitable encoding; do not repeat the loose wording that categorical variables “cannot be used for regression” as a blanket rule.
- A label is the observed target in supervised learning. For the regression lesson, be precise that the target is numeric; for classification it is categorical. Numeric encoding of a binary category does not itself make the task regression.
- The source labels X variables “independent” and discusses how they “impact” Y. This terminology alone does not establish causal effects. Regression prediction or feature importance is not proof of root cause; causal claims need an appropriate design and assumptions.
- The marketing table's values are teaching examples with no units/context for several predictors, and no evidence of model fitting or validity is supplied. Do not treat its strange revenue/spend combinations or the later one-hot / log values as real business data or causal evidence.
- The subtitle uses “root cause” broadly. The slide's goal to “prove causality” is too strong without a causal identification strategy; frame it as investigating causal impact, with the proof boundary explicit.
