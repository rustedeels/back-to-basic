import {
  Assert,
  describe,
  it,
} from '/tests/index.js';

import { EntityStore } from './entity-store.js';

interface TestEntity {
  id: number;
  name: string;
}

describe('EntityStore', () => {

  it('Should allow CRUD operations', () => {
    const initialEntities: TestEntity[] = [];
    const store = new EntityStore('id', initialEntities);

    const entity1 = { id: 1, name: 'Entity 1' };

    store.add(entity1);
    Assert.isTrue(store.hasEntity(1));

    let entity = store.getEntity(1);
    Assert.isEqual(entity.id, entity1.id);
    Assert.isEqual(entity.name, entity1.name);

    store.update({ id: 1, name: 'Entity 1 updated' });
    entity = store.getEntity(1);
    Assert.isEqual(entity.id, entity1.id);
    Assert.isEqual(entity.name, 'Entity 1 updated');

    store.remove(1);
    Assert.isFalse(store.hasEntity(1));
  });

  it('Should upsert entities', () => {
    const initialEntities: TestEntity[] = [{ id: 1, name: 'Entity 1' }];
    const store = new EntityStore('id', initialEntities);

    const entity1 = { id: 1, name: 'Entity 1 updated' };
    const entity2 = { id: 2, name: 'Entity 2' };

    Assert.isTrue(store.hasEntity(1));
    store.upsert(entity1);
    Assert.isTrue(store.hasEntity(1));
    let entity = store.getEntity(1);
    Assert.isEqual(entity.id, entity1.id);
    Assert.isEqual(entity.name, entity1.name);

    store.upsert(entity2);
    Assert.isTrue(store.hasEntity(2));
    entity = store.getEntity(2);
    Assert.isEqual(entity.id, entity2.id);
    Assert.isEqual(entity.name, entity2.name);
  });

  it('Should return readonly entity', () => {
    const initialEntities: TestEntity[] = [{ id: 1, name: 'Entity 1' }];
    const store = new EntityStore('id', initialEntities);

    const entity1 = store.getEntity(1);

    Assert.throws(() => { entity1.name = 'Entity 1 updated'; });
  });

  it('Should prevent id update', () => {
    const initialEntities: TestEntity[] = [{ id: 1, name: 'Entity 1' }];
    const store = new EntityStore('id', initialEntities);

    const toUpdate = { id: 2, name: 'Entity 2' };
    Assert.throws(() => { store.update(toUpdate, 1); });
  });

  it('Should update partial entity', () => {
    const initialEntities: TestEntity[] = [{ id: 1, name: 'Entity 1' }];
    const store = new EntityStore('id', initialEntities);

    const toUpdate = { name: 'Entity 1 updated' };
    store.update(toUpdate, 1);
    const entity = store.getEntity(1);
    Assert.isEqual(entity.id, 1);
    Assert.isEqual(entity.name, 'Entity 1 updated');
  });

  it('Should update multiple entities', () => {
    const initialEntities: TestEntity[] = [
      { id: 1, name: 'Entity 1' },
      { id: 2, name: 'Entity 2' },
    ];
    const store = new EntityStore('id', initialEntities);

    const toUpdate = [
      { id: 1, name: 'Entity 1 updated' },
      { id: 2, name: 'Entity 2 updated' },
    ];
    store.updateAll(toUpdate);

    const entity1 = store.getEntity(1);
    Assert.isEqual(entity1.name, 'Entity 1 updated');

    const entity2 = store.getEntity(2);
    Assert.isEqual(entity2.name, 'Entity 2 updated');
  });

  it('Should emit event on add', async () => {
    const initialEntities: TestEntity[] = [{ id: 1, name: 'Entity 1' }];
    const store = new EntityStore('id', initialEntities);
    const entity2 = { id: 2, name: 'Entity 2' };
    let eventCalled = false;

    store.onChange.subscribe(e => {
      if (!e) throw new Error('');

      Assert.isEqual(e.type, 'added');
      Assert.isEqual(e.entity.id, 2);
      Assert.isEqual(e.entity.name, 'Entity 2');
      Assert.throws(() => { e.entity.name = 'Entity 2 updated'; });
      Assert.isEqual(2, e.state.length);
      const entity1 = e.state[0];
      if (!entity1) throw new Error('');
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      Assert.throws(() => { entity1!.name = 'Entity 2 updated'; });

      eventCalled = true;
    });

    await store.add(entity2);
    Assert.isTrue(eventCalled);

  });

  it('Should emit event on update', async () => {
    const initialEntities: TestEntity[] = [
      { id: 1, name: 'Entity 1' },
      { id: 2, name: 'Entity 2' }
    ];
    const store = new EntityStore('id', initialEntities);
    const entity2 = { id: 2, name: 'Entity 2 updated' };
    let eventCalled = false;

    store.onChange.subscribe(e => {
      if (!e) throw new Error('');

      Assert.isEqual(e.type, 'updated');
      Assert.isEqual(e.entity.id, 2);
      Assert.isEqual(e.entity.name, 'Entity 2 updated');
      Assert.throws(() => { e.entity.name = 'Entity 2 updated again'; });
      Assert.isEqual(2, e.state.length);
      const entity1 = e.state[0];
      if (!entity1) throw new Error('');
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      Assert.throws(() => { entity1!.name = 'Entity 2 updated'; });

      eventCalled = true;
    });

    await store.update(entity2);
    Assert.isTrue(eventCalled);

  });

  it('Should emit event on remove', async () => {
    const initialEntities: TestEntity[] = [
      { id: 1, name: 'Entity 1' },
      { id: 2, name: 'Entity 2' }
    ];
    const store = new EntityStore('id', initialEntities);
    let eventCalled = false;

    store.onChange.subscribe(e => {
      if (!e) throw new Error('');

      Assert.isEqual(e.type, 'removed');
      Assert.isEqual(e.entity.id, 2);
      Assert.isEqual(e.entity.name, 'Entity 2');
      Assert.throws(() => { e.entity.name = 'Entity 2 updated again'; });
      Assert.isEqual(1, e.state.length);
      const entity1 = e.state[0];
      if (!entity1) throw new Error('');
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      Assert.throws(() => { entity1!.name = 'Entity 2 updated'; });

      eventCalled = true;
    });

    await store.remove(2);
    Assert.isTrue(eventCalled);

  });

});
