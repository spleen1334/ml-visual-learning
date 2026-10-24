# Chapter 18 — Clustering & Segmentation source notes

## Source map and order

Reviewed all ten VTTs, the quiz HTML, PDF pages 284–309 (rendered and visually inspected), and the `K-Means` sheet in `../Learning Files/3. Maven_ML_Demos_COMPLETE.xlsx`, including formulas, cached values, chart series and axes. No source material is modified.

| Order | Source | PDF pages | Source sequence and visuals |
| ---: | --- | --- | --- |
| 1 | `1. Introduction.vtt` | 284 | Section goals; course topics are clustering basics, K-Means, hierarchical clustering, and takeaways. It treats “clustering” and “segmentation” interchangeably. The banner warns that useful results answer the business question; there is no universal right answer or single optimization metric. |
| 2 | `2. Clustering Basics.vtt` | 285–287 | Defines groups of observations that are similar within a group and distinct from other groups. Begins with an unlabelled two-dimensional scatterplot, then motivates algorithms for data too wide to visualize directly. The closing diagram is a four-step workflow: Extract → Transform → Model → Interpret. |
| 3 | `3. Intro to K-Means.vtt` | 288–294 | K is the chosen number of clusters. Select initial centroids, assign each point to its nearest center, recompute centers as the means of assigned points, and repeat until assignments/centers stop changing. PDF shows the two-cluster teaching example in turquoise and amber across initialization, assignment, relocation and convergence. |
| 4 | `4. WSS & Elbow Plots.vtt` | 295–297 | Within-cluster sum of squares (WSS) squares each observation-to-own-centroid distance, then sums them. Run a range of K values and plot WSS; look for an elbow where another cluster adds relatively little. The PDF plot compares K=2…8, becomes much flatter after K=5, and highlights K=5. It is a guideline, not a strict rule. |
| 5 | `5. K-Means FAQs.vtt` | 298 | K-Means works with more than two dimensions, though profiling is needed when plots cannot show all dimensions. It is best suited to roughly circular clusters. Starting-centroid locations can matter; rerun a fixed K with random starts and compare WSS. |
| 6 | `6. CASE STUDY K-Means.vtt` | 299 plus workbook | Pet Pals is an ecommerce business selling custom 3D-printed pet models. Analyze customer-level promotional email opens per week versus total spend; identify segments and suggest marketing actions. The Excel walk-through uses 50 customers, rescales both inputs to 1–100, starts with three manually chosen centroids, makes four visible rounds, and interprets the groups. |
| 7 | `7. Intro to Hierarchical Clustering.vtt` | 300–306 | Introduces agglomerative/bottom-up clustering: repeatedly join the closest two points or clusters until one cluster remains. A six-point example labels leaves p1–p6 and traces joins beside a scatterplot and a dendrogram. The rendered pages show p5+p6 joining first (page 302, five groups), then p2+p3 (page 303, four groups), with p1 and p4 singletons. Subsequent joins give three clusters (p1+p2+p3, p4, p5+p6), two clusters, then one. |
| 8 | `8. Anatomy of a Dendrogram.vtt` | 307 | The horizontal leaves are observations; vertical height is the distance at which groups join. Source calls the vertical branches “clades” and leaf tips individual data points. A horizontal cut gives candidate clusters. The large p5+p6-to-rest branch signals greater dissimilarity than their early join. Let the business question guide the cut. |
| 9 | `9. Hierarchical Clustering FAQs.vtt` | 308 | Cluster distance is a linkage choice: closest minimum/maximum pairwise distance, lowest average pairwise distance, or centroid distance. Compare K-Means and hierarchical results with cluster profiles. Hierarchical methods can better capture non-circular shapes; use the source crescent-and-circle comparison. |
| 10 | `10. KEY TAKEAWAYS Clustering & Segmentation.vtt` | 309 | Clusters group similar observations distinct from other groups; common uses include customers, stores and employees. Compare methods, then profile and interpret assignments using the other data. The algorithm does not explain what a cluster means for the business. |
| 11 | `11.12 QUIZ Clustering & Segmentation.html` | No separate PDF page | Twelve multiple-choice questions; preserve this order, source intent and correct answers (see quiz map below). |

## Definitions and correction boundaries

- Use “cluster”/“segment” as synonyms as the course does. A cluster contains observations similar to one another and distinct from observations in other groups.
- K-Means alternates nearest-centroid assignment and mean-centroid relocation. K is the number of requested clusters; it does not mean the number of iterations.
- WSS is the sum of **squared** distances from each point to its assigned centroid. The elbow is a visual rule of thumb, and K=5 is the course slide’s illustrative example, not a recommended default for other data.
- The case workbook calls its calculation “Total Distance” and the video calls it essentially WSS, but the worksheet actually sums the **unsquared Euclidean distances**. `AA36=SUM(L4:L53)`; each `L` cell is the minimum of three square-root Euclidean distances. This differs from the PDF’s squared-distance WSS definition. Keep the formal WSS explanation based on squared distances; if reproducing workbook round totals, label them as the worksheet’s total distance and document this source discrepancy rather than presenting them as mathematically exact WSS.
- K-Means shape guidance is approximate: course says it works best for circular clusters. Hierarchical clustering can be more useful for non-circular shapes, depending on linkage and data. Do not claim it always finds the “true” shape.
- The source’s supervised/unsupervised terminology and “no right/wrong” framing should not imply that clusters need no validation. State that usefulness and interpretation depend on the objective and profiling.
- Naming differs: the PDF case-study page spells the company **Pet Palz**; the video transcript says **Pet Pals**. Keep the discrepancy visible in source records; choose one consistent learner-facing spelling (video uses “Pet Pals”) and do not imply two businesses.

## K-Means workbook map and exact case details

Workbook: `../Learning Files/3. Maven_ML_Demos_COMPLETE.xlsx`, sheet `K-Means`, used range `A1:DA229`. The walkthrough is a manual, inspectable Excel implementation, not a claim that a production model was trained. The sheet has 50 customer records, IDs 1–50 (`C4:C53`), average promotional email opens per week (`D4:D53`), and total amount spent (`E4:E53`).

- The two inputs have different scales. The worksheet maps each to 1–100 in `F4:F53` and `G4:G53` with `1 + (x − MIN(x)) * 99 / (MAX(x) − MIN(x))`; endpoints map to 1 and 100. Raw inputs are `D/E`; calculations and charts use scaled `F/G`.
- Initial K=3 centers are selected manually from spread-out rows marked in column B: customer 2 for Cluster 1 (100, 95.1034278259), customer 21 for Cluster 2 (42.3139534884, 48.7914838097), and customer 36 for Cluster 3 (1, 33.3385126320), in scaled email-opens / spend coordinates. The transcript explains these as high, middle and low email-open locations.
- The round block ranges are rows 4–53, 62–111, 120–169 and 178–227. Each has three centroid distances (I:K), minimum distance (L), closest-cluster assignment (M), and cluster-separated point series (O:V). The Euclidean distance formula is `sqrt((x−cx)^2 + (y−cy)^2)`. Centers are means of the assigned scaled points, using `AVERAGEIF` over each series.
- Means by cluster (scaled email opens, scaled spend):

| After round | Cluster 1 | Cluster 2 | Cluster 3 |
| ---: | --- | --- | --- |
| Initial centers | (100, 95.1034) | (42.3140, 48.7915) | (1, 33.3385) |
| 1 · row 55 | (68.6628, 93.1581) | (50.1950, 53.4799) | (10.3031, 42.3825) |
| 2 · row 113 | (62.8613, 91.0422) | (61.0140, 39.6731) | (13.4435, 47.3785) |
| 3 · row 171 | (61.1403, 88.3053) | (68.6163, 32.2945) | (14.9808, 47.6744) |
| 4 · row 229 | (61.1403, 88.3053) | (74.8023, 28.0036) | (17.0447, 47.9888) |

- Round counts for clusters 1/2/3: 9/26/15 → 14/15/21 → 16/11/23 → 16/9/25.
- Worksheet “Total Distance” values: 1,387.0954 → 1,025.1661 (−26.09%) → 895.3894 (−12.66%) → 850.1113 (−5.06%). The narration rounds these to 1,387 → 1,025 → 895 → 850 and 26% / 13% / 5% decreases. These are based on summed Euclidean distances, not squared WSS.
- Four scatter charts (`chart22`–`chart25`) use scaled email opens on X and scaled total spend on Y, both axes −20…120. First chart shows all 50 points, cluster-colored point series and the three initial-centroid markers; each later chart shows assigned series plus that round’s mean centroids. Keep axes tied to scaled values, not raw weekly opens or currency.
- Video interpretation of final groups: Cluster 1 (blue) opens emails frequently and spends a lot; Cluster 2 (yellow) opens frequently but spends little; Cluster 3 (green) opens few emails and has mixed spend. Suggested actions are alternative outreach for Cluster 3, test a discount/promotion for Cluster 2, and no change/test for Cluster 1. Treat these as hypotheses for the supplied case, not measured causal effects.
- Workbook caveat: case-study subtitle says choose K=3 and manually spread starting centers for a manageable spreadsheet walkthrough; the earlier methods lesson separately recommends testing multiple K values and repeated random starts. Preserve that distinction.

## Quiz order and key

The source HTML shuffles both questions and answers at runtime; the course lesson order is shown here. The embedded feedback is stored in `prompt.feedbacks`, while its explanation control reads `prompt.explanation`, so the source explanation UI reports no explanation. The HTML also reads a missing `pass_percent`; no passing threshold is specified.

| # | Question topic | Correct answer |
| ---: | --- | --- |
| 1 | What clustering is not designed to do | Describe what each cluster represents (people must profile/interpet it) |
| 2 | Meaning of K in K-Means | Number of clusters |
| 3 | K-Means fit metric | Within-cluster Sum of Squares (WSS) |
| 4 | When K-Means stops | Cluster centers stop moving |
| 5 | WSS plot rule of thumb | The elbow |
| 6 | K-Means cluster shape | Circular |
| 7 | Appropriate K-Means scenario | Segmenting customers |
| 8 | Hierarchical merges are based on | Distance |
| 9 | Visual for hierarchical output | Dendrogram |
| 10 | Meaning of dendrogram clade height | Distance between clusters |
| 11 | When hierarchical may be preferable | Clusters are not circular in shape |
| 12 | Practical clustering best practice | Apply multiple clustering models and compare results |

If adapting the quiz, use source feedback where provided and add short source-grounded explanations for every question. Preserve order and answers, explain that the WSS elbow is a guideline, and retain the source’s no-gating behavior.
