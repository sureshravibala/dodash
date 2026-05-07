import { describe, test, expect } from '@jest/globals';
import {
  words, camelCase, kebabCase, snakeCase, startCase,
  capitalize, upperFirst, lowerFirst, toLower, toUpper,
  deburr, truncate, pad, padStart, padEnd,
  repeat, trim, trimStart, trimEnd,
  startsWith, endsWith, escape, unescape, escapeRegExp,
} from '../src/string/index.js';

describe('String', () => {
  // words
  test('words splits string into word array', () => {
    expect(words('fred, barney, & pebbles')).toEqual(['fred', 'barney', 'pebbles']);
    expect(words('camelCase')).toEqual(['camel', 'Case']);
    expect(words('PascalCase')).toEqual(['Pascal', 'Case']);
    expect(words('kebab-case')).toEqual(['kebab', 'case']);
    expect(words('snake_case')).toEqual(['snake', 'case']);
  });

  // case conversions
  test('camelCase converts correctly', () => {
    expect(camelCase('Foo Bar')).toBe('fooBar');
    expect(camelCase('--foo-bar--')).toBe('fooBar');
    expect(camelCase('__FOO_BAR__')).toBe('fooBar');
  });

  test('kebabCase converts correctly', () => {
    expect(kebabCase('Foo Bar')).toBe('foo-bar');
    expect(kebabCase('fooBar')).toBe('foo-bar');
  });

  test('snakeCase converts correctly', () => {
    expect(snakeCase('Foo Bar')).toBe('foo_bar');
    expect(snakeCase('fooBar')).toBe('foo_bar');
  });

  test('startCase converts correctly', () => {
    expect(startCase('--foo-bar--')).toBe('Foo Bar');
    expect(startCase('fooBar')).toBe('Foo Bar');
  });

  // capitalize / upperFirst / lowerFirst
  test('capitalize', () => {
    expect(capitalize('FRED')).toBe('Fred');
  });

  test('upperFirst', () => {
    expect(upperFirst('fred')).toBe('Fred');
  });

  test('lowerFirst', () => {
    expect(lowerFirst('Fred')).toBe('fred');
  });

  // toLower / toUpper
  test('toLower / toUpper', () => {
    expect(toLower('Hello')).toBe('hello');
    expect(toUpper('hello')).toBe('HELLO');
  });

  // deburr
  test('deburr removes diacritical marks', () => {
    expect(deburr('déjà vu')).toBe('deja vu');
    expect(deburr('über')).toBe('uber');
  });

  // truncate
  test('truncate shortens string', () => {
    expect(truncate('hi-diddly-ho there, neighborino', { length: 24 })).toBe('hi-diddly-ho there, n...');
  });

  // pad / padStart / padEnd
  test('pad adds padding on both sides', () => {
    expect(pad('abc', 8)).toBe('  abc   ');
    expect(pad('abc', 8, '_-')).toBe('_-abc_-_');
  });

  test('padStart / padEnd', () => {
    expect(padStart('abc', 6)).toBe('   abc');
    expect(padEnd('abc', 6)).toBe('abc   ');
  });

  // repeat
  test('repeat repeats string', () => {
    expect(repeat('abc', 3)).toBe('abcabcabc');
    expect(repeat('abc', 0)).toBe('');
  });

  // trim / trimStart / trimEnd
  test('trim removes whitespace', () => {
    expect(trim('  abc  ')).toBe('abc');
    expect(trim('-_-abc-_-', '_-')).toBe('abc');
  });

  test('trimStart / trimEnd', () => {
    expect(trimStart('  abc  ')).toBe('abc  ');
    expect(trimEnd('  abc  ')).toBe('  abc');
  });

  // startsWith / endsWith
  test('startsWith / endsWith', () => {
    expect(startsWith('abc', 'a')).toBe(true);
    expect(endsWith('abc', 'c')).toBe(true);
    expect(startsWith('abc', 'b', 1)).toBe(true);
  });

  // escape / unescape
  test('escape encodes HTML entities', () => {
    expect(escape('<div>"test" & \'value\'</div>')).toBe('&lt;div&gt;&quot;test&quot; &amp; &#39;value&#39;&lt;/div&gt;');
  });

  test('unescape decodes HTML entities', () => {
    expect(unescape('&lt;div&gt;&quot;test&quot; &amp; &#39;value&#39;&lt;/div&gt;')).toBe('<div>"test" & \'value\'</div>');
  });

  // escapeRegExp
  test('escapeRegExp escapes special characters', () => {
    expect(escapeRegExp('[lodash](https://lodash.com/)')).toBe('\\[lodash\\]\\(https://lodash\\.com/\\)');
  });
});
