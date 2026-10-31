import { visionScene, type VisionBox, type VisionRGB } from './visionScene'

export type Preparation = 'original' | 'stretch' | 'fit' | 'pad' | 'crop' | 'flip'
export function prepareScene(preset: Preparation) {
  const width = preset === 'stretch' || preset === 'fit' ? 12 : preset === 'pad' ? 8 : preset === 'crop' ? 3 : 6
  const height = preset === 'pad' ? 8 : preset === 'crop' ? 3 : 6
  const source = (x: number, y: number): [number, number] | null => {
    if (preset === 'stretch') return [Math.floor(x / 2), y]
    if (preset === 'fit') return x >= 3 && x < 9 ? [x - 3, y] : null
    if (preset === 'pad') return x >= 1 && x < 7 && y >= 1 && y < 7 ? [x - 1, y - 1] : null
    if (preset === 'flip') return [5 - x, y]
    return [x, y]
  }
  const pixels: VisionRGB[][] = Array.from({ length: height }, (_, y) => Array.from({ length: width }, (_, x) => {
    const point = source(x, y)
    return point ? visionScene.pixels[point[1]][point[0]] : visionScene.palette.background
  }))
  const objects = visionScene.objects.map(object => {
    const mask = Array.from({ length: height }, (_, y) => Array.from({ length: width }, (_, x) => {
      const point = source(x, y)
      return point ? object.binaryMask[point[1]][point[0]] : 0
    }))
    const [x1, y1, x2, y2] = object.box
    let box: VisionBox = object.box
    if (preset === 'stretch') box = [2 * x1, y1, 2 * x2, y2]
    if (preset === 'fit') box = [x1 + 3, y1, x2 + 3, y2]
    if (preset === 'pad') box = [x1 + 1, y1 + 1, x2 + 1, y2 + 1]
    if (preset === 'flip') box = [6 - x2, y1, 6 - x1, y2]
    if (preset === 'crop') box = [Math.min(x1, 3), Math.min(y1, 3), Math.min(x2, 3), Math.min(y2, 3)]
    return { id: object.id, classLabel: object.classLabel, box, mask, count: mask.flat().reduce((a, b) => a + b, 0) }
  }).filter(object => object.count > 0)
  return { width, height, pixels, objects }
}
