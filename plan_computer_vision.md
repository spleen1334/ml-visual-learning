# Computer Vision · visual chapter plan

Status: all twelve lessons implemented, verified and committed individually. Optional quizzes and broader course polish remain deferred.

Placement: **Chapter 98 — Computer Vision**, between Chapter 97 (NLP) and Chapter 99 (LLMs). Existing course and Chapter 99 URLs are preserved.

## Learning goal and scope

Show how an image becomes numbers, how local filters transform those numbers, how a small network produces a prediction, and how different vision tasks produce labels, boxes or masks. Finish with an inspectable pipeline and a practical understanding of errors. No coding or advanced mathematics is required.

Use 12 short lessons, one main visual each, with concise definitions and visible calculations. The first version is a local learning guide using tiny authored pixel grids and shape scenes. It needs no camera, personal photo upload, API, large model download, GPU, or backend. Object detection and segmentation are introduced through output representations and evaluation; a full detector training system is outside scope. Video tracking, 3D reconstruction, face recognition, diffusion/image generation and deployment infrastructure are deferred.

Match the existing teal/cream theme, large definitions, short text, shared playback controls, and keyboard-accessible alternatives to dragging. Use colors that faithfully represent pixel data, signed filter responses and distinct objects; the app palette must not distort a scientific image scale. A compact CNN example does not establish that all vision systems use CNNs. A final brief Vision Transformer comparison connects to Chapter 99 without duplicating attention internals.

## Lesson sequence

| Lesson | Main question and terminology | Visual and meaningful interaction | Gentle mathematics |
| --- | --- | --- | --- |
| **98.1 What can a computer see?** | Classification, object detection, semantic segmentation, instance segmentation. | Show the same scene as one label, several labelled boxes, per-class pixel masks, and per-object masks. Switch tasks to see the output change. Label overlays as authored annotations. | Count labels, boxes and pixels; explain that task outputs have different shapes. |
| **98.2 An image is a grid of numbers** | Pixels, resolution, grayscale, RGB channels, tensor. | Inspect a tiny image with row/column coordinates. Selecting a pixel reveals its grayscale value or RGB triplet. Change one channel and see exactly which pixel changes. | Width × height × channels. Convert 8-bit intensity to [0,1] by dividing by 255; distinguish scaling from mean/std standardization. |
| **98.3 Preparing images without changing the task** | Resize, crop, padding, interpolation, augmentation and label preservation. | Apply one reversible operation to an image and its box/mask. Compare preserving aspect ratio with stretching; a crop can remove the target. Show an invalid flip for a direction-sensitive label. | Coordinate scaling and crop offsets; nearest-neighbor for categorical masks. Any image interpolation convention is named. |
| **98.4 A filter slides over an image** | Kernel/filter, local neighborhood, weighted sum, convolution. | Move a 3×3 filter across a 5×5 grayscale grid. Highlight the nine input/filter products and the corresponding output cell. Compare blur and directional-edge filters. | Sum of pixel × weight terms plus optional bias. Name the operation cross-correlation (commonly called convolution in CNNs); document whether a kernel is flipped. |
| **98.5 Stride, padding and feature maps** | Stride, padding, output channels, feature map, receptive field. | Change stride 1/2 or padding 0/1 and watch the sampling windows and output grid change. Compare two filters over the same image. | Output size = floor((input + 2×padding − kernel)/stride)+1 for dilation 1. Work one axis, then show height and width. |
| **98.6 Activations and pooling** | ReLU, max pooling, downsampling, information loss. | Trace filter responses through ReLU, then select each 2×2 pooling window and its retained maximum. Show two different inputs that pool to the same result. | ReLU(x)=max(0,x), maximum and average. Pooling is not learned in this example and does not guarantee invariance to every shift. |
| **98.7 Inside a small CNN** | CNN, shared weights, channels, flattening, output head, logits, probability. | One connected diagram traces a 6×6 image through convolution → ReLU → pooling → flattening → class scores → probabilities. Select a stage to inspect exact numbers. | One input channel, two 3×3 filters, stride 1/no padding: 6×6×1 → 4×4×2 → 2×2×2 → 8 features → 2 class scores. Show one score and softmax; link to 99.8 for the fuller explanation. |
| **98.8 How does a vision model learn?** | Labels, training/test split, loss, gradient, batch, epoch, overfitting. | Keep the small convolutional features fixed and actually fit the two-class linear head on visible horizontal/vertical-pattern examples. Trace one parameter update and show a separate held-out image. Show train/test losses with their exact data sources. | Cross-entropy and one gradient update, introduced with named quantities. State that only the head is trained; the authored filters remain fixed. |
| **98.9 Reusing learned features** | Pretraining, transfer learning, frozen backbone, fine-tuning. | A diagram distinguishes a supplied feature extractor from a new trainable head. Toggle which parameters would update. Compare small labelled target datasets. The earlier fixed-filter demonstration is an analogy, not a pretrained backbone. | Count frozen/trainable parameters and show which gradients would be applied. No invented speed/accuracy gains or fabricated training curves. |
| **98.10 From labels to boxes and masks** | Box coordinates, confidence threshold, overlap, semantic versus instance masks. | Use a small authored multi-object scene with reference boxes/masks and supplied candidate predictions. Adjust a box with keys/buttons or dragging and paint/select a tiny mask to see agreement change. Optional duplicate-box suppression is a short second view. | Intersection over union = intersection area / union area. Show pixel-mask intersections as counts. Distinguish score threshold from IoU matching/suppression thresholds. |
| **98.11 Test the model beyond familiar images** | Precision/recall, held-out performance, robustness, distribution shift, shortcut learning. | Run the actually fitted head on fixed translated/noisy/contrast-changed pattern presets and inspect errors. A separate labelled annotation fixture illustrates detection matching if needed. Select an error to reveal the exact input/output/reference. | Confusion matrix and per-class counts; one IoU calculation. Define sample size and matching rules. Do not extrapolate tiny-pattern results to natural photos or all CNNs. |
| **98.12 Follow the full vision pipeline** | Data → preparation → representation → model → output → evaluation. Briefly introduce image patches and Vision Transformers. | Reassemble the same computed CNN pipeline and training/inference boundary. A small alternative diagram cuts an image into patches, projects them to vectors, adds position and feeds a Transformer encoder. Link to Chapter 99 for attention, while noting its decoder has a different mask/task. | Reuse shapes, convolution and score calculations. For the ViT comparison, count patches and vector dimensions; no second network training system. |

## Example and calculation contracts

- Freeze a tiny authored 5×5 grayscale fixture for filter arithmetic and a separate 6×6 binary/normalized grayscale pattern corpus for the CNN. Give every training and held-out pattern a stable ID, explicit pixel matrix, label and split. Save exact kernels, bias values, tensors and reference outputs in `docs/CHAPTER_98_SOURCE_NOTES.md` before the relevant lesson.
- The 6×6 network has two supplied 3×3 kernels, no convolution padding, ReLU, 2×2 max pooling with stride 2, flattening to eight features, and a two-class linear head. Define channel order, flatten order and bias convention. Keep original signed responses visible; a display color scale must not silently clip or normalize the underlying numbers.
- The feature extractor's weights are authored. Lesson 98.8 genuinely fits only the small output head using deterministic initialization and a documented learning rate. Show every trained parameter, actual loss, fitting records, and separate prediction input. Training/test plots must come from those computations. This is not an end-to-end trained CNN or a production image recognizer.
- Keep held-out records separate before fitting. Avoid train/test copies that differ only in imperceptible noise; transformations of one source pattern belong to a documented source group. Robustness presets illustrate specific perturbations, not a general guarantee.
- Natural-image examples, if later useful, require verified licenses and source records. Authored overlays and supplied predictions must say so. Reusing external pretrained outputs requires a pinned model/checkpoint, preprocessing and provenance, plus a clear boundary around what runs in the browser. None is required by this plan.
- For boxes, choose continuous XYXY coordinates with top-left origin and area max(0,x2−x1) × max(0,y2−y1); do not add an unexplained +1 pixel. For masks, use discrete pixel counts. Document empty-union handling and same-class, one-to-one matching for detection examples. Keep optional NMS separate from matching predictions to ground truth.
- A camera input is not necessary. Do not imply that a class-score distribution proves confidence calibration or that feature maps/attention identify the full causal explanation for a decision.

## Implementation and acceptance

Standing authorization: continue through the remaining chapter plan, one lesson at a time, without permission gates. For each: inspect the relevant primary source, update source notes, implement the focused visual and required pure math, run meaningful numerical tests plus `rtk npm run check` and `rtk git diff --check`, inspect desktop output and keyboard/manual/autoplay/reduced-motion behavior where applicable, resolve must-fix findings, then make a scoped commit. Publish only completed lesson content and preserve unrelated work. Never push or deploy without authorization.

| Lessons | Deliverable | Required focused checks |
| --- | --- | --- |
| 98.1–98.3, individually | Task overlays, pixel inspector, image preparation | Correct output types, RGB/intensity mapping, coordinate conventions, aspect ratio, reversible transforms and aligned image/box/mask changes. |
| 98.4–98.6, individually | Sliding filter, shapes, activation and pooling | Hand-calculated products/sums, signed responses, stride/padding boundaries, dimensions, ReLU and exact pooled values; no animation dependency for reading results. |
| 98.7 | Inspectable complete forward pass | One end-to-end tensor fixture; channel/flatten order; every displayed intermediate array; output probabilities sum to one; no invented model outputs. |
| 98.8–98.9, individually | Actual head fit and transfer-learning explanation | Numerical gradient check, deterministic reset, finite parameters/loss, suitable loss decrease, exact data split, unchanged frozen filters and honest transfer analogy. |
| 98.10 | Boxes and masks | IoU for identical, disjoint, partly overlapping and degenerate boxes; exact mask counts; matching/threshold distinction; keyboard alternatives to dragging. |
| 98.11–98.12, individually | Robustness and complete workflow/ViT bridge | Metrics trace to fixtures; perturbations match labels; no test leakage; source/computation labels; CNN/encoder/decoder distinctions; full manual and reduced-motion path. |

| Lesson | Implementation | Verification | Scoped commit |
| --- | --- | --- | --- |
| 98.1 Task outputs | [x] | [x] 230 tests, build, diff and desktop/keyboard review | [x] |
| 98.2 Pixel inspector | [x] | [x] 233 tests, build, diff and desktop/keyboard review | [x] |
| 98.3 Image preparation | [x] | [x] 240 tests, build, diff and desktop/keyboard review | [x] |
| 98.4 Sliding filter | [x] | [x] 244 tests, build, diff and desktop/playback/reduced-motion review | [x] |
| 98.5 Stride/padding | [x] | [x] 249 tests, build, diff and desktop/keyboard review | [x] |
| 98.6 ReLU/pooling | [x] | [x] 252 tests, build, diff and desktop/keyboard review | [x] |
| 98.7 CNN forward pass | [x] | [x] 257 tests, build, diff and desktop/keyboard review | [x] |
| 98.8 Head fitting | [x] | [x] 263 tests, build, diff and desktop/keyboard review | [x] |
| 98.9 Transfer learning | [x] | [x] 263 tests, build, diff and desktop/keyboard review | [x] |
| 98.10 Boxes/masks | [x] | [x] 268 tests, build, diff and desktop/keyboard review | [x] |
| 98.11 Robustness/evaluation | [x] | [x] 272 tests, build, diff and desktop/keyboard review | [x] |
| 98.12 Full pipeline | [x] | [x] 277 tests, build, diff, desktop/keyboard and chapter-wide routing review | [x] |

Grouped rows organize dependencies; each lesson gets its own review and commit. A modest first milestone is 98.1–98.4, reviewed individually, before implementing the complete network. Optional quizzes are deferred until the visuals work well.

## Primary references and source boundaries

Planning references checked on 2026-10-26:

- [Stanford CS231n convolutional networks notes](https://github.com/cs231n/cs231n.github.io/blob/master/convolutional-networks.md): local filters, weight sharing, feature maps, stride/padding and pooling. Use foundational arithmetic; historical architecture recommendations are not current performance claims.
- [PyTorch image-classifier tutorial](https://docs.pytorch.org/tutorials/beginner/blitz/cifar10_tutorial.html): image tensors and the data/model/loss/training/testing sequence. This plan does not reproduce CIFAR-10 or require downloading it.
- [TorchVision detection and segmentation tutorial](https://docs.pytorch.org/tutorials/intermediate/torchvision_tutorial.html): distinction between class scores, bounding boxes and instance masks. The proposed authored geometry demo does not execute Mask R-CNN.
- [Dosovitskiy et al., An Image is Worth 16×16 Words](https://arxiv.org/abs/2010.11929): image patches as Transformer inputs. Introduce the architectural idea, not the paper's historical benchmark results as current rankings.

This is supplementary authored teaching material, not a claim to reproduce a local PDF chapter or workbook. Recheck targeted primary definitions and task-specific metrics before implementing each lesson. Keep mathematical fixtures, data provenance and adaptations in source notes, while learner-facing captions focus on the visual explanation.
