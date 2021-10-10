import { Store } from './store.js';

export class ExtensionStoreHandler {
  private readonly _extensions = new Map<Symbol, Store<object>>();

  public all(): Iterable<[Symbol, Store<object>]> {
    return this._extensions;
  }

  /** Check if extension is implemented for name */
  public has(name: string): boolean {
    return this._extensions.has(Symbol.for(name));
  }

  /** Get extension state */
  public get<Z extends object>(name: string): Store<Z> {
    if (!this.has(name)) {
      throw new Error(`Extension ${name} not found`);
    }

    return this._extensions.get(Symbol.for(name)) as unknown as Store<Z>;
  }

  /**
   * Get extension state by name, if not found, throw error
   *
   * @param name extension name
   */
  public add<Z extends object>(name: string): Store<Z>;
  /**
   * Get extension state by name, if not found, create it
   *
   * @param name extension name
   * @param state initial state
   */
  public add<Z extends object>(name: string, state: Z): Store<Z>;
  public add<Z extends object>(name: string, state?: Z): Store<Z> {
    if (this.has(name)) {
      return this._extensions.get(Symbol.for(name)) as unknown as Store<Z>;
    }

    if (!state) { throw new Error(`Extension ${name} not found`); }

    const extension = new Store<Z>(state);
    this._extensions.set(Symbol.for(name), extension as unknown as Store<object>);
    return extension;
  }

  /** Create or update extension state */
  public set<Z extends object>(name: string, state: Z): Store<Z> {
    if (!this.has(name)) {
      return this.add(name, state);
    } else {
      const store = this.get<Z>(name);
      store.update(state);
      return store;
    }
  }
}
