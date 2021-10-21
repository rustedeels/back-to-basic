import {
  Assert,
  describe,
  it,
} from '/tests/index.js';

import { IHotkey } from './models.js';
import {
  deserializeHotkey,
  equals,
  serializeHotkey,
} from './utils.js';

describe('Hotkey utils', () => {
  it('should serialize and deserialize hotkey', () => {
    const hotkey: IHotkey = {
      keys: ['d', 'b', 'c'],
    };
    const serializedHotkey = serializeHotkey(hotkey);
    const deserializedHotkey = deserializeHotkey(serializedHotkey);

    Assert.isTrue(hotkey.keys.length === deserializedHotkey.keys.length);
    for (const k of hotkey.keys) {
      Assert.isTrue(deserializedHotkey.keys.includes(k));
    }
  });

  it('serialization should ignore keyorder', () => {
    const hotkey1: IHotkey = {
      keys: ['a', 'b', 'c'],
    };

    const hotkey2: IHotkey = {
      keys: ['c', 'b', 'a'],
    };

    const serializedHotkey1 = serializeHotkey(hotkey1);
    const serializedHotkey2 = serializeHotkey(hotkey2);

    Assert.isEqual(serializedHotkey1, serializedHotkey2);
  });

  it('should serialize empty keys', () => {
    const hotkey: IHotkey = { keys: [] };
    const serializedHotkey = serializeHotkey(hotkey);
    const deserializedHotkey = deserializeHotkey(serializedHotkey);

    Assert.isTrue(deserializedHotkey.keys.length === 0);
  });

  it('should ignore case on compare', () => {
    const hotkey1: IHotkey = {
      keys: ['a', 'b', 'c'],
    };

    const hotkey2: IHotkey = {
      keys: ['A', 'B', 'C'],
    };

    Assert.isTrue(equals(hotkey1, hotkey2));
  });
});
