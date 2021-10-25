import {
  Assert,
  describe,
  it,
} from '/tests/index.js';

import { ValuePropertyParser } from './models.js';
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

  it('Can split by regex', () => {
    const content = `# BLOCK
    dome data
    batatas
    potatos
`;

    const source = `${content}${content}${content}${content}`;
    const res = ParserTools.regexSplit(source, /^# BLOCK$/m);

    Assert.isEqual(res.length, 4);
    Assert.isEqual(res[0], content);
    Assert.isEqual(res[1], content);
    Assert.isEqual(res[2], content);
    Assert.isEqual(res[3], content);
  });

  it('Can extract property by number', () => {
    const data = '# DATA|BODY';
    const match = /^# DATA\|(.*)$/gm.exec(data);

    Assert.isNotNull(match);

    const value = ParserTools.getPropValue(match, 1);

    Assert.isEqual(value, 'BODY');
  });

  it('Can extract property by ValuePropParser', () => {
    const data = '# DATA|10';
    const match = /^# DATA\|(.*)$/gm.exec(data);
    const parser: ValuePropertyParser<number> = {
      index: [1],
      default: '0',
      parse: (v) => Number(v),
    };

    Assert.isNotNull(match);

    const value = ParserTools.getPropValue(match, parser);

    Assert.isEqual(value, '10');
  });
});
