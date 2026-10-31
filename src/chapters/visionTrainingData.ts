import { cnnForward, visionPatterns, type CNNHead } from './visionCNNData';

type Pattern = (typeof visionPatterns)[number];
export const trainingPatterns = visionPatterns.filter(pattern => pattern.split === 'train');
export const heldOutPatterns = visionPatterns.filter(pattern => pattern.split === 'test');

export const zeroHead = (): CNNHead => ({
  weights: [Array(8).fill(0), Array(8).fill(0)], biases: [0, 0],
});

export function evaluateHead(head: CNNHead, patterns: readonly Pattern[]) {
  let totalLoss = 0;
  const predictions = patterns.map(pattern => {
    const { features, scores, probabilities } = cnnForward(pattern.pixels, head);
    const target = pattern.label === 'horizontal' ? 0 : 1;
    const maximum = Math.max(...scores);
    // Subtract the target before adding log-sum-exp to retain small losses.
    totalLoss += maximum - scores[target] + Math.log(scores.reduce((sum, score) => sum + Math.exp(score - maximum), 0));
    const prediction: Pattern['label'] = scores[0] >= scores[1] ? 'horizontal' : 'vertical';
    return { id: pattern.id, label: pattern.label, features, scores, probabilities, prediction };
  });
  return { loss: totalLoss / patterns.length, predictions };
}

/** Mean full-batch softmax cross-entropy gradient; only the head is differentiated. */
export function headGradient(head: CNNHead, patterns: readonly Pattern[] = trainingPatterns): CNNHead {
  const weights = [Array<number>(8).fill(0), Array<number>(8).fill(0)];
  const biases = [0, 0];
  for (const pattern of patterns) {
    const { features, probabilities } = cnnForward(pattern.pixels, head);
    const target = pattern.label === 'horizontal' ? 0 : 1;
    for (let output = 0; output < 2; output++) {
      const error = (probabilities[output] - Number(output === target)) / patterns.length;
      biases[output] += error;
      features.forEach((feature, index) => { weights[output][index] += error * feature; });
    }
  }
  return { weights, biases };
}

export function stepHead(head: CNNHead, rate = .05): CNNHead {
  const gradient = headGradient(head);
  return {
    weights: head.weights.map((row, output) => row.map((weight, index) => weight - rate * gradient.weights[output][index])),
    biases: head.biases.map((bias, output) => bias - rate * gradient.biases[output]),
  };
}

export function trainHead(epochs = 200, rate = .05) {
  let head = zeroHead();
  const history: { epoch: number; head: CNNHead; trainLoss: number; testLoss: number }[] = [];
  for (let epoch = 0; epoch <= epochs; epoch++) {
    history.push({ epoch, head, trainLoss: evaluateHead(head, trainingPatterns).loss, testLoss: evaluateHead(head, heldOutPatterns).loss });
    if (epoch < epochs) head = stepHead(head, rate);
  }
  return { head, history };
}
