import {
  Assert,
  describe,
  it,
} from '/tests/index.js';

import * as ParserTools from './tools.js';

describe('Parser tools', () => {
  it('N ensures valid number', () => {
    Assert.isEqual(ParserTools.N(1, -1), 1);
    Assert.isEqual(ParserTools.N(Infinity, -1), -1);
    Assert.isEqual(ParserTools.N(NaN, -1), -1);
  });

  it('Convert to valid number', () => {
    Assert.isEqual(1, ParserTools.toN('1'));
    Assert.isEqual(2, ParserTools.toN('Batatas', 2));
    Assert.isEqual(0, ParserTools.toN(false, 3));
  });

  it('Can validate prefix', () => {
    const hasPrefix = ParserTools.P('value', 'prefix');
    const noPrefix = 'no-prefix';

    Assert.isTrue(ParserTools.hasPrefix(hasPrefix));
    Assert.isFalse(ParserTools.hasPrefix(noPrefix));
  });

  it('Can extract prefix', () => {
    const data = `|>my-prefix-value
# other values 1
# other values 2`;

    const [prefix, content] = ParserTools.extractPrefix(data);

    Assert.isEqual(prefix, 'my-prefix-value');

    const contentLines = content.split('\n');

    Assert.isEqual(contentLines[0], '# other values 1');
    Assert.isEqual(contentLines[1], '# other values 2');
  });
});
