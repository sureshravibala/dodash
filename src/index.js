/**
 * dodash — A modern, lightweight, tree-shakeable utility library.
 *
 * Unlike lodash's monolithic IIFE that exports 300+ methods on a single object,
 * every function here is an independent ES module export.
 * Bundlers (webpack, Rollup, esbuild, Vite) automatically tree-shake unused code.
 *
 * @example
 * // Import everything (not recommended for production)
 * import * as _ from 'dodash';
 *
 * // Import individual functions (recommended — tree-shakeable)
 * import { get, set, merge } from 'dodash';
 *
 * // Import by category
 * import { chunk, uniq, flatten } from 'dodash/array';
 * import { debounce, throttle } from 'dodash/function';
 */

// Array
export {
  chunk, compact, concat, difference, differenceBy,
  drop, dropRight, dropWhile, fill, flatten, flattenDeep, flattenDepth,
  fromPairs, head, first, last, nth, initial, tail,
  intersection, uniq, uniqBy, union, without,
  zip, unzip, zipObject, take, takeRight, takeWhile,
  xor, indexOf, reverse, sortedUniq, pull, remove,
} from './array/index.js';

// Object
export {
  get, set, has, hasIn, keys, keysIn, values, entries, toPairs,
  assign, assignIn, extend, defaults, merge,
  pick, pickBy, omit, omitBy, forOwn, invert, invertBy,
  mapKeys, mapValues, unset, cloneDeep, clone,
  findKey, findLastKey,
} from './object/index.js';

// String
export {
  words, camelCase, kebabCase, snakeCase, startCase,
  capitalize, upperFirst, lowerFirst, toLower, toUpper,
  lowerCase, upperCase, deburr, truncate,
  pad, padStart, padEnd, repeat, replace, split,
  trim, trimStart, trimEnd, startsWith, endsWith,
  escape, unescape, escapeRegExp,
} from './string/index.js';

// Function
export {
  debounce, throttle, memoize, once, before, after,
  negate, unary, ary, bind, partial, flip, curry,
  flow, flowRight, defer, delay,
} from './function/index.js';

// Lang
export {
  isArray, isArrayLike, isBoolean, isDate, isEmpty, isEqual,
  isError, isFunction, isInteger, isMap, isNil, isNull,
  isNumber, isObject, isObjectLike, isPlainObject, isRegExp,
  isSafeInteger, isSet, isString, isSymbol, isUndefined,
  isWeakMap, isWeakSet, isTypedArray, isArguments, isArrayBuffer,
  isBuffer, isElement,
  toNumber, toFinite, toInteger, toString, toArray,
  eq, gt, gte, lt, lte, castArray,
} from './lang/index.js';

// Collection
export {
  forEach, each, forEachRight, eachRight,
  map, filter, reject, find, findLast,
  every, some, includes, groupBy, keyBy, countBy,
  reduce, reduceRight, sortBy, orderBy,
  flatMap, flatMapDeep, partition,
  sample, sampleSize, shuffle, size, invokeMap,
} from './collection/index.js';

// Math
export {
  add, subtract, multiply, divide,
  ceil, floor, round, max, maxBy, min, minBy,
  sum, sumBy, mean, meanBy, clamp, inRange, random,
} from './math/index.js';

// Util
export {
  identity, constant, noop, times, uniqueId,
  defaultTo, range, rangeRight, stubArray, stubObject,
  stubString, stubTrue, stubFalse, attempt, matches,
  matchesProperty, property, propertyOf, toPath,
  conformsTo, over, overEvery, overSome,
} from './util/index.js';
