import '/libs/Reflect.js';

import {
  AttrName,
  AttrOptions,
  AttrParser,
  METADATA_OBS_ATTRIBUTES,
  Target,
} from './models.js';

/** Get list of watched attributes */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getWatchAttributes<T>(target: Target<T>): Map<string, AttrOptions<T, any>> {
  const proto = typeof target === 'function' ? target.prototype : target;
  let map = Reflect.getMetadata(METADATA_OBS_ATTRIBUTES, proto);
  if (!map) { Reflect.defineMetadata(METADATA_OBS_ATTRIBUTES, map = new Map(), proto); }
  return map;
}

/** Add a new attribute to watch list */
export function addWatchAttribute<T>(target: Target<T>, attr: AttrName<T>): AttrOptions<T, unknown>
export function addWatchAttribute<T, V>(target: Target<T>, attr: AttrName<T>, options?: Partial<AttrOptions<T, V>>): AttrOptions<T, V>
export function addWatchAttribute<T, V>(target: Target<T>, attr: AttrName<T>, options?: Partial<AttrOptions<T, V>>): AttrOptions<T, V> {
  const proto = typeof target === 'function' ? target.prototype : target;

  const attrOpt = getAttribute(target, attr);
  if (attrOpt) { return attrOpt as AttrOptions<T, V>; }

  const key = attr in proto ? attr : `x-${attr}`;
  const opt: AttrOptions<T, V> = {
    name: key as AttrName<T>,
    type: options?.type ?? String as unknown as AttrParser<V>,
    default: options?.default ?? null,
    required: options?.required ?? false,
  };
  getWatchAttributes(target).set(attr, opt);
  return opt;
}

/** Return list of watched attributes */
export function getAttributeNames<T>(target: Target<T>): Set<string> {
  const attrs = getWatchAttributes(target);
  const set = new Set<string>();
  for (const [name, opt] of attrs) {
    set.add(name);
    set.add(opt.name);
  }
  return set;
}

/** Get a defined attribute */
export function getAttribute<T, V>(target: Target<T>, attr: AttrName<T>): AttrOptions<T, V> | undefined {
  return getWatchAttributes(target).get(attr);
}

/** Define attribute binds */
export function defineAttributeProperty<T>(target: Target<T>, attr: AttrName<T>, prop: string): void {
  const proto = (typeof target === 'function' ? target.prototype : target);
  const opt = getAttribute(target, attr);
  if (!opt) { return; }

  Object.defineProperty(proto, prop, {
    get() { return opt.type(this.getAttribute(attr)); },
    set(value) { this.setAttribute(attr, value === null ? null : String(value)); },
  });

}

export function triggerAttrChange<T>(target: Target<T>, attr: AttrName<T>, oldValue: string | null, newValue: string | null): void {
  const proto = (typeof target === 'function' ? target.prototype : target);
  const opt = getAttribute(target, attr);
  if (!opt?.watchName) { return; }

  const old = oldValue === null ? null : opt.type(oldValue);
  const newVal = newValue === null ? null : opt.type(newValue);
  if (old === newVal) { return; }

  const callBack = proto[opt.watchName] as (oldValue: unknown, newValue: unknown) => void;
  if (callBack) { callBack.call(proto, old, newVal); }
}
