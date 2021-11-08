import { WEB_COMPONENT_SELECTOR } from '/engine/core/composition/components/models.js';
import { Type } from '/engine/helpers/util-types.js';

import { buildFromPartialShowcase } from './builder.js';
import {
  IPartialShowcase,
  IShowcase,
} from './models.js';
import { renderShowcase } from './render.js';

// eslint-disable-next-line
const showcases = new Map<string, IShowcase<any>>();

/** Add a new component to showcase */
export function buildShowcase<T extends object>(showcase: IPartialShowcase<T>, target?: Type<T>) {
  const toRender = buildFromPartialShowcase(showcase, target);

  if (target) {
    const selector = Reflect.getMetadata(WEB_COMPONENT_SELECTOR, target);
    if (selector) { toRender.htmlTag = selector; }
    toRender.name = target.name;
  }

  if (showcases.has(toRender.name)) {
    console.warn(`Showcase ${toRender.name} already exists`);
  }
  showcases.set(toRender.name, toRender);
}

/** Render showcases in current app */
export function renderShowcases(id: string) {
  renderShowcase(showcases, id);
}

export * from './models.js';
