import { isObject } from '/engine/helpers/guards.js';

import { LogOptionExtra } from './models.js';

export function isLogOptionExtra(e: unknown): e is LogOptionExtra {
  if (!isObject(e)) return false;
  const o = e as LogOptionExtra;
  return typeof o.$assert === 'boolean'
   || typeof o.$timer === 'string'
   || typeof o.$preserve === 'boolean';
}
