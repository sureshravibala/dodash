// Simple path regex: only dots, no brackets/quotes — covers 95%+ of real usage
const reSimplePath = /^[a-zA-Z_$][\w$]*(?:\.[a-zA-Z_$][\w$]*)*$/;
const rePropName =
  /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/**
 * Parses a property path string into an array of keys.
 * Supports dot notation and bracket notation: 'a.b[0].c' => ['a', 'b', '0', 'c']
 *
 * FAST PATH: Simple dot-separated paths (e.g. 'a.b.c') are split directly
 * without regex parsing. This covers the vast majority of real-world usage
 * and matches lodash's performance on `get`/`set`.
 *
 * @param {string|Array} path - The property path.
 * @returns {Array<string>} The parsed path segments.
 */
export function toPath(path) {
  if (Array.isArray(path)) {
    return path;
  }
  if (typeof path === 'number') {
    return [path];
  }
  if (typeof path !== 'string') {
    return [String(path)];
  }
  // Fast path: simple dot notation (no brackets, quotes, or escapes)
  if (reSimplePath.test(path)) {
    return path.split('.');
  }
  // Slow path: full parsing for bracket/quote notation
  const result = [];
  path.replace(rePropName, (match, number, quote, subString) => {
    if (quote) {
      result.push(subString.replace(/\\(\\)?/g, '$1'));
    } else if (number !== undefined) {
      result.push(number);
    } else {
      result.push(match);
    }
    return match;
  });
  return result;
}
