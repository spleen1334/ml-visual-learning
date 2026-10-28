export const itemsetProducts = [
  { id: 'chocolate', name: 'Chocolate' },
  { id: 'cheese', name: 'Cheese' },
  { id: 'banana', name: 'Banana' },
  { id: 'bread', name: 'Bread' },
] as const;

export type ItemsetProductId = (typeof itemsetProducts)[number]['id'];

export interface ItemsetTransaction {
  id: number;
  items: readonly ItemsetProductId[];
}

export const itemsetTransactions: readonly ItemsetTransaction[] = [
  { id: 1, items: ['chocolate', 'banana'] },
  { id: 2, items: ['chocolate', 'banana'] },
  { id: 3, items: ['chocolate', 'banana'] },
  { id: 4, items: ['chocolate', 'banana'] },
  { id: 5, items: ['chocolate', 'bread'] },
  { id: 6, items: ['banana', 'bread'] },
  { id: 7, items: ['banana', 'bread'] },
  { id: 8, items: ['banana', 'bread'] },
  { id: 9, items: ['bread', 'cheese'] },
  { id: 10, items: ['cheese'] },
];

export const itemsetMinimumSupport = 0.3;

export interface ItemsetSupport {
  itemset: readonly ItemsetProductId[];
  count: number;
  total: number;
  support: number;
  matchingTransactionIds: number[];
}

/** Support always uses all original transactions, including after itemset pruning. */
export function support(itemset: readonly ItemsetProductId[]): ItemsetSupport {
  const matching = itemsetTransactions.filter((transaction) =>
    itemset.every((productId) => transaction.items.includes(productId)),
  );

  return {
    itemset: [...itemset],
    count: matching.length,
    total: itemsetTransactions.length,
    support: matching.length / itemsetTransactions.length,
    matchingTransactionIds: matching.map(({ id }) => id),
  };
}

export interface ItemsetPairMetrics {
  antecedent: ItemsetProductId;
  consequent: ItemsetProductId;
  countA: number;
  countB: number;
  countJoint: number;
  supportA: number;
  supportB: number;
  supportJoint: number;
  confidence: number;
  lift: number;
}

/** Returns null for unknown, identical, or zero-occurrence inputs. */
export function pairMetrics(
  antecedent: string,
  consequent: string,
): ItemsetPairMetrics | null {
  const productIds = new Set<string>(itemsetProducts.map(({ id }) => id));
  if (
    !productIds.has(antecedent) ||
    !productIds.has(consequent) ||
    antecedent === consequent
  ) {
    return null;
  }

  const a = support([antecedent as ItemsetProductId]);
  const b = support([consequent as ItemsetProductId]);
  const joint = support([antecedent as ItemsetProductId, consequent as ItemsetProductId]);
  if (a.count === 0 || b.count === 0 || joint.count === 0) return null;

  return {
    antecedent: antecedent as ItemsetProductId,
    consequent: consequent as ItemsetProductId,
    countA: a.count,
    countB: b.count,
    countJoint: joint.count,
    supportA: a.support,
    supportB: b.support,
    supportJoint: joint.support,
    confidence: joint.count / a.count,
    lift: joint.support / (a.support * b.support),
  };
}

function combinations<T>(values: readonly T[], size: number): T[][] {
  if (size === 0) return [[]];
  return values.flatMap((value, index) =>
    combinations(values.slice(index + 1), size - 1).map((rest) => [value, ...rest]),
  );
}

/** The complete 15 non-empty itemsets for the four-product inventory. */
export const allNonemptyItemsets: readonly (readonly ItemsetProductId[])[] =
  Array.from({ length: itemsetProducts.length }, (_, index) =>
    combinations(itemsetProducts.map(({ id }) => id), index + 1),
  ).flat();

/** Pair rules whose joint itemset meets minimum support, in both directions. */
export const frequentRemainingPairs: readonly ItemsetPairMetrics[] =
  combinations(itemsetProducts.map(({ id }) => id), 2)
    .filter((pair) => support(pair).support >= itemsetMinimumSupport)
    .flatMap(([first, second]) => [
      pairMetrics(first, second),
      pairMetrics(second, first),
    ])
    .filter((metrics): metrics is ItemsetPairMetrics => metrics !== null);
