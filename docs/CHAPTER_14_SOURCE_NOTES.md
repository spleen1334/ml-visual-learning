# Chapter 14 — Model Diagnostics: source notes

## Course sources and lesson order

Reviewed all 11 numbered VTTs in `../14. Model Diagnostics/` and PDF pages 227–243 of `../Learning Files/3. Visual Guide to Machine Learning.pdf`. The matching Maven workbook contains no diagnostics sheet. The folder's `12.9 QUIZ Model Diagnostics.html` is an assessment and is intentionally not published.

| Order | Lesson | PDF pages | Main source material |
| --- | --- | --- | --- |
| 1 | Intro to Model Diagnostics | 227 | Scope: fit, error metrics, assumptions, statistical significance and VIF. |
| 2 | Sample Model Output | 228 | Regression-output blocks: equation, residuals, model summary and coefficients. |
| 3 | R-Squared | 229–230 | `R² = 1 − SSE / TSS`; adjusted R² penalizes extra predictors. |
| 4 | Mean Error Metrics | 231–235 | MSE, MAE and MAPE comparisons from the same residuals. |
| 5 | Homoskedasticity | 236 | Similar residual spread versus widening heteroskedastic scatter. |
| 6 | Null Hypothesis | 237 | Whole-model and coefficient-level reference claims. |
| 7 | F-Significance | 238 | Whole-model F-test p-value and a conventional 0.05 threshold. |
| 8 | T-Values & P-Values | 239 | Coefficient estimate divided by standard error; individual coefficient p-values. |
| 9 | Multicollinearity | 240 | Overlapping independent variables make coefficient interpretation unstable. |
| 10 | Variance Inflation Factor | 241–242 | `VIF = 1 / (1 − R² auxiliary)` for each predictor. |
| 11 | RECAP Sample Model Output | 243 | Read the diagnostics together before trusting an interpretation. |

## Exact worked values and adaptation boundaries

- The source's 10-row line `y = 12 + 0.4x` has SSE 722 and TSS 1,450, giving `R² = 0.502`. The same rows yield MSE 72.2, MAE 7.4, and MAPE 32.33%.
- MSE uses squared target units; MAE remains in target units; MAPE is undefined for an actual value of zero and can be unstable near zero. The app states these limitations rather than treating MAPE as universally appropriate.
- The source uses a 0.05 threshold and VIF > 10 as common rules of thumb. The app labels both as conventions or heuristics, not proofs of validity.
- The Airbnb examples include accommodates (+$5.71), entire place (about +$63), and a non-significant profile-photo feature. They are shown as illustrative fitted relationships, not causal effects.
- In the VIF example, `Entire.place` and `Private.room` overlap strongly. The source frequency table has no/no 816, no/yes 15,815, yes/no 13,166, and yes/yes 0. The app now reproduces the actual before/after VIF output and complete frequency table directly from the source. Entire.place VIF is 12.304416 and Private.room is 11.791492; after removing Private.room and refitting, Entire.place is 1.473047.
- R², F-tests, coefficient p-values, and a residual plot do not establish held-out predictive performance, causation, or universal model validity. A residual fan can be a reason to investigate but does not identify its cause by itself.

## Source fidelity revision — 2026-10-23

Visually inspected all pages 227–243 using rendered PNGs. Replaced synthetic residual plots, threshold slider, illustrative coefficient rows, hand-set auxiliary R²/VIF control, and generic output/recap cards. Source crops preserve actual output (228), full R² graph and ten-row table (230), all three complete error calculations (232–234), paired scatterplots (236), highlighted coefficient output (239), auxiliary-regression diagram (241), actual before/after VIF output (242), and annotated recap (243). Crops omit duplicated slide mastheads and navigation. Definitions remain selectable HTML.

Necessary corrections: p and 1−p are not probabilities that a model/coefficient is correct; constant variance does not require normality or establish generalization. Signed errors on error-metric slides use prediction minus actual; absolute/squared metrics are unaffected. Keep these corrections short beside the original examples.


The purpose clarification pass adds the page-242 room-type frequency table to multicollinearity and reuses page-243 annotated output for F-significance. The null-hypothesis diagram is a conceptual comparison of the intercept-only baseline and the existing Airbnb regression, with no invented fitted values. Individual why/when notes explain the decision each diagnostic supports.


Source-first organization: original explanations and calculation sequences precede the final added-reference section. New F-test p-values 0.01/0.20 and the delivery-time 8/10-minute comparison are explicitly illustrative, not source model outputs. Coefficient t-values and Entire.place VIF 12.30 → 1.47 remain drawn from the actual source output.


## Concrete examples across Chapter 14 — 2026-10-23

The user approved the explicit 14.3 delivery example and requested the same teaching approach for the other Chapter 14 lessons. Original content remains first. Added examples are below it:

- 14.1: input distance → predicted delivery time → observed time.
- 14.2: source accommodates coefficient 5.7166 interpreted for 2 → 3 guests, all other inputs fixed.
- 14.4: illustrative actual times 8/10/20, predictions 10/12/16; absolute misses 2/2/4, squared misses 4/4/16, percentages 25/20/20. MSE 8 min², MAE 2.67 min, MAPE 21.67%. Bars encode within-metric contributions.
- 14.5: schematic short/long-trip residual ranges ±2/±2 versus ±2/±6 minutes; no claimed observations or formal test.
- 14.6: illustrative average-only rule 20, zero-slope rule 20 + 0 × km, nonzero rule 8 + 2 × km. No claim of fitted coefficients.
- 14.7: supplied illustrative p-values 0.01 and 0.20 versus prechosen 0.05, on identical 0–0.25 scales; not computed from the small delivery tables.
- 14.8: actual accommodates and profile-photo estimate/SE/t/p rows and their conditional predicted-price interpretation.
- 14.9: illustrative redundant km/metres columns and equivalent rules; original Airbnb counts retained.
- 14.10: auxiliary R² 0/0.5/0.9 → VIF 1/2/10; perfect unit duplication has no finite VIF. Shared-scale bars preserve actual source Entire.place 12.304416 → 1.473047.
- 14.11: actual output interpretation table explicitly separates the regression summary from the VIF example with its different predictor set.

- 14.6 wording revision: return to page 237’s simple no-relationship / random-results framing and goal of rejecting H₀. Preserve its “model is garbage” phrase only as an explained metaphor; do not claim significance proves predictive accuracy. Remove the supplementary coefficient-equation table and use one brief delivery relationship example.

- 14.6: user-requested decorative raster illustration (`diagnostics-null-delivery.webp`) accompanies the added delivery example. AI-generated courier/route/evidence scene; it represents no dataset or statistical result.

- 14.7: explicitly show page 238’s requested wording (“the probability that the null hypothesis cannot be rejected”) as an attributed course phrase, with an immediate correction. Prominent definition: upper-tail probability of the observed or larger F-statistic under H₀. Reference: https://csrc.nist.gov/glossary/term/p_value . Smaller p gives stronger evidence against H₀; it is not a probability of a rejection decision or poor prediction.

- 14.7 output walkthrough: F=3543; numerator DF=6 tested slopes, residual DF=29,790; implies 29,797 fitted records including the intercept. Recover approximate F from reported rounded R²: (0.4164/6)/((1−0.4164)/29790) ≈3543. Explain the p-value as an upper-tail probability under H₀, and expand scientific notation.

- 14.7: added the common α=0.05 decision-rule subsection. Distinguish the 5% significance level and corresponding 95% confidence convention from the observed p-value or probability a model is correct. Statistical significance alone does not establish validity for prediction; retain unseen-data error and assumption checks.

- 14.10: keep the added reference entirely within the actual Airbnb room-type example. Removed kilometre/metre and synthetic auxiliary-R² reference examples. Explain the main price model versus the auxiliary input prediction, then show actual Entire.place VIF 12.304416 → 1.473047 after Private.room removal/refitting. Formula reminder also uses Airbnb.

- 14.11 transcript verified: `14. Model Diagnostics/11. RECAP Sample Model Output.vtt`, 00:12–03:33. Added walkthrough follows formula → residuals → intercept/coefficients → R²/adjusted R² → overall F-test → coefficient SE/t/p. Removed the “one story” table and separate VIF numbers from this walkthrough. Preserve corrections: intercept means all inputs zero, observed maximum residual is not a future-error bound, significance does not prove prediction accuracy.
