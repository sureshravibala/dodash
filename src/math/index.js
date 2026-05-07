/**
 * @module dodash/math
 * Math utilities — modern replacements for lodash math methods.
 *
 * Key improvements over lodash:
 * - No createMathOperation wrapper factory (~30 lines eliminated)
 * - Direct, inlineable implementations
 * - Uses Math.trunc instead of bitwise truncation for large numbers
 */

/**
 * Adds two numbers.
 * @param {number} augend
 * @param {number} addend
 * @returns {number}
 */
export function add(augend, addend) {
  return Number(augend) + Number(addend);
}

/**
 * Subtracts two numbers.
 * @param {number} minuend
 * @param {number} subtrahend
 * @returns {number}
 */
export function subtract(minuend, subtrahend) {
  return Number(minuend) - Number(subtrahend);
}

/**
 * Multiplies two numbers.
 * @param {number} multiplier
 * @param {number} multiplicand
 * @returns {number}
 */
export function multiply(multiplier, multiplicand) {
  return Number(multiplier) * Number(multiplicand);
}

/**
 * Divides two numbers.
 * @param {number} dividend
 * @param {number} divisor
 * @returns {number}
 */
export function divide(dividend, divisor) {
  return Number(dividend) / Number(divisor);
}

/**
 * Computes number rounded up to precision.
 * @param {number} number
 * @param {number} [precision=0]
 * @returns {number}
 */
export function ceil(number, precision = 0) {
  return roundWith(Math.ceil, number, precision);
}

/**
 * Computes number rounded down to precision.
 * @param {number} number
 * @param {number} [precision=0]
 * @returns {number}
 */
export function floor(number, precision = 0) {
  return roundWith(Math.floor, number, precision);
}

/**
 * Computes number rounded to precision.
 * @param {number} number
 * @param {number} [precision=0]
 * @returns {number}
 */
export function round(number, precision = 0) {
  return roundWith(Math.round, number, precision);
}

function roundWith(mathFn, number, precision) {
  number = Number(number);
  if (!precision) return mathFn(number);
  const factor = 10 ** Math.trunc(precision);
  return mathFn(number * factor) / factor;
}

/**
 * Computes the maximum value of array.
 * @param {Array<number>} array
 * @returns {number|undefined}
 */
export function max(array) {
  if (!array?.length) return undefined;
  return Math.max(...array);
}

/**
 * Computes the maximum value using iteratee.
 * @param {Array} array
 * @param {Function|string} iteratee
 * @returns {*}
 */
export function maxBy(array, iteratee) {
  if (!array?.length) return undefined;
  const fn = typeof iteratee === 'string' ? (o) => o?.[iteratee] : iteratee;
  let maxVal = -Infinity;
  let maxItem = undefined;
  for (const item of array) {
    const val = fn(item);
    if (val > maxVal) {
      maxVal = val;
      maxItem = item;
    }
  }
  return maxItem;
}

/**
 * Computes the minimum value of array.
 * @param {Array<number>} array
 * @returns {number|undefined}
 */
export function min(array) {
  if (!array?.length) return undefined;
  return Math.min(...array);
}

/**
 * Computes the minimum value using iteratee.
 * @param {Array} array
 * @param {Function|string} iteratee
 * @returns {*}
 */
export function minBy(array, iteratee) {
  if (!array?.length) return undefined;
  const fn = typeof iteratee === 'string' ? (o) => o?.[iteratee] : iteratee;
  let minVal = Infinity;
  let minItem = undefined;
  for (const item of array) {
    const val = fn(item);
    if (val < minVal) {
      minVal = val;
      minItem = item;
    }
  }
  return minItem;
}

/**
 * Computes the sum of values in array.
 * @param {Array<number>} array
 * @returns {number}
 */
export function sum(array) {
  if (!array?.length) return 0;
  let total = 0;
  for (const val of array) total += val;
  return total;
}

/**
 * Computes the sum using iteratee.
 * @param {Array} array
 * @param {Function|string} iteratee
 * @returns {number}
 */
export function sumBy(array, iteratee) {
  if (!array?.length) return 0;
  const fn = typeof iteratee === 'string' ? (o) => o?.[iteratee] : iteratee;
  let total = 0;
  for (const item of array) total += fn(item);
  return total;
}

/**
 * Computes the mean of values in array.
 * @param {Array<number>} array
 * @returns {number}
 */
export function mean(array) {
  if (!array?.length) return NaN;
  return sum(array) / array.length;
}

/**
 * Computes the mean using iteratee.
 * @param {Array} array
 * @param {Function|string} iteratee
 * @returns {number}
 */
export function meanBy(array, iteratee) {
  if (!array?.length) return NaN;
  return sumBy(array, iteratee) / array.length;
}

/**
 * Clamps number within [lower, upper].
 * @param {number} number
 * @param {number} lower
 * @param {number} upper
 * @returns {number}
 */
export function clamp(number, lower, upper) {
  return Math.min(Math.max(number, lower), upper);
}

/**
 * Checks if number is between start and end (exclusive).
 * @param {number} number
 * @param {number} [start=0]
 * @param {number} end
 * @returns {boolean}
 */
export function inRange(number, start, end) {
  if (end === undefined) {
    end = start;
    start = 0;
  }
  const low = Math.min(start, end);
  const high = Math.max(start, end);
  return number >= low && number < high;
}

/**
 * Generates a random number between lower and upper (inclusive).
 * @param {number} [lower=0]
 * @param {number} [upper=1]
 * @param {boolean} [floating=false]
 * @returns {number}
 */
export function random(lower = 0, upper = 1, floating = false) {
  if (typeof lower === 'boolean') {
    floating = lower;
    lower = 0;
    upper = 1;
  } else if (typeof upper === 'boolean') {
    floating = upper;
    upper = lower;
    lower = 0;
  }
  const rand = lower + Math.random() * (upper - lower);
  return floating || lower % 1 || upper % 1 ? rand : Math.floor(rand);
}
