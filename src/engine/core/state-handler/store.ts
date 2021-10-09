import {
  Subscription,
  ValueSubject,
} from '../reactive/index.js';
import { RawState } from './models.js';
import { Proxies } from './proxies.js';

/** State store, to separate reads from write and keep one source of true */
export class Store<T extends object> {
  private _currentState: ValueSubject<T>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly _propsValues = new Map<keyof T, ValueSubject<any>>();
  private readonly _extensions = new Map<Symbol, Store<object>>();

  public constructor(initialState: T) {
    this._currentState = new ValueSubject(initialState);
    this._currentState.subscribe(state => this.triggerPropsSubjects(state));
  }

  /** Get last state at this moment */
  public get state(): T {
    return Proxies.readonly(this._currentState.value);
  }

  /** Subscribe to state value */
  public value(fn: (state: T) => void): Subscription {
    return this._currentState.subscribe(val => fn(Proxies.readonly(val)));
  }

  /** Subscribe to a prop value */
  public prop<K extends keyof T>(key: K, fn: (value: T[K]) => void): Subscription {
    return this.getPropSubject(key).subscribe(fn);
  }

  /** Update state */
  public update(state: Partial<T>): void {
    this._currentState.next({
      ...this.state,
      ...state,
    });
  }

  /** Update a property */
  public updateProp<K extends keyof T>(key: K, value: T[K]): void {
    this._currentState.next({
      ...this.state,
      [key]: value,
    });
  }

  /** Check if extension is implemented for name */
  public hasExtension(name: string): boolean {
    return this._extensions.has(Symbol.for(name));
  }

  /**
   * Get extension state by name, if not found, throw error
   *
   * @param name extension name
   */
  public extend<Z extends object>(name: string): Store<Z>;
  /**
   * Get extension state by name, if not found, create it
   *
   * @param name extension name
   * @param state initial state
   */
  public extend<Z extends object>(name: string, state: Z): Store<Z>;
  public extend<Z extends object>(name: string, state?: Z): Store<Z> {
    if (this.hasExtension(name)) {
      return this._extensions.get(Symbol.for(name)) as unknown as Store<Z>;
    }

    if (!state) { throw new Error(`Extension ${name} not found`); }

    const extension = new Store<Z>(state);
    this._extensions.set(Symbol.for(name), extension as unknown as Store<object>);
    return extension;
  }

  /** Create or update extension state */
  public setExtension<Z extends object>(name: string, state: Z): void {
    if (!this.hasExtension(name)) {
      this.extend(name, state);
    } else {
      this.extend(name).update(state);
    }
  }

  /** Export state to object */
  public export(): RawState<T> {
    const raw: RawState<T> = {
      state: this.state,
      extensions: {},
    };

    for (const [name, extension] of this._extensions) {
      raw.extensions[String(name)] = extension.export();
    }

    return raw;
  }

  /** Import state from object */
  public import(raw: RawState<T>): void {
    this._currentState.next(raw.state);

    for (const [name, extension] of Object.entries(raw.extensions)) {
      this.setExtension(name, extension);
    }
  }

  private getPropSubject<K extends keyof T>(key: K): ValueSubject<T[K]> {
    if (!this._propsValues.has(key)) {
      this._propsValues.set(key, new ValueSubject(this.state[key]));
    }
    return this._propsValues.get(key) as ValueSubject<T[K]>;
  }

  private triggerPropsSubjects(state: T): void {
    if (!state || this._propsValues.size === 0) return;
    for (const [key, subject] of this._propsValues) {
      subject.next(state[key]);
    }
  }
}
