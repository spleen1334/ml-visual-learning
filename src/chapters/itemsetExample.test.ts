import { describe, expect, it } from 'vitest';
import {
  allNonemptyItemsets,
  frequentRemainingPairs,
  itemsetMinimumSupport,
  itemsetTransactions,
  pairMetrics,
  support,
} from './itemsetExample';

describe('itemset teaching example', () => {
  it('keeps all ten original transactions as the support denominator', () => {
    expect(itemsetTransactions).toHaveLength(10);
    expect(itemsetMinimumSupport).toBe(0.3);
    expect(support(['chocolate'])).toMatchObject({ count: 5, total: 10, support: 0.5 });
    expect(support(['cheese'])).toMatchObject({ count: 2, total: 10, support: 0.2 });
    expect(support(['banana'])).toMatchObject({ count: 7, total: 10, support: 0.7 });
    expect(support(['bread'])).toMatchObject({ count: 5, total: 10, support: 0.5 });
  });

  it('includes all 15 non-empty itemsets and identifies the rare pairs', () => {
    expect(allNonemptyItemsets).toHaveLength(15);
    expect(support(['chocolate', 'banana'])).toMatchObject({ count: 4, support: 0.4 });
    expect(support(['banana', 'bread'])).toMatchObject({ count: 3, support: 0.3 });
    expect(support(['chocolate', 'bread'])).toMatchObject({ count: 1, support: 0.1 });
    expect(support(['cheese', 'bread'])).toMatchObject({ count: 1, support: 0.1 });
  });

  it('calculates directional confidence and lift for qualifying pairs', () => {
    const chocolateBanana = pairMetrics('chocolate', 'banana');
    expect(chocolateBanana).not.toBeNull();
    expect(chocolateBanana).toMatchObject({ countJoint: 4, confidence: 0.8 });
    expect(chocolateBanana!.lift).toBeCloseTo(8 / 7);
    expect(pairMetrics('banana', 'chocolate')?.confidence).toBe(4 / 7);
    const breadBanana = pairMetrics('bread', 'banana');
    expect(breadBanana).not.toBeNull();
    expect(breadBanana).toMatchObject({ countJoint: 3, confidence: 0.6 });
    expect(breadBanana!.lift).toBeCloseTo(6 / 7);
    expect(frequentRemainingPairs.map(({ antecedent, consequent }) => `${antecedent}->${consequent}`))
      .toEqual(['chocolate->banana', 'banana->chocolate', 'banana->bread', 'bread->banana']);
  });

  it('guards invalid pair inputs', () => {
    expect(pairMetrics('chocolate', 'chocolate')).toBeNull();
    expect(pairMetrics('unknown', 'banana')).toBeNull();
    expect(pairMetrics('cheese', 'chocolate')).toBeNull();
  });
});
