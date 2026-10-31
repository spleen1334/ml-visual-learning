import { describe, expect, it } from 'vitest'
import { visionScene } from './visionScene'
import { editChannel, grayscale, scaleByte } from './visionPixelsData'

describe('image pixels', () => {
  it('rounds the documented weighted grayscale intensities', () => {
    expect(grayscale(visionScene.palette.background)).toBe(232) // 231.884 rounds to 232
    expect(grayscale(visionScene.palette.teal)).toBe(102)
    expect(grayscale(visionScene.palette.orange)).toBe(155)
  })
  it('scales byte endpoints', () => { expect(scaleByte(0)).toBe(0); expect(scaleByte(255)).toBe(1) })
  it('changes only one channel of one pixel without changing the source', () => {
    const result = editChannel(visionScene.pixels, 1, 1, 0, 200)
    expect(result[1][1]).toEqual([200, 130, 120])
    expect(visionScene.pixels[1][1]).toEqual([40, 130, 120])
    expect(result.flat().filter((pixel, index) => pixel !== visionScene.pixels.flat()[index])).toHaveLength(1)
    expect(editChannel(result, 1, 1, 0, 256)).toBe(result)
  })
})
