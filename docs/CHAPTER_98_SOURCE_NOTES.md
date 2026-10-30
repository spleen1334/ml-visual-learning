# Chapter 98 · Computer Vision

Status: 98.1–98.3 implemented and reviewed after Chapter97's final lesson was verified and committed. Continue one lesson/check/desktop review/scoped commit at a time. Plan: `../plan_computer_vision.md`.

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

Do not fit the future classifier on this colored scene or pretend its task label is a horizontal/vertical training target. Before98.4, record exact separate5×5 grayscale values/kernels/biases and hand-calculated outputs. Before98.7–8, record every6×6 pattern/source group/label/split, channel/flatten order, fixed filters and head parameters; training/test examples cannot be copies differing only in imperceptible noise. Only the head trains. Claims and curves must come from the actual documented computations, never hand-picked accuracy/weights.
