import {
  initHandler,
  InitPriority,
  LoggerService,
} from './index.js';

initHandler.addModule({
  deps: [LoggerService],
  priority: InitPriority.Core,
});
