import {
  EventsHandler,
  Inject,
  Injectable,
} from '/engine/core/index.js';
import { Subscription } from '/engine/core/reactive/models.js';
import { Subject } from '/engine/core/reactive/subject.js';
import { ArrayMap } from '/engine/helpers/array-map.js';

import {
  Hotkey,
  HotkeyEvent,
  HotkeySource,
  IHotkey,
} from './models.js';
import { serializeHotkey } from './utils.js';

@Injectable()
export class HotkeysService {
  private readonly _hotkeyMap = new ArrayMap<string, Hotkey>();
  private readonly _hotkeySub = new Map<string, Subject<HotkeyEvent>>();
  private _sourceSub?: Subscription;
  private _track = new Set<string>();
  private _timeKey?: number;

  @Inject()
  private _events!: EventsHandler<{ [key: string]: HotkeyEvent }>;

  /** Subscribe to an hotkey press */
  public subscribe(hotkey: IHotkey, action: (e: HotkeyEvent) => void): Subscription {
    const sub = this.ensureSubscription(hotkey);
    return sub.subscribe(action);
  }

  /** Register a new hotkey */
  public register(hotkey: Hotkey): void {
    const id = serializeHotkey(hotkey);
    if (hotkey.exclusive)
      this._hotkeyMap.delete(id);
    this._hotkeyMap.add(id, hotkey);
  }

  /** Unregister a hotkey */
  public unregister(hotkey: Hotkey): void {
    const id = serializeHotkey(hotkey);
    this._hotkeyMap.filter(id, h => h.event !== hotkey.event);
  }

  /** Remove all events for an hotkey */
  public clear(hotkey: IHotkey): void {
    const id = serializeHotkey(hotkey);
    this._hotkeyMap.delete(id);
  }

  /** Add hotkey source */
  public setSource(source: HotkeySource): Subscription {
    if (this._sourceSub) {
      this._sourceSub.unsubscribe();
    }
    this._sourceSub = source.subscribe(e => this.handleKeypress(e));
    return this._sourceSub;
  }

  private handleKeypress(event?: KeyboardEvent): void {
    if (!event) { return; }
    const key = event.key;
    event.type === 'keydown' && this._track.add(key);
    event.type === 'keyup' && this._track.delete(key);

    if (this._timeKey) { clearTimeout(this._timeKey); }
    this._timeKey = setTimeout(() => {
      this.triggerKeys(event, ...this._track);
    }, 300);
  }

  private triggerKeys(e: KeyboardEvent, ...keys: string[]): void {
    const hotkey: IHotkey = { keys };
    const mapHotkeys = this._hotkeyMap.get(serializeHotkey(hotkey));
    const sub = this.tryGetSubscription(hotkey);

    if (mapHotkeys && mapHotkeys.length) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      mapHotkeys.forEach(action => this.triggerEvent(e, action));
    }

    if (sub) {
      sub.next({ event: e, hotkey: { keys, exclusive: false, event: '' } });
    }
  }

  private ensureSubscription(hotkey: IHotkey): Subject<HotkeyEvent> {
    const id = serializeHotkey(hotkey);
    const subject = this._hotkeySub.get(id) || new Subject<HotkeyEvent>();
    if (!this._hotkeySub.has(id)) {
      this._hotkeySub.set(id, subject);
    }
    return subject;
  }

  private tryGetSubscription(hotkey: IHotkey): Subject<HotkeyEvent> | undefined {
    const id = serializeHotkey(hotkey);
    return this._hotkeySub.get(id);
  }

  private triggerEvent(event: KeyboardEvent, hotkey: Hotkey): void {
    if (!hotkey.event) { return; }
    const hotkeyEvent: HotkeyEvent = { event, hotkey };
    this._events.emit(hotkey.event, hotkeyEvent);
  }
}
