# Chapter 13 review — Regression Modeling 101

Reviewed after the source audit, independent pedagogical review, redesign, and browser verification. Sources: the Chapter 13 VTTs, PDF pages 204–225, and the matching `Univariate Linear Regression` and `Non-Linear Regression` workbook tabs.

| Check | Result |
| --- | --- |
| Lesson order and routing | Complete: all eight non-quiz lessons publish in source order with direct links and sequence coverage. |
| 13.2 linear relationships | Rebuilt around a plotted taxi-fare line with visible intercept, rise/run, selected ride, valid positive-rate controls, and four compact pattern plots. |
| 13.3 least squares | Rebuilt with source candidate lines and SSE values (862.5 / 722), vertical residual connectors, linked selected record/table row, and an explicit explanation that the better total can worsen an individual record. |
| 13.4–13.5 simple regression | Split into a fitted-model concept lesson and complete Cone Zone exercise with source data, live manual coefficients/SSE, fitted-line reset, and separate new-temperature prediction. |
| 13.6 multiple regression | Rebuilt around two source Airbnb listings, traceable coefficient contributions, indicator values, a two-input plane, and supplied training-SSE comparison. |
| 13.7 transformation | Corrected: raw and log views now preserve the same source-record revenues and transform only the horizontal spend coordinate. A visible `spend → ln(spend)` mapping prevents the earlier false transformation. |
| 13.8 nonlinear case | Rebuilt from the 1,000-row workbook: raw/log equations, sample source records, residuals, training SSE, and a new-budget prediction control are all visible. |
| Conceptual boundaries | Distinguishes in-sample fit from held-out evaluation and predictive association from causality; explains that log transforms require suitable, positive data and are not universal. |
| Desktop and interactions | Complete: local browser review exercised candidate-line selection, linked residual display, Cone Zone fitted reset, nonlinear model switch, and campaign-budget prediction. |

## Remaining boundary

The workbook provides training fit for both nonlinear models, not a held-out evaluation. The app presents those scores as training SSE and leaves unseen-data evaluation as the next required step.

The preferred `agent-browser` workflow was unavailable because its installed skills directory was missing; Playwright CLI was used for the local browser fallback.
