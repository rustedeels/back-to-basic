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

@WebComponent('sc-event-button')
export class EventButton extends CustomElement<EventButton> {

  @Inject()
  private _eventHandler!: EventsHandler<{}>;

  @Inject()
  private _logger!: LoggerService;

  @Attribute('text', { default: 'Button' })
  declare text: string;

  @Attribute('event', { required: true })
  declare event: string;

  @Attribute('disabled', { default: false, type: Boolean })
  declare disabled: boolean;

  public constructor() { super(); }

  public render(): RenderResult | Promise<RenderResult> {
    const btn = document.createElement('button');
    btn.classList.add('sc-child');
    btn.innerText = this.text;
    btn.disabled = this.disabled;
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
