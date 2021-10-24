export function getRandomName(prefix = ''): string {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (typeof crypto.randomUUID === 'function') {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return `${prefix}${crypto.randomUUID()}`;
  }

  return prefix + Math.random().toString(36).substr(2, 9);
}

export function filterUndefined<T>(array: (T | undefined)[]): T[] {
  return array.filter(Boolean) as T[];
}
