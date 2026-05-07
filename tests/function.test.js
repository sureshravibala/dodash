import { describe, test, expect, jest } from '@jest/globals';
import {
  debounce, throttle, memoize, once, before, after,
  negate, unary, ary, curry, flow, flowRight,
} from '../src/function/index.js';

describe('Function', () => {
  // memoize
  test('memoize caches results', () => {
    let callCount = 0;
    const fn = memoize((x) => { callCount++; return x * 2; });
    expect(fn(5)).toBe(10);
    expect(fn(5)).toBe(10);
    expect(callCount).toBe(1);
    expect(fn(10)).toBe(20);
    expect(callCount).toBe(2);
  });

  test('memoize with custom resolver', () => {
    const fn = memoize((a, b) => a + b, { resolver: (a, b) => `${a}-${b}` });
    expect(fn(1, 2)).toBe(3);
    expect(fn(1, 2)).toBe(3);
    expect(fn(2, 3)).toBe(5);
  });

  test('memoize with maxSize evicts oldest', () => {
    let callCount = 0;
    const fn = memoize((x) => { callCount++; return x; }, { maxSize: 2 });
    fn(1); fn(2); fn(3); // should evict 1
    expect(fn.cache.has(1)).toBe(false);
    expect(fn.cache.has(2)).toBe(true);
    expect(fn.cache.has(3)).toBe(true);
  });

  // once
  test('once invokes function only once', () => {
    let count = 0;
    const fn = once(() => ++count);
    fn(); fn(); fn();
    expect(count).toBe(1);
  });

  // before
  test('before limits invocations', () => {
    let count = 0;
    const fn = before(3, () => ++count);
    fn(); fn(); fn(); fn();
    expect(count).toBe(2);
  });

  // after
  test('after delays invocations', () => {
    let count = 0;
    const fn = after(3, () => ++count);
    fn(); fn(); fn(); fn();
    expect(count).toBe(2);
  });

  // negate
  test('negate inverts predicate', () => {
    const isEven = negate((n) => n % 2 === 0);
    expect(isEven(1)).toBe(true);
    expect(isEven(2)).toBe(false);
  });

  // unary
  test('unary caps arguments to 1', () => {
    const result = ['6', '8', '10'].map(unary(parseInt));
    expect(result).toEqual([6, 8, 10]);
  });

  // ary
  test('ary caps arguments to n', () => {
    const fn = ary((...args) => args, 2);
    expect(fn(1, 2, 3, 4)).toEqual([1, 2]);
  });

  // curry
  test('curry enables partial application', () => {
    const add = curry((a, b, c) => a + b + c);
    expect(add(1)(2)(3)).toBe(6);
    expect(add(1, 2)(3)).toBe(6);
    expect(add(1)(2, 3)).toBe(6);
    expect(add(1, 2, 3)).toBe(6);
  });

  // flow / flowRight
  test('flow composes left to right', () => {
    const fn = flow(
      (x) => x + 1,
      (x) => x * 2,
      (x) => x + 3,
    );
    expect(fn(1)).toBe(7); // (1+1)*2+3 = 7
  });

  test('flowRight composes right to left', () => {
    const fn = flowRight(
      (x) => x + 3,
      (x) => x * 2,
      (x) => x + 1,
    );
    expect(fn(1)).toBe(7);
  });

  // debounce
  test('debounce delays invocation', async () => {
    let count = 0;
    const fn = debounce(() => count++, 50);
    fn(); fn(); fn();
    expect(count).toBe(0);
    await new Promise((r) => setTimeout(r, 100));
    expect(count).toBe(1);
  });

  test('debounce cancel stops invocation', async () => {
    let count = 0;
    const fn = debounce(() => count++, 50);
    fn();
    fn.cancel();
    await new Promise((r) => setTimeout(r, 100));
    expect(count).toBe(0);
  });

  test('debounce flush triggers immediately', () => {
    let count = 0;
    const fn = debounce(() => ++count, 100);
    fn();
    fn.flush();
    expect(count).toBe(1);
  });
});
