# Chapter 14 review — Model Diagnostics

Reviewed after source audit and desktop browser verification. Sources: Chapter 14 VTTs, PDF pages 227–243, and the source-note record in [CHAPTER_14_SOURCE_NOTES.md](CHAPTER_14_SOURCE_NOTES.md). There is no matching workbook diagnostics tab.

| Check | Result |
| --- | --- |
| Lesson order and routing | Complete: all 11 non-quiz source lessons publish in order with stable direct links and navigation coverage. |
| Worked calculations | Complete: the source 10-row `y = 12 + 0.4x` example exposes SSE 722, TSS 1,450, R² 0.502, MSE 72.2, MAE 7.4, and MAPE 32.3%. A selected row shows both model and mean-only contributions. |
| Diagnostics distinctions | Complete: separates R² from prediction error, a whole-model F-test from a coefficient test, homoskedasticity from changing residual spread, and VIF from feature-to-target usefulness. |
| Interaction behavior | Complete: verified the R² record selector updates the visible calculation. Verified the VIF toggle removes the redundant private-room representation and changes entire-place VIF from 11.11 to 1.72. |
| Conceptual boundaries | Complete: calls out in-sample versus held-out performance, the limits of p-values and 0.05 / VIF-10 conventions, MAPE’s zero-value limitation, non-causal coefficients, and the fact that a residual fan alone does not diagnose a cause. |
| Desktop visual check | Complete: inspected the VIF lesson in the local production preview. The prominent definition, readable lesson hierarchy, visible checkbox state, and warm teal/cream layout render cleanly. Screenshot: `previews/chapter-14-vif.png`. |

## Remaining boundary

The VIF auxiliary-R² values and residual plots are deliberately small illustrative examples because the provided workbook has no Chapter 14 diagnostic output. The real course’s 10-row R²/error arithmetic and its Airbnb interpretation are retained and clearly bounded.


## Source fidelity revision — 2026-10-23

- Inspected rendered PDF pages 227–243. Replaced invented examples and controls with ten direct source crops, preserving complete tables, graphs, output and calculation order. Kept definitions in selectable HTML and removed repetitive summary panels.
- Reviewed p-value/normality/generalization wording and retained brief mathematical corrections rather than copying misleading source statements.
- Validation: 20 test files / 110 tests passed; TypeScript and production build passed; git diff --check passed.
- Browser: visually checked desktop R² and VIF lessons at 1280px, confirming source graph/table layout, calculation flow, full before/after VIF output and frequency table. Other lessons were source/crop reviewed but not individually browser checked. Initial browser daemon restarts were resolved by running the navigation and capture in one shell.


## Purpose and visual support — 2026-10-23

Added a compact why/when section for each diagnostic concept and separate MSE, MAE, MAPE guidance beside each worked example. Added a baseline-versus-regression diagram to the null-hypothesis explanation, annotated actual output to F-significance, and a source frequency-table crop to multicollinearity. Preserved existing source graphs/calculations. Recorded the requested purpose-section convention in AGENTS.md and LEARNING_STYLE.md.

Validation: 110 tests, TypeScript, production build and diff whitespace checks pass. Desktop browser screenshots inspected for null hypothesis, multicollinearity and error metrics. All three metric images loaded, three distinct purpose sections were present, and no horizontal document overflow was detected. Other lesson changes received code review rather than individual browser captures.


## R² reference points — 2026-10-23

Added a user-requested visual example before the existing worked calculation: identical-width stacked bars at R² 0, 0.5, 0.9 and 1 show explained variation versus remaining squared error relative to the mean-only baseline. A simple delivery-time/distance scenario supplies context; it is explicitly illustrative, with no claimed fitted data or universal quality thresholds. Linked 0.5 to the original 0.502 example and retained the requested header wording. Why/when guidance now connects directly to the scenario.

Validation: 110 tests and production build pass. Inspected the desktop browser capture of the complete revised lesson; bars, percentage labels, explanations and original source calculation are visible without clipping.


## Source-first organization — 2026-10-23

Reorganized every diagnostics lesson so course definitions, original figures and complete worked calculations appear first. Added explanations now form a separate final section. In 14.4 all three original calculations precede the additional example and separate metric guidance. In 14.3 the existing source calculation precedes the reference bars; its cross-reference now says “above.” Added compact reference comparisons for whole-model tests, coefficient tests and VIF, plus a clearly illustrative single-record delivery-error comparison. Retained the null diagram, paired scatterplots and source frequency-table example.

Validation: 110 tests and production build pass. Browser-checked all ten content lessons (14.2–14.11): final additional-explanation section present, all source images loaded, no horizontal document overflow. Captured R², error metrics and VIF for desktop review.


## Explicit average baseline — 2026-10-23

Expanded the illustrative delivery example: actual 10/20/30 minutes; average-only predictions 20/20/20; distance-based predictions 12/19/29. A visible table connects the records to baseline SSE 200, model SSE 6 and R² 0.97. MAE 4/3 ≈ 1.33 minutes answers the separate question of absolute miss size without a mean-only baseline. These invented demonstration predictions remain explicitly illustrative. Original course content stays above the added example. Validation: 110 tests and build pass; inspected browser screenshot of the expanded table and calculation panels.


## Concrete-example pass across the remaining lessons — 2026-10-23

Preserved approved 14.3 and all original course visuals/calculations. Replaced generic bottom reference cards with context, tables, visible calculations and concrete interpretations in the remaining lessons. Added metric-contribution bars, residual-range diagrams, p-value comparison scales and actual VIF before/after bars. Kept inputs, observed outcomes and model predictions distinct.

Review findings resolved: explicitly labelled supplied F-test p-values; distinguished illustrative rules from fitted models; retained the source coefficient uncertainty; identified exact versus approximate redundancy; separated VIF and regression predictor sets in the recap. Checked all new arithmetic independently. No new controls or routing changes.

Validation: 20 test files / 110 tests pass, TypeScript and production build pass. Browser-loaded every changed lesson (14.1, 14.2, 14.4–14.11): added explanation remains last, original images load, no document overflow. Inspected a desktop contact sheet of every changed lesson and full-size residual/p-value diagrams. Screenshot artifacts are in previews/chapter-14.*-concrete.png.


## Why/when wording aligned to PDF — 2026-10-23

Compared every why/when block against PDF pages 227–243. Shortened the wording and restored the source’s practical choices: MSE for important extremes, MAE for less outlier influence, MAPE for an intuitive percentage scale; consider all three. F-test guidance checks the whole model before coefficients; VIF guidance follows remove/refit/recalculate. Retained brief corrections for p-value interpretation, causality, and zero-value MAPE limits in the existing nearby notes. Examples and original visuals are preserved.


## Final user-guided refinements — 2026-10-23

Added inline technical-term reminders, a compact 14.8 definition refresher, practical interpretations of coefficient tests, and the approved 14.6 raster illustration. Simplified 14.6–14.7 wording, explained the F-test output and cutoff, added the multicollinearity conclusion, and kept 14.10’s added explanation within the actual Airbnb example. The 14.11 recap has 15 accessible source-image hotspots, residual/quartile interpretation, and a walkthrough verified against the lesson transcript. Browser titles include lesson numbers. Earlier-chapter retrofits remain deferred in todo.md.

Validation: latest code check passed 20 files / 110 tests, TypeScript and production build; diff whitespace check passes. Local browser checks confirmed recap tooltip content, 15 hotspot controls, and no document overflow. Earlier interaction checks exposed unreliable automated pointer targeting for inline pop-ups; DOM-triggered click handlers were confirmed, while a complete manual pointer pass remains a review boundary. Source crops and the selected illustration are project assets; intermediate review screenshots remain local.

Historical review note: screenshot paths under `previews/` refer to temporary evidence removed during repository cleanup. The written findings remain available here.
