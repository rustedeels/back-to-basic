import {
  EntityParser,
  FileParser,
  GroupParser,
} from './models.js';
import { extractPrefix } from './tools.js';

/** Parse source using a file parser */
export function parse<T extends object>(source: string, fileParser: FileParser<T>): T[] {
  let prefix = '';
  if (fileParser.usePrefix) { [prefix, source] = extractPrefix(source); }
  return parseAllEntities(prefix, source, fileParser.entityParser);
}

function parseAllEntities<T extends object>(prefix: string, source: string, parser: EntityParser<T>): T[] {
  if (!parser.matchExp.global) {
    const flags = parser.matchExp.flags + 'g';
    parser.matchExp = new RegExp(parser.matchExp.source, flags);
  }

  if (parser.beforeParse) { [prefix, source] = parser.beforeParse(prefix, source); }

  const matchs = [...source.matchAll(parser.matchExp)];
  return matchs.map(match => parseEntity(prefix, match, parser));
}

function parseEntity<T extends object>(prefix: string, match: RegExpMatchArray, parser: EntityParser<T>): T {
  const entity: Partial<T> = {};

  for (const key of Object.keys(parser.matchMap) as (keyof T)[]) {
    const propParser = parser.matchMap[key];
    if (typeof propParser === 'number') {
      entity[key] = (match[propParser] ?? '') as unknown as T[keyof T];
    } else if (propParser) {
      entity[key] = parseProperty(prefix, match, propParser);
    }
  }

  return parser.afterParse ? parser.afterParse(prefix, match, entity as T) : entity as T;
}

function parseProperty<T>(prefix: string, match: RegExpMatchArray, groupParser: GroupParser<T>): T {
  const value = getFirstMatch(match, groupParser.index) || (groupParser.default ?? '');

  if (typeof groupParser.parser === 'undefined') {
    return value as unknown as T;
  }

  if (typeof groupParser.parser === 'function') {
    return groupParser.parser(value, prefix);
  }

  return parseAllEntities(prefix, value, groupParser.parser) as unknown as T;
}

function getFirstMatch(match: RegExpMatchArray, index: number[]): string | undefined {
  for (const i of index) {
    if (match[i]) { return match[i]; }
  }

  return;
}
