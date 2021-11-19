import {
  initAppStore,
  initHandler,
} from '/engine/core/index.js';
import { initDOMRender } from '/engine/system/dom-render/index.js';
import { initMainMenu } from '/engine/system/main-menu/index.js';

import { RenderInit } from './render.init.js';

export async function initGameEngine(): Promise<void> {
  initAppStore({
    lastUpdate: '1970-01-01',
    appName: 'WorldCitizen',
    version: '0.0.1',
    developer: 'RustedEels'
  });

  initDOMRender();

  initHandler.addModule({
    priority: RenderInit.Priority,
    mods: [RenderInit]
  });

  initMainMenu({
    developer: 'RustedEels',
    developerLogo: '/assets/logo.png',
    logo: '/assets/icon.png',
    title: 'World Citizen',
    options: [{
      name: 'Start Game',
      event: 'start-game',
    }, {
      name: 'Options',
      event: 'options',
    }, {
      name: 'Exit',
      event: 'exit',
    }]
  });

  await initHandler.init();
}
