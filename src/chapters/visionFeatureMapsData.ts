import { filterImage, visionFilters, type VisionFilter } from './visionFiltersData'

export function outputSize(input: number, kernel: number, stride: number, padding: number) {
  return Math.floor((input + 2 * padding - kernel) / stride) + 1
}
export function sampledWindow(row: number, column: number, stride: number, padding: number) {
  return Array.from({ length: 3 }, (_, dy) => Array.from({ length: 3 }, (_, dx) => {
    const y = row * stride + dy - padding, x = column * stride + dx - padding
    const padded = y < 0 || x < 0 || y >= filterImage.length || x >= filterImage[0].length
    return { row: y, column: x, padded, value: padded ? 0 : filterImage[y][x] }
  }))
}
export function featureMap(filter: VisionFilter, stride: number, padding: number) {
  const size = outputSize(5, 3, stride, padding)
  return Array.from({ length: size }, (_, row) => Array.from({ length: size }, (_, column) =>
    sampledWindow(row, column, stride, padding).reduce((total, cells, y) => total + cells.reduce((sum, cell, x) => sum + cell.value * filter.kernel[y][x], 0), 0) / filter.divisor))
}
export const gradients = visionFilters.filter(filter => filter.id === 'x' || filter.id === 'y')
