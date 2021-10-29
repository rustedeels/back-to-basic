/* eslint-disable @typescript-eslint/no-explicit-any */

/** Constructor for type */
export interface Type<T> extends Function {
  new(...args: any[]): T;
}

/** String keys */
export type StrKey<T> = Extract<keyof T, string>;
