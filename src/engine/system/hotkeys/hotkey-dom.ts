import { Subject } from '/engine/core/reactive/subject.js';

import { HotkeySource } from './models.js';

export function domHotkeySource(): HotkeySource {
  const subject = new Subject<KeyboardEvent>();

  document.addEventListener('keydown', (event) => {
    subject.next(event);
  });

  document.addEventListener('keyup', (event) => {
    subject.next(event);
  });

  return subject;
}
