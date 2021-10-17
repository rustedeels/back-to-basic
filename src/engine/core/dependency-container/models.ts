/** Constructor type */
export interface Type<T> extends Function {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new(...args: any[]): T;
}


/** Token to be instantiated */
export type Token<T> = Type<T> | symbol;

/**
 * Token life cycle
 *
 * Singleton: Create a new instance of the token only once
 * Transient: Create a new instance of the token every time it is requested
 * Value: Passed value is always used
 */
export type TokenLife = 'singleton' | 'transient' | 'value';

/** Resolver for singleton and transient tokens */
export interface TypeResolver<T> {
  target: Type<T>;
  life: Exclude<TokenLife, 'value'>;
  value?: T;
  key?: symbol;
}

/** Resolver for value tokens */
export interface ValueResolver<T> {
  key: symbol;
  value: T;
  life: 'value';
}

/** Token resolver */
export type Resolver<T> = TypeResolver<T> | ValueResolver<T>;
