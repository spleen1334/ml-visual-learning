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

### Source-fidelity revision: 21.1–21.3

- Rechecked pages 350–352 visually and the first three matching transcripts. Lesson 21.1 restores the opening description, four topics and all three goals. Lesson 21.2 restores the prominent definition, business/ML framing and all six source use cases. Lesson 21.3 restores the PCA introduction and all five original steps in order, with directional connectors.
- Preserve source wording rather than substitute generic summaries. Important definitions and the information-loss objective are emphasized. Keep the short qualifications about possible benefits and PCA’s simplified “best-fit lines” intuition separate from the source explanation. No invented data or additional illustrations were needed; later lessons remain unchanged.
- Follow-up user request: 21.3 adds a small conceptual graph showing six observations projected perpendicularly onto a first-component direction, then their positions on a new one-dimensional axis. This is an added teaching illustration, not the student dataset. The centered component coordinates have zero cross-covariance with perpendicular offsets, so the illustrated main direction is a principal direction. Equal geometric scaling and projection positions are preserved. Selective bold emphasis was added to the five step descriptions without changing their wording or order.

### Rebuilt example: 21.4

- Rechecked pages 353–355 and the full PCA Example transcript. The previous implementation omitted the component/projection diagrams and annotated scores, placed plots before input data, and prematurely named the components language/math.
- Restored the sequence: complete ten-student input table and four pairwise plots, source correlation explanation, two component-line plots with weighting annotation, combined original/component-score table, then the two source annotated positions. Three focused source graph crops preserve scales, axis labels, point locations, turquoise lines and orange annotations; slide navigation and mastheads are omitted.
- Keep the supplied scores unchanged and label the new columns Component 1/Component 2 here, reserving their interpretation for 21.5. No live PCA fit or score calculation is claimed. The brief calculation-boundary clarification is separate from the source walkthrough. Later lessons remain unchanged.
- User-requested table traces highlight Student 6’s Spelling 8.3 / Vocabulary 5.6 and Component 1 position 10.0 in teal, and Student 3’s Multiplication 2.8 / Geometry 1.6 and Component 2 position 3.2 in orange. Inline trace rows connect each pair through graph projection to its supplied position. These are visual input/output connections, not invented arithmetic or a claim that the source specifies the full score calculation.

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

## Rebuilt interpretation: 21.5

- Rechecked pages 356–357 and the full Interpreting Components transcript. Restored the source’s opening uncertainty about component meanings, definition of loadings and regression-coefficient analogy, then language followed by math interpretation.
- Each stage retains all ten students and seven columns, X₁–X₄ input labels, Y above the active component, source header colors, exact loading coefficients and highlighted dominant terms, and the adjacent source interpretation. The human-intuition warning remains explicit. A separate clarification distinguishes student component scores from loadings and records the unspecified score transformation rather than claiming exact recalculation.

## Rebuilt scree walkthrough: 21.6

- Rechecked pages 358–360 and the Scree Plots transcript. Restored the source scree plot with elbow annotation, complete ten-student original/component-score table, reduced Student ID/Language/Math table and original clustering illustration. Preserve the transition from component retention to downstream predictive modeling, classification or clustering.
- Source graph crops retain axes, colors and annotations rather than approximate bar values. The elbow remains a heuristic and the outlined groups illustrate possible interpretations, not a newly fitted clustering model. The reduced table and clustering view remain in 21.6, not duplicated in 21.5, per the user’s clarification.

## Advanced-technique review: 21.7

- Rechecked page 361 and the full matching transcript. All four listed methods were already present; restored the source’s linear-versus-nonlinear framing and specialization/complexity comparison. Corrected the abbreviated slide expansion of t-SNE to t-distributed stochastic neighbor embedding.
- Added a small original SVG illustration of a curved pattern opened into a straight representation. It is a conceptual aid, not fitted algorithm output or a universal description of every nonlinear method. Keep the UMAP/t-SNE speed comparison conditional on data/settings and distinguish interpretability from ability to visualize an embedding.

## Rebuilt recap: 21.8

- Rechecked page 362 and the matching transcript. Restored all three source statements in order (reducing columns, PCA’s new dimensions, human logic/intuition), with the original bold terms and italic supporting statements. The previous generic Reduce/Interpret/Continue cards omitted this source structure.
- Separate Common use cases, practical workflow and Note sections draw on earlier chapter guidance; they are additions rather than slide content. No quantitative visual or extra illustration was needed for this recap.

## Quiz answer key and boundaries

Source quiz order: (1) reduce number of columns → Columns (d); (2) not a general use → Time-series decomposition (d); (3) common technique → PCA (a); (4) fitted lines are → Components (b); (5) visual for choosing count → Scree plot (d); (6) interpret components with → Loadings (c). HTML shuffles questions and has no defined pass threshold or working per-question explanation text. If adapted, preserve question intent/order and add short grounded explanations.

PDF says dimensionality reduction can improve predictive power, reduce noise/overfitting, and remove multicollinearity. Frame these as possible benefits, not guarantees. The PCA intuition “best-fit lines” is simplified; the lesson is not a derivation of PCA math. Loadings are not importance guarantees and component names are interpretations. A scree elbow is a heuristic. Keep advanced method descriptions limited to the course’s names and relative specialization; do not introduce extra algorithms or invented examples.
