# Chapter 97 · Natural Language Processing

Status: 97.1–97.2 implemented and reviewed; 97.3–97.11 remain unpublished outlines. Implement, check and commit one lesson at a time under the user's standing authorization to continue without permission gates. Plan: `../plan_nlp.md`.

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
