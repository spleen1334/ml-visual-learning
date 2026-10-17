import { describe, expect, it } from 'vitest'
import { sigmoid, logLikelihood, confusion } from './logisticMath'
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
