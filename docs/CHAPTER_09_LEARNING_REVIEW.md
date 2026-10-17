# Chapter 09 learning review

Reviewed 2026-10-17. Scope: the current app as beginner educational material, without consulting course PDFs, subtitles, workbooks, source-reference documents, or earlier review reports. Recommendations only; no lesson implementation or instruction file was changed.

## Approved follow-up implemented

The four priority findings and three instruction refinements were implemented after user approval. KNN now uses equal metric scales, ticks and linked distance annotations; Bayes shows the six purchaser records and highlights the four newsletter subscribers; likelihood traces three actual rows through product and natural-log sum before comparing all twelve; sentiment shows the training-to-prediction pipeline, visible feature rows, manual-weight boundary and thresholded class. The broader optional recommendations below remain suggestions.

Verification: 58 tests, TypeScript/build and diff checks passed. Desktop browser checks covered KNN/Spotify, Bayes evidence, likelihood and sentiment. KNN K=4 produced the expected 2–2 tie; the flat model produced a three-row product of 0.125 and log sum −2.0794; sentiment N2 produced 31% positive / predicted Negative, with its separate Positive human label. The training table fits without horizontal scrolling. Screenshots: `previews/chapter9-approved-*.png`. Existing Vite bundle-size advisory remains. No commit or push was made.

## Overall assessment

The chapter already explains substantially more than formulas: concrete customer/email/review scenarios, prominent definitions, visible calculations, and careful distinctions between observed labels, predictions, neighborhood vote shares, and validated probabilities. Preserve these strengths. The highest-value work is to make a few missing links visible, rather than add examples everywhere.

## Must fix before considering the teaching complete

### 1. Make the KNN picture agree with its distance calculation — 9.2–9.4

**Current weakness:** the plotted axes have no numeric ticks, while the distance calculation uses exact coordinates. The shared customer plot renders one horizontal score unit at approximately 141 SVG units and one vertical score unit at 78 SVG units. The Spotify plot similarly uses 4.2 versus 1.8 SVG units per scaled feature unit. Consequently, apparent screen distance differs from the Euclidean distance used to rank neighbors. A beginner can look at the drawing and reasonably disagree with the ranking. The larger Spotify plot also leaves most of its area empty while points overlap in a small cluster.

**Improve:** use equal display distance per feature unit and add a few numeric ticks. Label the new customer's coordinates and connect one selected neighbor to the query with horizontal/vertical differences matching the worked square-root calculation. Retain the small dataset and vote controls. For 9.4, a clearly labeled zoomed view can reduce overlap while preserving the metric. Explain what musical “Key” represents and why the chosen numeric distance is only a teaching simplification; scaling a feature does not itself establish that its distances are meaningful.

**Gain:** learners can trace feature values → distance → selected neighbors → class vote, and see why scaling matters. Evidence: `ClassificationNeighborsBayes.tsx`, `Plot` and `CLCaseKNN`; desktop screenshots `previews/chapter9-learning-review-knn.png` and `previews/chapter9-learning-review-knn-case.png`.

### 2. Let learners verify where Bayes counts come from — 9.6–9.8

**Current weakness:** 9.6 announces 20 customer records but shows only aggregated frequencies. The actual customer rows exist in code and are never displayed. “Four records have both…” therefore cannot be checked in the lesson. Later lessons show excellent fractions and products, but their numerators are still supplied facts.

**Improve:** show a compact customer table or small labeled row-strip alongside the existing frequency table. For the newsletter/purchase example, highlight the six purchasers as the denominator and their four newsletter subscribers as the numerator. Use the same labels/colors for those cells and `4/6` in 9.7. Keep this evidence visible; no hidden calculation panel is needed. A short term strip in 9.5 can introduce **prior**, **likelihood**, and **normalized class score** with those same concrete quantities before the symbolic product.

**Gain:** observed input records visibly become model evidence; the learner understands the direction of `P(feature | class)` rather than memorizing fractions. Evidence: `CLNaiveBayesFrequencyTables`, `CLNaiveBayesConditionalProbability`, `CLCaseNaiveBayes`.

### 3. Bridge row probabilities to likelihood before the logarithm — 9.19

**Current weakness:** two helpful row examples are followed by a twelve-row summed log-likelihood, `−6.489`. The remaining contributions and the numeric connection from multiplication to the displayed sum are absent. The “higher is better” explanation is correct, but the headline result is effectively a black box for a beginner unfamiliar with logs. Both supplied curves are comparisons, not a demonstration of fitted coefficients being learned.

**Improve:** first keep a three-row calculation visible: `p`, `1−p`, `p` → product of those three observed-outcome probabilities. Show the equivalent `log(a)+log(b)+log(c)` beside it, explaining that logarithms preserve the ordering while replacing a tiny product with a manageable sum. Then label the current twelve-row result as the full-data extension. Show flat and rising scores together so “higher” can be compared without remembering the previous screen; describe fitting as searching coefficient values using this objective.

**Gain:** learners see what training optimizes and why the computer uses the log form. Evidence: `LogisticLikelihood`; desktop screenshot `previews/chapter9-learning-review-likelihood.png`.

### 4. Restore the training link in the sentiment case study — 9.25

**Current weakness:** the pipeline is **Prepare → Represent → Label → Predict → Evaluate**. There is no train/fit step. Four rows are titled “Training reviews,” but predictions use manually assigned weights that are unrelated to those rows; the negative weight for `not` is especially unexplained because it appears in none of them. The “illustrative weights” label is honest, yet the arrangement can still teach that labels or a word list directly produce a classifier.

**Improve:** show **labeled training features → fit model → learned weights → unseen text features → prediction → compare human label**. The current weights may remain illustrative, but state adjacent to the training table that they were manually supplied and were not learned from those four rows. Add the selected review's binary feature row beneath the text so 9.24 visibly feeds 9.25. Display an explicit predicted class and its threshold alongside the probability. Keep human-label comparison visible or simple to reveal, with no quiz or scoring.

**Gain:** the learner understands what data training consumes, what fitting produces, and what prediction consumes. Evidence: `CLSentimentCaseStudy`; desktop screenshot `previews/chapter9-learning-review-sentiment.png`.

## Optional improvements, ordered by value

1. **9.17 — connect errors to emails.** The threshold changes aggregate false-positive/false-negative counts, but observed dots retain only true-label colors. Highlight the emails that cross the decision boundary and place them in a compact observed-versus-predicted 2×2 table. Keep the concrete cost descriptions. This explains *which* records caused the changed counts without another dataset.
2. **9.10–9.11 — add intuition for the unfamiliar log/bit notation.** The class-balance control, weighted branch sizes, and gain calculation already work well. Add one short “50/50 is hardest to guess; all one class has no label uncertainty” visual using the same 20 labels, and define a bit as the unit of this uncertainty measure. In 9.11, connect the parent to its children with arrows; the calculation should visually read as a split rather than adjacent cards.
3. **9.13 — show why tree diversity helps, not only vote counts.** Add one compact diagram of the same labeled training table feeding two different sampled row/feature sets, then different trees and their votes. Explain sampling with replacement in ordinary language. The current slider correctly changes the number of hand-written votes, but the winner stays Churn at every offered setting; more vote settings are less valuable than showing where differing trees come from.
4. **9.14 — finish the case with one new traveler.** The eight-row input table and candidate-split arithmetic are strong. After comparing gains, show the chosen first split, a clearly stated stopping choice, and one unseen customer's branch/majority-class prediction. This completes input → training choice → output for the case without requiring a large fitted tree.
5. **9.1, 9.22–9.24 — make targeted text/visual refinements.** In 9.1, replace some method-card prose with tiny mechanism sketches, keeping sentiment explicitly labeled an application. In 9.22, add a concrete benefit such as grouping negative feedback for human review, and give one new review's output. In 9.23, label the punctuation control accurately: it removes selected punctuation while preserving apostrophes in contractions. Briefly define stop words and stemming/lemmatization where first named. In 9.24, use “a numeric classifier needs a numeric representation of text” instead of the broad “a classifier cannot use a sentence”; distinguish the binary example's lost repetition counts from ordinary count-based bag of words.

## Coverage and what should be retained

All 25 sections were inspected in the current TypeScript implementation, using the live manifest for numbering. The table records the teaching assessment; a section without a must-fix does not automatically need extra content.

| Sections | Assessment |
| --- | --- |
| 9.1 | Clear model/application distinction and decision scenarios; optional mechanism sketches. |
| 9.2–9.4 | Good small example, visible distance arithmetic, changing K and vote-share caveats; repair visual metric and coordinate traceability. |
| 9.5–9.8 | Strong denominator explanations, class-score products, normalization and independence caveats; expose source records and briefly key the new terms. |
| 9.9 | Directional tree diagram, root/decision/leaf labels and prediction purpose work well. Shorten the long source-provenance paragraph into “illustrative rules” plus “how to follow a path” notes for learners. |
| 9.10–9.12 | Class balance, weighted gain and customer-specific prediction routes are useful; optional notation intuition and split connectors. Preserve training/prediction distinction. |
| 9.13–9.14 | Honest illustrative votes and compact training rows; optional randomness illustration and completed case prediction. |
| 9.15–9.18 | Good S-curve, probability/label/threshold distinction, concrete mistake costs, and visible score-to-sigmoid calculation. Optional record-level error tracing in 9.17. |
| 9.19 | Useful observed-label contribution examples; add the missing product/log bridge. |
| 9.20–9.21 | Clear feature contributions, fixed-versus-changing inputs, case goal, coefficients and noncausal interpretation. Existing numeric examples are sufficient. |
| 9.22–9.24 | Clear text/label roles, reversible cleaning and word-presence table; optional purpose/terminology refinements. |
| 9.25 | Good unseen-review examples and negation failure demonstration; restore the model-fitting link. |

Definitions were prominent and readable in the desktop layouts inspected. Supporting material generally uses short labeled blocks and restrained emphasis. Avoid a blanket typography redesign or more decorative images: the useful visual additions here explain distance, counts, training, and error attribution. Some introductions place several prose blocks before the first concrete visual; shortening duplicate scenario/caution sentences would bring the demonstration forward while retaining one concise interpretation caveat beside its output.

## Verification boundaries

- Reviewed current Chapter 9 component source, chart construction, and course manifest. Did not assess course fidelity or read any prohibited course/reference materials.
- Inspected fresh 1440×1000 browser screenshots for 9.1, 9.2, 9.4, 9.8, 9.19 and 9.25 using the existing `http://127.0.0.1:4173` preview. Other sections received source-based pedagogical inspection, not exhaustive desktop visual QA.
- Browser interaction confirmed 9.3 moves from K=3 to K=4 and displays a tied vote. A Bayes feature button was exercised; the subsequent batch did not complete, so no broader interaction regression claim is made.
- This is a teaching review, not an exhaustive mathematical, accessibility, mobile, or runtime audit. No implementation tests were required because no implementation changed. Existing uncommitted work was preserved.

## Final review: proposed AGENTS.md refinements

The current instructions already cover prominent definitions, small examples, practical usefulness, visible calculations, control explanations, and no quizzes. Keep those rules; avoid adding duplicate versions. Three focused refinements would address the recurring gaps found here:

1. **Extend the existing visible-calculation rule:** “For a worked result, let learners trace representative source records or feature values into the intermediate calculation and final output. Introduce unfamiliar notation before using an aggregate score.” This prevents supplied counts and unexplained totals from looking like worked examples when their data-to-number link is still missing (9.6–9.8, 9.19).
2. **Add a model-demonstration distinction:** “Clearly distinguish hand-chosen rules/weights, supplied fitted models, and models actually trained in the demonstration. When a workflow claims to train a model, show the labeled inputs, fitting step, resulting rules/parameters, and separate prediction inputs.” This prevents an honest illustrative disclaimer from carrying the whole burden of explaining where a model came from (9.16, 9.19, 9.25). It does not require implementing live training for every lesson.
3. **Extend visual verification beyond layout:** “Check that a visual encodes the quantity being taught: distance-based charts need a faithful metric, readable scales, and identifiable input values; interactive counts or scores should identify the records or contributions that changed.” This prevents attractive diagrams from obscuring the actual mathematics or disconnecting controls from their evidence (9.2–9.4, 9.17).

These are proposed instruction changes only. `AGENTS.md` remains unchanged by this review.
