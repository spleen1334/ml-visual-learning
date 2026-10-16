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
