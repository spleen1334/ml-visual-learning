import { describe, expect, it } from 'vitest'
import { visionScene } from './visionScene'
import { prepareScene, type Preparation } from './visionPreparationData'

describe('preparation presets', () => {
  const cases: [Preparation, number, number, number[][], number[]][] = [
    ['original', 6, 6, [[1,1,3,3],[3,3,5,5]], [4,4]],
    ['stretch', 12, 6, [[2,1,6,3],[6,3,10,5]], [8,8]],
    ['fit', 12, 6, [[4,1,6,3],[6,3,8,5]], [4,4]],
    ['pad', 8, 8, [[2,2,4,4],[4,4,6,6]], [4,4]],
    ['crop', 3, 3, [[1,1,3,3]], [4]],
    ['flip', 6, 6, [[3,1,5,3],[1,3,3,5]], [4,4]],
  ]
  it.each(cases)('%s keeps RGB, masks and boxes aligned', (preset, width, height, boxes, counts) => {
    const result = prepareScene(preset)
    expect([result.width, result.height]).toEqual([width, height])
    expect(result.objects.map(object => object.box)).toEqual(boxes)
    expect(result.objects.map(object => object.count)).toEqual(counts)
    expect(result.pixels).toHaveLength(height)
    result.pixels.forEach((row, y) => {
      expect(row).toHaveLength(width)
      row.forEach((rgb, x) => {
        const object = result.objects.find(item => item.mask[y][x] === 1)
        expect(rgb).toEqual(object ? object.id === 'square1' ? visionScene.palette.teal : visionScene.palette.orange : visionScene.palette.background)
        if (object) expect(x >= object.box[0] && x < object.box[2] && y >= object.box[1] && y < object.box[3]).toBe(true)
      })
    })
  })
  it('leaves the original untouched and restores it independently', () => {
    const before = JSON.stringify(visionScene)
    prepareScene('stretch'); prepareScene('crop'); prepareScene('flip')
    expect(JSON.stringify(visionScene)).toBe(before)
    expect(prepareScene('original').pixels).toEqual(visionScene.pixels)
    expect(prepareScene('crop').objects.map(object => object.id)).toEqual(['square1'])
  })
})
