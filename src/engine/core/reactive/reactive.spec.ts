import {
  Assert,
  describe,
  it,
} from '/tests/index.js';

import {
  ObserverError,
  Subject,
} from './index.js';

describe('Reactive', () => {
  it('Should emit values', async () => {
    let target = 'VALUE1';
    const expected = 'VALUE2';

    const subject = new Subject<string>();
    subject.subscribe((value) => { target = value; });
    await subject.next(expected);
    Assert.isEqual(expected, target);
  });

  it('Should not emit on unsubscribe', () => {
    let target = 'VALUE1';
    const expected = 'VALUE1';

    const subject = new Subject<string>();

    const sub = subject.subscribe((value) => { target = value; });
    sub.unsubscribe();
    subject.next('BATATAS');

    Assert.isEqual(expected, target);
  });

  it('Should catch error', () => {
    let target: ObserverError | undefined;

    const subject = new Subject<string>();
    subject.catchError((error) => { target = error; });
    subject.error({ message: 'ERROR', error: '' });

    Assert.isNotNullOrUndefined(target);
    Assert.isEqual('ERROR', target?.message);
  });

  it('Should throw on next after complete', async () => {
    const subject = new Subject<string>();
    subject.complete();

    try {
      await subject.next('VALUE');
    } catch {
      Assert.isTrue(true);
      return;
    }

    Assert.isTrue(false);
  });

  it('Calling next, should not block current event loop', async () => {
    const subject = new Subject<string>();
    let triggered = false;

    subject.subscribe(() => {
      triggered = true;
    });

    subject.next('VALUE');
    Assert.isFalse(triggered);
  });
});
