# ML Visual Interactive

A personal, interactive learning companion for the first sixteen chapters of the visual ML course. This app and Git repository live entirely in this folder. Original videos, subtitles, PDF and workbooks remain outside the app as read-only sources.

## Current milestone

Chapters 01–16 are implemented. [Chapter 16 — Part 4: Unsupervised Learning](http://127.0.0.1:5173/#chapter-16) opens the course's five-topic unsupervised-learning sequence. [Chapter 15 — Time-Series Forecasting](http://127.0.0.1:5173/#chapter-15) contains 15 source-aligned lessons, including six complete workbook case studies. See the [Chapter 16 source notes](docs/CHAPTER_16_SOURCE_NOTES.md), Chapter 15 [source notes](docs/CHAPTER_15_SOURCE_NOTES.md), [workbook notes](docs/CHAPTER_15_WORKBOOK_NOTES.md), and [verification review](docs/CHAPTER_15_REVIEW.md). Chapter 02 — The ML Landscape has four subchapters:

1. [What is machine learning?](http://127.0.0.1:4173/#chapter-02/what-is-ml) — switch business questions and inspect the form of the answer.
2. [When does ML help?](http://127.0.0.1:4173/#chapter-02/when-to-use-ml) — compare an average and a fitted trend with a held-out sales observation.
3. [The data workflow](http://127.0.0.1:4173/#chapter-02/the-workflow) — follow one synthetic table through QA, individual variables, relationships and a possible estimate.
4. [A map of the methods](http://127.0.0.1:4173/#chapter-02/the-landscape) — explore supervised and unsupervised families with illustrated examples.

[Chapter 03 — Meet the inventory](http://127.0.0.1:4173/#chapter-03) is a short orientation page. Chapter 04 is ready for review in six lessons:

1. [Meaning and variable types](http://127.0.0.1:4173/#chapter-04/variable-types) — inspect fields, date parsing and numeric-looking identifiers.
2. [Empty values](http://127.0.0.1:4173/#chapter-04/missing-values) — use five ages to see how a zero-coded unknown changes an average.
3. [Range & count calculations](http://127.0.0.1:4173/#chapter-04/ranges-counts) — use small, separate tables to inspect MIN/MAX, counts within categories, and distinct labels.
4. [What could we observe?](http://127.0.0.1:4173/#chapter-04/observation-limits) — change follow-up time on synthetic customer timelines.
5. [Long and wide tables](http://127.0.0.1:4173/#chapter-04/table-structure) — pivot six measurements and follow the same observation.
6. [Maven Market case study](http://127.0.0.1:4173/#chapter-04/inventory-case) — combine reversible, documented corrections on all 100 workbook records.

[Chapter 05 — Univariate Profiling](http://127.0.0.1:4173/#chapter-05) is implemented in the course's 19-lesson sequence. Explore categories and discretization, histogram bins and kernel densities, dice sampling, athlete/reference heights, and visual calculations for center, percentiles, spread and skewness. [Chapter 06 — Multivariate Profiling](http://127.0.0.1:4173/#chapter-06) adds 15 lessons: joint category tables and an accident heat map, grouped densities, violin and box plots, scatter plots, correlation, and a marketing case study. [Chapter 07 — Part 2 Classification Modeling](http://127.0.0.1:4173/#chapter-07/part-2-classification-modeling) introduces prediction of categories and the upcoming learning path. [Chapter 08 — Intro to Classification](http://127.0.0.1:4173/#chapter-08) adds eight lessons on labels, prediction tasks, features, splitting and overfitting. Chapter 09 adds 25 lessons on classification models, with neighbor voting, Bayes calculations, tree splits, logistic probabilities and text features. [Chapter 10 — Model Selection & Tuning](http://127.0.0.1:4173/#chapter-10) adds ten lessons on hyperparameters, imbalance, confusion matrices, metrics, context-led model selection, and drift. [Chapter 11 — Part 3 Regression & Forecasting](http://127.0.0.1:4173/#chapter-11/part-3-regression-forecasting) introduces numeric estimates, time-ordered forecasts, and the four chapters ahead. Chapter 04 now ends with an optional source-based quiz (4.7), including explanations and retries. Other chapter quizzes are deferred in `todo.md`; navigation remains ungated. Each lesson has visible explanations and a summary. CODAP remains a useful companion rather than a runtime dependency.

## Run locally

Use Node 22.12 or later (developed with Node 26.1) and npm.

```sh
npm ci
npm run dev
```

Open **http://127.0.0.1:5173/#chapter-01**. Dependencies, npm cache and build output stay in this folder. No account or backend is required; the app makes no third-party runtime requests. Experiment values reset on reload or lesson navigation.

Use **Search course**, **⌘K** on Mac, or **Ctrl+K** to find chapters and lessons by number (such as `4.2`), title, or subtitle. Search tolerates small spelling mistakes. Use ↑/↓ and Enter to open a result; Escape closes the palette.

```sh
npm run check       # focused tests, strict TypeScript, production build
npm run preview     # serve dist at http://127.0.0.1:4173
```

## Review the interactions

- Chapter 01: set Day 5 to 22. The mean moves from 8 to 10; the visible calculation shows 50 ÷ 5. Reset restores 12 and a mean of 8.
- Chapter 02.1: switch business questions; the explanation and chart change together.
- Chapter 02.2: change February from 58 to 46. The forecasts remain 46.2 and 56.4 because February was excluded from fitting; their absolute errors change to 0.2 and 10.4. Reset restores 58. Clearing and replacing the number commits on blur.
- Chapter 02.3: switch workflow stages. The sales distribution contains all six months (bin counts 3, 2, 1); paired comparisons use five months because November promotion spend is missing.
- Chapter 02.4: explore each family and its illustration. Read the branch map and summary.
- Navigate with Previous/Next, the sidebar or phone subchapter strip. Direct links, reload and browser Back/Forward should retain the selected lesson. No future chapter opens an empty page.

## Structure and references

- `src/App.tsx`: shared shell, lesson navigation and focus handling.
- `src/app/course.ts`: chapter/subchapter manifest and route resolution.
- `src/chapters/`: lesson components, chapter-specific styles and synthetic data.
- `src/math/`: shared calculations and numerical tests.
- `src/styles.css`: shared styles; `previews/`: screenshots and review evidence.
- [BUILD_PLAN.md](BUILD_PLAN.md): original plan and mathematical conventions.
- [ALTERNATIVES.md](ALTERNATIVES.md): tools and reuse options.
- [docs/PDF_REFERENCES.md](docs/PDF_REFERENCES.md): chapter-specific subtitle/PDF references and adaptation decisions.
- [docs/SUBCHAPTERS.md](docs/SUBCHAPTERS.md): adding one-page or nested chapters.
- [docs/LEARNING_STYLE.md](docs/LEARNING_STYLE.md): definition panels, diagrams and reading hierarchy to apply throughout the course.
- [todo.md](todo.md): deferred end-of-project ideas, including the grouped table of contents.

Chapter 03: switch QA, One variable and Relationships to compare the same six product records. Five known prices span $3–$12; distribution counts are 2, 2, 1 and the paired view shows five products.

Chapters 01–03 and the Chapter 04 foundations use explicitly synthetic teaching data. The Chapter 04 case study uses the 100-row course workbook inventory, extracted read-only; see [docs/QA_DATA.md](docs/QA_DATA.md) for exact ranges, data hash and preparation rules. The five-day Chapter 01 sales data and Chapter 02 sales/store records are original teaching examples rather than workbook extracts. Course transcripts, PDF slides, videos and whole workbooks are not bundled or deployed. The inventory fixture is the scoped course-data extract used by the QA lessons.

## Next milestone

Review Chapter 15 before starting Chapter 16. Each chapter gets a usable preview and verification before moving on. Preserve the original teal/cream palette, clear emphasis, diagrams, visible calculations and concise summaries.
