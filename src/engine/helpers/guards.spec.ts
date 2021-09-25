import {
  Assert,
  describe,
  it,
} from '/tests/index.js';

import {
  isObject,
  isValue,
} from './guards.js';

describe('Test guards', () => {
  it('isObject', () => {
    Assert.isTrue(isObject({}));
    Assert.isFalse(isObject(null));
    Assert.isFalse(isObject(undefined));
    Assert.isFalse(isObject(1));
    Assert.isFalse(isObject('1'));
    Assert.isTrue(isObject([]));
  });

  it('isValue', () => {
    Assert.isFalse(isValue(null));
    Assert.isFalse(isValue(undefined));
    Assert.isTrue(isValue(1));
    Assert.isTrue(isValue('1'));
    Assert.isTrue(isValue({}));
    Assert.isTrue(isValue([]));
  });
});