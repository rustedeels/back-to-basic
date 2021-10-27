import { assertInstanceOf } from '/engine/helpers/guards.js';

import {
  addWatchField,
  ensureWatchFields,
} from './utils.js';

export function WebComponent(selector: string): (target: CustomElementConstructor) => void {
  return (target: CustomElementConstructor) => {
    assertInstanceOf(target.prototype, HTMLElement);
    ensureWatchFields(target);
    customElements.define(selector, target);
  };
}

export function Attribute(name?: string): (target: Object, propertyKey: string) => void {
  return (target: Object, propertyKey: string) => {
    assertInstanceOf(target, HTMLElement);
    const key = (name || propertyKey) as keyof HTMLElement;
    addWatchField(target, key);
  };
}
