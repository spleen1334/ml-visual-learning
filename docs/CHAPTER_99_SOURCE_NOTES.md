# Chapter 99 · Large Language Models

Status: all fourteen lessons implemented and reviewed in separate increments; tests/build and desktop browser review passed.

## Source boundary

This is a user-requested supplementary chapter, not a reproduction of a numbered lesson in the local Visual Guide PDF. There are no matching local PDF pages, subtitles, or Excel worksheets to reproduce. Primary technical sources were opened and inspected online on 2026-10-26. The teaching sentence, example, values, layout, and branch tree are authored adaptations.

| Primary source | Relevant passage | Use and limit |
| --- | --- | --- |
| [Hugging Face: Causal language modeling](https://huggingface.co/docs/transformers/tasks/language_modeling) | Opening definition; inference and generation example | Supports predicting the next token using preceding tokens and continuing text. The lesson does not execute this guide's code or load its model. |
| [Vaswani et al.: Attention Is All You Need](https://arxiv.org/html/1706.03762v7) | §3 opening autoregressive description; §3.1 decoder masking; §3.4 output projection and softmax | Supports consuming previously generated symbols on subsequent steps, causal restrictions, and next-token probabilities. The original paper describes an encoder–decoder translation Transformer; it is not evidence that every modern LLM has exactly that architecture. Decoder-only adaptations belong in later lessons. |
| [Hugging Face: Tokenization algorithms](https://huggingface.co/docs/transformers/main/en/tokenizer_summary) | Opening subword explanation and examples | Supports tokens being smaller than words and depending on the tokenizer. The lesson's word/punctuation segmentation is an explicit teaching vocabulary, not a claim about GPT-2 or any production tokenizer. |
| [Hugging Face course: Tokenizers](https://huggingface.co/learn/llm-course/en/chapter2/4) | Encoding, vocabulary lookup, and decoding | Inspected for 99.2 on 2026-10-29 alongside the tokenizer summary's word-level, subword, and whitespace discussions. Supports mapping pieces to IDs and decoding IDs to text; exact toy IDs and segmentation are authored, not taken from a pretrained tokenizer. Unknown-token replacement can lose information and is not a reversible encoding of unsupported text. |

Paraphrases only; no copied paper figures or long quotations. Generating/inference versus training is explained briefly: ordinary generation changes the context, while learned parameters remain fixed. The probability tree itself has no learned parameters and does not train anything.

## Lesson order

1. **99.1 What does an LLM predict?** — published: definition → repeated read/choose/append loop → one interactive next-token probability chart → token and inference reminders.
2. **99.2 Tokenization: text into token IDs** — published: text → colored pieces → lookup IDs, then vocabulary, decoding, and unknown/special-token boundaries.
3. **99.3 Embeddings and position** — published: four-number lookup rows → position addition → repeated-token comparison.
4. **99.4 The neural network inside** — published: input → four weighted products → sum and bias → ReLU; compare two input positions.
5. **99.5 Attention: queries, keys, and values** — published: head-0 Q/K/V projections → scaled dot products → normalized weights → value mixture.
6. **99.6 Causal masking and multiple heads** — published: two causal grids → selected-row mixtures → concatenation/output projection.
7. **99.7 A Transformer block** — published: connected post-norm block with residual bypasses and inspectable numerical stages.
8. **99.8 Logits and softmax** — published: separate three-score calculation, then actual frozen decoder logits/probabilities.
9. **99.9 Sampling and temperature** — published: fixed decoder logits ÷ temperature → probabilities → seeded draw/interval selection.
10. **99.10 Training: loss and gradients** — published: separate classifier with real batch-gradient updates, loss, reset and new-input predictions.
11. **99.11 Pretraining, instructions, and preferences** — published: data/objectives with a shared scenario and alternative reward/RL versus DPO paths.
12. **99.12 Context, memory, retrieval, and tools** — published: exact context assembly, outside storage/parameters, tool request/execution and budget failure.
13. **99.13 Limitations and evaluation** — published: five authored cases, criterion-specific judgments and explicit numerator/denominator rules.
14. **99.14 The full LLM pipeline** — published: same frozen decoder end-to-end, seeded end-token and greedy length-cap paths.

## Exact 99.1 example

Prompt: `The cat`. Word choices below include a leading space; punctuation does not. The special `<end>` token stops generation and adds no visible characters to the generated text.

| Tree state / current suffix | Choices, probability, next state |
| --- | --- |
| `prompt` / `The cat` | ` sat`: 0.50 → `sat`; ` slept`: 0.30 → `slept`; ` ran`: 0.20 → `ran` |
| `sat` / `The cat sat` | ` down`: 0.60 → `punctuation`; ` quietly`: 0.40 → `punctuation` |
| `slept` / `The cat slept` | ` peacefully`: 0.70 → `punctuation`; `.`: 0.30 → `stop` |
| `ran` / `The cat ran` | ` home`: 0.60 → `punctuation`; ` away`: 0.40 → `punctuation` |
| `punctuation` / completed phrase | `.`: 1.00 → `stop` |
| `stop` / completed sentence | `<end>`: 1.00 → `complete` |
| `complete` | No next distribution; generation has stopped. The chart retains the last `<end>` distribution with selection disabled. |

All available choices are displayed; each nonterminal distribution sums to 1. Shared punctuation/stop states intentionally have identical continuations for the relevant histories. No unseen alternatives or omitted probability mass are implied. The 100% transitions simplify this bounded example; they are not measured confidence values from an LLM.

Reachable outputs and path probabilities (for auditing; path products are deferred in the learner interface):

| Output | Probability |
| --- | --- |
| The cat sat down. | 0.50 × 0.60 = 0.30 |
| The cat sat quietly. | 0.50 × 0.40 = 0.20 |
| The cat slept peacefully. | 0.30 × 0.70 = 0.21 |
| The cat slept. | 0.30 × 0.30 = 0.09 |
| The cat ran home. | 0.20 × 0.60 = 0.12 |
| The cat ran away. | 0.20 × 0.40 = 0.08 |

Total output probability = 1.00. Every branch terminates in at most four selected tokens, counting punctuation and the stop token. The Play/Next path is deterministic: ` sat` → ` down` → `.` → `<end>`. This illustrates choosing the maximum each step; it does not teach or simulate random sampling yet.

## Interaction and verification contract

- Clicking any bar appends that exact token and immediately displays the updated distribution for its context. Previous undoes one choice; the learner can then select a different branch.
- Play and Next choose the highest-probability available token. Manual controls pause playback. Playback stops at `<end>`. Replay starts at the prompt; Reset returns to it paused.
- Reduced motion starts with the completed maximum-probability path. Timed playback is disabled; Previous, Next, Reset, and bar selection remain usable manually. No completion gate exists.
- The bar scale remains 0–100% at every step. Percentages are also exposed as text and accessible button names.
- `llmNextToken.test.ts` checks normalized distributions, valid transitions, branch-dependent choices, complete enumeration and probability mass, terminal stop behavior, exact text/space handling, greedy stepping, reversing a branch, and invalid choices.
- `course.test.ts` now checks all fourteen published lessons and their canonical/legacy routes.
- Parent integration owns desktop browser review and the separate lesson commit. No API, model download, network call, or neural forward pass is used by the lesson.

## 99.1 review record · 2026-10-26

- Source/process review: supplementary-source boundary, authored probabilities, exact branch transitions, lesson order and outline-only future publication are documented and tested.
- `rtk npm run check`: 22 test files / 130 tests passed, followed by TypeScript and production build. `rtk git diff --check` passed. The existing large-bundle warning remains.
- Parent desktop review: 1440×1000 and 1100×850, no horizontal overflow or header overlap. Alternate `slept` and `ran` branches, undo, autoplay stopping, disabled final Next, and reduced-motion completed/manual views passed.
- Minor review fixes applied: exact requested chapter title and strict equality in the publication checks. No remaining must-fix finding was reported; final parent integration/commit remains separate.

## Exact 99.2 lookup and adaptation

The authored, deterministic **tiny lookup tokenizer** uses longest matching ordinary text pieces. It is not BPE, WordPiece, Unigram, or a reproduction of a pretrained tokenizer. No training, model call, or learned vocabulary is claimed. Its vocabulary is independent of 99.1's tree and does not freeze the decoder vocabulary planned for 99.3.

| Piece or special marker | ID | Behavior |
| --- | --- | --- |
| `cat` | 1 | Whole-word piece in the displayed example |
| `play` | 2 | First subword piece of `playing` |
| `ing` | 3 | Second subword piece |
| One literal space | 4 | Displayed as `␠`, decoded as a space |
| `.` | 5 | Ordinary punctuation |
| `!` | 6 | Ordinary punctuation |
| `<end>` | 7 | Separate special ID; decodes to no text, not recognized as a literal input marker |
| `<unknown>` | 8 | One ID per unsupported Unicode code point; decodes to `�`, losing the original character |

`cat playing!` → `cat`, space, `play`, `ing`, `!` → `[1, 4, 2, 3, 6]` → `cat playing!`. Supported inputs round-trip exactly, including empty text and repeated spaces. `cat 🐈` → `[1, 4, 8]` → `cat �`; unsupported input is not reversible. Invalid IDs throw rather than silently disappear. Decoding the end marker removes that marker only; it does not implement generation stopping.

## 99.2 review record · 2026-10-29

- Source/process review: targeted Hugging Face references support subword pieces, vocabulary lookup, decoding, and unknown-token limits. Exact segmentation/IDs and layout are authored teaching adaptations. Later lessons remain outlines and do not enter pagination.
- Parent read the component, styles, pure tokenizer, tests, and manifest diff. Beginner review found a prominent definition, a single connected three-stage visual, visible whitespace/punctuation, matched piece/ID colors, and explicit production-tokenizer limits; no must-fix findings remained.
- `rtk npm run check`: 25 test files / 140 tests passed, then TypeScript and production build. The existing large-bundle warning remains. `rtk git diff --check` passed.
- Parent desktop browser review: 1440×1000 and 1100×850, readable pieces/IDs and vocabulary, no horizontal overflow. Manual Next, keyboard Enter, Previous/pause, Replay/autoplay completion, final disabled Next, and reduced-motion completed view with manual stepping passed. No browser errors were reported.
- Review evidence: `previews/chapter-99.2-tokenization-desktop.png`, `previews/chapter-99.2-tokenization-explanation.png`, and `previews/chapter-99.2-tokenization-reduced.png`. Desktop only; phone-specific behavior was not reviewed.

## Frozen decoder fixture · introduced in 99.3

Primary references checked on 2026-10-29: [Attention Is All You Need §3.4–3.5](https://arxiv.org/html/1706.03762v7) for learned embeddings and additive position information, and [Hugging Face glossary](https://huggingface.co/docs/transformers/glossary) for input/position IDs. This toy is decoder-only, not a reproduction of the paper's encoder–decoder architecture. It uses supplied, untrained embedding rows, **no √width embedding scaling**, and an authored absolute-position lookup rather than the paper's sinusoidal encoding. Production position methods vary.

`src/chapters/llmEmbeddings.ts` is the canonical frozen data source for 99.3–99.14. Its separate vocabulary has ID/embedding pairs: `0: The → [1,0,1,0]`; `1: ␠cat → [0,1,1,0]`; `2: ␠sat → [1,1,0,0]`; `3: . → [0,0,1,1]`; `4: <end> → [1,0,0,1]`. The space marker denotes an actual leading space. Unsupported IDs are rejected; this vocabulary has no unknown-token row. The end token has an embedding if explicitly supplied as context, but later generation must stop when it is selected and omit its marker from visible text. These IDs must not be interpreted using 99.2's independent tokenizer.

Hidden width is 4; context limit is 4 tokens. Positions are zero-based. Position rows 0–3 are `[0,0,0,0]`, `[1,0,0,0]`, `[0,1,0,0]`, `[0,0,1,0]`. Addition is elementwise with no extra scaling. The displayed ID 1 at position 1 gives `[0,1,1,0] + [1,0,0,0] = [1,1,1,0]`; at position 0 it gives `[0,1,1,0]`. `embedContext([1,1,2])` gives `[[0,1,1,0],[1,1,1,0],[1,2,0,0]]`. Positions outside 0–3, contexts over four tokens, invalid IDs and nonfinite/wrong-width vector inputs are rejected.

Future weights are frozen without implementing later stages: matrix entry at input row i/output column j is `(((3i + 2j + seed) mod 7) − 3) / 4`, with zero-based indices and row-vector × input-by-output matrix orientation. Two heads have Q/K/V shape 4×2 with seeds 1/2/3 and 4/5/6, zero biases, causal attention and score division by √2. Concatenate heads in order 0,1; output projection 4×4 uses seed 7. Post-residual layer normalization: `LN(x + attention(x))`, then `LN(x + FF(x))`, population variance, epsilon 0.00001, gamma all ones, beta all zeros. FF uses 4×8 seed 8 → ReLU → 8×4 seed 9. Independent untied logits projection 4×5 uses seed 10. Every bias is zero. This deterministic formula defines supplied parameters, not a training algorithm or a useful language model.

## 99.3 review record · 2026-10-29

- Parent inspected pure data/math, tests, component, CSS and routing diff. Lookup and addition match exact displayed values; repeated-token example separates token identity from position. The untrained provenance and position-method adaptation are visible. No remaining must-fix finding.
- `rtk npm run check`: 26 test files / 144 tests passed, TypeScript and production build passed (existing bundle-size warning). Tests cover exact rows, addition, repetition, bounds, dimensions and parameter conventions. `rtk git diff --check` passed.
- Desktop browser review at 1440×1000 and 1100×850: tables and arithmetic readable, no horizontal document overflow; keyboard Next, Previous pausing, replay/autoplay stopping, completed disabled Next and reduced-motion completed/manual stepping passed. No browser errors reported. Evidence: `previews/chapter-99.3-embeddings-desktop.png`, `previews/chapter-99.3-embeddings-reduced.png`. Phone-specific polish not reviewed.

## 99.4 neuron fixture and review · 2026-10-29

Sources inspected: [Attention Is All You Need §3.3](https://arxiv.org/html/1706.03762v7), [PyTorch Linear](https://docs.pytorch.org/docs/2.15/generated/torch.nn.Linear.html), and [PyTorch ReLU](https://docs.pytorch.org/docs/2.15/generated/torch.nn.ReLU.html). These support an affine weighted sum followed by ReLU in the position-wise feed-forward network. PyTorch stores linear weights output-by-input; this project explicitly uses input-by-output matrices instead. No PyTorch dependency is used.

`llmNeuron.ts` selects zero-based column 2 of the frozen 4×8 FF input matrix: weights `[0.5,-0.5,0.25,-0.75]`, bias `0`. For ID 1 at position 0, input `[0,1,1,0]` gives products `[0,-0.5,0.25,0]`, sum `-0.25`, ReLU output `0`. Position 1 changes only the input to `[1,1,1,0]`, giving products `[0.5,-0.5,0.25,0]`, sum/output `0.25`. Parameters do not change. This isolates one neuron using embedding-plus-position input; the full block's FF input will actually follow attention/residual/normalization. That distinction is visible in the lesson.

- Parent read pure helper/tests, component, CSS and routing diff. Displayed arithmetic agrees with hand calculation; weight/bias/parameter/dot-product/activation definitions precede their use. Supplied, untrained provenance is explicit. No remaining must-fix findings.
- `rtk npm run check`: 27 files / 147 tests passed; TypeScript and production build passed, with the existing large-bundle warning. Tests include signed/zero activation, bias placement, changed input, bad shapes, nonfinite inputs and overflow. `rtk git diff --check` passed.
- Browser at 1440×1000 and 1100×850: autoplay completion, input positions changing output 0 → 0.25, Previous/Next and keyboard Enter, reduced-motion completed/manual views, and no horizontal overflow/browser errors. Evidence: `previews/chapter-99.4-neuron-desktop.png`, `previews/chapter-99.4-neuron-reduced.png`. Desktop review only.

## 99.5 attention fixture and review · 2026-10-29

Source inspected: [Attention Is All You Need §3.2.1](https://arxiv.org/html/1706.03762v7), scaled dot-product attention. Frozen head 0 is used unchanged. Current query is the last token in context `[0,1,2]`, so every shown key is causally available; future-position masking and the second head are deferred to 99.6. Softmax is computed stably with max subtraction but taught here only as the labeled conversion; 99.8 opens its arithmetic.

Inputs: `[[1,0,1,0],[1,1,1,0],[1,2,0,0]]`. Current Q: `[0,1.5]`. K rows: `[[-0.75,0.25],[-0.25,-0.5],[0.75,-1.25]]`. V rows: `[[-0.25,0.75],[0.5,0.25],[1.5,-0.5]]`. Dot products: `[0.375,-0.75,-1.875]`, divided by √2 → approximately `[0.265165,-0.530330,-1.325825]`. Softmax → `[0.604199863765,0.272710260472,0.123089875763]`; weighted value sum → `[0.169939977939,0.459782525060]`. The UI rounds to four decimals and labels that approximation. This is one head's output, not the full model prediction or evidence of reasoning/causation.

- Parent inspected math/tests, UI/CSS and routing. Exact QKV rows, visible dot products/stacked score fractions, optional weight tables and weighted-sum arithmetic match the frozen data. No remaining must-fix findings.
- `rtk npm run check`: 28 files / 150 tests passed; TypeScript/build passed (existing bundle warning). Fixture tests check projections, scale, normalized weights and output, stable softmax and malformed inputs. `rtk git diff --check` passed.
- Browser at 1440×1000 and 1100×850: autoplay completes, final Next disables, keyboard/manual stepping and reduced-motion completed/manual views work. Weight details open and tables scroll within their container; no document overflow/browser errors. Screenshots: `previews/chapter-99.5-attention-desktop.png`, `previews/chapter-99.5-attention-projections.png`. Desktop review only.

## 99.6 causal two-head fixture and review · 2026-10-29

Source inspected: [Attention Is All You Need §§3.1, 3.2.2–3.2.3](https://arxiv.org/html/1706.03762v7). Reuse both frozen heads, concatenate in head order and multiply by the frozen output projection. The implementation normalizes each allowed score prefix and pads future weights with exact zeros; this is equivalent to replacing future scores with −∞ **before** softmax, not zeroing an already-normalized full row. Each token may use its own value.

For context `[0,1,2]` query position 0, both heads have weights `[1,0,0]`. Head outputs are `[-0.25,0.75]` and `[1.25,-1.25]`; concatenation `[-0.25,0.75,1.25,-1.25]` projects to `[1.4375,-0.5,-1.5625,0.875]`. Replacing the last ID with 3 changes neither earlier query's weights, mixtures, concatenation nor projected output. No weights were changed or trained.

- Parent inspected helper/tests, UI/CSS and routing. Future cells have explicit blocked labels/zero weights; row/column roles, diagonal permission, concatenation versus addition, dimensions and output projection weights are visible. No remaining must-fix findings.
- `rtk npm run check`: 29 files / 154 tests passed, TypeScript/build passed (existing bundle warning). Tests cover hand first-row fixture, future zeros, row sums, self-attention, earlier-output invariance, concat/projection and invalid context/shape. `rtk git diff --check` passed.
- Desktop browser at 1440×1000 and 1100×850: two grids, query selection, last-token changes preserving the selected earlier output, autoplay/manual keyboard stepping, final disabled Next and reduced-motion completed/manual views passed; tables have contained scrolling, no document overflow or browser errors. Evidence: `previews/chapter-99.6-causal-grids.png`, `previews/chapter-99.6-causal-mask.png`. Desktop only.

## 99.7 full-block fixture and review · 2026-10-29

Sources inspected: [Attention Is All You Need §§3.1, 3.3](https://arxiv.org/html/1706.03762v7), [PyTorch LayerNorm](https://docs.pytorch.org/docs/2.15/generated/torch.nn.LayerNorm.html). Frozen post-residual normalization is used unchanged: attention → add original input → normalize → FF4×8/ReLU8×4 → add normalized input → normalize. Each normalization operates within one token's four coordinates using population variance and epsilon 0.00001, gamma 1/beta 0. No additional final normalization is added.

Context `[0,1,2]`, position0: input `[1,0,1,0]`; attention `[1.4375,-0.5,-1.5625,0.875]`; residual1 `[2.4375,-0.5,-0.5625,0.875]`; mean0.5625, variance1.501953125; norm1 ≈ `[1.529930268469,-0.866960485466,-0.917958161081,0.254988378078]`; FF ≈ `[0.194428638285,0.223114830818,-0.529100884512,-0.500414691978]`; residual2 ≈ `[1.724358906754,-0.643845654647,-1.447059045594,-0.2454263139]`; final row ≈ `[1.608548386188,-0.420571224912,-1.108778683858,-0.079198477418]`. Hidden8 pre/post-ReLU arrays are recorded in `llmBlock.test.ts` and inspectable in the lesson.

- Parent reviewed math/tests, diagram/CSS and publication diff; normalization now returns an explicit width-4 tuple without an unchecked double cast. Sequential arrows and two residual bypass paths match the documented order; definitions, dimensions, selected-row values and normalization arithmetic are readable. No remaining must-fix findings.
- `rtk npm run check`: 30 files / 158 tests passed, TypeScript/build passed (existing bundle warning). Tests cover full fixture, population variance/epsilon, constant row, ReLU dimensions, finite results, causal invariance and invalid inputs. `rtk git diff --check` passed.
- Browser at 1440×1000 and 1100×850: autoplay completes, final Next disables, manual/keyboard stepping and reduced-motion completed/manual views work; hidden-row/weight details open, no document overflow/browser errors. Evidence: `previews/chapter-99.7-block-path.png`, `previews/chapter-99.7-normalization.png`. Desktop only.

## 99.8 logits/softmax fixture and review · 2026-10-29

Sources inspected: [Attention Is All You Need §3.4](https://arxiv.org/html/1706.03762v7), [SciPy softmax documentation](https://docs.scipy.org/doc/scipy/reference/generated/scipy.special.softmax.html) for normalized exponentials and stable shifting. No SciPy dependency is used. `llmLogits.ts` reuses the existing block, generic linear row helper and stable softmax; no extra normalization or changed weights.

Separate arithmetic example `[0,1,2]` has exponentials `[1,e,e²]`, sum ≈11.107337927390, probabilities ≈`[0.090030573170,0.244728471055,0.665240955775]`. Max subtraction gives `[-2,-1,0]` with the same probabilities. Displayed rounded arithmetic uses approximation signs, not false exact equalities.

Actual last-token hidden row for `[0,1,2]` ≈`[-0.355100919479,1.662450893320,-0.296691870927,-1.010658102914]`; frozen4×5 projection gives logits ≈`[0.815682086265,-0.324955296946,0.296471312142,0.815682086265,-2.093606977045]`; probabilities ≈`[0.336800168341,0.107646466465,0.200392713360,0.336800168341,0.018360483493]` in canonical vocabulary order. Equal first/fourth logits are intentional consequences of the frozen fixture, not learned language ability.

- Parent inspected helper/tests/UI/CSS/routing and fixed the rounded exponential-sum wording. Definitions distinguish scores/probabilities; the three-score example is clearly separate from five-token output. No remaining must-fix finding.
- `rtk npm run check`: 31 files / 161 tests passed; TypeScript/build passed, existing bundle warning. Tests cover exact projection fixture, normalization, equal-score uniformity, common-shift invariance, ordering and extreme finite scores. `rtk git diff --check` passed.
- Browser1440×1000 and1100×850: readable fractions, probability bars on0–100% scale, inspectable projection, autoplay/manual/keyboard stepping, final disabled Next and reduced-motion completed/manual views passed. No document overflow/browser errors. Evidence: `previews/chapter-99.8-logits.png`, `previews/chapter-99.8-softmax.png`. Desktop only.

## 99.9 sampling fixture and review · 2026-10-29

Sources inspected: Hugging Face [generation configuration](https://huggingface.co/docs/transformers/main/en/main_classes/text_generation) and [generation utilities](https://huggingface.co/docs/transformers/main/en/internal/generation_utils) for temperature and sampling/greedy distinctions. The lesson divides the unchanged 99.8 logits by positive finite temperature and applies the shared stable softmax; controls offer0.5,1,2. Random selection changes neither logits nor model weights. No top-k/top-p is introduced.

Teaching PRNG: unsigned32-bit LCG, `next = (1664525 × state + 1013904223) mod 2^32`, draw=`next/2^32`. Seed42 yields state1083814273/draw≈0.252345174784; next state378494188/draw≈0.088125045411. AtT1 the first draw selects `The`. Reset seed restores the first draw. Half-open cumulative intervals `[start,end)` skip zero-probability entries; floating-point remainder is assigned to the last nonzero interval. Greedy resolves numerical near-ties by earliest vocabulary index with tolerance `1e-12 × max(1,abs(maxScore))`; the current `The`/`.` near-tie and its tolerance are disclosed. The generator is deterministic teaching code, not a production or cryptographic sampler.

- Parent inspected helper/tests/UI/CSS/routing. Interval widths and probabilities agree; selected row and draw marker are linked, temperature changes the distribution without changing frozen parameters. No remaining must-fix findings.
- `rtk npm run check`:32 files/165 tests passed, TypeScript/build passed with existing bundle warning. Tests cover temperature domain/sharpening/flattening, normalization, golden seeded sequence, reset reproducibility, interval boundaries/zero probabilities and greedy ties. `rtk git diff --check` passed.
- Browser1440×1000 and1100×850: autoplay completes, Next draw/reset reproduce0.088125/0.252345, temperature2 flattens bars, manual/keyboard stepping and reduced-motion completed/manual views work. No document overflow/browser errors. Evidence:`previews/chapter-99.9-sampling.png`, `previews/chapter-99.9-temperature.png`. Desktop only.

## 99.10 actual classifier training and review · 2026-10-29

Sources inspected: Google ML Crash Course [sigmoid](https://developers.google.com/machine-learning/crash-course/logistic-regression/sigmoid-function), [log loss](https://developers.google.com/machine-learning/crash-course/logistic-regression/loss-regularization), [gradient descent](https://developers.google.com/machine-learning/crash-course/linear-regression/gradient-descent); Hugging Face [causal language modeling](https://huggingface.co/docs/transformers/tasks/language_modeling) supports the brief next-token-learning connection. This logistic classifier has two weights and one bias and genuinely fits them; it neither trains nor modifies the supplied decoder.

Authored quiz records `(study hours, practice hours, passed)` are A`(0,0,0)`, B`(1,0,1)`, C`(0,1,0)`, D`(1,1,1)`. Inputs are bounded0–1 hours. Initial `(w1,w2,b)=[0,0,0]`; all probabilities0.5, all losses ln2≈0.693147180560. Average gradient`[-0.25,0,0]`; learning rate0.5 gives first parameters`[0.125,0,0]`. Batch-average binary cross-entropy uses stable softplus; sigmoid uses sign-aware exponentiation. Eight updates maximum, deterministic reset/recomputed Previous, final loss≈0.513563. Current parameters and all records remain visible; the unexecuted next-update preview is explicitly labeled at the eight-update cap.

Separate new-student controls offer0.25/0.5/0.75 hours for each feature; they change prediction only, never fitting data or parameters. No observed outcome is supplied, so this prediction is explicitly not an evaluation. Training-set improvement is not evidence of generalization.

- Parent read helper/tests/component/styles/routing and corrected completed-state preview wording. Forward pass, one-target loss, average loss, gradient contributions and all parameter updates are visible with mathematical fractions. No remaining must-fix findings.
- `rtk npm run check`:33 files/170 tests passed, TypeScript/build passed (existing bundle warning). Tests include hand initial loss/gradient/update, finite-difference gradients for all3 parameters, deterministic decreasing loss, prediction isolation, extreme scores and invalid domains. `rtk git diff --check` passed.
- Browser1440×1000 and1100×850: first update changes B/D probabilities to0.5312, autoplay stops at8, reset restores all-zero parameters, held-out study change alters prediction without parameters, keyboard/manual stepping and reduced-motion completed/manual views passed. No document overflow/browser errors. Evidence:`previews/chapter-99.10-training-first-update.png`, `previews/chapter-99.10-training-calculations.png`. Desktop only.

## 99.11 training-stage sources and review · 2026-10-29

Primary references: [Ouyang et al., InstructGPT](https://arxiv.org/html/2203.02155), §§1,3.1/Figure2,3.5 for demonstrations→SFT, ranked responses→reward model→PPO, and persistent mistakes; [Rafailov et al., DPO](https://arxiv.org/html/2305.18290), §§1,3–4 for direct preference-policy optimization without a separately fitted reward model or RL loop. These describe particular recipes, not universal stages required for every model.

Authored common scenario: text “The sky looks blue because air scatters sunlight” with target `blue` after “The sky looks”; instruction “Explain why the sky looks blue in one sentence” with a scattering explanation; preferred scattering response versus rejected ocean-reflection explanation. The token target is illustrative, not a claim about production segmentation. Response-only SFT loss is described as common/configurable, not mandatory. Preference branches are alternatives, not DPO after reward-model/RL. The example illustrates comparison labels, not a training run or guarantee of truthfulness.

- Parent inspected full component/styles/routing and reviewed data/objective distinctions, arrows and beginner wording. All stages remain visible during highlighting. No remaining must-fix finding.
- `rtk npm run check`:33 files/170 tests passed, TypeScript/build passed (existing bundle warning). Routing tests cover publication and canonical/legacy routes; no trivial markup tests added. `rtk git diff --check` passed.
- Browser1440×1000 and1100×850: readable examples/branch connectors, autoplay stopping, disabled final Next, keyboard/manual highlights and reduced-motion final/manual view passed; no document overflow/browser errors. Evidence:`previews/chapter-99.11-preference-paths.png`, `previews/chapter-99.11-training-data.png`. Desktop only.

## 99.12 runtime context fixture and review · 2026-10-29

Sources inspected: [Lewis et al., RAG](https://arxiv.org/abs/2005.11401), abstract for parametric versus retrieved memory; OpenAI [function-calling flow](https://developers.openai.com/api/docs/guides/function-calling) and [conversation state/window management](https://developers.openai.com/api/docs/guides/conversation-state). Storage is not parameter learning, retrieved content is not automatically correct, a tool request is not execution, and real model windows/tokenization differ.

Authored local fixture: user “What time does the North library close on Thursday?”; optional note “Preferred branch: North”; optional retrieved passage “North branch guide: Thursday hours 9 AM–8 PM.” Tool request `lookup_hours(branch: North, day: Thursday)` is authored output retained for a subsequent request; the application fixture supplies “North branch, Thursday: closes at 8 PM.” A labeled authored response preview repeats8PM; no model/search/external service runs. Missing retrieval inserts no passage and does not suppress a separately executed tool result.

Budget deliberately uses **one whole-message teaching unit**, including role/text, not words or real tokens. Windows6/4, one reserved output unit. Default first request has3 messages; after tool request+result,5 input units+1 reserved=6. Window4 permits the first request but stops the next generation after application execution because6>4; no messages are silently discarded. At step1 the retained tool request is a draft for the next request, not input to the generation that produced it. The exact messages and their boundary labels are visible.

- Parent inspected helper/tests/UI/CSS/routing. Stored-note/retrieval insertion, tool sequencing, next-request boundary and authored-preview limits are explicit. No remaining must-fix findings.
- `rtk npm run check`:34 files/174 tests passed, TypeScript/build passed with existing bundle warning. Tests verify exact assembly, optional omission, requested-versus-executed distinction, budget/reserve failure and invalid options. `rtk git diff --check` passed.
- Browser1440×1000 and1100×850: autoplay completion, missing passage removed from context, request stage contains no execution result, window4 stops/disabled Next, keyboard/manual stepping, reduced-motion completed/manual view passed. No document overflow/browser errors. Evidence:`previews/chapter-99.12-request-context.png`, `previews/chapter-99.12-context-limit.png`. Desktop only.

## 99.13 evaluation cases and review · 2026-10-29

Sources inspected: [TruthfulQA](https://arxiv.org/abs/2109.07958), abstract/benchmark methodology, and [HELM](https://arxiv.org/abs/2211.09110), abstract/evaluation framework. These support probing truthfulness and scenario-specific multidimensional evaluation with coverage limits. No historical benchmark numbers or broad current-model capability claims are repeated.

Five authored outputs, not actual inference: A correctly answersNorthThursday8PM from supplied evidence; B rephrasesA but answers6PM; C guesses8PM correctly against an independent evaluator reference with no hours in runtime context; D asks which branch whenNorth8PM/South6PM are both possible; E incorrectly extends regular8PM hours to a holiday with unknown hours. Explicit human judgments are data in `llmEvaluation.ts`, not a general-purpose automatic grader.

Supported factual accuracy=1/2(A/B only); groundedness=1/4(A/B/C/E claims, excludingD's question); uncertainty handling=1/3(C/D/E missing or ambiguous evidence); robust rephrasing=0/1(A/B must agree AND both match reference). C demonstrates correct≠grounded, excluded from supported-answer accuracy. D/E do not have a single known factual answer and are scored separately for uncertainty. Authored cases are distinct from99.10's fitting data, but do not establish measured held-out performance. A real held-out set must not be used to fit/tune the system.

- Parent inspected case data/tests/UI/CSS/routing; checked every judgment, eligibility denominator and robustness rule. Task-specific rules and coverage caveat are visible. No remaining must-fix findings.
- `rtk npm run check`:35 files/178 tests passed, TypeScript/build passed with existing bundle warning. Tests verify exact totals, exclusions, correct-but-unsupported distinction and consistency-plus-reference requirement. `rtk git diff --check` passed.
- Browser1440×1000 and1100×850: case selection shows matching evidence/output/verdicts, counts1/2,1/4,1/3,0/1; autoplay completes, keyboard/manual case navigation and reduced-motion final/manual view work. No document overflow/browser errors. Evidence:`previews/chapter-99.13-evaluation-guess.png`, `previews/chapter-99.13-evaluation-ambiguity.png`. Desktop only.

## 99.14 pipeline fixtures and chapter review · 2026-10-29

Integration reuses the prior source-backed stages unchanged: strict decoder text lookup, fixed embedding/position rows, causal two-head post-norm block, frozen independent logits projection, stable softmax, seeded categorical selection or documented greedy near-tie handling. No API, downloaded model, dependency, learned parameter change, sliding window or shifted position convention is introduced. `llmPipeline.ts` is the bounded orchestrator, not a second math implementation.

Sample fixture: prompt`The`/IDs`[0]`, temperature1, seed168, cap4. Draws≈`[0.3011767806,0.5167994560,0.8505235130,0.8866163706]` select`[1,2,3,4]` from contexts`[0]`, `[0,1]`, `[0,1,2]`, `[0,1,2,3]`; visible output`The cat sat.`, stop`end`. The special end is recorded but neither decoded as prose nor fed back. Greedy cap2 selects`[1,1]`, output`The cat cat`, stop`length-cap`. A non-end selected from four input tokens is retained in output but stops with`context-cap` before a fifth-token forward pass. The returned text/context may therefore hold five ordinary IDs at that terminal boundary; no subsequent embedding lookup is attempted. Literal`<end>`, empty/unsupported or overlong prompt text are rejected; decoder vocabulary is separate from99.2's toy lookup.

- Parent read all new files and routing diff and reviewed the assembled lesson as a learner. The connected overview, token/stage selection, exact arrays/shapes and optional weight details reuse prior values. Training/parameters/retrieval/tools boundaries and practical Common use cases/Note are explicit. No remaining must-fix findings.
- `rtk npm run check`:36 files/182 tests passed, TypeScript/build passed with existing bundle warning. End-to-end tests verify sampled IDs/draws/text, end and cap behavior, repeatability, strict tokenization, context bounds, prior-stage intermediate consistency and option errors. `rtk git diff --check` passed.
- Browser1440×1000 and1100×850: sampled completion shows`The cat sat.`/end, greedy completion shows`The cat cat`/length cap; stage/token selectors, expanded block details, keyboard transition from token1/stage8 to token2/stage1, autoplay stopping and reduced-motion completed/manual views passed. Tables scroll within the trace, no document overflow/browser errors. Evidence:`previews/chapter-99.14-pipeline-block.png`, `previews/chapter-99.14-pipeline-complete.png`, `previews/chapter-99.14-pipeline-embeddings.png`.
- Chapter-level reconciliation: fourteen separate lesson increments now preserve the teaching order, frozen decoder fixture and three distinct demonstration boundaries (authored lookup tree, supplied decoder, genuinely trained classifier). Earlier per-lesson desktop evidence remains valid for unchanged lesson components. Phone-specific polish and real-world model performance are outside verification scope.

Historical review note: screenshot paths under `previews/` refer to temporary evidence removed during repository cleanup. The written findings remain available here.
