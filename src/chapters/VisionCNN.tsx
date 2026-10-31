import { useState } from 'react'
import { cnnFilters, cnnForward, suppliedHead, visionPatterns } from './visionCNNData'
import './VisionCNN.css'

const stages = [
  { title: 'Input', shape: '6 × 6 × 1' },
  { title: 'Convolution', shape: '4 × 4 × 2' },
  { title: 'ReLU', shape: '4 × 4 × 2' },
  { title: 'Max pooling', shape: '2 × 2 × 2' },
  { title: 'Flatten', shape: '8 values' },
  { title: 'Output head', shape: '2 scores' },
  { title: 'Softmax', shape: '2 probabilities' },
] as const
const fmt = (value: number) => Number(value.toFixed(4)).toString()
type Matrix = readonly (readonly number[])[]
function MatrixView({ title, values, image = false }: { title: string; values: Matrix; image?: boolean }) {
  return <div className="vcnn-matrix-wrap"><b>{title}</b><div className="vcnn-matrix" style={{ gridTemplateColumns: `repeat(${values[0].length}, 1fr)` }}>{values.map((row, y) => row.map((value, x) => <span key={`${y}-${x}`} className={image && value === 1 ? 'vcnn-pixel' : value < 0 ? 'vcnn-negative' : value > 0 ? 'vcnn-positive' : ''}>{fmt(value)}</span>))}</div></div>
}
function Fraction({ top, bottom }: { top: string; bottom: string }) { return <span className="vcnn-fraction"><span>{top}</span><span>{bottom}</span></span> }

export function VisionCNN() {
  const [patternIndex, setPatternIndex] = useState(0)
  const [step, setStep] = useState(0)
  const pattern = visionPatterns[patternIndex]
  const result = cnnForward(pattern.pixels)
  const maxScore = Math.max(...result.scores)
  const horizontalTerms = result.features.map((value, index) => `${fmt(value)} × ${fmt(suppliedHead.weights[0][index])}`)
  const ids = ['horizontal', 'vertical']
  return <article className="vcnn-lesson"><header className="vcnn-header"><p className="vcnn-eyebrow">98.7 · Computer Vision</p><h1>Inside a small CNN</h1><p className="vcnn-definition">A <strong>convolutional neural network (CNN)</strong> uses the same filter weights at different positions to find patterns in an image.</p><p>Follow the numbers through a small supplied network. Its filters and output-head weights are <b>hand-chosen, not learned</b>; no training happens here.</p></header>
    <section className="vcnn-panel" aria-labelledby="vcnn-title"><div className="vcnn-heading"><div><p className="vcnn-eyebrow">ONE INPUT · COMPLETE FORWARD PASS</p><h2 id="vcnn-title">Choose a stage to inspect</h2></div><p>Each stage is available immediately. Select a sample to follow its values through the same fixed network.</p></div>
      <div className="vcnn-samples" role="group" aria-label="Choose an image">{visionPatterns.map((item, index) => <button key={item.id} type="button" aria-pressed={index === patternIndex} onClick={() => setPatternIndex(index)}><b>{item.id}</b><span>{item.label} · {item.split === 'train' ? 'training set' : 'held-out test set'}</span></button>)}</div>
      <div className="vcnn-stages" role="group" aria-label="Choose a network stage">{stages.map((stage, index) => <div className="vcnn-node" key={stage.title}><button type="button" aria-pressed={step === index} onClick={() => setStep(index)}><span>0{index + 1}</span><b>{stage.title}</b><small>{stage.shape}</small></button>{index < stages.length - 1 && <span className="vcnn-arrow" aria-hidden="true">→</span>}</div>)}</div>
      <div className="vcnn-detail" aria-live="polite"><p className="vcnn-kicker">{pattern.id} · {stages[step].title.toUpperCase()}</p>
        {step === 0 && <><h3>One grayscale image</h3><p>The label is <b>{pattern.label}</b>; this example belongs to the {pattern.split === 'train' ? 'training' : 'held-out test'} set. The network receives the 36 pixel values, not the label. Black = 1; white = 0.</p><div className="vcnn-matrices"><MatrixView title="Input · 6 × 6 × 1" values={pattern.pixels} image /></div></>}
        {step === 1 && <><h3>Shared filters produce two maps</h3><p>A CNN reuses each filter's weights across the image. These two authored filters examine different edge directions; they are not pretrained. Stride 1, no padding, zero biases; the kernels are not flipped.</p><div className="vcnn-matrices">{cnnFilters.map(filter => <MatrixView key={filter.name} title={`${filter.name} kernel · bias ${filter.bias}`} values={filter.kernel} />)}{result.convolution.map((map, i) => <MatrixView key={i} title={`${cnnFilters[i].name} response · 4 × 4`} values={map} />)}</div></>}
        {step === 2 && <><h3>ReLU keeps nonnegative values</h3><p>ReLU replaces each negative response with zero; positive values stay unchanged. Both channels remain separate.</p><div className="vcnn-matrices">{result.activated.map((map, i) => <MatrixView key={i} title={`${cnnFilters[i].name} · 4 × 4`} values={map} />)}</div></>}
        {step === 3 && <><h3>Keep the maximum in each window</h3><p>Each 2 × 2 window keeps its largest value. With stride 2, all positions of each 4 × 4 map are covered.</p><div className="vcnn-matrices">{result.pooled.map((map, i) => <MatrixView key={i} title={`${cnnFilters[i].name} · 2 × 2`} values={map} />)}</div></>}
        {step === 4 && <><h3>Flatten the maps into a list</h3><p><b>Flatten</b> arranges the two pooled grids into one list: first channel 1, then channel 2, reading rows left to right within each grid.</p><div className="vcnn-features">{result.features.map((value, i) => <div key={i}><small>{i < 4 ? 'Channel 1' : 'Channel 2'} · {i + 1}</small><b>{fmt(value)}</b></div>)}</div></>}
        {step === 5 && <><h3>A hand-chosen output head makes scores</h3><p>The <b>output head</b> combines the eight features with weights and a bias for each class. These supplied numbers were hand-chosen—not fitted. The resulting raw class scores are called <b>logits</b>.</p><div className="vcnn-table-wrap"><table className="vcnn-table"><thead><tr><th>Class</th>{result.features.map((_, i) => <th key={i}>w{i + 1}</th>)}<th>Bias</th><th>Score</th></tr></thead><tbody>{suppliedHead.weights.map((weights, i) => <tr key={ids[i]}><th>{ids[i]}</th>{weights.map((value, j) => <td key={j}>{fmt(value)}</td>)}<td>{fmt(suppliedHead.biases[i])}</td><td><b>{fmt(result.scores[i])}</b></td></tr>)}</tbody></table></div><p className="vcnn-arithmetic"><b>Horizontal score:</b> {horizontalTerms.join(' + ')} + {fmt(suppliedHead.biases[0])} = <b>{fmt(result.scores[0])}</b></p></>}
        {step === 6 && <><h3>Turn scores into probabilities</h3><p><b>Softmax</b> converts the two scores into positive values that sum to 1. A probability here is a normalized score, not a guarantee of correctness or calibrated certainty.</p><div className="vcnn-probabilities">{result.probabilities.map((value, i) => <div key={ids[i]}><span>{ids[i]}</span><b>{(value * 100).toFixed(2)}%</b><small>score {fmt(result.scores[i])}</small></div>)}</div><div className="vcnn-equation"><span>Horizontal probability = </span><Fraction top={`e^(${fmt(result.scores[0])} − ${fmt(maxScore)})`} bottom={`e^(${fmt(result.scores[0])} − ${fmt(maxScore)}) + e^(${fmt(result.scores[1])} − ${fmt(maxScore)})`} /><span>= {fmt(result.probabilities[0])}</span></div><p className="vcnn-small">Subtracting the highest score from both scores keeps the calculation stable without changing the result. <a href="#chapter-99/99.8-logits-and-softmax">99.8 Explore softmax →</a></p></>}
      </div>
    </section></article>
}
