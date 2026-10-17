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
