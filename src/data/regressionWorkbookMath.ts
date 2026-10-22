import workbook from './regressionWorkbook.json'

export const regressionSource = workbook
export const coneRows = workbook.coneZone.rows
export const marketingRows = workbook.nonlinear.rows

const linearCoefficients = workbook.nonlinear.linear.coefficients.rows
const logCoefficients = workbook.nonlinear.log.coefficients.rows

export const rawLinearModel = {
  intercept: Number(linearCoefficients[0][1]),
  slope: Number(linearCoefficients[1][1]),
}

export const logSpendModel = {
  intercept: Number(logCoefficients[0][1]),
  slope: Number(logCoefficients[1][1]),
}

export function predictRawSpend(spend: number): number {
  return rawLinearModel.intercept + rawLinearModel.slope * spend
}

export function predictLogSpend(spend: number): number {
  if (!(spend > 0)) throw new RangeError('Log-spend predictions require positive spend')
  return logSpendModel.intercept + logSpendModel.slope * Math.log(spend)
}

export function sumSquaredError(actual: readonly number[], predicted: readonly number[]): number {
  if (actual.length === 0 || actual.length !== predicted.length) throw new RangeError('SSE requires equally sized, non-empty series')
  return actual.reduce((sum, value, index) => sum + (value - predicted[index]) ** 2, 0)
}

export function coneCandidateSse(intercept: number, slope: number): number {
  return sumSquaredError(coneRows.map(row => row.sales), coneRows.map(row => intercept + slope * row.temperature))
}

export function coneForecast(temperature: number): number {
  const { intercept, slope } = workbook.coneZone.fittedLine
  return intercept + slope * temperature
}
