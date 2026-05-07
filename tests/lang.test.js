import { describe, test, expect } from '@jest/globals';
import {
  isArray, isArrayLike, isBoolean, isDate, isEmpty, isEqual,
  isError, isFunction, isInteger, isMap, isNil, isNull,
  isNumber, isObject, isObjectLike, isPlainObject, isRegExp,
  isSet, isString, isSymbol, isUndefined, isWeakMap, isWeakSet,
  toNumber, toFinite, toInteger, toString, toArray,
  eq, gt, gte, lt, lte, castArray,
} from '../src/lang/index.js';

describe('Lang', () => {
  // Type checks
  test('isArray', () => {
    expect(isArray([1, 2, 3])).toBe(true);
    expect(isArray('abc')).toBe(false);
  });

  test('isBoolean', () => {
    expect(isBoolean(true)).toBe(true);
    expect(isBoolean(0)).toBe(false);
  });

  test('isDate', () => {
    expect(isDate(new Date())).toBe(true);
    expect(isDate('2021-01-01')).toBe(false);
  });

  test('isEmpty', () => {
    expect(isEmpty([])).toBe(true);
    expect(isEmpty({})).toBe(true);
    expect(isEmpty('')).toBe(true);
    expect(isEmpty(null)).toBe(true);
    expect(isEmpty([1])).toBe(false);
    expect(isEmpty({ a: 1 })).toBe(false);
    expect(isEmpty(new Map())).toBe(true);
    expect(isEmpty(new Set([1]))).toBe(false);
  });

  test('isEqual deep compares', () => {
    expect(isEqual({ a: 1, b: [2, 3] }, { a: 1, b: [2, 3] })).toBe(true);
    expect(isEqual({ a: 1 }, { a: 2 })).toBe(false);
    expect(isEqual(NaN, NaN)).toBe(true);
    expect(isEqual([1, 2], [1, 2])).toBe(true);
    expect(isEqual(new Date(0), new Date(0))).toBe(true);
  });

  test('isEqual handles circular references', () => {
    const a = {}; a.self = a;
    const b = {}; b.self = b;
    expect(isEqual(a, b)).toBe(true);
  });

  test('isError', () => {
    expect(isError(new Error())).toBe(true);
    expect(isError(new TypeError())).toBe(true);
    expect(isError({ message: 'oops' })).toBe(false);
  });

  test('isFunction', () => {
    expect(isFunction(() => {})).toBe(true);
    expect(isFunction(class Foo {})).toBe(true);
    expect(isFunction(42)).toBe(false);
  });

  test('isNil / isNull / isUndefined', () => {
    expect(isNil(null)).toBe(true);
    expect(isNil(undefined)).toBe(true);
    expect(isNil(0)).toBe(false);
    expect(isNull(null)).toBe(true);
    expect(isNull(undefined)).toBe(false);
    expect(isUndefined(undefined)).toBe(true);
    expect(isUndefined(null)).toBe(false);
  });

  test('isNumber', () => {
    expect(isNumber(42)).toBe(true);
    expect(isNumber(NaN)).toBe(true);
    expect(isNumber('42')).toBe(false);
  });

  test('isObject', () => {
    expect(isObject({})).toBe(true);
    expect(isObject([])).toBe(true);
    expect(isObject(() => {})).toBe(true);
    expect(isObject(null)).toBe(false);
  });

  test('isPlainObject', () => {
    expect(isPlainObject({})).toBe(true);
    expect(isPlainObject(Object.create(null))).toBe(true);
    expect(isPlainObject(new Date())).toBe(false);
    expect(isPlainObject([])).toBe(false);
  });

  test('isString', () => {
    expect(isString('abc')).toBe(true);
    expect(isString(42)).toBe(false);
  });

  test('isSymbol', () => {
    expect(isSymbol(Symbol('x'))).toBe(true);
    expect(isSymbol('x')).toBe(false);
  });

  test('isMap / isSet / isWeakMap / isWeakSet', () => {
    expect(isMap(new Map())).toBe(true);
    expect(isSet(new Set())).toBe(true);
    expect(isWeakMap(new WeakMap())).toBe(true);
    expect(isWeakSet(new WeakSet())).toBe(true);
  });

  test('isRegExp', () => {
    expect(isRegExp(/abc/)).toBe(true);
    expect(isRegExp('abc')).toBe(false);
  });

  // Conversions
  test('toNumber', () => {
    expect(toNumber(3.2)).toBe(3.2);
    expect(toNumber('3.2')).toBe(3.2);
    expect(toNumber('0b101')).toBe(5);
    expect(toNumber('0o17')).toBe(15);
  });

  test('toInteger', () => {
    expect(toInteger(3.7)).toBe(3);
    expect(toInteger(-3.7)).toBe(-3);
  });

  test('toString', () => {
    expect(toString(null)).toBe('');
    expect(toString([1, 2, 3])).toBe('1,2,3');
    expect(toString(-0)).toBe('-0');
  });

  test('toArray', () => {
    expect(toArray({ a: 1, b: 2 })).toEqual([1, 2]);
    expect(toArray('abc')).toEqual(['a', 'b', 'c']);
    expect(toArray(null)).toEqual([]);
  });

  // Comparisons
  test('eq uses SameValueZero', () => {
    expect(eq(NaN, NaN)).toBe(true);
    expect(eq(0, -0)).toBe(true);
    expect(eq('a', 'a')).toBe(true);
  });

  test('gt / gte / lt / lte', () => {
    expect(gt(3, 1)).toBe(true);
    expect(gte(3, 3)).toBe(true);
    expect(lt(1, 3)).toBe(true);
    expect(lte(3, 3)).toBe(true);
  });

  // castArray
  test('castArray wraps non-arrays', () => {
    expect(castArray(1)).toEqual([1]);
    expect(castArray([1, 2])).toEqual([1, 2]);
    expect(castArray('abc')).toEqual(['abc']);
  });
});
