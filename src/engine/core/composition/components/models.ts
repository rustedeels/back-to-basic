import { Type } from '/engine/helpers/util-types.js';

/** Key for metadata that constains the list of properties to listen for changes */
export const METADATA_OBS_ATTRIBUTES = Symbol('__#metadata_observed_attributes');

/** Key for metadata that contains selector */
export const WEB_COMPONENT_SELECTOR = Symbol('__#metadata_selector');

/** Result of an render operation */
export type RenderResult = (string | Node)[] | Node | string;

/** Decorator target */
export type Target<T> = Type<T> | T;

/** Attribute name */
export type AttrName<T> = Extract<keyof T, string>;

/** Parser for an attribute */
export interface AttrParser<T> {
  (value: string | null): T | null;
}

/** Attribute options */
export interface AttrOptions<T, V> {
  name: AttrName<T>;
  type: AttrParser<V>;
  required: boolean;
  default: V | null;
  watchName?: string;
}

export type ArgAttrOption<T, V> = Partial<Omit<AttrOptions<T, V>, 'name'>>;
