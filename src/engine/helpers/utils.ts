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

/** Filter out false values */
export function filterUndefined<T>(array: (T | undefined | false | null | '' | 0)[]): T[] {
  return array.filter(Boolean) as T[];
}

/** Sleep current stack */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
