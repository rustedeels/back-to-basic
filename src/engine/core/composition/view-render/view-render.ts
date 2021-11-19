import { StateMachine } from '/engine/helpers/state-machine.js';

import {
  Inject,
  Injectable,
} from '../../dependency-container/index.js';
import { EventsHandler } from '../../index.js';
import { LoggerService } from '../../logger/index.js';
import {
  ID_INITIAL_RENDER_ITEM,
  INITIAL_RENDER_ITEM,
  IRenderItem,
  IViewRender,
  RenderEvents,
} from './model.js';

@Injectable()
export class ViewRenderService {
  private readonly _renderItems: Map<string, IRenderItem>;
  private readonly _state = StateMachine.forString(ID_INITIAL_RENDER_ITEM);
  private _renderEngine?: IViewRender;
  private _hasFailed = false;

  @Inject()
  private _logger!: LoggerService;

  @Inject()
  public readonly events!: EventsHandler<RenderEvents>;

  public get currentItem(): IRenderItem {
    const item = this._renderItems.get(this._state.current);
    if (!item) {
      this._hasFailed = true;
      this._logger.error(`No render item found for state ${this._state.current}`);
      throw new Error(`No render item found for state ${this._state.current}`);
    }
    return item;
  }

  public get hasFailed(): boolean {
    return this._hasFailed;
  }

  public constructor() {
    this._renderItems = new Map();
    this._renderItems.set(ID_INITIAL_RENDER_ITEM, INITIAL_RENDER_ITEM);
  }

  /** Start view render */
  public async init(viewRender: IViewRender): Promise<void> {
    this._renderEngine = viewRender;
    this.subscribeToStateChange();
  }

  /** Return to initial state  */
  public reset(): void {
    this._hasFailed = false;
    this._state.reset();
  }

  /** Add render items, render is trigger if an item has the same id that the current one */
  public addItem(...item: IRenderItem[]): Promise<void> {
    let needRender = false;
    const id = this._state.current;
    for (const i of item) {
      this._renderItems.set(i.id, i);
      needRender = needRender || i.id === id;
    }

    if (!this._renderEngine)
      return Promise.resolve();

    if (needRender) {
      return this.triggerRender();
    }

    return Promise.resolve();
  }

  /** Set the current view, if new, the render process starts */
  public activateView(id: string): void {
    this.events.emit('activateView', id);
  }

  /** Render the last one */
  public renderLastView(): Promise<void> {
    return this.events.emit('renderLast');
  }

  /** Trigger render of current item */
  public triggerRender(): Promise<void> {
    return this.render(this.currentItem);
  }

  /** Set the render engine */
  public setViewRender(viewRender: IViewRender): void {
    this._renderEngine = viewRender;
  }

  private subscribeToStateChange(): void {
    this.events.get('addRender')
      .subscribe((items: IRenderItem[]) => this.addItem(...items));
    this.events.get('refresh')
      .subscribe(() => this.triggerRender());
    this.events.get('activateView')
      .subscribe((id: string) => this._state.next(id));
    this.events.get('renderLast')
      .subscribe(() => this._state.prev());
    this._state.state.subscribe(() => this.triggerRender());
  }

  /** Start rendering a item */
  private async render(item: IRenderItem): Promise<void> {
    this._logger.engine(`Rendering ${item.id}`);

    await this.events.emit('renderStarting', item.id);

    this.validateRenderEngine(this._renderEngine);
    try {
      await this._renderEngine.render(item);
      this._hasFailed = false;
    } catch (e) {
      this._logger.error(`Error while rendering ${item.id}`, e);
      this._hasFailed = true;
      throw e;
    }

    await this.events.emit('renderCompleted', item.id);
  }

  private validateRenderEngine(engine: IViewRender | undefined): asserts engine is IViewRender {
    if (!engine) {
      this._hasFailed = true;
      throw new Error('Render engine is not initialized');
    }
  }
}
