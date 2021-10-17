import {
  Assert,
  describe,
  it,
} from '/tests/index.js';

import { appContainer } from '../dependency-container/index.js';
import { ensureStore } from './ensure-store.js';
import { Store } from './store.js';

interface RootState {
  version: number;
}
const rootStore = new Store<RootState>({ version: 0 });
appContainer.register<Store<RootState>>({
  target: Store,
  life: 'singleton',
  value: rootStore,
});

interface People {
  id: number;
  name: string;
  age: number;
}

describe('Ensure store helper', () => {
  it('Should create store when not exists', () => {
    const store = ensureStore('st1', { m: 1 });

    Assert.isEqual(store.state.m, 1);
    store.update({ m: 2 });

    const store2 = ensureStore('st1', { m: 3 });
    Assert.isEqual(store2.state.m, 2);
  });

  it('Should throw when not exists', () => {
    Assert.throws(() => {
      ensureStore('BATATAS');
    });
  });

  it('Should return undefined when not exists and throw is disabled', () => {
    const store = ensureStore('BATATAS', false);
    Assert.isUndefined(store);
  });

  it('Should resolve store from path', () => {
    const st1 = ensureStore('st1', { m: 1 });
    const st2 = ensureStore('st1.st2', { m: 2 });

    Assert.isEqual(st2.state.m, 2);
    Assert.isTrue(st1.extensions.has('st2'));
  });

  it('Should resolve entity store from path with array', () => {
    const initialState: People[] = [{ id: 1, name: 'John', age: 20 }];
    const peopleStore = ensureStore<People, 'id'>('people[]', initialState, 'id');

    Assert.isEqual(peopleStore.state.length, 1);
    Assert.isEqual(peopleStore.getEntity(1).name, 'John');

    const johnStore = ensureStore<People>('people[1]');
    Assert.isEqual(johnStore.state.name, 'John');

    johnStore.update({ name: 'John Doe' });
    Assert.isEqual(peopleStore.getEntity(1).name, 'John Doe');
  });

  it('Should resolve entity store from path with array and id', () => {
    const initialState: People[] = [{ id: 1, name: 'John', age: 20 }];
    const peopleStore = ensureStore<People, 'id'>('people[]', initialState, 'id');

    const store = ensureStore('people[1].powers', { flying: true, strength: 10 });
    Assert.isEqual(store.state.flying, true);
    Assert.isEqual(store.state.strength, 10);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const johnPowers = peopleStore.getStore(1).extensions.get<any>('powers');
    Assert.isEqual(johnPowers.state.flying, true);
    Assert.isEqual(johnPowers.state.strength, 10);
  });
});
