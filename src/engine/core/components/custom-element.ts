import {
  Field,
  RenderResult,
} from './models.js';
import {
  getWatchFields,
  setWatchField,
} from './utils.js';

export abstract class CustomElement<T extends CustomElement<T>> extends HTMLElement {

  public constructor() {
    super();
  }

  /** Render element content */
  abstract render(): RenderResult | Promise<RenderResult>;

  public connectedCallback(): void {
    this.triggerRender();
  }

  public static get observedAttributes(): string[] {
    return [...getWatchFields(this)];
  }

  public attributeChangedCallback(name: Field<T>, oldValue: string, newValue: string): void {
    console.warn(`Attribute ${name} changed from ${oldValue} to ${newValue}`);
    if (oldValue === newValue) return;
    setWatchField(this as unknown as T, name, newValue);
  }

  private triggerRender(): void {
    const result = this.render();
    if (result instanceof Promise) {
      this.triggerRenderAsync(result);
    } else {
      this.applyRender(result);
    }
  }

  private async triggerRenderAsync(render: Promise<RenderResult>): Promise<void> {
    const res = await render;
    this.applyRender(res);
  }

  private applyRender(render: RenderResult): void {
    if (!this.isConnected) return;
    const res = Array.isArray(render) ? render : [render];
    this.append(...res);
  }
}
