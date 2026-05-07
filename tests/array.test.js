import { describe, test, expect } from '@jest/globals';
import {
  chunk, compact, concat, difference, differenceBy,
  drop, dropRight, dropWhile, fill, flatten, flattenDeep, flattenDepth,
  fromPairs, head, first, last, nth, initial, tail,
  intersection, uniq, uniqBy, union, without,
  zip, unzip, zipObject, take, takeRight, takeWhile,
  xor, indexOf, reverse, sortedUniq, pull, remove,
} from '../src/array/index.js';

describe('Array', () => {
  // chunk
  test('chunk splits array into groups', () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    expect(chunk([1, 2, 3], 1)).toEqual([[1], [2], [3]]);
    expect(chunk([], 2)).toEqual([]);
  });

  // compact
  test('compact removes falsey values', () => {
    expect(compact([0, 1, false, 2, '', 3, null, undefined, NaN])).toEqual([1, 2, 3]);
  });

  // concat
  test('concat merges arrays and values', () => {
    expect(concat([1], 2, [3], [[4]])).toEqual([1, 2, 3, [4]]);
  });

  // difference
  test('difference returns values not in other arrays', () => {
    expect(difference([1, 2, 3], [2, 4], [3])).toEqual([1]);
  });

  // differenceBy
  test('differenceBy with iteratee', () => {
    expect(differenceBy([2.1, 1.2], [2.3, 3.4], Math.floor)).toEqual([1.2]);
  });

  // drop / dropRight / dropWhile
  test('drop removes n elements from start', () => {
    expect(drop([1, 2, 3], 2)).toEqual([3]);
    expect(drop([1, 2, 3])).toEqual([2, 3]);
  });

  test('dropRight removes n elements from end', () => {
    expect(dropRight([1, 2, 3], 2)).toEqual([1]);
  });

  test('dropWhile drops while predicate is true', () => {
    expect(dropWhile([1, 2, 3, 4], (n) => n < 3)).toEqual([3, 4]);
  });

  // fill
  test('fill replaces elements', () => {
    expect(fill([1, 2, 3], 'a')).toEqual(['a', 'a', 'a']);
    expect(fill([4, 6, 8, 10], '*', 1, 3)).toEqual([4, '*', '*', 10]);
  });

  // flatten / flattenDeep / flattenDepth
  test('flatten one level', () => {
    expect(flatten([1, [2, [3, [4]], 5]])).toEqual([1, 2, [3, [4]], 5]);
  });

  test('flattenDeep all levels', () => {
    expect(flattenDeep([1, [2, [3, [4]], 5]])).toEqual([1, 2, 3, 4, 5]);
  });

  test('flattenDepth to specified depth', () => {
    expect(flattenDepth([1, [2, [3, [4]], 5]], 2)).toEqual([1, 2, 3, [4], 5]);
  });

  // fromPairs
  test('fromPairs creates object from pairs', () => {
    expect(fromPairs([['a', 1], ['b', 2]])).toEqual({ a: 1, b: 2 });
  });

  // head / first / last / nth
  test('head returns first element', () => {
    expect(head([1, 2, 3])).toBe(1);
    expect(first([1, 2, 3])).toBe(1);
    expect(head([])).toBeUndefined();
  });

  test('last returns last element', () => {
    expect(last([1, 2, 3])).toBe(3);
  });

  test('nth returns element at index', () => {
    expect(nth([1, 2, 3], 1)).toBe(2);
    expect(nth([1, 2, 3], -1)).toBe(3);
  });

  // initial / tail
  test('initial returns all but last', () => {
    expect(initial([1, 2, 3])).toEqual([1, 2]);
  });

  test('tail returns all but first', () => {
    expect(tail([1, 2, 3])).toEqual([2, 3]);
  });

  // intersection
  test('intersection returns shared values', () => {
    expect(intersection([1, 2, 3], [2, 3, 4], [3, 4, 5])).toEqual([3]);
  });

  // uniq / uniqBy
  test('uniq removes duplicates', () => {
    expect(uniq([1, 2, 1, 3, 2])).toEqual([1, 2, 3]);
  });

  test('uniqBy with iteratee', () => {
    expect(uniqBy([2.1, 1.2, 2.3], Math.floor)).toEqual([2.1, 1.2]);
  });

  // union
  test('union creates unique union', () => {
    expect(union([1, 2], [2, 3], [3, 4])).toEqual([1, 2, 3, 4]);
  });

  // without
  test('without excludes values', () => {
    expect(without([1, 2, 3, 1, 2], 1, 2)).toEqual([3]);
  });

  // zip / unzip / zipObject
  test('zip groups elements', () => {
    expect(zip(['a', 'b'], [1, 2], [true, false])).toEqual([['a', 1, true], ['b', 2, false]]);
  });

  test('zipObject creates object', () => {
    expect(zipObject(['a', 'b'], [1, 2])).toEqual({ a: 1, b: 2 });
  });

  // take / takeRight / takeWhile
  test('take returns first n elements', () => {
    expect(take([1, 2, 3], 2)).toEqual([1, 2]);
  });

  test('takeRight returns last n elements', () => {
    expect(takeRight([1, 2, 3], 2)).toEqual([2, 3]);
  });

  test('takeWhile takes while predicate is true', () => {
    expect(takeWhile([1, 2, 3, 4], (n) => n < 3)).toEqual([1, 2]);
  });

  // indexOf
  test('indexOf finds element', () => {
    expect(indexOf([1, 2, 3, 1], 1)).toBe(0);
    expect(indexOf([1, 2, 3, 1], 1, 2)).toBe(3);
  });

  // reverse (non-mutating)
  test('reverse returns new reversed array', () => {
    const arr = [1, 2, 3];
    expect(reverse(arr)).toEqual([3, 2, 1]);
    expect(arr).toEqual([1, 2, 3]); // original untouched
  });

  // sortedUniq
  test('sortedUniq removes consecutive duplicates', () => {
    expect(sortedUniq([1, 1, 2, 2, 3])).toEqual([1, 2, 3]);
  });

  // pull (mutating)
  test('pull removes values in-place', () => {
    const arr = [1, 2, 3, 1, 2];
    pull(arr, 1, 2);
    expect(arr).toEqual([3]);
  });

  // remove (mutating)
  test('remove extracts matching elements', () => {
    const arr = [1, 2, 3, 4];
    const removed = remove(arr, (n) => n % 2 === 0);
    expect(arr).toEqual([1, 3]);
    expect(removed).toEqual([2, 4]);
  });
});
