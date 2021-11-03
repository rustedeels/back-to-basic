import { RenderResult } from '../core/composition/components/models.js';
import {
  Attribute,
  CustomElement,
  WebComponent,
} from '../core/composition/index.js';
import {
  EventsHandler,
  Inject,
  LoggerService,
} from '../core/index.js';

@WebComponent('event-button')
export class EventButton extends CustomElement<EventButton> {

  @Inject()
  private _eventHandler!: EventsHandler<{}>;

  @Inject()
  private _logger!: LoggerService;

  @Attribute('text', { default: 'Button' })
  declare text: string;

  @Attribute('event', { required: true })
  declare event: string;

  public constructor() { super(); }

  public render(): RenderResult | Promise<RenderResult> {
    const btn = document.createElement('button');
    btn.innerText = this.text;
    btn.addEventListener('click', () => this.triggerEvent());
    return btn;
  }

  private triggerEvent(): void {
    if (!this.event) {
      this._logger.warning('Event name is not defined for button: ' + this.text);
      return;
    }
    this._eventHandler.emit(this.event as never);
  }
}
