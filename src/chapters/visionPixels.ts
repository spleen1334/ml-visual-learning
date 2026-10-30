import type { VisionRGB } from './visionScene'

export type PixelImage = readonly (readonly VisionRGB[])[]
export function grayscale([r, g, b]: VisionRGB) { return Math.round((299 * r + 587 * g + 114 * b) / 1000) }
export function scaleByte(value: number) { return value / 255 }
export function editChannel(image: PixelImage, row: number, column: number, channel: number, value: number): PixelImage {
  if (!Number.isInteger(value) || value < 0 || value > 255 || !Number.isInteger(channel) || channel < 0 || channel > 2 || !image[row]?.[column]) return image
  return image.map((pixels, y) => y !== row ? pixels : pixels.map((pixel, x): VisionRGB => x !== column ? pixel : [channel === 0 ? value : pixel[0], channel === 1 ? value : pixel[1], channel === 2 ? value : pixel[2]]))
}
