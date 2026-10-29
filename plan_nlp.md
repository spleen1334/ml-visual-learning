# Natural Language Processing (NLP) · visual chapter plan

Status: 97.1–97.4 implemented, verified and committed; later lessons remain unpublished outlines. Exact original corpus and source boundaries are frozen in `docs/CHAPTER_97_SOURCE_NOTES.md`.

Placement: **Chapter 97 — Natural Language Processing, NLP**, in the bonus chapters before planned Chapter 98 (Computer Vision) and existing Chapter 99 (LLMs). Keep existing Chapter 99 URLs stable. NLP is the broader field of working with language; LLMs are one family of models used for language tasks.

## Learning goal and scope

Follow a small set of customer-support messages from raw text to numerical features, a prediction, a search result, and a structured record. Explain what each representation preserves, what it loses, and how to evaluate the result. No programming or advanced mathematics is required.

The live course already has sentiment analysis, text cleaning, bag of words, and a sentiment case study in Chapter 9. Link back to those lessons and use short reminders rather than reproducing the workbook or rebuilding its approved interface. Chapter 99 owns the detailed Transformer, next-token, training, and sampling explanations. This chapter concentrates on language tasks and representations, including methods that do not use an LLM.

Use 11 short lessons, one main visual each, with concise definitions and terminology next to the example. Keep the established teal/cream style. All core demonstrations run locally without an API, downloaded model, account, or backend. Speech recognition, machine translation internals, full parsing algorithms, topic-model training, agent systems, and advanced linguistic theory are outside this first scope. Mention their place in the field in the opening task map only.

## Lesson sequence

| Lesson | Main question and terminology | Visual and meaningful interaction | Gentle mathematics |
| --- | --- | --- | --- |
| **97.1 What can we do with language?** | Distinguish classification, information extraction, search, and generation. Define document, corpus, label, and span. | Use the same message to show a category label, highlighted entities, ranked documents, and a clearly labelled authored summary. Select the task to highlight its input and output. | Compare output shapes: one label, text spans, ranked scores, or generated text. No equation. |
| **97.2 Where does a sentence begin and a token end?** | Sentence splitting, word tokens, punctuation, subwords, and token IDs. | Step through a message into sentence and token tiles. Presets include an apostrophe, punctuation, and a word split into subwords. Preserve visible spaces and offsets. Link to 99.2 for the LLM vocabulary view. | IDs are lookup labels, not meaningful numerical magnitudes. Show character offsets as start-inclusive/end-exclusive intervals. |
| **97.3 Cleaning can remove meaning** | Lowercasing, stop words, stemming, lemmatization, and negation. | Reversible transformations highlight the exact changed spans. Compare “helpful” with “not helpful”; show how removing “not” can erase the distinction. Small predefined lemma/stem examples have explicit lookup/rule labels. | Counts before and after transformation. Define normalization as a text-processing choice; do not confuse it with vector normalization. |
| **97.4 From messages to a count table** | Vocabulary, bag of words, n-grams, sparse features. | Trace highlighted tokens into cells of a document–term matrix. Toggle unigram versus bigram features to expose phrases such as “not helpful.” Include “cat chased dog” and “dog chased cat” to show unigram order loss. Link to Chapter 9's full example. | Term counts and dimensions: documents × vocabulary size. Show that most cells can be zero. |
| **97.5 Which words distinguish a document?** | Term frequency, document frequency, inverse document frequency, TF–IDF. | Select one matrix cell and trace its count, document frequency, IDF and TF–IDF. Compare common and rare terms. Show the full tiny corpus and denominators. | Use one explicit convention: tf = count; idf = ln((1+N)/(1+df))+1; raw tf–idf = tf × idf. Introduce the natural logarithm as compressing a ratio; show numerical values. Present optional L2 normalization separately and visibly. |
| **97.6 A small text classifier** | Features, targets, fitting, prediction, positive/negative sentiment, ambiguous language. | Reuse count features and fit an actual tiny multinomial Naive Bayes model from visible labelled messages. Trace a held-out message through smoothed counts and class scores. Compare a phrase containing negation and an unseen word. Link back to the course's Naive Bayes calculations. | Priors, conditional probabilities, additive smoothing and normalized class scores. Name the model assumptions; score is not guaranteed real-world correctness. |
| **97.7 Search by words** | Query, document ranking, cosine similarity, lexical mismatch. | Enter or select a supported query and trace its TF–IDF vector against the document vectors. Highlight contributions to each score and sort the results. Show a synonym query that exact-word features miss. | Dot product divided by vector lengths. Work one small example; zero vectors produce a labelled “no represented terms” state rather than an invalid division. |
| **97.8 Search beyond exact words** | Dense embeddings, semantic similarity, contextual meaning, polysemy. | Compare lexical ranking with a small supplied embedding table. “Purchase”/“buy” illustrates similarity; two senses of “bank” illustrate the need for context. Show exact vectors behind rankings. A 2D diagram is labelled a teaching projection, not the full geometry. | Reuse cosine similarity. Dense vectors have learned coordinates in real models; supplied example vectors are illustrative and have no claim to be trained outputs. Contextual representations can differ for the same word. |
| **97.9 Turn text into a structured record** | Named entities, parts of speech, dependencies, extraction rules, ambiguity. | Select a message to highlight person, organization and date spans, then trace spans into a small record. Use one subject–verb–object arrow example to explain grammatical relationships. “Apple” in company/fruit contexts illustrates ambiguity. | Span intervals and exact-match counts. Annotations are authored fixtures, not live parser/NER predictions. Rules and model outputs must have different labels. |
| **97.10 How do we know it works?** | Held-out evaluation, precision, recall, F1, annotation disagreement, leakage and domain shift. | Review a small fixed set of predictions against reference labels or spans. Selecting a confusion-matrix cell highlights contributing messages. Include an ambiguous case and a shifted-domain case. | Visible TP/FP/FN counts and one worked precision/recall/F1 calculation. For entities, require exact span boundaries plus type; state zero-denominator handling. Distinguish classifier metrics from ranking/extraction metrics. |
| **97.11 Follow the complete NLP workflow** | Task → data → representation → method → output → evaluation. Where do LLMs fit? | An ungated connected workflow follows one support message through either classification, search, or extraction. Every branch states what is computed, supplied, or authored. Place an LLM option beside these branches and link to Chapter 99 for its internals. | Reuse prior values and examples. No new mathematics and no implication that every task requires every branch. |

## Example and calculation contracts

- Before implementation, freeze an original, clearly labelled teaching corpus: approximately 12 short support messages with stable IDs, visible text, labels and a documented train/test split. Include negation, punctuation, a repeated term, an unseen term, and one ambiguous label. Keep the initial vocabulary deliberately small. Define all exact strings, splits and expected calculations in `docs/CHAPTER_97_SOURCE_NOTES.md`.
- The sentiment training set and held-out labels belong to the classification example. Search can use a separate visible document collection; name that boundary so search-document fitting is not confused with classifier leakage. Fit classifier vocabulary/statistics only on training records. Fit search IDF on indexed documents; transform queries with the frozen index statistics.
- Text transformation controls can affect the current representation, but must not silently change the reference label. Explain that an ambiguous reference label can itself need human review. Do not promise universally correct sentiment for sarcasm or mixed opinions.
- The count matrix, TF–IDF and lexical search are computed locally. The tiny classifier actually fits visible counts. Dense vectors and linguistic annotations are supplied illustrative fixtures unless a later approved implementation explicitly bundles reproducible model outputs with model/version/provenance. Never change input text while retaining stale annotations or model claims: restrict fixtures to named presets.
- Show exact mathematical conventions, vocabulary order, smoothing, out-of-vocabulary behavior, vector normalization, score ties, and rounding. Keep full precision internally. Toy features can miss important language information; make the loss visible in the example.
- No universal instruction to remove stop words, lowercase everything, or stem all words. Preprocessing depends on the task, language and model. English presets establish no claim of multilingual coverage.

## Implementation and acceptance

Standing authorization (2026-10-29): continue automatically one lesson at a time after each implementation, check, desktop review and scoped commit; do not request permission between units. For each: inspect the relevant source, update source notes, implement its required data/math and visual, run meaningful numerical tests plus `rtk npm run check` and `rtk git diff --check`, review desktop output/keyboard controls/reduced motion and fix must-fix findings. Do not publish empty routes; register only implemented content. Preserve unrelated files and never push/deploy without authorization.

| Lessons | Deliverable | Required focused checks |
| --- | --- | --- |
| 97.1–97.3, individually | Task map, token tracing, reversible cleaning | Correct task outputs; token reconstruction/offsets; reversible transformations; negation preserved where intended; fixture limits visible. |
| 97.4–97.5, individually | Count matrix and TF–IDF arithmetic | Exact counts, n-grams/order example, document-frequency denominators, log convention, normalization, unseen terms and deterministic ordering. |
| 97.6 | Actual tiny text-classifier fit and held-out prediction | Hand-checked smoothed probabilities, prior/likelihood terms, fixed vocabulary, no test leakage, deterministic fit/reset and zero/unknown-feature behavior. |
| 97.7–97.9, individually | Lexical search, embedding comparison, extraction | Hand-checked cosine, zero-vector behavior, ranking ties, supplied-vector labels, valid span offsets, preset/annotation consistency and grammatical arrows. |
| 97.10–97.11, individually | Evaluation and connected workflow | Trace every metric to records; span matching rules; correct live/supplied/authored boundaries; no unimplemented pagination; complete/manual/reduced-motion states. |

| Lesson | Implementation | Verification | Scoped commit |
| --- | --- | --- | --- |
| 97.1 Task map | [x] | [x] 184 tests, build, diff and desktop review | [x] |
| 97.2 Sentence/token boundaries | [x] | [x] 188 tests, build, diff and desktop review | [x] |
| 97.3 Cleaning | [x] | [x] 192 tests, build, diff and desktop review | [x] |
| 97.4 Count table | [x] | [x] 196 tests, build, diff and desktop review | [x] |
| 97.5 TF–IDF | [ ] | [ ] | [ ] |
| 97.6 Classifier | [ ] | [ ] | [ ] |
| 97.7 Lexical search | [ ] | [ ] | [ ] |
| 97.8 Dense search | [ ] | [ ] | [ ] |
| 97.9 Extraction | [ ] | [ ] | [ ] |
| 97.10 Evaluation | [ ] | [ ] | [ ] |
| 97.11 Workflow | [ ] | [ ] | [ ] |

The grouped rows above organize dependencies, not permission to batch lessons into one implementation or commit. Optional quizzes can be considered after the visual lessons are reviewed; they are not required for this plan.

## Primary references and source boundaries

Planning references checked on 2026-10-26:

- [scikit-learn feature extraction](https://scikit-learn.org/stable/modules/feature_extraction.html): count representations, word n-grams, TF–IDF conventions and normalization. Use exact conventions rather than mixing formula variants.
- [spaCy linguistic features](https://spacy.io/usage/linguistic-features): tokenization, linguistic annotation and entity spans; models can make errors. The planned annotated presets do not execute spaCy.
- [Hugging Face tokenization](https://huggingface.co/learn/llm-course/en/chapter2/4): bridge to word/subword tokenization and the LLM chapter. Recheck the relevant page before building its lesson.

These are supplementary lessons with original teaching data. Existing Chapter 9 course examples remain the source of truth for their own lessons. No new workbook-derived numbers or trained-model outputs are claimed here. Inspect task-specific primary references again before implementing later lessons; this plan does not imply a parser, embedding model, or LLM has been run.
