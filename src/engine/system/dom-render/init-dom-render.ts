import { initPlatformService } from '/engine/platform/platform.init.js';

import { DOMRender } from './dom.render.js';

export function initDOMRender() {
  initPlatformService('viewRender', new DOMRender());
}
