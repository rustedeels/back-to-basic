/* eslint-disable @typescript-eslint/no-explicit-any */

/** Debounces a action call so multiple instances are not called */
export class DebounceAction {

  private readonly _action: (...args: any[]) => void | Promise<void>;
  private readonly _delay: number;
  private _timeout: number | undefined;

  /**
   * delay action and reset iton multiple calls
   * @param delay The delay in milliseconds
   * @param action the action to invoke
   */
  public constructor(delay: number, action: (...args: any[]) => void | Promise<void>) {
    this._action = action;
    this._delay = delay;
  }

  public invoke(...args: any[]): void {
    if (this._timeout) clearTimeout(this._timeout);

    this._timeout = setTimeout(() => {
      this._action(args);
    }, this._delay);
  }

}
