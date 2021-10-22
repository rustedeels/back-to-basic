import { Subscription } from './models.js';
import { Subject } from './subject.js';

/** Subject with initial value */
export class ValueSubject<T> extends Subject<T> {
  private _value: T;

  constructor(value: T) {
    super();
    this._value = value;
  }

  /**
   * Subscribe to subject
   * @param fn action
   * @param skipInitial skipt call for initial value
   * @returns
   */
  public override subscribe(fn: (value: T) => void, skipInitial = false): Subscription {
    if (!skipInitial) { fn(this._value); }
    return super.subscribe(fn);
  }

  public override async next(value: T): Promise<void> {
    if (this._value !== value) {
      this._value = value;
      await super.next(value);
    }
  }

  public get value(): T {
    return this._value;
  }
}
