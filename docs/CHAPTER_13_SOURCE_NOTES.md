# Chapter 13 — Regression Modeling 101: source notes

## Course sources and lesson order

I reviewed the eight numbered VTTs in `../13. Regression Modeling 101/`, pages 204–225 of `../Learning Files/3. Visual Guide to Machine Learning.pdf`, and the matching workbook tabs in `../Learning Files/3. Maven_ML_Demos_COMPLETE.xlsx`. The folder's `9.8 QUIZ Regression Modeling.html` is an assessment and is not published as a lesson.

| Order | Lesson | PDF pages | Main source material |
| --- | --- | --- | --- |
| 1 | Intro to Regression Modeling | 204 | Chapter scope: linear relationships, least squares, simple/multiple and nonlinear regression. |
| 2 | Linear Relationships | 205–208 | Constant slope, `y = α + βx`, positive/negative/curved/no relationship patterns. |
| 3 | Least Squared Error | 209–214 | Residuals and candidate lines; squared residuals summed as SSE. |
| 4 | Univariate Linear Regression | 215 | One numerical target from one independent variable: `y = α + βx + ε`. |
| 5 | CASE STUDY Univariate Linear Regression | 216 | Cone Zone temperature and ice-cream-cone-sales example. |
| 6 | Multiple Linear Regression | 217–221 | Multiple X variables, coefficients, 3D plane intuition, Airbnb price example. |
| 7 | Non-Linear Regression | 222–224 | Transform variables, including log-spend and log-population examples. |
| 8 | CASE STUDY Non-Linear Regression | 225 | Maven Marketing daily ad-spend/revenue comparison. |

## Key values and source boundaries

- The least-squares table has X/Y pairs `(10,10)`, `(20,25)`, `(30,20)`, `(35,30)`, `(40,40)`, `(50,15)`, `(60,40)`, `(65,30)`, `(70,50)`, `(80,40)`. Source candidate lines `y = 10 + 0.5x` and `y = 12 + 0.4x` have SSE 862.5 and 722 respectively.
- Cone Zone workbook sample (temperature °C → cones sold): `5→8`, `10→16`, `15→19`, `20→30`, `25→35`, `30→30`, `35→43`, `40→41`, `45→44`, `50→34`. Its fitted trendline is approximately `y = 10.867 + 0.6958x`; it is a small instructional sample, not operational forecast evidence.
- Airbnb training SSE values reduce from 226,577 to 224,259, 172,201 and 158,591 as predictors are added. This is in-sample fit only; it does not establish better generalization.
- The non-linear workbook has 1,000 daily ad-spend/revenue rows. Its cached linear and log-spend fits are approximately `342.4764 + 1.01014x` and `2.20752 + 99.59590 ln(x)`, with in-sample SSE roughly 668,423.62 and 383,219.78. The latter is still noisy rather than a perfect relationship.

## Corrections and uncertainties to preserve

- The least-squares table uses predicted minus actual while the narration sometimes says actual minus predicted. The app consistently labels residual as actual minus prediction; squaring makes the SSE unaffected.
- A lower training SSE after adding predictors does not prove a better model for new records. Do not repeat the source's loose “more accurate” wording without the held-out-data boundary.
- Transformations depend on the observed relationship and valid data (for example, positive values for a logarithm). A log transform does not handle every nonlinear pattern.
- Regression coefficients and historical ad spend/revenue patterns do not establish causal return on spend.

## Source-fidelity revision — 2026-10-22

The user requested the approved Chapters 9, 10 and revised 12 approach: reproduce working source explanations, with short framing rather than substitute examples or controls. Visually re-inspected pages 204–225; checked matching narration and workbook chart/formula definitions.

- Restore the four dense scatter patterns (206), perfect/noisy comparison (207–208), annotated equation (215), two views of the fitted plane (218), Airbnb source data/prediction excerpts (219/221), and both paired transformation examples (223/224).
- Airbnb excerpts are the complete visible slide examples, not the complete original Airbnb dataset. Source SSE values are supplied model results and cannot be recomputed from a truncated slide excerpt. Preserve the source model coefficients and flag held-out evaluation separately.
- Cone Zone worksheet has ten dated rows, a manual candidate starting at intercept 2 and slope 0.78 (SSE 773.25), separate fitted trendline `10.867 + 0.6958x`, and a 35°C forecast (35.22 cones). Preserve the separate manual candidate and fitted forecast instead of changing the forecast equation whenever the manual candidate changes.
- Maven Marketing contains all 1,000 dated records (2019-01-01 through 2021-09-26), natural-log spend and two prediction columns. Preserve the complete table, full scatter and two regression output blocks. Saved chart visibility is raw linear off, log-spend on. The former six-record chart and invented campaign-budget slider did not reproduce this worksheet.
- Slides 223–224 label formulae with `ln` but plotted transformed scales appear base-10 (spend about 1.2–2.4 and population about 3–6.5). Preserve original source graphs as conceptual before/after visuals; do not derive natural-log numeric substitutions from those axes. Workbook `LN` values and fitted coefficients use natural logarithms consistently. Changing logarithm base changes the coefficient scale, not whether the relationship becomes straight.
- The source's blanket wording that simple regression is rarely used is omitted; the lesson focuses on its definition and mechanics. The transformed models remain linear in their fitted coefficients; this is one approach to a nonlinear relationship, not a definition of every nonlinear regression model.

### Lesson 13.3 five-step correction

User requested the original 210–214 graph sequence instead of a record inspector. Use direct graph crops with selectable, progressively revealed full tables and the source five steps. Define residual as actual minus predicted (source tables use the opposite sign; SSE unchanged), explain non-cancellation, large-error weighting and smooth optimization, compare 862.5 with 722, and distinguish a better candidate from the global least-squares optimum. Autoplay stops after step five, manual navigation pauses it, replay restarts it, and reduced-motion opens the completed result.

### Lesson 13.5 worksheet layout correction

Re-inspected sheet13 cells B2:E13, G2:J4, M2:N3 and drawing11 anchors: main data at left, chart F4:U28, parameters/SSE and forecast above chart. Rebuilt as one shared worksheet surface with all ten rows, source defaults and four source chart toggles (including restored error lines). Candidate calculation helper table stays available in a disclosure below, corresponding to the worksheet’s out-of-view chart-source columns. Residual sign remains actual minus predicted, as in 13.3; squared values match.

### 13.5 requested line clarification

User requested manual line enabled by default and clearer fitted coefficients, SSE, forecast input and dynamic predictions. Manual fit starts visible (departure from saved workbook); fitted table/forecast remain initial selection. Explicit radio selection links table, forecast curve and new-day forecast to either manual or fitted model independently of visibility toggles. Manual values are orange; fitted values teal. Added y-hat/alpha/beta notation, fitted SSE 329.59 (using supplied rounded coefficients), and temperature hover/focus tooltip.

### 13.5 fitted coefficient toggle

Replaced the prediction radio selector with a compact “Use fitted α and β” toggle beside the parameter inputs. Starts manual; enabling applies 10.867 and 0.6958 to inputs, line, SSE, table and forecast; disabling restores prior manual edits. Inputs are disabled while fitted values are applied. Added the requested smallest-squared-error explanation beside the fitted equation. Browser checked application (14.346 / 35.22) and manual restoration after intercept edit to 4 (7.900 / 31.30). All 110 tests and build passed before the final copy-only sentence.
