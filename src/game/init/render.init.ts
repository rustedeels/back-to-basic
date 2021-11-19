import { ViewRenderService } from '/engine/core/composition/index.js';
import {
  AppModule,
  InitPriority,
  Inject,
  LoggerService,
} from '/engine/core/index.js';
import { PlatformService } from '/engine/platform/platform.service.js';

export class RenderInit implements AppModule {
  public static Priority = InitPriority.System + 1;

  @Inject()
  private _platform!: PlatformService;
  @Inject()
  private _viewRender!: ViewRenderService;
  @Inject()
  private _logger!: LoggerService;

  public init(): void {
    try {
      const render = this._platform.viewRender;
      this._viewRender.init(render);
      this._logger.engine('View render initialized');
    } catch (e) {
      this._logger.error('Error loading view engine:', String(e));
    }
  }
}
