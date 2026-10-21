import { describe, expect, it } from 'vitest'
import { sigmoid, logLikelihood, confusion } from './logisticMath'
import workbook from './logisticWorkbookData.json'
describe('logistic probability and evidence', () => {
 it('is bounded and stable at extreme scores', () => { expect(sigmoid(0)).toBe(.5); expect(sigmoid(1000)).toBe(1); expect(sigmoid(-1000)).toBe(0) })
 it('uses product likelihood rather than summed agreement', () => { expect(logLikelihood([{x:0,y:0},{x:0,y:1}],0,0)).toBeCloseTo(Math.log(.25)); expect(logLikelihood([{x:0,y:1}],1000,0)).toBeCloseTo(0); expect(logLikelihood([{x:0,y:0}],1000,0)).toBe(-1000) })
 it('matches a three-row observed-outcome product with its equivalent log sum', () => {
  const rows = [{x:20,y:1},{x:4,y:0},{x:14,y:1}]
  const contributions = rows.map(({x,y}) => { const p = sigmoid(-7 + .5*x); return y === 1 ? p : 1-p })
  const product = contributions.reduce((value, contribution) => value * contribution, 1)
  const sumOfLogs = contributions.reduce((value, contribution) => value + Math.log(contribution), 0)
  expect(new Set(rows.map(row => row.x)).size).toBe(3)
  expect(logLikelihood(rows,-7,.5)).toBeCloseTo(sumOfLogs)
  expect(Math.log(product)).toBeCloseTo(sumOfLogs)
 })
 it('raising threshold trades fewer false alarms for more misses', () => { const rows = [{x:0,y:0},{x:1,y:0},{x:2,y:1}]; expect(confusion(rows,0,1,.5)).toEqual({tp:1,tn:0,fp:2,fn:0}); expect(confusion(rows,0,1,.9)).toEqual({tp:0,tn:2,fp:0,fn:1}) })
})

describe('logistic worksheet reproduction', () => {
 it('preserves all source records and reproduces every saved row calculation', () => {
  expect(workbook.rawData).toHaveLength(624)
  expect(new Set(workbook.rawData.map(row => row.customer)).size).toBe(624)
  expect(workbook.rawData.reduce((sum, row) => sum + row.unsubscribe, 0)).toBe(306)
  for (const row of workbook.rawData) {
   const p = sigmoid(-21.962 + 2.516 * row.emailsPerWeek)
   expect(p).toBeCloseTo(row.predictionCached, 12)
   expect(row.unsubscribe === 1 ? p : 1-p).toBeCloseTo(row.likelihoodCached, 12)
  }
 })
 it('matches the worksheet sum separately from statistical likelihood and the query', () => {
  const score = workbook.rawData.reduce((sum, row) => sum + row.likelihoodCached, 0)
  expect(score).toBeCloseTo(594.43112022596176, 9)
  expect(sigmoid(-21.962 + 2.516 * 9)).toBeCloseTo(.6641849304023331, 12)
  expect(21.962 / 2.516).toBeCloseTo(8.72893481717011, 10)
  const rows = workbook.rawData.map(row => ({x:row.emailsPerWeek,y:row.unsubscribe}))
  expect(logLikelihood(rows, -21.962, 2.516)).toBeLessThan(0)
  expect(Math.exp(logLikelihood(rows, -21.962, 2.516))).toBeLessThan(1)
 })
})
