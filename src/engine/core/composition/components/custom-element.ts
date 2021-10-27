import {
  getAttributeNames,
  triggerAttrChange,
} from './attr.utils.js';
import {
  AttrName,
  RenderResult,
} from './models.js';

export abstract class CustomElement<T extends CustomElement<T>> extends HTMLElement {

  public constructor() {
    super();
  }

  abstract render(): RenderResult | Promise<RenderResult>;

  public static get observedAttributes(): string[] {
    return [...getAttributeNames(this.prototype.constructor)];
  }

  public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    console.log(`Attribute changed: ${name}`);
    if (oldValue === newValue) return;
    triggerAttrChange(this, name as AttrName<this>, oldValue, newValue);
  }

  public connectedCallback(): void {
    this.triggerRender();
  }

  public async triggerRender(): Promise<void> {
    const render = this.render();
    let result = render instanceof Promise ? await render : render;
    result = Array.isArray(result) ? result : [result];
    if (!this.isConnected) return;

    // Clear previous content
    while (this.firstChild) { this.removeChild(this.firstChild); }

    this.append(...result);
  }

}
