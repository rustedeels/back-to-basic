import {
  ID_INITIAL_RENDER_ITEM,
  ViewRenderService,
} from '/engine/core/composition/index.js';
import {
  AppModule,
  initHandler,
  InitPriority,
  Inject,
  LoggerService,
} from '/engine/core/index.js';

import {
  MAIN_MENU_TOKEN,
  MainMenuSettings,
} from './models.js';

export function initMainMenu(settings: MainMenuSettings): void {
  initHandler.addModule({
    priority: InitPriority.Render,
    deps: [{
      life: 'value',
      key: MAIN_MENU_TOKEN,
      value: settings
    }],
    mods: [InitMainMenuModule]
  });
}

class InitMainMenuModule implements AppModule {

  @Inject()
  private _logger!: LoggerService;

  @Inject()
  private _viewRender!: ViewRenderService;

  public init(): void {

    this._viewRender.addItem({
      id: ID_INITIAL_RENDER_ITEM,
      tag: 'sc-main-menu'
    });

    this._logger.engine('MainMenu initialized');
  }

}
