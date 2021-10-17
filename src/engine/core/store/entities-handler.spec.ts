/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  Assert,
  describe,
  it,
} from '/tests/index.js';

import { EntitiesHandler } from './entities-handler.js';

interface TestEntity {
  id: number;
  name: string;
}

describe('Entities store handler', () => {

  it('Should create store with state', () => {
    const initialState: TestEntity[] = [{ id: 1, name: 'Test', }];
    const handler = new EntitiesHandler();

    const store = handler.createEntityStore('n', 'id', initialState);
    const entity = store.getEntity(1);

    Assert.isNotNullOrUndefined(store);
    Assert.isNotNullOrUndefined(entity);
    Assert.isEqual(entity.id, 1);
    Assert.isEqual(entity.name, 'Test');
    Assert.isTrue(handler.hasEntityStore('n'));
  });

  it('Should throw on duplicate store name', () => {
    const initialState: TestEntity[] = [{ id: 1, name: 'Test', }];
    const handler = new EntitiesHandler();

    const store = handler.createEntityStore('n', 'id', initialState);
    Assert.isNotNullOrUndefined(store);

    Assert.throws(() => {
      handler.createEntityStore('n', 'id', initialState);
    });
  });

  it('Should ensure store exists and update state', () => {
    const initialState: TestEntity[] = [{ id: 1, name: 'Test', }];
    const handler = new EntitiesHandler();

    const store = handler.createEntityStore('n', 'id', initialState);
    Assert.isNotNullOrUndefined(store);

    const newState = [{ id: 1, name: 'Test2', }];
    handler.ensureEntityStore('n', 'id', newState);

    const entity = store.getEntity(1);
    Assert.isNotNullOrUndefined(entity);
    Assert.isEqual(entity.id, 1);
    Assert.isEqual(entity.name, 'Test2');
  });

  it('Should return all stores', () => {
    const initialState: TestEntity[] = [{ id: 1, name: 'Test', }];
    const handler = new EntitiesHandler();

    const store1 = handler.createEntityStore('n', 'id', initialState);
    const store2 = handler.createEntityStore('n2', 'id', initialState);

    Assert.isNotNullOrUndefined(store1);
    Assert.isNotNullOrUndefined(store2);

    const stores = Array.from(handler.all());

    Assert.isNotNullOrUndefined(stores);
    Assert.isEqual(stores.length, 2);
    Assert.isEqual(stores[0]![0], Symbol.for('n'));
    Assert.isEqual(stores[0]![1], store1);
    Assert.isEqual(stores[1]![0], Symbol.for('n2'));
    Assert.isEqual(stores[1]![1], store2);
  });

  it('Should get store by name', () => {
    const initialState: TestEntity[] = [{ id: 1, name: 'Test', }];
    const handler = new EntitiesHandler();

    const store1 = handler.createEntityStore('n', 'id', initialState);

    Assert.isNotNullOrUndefined(store1);

    const store = handler.getEntityStore('n');

    Assert.isNotNullOrUndefined(store);
    Assert.isEqual(store, store1);
  });

});
