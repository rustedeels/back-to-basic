import { EntityStore } from './entity-store.js';

export class EntitiesHandler {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly _entities = new Map<Symbol, EntityStore<any, any>>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public all(): Iterable<[Symbol, EntityStore<any, any>]> {
    return this._entities;
  }

  /** Check if has entity store for name */
  public hasEntityStore(name: string): boolean {
    return this._entities.has(Symbol.for(name));
  }

  /** Get entity store by name */
  public getEntityStore<Z extends object>(name: string): EntityStore<Z, keyof Z> {
    if (!this.hasEntityStore(name)) {
      throw new Error(`Entity store ${name} not found`);
    }

    return this._entities.get(Symbol.for(name)) as unknown as EntityStore<Z, keyof Z>;
  }

  /**
   * Create a new entity store
   *
   * @param name name for store
   * @param idProp property name for id
   * @param initialState initial state
   * @returns store
   */
  public createEntityStore<Z extends object, K extends keyof Z>(
    name: string,
    idProp: K,
    initialState: Z[] = []
  ): EntityStore<Z, K> {
    if (this.hasEntityStore(name)) {
      throw new Error(`Entity store ${name} already exists`);
    }

    const store = new EntityStore(idProp, initialState);
    this._entities.set(Symbol.for(name), store);
    return store;
  }

  /**
   * Create a new entity store if needed, and upsert it with state
   *
   * @param name name for store
   * @param idProp property name for id
   * @param initialState initial state
   * @returns store
   */
  public ensureEntityStore<Z extends object, K extends keyof Z>(
    name: string,
    idProp: K,
    initialState: Z[] = []
  ): EntityStore<Z, K> {
    if (!this.hasEntityStore(name)) {
      return this.createEntityStore(name, idProp, initialState);
    }

    const store = this.getEntityStore(name) as unknown as EntityStore<Z, K>;
    store.upsertAll(initialState);
    return store;
  }
}
