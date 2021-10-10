import { Observable } from '../reactive/models.js';
import { Subject } from '../reactive/subject.js';
import {
  EntityStoreEvent,
  EntityStoreEventType,
  RawEntitiesState,
} from './models.js';
import { Store } from './store.js';

/** Entity collection store. */
export class EntityStore<T extends object, K extends keyof T> {
  private readonly _event: Subject<EntityStoreEvent<T>> = new Subject();
  private readonly _state: Map<T[K], Store<T>> = new Map();
  private readonly _key: K;

  public constructor(idProp: K, initialState: T[] = []) {
    this._key = idProp;

    for (const i of initialState) {
      this._state.set(i[idProp], new Store(i));
    }
  }

  /** Allow to listen for store changes */
  public get onChange(): Observable<EntityStoreEvent<T>> {
    return this._event;
  }

  /** Property for entity id */
  public get idProp(): K {
    return this._key;
  }

  /** All entities */
  public get state(): T[] {
    return Array.from(this._state.values(), s => s.state);
  }

  /** Check if has entity for id */
  public hasEntity(id: T[K]): boolean {
    return this._state.has(id);
  }

  /** Get entity store by id */
  public getStore(id: T[K]): Store<T> {
    if (!this.hasEntity(id)) {
      throw new Error(`Entity with key ${id} not found`);
    }

    return this._state.get(id) as Store<T>;
  }

  /** get entity state */
  public getEntity(id: T[K]): T {
    return this.getStore(id).state;
  }

  /** Add new entity, throw if already addded */
  public add(entity: T): void {
    if (this.hasEntity(entity[this._key])) {
      throw new Error(`Entity with key ${entity[this._key]} already exists`);
    }

    this._state.set(entity[this._key], new Store(entity));
    this._emit('added', this.getStore(entity[this._key]).state);
  }

  /** Update entity, throw if not found */
  public update(entity: Partial<T>, id: T[K]): void;
  /** Update entity, throw if not found */
  public update(entity: (Partial<T> & { [key in K]: T[K] })): void;
  public update(entity: (Partial<T> & { [key in K]: T[K] }), id?: T[K]): void {
    const entityId = id ?? entity[this._key] as T[K];

    if (!entityId) {
      throw new Error(`Entity id not specified, property ${this._key} is required`);
    }

    if (!!id && !!entity[this._key] && entity[this._key] !== entityId) {
      throw new Error(
        `Entity id specified in entity and in id parameter are different: ${entity[this._key]} and ${entityId}`,
      );
    }

    this.getStore(entityId).update(entity);
    this._emit('updated', this.getEntity(entityId));
  }

  /** update all entities */
  public updateAll(entityList: (Partial<T> & { [key in K]: T[K] })[]): void {
    for (const entity of entityList) {
      this.update(entity);
    }
  }

  /** Add or update entity */
  public upsert(entity: T): void {
    if (this.hasEntity(entity[this._key])) {
      this.update(entity);
    } else {
      this.add(entity);
    }
  }

  /** Upsert all entities */
  public upsertAll(entities: T[]): void {
    for (const entity of entities) {
      this.upsert(entity);
    }
  }

  /** Remove entity, throw if not found */
  public remove(id: T[K]): void {
    const state = this.getStore(id).state;
    this._state.delete(id);
    this._emit('removed', state);
  }

  public export(): RawEntitiesState<T> {
    return {
      state: this.state,
      idProp: this._key,
    };
  }

  public import(newState: RawEntitiesState<T>): void {
    if (newState.idProp !== this._key) {
      throw new Error(
        `Can't import state to store with different id property: ${newState.idProp}`,
      );
    }

    for (const entity of newState.state) {
      this.upsert(entity);
    }
  }

  private _emit(eventType: EntityStoreEventType, entity: T): void {
    this._event.next({
      type: eventType,
      entity,
      state: this.state,
    });
  }
}
