import { Subscription } from './models.js';
import { Subject } from './subject.js';

/** Subject with initial value */
export class ValueSubject<T> extends Subject<T> {
  private _value: T;

  constructor(value: T) {
    super();
    this._value = value;
  }

  public override subscribe(fn: (value: T) => void): Subscription {
    fn(this._value);
    return super.subscribe(fn);
  }

  public override next(value: T): void {
    if (this._value !== value) {
      this._value = value;
      super.next(value);
    }
  }

  public get value(): T {
    return this._value;
  }
}
