import {
  Assert,
  describe,
  it,
} from '/tests/index.js';

import {
  FileParser,
  Parser,
} from './models.js';
import { parse } from './parser.js';
import { toN } from './tools.js';

const testSource = `

# chp1|1,2

$ ev1(data1)
$ ev2(data2)

> nxt1[1,2]
> nxt2[3,4]

* some text 1

$ ev3(data3)
$ ev4(data4)

* some text 2

> nxt1[5,6]


# chp2|3,4

$ ev5(data5)
$ ev6(data6)

> nxt1[7,8]

* some text 3

$ ev7(data7)
> nxt2[9,10]

`;

interface Next {
  name: string;
  values: number[];
}

interface Event {
  name: string;
  data: string;
}

interface Text {
  text: string;
  nexts: Next[];
  events: Event[];
}

interface Chapter {
  name: string;
  values: number[];
  texts: Text[];
  nexts: Next[];
  events: Event[];
}

const parserNext: Parser<Next[]> = {
  matchExp: />\s(.*)\[(.*)\]/g,
  matchMap: {
    name: 1,
    values: {
      index: [2],
      parser: (value: string) => value.split(',').map(toN),
    },
  },
};

const parserEvent: Parser<Event[]> = {
  matchExp: /\$\s(.*)\((.*)\)/g,
  matchMap: {
    data: 2,
    name: 1,
  },
};

const chapterParser: FileParser<Chapter> = {
  usePrefix: false,
  entityParser: {
    matchExp: /#\s(.*)\|(.*)([\s\S]*?)(?=\*)([\s\S]*?)(?=#|$)/g,
    matchMap: {
      name: 1,
      values: {
        index: [2],
        parser: (value: string) => value.split(',').map(toN),
      },
      events: {
        index: [3],
        parser: parserEvent
      },
      nexts: {
        index: [3],
        parser: parserNext,
      },
      texts: {
        index: [4],
        parser: {
          matchExp: /\*\s(.*)([\s\S]*?)(?=\*|$)/g,
          matchMap: {
            text: 1,
            nexts: {
              index: [2],
              parser: parserNext,
            },
            events: {
              index: [2],
              parser: parserEvent,
            },
          }
        }
      }
    }
  }
};

describe('Parser', () => {
  it('Should parse entity', () => {
    const res = parse(testSource, chapterParser);

    Assert.isEqual(res.length, 2);

    Assert.isEqual(res[0]?.name, 'chp1');
    Assert.isEqual(res[0]?.values?.length, 2);
    Assert.isEqual(res[0]?.values?.[0], 1);
    Assert.isEqual(res[0]?.values?.[1], 2);

    Assert.isEqual(res[0]?.events?.length, 2);
    Assert.isEqual(res[0]?.events?.[0]?.name, 'ev1');
    Assert.isEqual(res[0]?.events?.[0]?.data, 'data1');
    Assert.isEqual(res[0]?.events?.[1]?.name, 'ev2');
    Assert.isEqual(res[0]?.events?.[1]?.data, 'data2');

    Assert.isEqual(res[0]?.nexts?.length, 2);
    Assert.isEqual(res[0]?.nexts?.[0]?.name, 'nxt1');
    Assert.isEqual(res[0]?.nexts?.[0]?.values?.length, 2);
    Assert.isEqual(res[0]?.nexts?.[0]?.values?.[0], 1);
    Assert.isEqual(res[0]?.nexts?.[0]?.values?.[1], 2);
    Assert.isEqual(res[0]?.nexts?.[1]?.name, 'nxt2');
    Assert.isEqual(res[0]?.nexts?.[1]?.values?.length, 2);
    Assert.isEqual(res[0]?.nexts?.[1]?.values?.[0], 3);
    Assert.isEqual(res[0]?.nexts?.[1]?.values?.[1], 4);

    Assert.isEqual(res[0]?.texts?.length, 2);
    Assert.isEqual(res[0]?.texts?.[0]?.text, 'some text 1');
    Assert.isEqual(res[0]?.texts?.[0]?.events?.length, 2);
    Assert.isEqual(res[0]?.texts?.[0]?.events?.[0]?.name, 'ev3');
    Assert.isEqual(res[0]?.texts?.[0]?.events?.[0]?.data, 'data3');
    Assert.isEqual(res[0]?.texts?.[0]?.events?.[1]?.name, 'ev4');
    Assert.isEqual(res[0]?.texts?.[0]?.events?.[1]?.data, 'data4');
    Assert.isEqual(res[0]?.texts?.[0]?.nexts?.length, 0);

    Assert.isEqual(res[0]?.texts?.[1]?.text, 'some text 2');
    Assert.isEqual(res[0]?.texts?.[1]?.nexts?.length, 1);
    Assert.isEqual(res[0]?.texts?.[1]?.nexts?.[0]?.name, 'nxt1');
    Assert.isEqual(res[0]?.texts?.[1]?.nexts?.[0]?.values?.length, 2);
    Assert.isEqual(res[0]?.texts?.[1]?.nexts?.[0]?.values?.[0], 5);
    Assert.isEqual(res[0]?.texts?.[1]?.nexts?.[0]?.values?.[1], 6);
    Assert.isEqual(res[0]?.texts?.[1]?.events?.length, 0);

    Assert.isEqual(res[1]?.name, 'chp2');
    Assert.isEqual(res[1]?.values?.length, 2);
    Assert.isEqual(res[1]?.values?.[0], 3);
    Assert.isEqual(res[1]?.values?.[1], 4);

    Assert.isEqual(res[1]?.events?.length, 2);
    Assert.isEqual(res[1]?.events?.[0]?.name, 'ev5');
    Assert.isEqual(res[1]?.events?.[0]?.data, 'data5');
    Assert.isEqual(res[1]?.events?.[1]?.name, 'ev6');
    Assert.isEqual(res[1]?.events?.[1]?.data, 'data6');

    Assert.isEqual(res[1]?.nexts?.length, 1);
    Assert.isEqual(res[1]?.nexts?.[0]?.name, 'nxt1');
    Assert.isEqual(res[1]?.nexts?.[0]?.values?.length, 2);
    Assert.isEqual(res[1]?.nexts?.[0]?.values?.[0], 7);
    Assert.isEqual(res[1]?.nexts?.[0]?.values?.[1], 8);

    Assert.isEqual(res[1]?.texts?.length, 1);
    Assert.isEqual(res[1]?.texts?.[0]?.text, 'some text 3');
    Assert.isEqual(res[1]?.texts?.[0]?.nexts?.length, 1);
    Assert.isEqual(res[1]?.texts?.[0]?.nexts?.[0]?.name, 'nxt2');
    Assert.isEqual(res[1]?.texts?.[0]?.nexts?.[0]?.values?.length, 2);
    Assert.isEqual(res[1]?.texts?.[0]?.nexts?.[0]?.values?.[0], 9);
    Assert.isEqual(res[1]?.texts?.[0]?.nexts?.[0]?.values?.[1], 10);
    Assert.isEqual(res[1]?.texts?.[0]?.events?.length, 1);
    Assert.isEqual(res[1]?.texts?.[0]?.events?.[0]?.name, 'ev7');
    Assert.isEqual(res[1]?.texts?.[0]?.events?.[0]?.data, 'data7');
  });
});
