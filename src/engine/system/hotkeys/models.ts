import { Observable } from '../../core/reactive/index.js';

export interface IHotkey {
  keys: string[];
}

export interface IHotkeyAction {
  exclusive: boolean;
  event: string;
}

export type Hotkey = IHotkey & IHotkeyAction;

export interface HotkeyEvent {
  hotkey: Hotkey;
  event: KeyboardEvent;
}

export type HotkeySource = Observable<KeyboardEvent>;
