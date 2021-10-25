import { PropertyParser } from './models.js';

export const PREFIX = '|>';

/** Ensure number is finite and not NaN */
export const N = (n: number, defaultValue = 0): number => isFinite(n) ? n : defaultValue;

/** Convert value to number */
export const toN = (n: unknown, defaultValue = 0): number => N(Number(n), defaultValue);

/** Check if string has a prefix */
export const hasPrefix = (value: string): boolean => value.split(PREFIX).length > 1;

/** Ensure value has prefix */
export const P = (value: string, prefix: string): string =>
  hasPrefix(value) ? value : `${prefix}${PREFIX}${value}`;

/** Try to extract prefix from source file */
export function extractPrefix(value: string): [prefix: string, source: string] {
  const lines = value.split('\n');
  if (lines.length <= 1) {
    return ['', value];
  }

  let prefix = (lines.shift() ?? '').trim();

  if (!prefix.startsWith(PREFIX)) {
    prefix = '';
    if (prefix) lines.unshift(prefix);
  } else {
    prefix = prefix.replaceAll(PREFIX, '').trim();
  }

  return [prefix, lines.join('\n')];
}

/** Try to retrieve value from group match */
export function getPropValue<T>(m: RegExpMatchArray, p: PropertyParser<T>): string {
  if (typeof p === 'number') {
    return m[p] ?? '';
  }

  for (const i of p.index) {
    const v = m[i];
    if (v) return v;
  }

  return p.default ?? '';
}

/**
 * Split string by regex match
 *
 * @param str Source string
 * @param regex Regex to match split points
 * @returns string parts
 */
export function regexSplit(str: string, regex: RegExp): string[] {
  const res: string[] = [];

  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (str.length < 2) {
      res.push(str);
      break;
    }

    let i = str.substring(1).search(regex);
    if (i === -1) {
      res.push(str);
      break;
    }
    i++;

    res.push(str.substr(0, i));
    str = str.substring(i);
  }

  return res;
}
