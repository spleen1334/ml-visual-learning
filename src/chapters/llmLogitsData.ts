import { DECODER_PARAMETERS, DECODER_VOCABULARY } from './llmEmbeddingsData'
import { linearRow, transformerBlock } from './llmBlock'
import { stableSoftmax } from './llmAttentionData'

export function logitsFromHidden(hidden: readonly number[]) {
  if (hidden.length !== DECODER_PARAMETERS.hiddenWidth || !hidden.every(Number.isFinite)) throw new RangeError('Expected a finite width-4 hidden row')
  const { projection, bias } = DECODER_PARAMETERS.logits
  if (bias.length !== DECODER_VOCABULARY.length) throw new RangeError('Logit vocabulary shape mismatch')
  const logits = linearRow(hidden, projection, bias)
  return { logits, probabilities: stableSoftmax(logits) }
}
export function lastDecoderDistribution(ids: readonly number[]) {
  const rows = transformerBlock(ids).rows
  const hidden = rows[rows.length - 1].norm2.output
  return { hidden, ...logitsFromHidden(hidden) }
}
