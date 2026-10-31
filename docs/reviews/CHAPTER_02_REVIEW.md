# Chapter 02 — The ML Landscape

Status: ready for user review; Chapter 03 remains unimplemented. Primary target is desktop, per user direction.

## Open the chapter

Production preview: http://127.0.0.1:4173/#chapter-02/what-is-ml

Four subchapters follow the four local subtitle lessons. They have direct links, sidebar entries and Previous/Next navigation. Chapter 01 remains one page. No quizzes, scoring, completion gates or About sections were added.

## What to try

1. **Questions:** select each business question to switch the explanation and illustrative chart.
2. **Fit:** change the held-out February observation from 58 to 46. The average forecast remains 46.2 and fitted trend forecast 56.4; absolute misses become 0.2 and 10.4. Reset returns to 58. A single holdout is explicitly a demonstration rather than evidence of reliable future performance.
3. **Process:** switch QA, individual-variable, relationship and model stages. The six-row synthetic dataset is reused throughout. November's missing promotion spend stays unknown; sales histogram counts are 3, 2 and 1, and paired analysis uses five rows.
4. **Landscape:** explore the supervised/unsupervised branch diagram and four method-family illustrations. Application areas and learning setups are distinguished in the wider-topic panel.

All datasets are synthetic teaching examples. No workbook dataset, PDF slide or transcript is bundled. PDF pages 8–16 were rendered and visually inspected; source and adaptation notes are in `docs/PDF_REFERENCES.md`.

## Verification

- `npm run check`: 17 tests pass, strict TypeScript and production build pass.
- `git diff --check`: clean.
- Desktop Chromium, 1440×1000: direct routes, sidebar, Next, browser Back, selected state, document title, focus on the main lesson and scroll-to-top verified; no horizontal page overflow on the inspected route.
- Question/family selectors update their pressed state, chart and explanation.
- Slider keyboard updates and number-field blur commit verified; held-out edits leave fitted forecasts unchanged.
- Source-derived histogram totals and complete-pair counts agree with numerical fixtures.
- Automated WCAG A/AA checks on inspected subchapters reported zero violations. SVG contrast requires manual inspection and is not covered conclusively by that automated result.
- Desktop screenshots inspected: question explorer, forecast comparison, workflow and method map. Phone polishing was stopped after the user clarified desktop priority.

Previews: `chapter-02-intro-desktop.png`, `chapter-02-forecast-desktop.png`, `chapter-02-workflow-desktop.png`, `chapter-02-landscape-desktop.png`.

Two lower-cost implementation agents authored lesson/data and CSS files. The orchestrator reviewed local references, integrated routes/navigation, checked calculations/tests, and performed browser review and corrections.

Deferred grouped table-of-contents idea is preserved in `todo.md`; it was not implemented.

## Forecast clarity revision

The forecast comparison now explains the sequence explicitly: make forecasts from earlier months, simulate the later observed result, then compare errors. The slider changes only the orange February actual-sales dot; both forecasts and the chart scale stay fixed. Two live error bars and scenario buttons for 46/58 make the contrast visible. Browser checks confirmed the closer forecast reverses between these scenarios (errors 0.2/10.4 versus 11.8/1.6). All 17 tests, TypeScript and production build pass.

## Definition, foundation and reading revision

The ML definition is now a prominent standalone panel under “What is machine learning?”. A separate major foundation section on the workflow page uses an iceberg graphic, “Garbage in, garbage out” and the course's rough 80%+ estimate. It explains missing values, unusable types and population coverage with emphasized examples.

Each workflow stage now uses three short labeled reading points instead of a dense paragraph: underlined headings, bold key terms and selective italic takeaways. Other Chapter 02 introductions and explanations also have clear lead-ins. Subchapter labels use 2.1–2.4, with stable existing route URLs. Desktop previews were refreshed and inspected; 17 tests, TypeScript and production build pass.

## Visual concept panels

Important statements now use 28–30px text in illustrated panels. The 2.1 definition has data/pattern/prediction illustrations; 2.2 has a major principle and three illustrated examples. Introductory text is 18px, and the 2.4 learning-family definitions are enlarged with key contrasts emphasized. Desktop verification confirmed the intended font sizes and no overflow on the inspected page. The pattern is recorded in `docs/LEARNING_STYLE.md` for future chapters.

### Expanded method map
- Rebuilt 2.4 around the visible lists and hierarchy on PDF page 16: classification, regression, unsupervised topics, and further methods.
- Kept the interactive family explanations and separate Beyond the Foundation cards; added named advanced examples including Q-learning, Deep RL, latent semantic analysis, and convolutional neural networks.
- Desktop screenshot refreshed and visually checked; all 17 tests, TypeScript, production build, and diff whitespace checks pass.
