import { maxPool, relu } from './visionPooling';

export type CNNHead = {
  weights: readonly (readonly number[])[];
  biases: readonly number[];
};

type VisionPattern = {
  id: string;
  label: 'horizontal' | 'vertical';
  split: 'train' | 'test';
  sourceGroup: string;
  pixels: number[][];
};

const pattern = (id: string, label: VisionPattern['label'], split: VisionPattern['split'], sourceGroup: string, rows: string): VisionPattern =>
  ({ id, label, split, sourceGroup, pixels: rows.split('/').map(row => [...row].map(Number)) });

export const visionPatterns: VisionPattern[] = [
  pattern('H1', 'horizontal', 'train', 'solid-horizontal', '000000/000000/111111/111111/000000/000000'),
  pattern('V1', 'vertical', 'train', 'solid-vertical', '000000/001100/001100/001100/001100/000000'),
  pattern('H2', 'horizontal', 'train', 'paired-horizontal', '000000/111111/000000/000000/111111/000000'),
  pattern('V2', 'vertical', 'train', 'paired-vertical', '010010/010010/010010/010010/010010/010010'),
  pattern('H3', 'horizontal', 'test', 'broken-horizontal', '000000/000000/101010/101010/000000/000000'),
  pattern('V3', 'vertical', 'test', 'broken-vertical', '000000/010010/010010/000000/010010/010010'),
  pattern('H4', 'horizontal', 'test', 'triple-horizontal', '000000/111111/000000/111111/000000/111111'),
  pattern('V4', 'vertical', 'test', 'triple-vertical', '101010/101010/101010/101010/101010/101010'),
];

/** Fixed authored edge filters, not pretrained weights or the earlier Sobel kernels. */
export const cnnFilters = [
  { name: 'Horizontal edge', kernel: [[-1, -1, -1], [0, 0, 0], [1, 1, 1]], bias: 0 },
  { name: 'Vertical edge', kernel: [[-1, 0, 1], [-1, 0, 1], [-1, 0, 1]], bias: 0 },
];

/** Hand-chosen forward-pass illustration; no training has produced this head. */
export const suppliedHead: CNNHead = {
  weights: [
    [.25, .25, .25, .25, -.25, -.25, -.25, -.25],
    [-.25, -.25, -.25, -.25, .25, .25, .25, .25],
  ],
  biases: [0, 0],
};

/** Maps are channel-major; each map and the flattened features are row-major. */
export function cnnForward(pixels: readonly (readonly number[])[], head: CNNHead = suppliedHead): {
  convolution: number[][][];
  activated: number[][][];
  pooled: number[][][];
  features: number[];
  scores: number[];
  probabilities: number[];
} {
  const convolution = cnnFilters.map(filter =>
    Array.from({ length: pixels.length - 2 }, (_, row) =>
      Array.from({ length: pixels[0].length - 2 }, (_, column) =>
        filter.kernel.reduce((sum, weights, dy) =>
          sum + weights.reduce((subtotal, weight, dx) => subtotal + weight * pixels[row + dy][column + dx], 0), filter.bias))));
  const activated = convolution.map(relu);
  const pooled = activated.map(maxPool);
  const features = pooled.flat(2);
  const scores = head.weights.map((weights, index) =>
    weights.reduce((sum, weight, feature) => sum + weight * features[feature], head.biases[index]));
  const maximum = Math.max(...scores);
  const exponentials = scores.map(score => Math.exp(score - maximum));
  const total = exponentials.reduce((sum, value) => sum + value, 0);
  const probabilities = exponentials.map(value => value / total);
  return { convolution, activated, pooled, features, scores, probabilities };
}
