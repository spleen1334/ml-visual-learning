import { useState } from 'react'

// Illustrative coefficients: the source image does not specify fitted weights.
const probability = (x: number, y: number) => 1 / (1 + Math.exp(-(x + y)))

export function LogisticSurface() {
  const [rotation, setRotation] = useState(45)
  const [elevation, setElevation] = useState(25)
  const azimuth = rotation * Math.PI / 180
  const tilt = elevation * Math.PI / 180
  const project = (x: number, y: number, z: number) => {
    const depth = x * Math.sin(azimuth) + y * Math.cos(azimuth)
    return {
      x: 440 + (x * Math.cos(azimuth) - y * Math.sin(azimuth)) * 59,
      y: 405 - depth * Math.sin(tilt) * 59 - z * Math.cos(tilt) * 285,
      depth: depth * Math.cos(tilt) - z * Math.sin(tilt) * 285 / 59,
    }
  }
  const point = (x: number, y: number, z: number) => {
    const p = project(x, y, z)
    return `${p.x},${p.y}`
  }
  const cells = Array.from({ length: 32 * 32 }, (_, index) => {
    const x = -3 + index % 32 * 6 / 32
    const y = -3 + Math.floor(index / 32) * 6 / 32
    const corners = [[x, y], [x + 6 / 32, y], [x + 6 / 32, y + 6 / 32], [x, y + 6 / 32]]
    const z = probability(x + 3 / 32, y + 3 / 32)
    return { index, z, depth: project(x + 3 / 32, y + 3 / 32, z).depth, points: corners.map(([a, b]) => point(a, b, probability(a, b))).join(' ') }
  }).sort((a, b) => b.depth - a.depth)
  return <figure className="logistic-surface">
    <h2>Two inputs → one probability surface</h2>
    <p>X₁ and X₂ are inputs. Height is the predicted probability P(Y = 1).</p>
    <svg viewBox="0 0 880 610" role="img" aria-label="Rotatable three-dimensional logistic surface. Probability rises smoothly from zero to one as the combined input score increases.">
      <g fill="none" stroke="#dce4df" strokeWidth="1">
        {[-3, -2, -1, 0, 1, 2, 3].map(v => <g key={v}>
          <polyline points={`${point(v, -3, 0)} ${point(v, 3, 0)}`} />
          <polyline points={`${point(-3, v, 0)} ${point(3, v, 0)}`} />
        </g>)}
      </g>
      {cells.map(cell => <polygon key={cell.index} points={cell.points} fill={`rgb(${Math.round(100 + 150 * cell.z)}, ${Math.round(227 + 25 * cell.z)}, ${Math.round(220 - 75 * cell.z)})`} stroke="#497d7040" strokeWidth=".45" />)}
      <g stroke="#41695f" strokeWidth="1.5" fill="none">
        <polyline points={`${point(-3, -3, 0)} ${point(3, -3, 0)}`} />
        <polyline points={`${point(-3, -3, 0)} ${point(-3, 3, 0)}`} />
        <polyline points={`${point(-3, -3, 0)} ${point(-3, -3, 1)}`} />
      </g>
      <g fill="#284b46" fontSize="17" textAnchor="middle">
        <text x={project(0, -3, 0).x} y={project(0, -3, 0).y + 35}>X₁</text>
        <text x={project(-3, 0, 0).x} y={project(-3, 0, 0).y + 35}>X₂</text>
        {[0, .5, 1].map(z => <text key={z} x={project(-3, -3, z).x - 25} y={project(-3, -3, z).y + 6}>{z}</text>)}
        <text x={project(-3, -3, 1).x} y={project(-3, -3, 1).y - 22}>P(Y = 1)</text>
      </g>
    </svg>
    <div className="logistic-surface__controls">
      <label>Rotate · {rotation}°<input type="range" min="-180" max="180" value={rotation} onChange={event => setRotation(Number(event.target.value))} /></label>
      <label>View from above · {elevation}°<input type="range" min="15" max="65" value={elevation} onChange={event => setElevation(Number(event.target.value))} /></label>
      <button type="button" onClick={() => { setRotation(45); setElevation(25) }}>Reset view</button>
    </div>
    <figcaption>Rotate the view to see the S-shaped transition from different angles. Illustrative surface: p = 1 / (1 + e⁻⁽ˣ¹⁺ˣ²⁾), with β₀ = 0 and β₁ = β₂ = 1; these weights are supplied, not fitted. With more than two inputs, the math still works, but we can no longer show all inputs and probability in one 3D graph.</figcaption>
  </figure>
}
