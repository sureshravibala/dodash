/**
 * dodash vs lodash — Head-to-head benchmark
 *
 * Measures ops/sec for common functions across all categories.
 * Uses a simple high-resolution timer loop (no external benchmark lib needed).
 *
 * Run: node scripts/benchmark.js
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const _ = require('lodash');

// dodash imports
import { chunk, compact, difference, flatten, flattenDeep, uniq, intersection, union, zip, indexOf, nth, tail, take, without, reverse, sortedUniq, fromPairs, drop, dropRight } from '../src/array/index.js';
import { get, set, keys, values, pick, omit, merge, defaults, cloneDeep, invert, mapKeys, mapValues, assign } from '../src/object/index.js';
import { camelCase, kebabCase, snakeCase, startCase, capitalize, deburr, escape, trim, truncate, pad, startsWith, endsWith, repeat } from '../src/string/index.js';
import { debounce, memoize, once, curry, negate, partial, unary, flip, flow, flowRight } from '../src/function/index.js';
import { isNumber, isString, isArray, isPlainObject, isEqual, isEmpty, isNil, isObject, isFunction, isDate, toNumber, toString as dToString, toArray, isBoolean, isRegExp, isError } from '../src/lang/index.js';
import { filter, find, map, groupBy, keyBy, sortBy, reduce, some, every, includes, countBy, flatMap, forEach, size, orderBy, partition, sample, sampleSize, shuffle } from '../src/collection/index.js';
import { max, min, sum, mean, ceil, floor, round, clamp, add, subtract, multiply, divide, sumBy, maxBy, minBy, meanBy } from '../src/math/index.js';
import { identity, uniqueId, constant, defaultTo, range, times, matches, property, noop } from '../src/util/index.js';

// ─── Benchmark Harness ──────────────────────────────────────────────

function bench(name, lodashFn, dodashFn, warmup = 1000, duration = 1500) {
  // Warmup
  for (let i = 0; i < warmup; i++) { lodashFn(); dodashFn(); }

  // Lodash
  let lodashOps = 0;
  const lodashStart = Date.now();
  while (Date.now() - lodashStart < duration) { lodashFn(); lodashOps++; }
  const lodashElapsed = Date.now() - lodashStart;

  // dodash
  let dodashOps = 0;
  const dodashStart = Date.now();
  while (Date.now() - dodashStart < duration) { dodashFn(); dodashOps++; }
  const dodashElapsed = Date.now() - dodashStart;

  const lodashRate = Math.round((lodashOps / lodashElapsed) * 1000);
  const dodashRate = Math.round((dodashOps / dodashElapsed) * 1000);
  const diff = ((dodashRate - lodashRate) / lodashRate * 100).toFixed(1);
  const winner = dodashRate > lodashRate ? 'dodash' : dodashRate < lodashRate ? 'lodash' : 'tie';
  const marker = winner === 'dodash' ? '✅' : winner === 'lodash' ? '⚠️' : '➖';

  return { name, lodashRate, dodashRate, diff: parseFloat(diff), winner, marker };
}

function fmt(n) {
  return n.toLocaleString('en-US');
}

// ─── Test Data ──────────────────────────────────────────────────────

const arr1K = Array.from({ length: 1000 }, (_, i) => i);
const arr10K = Array.from({ length: 10000 }, (_, i) => i % 3000);
const arrStr = Array.from({ length: 1000 }, (_, i) => `item_${i}`);
const nested = [[1, 2], [3, [4, 5]], [6]];
const deepNested = [1, [2, [3, [4, [5]]]]];
const pairs = arr1K.slice(0, 100).map((i) => [`key${i}`, i]);
const obj100 = Object.fromEntries(Array.from({ length: 100 }, (_, i) => [`key${i}`, i]));
const deepObj = { a: { b: { c: { d: { e: 42 } } } } };
const cloneTarget = { a: 1, b: { c: [1, 2, { d: 3 }] }, e: new Date(), f: /test/gi };
const users = Array.from({ length: 500 }, (_, i) => ({ id: i, name: `user${i}`, age: 20 + (i % 50), active: i % 2 === 0 }));
const words500 = Array.from({ length: 500 }, (_, i) => `word${i}`);
const numArr = Array.from({ length: 1000 }, (_, i) => i * 0.7);

// ─── Run Benchmarks ─────────────────────────────────────────────────

console.log('');
console.log('╔══════════════════════════════════════════════════════════════════════════╗');
console.log('║                    dodash vs lodash — Benchmark Suite                   ║');
console.log('╚══════════════════════════════════════════════════════════════════════════╝');
console.log('');

const results = [];

// ── Array ────────────────────────────────────────────────────────────
console.log('🟦 Array');
results.push(bench('chunk',         () => _.chunk(arr1K, 10),        () => chunk(arr1K, 10)));
results.push(bench('compact',       () => _.compact([0, 1, false, 2, '', 3, null]), () => compact([0, 1, false, 2, '', 3, null])));
results.push(bench('difference',    () => _.difference(arr1K, arr1K.slice(500)),    () => difference(arr1K, arr1K.slice(500))));
results.push(bench('flatten',       () => _.flatten(nested),         () => flatten(nested)));
results.push(bench('flattenDeep',   () => _.flattenDeep(deepNested), () => flattenDeep(deepNested)));
results.push(bench('uniq',          () => _.uniq(arr10K),            () => uniq(arr10K)));
results.push(bench('intersection',  () => _.intersection(arr1K, arr1K.slice(200, 800)), () => intersection(arr1K, arr1K.slice(200, 800))));
results.push(bench('union',         () => _.union(arr1K, arr1K.slice(500)), () => union(arr1K, arr1K.slice(500))));
results.push(bench('zip',           () => _.zip(arr1K.slice(0, 100), arr1K.slice(100, 200)), () => zip(arr1K.slice(0, 100), arr1K.slice(100, 200))));
results.push(bench('indexOf',       () => _.indexOf(arr1K, 750),     () => indexOf(arr1K, 750)));
results.push(bench('nth',           () => _.nth(arr1K, 500),         () => nth(arr1K, 500)));
results.push(bench('tail',          () => _.tail(arr1K),             () => tail(arr1K)));
results.push(bench('without',       () => _.without(arr1K.slice(0, 100), 10, 20, 30), () => without(arr1K.slice(0, 100), 10, 20, 30)));
results.push(bench('fromPairs',     () => _.fromPairs(pairs),        () => fromPairs(pairs)));
results.push(bench('reverse',       () => _.reverse([...arr1K.slice(0, 100)]), () => reverse(arr1K.slice(0, 100))));
results.push(bench('sortedUniq',    () => _.sortedUniq(arr1K),       () => sortedUniq(arr1K)));

for (const r of results.slice(-16)) {
  console.log(`  ${r.marker} ${r.name.padEnd(16)} lodash: ${fmt(r.lodashRate).padStart(10)} ops/s  |  dodash: ${fmt(r.dodashRate).padStart(10)} ops/s  |  ${r.diff > 0 ? '+' : ''}${r.diff}%`);
}

// ── Collection ───────────────────────────────────────────────────────
console.log('\n🟩 Collection');
const collStart = results.length;
results.push(bench('filter',        () => _.filter(users, { active: true }),   () => filter(users, { active: true })));
results.push(bench('find',          () => _.find(users, { id: 400 }),          () => find(users, { id: 400 })));
results.push(bench('map',           () => _.map(users, 'name'),               () => map(users, 'name')));
results.push(bench('groupBy',       () => _.groupBy(users, 'age'),            () => groupBy(users, 'age')));
results.push(bench('keyBy',         () => _.keyBy(users, 'id'),               () => keyBy(users, 'id')));
results.push(bench('sortBy',        () => _.sortBy(users, ['age', 'name']),   () => sortBy(users, ['age', 'name'])));
results.push(bench('reduce',        () => _.reduce(arr1K, (s, n) => s + n, 0), () => reduce(arr1K, (s, n) => s + n, 0)));
results.push(bench('some',          () => _.some(users, { id: 499 }),          () => some(users, { id: 499 })));
results.push(bench('every',         () => _.every(arr1K, (n) => n >= 0),       () => every(arr1K, (n) => n >= 0)));
results.push(bench('includes',      () => _.includes(arr1K, 999),              () => includes(arr1K, 999)));
results.push(bench('countBy',       () => _.countBy(users, 'active'),          () => countBy(users, 'active')));
results.push(bench('flatMap',       () => _.flatMap(arr1K.slice(0, 100), (n) => [n, n]), () => flatMap(arr1K.slice(0, 100), (n) => [n, n])));
results.push(bench('size',          () => _.size(obj100),                       () => size(obj100)));
results.push(bench('orderBy',       () => _.orderBy(users.slice(0, 50), ['age'], ['desc']), () => orderBy(users.slice(0, 50), ['age'], ['desc'])));
results.push(bench('partition',     () => _.partition(users, { active: true }), () => partition(users, { active: true })));
results.push(bench('forEach',       () => _.forEach(arr1K, noop),              () => forEach(arr1K, noop)));

for (const r of results.slice(collStart)) {
  console.log(`  ${r.marker} ${r.name.padEnd(16)} lodash: ${fmt(r.lodashRate).padStart(10)} ops/s  |  dodash: ${fmt(r.dodashRate).padStart(10)} ops/s  |  ${r.diff > 0 ? '+' : ''}${r.diff}%`);
}

// ── Object ───────────────────────────────────────────────────────────
console.log('\n🟧 Object');
const objStart = results.length;
results.push(bench('get',           () => _.get(deepObj, 'a.b.c.d.e'),        () => get(deepObj, 'a.b.c.d.e')));
results.push(bench('set',           () => _.set({}, 'a.b.c', 1),              () => set({}, 'a.b.c', 1)));
results.push(bench('keys',          () => _.keys(obj100),                      () => keys(obj100)));
results.push(bench('values',        () => _.values(obj100),                    () => values(obj100)));
results.push(bench('pick',          () => _.pick(obj100, ['key1', 'key50', 'key99']), () => pick(obj100, ['key1', 'key50', 'key99'])));
results.push(bench('omit',          () => _.omit(obj100, ['key1', 'key50', 'key99']), () => omit(obj100, ['key1', 'key50', 'key99'])));
results.push(bench('merge',         () => _.merge({}, { a: 1 }, { b: { c: 2 } }), () => merge({}, { a: 1 }, { b: { c: 2 } })));
results.push(bench('defaults',      () => _.defaults({}, { a: 1, b: 2 }),     () => defaults({}, { a: 1, b: 2 })));
results.push(bench('cloneDeep',     () => _.cloneDeep(cloneTarget),            () => cloneDeep(cloneTarget)));
results.push(bench('assign',        () => _.assign({}, { a: 1 }, { b: 2 }),   () => assign({}, { a: 1 }, { b: 2 })));
results.push(bench('invert',        () => _.invert(obj100),                    () => invert(obj100)));
results.push(bench('mapKeys',       () => _.mapKeys(obj100, (v, k) => k + '_x'), () => mapKeys(obj100, (v, k) => k + '_x')));
results.push(bench('mapValues',     () => _.mapValues(obj100, (v) => v * 2),  () => mapValues(obj100, (v) => v * 2)));

for (const r of results.slice(objStart)) {
  console.log(`  ${r.marker} ${r.name.padEnd(16)} lodash: ${fmt(r.lodashRate).padStart(10)} ops/s  |  dodash: ${fmt(r.dodashRate).padStart(10)} ops/s  |  ${r.diff > 0 ? '+' : ''}${r.diff}%`);
}

// ── String ───────────────────────────────────────────────────────────
console.log('\n🔵 String');
const strStart = results.length;
results.push(bench('camelCase',     () => _.camelCase('hello-world-foo'),     () => camelCase('hello-world-foo')));
results.push(bench('kebabCase',     () => _.kebabCase('helloWorldFoo'),       () => kebabCase('helloWorldFoo')));
results.push(bench('snakeCase',     () => _.snakeCase('helloWorldFoo'),       () => snakeCase('helloWorldFoo')));
results.push(bench('startCase',     () => _.startCase('helloWorldFoo'),       () => startCase('helloWorldFoo')));
results.push(bench('capitalize',    () => _.capitalize('hello world'),         () => capitalize('hello world')));
results.push(bench('deburr',        () => _.deburr('déjà vu über café'),      () => deburr('déjà vu über café')));
results.push(bench('escape',        () => _.escape('<div>"hello" & world</div>'), () => escape('<div>"hello" & world</div>')));
results.push(bench('trim',          () => _.trim('  hello  '),                () => trim('  hello  ')));
results.push(bench('truncate',      () => _.truncate('hello world foo bar baz', { length: 15 }), () => truncate('hello world foo bar baz', { length: 15 })));
results.push(bench('startsWith',    () => _.startsWith('hello world', 'hello'), () => startsWith('hello world', 'hello')));
results.push(bench('endsWith',      () => _.endsWith('hello world', 'world'),  () => endsWith('hello world', 'world')));
results.push(bench('repeat',        () => _.repeat('abc', 100),               () => repeat('abc', 100)));
results.push(bench('pad',           () => _.pad('abc', 20),                   () => pad('abc', 20)));

for (const r of results.slice(strStart)) {
  console.log(`  ${r.marker} ${r.name.padEnd(16)} lodash: ${fmt(r.lodashRate).padStart(10)} ops/s  |  dodash: ${fmt(r.dodashRate).padStart(10)} ops/s  |  ${r.diff > 0 ? '+' : ''}${r.diff}%`);
}

// ── Lang ─────────────────────────────────────────────────────────────
console.log('\n🟪 Lang');
const langStart = results.length;
results.push(bench('isNumber',      () => _.isNumber(42),                      () => isNumber(42)));
results.push(bench('isString',      () => _.isString('x'),                     () => isString('x')));
results.push(bench('isArray',       () => _.isArray([1]),                       () => isArray([1])));
results.push(bench('isPlainObject', () => _.isPlainObject({}),                 () => isPlainObject({})));
results.push(bench('isEqual',       () => _.isEqual({ a: [1, 2] }, { a: [1, 2] }), () => isEqual({ a: [1, 2] }, { a: [1, 2] })));
results.push(bench('isEmpty',       () => _.isEmpty({}),                       () => isEmpty({})));
results.push(bench('isNil',         () => _.isNil(null),                       () => isNil(null)));
results.push(bench('isFunction',    () => _.isFunction(() => {}),              () => isFunction(() => {})));
results.push(bench('isObject',      () => _.isObject({}),                      () => isObject({})));
results.push(bench('isBoolean',     () => _.isBoolean(true),                   () => isBoolean(true)));
results.push(bench('isDate',        () => _.isDate(new Date()),                () => isDate(new Date())));
results.push(bench('isRegExp',      () => _.isRegExp(/test/),                  () => isRegExp(/test/)));
results.push(bench('isError',       () => _.isError(new Error()),              () => isError(new Error())));
results.push(bench('toNumber',      () => _.toNumber('3.14'),                  () => toNumber('3.14')));
results.push(bench('toString',      () => _.toString([1, 2, 3]),               () => dToString([1, 2, 3])));
results.push(bench('toArray',       () => _.toArray({ a: 1, b: 2 }),           () => toArray({ a: 1, b: 2 })));

for (const r of results.slice(langStart)) {
  console.log(`  ${r.marker} ${r.name.padEnd(16)} lodash: ${fmt(r.lodashRate).padStart(10)} ops/s  |  dodash: ${fmt(r.dodashRate).padStart(10)} ops/s  |  ${r.diff > 0 ? '+' : ''}${r.diff}%`);
}

// ── Math ─────────────────────────────────────────────────────────────
console.log('\n🟨 Math');
const mathStart = results.length;
results.push(bench('max',           () => _.max(numArr),                       () => max(numArr)));
results.push(bench('min',           () => _.min(numArr),                       () => min(numArr)));
results.push(bench('sum',           () => _.sum(numArr),                       () => sum(numArr)));
results.push(bench('mean',          () => _.mean(numArr),                      () => mean(numArr)));
results.push(bench('ceil',          () => _.ceil(4.006, 2),                    () => ceil(4.006, 2)));
results.push(bench('floor',         () => _.floor(4.906, 2),                   () => floor(4.906, 2)));
results.push(bench('round',         () => _.round(4.006, 2),                   () => round(4.006, 2)));
results.push(bench('clamp',         () => _.clamp(15, 0, 10),                  () => clamp(15, 0, 10)));
results.push(bench('add',           () => _.add(6, 4),                         () => add(6, 4)));
results.push(bench('sumBy',         () => _.sumBy(users.slice(0, 100), 'age'), () => sumBy(users.slice(0, 100), 'age')));

for (const r of results.slice(mathStart)) {
  console.log(`  ${r.marker} ${r.name.padEnd(16)} lodash: ${fmt(r.lodashRate).padStart(10)} ops/s  |  dodash: ${fmt(r.dodashRate).padStart(10)} ops/s  |  ${r.diff > 0 ? '+' : ''}${r.diff}%`);
}

// ── Function ─────────────────────────────────────────────────────────
console.log('\n🔴 Function');
const fnStart = results.length;
results.push(bench('memoize',       () => { const m = _.memoize((x) => x * 2); m(5); m(5); m(10); }, () => { const m = memoize((x) => x * 2); m(5); m(5); m(10); }));
results.push(bench('curry',         () => { const c = _.curry((a, b) => a + b); c(1)(2); }, () => { const c = curry((a, b) => a + b); c(1)(2); }));
results.push(bench('once',          () => { const o = _.once(() => 42); o(); o(); }, () => { const o = once(() => 42); o(); o(); }));
results.push(bench('negate',        () => { const n = _.negate(Boolean); n(0); n(1); }, () => { const n = negate(Boolean); n(0); n(1); }));
results.push(bench('partial',       () => { const p = _.partial((a, b) => a + b, 1); p(2); }, () => { const p = partial((a, b) => a + b, 1); p(2); }));
results.push(bench('unary',         () => { const u = _.unary(parseInt); u('10'); }, () => { const u = unary(parseInt); u('10'); }));
results.push(bench('flow',          () => { const f = _.flow([(x) => x + 1, (x) => x * 2]); f(3); }, () => { const f = flow((x) => x + 1, (x) => x * 2); f(3); }));

for (const r of results.slice(fnStart)) {
  console.log(`  ${r.marker} ${r.name.padEnd(16)} lodash: ${fmt(r.lodashRate).padStart(10)} ops/s  |  dodash: ${fmt(r.dodashRate).padStart(10)} ops/s  |  ${r.diff > 0 ? '+' : ''}${r.diff}%`);
}

// ── Util ─────────────────────────────────────────────────────────────
console.log('\n🔶 Util');
const utilStart = results.length;
results.push(bench('identity',      () => _.identity(42),                      () => identity(42)));
results.push(bench('uniqueId',      () => _.uniqueId('prefix_'),              () => uniqueId('prefix_')));
results.push(bench('constant',      () => { const c = _.constant(42); c(); }, () => { const c = constant(42); c(); }));
results.push(bench('defaultTo',     () => _.defaultTo(null, 10),               () => defaultTo(null, 10)));
results.push(bench('range',         () => _.range(0, 1000),                    () => range(0, 1000)));
results.push(bench('times',         () => _.times(100, (i) => i * 2),          () => times(100, (i) => i * 2)));
results.push(bench('matches',       () => { const m = _.matches({ a: 1 }); m({ a: 1, b: 2 }); }, () => { const m = matches({ a: 1 }); m({ a: 1, b: 2 }); }));

for (const r of results.slice(utilStart)) {
  console.log(`  ${r.marker} ${r.name.padEnd(16)} lodash: ${fmt(r.lodashRate).padStart(10)} ops/s  |  dodash: ${fmt(r.dodashRate).padStart(10)} ops/s  |  ${r.diff > 0 ? '+' : ''}${r.diff}%`);
}

// ─── Summary ─────────────────────────────────────────────────────────
console.log('\n' + '═'.repeat(76));
console.log('📊 SUMMARY');
console.log('═'.repeat(76));

const dodashWins = results.filter((r) => r.winner === 'dodash').length;
const lodashWins = results.filter((r) => r.winner === 'lodash').length;
const ties = results.filter((r) => r.winner === 'tie').length;
const avgDiff = (results.reduce((s, r) => s + r.diff, 0) / results.length).toFixed(1);
const top5 = [...results].sort((a, b) => b.diff - a.diff).slice(0, 5);
const bottom5 = [...results].sort((a, b) => a.diff - b.diff).slice(0, 5);

console.log(`  Total benchmarks:    ${results.length}`);
console.log(`  dodash wins:         ${dodashWins}`);
console.log(`  lodash wins:         ${lodashWins}`);
console.log(`  Ties (<1%):          ${ties}`);
console.log(`  Average difference:  ${avgDiff > 0 ? '+' : ''}${avgDiff}%`);
console.log('');
console.log('  🏆 Top 5 dodash wins:');
for (const r of top5) {
  console.log(`     ${r.name.padEnd(16)} +${r.diff}%`);
}
console.log('');
console.log('  ⚠️  Top 5 lodash wins:');
for (const r of bottom5) {
  console.log(`     ${r.name.padEnd(16)} ${r.diff}%`);
}
console.log('');
console.log('═'.repeat(76));
