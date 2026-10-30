import { useState } from 'react'
import { prepareScene, type Preparation } from './visionPreparation'
import './VisionPreparation.css'

const choices: { id: Preparation; name: string; size: string; detail: string; calculation: string }[] = [
  { id: 'original', name: 'Original', size: '6 × 6', detail: 'The original image has two square objects.', calculation: 'Square 1: [1, 1, 3, 3] → [1, 1, 3, 3].' },
  { id: 'stretch', name: 'Stretch', size: '12 × 6', detail: 'Resize changes the image dimensions. Doubling width but not height stretches each square into a rectangle.', calculation: 'Square 1: double the left and right edges [1, 1, 3, 3] → [2, 1, 6, 3].' },
  { id: 'fit', name: 'Fit', size: '12 × 6', detail: 'Fit preserves the 1:1 image proportions: the 6 × 6 image stays unchanged, with three background columns added on each side.', calculation: 'Square 1: add 3 to the left and right edges [1, 1, 3, 3] → [4, 1, 6, 3].' },
  { id: 'pad', name: 'Pad', size: '8 × 8', detail: 'Padding adds background around an image. Here, one row and one column are added on every side.', calculation: 'Square 1: add 1 to each edge [1, 1, 3, 3] → [2, 2, 4, 4].' },
  { id: 'crop', name: 'Crop', size: '3 × 3', detail: 'Cropping keeps only part of the image. The top-left 3 × 3 removes square 2, so the label “two colored squares” no longer applies.', calculation: 'Square 1 stays [1, 1, 3, 3]; square 2 is removed.' },
  { id: 'flip', name: 'Flip', size: '6 × 6', detail: 'A horizontal flip mirrors the image. The square labels still apply, but their positions change. Pixel column c moves to 5 − c.', calculation: 'Box edges differ from pixel indices: new left = 6 − old right; new right = 6 − old left. Square 1: [1, 1, 3, 3] → [3, 1, 5, 3].' },
]
type Scene = ReturnType<typeof prepareScene>
function Grid({ scene, masks }: { scene: Scene; masks: boolean }) {
  return <svg className="vprep-grid" viewBox={`0 0 ${scene.width} ${scene.height}`} role="img" aria-label={`${scene.width} by ${scene.height} ${masks ? 'instance masks and boxes' : 'image and boxes'}, ${scene.objects.length} square objects`}>
    {scene.pixels.map((row, y) => row.map((rgb, x) => {
      const obj = scene.objects.find(object => object.mask[y][x] === 1)
      const color = masks ? obj ? obj.id === 'square1' ? '#288278' : '#dc8c3c' : '#f1eee4' : `rgb(${rgb.join(',')})`
      return <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={color} stroke="#fff" strokeOpacity=".6" strokeWidth=".025" />
    }))}
    {scene.objects.map(object => { const [x1, y1, x2, y2] = object.box; return <rect key={object.id} x={x1} y={y1} width={x2 - x1} height={y2 - y1} fill="none" stroke="#173e3b" strokeWidth=".09" /> })}
  </svg>
}

export function VisionPreparation() {
  const [preset, setPreset] = useState<Preparation>('original')
  const [masks, setMasks] = useState(false)
  const original = prepareScene('original')
  const result = prepareScene(preset)
  const active = choices.find(choice => choice.id === preset)!
  return <article className="vprep-lesson"><header className="vprep-header"><p className="vprep-eyebrow">98.3 · Computer Vision</p><h1>Preparing images without changing the task</h1><p className="vprep-definition"><strong>Image preparation</strong> changes an image for a task while keeping its labels and annotations aligned.</p><p>Choose a transformation and see what happens to the same image and its objects.</p></header>
    <section className="vprep-panel" aria-labelledby="vprep-title"><div className="vprep-heading"><div><p className="vprep-eyebrow">ONE IMAGE · INDEPENDENT PRESETS</p><h2 id="vprep-title">Compare the image and its annotations</h2></div><p>Each choice starts from the original, not the previous result. Dimensions are width × height.</p></div>
      <div className="vprep-choices" role="group" aria-label="Choose a preparation preset">{choices.map(item => <button type="button" key={item.id} aria-pressed={preset === item.id} onClick={() => setPreset(item.id)}><b>{item.name}</b><small>{item.size}</small></button>)}</div>
      <div className="vprep-display-toggle" role="group" aria-label="Choose visual display"><button type="button" aria-pressed={!masks} onClick={() => setMasks(false)}>Image + boxes</button><button type="button" aria-pressed={masks} onClick={() => setMasks(true)}>Masks + boxes</button></div>
      <div className="vprep-comparison"><div className="vprep-image"><p className="vprep-kicker">ORIGINAL · 6 × 6</p><Grid scene={original} masks={masks} /><p>Two squares · 1:1 image proportions</p></div><span className="vprep-arrow" aria-hidden="true">→</span><div className="vprep-image vprep-result" aria-live="polite"><p className="vprep-kicker">{active.name.toUpperCase()} · {result.width} × {result.height}</p><Grid scene={result} masks={masks} /><p>{result.objects.length} square-class {result.objects.length === 1 ? 'object' : 'objects'} · {result.width}:{result.height} canvas proportions</p></div></div>
      <div className="vprep-explanation" aria-live="polite"><h3>{active.name}: {active.size}</h3><p>{active.detail}</p><p><b>Box edges:</b> {active.calculation}</p><p>{result.objects.map(object => `${object.id === 'square1' ? 'Square 1' : 'Square 2'}: [${object.box.join(', ')}], ${object.count} mask pixels`).join(' · ')}</p><small>Boxes use [left, top, right, bottom] edges; the right and bottom edges are excluded. Colors distinguish objects, not classes.</small></div>
      <p className="vprep-note"><b>Nearest neighbor:</b> when resizing, each new pixel copies a nearby original pixel. Masks copy their category too, rather than blending category numbers. Padding is background, not an object. These are transformed authored annotations, not model predictions.</p>
    </section>
    <section className="vprep-augmentation"><div><p className="vprep-eyebrow">A SEPARATE DIRECTION EXAMPLE</p><h2>Can a flip change the label?</h2><p><b>Augmentation</b> makes altered training examples. Labels must still describe the transformed image. A direction-sensitive label cannot stay the same after this flip.</p></div><div className="vprep-direction"><div><span aria-hidden="true">→</span><b>Right arrow</b></div><span className="vprep-direction-label">flip →</span><div><span aria-hidden="true">←</span><b>Left arrow</b></div></div></section>
  </article>
}
