> Design update: use interactive experiments, explicit explanatory callouts and a summary at the bottom of every chapter. Do not build quizzes, prediction answer selectors, scoring, exit checks or completion gates. Source provenance belongs in documentation, not an “About this chapter” UI section. This supersedes assessment suggestions below.

# ML Visual Interactive — build plan

Date: 2026-10-16. Original plan below; implementation has started. Chapter 01 has been reviewed. Chapter 02 is available for user review in four subchapters. See [README.md](README.md) for startup and [previews/CHAPTER_01_REVIEW.md](previews/CHAPTER_01_REVIEW.md) for verification. Chapter 03 is committed as a short inventory orientation. Chapter 04 is implemented in six subchapters and ready for review. Chapter 05 is implemented in 19 source-aligned lessons and awaiting user review. Chapter 06 is implemented in its 15-lesson sequence and ready for review; Chapter 07 is implemented as a short visual Part 2 orientation; Chapters 08–10 remain outlines.

Build a small browser learning companion that follows the local course chapter order and lets the learner change data, predict what will happen, and explain the resulting charts. Start with chapters 01–05. Chapters 01–03 should be short orientation activities; most implementation effort belongs to Preliminary Data QA and Univariate Profiling.

The product should feel like an interactive illustrated lesson, with one clear question at a time, rather than a spreadsheet recreated in a browser. Preserve the course's intuitive, non-coding teaching intent while making the calculations inspectable.

## 1. Scope and starting point

The `ml-visual-interactive/` directory was empty at inspection. Local material includes:

| Chapter | Local subtitle files | Proposed role |
|---|---:|---|
| 01. Getting Started | 2 | Welcome, learning goals, how to use the companion |
| 02. Intro to the ML Landscape | 4 | Classify questions and understand the workflow |
| 03. PART 1 QA & Data Profiling | 1 | Introduce the analyst assignment and learning path |
| 04. Preliminary Data QA | 10 | Data inspection and repair workbench plus focused exercises |
| 05. Univariate Profiling | 19 | Distribution explorer and small statistics experiments |

There are also two local workbooks: `XLS Files/3. Maven_ML_Demos.xlsx` and `XLS Files/3. Maven_ML_Demos_COMPLETE.xlsx`. The relevant sheets are `Preliminary QA`, `Histograms`, and `Normal Distribution`. The later `Frequency Table` sheet should be mapped to its own course lesson before reuse; its name alone is insufficient justification for including it in chapter 05.

The first release covers these five chapters thoroughly. Keep later chapters visible as a roadmap, without empty lesson pages or implied completeness. Add one chapter at a time after the initial learning pattern works.

### Verified workbook facts

Inspection used ZIP/XML, including cached values, source cell types and formulas. These are observed file contents, not a claim that Excel was recalculated during the audit.

| Source | Verified content | Use |
|---|---|---|
| `Preliminary QA!B3:H103` | Header plus 100 product records: stock date, name, category, SKU, unit price, units sold, discount flag | Main QA case study |
| `Preliminary QA!F11,F19,F24,F25,F36,F53,F85,F98` | Eight missing prices represented as zero; formulas switch them to empty strings | Missing versus zero experiment |
| `Preliminary QA!B89:B103` | 15 May dates represented as text | Data representation versus meaning |
| `Preliminary QA!F34` | Blue Label Noodle Soup price 375; correction formula uses 3.75 | Investigate and resolve an outlier using supplied evidence |
| `Preliminary QA!D24,D29,D42,D71` | Missing comma, singular/plural mismatch, spelling error, trailing space | Category normalization |
| `Histograms!C3:C38` | 36 dice-sum slots; COMPLETE has `RANDBETWEEN(1,6)+RANDBETWEEN(1,6)` formulas | Sampling and expected frequencies |
| `Normal Distribution!B4:C5003` | 5,000 reference heights, stored with decimal precision | Reference distribution |
| `Normal Distribution!E4:F4970` | 4,967 athlete names and integer heights in cm | Athlete distribution |

Both workbooks currently have unresolved QA issues. `COMPLETE` does **not** mean the QA data is clean; its correction switches remain false. Treat raw input and applied transformations as separate explicit states.

Baseline QA mean price is 5.9144, with minimum 0 and maximum 375. Excluding the eight zero-coded missing values and applying the documented soup correction gives 92 observed prices, mean 2.3933695652173914, minimum 1.13, maximum 8.99. The ten intended category counts total 96 before correction and 100 after. Fixing the text dates changes the latest recognized date from 2020-04-28 to 2020-05-30.

Height reference mean is 161.82028495269967 cm; athlete mean is 170.02758204147372 cm. These are descriptive statistics of the supplied course datasets. The subtitle describes the reference values as rounded, but the actual cells contain decimals; preserve stored precision and round only the display. Independent provenance and representativeness of the reference sample have not been established, so label it “course reference sample.”

## 2. Learning experience

Use a repeatable lesson sequence:

1. **Question:** a real situation and one thing to work out.
2. **Predict:** a quick choice or estimate before the result appears.
3. **Explore:** change one control, edit a small value, or select observations.
4. **Explain:** show exactly what changed, with the relevant rows or calculation.
5. **Check:** one new example that tests the idea, followed by explanatory feedback.

Offer a guided path and a free exploration mode. A learner can always go back, reset a lesson, or reveal a hint. Avoid mandatory typing of statistical definitions, time pressure, scoring animations and arbitrary locks. Progress means an activity was attempted or its check completed; do not claim mastery from a page visit.

Use small editable examples for learning a calculation, then the workbook data for applying it. Put intuition and units before notation. A “Show the calculation” disclosure can expand into a worked numerical example and formula without making formulas the default reading experience.

### Chapter 01 — Getting Started

- A concise course map: prepare data → explore individual variables → explore relationships → model.
- A sample interaction: move one value in a five-value dataset and see its mean change. This previews how the companion teaches; it is not another full statistics lesson.
- Explain the learning goal: understand what a method does, when it helps, and how to interpret the output. Coding is optional and outside this release.

**Chapter summary:** the learner knows where to start and can reset an experiment.

### Chapter 02 — Intro to the ML Landscape

- **Which question are you asking?** Sort concrete prompts into category prediction, numerical prediction, grouping/pattern finding, or descriptive analysis. Examples follow the subtitles: customer churn, future sales, cross-selling and customer segments. Explain ambiguous cases rather than asserting that every business question has exactly one algorithm.
- **Prepare before predicting:** arrange QA, univariate profiling, multivariate profiling and modeling into a workflow. Clicking a stage reveals its question and typical output. Show that inspection and repair can repeat.
- **Does this need ML?** Compare a simple count or average with a many-feature prediction task. More complexity alone should not be taught as proof that ML is appropriate; consider the objective, useful data and a simple baseline.

**Chapter summary:** choose a sensible first analysis for a new question and explain why.

### Chapter 03 — Part 1 orientation

- Introduce the Maven Market role and the suspicious inventory.
- Explain a row, a variable, a record count and a unit of measurement through a small table.
- Give the next two chapters a shared purpose: make the inventory interpretable, then describe its variables.

**Chapter summary:** identify what one row represents. Keep this chapter brief.

### Chapter 04 — Preliminary Data QA

Build one `QAWorkbench` with several guided steps, reusing its table, issue selection, summary metrics and change history.

| Activity | Interaction | Learning outcome |
|---|---|---|
| Variable types | Assign meaning and storage type to SKU, date, price, category and discount flag | Numeric-looking identifiers are not quantities; a date-looking string may need parsing |
| Empty values | Toggle only the eight documented zero-coded missing prices between zero and missing | Zero is a value; missing is an unknown; show valid count beside the mean |
| Ranges | Click min/max/date metrics to highlight their source rows | An unusual value is a reason to investigate, not automatic permission to delete |
| Counts and categories | Select an unmatched category, expose whitespace, apply an explicit mapping | Counts depend on consistent categories; every record remains accounted for |
| Censoring and selection | Move an observation cutoff on a synthetic repeat-purchase timeline | Some outcomes are not observed yet; absence of an event is not proof it never occurs |
| Table structure | Toggle a small product-period table between long and wide, highlighting equivalent cells | Shape depends on the task; preserve identifiers and values when reshaping |
| Inventory case study | Identify issues before revealing hints, then apply or undo documented corrections | Combine checks and explain the resulting improvement |

The soup correction requires opening the provided confirmation that its price should be 3.75. The system should not infer a replacement purely because 375 is large. Likewise, do not turn every zero into null or automatically merge vaguely similar categories.

Show “Before / Current” metrics and an explicit list of changes. With all documented corrections applied, eight prices remain unknown: successfully handling missingness does not mean recovering the missing prices. Keep 100 records and show price coverage as 92/100.

Use a separate, clearly synthetic exercise for leading-zero identifiers if needed: the workbook's SKU-formatting lesson does not demonstrate actual lost leading digits. Do not invent corruption in the workbook.

**Chapter summary:** a short QA summary identifying what changed, why it changed, and what remains unknown.

### Chapter 05 — Univariate Profiling

Use four related labs, with direct lesson links matching the course's 19 subtitle topics.

| Lab | Topics and interaction | Check |
|---|---|---|
| Categories and bins | Nominal/ordinal sorting; inventory-category frequency table and bars; numeric prices converted to editable low/medium/high ranges | Explain why ordinal order matters and what binning discards |
| Dice and sampling | Add a manual sum, roll two fair dice, repeat 36 rolls, increase to 360 or 3,600; compare observed counts with expected counts at the current sample size | Explain why a noisy small sample does not prove loaded dice |
| Heights and shape | Switch reference/athlete/overlay; change bin width and bin origin; switch count/relative frequency/density; optional true KDE bandwidth; highlight selected bins in the data table | Compare center, spread and shape without confusing sample-size differences with density |
| Center and spread | Editable small dataset with mode(s), mean, median, percentile, variance, standard deviation and skew; move an extreme value and inspect each calculation | Choose useful summaries and explain sensitivity to an outlier |

Within the final lab, use a short progression: mode → mean → median → percentile → variance → standard deviation → skew. Keep each step focused. For variance, display deviations, squares, their sum and the divisor. For standard deviation, emphasize the return to the original measurement unit.

Add a small theoretical normal-distribution panel with mean and standard-deviation controls and 1/2/3-standard-deviation shading. Keep it visually distinct from an empirical dataset. A normal reference curve and real observations answer different questions.

**Chapter summary:** profile one variable using a distribution plus at least two appropriate statistics, and state one limitation. Add a transition to chapter 06 about relationships without implementing multivariate analysis yet.

## 3. Mathematical and teaching decisions

- Two fair dice have sums **2–12** with probabilities proportional to `1,2,3,4,5,6,5,4,3,2,1`. Never use a uniform integer from 2 to 12 to simulate their sum. Expected bin counts equal sample size times probability.
- Use a fixed random seed for a reproducible exercise; a visible “New sample” action changes it. Changing chart display must not silently reroll observations.
- The workbook's “kernel density” line follows histogram frequencies. Call that a **frequency polygon** if reproduced. A genuine KDE must use a kernel and bandwidth, and its y-axis must be density. Avoid a misleading curve on count bars unless scaling is explicitly coordinated.
- Use consistent bin edges; include underflow/overflow where relevant. State edge inclusivity in help text. An Excel-compatible validation mode can use Excel `FREQUENCY` upper-inclusive boundaries; the teaching UI must label continuous boundaries accurately, especially for decimal heights.
- Default variance and standard deviation to the sample definitions (`n−1`) to match the course explanation; provide a clearly labeled population option. Define behavior for empty input, one value and constant data.
- Choose and document a percentile interpolation method, such as inclusive linear interpolation. Distinguish a percentile threshold from the percentage strictly below a value, especially with ties.
- Display all tied modes. For all-unique data, explain the chosen “no useful mode” convention. Separate an exact-data mode from a histogram's modal bin.
- Explain skew as asymmetry; zero skew does not establish normality. If a skewness number is shown, name and test its estimator. Do not promise that mean/median/mode ordering holds for every distribution.
- The 68–95–99.7 rule applies to normal distributions. For actual sample heights, compute and show observed coverage rather than assigning theoretical percentages.
- The subtitle's exclusion of shoppers under 18 is a selection/truncation example, not ordinary left censoring. Teach this distinction alongside the source example. For left censoring, use a synthetic detection-limit example where observations remain present but only a bound is known. The repeat-purchase cutoff is suitable for illustrating right censoring.
- Treat visual bell-shape resemblance as exploratory evidence, not a formal normality result. An athlete/reference difference describes these supplied samples and does not establish a population-wide or causal claim.

## 4. Visual design

Choose a quiet editorial style: warm off-white background, dark readable text, restrained teal for the active sample, amber for suspected issues and a cool gray reference series. Use color together with labels and symbols. Keep clear whitespace and a small consistent type scale.

Desktop layout: narrow chapter navigation on the left, a readable lesson column and a large adjacent chart/workbench. Put the question immediately above the interaction and feedback immediately below it. On smaller screens, stack explanation, controls, visual and table; tables may scroll within their own container.

Reusable visual patterns:

- A compact chapter/lesson position indicator with previous/next controls.
- A chart with labeled axes, units, a useful annotation, optional data table and reset.
- Controls grouped by the question being explored, with current numeric values visible.
- A calculation disclosure and a source disclosure separate from the main lesson.
- Short transitions showing the consequence of a change; respect reduced-motion preferences.

All interactions need keyboard equivalents and visible focus. Never require dragging: sliders also have number inputs, and sortable activities also have buttons or selects. Tooltips must not be the only route to information. Screen readers need a concise chart summary and the underlying table.

The first visual review should compare one desktop and one mobile lesson before copying the layout across chapters. Do not begin with a large theme system or many decorative landing-page components.

## 5. Architecture

### Boundary and runtime

One local static web application. It reads checked-in, extracted teaching datasets and runs calculations in the browser. It stores only this learner's progress and preferences locally. No server, account service or runtime spreadsheet engine is needed for these chapters.

Recommended stack: React + TypeScript + Vite, CSS with a small token file, and SVG charts. Use focused D3 modules only where scales, ticks or path construction make chart code simpler. React owns rendering and interaction state; math stays in standalone functions. Vite supports a React/TypeScript starting template and static production builds; React's component/state approach supports a shared lesson shell. [Vite guide](https://vite.dev/guide/), [React guidance](https://react.dev/learn/thinking-in-react), [D3 overview](https://d3js.org/what-is-d3).

This is a proposed engineering choice, not a claim that React is intrinsically required. It gives the app explicit components and typed data while leaving most lesson authoring in ordinary content files. Check the local Node version and current compatibility when scaffolding, then lock dependencies.

```text
Local XLSX + subtitles (read-only)
        ↓ extraction and reviewed concept mapping
Versioned JSON datasets + source manifest + authored lessons
        ↓
Lesson shell → lab controls → pure calculations → SVG chart + data table
        ↓
Versioned local progress, preferences and optional saved experiment state
```

### Files and ownership

```text
ml-visual-interactive/
  BUILD_PLAN.md
  ALTERNATIVES.md
  src/
    app/                 navigation, shell, progress persistence
    components/          controls, chart frame, table, feedback, calculation view
    chapters/01-05/      lesson content, source references and lab configuration
    labs/                QA, table shape, censoring, distributions, statistics
    math/                pure statistics, bins, densities and seeded sampling
    data/                extracted JSON and source manifests
    styles/              tokens, layout, typography and component styles
  scripts/               repeatable extraction and dataset verification
  tests/                 mathematical fixtures, transformations and key browser flows
```

Interfaces:

- `Lesson`: stable ID, chapter, title, goal, explanation, lab ID/configuration, learning callout, summary and source references. Avoid building a generic CMS or lesson scripting language.
- `Dataset`: version, fields, units, immutable raw rows, missing-value representation and source metadata. Keep a raw cell's representation where the representation itself is the lesson.
- `ExperimentState`: seed, selected dataset, controls and explicit transformation choices. Derive charts and metrics from this state; do not keep separate mutable copies of the same calculation.
- `ProfileResult`: number of rows, valid/missing counts, statistics, bins and data warnings. A chart and its accessible table consume the same result.
- `Progress`: schema version, attempted/completed activity IDs and last location. Handle corrupt or unavailable browser storage gracefully. Add export/import only if real use shows it is needed.

Use hash routes or another static-host-compatible route strategy so a lesson can be bookmarked. Keep source videos and full transcripts outside the app. Link a lesson to the local source filename and cue timestamp where helpful; a browser cannot assume an absolute local video path will be openable.

### Data extraction

Create a small deterministic build-time extractor with an explicit sheet/range allowlist. Use Python's ZIP/XML support or a read-only workbook reader. Preserve cell types, source row IDs and the observed raw values. Handle shared formulas when validating the workbook; cached XML values alone do not prove correctness.

The generated manifest should record workbook filename and hash, sheet/range, dataset version, record count, units, extraction date and transformation decisions. Store the reviewed correction mapping as app data. Never overwrite either original workbook.

The app should ship only the local learning material needed for its labs. This plan assumes personal local use; public redistribution of course assets is a separate decision. Original explanations and clearly labeled synthetic examples should carry the teaching where exact course material is unnecessary.

### Reuse decision before a full build

Review `ALTERNATIVES.md`. CODAP deserves a short feasibility check because it supports educational tables/graphs, embedding and plugins. Try one inventory-inspection activity and one height histogram activity, then assess guided feedback, reversible corrections, keyboard use, source preservation and visual integration. [CODAP developer documentation](https://codap.concord.org/developers/).

If these activities meet the learning goals with little adaptation, use CODAP activities and a thin lesson guide. If implementing the core guided behavior requires substantial plugins or compromises the interaction design, proceed with the custom static app. Avoid maintaining both a general embedded explorer and a duplicate custom explorer in the first release.

## 6. Build sequence and acceptance gates

| Phase | Deliverable | Acceptance gate |
|---|---|---|
| 0. Confirm the reuse choice | Two small CODAP feasibility activities, or documented reasons they cannot meet the required flow | Choose one implementation direction |
| 1. Establish a trustworthy foundation | Source map, exact dataset extraction, statistics conventions, lesson shell and one QA screen | Counts and baseline metrics match source fixtures; desktop/mobile layout is readable |
| 2. Complete a vertical slice | Full missing-values → suspect price → category repair → summary flow | A learner can identify, apply, undo and explain changes; original data resets exactly |
| 3. Finish chapter 04 | Variable types, date representation, censoring/truncation distinctions, reshape exercise and final case-study check | All chapter concepts have a source link, interaction or explicit short explanation |
| 4. Build chapter 05 | Categories, dice, heights and center/spread labs with checks | Mathematical fixtures pass; labels and actual computation agree |
| 5. Connect chapters 01–03 | Brief orientation, landscape cards and part-one introduction; chapter navigation/progress | Continuous learning journey through all five chapters |
| 6. Review and package | Browser checks, responsive/keyboard review, source audit, README and production build | Every chapter summary is present, no misleading empty pages, reproducible local startup |

Start implementation with the QA vertical slice because it tests the hardest shared needs: authentic data, purposeful interaction, feedback, provenance and reversible state. Design the later distribution lab before overgeneralizing the shared components.

Keep each phase reviewable. A finished phase should be usable on its own. Do not build chapters 06–22, CSV upload, authentication, cloud sync, AI tutoring, a spreadsheet formula interpreter or a backend during this first release.

## 7. Verification

Numerical and transformation checks are central to this app: a visually polished but wrong chart teaches the wrong lesson.

- **Source fixtures:** 100 inventory rows; eight missing-price codes; 15 text dates; four category mismatches; 5,000 and 4,967 heights; the verified baseline/corrected metrics above. Check extraction determinism and original workbook hashes.
- **Math fixtures:** empty/singleton/constant data; odd/even medians; tied modes; percentiles at 0/50/100 and repeated values; sample versus population variance; bin-edge membership; density area approximately one; exact fair-dice probabilities.
- **State invariants:** transformations are reversible and idempotent; reset restores original data; every record belongs to exactly one applicable bin; category totals reconcile; changing display options does not change data or random samples.
- **Browser flows:** navigate to a direct lesson URL, read the chapter summary, repair and undo a QA issue, roll a seeded sample, change histogram controls, and use a lab entirely by keyboard. Test a narrow viewport and reduced motion.
- **Teaching review:** every interaction answers its stated question; hints explain the reason; examples distinguish fact from assumption; counts, units, population labels and missingness remain visible.
- **Completion checks:** typecheck, focused unit tests, production build and a short production-preview browser pass. Use Vitest for computation/state fixtures and Playwright for key browser flows. [Vitest guide](https://vitest.dev/guide/), [Playwright guide](https://playwright.dev/docs/intro).

Do not use screenshots alone as proof of numerical correctness, and do not use passing unit tests alone as proof of a usable lesson.

## 8. Definition of the first complete release

The learner can work through chapters 01–05 in order, inspect and repair the supplied inventory, experiment with categories and numerical distributions, explain the effect of outliers and missing values, and return to their saved position. Each interactive result is reproducible and mathematically checked. The interface works on a laptop and remains usable on a phone. Adding chapter 06 requires a new chapter module and appropriate lab extensions, without rewriting the shell.

The deliverable is a maintainable local learning app with a clear startup command, a production build, tested mathematical conventions, an inspectable data manifest and a small source map back to the course. No implementation or deployment is included in this planning pass.
