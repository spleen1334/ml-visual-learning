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

- Lesson 18.10 preserves the existing three numbered visual blocks while restoring page 309’s three takeaways and supporting explanations: similar observations/distinct groups with business examples; K-Means and hierarchical clustering with multiple-model comparison and strengths/weaknesses; models do not interpret clusters, so use multivariate analysis and profiling. Transcript 10 supplies employee segments, repeated-run comparison, business relevance, and the explanation that each observation’s categorical cluster label can be used to group and summarize other metrics, including the clustering features. Page 309 was rendered and visually checked directly; desktop review, full project checks and diff whitespace checks passed.

- Lesson 18.1 follows page 284’s introduction → topics/goals → reminder structure. Topics remain Clustering Basics → K-Means → Hierarchical Clustering → Key Takeaways. Preserve all three goals: understand how the models work, explore the two common methods, and compare/contrast them. The transcript’s interchangeable terminology is stated separately; the reminder retains both the lack of a universal right answer/single optimization metric and the practical business-question objective. The former invented three-card learning path is not the source structure.
- Lesson 18.2 retains the approved scatterplot and group toggle. Its workflow includes page 287’s visible descriptions: Extract collects transactions, customer records, survey results and website pathing; Transform uses feature engineering to create interpretable dimensions for actionable recommendations; Model applies one or more models and chooses an appropriate cluster count using output and business context; Interpret uses multivariate profiling metrics and distributions, which the model does not interpret for the learner. The iterative modeling and assignment-versus-interpretation clarification come from `2. Clustering Basics.vtt` (01:21–01:58).
- Lesson 18.3 uses page 288’s simple “K-Means” title and definition (assign each observation to a specific cluster; K represents the number of clusters), with bold emphasis. Retain both source use cases: customer segments for targeted marketing campaigns, and store locations grouped by sales, ratings, size, etc. A compact terms strip explains centroid and mean before the unchanged six-view graph sequence. Starting centroids are chosen locations, not necessarily the means of assigned observations yet; the clarification preserves this distinction.
- The six graph views retain the exact step descriptions on pages 289–294: Step 1 chooses the number of clusters and arbitrary initial centers; Step 2 assigns observations to the closest center; Step 3 relocates centers to means and reassigns observations (two views); Step 4 repeats relocation until clusters no longer change (two views). The graph captions therefore use source step numbers 1, 2, 3, 3, 4, 4, not six invented algorithm steps. Numbered navigation selects graph views, with accessible labels distinguishing view and step.
- Lesson 18.4 follows pages 295–297 and the transcript: opening question about the “right” K → square and sum within-cluster distances for K=2 → rerun at additional K values → locate the elbow and interpret it as a guideline. Preserve the transcript’s practical five-versus-twenty customer-segment comparison. Both graphs use independent three-view playback: points/centroids → connecting distances → square-and-sum annotation; and K=2 result (~01:08) → additional K=3–8 results shown together (~01:29) → K=5 elbow annotation (~01:32–01:44). The video does not reveal the additional K values individually. No numeric WSS totals are invented; source graph scales and geometry remain unchanged. Manual navigation pauses playback, autoplay stops at the last view, and reduced motion opens both completed views.
- Lesson 18.5 preserves page 298’s three questions in order: more than two dimensions, cluster shape, and initial centroid location. Keep profiling guidance, the mostly-circular shape limitation and hierarchical alternative, and repeated random starts for a fixed K. The PDF says rerun “K times,” but the transcript says multiple times and illustrates repeated two-cluster solutions; use the transcript to avoid implying K specifies the number of starts. Compare WSS among those runs without claiming a global optimum.
- Lesson 18.7 restores pages 300–306 and transcript 7’s introduction, three-step closest-point/cluster procedure, dendrogram definition, and agglomerative/bottom-up versus divisive/top-down explanation. Complete scatterplot/dendrogram crops replace images that clipped the bottom leaf labels. The six views include the initial six singletons and five source merges, giving 6→5→4→3→2→1 clusters. Unmerged observations count as clusters; the gray complete tree is explicitly a preview, not information known in advance. Playback supports previous/play/pause/replay/next, pauses on manual stepping, stops at the final merge, and opens completed under reduced motion. Desktop browser checks verified all six loaded images, counts/order, end states, replay, manual pause and reduced-motion behavior without page overflow. Full project checks passed.

- Use “cluster”/“segment” as synonyms as the course does. A cluster contains observations similar to one another and distinct from observations in other groups.
- K-Means alternates nearest-centroid assignment and mean-centroid relocation. K is the number of requested clusters; it does not mean the number of iterations.
- WSS is the sum of **squared** distances from each point to its assigned centroid. The elbow is a visual rule of thumb, and K=5 is the course slide’s illustrative example, not a recommended default for other data.
- The case workbook calls its calculation “Total Distance” and the video calls it essentially WSS, but the worksheet actually sums the **unsquared Euclidean distances**. `AA36=SUM(L4:L53)`; each `L` cell is the minimum of three square-root Euclidean distances. This differs from the PDF’s squared-distance WSS definition. Keep the formal WSS explanation based on squared distances; if reproducing workbook round totals, label them as the worksheet’s total distance and document this source discrepancy rather than presenting them as mathematically exact WSS.
- K-Means shape guidance is approximate: course says it works best for circular clusters. Hierarchical clustering can be more useful for non-circular shapes, depending on linkage and data. Do not claim it always finds the “true” shape.
- The source’s supervised/unsupervised terminology and “no right/wrong” framing should not imply that clusters need no validation. State that usefulness and interpretation depend on the objective and profiling.
- Naming differs: the PDF case-study page spells the company **Pet Palz**; the video transcript says **Pet Pals**. Keep the discrepancy visible in source records; choose one consistent learner-facing spelling (video uses “Pet Pals”) and do not imply two businesses.

## Hierarchical lesson refinements

Lesson 18.9 follows page 308’s two visible FAQ questions: defining distance between clusters, then when to use hierarchical clustering over K-Means. A short linkage definition introduces the existing single/complete/average/centroid methods. The original crescent-and-circle comparison image is unchanged. Answers restore transcript 9’s recommendation to run both models, compare profiling metrics and relevance, and profile groups when high-dimensional shapes cannot be inspected directly. The source’s broad preference for hierarchical clustering is qualified by linkage and data. Desktop browser review and full project checks passed.

The requested “Reading the dendrogram” guidance is presented as three short numbered steps: find leaves, compare joining heights using p5/p6, and choose a business-relevant cut. The glossary and annotated source image remain separate. Desktop layout and full project checks passed after this readability change.

Lesson 18.7 now emphasizes agglomerative/bottom-up clustering and the dendrogram definition separately, while preserving its source graph sequence and playback. The shape comparison follows transcript 9: K-Means favors roughly circular groups; hierarchical clustering can help with non-circular groups, depending on data and linkage, rather than guaranteeing a better solution.

Lesson 18.8 opens with page 307/transcript 8’s exact question, “How do you know when to stop creating new clusters?” Its main visual is a readable crop of the annotated source dendrogram, retaining distance, height, clade, leaf and similarity annotations without slide navigation. A selectable glossary explains leaf, clade and similarity using p5/p6. The source uses “clade” for vertical split branches; the glossary clarifies the shared-group meaning. A brief qualification avoids interpreting same-clade similarity as a universal pairwise-distance guarantee. The p5/p6 early join, later join to the rest, and business-guided choice of grouping follow transcript 8 (00:51–02:09).

## K-Means workbook map and exact case details

### Lesson 18.6 worksheet-layout revision

The workbook XML (merged cells, styles, formulas and cached values), page 299 and case-study transcript were inspected for the revision. Customer inputs now have their own table, with a left starting-center marker (1/2/3 only on customers 2/21/36) and full-row cluster colors. All four rounds have separate distance tables and adjacent Cluster #1–#3 helper tables, each retaining all 50 rows. Source header groups are `F2:G2` (scaled values), `I2:M2` (round calculations), and `O2:P2`, `R2:S2`, `U2:V2` (clusters), repeated at rows 60, 118 and 176. Means from rows 55, 113, 171 and 229 appear directly below their helper columns. Source formatting includes dark round captions, source column names, blue/yellow/green closest-cluster cells, colored helper headers/member values/means, and one-decimal distance/helper values. Nonmember series cells appear blank: the workbook stores `#N/A` but hides it through conditional formatting. A customer-ID column is added to each distance table for traceability; spacer columns are omitted. Scaled inputs remain visible under “Scaled values (1–100).” The four-round graph selector is independent of the four calculation sections. A labeled conclusion preserves the segment profiles and tentative marketing actions without claiming optimal K, convergence after four rounds, or causal campaign effects.

Browser verification checked all four rounds: 50 rows in each distance/helper table, 50 input records, 50 plotted customers, correct counts, distance totals and mean coordinates. Contained scrolling keeps the full worksheet accessible. Sticky table headers were removed to avoid multirow-header bleed.

The standalone customer table also follows Excel’s dark merged scaled-values band with light text and a distinct column-label row. Starting-center fills are blue `#B4C6E7`, yellow `#FFE699` and green `#C6E0B4`, across the entire selected row. All six columns fit at a 1440px desktop viewport without horizontal scrolling; the full 50 rows remain vertically scrollable.

Requested display adaptation: unlike the source’s one-decimal distance/helper cells, all lesson customer coordinates, distances, helper values and means now display two decimals so copied values match visually across tables. Calculations still use full precision.

A requested visible “How round 1 works” footer traces customer 1 from the customer table’s scaled inputs to the three initial-center distances (31.96, 46.77, 86.76), MIN and cluster assignment, then the copied helper values and next-round means. It distinguishes cluster-center numbers from customer IDs and explains why only one helper table is populated for each row. Rounded arithmetic is explicitly approximate.

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
