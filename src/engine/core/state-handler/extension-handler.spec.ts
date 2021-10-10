import {
  Assert,
  describe,
  it,
} from '/tests/index.js';

import { ExtensionStoreHandler } from './extension-handler.js';

interface TestEntity {
  id: number;
  name: string;
}

describe('Extensions handler', () => {

  it('should be able to add extensions', () => {
    const handler = new ExtensionStoreHandler();

    const store = handler.add<TestEntity>('n', { id: 1, name: 'test' });

    Assert.isNotNullOrUndefined(store);
    Assert.isEqual(store.state.id, 1);
    Assert.isEqual(store.state.name, 'test');
    Assert.isTrue(handler.has('n'));
  });

  it('should not update state on add duplicate name', () => {
    const handler = new ExtensionStoreHandler();

    const store = handler.add<TestEntity>('n', { id: 1, name: 'test' });

    Assert.isNotNullOrUndefined(store);

    handler.add<TestEntity>('n', { id: 2, name: 'test2' });

    Assert.isEqual(store.state.id, 1);
    Assert.isEqual(store.state.name, 'test');
  });

  it('should be able to get extensions', () => {
    const handler = new ExtensionStoreHandler();

    const store = handler.add<TestEntity>('n', { id: 1, name: 'test' });

    Assert.isNotNullOrUndefined(store);

    const store2 = handler.get<TestEntity>('n');

    Assert.isNotNullOrUndefined(store2);
    Assert.isEqual(store2.state.id, 1);
    Assert.isEqual(store2.state.name, 'test');
  });

});
