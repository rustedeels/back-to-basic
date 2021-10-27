import '/libs/Reflect.js';

import {
  CE_WATCH_FIELDS,
  Field,
} from './models.js';

export function ensureWatchFields<T extends object>(target: Function | T): void {
  const proto = typeof target === 'function' ? target.prototype : target;
  Reflect.hasMetadata(CE_WATCH_FIELDS, proto) ||
    Reflect.defineMetadata(CE_WATCH_FIELDS, new Set(), proto);
}

export function getWatchFields<T extends object>(target: Function | T): Set<Field<T>> {
  const proto = typeof target === 'function' ? target.prototype : target;
  return Reflect.getMetadata(CE_WATCH_FIELDS, proto) || new Set();
}

export function addWatchField<T extends object>(target: Function | T, field: Field<T>): void {
  const proto = typeof target === 'function' ? target.prototype : target;
  const fields = getWatchFields(proto);
  fields.add(field);
  Reflect.defineMetadata(CE_WATCH_FIELDS, fields, proto);
}

export function setWatchField<T extends object>(target: T, field: Field<T>, newValue: string): void {
  const hasField = getWatchFields(target).has(field);
  if (!hasField) { target[field] = newValue as unknown as T[typeof field]; }
}
