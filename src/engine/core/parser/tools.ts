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
