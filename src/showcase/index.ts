import { IShowcase } from './models.js';
import { renderShowcase } from './render.js';

// eslint-disable-next-line
const showcases = new Map<string, IShowcase<any>>();

/** Add a new component to showcase */
export function buildShowcase<T extends object>(showcase: IShowcase<T>) {
  if (showcases.has(showcase.name)) {
    console.warn(`Showcase ${showcase.name} already exists`);
  }
  showcases.set(showcase.name, showcase);
}

/** Render showcases in current app */
export function renderShowcases(id: string) {
  renderShowcase(showcases, id);
}

export * from './models.js';
