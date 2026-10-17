# Chapter 08 source notes — Intro to Classification

## Reviewed materials

- All eight lesson subtitles in `../08. Intro to Classification/` (lessons 1–8), the matching chapter slides in `../Learning Files/3. Visual Guide to Machine Learning.pdf` (PDF pp. 83–95), and `../08. Intro to Classification/9.4 Intro to Classification.html` (course assessment export). PDF pages 83–95 were rendered; the key comparison, recap, CRM, workflow, feature-engineering, data-split, and fit slides were visually inspected. Slide tables, arrows, color grouping, and fit diagrams are legible.
- The PDF/source examples share a CRM churn task: use observed customer records to predict whether another customer will churn next month. A separate recap uses five web sessions to review rows, variables, categorical/numerical fields, and profiling.

## Lesson map and source anchors

| Lesson | Main idea and source | Visual teaching cue |
| --- | --- | --- |
| 1. Supervised vs. Unsupervised Learning | Supervised data has an observed label to predict; unsupervised work describes or organizes unlabeled data. The course frames both as finding patterns. PDF pp. 83–84. | Branch the ML landscape into label / no label, then attach the different goals. Keep clustering and outlier detection as examples of unsupervised work. |
| 2. Classification vs. Regression | These are supervised approaches: classification predicts a class for a categorical target; regression predicts a numerical value. Examples: churn, segment, sentiment versus revenue, units sold, seasonality. PDF p. 85. | Put categorical and numerical target types side by side; show the target type deciding the task. |
| 3. RECAP Key Concepts | A row is a record/observation and a column is a variable. Categorical values are classes; numerical values are numbers. QA and profiling precede modeling; ML extends visual analysis when dimensions become hard to inspect. PDF p. 86. | Reuse the five-row web-session table with arrows naming rows, columns, and types. Purchase 0/1 is categorical despite numeric spelling. |
| 4. Classification 101 | Predict categorical dependent variable `Y` from independent variables `X` / predictors / features. The ten labeled CRM rows train the model; row 11 has features but unknown churn. PDF pp. 87–89. | Highlight Churn as target, the remaining permitted columns as predictors, and the unknown target in the new record. |
| 5. Classification Workflow | Project scoping, preliminary QA, and profiling come first. Then feature engineering → data splitting → model training → selection/tuning; weak results may loop back to feature work. PDF p. 90. | A connected sequence with an explicit preflight stage and a feedback arrow; selection/tuning is later scope, not another lesson here. |
| 6. Feature Engineering | Enrich/prepare predictors from existing fields. PDF pp. 91–92 demonstrates status one-hot encoding, income scaling and log transformation, age discretization, date extraction, and Boolean logic. | Before/after CRM table makes each new field traceable to its source; use the technique labels under the transformed columns. |
| 7. Data Splitting | Partition records into training and test sets; train/optimize on training and reserve test for unseen-data validation. The slide uses 7/3 of ten rows and gives 70–80% / 20–30% as a rule of thumb. PDF p. 93. | Show the CRM rows split into green training and yellow test blocks; test data is not used to optimize. |
| 8. Overfitting | Overfitting fits training examples too closely and generalizes poorly; underfitting misses the pattern; a useful fit balances both. The course uses a memorized-test analogy and boundary plots for two classes. PDF pp. 94–95. | Compare overfit / well-fit / underfit curves, then show the same idea as class boundaries. Make generalization to unseen cases the visual test. |

## Conceptual traps and careful wording

- Task type comes from the target being predicted, not from whether predictor columns happen to contain numbers. A binary 0/1 purchase or churn target is categorical; it could be written Yes/No. Regression predicts a numeric target.
- “Supervised vs. unsupervised” and “classification vs. regression” answer different questions: whether examples have a target label, then what kind of target is predicted.
- Do not imply predictors cause the target. The source sometimes says variables “impact” churn; explain them as useful predictive information, not causal proof.
- Keep the course's workflow order, while avoiding the implication that every dataset uses one fixed row-order split or one universal split ratio. The slide's first-seven/last-three split is an illustration; a real split must preserve an appropriate evaluation design. Do not tune against the held-out test set.
- Feature creation can introduce target leakage if it uses information unavailable at prediction time. The source does not cover leakage; briefly flag this if the implementation discusses what makes a feature valid.
- “More features” does not guarantee a better model. The source says features can help predictive power, but the worked table demonstrates transformations, not measured performance gains.
- The source's 0–1 scaling values are relative to the small displayed income sample, and the log values are illustrative. Avoid presenting them as universal transformations or implying all model types need scaling.
- The source calls supervised data labeled and unsupervised data unlabeled as a beginner distinction; avoid extending that into claims that unsupervised learning has no evaluation or that its output is necessarily useful.

## Workbook relevance

The local HTML is a nine-question multiple-choice assessment, not a worked coding workbook or dataset. Its coverage mirrors the lessons: labeled supervised prediction; classification versus regression target type; dependent/independent variable aliases; feature engineering; the role of splitting in detecting overfit; generalization; and distinguishing supervised learning from feature techniques. One question specifically treats product purchase as categorical. The chapter guidance omits quizzes, so use this only as a coverage checklist and do not reproduce its answer-selector format.

## Scope

This chapter introduces core classification vocabulary and the modeling workflow, not classifier algorithms, evaluation metrics, model tuning details, or a live fitted churn prediction. Preserve that boundary before Chapter 09.

## Implementation choices

- The UI adds a separate validation role (14/4/2 out of 20 balanced records), rather than using the final test to choose settings.
- Feature outputs are computed from a five-row CRM example; row-one arithmetic and the corresponding source column(s) remain visible. Age bins use non-overlapping integer labels such as 20–29.
- The overfitting plot uses schematic class boundaries with one unusual training point and nearby unseen examples. Above the curve predicts churn; below predicts stay. These are illustrations, not fitted model results or measured scores.
