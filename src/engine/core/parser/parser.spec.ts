import {
  Assert,
  describe,
  it,
} from '/tests/index.js';

import { DocumentParser } from './models.js';
import { parse } from './parser.js';

interface TestCaseItem {
  name: string;
  values: number[];
}

interface TestCase {
  age: number;
  props: TestCaseItem[];
  actions: TestCaseItem[];
}

const testCaseSource = `|>test-case
# 10

$ prop1|1,2,3
$ prop2|4,5,6
? action1|7,8,9
? action2|10,11,12

# 25

$ prop1|13,14,15
$ prop2|16,17,18
? action1|19,20,21
? action2|22,23,24
`;

const parser: DocumentParser<TestCase> = {
  usePrefix: true,
  splitExp: /^# (.*)/m,
  parser: {
    matchExp: /^# (.*)/m,
    map: {
      age: {
        index: [1],
        parse: (value: string) => parseInt(value, 10),
      }
    },
    childs: {
      actions: {
        matchExp: /^\? (.*)\|(.*)/gm,
        multi: true,
        map: {
          name: 1,
          values: {
            index: [2],
            parse: (value: string) => value.split(',').map(Number),
            multi: true,
          }
        }
      },
      props: {
        matchExp: /^\$ (.*)\|(.*)/gm,
        multi: true,
        map: {
          name: 1,
          values: {
            index: [2],
            parse: (value: string) => value.split(',').map(Number),
            multi: true,
          }
        }
      },
    }
  }
};

describe('Parser', () => {
  it('Should be able to parse', () => {
    const result = parse(testCaseSource, parser);

    Assert.isEqual(result.length, 2);

    Assert.isNotUndefined(result[0]);
    Assert.isEqual(result[0].age, 10);
    Assert.isEqual(result[0].props.length, 2);
    Assert.isEqual(result[0].props[0]?.name, 'prop1');
    Assert.isEqual(result[0].props[0]?.values.length, 3);
    Assert.isEqual(result[0].props[0]?.values[0], 1);
    Assert.isEqual(result[0].props[0]?.values[1], 2);
    Assert.isEqual(result[0].props[0]?.values[2], 3);
    Assert.isEqual(result[0].props[1]?.name, 'prop2');
    Assert.isEqual(result[0].props[1]?.values.length, 3);
    Assert.isEqual(result[0].props[1]?.values[0], 4);
    Assert.isEqual(result[0].props[1]?.values[1], 5);
    Assert.isEqual(result[0].props[1]?.values[2], 6);
    Assert.isEqual(result[0].actions.length, 2);
    Assert.isEqual(result[0].actions[0]?.name, 'action1');
    Assert.isEqual(result[0].actions[0]?.values.length, 3);
    Assert.isEqual(result[0].actions[0]?.values[0], 7);
    Assert.isEqual(result[0].actions[0]?.values[1], 8);
    Assert.isEqual(result[0].actions[0]?.values[2], 9);
    Assert.isEqual(result[0].actions[1]?.name, 'action2');
    Assert.isEqual(result[0].actions[1]?.values.length, 3);
    Assert.isEqual(result[0].actions[1]?.values[0], 10);
    Assert.isEqual(result[0].actions[1]?.values[1], 11);
    Assert.isEqual(result[0].actions[1]?.values[2], 12);

    Assert.isNotUndefined(result[1]);
    Assert.isEqual(result[1].age, 25);
    Assert.isEqual(result[1].props.length, 2);
    Assert.isEqual(result[1].props[0]?.name, 'prop1');
    Assert.isEqual(result[1].props[0]?.values.length, 3);
    Assert.isEqual(result[1].props[0]?.values[0], 13);
    Assert.isEqual(result[1].props[0]?.values[1], 14);
    Assert.isEqual(result[1].props[0]?.values[2], 15);
    Assert.isEqual(result[1].props[1]?.name, 'prop2');
    Assert.isEqual(result[1].props[1]?.values.length, 3);
    Assert.isEqual(result[1].props[1]?.values[0], 16);
    Assert.isEqual(result[1].props[1]?.values[1], 17);
    Assert.isEqual(result[1].props[1]?.values[2], 18);
    Assert.isEqual(result[1].actions.length, 2);
    Assert.isEqual(result[1].actions[0]?.name, 'action1');
    Assert.isEqual(result[1].actions[0]?.values.length, 3);
    Assert.isEqual(result[1].actions[0]?.values[0], 19);
    Assert.isEqual(result[1].actions[0]?.values[1], 20);
    Assert.isEqual(result[1].actions[0]?.values[2], 21);
    Assert.isEqual(result[1].actions[1]?.name, 'action2');
    Assert.isEqual(result[1].actions[1]?.values.length, 3);
    Assert.isEqual(result[1].actions[1]?.values[0], 22);
    Assert.isEqual(result[1].actions[1]?.values[1], 23);
    Assert.isEqual(result[1].actions[1]?.values[2], 24);
  });
});
