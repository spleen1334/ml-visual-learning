import { describe, expect, it } from 'vitest'
import { countDocuments, countInVocabulary, countMatrix, featureOccurrences, featureTokens, orderDocuments } from './nlpCountFeatures'

describe('count features', () => {
  it('counts the selected messages in deterministic alphabetical columns', () => {
    const matrix = countMatrix(countDocuments, 'unigram')
    expect(matrix.vocabulary).toEqual(['all', 'and', 'app', 'at', 'for', 'help', 'helpful', 'i', 'is', 'not', 'quick', 'reply', 'team', 'this', 'waited', 'working'])
    expect([matrix.counts.length, matrix.vocabulary.length, matrix.cells, matrix.zeros]).toEqual([4, 16, 64, 46])
    expect(matrix.counts[2][matrix.vocabulary.indexOf('waited')]).toBe(2)
    expect(matrix.counts[3][matrix.vocabulary.indexOf('not')]).toBe(1)
    expect(matrix.counts[0][matrix.vocabulary.indexOf('not')]).toBe(0)
    expect(countMatrix([...countDocuments].reverse(), 'unigram').vocabulary).toEqual(matrix.vocabulary)
  })
  it('keeps not helpful as one adjacent bigram and retains source token offsets', () => {
    const matrix = countMatrix(countDocuments, 'bigram')
    expect([matrix.vocabulary.length, matrix.cells, matrix.zeros]).toEqual([15, 60, 45])
    const occurrence = matrix.occurrences[3].find(item => item.term === 'not helpful')!
    expect(occurrence.tokens.map(token => [token.text, token.start, token.end])).toEqual([['not', 0, 3], ['helpful', 4, 11]])
    expect(matrix.counts[3][matrix.vocabulary.indexOf('not helpful')]).toBe(1)
    const repeats = featureOccurrences(countDocuments[2].text, 'unigram').filter(item => item.term === 'waited')
    expect(repeats.map(item => item.tokens[0].start)).toEqual([2, 13])
  })
  it('shows identical unigram and distinct bigram vectors for reversed word order', () => {
    const unigram = countMatrix(orderDocuments, 'unigram')
    expect(unigram.vocabulary).toEqual(['cat', 'chased', 'dog'])
    expect(unigram.counts).toEqual([[1, 1, 1], [1, 1, 1]])
    const bigram = countMatrix(orderDocuments, 'bigram')
    expect(bigram.vocabulary).toEqual(['cat chased', 'chased cat', 'chased dog', 'dog chased'])
    expect(bigram.counts).toEqual([[1, 0, 1, 0], [0, 1, 0, 1]])
  })
  it('defines punctuation, apostrophe, empty and unknown feature behavior', () => {
    expect(featureTokens("I'm here. Not there!").map(token => token.text)).toEqual(["i'm", 'here', 'not', 'there'])
    expect(featureOccurrences('Here. Not there!', 'bigram').map(item => item.term)).toEqual(['here not', 'not there'])
    expect(countMatrix([], 'unigram')).toEqual({ vocabulary: [], counts: [], occurrences: [], zeros: 0, cells: 0 })
    expect(countMatrix([{ id: 'empty', text: '' }], 'bigram').counts).toEqual([[]])
    expect(countInVocabulary('Unseen words', 'unigram', ['cat', 'dog'])).toEqual([0, 0])
  })
})
