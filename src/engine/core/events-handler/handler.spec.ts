import {
  Assert,
  describe,
  it,
} from '/tests/index.js';

import {
  appContainer,
  Event,
  EventModule,
  EventsHandler,
  getEventModule,
} from '../index.js';

interface AppEvents {
  ev1: string;
  ev2: string;
  ev3: number;
}

@EventModule
class TestHandler {
  public valueEv1 = '';
  public valueEv2 = '';
  public valueEv3 = 0;

  @Event<AppEvents>('ev1')
  public handleEv1(value?: string) {
    this.valueEv1 = value ?? '';
  }

  @Event<AppEvents>('ev2')
  public handleEv2(value?: string) {
    this.valueEv2 = value ?? '';
  }

  @Event<AppEvents>('ev3')
  public handleEv3(value?: number) {
    this.valueEv3 = value ?? 0;
  }
}

const handler = appContainer.resolve<EventsHandler<AppEvents>>(EventsHandler);

describe('Events handler', () => {

  it('should emit event to all subscribers', async () => {
    let ev1 = '';
    let ev2 = '';
    const expectedEv1 = 'VALUE1';

    const sub1 = handler.get('ev1')
      .subscribe(e => ev1 = e ?? '');
    const sub2 = handler.get('ev1')
      .subscribe(e => ev2 = e ?? '');

    await handler.emit('ev1', expectedEv1);

    Assert.isEqual(ev1, expectedEv1);
    Assert.isEqual(ev2, expectedEv1);

    sub1.unsubscribe();
    sub2.unsubscribe();
  });

  it('should emit event to right subscriber', async () => {
    let ev1 = '';
    let ev2 = '';
    const expectedEv1 = 'VALUE1';
    const expectedEv2 = 'VALUE2';

    const sub1 = handler.get('ev1').subscribe(e => ev1 = e ?? '');
    const sub2 = handler.get('ev2').subscribe(e => ev2 = e ?? '');

    await handler.emit('ev1', expectedEv1);
    await handler.emit('ev2', expectedEv2);

    Assert.isEqual(ev1, expectedEv1);
    Assert.isEqual(ev2, expectedEv2);

    sub1.unsubscribe();
    sub2.unsubscribe();
  });

  it('should not emit to unsubscribed clients', () => {
    let ev1 = '';
    const expectedEv1 = 'VALUE1';

    const sub1 = handler.get('ev1')
      .subscribe(e => ev1 = e ?? '');
    sub1.unsubscribe();
    handler.emit('ev1', expectedEv1);

    Assert.isEqual(ev1, '');
  });

  it('should emit event to decorated instances', async () => {
    const expectedEv1 = 'Batatas';
    const expectedEv2 = 'Tremoços';
    const expectedEv3 = 404;

    await handler.emit('ev1', expectedEv1);
    await handler.emit('ev2', expectedEv2);
    await handler.emit('ev3', expectedEv3);

    const testHandler = getEventModule(TestHandler);

    Assert.isEqual(testHandler.valueEv1, expectedEv1);
    Assert.isEqual(testHandler.valueEv2, expectedEv2);
    Assert.isEqual(testHandler.valueEv3, expectedEv3);
  });

});
