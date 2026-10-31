# Chapter 09 — Classification Models: source notes

Source review: `../09. Classification Models/` (25 numbered VTT lessons) and `../Learning Files/3. Visual Guide to Machine Learning.pdf` (one-based PDF viewer pages). Workbook: `../Learning Files/3. Maven_ML_Demos_COMPLETE.xlsx`, sheet `Sentiment Analysis`. Sources were read as local references; the workbook was not changed.

## Lesson and PDF map

| Lessons | PDF pages | Source concepts and examples |
| --- | --- | --- |
| 1 | 97–98 | Common classification models predict categorical classes. The course names KNN, naïve Bayes, decision trees, random forests, logistic regression, and sentiment analysis. Distinguish categorical target y from numerical feature inputs X. |
| 2–4 | 99–105 | KNN assigns a new case from nearby labeled observations; example uses age (x), household income (y), purchase class, K and majority vote. Spotify case: 100 top songs, eight audio attributes, three outcomes (listen/skip/favorite), min-max scaling to 1–100, choose two features for a scatter plot, predict from the K nearest points. A showcased input has 13 listens among 20 neighbors (65% vote share). |
| 5–8 | 106–121 | Naïve Bayes combines class priors and feature likelihoods estimated from frequency tables/conditional probabilities. The slide/subtitle example uses newsletter, Facebook follow, website visit and purchase (10 records; 5 purchasers and 5 non-purchasers). The Cat Slacks workbook case uses the same three binary inputs and purchase target with a different 20-record dataset (6 purchasers and 14 non-purchasers). Lessons 9.5–9.7 reproduce the ten-customer PDF example; lesson 9.8 separately reproduces the twenty-customer workbook. Course calls the feature-independence assumption “naïve”; tiny case data is explanatory, not adequate evidence for production quality. |
| 9–14 | 122–134 | Decision trees apply sequential binary rules; split quality is discussed through entropy and information gain (churn examples). Random forests aggregate trees built with randomized observations/features. Trip Genie case predicts paid subscription from customer behavior; the workbook companion uses sessions, pull and follow behavior. Trees can overfit; depth/leaf constraints are hyperparameters. |
| 15–21 | 135–159 (p.160 is a section divider) | Logistic regression estimates probability for a binary target via an S-shaped logistic function; threshold turns probability into class. Email spam/recipient-count examples illustrate threshold tradeoffs, false positives and false negatives; the equation extends to multiple weighted features. Luxe Dining case uses weekly emails and unsubscribe. Workbook `Logistic Regression` contains 624 rows (C4:D627), 306 unsubscribes and 318 non-unsubscribes, with email frequency from 0.6 to 16.1 per week. Cached fitted coefficients are intercept −21.962 and slope 2.516 (worksheet cells I4 and I6); at 9 emails/week the model probability is 66.418%. These are fitted to manufactured course data, not causal evidence that email frequency changes unsubscribes. |
| 22–25 | 161–167 | Sentiment analysis is supervised classification of text into an emotion/tone label. Prepare/QA text (punctuation, capitalization, spelling/grammar, encoding; source also mentions stemming/lemmatization and stop words), tokenize words, create binary word-presence features (bag of words), manually label training examples, fit a classifier (case study uses multivariate logistic regression), then evaluate on unseen reviews. The “Mark Twain the Datadog”/Bark Twain book-review case is fictional. Course notes that bag-of-words misses context, ambiguity, double negatives, slang and sarcasm; a small training set is not production-ready. |

## Workbook evidence and implementation guidance

The workbook sheet `Sentiment Analysis` has dimension `B1:AL66`. Training reviews occupy rows 4–50 (47 observations): raw review in B, supplied cleaned text in D, 25 binary word-presence columns G:AE, hand-scored sentiment in AG (0 negative, 1 positive), logistic prediction in AI, and likelihood-related values in AJ. The test section begins at row 55; seven unseen reviews are in rows 57–63, with raw text in B, cleaned text in D, model-derived class output in AG, and model probability in AI. The feature vocabulary includes `terrible`, `no`, `avoid`, `struggle`, `never`, `love`, `hate`, `good`, `bad`, `great`, `wouldn't`, `don't`, `waste`, `trash`, `favorite`, `alright`, `nothing`, `like`, `devoid`, `garbage`, `best`, `crap`, `why`, `worse`, and `better`. The workbook’s Solver objective shown at AJ52 is about 45.5; values are workbook-specific and depend on its included formulas/weight cells. Do not imply the course’s small review set is representative.

Lessons 9.22–9.25 follow the source-first reproduction convention used by the other Chapter 9 models. Preserve the PDF examples and the complete Sentiment Analysis worksheet, including supplied cleaning, all binary features, saved coefficients, training labels, test class outputs and calculations. See `SENTIMENT_SOURCE_NOTES.md` for detailed extraction and correction boundaries.

## Source corrections and boundaries

- The VTT labels the story “Mark Twain, The Datadog,” while the case video repeatedly says “Bark Twain the Data Dog”; retain one clear fictional case title consistently.
- The workbook test section does not supply independent evaluation labels. AG57–AG58 threshold the model probabilities in AI; the remaining cached classes match that rule. Keep these class outputs distinct from human-scored training labels, and do not calculate test accuracy from them.
- Sentiment labels are subjective human annotations; explain that labeling guidance and agreement matter. Do not treat the course’s manually assigned labels as objective truth.
- Binary word presence ignores frequency, word order, syntax, scope of negation, sarcasm, and many forms of context. Cleaning is task-dependent; indiscriminate stop-word removal can discard useful signals such as negation.
- The rendered equation on p.142 is the standard sigmoid, `1 / (1 + e^−(β₀ + β₁x))`. The likelihood visual on p.149 defines high likelihood for a prediction near the observed class and low likelihood for a mismatch. Precisely, binary logistic likelihood is the product of per-observation probabilities assigned to each observed class (usually optimized as summed log-likelihood); use that definition if reproducing the optimization lesson.
- Workbook facts above come from stored worksheet XML (cached values), not recalculation in Excel. Raw source material remains read-only.

## Lesson 9.2 source-image revision

Lesson 9.2 displays static crops of PDF viewer pages 100–102, including the original age/income plots, input values, highlighted neighbors (K = 10, 20, and 6), counts, and predictions. The slide navigation and title are omitted. These replace the illustrative interactive graph and supporting prose at the user's request. The source image's “Confidence” percentages describe neighbor vote shares, not calibrated prediction probabilities; the image alternatives make that distinction explicit.

Page 102 adds age 50, income $80,000, K = 6, and a 3–3 tie. Styled text below the three images follows page 103: ties, choosing K, and more than two input variables. Two accuracy adaptations are explicit: shortest total class distance is a possible tie rule rather than universal KNN behavior; K is selected on validation/cross-validation data rather than the final test set. Numerical feature scaling is retained as a practical clarification.

The page 103 explanations now include static authored diagrams: a 3–3 tie with distance sums 6 versus 9; a comparison of candidate K values on the same 100 validation cases; and a three-feature distance calculation (0.3² + (−0.4)² + 0² = 0.25, distance 0.5). Every added value is explicitly illustrative, not extracted from the source plots or fitted results.

## Approved lesson redistribution

9.2 now contains the KNN definition and decisive source examples from pages 100–101, with a visible vote-share versus prediction-probability clarification. 9.3 retains its existing route and sidebar title, but contains the tied example from page 102 and the three page 103 explanations and authored diagrams. The redundant toy customer interaction was removed. Both lessons close with a concise summary. Lesson 9.4 is separately rebuilt from the workbook as described below.

## Lesson 9.4 workbook reproduction

The user requested the Excel case-study interface, with only a short assignment header and no additional teaching panels. `knnWorkbookData.json` extracts all 100 rows of `K Nearest Neighbors (KNN)!B4:U103`: title, artist, genre, eight raw features (E:L), eight full-precision cached scaled features (M:T), and recorded outcome (U). Workbook SHA-256: `2a8cd660b21ef3e4b7190a4a4378f01eb9ce9dc5124535fb6f60c5d3049c7ffc`. Display rounds values to whole numbers like the sheet; hover titles retain their full numeric values. The table preserves the original title, artist, genre, raw feature and outcome columns, then appends all eight explicitly labeled scaled columns at the far right, as requested. Original and scaled values appear together; there is no view toggle. All rows and columns are accessible through the scrollable source table.

- `X3:Y3`: independent dropdowns over all eight features in M3:T3; selecting the same feature twice is allowed. `X4:Y4` are manual numeric query values with no added 1–100 bounds. `Z4`: whole-number K from 0 to 100.
- Saved defaults: Tempo=25, Key=50, K=20. `AR4:AR103` calculates Euclidean distance using the two selected scaled features. `AS4:AS103` uses ascending competition ranks, so tied boundary distances can include more than K tracks. `AC4:AE4` counts all rank≤K outcomes. `AC7` chooses the first maximum in SKIP, LISTEN, FAVORITE order; `AE8` divides that winning count by the actual included total. K=0 displays a dash for prediction and confidence. The spreadsheet tie rule is retained; other KNN implementations can use different tie rules.
- `chart5.xml` / `chart6.xml` and the case video at 08:00 establish the paired FULL SAMPLE and K NEAREST NEIGHBORS plots: fixed square −10…110 scales, ticks every 10, dynamic feature names, red/yellow/green outcomes, gray background observations, and cyan query ring/connectors in the neighbor chart. Source colors are retained inside the established app shell.
- Numeric checks: saved 25/50/K20 → 9 skipped, 11 listened, 0 favorited, LISTEN 55%; video 25/60/K20 → 6/13/1, LISTEN 65%; 25/60/K2 → 1/1/0, SKIP 50%; K100 → 27/54/19, LISTEN 54%. Unit tests also verify scaling for every track/feature, every axis pairing, K0, and a synthetic equal-distance boundary (explicitly test-only).

Evidence is static worksheet/formula/chart XML, cached scaled values, independent calculation, and the course video. Native Excel recalculation was not performed. The source workbook is unchanged; live React calculations and desktop interactions are verified separately.

Implementation review (2026-10-19): the existing 9.4 route now renders the workbook reproduction; 9.2/9.3 work in progress is preserved. `npm run check` passes 14 test files / 73 tests, TypeScript, and production build; `git diff --check` passes. Desktop browser checks at 1440×1100 and 1680×1100 cover saved/video examples, vote ties, K0/K100, same-feature axes, synchronized connectors/counts, out-of-range K, keyboard-cleared query values, original/scaled table views, and scrolling to the final track/columns. The final page has no browser runtime errors or horizontal page overflow. Learner review removed the surplus prose and widened the source table to avoid hiding its visible numeric column behind sticky labels. Preview: `previews/chapter9-4-workbook.png`.

Final refinements (2026-10-19): the original and scaled columns appear together in the full-width table, with all scaled columns appended at the far right. Inputs and prediction occupy the next row, followed by the paired charts. The header introduces an imagined Spotify user and their 100 most-played songs; this is scenario framing, not a claim about the workbook's real-world provenance. The requested scaling explanation remains directly below the table and uses actual workbook Tempo/Duration ranges (rounded) to show their separate mapping to 1–100. It explains comparable distances and readability. Canonical lesson links now include sidebar numbering (for example ), while legacy links remain aliases. Final validation passes 76 tests, TypeScript, production build, and whitespace checks; browser checks verify alias upgrade, numbered sidebar/Previous links and browser Back.


## Lessons 9.5–9.7 PDF reproduction (2026-10-20)

The user rejected the wordy explanation panels and requested direct visual copies with automatic step animation. `BayesPdfLessons.tsx`/`.css` replace the former teaching lessons; the approved workbook case study remains separate and unchanged. These lessons now use the PDF's ten-customer example, not the twenty-customer workbook adaptation used by the earlier implementation.

- 9.5: very short definition and simple prediction diagram, following the overview on page 106.
- 9.6: source pages 107–113. Ten observed customer rows plus the unobserved customer 11 (NEWS=0, FB=1, SITE=1). Charcoal header, gray alternating data rows, cyan frequency cells, pale yellow query. Animation highlights matching source input/target cells and builds frequency counts in source order. The final tables remain visible.
- 9.7: conditional-probability table from page 114 and purchase calculation sequence from pages 115–118. Preserve source probability order, the 0/1/1 new customer, two class-product columns, and final normalization. Automatically select the matching likelihoods and reveal the numerical calculation; no feature/input choices are needed.

Exact data rows (ID, NEWS, FB, SITE, Purchase):
`1,0,1,0,1; 2,1,0,1,0; 3,1,1,0,1; 4,0,0,0,0; 5,1,0,0,0; 6,1,1,1,1; 7,1,0,1,0; 8,0,1,1,1; 9,1,0,1,1; 10,1,1,0,0`.

Count matrices (rows input=1,0; columns Purchase=1,0): NEWS `[[3,4],[2,1]]`; FB `[[4,1],[1,4]]`; SITE `[[3,2],[2,3]]`. Each class has five customers, so both priors are 50%. Selected purchase likelihoods are No News 40%, FB 80%, SITE 60%; the class product is `0.4 × 0.8 × 0.6 × 0.5 = 0.096`. Selected no-purchase likelihoods are 20%, 20%, 40%; product `0.2 × 0.2 × 0.4 × 0.5 = 0.008`. Normalize `9.6% / (9.6% + 0.8%) = 92.3%`. This is the source model's teaching calculation, not a validated real-world estimate.

Visual source inspection: rendered PDF pages 107–118, with page 113 showing completed frequency tables and page 118 showing the completed purchase calculation. The duplicated PDF sidebar and decorative masthead are omitted within the existing application shell. Original source PDF and workbook are read-only references.

Validation of the PDF revision: independent source/math/visual review found no remaining must-fix issues. Full check passes 94 tests in 17 files, TypeScript and production build; whitespace check passes. Desktop browser checks at 1680×1100 and 1440×1100 verify source-cell highlights, sequential count reveals, all twelve final counts, probability lookups, both raw products, automatic final 92.3% prediction, no page overflow, and immediate final-state rendering with reduced motion. Optional playback controls do not gate the content. Screenshots: `previews/chapter9-5-pdf-intro.png`, `previews/chapter9-6-pdf-animation.png`, and `previews/chapter9-7-pdf-animation.png`.

## Lesson 9.8 approved workbook reproduction

9.8 now reproduces `Naive Bayes` with only a short assignment header:

- `B2:F23`: five source columns and all twenty customer records; data module `bayesWorkbook.ts` is dedicated to this workbook case; the PDF demonstrations use `bayesPdf.ts`.
- `H3:K17`: three 2×2 frequency tables, totals 6/14 and priors 30%/70%. Counts in class1/class0 order: Newsletter 1→4/2, 0→2/12; Facebook 1→4/6, 0→2/8; Website 1→5/6, 0→1/8.
- `H19:L23`: three accessible native checkboxes reproducing the source Yes/No controls. Saved defaults `L21:L23` = 1/1/0.
- `M3:O18`: all twelve conditional probabilities, selected-row percentage highlights, and two merged product areas. Source percentages retain one decimal and priors whole percentages; source gray/yellow, green/red, and cyan result colors are retained.
- `N20`: raw Purchase 0.0222222222222222, raw No_Purchase 0.0244897959183673, normalized Purchase 0.47572815533980584 → 47.6% initially. All-No gives 2.8%; all-Yes gives 85.8%.

There are no chart objects on this worksheet. Hidden Q:S checkbox/helper references are implementation plumbing and are not displayed. The original workbook remains read-only. Evidence comes from worksheet/formula/style/conditional-format XML, cached values, subtitles, and independent arithmetic; native Excel recalculation was not performed.

Validation: ten focused workbook tests cover all eight input combinations using exact rational reference results, source counts, priors and cached defaults. Full check passes 92 tests, TypeScript and production build. Independent final review found no remaining must-fix issues. Browser checks exercise all eight checkbox combinations, synchronized raw/final results and six selected likelihood cells, restore saved defaults, confirm twenty visible source rows, and check desktop overflow. Screenshot: `previews/chapter9-8-workbook.png` at 1680×1100. The sheet scrolls within its own region at narrower desktop widths.

Playback/header refinement: both PDF animations now have Previous/Next buttons and a step counter alongside autoplay/pause and replay. Manual stepping pauses playback; boundaries disable the relevant button; autoplay resumes from the current step or restarts after completion. The introduction uses a plain-language definition, the frequency-table header briefly defines the table, and a short note below 9.7 distinguishes dividing by five class members from the 5/10 class prior. The 9.8 header now explicitly states the purchase-probability goal using newsletter signup, Facebook following and website visiting.

Historical review note: screenshot paths under `previews/` refer to temporary evidence removed during repository cleanup. The written findings remain available here.
