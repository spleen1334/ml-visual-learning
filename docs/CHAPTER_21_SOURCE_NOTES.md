# Chapter 21 — Dimensionality Reduction source notes

## Source map

Reviewed all eight numbered VTTs, quiz HTML, and PDF pages 350–362 (rendered and visually checked). Checked the workbook’s sheet names; it has no dimensionality-reduction/PCA worksheet. Workbook examples in other sheets do not apply to this chapter.

| Order | Source | PDF pages | Core content |
| ---: | --- | --- | --- |
| 1 | `1. Introduction.vtt` | 350 | Section aims: dimensionality-reduction use cases, PCA, advanced methods, takeaways. |
| 2 | `2. Dimensionality Reduction Basics.vtt` | 351 | Reduce columns while losing as little information as possible. Business uses: summarize item sales, survey responses, customer traits. ML uses: reduce redundant/noisy features, visualize clusters in fewer dimensions, reduce multicollinearity. |
| 3 | `3. Principle Component Analysis.vtt` | 352 | Five steps: select high-dimensional data; find components; interpret their weights on original variables; retain components explaining material variance; use retained components in later analysis. |
| 4 | `4. PCA Example.vtt` | 353–355 | Ten students, four scores; pair plots show spelling/vocabulary and multiplication/geometry relationships; components create reduced language/math dimensions. |
| 5 | `5. Interpreting Components.vtt` | 356–357 | Loadings help interpret components, like regression coefficients; interpretation requires human judgment. |
| 6 | `6. Scree Plots.vtt` | 358–360 | Scree chart and elbow; source retains two components; downstream analysis/clustering illustration. |
| 7 | `7. Advanced Techniques.vtt` | 361 | Kernel PCA, t-SNE, UMAP, self-organizing maps; nonlinear methods are more specialized and harder to interpret. |
| 8 | `8. KEY TAKEAWAYS Dimensionality Reduction.vtt` | 362 | Reduce columns, use PCA to create dimensions, interpret components with human judgment. |
| 9 | `9.15 QUIZ Dimensionality Reduction.html` | — | Six multiple-choice questions; source order and answer key below. |

## Exact student example

PDF p. 353 supplies four scores per student; keep the dataset, row order, four pair relationships, and n=10 intact:

| Student | Spelling | Vocabulary | Multiplication | Geometry |
| ---: | ---: | ---: | ---: | ---: |
| 1 | 1.8 | 2.1 | 5.4 | 5.6 |
| 2 | 2.9 | 3.1 | 6.6 | 5.7 |
| 3 | 4.6 | 5.7 | 2.8 | 1.6 |
| 4 | 8.0 | 7.1 | 3.5 | 3.4 |
| 5 | 8.1 | 8.0 | 1.3 | 2.2 |
| 6 | 8.3 | 5.6 | 7.0 | 9.1 |
| 7 | 4.4 | 4.2 | 9.1 | 7.3 |
| 8 | 7.2 | 6.3 | 8.1 | 7.8 |
| 9 | 4.2 | 5.1 | 9.9 | 9.3 |
| 10 | 8.7 | 10.3 | 8.2 | 8.7 |

Four source pair plots: Spelling (X) / Vocabulary (Y); Vocabulary (X) / Multiplication (Y); Spelling (X) / Multiplication (Y); Multiplication (X) / Geometry (Y). The first and last pairs are called correlated in the slide. p. 355 labels two source component-position examples: scores `(8.3, 5.6)` gives component 1 weight 10.0; `(2.8, 1.6)` gives component 2 weight 3.2. p. 356–357 provides the ten component scores (language, math), in student order: (2.8, 7.8), (4.3, 8.7), (7.3, 3.2), (10.7, 4.9), (11.4, 2.6), (10.0, 11.5), (6.1, 11.6), (9.6, 11.3), (6.6, 13.6), (13.5, 12.0).

The PDF gives language loadings `0.72, 0.69, -0.02, 0.03` for spelling, vocabulary, multiplication, geometry; math loadings `0.004, 0.001, 0.68, 0.72`. Treat “language” and “math” as human interpretations of the supplied loadings. The source does not explain score standardization, centering, scaling, or how these example component scores are calculated; do not imply the page’s displayed linear forms reproduce the scores exactly.

The source scree graphic (p. 358) displays seven bars and a cumulative curve: component 1 explains about 49%, component 2 about 40%, component 3 about 7%, then small contributions (roughly 2%, 1%, 1%, <1%). The first two reach about 89% cumulative and the source highlights the elbow after component 2. Values are read approximately from the chart; preserve its steep first-two / flattening remainder shape and two-component interpretation, not false precision.

## Quiz answer key and boundaries

Source quiz order: (1) reduce number of columns → Columns (d); (2) not a general use → Time-series decomposition (d); (3) common technique → PCA (a); (4) fitted lines are → Components (b); (5) visual for choosing count → Scree plot (d); (6) interpret components with → Loadings (c). HTML shuffles questions and has no defined pass threshold or working per-question explanation text. If adapted, preserve question intent/order and add short grounded explanations.

PDF says dimensionality reduction can improve predictive power, reduce noise/overfitting, and remove multicollinearity. Frame these as possible benefits, not guarantees. The PCA intuition “best-fit lines” is simplified; the lesson is not a derivation of PCA math. Loadings are not importance guarantees and component names are interpretations. A scree elbow is a heuristic. Keep advanced method descriptions limited to the course’s names and relative specialization; do not introduce extra algorithms or invented examples.
