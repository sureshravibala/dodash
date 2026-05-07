import { describe, test, expect } from '@jest/globals';
import {
  get, set, has, hasIn, keys, values, entries,
  assign, defaults, merge, pick, pickBy, omit, omitBy,
  forOwn, invert, invertBy, mapKeys, mapValues,
  unset, cloneDeep, clone, findKey, findLastKey,
} from '../src/object/index.js';

describe('Object', () => {
  // get / set
  test('get retrieves nested value', () => {
    const obj = { a: { b: { c: 3 } } };
    expect(get(obj, 'a.b.c')).toBe(3);
    expect(get(obj, ['a', 'b', 'c'])).toBe(3);
    expect(get(obj, 'a.b.d', 'default')).toBe('default');
    expect(get(null, 'a', 'default')).toBe('default');
  });

  test('set creates nested path', () => {
    const obj = {};
    set(obj, 'a.b.c', 42);
    expect(obj).toEqual({ a: { b: { c: 42 } } });
  });

  test('set creates arrays for numeric keys', () => {
    const obj = {};
    set(obj, 'a[0].b', 1);
    expect(obj).toEqual({ a: [{ b: 1 }] });
  });

  test('set protects against prototype pollution', () => {
    const obj = {};
    set(obj, '__proto__.polluted', true);
    expect({}.polluted).toBeUndefined();
  });

  // has / hasIn
  test('has checks own property', () => {
    expect(has({ a: { b: 1 } }, 'a.b')).toBe(true);
    expect(has({ a: 1 }, 'b')).toBe(false);
  });

  // keys / values / entries
  test('keys returns own keys', () => {
    expect(keys({ a: 1, b: 2 })).toEqual(['a', 'b']);
  });

  test('values returns own values', () => {
    expect(values({ a: 1, b: 2 })).toEqual([1, 2]);
  });

  test('entries returns [key, value] pairs', () => {
    expect(entries({ a: 1, b: 2 })).toEqual([['a', 1], ['b', 2]]);
  });

  // assign / defaults
  test('assign merges sources', () => {
    expect(assign({ a: 1 }, { b: 2 }, { c: 3 })).toEqual({ a: 1, b: 2, c: 3 });
  });

  test('defaults assigns missing properties', () => {
    expect(defaults({ a: 1 }, { a: 2, b: 3 })).toEqual({ a: 1, b: 3 });
  });

  // merge
  test('merge deep merges objects', () => {
    const result = merge({ a: { x: 1 } }, { a: { y: 2 }, b: 3 });
    expect(result).toEqual({ a: { x: 1, y: 2 }, b: 3 });
  });

  test('merge concatenates arrays', () => {
    const result = merge({ a: [1, 2] }, { a: [3, 4] });
    expect(result).toEqual({ a: [1, 2, 3, 4] });
  });

  // pick / pickBy
  test('pick selects keys', () => {
    expect(pick({ a: 1, b: 2, c: 3 }, ['a', 'c'])).toEqual({ a: 1, c: 3 });
  });

  test('pickBy selects by predicate', () => {
    expect(pickBy({ a: 1, b: 'x', c: 3 }, (v) => typeof v === 'number')).toEqual({ a: 1, c: 3 });
  });

  // omit / omitBy
  test('omit removes keys', () => {
    expect(omit({ a: 1, b: 2, c: 3 }, ['b'])).toEqual({ a: 1, c: 3 });
  });

  test('omitBy removes by predicate', () => {
    expect(omitBy({ a: 1, b: 'x', c: 3 }, (v) => typeof v === 'string')).toEqual({ a: 1, c: 3 });
  });

  // forOwn
  test('forOwn iterates own properties', () => {
    const keys = [];
    forOwn({ a: 1, b: 2 }, (val, key) => keys.push(key));
    expect(keys).toEqual(['a', 'b']);
  });

  // invert / invertBy
  test('invert swaps keys and values', () => {
    expect(invert({ a: '1', b: '2' })).toEqual({ '1': 'a', '2': 'b' });
  });

  // mapKeys / mapValues
  test('mapKeys transforms keys', () => {
    expect(mapKeys({ a: 1, b: 2 }, (v, k) => k + v)).toEqual({ a1: 1, b2: 2 });
  });

  test('mapValues transforms values', () => {
    expect(mapValues({ a: 1, b: 2 }, (v) => v * 2)).toEqual({ a: 2, b: 4 });
  });

  // unset
  test('unset removes path', () => {
    const obj = { a: { b: 1 } };
    unset(obj, 'a.b');
    expect(obj).toEqual({ a: {} });
  });

  // cloneDeep / clone
  test('cloneDeep creates deep copy', () => {
    const obj = { a: { b: [1, 2, 3] }, c: new Date() };
    const cloned = cloneDeep(obj);
    expect(cloned).toEqual(obj);
    expect(cloned).not.toBe(obj);
    expect(cloned.a).not.toBe(obj.a);
    expect(cloned.a.b).not.toBe(obj.a.b);
  });

  test('clone creates shallow copy', () => {
    const obj = { a: { b: 1 } };
    const cloned = clone(obj);
    expect(cloned).toEqual(obj);
    expect(cloned).not.toBe(obj);
    expect(cloned.a).toBe(obj.a); // shallow — same reference
  });

  // findKey / findLastKey
  test('findKey returns first matching key', () => {
    expect(findKey({ a: 1, b: 2, c: 3 }, (v) => v === 2)).toBe('b');
  });
});
