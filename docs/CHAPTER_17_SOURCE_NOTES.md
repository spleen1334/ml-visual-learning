# Chapter 17 — Intro to Unsupervised ML source notes

## Source map and order

Reviewed the five VTTs, the source quiz HTML, and PDF pages 277–282 in `../Learning Files/3. Visual Guide to Machine Learning.pdf`; rendered and visually inspected all six pages. No chapter-specific worksheet is present in the matching section. The complete workbook does contain later `K-Means`, `Apriori`, `Markov Chain`, and `Outlier Detection` sheets; those belong to their own lessons, not this introductory chapter.

| Order | Source | PDF pages | Main content |
| --- | --- | --- | --- |
| 1 | `1. Supervised vs. Unsupervised Learning.vtt` | 277–279 | Course ML landscape; label distinction; unsupervised work describes or organizes observed data to find patterns; examples for clusters, associated purchases, anomalies, and reducing dimensions. |
| 2 | `2. Common Unsupervised Techniques.vtt` | 279 | The course sequence: K-Means and hierarchical clustering; Markov chains and Apriori; cross-sectional and time-series outlier detection; dimensionality reduction. BI examples include finding customer groups, products purchased together, anomalies, and fewer dimensions for understanding data. |
| 3 | `3. Unsupervised ML Workflow.vtt` | 280 | Business objective, preliminary QA and profiling first; then feature engineering, model application, hyperparameter tuning, and model selection. Tuning/feature work/model runs can iterate. Choose based on usefulness to the objective. |
| 4 | `4. RECAP Feature Engineering.vtt` | 281 | Feature engineering definition and five-month business table. The source contrasts original fields with binary indicators and log spend; engineered features should be intuitive and actionable for the business objective. |
| 5 | `5. KEY TAKEAWAYS Intro to Unsupervised ML.vtt` | 282 | Find patterns rather than predict labels; many techniques have no single right/wrong solution; interpret results in light of the business outcome. |
| 6 | `6.11 QUIZ Intro to Unsupervised ML.html` | No separate PDF quiz page | Five multiple-choice questions; source answers and feedback are recorded below. Preserve source order; the original HTML shuffles questions at runtime. |

## Source visuals and exact feature-engineering table (p. 281)

The table has five month observations and eleven columns: six original and five engineered. Preserve the rows, the original/engineered grouping, headers, displayed values, and dark-gray/orange-yellow header colors if reproducing it. The engineered columns are one-hot category flags, a joint threshold flag, and displayed log marketing spend.

| Month ID | Social Posts | Competitive Activity | Marketing Spend | Promotion Count | Revenue | Competitive High | Competitive Medium | Competitive Low | Promotion > 10 & Social > 25 | Log Spend |
| ---: | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | 30 | High | $130,000 | 12 | $1,300,050 | 1 | 0 | 0 | 1 | 11.7 |
| 2 | 15 | Low | $600,000 | 5 | $11,233,310 | 0 | 0 | 1 | 0 | 13.3 |
| 3 | 8 | Medium | $15,000 | 10 | $1,112,050 | 0 | 1 | 0 | 0 | 9.6 |
| 4 | 22 | Medium | $705,000 | 11 | $1,582,077 | 0 | 1 | 0 | 1 | 13.5 |
| 5 | 41 | High | $3,000 | 3 | $1,889,053 | 1 | 0 | 0 | 0 | 8.0 |

The transcript describes possible binary flags for competitive activity high/medium/low, a flag when promotions exceed 10 and social posts exceed 25, and logging marketing spend. The slide shows the specific results above. It does not name the logarithm base, currency convention for the log, or exact transform formula. Do not claim a precise formula or silently recompute its displayed values without checking the source artifact; if demonstrating a transform, state the chosen convention and preserve the source values as shown.

## Restored unsupervised-family map (p. 279)

The source slide groups the methods into four families beneath **Unsupervised Learning**, with an example question aligned beside each family. The 17.1 landscape lesson now retains its existing three-part course landscape and appends this connected family map; 17.2 uses the same map in place of the previous flat technique cards. Preserve the family-to-method grouping and question wording:

| Family | Methods shown in the source | Example question shown in the source |
| --- | --- | --- |
| Clustering / Segmentation | K-Means Clustering; Hierarchical Clustering | Are there specific groups or “clusters” of customers who behave in similar ways? |
| Association Mining / Basket Analysis | Markov Chains; Apriori | When customers purchase a particular item, which other items tend to be purchased as well? |
| Outlier Detection | Cross-sectional Outlier Detection; Time-series Outlier Detection | Are there any anomalies in the data that we wouldn’t expect to see under normal conditions? |
| Dimensionality Reduction | Dimensionality Reduction | Can we combine or reduce the number of dimensions in our data to better understand it? |

The reproduced map keeps a visible connector from the Unsupervised Learning root through the grouped families and their methods. It is an orientation visual; do not imply that the questions uniquely determine a method or replace the dedicated later lessons.

## Unsupervised learning workflow (p. 280; `3. Unsupervised ML Workflow.vtt`)

The slide title is **Unsupervised Learning Workflow**. The top foundation group contains three distinct steps—**Business Objective**, **Preliminary QA**, and **Data Profiling**—with the reminder “Remember, these steps ALWAYS come first.” Its source explanation is: “Before building a model, you should have a clear understanding of the business objective (identifying clusters, detecting anomalies, etc.) and the data at hand (variable types, table structure, data quality, profiling metrics, etc.).” The lesson keeps those three steps grouped and before the modeling workflow.

Below the foundation, preserve the four source stages and descriptions in order:

1. **Feature Engineering** — “Add new, calculated variables (or ‘features’) to the data set based on existing fields.”
2. **Model Application** — “Apply relevant unsupervised ML techniques, based on the objective (you will typically test multiple models).”
3. **Hyperparameter Tuning** — “Adjust and tune model parameters (this is typically an iterative process).”
4. **Model Selection** — “Select the model that yields the most useful or insightful results, based on the objective at hand.”

The PDF shows forward arrows between these four stages. It also shows feedback from tuning to both feature engineering and model application (running the model again on the same data). Keep both return paths directional. The source conclusion is reproduced verbatim: “There often are no strict rules to determine which model is best; it’s about which one helps you best answer the question at hand”. This statement guides model selection by usefulness; it does not say that evaluation measures are unavailable.

The customer-group / missing-spend / duplicate-ID / variable-type / table-structure / spend-distribution examples are a short illustrative addition requested for this restoration; they are not values or a dataset from the source. They are labeled as an example and do not add a worked calculation.

## Quiz source and answer key

The source quiz title is “QUIZ: Intro to Unsupervised ML.” It has five multiple-choice items in this order:

| # | Prompt topic | Correct answer | Source feedback / adaptation |
| ---: | --- | --- | --- |
| 1 | Unsupervised ML is used when data does not have… | Labels | Feedback: typically data without labels. Keep the answer grounded in training labels; do not imply data can never later have external outcomes for evaluation. |
| 2 | Primary objective of unsupervised learning | Finding patterns | Feedback: identify insights and patterns in observed values. |
| 3 | Which is an unsupervised technique? | All of the above: K-Means, outlier detection, dimensionality reduction | Feedback confirms all three. |
| 4 | Primary objective, generally speaking | Answering the business question at hand | Feedback contrasts supervised prediction with choosing the most helpful unsupervised result for the business question. |
| 5 | Which use case would require an unsupervised model? | Identifying clusters of users or customers | “Require” overstates necessity. Reword to “Which is a clear example of a question clustering could help explore?” Preserve the intended answer and clarify that model choice depends on the objective and data. |

The source HTML stores feedback strings in `prompt.feedbacks` but the explanation dialog reads the absent `prompt.explanation`, so its explanation button displays “no explanation found.” If adapting this quiz, use the stored correct-answer feedback where available and write a short explanation for each item from the course material; preserve question order, concepts, and correct answers. The source also references a `pass_percent` property that is absent, so it does not establish a passing threshold.

## Adaptation boundaries and corrections

- Follow the course's progression from landscape and label distinction, through methods and workflow, to the concrete feature-engineering recap and key takeaways. Keep all topic families within this chapter as orientation; detailed models belong in later chapters.
- Reproduce the five-row source feature table faithfully if used. Do not invent additional rows, model results, or claims that a model was trained. The source only illustrates feature construction.
- The p. 280 diagram places business objective and preliminary QA/profiling before an iterative feature-engineering → model-application → hyperparameter-tuning loop and then model selection. Keep those order and feedback relationships visible.
- The course contrasts supervised prediction with unsupervised pattern finding. Phrase this as a typical goal, not a universal prohibition on prediction-like uses or evaluation. Likewise, “no right or wrong” means there may be no single target-label score; useful internal measures can still guide analysis, but do not substitute a score for business interpretation.
- The source mixes algorithm families with application areas (for example, outlier detection and dimensionality reduction) under “unsupervised techniques.” Retain its intended list while explaining specific methods in their dedicated lessons.
- The source states that univariate profiling, classification, regression, and unsupervised learning do not care about independent/dependent variables or data splitting in the same way. For this chapter, keep the distinction focused on whether a target label is supplied for learning; do not imply that all feature columns are irrelevant or that data partitioning is never useful for any downstream validation.
