import { Observable } from '../core/reactive/models.js';
import { ValueSubject } from '../core/reactive/value-subject.js';

export type State<T extends object> = Extract<keyof T, string>;

export class StateMachine<T extends object> {
  private readonly _initialState: State<T>;
  private readonly _story: State<T>[] = [];
  private readonly _state: ValueSubject<State<T>>;

  constructor(initialState: State<T>) {
    this._initialState = initialState;
    this._state = new ValueSubject(initialState);
  }

  /** State observable */
  public get state(): Observable<State<T>> {
    return this._state;
  }

  /** State value */
  public get current(): State<T> {
    return this._state.value;
  }

  /** State story */
  public get story(): State<T>[] {
    return [this._initialState, ...this._story];
  }

  /** Push a new state */
  public next(state: State<T>): void {
    if (this.current === state) { return; }

    this._story.push(state);
    this._state.next(state);
  }

  /** Return to previous state */
  public prev(): void {
    if (this._story.length === 0) { return; }

    this._story.pop();
    this._state.next(this.lastStateOrInitial());
  }

  /** Restart machine to initial state */
  public reset(): void {
    this._story.length = 0;
    this._state.next(this._initialState);
  }

  private lastStateOrInitial(): State<T> {
    return this._story[this._story.length - 1] ?? this._initialState;
  }

  public static forType<T extends object>(initialState: State<T>): StateMachine<T> {
    return new StateMachine(initialState);
  }

  public static forString(initialState: string): StateMachine<{ [key: string]: never }> {
    return new StateMachine(initialState);
  }
}
