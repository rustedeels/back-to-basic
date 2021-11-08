import '/libs/Reflect.js';

import { assertInstanceOf } from '/engine/helpers/guards.js';

import {
  addWatchAttribute,
  defineAttributeProperty,
  getAttribute,
} from './attr.utils.js';
import {
  ArgAttrOption,
  WEB_COMPONENT_SELECTOR,
} from './models.js';

export function WebComponent(selector: string): (target: CustomElementConstructor) => void {
  return (target: CustomElementConstructor) => {
    Reflect.defineMetadata(WEB_COMPONENT_SELECTOR, selector, target);
    assertInstanceOf(target.prototype, HTMLElement);
    customElements.define(selector, target);
  };
}

export function Attribute<T, V>(name?: string, options?: ArgAttrOption<T, V>): (target: Object, propertyKey: string) => void
export function Attribute(name?: string): (target: Object, propertyKey: string) => void;
export function Attribute(name?: string, options?: ArgAttrOption<unknown, unknown>)
  : (target: Object, propertyKey: string) => void {
  return (target: Object, propertyKey: string) => {
    assertInstanceOf(target, HTMLElement);
    const key = (name || propertyKey) as keyof HTMLElement;
    addWatchAttribute(target, key, options);
    defineAttributeProperty(target, key, propertyKey);
  };
}

export function Watch(name: string): (target: Object, propertyKey: string) => void {
  return (target: Object, propertyKey: string) => {
    const opt = getAttribute(target, name as keyof object);
    if (opt) { opt.watchName = propertyKey; }
  };
}
