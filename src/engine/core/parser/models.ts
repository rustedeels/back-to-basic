/** Function to parse a value */
export type ParseFunction<T> =
  T extends string ? ((str: string, prefix: string) => T) | undefined
  : (str: string, prefix: string) => T

export type Parser<T> = ParseFunction<T>
  | (T extends object
    ? (
      T extends (infer U)[]
      ? (
        U extends object
        ? EntityParser<U> : never
      )
      : EntityParser<T>)
    : never);

/** Model to parse a group match */
export interface GroupParser<T> {
  /** Group index, will return first with value */
  index: number[];
  /** Value to use if no match is found */
  default?: string;
  /** Parse logic */
  parser: Parser<T>;
}

/** Parser model for an entity */
export interface EntityParser<T extends object> {
  /** Expression to match entity in source */
  matchExp: RegExp;
  /** Entity properties parsers */
  matchMap: EntityParserMap<T>;
  /** Apply action before parsing source */
  beforeParse?: (prefix: string, source: string) => [prefix: string, source: string];
  /** Apply action after parsing source */
  afterParse?: (prefix: string, match: RegExpMatchArray, result: T) => T;
}

/** Property parse map for an entity */
export type EntityParserMap<T extends object> = {
  [key in keyof T]?: GroupParser<T[key]> | (T[key] extends string ? number : never);
}

/** Parser for a file */
export interface FileParser<T extends object> {
  /** Treat first line as prefix */
  usePrefix: boolean;
  /** Parser to use */
  entityParser: EntityParser<T>;
}
