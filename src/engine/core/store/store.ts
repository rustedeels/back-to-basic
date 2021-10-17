import {
  Subscription,
  ValueSubject,
} from '../reactive/index.js';
import { EntitiesHandler } from './entities-handler.js';
import { ExtensionStoreHandler } from './extension-handler.js';
import { RawState } from './models.js';
import { Proxies } from './proxies.js';

/** State store, to separate reads from write and keep one source of true */
export class Store<T extends object> {
  private _currentState: ValueSubject<T>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly _propsValues = new Map<keyof T, ValueSubject<any>>();
  private readonly _extensions = new ExtensionStoreHandler();
  private readonly _entities = new EntitiesHandler();

  public constructor(initialState: T) {
    this._currentState = new ValueSubject(initialState);
  }

  public get entities(): EntitiesHandler {
    return this._entities;
  }

  public get extensions(): ExtensionStoreHandler {
    return this._extensions;
  }

  /** Get last state at this moment */
  public get state(): T {
    return Proxies.readonly(this._currentState.value);
  }

  /** Subscribe to state value */
  public value(fn: (state: T) => void, skipInitial = false): Subscription {
    return this._currentState.subscribe(val => fn(Proxies.readonly(val)), skipInitial);
  }

  /** Subscribe to a prop value */
  public prop<K extends keyof T>(key: K, fn: (value: T[K]) => void, skipInitial = false): Subscription {
    return this.getPropSubject(key).subscribe(fn, skipInitial);
  }

  /** Update state */
  public update(state: Partial<T>): void {
    const toUpdate: (keyof T)[] = [];
    const newState = { ...this.state, ...state };
    for (const key in state) {
      if (this.state[key] !== newState[key]) {
        toUpdate.push(key as keyof T);
      }
    }

    if (toUpdate.length === 0) { return; }

    this._currentState.next(newState);
    this.triggerPropsSubjects(toUpdate, newState);
  }

  /** Update a property */
  public updateProp<K extends keyof T>(key: K, value: T[K]): void {
    this.update({ [key]: value } as unknown as Partial<T>);
  }

  /** Export state to object */
  public export(): RawState<T> {
    const raw: RawState<T> = {
      state: this.state,
      extensions: {},
      entities: {},
    };

    for (const [name, extension] of this._extensions.all()) {
      raw.extensions[String(name)] = extension.export();
    }

    for (const [name, entityStore] of this._entities.all()) {
      raw.entities[String(name)] = entityStore.export();
    }

    return raw;
  }

  /** Import state from object */
  public import(raw: RawState<T>): void {
    this._currentState.next(raw.state);

    for (const [name, extension] of Object.entries(raw.extensions)) {
      this._extensions.set(name, extension);
    }

    for (const [name, entity] of Object.entries(raw.entities)) {
      this._entities.ensureEntityStore(name, entity.idProp, entity.state);
    }
  }

  private getPropSubject<K extends keyof T>(key: K): ValueSubject<T[K]> {
    if (!this._propsValues.has(key)) {
      this._propsValues.set(key, new ValueSubject(this.state[key]));
    }
    return this._propsValues.get(key) as ValueSubject<T[K]>;
  }

  private triggerPropsSubjects(toUpdate: (keyof T)[], state: T): void {
    for (const key of toUpdate) {
      this.triggerPropSubjects(key, state[key]);
    }
  }

  private triggerPropSubjects<K extends keyof T>(key: K, value: T[K]): void {
    const propSubject = this._propsValues.get(key);
    if (propSubject) { propSubject.next(value); }
  }
}
