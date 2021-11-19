import { appContainer } from '../dependency-container/index.js';
import {
  initHandler,
  InitPriority,
} from '../init-handler/index.js';
import { LoggerService } from '../logger/index.js';
import { AppState } from './models.js';
import { Store } from './store.js';

export function initAppStore(state: AppState): void {
  initHandler.addModule({
    priority: InitPriority.Core,
    deps: [{
      life: 'singleton',
      target: Store,
      value: new Store(state)
    }],
    init: () => {
      const logger = appContainer.resolve(LoggerService);
      logger.engine('Store initialized');
    }
  });
}
