# Chapter 99 · Large Language Models

Status: 99.1–99.4 implemented and reviewed; tests/build and desktop browser review passed. Lessons 99.5–99.14 are outlines only. Full implementation plan: `../plan_llm.md`.

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
5. **99.5 Attention: queries, keys, and values** — outline.
6. **99.6 Causal masking and multiple heads** — outline.
7. **99.7 A Transformer block** — outline.
8. **99.8 Logits and softmax** — outline.
9. **99.9 Sampling and temperature** — outline.
10. **99.10 Training: loss and gradients** — outline.
11. **99.11 Pretraining, instructions, and preferences** — outline.
12. **99.12 Context, memory, retrieval, and tools** — outline.
13. **99.13 Limitations and evaluation** — outline.
14. **99.14 The full LLM pipeline** — outline.

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
- `course.test.ts` now checks that only 99.1–99.4 enter published pagination while 10 future sections remain outlines.
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
