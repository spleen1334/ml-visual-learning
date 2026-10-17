# Chapter 08 review

Open http://127.0.0.1:4173/#chapter-08

## Implemented

All eight source lessons, in their existing sidebar order:
1. Supervised vs. Unsupervised Learning — switch known labels on/off.
2. Classification vs. Regression — change the target type.
3. RECAP Key Concepts — choose a foundation to see its example.
4. Classification 101 — toggle features in a churn prediction setup.
5. Classification Workflow — choose a stage to inspect task, tools, and output.
6. Feature Engineering — six transformations, highlighted source columns, visible row-one calculations, optional source fields.
7. Data Splitting — 20 records assigned to 14 training, 4 validation, and 2 test; highlight each role.
8. Overfitting — three schematic boundaries, 20 training cases, 8 optional unseen cases, and a four-step evaluation workflow.

Every lesson starts with a prominent definition and ends with a summary. No quizzes or gates. Chapters 09–10 remain outlines.

## Verified

- `rtk npm run check`: 49 tests in 10 files pass; strict TypeScript and production build pass.
- Direct routes for all eight lessons; manifest sequence ends at 8.8.
- Desktop browser inspection at 1440 × 1000: definition layouts, feature controls and visible calculation, and overfitting graph. Screenshots are alongside this note.
- Browser DOM-event checks: removing labels removes all four target cells; numerical target switches; conditioning counts reconcile to 3 total / 2 Chrome / 2 purchases; disabling Plan removes it from the shown features.
- Workflow selection updates task/tools/output; scaling shows the row-one result 0.250; test highlight selects two records; unseen points toggle from eight to zero and back; final project step shows the final held-out evaluation.
- No browser runtime errors reported.

The installed browser CLI repeatedly restarted its daemon and its pointer click commands did not reliably dispatch events. Interaction checks therefore used DOM click events in the real browser; native pointer/keyboard behavior has not been independently established in this pass.

The existing Vite bundle-size advisory remains; it is not a build failure.

## Source and teaching choices

See `docs/CHAPTER_08_SOURCES.md`. The course’s training/test split is expanded to show validation separately. The 70/20/10 split is a teaching example, not a prescribed ratio. Leakage and fitting preprocessing on training data are clarified. Overfitting curves are explanatory schematics, with explicit class sides and an exceptional training observation; there is no fitted classifier or invented accuracy metric.

## Key-terms follow-up

Lesson 8.4 now has an always-visible glossary, grouped X/y customer table, feature-against-feature scatter plot with class colors, and observed y versus predicted ŷ distinction. Desktop 1440 × 1100 visually inspected (`chapter8-key-terms.png`). All 49 tests, TypeScript, production build, and diff checks pass. No new interaction logic was added.

## Data-splitting pie chart

Added a pie chart to 8.7 with derived 70/20/10 percentages, counts, and split colors. Existing highlight controls emphasize the matching slice and record tiles. Desktop screenshot `chapter8-split-pie.png` inspected; Test selection highlights the 10% slice and two records. All 49 tests, build and diff check pass.

## Lessons 8.1 and 8.2 explanation follow-up

8.1 now shows separate supervised purchase-prediction and unsupervised activity-grouping examples with six customer rows, explicit input/goal/output, and a labeled scatter plot. The grouping is illustrative; no algorithm is fitted or purchase label inferred from a cluster. This replaces the prior label-column toggle. 8.2 adds category/quantity comparisons, numeric-label and probability clarifications, and question/purpose text that follows the existing target toggle. Both desktop layouts inspected; target toggle updates output and purpose. Final `npm run check`: 49 tests, TypeScript, build pass. No runtime errors reported. Screenshots: `chapter8-learning-examples.png`, `chapter8-target-types.png`.
