/**
 * @module dodash/string
 * String utilities — modern replacements for lodash string methods.
 *
 * Key improvements over lodash:
 * - Uses String.prototype.normalize('NFD') for deburr instead of a 260-entry lookup table
 * - Uses native String methods (padStart, padEnd, startsWith, endsWith, repeat, trimStart, trimEnd)
 * - No custom Unicode regex engine (~80 lines eliminated)
 */

const reWords = /[A-Z]+(?=[A-Z][a-z])|[A-Z]?[a-z]+|[A-Z]+|\d+/g;

/**
 * Splits `string` into an array of words.
 * Handles camelCase, PascalCase, kebab-case, snake_case, and mixed.
 * @param {string} string
 * @param {RegExp|string} [pattern]
 * @returns {Array<string>}
 */
export function words(string, pattern) {
  if (!string) return [];
  const str = String(string);
  if (pattern) {
    return str.match(pattern instanceof RegExp ? pattern : new RegExp(pattern, 'g')) ?? [];
  }
  return str.match(reWords) ?? [];
}

/**
 * Converts string to camelCase.
 * @param {string} string
 * @returns {string}
 */
export function camelCase(string) {
  return words(string)
    .map((word, i) => {
      const lower = word.toLowerCase();
      return i === 0 ? lower : lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join('');
}

/**
 * Converts string to kebab-case.
 * @param {string} string
 * @returns {string}
 */
export function kebabCase(string) {
  return words(string).map((w) => w.toLowerCase()).join('-');
}

/**
 * Converts string to snake_case.
 * @param {string} string
 * @returns {string}
 */
export function snakeCase(string) {
  return words(string).map((w) => w.toLowerCase()).join('_');
}

/**
 * Converts string to Start Case.
 * @param {string} string
 * @returns {string}
 */
export function startCase(string) {
  return words(string)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Converts first character to upper case.
 * @param {string} string
 * @returns {string}
 */
export function capitalize(string) {
  if (!string) return '';
  const str = String(string);
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Converts first character to upper case (rest unchanged).
 * @param {string} string
 * @returns {string}
 */
export function upperFirst(string) {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Converts first character to lower case.
 * @param {string} string
 * @returns {string}
 */
export function lowerFirst(string) {
  if (!string) return '';
  return string.charAt(0).toLowerCase() + string.slice(1);
}

/**
 * Converts entire string to lower case.
 * @param {string} string
 * @returns {string}
 */
export function toLower(string) {
  return String(string ?? '').toLowerCase();
}

/**
 * Converts entire string to upper case.
 * @param {string} string
 * @returns {string}
 */
export function toUpper(string) {
  return String(string ?? '').toUpperCase();
}

/**
 * Converts string to lower case (split by words).
 * @param {string} string
 * @returns {string}
 */
export function lowerCase(string) {
  return words(string).map((w) => w.toLowerCase()).join(' ');
}

/**
 * Converts string to upper case (split by words).
 * @param {string} string
 * @returns {string}
 */
export function upperCase(string) {
  return words(string).map((w) => w.toUpperCase()).join(' ');
}

/**
 * Removes diacritical marks from string.
 * Lodash uses a 260-entry deburredLetters map. We use Unicode normalization.
 * @param {string} string
 * @returns {string}
 */
const ligatureMap = {
  '\u00c6': 'Ae', '\u00e6': 'ae', '\u00d0': 'D', '\u00f0': 'd',
  '\u00de': 'Th', '\u00fe': 'th', '\u00df': 'ss',
  '\u0152': 'Oe', '\u0153': 'oe', '\u0132': 'IJ', '\u0133': 'ij'
};
const reLigatures = /[\u00c6\u00e6\u00d0\u00f0\u00de\u00fe\u00df\u0152\u0153\u0132\u0133]/g;

export function deburr(string) {
  if (!string) return '';
  const str = String(string);
  // Single pass: replace ligatures first, then normalize + strip combining marks
  const withLigatures = reLigatures.test(str)
    ? str.replace(reLigatures, (ch) => ligatureMap[ch])
    : str;
  return withLigatures.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Truncates string if it's longer than the given maximum length.
 * @param {string} string
 * @param {Object} [options]
 * @param {number} [options.length=30]
 * @param {string} [options.omission='...']
 * @param {RegExp|string} [options.separator]
 * @returns {string}
 */
export function truncate(string, options = {}) {
  if (!string) return '';
  const str = String(string);
  const { length = 30, omission = '...', separator } = options;

  if (str.length <= length) return str;

  let end = length - omission.length;
  if (end < 0) return omission;

  let result = str.slice(0, end);

  if (separator !== undefined) {
    const sep = separator instanceof RegExp ? separator : new RegExp(escapeRegExp(String(separator)), 'g');
    let lastIndex = -1;
    let match;
    // Reset regex
    const testStr = str.slice(0, end + 1);
    const globalSep = new RegExp(sep.source, sep.flags.includes('g') ? sep.flags : sep.flags + 'g');
    while ((match = globalSep.exec(testStr)) !== null) {
      lastIndex = match.index;
    }
    if (lastIndex > -1) {
      result = str.slice(0, lastIndex);
    }
  }

  return result + omission;
}

/**
 * Pads string on both sides.
 * @param {string} string
 * @param {number} [length=0]
 * @param {string} [chars=' ']
 * @returns {string}
 */
export function pad(string, length = 0, chars = ' ') {
  const str = String(string ?? '');
  if (str.length >= length) return str;
  const totalPad = length - str.length;
  const leftPad = Math.floor(totalPad / 2);
  const rightPad = totalPad - leftPad;
  const padChar = chars || ' ';
  return repeatTo(padChar, leftPad) + str + repeatTo(padChar, rightPad);
}

/**
 * Pads string on the left side.
 * @param {string} string
 * @param {number} [length=0]
 * @param {string} [chars=' ']
 * @returns {string}
 */
export function padStart(string, length = 0, chars = ' ') {
  const str = String(string ?? '');
  if (str.length >= length) return str;
  return repeatTo(chars || ' ', length - str.length) + str;
}

/**
 * Pads string on the right side.
 * @param {string} string
 * @param {number} [length=0]
 * @param {string} [chars=' ']
 * @returns {string}
 */
export function padEnd(string, length = 0, chars = ' ') {
  const str = String(string ?? '');
  if (str.length >= length) return str;
  return str + repeatTo(chars || ' ', length - str.length);
}

function repeatTo(chars, length) {
  if (length <= 0) return '';
  return chars.repeat(Math.ceil(length / chars.length)).slice(0, length);
}

/**
 * Repeats the given string n times.
 * @param {string} string
 * @param {number} [n=1]
 * @returns {string}
 */
export function repeat(string, n = 1) {
  return String(string ?? '').repeat(Math.max(0, Math.trunc(n)));
}

/**
 * Replaces matches in string.
 * @param {string} string
 * @param {RegExp|string} pattern
 * @param {string|Function} replacement
 * @returns {string}
 */
export function replace(string, pattern, replacement) {
  return String(string ?? '').replace(pattern, replacement);
}

/**
 * Splits string by separator.
 * @param {string} string
 * @param {RegExp|string} separator
 * @param {number} [limit]
 * @returns {Array<string>}
 */
export function split(string, separator, limit) {
  return String(string ?? '').split(separator, limit);
}

/**
 * Removes leading and trailing whitespace (or specified characters).
 * @param {string} string
 * @param {string} [chars]
 * @returns {string}
 */
export function trim(string, chars) {
  const str = String(string ?? '');
  if (!chars) return str.trim();
  const escaped = escapeRegExp(chars);
  return str.replace(new RegExp(`^[${escaped}]+|[${escaped}]+$`, 'g'), '');
}

/**
 * Removes leading whitespace (or specified characters).
 * @param {string} string
 * @param {string} [chars]
 * @returns {string}
 */
export function trimStart(string, chars) {
  const str = String(string ?? '');
  if (!chars) return str.trimStart();
  return str.replace(new RegExp(`^[${escapeRegExp(chars)}]+`), '');
}

/**
 * Removes trailing whitespace (or specified characters).
 * @param {string} string
 * @param {string} [chars]
 * @returns {string}
 */
export function trimEnd(string, chars) {
  const str = String(string ?? '');
  if (!chars) return str.trimEnd();
  return str.replace(new RegExp(`[${escapeRegExp(chars)}]+$`), '');
}

/**
 * Checks if string starts with target.
 * @param {string} string
 * @param {string} target
 * @param {number} [position=0]
 * @returns {boolean}
 */
export function startsWith(string, target, position) {
  string = string == null ? '' : '' + string;
  return string.startsWith(target, position);
}

/**
 * Checks if string ends with target.
 * @param {string} string
 * @param {string} target
 * @param {number} [position]
 * @returns {boolean}
 */
export function endsWith(string, target, position) {
  string = string == null ? '' : '' + string;
  return position === undefined ? string.endsWith(target) : string.endsWith(target, position);
}

const htmlEscapeMap = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const htmlUnescapeMap = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'" };

/**
 * Escapes HTML entities.
 * @param {string} string
 * @returns {string}
 */
export function escape(string) {
  if (typeof string !== 'string') {
    if (string == null) return '';
    string = String(string);
  }
  if (!string) return string;
  // Fast bail: check if any escapable chars exist before running regex
  let needsEscape = false;
  for (let i = 0; i < string.length; i++) {
    const c = string.charCodeAt(i);
    if (c === 38 || c === 60 || c === 62 || c === 34 || c === 39) { // & < > " '
      needsEscape = true;
      break;
    }
  }
  if (!needsEscape) return string;
  return string.replace(/[&<>"']/g, (ch) => htmlEscapeMap[ch]);
}

/**
 * Unescapes HTML entities.
 * @param {string} string
 * @returns {string}
 */
export function unescape(string) {
  return String(string ?? '').replace(/&(?:amp|lt|gt|quot|#39);/g, (entity) => htmlUnescapeMap[entity]);
}

/**
 * Escapes RegExp special characters.
 * @param {string} string
 * @returns {string}
 */
export function escapeRegExp(string) {
  return String(string ?? '').replace(/[\\^$.*+?()[\]{}|]/g, '\\$&');
}

/**
 * Parses string as integer.
 * @param {string} string
 * @param {number} [radix=10]
 * @returns {number}
 */
export function parseInt_(string, radix = 10) {
  return parseInt(String(string ?? '').trim(), radix);
}
export { parseInt_ as parseInt };
