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
