const reIsUint = /^(?:0|[1-9]\d*)$/;
const MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like index.
 * @param {*} value - The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] - The upper bounds of a valid index.
 * @returns {boolean}
 */
export function isIndex(value, length = MAX_SAFE_INTEGER) {
  const type = typeof value;
  return (
    !!length &&
    (type === 'number' || (type !== 'symbol' && reIsUint.test(value))) &&
    value > -1 &&
    value % 1 === 0 &&
    value < length
  );
}
