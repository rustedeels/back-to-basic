import {
  IRenderItem,
  IViewRender,
} from '/engine/core/composition/index.js';

export class DOMRender implements IViewRender {

  public render(item: IRenderItem): Promise<void> {
    const appRoot = document.getElementById('app');

    if (!appRoot) { throw new Error('DOMRender: app root not found'); }
    this.clearChilds(appRoot);

    const element = document.createElement(item.tag);

    for (const [key, value] of Object.entries(item.attributes ?? {})) {
      element.setAttribute(key, value);
    }

    for (const cls of item.classNames ?? []) {
      element.classList.add(cls);
    }

    return Promise.resolve();
  }

  private clearChilds(parent: HTMLElement): void {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }

}
