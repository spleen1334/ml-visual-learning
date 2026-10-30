/** Authored annotations, not predictions. Coordinates use top-left origin. */
export type VisionRGB = readonly [red: number, green: number, blue: number];
export type VisionBox = readonly [x1: number, y1: number, x2: number, y2: number];
export type VisionMask = readonly (readonly number[])[];
export type VisionObject = Readonly<{
  id: 'square1' | 'square2';
  classLabel: 'square';
  /** Half-open XYXY edges; area = (x2 - x1) * (y2 - y1). */
  box: VisionBox;
  binaryMask: VisionMask;
}>;

const height = 6;
const width = 6;
const palette = Object.freeze({
  background: Object.freeze([240, 232, 210] as const),
  teal: Object.freeze([40, 130, 120] as const),
  orange: Object.freeze([220, 140, 60] as const),
});

const freezeMask = (rows: number[][]): VisionMask =>
  Object.freeze(rows.map((row) => Object.freeze(row)));

const makeObject = (id: VisionObject['id'], box: VisionBox): VisionObject =>
  Object.freeze({
    id,
    classLabel: 'square',
    box: Object.freeze(box),
    binaryMask: freezeMask(Array.from({ length: height }, (_, row) =>
      Array.from({ length: width }, (_, column) =>
        Number(column >= box[0] && column < box[2] && row >= box[1] && row < box[3])))),
  });

const objects = Object.freeze([
  makeObject('square1', [1, 1, 3, 3]),
  makeObject('square2', [3, 3, 5, 5]),
]);

// A combined display map is derived from the two actual binary instance masks.
const instanceIdMask = freezeMask(Array.from({ length: height }, (_, row) =>
  Array.from({ length: width }, (_, column) => {
    const index = objects.findIndex((object) => object.binaryMask[row][column] === 1);
    return index + 1;
  })));

const semanticMask = freezeMask(instanceIdMask.map((row) => row.map((id) => Number(id !== 0))));
const colors: readonly VisionRGB[] = [palette.background, palette.teal, palette.orange];
const pixels = Object.freeze(instanceIdMask.map((row) =>
  Object.freeze(row.map((id) => colors[id]))));

/** Row-major HWC RGB byte image and its supplied task annotations. */
export const visionScene = Object.freeze({
  height,
  width,
  channels: 3 as const,
  palette,
  pixels,
  imageLabel: 'two colored squares',
  objects,
  semanticMask,
  instanceIdMask,
});
