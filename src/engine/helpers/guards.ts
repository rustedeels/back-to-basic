/** Is a value not undefined or null */
export function isValue<T>(v: unknown): v is T {
  return typeof v !== 'undefined' && v !== null;
}

/** Is an object not null */
export function isObject<T extends object>(v: unknown): v is T {
  return typeof v === 'object' && v !== null;
}
