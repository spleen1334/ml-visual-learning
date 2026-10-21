# Chapter 09.22–09.25 — sentiment sources

Source review: `../09. Classification Models/22. Intro to Sentiment Analysis.vtt` through `25. CASE STUDY Sentiment Analysis.vtt`; PDF viewer pages **161–167**; and `../Learning Files/3. Maven_ML_Demos_COMPLETE.xlsx`, sheet **Sentiment Analysis**. The PDF pages were rendered and visually inspected. The workbook was read from its XLSX XML; no source files were changed.

## Lesson sequence and source visuals

| Lesson | PDF pages | Source explanation to preserve |
| --- | --- | --- |
| 9.22 Sentiment analysis | 161–162 | Define sentiment as the tone or feeling behind text, treated here as supervised classification within the wider NLP area. Training sentiment labels are supplied by people; later labels are predictions. Examples are customer product reviews and open-ended surveys. Page 162's word cloud is a manually interpreted, word-count-only summary that can be inconsistent and is not a reliable classification workflow. |
| 9.23 Cleaning text | 163 | Reduce noise with selected punctuation/capitalization and special-character handling, spelling/grammar correction, proper encoding, stemming or lemmatization, and task-specific stop words. The visual transforms “The computer is running hot because I'm mining bitcoin!” into “computer run hot mine bitcoin,” with deleted words struck through and word forms reduced. The page explicitly says preprocessing choices depend on context; capitalization/punctuation may express intensity. |
| 9.24 Bag of words | 164–165 | Tokenize text; make one 0/1 feature per selected word; hand-label the observed training examples; pass a new review's feature row to a classifier. Page 164's features are `hate`, `garbage`, `love`, `book` for “I HATE this garbage!” (1,1,0,0; negative), “I love this book.” (0,0,1,1; positive), and “This book is garbage” (0,1,0,1; unseen). Each word is an input feature X; sentiment is target y. Page 165 illustrates sarcasm (“If you like watching paint dry, you'll love this movie”) and ambiguous negation (“The new version is awfully good, not as bad as expected”). More labeled examples and advanced features may help, but no model is perfect. |
| 9.25 Workbook case | 166–167 | Fictional **Bark Twain the Data Dog** book reviews. Workflow: gather/clean/tokenize raw reviews → hand-score the training labels → fit a multivariable logistic model → score new/unseen reviews → inspect disagreements. The video says the training set has fewer than 50 rows and production needs much more data. Page 167 is only a part divider. |

## Workbook data and calculations

The sentiment worksheet spans `B1:AL66`. `sentimentWorkbookData.json` retains the reviewed values from its XML.

The sentiment sheet has no chart objects. Its drawing contains an **Optimize** control associated with the Solver demonstration; there are no plotted series or axes to reproduce.

- Training observations: worksheet rows **4–50** (47 reviews). Raw text is B, supplied cleaned text is D, 25 binary features are G:AE, hand-scored training sentiment is AG (0 negative, 1 positive), model probability is AI, and per-row observed-label probability is AJ.
- Feature order: `terrible`, `no `, `avoid`, `struggle`, `never`, `love`, `hate`, `good`, `bad`, `great`, `wouldn't`, `don't`, `waste`, `trash`, `favorite`, `alright`, `nothing`, `like`, `devoid`, `garbage`, `best`, `crap`, `why`, `worse`, `better`. The `no ` header contains a trailing space in the workbook. The source's binary flags match case-insensitive substring search (`SEARCH`) against the supplied cleaned text; preserve the cached flags instead of silently replacing the worksheet's matching rule with a token-boundary rule.
- Fitted values are stored in F52 (intercept **−18.8235310030341**) and G52:AE52 (the 25 coefficients, in the feature order above). AI rows use `1/(1+EXP(-1*(F52+SUMPRODUCT(features,coefficients)))`. AJ rows use `(AI^AG)*((1-AI)^(1-AG))`. `AJ52 = SUM(AJ4:AJ50)` is **45.499999991567954**. It is the worksheet's summed per-row probability objective for Solver; mathematically it is neither the joint likelihood (product) nor log-likelihood, and it is not an accuracy score. Describe it as the workbook's Solver score.
- Test observations: rows **57–63** (seven reviews), raw text in B, cleaned text in D, features in G:AE and model probability in AI. The saved cached class outputs are positive, negative, positive, negative, negative, positive, positive, respectively. Applying the saved coefficients to all 54 cached feature rows reproduces every cached AI probability (maximum absolute difference **1.3×10⁻²⁷**); computed training likelihoods sum to the saved AJ52 score within floating-point tolerance.

### Important test-label inconsistency

The workbook does **not** contain independent human evaluation labels for the seven test rows. In the test area, AG57 and AG58 have formulas `IF(AI>0.5,1,0)`. AG59:AG63 are cached constants that equal the same thresholded model outputs. They therefore repeat predictions rather than supply independent ground truth. The video informally judges the final “It was OK, not great” review as likely negative while the word `great` drives a positive model output. That is a useful possible disagreement, but it cannot be reported as a measured test error because no separate test label is stored.

The workbook's test class boundary is **probability > 0.5**. Its data was derived from the workbook's cached worksheet results, not recalculated or edited in Excel. Training labels are manually assigned and subjective; the seven test rows need independent human labels before accuracy can be evaluated.

## Adaptation boundaries

- Lesson 9.23 retains the source sentence and adds compact illustrative before/after examples for case, punctuation, spelling, encoding, stems, lemmas, and task-specific stop words. The `studies → studi` stem illustrates rule-based trimming (method-dependent); `studies → study` illustrates a dictionary lemma. These additional examples explain vocabulary, not extra required preprocessing steps. Preserve negation and other task-relevant signals.

- Lessons 9.22–9.24 stay close to the PDF's examples. Cleaning is shown as a fixed, inspectable sequence rather than a generalized cleaning dashboard. The bag-of-words table is binary word presence and explicitly distinguishes it from frequency-count variants.
- Lesson 9.25 includes all 47 training rows, all 25 features, the saved labels/probabilities/row scores, all 25 saved coefficients, all seven test rows and the saved predictions. Wide source tables scroll inside their own containers.
- The model starts with cached fitted coefficients. Optimize is a reversible switch: on uses the saved workbook coefficients; off uses persistent manual values initialized to zero as an explicitly illustrative unoptimized baseline. Manual edits are available only with Optimize off. No new fitting runs. Current coefficients drive training predictions, per-row likelihoods, the worksheet sum, and unseen-review predictions. Human labels and source sheet classes remain fixed. A selected test row traces its active coefficients through the intercept and sigmoid. The aggregate AJ52 score is described exactly as stored, not as a conventional likelihood.
- Keep test class outputs separate from evaluation labels. Do not calculate or report test accuracy from AG57:AG63. The source's final disagreement is described as the instructor's likely human judgment, not a stored truth label.
- The workbook story names Mark Twain in the subtitles but the case slide/video uses Bark Twain the Data Dog. Use the slide/video name consistently and call the case fictional.

