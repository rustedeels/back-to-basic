import {
  initHandler,
  InitPriority,
} from './index.js';

initHandler.addModule({
  priority: InitPriority.Core,
});
