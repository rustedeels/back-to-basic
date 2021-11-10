import { DebounceAction } from '/engine/helpers/debounce-action.js';

import {
  getAttributeNames,
  triggerAttrChange,
} from './attr.utils.js';
import {
  AttrName,
  RenderResult,
} from './models.js';

export abstract class CustomElement<T extends CustomElement<T>> extends HTMLElement {

  private readonly _debounceRender: DebounceAction;

  public constructor() {
    super();
    this._debounceRender = new DebounceAction(50, () => this.triggerRender());
  }

  abstract render(): RenderResult | Promise<RenderResult>;

  public static get observedAttributes(): string[] {
    return [...getAttributeNames(this.prototype.constructor)];
  }

  public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) return;
    triggerAttrChange(this, name as AttrName<this>, oldValue, newValue);
    this._debounceRender.invoke();
  }

  public connectedCallback(): void {
    this._debounceRender.invoke();
  }

  public async triggerRender(): Promise<void> {
    console.log('triggerRender');
    const render = this.render();
    let result = render instanceof Promise ? await render : render;
    result = Array.isArray(result) ? result : [result];
    if (!this.isConnected) return;

    // Clear previous content
    while (this.firstChild) { this.removeChild(this.firstChild); }

    this.append(...result);
  }

}
