import {
  appContainer,
  EventsHandler,
} from '/engine/core/index.js';
import { Subject } from '/engine/core/reactive/subject.js';
import {
  Assert,
  describe,
  it,
} from '/tests/index.js';

import { domHotkeySource } from './hotkey-dom.js';
import { HotkeysService } from './hotkeys.service.js';
import {
  HotkeyEvent,
  IHotkey,
} from './models.js';

async function pressKeys(subject: Subject<KeyboardEvent>, keys: string[]) {
  for (const key of keys) {
    const event = new KeyboardEvent('keydown', { key });
    await subject.next(event);
  }
}

async function releaseKeys(subject: Subject<KeyboardEvent>, keys: string[]) {
  for (const key of keys) {
    const event = new KeyboardEvent('keyup', { key });
    await subject.next(event);
  }
}

function pressDocumentKeys(keys: string[]) {
  keys.forEach((key) => {
    const event = new KeyboardEvent('keydown', { key });
    document.dispatchEvent(event);
  });
}

function releaseDocumentKeys(keys: string[]) {
  keys.forEach((key) => {
    const event = new KeyboardEvent('keyup', { key });
    document.dispatchEvent(event);
  });
}

describe('Hotkeys Service', () => {
  it('Should be an instance of HotkeysService', () => {
    const service = appContainer.resolve(HotkeysService);
    Assert.isTrue(service instanceof HotkeysService);
  });

  it('Should trigger on key match', async () => {
    let triggered = false;

    const service = appContainer.resolve(HotkeysService);
    const hotkey: IHotkey = { keys: ['Control', 'b', 'alt'] };
    const source = new Subject<KeyboardEvent>();

    service.setSource(source);
    service.subscribe(hotkey, () => triggered = true);

    await pressKeys(source, hotkey.keys);
    await new Promise(resolve => setTimeout(resolve, 300));
    await releaseKeys(source, hotkey.keys);

    Assert.isTrue(triggered);
  });

  it('Should not trigger on key mismatch', async () => {
    let triggered = false;

    const service = appContainer.resolve(HotkeysService);
    const hotkey: IHotkey = { keys: ['Control', 'b', 'alt'] };
    const source = new Subject<KeyboardEvent>();

    service.setSource(source);
    service.subscribe(hotkey, () => triggered = true);

    await pressKeys(source, ['Control', 'b']);
    await new Promise(resolve => setTimeout(resolve, 300));
    await releaseKeys(source, ['Control', 'b']);

    Assert.isFalse(triggered);
  });

  it('Should trigger event on key match', async () => {
    let triggered = false;

    const service = appContainer.resolve(HotkeysService);
    const events = appContainer.resolve<EventsHandler<{ call: HotkeyEvent }>>(EventsHandler);
    const hotkey: IHotkey = { keys: ['Control', 'b', 'alt'] };
    const source = new Subject<KeyboardEvent>();

    service.setSource(source);
    events.get('call').subscribe(() => triggered = true);
    service.register({
      event: 'call',
      keys: hotkey.keys,
      exclusive: true,
    });

    await pressKeys(source, hotkey.keys);
    await new Promise(resolve => setTimeout(resolve, 300));
    await releaseKeys(source, hotkey.keys);

    Assert.isTrue(triggered);
  });

  it('Should trigger on DOM events', async () => {
    let triggered = false;

    const service = appContainer.resolve(HotkeysService);
    const events = appContainer.resolve<EventsHandler<{ call: HotkeyEvent }>>(EventsHandler);
    const hotkey: IHotkey = { keys: ['Control', 'b', 'alt'] };

    service.setSource(domHotkeySource());
    events.get('call').subscribe(() => triggered = true);
    service.register({
      event: 'call',
      keys: hotkey.keys,
      exclusive: true,
    });

    pressDocumentKeys(hotkey.keys);
    await new Promise(resolve => setTimeout(resolve, 350));
    releaseDocumentKeys(hotkey.keys);

    Assert.isTrue(triggered);
  });
});
