import {
  Assert,
  describe,
  it,
} from '/tests/index.js';

import { ArrayMap } from './array-map.js';

describe('ArrayMap', () => {

  it('Should track correct size', () => {
    const map = new ArrayMap<string, number>();
    Assert.isEqual(map.size, 0);
    map.set('a', 1);
    Assert.isEqual(map.size, 1);
    map.set('b', 2);
    Assert.isEqual(map.size, 2);
    map.delete('a');
    Assert.isEqual(map.size, 1);
  });

  it('Should return correct values', () => {
    const map = new ArrayMap<string, number>();

    map.set('a', 1);
    map.set('b', 2);

    Assert.isEqual(map.first('a'), 1);
    Assert.isEqual(map.first('b'), 2);
  });

});
