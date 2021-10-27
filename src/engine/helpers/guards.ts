import { ObjectOf } from './models.js';

/** Is a value not undefined or null */
export function isValue<T>(v: unknown): v is T {
  return typeof v !== 'undefined' && v !== null;
}

/** Is an object not null */
export function isObject<T extends ObjectOf<T>>(v: unknown): v is T {
  return typeof v === 'object' && v !== null;
}

/** Validate that is expected instance, throws otherwise */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function assertInstanceOf<T extends new (...args: any) => any>(value: unknown, constructor: T): asserts value is InstanceType<T> {
  if (!(value instanceof constructor)) {
    throw new Error(`Expected instance of ${constructor.name}, got ${value}`);
  }
}
