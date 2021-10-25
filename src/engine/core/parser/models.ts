/** Parser for a single entity */
export interface ValuePropertyParser<T> {
  index: number[];
  default?: string;
  parse: (value: string, prefix: string) => T;
}

/** Parser for multiple values */
export interface ArrayPropertyParser<T> {
  index: number[];
  default?: string;
  parse: (value: string, prefix: string) => T[];
  multi: true;
}

/** Parser for a single property */
export type PropertyParser<T> = T extends (infer U)[] ? ArrayPropertyParser<U> | number : ValuePropertyParser<T> | number;

export interface BaseParser<T extends object> {
  /** Expression to match entity */
  matchExp: RegExp;
  /** Parser for each property */
  map: EntityParserMap<T>;
  /** Apply action before parsing source */
  beforeParse?: (prefix: string, source: string) => [prefix: string, source: string];
  /** Apply action after parsing source */
  afterParse?: (prefix: string, source: string, result: T) => T;
}

/** Parser for a single entity */
export interface SingleParser<T extends object> extends BaseParser<T> {
  /** Child entities */
  childs?: {
    [key in Extract<keyof T, string>]?: ChildParser<T, key>;
  }
}

/** Parse multiple values from one soure */
export interface MultiParser<T extends object> extends BaseParser<T> {
  /** Set as multiple values parser */
  multi: true;
}

/** Parser for childs */
export type ChildParser<T extends object, K extends Extract<keyof T, string>> =
  T[K] extends (infer U)[] ?
  U extends object ?
  MultiParser<U> : never
  : T[K] extends object ?
  SingleParser<T[K]> : never;

export type EntityParser<T extends object> = SingleParser<T> | MultiParser<T>;

export type EntityParserMap<T extends object> = {
  [K in Extract<keyof T, string>]?: PropertyParser<T[K]>;
}

/** Document parser */
export interface ISingleNodeParser<T extends object> {
  /** Define if prefix is extracted */
  usePrefix: boolean;
  /** Parser for document source */
  parser: EntityParser<T>;
}

/** Document parser */
export interface IMultiNodeParser<T extends object> extends ISingleNodeParser<T> {
  /** Expression to split source */
  splitExp: RegExp;
}

/** Document parser */
export type DocumentParser<T extends object> = ISingleNodeParser<T> | IMultiNodeParser<T>;
