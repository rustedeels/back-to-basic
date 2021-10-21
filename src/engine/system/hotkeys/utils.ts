import { IHotkey } from './models.js';

/** Serialize Hotkey to string */
export function serializeHotkey(hotkey: IHotkey): string {
  return hotkey.keys
    .sort((a, b) => a.localeCompare(b))
    .join('+')
    .toLowerCase();
}

/** Deserialize Hotkey from string */
export function deserializeHotkey(hotkey: string): IHotkey {
  const keys = hotkey.split('+').filter(e => e);
  return { keys };
}

/** Check if 2 IHotkeys are equivalent */
export function equals(a: IHotkey, b: IHotkey): boolean {
  return serializeHotkey(a) === serializeHotkey(b);
}
