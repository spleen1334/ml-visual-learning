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
- In the VIF example, `Entire.place` and `Private.room` overlap strongly. The source frequency table has no/no 816, no/yes 15,815, yes/no 13,166, and yes/yes 0. The app uses a simplified, explicitly illustrative auxiliary-R² interaction to reveal the calculation; it does not claim those R² values were fitted from the workbook.
- R², F-tests, coefficient p-values, and a residual plot do not establish held-out predictive performance, causation, or universal model validity. A residual fan can be a reason to investigate but does not identify its cause by itself.
