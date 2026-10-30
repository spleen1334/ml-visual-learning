import { featureMap, gradients } from './visionFeatureMaps'

export type Matrix = readonly (readonly number[])[]
export const signedMaps = gradients.map(filter => featureMap(filter, 1, 1))
export const relu = (input: Matrix) => input.map(row => row.map(value => Math.max(0, value)))
export const poolWindow = (input: Matrix, row: number, column: number) => [input[row * 2][column * 2], input[row * 2][column * 2 + 1], input[row * 2 + 1][column * 2], input[row * 2 + 1][column * 2 + 1]]
export const maxPool = (input: Matrix) => Array.from({ length: Math.floor(input.length / 2) }, (_, row) => Array.from({ length: Math.floor(input[0].length / 2) }, (_, column) => Math.max(...poolWindow(input, row, column))))
export const average = (values: readonly number[]) => values.reduce((sum, value) => sum + value, 0) / values.length
export const comparisonWindows: readonly (readonly number[])[] = [[1, 1, 3, 4], [0, 0, 0, 4]]
