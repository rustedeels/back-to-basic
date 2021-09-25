import { isObject } from '/engine/helpers/guards.js';

import { isConstructor } from './guards.js';
import {
  Resolver,
  Token,
  TokenLife,
  Type,
} from './models.js';

/** App container, allow to register and retrieve instances */
export class Container {
  private _deps: Map<Token<unknown>, Resolver<unknown>> = new Map();

  /**
   * Register a new token resolver
   * @param resolver Token Resolver
   */
  public register<T>(resolver: Resolver<T>): void;
  /**
   * Register a new Token
   * @param token Token to resolve
   * @param life Token lifecycle, singleton as default
   */
  public register<T>(token: Type<T>, life?: Exclude<TokenLife, 'value'>): void;
  /**
   * Register a new Type as named symbol
   * @param token Token key to resolve
   * @param type Token type to instantiate
   * @param life Token lifecycle, singleton as default
   */
  public register<T>(token: symbol, type: Type<T>, life?: Exclude<TokenLife, 'value'>): void;
  /**
   * Register a new constant value
   * @param token Token key to resolve
   * @param value Value to return
   * @param life always Value
   */
  public register<T>(token: symbol, value: T, life: 'value'): void;
  public register<T>(tokenOrResolver: Token<T> | Resolver<T>, valueOrType?: T | Type<T> | Exclude<TokenLife, 'value'>, life?: TokenLife): void {
    if (isObject<Resolver<T>>(tokenOrResolver)) {
      this.registerResolver(tokenOrResolver);
      return;
    }

    if (isConstructor<T>(tokenOrResolver)) {
      let life: Exclude<TokenLife, 'value'> = 'singleton';
      if (typeof valueOrType === 'undefined' || valueOrType === 'singleton' || valueOrType === 'transient') {
        life = valueOrType ?? 'singleton';
      } else {
        throw new Error('Invalid token life: ' + valueOrType);
      }

      this.registerResolver({
        life: life,
        target: tokenOrResolver,
      });
      return;
    }

    if (life === 'value') {
      this.registerResolver({
        key: tokenOrResolver,
        life: 'value',
        value: valueOrType,
      });
    } else {
      if (!isConstructor<T>(valueOrType)) throw new Error('Cannot register a singleton or a transient without a constructor');

      this.registerResolver({
        key: tokenOrResolver,
        life: life ?? 'singleton',
        target: valueOrType,
      });
    }
  }

  /** Return token instance value */
  public resolve<T>(token: Token<T>): T {
    const resolver = this._deps.get(token) as Resolver<T> | undefined;
    if (!resolver) throw new Error('Cannot resolve token: ' + JSON.stringify(token));

    if (resolver.life === 'value') {
      return resolver.value;
    }

    let instance = resolver.life === 'transient' ? new resolver.target() : resolver.value;
    if (!instance) {
      instance = new resolver.target();
      resolver.value = instance;
      this._deps.set(token, resolver);
    }
    return instance as T;
  }

  /** Return token lifecycle, or undefined if not found */
  public has(token: Token<unknown>): TokenLife | undefined {
    return this._deps.get(token)?.life;
  }

  private registerResolver<T>(resolver: Resolver<T>): void {
    if (resolver.life === 'value') {
      this._deps.set(resolver.key, resolver);
    } else {
      const key = resolver.key ?? resolver.target;
      this._deps.set(key, resolver);
    }
  }
}
