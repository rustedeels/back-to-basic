import {
  Assert,
  describe,
  it,
} from '/tests/index.js';

import {
  EntityStorePart,
  EntityStoreSinglePart,
  isEntityStorePart,
  isEntityStoreSinglePart,
} from './models.js';
import { parseStorePath } from './store-path.js';

describe('Store path parser', () => {
  it('Should parse simple extension', () => {
    const target = parseStorePath('name');

    Assert.isEqual(target.value, 'name');
    Assert.isEmpty(target.parents);
  });

  it('Should parse simple EntityStore', () => {
    const target = parseStorePath('entity[]');

    const value = target.value as EntityStorePart;
    Assert.isTrue(isEntityStorePart(value));
    Assert.isEqual(value.name, 'entity');
    Assert.isEmpty(target.parents);
  });

  it('Should parse simple EntityStore value', () => {
    const target = parseStorePath('entity[id]');

    const value = target.value as EntityStoreSinglePart;
    Assert.isTrue(isEntityStoreSinglePart(value));
    Assert.isEqual(value.name, 'entity');
    Assert.isEqual(value.id, 'id');
    Assert.isEmpty(target.parents);
  });

  it('Should parse parents', () => {
    const target = parseStorePath('p1.p2.name');

    Assert.isEqual(target.value, 'name');
    Assert.isNotEmpty(target.parents);
    Assert.isTrue(target.parents.length === 2);
    Assert.isEqual(target.parents[0], 'p1');
    Assert.isEqual(target.parents[1], 'p2');
  });

  it('Should parse parents from EntityStore', () => {
    const target = parseStorePath('p1.p2[id].name');

    Assert.isEqual(target.value, 'name');
    Assert.isNotEmpty(target.parents);
    Assert.isTrue(target.parents.length === 2);
    Assert.isEqual(target.parents[0], 'p1');

    const p2 = target.parents[1] as EntityStoreSinglePart;
    Assert.isTrue(isEntityStoreSinglePart(p2));
    Assert.isEqual(p2.name, 'p2');
    Assert.isEqual(p2.id, 'id');
  });

  it('Should throw when EntityStore is parent', () => {
    Assert.throws(() => parseStorePath('entity[].name'));
    Assert.throws(() => parseStorePath('p1.entity[].name'));
  });
});
