import { Type } from './models.js';

export function isConstructor<T>(v: unknown): v is Type<T> {
  return typeof v === 'function';
}
