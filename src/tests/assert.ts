/* eslint-disable @typescript-eslint/no-explicit-any */
export class Assert {
  static isTrue(value: boolean, message?: string): void {
    if (!value) {
      throw new Error(message ?? 'Assertion failed, value is false');
    }
  }

  static isFalse(value: boolean, message?: string): void {
    if (value) {
      throw new Error(message ?? 'Assertion failed, value is true');
    }
  }

  static isEqual(value1: any, value2: any, message?: string): void {
    if (value1 !== value2) {
      throw new Error(message ?? `Assertion failed, values are not equal: ${value1} !== ${value2}`);
    }
  }

  static isNotEqual(value1: any, value2: any, message?: string): void {
    if (value1 === value2) {
      throw new Error(message ?? `Assertion failed, values are equal: ${value1} === ${value2}`);
    }
  }

  static isNull(value: any, message?: string): void {
    if (value !== null) {
      throw new Error(message ?? `Assertion failed, value is not null: ${value}`);
    }
  }

  static isNotNull<T>(value: T | null, message?: string): asserts value is T {
    if (value === null) {
      throw new Error(message ?? `Assertion failed, value is null: ${value}`);
    }
  }

  static isUndefined<T>(value: T | undefined, message?: string): asserts value is undefined {
    if (value !== undefined) {
      throw new Error(message ?? `Assertion failed, value is not undefined: ${value}`);
    }
  }

  static isNotUndefined<T>(value: T | undefined, message?: string): asserts value is T {
    if (value === undefined) {
      throw new Error(message ?? `Assertion failed, value is undefined: ${value}`);
    }
  }

  static isEmpty(value: any, message?: string): void {
    if (typeof value === 'string' && value !== '') {
      throw new Error(message ?? `Assertion failed, value is not empty: ${value}`);
    }

    if (Array.isArray(value) && value.length > 0) {
      throw new Error(message ?? `Assertion failed, value is not empty: ${value}`);
    }

    if (value instanceof Map && value.size > 0) {
      throw new Error(message ?? `Assertion failed, value is not empty: ${value}`);
    }

    if (value instanceof Set && value.size > 0) {
      throw new Error(message ?? `Assertion failed, value is not empty: ${value}`);
    }
  }

  static isNotEmpty(value: any, message?: string): void {
    if (typeof value === 'string' && value === '') {
      throw new Error(message ?? `Assertion failed, value is empty: ${value}`);
    }

    if (Array.isArray(value) && value.length === 0) {
      throw new Error(message ?? `Assertion failed, value is empty: ${value}`);
    }

    if (value instanceof Map && value.size === 0) {
      throw new Error(message ?? `Assertion failed, value is empty: ${value}`);
    }

    if (value instanceof Set && value.size === 0) {
      throw new Error(message ?? `Assertion failed, value is empty: ${value}`);
    }
  }

  static isNullOrUndefined(value: any, message?: string): void {
    if (value !== null && value !== undefined) {
      throw new Error(message ?? `Assertion failed, value is not null or undefined: ${value}`);
    }
  }

  static isNotNullOrUndefined<T>(value: unknown, message?: string): asserts value is T {
    if (value === null || value === undefined) {
      throw new Error(message ?? `Assertion failed, value is null or undefined: ${value}`);
    }
  }

  static throws(fn: () => void, message?: string): void {
    try {
      fn();
    } catch (e) {
      console.log('Assert.throws: ', e);
      return;
    }

    throw new Error(message ?? 'Assertion failed, function did not throw');
  }

  static isInstanceOf<T extends Function>(expected: T, value: unknown, message?: string): asserts value is T['prototype'] {
    if (!(value instanceof expected)) {
      throw new Error(message ?? `Assertion failed, value is not instance of ${expected.name}`);
    }
  }
}
