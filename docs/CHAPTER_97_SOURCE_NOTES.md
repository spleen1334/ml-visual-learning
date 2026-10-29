# Chapter 97 · Natural Language Processing

Status: 97.1–97.10 implemented and reviewed; 97.11 remains an unpublished outline. Implement, check and commit one lesson at a time under the user's standing authorization to continue without permission gates. Plan: `../plan_nlp.md`.

## 97.10 task-specific evaluation and review · 2026-10-29

References inspected: scikit-learn [precision/recall/F-score](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.precision_recall_fscore_support.html), [confusion matrix](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.confusion_matrix.html), [leakage](https://scikit-learn.org/stable/common_pitfalls.html#data-leakage), and [spaCy span scoring](https://spacy.io/api/scorer). No external evaluator runs. The model is the actual97.6 fit, not supplied binary predictions; entity candidates below are deliberately supplied examples, not live NER outputs.

Positive class=positive sentiment; actual/reference above in columns, predicted at left in rows. Exact CS09–11 outputs produce TP1(CS10), FP1(CS09), FN0, TN1(CS11). Precision1/2=0.5, recall1/1=1, harmonic F1=2/3. Zero denominators return null/display “not defined”; this lesson also leaves harmonic F1 undefined when either input metric is undefined or P+R=0. This explicit convention differs from libraries that substitute zero. CS12 is excluded from fit/binary metrics. Separate unlabeled domain probe “The book was not helpful.” predicts positive, ignores`book`, and is not included in these three-message counts. Cases used repeatedly for design are not an untouched final test; three examples do not establish general performance.

Entity fixture is97.9's “Maya contacted Acme on Friday.” References: Maya/person[0,4), Acme/organization[15,19), Friday/date expression[23,29). Supplied candidates: exact Maya/person, spurious contacted/organization[5,14), wrong-boundary Acm/organization[15,18), wrong-type Friday/person[23,29). Exact start/end/type keys yield TP1, FP3, FN2; precision1/4, recall1/3, F1=2/7. Wrong boundaries/types leave their reference unmatched. Duplicate exact keys and invalid source offsets/substrings are rejected. Entity and classifier denominators remain separate; ranking quality instead needs relevance judgments.

- Parent inspected helpers/tests/UI/CSS/routing and corrected a global CSS class-name collision by isolating NLP evaluation selectors under `nlp-eval-`. Verified renamed classes and corresponding component references. No remaining must-fix findings.
- `rtk npm run check`:46 files/222 tests passed; TypeScript/build passed with existing bundle warning. Tests verify actual classifier outputs, matrix contributing IDs, exact metrics/undefined conventions, exclusions, entity mismatch categories and duplicate rejection. `rtk git diff --check` passed.
- Browser1440×1000 and1100×850: FP highlights CS09, empty FN clears highlights and explains no messages, keyboardEnter TP selects CS10; classification fractions and separate entity counts match fixtures. Reduced-motion retains complete manual controls. Spot-checked99.13 still exposes five case buttons without overflow after selector isolation. No document overflow/browser errors. Evidence:`previews/chapter-97.10-confusion.png`, `previews/chapter-97.10-entities.png`. Desktop only.

## 97.9 authored spans to computed records · 2026-10-29

References inspected: [spaCy linguistic features](https://spacy.io/usage/linguistic-features), [Span API](https://spacy.io/api/span). No parser/NER model runs. All entity/POS/role annotations are authored; the computed rule copies the first supplied span of each type into person/organization/dateExpression fields. Missing annotations map to null, not zero or proof that the real information is absent. Date expressions are not resolved dates.

CS11 reuses exact existing Acme[14,18), Friday[57,63), with person null. Separate fixture “Maya contacted Acme on Friday.” has Maya/person[0,4), Acme/organization[15,19), Friday/date expression[23,29). “Apple shipped the device.” has Apple/organization[0,5); “Maya ate an apple.” has Maya/person[0,4) and no organization annotation. These presets are not additions to the frozen sentiment corpus. Fixed source strings prevent stale annotations; validation checks type, integer bounds, sorted non-overlap and exact source substrings. ASCII fixture offsets use JavaScript character indices, coinciding here with code-point indices.

Grammar is a separate authored explanation of the Maya sentence: Maya[0,4) proper noun/subject → contacted[5,14) verb/action → Acme[15,19) proper noun/object. Arrows read the event in order, not parser head/dependent orientation or a universal English pattern. POS categories and grammatical roles remain distinct from entity types. Company/fruit annotations show context dependence, not automatic spelling-based disambiguation.

- Parent inspected fixtures/tests/component/CSS/routing. Source highlights and computed record-field selection stay aligned; copy-rule/null/date limitations are visible. No remaining must-fix findings.
- `rtk npm run check`:45 files/218 tests passed; TypeScript/build passed with existing bundle warning. Tests verify all spans, record mapping, CS11 reuse, Apple contexts, invalid annotation rejection and grammatical span/arrow invariants. `rtk git diff --check` passed.
- Browser1440×1000 and1100×850: all four preset records match fixtures, Friday selection shows[57,63), keyboardEnter selects Acme and matching field, grammar arrows/POS/roles readable. Static exploration has no timed animation; reduced-motion retains complete manual controls. No document overflow/browser errors. Evidence:`previews/chapter-97.9-record.png`, `previews/chapter-97.9-grammar.png`. Desktop only.

## 97.8 supplied semantic vectors and review · 2026-10-29

Primary references inspected: [Sentence-BERT](https://arxiv.org/abs/1908.10084) for semantic sentence representations/cosine and [BERT](https://arxiv.org/abs/1810.04805) for contextual representations. All vectors here are explicitly hand-chosen coordinates, not outputs of those models. No embedding service or training runs. Scores are computed, not supplied claims of actual model quality.

Separate text collection: query`purchase`=[1,1,1]; D1`buy item`=[1,0.8,1], D2`purchase history`=[0.5,1,0.1], D3`river water`=[0.1,0.2,1]. Lexical TF–IDF fit on these documents yields D2=1/√2≈0.707107, D1/D3=0; supplied-vector cosine yields D1≈0.9949366763261821, D2≈0.8229511997978236, D3≈0.7324670207647144. This contrived ranking illustrates representation choice, not semantic-search superiority. Exact ties use ID order.

`bank` fixtures: “The bank holds my savings.”=[1,0.2,0.2], “The bank borders the river.”=[0.2,1,0.2]; dot0.44, both squared lengths1.08, cosine≈0.40740740740740744. Context switching reverses the inspected pair, not a learned disambiguation process. The equal-scale plot drops x3 and shows x1/x2 only; full3D calculations remain authoritative. Coordinate axes carry no universal semantic meanings, and cosine is not plotted Euclidean distance.

- Parent inspected fixtures/tests/UI/CSS/routing and numeric traces. Separate collections, supplied-versus-learned boundaries, context-sense distinction and projection limits are explicit. No remaining must-fix findings.
- `rtk npm run check`:44 files/214 tests passed; TypeScript/build passed with existing bundle warning. Tests verify exact vectors, lexical/dense rankings, dot/norm fixtures, context pair, projection information loss, zero vectors and ID ties. `rtk git diff --check` passed.
- Browser1440×1000 and1100×850: rankings match fixtures, D2 selection shows full3D cosine0.823, context switching/keyboardEnter reverses financial/river pair with cosine0.407, equal-scale projection remains readable, reduced-motion retains complete manual controls. No document overflow/browser errors. Evidence:`previews/chapter-97.8-rankings.png`, `previews/chapter-97.8-vectors.png`, `previews/chapter-97.8-bank.png`. Desktop only.

## 97.7 lexical FAQ search and review · 2026-10-29

Primary references inspected: [scikit-learn cosine similarity](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.pairwise.cosine_similarity.html) and [TF–IDF weighting](https://scikit-learn.org/stable/modules/feature_extraction.html#tfidf-term-weighting). The three existing FAQ title/body strings are unchanged; indexed text is exactly title + one space + body. Vocabulary/IDF are fit only on those three FAQ documents (26 terms), reusing97.4 tokenization/97.5 smoothed count-based TF–IDF. Queries transform against frozen statistics, unrelated to classifier fitting. For `order`, df2 and idf=1+ln(4/3). This computed ranking is explicitly separate from97.1's supplied order.

Raw-vector cosine uses dot/(query length×document length); per-term products and both norms are visible. Zero-length vectors receive score0 with no division; no represented query words yields an explicit no-ranking state. Exact ties sort by FAQ ID, full precision otherwise. Unknown query words are listed. `purchase` is unsupported lexically, not proof that all FAQs are irrelevant.

Golden results: CS11→FAQ2 0.46053801409416684, FAQ1 0.29428763797053353, FAQ3 0; `missing order`→FAQ1 0.3761305927901108, FAQ2 0.13204130183910784, FAQ3 0; `refund order`→FAQ2 0.5886160813216482, FAQ1 0.13783185822837235, FAQ3 0. Default CS11 represented terms are`missing,order,refund`; FAQ2 counts refund twice (title and body). Empty, punctuation-only and`purchase` queries give zero vectors.

- Parent inspected helpers/tests/UI/CSS/routing. Corrected TypeScript's overly narrow literal query-state inference to explicit string state before final validation. Shared-word highlights, exact index scope, contribution sums and zero-vector handling are coherent. No remaining must-fix findings.
- `rtk npm run check`:43 files/210 tests passed; TypeScript/build passed with existing bundle warning. Tests cover hand cosine, golden rankings, frozen statistics, exact title/body indexing, source offsets, tie ordering and zero/unknown cases. `rtk git diff --check` passed.
- Browser1440×1000 and1100×850: default ranks/scores match fixtures, selecting FAQ2 shows dot7.3916/(2.7188×5.9034)≈0.4605, unknown synonym and punctuation-only inputs show no ranking, keyboardEnter selects results, reduced-motion retains manual controls. No document overflow/browser errors. Evidence:`previews/chapter-97.7-ranking.png`, `previews/chapter-97.7-cosine.png`, `previews/chapter-97.7-no-terms.png`. Desktop only.

## 97.6 actual multinomial Naive Bayes fit and review · 2026-10-29

Reference inspected: [scikit-learn multinomial Naive Bayes](https://scikit-learn.org/stable/modules/naive_bayes.html#multinomial-naive-bayes). Browser helpers implement the fit/prediction locally, without scikit-learn or supplied fitted weights. Training is exactly CS01–CS08 with97.4's word-token convention, alphabetical training vocabulary V=30, priors4/8 each, negative20/positive16 word tokens. Additive smoothing α=1 gives denominators50/46. Example `waited` counts2/0 yield likelihoods3/50 and1/46. Neither the descriptive97.4/5 vocabulary nor any held-out text/labels fit these parameters.

Prediction sums log prior plus query-count-weighted log likelihoods, then subtracts the maximum log score before exponentiating/normalizing. Unseen terms are ignored and listed; no represented terms yields the priors, explicitly flagged as no evidence. Exact ties use declared negative-first class order. Scores are model-relative, not calibrated confidence or guaranteed correctness. CS12 remains review-only and outside fitting/binary accuracy.

Golden negative scores: CS09=0.4584055459272098 (predicts positive despite negative reference); CS10=0.2200499168053246 (positive); CS11=0.9197579087118724 (negative). CS09 uses `helpful`/`not`, unknown`all,at`; CS10 uses`thanks,the`, unknown`fix,worked`; CS11 uses`is,missing,my,order`, unknown`acme,by,friday,i'm,it,please,refund,upset`. Wrong CS09 prediction is intentionally preserved, showing the model does not compose negation rather than tuning the example to look successful.

- Parent inspected helper/tests/UI/CSS/routing, all visible training records, class totals, exact likelihood fractions and log-score contributions. Complete vocabulary/counts remain inspectable; observed references stay separate from predictions. No remaining must-fix findings.
- `rtk npm run check`:42 files/204 tests passed; TypeScript/build passed with existing bundle warning. Tests verify training totals/smoothing, frozen held-out scores/OOV lists, repeated query contributions, model immutability, no-evidence priors/tie handling and review-only exclusion. `rtk git diff --check` passed.
- Browser1440×1000 and1100×850: all three predictions/scores match fixtures, default wrong CS09 result is explicit, keyboardEnter changes query, full vocabulary expands to30 rows and eight training records remain visible. Static exploration has no timed animation; reduced-motion retains complete manual controls. No document overflow/browser errors. Evidence:`previews/chapter-97.6-heldout.png`, `previews/chapter-97.6-scores.png`, `previews/chapter-97.6-fitting.png`. Desktop only.

## 97.5 TF–IDF conventions and review · 2026-10-29

Reference inspected: [scikit-learn TfidfTransformer](https://scikit-learn.org/stable/modules/generated/sklearn.feature_extraction.text.TfidfTransformer.html). Local helpers reuse97.4's unigram rule and descriptive CS03/CS06/CS07/CS09 collection, not a classifier training vocabulary. Convention: tf=count; N=4; df=documents containing term; idf=ln((1+N)/(1+df))+1; raw weight=tf×idf. No sublinear tf. Vocabulary alphabetical; full precision internally, three-decimal display.

`helpful`/`not`:df2, idf=1.510825623766. `waited`:df1, idf=1.916290731874; CS07tf2 gives raw3.832581463748. CS07 has four other distinct words with the same idf, squared norm29.377361352534, length5.420088684933, normalized waited≈0.707106781187. Optional L2 normalization scales each nonzero document row to length1 and preserves the raw trace. Unknown terms are ignored against frozen fitted statistics; all-zero vectors remain zero with no division/NaN. Empty document collection fitting is rejected; a nonempty collection of empty documents has empty vocabulary. Query transformation never refits IDF.

- Parent inspected helper/tests/component/CSS/routing. Counts and document frequency remain separate, selected terms highlight all contributing source documents, zero cells preserve their collection-level IDF, and normalization arithmetic is separate from text cleaning. No new dependencies or remaining must-fix findings.
- `rtk npm run check`:41 files/200 tests passed; TypeScript/build passed with existing bundle warning. Tests verify hand IDF/count fixtures, frozen transformation, zero/unknown vectors, normalization and deterministic ordering. `rtk git diff --check` passed.
- Browser1440×1000 and1100×850: waited trace2→df1→idf1.916→raw3.833, optional norm5.420→0.707, zero-cell trace, shared-term document highlights, keyboardEnter selection and reduced-motion manual controls passed. All columns remain available through contained scrolling; no document overflow/browser errors. Evidence:`previews/chapter-97.5-weight.png`, `previews/chapter-97.5-normalization.png`. Desktop only.

## 97.4 count features and review · 2026-10-29

Primary reference inspected: [scikit-learn text feature extraction](https://scikit-learn.org/stable/modules/feature_extraction.html#text-feature-extraction). The browser implements its own small count helper, not scikit-learn. `nlpCountFeatures.ts` defines the reusable feature convention: lowercase ASCII words with internal apostrophes, punctuation excluded, stop words retained, no stemming/lemmatization. Offsets refer to original source text. Bigrams join consecutive word tokens across punctuation/sentence endings within each document, never across documents. Vocabulary is alphabetical; fixed-vocabulary unknown features contribute zero.

Descriptive subset CS03/CS06/CS07/CS09: unigram matrix4×16=64 cells with46 zeros; bigram matrix4×15=60 cells with45 zeros. CS07 has two `waited` occurrences at[2,8) and[13,19); CS09 `not helpful` contributes one bigram from[0,3) and[4,11). A selected zero highlights no text. CS09 is held out for the later classifier; this descriptive matrix explicitly does not supply that classifier's fitted vocabulary. Its vocabulary/statistics must instead be fit on training documents only.

Separate authored order-loss pair `cat chased dog` / `dog chased cat`: sorted unigrams `[cat,chased,dog]` yield `[1,1,1]` for both; bigrams `[cat chased,chased cat,chased dog,dog chased]` yield `[1,0,1,0]` and `[0,1,0,1]`. These examples are not sentiment fitting records.

- Parent inspected helper/tests/component/CSS/routing; confirmed exact counts, dimensions, sparsity, repeated contributions and separate order example. No new dependencies or external execution; no remaining must-fix findings.
- `rtk npm run check`:40 files/196 tests passed; TypeScript/build passed with existing bundle warning. Tests cover exact vocabulary/count fixtures, repeated spans, bigram offsets, order loss, punctuation policy, empty documents and unknown terms. `rtk git diff --check` passed.
- Browser1440×1000 and1100×850: repeated `waited` highlights both occurrences, zero-cell selection clears highlights, bigram selection highlights both source words, keyboardEnter selects cells, and contained horizontal scrolling preserves all columns. Static exploration has no timed motion; reduced-motion mode retains full manual controls. No document overflow/browser errors. Evidence:`previews/chapter-97.4-counts.png`, `previews/chapter-97.4-bigrams.png`, `previews/chapter-97.4-order.png`. Desktop only.

## Supplementary source boundary

This chapter uses original, authored English customer-support fixtures, not replacement data for the course's approved review-based sentiment lessons9.22–9.25. There are no corresponding local Chapter97 PDF/subtitle/workbook materials. Preserve existing course examples and link to them rather than recreating their case study.

Targeted primary references checked2026-10-29: [Hugging Face task/model overview](https://huggingface.co/learn/llm-course/en/chapter1/5), [spaCy linguistic features](https://spacy.io/usage/linguistic-features) and [Span API](https://spacy.io/api/span), [scikit-learn feature extraction](https://scikit-learn.org/stable/modules/feature_extraction.html). They support task/output distinctions, text spans/offsets and feature conventions; no spaCy, pretrained model or scikit-learn code runs in the browser.

## Frozen support corpus

Quoted strings below exclude the quotation marks. IDs/splits/text/annotations are fixed for subsequent lessons. Sentiment labels are authored references about expressed tone, not proof of actual customer satisfaction. CS12 has a mixed/ambiguous annotation and is excluded from classifier fitting and binary accuracy denominators; show it for annotation review rather than silently forcing a target.

| ID | Split | Exact text | Reference sentiment |
| --- | --- | --- | --- |
| CS01 | train | Thanks, the setup was easy. | positive |
| CS02 | train | The update fixed my issue. | positive |
| CS03 | train | Helpful team, quick reply. | positive |
| CS04 | train | Great service!! | positive |
| CS05 | train | My order is still missing. | negative |
| CS06 | train | This app is not working. | negative |
| CS07 | train | I waited and waited for help. | negative |
| CS08 | train | The charge is wrong. | negative |
| CS09 | test | Not helpful at all! | negative |
| CS10 | test | The fix worked, thanks! | positive |
| CS11 | test | I'm upset. My Acme order is missing. Please refund it by Friday. | negative |
| CS12 | review-only | The reply was quick, but the issue remains. | ambiguous/mixed |

Classifier training is8 records, balanced4positive/4negative; three separate unambiguous test records, plus one review-only mixed record. `refund` and `Acme` occur only outside the training set; repeated `waited`, negation `not`, punctuation and an apostrophe are present. Feature vocabulary/statistics must be fit on training records only. Future count/TF–IDF/classifier conventions are implemented and checked in their own lessons, never inferred from held-out labels. Search indexing is a separate collection with its own fitting boundary.

## 97.1 task-map contract

Use CS11 as the shared input document. Classification output is its **authored reference label**, not a fitted prediction. Extraction highlights authored organization`Acme` and date-expression`Friday` spans; Friday is a text expression, not a resolved calendar date. Calculate and test exact zero-based start-inclusive/end-exclusive character intervals from the fixed string before display; do not copy unchecked proposed offsets. Since this corpus is ASCII, Unicode-code-point and JavaScript UTF-16 offsets coincide here; do not generalize that identity to all text.

Generation output is an **authored summary**, e.g. “The customer is upset about a missing Acme order and requests a refund by Friday.” It is not an LLM result or a verified refund eligibility decision. Search output is a ranked document list from a separate tiny support-document collection; label any supplied order as authored, or show a named simple computed matching rule with exact scores and deterministic tie handling. Do not claim TF–IDF or embeddings have run before those lessons. Keep document/corpus/label/span definitions beside the shared input and output shapes.

Relevant canonical course links: `#chapter-09/9.22-intro-to-sentiment-analysis`, `#chapter-09/9.23-cleaning-text-data`, `#chapter-09/9.24-bag-of-words-analysis`, `#chapter-09/9.25-case-study-sentiment-analysis`. Detailed LLM internals: `#chapter-99/99.14-full-pipeline`; tokenization: `#chapter-99/99.2-tokenization`. Preserve existing IDs and URLs.

## Exact 97.1 outputs and review · 2026-10-29

`src/chapters/nlpData.ts` is the canonical corpus fixture. CS11 is negative by authored reference; extraction spans are `Acme [14,18)` and `Friday [57,63)`, verified against exact substrings in `nlpData.test.ts`. Summary: “The customer is upset about a missing Acme order and requests a refund by Friday.”

Search uses a **separate authored FAQ ranking**, not a computed score: FAQ1 Missing orders / “Check the status of an order that has not arrived.”; FAQ2 Refund requests / “Learn how to request a refund for an order.”; FAQ3 Delivery dates / “Find information about delivery estimates.” Keep this supplied order distinct from97.7's eventual computed lexical ranking. No classifier, extractor, search engine or LLM runs in97.1.

- Parent inspected component, data, exact-span test, stylesheet and manifest/routing changes. The same input leads to four distinct output shapes; definitions and authored/computed boundaries are visible. Mechanical CSS formatting was reviewed and invalid pseudo-selector spacing repaired before final checks; a status role was added to playback. No remaining must-fix findings.
- `rtk npm run check`:37 files/184 tests passed, TypeScript and production build passed (existing bundle warning). Tests verify frozen corpus split, exact offsets, canonical/legacy routes,97-before99 sequencing, ten unpublished outlines and stable Chapter99 routes. `rtk git diff --check` passed.
- Browser1440×1000 and1100×850: extraction highlights matchAcme/Friday, search shows three supplied FAQ results, summary remains labeled authored, autoplay completes, manual/keyboard task navigation and reduced-motion completed/manual view work. No document overflow/browser errors. Evidence:`previews/chapter-97.1-extraction.png`, `previews/chapter-97.1-generation-reduced.png`. Desktop only.

## 97.2 boundary/token conventions and review · 2026-10-29

Primary references inspected: [spaCy non-destructive tokenization/alignment](https://spacy.io/usage/linguistic-features#tokenization), [Span API](https://spacy.io/api/span), [Hugging Face tokenizers](https://huggingface.co/learn/llm-course/en/chapter2/4). The lesson runs neither spaCy nor a production tokenizer. Its explicitly authored English rules accept exact presets CS11, CS06, CS04 plus empty text; unsupported strings throw.

Sentence rule retains consecutive`[.!?]+` endings and any remainder; following spaces belong to the next span, so concatenation reconstructs the entire source. CS11 spans`[0,10)`, `[10,36)`, `[36,64)`; CS04 has one span`Great service!!` while word-token punctuation is two separate`!` pieces. Internal apostrophes stay with letters (`I'm` one word), spaces are separate reconstruction pieces without IDs, and punctuation is separate. Subword mode splits only`working` into`work [16,20)` and`ing [20,23)` in CS06. Whole-word/subword vocabularies are independently sorted unique nonspace piece strings across the three fixed presets; they are unrelated to97.1's sentiment labels or99.2's vocabulary. For CS06, whole-word`working`ID19 versus subword`work`ID20/`ing`ID11; IDs are labels, not meaning. ASCII fixture offsets coincide with UTF-16 offsets; no general Unicode parser claim.

- Parent inspected helper/tests/component/CSS/routing. Full character coverage, exact offsets, contraction handling, whole-word/subword boundaries and preset limits are coherent. Playback received an accessible group/status label. No remaining must-fix findings.
- `rtk npm run check`:38 files/188 tests passed; TypeScript/build passed with existing bundle warning. Tests check sentence/token reconstruction, contiguous offsets, punctuation, lookup stability, explicit subword split and empty/unsupported input. `rtk git diff --check` passed.
- Browser1440×1000 and1100×850: autoplay completes, CS06 subword/whole-word views and selected`work`highlight/ID20/[16,20) match, CS11 sentence spans preserve spaces, keyboard/manual and reduced-motion completed/manual views passed. No document overflow/browser errors. Evidence:`previews/chapter-97.2-subwords.png`, `previews/chapter-97.2-sentences.png`. Desktop only.

## 97.3 reversible cleaning and review · 2026-10-29

Primary checks: [scikit-learn stop-word cautions](https://scikit-learn.org/stable/modules/feature_extraction.html#using-stop-words), [spaCy lemmatization](https://spacy.io/usage/linguistic-features#lemmatization), [NLTK stemming](https://www.nltk.org/api/nltk.stem.html). Preprocessing is task-dependent; the bounded authored lookups do not execute these libraries or implement their general linguistic algorithms.

PresetsCS09/CS06/CS07/CS01/CS02 retain exact source text/labels. Operation order: optional lowercase → case-insensitive removal of authored stop list`at,the,is,not` → one optional case-insensitive stem or lemma lookup, returning lowercase dictionary entries. Stem table:`waited→wait, working→work, fixed→fix`; lemma table additionally`was→be`. Stemming and lemmatization toggles are mutually exclusive. Words/internal apostrophes, individual punctuation and spaces use a separate bounded helper;97.2 vocabularies are unchanged. Original source offsets remain attached to every piece; spaces/punctuation are preserved and spaces do not count as tokens.

CS09 with lowercase/removal: `Not helpful at all!`→` helpful  all!`, removing`Not[0,3)` and`at[12,14)`, token counts5→3. CS07stem:`I wait and wait for help.`; CS01lemma:`Thanks, the setup be easy.`. These are representations, not rewritten grammatical prose or new sentiment predictions. The helpful/not-helpful comparison concerns the remaining word ignoring case/spaces; full outputs are not falsely claimed character-identical. Turning options off restores original text exactly.

- Parent read helper/tests/UI/CSS/routing and corrected the comparison's whitespace/case qualification. Definitions, exact stop/lookup tables, changes/removals, source offsets and token counts are visible; no universal cleanup recommendation. No remaining must-fix findings.
- `rtk npm run check`:39 files/192 tests passed; TypeScript/build passed with existing bundle warning. Tests cover reconstruction/offsets, exact negation/count loss, repeated replacements, distinct lemma behavior, unchanged reference labels and unsupported input. `rtk git diff --check` passed.
- Browser1440×1000 and1100×850: stop-word removal shows5→3, selectingNot shows[0,3), toggles revert, repeatedwaited→wait, was→be and mutually exclusive stem/lemma controls passed. KeyboardSpace operates checkboxes. This is a static reversible-control lesson with no timed animation; reduced motion retains the same complete/manual view. No document overflow/browser errors. Evidence:`previews/chapter-97.3-negation.png`, `previews/chapter-97.3-lemma.png`. Desktop only.
