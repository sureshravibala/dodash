/**
 * @module dodash/collection
 * Collection utilities — modern replacements for lodash collection methods.
 *
 * Key improvements over lodash:
 * - Works natively with iterables (Map, Set, generators, not just arrays/objects)
 * - No internal baseEach/createBaseEach abstraction layers
 * - Uses Map/Set for grouping instead of manual hash implementations
 * - Direct, readable implementations
 */

/**
 * Converts a collection to an iterable array of [key, value] pairs.
 * @param {*} collection
 * @returns {Array}
 */
function toIterableEntries(collection) {
  if (collection == null) return [];
  if (Array.isArray(collection)) return collection.map((v, i) => [i, v]);
  if (collection instanceof Map) return [...collection.entries()];
  if (collection instanceof Set) return [...collection].map((v, i) => [i, v]);
  return Object.entries(collection);
}

function toIterableValues(collection) {
  if (collection == null) return [];
  if (Array.isArray(collection)) return collection;
  if (collection instanceof Map) return [...collection.values()];
  if (collection instanceof Set) return [...collection];
  return Object.values(collection);
}

function resolveIteratee(iteratee) {
  if (typeof iteratee === 'function') return iteratee;
  if (typeof iteratee === 'string') return (o) => o?.[iteratee];
  if (Array.isArray(iteratee)) return (o) => o?.[iteratee[0]] === iteratee[1];
  if (iteratee != null && typeof iteratee === 'object') {
    const entries = Object.entries(iteratee);
    return (o) => entries.every(([k, v]) => o?.[k] === v);
  }
  return (v) => v;
}

/**
 * Iterates over elements of collection.
 * @param {Array|Object} collection
 * @param {Function} iteratee
 * @returns {*}
 */
export function forEach(collection, iteratee) {
  if (Array.isArray(collection)) {
    for (let i = 0; i < collection.length; i++) {
      if (iteratee(collection[i], i, collection) === false) break;
    }
  } else if (collection != null) {
    const entries = toIterableEntries(collection);
    for (const [key, value] of entries) {
      if (iteratee(value, key, collection) === false) break;
    }
  }
  return collection;
}
export { forEach as each };

/**
 * Iterates over elements of collection from right to left.
 * @param {Array|Object} collection
 * @param {Function} iteratee
 * @returns {*}
 */
export function forEachRight(collection, iteratee) {
  const entries = toIterableEntries(collection);
  for (let i = entries.length - 1; i >= 0; i--) {
    const [key, value] = entries[i];
    if (iteratee(value, key, collection) === false) break;
  }
  return collection;
}
export { forEachRight as eachRight };

/**
 * Creates an array of values by running each element through iteratee.
 * @param {Array|Object} collection
 * @param {Function|string} iteratee
 * @returns {Array}
 */
export function map(collection, iteratee) {
  const fn = resolveIteratee(iteratee);
  const values = toIterableValues(collection);
  return values.map((v, i) => fn(v, i, collection));
}

/**
 * Iterates over elements of collection, returning an array of all elements
 * predicate returns truthy for.
 * @param {Array|Object} collection
 * @param {Function|Object|string} predicate
 * @returns {Array}
 */
export function filter(collection, predicate) {
  const fn = resolveIteratee(predicate);
  return toIterableValues(collection).filter((v, i) => fn(v, i, collection));
}

/**
 * The opposite of filter — returns elements predicate returns falsey for.
 * @param {Array|Object} collection
 * @param {Function|Object|string} predicate
 * @returns {Array}
 */
export function reject(collection, predicate) {
  const fn = resolveIteratee(predicate);
  return toIterableValues(collection).filter((v, i) => !fn(v, i, collection));
}

/**
 * Iterates over elements, returning the first element predicate returns truthy for.
 * @param {Array|Object} collection
 * @param {Function|Object|string} predicate
 * @param {number} [fromIndex=0]
 * @returns {*}
 */
export function find(collection, predicate, fromIndex = 0) {
  // Fast path for object predicates on arrays (most common lodash pattern: find(users, { id: 400 }))
  if (Array.isArray(collection) && predicate != null && typeof predicate === 'object' && !Array.isArray(predicate)) {
    const entries = Object.entries(predicate);
    const len = entries.length;
    outer:
    for (let i = fromIndex; i < collection.length; i++) {
      const item = collection[i];
      for (let j = 0; j < len; j++) {
        if (item[entries[j][0]] !== entries[j][1]) continue outer;
      }
      return item;
    }
    return undefined;
  }
  const fn = resolveIteratee(predicate);
  if (Array.isArray(collection)) {
    for (let i = fromIndex; i < collection.length; i++) {
      if (fn(collection[i], i, collection)) return collection[i];
    }
    return undefined;
  }
  const values = toIterableValues(collection);
  for (let i = fromIndex; i < values.length; i++) {
    if (fn(values[i], i, collection)) return values[i];
  }
  return undefined;
}

/**
 * Like find, but iterates from right to left.
 * @param {Array|Object} collection
 * @param {Function|Object|string} predicate
 * @param {number} [fromIndex]
 * @returns {*}
 */
export function findLast(collection, predicate, fromIndex) {
  const fn = resolveIteratee(predicate);
  const values = toIterableValues(collection);
  const start = fromIndex ?? values.length - 1;
  for (let i = start; i >= 0; i--) {
    if (fn(values[i], i, collection)) return values[i];
  }
  return undefined;
}

/**
 * Checks if predicate returns truthy for ALL elements.
 * @param {Array|Object} collection
 * @param {Function|Object|string} predicate
 * @returns {boolean}
 */
export function every(collection, predicate) {
  if (Array.isArray(collection)) {
    const len = collection.length;
    if (typeof predicate === 'function') {
      for (let i = 0; i < len; i++) {
        if (!predicate(collection[i], i, collection)) return false;
      }
      return true;
    }
  }
  const fn = resolveIteratee(predicate);
  const values = toIterableValues(collection);
  for (let i = 0; i < values.length; i++) {
    if (!fn(values[i], i, collection)) return false;
  }
  return true;
}

/**
 * Checks if predicate returns truthy for ANY element.
 * @param {Array|Object} collection
 * @param {Function|Object|string} predicate
 * @returns {boolean}
 */
export function some(collection, predicate) {
  if (Array.isArray(collection)) {
    const len = collection.length;
    if (typeof predicate === 'function') {
      for (let i = 0; i < len; i++) {
        if (predicate(collection[i], i, collection)) return true;
      }
      return false;
    }
    // Object predicate: { key: value }
    if (predicate != null && typeof predicate === 'object' && !Array.isArray(predicate)) {
      const keys = Object.keys(predicate);
      const kLen = keys.length;
      outer:
      for (let i = 0; i < len; i++) {
        const item = collection[i];
        for (let j = 0; j < kLen; j++) {
          if (item[keys[j]] !== predicate[keys[j]]) continue outer;
        }
        return true;
      }
      return false;
    }
    // String predicate (property shorthand)
    if (typeof predicate === 'string') {
      for (let i = 0; i < len; i++) {
        if (collection[i]?.[predicate]) return true;
      }
      return false;
    }
  }
  const fn = resolveIteratee(predicate);
  const values = toIterableValues(collection);
  for (let i = 0; i < values.length; i++) {
    if (fn(values[i], i, collection)) return true;
  }
  return false;
}

/**
 * Checks if value is in collection.
 * @param {Array|Object|string} collection
 * @param {*} value
 * @param {number} [fromIndex=0]
 * @returns {boolean}
 */
export function includes(collection, value, fromIndex = 0) {
  if (typeof collection === 'string') return collection.includes(value, fromIndex);
  const values = toIterableValues(collection);
  return values.indexOf(value, fromIndex) > -1;
}

/**
 * Creates an object composed of keys generated from running each element through iteratee.
 * Uses native Map then converts — lodash uses custom hash.
 * @param {Array|Object} collection
 * @param {Function|string} iteratee
 * @returns {Object}
 */
export function groupBy(collection, iteratee) {
  const result = {};
  if (Array.isArray(collection)) {
    const len = collection.length;
    if (typeof iteratee === 'string') {
      for (let i = 0; i < len; i++) {
        const val = collection[i];
        const key = val[iteratee];
        if (result[key]) result[key].push(val);
        else result[key] = [val];
      }
    } else {
      const fn = typeof iteratee === 'function' ? iteratee : resolveIteratee(iteratee);
      for (let i = 0; i < len; i++) {
        const val = collection[i];
        const key = fn(val);
        if (result[key]) result[key].push(val);
        else result[key] = [val];
      }
    }
    return result;
  }
  const fn = resolveIteratee(iteratee);
  for (const value of toIterableValues(collection)) {
    const key = fn(value);
    if (result[key]) result[key].push(value);
    else result[key] = [value];
  }
  return result;
}

/**
 * Creates an object where each key is the result of iteratee, value is the last element.
 * @param {Array|Object} collection
 * @param {Function|string} iteratee
 * @returns {Object}
 */
export function keyBy(collection, iteratee) {
  const fn = resolveIteratee(iteratee);
  const result = {};
  for (const value of toIterableValues(collection)) {
    result[fn(value)] = value;
  }
  return result;
}

/**
 * Creates an object where keys are generated from iteratee, values are counts.
 * @param {Array|Object} collection
 * @param {Function|string} iteratee
 * @returns {Object}
 */
export function countBy(collection, iteratee) {
  const result = {};
  if (Array.isArray(collection)) {
    const len = collection.length;
    if (typeof iteratee === 'string') {
      for (let i = 0; i < len; i++) {
        const key = collection[i][iteratee];
        result[key] = (result[key] || 0) + 1;
      }
    } else {
      const fn = typeof iteratee === 'function' ? iteratee : resolveIteratee(iteratee);
      for (let i = 0; i < len; i++) {
        const key = fn(collection[i]);
        result[key] = (result[key] || 0) + 1;
      }
    }
    return result;
  }
  const fn = resolveIteratee(iteratee);
  for (const value of toIterableValues(collection)) {
    const key = fn(value);
    result[key] = (result[key] || 0) + 1;
  }
  return result;
}

/**
 * Reduces collection to a single value.
 * @param {Array|Object} collection
 * @param {Function} iteratee
 * @param {*} [accumulator]
 * @returns {*}
 */
export function reduce(collection, iteratee, accumulator) {
  const values = toIterableValues(collection);
  let startIndex = 0;
  if (accumulator === undefined) {
    accumulator = values[0];
    startIndex = 1;
  }
  for (let i = startIndex; i < values.length; i++) {
    accumulator = iteratee(accumulator, values[i], i, collection);
  }
  return accumulator;
}

/**
 * Like reduce, but iterates from right to left.
 * @param {Array|Object} collection
 * @param {Function} iteratee
 * @param {*} [accumulator]
 * @returns {*}
 */
export function reduceRight(collection, iteratee, accumulator) {
  const values = toIterableValues(collection);
  let startIndex = values.length - 1;
  if (accumulator === undefined) {
    accumulator = values[startIndex];
    startIndex--;
  }
  for (let i = startIndex; i >= 0; i--) {
    accumulator = iteratee(accumulator, values[i], i, collection);
  }
  return accumulator;
}

/**
 * Creates an array of elements, sorted in ascending order by the results of running
 * each element through each iteratee.
 * @param {Array|Object} collection
 * @param {Array<Function|string>|Function|string} iteratees
 * @returns {Array}
 */
export function sortBy(collection, iteratees) {
  var iterArr = Array.isArray(iteratees) ? iteratees : [iteratees];
  var values = Array.isArray(collection) ? collection.slice() : [...toIterableValues(collection)];
  var len = iterArr.length;

  // Fast path: single string iteratee (most common: sortBy(users, 'age'))
  if (len === 1 && typeof iterArr[0] === 'string') {
    var key = iterArr[0];
    return values.sort(function(a, b) {
      var va = a[key], vb = b[key];
      return va < vb ? -1 : va > vb ? 1 : 0;
    });
  }
  // Fast path: single function iteratee
  if (len === 1 && typeof iterArr[0] === 'function') {
    var fn = iterArr[0];
    return values.sort(function(a, b) {
      var va = fn(a), vb = fn(b);
      return va < vb ? -1 : va > vb ? 1 : 0;
    });
  }
  // Fast path: all string iteratees (e.g. sortBy(users, ['age', 'name']))
  var allStrings = true;
  for (var i = 0; i < len; i++) {
    if (typeof iterArr[i] !== 'string') { allStrings = false; break; }
  }
  if (allStrings) {
    return values.sort(function(a, b) {
      for (var j = 0; j < len; j++) {
        var k = iterArr[j];
        var va = a[k], vb = b[k];
        if (va < vb) return -1;
        if (va > vb) return 1;
      }
      return 0;
    });
  }
  var fns = iterArr.map(resolveIteratee);
  return values.sort(function(a, b) {
    for (var j = 0; j < len; j++) {
      var va = fns[j](a), vb = fns[j](b);
      if (va < vb) return -1;
      if (va > vb) return 1;
    }
    return 0;
  });
}

/**
 * Allows specifying sort orders ('asc' or 'desc') per iteratee.
 * @param {Array|Object} collection
 * @param {Array<Function|string>} iteratees
 * @param {Array<string>} orders
 * @returns {Array}
 */
export function orderBy(collection, iteratees, orders) {
  const fns = (Array.isArray(iteratees) ? iteratees : [iteratees]).map(resolveIteratee);
  const dirs = orders ?? [];
  const values = [...toIterableValues(collection)];

  return values.sort((a, b) => {
    for (let i = 0; i < fns.length; i++) {
      const fn = fns[i];
      const valA = fn(a);
      const valB = fn(b);
      if (valA < valB) return dirs[i] === 'desc' ? 1 : -1;
      if (valA > valB) return dirs[i] === 'desc' ? -1 : 1;
    }
    return 0;
  });
}

/**
 * Maps then flattens the result by one level.
 * @param {Array|Object} collection
 * @param {Function} iteratee
 * @returns {Array}
 */
export function flatMap(collection, iteratee) {
  const fn = resolveIteratee(iteratee);
  const values = toIterableValues(collection);
  const result = [];
  for (let i = 0; i < values.length; i++) {
    const mapped = fn(values[i], i, collection);
    if (Array.isArray(mapped)) {
      for (let j = 0; j < mapped.length; j++) result.push(mapped[j]);
    } else {
      result.push(mapped);
    }
  }
  return result;
}

/**
 * Maps then recursively flattens the result.
 * @param {Array|Object} collection
 * @param {Function} iteratee
 * @returns {Array}
 */
export function flatMapDeep(collection, iteratee) {
  const fn = resolveIteratee(iteratee);
  const values = toIterableValues(collection);
  const result = [];
  for (let i = 0; i < values.length; i++) {
    const mapped = fn(values[i], i, collection);
    if (Array.isArray(mapped)) {
      flattenAllInto(mapped, result);
    } else {
      result.push(mapped);
    }
  }
  return result;
}

function flattenAllInto(arr, result) {
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) flattenAllInto(arr[i], result);
    else result.push(arr[i]);
  }
}

/**
 * Splits collection into two arrays: elements predicate returns truthy for, and the rest.
 * @param {Array|Object} collection
 * @param {Function|Object|string} predicate
 * @returns {[Array, Array]}
 */
export function partition(collection, predicate) {
  const fn = resolveIteratee(predicate);
  const truthy = [];
  const falsy = [];
  for (const value of toIterableValues(collection)) {
    (fn(value) ? truthy : falsy).push(value);
  }
  return [truthy, falsy];
}

/**
 * Gets a random element from collection.
 * @param {Array|Object} collection
 * @returns {*}
 */
export function sample(collection) {
  const values = toIterableValues(collection);
  if (!values.length) return undefined;
  return values[Math.floor(Math.random() * values.length)];
}

/**
 * Gets `n` random elements from collection.
 * Uses Fisher-Yates shuffle for unbiased sampling.
 * @param {Array|Object} collection
 * @param {number} [n=1]
 * @returns {Array}
 */
export function sampleSize(collection, n = 1) {
  const values = [...toIterableValues(collection)];
  const length = values.length;
  n = Math.min(n, length);
  // Partial Fisher-Yates
  for (let i = 0; i < n; i++) {
    const j = i + Math.floor(Math.random() * (length - i));
    [values[i], values[j]] = [values[j], values[i]];
  }
  return values.slice(0, n);
}

/**
 * Creates a shuffled copy of collection.
 * @param {Array|Object} collection
 * @returns {Array}
 */
export function shuffle(collection) {
  const values = [...toIterableValues(collection)];
  // Fisher-Yates
  for (let i = values.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [values[i], values[j]] = [values[j], values[i]];
  }
  return values;
}

/**
 * Gets the size of collection.
 * @param {Array|Object|string|Map|Set} collection
 * @returns {number}
 */
export function size(collection) {
  if (collection == null) return 0;
  if (typeof collection === 'string' || Array.isArray(collection)) return collection.length;
  if (collection instanceof Map || collection instanceof Set) return collection.size;
  return Object.keys(collection).length;
}

/**
 * Invokes the method named by methodName on each element in collection.
 * @param {Array|Object} collection
 * @param {string|Function} methodName
 * @param {...*} args
 * @returns {Array}
 */
export function invokeMap(collection, methodName, ...args) {
  return toIterableValues(collection).map((value) => {
    const func = typeof methodName === 'function' ? methodName : value[methodName];
    return func.apply(value, args);
  });
}
