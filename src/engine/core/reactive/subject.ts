import {
  Listner,
  Observable,
  Observer,
  ObserverError,
  Subscription,
} from './models.js';

/** Only emit new values */
export class Subject<T> implements Observer<T>, Observable<T> {
  private readonly _subscribers: Map<Listner<T>, Subscription> = new Map();
  private readonly _errorCatchers: Set<(e: ObserverError) => void> = new Set();
  private _hasFinished = false;

  public subscribe(fn: Listner<T>): Subscription {
    const sub: Subscription & { _active: boolean } = {
      _active: true,
      get active() { return this._active; },
      unsubscribe: () => {
        if (!sub.active) { return; }
        this._subscribers.delete(fn);
        sub._active = false;
      },
    };

    this._subscribers.set(fn, sub);
    return sub;
  }

  public catchError(fn: (e: ObserverError) => void): Observable<T> {
    this._errorCatchers.add(fn);
    return this;
  }

  public complete(): void {
    this._hasFinished = true;
    this._subscribers.forEach(sub => sub.unsubscribe());
  }

  public error(e: ObserverError): void {
    for (const fn of this._errorCatchers) {
      try { fn(e); }
      catch { /* ignore */ }
    }
  }

  public next(e: T): Promise<void> {
    if (this._hasFinished) throw new Error('Observable has finished');

    return new Promise(resolve => {
      setTimeout(() => {
        for (const [fn, state] of this._subscribers) {
          if (!state.active) continue;
          try { fn(e); }
          catch { /* ignore */ }
        }
        resolve();
      }, 0);
    });
  }
}
