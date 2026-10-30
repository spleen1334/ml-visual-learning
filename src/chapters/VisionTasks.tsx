import { useState } from 'react'
import { visionScene } from './visionScene'
import './VisionTasks.css'

const tasks = [
  { name: 'Classification', shape: 'One image label', explanation: 'Give the whole image one label. The label tells us what is present, but not where.' },
  { name: 'Object detection', shape: 'Boxes + class labels', explanation: 'Locate each object with a box and name its class. Both objects belong to the class square.' },
  { name: 'Semantic segmentation', shape: 'One class per pixel', explanation: 'Assign a class to every pixel. All square pixels share one class, even when they belong to different objects.' },
  { name: 'Instance segmentation', shape: 'One mask per object', explanation: 'Separate individual objects with a pixel mask for each one. Both masks still have the same class: square.' },
] as const

type View = 'image' | 'detection' | 'semantic' | 'instance1' | 'instance2'

function SceneGrid({ view }: { view: View }) {
  const isMask = view === 'semantic' || view === 'instance1' || view === 'instance2'
  return <svg className="vision-grid" viewBox="0 0 6 6" role="img" aria-label={view === 'image' ? 'Six by six image: a teal square and an orange square' : view === 'detection' ? 'Image with two boxes, each labelled square' : view === 'semantic' ? 'Semantic mask: eight square pixels and 28 background pixels' : `${view === 'instance1' ? 'First' : 'Second'} square instance mask: four selected pixels`}>
    {visionScene.pixels.map((row, y) => row.map((pixel, x) => {
      const selected = view === 'semantic' ? visionScene.semanticMask[y][x] : visionScene.objects[view === 'instance2' ? 1 : 0].binaryMask[y][x]
      const fill = !isMask ? `rgb(${pixel.join(',')})` : selected ? view === 'semantic' ? '#327768' : view === 'instance1' ? '#288278' : '#dc8c3c' : '#f1eee4'
      return <rect key={`${y}-${x}`} x={x} y={y} width="1" height="1" fill={fill} stroke="#ffffff" strokeOpacity=".55" strokeWidth=".025" />
    }))}
    {view === 'detection' && visionScene.objects.map((object, index) => { const [x1, y1, x2, y2] = object.box; return <g key={object.id}><rect x={x1} y={y1} width={x2 - x1} height={y2 - y1} fill="none" stroke="#153e39" strokeWidth=".09" /><text x={x1 + .06} y={y1 + .25} fontSize=".27" fill={index === 0 ? '#fff' : '#173b35'} fontWeight="bold">square {index + 1}</text></g> })}
  </svg>
}

export function VisionTasks() {
  const [task, setTask] = useState(0)
  return <article className="vision-lesson">
    <header className="vision-header"><p className="vision-eyebrow">98.1 · Computer Vision</p><h1>What can a computer see?</h1><p className="vision-definition"><strong>Computer vision</strong> is the use of computers to interpret images.</p><p>The same image can be described in different ways, depending on the task.</p></header>
    <section className="vision-panel" aria-labelledby="vision-task-title">
      <div className="vision-heading"><div><p className="vision-eyebrow">ONE IMAGE · FOUR TASKS</p><h2 id="vision-task-title">Choose what to look for</h2></div><p>Select a task to compare its output.</p></div>
      <div className="vision-task-list" role="group" aria-label="Choose a computer vision task">{tasks.map((item, index) => <button type="button" key={item.name} aria-pressed={task === index} onClick={() => setTask(index)}><span>0{index + 1}</span><strong>{item.name}</strong><small>{item.shape}</small></button>)}</div>
      <div className="vision-flow"><div className="vision-input"><p className="vision-kicker">INPUT · SAME 6 × 6 IMAGE</p><SceneGrid view="image" /><p>Two colored squares in a 36-pixel image.</p></div><div className="vision-arrow" aria-hidden="true">→</div><div className="vision-output" aria-live="polite"><p className="vision-kicker">OUTPUT · {tasks[task].shape.toUpperCase()}</p><h3>{tasks[task].name}</h3><p>{tasks[task].explanation}</p>
        {task === 0 && <div className="vision-label"><span>IMAGE LABEL</span><strong>{visionScene.imageLabel}</strong><small>1 label for the whole image</small></div>}
        {task === 1 && <div className="vision-visual"><SceneGrid view="detection" /><div><p><b>2 boxes · same class</b></p><p>{visionScene.objects.map((object, index) => <span key={object.id}>Square {index + 1}: [{object.box.join(', ')}]<br /></span>)}</p><small>Each box is [left, top, right, bottom]. Coordinates start at the top-left; right and bottom edges are excluded.</small><p className="vision-shape">2 × 4 coordinates + 2 labels</p></div></div>}
        {task === 2 && <div className="vision-visual"><SceneGrid view="semantic" /><div><p><b>One class map · 6 × 6</b></p><p><span className="vision-swatch vision-square" /> Square: 8 pixels<br /><span className="vision-swatch vision-background" /> Background: 28 pixels</p><small>One square class covers both objects; it does not distinguish them.</small><p className="vision-shape">36 pixel class IDs</p></div></div>}
        {task === 3 && <><div className="vision-instance-masks"><div><SceneGrid view="instance1" /><b>Square 1 · 4 pixels</b></div><div><SceneGrid view="instance2" /><b>Square 2 · 4 pixels</b></div></div><p className="vision-shape">2 masks × 6 × 6 pixels + object labels</p><p className="vision-note">Colors distinguish objects, not classes. Each binary mask uses 1 for its object and 0 for all other pixels.</p></>}
      </div></div>
      <p className="vision-caption">The image and annotations are authored for this lesson—not predictions from a model.</p>
    </section>
  </article>
}
