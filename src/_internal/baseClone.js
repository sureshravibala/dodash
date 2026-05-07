/**
 * Deep clone implementation using structuredClone with fallback.
 * Overcomes lodash's heavy custom clone machinery (~300 lines)
 * by leveraging the native structuredClone API (available in Node 17+, all modern browsers).
 *
 * @param {*} value - The value to clone.
 * @returns {*} The cloned value.
 */
export function baseClone(value) {
  // Primitives are returned as-is
  if (value === null || typeof value !== 'object') {
    return value;
  }

  // Use native structuredClone when available (Node 17+, modern browsers)
  if (typeof structuredClone === 'function') {
    try {
      return structuredClone(value);
    } catch {
      // Falls through to manual clone for non-cloneable types (functions, DOM nodes, etc.)
    }
  }

  // Fallback: manual deep clone
  return manualDeepClone(value, new WeakMap());
}

function manualDeepClone(value, seen) {
  if (value === null || typeof value !== 'object') {
    return value;
  }

  // Handle circular references
  if (seen.has(value)) {
    return seen.get(value);
  }

  // Date
  if (value instanceof Date) {
    return new Date(value.getTime());
  }

  // RegExp
  if (value instanceof RegExp) {
    const cloned = new RegExp(value.source, value.flags);
    cloned.lastIndex = value.lastIndex;
    return cloned;
  }

  // Map
  if (value instanceof Map) {
    const cloned = new Map();
    seen.set(value, cloned);
    value.forEach((v, k) => {
      cloned.set(manualDeepClone(k, seen), manualDeepClone(v, seen));
    });
    return cloned;
  }

  // Set
  if (value instanceof Set) {
    const cloned = new Set();
    seen.set(value, cloned);
    value.forEach((v) => {
      cloned.add(manualDeepClone(v, seen));
    });
    return cloned;
  }

  // ArrayBuffer
  if (value instanceof ArrayBuffer) {
    return value.slice(0);
  }

  // TypedArray
  if (ArrayBuffer.isView(value) && !(value instanceof DataView)) {
    return new value.constructor(value.buffer.slice(0), value.byteOffset, value.length);
  }

  // DataView
  if (value instanceof DataView) {
    return new DataView(value.buffer.slice(0), value.byteOffset, value.byteLength);
  }

  // Array
  if (Array.isArray(value)) {
    const cloned = new Array(value.length);
    seen.set(value, cloned);
    for (let i = 0; i < value.length; i++) {
      cloned[i] = manualDeepClone(value[i], seen);
    }
    return cloned;
  }

  // Plain object
  const cloned = Object.create(Object.getPrototypeOf(value));
  seen.set(value, cloned);

  for (const key of Reflect.ownKeys(value)) {
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    if (descriptor) {
      if ('value' in descriptor) {
        descriptor.value = manualDeepClone(descriptor.value, seen);
      }
      Object.defineProperty(cloned, key, descriptor);
    }
  }

  return cloned;
}
