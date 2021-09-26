import {
  Assert,
  describe,
  it,
} from '/tests/index.js';

import {
  isObject,
  isValue,
} from './guards.js';

describe('Helper Guards', () => {
  it('isObject should validate value is object', () => {
    Assert.isTrue(isObject({}));
    Assert.isFalse(isObject(null));
    Assert.isFalse(isObject(undefined));
    Assert.isFalse(isObject(1));
    Assert.isFalse(isObject('1'));
    Assert.isTrue(isObject([]));
  });

  it('isValue should validate value is not null or indefined', () => {
    Assert.isFalse(isValue(null));
    Assert.isFalse(isValue(undefined));
    Assert.isTrue(isValue(1));
    Assert.isTrue(isValue('1'));
    Assert.isTrue(isValue({}));
    Assert.isTrue(isValue([]));
  });
});
