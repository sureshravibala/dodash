import { describe, test, expect } from '@jest/globals';
import {
  forEach, forEachRight, map, filter, reject,
  find, findLast, every, some, includes,
  groupBy, keyBy, countBy, reduce, reduceRight,
  sortBy, orderBy, flatMap, flatMapDeep,
  partition, sample, sampleSize, shuffle, size, invokeMap,
} from '../src/collection/index.js';

describe('Collection', () => {
  // forEach / forEachRight
  test('forEach iterates in order', () => {
    const result = [];
    forEach([1, 2, 3], (v) => result.push(v));
    expect(result).toEqual([1, 2, 3]);
  });

  test('forEachRight iterates in reverse', () => {
    const result = [];
    forEachRight([1, 2, 3], (v) => result.push(v));
    expect(result).toEqual([3, 2, 1]);
  });

  test('forEach works with objects', () => {
    const keys = [];
    forEach({ a: 1, b: 2 }, (v, k) => keys.push(k));
    expect(keys).toEqual(['a', 'b']);
  });

  // map
  test('map transforms elements', () => {
    expect(map([1, 2, 3], (n) => n * 2)).toEqual([2, 4, 6]);
  });

  test('map with string iteratee', () => {
    expect(map([{ a: 1 }, { a: 2 }], 'a')).toEqual([1, 2]);
  });

  // filter / reject
  test('filter returns matching elements', () => {
    expect(filter([1, 2, 3, 4], (n) => n % 2 === 0)).toEqual([2, 4]);
  });

  test('filter with object predicate', () => {
    const users = [{ name: 'a', active: true }, { name: 'b', active: false }];
    expect(filter(users, { active: true })).toEqual([{ name: 'a', active: true }]);
  });

  test('reject returns non-matching elements', () => {
    expect(reject([1, 2, 3, 4], (n) => n % 2 === 0)).toEqual([1, 3]);
  });

  // find / findLast
  test('find returns first match', () => {
    expect(find([1, 2, 3, 4], (n) => n > 2)).toBe(3);
  });

  test('findLast returns last match', () => {
    expect(findLast([1, 2, 3, 4], (n) => n > 2)).toBe(4);
  });

  // every / some
  test('every checks all elements', () => {
    expect(every([2, 4, 6], (n) => n % 2 === 0)).toBe(true);
    expect(every([2, 3, 6], (n) => n % 2 === 0)).toBe(false);
  });

  test('some checks any element', () => {
    expect(some([1, 3, 5], (n) => n % 2 === 0)).toBe(false);
    expect(some([1, 2, 3], (n) => n % 2 === 0)).toBe(true);
  });

  // includes
  test('includes finds value', () => {
    expect(includes([1, 2, 3], 2)).toBe(true);
    expect(includes('hello', 'ell')).toBe(true);
  });

  // groupBy
  test('groupBy groups by iteratee', () => {
    expect(groupBy([6.1, 4.2, 6.3], Math.floor)).toEqual({ '4': [4.2], '6': [6.1, 6.3] });
  });

  test('groupBy with string iteratee', () => {
    expect(groupBy(['one', 'two', 'three'], 'length')).toEqual({
      '3': ['one', 'two'],
      '5': ['three'],
    });
  });

  // keyBy
  test('keyBy keys by iteratee', () => {
    const users = [{ id: 'a1', name: 'Fred' }, { id: 'b2', name: 'Barney' }];
    expect(keyBy(users, 'id')).toEqual({
      a1: { id: 'a1', name: 'Fred' },
      b2: { id: 'b2', name: 'Barney' },
    });
  });

  // countBy
  test('countBy counts by iteratee', () => {
    expect(countBy([6.1, 4.2, 6.3], Math.floor)).toEqual({ '4': 1, '6': 2 });
  });

  // reduce / reduceRight
  test('reduce accumulates value', () => {
    expect(reduce([1, 2, 3], (sum, n) => sum + n, 0)).toBe(6);
  });

  test('reduceRight accumulates from right', () => {
    expect(reduceRight([[1, 2], [3, 4]], (acc, n) => acc.concat(n), [])).toEqual([3, 4, 1, 2]);
  });

  // sortBy
  test('sortBy sorts by iteratee', () => {
    const users = [{ name: 'Fred', age: 48 }, { name: 'Barney', age: 36 }];
    expect(sortBy(users, 'age')).toEqual([{ name: 'Barney', age: 36 }, { name: 'Fred', age: 48 }]);
  });

  // orderBy
  test('orderBy supports asc/desc', () => {
    const users = [
      { name: 'Fred', age: 48 },
      { name: 'Barney', age: 36 },
      { name: 'Fred', age: 40 },
    ];
    const result = orderBy(users, ['name', 'age'], ['asc', 'desc']);
    expect(result[0]).toEqual({ name: 'Barney', age: 36 });
    expect(result[1]).toEqual({ name: 'Fred', age: 48 });
    expect(result[2]).toEqual({ name: 'Fred', age: 40 });
  });

  // flatMap / flatMapDeep
  test('flatMap maps and flattens one level', () => {
    expect(flatMap([1, 2, 3], (n) => [n, n])).toEqual([1, 1, 2, 2, 3, 3]);
  });

  test('flatMapDeep maps and flattens all levels', () => {
    expect(flatMapDeep([1, 2], (n) => [[n, n]])).toEqual([1, 1, 2, 2]);
  });

  // partition
  test('partition splits by predicate', () => {
    expect(partition([1, 2, 3, 4], (n) => n % 2 === 0)).toEqual([[2, 4], [1, 3]]);
  });

  // sample / sampleSize / shuffle
  test('sample returns an element', () => {
    const result = sample([1, 2, 3, 4]);
    expect([1, 2, 3, 4]).toContain(result);
  });

  test('sampleSize returns n elements', () => {
    const result = sampleSize([1, 2, 3, 4, 5], 3);
    expect(result).toHaveLength(3);
    result.forEach((v) => expect([1, 2, 3, 4, 5]).toContain(v));
  });

  test('shuffle returns array of same length', () => {
    const result = shuffle([1, 2, 3, 4, 5]);
    expect(result).toHaveLength(5);
    expect(result.sort()).toEqual([1, 2, 3, 4, 5]);
  });

  // size
  test('size returns collection size', () => {
    expect(size([1, 2, 3])).toBe(3);
    expect(size({ a: 1, b: 2 })).toBe(2);
    expect(size('hello')).toBe(5);
    expect(size(new Map([['a', 1]]))).toBe(1);
    expect(size(new Set([1, 2]))).toBe(2);
    expect(size(null)).toBe(0);
  });

  // invokeMap
  test('invokeMap invokes method on each element', () => {
    expect(invokeMap([[5, 1, 7], [3, 2, 1]], 'sort')).toEqual([[1, 5, 7], [1, 2, 3]]);
  });
});
