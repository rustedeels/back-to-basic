import {
  appContainer,
  initHandler,
  InitPriority,
  LoggerService,
} from '../core/index.js';
import {
  IPlatform,
  PlatformService,
} from './platform.service.js';

export function initPlatformService<K extends keyof IPlatform>(name: K, impl: IPlatform[K]): void {
  initHandler.addModule({
    priority: InitPriority.System,
    init: () => {
      const platform = appContainer.resolve(PlatformService);
      const logger = appContainer.resolve(LoggerService);

      platform.initialize({ [name]: impl });

      logger.engine(`Initialized platform service: ${name}`);
    }
  });
}
