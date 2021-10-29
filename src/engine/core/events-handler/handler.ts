import { StrKey } from '/engine/helpers/util-types.js';

import {
  Inject,
  Injectable,
} from '../dependency-container/index.js';
import { LoggerService } from '../logger/index.js';
import {
  Observable,
  Subject,
} from '../reactive/index.js';

@Injectable()
// eslint-disable-next-line @typescript-eslint/ban-types
export class EventsHandler<T extends object> {
  private readonly _events: Map<string, Subject<unknown>> = new Map();

  @Inject()
  private _logger!: LoggerService;

  /**
   * Emit a new event
   *
   * @param event event name
   * @param data event data
   */
  public async emit<K extends StrKey<T>>(event: K, ...data: T[K] extends never ? [undefined?] : [T[K]]): Promise<void> {
    this._logger.engine(`Event: ${event}`, data);
    await this.getSubject(event).next(data[0] as T[K]);
  }

  public get<K extends StrKey<T>>(event: K): Observable<T[K]> {
    return this.getSubject(event);
  }

  private getSubject<K extends StrKey<T>>(event: K): Subject<T[K]> {
    if (!this._events.has(event)) {
      this._events.set(event, new Subject());
    }

    return this._events.get(event) as Subject<T[K]>;
  }
}
