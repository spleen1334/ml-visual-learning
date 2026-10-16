# PDF reference review

Source: `../Learning Files/3. Visual Guide to Machine Learning.pdf` relative to the app root. The PDF has 364 pages. Page numbers below are one-based PDF viewer pages, not video lesson numbers.

## Chapter 01 — Getting Started: reviewed

Reviewed extracted text on pages 1–25 for orientation; rendered and visually inspected pages 2–6. This is an introductory reference review, not a claim that the complete PDF has been visually inspected.

| PDF pages | Topic | Useful visual or teaching idea | App decision |
| --- | --- | --- | --- |
| 2 | Expectations: intuitive demos, business use cases, Excel to reveal mechanics, no statistics prerequisite | Bold lead statement with a smaller explanation beneath it | Keep short explanatory blocks, selective emphasis and visible calculations. |
| 3 | Audience and learning goals | Split-column layout separates motivations and expectations | Keep an inviting conceptual introduction; explain when, why and how rather than adding quizzes. |
| 4–5 | Series overview: profiling, classification, regression/forecasting, unsupervised learning | Illustrated stages linked by arrows; active stage emphasized | The existing course flow uses original mini charts and connected stages. Do not confuse these four series parts with the four analysis steps. |
| 6 | Part 1 outline: ML landscape, preliminary QA, univariate and multivariate profiling | Numbered, scannable overview with brief descriptions | Preserve the video-folder chapter order; support optional subchapters for longer topics. Multivariate profiling is outside the current five-folder scope. |

The chapter's five-day sales experiment is an original illustrative example, not an extracted PDF dataset. The visible numerator/denominator diagram follows the PDF's teaching intent of exposing how calculations work; it is not a copied slide. No source slides or course assets are bundled into the application.

## Chapter 02 — The ML Landscape: reviewed

Read all four local VTT files under `02. Intro to the ML Landscape/` and rendered/visually inspected PDF pages 8–16.

| Subchapter | Subtitle reference | PDF pages | Teaching adaptation |
| --- | --- | --- | --- |
| What is ML? | `1. Intro to Machine Learning.vtt` | 8–9 | Business-question explorer: categories, numerical predictions, patterns and descriptive reporting. Selecting an example reveals its chart and explanation, with no scoring. |
| When does it help? | `2. When is ML the right fit.vtt` | 10 | Contrast a simple baseline with a fitted trend on a small synthetic sales example. Make the data, calculations and limitations visible. Complexity alone does not prove a need for ML. |
| The workflow | `3. The Machine Learning Process.vtt` | 11–15 | A prominent foundation/iceberg section emphasizes prep, QA and profiling, using the course's rough 80% estimate with a concise note that project splits vary. Select workflow stages to inspect their roles and return to earlier inspection. |
| The landscape | `4. The Machine Learning Landscape.vtt` | 16 | Use a branching visual for supervised/unsupervised families and examples. Advanced topics are contextual examples, not mutually exclusive learning types: NLP, vision and deep learning can overlap supervised and unsupervised methods. |

The introductory examples are synthetic teaching data; no workbook sheet is identified as a Chapter 02 dataset. Keep the original XLSX files read-only for the later QA and profiling chapters. Numerical trend demonstrations are illustrative, not production forecasts. Predictive performance does not establish causal impact; a question about incremental revenue requires an appropriate causal design.

## Map for the next chapter reviews

These are starting points identified through text extraction, awaiting chapter-specific visual inspection:

| Video folder | PDF starting points | Next review focus |
| --- | --- | --- |
| 02 ML Landscape | 8–16 | Reviewed; see the chapter-specific notes above. |
| 03 QA & Data Profiling | 5–6, 12–15, 18–19 | Short bridge between the overall workflow and the first dataset. PDF and folder boundaries differ. |
| 04 Preliminary Data QA | 18 onward, before the univariate section | Variable types, missingness, range/count, censoring and table structure; confirm exact page span during review. |
| 05 Univariate Profiling | 35 onward | Section overview at p35; locate and visually review each relevant distribution/statistics example during implementation. |

## Chapter-by-chapter workflow

Before implementing a chapter, match its subtitles and spreadsheet sheets to PDF pages. Render relevant pages, inspect visual explanations, and record exact page references here. Adapt the concept into original responsive diagrams and manipulable data; preserve units and assumptions. End chapters/subchapters with a concise summary. Do not add quizzes, scoring, completion gates or an About section to the lesson UI.

## Chapter 02 emphasis revision

User review requested a more prominent ML definition and stronger emphasis on data preparation. The introduction now presents the p8 definition as a major visual block. The workflow page gives p11's iceberg concept and “garbage in, garbage out” message their own major section. The approximate 80% figure is attributed as the course's rough estimate, with no claim that it is a universal measured split. Preparation includes data QA and profiling rather than only cleaning; good inputs are essential but do not by themselves guarantee a useful model.

## Chapter 03 — QA & Data Profiling: reviewed

Read the single Part 1 orientation VTT in `03. PART 1 QA & Data Profiling/`. Extracted PDF pages 18–19 and rendered/visually inspected page 18. The subtitle introduces QA, univariate profiling and multivariate profiling as the foundation before modeling. Page 18 shows preparing → understanding → modeling, with QA leading into individual variables and relationships. Page 19 starts the detailed QA topics reserved for Chapter 04.

Adaptation: one short orientation lesson, with a small explicitly synthetic retail inventory and selectable analytical views. Introduce the meaning of one row, variables, record count and units before asking about patterns. Unknown values remain unknown; a suspicious value is a prompt to investigate. Full cleaning controls and the workbook case study belong in Chapter 04. Multivariate profiling is a contextual preview beyond the initial five-folder scope.

## Chapter 04 — Preliminary Data QA: reviewed

Read all ten local VTT files. Extracted PDF pages 19–34; rendered and visually inspected pages 22, 24, 26–32. Page 33 is a copyright divider; p34 transitions to univariate profiling.

| Subchapter | PDF pages | Adaptation |
| --- | --- | --- |
| Meaning and variable types | 22–23 | Separate meaning from storage. Identifiers, quantities, categories and dates support different operations. Preserve leading zeros in identifiers. Types overlap; the mean of a discrete numeric count can be meaningful. |
| Missing is not zero | 24–25 | Use a five-person age example: one confirmed unknown is zero-coded, then represented as empty. Show how AVERAGE changes its denominator without removing a person. Keep the full inventory for the case study. |
| Ranges and counts | 26–27 | Use separate small examples. MIN/MAX identify numeric/date bounds. Counts measure records within each category; distinct counts measure unique labels. A typo can split a group and inflate distinct labels without changing the number of records. An unusual range needs investigation before correction. |
| What could we observe? | 28 | Shopper-age histogram with an age-18 cutoff and repeat-purchase cohort line chart follow the PDF’s visual examples. Completing the latest cohort’s follow-up demonstrates why a recent rate can dip. A device reading below 5 illustrates true left censoring. Distinguish exclusion of under-18s (selection/truncation) from left-censored values known only to fall below a measurement threshold. |
| Long and wide tables | 29–30 | Pivot/unpivot the same six synthetic product-month measurements; preserve values and totals and name the grain of each view. A pivot with repeated keys requires explicit aggregation. |
| Maven Market case | 31–32 | Read-only workbook extract, original metrics and reversible documented corrections. The supplied soup correction requires reading its evidence before application. Record each active change and retained missingness. |

Terminology verification: [NIST on censoring](https://www.itl.nist.gov/div898/handbook/apr/section1/apr131.htm) describes observation ending before an event; [NIST on censored versus truncated data](https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/mle.htm) distinguishes recorded but incomplete observations from excluded observations. These clarify the course's broad use of “left censored.” Neither ranges alone nor a missingness pattern proves a cause or guarantees that deletion/imputation is unbiased.
