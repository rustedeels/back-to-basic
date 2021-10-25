import {
  DocumentParser,
  EntityParser,
  IMultiNodeParser,
  ISingleNodeParser,
  MultiParser,
  SingleParser,
} from './models.js';
import {
  extractPrefix,
  getPropValue,
  regexSplit,
} from './tools.js';

export function parse<T extends object>(source: string, node: IMultiNodeParser<T>): T[]
export function parse<T extends object>(source: string, node: ISingleNodeParser<T>): T;
export function parse<T extends object>(source: string, node: DocumentParser<T>): T | T[] {
  let prefix = '';
  if (node.usePrefix) { [prefix, source] = extractPrefix(source); }

  if (hasMultipleNodes(node)) {
    const sourceList = regexSplit(source, node.splitExp);
    return sourceList
      .flatMap(source => parseMultiEntity(prefix, source, node.parser));
  }

  return parseEntity(prefix, source, node.parser);
}

function parseMultiEntity<T extends object>(prefix: string, source: string, parser: EntityParser<T>): T[] {
  if (parser.beforeParse) {
    [prefix, source] = parser.beforeParse(prefix, source);
  }

  if (isMultiParser(parser)) { return parseEntity(prefix, source, parser); }
  else { return [parseEntity(prefix, source, parser)]; }
}

function parseEntity<T extends object>(prefix: string, source: string, parser: SingleParser<T>): T;
function parseEntity<T extends object>(prefix: string, source: string, parser: MultiParser<T>): T[];
function parseEntity<T extends object>(prefix: string, source: string, parser: EntityParser<T>): T | T[] {
  if (isMultiParser(parser)) {
    const matches = source.matchAll(parser.matchExp);
    const values: T[] = [];

    for (const match of matches) {
      let entity = parseSingleEntity(prefix, match, parser);
      if (parser.afterParse) { entity = parser.afterParse(prefix, source, entity); }
      values.push(entity);
    }

    return values;
  } else {
    const match = parser.matchExp.exec(source);

    if (match) {
      const entity = parseSingleEntity(prefix, match, parser);
      if (parser.childs) {
        for (const cKey of Object.keys(parser.childs ?? {})) {
          if (!isKey(cKey)) { continue; }
          const cParser = parser.childs[cKey];
          if (!cParser) { continue; }

          entity[cKey] = parseEntity(prefix, source, cParser);
        }
      }
      return parser.afterParse ? parser.afterParse(prefix, source, entity) : entity;
    }
  }

  throw new Error(`Unable to parse entity from source, can't match: ${parser.matchExp}`);
}

/**
 * Parse an entity from source
 *
 * @param prefix prefix to use for the parser
 * @param source source to parse
 * @param parser parser model to user
 */
function parseSingleEntity<T extends object>(prefix: string, match: RegExpMatchArray, parser: EntityParser<T>): T {
  const value: Partial<T> = {};

  for (const index in parser.map) {
    const key = index as Extract<keyof T, string>;
    const propMatch = parser.map[key];
    if (!propMatch) { continue; }

    const propVal = getPropValue(match, propMatch);
    if (typeof propMatch === 'number') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      value[key] = propVal as any;
      continue;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value[key] = propMatch.parse(propVal, prefix) as any;
  }

  return value as T;
}

function isMultiParser<T extends object>(parser: EntityParser<T>): parser is MultiParser<T> {
  return (parser as MultiParser<T>).multi === true;
}

function hasMultipleNodes<T extends object>(node: DocumentParser<T>): node is IMultiNodeParser<T> {
  return (node as IMultiNodeParser<T>).splitExp instanceof RegExp;
}

function isKey<T>(key: unknown): key is Extract<keyof T, string> {
  return typeof key === 'string';
}
