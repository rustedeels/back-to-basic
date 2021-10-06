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
  private _logger!: LoggerService

  /**
   * Emit a new event
   *
   * @param event event name
   * @param data event data
   */
  public emit<K extends Extract<keyof T, string>>(event: K, data?: T[K]): void {
    this._logger.engine(`Event: ${event}`, data);
    this.getSubject(event).next(data as T[K]);
  }

  public get<K extends Extract<keyof T, string>>(event: K): Observable<T[K]> {
    return this.getSubject(event);
  }

  private getSubject<K extends Extract<keyof T, string>>(event: K): Subject<T[K]> {
    if (!this._events.has(event)) {
      this._events.set(event, new Subject());
    }

    return this._events.get(event) as Subject<T[K]>;
  }
}
