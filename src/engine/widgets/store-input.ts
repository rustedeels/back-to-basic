import { RenderResult } from '../core/composition/components/models.js';
import {
  Attribute,
  CustomElement,
  EvalParser,
  WebComponent,
} from '../core/composition/index.js';
import {
  ensureStore,
  Store,
} from '../core/store/index.js';
import { DebounceAction } from '../helpers/debounce-action.js';
import { isObject } from '../helpers/guards.js';

@WebComponent('sc-store-input')
export class StoreInput<T extends object, K extends keyof T> extends CustomElement<StoreInput<T, K>> {

  private readonly _debounceSetValue: DebounceAction;
  private readonly _debounceViewRender: DebounceAction;

  @Attribute('type', { default: 'string' })
  declare type: 'string' | 'number';

  @Attribute('path', { required: true })
  declare path: string | null;

  @Attribute('key', { required: true })
  declare key: K | null;

  @Attribute('initValue', { default: '{}', type: EvalParser })
  declare initValue: T;

  @Attribute('placeholder', { default: '' })
  declare placeholder: string;

  @Attribute('disabled', { default: false, type: Boolean })
  declare disabled: boolean;

  @Attribute('label', { default: '' })
  declare label: string;

  public constructor() {
    super();
    this._debounceSetValue = new DebounceAction(0, v => this.setStoreValue(v));
    this._debounceViewRender = new DebounceAction(100, () => this.triggerRender());
  }

  public render(): RenderResult | Promise<RenderResult> {
    const container = document.createElement('div');
    container.classList.add('sc-child');

    const input = document.createElement('input');
    input.classList.add('sc-child');
    input.type = this.type;
    input.placeholder = this.placeholder;
    input.value = String(this.getStoreValue() ?? '');
    input.disabled = this.disabled;
    input.addEventListener('blur', () => this._debounceSetValue.invoke(input.value));

    const label = document.createElement('label');
    label.classList.add('sc-child');
    label.innerText = this.label;

    container.appendChild(label);
    container.appendChild(input);

    return container;
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    if (this.path && this.key && isObject<T>(this.initValue)) {
      ensureStore(this.path, this.initValue, this.key as never);
    }
    const store = this.loadStore();
    if (!store || !this.key) { return; }
    store.prop(this.key, () => this._debounceViewRender.invoke());
  }

  private getStoreValue(): string | number {
    const store = this.loadStore();
    if (store && this.key) {
      const value = store.state[this.key];
      if (this.type === 'string') return String(value ?? '');
      else return Number(value ?? 0);
    }

    if (this.type === 'string') return '';
    else return 0;
  }

  private setStoreValue(value: string | number | undefined): void {
    const store = this.loadStore();
    if (store && this.key) {
      if (this.type === 'string') store.update({ [this.key]: String(value) } as unknown as Partial<T>);
      else store.update({ [this.key]: Number(value) } as unknown as Partial<T>);
    }
  }

  private loadStore(): Store<T> | undefined {
    if (this.path) {
      return ensureStore(this.path);
    }

    return undefined;
  }

}
