/**
 * @module dodash/lang
 * Type checking and language utilities — modern replacements for lodash lang methods.
 *
 * Key improvements over lodash:
 * - Uses modern APIs: typeof, Array.isArray(), Number.isFinite(), Number.isInteger(), etc.
 * - No Object.prototype.toString.call() hacks for type detection
 * - Leverages structuredClone for deep equality comparison
 * - Each function is a pure, standalone export — no shared internal dependencies
 */

/**
 * Checks if value is classified as an Array.
 * @param {*} value
 * @returns {boolean}
 */
var _isArray = Array.isArray;
export function isArray(value) {
  return _isArray(value);
}

/**
 * Checks if value is array-like.
 * @param {*} value
 * @returns {boolean}
 */
export function isArrayLike(value) {
  return value != null && typeof value !== 'function' && typeof value.length === 'number' && value.length >= 0 && value.length <= Number.MAX_SAFE_INTEGER && Number.isInteger(value.length);
}

/**
 * Checks if value is classified as a boolean primitive or Boolean object.
 * @param {*} value
 * @returns {boolean}
 */
export function isBoolean(value) {
  return value === true || value === false ||
    (value != null && typeof value === 'object' && value instanceof Boolean);
}

/**
 * Checks if value is classified as a Date object.
 * @param {*} value
 * @returns {boolean}
 */
export function isDate(value) {
  return value instanceof Date;
}

/**
 * Checks if value is an empty object, collection, map, or set.
 * @param {*} value
 * @returns {boolean}
 */
export function isEmpty(value) {
  if (value == null) return true;
  if (Array.isArray(value) || typeof value === 'string') return value.length === 0;
  if (value instanceof Map || value instanceof Set) return value.size === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return true;
}

/**
 * Performs a deep comparison between two values to determine if they are equivalent.
 * @param {*} value
 * @param {*} other
 * @returns {boolean}
 */
export function isEqual(value, other) {
  return deepEqual(value, other, new WeakMap());
}

function deepEqual(a, b, seen) {
  // Strict equality
  if (a === b) return true;

  // Handle NaN
  if (typeof a === 'number' && typeof b === 'number' && isNaN(a) && isNaN(b)) return true;

  // Null / type mismatch
  if (a == null || b == null || typeof a !== typeof b) return false;

  // Primitives
  if (typeof a !== 'object') return false;

  // Check for circular references
  if (seen.has(a)) return seen.get(a) === b;
  seen.set(a, b);

  // Date
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  // RegExp
  if (a instanceof RegExp && b instanceof RegExp) {
    return a.source === b.source && a.flags === b.flags;
  }

  // Arrays
  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i], seen)) return false;
    }
    return true;
  }

  // Map
  if (a instanceof Map) {
    if (!(b instanceof Map) || a.size !== b.size) return false;
    for (const [key, val] of a) {
      if (!b.has(key) || !deepEqual(val, b.get(key), seen)) return false;
    }
    return true;
  }

  // Set
  if (a instanceof Set) {
    if (!(b instanceof Set) || a.size !== b.size) return false;
    for (const val of a) {
      if (!b.has(val)) return false;
    }
    return true;
  }

  // Plain objects
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, key) || !deepEqual(a[key], b[key], seen)) {
      return false;
    }
  }
  return true;
}

/**
 * Checks if value is an Error, EvalError, RangeError, ReferenceError, etc.
 * @param {*} value
 * @returns {boolean}
 */
export function isError(value) {
  return value instanceof Error;
}

/**
 * Checks if value is a finite number.
 * @param {*} value
 * @returns {boolean}
 */
export function isFinite_(value) {
  return Number.isFinite(value);
}
export { isFinite_ as isFinite };

/**
 * Checks if value is classified as a Function.
 * @param {*} value
 * @returns {boolean}
 */
export function isFunction(value) {
  return typeof value === 'function';
}

/**
 * Checks if value is an integer.
 * @param {*} value
 * @returns {boolean}
 */
export function isInteger(value) {
  return Number.isInteger(value);
}

/**
 * Checks if value is classified as a Map.
 * @param {*} value
 * @returns {boolean}
 */
export function isMap(value) {
  return value instanceof Map;
}

/**
 * Checks if value is NaN.
 * @param {*} value
 * @returns {boolean}
 */
export function isNaN_(value) {
  return typeof value === 'number' && isNaN(value);
}
export { isNaN_ as isNaN };

/**
 * Checks if value is null or undefined.
 * @param {*} value
 * @returns {boolean}
 */
export function isNil(value) {
  return value == null;
}

/**
 * Checks if value is null.
 * @param {*} value
 * @returns {boolean}
 */
export function isNull(value) {
  return value === null;
}

/**
 * Checks if value is classified as a Number primitive or Number object.
 * @param {*} value
 * @returns {boolean}
 */
export function isNumber(value) {
  if (typeof value === 'number') return true;
  return value instanceof Number;
}

/**
 * Checks if value is the language type of Object.
 * @param {*} value
 * @returns {boolean}
 */
export function isObject(value) {
  if (value == null) return false;
  var t = typeof value;
  return t === 'object' || t === 'function';
}

/**
 * Checks if value is object-like (non-null and typeof 'object').
 * @param {*} value
 * @returns {boolean}
 */
export function isObjectLike(value) {
  return value != null && typeof value === 'object';
}

/**
 * Checks if value is a plain object (created by Object constructor or Object.create(null)).
 * @param {*} value
 * @returns {boolean}
 */
export function isPlainObject(value) {
  if (value === null || typeof value !== 'object') return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

/**
 * Checks if value is classified as a RegExp.
 * @param {*} value
 * @returns {boolean}
 */
export function isRegExp(value) {
  return value instanceof RegExp;
}

/**
 * Checks if value is a safe integer.
 * @param {*} value
 * @returns {boolean}
 */
export function isSafeInteger(value) {
  return Number.isSafeInteger(value);
}

/**
 * Checks if value is classified as a Set.
 * @param {*} value
 * @returns {boolean}
 */
export function isSet(value) {
  return value instanceof Set;
}

/**
 * Checks if value is classified as a String.
 * @param {*} value
 * @returns {boolean}
 */
export function isString(value) {
  return typeof value === 'string' ||
    (value != null && typeof value === 'object' && value instanceof String);
}

/**
 * Checks if value is classified as a Symbol.
 * @param {*} value
 * @returns {boolean}
 */
export function isSymbol(value) {
  return typeof value === 'symbol';
}

/**
 * Checks if value is undefined.
 * @param {*} value
 * @returns {boolean}
 */
export function isUndefined(value) {
  return value === undefined;
}

/**
 * Checks if value is classified as a WeakMap.
 * @param {*} value
 * @returns {boolean}
 */
export function isWeakMap(value) {
  return value instanceof WeakMap;
}

/**
 * Checks if value is classified as a WeakSet.
 * @param {*} value
 * @returns {boolean}
 */
export function isWeakSet(value) {
  return value instanceof WeakSet;
}

/**
 * Checks if value is a typed array.
 * @param {*} value
 * @returns {boolean}
 */
export function isTypedArray(value) {
  return ArrayBuffer.isView(value) && !(value instanceof DataView);
}

/**
 * Checks if value is an Arguments object.
 * @param {*} value
 * @returns {boolean}
 */
export function isArguments(value) {
  return isObjectLike(value) && Object.prototype.toString.call(value) === '[object Arguments]';
}

/**
 * Checks if value is an ArrayBuffer.
 * @param {*} value
 * @returns {boolean}
 */
export function isArrayBuffer(value) {
  return value instanceof ArrayBuffer;
}

/**
 * Checks if value is a Buffer.
 * @param {*} value
 * @returns {boolean}
 */
export function isBuffer(value) {
  return typeof Buffer !== 'undefined' && Buffer.isBuffer(value);
}

/**
 * Checks if value is a DOM element.
 * @param {*} value
 * @returns {boolean}
 */
export function isElement(value) {
  return isObjectLike(value) && value.nodeType === 1 && !isPlainObject(value);
}

/**
 * Converts value to number.
 * @param {*} value
 * @returns {number}
 */
export function toNumber(value) {
  if (typeof value === 'number') return value;
  if (isSymbol(value)) return NaN;
  if (isObject(value)) {
    const other = typeof value.valueOf === 'function' ? value.valueOf() : value;
    value = isObject(other) ? other + '' : other;
  }
  if (typeof value !== 'string') return value === 0 ? value : +value;
  value = value.trim();
  if (/^0b[01]+$/i.test(value)) return parseInt(value.slice(2), 2);
  if (/^0o[0-7]+$/i.test(value)) return parseInt(value.slice(2), 8);
  if (/^[-+]0x[0-9a-f]+$/i.test(value)) return NaN;
  return +value;
}

/**
 * Converts value to a finite number.
 * @param {*} value
 * @returns {number}
 */
export function toFinite(value) {
  if (!value) return value === 0 ? value : 0;
  value = toNumber(value);
  if (value === Infinity || value === -Infinity) {
    return (value > 0 ? 1 : -1) * Number.MAX_VALUE;
  }
  return value === value ? value : 0;
}

/**
 * Converts value to an integer.
 * @param {*} value
 * @returns {number}
 */
export function toInteger(value) {
  const result = toFinite(value);
  const remainder = result % 1;
  return remainder ? result - remainder : result;
}

/**
 * Converts value to a string.
 * @param {*} value
 * @returns {string}
 */
export function toString(value) {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.map((v) => v == null ? '' : toString(v)).join(',');
  if (isSymbol(value)) return value.toString();
  const result = String(value);
  return result === '0' && 1 / value === -Infinity ? '-0' : result;
}

/**
 * Converts value to array.
 * @param {*} value
 * @returns {Array}
 */
export function toArray(value) {
  if (value == null) return [];
  if (Array.isArray(value)) return [...value];
  if (typeof value === 'string') return [...value];
  if (typeof value[Symbol.iterator] === 'function') return [...value];
  return Object.values(value);
}

/**
 * Checks SameValueZero equality.
 * @param {*} value
 * @param {*} other
 * @returns {boolean}
 */
export function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if value is greater than other.
 * @param {*} value
 * @param {*} other
 * @returns {boolean}
 */
export function gt(value, other) {
  return value > other;
}

/**
 * Checks if value is greater than or equal to other.
 * @param {*} value
 * @param {*} other
 * @returns {boolean}
 */
export function gte(value, other) {
  return value >= other;
}

/**
 * Checks if value is less than other.
 * @param {*} value
 * @param {*} other
 * @returns {boolean}
 */
export function lt(value, other) {
  return value < other;
}

/**
 * Checks if value is less than or equal to other.
 * @param {*} value
 * @param {*} other
 * @returns {boolean}
 */
export function lte(value, other) {
  return value <= other;
}

/**
 * Casts value as array if it's not one.
 * @param {*} value
 * @returns {Array}
 */
export function castArray(...args) {
  if (!args.length) return [];
  const value = args[0];
  return Array.isArray(value) ? value : [value];
}
