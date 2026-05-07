/**
 * @module dodash/util
 * Utility functions — general-purpose helpers.
 */

import { toPath as internalToPath } from '../_internal/basePath.js';

/**
 * Returns the first argument it receives.
 * @param {*} value
 * @returns {*}
 */
export function identity(value) {
  return value;
}

/**
 * Creates a function that returns `value`.
 * @param {*} value
 * @returns {Function}
 */
export function constant(value) {
  return function() { return value; };
}

/**
 * A no-operation function that returns undefined.
 */
export function noop() {}

/**
 * Invokes iteratee `n` times, returning an array of results.
 * @param {number} n
 * @param {Function} [iteratee=identity]
 * @returns {Array}
 */
export function times(n, iteratee = identity) {
  const result = new Array(Math.max(0, Math.trunc(n)));
  for (let i = 0; i < result.length; i++) {
    result[i] = iteratee(i);
  }
  return result;
}

var idCounter = 0;

/**
 * Generates a unique ID. If `prefix` is given, the ID is appended to it.
 * @param {string} [prefix='']
 * @returns {string}
 */
export function uniqueId(prefix) {
  return (prefix === undefined ? '' : prefix) + ++idCounter;
}

/**
 * Returns `value` if it's not null/undefined/NaN, otherwise returns `defaultValue`.
 * @param {*} value
 * @param {*} defaultValue
 * @returns {*}
 */
export function defaultTo(value, defaultValue) {
  return value == null || value !== value ? defaultValue : value;
}

/**
 * Creates an array of numbers from start (inclusive) to end (exclusive).
 * @param {number} [start=0]
 * @param {number} end
 * @param {number} [step=1]
 * @returns {Array<number>}
 */
export function range(start, end, step) {
  if (end === undefined) {
    end = start;
    start = 0;
  }
  step = step === undefined ? (start < end ? 1 : -1) : step;
  if (step === 0) return [];

  const length = Math.max(Math.ceil((end - start) / step), 0);
  const result = new Array(length);
  for (let i = 0; i < length; i++) {
    result[i] = start + i * step;
  }
  return result;
}

/**
 * Like `range`, but fills the array from right to left.
 * @param {number} [start=0]
 * @param {number} end
 * @param {number} [step=1]
 * @returns {Array<number>}
 */
export function rangeRight(start, end, step) {
  return range(start, end, step).reverse();
}

/**
 * Returns a new empty array.
 * @returns {Array}
 */
export function stubArray() {
  return [];
}

/**
 * Returns a new empty object.
 * @returns {Object}
 */
export function stubObject() {
  return {};
}

/**
 * Returns an empty string.
 * @returns {string}
 */
export function stubString() {
  return '';
}

/**
 * Returns `true`.
 * @returns {boolean}
 */
export function stubTrue() {
  return true;
}

/**
 * Returns `false`.
 * @returns {boolean}
 */
export function stubFalse() {
  return false;
}

/**
 * Attempts to invoke `func`, returning either the result or the caught error object.
 * @param {Function} func
 * @param {...*} args
 * @returns {*}
 */
export function attempt(func, ...args) {
  try {
    return func(...args);
  } catch (error) {
    return error instanceof Error ? error : new Error(error);
  }
}

/**
 * Creates a function that performs a deep comparison between source and the given object.
 * @param {Object} source
 * @returns {Function}
 */
export function matches(source) {
  const sourceEntries = Object.entries(source);
  return (object) => {
    for (const [key, value] of sourceEntries) {
      if (object?.[key] !== value) return false;
    }
    return true;
  };
}

/**
 * Creates a function that compares the property value at `path` to `srcValue`.
 * @param {string|Array} path
 * @param {*} srcValue
 * @returns {Function}
 */
export function matchesProperty(path, srcValue) {
  const keys = internalToPath(path);
  return (object) => {
    let current = object;
    for (const key of keys) {
      if (current == null) return false;
      current = current[key];
    }
    return current === srcValue;
  };
}

/**
 * Creates a function that returns the value at `path` of a given object.
 * @param {string|Array} path
 * @returns {Function}
 */
export function property(path) {
  const keys = internalToPath(path);
  return (object) => {
    let current = object;
    for (const key of keys) {
      if (current == null) return undefined;
      current = current[key];
    }
    return current;
  };
}

/**
 * The inverse of property — takes an object and returns the value at `path`.
 * @param {Object} object
 * @returns {Function}
 */
export function propertyOf(object) {
  return (path) => {
    const keys = internalToPath(path);
    let current = object;
    for (const key of keys) {
      if (current == null) return undefined;
      current = current[key];
    }
    return current;
  };
}

/**
 * Converts `value` to a property path array.
 * @param {string|Array} value
 * @returns {Array<string>}
 */
export function toPath(value) {
  return internalToPath(value);
}

/**
 * Checks if `object` conforms to `source` by invoking the predicate properties
 * of source with the corresponding property values of object.
 * @param {Object} object
 * @param {Object} source
 * @returns {boolean}
 */
export function conformsTo(object, source) {
  if (object == null) return false;
  for (const [key, predicate] of Object.entries(source)) {
    if (typeof predicate !== 'function' || !predicate(object[key])) {
      return false;
    }
  }
  return true;
}

/**
 * Creates a function that invokes all iteratees with the given arguments and returns
 * their results.
 * @param {Array<Function>} iteratees
 * @returns {Function}
 */
export function over(...iteratees) {
  const fns = iteratees.flat();
  return (...args) => fns.map((fn) => fn(...args));
}

/**
 * Creates a function that checks if ALL predicates return truthy.
 * @param {Array<Function>} predicates
 * @returns {Function}
 */
export function overEvery(...predicates) {
  const fns = predicates.flat();
  return (...args) => fns.every((fn) => fn(...args));
}

/**
 * Creates a function that checks if ANY predicate returns truthy.
 * @param {Array<Function>} predicates
 * @returns {Function}
 */
export function overSome(...predicates) {
  const fns = predicates.flat();
  return (...args) => fns.some((fn) => fn(...args));
}
