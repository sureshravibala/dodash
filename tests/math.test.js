import { describe, test, expect } from '@jest/globals';
import {
  add, subtract, multiply, divide,
  ceil, floor, round, max, maxBy, min, minBy,
  sum, sumBy, mean, meanBy, clamp, inRange, random,
} from '../src/math/index.js';

describe('Math', () => {
  test('add', () => expect(add(6, 4)).toBe(10));
  test('subtract', () => expect(subtract(6, 4)).toBe(2));
  test('multiply', () => expect(multiply(6, 4)).toBe(24));
  test('divide', () => expect(divide(6, 4)).toBe(1.5));

  test('ceil', () => {
    expect(ceil(4.006)).toBe(5);
    expect(ceil(6.004, 2)).toBe(6.01);
  });

  test('floor', () => {
    expect(floor(4.906)).toBe(4);
    expect(floor(0.046, 2)).toBe(0.04);
  });

  test('round', () => {
    expect(round(4.006)).toBe(4);
    expect(round(4.006, 2)).toBe(4.01);
  });

  test('max / min', () => {
    expect(max([4, 2, 8, 6])).toBe(8);
    expect(min([4, 2, 8, 6])).toBe(2);
    expect(max([])).toBeUndefined();
  });

  test('maxBy / minBy', () => {
    const items = [{ n: 1 }, { n: 2 }, { n: 3 }];
    expect(maxBy(items, 'n')).toEqual({ n: 3 });
    expect(minBy(items, (o) => o.n)).toEqual({ n: 1 });
  });

  test('sum / sumBy', () => {
    expect(sum([1, 2, 3])).toBe(6);
    expect(sumBy([{ n: 1 }, { n: 2 }], 'n')).toBe(3);
  });

  test('mean / meanBy', () => {
    expect(mean([4, 2, 8, 6])).toBe(5);
    expect(meanBy([{ n: 4 }, { n: 2 }], 'n')).toBe(3);
  });

  test('clamp', () => {
    expect(clamp(-10, -5, 5)).toBe(-5);
    expect(clamp(10, -5, 5)).toBe(5);
    expect(clamp(3, -5, 5)).toBe(3);
  });

  test('inRange', () => {
    expect(inRange(3, 2, 4)).toBe(true);
    expect(inRange(4, 8)).toBe(true);
    expect(inRange(1, 2)).toBe(true);
    expect(inRange(2, 2)).toBe(false);
  });

  test('random generates in range', () => {
    for (let i = 0; i < 100; i++) {
      const val = random(0, 10);
      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThanOrEqual(10);
    }
  });
});
