# Chapter 98 · Computer Vision

Status: all twelve lessons implemented and reviewed, with one scoped commit per lesson. Chapter97's final workflow was completed first. Plan: `../plan_computer_vision.md`; final review: `CHAPTER_98_REVIEW.md`.

## 98.12 implementation and learner review

Five focused patch tests verify the fixed projection, complete reconstruction/order for H1/H3, vector dimensions, exact worked patch values and immutability. All277 tests, TypeScript/build and whitespace checks passed (`tmp/vision-9812-check.log`). Desktop1440×900 keyboard review covered workflow steps, V4 prediction/evaluation and patch selection. The final browser check reconfirmed H3 patch4 arithmetic `[1,0,.5]+[.5,0,0]=[1.5,0,.5]` and the next link to99.1. Inspected `tmp/vision-9812-final.png`; V4 screenshot retained too.

Source/process and learner review confirm actual fitted-head outputs, label/fitting/inference boundaries, complete ungated workflow with Common use cases/Note, and a clearly schematic ViT encoder/head separate from computed toy patch arithmetic. Review added a labelled confusion table; no remaining must-fix finding. A chapter-wide desktop sweep rendered all12 canonical routes at1440px without page-level horizontal overflow and confirmed predecessor links (`tmp/vision-chapter-desktop-sweep.json`). Final browser error list was empty. Static workflow/patch controls have no playback dependency. Existing bundle warning remains.

## 98.11 implementation and learner review

Four focused tests verify all16 transformed feature/probability references, exact confusion matrices/metrics, undefined denominators, source-group membership and preserved inputs/fitted head. All272 tests, TypeScript/build and whitespace checks passed (`tmp/vision-9811-check.log`). Desktop1440×900 review checked all presets (3/4,2/4,3/4,4/4), keyboard-selected shiftedH4's error cell and traced its ID/input/prediction, then inspected corner-noiseV4. Inspected `tmp/vision-9811-shift.png`.

Review fixed gray0.5pixel-label contrast: browser verification confirms foregroundrgb(34,34,34) onrgb(128,128,128), while binary1 remains white-on-black. Source/process and learner reviews confirm observed/predicted orientation, record-linked metrics, unchanged fit, sample-size limitations and hypothetical shortcut-learning boundary. No remaining must-fix finding. Static controls have no playback dependency. Existing bundle warning remains.

## 98.10 implementation and learner review

Five focused tests cover supplied fixtures, identical/disjoint/touching/partial/contained/degenerate boxes, null empty unions, exact mask counts, inclusive score thresholds and immutability. All268 tests, TypeScript/build and whitespace checks passed (`tmp/vision-9810-check.log`). Desktop1440×900 review keyboard-edited the box to perfect agreement and reset, filtered candidate2 at0.7 and both candidates at0.9, toggled the extra mask pixel to reach IoU1 and reset. Inspected `tmp/vision-9810-box.png` and `tmp/vision-9810-mask.png`.

Process/source and learner reviews confirm continuous box area versus discrete mask counts, visible intersection/union calculations, ordered bounded edge inputs, unchanged references, text/line-style/color legends, and an explicit independent-comparison notice when score filtering hides candidate1. No remaining must-fix findings. Candidate scores/geometry are supplied, not model outputs; no detection matching/NMS is executed. Static controls have no animation dependency. Existing bundle warning remains.

## 98.9 implementation and learner review

The conceptual pretrained-backbone diagram is separate from the20/18parameter counting analogy, derived from the existing tiny architecture. Neither toggle performs fine-tuning. All263 tests, TypeScript/build and whitespace checks passed (`tmp/vision-989-check.log`); no trivial markup tests were added. Desktop1440×900 keyboard review verified38trainable/0frozen and18trainable/20frozen, gradient-status text and the frozen-backbone explanation. Inspected `tmp/vision-989-finetune.png`; frozen screenshot retained too.

Source/process and learner reviews confirm pretraining versus authored filters, replacement head, qualitative small-data guidance and no invented speed/accuracy claims. No remaining must-fix finding. No animation dependency or downloaded model. Existing bundle warning remains.

## 98.8 implementation and learner review

Six focused tests establish exact loss history/final parameters, held-out predictions including V4's failure, all18 analytical gradients versus central differences at zero and nonzero parameters, deterministic reset, frozen filters, independent history snapshots and extreme-logit stability. A leakage check alters held-out data/labels and confirms fitted parameters/training loss stay unchanged. All263 tests, TypeScript/build and whitespace checks passed (`tmp/vision-988-check.log`).

Desktop review at1440×900 keyboard-stepped epoch1 (train loss0.6099), fitted200epochs (train0.0166/test0.5097), inspected V4's zero features and wrong class, selected V3, and reset both losses to0.6931. All head parameter columns remain available. Inspected `tmp/vision-988-final.png`. Review clarified tie behavior and that the displayed next update after epoch200 is hypothetical, not applied. Source/process and learner review found no remaining must-fix issue: actual head-only fitting, complete data split, visible parameter arithmetic and computation-derived curves are explicit. No animation dependency. Existing bundle warning remains.

## 98.7 implementation and learner review

Five focused tests lock every corpus record/feature vector, the complete H1 tensors, supplied head scores/probabilities, fixed filters, immutability and large-logit softmax stability. All 257 tests, TypeScript/build and whitespace checks passed (`tmp/vision-987-check.log`). Desktop review at 1440×900 covered keyboard stage/held-out input selection, H1 scores1.5/−1.5 and probabilities95.26%/4.74%, and V3 equal supplied-head scores. Inspected `tmp/vision-987-score.png`; input screenshot also retained.

Process/source and learner reviews confirm explicit hand-chosen filters/head, distinct observed labels versus network inputs, complete selectable intermediate arrays, all18 head parameters, connected stage shapes and one full score/softmax calculation. No remaining must-fix findings. Static selection has no playback dependency; this lesson does not train. Existing bundle warning remains.

## 98.6 implementation and learner review

Three focused tests check complete ReLU/pooled tensors, unused-border exclusion, the information-loss comparison and immutability. Initial full validation caught an overly narrow literal-array reduce type; explicitly typing the readonly comparison arrays as numeric arrays fixed the build without changing data. All 252 tests, TypeScript/build and whitespace checks subsequently passed (`tmp/vision-986-check.log`).

Desktop review at 1440×900 exercised both channels, all four pooling windows and keyboard selection. Inspected `tmp/vision-986-y.png`: signed inputs remain visible, ReLU contributors are outlined, unused border is hatched, and the comparison retains visible averages and equal maxima. Source/process and learner reviews found no remaining must-fix issues. No animation dependency. Existing bundle warning remains. Future CNN source preparation below was independently recomputed before adoption; no future lesson is published by these notes.

## 98.5 implementation and learner review

Five focused tests verify all stride/padding combinations, complete x/y maps, border zeros, sampled coordinates and input immutability. All 249 tests, TypeScript/build and whitespace checks passed (`tmp/vision-985-check.log`). Desktop review at 1440×900 exercised the four configurations and keyboard selection in the y map. Inspected screenshot `tmp/vision-985-padding.png`; paired stride/padding screenshot also retained. Final copy clarifies floor notation and original-coordinate limits for padded cells.

Source/process and learner reviews confirm two independent filters read one shared input, added zeros are visibly hatched, selected receptive fields stay aligned after toggles, and output dimensions match the arithmetic. No remaining must-fix findings. No playback or animation dependence. Existing bundle warning remains.

## 98.4 implementation and learner review

Pure filter calculations preserve every signed output and the blur numerator/divisor convention; four focused tests compare full reference matrices, representative products/sums and input immutability. All 244 tests, TypeScript/build and whitespace checks passed (`tmp/vision-984-check.log`). The input window, kernel, feature map and nine products remain readable without playback.

Desktop review at 1440×900 checked keyboard center selection, exact 10/9 blur calculation, both signed gradients, manual pause, natural autoplay completion at position9 with Replay, and reduced-motion completed position with autoplay disabled. Review clarified actual blur weights versus displayed numerators and fixed intermediate-response label contrast without changing data colors; measured minimum text contrast 4.83:1. Inspected screenshot `tmp/vision-984-contrast.png`; additional blur/x screenshots are in `tmp/`. No remaining must-fix findings. Synthetic intensities use an explicitly inverted display scale (white0/dark2); signed gradients retain a separate −6…+6 scale. Existing bundle warning remains.

## 98.3 implementation and learner review

Six independent preparation presets compute the image, masks and boxes together. Seven tests check exact dimensions/coordinates/counts, RGB/mask alignment at every pixel, removal of the cropped object and preservation/restoration of the original. All 240 tests, TypeScript/build and whitespace checks passed (`tmp/vision-983-check.log`). Desktop review at 1440×900 exercised stretch, fit, keyboard crop selection, mask view, flip and reset. A final browser check after wording clarification reconfirmed crop removal and invalidation of the original image-level label. Screenshots: `tmp/vision-983-stretch.png`, `tmp/vision-983-crop.png`, `tmp/vision-983-final.png`.

Code and learner review found no remaining must-fix issues: dimensions are explicitly width×height; flip pixel indices are distinguished from box edges; the separate direction example does not introduce new labels for the squares. Static preset controls have no animation dependency. No real-image pipeline or general interpolation library is claimed. Existing bundle warning remains.

## 98.2 implementation and learner review

`VisionPixels` exposes RGB/channel/grayscale views, zero-based coordinates, arrow-key pixel selection, bounded channel edits and reset. Three focused tests check grayscale rounding, normalization endpoints and immutable single-channel edits. Removed an unnecessary double type assertion during review; rendered RGB triples are typed explicitly. The grayscale arithmetic now uses a stacked fraction consistent with the project's formula convention.

All 233 tests, TypeScript/build and whitespace checks passed. Desktop review at 1440×900 selected a pixel by keyboard, changed red 40→200, observed only the chosen pixel change and grayscale 102→150, then reset to 102. Screenshot inspected: `tmp/vision-982-fraction.png`. No remaining must-fix finding. No animation or external model; reduced-motion playback checks are not applicable. Existing bundle warning remains.

## 98.1 implementation and learner review

`VisionTasks.tsx` compares four output types using the immutable `visionScene.ts` fixture; no model runs. Exact scene, boxes, semantic counts, binary-mask shapes and immutability have four numerical fixture tests. Routing checks cover the canonical/legacy links, 97→98→99 order and exclusion of the eleven unfinished outlines from pagination. All 230 tests, TypeScript/build and whitespace checks passed. Earlier publication tests needed their explicit supplementary-chapter allowlists updated for Chapter98.

Desktop review at 1440×900 exercised detection coordinates, semantic counts and keyboard selection of instance segmentation. The same input remains visible beside each task output; masks separate the same-class objects and authored annotations are explicitly labelled. No must-fix findings remained. Screenshot: `tmp/vision-98-1-instance-review.png`. No animation is used, so autoplay/reduced-motion playback is not applicable. Review boundary: tiny authored geometry, not real image recognition. Existing production bundle warning remains.

## Supplementary source boundary

This is supplementary authored teaching material, not a reproduction of a matching local PDF, subtitle or workbook chapter. Targeted discovery identified no matching Chapter98 source assets. Original course materials remain read-only. Preserve prior course examples and Chapter97/99 routes. All initial fixtures are authored tiny grids/scenes, with no camera, upload, downloaded dataset/model, API or backend.

Targeted primary references for initial lessons: [TorchVision detection/segmentation tutorial](https://docs.pytorch.org/tutorials/intermediate/torchvision_tutorial.html), [PyTorch image-classifier tutorial](https://docs.pytorch.org/tutorials/beginner/blitz/cifar10_tutorial.html), [NumPy array shape](https://numpy.org/doc/stable/reference/generated/numpy.ndarray.shape.html). These support task/output and array conventions; no PyTorch, NumPy, CIFAR-10 or detector runs in the browser. Reinspect task-specific passages before each implementation.

## Ordered lesson boundaries

1. **98.1 What can a computer see?** Same authored scene, label/boxes/class masks/instance masks. Supplied annotations, not model predictions.
2. **98.2 An image is a grid of numbers.** Exact RGB bytes, row/column inspector, optional grayscale and byte scaling.
3. **98.3 Preparing images without changing the task.** Explicit transforms with aligned image/box/mask coordinates; label-preservation limits.
4. **98.4 A filter slides over an image.** Separate5×5 grayscale fixture and signed3×3 cross-correlation arithmetic; freeze before implementation.
5. **98.5 Stride, padding and feature maps.** Same filter fixture, exact dimensions and sampling positions.
6. **98.6 Activations and pooling.** Signed responses, ReLU,2×2 pooling and information loss.
7. **98.7 Inside a small CNN.** Separate6×6 grayscale pattern corpus, two authored kernels and8-feature output head; freeze before implementation.
8. **98.8 How does a vision model learn?** Actually fit only the head on fixed features, with documented deterministic initialization/rate/split. No end-to-end CNN training claim.
9. **98.9 Reusing learned features.** Explain transfer/fine-tuning; authored filters are an analogy, not pretrained weights.
10. **98.10 From labels to boxes and masks.** Authored scene/reference annotations and supplied candidate predictions, explicit IoU/matching conventions.
11. **98.11 Test the model beyond familiar images.** Actual fitted head on documented perturbations; separate detection examples if needed.
12. **98.12 Follow the full vision pipeline.** Reuse computed tensors/training boundary; brief patch/encoder comparison with Chapter99 decoder distinctions.

## Frozen scene for98.1–3

Image dimensions: height6, width6, channels3; row-major array `[row][column][channel]`, channel order RGB. Top-left origin; row increases down, column increases right; zero-based pixel indices0–5. RGB values are integer bytes0–255, not pre-normalized intensities.

Colors: background B=(240,232,210); teal T=(40,130,120); orange O=(220,140,60). Exact scene:

```text
B B B B B B
B T T B B B
B T T B B B
B B B O O B
B B B O O B
B B B B B B
```

Author-supplied image-level label: **two colored squares**. Two objects have the same semantic class **square**, with stable IDs square1 (teal) and square2 (orange). Continuous XYXY box edges use half-open regions `[x1,x2) × [y1,y2)`: square1=[1,1,3,3], square2=[3,3,5,5]. Each box area4; no inclusive-coordinate +1. Colors distinguish instances, not two different semantic classes.

Semantic mask is6×6 integer class IDs: background0, square1 (class ID1, not instance ID). Its eight foreground pixels are exactly the T/O cells above;28 background pixels. Instance-ID display mask uses background0, square1=1, square2=2. Two binary instance masks, each6×6 with four ones, form a2×6×6 output. Each binary mask corresponds to its box/object ID; instance masks are not a third semantic class.

Task output shapes: image classification one supplied label; detection two boxes with class labels (2×4 coordinates plus2 labels); semantic segmentation6×6 class IDs; instance segmentation2×6×6 binary masks with object labels. Displayable combined instance-ID map is a derived convenience, not a replacement for the documented output shape. Annotation choices are not inferred from the image by any model.

For98.2, optional grayscale convention is rounded weighted byte intensity `round((299R+587G+114B)/1000)`; normalized RGB/intensity divides bytes by255, separate from mean/std standardization. Any pixel edit must be represented as an exploratory image edit, not silently reusing annotations as model predictions. For98.3, horizontal flip maps pixel column c→5−c and box edges x→6−x (new left=6−old right, new right=6−old left). Categorical masks use nearest-neighbor resampling; resize/crop/padding conventions must be frozen before implementation.

## Later mathematical contracts

### Frozen 98.12 workflow and ViT comparison

Reuse actual200epoch head fitting and the same CNN forward pass. Default separate prediction inputH3; allow other held-out IDs. Workflow: data/split and quality → preparation/dimensions → fixed representation → head fitting or fitted-model inference → scores/probabilities → held-out evaluation/error review. Labels enter only fitting/evaluation, not the prediction feature input. All workflow steps stay visible and selectable, with task/tools/output and practical next action. Common use cases should separately name image labels, object boxes and pixel masks; Note should emphasize task-specific checks and that every tool is not mandatory.

ViT source: Dosovitskiy et al., [§3.1](https://arxiv.org/abs/2010.11929), readable [paper HTML](https://ar5iv.labs.arxiv.org/html/2010.11929#S3.SS1). It describes flattened non-overlapping patches, a trainable linear projection, added positional embeddings and a Transformer encoder. A prepended learnable class token provides an image representation to a classification head. Encoder patch attention is not the causal next-token decoder mask shown in Chapter99. No benchmark or current-ranking claim is needed.

Toy arithmetic only: split the same6×6 single-channel input into nine non-overlapping2×2 patches, row-major order, four values per patch read row-major. Use a fixed authored projection `[[1,0,0,0],[0,1,0,0],[0,0,.5,.5]]`, zero bias, giving three-dimensional patch vectors. Position for patch grid(r,c), r/c0–2, is the authored vector`[r/2,c/2,0]`; add elementwise. For H1 patch4 (zero-based index3, patchrow1/col0), values`[1,1,1,1]`→projection`[1,1,1]`→positionadded`[1.5,1,1]`. For defaultH3's same patch: `[1,0,1,0]`→`[1,0,.5]`→`[1.5,0,.5]`. These positions are a small explicit teaching convention, not a claim about the paper's learned positional values. A schematic class token makes9patch tokens+1class token=10encoder inputs; no encoder/attention/classifier output is computed for this comparison. No second training system, checkpoint or pretrained output. Clearly distinguish computed patch arithmetic from the schematic Transformer encoder and original paper's learned embeddings.

### Frozen 98.11 robustness fixtures and metrics

Use the actual200epoch fitted head from98.8 without refitting. Evaluate exactly the four held-out records H3,V3,H4,V4, observed classes H,V,H,V. Independent presets start from each original: original; right-shift1 (destination[r][c]=source[r][c−1] for c>0, else0, dropping the rightmost column); half contrast (all scalar values×0.5); corner noise (only[0][0] becomes1−old value). Labels remain horizontal/vertical. Transforms stay in their original held-out source groups; do not count16 variants as16 independent samples. Training data, filters and fitted head remain unchanged.

Confusion matrices use observed rows H/V, predicted columns H/V. Original=`[[2,0],[1,1]]`, shifted=`[[1,1],[1,1]]`, halfcontrast=`[[2,0],[1,1]]`, cornernoise=`[[2,0],[0,2]]`. Predictions respectively `[H,V,H,H]`, `[H,V,V,H]`, `[H,V,H,H]`, `[H,V,H,V]`. Per-class TP=diagonal, FP=other row in its prediction column, FN=other column in its observed row; precision=TP/(TP+FP), recall=TP/(TP+FN), null when denominator0. Each confusion cell should reveal contributing record IDs.

Original probabilities and features are in the fitting references. Changed references: shiftedV3 features`[1,1,1,1,2,2,2,2]`, probabilities`[.010495,.989505]`; shiftedH4 features`[0,0,0,0,2,0,2,0]`, probabilities`[.014620,.985380]`. HalfcontrastH3 `[1,1,0,0,0,0,0,0]`→`[.783416,.216584]`; halfcontrastV3 `[.5,.5,.5,.5,0,1,0,1]`→`[.477153,.522847]`. CornernoiseV4 `[1,0,0,0,1,0,0,0]`→`[.403545,.596455]`. Other records retain original features/probabilities. Values were recomputed with the adopted deterministic model.

The single-pixel noise preset improving these four labels is not evidence of general robustness. Distribution shift means input conditions differ from fitting data; robustness describes behavior under specified changes, not universal invariance. Shortcut learning is relying on incidental cues rather than intended structure; describe it as a possible failure mode, not something established by this fixture. Test labels are used for display/evaluation only. Do not tune to this tiny test set or extrapolate to natural images. For box tasks retain a separate one-IoU reference: supplied candidate1 versus square1 has intersection4/union6=2/3 (98.10); it is not a classifier metric or a detection precision/recall calculation.

### Frozen 98.10 box/mask comparison

Primary definition checked: [TorchVision box_iou](https://docs.pytorch.org/vision/stable/generated/torchvision.ops.box_iou.html) returns intersection-over-union (Jaccard index), with XYXY corner coordinates. Reuse the two square references from98.1. Box areas use continuous half-open edges: max(0,right−left)×max(0,bottom−top); intersection uses clamped overlapping width/height; union=A+B−intersection; no inclusive-pixel +1. For zero union return null/“not defined,” not fabricated perfect agreement. Degenerate versus nonempty box has intersection0 and IoU0.

Author-supplied candidate1: class square, score0.8, box `[1,1,4,3]`; candidate2: class square, score0.6, box `[3,3,5,5]`. Compare candidate1 only with square1 reference `[1,1,3,3]`: areas6 and4, intersection4, union6, IoU2/3. Candidate2 matches square2 exactly. Scores are supplied display fixtures, not model inference or calibrated probabilities. Score threshold defaults0.5 and retains score≥threshold; threshold0.7 hides candidate2 only. Score filtering is not spatial-overlap measurement, matching or duplicate suppression. No NMS required.

Provide keyboard-editable candidate1 edges0–6 in integer steps; clamp/order edges or clearly validate invalid input. Keep reference and candidate outlines distinct with text labels. Reset restores the supplied candidate. Show current intersection/union arithmetic visibly beside image.

Separate instance-mask comparison: square1 reference four pixels; supplied candidate mask copies those four ones plus `(row2,column3)`, hence5 candidate pixels,4 intersection,5 union, IoU0.8. Toggle individual6×6 candidate-mask cells with accessible buttons; reference stays fixed. Mask IoU counts pixels, not continuous box area. Two empty masks have undefined IoU under this lesson's convention. Semantic masks group the square class; instance masks refer to one identified object. Editing either geometry or mask does not run a detector/segmenter. Box and mask controls are independent demonstrations, not a claim their shapes must always coincide.

### Frozen 98.9 transfer-learning boundaries

Primary reference: [PyTorch transfer-learning tutorial](https://docs.pytorch.org/tutorials/beginner/transfer_learning_tutorial.html), targeted review of fixed-feature-extractor and fine-tuning sections. Transfer learning reuses a model pretrained on another task. A fixed feature extractor freezes pretrained layers and fits a replacement task head; fine-tuning updates some or all pretrained parameters too. The tutorial uses `requires_grad=False` for frozen layers and optimizes only the new head; its full fine-tuning example optimizes all model parameters.

Use a connected conceptual pretrained-backbone→new-head diagram. A clearly separate parameter-count analogy using our tiny architecture has20 filter parameters (18weights+2biases),18 head parameters (16weights+2biases). Frozen mode:20 frozen/18 trainable; full fine-tuning mode:0 frozen/38 trainable. Show which gradient updates would apply; neither switch executes pretrained-model training. Actual98.8 fitting always updates only18head parameters and uses authored, not pretrained, filters. Do not relabel it as transfer learning.

Small-labelled-set guidance is qualitative: a frozen extractor trains fewer parameters and can be a starting point; adapting features may be useful when target data differ, but source/target relevance and held-out evaluation determine suitability. Compare labelled solid/paired pattern groups as a small target dataset only; no fabricated speed gains, accuracy gains, model outputs or training curves. A larger pretrained model would have different counts. No checkpoint or natural-image dataset is downloaded.

### Frozen 98.7–98.8 CNN corpus and forward convention

Separate authored binary grayscale corpus; never use the colored-square scene as horizontal/vertical training data. Label/class order is horizontal=0, vertical=1. Each slash separates one six-pixel row. The four held-out structures are excluded before any fitting. Distinct source groups name distinct authored structures, not random splits of transformed copies. This tiny corpus is inspectable teaching data, not a generalization benchmark.

| ID | Source group | Split | Label | Rows |
| --- | --- | --- | --- | --- |
| H1 | solid-horizontal | train | horizontal | `000000/000000/111111/111111/000000/000000` |
| V1 | solid-vertical | train | vertical | `000000/001100/001100/001100/001100/000000` |
| H2 | paired-horizontal | train | horizontal | `000000/111111/000000/000000/111111/000000` |
| V2 | paired-vertical | train | vertical | `010010/010010/010010/010010/010010/010010` |
| H3 | broken-horizontal | test | horizontal | `000000/000000/101010/101010/000000/000000` |
| V3 | broken-vertical | test | vertical | `000000/010010/010010/000000/010010/010010` |
| H4 | triple-horizontal | test | horizontal | `000000/111111/000000/111111/000000/111111` |
| V4 | triple-vertical | test | vertical | `101010/101010/101010/101010/101010/101010` |

Fixed authored filters in channel order: horizontal-edge `[[-1,-1,-1],[0,0,0],[1,1,1]]`, vertical-edge `[[-1,0,1],[-1,0,1],[-1,0,1]]`. These are not the earlier Sobel kernels and are not pretrained. Both convolution biases0; unflipped cross-correlation, stride1/no padding. ReLU elementwise;2×2 max pooling stride2/no padding covers each4×4 map fully. Shapes6×6×1→4×4×2→4×4×2→2×2×2→8→2. Flatten channel-major then row-major within each map.

Expected eight features, independently recomputed with Python built-ins:

```text
H1 [3,3,0,0,0,0,0,0]
V1 [2,2,0,0,3,0,3,0]
H2 [0,0,3,3,0,0,0,0]
V2 [0,0,0,0,0,3,0,3]
H3 [2,2,0,0,0,0,0,0]
V3 [1,1,1,1,0,2,0,2]
H4 [0,0,0,0,0,0,0,0]
V4 [0,0,0,0,0,0,0,0]
```

H1 forward tensor: horizontal convolution `[[3,3,3,3],[3,3,3,3],[-3,-3,-3,-3],[-3,-3,-3,-3]]`; vertical convolution all0. Horizontal ReLU `[[3,3,3,3],[3,3,3,3],[0,0,0,0],[0,0,0,0]]`, pooled `[[3,3],[0,0]]`; vertical ReLU/pool all0.

For98.7 only, use a clearly **hand-chosen, supplied head**, not a fitted one: horizontal weights `[.25,.25,.25,.25,-.25,-.25,-.25,-.25]`, vertical opposite, both biases0. H1 scores `[1.5,-1.5]`, softmax `[0.9525741268,0.0474258732]`; probabilities are normalized class scores, not calibrated certainty. Show all weights and one score calculation.98.8 replaces this illustrative head by actually fitting from zero; do not imply those hand-chosen weights came from training.

### Frozen 98.8 deterministic fitting procedure

Initialize16 head weights and2 biases to0. Full-batch softmax cross-entropy, average gradients over train records H1,V1,H2,V2 in that order; learning rate0.05,200 epochs. Log mean training/test losses at epoch0 and after every update. Only the18 head parameters update;18 filter weights and2 fixed filter biases do not. Held-out labels never enter gradients. Softmax subtracts max score before exponentiation; loss should use stable log-sum-exp.

Independent Python verification: epoch0 train loss0.6931471805599453, epoch1 0.6099361438973124, epoch10 0.2711810589326533, epoch200 0.016605757428318088. Central differences epsilon1e-5 at initialization give weight-gradient max absolute error3.1e-12; implementation must check bias gradients too and preferably a nonzero-parameter point.

Final horizontal weights `[0.3023263165000687,0.3023263165000687,0.3679856800623563,0.3679856800623563,-0.5358750280470677,-0.377114109678589,-0.5358750280470677,-0.377114109678589]`; vertical weights are opposite within floating-point tolerance. Biases `[0.03819095917827112,-0.03819095917827109]`. H1 final scores approximately `[1.852149,-1.852149]`. H3/V3 probabilities approximately `[.923790,.076210]`/`[.435540,.564460]`. H4/V4 both have zero features and the same near-even distribution `[.519086,.480914]`; argmax chooses horizontal so V4 is a visible error. Do not hide this limitation or claim natural-image performance. Earlier rejected drafts with a square labelled vertical, transformed cross-split bars or an incorrect initial loss are not fixtures.

### 98.2 numeric conventions

Weighted grayscale bytes for background/teal/orange are 232/102/155 (unrounded 231.884/101.950/154.800). RGB has 108 scalar values; grayscale has 36. Channel views show the selected channel as neutral brightness, not as a re-colored RGB image. Edits copy one channel in one pixel without changing the frozen scene. Reset restores the source image. Displayed normalization divides the current byte by 255; it is not mean/std standardization. No annotations or model predictions are computed from exploratory edits.

### Frozen 98.3 preparation conventions

Reuse the original 6×6 scene. Transform image pixels, both binary masks and continuous XYXY boxes together. All resize demonstrations use nearest-neighbor sampling: destination pixel `(r,c)` takes source `(floor(r×H/Hout), floor(c×W/Wout))`. Categorical masks never interpolate class IDs. Coordinate transforms act on box edges, not pixel centers.

- **Original:** 6×6, two objects, boxes `[1,1,3,3]` and `[3,3,5,5]`, four mask pixels each.
- **Stretch to 12×6 (width×height):** double x edges, keep y. Boxes `[2,1,6,3]`, `[6,3,10,5]`; masks eight pixels each. Squares become rectangles: the aspect ratio changes.
- **Fit inside 12×6:** preserve the 1:1 image aspect ratio; keep the 6×6 image and add three background columns on each side. Boxes `[4,1,6,3]`, `[6,3,8,5]`; four mask pixels each. Padding has semantic background and no instance membership.
- **Pad by one:** output 8×8, add one background row/column on all sides. Boxes `[2,2,4,4]`, `[4,4,6,6]`, four mask pixels each.
- **Crop top-left 3×3:** source rows/columns `[0,3)`. First box remains `[1,1,3,3]` with four pixels; second is fully removed and must be omitted, not retained as a zero-area annotation. Output 3×3. The supplied image-level label `two colored squares` no longer applies.
- **Horizontal flip:** output 6×6; column c maps to 5−c, box edges use new left=6−old right and new right=6−old left. Boxes `[3,1,5,3]`, `[1,3,3,5]`; four pixels per object. The square class remains valid. A separate explicitly authored right-arrow/left-arrow comparison illustrates why a direction-sensitive label must change after a flip; it is not an annotation for the square scene.

Operations are independent presets applied to the original, not a cumulative editing pipeline. Original is the reversible reset. Augmentation means making altered training examples while preserving or updating their labels for the task; cropping away an object does not preserve an image-level count label. These exact resizing/cropping rules and values are authored contracts, not claims about a particular library's default interpolation.

### Verified initial task definitions

Targeted primary-reference review confirms TorchVision's detection boxes `[N,4]`, labels `[N]`, and instance masks `[N,H,W]`. Classification supplies an image-level label; semantic segmentation assigns a class per pixel; instance segmentation separates individual objects of the same class. Our scene's HWC layout is explicit and differs from PyTorch's common CHW tensor layout. The two square instances share semantic class `square`. These are authored annotations, not executed model outputs.

### Frozen 98.4 filter fixture

Authored grayscale values (scalar intensity units, not RGB bytes):

```text
0 0 0 0 0
0 1 1 1 0
0 1 2 1 0
0 1 1 1 0
0 0 0 0 0
```

Use stride 1, no padding, zero bias, and unflipped kernels: cross-correlation, commonly called convolution in CNNs. The 3×3 averaging kernel has all nine weights `1/9`; show its integer sum before dividing by 9. Raw sums are `[[5,7,5],[7,10,7],[5,7,5]]` and average outputs divide every entry by 9.

The x-gradient kernel `[[-1,0,1],[-2,0,2],[-1,0,1]]` measures left-to-right change (responding to vertical edges). Its output is `[[4,0,-4],[6,0,-6],[4,0,-4]]`. The y-gradient kernel `[[-1,-2,-1],[0,0,0],[1,2,1]]` measures top-to-bottom change (responding to horizontal edges); output `[[4,6,4],[0,0,0],[-4,-6,-4]]`. Keep signed responses visible; reversing a kernel reverses these signs. Products and sums were checked with Python built-in arithmetic. CS231n supports the local dot-product/shared-filter explanation; these exact matrices are authored, not copied from its examples.

### Frozen 98.5 sampling conventions

Reuse the 5×5 scalar image and x/y gradient filters from 98.4 (one input channel, two output channels). Each filter receives the same image and produces a separate feature map; filters do not operate successively on one another. Use zero-valued padding of 0 or 1 on all sides, stride 1 or 2, dilation 1, zero bias and unflipped kernels. Output index `(r,c)` samples original indices `(r×stride+dy−padding,c×stride+dx−padding)`; out-of-range values are zero. Formula per axis: floor((input + 2×padding − kernel)/stride)+1. Each selected output cell has a 3×3 receptive field in the padded input; padding positions are not observed image data.

Output sizes: (padding0,stride1)→3×3×2; (0,2)→2×2×2; (1,1)→5×5×2; (1,2)→3×3×2. Reference x-gradient maps checked with Python integer sums:

- p0,s1: `[[4,0,-4],[6,0,-6],[4,0,-4]]`.
- p0,s2: `[[4,-4],[4,-4]]`.
- p1,s1: `[[1,1,0,-1,-1],[3,4,0,-4,-3],[4,6,0,-6,-4],[3,4,0,-4,-3],[1,1,0,-1,-1]]`.
- p1,s2: `[[1,0,-1],[4,0,-4],[1,0,-1]]`.

The y-gradient reference is the transpose of each corresponding x-gradient map because the image is symmetric and the y kernel is the x kernel's transpose. Explain stride as the jump between window starts, not between pixels within a window. Padded image dimensions are (5+2p)×(5+2p); keep zeros visibly distinct as padding without altering their numeric value.

### Frozen 98.6 activation/pooling conventions

Reuse the x/y 5×5 signed feature maps from 98.5, stride1/padding1. ReLU acts elementwise as max(0,x); keep the original signed maps visible. Apply unpadded 2×2 max pooling with stride2, producing a 2×2 map per channel. The final row and column are not covered by complete pooling windows and must be marked as unused, not silently pooled or padded. For the x map, ReLU output is `[[1,1,0,0,0],[3,4,0,0,0],[4,6,0,0,0],[3,4,0,0,0],[1,1,0,0,0]]`; pooled output `[[4,0],[6,0]]`. The y ReLU/pooled maps are corresponding transposes; pooled y=`[[4,6],[0,0]]`.

Representative first x pooling window `[1,1;3,4]` retains maximum4 (average9/4=2.25). Information-loss comparison uses two separately authored windows A=`[[1,1],[3,4]]`, B=`[[0,0],[0,4]]`: both max-pool to4 despite different input values; their averages2.25 and1 differ. Pooling has no learned parameters here. It reduces spatial detail and does not guarantee invariance to every shift. The future6×6 CNN uses4×4 feature maps so its2×2 pooling windows cover the whole map; keep this distinction explicit in source notes.

Keep the three fixtures distinct: colored-square annotations, the5×5 filter arithmetic example and the6×6 horizontal/vertical corpus. Only the head trains in98.8;98.7's explicitly hand-chosen head is a separate forward-pass illustration. Training/test examples cannot be transformed copies of the same source group. Claims and fitting curves must come from the documented computations, never invented results.
